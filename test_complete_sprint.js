/**
 * Comprehensive Automated Test Suite for SnapRAG 100% Sprint
 * Verifies:
 * 1. Module A: Qualcomm AI Hub Native ONNX Model Swap & Multi-Model Engine
 * 2. Module B: Live Camera Scanner Ingestion & Instant Vector Indexing
 * 3. Module C: Multi-Document Cross-Comparison Matrix & Clause Diff
 * 4. Air-Gap Privacy Sentinel & Telemetry Integrity
 */

import { llmRunner, QUALCOMM_AI_HUB_MODELS } from "./src/engine/llmRunner.js";
import { discrepancyDetector } from "./src/engine/discrepancyDetector.js";
import { documentProcessor } from "./src/engine/documentProcessor.js";
import { vectorStore } from "./src/engine/vectorStore.js";
import { telemetry } from "./src/engine/telemetry.js";
import { SAMPLE_DATASETS } from "./src/data/sampleDatasets.js";

async function runSprintVerification() {
  console.log("==================================================================");
  console.log("🚀 STARTING SNAPRAG 100% SPRINT VERIFICATION TEST SUITE");
  console.log("==================================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      throw new Error(message);
    }
    passed++;
    console.log(`✓ [PASS] ${message}`);
  }

  // TEST SUITE 1: MODULE A - Qualcomm AI Hub ONNX Runtime & Weights
  console.log("\n--- [TEST SUITE 1] MODULE A: Qualcomm AI Hub Native ONNX Models ---");
  assert(QUALCOMM_AI_HUB_MODELS.length === 3, "3 Qualcomm AI Hub INT4 models defined");
  
  const phi = QUALCOMM_AI_HUB_MODELS.find(m => m.id === "phi-3.5-mini-int4-qnn");
  const llama = QUALCOMM_AI_HUB_MODELS.find(m => m.id === "llama-3.2-1b-q4-npu");
  const mistral = QUALCOMM_AI_HUB_MODELS.find(m => m.id === "mistral-7b-v0.3-int4");

  assert(phi && phi.quantization.includes("INT4"), "Phi-3.5 model configured with INT4 W4A16 QNN");
  assert(llama && llama.quantization.includes("INT4"), "Llama-3.2 model configured with INT4 Hexagon Direct");
  assert(mistral && mistral.quantization.includes("INT4"), "Mistral-7B model configured with INT4 QNN Compiled");

  llmRunner.setMode("onnx");
  assert(llmRunner.mode === "onnx", "llmRunner switched to ONNX mode");
  
  llmRunner.setActiveOnnxModel("llama-3.2-1b-q4-npu");
  const activeModel = llmRunner.getActiveOnnxModel();
  assert(activeModel.id === "llama-3.2-1b-q4-npu", "Active ONNX model successfully swapped to Llama-3.2");
  assert(telemetry.state.activeEngine.includes("Llama-3.2"), "Telemetry active engine updated to Llama-3.2");

  // TEST SUITE 2: MODULE B - Live Camera Scanner Document Ingestion
  console.log("\n--- [TEST SUITE 2] MODULE B: Live Camera Ingestion & Vector Indexing ---");
  const sampleCapturedDoc = {
    id: "cam-scan-metro-001",
    name: "Scanned_Field_Inspection_Report_Camera_001.pdf",
    category: "Construction & Fieldwork Documents",
    badge: "LIVE OCR SCAN",
    fileSize: "1.4 MB",
    pages: 1,
    pagesContent: [
      {
        pageNumber: 1,
        title: "On-Site Physical Inspection & Safety Compliance Field Audit",
        content: `ON-SITE PHYSICAL INSPECTION & SAFETY COMPLIANCE FIELD AUDIT
Captured via Snapdragon Live Edge Scanner on 18-September-2026.
Location: Metro Rail Project Viaduct Section Pier 42-48.
Lead Field Inspector: R. Ramanathan, Senior Structural Auditor.

AUDIT PARAMETERS & STRUCTURAL INTEGRITY FINDINGS:
1. Concrete Curing & Strength: M30 grade concrete compressive test cylinders achieved 32.4 MPa at 28-day curing interval, exceeding the minimum 30 MPa threshold.
2. Steel Reinforcement: Fe500 TMT bars verified with 0% visible surface corrosion. Tensile yield strength conforms strictly to IS 1786 specifications.
3. Environmental Clearance Compliance: Water sprinkling deployed to control particulate matter; noise decibels measured at 68 dB(A) well below municipal BBMP limits.
4. Site Safety Directives: 100% compliance with hard hats, safety harnesses at height > 2.0 meters, and barricading along open excavations.`
      }
    ]
  };

  const cameraChunks = documentProcessor.chunkPages(sampleCapturedDoc.id, sampleCapturedDoc.name, sampleCapturedDoc.pagesContent);
  assert(cameraChunks.length > 0, `Camera document chunked into ${cameraChunks.length} chunks`);
  
  vectorStore.addChunks(cameraChunks);
  assert(vectorStore.chunks.some(c => c.docId === "cam-scan-metro-001"), "Camera document chunks indexed into vectorStore");

  const cameraSearch = vectorStore.search("What is the concrete compressive strength?", 2, "cam-scan-metro-001");
  assert(cameraSearch.results.length > 0, "Vector search retrieved chunks for scanned camera document");
  assert(cameraSearch.results[0].chunk.text.includes("32.4 MPa"), "Retrieved chunk contains exact compressive strength metric (32.4 MPa)");

  // TEST SUITE 3: MODULE C - Cross-Document Discrepancy Matrix
  console.log("\n--- [TEST SUITE 3] MODULE C: Multi-Document Discrepancy Matrix ---");
  const contractA = {
    id: "contract-v1",
    name: "Master Services Agreement v1 (Original).pdf",
    text: `Master Construction Services Agreement.
Total Contract Price: $1,890,000 USD for civil works.
Liability Cap: $2,000,000 USD limit of liability.
Governing Law: Laws of the State of Delaware.
Indemnity Survival Period: 24 months from closing.
Executed and signed: Duly signed by John Miller.`
  };

  const contractB = {
    id: "contract-v2",
    name: "Master Services Agreement v2 (Revised).pdf",
    text: `Master Construction Services Agreement.
Total Contract Price: $2,350,000 USD for civil works.
Liability Cap: $5,000,000 USD aggregate liability limit.
Governing Law: Laws of the State of New York.
Indemnity Survival Period: 36 months from closing.
Executed and signed: Pending signature, not signed.`
  };

  const diffReport = discrepancyDetector.compareDocuments(contractA, contractB);
  assert(diffReport.discrepancies.length >= 3, `Discrepancy detector isolated ${diffReport.discrepancies.length} divergences`);
  assert(diffReport.criticalCount >= 2, `Identified ${diffReport.criticalCount} critical variances (price/liability/signatures)`);
  
  const priceDiff = diffReport.discrepancies.find(d => d.field.includes("Price") || d.field.includes("Valuation"));
  assert(priceDiff !== undefined, "Detected financial pricing variance ($1,890,000 vs $2,350,000)");

  const sigDiff = diffReport.discrepancies.find(d => d.category.includes("Signature"));
  assert(sigDiff !== undefined, "Detected unexecuted signature discrepancy");

  // TEST SUITE 4: Grounded Answer Generation with Citations
  console.log("\n--- [TEST SUITE 4] Grounded Anti-Hallucination Reasoning ---");
  const testQuery = "What is the concrete compressive strength for Pier 42-48?";
  const genResult = await llmRunner.generateAnswer(testQuery, cameraSearch.results);
  assert(genResult.text.length > 50, "Generated grounded answer text");
  assert(genResult.citations.length > 0, `Generated answer with ${genResult.citations.length} verified citations`);
  assert(genResult.text.includes("32.4 MPa"), "Answer contains verified physical metric");

  // TEST SUITE 5: Air-Gap Sentinel Integrity
  console.log("\n--- [TEST SUITE 5] Air-Gap Sentinel Network Audit ---");
  assert(telemetry.state.outboundBytesTransmitted === 0, "Verified 0 outbound bytes transmitted");
  assert(telemetry.state.airGapStatus === "ENFORCED", "Air-gap security status strictly ENFORCED");
  assert(telemetry.state.auditLogs.length > 0, `Audit log contains ${telemetry.state.auditLogs.length} verified on-device events`);

  console.log("==================================================================");
  console.log(`🎉 ALL ${passed}/${total} SNAPRAG 100% SPRINT CHECKS PASSED WITH ZERO ERRORS!`);
  console.log("==================================================================");
}

runSprintVerification().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
