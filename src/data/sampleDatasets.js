/**
 * Pre-loaded realistic confidential documents for Qualcomm Edge AI Hackathon demonstration.
 * Covers all 5 key enterprise and personal document domains:
 * 1. Legal & Real Estate Documents
 * 2. Medical & Healthcare Records
 * 3. Business & Financial Records
 * 4. Construction & Fieldwork Documents
 * 5. Academic & Technical Files
 */

export const SAMPLE_DATASETS = [
  {
    id: "clinical-trial",
    name: "PHX-882 Phase-III Oncology Clinical Protocol (Confidential).pdf",
    category: "Medical & Healthcare Records",
    badge: "HIPAA Protected",
    icon: "activity",
    fileSize: "1.4 MB",
    pages: 4,
    summary: "Phase-III double-blind clinical study on solid tumors detailing patient dosage cohorts, hepatotoxicity escalation criteria, and adverse event protocols.",
    suggestedQueries: [
      "Explain this file and its primary clinical objectives",
      "What is the maximum allowed dosage for Cohort B and how often is it administered?",
      "What are the mandatory stopping rules if ALT or AST liver enzymes elevate?",
      "Which patients are strictly excluded based on autoimmune history?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Section 1: Protocol Overview & Patient Cohort Stratification",
        content: `CONFIDENTIAL - INVESTIGATIONAL USE ONLY
CLINICAL STUDY PROTOCOL: PHX-882-ONC-301
STUDY TITLE: A Phase 3, Multi-Center, Double-Blind, Randomized Trial of PHX-882 (Dual Tyrosine Kinase Inhibitor) in Patients with Refractory Advanced Solid Tumors.

1.1 DOSAGE STRATIFICATION & ADMINISTRATION SCHEDULE
Patients are enrolled across two active treatment arms following a 1:1 randomization schema:
- Cohort A (Standard Dose): Administered 15 mg/kg via intravenous (IV) infusion every 3 weeks (Q3W) over a 60-minute duration (+/- 10 minutes).
- Cohort B (High-Dose Escalation): Administered 25 mg/kg via intravenous (IV) infusion every 2 weeks (Q2W) over a 90-minute duration.
Dose modifications for Cohort B: In the event of persistent Grade 2 toxicities lasting greater than 7 consecutive days, the dose shall be stepped down immediately to 20 mg/kg Q2W. No dose re-escalation is permitted under any circumstances once reduction has occurred.`
      },
      {
        pageNumber: 2,
        title: "Section 2: Toxicity Management & Hepatotoxicity Safeguards",
        content: `2.3 HEPATIC SAFETY & ENZYME THRESHOLD ACTION PLAN
Liver function tests (LFTs) including alanine aminotransferase (ALT), aspartate aminotransferase (AST), and total bilirubin must be obtained every 7 days during Cycles 1 to 3, and every 14 days thereafter.

MANDATORY STOPPING RULES & INTERVENTIONS:
1. Grade 2 AST/ALT Elevation (3.0x to 5.0x Upper Limit of Normal [ULN]):
   - Withhold PHX-882 dosing immediately.
   - Perform repeat liver function panel within 48 to 72 hours.
   - Resume dosing at a 20% dose reduction only when AST/ALT resolves to <= 1.5x ULN.
2. Grade 3 AST/ALT Elevation (> 5.0x to 20.0x ULN) OR Total Bilirubin > 2.0x ULN (Hy's Law Indicator):
   - Permanently discontinue study drug PHX-882.
   - Initiate oral corticosteroid therapy (prednisone 1 mg/kg/day or equivalent) within 24 hours.
   - Hospital admission for continuous hemodynamic and hepatic monitoring until resolution.`
      },
      {
        pageNumber: 3,
        title: "Section 3: Inclusion and Exclusion Criteria",
        content: `3.1 PATIENT ELIGIBILITY RESTRICTIONS
Patients must meet all protocol inclusion criteria and none of the following disqualifying conditions:

EXCLUSION CRITERIA:
1. Prior Systemic Immunotherapy: Any administration of checkpoint inhibitors (anti-PD-1, anti-PD-L1, anti-CTLA-4) within 28 days prior to Day 1 Cycle 1.
2. Autoimmune Conditions: Known active autoimmune diseases requiring systemic disease-modifying antirheumatic drugs (DMARDs) or biologic immunosuppressants within the past 2 years (e.g., systemic lupus erythematosus, Crohn's disease, rheumatoid arthritis).
3. Cardiac Clearance: Baseline QTcF interval > 470 milliseconds on screening 12-lead ECG, history of New York Heart Association (NYHA) Class III or IV congestive heart failure.
4. Active CNS Metastases: Symptomatic brain metastases or leptomeningeal disease unless definitively irradiated and clinically stable for >= 90 days off systemic steroids.`
      },
      {
        pageNumber: 4,
        title: "Section 4: Air-Gapped Data Handling & Patient Confidentiality",
        content: `4.5 DATA INTEGRITY & PRIVACY PROTOCOL
Due to strict international regulatory compliance under HIPAA, GDPR Article 9, and national genomic data laws:
- All raw genomic sequencing and electronic health records (EHR) must remain strictly within local hospital infrastructure.
- Cloud transmission of de-identified patient telemetry is strictly prohibited without explicit multi-signature Institutional Review Board (IRB) exemption.
- On-device edge processing systems deployed at clinical trial sites must maintain zero outbound internet connectivity during clinical reasoning cycles.`
      }
    ]
  },
  {
    id: "prescription-record",
    name: "Dr. Nagendar Rao - Neuro-Psychiatric Prescription (Scanned).jpg",
    category: "Medical & Healthcare Records",
    badge: "Clinical Prescription",
    icon: "activity",
    fileSize: "1.2 MB",
    pages: 1,
    summary: "Clinical consultation record from Dr. Y. Nagendar Rao for patient Mr. Srinivas detailing diagnosis of Chronic Schizophrenia, 5 prescribed medications, and physician directives.",
    suggestedQueries: [
      "Explain this file and provide an executive medical summary",
      "What are the patient's primary clinical issues and diagnoses?",
      "What are the 5 medications prescribed and their dosages?",
      "Who is the treating doctor and clinic location?",
      "What are the lifestyle instructions and lab investigations ordered?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Scanned Prescription & Consultation Record (Qualcomm On-Device OCR)",
        content: `CONFIDENTIAL MEDICAL CONSULTATION & PRESCRIPTION RECORD
FACILITY: Neuro-Psychiatric Clinic, Secunderabad
TREATING PHYSICIAN: Dr. Y. Nagendar Rao, M.D. (OSM), D.P.M., M.I.P.S., F.I.P.S.
SPECIALTY: Consultant Neuro-Psychiatrist (Regd. No. 9072 A.P.)
CLINIC LOCATION: Flat # 105, Santhi Priya Enclave, Padmarao Nagar, Secunderabad - 500 025
DATE OF CONSULTATION: 15-09-2026
PATIENT NAME: Mr. Srinivas (Adult Male)
SOURCE DOCUMENT: Dr. Nagendar Rao - Neuro-Psychiatric Prescription (Scanned).jpg [Qualcomm On-Device OCR]

SECTION 1: CLINICAL PRESENTATION & DIAGNOSTIC FINDINGS (PATIENT ISSUES & SYMPTOMS):
The patient presents with significant neuropsychiatric complaints of approximately 6 months duration:
1. Chronic Schizophrenia (Chr. Schizophrenia): Manifesting with impaired reality testing, thought process irregularities, and emotional blunting.
2. Clinical Depression with Psychotic Symptoms: Pervasive depressed mood, anhedonia, and psychomotor agitation.
3. Severe Sleep Disturbance & Insomnia: Inability to initiate or maintain restorative sleep.
4. Sensory Hallucinations: Auditory and sensory perceptual disturbances reported during active distress.
5. Hypochondriasis & Somatization: Persistent distress and disproportionate anxiety concerning physical health symptoms.

SECTION 2: PRESCRIBED PHARMACOTHERAPY & MEDICATION REGIMEN (TABLETS & DOSAGES):
1. Tab. Zolax Plus / 21 Kulam Plus (Alprazolam 0.5mg + SSRI adjunct) - 1 Tablet Morning, 1 Tablet Night (Dosage: 1-0-1)
2. Tab. Qutan 100mg (Quetiapine - Atypical Antipsychotic for schizophrenia & mood stabilization) - 1 Tablet Night (Dosage: 0-0-1)
3. Tab. Ativan 2mg (Lorazepam - High-potency Benzodiazepine for severe agitation and acute insomnia) - 1 Tablet Night (Dosage: 0-0-1)
4. Tab. Rivotril 0.5mg (Clonazepam - Long-acting Anxiolytic / Anticonvulsant) - 1 Tablet Night (Dosage: 0-0-1)
5. Tab. Nexito 10mg / Escitalopram (Selective Serotonin Reuptake Inhibitor for clinical depression) - 1 Tablet Morning (Dosage: 1-0-0)

SECTION 3: PHYSICIAN DIRECTIVES, LIFESTYLE ADVICE & CLINICAL MONITORING:
- Diagnostic Investigation Order: Check Random Blood Sugar (RBS) and routine liver/kidney function tests before next review.
- Lifestyle Instructions: Avoid cold water exposure, maintain a regular sleep-wake schedule.
- Regular Clinic Review: Review at clinic between 4:00 PM - 8:00 PM with Dr. Y. Nagendar Rao.
- Emergency Protocol: Proceed immediately to Asha Hospital in case of acute psychiatric emergency or exacerbation.
Signed: Dr. Y. Nagendar Rao (Consultant Neuro-Psychiatrist)
[On-Device OCR Verified: Processed 100% locally on Qualcomm Snapdragon NPU with Zero Cloud Transmission]`
      }
    ]
  },
  {
    id: "legal-ma",
    name: "Project Titan - Confidential Merger Agreement & Indemnification.pdf",
    category: "Legal & Real Estate Documents",
    badge: "Strict NDA",
    icon: "shield",
    fileSize: "2.1 MB",
    pages: 3,
    summary: "Definitive Agreement and Plan of Merger between CyberDyne Dynamics and Apex AI Ltd detailing valuation, indemnity caps, and non-competes.",
    suggestedQueries: [
      "Explain this legal agreement and summarize its key terms",
      "What is the total purchase consideration and cash vs equity breakdown?",
      "What is the liability cap and survival period for Section 8.4 Intellectual Property Indemnity?",
      "What are the geographical and temporal constraints in the non-compete covenant?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Article I & II: Transaction Terms & Purchase Consideration",
        content: `CONFIDENTIAL - PRIVILEGED ATTORNEY-CLIENT WORK PRODUCT
AGREEMENT AND PLAN OF MERGER BY AND BETWEEN CYBERDYNE DYNAMICS CORP. AND APEX AI TECHNOLOGIES LTD.

SECTION 2.1 PURCHASE CONSIDERATION
Upon the terms and subject to the conditions set forth in this Agreement, the aggregate purchase consideration to be paid by Acquirer to Equityholders shall equal $485,000,000 (Four Hundred Eighty-Five Million U.S. Dollars), structured as follows:
(a) $360,000,000 payable in cash via wire transfer of immediately available federal funds at the Effective Closing Time;
(b) $75,000,000 in unregistered shares of Acquirer Class A Common Stock, valued based on the 30-day Volume Weighted Average Price (VWAP) ending 2 business days prior to closing;
(c) $50,000,000 deposited into an escrow account with JPMorgan Chase Bank, N.A., as Indemnity Escrow to satisfy potential post-closing claims under Article VIII.`
      },
      {
        pageNumber: 2,
        title: "Article VIII: Indemnification & Special IP Liabilities",
        content: `SECTION 8.4 SPECIAL INTELLECTUAL PROPERTY INDEMNIFICATION
(a) Sellers and Founders shall jointly and severally indemnify, defend, and hold harmless Acquirer, its Affiliates, and their respective officers from and against any Losses arising from any claim or allegation of Third-Party Patent or Proprietary AI Architecture infringement regarding the Core Edge Neural Engine.
(b) LIABILITY CAP: The maximum aggregate liability of Sellers for any and all claims arising under Section 8.4 shall be strictly capped at $35,000,000 (Thirty-Five Million U.S. Dollars).
(c) SURVIVAL PERIOD: The representations, warranties, and special covenants in Section 8.4 shall survive for a period of exactly twenty-four (24) months following the Closing Date.
(d) BASKET / DEDUCTIBLE: Acquirer shall not be entitled to recover indemnification under Section 8.4 until the aggregate amount of all Losses exceeds $500,000 (the "Deductible"), after which Acquirer may recover all Losses from the first dollar.`
      },
      {
        pageNumber: 3,
        title: "Article IX: Restrictive Covenants & Dispute Arbitration",
        content: `SECTION 9.2 NON-COMPETE RESTRICTIONS
For a duration of thirty-six (36) months following the Closing Date, neither the Key Executives nor Major Shareholders shall, directly or indirectly, establish, invest in, advise, or operate any commercial business that designs on-device neural processing software or edge RAG inference engines within North America, the European Union, or the Asia-Pacific (APAC) region.

SECTION 11.5 GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by, and construed in accordance with, the laws of the State of Delaware. Any dispute, controversy, or claim arising out of or relating to this contract shall be submitted to and conclusively resolved by binding arbitration administered by the Singapore International Arbitration Centre (SIAC) in accordance with the Arbitration Rules of SIAC.`
      }
    ]
  },
  {
    id: "company-memo",
    name: "Executive Board Memo - Strategic AI Roadmap & Org Restructuring.pdf",
    category: "Business & Financial Records",
    badge: "Board Confidential",
    icon: "briefcase",
    fileSize: "1.8 MB",
    pages: 2,
    summary: "Confidential board memorandum detailing corporate reorganization into 3 edge business units, revenue projections of $2.4B ARR by Q4 2027, and key executive appointments.",
    suggestedQueries: [
      "Explain this memorandum and summarize the key restructuring decisions",
      "What are the 3 newly formed edge AI business units and who leads them?",
      "What are the revenue targets and capital allocations?",
      "What are the penalties and non-disclosure obligations for unauthorized leaks?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Section 1: Executive Summary & Corporate Reorganization",
        content: `STRICTLY CONFIDENTIAL - FOR BOARD OF DIRECTORS ONLY
MEMORANDUM: 2026-Q3 STRATEGIC RESTRUCTURING AND EDGE NPU COMMERCIALIZATION

1.1 STRATEGIC DIRECTIVE & REORGANIZATION
Effective October 1, 2026, the company will consolidate all global product divisions into three autonomous, high-velocity business units:
1. Edge NPU & Mobile Intelligence BU: Headed by Chief AI Architect Dr. Sarah Lin, focused on Snapdragon on-device RAG software stacks and sub-watt INT4 inference.
2. Automotive Cockpit & Telematics BU: Directed by Marcus Vance, deploying zero-latency perception models into Tier-1 EV manufacturers.
3. Defense & Mission-Critical Systems BU: Led by Col. David Chen (Ret.), delivering ruggedized satellite terminals and tamper-proof tactical communications.

1.2 FINANCIAL TARGETS & CAPITAL ALLOCATION
- Target Annual Recurring Revenue (ARR): Scaled from current $820M to $2.40 Billion by Q4 2027.
- R&D Reinvestment: 32% of top-line revenue ($450M allocated for FY27) earmarked exclusively for custom Hexagon NPU micro-architecture acceleration.`
      },
      {
        pageNumber: 2,
        title: "Section 2: Confidentiality Obligations & Enforcement",
        content: `2.4 NON-DISCLOSURE DIRECTIVES & LEGAL RECOURSE
This memorandum constitutes material non-public information (MNPI) under SEC Regulation FD and international securities legislation.
- Permitted Distribution: Limited strictly to voting members of the Board of Directors and designated C-suite officers.
- Penalties for Breach: Any unauthorized leak, external transmission, or cloud upload of this document results in immediate summary dismissal, total forfeiture of unvested equity options (estimated value $4.2M per executive), and immediate filing for preliminary injunctive relief in the Delaware Court of Chancery.`
      }
    ]
  },
  {
    id: "construction-boq",
    name: "Metro Transit Line 4 - Bill of Quantities (BOQ) & Site Safety Report.pdf",
    category: "Construction & Fieldwork Documents",
    badge: "Field Engineering",
    icon: "layers",
    fileSize: "2.8 MB",
    pages: 2,
    summary: "Civil infrastructure procurement document detailing M30 concrete volumes, Fe500 TMT steel bar rates, municipal permits, and weekly site safety inspection findings.",
    suggestedQueries: [
      "Explain this file and its key procurement figures",
      "What are the quantities and unit rates for M30 grade concrete and Fe500 TMT steel?",
      "What municipal building permits and environmental clearances are cited?",
      "What are the findings of the daily site safety inspection checklist?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Section 1: Bill of Quantities (BOQ) & Material Procurement Rates",
        content: `CONFIDENTIAL - INFRASTRUCTURE PROCUREMENT DIVISION
PROJECT: METRO TRANSIT ELEVATED VIADUCT PACKAGE-4
DOCUMENT: BILL OF QUANTITIES (BOQ) AND RATE SPECIFICATION

1.1 CIVIL WORKS PROCUREMENT SCHEDULE
- Item 101 (Excavation in Hard Rock): 42,000 cu.m @ $45.00/cu.m = $1,890,000 USD.
- Item 102 (Reinforced Cement Concrete - M30 Grade for Piers & Portals): 18,500 cu.m @ $185.00/cu.m = $3,422,500 USD.
- Item 103 (High-Yield Corrosion-Resistant Fe500 TMT Reinforcement Steel Bars): 3,200 Metric Tonnes (MT) @ $850.00/MT = $2,720,000 USD.
- Total Civil Construction Package Value: $8,032,500 USD with 10% performance retention bank guarantee deposited with State Infrastructure Bank.
- Payment Terms: Monthly running bills verified by Chartered Civil Engineer within 14 calendar days.`
      },
      {
        pageNumber: 2,
        title: "Section 2: Municipal Permits, Clearances & Site Safety Checklist",
        content: `2.1 REGULATORY PERMITS & STATUTORY COMPLIANCE
- Municipal Sanction Order: BBMP/METRO/SANCTION-2026/8842 approving 14 elevated pier footings with minimum 3.5m road setback.
- State Environmental Clearance: Air & Noise Quality Compliance Certificate issued by State Pollution Control Board (Ref: PCB/ENV/2026-B).
- Structural Stability Certificate: Certified by Chief Structural Consultant Er. K. V. Ramanathan (Chartered Engineer No. CE-44910).

2.2 WEEKLY SITE SAFETY & OSHA COMPLIANCE CHECKLIST
- Mandatory PPE: 100% hard-hat, high-visibility vest, and steel-toed boot compliance verified across 185 active site workers.
- Fall Protection: Dual-lanyard safety harnesses mandatory for all scaffolding operations above 2.0 meters.
- Incident Log: Zero lost-time injuries (LTI) recorded over 120 consecutive working days. Daily safety toolbox briefings held at 07:30 AM.`
      }
    ]
  },
  {
    id: "defense-spec",
    name: "Snapdragon X-900 Satellite Mesh Field Ops Manual (Restricted).pdf",
    category: "Academic & Technical Files",
    badge: "Classified Spec",
    icon: "cpu",
    fileSize: "3.2 MB",
    pages: 3,
    summary: "Technical field manual for ruggedized satellite mesh communication terminals powered by Qualcomm Snapdragon X-series edge processors.",
    suggestedQueries: [
      "Explain this technical specification and its primary subsystems",
      "What is the operational frequency range and spread spectrum modulation used?",
      "What is the maximum operating junction temperature before thermal throttling kicks in?",
      "What is the exact trigger sequence for the hardware emergency crypto-erase?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Chapter 1: RF Subsystem & Spread Spectrum Protocols",
        content: `RESTRICTED DISTRIBUTION - TACTICAL EDGE DIRECTIVE
DOCUMENT ID: QCOM-SNAP-X900-SPEC-REV4
DEVICE CODENAME: SNAPDRAGON X-900 SECURE FIELD TERMINAL

1.2 FREQUENCY BANDS & BURST MODULATION
The X-900 terminal provides tactical beyond-line-of-sight (BLOS) communication over low-earth orbit (LEO) satellite constellations using:
- Operating Frequency: Ka-band (uplink: 29.5 - 31.0 GHz, downlink: 19.7 - 21.2 GHz).
- Anti-Jamming Modulation: Fast Frequency-Hopping Spread Spectrum (FHSS) hopping at 12,500 hops per second across 1,024 orthogonal sub-channels.
- Encryption: Full hardware AES-256-GCM payload encryption with ephemeral 256-bit elliptic-curve Diffie-Hellman (ECDH) session keys negotiated every 180 seconds inside the Qualcomm Secure Processing Unit (SPU).`
      },
      {
        pageNumber: 2,
        title: "Chapter 3: Thermal Profiles & Power Management",
        content: `3.4 THERMAL OPERATING ENVELOPE & THROTTLE THRESHOLDS
The unit is engineered for MIL-STD-810H extreme environmental conditions:
- Ambient Operating Range: -40°C to +65°C.
- Maximum Junction Temperature (T_j): 105°C.
- Thermal Throttle Trigger: When internal NPU junction sensor registers >= 78.0°C, the system executes an automated 3-tier throttle:
  * Tier 1 (78°C): NPU frequency drops from 1.8 GHz to 1.2 GHz; batch size restricted to 1.
  * Tier 2 (85°C): Adreno GPU compute cores deactivated; INT4 model inference pinned exclusively to Kryo energy-efficient cores.
  * Tier 3 (94°C): Emergency RF transmitter sleep; telemetry alert broadcast over auxiliary burst channel.`
      },
      {
        pageNumber: 3,
        title: "Chapter 5: Anti-Tamper & Zeroize Protocol",
        content: `5.1 HARDWARE ZEROIZATION & EMERGENCY CRYPTO-ERASE
In the event of impending capture or tamper sensor activation (voltage anomaly > 15%, light exposure inside chassis, or acoustic shock > 50G):
- Physical Trigger Sequence: Depress the recessed Zeroize switch for 3.0 continuous seconds, or transmit 64-bit cryptographic deadman token '0xDEAD_QCOM_CLEAR' via the serial maintenance port.
- Execution Effect: Within 4.2 milliseconds, the Qualcomm Secure Processing Unit discharges an onboard high-voltage capacitor directly through the physical efuse bank, irreversibly vaporizing all master AES root keys and zeroing internal SRAM registers.`
      }
    ]
  },
  {
    id: "identity-credentials",
    name: "Government National ID & Driver's License (Scanned).jpg",
    category: "Identity & Credentials",
    badge: "PII Sensitive",
    icon: "shield",
    fileSize: "850 KB",
    pages: 2,
    summary: "Digital scan of Government Photo ID (Aadhaar & Driver's License) with extracted issuance dates, national ID numbers, and degree certificate credentials.",
    suggestedQueries: [
      "Explain this file and extract all identity credentials",
      "What is the national ID / Aadhaar number and license number?",
      "What is the registered home address and date of birth?",
      "What degree certificate details are verified on this record?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "National Identity Card & Driver's License Verification",
        content: `GOVERNMENT OF INDIA - ON-DEVICE IDENTITY VERIFICATION RECORD
DOCUMENT TYPE: National Identity (Aadhaar) & State Motor Vehicle Driver's License
SOURCE FILE: Government National ID & Driver's License (Scanned).jpg [Qualcomm On-Device OCR Engine]
SECURITY CLASSIFICATION: PRIVILEGED PII - LOCAL ON-DEVICE PROCESSING ONLY

SECTION 1: PERSONAL IDENTIFICATION & BIOMETRIC CREDENTIALS
- Full Legal Name: Mrs. Ananya Sharma
- Father's / Guardian Name: Mr. R. Rajeshwar Rao
- Date of Birth (DOB): 14-08-1992 (Fourteenth August Nineteen Ninety-Two)
- Gender: Female
- Aadhaar / National ID Number: 4829 1040 5289 (Virtual ID VID: 9104 2819 4052 8812)
- Driver's License Number: DL-KA04-2021-0098412 (Issuing Authority: RTO Bengaluru North)
- License Issue Date: 05-02-2021 | Validity (Non-Transport): Up to 13-08-2042
- Vehicle Class Endorsement: LMV (Light Motor Vehicle) & MCWG (Motorcycle With Gear)

SECTION 2: RESIDENTIAL PERMANENT ADDRESS & CONTACT TELEMETRY
- Registered Residential Address: Flat # 42/B, Greenwood Enclave, Survey No. 118/2, Outer Ring Road, Marathahalli, Bengaluru - 560103, Karnataka, India
- Mobile Contact: +91 98450 12894
- Email Address: ananya.sharma@edgeintelligence.org
- Blood Group: B+ (Positive)`
      },
      {
        pageNumber: 2,
        title: "Academic Degree & Professional Qualification Certificate",
        content: `VISVESVARAYA TECHNOLOGICAL UNIVERSITY - BELAGAVI, KARNATAKA
DEGREE CONVOCATION & PROFESSIONAL ACCREDITATION RECORD

SECTION 3: HIGHER EDUCATION DEGREE CREDENTIALS
- Candidate Name: Ananya Sharma (University Seat Number USN: 1CR10CS018)
- Degree Conferred: Bachelor of Engineering (B.E.) in Computer Science & Engineering
- Year of Passing: June 2014 (Convocation Roll No: VTU-CONV-2014-88419)
- Academic Performance: First Class with Distinction (Aggregate CGPA: 9.24 / 10.00)
- Degree Certificate Serial: VTU/ENGR/CERT/2014/99120
- Institutional Verification: Duly signed and sealed by Registrar (Evaluation) and Vice-Chancellor.
[Qualcomm On-Device OCR Verified: 0 Cloud Transmission · Complete PII Sanitization Guarantee]`
      }
    ]
  },
  {
    id: "utility-municipal",
    name: "Municipal Electricity Utility Bill & Mutation Record.pdf",
    category: "Utility & Municipal Records",
    badge: "Address Proof",
    icon: "file-text",
    fileSize: "620 KB",
    pages: 2,
    summary: "State Electricity Board monthly billing invoice and Municipal Corporation land mutation certificate for address verification and utility audits.",
    suggestedQueries: [
      "Explain this file and summarize the utility billing parameters",
      "What is the total units consumed and final amount payable?",
      "What is the municipal mutation certificate number and property assessment code?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Monthly Electricity Utility Invoice & Consumption Ledger",
        content: `BANGALORE ELECTRICITY SUPPLY COMPANY LIMITED (BESCOM)
ELECTRICITY INVOICE & DEMAND NOTICE (DOMESTIC TARIFF LT-2A)
BILLING CYCLE: August 2026 | BILL DATE: 08-08-2026 | DUE DATE: 25-08-2026

SECTION 1: CONSUMER IDENTIFICATION & METER DETAILS
- Consumer Name: Mrs. Ananya Sharma
- RR / Account Number: W4-88491-02 (Sub-Division: W4 Marathahalli)
- Meter Number: BES-99214 (Static Digital Tri-Vector Meter)
- Sanctioned Connected Load: 5.00 kW
- Meter Reading Previous: 14,210 kWh | Meter Reading Current: 14,590 kWh
- Total Energy Consumed: 380 kWh (Units)

SECTION 2: TARIFF BREAKDOWN & COMPUTED CHARGES
- Energy Charges (Normal Slab): 380 kWh @ ₹7.25/kWh = ₹2,755.00
- Fixed Charges: 5 kW @ ₹65.00/kW = ₹325.00
- Fuel Cost Adjustment Charge (FAC): ₹342.00
- Electricity Duty & State Tax: ₹247.76
- Prior Arrears: ₹0.00 (Nil)
- Total Amount Payable: ₹3,669.76 (Prompt Payment Discount Net: ₹3,630.00)
- Bank Payment Mandate: Paid via UPI UTR No. 624108892184 on 12-08-2026`
      },
      {
        pageNumber: 2,
        title: "Municipal Corporation Land Mutation Certificate",
        content: `BRUHAT BENGALURU MAHANAGARA PALIKE (BBMP)
REVENUE DEPARTMENT - RECORD OF RIGHTS & MUTATION EXTRACT

SECTION 3: STATUTORY MUTATION & PROPERTY REGISTER DETAILS
- Mutation Order Number: BBMP/REV/MUT-2026/88410
- Property Assessment Number: ASSMT-BLR-42B
- Old Municipal Khata: 118/2-Old
- New 'A' Khata Number: KHT-2026-9912
- Property Description: Residential Site No. 42/B, Greenwood Enclave, measuring 2,400 sq.ft
- Transferred In Favor Of: Mrs. Ananya Sharma by virtue of Registered Sale Deed No. 10405/2026
- Annual Property Tax Assessed: INR 14,280.00 (Status: PAID in full for FY 2026-27 under Receipt # BLR-TAX-889104)
- Verification Seal: Certified by Assistant Revenue Officer, BBMP Mahadevapura Zone.`
      }
    ]
  },
  {
    id: "field-logs",
    name: "Industrial Turbine Maintenance Log & Calibration Tag.pdf",
    category: "Field Logs & Equipment Tags",
    badge: "Zero Coverage",
    icon: "tool",
    fileSize: "940 KB",
    pages: 2,
    summary: "Heavy industrial Gas Turbine daily field maintenance log, vibration calibration tag, and technician sign-off collected offline without cellular coverage.",
    suggestedQueries: [
      "Explain this file and its equipment calibration status",
      "What was the measured vibration level and is it within tolerance limits?",
      "When is the next service due and who is the certifying field engineer?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Gas Turbine Daily Maintenance & Operational Field Log",
        content: `FIELD OPERATIONAL LOG - OFF-GRID ENERGY GENERATION SUBSTATION
EQUIPMENT IDENTIFIER: SIEMENS SGT-400 INDUSTRIAL GAS TURBINE (UNIT #3)
ASSET TAG CODE: TAG-GT-400-BLR-03 | CORE SERIAL: SN-883921-X
LOGGING DATE: 12-09-2026 | RECORDING STATUS: 100% OFFLINE ON-DEVICE CAPTURE

SECTION 1: OPERATIONAL TELEMETRY & RUN PARAMETERS
- Cumulative Run Hours: 18,420 Operating Hours
- Turbine Inlet Temperature (TIT): 1,180°C (Normal Operating Limit: <= 1,220°C)
- Exhaust Gas Temperature (EGT): 542°C (Deviation: +1.2% - Nominal)
- Rotor Shaft Speed: 14,100 RPM @ 50 Hz Synchronous Grid Frequency
- Lubricant Sump Oil Pressure: 3.85 Bar (Acceptable Range: 3.5 - 4.2 Bar)
- Lubricant Viscosity & Chemical Health: ISO VG 46; Total Acid Number (TAN) 0.18 mg KOH/g (No water contamination)`
      },
      {
        pageNumber: 2,
        title: "Dynamic Vibration Calibration Tag & Inspection Sign-Off",
        content: `PRECISION MACHINE CALIBRATION TAG - ISO 10816-3 STANDARDS
CALIBRATION INSPECTION TAG NO: CAL-2026-VIB-9921

SECTION 2: TRANSDUCER CALIBRATION & VIBRATION ANALYSIS
- Sensor Type: Tri-axial Piezoelectric Accelerometers (Channel X, Y, Z)
- Measured Peak Overall Vibration Velocity: 1.42 mm/s RMS (Permissible Threshold for Rigid Support: <= 2.50 mm/s RMS).
- Calibration Status: PASSED - FULL COMPLIANCE (Zone A - Newly Commissioned Equivalent).
- Next Mandatory Calibration & Overhaul: 12-12-2026 (Quarterly 500-hour planned outage).
- Certifying Field Engineer: Er. Rajesh Hegde (Chartered Maintenance Badge # ENG-4491).
- Physical Field Stamp: Substation Mechanical Division Offline Seal Affixed.`
      }
    ]
  },
  {
    id: "boxed-forms",
    name: "Standardized Boxed Field Survey & Benefit Application.jpg",
    category: "Handwritten Forms with Boxed Fields",
    badge: "Boxed OCR Engine",
    icon: "edit-3",
    fileSize: "780 KB",
    pages: 2,
    summary: "Government benefits application form where each letter and digit is filled into discrete rectangular boxes for high-accuracy lightweight on-device OCR extraction.",
    suggestedQueries: [
      "Explain this file and transcribe all boxed form fields",
      "What is the applicant name and date of birth extracted from the boxes?",
      "What bank account details and income are filled in?"
    ],
    pagesContent: [
      {
        pageNumber: 1,
        title: "Standardized Boxed Field Survey - Section A: Applicant Demographics",
        content: `GOVERNMENT SOCIAL BENEFIT & SUBSIDY APPLICATION (FORM-BENE-2026-REV3)
INSTRUCTION: FILL EACH CHARACTER IN AN INDIVIDUAL BOX USING BLACK INK.

[A][P][P][L][I][C][A][N][T]  [N][A][M][E]:
[A][N][A][N][Y][A]   [S][H][A][R][M][A]

[G][E][N][D][E][R]:  [F] (Female)

[D][A][T][E]  [O][F]  [B][I][R][T][H]:
[1][4] / [0][8] / [1][9][9][2]

[A][A][D][H][A][A][R]  [N][U][M][B][E][R]:
[4][8][2][9]  [1][0][4][0]  [5][2][8][9]

[P][H][O][N][E]  [N][U][M][B][E][R]:
[9][8][4][5][0][1][2][8][9][4]

[R][E][S][I][D][E][N][T][I][A][L]  [P][I][N]  [C][O][D][E]:
[5][6][0][1][0][3]`
      },
      {
        pageNumber: 2,
        title: "Standardized Boxed Field Survey - Section B: Bank & Scheme Details",
        content: `SECTION B: FINANCIAL ALLOCATION & DIRECT BENEFIT TRANSFER MANDATE

[B][A][N][K]  [A][C][C][O][U][N][T]  [N][U][M][B][E][R]:
[9][1][2][8][8][4][0][1][9][2][3][4]

[I][F][S][C]  [C][O][D][E]:
[H][D][F][C][0][0][0][1][2][8][8]

[M][O][N][T][H][L][Y]  [H][O][U][S][E][H][O][L][D]  [I][N][C][O][M][E]  ([I][N][R]):
[0][8][5][0][0][0]  (INR 85,000)

[S][C][H][E][M][E]  [C][O][D][E]:
[E][D][G][E]  [A][I]  [G][R][A][N][T]

[F][I][E][L][D]  [V][E][R][I][F][I][C][A][T][I][O][N]  [S][T][A][M][P]:
[V][E][R][I][F][I][E][D] - [B][O][X] - [O][K] - [2][0][2][6]
[On-Device Boxed OCR: 100% Character-Level Confidence via Snapdragon NPU Segmenter]`
      }
    ]
  }
];

