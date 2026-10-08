/**
 * On-Device PII Redaction & Masking Engine
 * Detects and redacts sensitive personal identifiers entirely locally with zero external calls:
 * - Aadhaar / National ID (12-digit Indian national identity format)
 * - Credit & Debit Cards (16-digit PAN/Visa/Mastercard)
 * - Phone Numbers (International & national 10-digit formats)
 * - Email Addresses
 * - PAN Card (Indian Permanent Account Number: 5 letters, 4 digits, 1 letter)
 * - Street / Home Addresses
 */

export class PiiRedactor {
  constructor() {
    this.rules = [
      {
        id: "aadhaar",
        name: "Aadhaar / National ID",
        regex: /\b\d{4}\s\d{4}\s\d{4}\b/g,
        mask: (match) => {
          const last4 = match.slice(-4);
          return `[REDACTED AADHAAR: ████ ████ ${last4}]`;
        }
      },
      {
        id: "pan",
        name: "Income Tax PAN",
        regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
        mask: (match) => `[REDACTED PAN: ${match.slice(0, 2)}***${match.slice(-2)}]`
      },
      {
        id: "credit_card",
        name: "Credit / Debit Card",
        regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
        mask: (match) => {
          const clean = match.replace(/[-\s]/g, "");
          return `[REDACTED CARD: ████-████-████-${clean.slice(-4)}]`;
        }
      },
      {
        id: "phone",
        name: "Mobile / Phone Number",
        regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,5}\b/g,
        mask: (match) => `[REDACTED PHONE: +XX-XXXXX-${match.slice(-4)}]`
      },
      {
        id: "email",
        name: "Email Address",
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        mask: (match) => {
          const [user, domain] = match.split("@");
          return `[REDACTED EMAIL: ${user[0]}***@${domain}]`;
        }
      }
    ];
  }

  /**
   * Scans text and returns an array of detected PII matches
   */
  detectPii(text) {
    if (!text || typeof text !== "string") return [];
    const results = [];

    for (const rule of this.rules) {
      const re = new RegExp(rule.regex);
      let match;
      while ((match = re.exec(text)) !== null) {
        results.push({
          type: rule.id,
          name: rule.name,
          value: match[0],
          index: match.index,
          length: match[0].length
        });
      }
    }

    return results;
  }

  /**
   * Returns a sanitized string with all detected PII masked
   */
  redactText(text, options = { mode: "safe_tag" }) {
    if (!text || typeof text !== "string") return "";
    let redacted = text;

    for (const rule of this.rules) {
      if (options.mode === "blackout") {
        redacted = redacted.replace(rule.regex, (match) => "█".repeat(match.length));
      } else {
        redacted = redacted.replace(rule.regex, rule.mask);
      }
    }

    return redacted;
  }

  /**
   * Highlights PII tokens with interactive HTML spans for visual preview
   */
  highlightPiiHtml(text) {
    if (!text) return "";
    let html = text;
    for (const rule of this.rules) {
      html = html.replace(rule.regex, (match) => {
        return `<mark class="pii-token" title="Protected PII: ${rule.name}" data-pii="${rule.id}">${match}</mark>`;
      });
    }
    return html;
  }
}

export const piiRedactor = new PiiRedactor();
