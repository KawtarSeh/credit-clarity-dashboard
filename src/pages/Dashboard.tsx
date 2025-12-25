import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { User } from '@/types/client';

type Section = 'dashboard' | 'clients';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogout={onLogout}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      
      <main className="container py-8">
        {currentSection === 'dashboard' && <DashboardPage />}
        {currentSection === 'clients' && <ClientsPage />}
      </main>
    </div>
  );
}
