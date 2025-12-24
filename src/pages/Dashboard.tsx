import { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ScoreDistribution } from '@/components/dashboard/ScoreDistribution';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientDetail } from '@/components/clients/ClientDetail';
import { User, Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import { calculateCreditScore } from '@/lib/creditScoring';

type View = 'dashboard' | 'add-client' | 'edit-client' | 'client-detail';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { clients, addClient, updateClient, deleteClient, getClient } = useClients();
  const [view, setView] = useState<View>('dashboard');
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

  const stats = {
    totalClients: clients.length,
    lowRisk: clients.filter(c => calculateCreditScore(c).riskLevel === 'Low').length,
    highRisk: clients.filter(c => ['High', 'Very High'].includes(calculateCreditScore(c).riskLevel)).length,
    avgScore: clients.length > 0
      ? Math.round(clients.reduce((acc, c) => acc + calculateCreditScore(c).score, 0) / clients.length)
      : 0,
  };

  const handleAddClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(data);
    setView('dashboard');
  };

  const handleUpdateClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedClientId) {
      updateClient(selectedClientId, data);
      setView('client-detail');
    }
  };

  const handleDeleteClient = () => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
      setSelectedClientId(null);
      setView('dashboard');
    }
  };

  const handleClientClick = (id: string) => {
    setSelectedClientId(id);
    setView('client-detail');
  };

  if (view === 'add-client') {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <main className="container py-8">
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setView('dashboard')}
          />
        </main>
      </div>
    );
  }

  if (view === 'edit-client' && selectedClient) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <main className="container py-8">
          <ClientForm
            onSubmit={handleUpdateClient}
            onCancel={() => setView('client-detail')}
            initialData={selectedClient}
          />
        </main>
      </div>
    );
  }

  if (view === 'client-detail' && selectedClient) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <main className="container py-8">
          <ClientDetail
            client={selectedClient}
            onBack={() => {
              setSelectedClientId(null);
              setView('dashboard');
            }}
            onEdit={() => setView('edit-client')}
            onDelete={handleDeleteClient}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            description="Active profiles"
          />
          <StatsCard
            title="Average Score"
            value={stats.avgScore || '—'}
            icon={TrendingUp}
            description="Across all clients"
          />
          <StatsCard
            title="Low Risk"
            value={stats.lowRisk}
            icon={CheckCircle}
            description="Grade A clients"
          />
          <StatsCard
            title="High Risk"
            value={stats.highRisk}
            icon={AlertTriangle}
            description="Grade D-E clients"
          />
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Client List */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold">Clients</h2>
              <Button onClick={() => setView('add-client')} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredClients.length > 0 ? (
              <div className="space-y-4">
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
              </div>
            )}
          </section>

          {/* Score Distribution */}
          <aside className="space-y-4">
            <ScoreDistribution clients={clients} />
          </aside>
        </div>
      </main>
    </div>
  );
}
