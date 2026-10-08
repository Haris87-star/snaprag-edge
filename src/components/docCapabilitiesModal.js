/**
 * Document Intelligence Capabilities & Formats Guide Modal
 * Comprehensive specification of all 5 document domains, supported file formats,
 * and high-performance vs. challenging edge content boundaries.
 */

export function renderDocCapabilitiesModal() {
  const existing = document.getElementById("doc-capabilities-modal");
  if (existing) existing.remove();

  const modalHtml = `
    <div id="doc-capabilities-modal" class="modal-overlay">
      <div class="modal-card glassmorphic" style="max-width: 900px; max-height: 88vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="badge badge-accent">SnapRAG Document Intelligence Matrix</span>
            <h2>Supported Document Types, Formats & Capabilities</h2>
            <p class="text-secondary">Comprehensive On-Device Processing Matrix across 5 Core Domains</p>
          </div>
          <button id="close-doc-caps-modal" class="btn-icon" aria-label="Close modal">&times;</button>
        </div>

        <div class="modal-body" style="overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Format & Processing Matrix Banner -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            <div class="meta-box" style="border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05);">
              <div class="meta-box-label" style="color: #34d399;">🟢 OPTIMAL FILE FORMATS</div>
              <p style="font-size: 0.82rem; color: #e2e8f0; margin-top: 4px;">
                <strong>Digital PDFs</strong>, Plain Text (<strong>.txt, .md, .json, .csv</strong>), Word Documents (<strong>.docx, .doc</strong>), and Clear High-Contrast Scanned Images (<strong>.jpg, .png, .webp</strong>).
              </p>
            </div>

            <div class="meta-box" style="border-color: rgba(0, 242, 254, 0.4); background: rgba(0, 242, 254, 0.05);">
              <div class="meta-box-label" style="color: var(--cyan-accent);">⚡ HIGH PERFORMANCE CONTENT</div>
              <p style="font-size: 0.82rem; color: #e2e8f0; margin-top: 4px;">
                Clear, typed, or printed structured text, standard tables, financial ledger columns, legal clause structures, and medical dosages.
              </p>
            </div>

            <div class="meta-box" style="border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05);">
              <div class="meta-box-label" style="color: #fbbf24;">⚠️ CHALLENGING / EDGE LIMITS</div>
              <p style="font-size: 0.82rem; color: #e2e8f0; margin-top: 4px;">
                Freehand cursive handwriting, dense multi-layered architectural CAD schematics, and heavily degraded or faded carbon-copy papers.
              </p>
            </div>
          </div>

          <!-- The 5 Core Document Domains Grid -->
          <div>
            <h3 style="font-size: 1.05rem; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>📁</span>
              <span>The 5 Specialized Document Domains</span>
            </h3>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              
              <!-- Domain 1 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #60a5fa; font-size: 0.95rem;">1. Legal & Real Estate Documents</strong>
                  <span class="doc-badge-pill">Privilege Protected</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Property records:</strong> Sale deeds, title deeds, gift deeds, encumbrance certificates (EC Form 15), and land tax receipts.</li>
                  <li><strong>Agreements & contracts:</strong> Non-disclosure agreements (NDAs), lease and rental agreements, partnership deeds, and terms of service.</li>
                  <li><strong>Statutory filings:</strong> Power of attorney documents, court affidavits, and corporate compliance forms.</li>
                </ul>
              </div>

              <!-- Domain 2 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #10b981; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #34d399; font-size: 0.95rem;">2. Medical & Healthcare Records</strong>
                  <span class="doc-badge-pill">HIPAA & GDPR Compliant</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Diagnostic reports:</strong> Blood test panels, radiology summaries, biopsy reports, and clinical lab findings.</li>
                  <li><strong>Patient history:</strong> Hospital discharge summaries, clinical consultation notes, and vaccination records.</li>
                  <li><strong>Insurance & billing:</strong> Medical claims, itemized hospital bills, and prescription slips (e.g. Dr. Y. Nagendar Rao).</li>
                </ul>
              </div>

              <!-- Domain 3 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #fbbf24; font-size: 0.95rem;">3. Business & Financial Records</strong>
                  <span class="doc-badge-pill">SEC & SOC2 Air-Gapped</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Corporate governance:</strong> Internal standard operating procedures (SOPs), employee handbooks, meeting minutes, and compliance policies.</li>
                  <li><strong>Accounting files:</strong> Invoices, purchase orders (POs), balance sheets, profit & loss (P&L) statements, and expense receipts.</li>
                  <li><strong>Tax documents:</strong> Tax return acknowledgments, statutory audit reports, and bank statements.</li>
                </ul>
              </div>

              <!-- Domain 4 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #ec4899; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #f472b6; font-size: 0.95rem;">4. Construction & Fieldwork Documents</strong>
                  <span class="doc-badge-pill">Field Engineering</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Procurement:</strong> Bill of quantities (BOQ), vendor quotations, and material specification sheets (M30 concrete, Fe500 TMT steel).</li>
                  <li><strong>Site management:</strong> Daily progress reports, contractor agreements, and safety inspection checklists (OSM/OSHA).</li>
                  <li><strong>Permits:</strong> Municipal building approvals (BBMP), environmental clearances (PCB), and structural stability certificates.</li>
                </ul>
              </div>

              <!-- Domain 5 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #a78bfa; font-size: 0.95rem;">5. Academic & Technical Files</strong>
                  <span class="doc-badge-pill">Classified & Technical</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Educational resources:</strong> Textbooks, research papers, syllabus documents, and typed lecture summaries.</li>
                  <li><strong>Technical literature:</strong> Equipment user manuals, API documentation, software architecture specifications, and safety data sheets (SDS).</li>
                </ul>
              </div>

              <!-- Domain 6 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #06b6d4; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #22d3ee; font-size: 0.95rem;">6. Identity & Credentials</strong>
                  <span class="doc-badge-pill">Zero Cloud Storage</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>National IDs:</strong> Driver's licenses, Aadhaar cards, voter photo IDs, and passports parsed with instant on-device PII masking.</li>
                  <li><strong>Academic Credentials:</strong> Degree certificates, graduation transcripts, and institutional accreditations.</li>
                </ul>
              </div>

              <!-- Domain 7 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #14b8a6; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #2dd4bf; font-size: 0.95rem;">7. Utility & Municipal Records</strong>
                  <span class="doc-badge-pill">Address & Utility Audit</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Utility bills:</strong> Electricity bills (BESCOM), water supply invoices, and tariff schedules for address validation.</li>
                  <li><strong>Municipal records:</strong> Land mutation certificates, property tax receipts, and municipal register extracts.</li>
                </ul>
              </div>

              <!-- Domain 8 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #eab308; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #fde047; font-size: 0.95rem;">8. Field Logs & Equipment Tags</strong>
                  <span class="doc-badge-pill">Offline Substation Ops</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Industrial logs:</strong> Turbine maintenance logs, transducer calibration tags, and daily site supervisor logs without cell coverage.</li>
                </ul>
              </div>

              <!-- Domain 9 -->
              <div style="background: rgba(14, 20, 32, 0.7); border: 1px solid var(--border-subtle); border-left: 4px solid #f97316; border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: #fb923c; font-size: 0.95rem;">9. Handwritten Forms with Boxed Fields</strong>
                  <span class="doc-badge-pill">Boxed OCR Segmentation</span>
                </div>
                <ul style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; padding-left: 18px;">
                  <li><strong>Boxed character forms:</strong> Standardized benefit forms and survey sheets with single-character rectangular boxes for 100% reliable local OCR.</li>
                </ul>
              </div>

            </div>
          </div>

          <!-- Advanced Offline Capabilities Section -->
          <div>
            <h3 style="font-size: 1.05rem; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>⚡</span>
              <span>Advanced On-Device Capabilities Beyond Simple Q&A</span>
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
              <div class="meta-box" style="background: rgba(220, 38, 38, 0.08); border-color: rgba(220, 38, 38, 0.4);">
                <strong style="color: #f87171; font-size: 0.88rem;">🛡️ Automated PII Redaction</strong>
                <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">
                  Real-time local detection and masking of Aadhaar numbers, credit cards, phone numbers, and addresses with a single preview toggle.
                </p>
              </div>

              <div class="meta-box" style="background: rgba(59, 130, 246, 0.08); border-color: rgba(59, 130, 246, 0.4);">
                <strong style="color: #60a5fa; font-size: 0.88rem;">⚖️ Cross-Document Discrepancy Diff</strong>
                <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">
                  Side-by-side comparison of contract revisions or vendor invoices highlighting altered clauses, price discrepancies, and missing signatures.
                </p>
              </div>

              <div class="meta-box" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.4);">
                <strong style="color: #34d399; font-size: 0.88rem;">📊 Tabular Data to JSON / CSV</strong>
                <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">
                  Instant one-click parsing of scanned tables (BOQ items, hospital bills, tariffs) into clean JSON and downloadable CSV for Excel.
                </p>
              </div>

              <div class="meta-box" style="background: rgba(139, 92, 246, 0.08); border-color: rgba(139, 92, 246, 0.4);">
                <strong style="color: #a78bfa; font-size: 0.88rem;">🎯 Grounded Bounding Box Citations</strong>
                <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">
                  Clicking citations highlights the exact paragraph with glowing bounding box coordinates on the original scanned page.
                </p>
              </div>
            </div>
          </div>

          <!-- Air-Gap Assurance -->
          <div class="meta-box" style="background: rgba(0,0,0,0.4); border-color: var(--border-cyan);">
            <div class="meta-box-label" style="color: var(--cyan-accent);">QUALCOMM SNAPDRAGON ON-DEVICE ASSURANCE</div>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">
              Every document ingested — whether digital Word (.docx), PDF, or camera scan — is parsed and chunked locally in device memory. Vector embeddings, BM25 indices, and INT4 generation execute entirely on-device with zero telemetry egress.
            </p>
          </div>

        </div>

        <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid var(--border-subtle);">
          <span style="font-size: 0.78rem; color: var(--text-muted);">SnapRAG Edge Architecture · Qualcomm AI Build Challenge</span>
          <button id="close-doc-caps-btn" class="btn btn-secondary">Got It, Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const close = () => {
    const el = document.getElementById("doc-capabilities-modal");
    if (el) el.remove();
    document.removeEventListener("keydown", handleKeydown);
  };

  const handleKeydown = (e) => {
    if (e.key === "Escape") close();
  };

  document.addEventListener("keydown", handleKeydown);

  document.getElementById("close-doc-caps-modal")?.addEventListener("click", close);
  document.getElementById("close-doc-caps-btn")?.addEventListener("click", close);
  document.getElementById("doc-capabilities-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "doc-capabilities-modal") close();
  });
}
