import { useState, useMemo, useEffect } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientDetail } from '@/components/clients/ClientDetail';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';

type View = 'list' | 'add' | 'edit' | 'detail';

export function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, getClient } = useClients();
  const [view, setView] = useState<View>('list');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch selected client when ID changes
  useEffect(() => {
    const fetchSelectedClient = async () => {
      if (selectedClientId) {
        const client = await getClient(selectedClientId);
        setSelectedClient(client || null);
      } else {
        setSelectedClient(null);
      }
    };
    fetchSelectedClient();
  }, [selectedClientId, getClient]);

  const filteredClients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return clients.filter(client =>
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredClients.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => handleClientClick(client.id)}
              />
            ))}
          </div>
          
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredClients.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
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
