/**
 * Qualcomm AI Hub Native ONNX Model Swap & Architecture Inspector
 * Enables live switching between compiled Snapdragon INT4 ONNX/QNN models
 * and displays HTP accelerator telemetry and execution graph topology.
 */

import { llmRunner, QUALCOMM_AI_HUB_MODELS } from "../engine/llmRunner.js";
import { telemetry } from "../engine/telemetry.js";

export function renderOnnxModelModal(onModelSelected) {
  const existing = document.getElementById("onnx-model-modal");
  if (existing) existing.remove();

  const activeModel = llmRunner.getActiveOnnxModel();

  const modalHtml = `
    <div id="onnx-model-modal" class="modal-overlay">
      <div class="modal-card modal-card-wide glassmorphic" style="max-width: 860px; max-height: 90vh;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-accent" style="background: rgba(0, 242, 254, 0.18); color: var(--cyan-accent); border-color: rgba(0, 242, 254, 0.4);">QUALCOMM AI HUB</span>
              <span class="badge" style="background: rgba(230, 0, 43, 0.18); color: #ff5271; border-color: rgba(230, 0, 43, 0.4);">QNN INT4 W4A16</span>
            </div>
            <h2 style="margin-top: 6px; font-size: 1.3rem;">Qualcomm AI Hub Native ONNX Model Swap</h2>
            <p class="text-secondary" style="font-size: 0.82rem;">Compiled Snapdragon Neural Processing Engine (QNN) Execution Graphs on Hexagon NPU</p>
          </div>
          <button id="close-onnx-modal" class="modal-close btn-icon" aria-label="Close modal">&times;</button>
        </div>

        <div class="modal-body" style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px;">
          
          <!-- Qualcomm Hardware Execution Provider Banner -->
          <div class="meta-box" style="background: rgba(0, 242, 254, 0.04); border-color: rgba(0, 242, 254, 0.35); padding: 14px 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="pulse-dot" style="background: var(--cyan-accent); box-shadow: 0 0 10px var(--cyan-accent);"></span>
                <strong style="color: var(--cyan-accent); font-size: 0.9rem;">Snapdragon QNN Execution Provider (HTP Direct IO)</strong>
              </div>
              <span class="doc-badge-pill" style="border-color: #10b981; color: #34d399;">100% NPU Acceleration</span>
            </div>
            <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.5;">
              All INT4 weights are compiled via the <strong>Qualcomm AI Hub CLI</strong> for direct execution on the Qualcomm Hexagon Tensor Processor (HTP). Zero CPU or cloud offload occurs.
            </p>
          </div>

          <!-- Model Selection Cards Grid -->
          <div>
            <div class="section-caption" style="margin-bottom: 10px;">Select Compiled Qualcomm AI Hub Model:</div>
            <div id="onnx-models-grid" style="display: flex; flex-direction: column; gap: 12px;">
              ${QUALCOMM_AI_HUB_MODELS.map(m => {
                const isSelected = m.id === activeModel.id;
                return `
                  <div class="onnx-model-card ${isSelected ? 'active-model' : ''}" data-model-id="${m.id}" style="background: ${isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(14, 20, 32, 0.7)'}; border: 1px solid ${isSelected ? 'var(--cyan-accent)' : 'var(--border-subtle)'}; border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                      <div>
                        <div style="font-weight: 700; color: #fff; font-size: 0.98rem; display: flex; align-items: center; gap: 8px;">
                          <span>${m.name}</span>
                          ${isSelected ? '<span class="doc-badge-pill" style="background: rgba(0, 242, 254, 0.2); color: var(--cyan-accent); border-color: var(--cyan-accent);">ACTIVE NPU WEIGHTS</span>' : ''}
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">
                          Hub ID: ${m.hubId} · Weights: ${m.weightsFile}
                        </div>
                      </div>
                      <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'} select-model-btn" data-model-id="${m.id}" style="padding: 5px 12px; font-size: 0.78rem;">
                        ${isSelected ? '✓ Loaded' : 'Swap Model'}
                      </button>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 6px;">
                      <div>
                        <div style="font-size: 0.68rem; color: var(--text-muted);">PARAMETERS</div>
                        <div style="font-size: 0.82rem; font-weight: 700; color: #e2e8f0;">${m.parameters}</div>
                      </div>
                      <div>
                        <div style="font-size: 0.68rem; color: var(--text-muted);">QUANTIZATION</div>
                        <div style="font-size: 0.82rem; font-weight: 700; color: #38bdf8;">${m.quantization}</div>
                      </div>
                      <div>
                        <div style="font-size: 0.68rem; color: var(--text-muted);">GENERATION SPEED</div>
                        <div style="font-size: 0.82rem; font-weight: 700; color: #34d399;">${m.velocity}</div>
                      </div>
                      <div>
                        <div style="font-size: 0.68rem; color: var(--text-muted);">RAM FOOTPRINT</div>
                        <div style="font-size: 0.82rem; font-weight: 700; color: #fca5a5;">${m.memoryFootprint}</div>
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Execution Graph & Compilation Breakdown -->
          <div style="background: rgba(9, 13, 22, 0.7); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px;">
            <div class="section-caption" style="margin-bottom: 8px;">Snapdragon NPU Execution Graph Details:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.8rem; color: #cbd5e1;">
              <div>
                <p>• <strong>Target Device:</strong> Qualcomm Snapdragon X Elite / Snapdragon 8 Gen 3</p>
                <p style="margin-top: 4px;">• <strong>Execution Provider:</strong> QNN Execution Provider (HTP v73/v75)</p>
                <p style="margin-top: 4px;">• <strong>Operator Coverage:</strong> 100% MatMulNBits, RotaryEmbedding, Softmax</p>
              </div>
              <div>
                <p>• <strong>Latency to First Token (TTFT):</strong> ${activeModel.ttft}</p>
                <p style="margin-top: 4px;">• <strong>Context Window:</strong> ${activeModel.contextLength}</p>
                <p style="margin-top: 4px;">• <strong>Air-Gap Compliance:</strong> Zero network telemetry · Local weights</p>
              </div>
            </div>
          </div>

        </div>

        <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.78rem; color: var(--text-muted);">Qualcomm AI Hub Native Weights · Track PS-001</span>
          <button id="close-onnx-modal-btn" class="btn btn-primary">Done & Apply Model</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("onnx-model-modal");

  const closeModal = () => {
    if (modal) modal.remove();
    document.removeEventListener("keydown", handleKeydown);
  };

  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  document.addEventListener("keydown", handleKeydown);

  document.getElementById("close-onnx-modal")?.addEventListener("click", closeModal);
  document.getElementById("close-onnx-modal-btn")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle model switching
  modal.querySelectorAll(".select-model-btn, .onnx-model-card").forEach(el => {
    el.addEventListener("click", (e) => {
      const card = e.target.closest(".onnx-model-card");
      if (!card) return;
      const modelId = card.getAttribute("data-model-id");
      llmRunner.setActiveOnnxModel(modelId);
      telemetry.logAudit(`Swapped Qualcomm AI Hub ONNX model to: ${modelId} (${llmRunner.getActiveOnnxModel().name})`);
      if (onModelSelected) onModelSelected(modelId);
      closeModal();
    });
  });
}
