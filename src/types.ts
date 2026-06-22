export interface User {
  id: string;
  username: string;
  email: string;
  role: 'patient' | 'doctor';
  name: string;
  age: number;
  gender: string;
  bloodType?: string;
  weight?: string;
  height?: string;
  chronicConditions?: string[];
  allergies?: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    copay: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestions?: string[];
  isEmergency?: boolean;
  appointmentBooked?: Appointment;
  medicationInfo?: Medication;
  recordChecked?: MedicalRecord;
  consultationSummaryDoc?: ConsultationSummary;
  fileAttachment?: {
    name: string;
    type: string;
    size: string;
    previewUrl?: string;
  };
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'upcoming' | 'completed' | 'cancelled';
  symptoms?: string;
  reason?: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  type: 'lab_report' | 'prescription' | 'vaccination_record' | 'clinical_history';
  title: string;
  date: string;
  doctorName: string;
  summary: string;
  details: Record<string, string | number>;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderTimes: string[]; // HH:MM list
  remainingRefills: number;
  nextRefillDate: string;
  alerts: string[];
  sideEffects: string[];
  instructions: string;
  status: 'active' | 'completed';
}

export interface ConsultationSummary {
  patientName: string;
  age: number;
  gender: string;
  symptoms: string[];
  onset: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  visitPreparationNotes: string[];
  suggestedSpecialists: string[];
  icd10Codes?: { code: string; desc: string }[];
  prescriptionDraft?: { drug: string; dosage: string; frequency: string; duration: string }[];
}

export interface HealthMetric {
  date: string;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  sleepHours: number;
  steps: number;
  glucose?: number;
}
