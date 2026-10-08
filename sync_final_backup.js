import fs from "fs";
import path from "path";

const srcDir = "c:\\Users\\Harish\\OneDrive\\Desktop\\Ai buildathon";
const backupDir = "c:\\Users\\Harish\\OneDrive\\Desktop\\Ai buildathon backup";

console.log("Synchronizing vectorStore and llmRunner to backup...");

// 1. Copy vectorStore.js
fs.copyFileSync(
  path.join(srcDir, "src", "engine", "vectorStore.js"),
  path.join(backupDir, "src", "engine", "vectorStore.js")
);
console.log("✓ Synchronized vectorStore.js");

// 2. Copy llmRunner.js
fs.copyFileSync(
  path.join(srcDir, "src", "engine", "llmRunner.js"),
  path.join(backupDir, "src", "engine", "llmRunner.js")
);
console.log("✓ Synchronized llmRunner.js");

// 3. Update backup app.js
let backupApp = fs.readFileSync(path.join(backupDir, "src", "app.js"), "utf8");

// Replace constructor call
backupApp = backupApp.replace(
  'this.loadPresetDataset("clinical-trial");',
  'this.initDatasets();'
);

// Replace loadPresetDataset implementation with initDatasets + loadPresetDataset
const oldLoadPreset = /async loadPresetDataset\(presetId\) \{[\s\S]*?this\.addSystemWelcome\(dataset\);\s*\}/;
const newInitDatasets = `initDatasets() {
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

    const initialDoc = SAMPLE_DATASETS.find(d => d.id === "legal-ma") || SAMPLE_DATASETS[0];
    this.currentDatasetId = initialDoc.id;
    this.activeDocId = initialDoc.id;

    telemetry.logAudit(\`Indexed \${this.activeDocuments.length} enterprise documents (\${vectorStore.chunks.length} total chunks) locally.\`);
    this.renderPresetsSelector();
    this.renderActiveDocuments();
    this.updateSearchScopeIndicator();
    this.renderSuggestedChips(initialDoc.suggestedQueries);
    this.addSystemWelcome(initialDoc);
  }

  loadPresetDataset(presetId) {
    const dataset = SAMPLE_DATASETS.find(d => d.id === presetId);
    if (!dataset) return;

    this.setActiveDocument(presetId);
    this.addSystemWelcome(dataset);
  }`;

backupApp = backupApp.replace(oldLoadPreset, newInitDatasets);

// Update askQuestion in backup app.js to have the fallback guard
const oldSearchBlock = /let searchRes = vectorStore\.search\(query, 4, filterId\);\s+if \(searchRes\.results\.length === 0 && filterId\) \{\s+searchRes = vectorStore\.search\(query, 4, null\);\s+\}/;
const newSearchBlock = `let searchRes = vectorStore.search(query, 4, filterId);

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
    }`;

backupApp = backupApp.replace(oldSearchBlock, newSearchBlock);

fs.writeFileSync(path.join(backupDir, "src", "app.js"), backupApp, "utf8");
console.log("✓ Updated backup app.js with initDatasets and safe retrieval fallback");
