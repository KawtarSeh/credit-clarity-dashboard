import { Client, CreditScore, CreditGrade, RiskLevel } from '@/types/client';

export function calculateCreditScore(client: Client): CreditScore {
  let score = 400; // Base score

  // Credit Utilization Ratio (max 150 points) - lower is better
  const utilizationRatio = client.credit_utilization_ratio || 0;
  if (utilizationRatio < 10) score += 150;
  else if (utilizationRatio < 20) score += 120;
  else if (utilizationRatio < 30) score += 80;
  else if (utilizationRatio < 50) score += 40;
  else score += 0;

  // Payment of Minimum Amount (max 100 points)
  if (client.payment_of_min_amount === 'Yes') score += 100;
  else if (client.payment_of_min_amount === 'NM') score += 50;
  else score += 0;

  // Credit Mix (max 80 points)
  if (client.credit_mix === 'Good') score += 80;
  else if (client.credit_mix === 'Standard') score += 50;
  else score += 10;

  // Delayed Payments penalty (max -100 points)
  const delayedPayments = client.num_of_delayed_payment || 0;
  if (delayedPayments > 10) score -= 100;
  else if (delayedPayments > 5) score -= 60;
  else if (delayedPayments > 2) score -= 30;
  else if (delayedPayments > 0) score -= 10;

  // Credit History Age (max 100 points) - longer is better
  const historyMonths = client.credit_history_age_months || 0;
  if (historyMonths >= 120) score += 100; // 10+ years
  else if (historyMonths >= 60) score += 80; // 5+ years
  else if (historyMonths >= 24) score += 50; // 2+ years
  else if (historyMonths >= 12) score += 25; // 1+ year
  else score += 0;

  // Monthly Balance to Debt ratio (max 70 points)
  const monthlyBalance = client.monthly_balance || 0;
  const outstandingDebt = client.outstanding_debt || 1;
  const balanceRatio = monthlyBalance / Math.max(outstandingDebt, 1);
  if (balanceRatio > 0.5) score += 70;
  else if (balanceRatio > 0.2) score += 50;
  else if (balanceRatio > 0.1) score += 30;
  else score += 10;

  // Investment behavior (max 50 points)
  const investedMonthly = client.amount_invested_monthly || 0;
  if (investedMonthly > 500) score += 50;
  else if (investedMonthly > 200) score += 35;
  else if (investedMonthly > 50) score += 20;
  else score += 5;

  // Credit Inquiries penalty (max -50 points)
  const inquiries = client.num_credit_inquiries || 0;
  if (inquiries > 10) score -= 50;
  else if (inquiries > 5) score -= 30;
  else if (inquiries > 3) score -= 15;

  // Backend credit score bonus
  if (client.credit_score === 'Good') score += 50;
  else if (client.credit_score === 'Standard') score += 25;
  else if (client.credit_score === 'Poor') score -= 25;

  // Clamp score between 300 and 850
  score = Math.max(300, Math.min(850, score));

  const grade = getGrade(score);
  const riskLevel = getRiskLevel(grade);

  return { score, grade, riskLevel };
}

function getGrade(score: number): CreditGrade {
  if (score >= 750) return 'A';
  if (score >= 650) return 'B';
  if (score >= 550) return 'C';
  if (score >= 450) return 'D';
  return 'E';
}

function getRiskLevel(grade: CreditGrade): RiskLevel {
  switch (grade) {
    case 'A': return 'Low';
    case 'B': return 'Medium';
    case 'C': return 'Medium';
    case 'D': return 'High';
    case 'E': return 'Very High';
  }
}

export function getScoreColor(grade: CreditGrade): string {
  switch (grade) {
    case 'A': return 'text-score-excellent';
    case 'B': return 'text-score-good';
    case 'C': return 'text-score-fair';
    case 'D': return 'text-score-poor';
    case 'E': return 'text-score-very-poor';
  }
}

export function getScoreBgColor(grade: CreditGrade): string {
  switch (grade) {
    case 'A': return 'bg-score-excellent';
    case 'B': return 'bg-score-good';
    case 'C': return 'bg-score-fair';
    case 'D': return 'bg-score-poor';
    case 'E': return 'bg-score-very-poor';
  }
}
