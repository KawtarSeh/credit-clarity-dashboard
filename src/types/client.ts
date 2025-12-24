export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  annualIncome: number;
  monthlyDebt: number;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employmentYears: number;
  creditHistory: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  existingLoans: number;
  paymentHistory: 'always-on-time' | 'occasional-late' | 'frequent-late' | 'defaults';
  createdAt: string;
  updatedAt: string;
}

export type CreditGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface CreditScore {
  score: number;
  grade: CreditGrade;
  riskLevel: RiskLevel;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
