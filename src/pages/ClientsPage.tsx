import { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientDetail } from '@/components/clients/ClientDetail';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';

type View = 'list' | 'add' | 'edit' | 'detail';

export function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, getClient } = useClients();
  const [view, setView] = useState<View>('list');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedClient = selectedClientId ? getClient(selectedClientId) : null;

  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  });

  const handleAddClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(data);
    setView('list');
  };

  const handleUpdateClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedClientId) {
      updateClient(selectedClientId, data);
      setView('detail');
    }
  };

  const handleDeleteClient = () => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
      setSelectedClientId(null);
      setView('list');
    }
  };

  const handleClientClick = (id: string) => {
    setSelectedClientId(id);
    setView('detail');
  };

  if (view === 'add') {
    return (
      <ClientForm
        onSubmit={handleAddClient}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'edit' && selectedClient) {
    return (
      <ClientForm
        onSubmit={handleUpdateClient}
        onCancel={() => setView('detail')}
        initialData={selectedClient}
      />
    );
  }

  if (view === 'detail' && selectedClient) {
    return (
      <ClientDetail
        client={selectedClient}
        onBack={() => {
          setSelectedClientId(null);
          setView('list');
        }}
        onEdit={() => setView('edit')}
        onDelete={handleDeleteClient}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client profiles and credit assessments</p>
        </div>
        <Button onClick={() => setView('add')} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => handleClientClick(client.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-lg font-semibold">No clients found</h3>
          <p className="text-muted-foreground mt-1">
            {clients.length === 0
              ? 'Add your first client to get started'
              : 'Try adjusting your search query'}
          </p>
          {clients.length === 0 && (
            <Button onClick={() => setView('add')} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
