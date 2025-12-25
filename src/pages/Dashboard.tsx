import { useState, useCallback } from 'react';
import { Header, Section } from '@/components/layout/Header';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { User } from '@/types/client';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [previousSection, setPreviousSection] = useState<Section>('dashboard');

  const handleSectionChange = useCallback((section: Section) => {
    if (section === 'profile') {
      setPreviousSection(currentSection);
    }
    setCurrentSection(section);
  }, [currentSection]);

  const handleBackFromProfile = useCallback(() => {
    setCurrentSection(previousSection);
  }, [previousSection]);
  

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogout={onLogout}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      <main className="container py-8">
        {currentSection === 'dashboard' && <DashboardPage />}
        {currentSection === 'clients' && <ClientsPage />}
        {currentSection === 'profile' && (
          <ProfilePage 
            user={user} 
            onUpdateUser={onUpdateUser}
            onBack={handleBackFromProfile}
          />
        )}
      </main>
    </div>
  );
}
