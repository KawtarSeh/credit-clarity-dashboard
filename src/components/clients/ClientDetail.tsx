import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  AlertTriangle,
  FileDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Client } from '@/types/client';
import { exportClientReport } from '@/lib/pdfExport';
import { cn } from '@/lib/utils';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/* ===============================
   UI MAPPING (NO BUSINESS LOGIC)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-display text-2xl font-bold">
            Client Profile
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportClientReport(client)}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>

          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Client
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{' '}
                  {client.nom} {client.prenom} ?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ================= CREDIT SCORE ================= */}
        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={cn(
                'mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full text-6xl font-bold text-primary-foreground',
                getScoreBgColor(score)
              )}
            >
              {score ?? '-'}
            </div>

            <p className="text-4xl font-bold">
              {score ?? 'N/A'}
            </p>
            <p className="text-muted-foreground">
              Credit Score 
            </p>

            <Badge
              className="mt-4"
              variant={
                riskLevel === 'Low'
                  ? 'default'
                  : riskLevel === 'Very High'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              Risque {riskLevel}
            </Badge>
            {client.credit_score && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Score Backend</p>
                <Badge variant="outline" className="mt-1">{client.credit_score}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ================= PERSONAL INFO ================= */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Full Name
              </p>
              <p className="font-medium">
                {client.nom} {client.prenom}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Age
              </p>
              <p className="font-medium">
                {client.age ? `${client.age} years` : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= FINANCIAL INFO ================= */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Informations de Crédit
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly Investment
              </p>
              <p className="text-2xl font-bold">
                ${client.amount_invested_monthly?.toLocaleString() ?? '0'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Monthly Balance
              </p>
              <p className="text-2xl font-bold">
                ${client.monthly_balance?.toLocaleString() ?? '0'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Debt Ratio
              </p>
              <p
                className={cn(
                  'text-2xl font-bold',
                  parseFloat(debtToIncomeRatio) > 50
                    ? 'text-destructive'
                    : parseFloat(debtToIncomeRatio) > 35
                    ? 'text-score-fair'
                    : 'text-score-good'
                )}
              >
                {debtToIncomeRatio}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= CREDIT HISTORY ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credit History
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Credit Mix
              </p>
              <Badge variant="outline">
                {client.credit_mix ?? 'Unknown'}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                History Age
              </p>
              <p className="font-medium">
                {client.credit_history_age ?? '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================= RISK FACTORS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Facteurs de Risque
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2 text-sm">
              {(client.num_of_delayed_payment ?? 0) > 3 && (
                <li className="text-score-poor">
                  • Multiple delayed payments
                </li>
              )}

              {client.payment_of_min_amount === 'No' && (
                <li className="text-score-fair">
                  • Minimum payment not respected
                </li>
              )}

              {score === 'Good' && (
                <li className="text-score-excellent">
                  ✓ Excellent credit profile
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
