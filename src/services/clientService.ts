import { apiClient, ApiResponse } from './api';
import { Client } from '@/types/client';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ClientFilters {
  search?: string;
  credit_mix?: string;
  credit_score?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API endpoints for client management
const CLIENT_ENDPOINTS = {
  BASE: '/clients',
  BY_ID: (id: string) => `/clients/${id}`,
  CREDIT_SCORE: (id: string) => `/clients/${id}/credit-score`,
  EXPORT: '/clients/export',
  IMPORT: '/clients/import',
  STATISTICS: '/clients/statistics',
};

export const clientService = {
  /**
   * Get all clients with optional filtering and pagination
   */
  async getClients(filters?: ClientFilters): Promise<ApiResponse<PaginatedResponse<Client>>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `${CLIENT_ENDPOINTS.BASE}?${queryString}` : CLIENT_ENDPOINTS.BASE;
    
    return apiClient.get(endpoint);
  },

  /**
   * Get a single client by ID
   */
  async getClient(id: string): Promise<ApiResponse<Client>> {
    return apiClient.get(CLIENT_ENDPOINTS.BY_ID(id));
  },

  /**
   * Create a new client
   */
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Client>> {
    return apiClient.post(CLIENT_ENDPOINTS.BASE, client);
  },

  /**
   * Update an existing client
   */
  async updateClient(id: string, updates: Partial<Client>): Promise<ApiResponse<Client>> {
    return apiClient.patch(CLIENT_ENDPOINTS.BY_ID(id), updates);
  },

  /**
   * Delete a client
   */
  async deleteClient(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(CLIENT_ENDPOINTS.BY_ID(id));
  },

  /**
   * Get credit score for a client
   */
  async getCreditScore(id: string): Promise<ApiResponse<{
    score: number;
    grade: string;
    riskLevel: string;
    factors: Array<{ name: string; impact: 'positive' | 'negative' | 'neutral'; description: string }>;
  }>> {
    return apiClient.get(CLIENT_ENDPOINTS.CREDIT_SCORE(id));
  },

  /**
   * Export clients data (CSV/PDF)
   */
  async exportClients(format: 'csv' | 'pdf', clientIds?: string[]): Promise<ApiResponse<Blob>> {
    return apiClient.post(CLIENT_ENDPOINTS.EXPORT, { format, clientIds });
  },

  /**
   * Import clients from file
   */
  async importClients(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Note: For file uploads, you'd typically use a different approach
    return apiClient.post(CLIENT_ENDPOINTS.IMPORT, { file: file.name });
  },

  /**
   * Get client statistics for dashboard
   */
  async getStatistics(): Promise<ApiResponse<{
    totalClients: number;
    averageScore: number;
    scoreDistribution: Record<string, number>;
    recentActivity: Array<{ date: string; count: number }>;
  }>> {
    return apiClient.get(CLIENT_ENDPOINTS.STATISTICS);
  },
};

export type { PaginatedResponse, ClientFilters };
