import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types/client';
import { calculateCreditScore, getScoreBgColor } from '@/lib/creditScoring';
import { cn } from '@/lib/utils';

interface ScoreDistributionProps {
  clients: Client[];
}

export function ScoreDistribution({ clients }: ScoreDistributionProps) {
  const distribution = clients.reduce((acc, client) => {
    const { grade } = calculateCreditScore(client);
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const grades = ['A', 'B', 'C', 'D', 'E'] as const;
  const maxCount = Math.max(...grades.map(g => distribution[g] || 0), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Credit Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {grades.map((grade) => {
            const count = distribution[grade] || 0;
            const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
            const barWidth = (count / maxCount) * 100;

            return (
              <div key={grade} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Grade {grade}</span>
                  <span className="text-muted-foreground">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getScoreBgColor(grade)
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
