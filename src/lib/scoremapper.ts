export type RiskLevel = 'Low' | 'Medium' | 'High';;

export function mapGradeToScore(grade?: string): number {
  switch (grade) {
    case 'A': return 820;
    case 'B': return 700;
    case 'C': return 600;
    case 'D': return 500;
    case 'E': return 400;
    default: return 0;
  }
}

export function mapGradeToRiskLevel(grade?: string): RiskLevel {
  switch (grade) {
    case 'A': return 'Low';
    case 'B': return 'Medium';
    case 'C': return 'High';
    default:
      return 'High';
  }
}
