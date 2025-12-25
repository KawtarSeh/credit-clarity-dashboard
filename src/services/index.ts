// Export all services for easy importing
export { apiClient } from './api';
export type { ApiResponse } from './api';

export { authService } from './authService';
export { clientService } from './clientService';
export type { PaginatedResponse, ClientFilters } from './clientService';

export { creditScoringService } from './creditScoringService';
export type { CreditFactors, CreditReport, ScoreSimulation } from './creditScoringService';
