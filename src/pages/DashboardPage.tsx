import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ScoreDistribution } from '@/components/dashboard/ScoreDistribution';
import { useClients } from '@/hooks/useClients';
import { calculateCreditScore } from '@/lib/creditScoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  const { clients } = useClients();

  const stats = {
    totalClients: clients.length,
    lowRisk: clients.filter(c => calculateCreditScore(c).riskLevel === 'Low').length,
    mediumRisk: clients.filter(c => calculateCreditScore(c).riskLevel === 'Medium').length,
    highRisk: clients.filter(c => ['High', 'Very High'].includes(calculateCreditScore(c).riskLevel)).length,
    avgScore: clients.length > 0
      ? Math.round(clients.reduce((acc, c) => acc + calculateCreditScore(c).score, 0) / clients.length)
      : 0,
  };

  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your credit scoring analytics</p>
      </div>

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
          className="border-l-4 border-l-score-good"
        />
        <StatsCard
          title="High Risk"
          value={stats.highRisk}
          icon={AlertTriangle}
          description="Grade D-E clients"
          className="border-l-4 border-l-score-poor"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Score Distribution */}
        <ScoreDistribution clients={clients} />

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client) => {
                  const { grade, riskLevel } = calculateCreditScore(client);
                  return (
                    <div
                      key={client.id}
                      className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Grade {grade}</p>
                        <p className="text-sm text-muted-foreground">{riskLevel} Risk</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No clients yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
