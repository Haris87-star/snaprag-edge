// End-to-end offline RAG verification test
import { SAMPLE_DATASETS } from "./src/data/sampleDatasets.js";
import { DocumentProcessor } from "./src/engine/documentProcessor.js";
import { EdgeVectorStore } from "./src/engine/vectorStore.js";
import { EdgeLlmRunner } from "./src/engine/llmRunner.js";

async function runVerification() {
  console.log("=== Testing SnapRAG 80% Core Engine ===");

  const processor = new DocumentProcessor();
  const vectorStore = new EdgeVectorStore();
  const llm = new EdgeLlmRunner();

  // 1. Test Ingestion of Clinical Trial Dataset
  const clinicalDoc = SAMPLE_DATASETS[0];
  console.log(`[1] Ingesting dataset: "${clinicalDoc.name}" (${clinicalDoc.pages} pages)...`);
  const chunks = processor.chunkPages(clinicalDoc.id, clinicalDoc.name, clinicalDoc.pagesContent);
  console.log(`    Generated ${chunks.length} semantic chunks.`);

  // 2. Test Vector Indexing
  vectorStore.loadChunks(chunks);
  console.log(`[2] Indexed ${vectorStore.chunks.length} chunks. Vocabulary size: ${vectorStore.vocabulary.size}`);

  // 3. Test Hybrid Search Query
  const query = "What is the maximum allowed dosage for Cohort B?";
  console.log(`[3] Executing query: "${query}"...`);
  const searchRes = vectorStore.search(query, 3);
  console.log(`    Found ${searchRes.results.length} relevant chunks in ${searchRes.latencyMs}ms:`);
  searchRes.results.forEach((r, idx) => {
    console.log(`      Rank ${idx + 1}: Score ${(r.score * 100).toFixed(1)}% | Page ${r.chunk.pageNumber} | "${r.chunk.sectionTitle}"`);
  });

  if (searchRes.results.length === 0 || searchRes.results[0].score < 0.2) {
    throw new Error("Search retrieval failed to match query!");
  }

  // 4. Test Grounded LLM Generation & Citations
  console.log(`[4] Generating grounded answer with citations...`);
  let streamed = "";
  const result = await llm.generateAnswer(query, searchRes.results, (token) => {
    streamed += token;
  });

  console.log("\n--- Generated Answer ---");
  console.log(result.text);
  console.log("------------------------");
  console.log(`    Citations extracted: ${result.citations.length}`);
  console.log(`    Generation time: ${result.totalTimeMs}ms (${result.tokenCount} tokens)`);

  if (!result.text.includes("25 mg/kg") || !result.text.includes("Cohort B")) {
    throw new Error("Grounded generation missed key factual answer!");
  }

  console.log("\n[SUCCESS] SnapRAG 80% Core RAG Pipeline passed all functional checks!");
}

runVerification().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
