import { useState, useEffect, useCallback } from 'react';
import { Client } from '@/types/client';
import { clientService, ClientFilters } from '@/services/clientService';

const CLIENTS_KEY = 'creditscore_clients';

// Set to true to use real API, false for localStorage demo mode
const USE_API = import.meta.env.VITE_USE_API === 'true';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------
  // Fetch clients
  // -------------------------------
  const fetchClients = useCallback(async (filters?: ClientFilters) => {
    setIsLoading(true);
    setError(null);

    if (USE_API) {
      const response = await clientService.getClients(filters);
      if (response.data) {
        setClients(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch clients');
      }
    } else {
      const stored = localStorage.getItem(CLIENTS_KEY);
      if (stored) {
        setClients(JSON.parse(stored));
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // -------------------------------
  // LocalStorage helper
  // -------------------------------
  const saveClients = useCallback((newClients: Client[]) => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(newClients));
    setClients(newClients);
  }, []);

  // -------------------------------
  // Create client
  // -------------------------------
  const addClient = useCallback(
    async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
      if (USE_API) {
        const response = await clientService.createClient(clientData);
        if (response.data) {
          setClients(prev => [...prev, response.data]);
          return response.data;
        }
        throw new Error(response.error || 'Failed to create client');
      }

      // Demo mode
      const newClient: Client = {
        ...clientData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      saveClients([...clients, newClient]);
      return newClient;
    },
    [clients, saveClients]
  );

  // -------------------------------
  // Update client
  // -------------------------------
  const updateClient = useCallback(
    async (id: string, updates: Partial<Client>) => {
      if (USE_API) {
        const response = await clientService.updateClient(id, updates);
        if (response.data) {
          setClients(prev =>
            prev.map(c => (c.id === id ? response.data : c))
          );
          return;
        }
        throw new Error(response.error || 'Failed to update client');
      }

      // Demo mode
      const updatedClients = clients.map(client =>
        client.id === id
          ? {
              ...client,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : client
      );

      saveClients(updatedClients);
    },
    [clients, saveClients]
  );

  // -------------------------------
  // Delete client
  // -------------------------------
  const deleteClient = useCallback(
    async (id: string) => {
      if (USE_API) {
        const response = await clientService.deleteClient(id);
        if (!response.error) {
          setClients(prev => prev.filter(c => c.id !== id));
          return;
        }
        throw new Error(response.error || 'Failed to delete client');
      }

      saveClients(clients.filter(client => client.id !== id));
    },
    [clients, saveClients]
  );

  // -------------------------------
  // Get single client
  // -------------------------------
  const getClient = useCallback(
    async (id: string) => {
      if (USE_API) {
        const response = await clientService.getClient(id);
        return response.data;
      }
      return clients.find(client => client.id === id);
    },
    [clients]
  );

  const refetch = useCallback(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    refetch,
  };
}
