/**
 * Tabular Data to Structured JSON / CSV Exporter
 * Extracts structured table rows from unstructured or semi-structured scanned documents
 * (e.g. Bill of Quantities, itemized hospital bills, financial statements, utility tariff schedules)
 * and formats them into clean JSON objects and downloadable RFC-4180 CSV files.
 */

export class TableExtractor {
  /**
   * Automatically parses document text and identifies tabular structures
   */
  extractTables(documentName, text) {
    const lines = (text || "").split("\n").map(l => l.trim()).filter(Boolean);
    const rows = [];

    // 1. Check for Bill of Quantities (BOQ) structure
    // e.g. "Item 101 (Excavation in Hard Rock): 42,000 cu.m @ $45.00/cu.m = $1,890,000 USD"
    const boqRegex = /Item\s*(\d+)[\s:]+(.+?)[:\-]?\s+([\d,]+(?:\.\d+)?)\s*([a-zA-Z\.\/\s]+?)\s*@\s*([\$€₹INR\d\.,]+(?:\/[a-zA-Z\.\/]+)?)\s*=\s*([\$€₹INR\d\.,\s]+(?:USD|INR)?)/i;

    // 2. Check for Pharmacy / Medical itemization
    // e.g. "1. Tab. Zolax Plus / 21 Kulam Plus (Alprazolam 0.5mg) - 1 Tablet Morning, 1 Tablet Night (Dosage: 1-0-1)"
    const medRegex = /^(\d+)\.\s+(?:Tab\.|Cap\.|Inj\.)\s+(.+?)\s*\((.+?)\)\s*[-:]\s*(.+?)\s*(?:\(Dosage:\s*([0-9\-]+)\))?$/i;

    // 3. Check for Utility Bill / Ledger itemization
    // e.g. "Energy Charges (Normal Slab): 380 kWh @ ₹7.25/kWh = ₹2,755.00"
    const utilityRegex = /^(.*?):\s*([\d,]+(?:\.\d+)?)\s*([a-zA-Z\.\/]+)?\s*@\s*([\$€₹INR\d\.,]+(?:\/[a-zA-Z\.\/]+)?)\s*=\s*([\$€₹INR\d\.,\s]+)/i;

    // 4. Pipe-delimited or comma-delimited table rows
    for (const line of lines) {
      if (line.includes("|") && line.split("|").length >= 3) {
        const cols = line.split("|").map(c => c.trim()).filter(Boolean);
        if (cols.length >= 2 && !cols[0].includes("---")) {
          rows.push({
            Item: cols[0],
            Description: cols[1],
            Quantity: cols[2] || "1",
            UnitRate: cols[3] || "-",
            Total: cols[4] || cols[cols.length - 1] || "-"
          });
        }
        continue;
      }

      const boqMatch = line.match(boqRegex);
      if (boqMatch) {
        rows.push({
          ItemCode: `ITEM-${boqMatch[1]}`,
          Description: boqMatch[2].replace(/[()]/g, "").trim(),
          Quantity: boqMatch[3].trim(),
          Unit: boqMatch[4].trim(),
          UnitRate: boqMatch[5].trim(),
          TotalAmount: boqMatch[6].trim()
        });
        continue;
      }

      const medMatch = line.match(medRegex);
      if (medMatch) {
        rows.push({
          ItemCode: `MED-${medMatch[1]}`,
          Description: medMatch[2].trim(),
          GenericComposition: medMatch[3].trim(),
          Regimen: medMatch[4].trim(),
          DosageSchedule: medMatch[5] || "As Prescribed"
        });
        continue;
      }

      const utilMatch = line.match(utilityRegex);
      if (utilMatch && utilMatch[1].length > 3 && utilMatch[1].length < 50) {
        rows.push({
          LineItem: utilMatch[1].trim(),
          QuantityUnits: `${utilMatch[2] || ""} ${utilMatch[3] || ""}`.trim(),
          TariffRate: utilMatch[4] ? utilMatch[4].trim() : "Standard",
          CalculatedAmount: utilMatch[5].trim()
        });
      }
    }

    // Fallback: If no strict regex rows matched, parse key-value bullet points
    if (rows.length === 0) {
      for (const line of lines) {
        if (line.startsWith("-") || line.startsWith("•")) {
          const colonIdx = line.indexOf(":");
          if (colonIdx > 0) {
            rows.push({
              Parameter: line.slice(1, colonIdx).trim(),
              Value: line.slice(colonIdx + 1).trim()
            });
          }
        }
      }
    }

    return {
      document: documentName,
      extractedAt: new Date().toISOString(),
      rowCount: rows.length,
      data: rows
    };
  }

  /**
   * Converts structured array into RFC-4180 CSV string
   */
  toCsv(data) {
    if (!data || !data.length) return "";
    const headers = Object.keys(data[0]);
    const escapeCsv = (val) => {
      const s = String(val ?? "");
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const headerLine = headers.map(escapeCsv).join(",");
    const rowLines = data.map(row => headers.map(h => escapeCsv(row[h])).join(","));
    return [headerLine, ...rowLines].join("\r\n");
  }

  /**
   * Triggers client-side browser download of CSV file
   */
  downloadCsv(data, filename = "document_extracted_table.csv") {
    const csvContent = this.toCsv(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Triggers client-side browser download of JSON file
   */
  downloadJson(data, filename = "document_extracted_table.json") {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const tableExtractor = new TableExtractor();
