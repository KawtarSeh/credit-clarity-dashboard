export interface Client {
  id: string;
  // Identity fields
  nom?: string;
  prenom?: string;
  age?: number;
  
  // Credit dataset features
  num_of_delayed_payment?: number;
  changed_credit_limit?: number;
  num_credit_inquiries?: number;
  credit_mix?: 'Standard' | 'Good' | 'Bad';
  outstanding_debt?: number;
  credit_utilization_ratio?: number;
  credit_history_age?: string;
  payment_of_min_amount?: 'Yes' | 'No' | 'NM';
  total_emi_per_month?: number;
  amount_invested_monthly?: number;
  payment_behaviour?: string;
  monthly_balance?: number;
  credit_score?: 'A' | 'B' | 'C';
  credit_history_age_months?: number;
  
  created_at?: string;
  updated_at?: string;
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
