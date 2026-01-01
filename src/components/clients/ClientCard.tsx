import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/client';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

/**
 * UI mapping ONLY (no business logic)
 */
function getScoreBgColor(score?: string) {
  switch (score) {
    case 'A':
      return 'bg-score-excellent';
    case 'B':
      return 'bg-score-good';
    case 'C':
      return 'bg-score-poor';
    default:
      return 'bg-muted';
  }
}

function getRiskLabel(score?: string) {
  switch (score) {
    case 'A':
      return 'Low';
    case 'B':
      return 'Medium';
    case 'C':
      return 'High';
    default:
      return 'Unknown';
  }
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const score = client.credit_score;
  const riskLevel = getRiskLabel(score);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in"
    >
      <CardContent className="p-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg">
                {client.prenom || ''} {client.nom || 'Client'}
              </h3>

              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                {client.age !== null && client.age !== undefined && (
                  <span>{client.age} ans</span>
                )}

                {score && (
                  <Badge variant="outline" className="text-xs">
                    ML Score: {score}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ================= SCORE ================= */}
          <div className="text-right">
            <div
              className={cn(
                'inline-flex h-12 w-12 items-center justify-center rounded-xl text-xl font-display font-bold text-primary-foreground',
                getScoreBgColor(score)
              )}
            >
              {score ?? '-'}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Risk: {riskLevel}
            </p>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Dettes</p>
            <p className="font-medium">
              {(client.outstanding_debt ?? 0).toLocaleString()} $
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Utilisation Crédit</p>
            <p className="font-medium">
              {(client.credit_utilization_ratio ?? 0).toFixed(1)} %
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Credit Mix</p>
            <p className="font-medium capitalize">
              {client.credit_mix || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Risque</p>
            <Badge
              variant={
                riskLevel === 'Low'
                  ? 'default'
                  : riskLevel === 'High'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {riskLevel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
