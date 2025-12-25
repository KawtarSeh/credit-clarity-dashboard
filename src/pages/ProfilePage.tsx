import { useState } from 'react';
import { User, Mail, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserType } from '@/types/client';
import { toast } from 'sonner';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onBack: () => void;
}

export function ProfilePage({ user, onUpdateUser, onBack }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onUpdateUser({ name: name.trim(), email: email.trim() });
    toast.success('Profile updated successfully');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="bg-gradient-primary"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
