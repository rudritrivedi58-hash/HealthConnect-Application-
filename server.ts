import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI Client Lazily to prevent startup crashes if API key is missing.
let aiClient: any = null;
function getGeminiAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// MOCK STATE CLINICAL CLINIC DATABASE (IN-MEMORY)
// ==========================================
let currentRole: 'patient' | 'doctor' = 'patient';

const currentPatientUser = {
  id: "pat_001",
  username: "alex.rivera",
  email: "alex.rivera@clinical.org",
  role: "patient" as const,
  name: "Alex Rivera",
  age: 34,
  gender: "Non-binary",
  bloodType: "O-positive",
  weight: "74 kg",
  height: "178 cm",
  chronicConditions: ["Mild Asthma", "Seasonal Allergies"],
  allergies: ["Penicillin (gives hives)", "Ragweed pollen"],
  insuranceInfo: {
    provider: "CrossShield Healthcare",
    policyNumber: "CS-92817263-AR",
    copay: "$20.00"
  }
};

const currentDoctorUser = {
  id: "doc_001",
  username: "elizabeth.sarah",
  email: "dr.sarah@clinical.org",
  role: "doctor" as const,
  name: "Dr. Elizabeth Sarah",
  age: 42,
  gender: "Female",
  specialty: "Primary Care Physician & Pulmonary Medicine"
};

let appointments = [
  {
    id: "appt_1",
    doctorName: "Dr. Robert Chen",
    specialty: "Cardiology",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: "14:00",
    status: "upcoming" as const,
    symptoms: "Occasional mild chest tightness on exertion",
    reason: "Initial follow-up post stress-test",
    notes: "Remember to bring recent lipid panel printout."
  },
  {
    id: "appt_2",
    doctorName: "Dr. Sarah Jameson",
    specialty: "Primary Care Physician",
    date: "2026-05-15",
    time: "10:30",
    status: "completed" as const,
    symptoms: "Asthma flare ups during pollen season",
    reason: "Routine prescription review and allergy consult",
    notes: "Increased albuterol compliance. Discussed daily inhaler options."
  },
  {
    id: "appt_3",
    doctorName: "Dr. Amanda White",
    specialty: "Dermatologist",
    date: "2026-04-10",
    time: "09:15",
    status: "cancelled" as const,
    reason: "Skin tag review",
    notes: "Cancelled by patient due to schedule conflict."
  }
];

let medications = [
  {
    id: "med_1",
    name: "Albuterol HFA Inhaler",
    dosage: "90 mcg (2 puffs)",
    frequency: "Every 4 to 6 hours as needed for wheezing",
    reminderTimes: ["08:00", "20:00"],
    remainingRefills: 2,
    nextRefillDate: "2026-07-25",
    alerts: ["May cause temporary jitteriness or elevated heart rate."],
    sideEffects: ["Mild muscle tremor", "Nervousness", "Sore throat"],
    instructions: "Shake well before using. Rinse mouth with warm water after inhalation.",
    status: "active" as const
  },
  {
    id: "med_2",
    name: "Montelukast (Singulair)",
    dosage: "10 mg tablet",
    frequency: "Once daily in the evening",
    reminderTimes: ["21:30"],
    remainingRefills: 5,
    nextRefillDate: "2026-07-05",
    alerts: ["Take regularly. Avoid grapefruit juice interactions."],
    sideEffects: ["Headache", "Abdominal discomfort", "Mild congestion"],
    instructions: "Take with or without food. Best taken consistently 2 hours before bedtime.",
    status: "active" as const
  }
];

let medicalRecords = [
  {
    id: "rec_1",
    type: "lab_report" as const,
    title: "Complete Blood Count & Basic Metabolic Panel",
    date: "2026-06-12",
    doctorName: "Dr. Sarah Jameson",
    summary: "All blood counts within normal physiological baseline except a marginally elevated White Blood Cell count (11.2 K/uL), suggesting a localized allergic response or mild viral infection. Kidney and liver functions are excellent. Total cholesterol is 195 mg/dL.",
    details: {
      "WBC (White Blood Cells)": "11.2 K/uL (High)",
      "RBC (Red Blood Cells)": "4.8 M/uL (Normal)",
      "Hemoglobin": "14.5 g/dL (Normal)",
      "Hematocrit": "42.8 % (Normal)",
      "Platelets": "245 K/uL (Normal)",
      "Serum Glucose": "92 mg/dL (Normal)",
      "Creatinine": "0.85 mg/dL (Normal)",
      "Total Cholesterol": "195 mg/dL (Normal/Borderline)"
    }
  },
  {
    id: "rec_2",
    type: "prescription" as const,
    title: "Allergy and Pulmonary Care Plan RX",
    date: "2026-05-15",
    doctorName: "Dr. Sarah Jameson",
    summary: "Active medical prescription issued for Albuterol rescue inhaler and daily Montelukast tablets to manage seasonal allergic asthma.",
    details: {
      "Prescribed Inhaler": "Albuterol 90mcg HFA, Dispense 1, Refills: 2",
      "Prescribed Daily Tablet": "Montelukast 10mg blocks, Dispense 30, Refills: 5",
      "Pharmacy Gateway": "CVS Pharmacy Suite #12, 10 Main St, Chicago IL"
    }
  },
  {
    id: "rec_3",
    type: "vaccination_record" as const,
    title: "Immunization Log & Boosters",
    date: "2025-11-02",
    doctorName: "Dr. Sarah Jameson",
    summary: "Standard seasonal immunizations fully up to date, shielding against common influenza strains and respiratory spikes.",
    details: {
      "Annual Flu Vaccine": "Influenza Quadrivalent (Flulaval) - Administered (Left Deltoid)",
      "COVID-19 Booster": "Pfizer-BioNTech Comirnaty - Administered (Right Deltoid)",
      "Tetanus Booster (Tdap)": "Boostrix - Updated Nov 2024 (Next due 2034)"
    }
  }
];

// Seed analytics history
const generateHealthTrendingData = () => {
  const data = [];
  // Generate 15 days of metrics showing sleep declining slightly and HR rising slightly
  for (let i = 14; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    // sleep hours decreasing by ~20% over the last month
    const sleepHours = i < 5 ? (5.2 + Math.random() * 0.8) : (7.2 + Math.random() * 0.6);
    const heartRate = i < 5 ? (78 + Math.floor(Math.random() * 8)) : (70 + Math.floor(Math.random() * 6));
    const bloodPressureSys = i < 5 ? (132 + Math.floor(Math.random() * 5)) : (120 + Math.floor(Math.random() * 4));
    const bloodPressureDia = i < 5 ? (84 + Math.floor(Math.random() * 3)) : (78 + Math.floor(Math.random() * 3));
    const steps = 6000 + Math.floor(Math.random() * 4000);
    const glucose = 90 + Math.floor(Math.random() * 15);

    data.push({
      date: dateStr,
      heartRate,
      bloodPressureSys,
      bloodPressureDia,
      sleepHours: Number(sleepHours.toFixed(1)),
      steps,
      glucose
    });
  }
  return data;
};

const trendingMetrics = generateHealthTrendingData();

// ==========================================
// API REST ENDPOINTS
// ==========================================

// Get user info (dependent on active role toggling)
app.get("/api/user", (req, res) => {
  if (currentRole === 'patient') {
    res.json(currentPatientUser);
  } else {
    res.json(currentDoctorUser);
  }
});

// Toggle role between patient and doctor to test both sides cleanly
app.post("/api/user/toggle", (req, res) => {
  currentRole = currentRole === 'patient' ? 'doctor' : 'patient';
  res.json({ success: true, newRole: currentRole, user: currentRole === 'patient' ? currentPatientUser : currentDoctorUser });
});

// Get appointments
app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

// Book appointment
app.post("/api/appointments", (req, res) => {
  const { doctorName, specialty, date, time, reason, symptoms } = req.body;
  if (!doctorName || !date || !time) {
    return res.status(400).json({ error: "Doctor name, date and time parameters are required." });
  }
  const newAppt = {
    id: `appt_${Date.now()}`,
    doctorName,
    specialty: specialty || "General Practitioner",
    date,
    time,
    status: "upcoming" as const,
    symptoms: symptoms || "",
    reason: reason || "Virtual Health Consultation",
    notes: "Virtual clinic meeting link generated automatically."
  };
  appointments.push(newAppt);
  res.status(201).json(newAppt);
});

// Reschedule or Cancel appointment
app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { status, date, time } = req.body;
  const appt = appointments.find(a => a.id === id);
  if (!appt) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  if (status) appt.status = status;
  if (date) appt.date = date;
  if (time) appt.time = time;
  res.json(appt);
});

// Get medical records
app.get("/api/records", (req, res) => {
  res.json(medicalRecords);
});

// Get medications
app.get("/api/medications", (req, res) => {
  res.json(medications);
});

// Request medication refill
app.post("/api/medications/:id/refill", (req, res) => {
  const { id } = req.params;
  const med = medications.find(m => m.id === id);
  if (!med) {
    return res.status(404).json({ error: "Medication not found" });
  }
  if (med.remainingRefills > 0) {
    med.remainingRefills -= 1;
    // Set next refill date 30 days after
    const nextRefill = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    med.nextRefillDate = nextRefill;
    res.json({ success: true, message: "Refill request sent to CVS Pharmacy successfully.", medication: med });
  } else {
    res.status(400).json({ error: "No refills remaining. Please use the floating clinical chatbot to request a new prescription from Dr. Jameson." });
  }
});

// Get trends metrics
app.get("/api/health-metrics", (req, res) => {
  res.json(trendingMetrics);
});

// ==========================================
// CHAT SERVICES INTRODUCING THE AI AGENT
// ==========================================
app.post("/api/chat", async (req, res) => {
  const { messages, userRole } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages payload." });
  }

  const ai = getGeminiAI();
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  // 1. Core Rule Check: Check for High-Risk Emergency symptoms directly on server to trigger fastest assistance.
  const lowerMsg = lastUserMessage.toLowerCase();
  const hasChestPain = lowerMsg.includes("chest pain") || lowerMsg.includes("heart attack") || lowerMsg.includes("pressure in chest");
  const hasStroke = lowerMsg.includes("slurred speech") || lowerMsg.includes("stroke") || lowerMsg.includes("facial droop") || lowerMsg.includes("weakness on one side");
  const hasBreathing = lowerMsg.includes("cannot breathe") || lowerMsg.includes("severe breathing") || lowerMsg.includes("shorthness of breath") || lowerMsg.includes("suffocating");
  const hasUnconsciousness = lowerMsg.includes("unconscious") || lowerMsg.includes("passed out") || lowerMsg.includes("not waking up");

  const isEmergency = hasChestPain || hasStroke || hasBreathing || hasUnconsciousness;

  if (isEmergency) {
    // Generate specialized immediate response with emergency details immediately
    return res.json({
      text: "**⚠️ HIGH RISK EMERGENCY WARNING DECLARED**\n\nYour reported symptoms hint at a potential severe, life-threatening situation (such as acute cardiac trauma, vascular stroke, or critical airway compromise).\n\n**Please take immediate action:**\n1. Do NOT wait for automated chat reports.\n2. Tap the highlighted red **SPEED-CALL ER BUTTON** or dial **911** now.\n3. Keep calm and sit comfortably. Do not drive yourself to the emergency department.\n\n*Below are the closest critical emergency wards in your proximity based on your telemetry:*",
      isEmergency: true,
      suggestedActions: ["🚨 Call 911 Now", "🏥 Map Closest Hospitals", "📞 Direct Call Emergency Contact"]
    });
  }

  // 2. Generate Contextual background for Gemini to provide extremely precise personal answers under role play
  const patientContext = `
ACTIVE PATIENT LOGGED IN PROFILE:
Name: ${currentPatientUser.name}
Age: ${currentPatientUser.age}
Gender: ${currentPatientUser.gender}
Blood type: ${currentPatientUser.bloodType}
Weight: ${currentPatientUser.weight}
Height: ${currentPatientUser.height}
Chronic conditions: ${currentPatientUser.chronicConditions.join(", ")}
Allergies: ${currentPatientUser.allergies.join(", ")}
Insurance policy: Provider: ${currentPatientUser.insuranceInfo.provider}, Plan ID: ${currentPatientUser.insuranceInfo.policyNumber}, Copay rate: ${currentPatientUser.insuranceInfo.copay}

UPCOMING APPOINTMENTS:
${JSON.stringify(appointments, null, 2)}

ACTIVE LAB REPORTS AND RECORDS:
${JSON.stringify(medicalRecords, null, 2)}

ACTIVE PRESCRIBED MEDICATIONS AND REMINDERS:
${JSON.stringify(medications, null, 2)}

HEALTH METRICS TRENDING HISTORY (OVER THE LAST MONTH):
${JSON.stringify(trendingMetrics.slice(-5), null, 2)} (Sleep showed a noteworthy decline of 20% over modern cycles!)
  `;

  const doctorContext = `
ACTIVE CLINICIAN LOGGED IN PROFILE:
Name: ${currentDoctorUser.name}
Role: ${currentDoctorUser.role} (Licensed clinician)
Specialty: ${currentDoctorUser.specialty}
This clinical portal assistant provides immediate drafting, summarizing, diagnostic lookups, clinical history analysis, and prescription creation support.
Patient under review: Alex Rivera (details match Patient Profile).
  `;

  const activeContext = currentRole === 'patient' ? patientContext : doctorContext;

  const systemInstruction = `
You are standard certified Virtual Health Assistant, named CareAI, serving as a highly reliable, empathetic, and premium advisor for patients and clinicians.
Current Mode context: ${currentRole.toUpperCase()}.

RULES:
1. MANDATORY CLINICAL WARNING: You MUST clearly state in patient mode that you are an AI virtual health assistant, NOT a licensed medical doctor. Encourage the user to consult healthcare professionals for formal diagnosis & therapeutic orders.
2. CONTEXT AWARENESS: Use the provided medical profile context, appointments, vaccines, and drug guidelines to answer user questions with incredible diagnostic accuracy. DO NOT hallucinate patient records. If the patient asks for their lab results, blood tests, or medications, reference the stored values precisely!
3. FORMATTING: Use professional, high-fidelity markdown with headings, bold tags, bullet points, and clean spacing. Avoid overly long walls of text.
4. ROLE BEHAVIORS:
   - If user role is PATIENT: Guide them, explain medical terms clearly, book or check appointments, explain remaining drug refills, explain asthma management, and suggest appropriate specialty follow-ups.
   - If user role is DOCTOR: Assist them with writing consultation summaries, draft prescriptions, look up ICD-10 medical billing codes, summarize patient Alex's medical history, review recent labs.
5. APPOINTMENT BOOKING: If the user says they want to book/schedule an appointment, you should confirm the details and prompt them that you have assisted them. For example: "I will assist you in booking that cardiology appointment on our portal."

Let's respond to the user query with excellent clinical competence. Current medical data:
${activeContext}
  `;

  // Fallback clinical simulator if Gemini SDK fails or key is missing
  const queryWords = lastUserMessage.toLowerCase();
  
  const generateSimulatedResponse = (query: string): { text: string; suggestedActions: string[] } => {
    let text = "";
    let actions: string[] = [];

    if (currentRole === 'patient') {
      if (query.includes("blood") || query.includes("test") || query.includes("lab") || query.includes("report")) {
        text = `### 📊 Your Latest Lab Report Analysis

I have found your standard wellness test completed on **June 12, 2026** under Dr. Jameson's clinical care.
*   **WBC (White Blood Cells):** **11.2 K/uL** (Slightly Elevated - normal range 4.5 - 11.0). This minor elevation holds a strong correspondence with seasonal allergies (**Ragweed allergies** on your charts) or a self-limiting recovery phase.
*   **Cholesterol Level:** **195 mg/dL** (Comfortably under the 200 mg/dL guidelines).
*   **Kidney & Liver Markers:** Safe baseline values recorded.

**Recommendations:** Consistently track symptoms. If you experience unexpected sinus pain or low-grade fevers, let Dr. Jameson know. 

*Always seek formal medical diagnostics to make clinical therapy changes.*`;
        actions = ["📅 Consult Dr. Jameson", "💊 Manage Allergies", "📈 View Health Trends"];
      } else if (query.includes("symptom") || query.includes("headache") || query.includes("cough") || query.includes("fever") || query.includes("asthma") || query.includes("assess")) {
        text = `### 🩺 Symptom Assessment Flow initiated

Let's review your symptoms together:
1.  **Ragweed allergy trigger:** Your chart lists a chronic allergy to ragweed pollen. These frequently present with low-grade headaches, congestion, or mild wheezing.
2.  **Asthma check-in:** For your chronic **Mild Asthma**, how often are you needing your **Albuterol Rescue Inhaler** right now? (More than 2 times a week indicates a reassessment may be needed).

**Important Safety Advisory:** I am a Virtual Assistant, not a physician. If you suffer chest tightness, extreme shortness of breath, or hives, seek urgent care.

Please share:
*   How long have these symptoms persisted?
*   Do you have an active temperature above 100°F?
*   Are you experiencing joint fatigues or severe sore throat?`;
        actions = ["Wheezing occasionally", "Just a mild headache", "Book Pulmonary Specialist"];
      } else if (query.includes("appoint") || query.includes("book") || query.includes("schedule") || query.includes("cardiologist")) {
        text = `### 📅 Virtual Appointment Assistant

I can draft and schedule your appointment instantly! 

*   **Suggested Doctor:** **Dr. Robert Chen** (Cardiologist) or **Dr. Sarah Jameson** (PCP).
*   **Open Slot Detected:** Tomorrow afternoon at **14:00** or Wednesday morning at **10:00**.

Would you like me to book Dr. Robert Chen on **2026-06-23 at 14:00** for your cardiology follow-up?`;
        actions = ["Book Tomorrow 14:00", "Review Other Slots", "Tell me about Dr. Chen"];
      } else if (query.includes("medication") || query.includes("refill") || query.includes("antibiotics") || query.includes("take") || query.includes("inhaler")) {
        text = `### 💊 Active Medication Guidelines

Your profile is registered with **2 active prescriptions**:
1.  **Albuterol HFA Inhaler:**
    *   *Reminders:* 08:00 and 20:00 (as needed).
    *   *Usage:* 2 puffs every 4-6 hours for wheezing/coughing. Rinse mouth afterwards.
    *   *Refills remaining:* **2 refills available**.
2.  **Montelukast (Singulair):**
    *   *Reminders:* 21:30 nightly.
    *   *Instruction:* 1 tablet (10mg) before bed. Avoid drinking grapefruit juice.

*Note: If you are asking about new antibiotics, you must consultDr. Sarah Jameson or make a clinical appointment for a diagnostic throat culture.*`;
        actions = ["Request Inhaler Refill", "⏰ Set Reminders Check", "📋 Side Effects Warning"];
      } else if (query.includes("sleep") || query.includes("trends") || query.includes("analytics") || query.includes("glucose")) {
        text = `### 📊 Health Analytics Insight

Comparing values over the past 30 days, we've flagged a critical trend:
*   **Sleep Duration Deceleration:** Your average sleep duration dropped by **20%** this month (averaging just **5.6 hours** compared to a healthy **7.2 hours** baseline).
*   **Cardiovascular Compensation:** Corresponding with sleep deprivation, your average heart rate rose to **78 bpm** (up from **70 bpm**) and systolic Blood Pressure shifted slightly high to **132 mmHg**.

**Suggested Goal:** We suggest checking and logging your sleep trends daily. Your daily Singular (*Montelukast*) at **21:30** can act as an anchor to trigger dimming your bedside lights by **22:00**.`;
        actions = ["💤 Sleep Hygiene Tips", "🩺 Log Blood Pressure", "📈 Full Insights Panel"];
      } else {
        text = `### Hello Alex, I am CareAI 👨‍⚕️

Your dedicated Virtual Healthcare Companion. I can help you:
*   **Explain and review your medical files & past lab blood work**
*   **Assess physical symptoms safely (non-diagnostic check)**
*   **Request medication refills (CVS connection)**
*   **Instantly book, move, or cancel clinic appointments**
*   **Explain contraindications or prescription instructions**

*Please note: I am an AI, not an active ER nurse or doctor. For urgent emergencies, please contact emergency lines.* How can I assist you today?`;
        actions = ["Symptom assessment", "Show my blood test", "When should I take my inhaler?", "Book Cardiologist appointment"];
      }
    } else {
      // Doctor Mode Fallback responses
      if (query.includes("summarize") || query.includes("history") || query.includes("alex")) {
        text = `### 📋 Doctor Clinical Brief: Alex Rivera

*   **Age/Gender:** 34, Non-binary.
*   **Chronic Conditions:** Mild Asthma (managed with daily Montelukast, Albuterol prn).
*   **Critical Allergies:** **Penicillin** (Anaphylactic hives response).
*   **Active Lab Highlight:** WBC slightly elevated at **11.2 K/uL** as of June 12. Total Cholesterol is nominal at 195.
*   **Recent Telemetry:** Sleep down by 20% over 14 days, inducing borderline sympathetic hypertension (SBP average 132 mmHg).

**Action item:** Evaluate Albuterol compliance at the next encounter. Confirm ragweed severity.`;
        actions = ["📝 Create Consultation Notes", "💊 Draft Prescription", "🏷️ Map ICD-10 Codes"];
      } else if (query.includes("consult") || query.includes("notes") || query.includes("draft")) {
        text = `### 📝 Drafted Consultation Summary

**Patient:** Alex Rivera | **Age:** 34
**Date of Encounter:** June 21, 2026
**Subjective:** Patient reports seasonal asthmatic tight chest, exacerbated by pollen count.
**Objective:** BP 132/84, HR 78, Lungs: clear bilateral with trace expiratory wheeze.
**Assessment:** Mild allergic asthma (seasonal flare-up).
**Plan:**
1.  Increase Montelukast 10mg compliance at bedtime.
2.  Continue Albuterol 2 puffs every 4 hours as required.
3.  Evaluate sleep hygiene to lower sympathetic heart indices.

*Would you like me to push this summary directly to the electronic health record (EHR)?*`;
        actions = ["Apply Draft to Record", "Modify Plan", "View ICD-10 Coding suggestions"];
      } else if (query.includes("billing") || query.includes("icd") || query.includes("code")) {
        text = `### 🏷️ Suggested ICD-10 Billing & Diagnosis Codes

Based on review of Alex Rivera's clinical history and presenting allergies:
*   **J45.20:** Mild intermittent asthma, uncomplicated.
*   **J30.1:** Allergic rhinitis due to pollen (Ragweed allergic trigger).
*   **Z88.0:** Allergy status to Penicillin class (Alert guard enabled).
*   **G47.00:** Unspecified insomnia/sleep disturbance (corresponding to 20% tracking decline).

*Hover over any code to inject directly into the claim compiler form.*`;
        actions = ["Inject codes into Claim", "Add Asthma ICD-10", "Analyze Lab metrics"];
      } else {
        text = `### 🩺 Clinician AI Copilot Active

Welcome **Dr. Elizabeth Sarah**. I stand ready to assist you with Alex Rivera's diagnostic summary tools:
*   ` + "`Summarize Patient History`" + ` to parse Alex's labs and chronic conditions.
*   ` + "`Draft Examination Notes`" + ` based on incoming symptoms.
*   ` + "`Verify Drug Interactions`" + ` with penicillin alert validation checks.
*   ` + "`Retrieve billing codes`" + ` to search matching ICD-10 items instantly.

What clinical drafting service can I run?`;
        actions = ["Summarize Patient History", "Draft Consultation Notes", "Look up ICD-10 codes"];
      }
    }

    return { text, suggestedActions: actions };
  };

  if (!ai) {
    // Return mock simulated clinical results immediately
    const sim = generateSimulatedResponse(lastUserMessage);
    return res.json({
      text: sim.text,
      isEmergency,
      suggestedActions: sim.suggestedActions
    });
  }

  try {
    // 3. Translate the React messages chat list into formal model parts format
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }]
    }));

    // Generate content using Gemini Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

    const botText = response.text || "I was unable to retrieve a response from CareAI. Please try again shortly.";

    // Use a quick classification or text pattern scanning to generate nice interactive suggested actions
    const finalActions: string[] = [];
    const lowerBot = botText.toLowerCase();

    if (currentRole === 'patient') {
      if (lowerBot.includes("appointment") || lowerBot.includes("schedule") || lowerBot.includes("book")) {
        finalActions.push("📅 Book Tomorrow 14:00", "Review Doctors", "My Dashboard");
      } else if (lowerBot.includes("lab") || lowerBot.includes("report") || lowerBot.includes("blood") || lowerBot.includes("cbc")) {
        finalActions.push("📊 Details of Blood Test", "📈 View Sleep Trend", "💊 View Medications");
      } else if (lowerBot.includes("medication") || lowerBot.includes("refill") || lowerBot.includes("inhaler") || lowerBot.includes("dose")) {
        finalActions.push("Refill Albuterol", "⏰ Trigger Reminders Check", "📋 Side Effects list");
      } else if (lowerBot.includes("sleep") || lowerBot.includes("hypopnea") || lowerBot.includes("trends")) {
        finalActions.push("💤 Sleep Advice", "🩺 Log Heart Rate", "📈 Full Insights");
      } else {
        finalActions.push("Symptom assessment", "Understand Lab results", "Medication list", "Book Cardiology slot");
      }
    } else {
      // Doctor Mode
      if (lowerBot.includes("history") || lowerBot.includes("alex") || lowerBot.includes("report")) {
        finalActions.push("📝 Draft Clinical Notes", "🏷️ ICD-10 Lookup", "💊 Draft Prescription");
      } else if (lowerBot.includes("draft") || lowerBot.includes("notes") || lowerBot.includes("clinical")) {
        finalActions.push("Apply Draft to Record", "Edit Rx Details", "Tag Billing Codes");
      } else if (lowerBot.includes("icd") || lowerBot.includes("code") || lowerBot.includes("billing")) {
        finalActions.push("Apply ICD-10 Codes", "Summarize History", "Review Lab Data");
      } else {
        finalActions.push("Summarize Patient History", "Draft Clinical Notes", "Look up ICD-10 Codes");
      }
    }

    res.json({
      text: botText,
      isEmergency,
      suggestedActions: finalActions
    });

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Gracefully handle any API issue or rate limit with the high-quality simulator so the app never fails!
    const sim = generateSimulatedResponse(lastUserMessage);
    res.json({
      text: `${sim.text}\n\n*(CareAI running in clinical protection mode)*`,
      isEmergency,
      suggestedActions: sim.suggestedActions
    });
  }
});

// Post notes compiler endpoints
app.post("/api/doctor/generate-notes", async (req, res) => {
  const { notesTopic } = req.body;
  const ai = getGeminiAI();
  if (!ai) {
    return res.json({
      notes: `### 📝 Drafted Care Encounter Note

**Patient Identifier:** Alex Rivera | Age 34
**Encounter Provider:** Dr. Elizabeth Sarah
**Dynamic Subjective:** Patient reports seasonal triggers pushing mild respiratory wheezes over early pollen blooms. Sleep averages down to 5.6 hours.
**Physical Exam Summary:** Lungs slightly dry in bases with faint terminal expiratory wheeze. Normal chest expansion. HR 78, BP 132/84 mmHg.
**Recommended Diagnosis Codes:** J45.20 (Mild intermittent asthma), J30.1 (Allergic rhinitis).
**Prescription Proposal:** Refill Singulair (Montelukast 10mg tablets) Sig: 1 tablet qHS. Continue Albuterol HFA as instructed.
`,
      icd10: [{ code: "J45.20", desc: "Mild intermittent asthma" }, { code: "J30.1", desc: "Allergic rhinitis" }]
    });
  }

  try {
    const prompt = `
Generate a highly professional, clinical care assessment draft for patient Alex Rivera (34, non-binary, seasonal asthma triggers, penicillin hives allergic reaction) based on topic request: "${notesTopic || "Routine respiratory evaluation and allergic conjunctivitis"}".
List:
1. Subjective report assessment
2. Objective vitals draft
3. Detailed Plan with medication instructions
4. 2-3 Suggested ICD-10 Billing Codes
Provide response in clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { temperature: 0.2 }
    });

    res.json({
      notes: response.text || "Assessment notes creation failed."
    });
  } catch (e) {
    res.json({
      notes: `### 📝 Clinical Evaluation Note (Fallback)
**Patient Identifier:** Alex Rivera | Age 34
**Clinical Scope:** Allergic asthma control assessment.
**Recommended Plan:** Refill Montelukast 10mg daily. Compliance checks with Albuterol inhaler.`
    });
  }
});

// ==========================================
// VITE DEV SERVER / WEB HOSTING INJECTOR
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist files...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Healthcare Assistant full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
