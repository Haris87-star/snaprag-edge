import fs from "fs";
import path from "path";

const srcDir = "c:\\Users\\Harish\\OneDrive\\Desktop\\Ai buildathon";
const backupDir = "c:\\Users\\Harish\\OneDrive\\Desktop\\Ai buildathon backup";

console.log("Synchronizing updated multi-domain engine files to backup...");

// 1. Copy sampleDatasets.js
fs.copyFileSync(
  path.join(srcDir, "src", "data", "sampleDatasets.js"),
  path.join(backupDir, "src", "data", "sampleDatasets.js")
);
console.log("✓ Synchronized sampleDatasets.js");

// 2. Copy documentProcessor.js
fs.copyFileSync(
  path.join(srcDir, "src", "engine", "documentProcessor.js"),
  path.join(backupDir, "src", "engine", "documentProcessor.js")
);
console.log("✓ Synchronized documentProcessor.js");

// 3. Copy llmRunner.js
fs.copyFileSync(
  path.join(srcDir, "src", "engine", "llmRunner.js"),
  path.join(backupDir, "src", "engine", "llmRunner.js")
);
console.log("✓ Synchronized llmRunner.js");

// 4. Update backup app.js so it has the multi-domain chips, welcome card, and category handling
let backupAppContent = fs.readFileSync(path.join(backupDir, "src", "app.js"), "utf8");

// Replace "What is the issue of the patient?" welcome card in backup app.js
backupAppContent = backupAppContent.replace(
  /\?\? Search scope is automatically focused on this file\. Try asking: <em>"What is the issue of the patient\?"<\/em>/g,
  `💡 Search scope is automatically focused on this file. Try asking a domain-specific question above!`
);

// Also replace standard string if present
backupAppContent = backupAppContent.replace(
  /💡 Search scope is automatically focused on this file\. Try asking: <em>"What is the issue of the patient\?"<\/em>/g,
  `💡 Search scope is automatically focused on this file. Try asking a domain-specific question above!`
);

// Replace the whole welcome card block in backup app.js
const oldWelcomeCardRegex = /const welcomeCard = `[\s\S]*?this\.addChatMessage\("assistant", welcomeCard\);/;
const newWelcomeCard = `let samplePrompt = "Summarize the key provisions of this document";
      if (lastDoc.category.includes("Legal") || /agreement|contract|nda|merger|lease/i.test(lastDoc.name)) {
        samplePrompt = "What is the liability cap and indemnity clause in this agreement?";
      } else if (lastDoc.category.includes("Medical") || /prescript|doctor|patient|clinical/i.test(lastDoc.name)) {
        samplePrompt = "What is the clinical diagnosis and prescribed medication regimen?";
      } else if (lastDoc.category.includes("Company") || /memo|board|strategy/i.test(lastDoc.name)) {
        samplePrompt = "Summarize the key strategic directives and organizational decisions";
      } else if (lastDoc.category.includes("Defense") || /satellite|tactical|spec/i.test(lastDoc.name)) {
        samplePrompt = "What are the technical operating specifications and safety envelopes?";
      }

      const welcomeCard = \`
        <p><strong>📄 Document Ingested & Scoped: "\${lastDoc.name}"</strong></p>
        <p style="margin-top: 4px; font-size: 0.85rem; color: var(--text-secondary);">
          Detected Domain: <strong>\${lastDoc.category}</strong> (\${lastDoc.chunks.length} chunks indexed locally on Snapdragon NPU).<br>
          Air-gap verification: <strong>Zero bytes transmitted outside device (100% on-device RAG).</strong>
        </p>
        <p style="margin-top: 8px; font-size: 0.84rem; color: var(--cyan-accent);">
          💡 Search scope is automatically focused on this file. Try asking: <em>"\${samplePrompt}"</em>
        </p>
      \`;
      this.addChatMessage("assistant", welcomeCard);`;

if (oldWelcomeCardRegex.test(backupAppContent)) {
  backupAppContent = backupAppContent.replace(oldWelcomeCardRegex, newWelcomeCard);
  console.log("✓ Updated welcomeCard in backup app.js");
}

// Update chips in backup app.js setActiveDocument
const oldChipsRegex = /if \(doc\.category\.includes\("Medical"\)[\s\S]*?this\.renderSuggestedChips\(\[\s*"Summarize the key directives in this document",[\s\S]*?\]\);\s*\}/;
const newChips = `if (doc.category.includes("Medical") || doc.name.toLowerCase().includes("prescript") || doc.name.toLowerCase().includes("doctor")) {
      this.renderSuggestedChips([
        "What is the issue of the patient?",
        "What medications are prescribed and at what times?",
        "Who is the treating doctor and clinic address?"
      ]);
    } else if (doc.category.includes("Legal") || doc.name.toLowerCase().includes("merger") || doc.name.toLowerCase().includes("contract") || doc.name.toLowerCase().includes("agreement")) {
      this.renderSuggestedChips([
        "What is the total purchase consideration and breakdown?",
        "What is the liability cap for Section 8.4 IP Indemnity?",
        "What are the non-compete covenants and governing law?"
      ]);
    } else if (doc.category.includes("Company") || doc.category.includes("Memo") || doc.name.toLowerCase().includes("memo")) {
      this.renderSuggestedChips([
        "Summarize the key restructuring decisions and revenue targets",
        "What are the 3 newly formed edge AI business units and who leads them?",
        "What are the penalties and non-disclosure obligations for leaks?"
      ]);
    } else {
      this.renderSuggestedChips([
        "Summarize the key directives in this document",
        "What are the mandatory technical specifications?",
        "What are the emergency anti-tamper or safety triggers?"
      ]);
    }`;

if (oldChipsRegex.test(backupAppContent)) {
  backupAppContent = backupAppContent.replace(oldChipsRegex, newChips);
  console.log("✓ Updated chips in backup app.js");
}

fs.writeFileSync(path.join(backupDir, "src", "app.js"), backupAppContent, "utf8");
console.log("✓ Saved backup app.js");
