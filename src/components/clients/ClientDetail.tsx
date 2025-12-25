import { ArrowLeft, Edit, Trash2, User, Mail, Phone, Calendar, Briefcase, DollarSign, CreditCard, Clock, AlertTriangle, FileDown } from 'lucide-react';
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
import { calculateCreditScore, getScoreColor, getScoreBgColor } from '@/lib/creditScoring';
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
  const debtToIncomeRatio = ((client.monthlyDebt * 12) / client.annualIncome * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-display text-2xl font-bold">Client Profile</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportClientReport(client)}>
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {client.firstName} {client.lastName}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
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
            <p className="text-muted-foreground">Credit Score</p>
            <Badge 
              className="mt-4" 
              variant={riskLevel === 'Low' ? 'default' : riskLevel === 'Very High' ? 'destructive' : 'secondary'}
            >
              {riskLevel} Risk
            </Badge>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{client.firstName} {client.lastName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="font-medium">{client.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </p>
              <p className="font-medium">{client.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date of Birth
              </p>
              <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Annual Income</p>
              <p className="text-2xl font-display font-bold">${client.annualIncome.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Debt</p>
              <p className="text-2xl font-display font-bold">${client.monthlyDebt.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Debt-to-Income Ratio</p>
              <p className={cn(
                "text-2xl font-display font-bold",
                parseFloat(debtToIncomeRatio) > 50 ? "text-destructive" : parseFloat(debtToIncomeRatio) > 35 ? "text-score-fair" : "text-score-good"
              )}>
                {debtToIncomeRatio}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Existing Loans</p>
              <p className="font-medium">{client.existingLoans}</p>
            </div>
          </CardContent>
        </Card>

        {/* Employment & Credit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Employment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{client.employmentStatus.replace('-', ' ')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Years at Current Job</p>
              <p className="font-medium">{client.employmentYears} years</p>
            </div>
          </CardContent>
        </Card>

        {/* Credit History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credit History
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Credit History Quality</p>
              <Badge variant="outline" className="capitalize">{client.creditHistory}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment History</p>
              <Badge variant="outline" className="capitalize">{client.paymentHistory.replace(/-/g, ' ')}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {parseFloat(debtToIncomeRatio) > 35 && (
                <li className="flex items-start gap-2 text-score-poor">
                  <span>•</span>
                  <span>High debt-to-income ratio ({debtToIncomeRatio}%)</span>
                </li>
              )}
              {client.existingLoans > 3 && (
                <li className="flex items-start gap-2 text-score-poor">
                  <span>•</span>
                  <span>Multiple existing loans ({client.existingLoans})</span>
                </li>
              )}
              {client.paymentHistory !== 'always-on-time' && (
                <li className="flex items-start gap-2 text-score-fair">
                  <span>•</span>
                  <span>Payment history concerns</span>
                </li>
              )}
              {client.employmentYears < 2 && (
                <li className="flex items-start gap-2 text-score-fair">
                  <span>•</span>
                  <span>Limited employment tenure</span>
                </li>
              )}
              {grade === 'A' && (
                <li className="flex items-start gap-2 text-score-excellent">
                  <span>✓</span>
                  <span>Excellent credit profile - Low risk</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
