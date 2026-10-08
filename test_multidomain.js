import { SAMPLE_DATASETS } from "./src/data/sampleDatasets.js";
import { DocumentProcessor } from "./src/engine/documentProcessor.js";
import { EdgeVectorStore } from "./src/engine/vectorStore.js";
import { EdgeLlmRunner } from "./src/engine/llmRunner.js";

async function verifyAllDomains() {
  const processor = new DocumentProcessor();
  const vectorStore = new EdgeVectorStore();
  const llm = new EdgeLlmRunner();

  console.log("=== QUALCOMM ON-DEVICE RAG MULTI-DOMAIN TEST ===");

  // 1. Legal Contract Preset
  const legalDoc = SAMPLE_DATASETS.find(d => d.id === "legal-ma");
  const legalChunks = processor.chunkPages(legalDoc.id, legalDoc.name, legalDoc.pagesContent);
  vectorStore.addChunks(legalChunks);

  const q1 = "What is the liability cap for Section 8.4 Intellectual Property Indemnity?";
  const res1 = vectorStore.search(q1, 3, legalDoc.id);
  const ans1 = await llm.generateAnswer(q1, res1.results);
  console.log("\n[Test 1 - Preset Legal Contract]");
  console.log("Query:", q1);
  console.log("Answer:", ans1.text.substring(0, 160) + "...");
  console.log("Citations:", ans1.citations.map(c => `${c.docName} p.${c.pageNumber}`));
  if (!ans1.text.includes("$35,000,000")) throw new Error("Legal liability cap failed!");

  // 2. Custom Uploaded Legal Contract (Simulated)
  const customContract = {
    id: "custom-lease",
    name: "Commercial Office Lease Agreement - 2026.pdf",
    category: "Legal / Enterprise Contracts",
    pages: 1,
    pagesContent: [
      {
        pageNumber: 1,
        title: "Lease Terms & Security Deposit",
        content: "This Commercial Lease is entered into by Landlord Horizon Towers and Tenant Vertex Labs. Monthly rent shall equal $42,500 USD due on the first of every month. Tenant shall deposit a security deposit of $127,500 with Wells Fargo Bank. The liability of Tenant for property damages shall be strictly capped at $250,000 USD."
      }
    ]
  };
  const customChunks = processor.chunkPages(customContract.id, customContract.name, customContract.pagesContent);
  vectorStore.addChunks(customChunks);

  const q2 = "What is the liability cap for property damages?";
  const res2 = vectorStore.search(q2, 2, customContract.id);
  const ans2 = await llm.generateAnswer(q2, res2.results);
  console.log("\n[Test 2 - Custom Uploaded Contract]");
  console.log("Query:", q2);
  console.log("Answer:", ans2.text);
  if (!ans2.text.includes("$250,000")) throw new Error("Custom contract extraction failed!");

  // 3. Medical Record Preset
  const medDoc = SAMPLE_DATASETS.find(d => d.id === "clinical-trial");
  const medChunks = processor.chunkPages(medDoc.id, medDoc.name, medDoc.pagesContent);
  vectorStore.addChunks(medChunks);

  const q3 = "What is the maximum allowed dosage for Cohort B?";
  const res3 = vectorStore.search(q3, 2, medDoc.id);
  const ans3 = await llm.generateAnswer(q3, res3.results);
  console.log("\n[Test 3 - Medical Clinical Protocol]");
  console.log("Query:", q3);
  console.log("Answer:", ans3.text.substring(0, 160) + "...");
  if (!ans3.text.includes("25 mg/kg")) throw new Error("Medical dosage failed!");

  // 4. Company Strategic Memo Preset
  const memoDoc = SAMPLE_DATASETS.find(d => d.id === "company-memo");
  const memoChunks = processor.chunkPages(memoDoc.id, memoDoc.name, memoDoc.pagesContent);
  vectorStore.addChunks(memoChunks);

  const q4 = "Summarize the key restructuring decisions and revenue targets";
  const res4 = vectorStore.search(q4, 2, memoDoc.id);
  const ans4 = await llm.generateAnswer(q4, res4.results);
  console.log("\n[Test 4 - Internal Company Board Memo]");
  console.log("Query:", q4);
  console.log("Answer:", ans4.text.substring(0, 160) + "...");
  if (!ans4.text.includes("$2.40 Billion") || !ans4.text.includes("Sarah Lin")) throw new Error("Company memo failed!");

  console.log("\n>>> ALL MULTI-DOMAIN TESTS PASSED WITH 100% GROUNDED ACCURACY! <<<");
}

verifyAllDomains().catch(e => {
  console.error(e);
  process.exit(1);
});
