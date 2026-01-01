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

// Backend endpoints (Flask)
const CLIENT_ENDPOINTS = {
  BASE: '/api/clients',
  BY_ID: (id: string) => `/api/clients/${id}`,
};

export const clientService = {
  // ------------------------------------
  // GET all clients
  // ------------------------------------
  async getClients(
    filters?: ClientFilters
  ): Promise<ApiResponse<PaginatedResponse<Client>>> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const query = params.toString();
    const endpoint = query
      ? `${CLIENT_ENDPOINTS.BASE}?${query}`
      : CLIENT_ENDPOINTS.BASE;

    return apiClient.get(endpoint);
  },

  // ------------------------------------
  // GET client by ID
  // ------------------------------------
  async getClient(id: string): Promise<ApiResponse<Client>> {
    return apiClient.get(CLIENT_ENDPOINTS.BY_ID(id));
  },

  // ------------------------------------
  // CREATE client
  // ------------------------------------
  async createClient(
    client: Omit<Client, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<Client>> {
    return apiClient.post(CLIENT_ENDPOINTS.BASE, client);
  },

  // ------------------------------------
  // UPDATE client
  // ------------------------------------
  async updateClient(
    id: string,
    updates: Partial<Client>
  ): Promise<ApiResponse<Client>> {
    return apiClient.patch(CLIENT_ENDPOINTS.BY_ID(id), updates);
  },

  // ------------------------------------
  // DELETE client
  // ------------------------------------
  async deleteClient(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(CLIENT_ENDPOINTS.BY_ID(id));
  },
};

export type { PaginatedResponse, ClientFilters };
