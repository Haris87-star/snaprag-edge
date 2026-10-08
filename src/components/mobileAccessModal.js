/**
 * SnapRAG - Mobile Access & Live QR Code Modal
 * Enables hackathon judges and users to instantly access SnapRAG from iOS / Android mobile devices
 * via permanent Google Cloud Edge CDN URL or local Wi-Fi.
 */

const PERMANENT_PRODUCTION_URL = 'https://snaprag-edge.web.app';
const LOCAL_WIFI_URL = 'http://10.155.178.161:5173/';

// Crisp SVG QR code for https://snaprag-edge.web.app (220px, crispEdges, 0 latency)
const QR_SVG_CODE = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 31 31" shape-rendering="crispEdges" style="border-radius: 8px;"><path fill="#ffffff" d="M0 0h31v31H0z"/><path stroke="#000000" d="M1 1.5h7m1 0h1m2 0h5m2 0h3m1 0h7M1 2.5h1m5 0h1m1 0h2m1 0h1m1 0h1m2 0h3m3 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m2 0h4m3 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2m1 0h1m2 0h1m1 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m3 0h3m1 0h1m1 0h2m1 0h1m2 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m4 0h1m1 0h1m1 0h3m1 0h1m2 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h3m1 0h1m2 0h3m1 0h1M1 9.5h1m1 0h2m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m4 0h1m2 0h1m1 0h2M1 10.5h2m1 0h1m3 0h2m4 0h3m1 0h3m2 0h3m3 0h1M1 11.5h1m2 0h2m1 0h3m2 0h1m1 0h1m2 0h1m1 0h1m4 0h1m2 0h2M6 12.5h1m1 0h1m8 0h1m2 0h2m7 0h1M1 13.5h1m3 0h4m1 0h2m3 0h2m1 0h1m5 0h1m1 0h2M4 14.5h2m2 0h1m1 0h2m1 0h1m1 0h1m1 0h2m1 0h1m2 0h1m3 0h3M2 15.5h2m1 0h5m2 0h1m1 0h1m1 0h2m2 0h2m1 0h2m2 0h3M1 16.5h2m1 0h1m1 0h1m1 0h2m1 0h2m2 0h1m1 0h1m2 0h2m3 0h1m2 0h1M3 17.5h1m3 0h1m1 0h3m3 0h3m1 0h1m1 0h2m1 0h3m1 0h1M3 18.5h1m1 0h1m2 0h1m1 0h3m2 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3M1 19.5h1m3 0h3m4 0h1m1 0h4m1 0h1m7 0h1M4 20.5h2m2 0h4m2 0h2m2 0h1m3 0h2m1 0h1m1 0h1M2 21.5h1m1 0h2m1 0h1m1 0h1m3 0h3m1 0h11M9 22.5h4m3 0h2m3 0h1m3 0h5M1 23.5h7m1 0h5m1 0h2m1 0h1m1 0h2m1 0h1m1 0h2m1 0h1M1 24.5h1m5 0h1m1 0h2m1 0h5m4 0h1m3 0h2m2 0h1M1 25.5h1m1 0h3m1 0h1m2 0h1m1 0h1m4 0h1m1 0h1m1 0h5m1 0h1m1 0h1M1 26.5h1m1 0h3m1 0h1m1 0h1m1 0h1m2 0h1m5 0h2m2 0h3m1 0h1M1 27.5h1m1 0h3m1 0h1m1 0h4m5 0h2m4 0h1m2 0h1m1 0h1M1 28.5h1m5 0h1m2 0h2m1 0h4m1 0h2m1 0h1m1 0h2m1 0h1m1 0h1M1 29.5h7m1 0h1m1 0h2m5 0h5m1 0h1m1 0h1m1 0h1"/></svg>`;

export function openMobileAccessModal() {
  const existing = document.getElementById('mobile-access-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'mobile-access-modal';
  modal.className = 'modal-overlay';
  modal.style.zIndex = '130';

  modal.innerHTML = `
    <div class="modal-card glassmorphic" style="max-width: 640px; border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);">
      <div class="modal-header" style="border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding: 18px 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.8rem; background: rgba(56, 189, 248, 0.15); width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(56, 189, 248, 0.3);">🌐</div>
          <div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;">
              Permanent Live URL & Mobile QR Access
            </h2>
            <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">
              Global Cloud Edge CDN · Zero Lag · 24/7 Access Anywhere · iOS Safari & Android Chrome
            </div>
          </div>
        </div>
        <button id="close-mobile-access-btn" class="modal-close" style="font-size: 1.6rem; color: #94a3b8; cursor: pointer;">&times;</button>
      </div>

      <div class="modal-body" style="padding: 22px 24px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- QR Code & Link Hero Section -->
        <div style="display: flex; gap: 20px; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 12px; padding: 18px; box-shadow: 0 10px 30px rgba(0, 242, 254, 0.1);">
          <div style="background: #fff; padding: 10px; border-radius: 10px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
            ${QR_SVG_CODE}
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">
                Permanent 24/7 Global URL
              </span>
            </div>
            <div style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;">
              Scan this QR code with any smartphone camera (iPhone or Android) or share the URL below. It is hosted on global edge CDN with zero downtime.
            </div>

            <!-- Primary Permanent Production Link -->
            <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <a href="${PERMANENT_PRODUCTION_URL}" target="_blank" rel="noopener noreferrer" id="primary-mobile-url" style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 700; color: #38bdf8; text-decoration: none; word-break: break-all;">
                ${PERMANENT_PRODUCTION_URL}
              </a>
              <div style="display: flex; gap: 6px;">
                <button id="copy-tunnel-link-btn" class="btn btn-secondary" style="font-size: 0.78rem; padding: 5px 12px; flex-shrink: 0; background: rgba(56, 189, 248, 0.15); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">
                  📋 Copy
                </button>
                <a href="${PERMANENT_PRODUCTION_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.78rem; padding: 5px 12px; text-decoration: none; flex-shrink: 0;">
                  ↗ Open
                </a>
              </div>
            </div>

            <!-- Global CDN Status Info -->
            <div style="display: flex; gap: 12px; font-size: 0.74rem; color: #64748b;">
              <span>⚡ Google Edge SSD CDN</span>
              <span>•</span>
              <span>🔒 TLS 1.3 / HTTP/2</span>
              <span>•</span>
              <span>🌎 Global Multi-Region</span>
            </div>
          </div>
        </div>

        <!-- Hackathon Mobile Demo Guide -->
        <div>
          <div style="font-size: 0.84rem; font-weight: 700; color: #e2e8f0; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>🏆</span> 3-Minute Hackathon Judge Demo on Mobile
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem; color: #94a3b8;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.75rem;">1</span>
              <div>
                <strong style="color: #f1f5f9;">Live Camera Document Ingestion:</strong> Tap <code>📸 Scan Physical Paper</code>. Point your phone camera at any physical document or handwritten note in the venue. SnapRAG runs on-device edge OCR in ~1.2s.
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.75rem;">2</span>
              <div>
                <strong style="color: #f1f5f9;">Qualcomm AI Hub Model Swap:</strong> Tap <code>🧠 Model Weights</code> to switch between Phi-3.5-mini INT4, Llama-3.2-1B INT4, and Mistral-7B INT4 on your mobile browser.
              </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 700; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.75rem;">3</span>
              <div>
                <strong style="color: #f1f5f9;">Zero Telemetry / Offline Verification:</strong> Put your phone into Airplane Mode after loading the page. SnapRAG continues to ingest, embed, and query completely offline.
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="modal-footer" style="padding: 14px 24px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.74rem; color: #10b981; font-family: var(--font-mono);">
          🟢 Production Live: snaprag-edge.web.app (Zero Server Dependency)
        </span>
        <button id="close-mobile-access-footer-btn" class="btn btn-secondary" style="padding: 6px 16px;">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  const close = () => {
    window.removeEventListener('keydown', handleKey);
    modal.remove();
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') close();
  };
  window.addEventListener('keydown', handleKey);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  const closeBtn = document.getElementById('close-mobile-access-btn');
  const footerCloseBtn = document.getElementById('close-mobile-access-footer-btn');
  if (closeBtn) closeBtn.onclick = close;
  if (footerCloseBtn) footerCloseBtn.onclick = close;

  // Copy button handler
  const copyBtn = document.getElementById('copy-tunnel-link-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(PERMANENT_PRODUCTION_URL).then(() => {
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.color = '#34d399';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy';
          copyBtn.style.color = '';
        }, 2000);
      });
    };
  }
}
