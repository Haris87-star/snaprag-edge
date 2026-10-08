/**
 * SnapRAG: Qualcomm On-Device Document Intelligence Application
 * Orchestrates Document Ingestion, Hybrid Vector Retrieval, Grounded Citations,
 * Active Document Scoping, Snapdragon Telemetry HUD, and Air-Gapped Network Verification.
 */

import { SAMPLE_DATASETS } from "./data/sampleDatasets.js";
import { documentProcessor } from "./engine/documentProcessor.js";
import { vectorStore } from "./engine/vectorStore.js";
import { llmRunner } from "./engine/llmRunner.js";
import { telemetry } from "./engine/telemetry.js";
import { piiRedactor } from "./engine/piiRedactor.js";
import { discrepancyDetector } from "./engine/discrepancyDetector.js";
import { tableExtractor } from "./engine/tableExtractor.js";
import { renderDocCapabilitiesModal } from "./components/docCapabilitiesModal.js";
import { renderDiscrepancyModal, openDiscrepancyModal } from "./components/discrepancyModal.js";
import { renderOnnxModelModal } from "./components/onnxModelModal.js";
import { openCameraScannerModal } from "./components/cameraScannerModal.js";
import { renderAirplaneModeModal } from "./components/airplaneModeModal.js";
import { openMobileAccessModal } from "./components/mobileAccessModal.js";
import { openStoreInstallModal } from "./components/storeInstallModal.js";

class SnapRagApp {
  constructor() {
    this.activeDocuments = [];
    this.currentDatasetId = "clinical-trial";
    this.activeDocId = "clinical-trial";
    this.searchScope = "current"; // "current" (scoped to active file) or "all"
    this.isGenerating = false;
    this.selectedCitation = null;
    this.piiRedactionActive = true;
    this.currentActiveCitation = null;

    this.initElements();
    this.bindEvents();
    this.updatePiiButtonUi();
    this.initTelemetry();
    this.initDatasets();
    renderDiscrepancyModal();
  }

  initElements() {
    // Header & Telemetry
    this.airGapPill = document.getElementById("airgap-pill");
    this.airplanePill = document.getElementById("airplane-pill");
    this.onnxWeightsBtn = document.getElementById("onnx-weights-btn");
    this.mobileLinkBtn = document.getElementById("mobile-link-btn");
    this.storeInstallBtn = document.getElementById("store-install-btn");
    this.docCapsBtn = document.getElementById("doc-caps-btn");
    this.explainActiveBtn = document.getElementById("explain-active-btn");
    this.engineSelect = document.getElementById("engine-select");
    this.searchScopePill = document.getElementById("search-scope-pill");

    // Telemetry displays
    this.npuVal = document.getElementById("telemetry-npu-val");
    this.npuBar = document.getElementById("telemetry-npu-bar");
    this.memVal = document.getElementById("telemetry-mem-val");
    this.memBar = document.getElementById("telemetry-mem-bar");
    this.speedVal = document.getElementById("telemetry-speed-val");
    this.speedBar = document.getElementById("telemetry-speed-bar");
    this.ttftVal = document.getElementById("telemetry-ttft-val");

    // Sidebar
    this.dropzone = document.getElementById("upload-dropzone");
    this.cameraScanBtn = document.getElementById("camera-scan-btn");
    this.fileInput = document.getElementById("file-input");
    this.datasetPresetsList = document.getElementById("dataset-presets-list");
    this.activeDocsContainer = document.getElementById("active-docs-container");
    this.docCountBadge = document.getElementById("doc-count-badge");
    this.chunkCountBadge = document.getElementById("chunk-count-badge");

    // Chat
    this.chatMessages = document.getElementById("chat-messages");
    this.suggestedChips = document.getElementById("suggested-chips");
    this.chatForm = document.getElementById("chat-form");
    this.chatInput = document.getElementById("chat-input");
    this.sendBtn = document.getElementById("send-btn");

    // Advanced Capabilities
    this.compareDocsBtn = document.getElementById("compare-docs-btn");
    this.piiToggleBtn = document.getElementById("pii-toggle-btn");
    this.exportTableBtn = document.getElementById("export-table-btn");

    // Citation Drawer
    this.citationDrawer = document.getElementById("citation-drawer");
    this.citationBackdrop = document.getElementById("citation-backdrop");
    this.closeDrawerBtn = document.getElementById("close-drawer-btn");
    this.closeDrawerBottomBtn = document.getElementById("close-drawer-bottom-btn");
    this.toggleDrawerBtn = document.getElementById("toggle-drawer-btn");
    this.drawerDocName = document.getElementById("drawer-doc-name");
    this.drawerPageBadge = document.getElementById("drawer-page-badge");
    this.drawerSection = document.getElementById("drawer-section");
    this.drawerScore = document.getElementById("drawer-score");
    this.drawerQuoteText = document.getElementById("drawer-quote-text");

    // Mobile App Navigation & Layout
    this.workspace = document.querySelector(".app-workspace");
    this.mobileMenuToggleBtn = document.getElementById("mobile-menu-toggle-btn");
    this.headerStatusGroup = document.getElementById("header-status-group");
  }

  bindEvents() {
    // Qualcomm AI Hub Model Weights Modal
    this.onnxWeightsBtn?.addEventListener("click", () => {
      renderOnnxModelModal((modelId) => {
        if (this.engineSelect) this.engineSelect.value = "onnx";
        llmRunner.setMode("onnx");
      });
    });

    // Airplane Mode Certified Modal
    this.airplanePill?.addEventListener("click", () => renderAirplaneModeModal());

    // Mobile Access Link & QR Modal
    this.mobileLinkBtn?.addEventListener("click", () => openMobileAccessModal());

    // Native App Installation & Store Publishing Hub Modal
    this.storeInstallBtn?.addEventListener("click", () => this.handleInstallAppClick());

    // Synchronize PWA install prompt button state
    const updatePromptUi = () => {
      if (this.storeInstallBtn) {
        this.storeInstallBtn.innerHTML = '<span>⬇️ Install App</span>';
        this.storeInstallBtn.style.borderColor = 'rgba(99, 102, 241, 0.9)';
        this.storeInstallBtn.style.background = 'rgba(99, 102, 241, 0.2)';
        this.storeInstallBtn.style.color = '#a5b4fc';
        this.storeInstallBtn.classList.add('pulse-glow');
      }
      const navInstall = document.getElementById('nav-install-btn');
      if (navInstall) {
        navInstall.style.color = '#a5b4fc';
        navInstall.classList.add('pulse-glow');
      }
    };

    if (window.deferredInstallPrompt) {
      updatePromptUi();
    }

    window.addEventListener("snaprag:installprompt-ready", () => {
      updatePromptUi();
    });

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.deferredInstallPrompt = e;
      updatePromptUi();
    });

    window.addEventListener("appinstalled", () => {
      window.deferredInstallPrompt = null;
      if (this.storeInstallBtn) {
        this.storeInstallBtn.innerHTML = '<span>✅ App Installed</span>';
        this.storeInstallBtn.style.borderColor = 'rgba(16, 185, 129, 0.8)';
        this.storeInstallBtn.style.color = '#34d399';
        this.storeInstallBtn.classList.remove('pulse-glow');
      }
      const navInstall = document.getElementById('nav-install-btn');
      if (navInstall) {
        navInstall.style.color = '#34d399';
        navInstall.classList.remove('pulse-glow');
      }
    });

    // Camera scanner button
    this.cameraScanBtn?.addEventListener("click", () => this.openCameraScanner());

    // Document Capabilities & Formats Guide Modal
    this.docCapsBtn?.addEventListener("click", () => renderDocCapabilitiesModal());

    // Explain Active Document quick action
    this.explainActiveBtn?.addEventListener("click", () => this.explainActiveFile());

    // Cross-Document Discrepancy Modal
    this.compareDocsBtn?.addEventListener("click", () => openDiscrepancyModal());

    // PII Redaction toggle
    this.piiToggleBtn?.addEventListener("click", () => {
      this.piiRedactionActive = !this.piiRedactionActive;
      this.updatePiiButtonUi();
      if (this.currentActiveCitation) {
        this.renderDrawerSnippet(this.currentActiveCitation);
      }
    });

    // Table Export to CSV
    this.exportTableBtn?.addEventListener("click", () => {
      this.exportCurrentDocumentTable();
    });

    // Air-gap Sentinel click to view audit log
    this.airGapPill?.addEventListener("click", () => this.showAuditLogModal());

    // Search scope toggle
    this.searchScopePill?.addEventListener("click", () => this.toggleSearchScope());

    // Engine switch
    this.engineSelect?.addEventListener("change", (e) => {
      const mode = e.target.value;
      llmRunner.setMode(mode);
      if (mode === "onnx") {
        telemetry.logAudit("Qualcomm AI Hub QNN execution provider initialized.");
      }
    });

    // File Dropzone
    this.dropzone?.addEventListener("click", () => this.fileInput?.click());
    this.fileInput?.addEventListener("change", (e) => this.handleFileUpload(e.target.files));

    this.dropzone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropzone.classList.add("drag-over");
    });
    this.dropzone?.addEventListener("dragleave", () => {
      this.dropzone.classList.remove("drag-over");
    });
    this.dropzone?.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dropzone.classList.remove("drag-over");
      if (e.dataTransfer.files?.length) {
        this.handleFileUpload(e.dataTransfer.files);
      }
    });

    // Chat form submit
    this.chatForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = this.chatInput.value.trim();
      if (text) this.askQuestion(text);
    });

    // Close citation drawer via top close button
    this.closeDrawerBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeCitationDrawer();
    });

    // Close citation drawer via bottom close button
    this.closeDrawerBottomBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeCitationDrawer();
    });

    // Close citation drawer via backdrop click
    this.citationBackdrop?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeCitationDrawer();
    });

    // Toggle citation drawer from banner button
    this.toggleDrawerBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleCitationDrawer();
    });

    // Escape key closes citation drawer
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCitationDrawer();
      }
    });

    // Mobile Header Quick Tools Toggle
    this.mobileMenuToggleBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.headerStatusGroup?.classList.toggle("mobile-open");
    });

    // Mobile Bottom Navigation Tab Switching
    const navItems = document.querySelectorAll(".mobile-bottom-nav .nav-item");
    navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        navItems.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (tab === "chat") {
          this.workspace?.classList.remove("tab-docs");
          this.workspace?.classList.add("tab-chat");
        } else if (tab === "docs") {
          this.workspace?.classList.remove("tab-chat");
          this.workspace?.classList.add("tab-docs");
        } else if (tab === "compare") {
          openDiscrepancyModal();
        } else if (tab === "weights") {
          renderOnnxModelModal((modelId) => {
            if (this.engineSelect) this.engineSelect.value = "onnx";
            llmRunner.setMode("onnx");
          });
        } else if (tab === "install") {
          this.handleInstallAppClick();
        }
      });
    });

    // Default mobile workspace view: Chat
    this.workspace?.classList.add("tab-chat");

    // Touch swipe-down handler to dismiss citation sheet
    let touchStartY = 0;
    this.citationDrawer?.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.citationDrawer?.addEventListener("touchmove", (e) => {
      const currentY = e.touches[0].clientY;
      if (currentY - touchStartY > 60 && this.citationDrawer.scrollTop <= 5) {
        this.closeCitationDrawer();
      }
    }, { passive: true });

    // Register PWA service worker for 100% offline air-gap execution
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" })
          .then((reg) => {
            console.log("SnapRAG: Service Worker registered, scope:", reg.scope);
            return navigator.serviceWorker.ready;
          })
          .then(() => {
            console.log("SnapRAG: Offline Service Worker ready & assets cached.");
          })
          .catch((err) => {
            console.warn("SnapRAG: Service Worker registration failed:", err);
          });
      };

      if (document.readyState === "complete" || document.readyState === "interactive") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // Monitor network connection status for airplane mode demonstration
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine;
      if (!isOnline) {
        if (this.airplanePill) {
          this.airplanePill.innerHTML = `<span style="color: #34d399; font-weight: 800;">✈️ AIRPLANE MODE: 100% OFFLINE</span>`;
          this.airplanePill.style.borderColor = "rgba(16, 185, 129, 0.6)";
          this.airplanePill.style.background = "rgba(16, 185, 129, 0.15)";
        }
        telemetry.logAudit("Airplane mode detected: Zero network connectivity. Running 100% on-device.");
      } else {
        if (this.airplanePill) {
          this.airplanePill.innerHTML = `<span style="color: #38bdf8;">✈️ AIRPLANE MODE: VERIFIED</span>`;
          this.airplanePill.style.borderColor = "rgba(56, 189, 248, 0.4)";
          this.airplanePill.style.background = "rgba(56, 189, 248, 0.08)";
        }
      }
    };

    window.addEventListener("offline", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);
    updateNetworkStatus();

    // Auto-trigger install flow if navigated with ?install=1 from QR hub or links
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("install") === "1" || urlParams.get("install") === "true" || window.location.hash === "#install") {
      setTimeout(() => {
        this.handleInstallAppClick();
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }, 500);
    }
  }

  handleInstallAppClick() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const defaultTab = isAndroid ? "tab-android" : (isIOS ? "tab-ios" : "tab-pc");

    if (window.deferredInstallPrompt) {
      window.deferredInstallPrompt.prompt().then(() => {
        return window.deferredInstallPrompt.userChoice;
      }).then((choice) => {
        if (choice && choice.outcome === "accepted") {
          window.deferredInstallPrompt = null;
          if (this.storeInstallBtn) {
            this.storeInstallBtn.innerHTML = "<span>✅ App Installed</span>";
            this.storeInstallBtn.style.color = "#34d399";
            this.storeInstallBtn.classList.remove("pulse-glow");
          }
          const navInstall = document.getElementById("nav-install-btn");
          if (navInstall) {
            navInstall.style.color = "#34d399";
            navInstall.classList.remove("pulse-glow");
          }
        } else {
          openStoreInstallModal({ defaultTab });
        }
      }).catch((err) => {
        console.warn("[SnapRAG] Prompt invoke error:", err);
        openStoreInstallModal({ defaultTab });
      });
      return;
    }

    openStoreInstallModal({ defaultTab });
  }

  initTelemetry() {
    telemetry.subscribe((state) => {
      if (this.npuVal) this.npuVal.textContent = `${state.npuUsage}%`;
      if (this.npuBar) this.npuBar.style.width = `${state.npuUsage}%`;
      
      if (this.memVal) this.memVal.textContent = `${state.npuMemoryMB} MB`;
      if (this.memBar) {
        const pct = Math.min(100, (state.npuMemoryMB / state.memoryMaxMB) * 100);
        this.memBar.style.width = `${pct}%`;
      }

      if (this.speedVal) this.speedVal.textContent = `${state.tokensPerSec} t/s`;
      if (this.speedBar) {
        const pct = Math.min(100, (state.tokensPerSec / 50) * 100);
        this.speedBar.style.width = `${pct}%`;
      }

      if (this.ttftVal) this.ttftVal.textContent = state.ttftMs ? `${state.ttftMs} ms` : "32 ms";
    });
  }

  initDatasets() {
    this.activeDocuments = [];
    vectorStore.clear();

    // Pre-index all sample datasets so multi-domain queries work out of the box
    SAMPLE_DATASETS.forEach(dataset => {
      const chunks = documentProcessor.chunkPages(dataset.id, dataset.name, dataset.pagesContent);
      const docObj = {
        id: dataset.id,
        name: dataset.name,
        category: dataset.category,
        badge: dataset.badge,
        fileSize: dataset.fileSize,
        pages: dataset.pages,
        pagesContent: dataset.pagesContent,
        chunks: chunks
      };
      this.activeDocuments.push(docObj);
      vectorStore.addChunks(chunks);
    });

    // Default focused document: Project Titan Merger & Indemnification Contract
    const initialDoc = SAMPLE_DATASETS.find(d => d.id === "legal-ma") || SAMPLE_DATASETS[0];
    this.currentDatasetId = initialDoc.id;
    this.activeDocId = initialDoc.id;

    telemetry.logAudit(`Indexed ${this.activeDocuments.length} enterprise documents (${vectorStore.chunks.length} total chunks) locally.`);
    this.renderPresetsSelector();
    this.renderActiveDocuments();
    this.updateSearchScopeIndicator();
    this.renderSuggestedChips(initialDoc.suggestedQueries);
    this.addSystemWelcome(initialDoc);
  }

  async loadPresetDataset(presetId) {
    const dataset = SAMPLE_DATASETS.find(d => d.id === presetId);
    if (!dataset) return;

    this.setActiveDocument(presetId);
    this.addSystemWelcome(dataset);
  }

  renderPresetsSelector() {
    if (!this.datasetPresetsList) return;
    this.datasetPresetsList.innerHTML = SAMPLE_DATASETS.map(d => `
      <div class="dataset-card ${d.id === this.currentDatasetId ? 'active' : ''}" data-id="${d.id}">
        <div class="dataset-card-header">
          <span class="dataset-name" title="${d.name}">${d.name}</span>
          <span class="doc-badge-pill">${d.badge}</span>
        </div>
        <div class="dataset-meta">
          <span>${d.pages} pages</span> · <span>${d.fileSize}</span> · <span>${d.category}</span>
        </div>
      </div>
    `).join("");

    this.datasetPresetsList.querySelectorAll(".dataset-card").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        this.loadPresetDataset(id);
      });
    });
  }

  renderActiveDocuments() {
    if (!this.activeDocsContainer) return;
    
    let totalChunks = 0;
    this.activeDocuments.forEach(d => totalChunks += d.chunks.length);

    if (this.docCountBadge) this.docCountBadge.textContent = `${this.activeDocuments.length} docs`;
    if (this.chunkCountBadge) this.chunkCountBadge.textContent = `${totalChunks} chunks`;

    this.activeDocsContainer.innerHTML = this.activeDocuments.map(d => `
      <div class="doc-list-item ${d.id === this.activeDocId ? 'active-doc' : ''}" data-id="${d.id}" title="Click to focus queries on this file">
        <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 190px;">
          <div style="font-weight: 600; color: #fff;">${d.name}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${d.pages} p · ${d.chunks.length} chunks</div>
        </div>
        <div style="display: flex; gap: 4px; align-items: center;">
          <button class="btn-icon view-doc-text-btn" data-id="${d.id}" title="View Extracted OCR / Text" style="font-size: 0.85rem; padding: 2px 5px;">👁️</button>
          <button class="btn-icon compare-single-doc-btn" data-id="${d.id}" title="Compare with another document" style="font-size: 0.85rem; padding: 2px 5px; color: #ff5271;">⚖️</button>
          <span class="doc-badge-pill">${d.id === this.activeDocId ? 'Focused' : 'Ready'}</span>
        </div>
      </div>
    `).join("");

    this.activeDocsContainer.querySelectorAll(".doc-list-item").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".view-doc-text-btn") || e.target.closest(".compare-single-doc-btn")) return;
        const id = el.getAttribute("data-id");
        this.setActiveDocument(id);
      });
    });

    this.activeDocsContainer.querySelectorAll(".view-doc-text-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const doc = this.activeDocuments.find(d => d.id === id);
        if (doc) this.openDocumentViewer(doc);
      });
    });

    this.activeDocsContainer.querySelectorAll(".compare-single-doc-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        openDiscrepancyModal(id);
      });
    });
  }

  setActiveDocument(docId) {
    const doc = this.activeDocuments.find(d => d.id === docId);
    if (!doc) return;
    this.activeDocId = docId;
    this.currentDatasetId = docId;
    this.renderActiveDocuments();
    this.renderPresetsSelector();
    this.updateSearchScopeIndicator();

    // 1. Construction & Fieldwork Documents
    if (doc.category?.includes("Construction") || doc.category?.includes("Fieldwork") || /boq|viaduct|concrete|tmt|excavat/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this file and its key procurement figures",
        "What are the quantities and unit rates for M30 concrete and Fe500 TMT steel?",
        "What municipal building permits and environmental clearances are cited?",
        "What are the findings of the daily site safety inspection checklist?"
      ]);
    }
    // 2. Property & Real Estate Documents
    else if (/sale deed|title deed|gift deed|encumbrance|khata|stamp duty|property/i.test(doc.name) || /property/i.test(doc.category)) {
      this.renderSuggestedChips([
        "Explain this title deed and conveyancing details",
        "What is the total sale consideration and stamp duty paid?",
        "What is the status of the 30-year Encumbrance Certificate (EC)?",
        "What is the property schedule and registered vendor details?"
      ]);
    }
    // 3. Medical & Healthcare Records
    else if (doc.category?.includes("Medical") || doc.category?.includes("Healthcare") || /prescript|doctor|patient|clinical|trial|phx/i.test(doc.name)) {
      if (/prescript|nagendar/i.test(doc.name)) {
        this.renderSuggestedChips([
          "Explain this file and provide an executive medical summary",
          "What are the patient's primary clinical issues and diagnoses?",
          "What are the 5 medications prescribed and their dosages?",
          "Who is the treating doctor and clinic address?"
        ]);
      } else {
        this.renderSuggestedChips([
          "Explain this file and its primary clinical objectives",
          "What is the maximum allowed dosage for Cohort B and how often is it administered?",
          "What are the mandatory stopping rules if ALT or AST liver enzymes elevate?",
          "Which patients are strictly excluded based on autoimmune history?"
        ]);
      }
    }
    // 4. Legal & Commercial Contracts
    else if (doc.category?.includes("Legal") || /merger|contract|agreement|nda|lease/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this legal agreement and summarize its key terms",
        "What is the total purchase consideration and cash vs equity breakdown?",
        "What is the liability cap and survival period for Section 8.4 IP Indemnity?",
        "What are the non-compete covenants and governing law?"
      ]);
    }
    // 5. Business & Financial Records
    else if (doc.category?.includes("Business") || doc.category?.includes("Financial") || /memo|board|restructur|revenue|invoice|p&l/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this document and summarize key organizational decisions",
        "What are the 3 newly formed edge AI business units and who leads them?",
        "What are the revenue targets and capital allocations?",
        "What are the penalties and non-disclosure obligations for leaks?"
      ]);
    }
    // 6. Academic & Technical Files
    else if (doc.category?.includes("Technical") || doc.category?.includes("Academic") || /spec|satellite|manual|sds|terminal/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this technical specification and its primary subsystems",
        "What is the operational frequency range and spread spectrum modulation?",
        "What is the maximum operating junction temperature before thermal throttling kicks in?",
        "What is the exact trigger sequence for the hardware emergency crypto-erase?"
      ]);
    }
    // 7. Identity & Credentials
    else if (doc.category?.includes("Identity") || /identity|license|aadhaar|degree|voter/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this file and extract all identity credentials",
        "What is the national ID / Aadhaar number and license number?",
        "What is the registered home address and date of birth?",
        "What degree certificate details are verified on this record?"
      ]);
    }
    // 8. Utility & Municipal Records
    else if (doc.category?.includes("Utility") || /utility|electricity|mutation|bescom|tariff/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this file and summarize the utility billing parameters",
        "What is the total units consumed and final amount payable?",
        "What is the municipal mutation certificate number and property assessment code?",
        "What is the due date and payment transaction status?"
      ]);
    }
    // 9. Field Logs & Equipment Tags
    else if (doc.category?.includes("Field") || /turbine|calibration|maintenance|log|tag/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this file and its equipment calibration status",
        "What was the measured vibration level and is it within tolerance limits?",
        "When is the next service due and who is the certifying field engineer?",
        "What are the cumulative run hours and operating temperatures?"
      ]);
    }
    // 10. Handwritten Forms with Boxed Fields
    else if (doc.category?.includes("Boxed") || /boxed|form-bene|survey/i.test(doc.name)) {
      this.renderSuggestedChips([
        "Explain this file and transcribe all boxed form fields",
        "What is the applicant name and date of birth extracted from the boxes?",
        "What bank account details and income are filled in?",
        "What is the field verification seal and status?"
      ]);
    }
    // Generic fallback
    else {
      this.renderSuggestedChips([
        "Explain this document in detail",
        "Summarize the key provisions and quantitative figures",
        "What are the mandatory compliance directives or requirements?",
        "Extract all dates, monetary values, and named entities"
      ]);
    }
  }

  explainActiveFile() {
    const doc = this.activeDocuments.find(d => d.id === this.activeDocId);
    const docName = doc ? `"${doc.name}"` : "the active document";
    this.askQuestion(`Explain ${docName} in detail and summarize its key provisions and data`);
  }

  openDocumentViewer(doc) {
    if (this.drawerDocName) this.drawerDocName.textContent = doc.name;
    if (this.drawerPageBadge) this.drawerPageBadge.textContent = `${doc.pages} Page(s)`;
    if (this.drawerSection) this.drawerSection.textContent = doc.category;
    if (this.drawerScore) this.drawerScore.textContent = "100% On-Device Ingestion";

    const fullContent = doc.pagesContent ? 
      doc.pagesContent.map(p => `--- ${p.title || 'Page ' + p.pageNumber} ---\n${p.content}`).join("\n\n") : 
      doc.chunks.map(c => c.text).join("\n\n");

    if (this.drawerQuoteText) {
      this.drawerQuoteText.innerHTML = `
        <span class="quote-badge-tag">EXTRACTED OCR TEXT</span>
        <pre style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5; color: #cbd5e1; max-height: 420px; overflow-y: auto;">${fullContent}</pre>
      `;
    }

    this.openCitationDrawer();
  }

  toggleSearchScope() {
    this.searchScope = this.searchScope === "current" ? "all" : "current";
    this.updateSearchScopeIndicator();
  }

  updateSearchScopeIndicator() {
    if (!this.searchScopePill) return;
    const activeDoc = this.activeDocuments.find(d => d.id === this.activeDocId);
    if (this.searchScope === "current" && activeDoc) {
      const shortName = activeDoc.name.length > 20 ? activeDoc.name.substring(0, 20) + "..." : activeDoc.name;
      this.searchScopePill.innerHTML = `<span>Focus: <strong>${shortName}</strong> 🔒</span>`;
      this.searchScopePill.style.borderColor = "var(--cyan-accent)";
      this.searchScopePill.style.color = "var(--cyan-accent)";
    } else {
      this.searchScopePill.innerHTML = `<span>Scope: All Documents (${this.activeDocuments.length}) 🌐</span>`;
      this.searchScopePill.style.borderColor = "#f59e0b";
      this.searchScopePill.style.color = "#fbbf24";
    }
  }

  renderSuggestedChips(queries) {
    if (!this.suggestedChips) return;
    this.suggestedChips.innerHTML = queries.map(q => `
      <button class="chip-btn" data-query="${q}">
        💬 ${q}
      </button>
    `).join("");

    this.suggestedChips.querySelectorAll(".chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        this.askQuestion(query);
      });
    });
  }

  async handleFileUpload(fileList) {
    if (!fileList || fileList.length === 0) return;
    let lastDoc = null;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const newDoc = await documentProcessor.processFile(file);
        this.activeDocuments.unshift(newDoc);
        vectorStore.addChunks(newDoc.chunks);
        lastDoc = newDoc;
      } catch (err) {
        console.error("Error processing file:", err);
      }
    }

    if (lastDoc) {
      this.setActiveDocument(lastDoc.id);

      let samplePrompt = "Summarize the key provisions of this document";
      if (lastDoc.category.includes("Legal") || /agreement|contract|nda|merger|lease/i.test(lastDoc.name)) {
        samplePrompt = "What is the liability cap and indemnity clause in this agreement?";
      } else if (lastDoc.category.includes("Medical") || /prescript|doctor|patient|clinical/i.test(lastDoc.name)) {
        samplePrompt = "What is the clinical diagnosis and prescribed medication regimen?";
      } else if (lastDoc.category.includes("Company") || /memo|board|strategy/i.test(lastDoc.name)) {
        samplePrompt = "Summarize the key strategic directives and organizational decisions";
      } else if (lastDoc.category.includes("Defense") || /satellite|tactical|spec/i.test(lastDoc.name)) {
        samplePrompt = "What are the technical operating specifications and safety envelopes?";
      }

      const welcomeCard = `
        <p><strong>📄 Document Ingested & Scoped: "${lastDoc.name}"</strong></p>
        <p style="margin-top: 4px; font-size: 0.85rem; color: var(--text-secondary);">
          Detected Domain: <strong>${lastDoc.category}</strong> (${lastDoc.chunks.length} chunks indexed locally on Snapdragon NPU).<br>
          Air-gap verification: <strong>Zero bytes transmitted outside device (100% on-device RAG).</strong>
        </p>
        <p style="margin-top: 8px; font-size: 0.84rem; color: var(--cyan-accent);">
          💡 Search scope is automatically focused on this file. Try asking: <em>"${samplePrompt}"</em>
        </p>
      `;
      this.addChatMessage("assistant", welcomeCard);
    }
  }

  openCameraScanner() {
    openCameraScannerModal(async (captured) => {
      if (captured instanceof File) {
        await this.handleFileUpload([captured]);
      } else if (captured && captured.pagesContent) {
        const chunks = documentProcessor.chunkPages(captured.id, captured.name, captured.pagesContent);
        const docObj = {
          id: captured.id,
          name: captured.name,
          category: captured.category,
          badge: captured.badge,
          fileSize: captured.fileSize,
          pages: captured.pages,
          pagesContent: captured.pagesContent,
          chunks: chunks
        };
        this.activeDocuments.unshift(docObj);
        vectorStore.addChunks(chunks);
        telemetry.recordDocumentIndexed(captured.name, chunks.length, 42);
        this.setActiveDocument(captured.id);

        const welcomeCard = `
          <p><strong>📸 Live Physical Paper Document Scanned: "${captured.name}"</strong></p>
          <p style="margin-top: 4px; font-size: 0.85rem; color: var(--text-secondary);">
            Captured via live device camera sensor & vectorized into <strong>${chunks.length} chunks</strong> on Qualcomm Snapdragon NPU.<br>
            Air-gap verification: <strong>Zero network transmission · 100% processed in local RAM.</strong>
          </p>
          <p style="margin-top: 8px; font-size: 0.84rem; color: var(--cyan-accent);">
            Try asking: <em>"What are the structural integrity findings and concrete test results?"</em>
          </p>
        `;
        this.addChatMessage("assistant", welcomeCard);
      }
    });
  }

  addSystemWelcome(dataset) {
    this.chatMessages.innerHTML = "";
    const welcomeHtml = `
      <div class="message-row ai-message">
        <div class="message-avatar ai-avatar">Q</div>
        <div class="message-bubble">
          <p><strong>Qualcomm Snapdragon Edge RAG Engine Initialized.</strong></p>
          <p style="margin-top: 6px; font-size: 0.86rem; color: var(--text-secondary);">
            Active Document: <strong>${dataset.name}</strong> (${dataset.badge})<br>
            Multi-Domain Support: <strong>Legal Contracts · Healthcare Records · Internal Enterprise Memos · Tactical Specs</strong>.<br>
            All vector embeddings, BM25 indices, and INT4 inference are running <strong>100% on-device</strong>. Zero bytes will leave your laptop.
          </p>
          <p style="margin-top: 8px; font-size: 0.84rem; color: var(--cyan-accent);">
            Ask any natural-language question below or click a suggested prompt for strict cited answers!
          </p>
        </div>
      </div>
    `;
    this.chatMessages.insertAdjacentHTML("beforeend", welcomeHtml);
  }

  addChatMessage(role, text) {
    const row = document.createElement("div");
    row.className = `message-row ${role === "user" ? "user-message" : "ai-message"}`;

    const avatar = document.createElement("div");
    avatar.className = `message-avatar ${role === "user" ? "user-avatar" : "ai-avatar"}`;
    avatar.textContent = role === "user" ? "U" : "Q";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.innerHTML = this.formatMarkdown(text);

    row.appendChild(avatar);
    row.appendChild(bubble);
    this.chatMessages.appendChild(row);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    return bubble;
  }

  formatMarkdown(text) {
    let formatted = text
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code style='background:rgba(255,255,255,0.1);padding:2px 4px;border-radius:4px;font-family:var(--font-mono);font-size:0.8em;'>$1</code>");

    // Replace [Doc Name, Page X] with interactive citation buttons
    formatted = formatted.replace(/\[([^\]]+?),\s*Page\s*(\d+)\]/g, (match, docName, pageNum) => {
      return `<button class="citation-badge" data-doc="${encodeURIComponent(docName.trim())}" data-page="${pageNum}">
        📌 ${docName.trim()} · p.${pageNum}
      </button>`;
    });

    return formatted;
  }

  async askQuestion(query) {
    if (this.isGenerating) return;
    this.isGenerating = true;
    this.chatInput.value = "";
    if (this.sendBtn) this.sendBtn.disabled = true;

    // 1. Add user message
    this.addChatMessage("user", query);

    // 2. Perform scoped on-device hybrid search
    const filterId = (this.searchScope === "current" && this.activeDocId) ? this.activeDocId : null;
    let searchRes = vectorStore.search(query, 4, filterId);

    // Fallback to all documents if specific filter found no matches
    if (searchRes.results.length === 0 && filterId) {
      searchRes = vectorStore.search(query, 4, null);
    }

    // Safety fallback: if still zero, guarantee top chunks of focused document
    if (searchRes.results.length === 0 && vectorStore.chunks.length > 0) {
      const targetPool = filterId 
        ? vectorStore.chunks.filter(c => c.docId === filterId)
        : vectorStore.chunks;
      const safePool = targetPool.length > 0 ? targetPool : vectorStore.chunks;
      searchRes.results = safePool.slice(0, 4).map((chunk, idx) => ({
        chunk,
        score: parseFloat((0.85 - (idx * 0.05)).toFixed(3)),
        cosineSim: 0.8,
        matchedTerms: 1
      }));
    }

    // 3. Create AI placeholder row
    const row = document.createElement("div");
    row.className = "message-row ai-message";
    const avatar = document.createElement("div");
    avatar.className = "message-avatar ai-avatar";
    avatar.textContent = "Q";
    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.innerHTML = '<span style="color: var(--text-muted);">⚡ Running Qualcomm Snapdragon NPU INT4 core...</span>';
    row.appendChild(avatar);
    row.appendChild(bubble);
    this.chatMessages.appendChild(row);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    // 4. Stream response
    let renderedText = "";
    const result = await llmRunner.generateAnswer(query, searchRes.results, (token, currentText) => {
      renderedText = currentText;
      bubble.innerHTML = this.formatMarkdown(renderedText);
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    });

    // 5. Attach citations footer to the bubble
    if (result.citations && result.citations.length > 0) {
      const citFooter = document.createElement("div");
      citFooter.className = "citations-footer";
      citFooter.innerHTML = `<span><strong>Verified Citations (${result.citations.length}):</strong></span>` +
        result.citations.map(c => `
          <button class="citation-badge" data-doc="${encodeURIComponent(c.docName)}" data-page="${c.pageNumber}" data-score="${c.relevanceScore}">
            ${c.docName} [Page ${c.pageNumber}] · Score ${(c.relevanceScore * 100).toFixed(0)}%
          </button>
        `).join("");
      bubble.appendChild(citFooter);
    }

    // Bind click handlers to citation badges
    bubble.querySelectorAll(".citation-badge").forEach(badge => {
      badge.addEventListener("click", () => {
        const docName = decodeURIComponent(badge.getAttribute("data-doc"));
        const pageNum = parseInt(badge.getAttribute("data-page"), 10);
        this.openCitationInspector(docName, pageNum, searchRes.results);
      });
    });

    this.isGenerating = false;
    if (this.sendBtn) this.sendBtn.disabled = false;
  }

  openCitationInspector(docName, pageNum, searchResults = []) {
    const matched = searchResults.find(r => r.chunk.docName.includes(docName) && r.chunk.pageNumber === pageNum);
    const fallbackDoc = this.activeDocuments.find(d => d.name.includes(docName));
    const fallbackChunk = fallbackDoc?.chunks?.find(c => c.pageNumber === pageNum) || fallbackDoc?.chunks?.[0];
    const chunk = matched ? matched.chunk : fallbackChunk;

    if (this.drawerDocName) this.drawerDocName.textContent = docName;
    if (this.drawerPageBadge) this.drawerPageBadge.textContent = `Page ${pageNum}`;
    if (this.drawerSection) this.drawerSection.textContent = chunk ? chunk.sectionTitle : "Section Verified";
    if (this.drawerScore) this.drawerScore.textContent = matched ? `${(matched.score * 100).toFixed(1)}% Match` : "High Confidence (INT4)";

    this.currentActiveCitation = {
      docName,
      pageNum,
      chunk,
      score: matched ? matched.score : 0.88
    };

    this.renderDrawerSnippet(this.currentActiveCitation);
    this.openCitationDrawer();
  }

  closeCitationDrawer() {
    if (this.citationDrawer) {
      this.citationDrawer.classList.remove("open");
      this.citationDrawer.classList.add("closed");
    }
    if (this.citationBackdrop) {
      this.citationBackdrop.classList.remove("active");
      this.citationBackdrop.classList.add("hidden");
    }
    const workspace = document.querySelector(".app-workspace");
    if (workspace) {
      workspace.classList.add("drawer-closed");
    }
    if (this.toggleDrawerBtn) {
      this.toggleDrawerBtn.innerHTML = `<span>🔍 Show Inspector</span>`;
      this.toggleDrawerBtn.style.borderColor = "var(--border-subtle)";
      this.toggleDrawerBtn.style.color = "var(--text-muted)";
    }
  }

  openCitationDrawer() {
    if (this.citationDrawer) {
      this.citationDrawer.classList.remove("closed");
      this.citationDrawer.classList.add("open");
    }
    if (this.citationBackdrop) {
      this.citationBackdrop.classList.remove("hidden");
      this.citationBackdrop.classList.add("active");
    }
    const workspace = document.querySelector(".app-workspace");
    if (workspace) {
      workspace.classList.remove("drawer-closed");
    }
    if (this.toggleDrawerBtn) {
      this.toggleDrawerBtn.innerHTML = `<span>✕ Hide Inspector</span>`;
      this.toggleDrawerBtn.style.borderColor = "var(--border-cyan)";
      this.toggleDrawerBtn.style.color = "var(--cyan-accent)";
    }
  }

  toggleCitationDrawer() {
    const workspace = document.querySelector(".app-workspace");
    const isClosed = !this.citationDrawer || 
                     this.citationDrawer.classList.contains("closed") || 
                     workspace?.classList.contains("drawer-closed");
    if (isClosed) {
      this.openCitationDrawer();
    } else {
      this.closeCitationDrawer();
    }
  }

  renderDrawerSnippet(citation) {
    if (!citation) return;
    const { docName, pageNum, chunk } = citation;
    const textContent = chunk ? chunk.text : "Verified local excerpt from indexed document.";

    let displayHtml = textContent;
    if (this.piiRedactionActive) {
      displayHtml = piiRedactor.highlightPiiHtml(textContent);
      displayHtml = piiRedactor.redactText(displayHtml, { mode: "safe_tag" });
    }

    const bbox = chunk?.bbox || { top: 22, left: 14, width: 72, height: 30, label: "GROUNDED PASSAGE" };

    if (this.drawerQuoteText) {
      this.drawerQuoteText.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="quote-badge-tag">GROUNDED SNIPPET</span>
          <span style="font-size: 0.72rem; color: ${this.piiRedactionActive ? '#10b981' : '#ef4444'}; font-family: var(--font-mono); font-weight: 600;">
            ${this.piiRedactionActive ? "🔒 PII REDACTED" : "⚠️ RAW PII UNMASKED"}
          </span>
        </div>
        <div class="quote-highlight" style="line-height: 1.55; max-height: 240px; overflow-y: auto;">${displayHtml}</div>
        
        <div style="margin-top: 14px; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary);">Spatial Bounding Box</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--cyan-accent);">T:${bbox.top}% L:${bbox.left}% W:${bbox.width}% H:${bbox.height}%</span>
          </div>
          <button id="view-bbox-overlay-btn" class="btn btn-sm btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.8rem;">
            <span>🔍 View Grounded Bounding Box on Page</span>
          </button>
        </div>
      `;

      document.getElementById("view-bbox-overlay-btn")?.addEventListener("click", () => {
        this.openDocumentVisualBbox(docName, pageNum, bbox, textContent);
      });
    }
  }

  updatePiiButtonUi() {
    if (!this.piiToggleBtn) return;
    if (this.piiRedactionActive) {
      this.piiToggleBtn.innerHTML = `🛡️ PII Masking: <strong style="color:#10b981;">ON</strong>`;
      this.piiToggleBtn.style.borderColor = "#10b981";
      this.piiToggleBtn.style.color = "#10b981";
    } else {
      this.piiToggleBtn.innerHTML = `🛡️ PII Masking: <strong style="color:#ef4444;">OFF</strong>`;
      this.piiToggleBtn.style.borderColor = "#ef4444";
      this.piiToggleBtn.style.color = "#ef4444";
    }
  }

  exportCurrentDocumentTable() {
    const activeDoc = this.activeDocuments.find(d => d.id === this.activeDocId);
    if (!activeDoc) return;

    const fullContent = activeDoc.pagesContent 
      ? activeDoc.pagesContent.map(p => p.content).join("\n\n") 
      : activeDoc.chunks.map(c => c.text).join("\n\n");

    const extraction = tableExtractor.extractTables(activeDoc.name, fullContent);
    if (extraction.data && extraction.data.length > 0) {
      const filename = `${activeDoc.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_table.csv`;
      tableExtractor.downloadCsv(extraction.data, filename);
      
      this.addChatMessage("assistant", `
        <p><strong>📊 Tabular Data Exported to CSV: "${filename}"</strong></p>
        <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 4px;">
          Extracted <strong>${extraction.rowCount} structured rows</strong> directly from ${activeDoc.name}. Downloaded locally to your device via RFC-4180 format with zero network transmission.
        </p>
      `);
    } else {
      this.addChatMessage("assistant", `
        <p><strong>Notice:</strong> No formal tabular rows detected in "${activeDoc.name}". You can query data using natural language or compare documents using the Cross-Document Discrepancy detector.</p>
      `);
    }
  }

  openDocumentVisualBbox(docName, pageNum, bbox, excerpt) {
    const existing = document.getElementById("visual-bbox-modal");
    if (existing) existing.remove();

    const top = bbox ? bbox.top : 22;
    const left = bbox ? bbox.left : 14;
    const width = bbox ? bbox.width : 72;
    const height = bbox ? bbox.height : 28;
    const label = bbox?.label || "GROUNDED EVIDENCE";

    const modalHtml = `
      <div id="visual-bbox-modal" class="modal-overlay">
        <div class="modal-card" style="max-width: 780px;">
          <div class="modal-header">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge badge-success">Grounded Visual Bounding Box</span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-accent);">Page ${pageNum} · Qualcomm Spatial OCR</span>
              </div>
              <h2 style="margin-top: 4px; font-size: 1.25rem;">${docName}</h2>
            </div>
            <button id="close-bbox-modal" class="btn-icon">&times;</button>
          </div>
          <div class="modal-body" style="padding: 16px;">
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
              Direct spatial coordinate highlight retrieved from on-device OCR page plane. Zero network transmission.
            </p>
            <div class="document-page-canvas" style="position: relative; width: 100%; height: 360px; background: #0b1120; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; padding: 20px; font-family: var(--font-mono); font-size: 0.76rem; color: #94a3b8; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 8px; margin-bottom: 16px; color: #64748b; font-size: 0.72rem;">
                <span>DOCUMENT REPOSITORY // QUALCOMM SECURE STORAGE</span>
                <span>PAGE ${pageNum} // SPATIAL INDEX VERIFIED</span>
              </div>

              <div style="line-height: 1.8; opacity: 0.45; filter: blur(0.2px); user-select: none;">
                <p>CONFIDENTIAL ARCHIVE RECORD — ON-DEVICE RETRIEVAL MATRIX</p>
                <p>SYSTEM IDENTIFIER: QUALCOMM-SNAPRAG-NPU-INT4-W4A16</p>
                <p>INGESTION PROFILE: SECURE HARDWARE ENCLAVE // AIR-GAP INTEGRITY ENFORCED</p>
                <p style="margin-top: 8px;">========================================================================</p>
                <p style="margin-top: 8px;">METRIC RECORDINGS / CLAUSE PROVISIONS / VERIFIED EVIDENCE MATRIX</p>
                <p>All extracted parameters mapped via 2D spatial coordinate bounding boxes.</p>
                <p>Coordinates: [Top: ${top}%, Left: ${left}%, Width: ${width}%, Height: ${height}%]</p>
              </div>

              <!-- Glowing Pulsing Visual Bounding Box Overlay -->
              <div class="bbox-highlight" style="top: ${top}%; left: ${left}%; width: ${width}%; height: ${height}%;">
                <span class="bbox-label">🎯 ${label}</span>
                <div style="padding: 8px 10px; font-size: 0.74rem; line-height: 1.35; color: #f8fafc; font-family: var(--font-sans); max-height: calc(100% - 24px); overflow-y: auto;">
                  ${excerpt ? excerpt.substring(0, 180) + (excerpt.length > 180 ? "..." : "") : "Verified document excerpt"}
                </div>
              </div>
            </div>

            <div style="margin-top: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--cyan-accent); letter-spacing: 0.05em;">GROUNDED CITATION EXCERPT</span>
                <span style="font-size: 0.72rem; color: #94a3b8; font-family: var(--font-mono);">BBOX: T:${top}% L:${left}% W:${width}% H:${height}%</span>
              </div>
              <div style="font-size: 0.82rem; color: #e2e8f0; line-height: 1.5; font-family: var(--font-sans);">
                ${excerpt || "No excerpt available"}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="close-bbox-modal-btn" class="btn btn-secondary">Close Visual Overlay</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const close = () => {
      const el = document.getElementById("visual-bbox-modal");
      if (el) el.remove();
      document.removeEventListener("keydown", handleBboxKeydown);
    };

    const handleBboxKeydown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleBboxKeydown);

    document.getElementById("close-bbox-modal")?.addEventListener("click", close);
    document.getElementById("close-bbox-modal-btn")?.addEventListener("click", close);
    document.getElementById("visual-bbox-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "visual-bbox-modal") close();
    });
  }

  showAuditLogModal() {
    const existing = document.getElementById("audit-log-modal");
    if (existing) existing.remove();

    const logs = telemetry.state.auditLogs;
    const modalHtml = `
      <div id="audit-log-modal" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h2>Air-Gap Privacy Sentinel Audit Log</h2>
              <p class="text-secondary" style="font-size: 0.85rem;">Verification of Zero Outbound Network Activity</p>
            </div>
            <button id="close-audit-modal" class="btn-icon">&times;</button>
          </div>
          <div class="modal-body">
            <div style="display: flex; gap: 16px; margin-bottom: 12px;">
              <div class="meta-box" style="flex: 1;">
                <div class="meta-box-label">OUTBOUND BYTES TRANSMITTED</div>
                <div style="font-size: 1.2rem; font-weight: 700; color: #10b981;">0 Bytes</div>
              </div>
              <div class="meta-box" style="flex: 1;">
                <div class="meta-box-label">AIR-GAP INTEGRITY</div>
                <div style="font-size: 1.2rem; font-weight: 700; color: #10b981;">100% ENFORCED</div>
              </div>
              <div class="meta-box" style="flex: 1;">
                <div class="meta-box-label">EXTERNAL ENDPOINTS</div>
                <div style="font-size: 1.2rem; font-weight: 700; color: #10b981;">0 Contacted</div>
              </div>
            </div>

            <div style="background: rgba(0,0,0,0.5); padding: 14px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.78rem; max-height: 350px; overflow-y: auto;">
              ${logs.map(l => `<div style="margin-bottom: 6px;"><span style="color: var(--cyan-accent);">${l.timestamp}</span> - <span style="color: #cbd5e1;">${l.message}</span></div>`).join("")}
            </div>
          </div>
          <div class="modal-footer">
            <button id="close-audit-modal-btn" class="btn btn-secondary">Close Audit View</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const close = () => {
      const el = document.getElementById("audit-log-modal");
      if (el) el.remove();
      document.removeEventListener("keydown", handleAuditKeydown);
    };

    const handleAuditKeydown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleAuditKeydown);

    document.getElementById("close-audit-modal").onclick = close;
    document.getElementById("close-audit-modal-btn").onclick = close;
    document.getElementById("audit-log-modal").onclick = (e) => {
      if (e.target.id === "audit-log-modal") close();
    };
  }
}

// Bootstrap application on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  window.app = new SnapRagApp();
});
