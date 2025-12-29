import { ArrowLeft, Edit, Trash2, User, CreditCard, DollarSign, TrendingUp, AlertTriangle, FileDown, Calendar } from 'lucide-react';
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
import { calculateCreditScore, getScoreBgColor } from '@/lib/creditScoring';
import { exportClientReport } from '@/lib/pdfExport';
import { cn } from '@/lib/utils';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientDetail({ client, onBack, onEdit, onDelete }: ClientDetailProps) {
  const { score, grade, riskLevel } = calculateCreditScore(client);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-display text-2xl font-bold">Profil Client</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportClientReport(client)}>
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
                <AlertDialogTitle>Supprimer le Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer {client.prenom} {client.nom}? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Credit Score Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className={cn(
              "mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full text-6xl font-display font-bold text-primary-foreground shadow-lg",
              getScoreBgColor(grade)
            )}>
              {grade}
            </div>
            <p className="text-4xl font-display font-bold">{score}</p>
            <p className="text-muted-foreground">Score de Crédit</p>
            <Badge 
              className="mt-4" 
              variant={riskLevel === 'Low' ? 'default' : riskLevel === 'Very High' ? 'destructive' : 'secondary'}
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

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nom Complet</p>
              <p className="font-medium">{client.prenom || '-'} {client.nom || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Âge
              </p>
              <p className="font-medium">{client.age || '-'} ans</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Historique Crédit</p>
              <p className="font-medium">{client.credit_history_age || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Credit Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Informations de Crédit
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dettes Impayées</p>
              <p className="text-2xl font-display font-bold">${(client.outstanding_debt || 0).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ratio d'Utilisation</p>
              <p className={cn(
                "text-2xl font-display font-bold",
                (client.credit_utilization_ratio || 0) > 50 ? "text-destructive" : (client.credit_utilization_ratio || 0) > 30 ? "text-score-fair" : "text-score-good"
              )}>
                {(client.credit_utilization_ratio || 0).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Credit Mix</p>
              <Badge variant="outline" className="capitalize">{client.credit_mix || 'N/A'}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Paiements en Retard</p>
              <p className="font-medium">{client.num_of_delayed_payment ?? '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Demandes de Crédit</p>
              <p className="font-medium">{client.num_credit_inquiries ?? '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Modification Limite</p>
              <p className="font-medium">{client.changed_credit_limit != null ? `${client.changed_credit_limit}%` : '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Paiements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Paiement Minimum</p>
              <Badge variant="outline">{client.payment_of_min_amount === 'Yes' ? 'Oui' : client.payment_of_min_amount === 'No' ? 'Non' : 'N/A'}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">EMI Mensuel</p>
              <p className="font-medium">${(client.total_emi_per_month || 0).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Solde Mensuel</p>
              <p className="font-medium">${(client.monthly_balance || 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Investment & Behavior */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Comportement Financier
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Investissement Mensuel</p>
              <p className="text-2xl font-display font-bold">${(client.amount_invested_monthly || 0).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Comportement de Paiement</p>
              <p className="font-medium text-sm">{client.payment_behaviour || 'Non spécifié'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Historique (mois)</p>
              <p className="font-medium">{client.credit_history_age_months ?? '-'} mois</p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Facteurs de Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(client.credit_utilization_ratio || 0) > 30 && (
                <li className="flex items-start gap-2 text-score-poor">
                  <span>•</span>
                  <span>Ratio d'utilisation élevé ({(client.credit_utilization_ratio || 0).toFixed(1)}%)</span>
                </li>
              )}
              {(client.num_of_delayed_payment || 0) > 0 && (
                <li className="flex items-start gap-2 text-score-poor">
                  <span>•</span>
                  <span>Paiements en retard ({client.num_of_delayed_payment})</span>
                </li>
              )}
              {client.payment_of_min_amount === 'No' && (
                <li className="flex items-start gap-2 text-score-fair">
                  <span>•</span>
                  <span>Ne paie pas le minimum</span>
                </li>
              )}
              {client.credit_mix === 'Bad' && (
                <li className="flex items-start gap-2 text-score-fair">
                  <span>•</span>
                  <span>Mauvaise diversification de crédit</span>
                </li>
              )}
              {grade === 'A' && (
                <li className="flex items-start gap-2 text-score-excellent">
                  <span>✓</span>
                  <span>Excellent profil de crédit - Risque faible</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
