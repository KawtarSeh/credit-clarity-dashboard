import { User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/client';
import { calculateCreditScore, getScoreColor, getScoreBgColor } from '@/lib/creditScoring';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const { score, grade, riskLevel } = calculateCreditScore(client);

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">
                {client.firstName} {client.lastName}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {client.email}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-xl text-xl font-display font-bold text-primary-foreground",
              getScoreBgColor(grade)
            )}>
              {grade}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Score: {score}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Annual Income</p>
            <p className="font-medium">${client.annualIncome.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Monthly Debt</p>
            <p className="font-medium">${client.monthlyDebt.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Employment</p>
            <p className="font-medium capitalize">{client.employmentStatus.replace('-', ' ')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <Badge variant={riskLevel === 'Low' ? 'default' : riskLevel === 'Very High' ? 'destructive' : 'secondary'}>
              {riskLevel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
