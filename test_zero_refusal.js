import { SAMPLE_DATASETS } from "./src/data/sampleDatasets.js";
import { DocumentProcessor } from "./src/engine/documentProcessor.js";
import { EdgeVectorStore } from "./src/engine/vectorStore.js";
import { EdgeLlmRunner } from "./src/engine/llmRunner.js";

async function verifyAllQueries() {
  const processor = new DocumentProcessor();
  const vectorStore = new EdgeVectorStore();
  const llm = new EdgeLlmRunner();

  // Index all 4 datasets
  SAMPLE_DATASETS.forEach(d => {
    const chunks = processor.chunkPages(d.id, d.name, d.pagesContent);
    vectorStore.addChunks(chunks);
  });

  console.log(`Total indexed chunks: ${vectorStore.chunks.length}`);

  const testCases = [
    {
      docId: "legal-ma",
      query: "Summarize this document",
      expectedSnippet: "$485,000,000"
    },
    {
      docId: "legal-ma",
      query: "What is this agreement about?",
      expectedSnippet: "CyberDyne"
    },
    {
      docId: "legal-ma",
      query: "What is the liability cap for Section 8.4?",
      expectedSnippet: "$35,000,000"
    },
    {
      docId: "clinical-trial",
      query: "Explain this clinical protocol",
      expectedSnippet: "PHX-882"
    },
    {
      docId: "company-memo",
      query: "What are the key points?",
      expectedSnippet: "Sarah Lin"
    }
  ];

  for (const tc of testCases) {
    const search = vectorStore.search(tc.query, 4, tc.docId);
    if (search.results.length === 0) {
      throw new Error(`Zero chunks returned for query: "${tc.query}" on doc: ${tc.docId}`);
    }
    const ans = await llm.generateAnswer(tc.query, search.results);
    console.log(`✓ Query: "${tc.query}" -> ${search.results.length} chunks -> Answer generated (${ans.citations.length} citations)`);
    if (!ans.text.includes(tc.expectedSnippet)) {
      throw new Error(`Answer missing expected snippet "${tc.expectedSnippet}":\n${ans.text}`);
    }
  }

  console.log("\n>>> ALL SUMMARY, OVERVIEW, AND DETAILED QUERIES PASSED WITH ZERO REFUSALS! <<<");
}

verifyAllQueries().catch(err => {
  console.error(err);
  process.exit(1);
});
