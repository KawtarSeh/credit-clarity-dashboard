import { useState, useEffect, useCallback } from 'react';
import { Client } from '@/types/client';

const CLIENTS_KEY = 'creditscore_clients';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CLIENTS_KEY);
    if (stored) {
      setClients(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const saveClients = useCallback((newClients: Client[]) => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(newClients));
    setClients(newClients);
  }, []);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveClients([...clients, newClient]);
    return newClient;
  }, [clients, saveClients]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id
        ? { ...client, ...updates, updatedAt: new Date().toISOString() }
        : client
    );
    saveClients(updatedClients);
  }, [clients, saveClients]);

  const deleteClient = useCallback((id: string) => {
    saveClients(clients.filter(client => client.id !== id));
  }, [clients, saveClients]);

  const getClient = useCallback((id: string) => {
    return clients.find(client => client.id === id);
  }, [clients]);

  return { clients, isLoading, addClient, updateClient, deleteClient, getClient };
}
