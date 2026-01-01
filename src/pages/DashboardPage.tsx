import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ScoreDistribution } from '@/components/dashboard/ScoreDistribution';
import { useClients } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types/client';

/* =========================
   UI HELPERS (NO BUSINESS LOGIC)
========================= */

function getRiskLevel(score?: string) {
  switch (score) {
    case 'A':
      return 'Low';
    case 'B':
      return 'Medium';
    case 'C':
      return 'High';
    case 'D':
    case 'E':
      return 'Very High';
    default:
      return 'Unknown';
  }
}

/**
 * Used only to compute an average indicator
 * (visual KPI, NOT a real ML score)
 */
function scoreToNumber(score?: string) {
  switch (score) {
    case 'A':
      return 5;
    case 'B':
      return 4;
    case 'C':
      return 3;
    case 'D':
      return 2;
    case 'E':
      return 1;
    default:
      return 0;
  }
}

export function DashboardPage() {
  const { clients } = useClients();

  /* =========================
     STATS (BACKEND DRIVEN)
  ========================= */

  const totalClients = clients.length;

  const lowRisk = clients.filter(c => c.credit_score === 'A').length;

  const highRisk = clients.filter(c =>
    ['D', 'E'].includes(c.credit_score ?? '')
  ).length;

  const avgScore =
    clients.length > 0
      ? Math.round(
          clients.reduce(
            (acc, c) => acc + scoreToNumber(c.credit_score),
            0
          ) / clients.length
        )
      : 0;

  const recentClients = [...clients]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="font-display text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your credit scoring analytics
        </p>
      </div>

      {/* ================= STATS GRID ================= */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clients"
          value={totalClients}
          icon={Users}
          description="Active profiles"
        />

        <StatsCard
          title="Average Grade"
          value={avgScore || '—'}
          icon={TrendingUp}
          description="Backend ML based"
        />

        <StatsCard
          title="Low Risk"
          value={lowRisk}
          icon={CheckCircle}
          description="Grade A clients"
          className="border-l-4 border-l-score-good"
        />

        <StatsCard
          title="High Risk"
          value={highRisk}
          icon={AlertTriangle}
          description="Grade D-E clients"
          className="border-l-4 border-l-score-poor"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ================= SCORE DISTRIBUTION ================= */}
        <ScoreDistribution clients={clients} />

        {/* ================= RECENT CLIENTS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">
              Recent Clients
            </CardTitle>
          </CardHeader>

          <CardContent>
            {recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client: Client) => {
                  const riskLevel = getRiskLevel(
                    client.credit_score
                  );

                  return (
                    <div
                      key={client.id}
                      className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">
                          {client.nom} {client.prenom}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          Grade {client.credit_score ?? '—'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {riskLevel} Risk
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  No clients yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
