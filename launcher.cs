using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Diagnostics;
using System.Collections.Generic;
using System.Windows.Forms;

namespace SnapRAG
{
    static class Program
    {
        private static HttpListener listener;
        private static string distPath;
        private static volatile bool isRunning = true;
        private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { ".html", "text/html; charset=utf-8" },
            { ".htm", "text/html; charset=utf-8" },
            { ".js", "application/javascript; charset=utf-8" },
            { ".mjs", "application/javascript; charset=utf-8" },
            { ".css", "text/css; charset=utf-8" },
            { ".json", "application/json; charset=utf-8" },
            { ".svg", "image/svg+xml" },
            { ".png", "image/png" },
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".gif", "image/gif" },
            { ".ico", "image/x-icon" },
            { ".webp", "image/webp" },
            { ".woff", "font/woff" },
            { ".woff2", "font/woff2" },
            { ".ttf", "font/ttf" },
            { ".wasm", "application/wasm" },
            { ".pdf", "application/pdf" },
            { ".txt", "text/plain; charset=utf-8" }
        };

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // 1. Locate dist directory with comprehensive fallback paths
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            
            string[] searchPaths = new string[]
            {
                Path.Combine(baseDir, "dist"),
                Path.Combine(Directory.GetCurrentDirectory(), "dist"),
                @"c:\Users\Harish\OneDrive\Documents\hackathon\Ai buildathon\dist",
                Path.Combine(userProfile, "OneDrive", "Documents", "hackathon", "Ai buildathon", "dist"),
                @"c:\Users\Harish\OneDrive\Desktop\Ai buildathon\dist",
                Path.Combine(userProfile, "OneDrive", "Desktop", "Ai buildathon", "dist"),
                Path.Combine(userProfile, "Desktop", "Ai buildathon", "dist")
            };

            foreach (string candidate in searchPaths)
            {
                if (Directory.Exists(candidate) && File.Exists(Path.Combine(candidate, "index.html")))
                {
                    distPath = candidate;
                    break;
                }
            }

            if (distPath == null)
            {
                // Seamlessly launch the permanent cloud web app in dedicated native desktop app mode!
                Process cloudProc = LaunchBrowserApp("https://snaprag-edge.web.app");
                if (cloudProc != null)
                {
                    cloudProc.WaitForExit();
                }
                return;
            }

            // 2. Obtain a free local port
            int port = GetAvailablePort(5180);
            string prefix = "http://127.0.0.1:" + port + "/";

            // 3. Start local HTTP server
            try
            {
                listener = new HttpListener();
                listener.Prefixes.Add(prefix);
                listener.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Failed to start local application server:\n" + ex.Message,
                    "SnapRAG Error",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            // Start background worker for incoming requests
            Thread serverThread = new Thread(ListenLoop);
            serverThread.IsBackground = true;
            serverThread.Start();

            // 4. Launch in isolated App Mode
            Process browserProc = LaunchBrowserApp(prefix);

            if (browserProc != null)
            {
                // Wait until the user closes the app window
                browserProc.WaitForExit();
            }
            else
            {
                // Fallback if browser process handle couldn't be tracked directly
                MessageBox.Show(
                    "SnapRAG is running at " + prefix + "\nClick OK when you are done to exit.",
                    "SnapRAG Desktop",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
            }

            // 5. Clean shutdown
            isRunning = false;
            try
            {
                listener.Stop();
                listener.Close();
            }
            catch { }
        }

        private static int GetAvailablePort(int startingPort)
        {
            for (int p = startingPort; p < startingPort + 100; p++)
            {
                try
                {
                    TcpListener tcp = new TcpListener(IPAddress.Loopback, p);
                    tcp.Start();
                    tcp.Stop();
                    return p;
                }
                catch
                {
                    // Port in use, try next
                }
            }
            // Fallback: pick any available port
            TcpListener anyTcp = new TcpListener(IPAddress.Loopback, 0);
            anyTcp.Start();
            int port = ((IPEndPoint)anyTcp.LocalEndpoint).Port;
            anyTcp.Stop();
            return port;
        }

        private static void ListenLoop()
        {
            while (isRunning && listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = listener.GetContext();
                    ThreadPool.QueueUserWorkItem(ProcessRequest, context);
                }
                catch (HttpListenerException)
                {
                    // Listener stopped
                    break;
                }
                catch (Exception)
                {
                    if (!isRunning) break;
                }
            }
        }

        private static void ProcessRequest(object state)
        {
            HttpListenerContext context = (HttpListenerContext)state;
            try
            {
                string urlPath = context.Request.Url.AbsolutePath;
                if (string.IsNullOrEmpty(urlPath) || urlPath == "/")
                {
                    urlPath = "/index.html";
                }

                urlPath = Uri.UnescapeDataString(urlPath);
                string relPath = urlPath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
                string filePath = Path.Combine(distPath, relPath);

                // Prevent directory traversal
                string fullPath = Path.GetFullPath(filePath);
                string fullDist = Path.GetFullPath(distPath);
                if (!fullPath.StartsWith(fullDist, StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    context.Response.Close();
                    return;
                }

                // If file does not exist, fallback to index.html for SPA routing
                if (!File.Exists(fullPath))
                {
                    string ext = Path.GetExtension(fullPath);
                    if (string.IsNullOrEmpty(ext) || ext.Equals(".html", StringComparison.OrdinalIgnoreCase))
                    {
                        fullPath = Path.Combine(distPath, "index.html");
                    }
                    else
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                        context.Response.Close();
                        return;
                    }
                }

                if (!File.Exists(fullPath))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    context.Response.Close();
                    return;
                }

                byte[] fileBytes = File.ReadAllBytes(fullPath);
                string extension = Path.GetExtension(fullPath);
                string contentType;
                if (!MimeTypes.TryGetValue(extension, out contentType))
                {
                    contentType = "application/octet-stream";
                }

                context.Response.ContentType = contentType;
                context.Response.ContentLength64 = fileBytes.Length;
                context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                context.Response.AddHeader("Cache-Control", "no-cache");
                context.Response.StatusCode = (int)HttpStatusCode.OK;

                context.Response.OutputStream.Write(fileBytes, 0, fileBytes.Length);
                context.Response.OutputStream.Close();
            }
            catch
            {
                try
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.Close();
                }
                catch { }
            }
        }

        private static Process LaunchBrowserApp(string appUrl)
        {
            string profileDir = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "SnapRAG_AppData",
                "AppProfile"
            );

            try
            {
                if (!Directory.Exists(profileDir))
                {
                    Directory.CreateDirectory(profileDir);
                }
            }
            catch { }

            // Common browser paths
            string[] candidates = new string[]
            {
                @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
            };

            string browserPath = null;
            foreach (string candidate in candidates)
            {
                if (File.Exists(candidate))
                {
                    browserPath = candidate;
                    break;
                }
            }

            string appArgs = string.Format(
                "--app=\"{0}\" --window-size=1400,900 --window-position=40,30 --user-data-dir=\"{1}\" --disable-features=Translate,OptimizationHints --no-first-run --no-default-browser-check",
                appUrl,
                profileDir
            );

            if (!string.IsNullOrEmpty(browserPath))
            {
                try
                {
                    ProcessStartInfo psi = new ProcessStartInfo();
                    psi.FileName = browserPath;
                    psi.Arguments = appArgs;
                    psi.UseShellExecute = false;
                    return Process.Start(psi);
                }
                catch
                {
                    // If fail, fallback
                }
            }

            // Fallback: open default browser
            try
            {
                return Process.Start(new ProcessStartInfo(appUrl) { UseShellExecute = true });
            }
            catch
            {
                return null;
            }
        }
    }
}
