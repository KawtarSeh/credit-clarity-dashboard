import { Client, CreditScore, CreditGrade, RiskLevel } from '@/types/client';

export function calculateCreditScore(client: Client): CreditScore {
  let score = 300; // Base score

  // Income factor (max 200 points)
  const debtToIncomeRatio = (client.monthlyDebt * 12) / client.annualIncome;
  if (debtToIncomeRatio < 0.2) score += 200;
  else if (debtToIncomeRatio < 0.35) score += 150;
  else if (debtToIncomeRatio < 0.5) score += 100;
  else if (debtToIncomeRatio < 0.65) score += 50;

  // Employment stability (max 150 points)
  if (client.employmentStatus === 'employed' || client.employmentStatus === 'self-employed') {
    if (client.employmentYears >= 5) score += 150;
    else if (client.employmentYears >= 3) score += 120;
    else if (client.employmentYears >= 1) score += 80;
    else score += 40;
  } else if (client.employmentStatus === 'retired') {
    score += 100;
  }

  // Credit history (max 150 points)
  switch (client.creditHistory) {
    case 'excellent': score += 150; break;
    case 'good': score += 120; break;
    case 'fair': score += 80; break;
    case 'poor': score += 30; break;
    case 'none': score += 50; break;
  }

  // Payment history (max 200 points)
  switch (client.paymentHistory) {
    case 'always-on-time': score += 200; break;
    case 'occasional-late': score += 120; break;
    case 'frequent-late': score += 50; break;
    case 'defaults': score += 0; break;
  }

  // Existing loans penalty (max -100 points)
  if (client.existingLoans > 5) score -= 100;
  else if (client.existingLoans > 3) score -= 60;
  else if (client.existingLoans > 1) score -= 30;

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
