import { apiClient, ApiResponse } from './api';
import { Client, CreditScore } from '@/types/client';

interface CreditFactors {
  incomeStability: number;
  debtToIncomeRatio: number;
  employmentHistory: number;
  creditHistoryScore: number;
  paymentBehavior: number;
  existingDebtLoad: number;
}

interface CreditReport {
  clientId: string;
  score: CreditScore;
  factors: CreditFactors;
  recommendations: string[];
  generatedAt: string;
}

interface ScoreSimulation {
  currentScore: number;
  projectedScore: number;
  changes: Array<{
    factor: string;
    currentValue: number | string;
    newValue: number | string;
    scoreImpact: number;
  }>;
}

// API endpoints for credit scoring
const SCORING_ENDPOINTS = {
  CALCULATE: '/scoring/calculate',
  REPORT: (clientId: string) => `/scoring/report/${clientId}`,
  SIMULATE: '/scoring/simulate',
  BATCH_CALCULATE: '/scoring/batch',
  HISTORY: (clientId: string) => `/scoring/history/${clientId}`,
  FACTORS: '/scoring/factors',
};

export const creditScoringService = {
  /**
   * Calculate credit score for a client
   */
  async calculateScore(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CreditScore>> {
    return apiClient.post(SCORING_ENDPOINTS.CALCULATE, clientData);
  },

  /**
   * Get full credit report for a client
   */
  async getCreditReport(clientId: string): Promise<ApiResponse<CreditReport>> {
    return apiClient.get(SCORING_ENDPOINTS.REPORT(clientId));
  },

  /**
   * Simulate score changes based on hypothetical modifications
   */
  async simulateScoreChange(
    clientId: string,
    changes: Partial<Client>
  ): Promise<ApiResponse<ScoreSimulation>> {
    return apiClient.post(SCORING_ENDPOINTS.SIMULATE, { clientId, changes });
  },

  /**
   * Batch calculate scores for multiple clients
   */
  async batchCalculate(clientIds: string[]): Promise<ApiResponse<Array<{
    clientId: string;
    score: CreditScore;
  }>>> {
    return apiClient.post(SCORING_ENDPOINTS.BATCH_CALCULATE, { clientIds });
  },

  /**
   * Get score history for a client
   */
  async getScoreHistory(clientId: string): Promise<ApiResponse<Array<{
    score: number;
    grade: string;
    calculatedAt: string;
  }>>> {
    return apiClient.get(SCORING_ENDPOINTS.HISTORY(clientId));
  },

  /**
   * Get scoring factor definitions and weights
   */
  async getScoringFactors(): Promise<ApiResponse<Array<{
    name: string;
    weight: number;
    description: string;
  }>>> {
    return apiClient.get(SCORING_ENDPOINTS.FACTORS);
  },
};

export type { CreditFactors, CreditReport, ScoreSimulation };
