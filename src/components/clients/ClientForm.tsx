import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

const clientSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional().or(z.literal('')),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional().or(z.literal('')),
  age: z.number().min(18, 'L\'âge minimum est 18 ans').max(120).optional().nullable(),
  num_of_delayed_payment: z.number().min(0).optional().nullable(),
  changed_credit_limit: z.number().optional().nullable(),
  num_credit_inquiries: z.number().min(0).optional().nullable(),
  credit_mix: z.enum(['Standard', 'Good', 'Bad']).optional(),
  outstanding_debt: z.number().min(0).optional().nullable(),
  credit_utilization_ratio: z.number().min(0).max(100).optional().nullable(),
  credit_history_age: z.string().optional().or(z.literal('')),
  payment_of_min_amount: z.enum(['Yes', 'No', 'NM']).optional(),
  total_emi_per_month: z.number().min(0).optional().nullable(),
  amount_invested_monthly: z.number().min(0).optional().nullable(),
  payment_behaviour: z.string().optional().or(z.literal('')),
  monthly_balance: z.number().optional().nullable(),
  credit_history_age_months: z.number().min(0).optional().nullable(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Client;
}

export function ClientForm({ onSubmit, onCancel, initialData }: ClientFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData ? {
      nom: initialData.nom || '',
      prenom: initialData.prenom || '',
      age: initialData.age || null,
      num_of_delayed_payment: initialData.num_of_delayed_payment || null,
      changed_credit_limit: initialData.changed_credit_limit || null,
      num_credit_inquiries: initialData.num_credit_inquiries || null,
      credit_mix: initialData.credit_mix || 'Standard',
      outstanding_debt: initialData.outstanding_debt || null,
      credit_utilization_ratio: initialData.credit_utilization_ratio || null,
      credit_history_age: initialData.credit_history_age || '',
      payment_of_min_amount: initialData.payment_of_min_amount || 'Yes',
      total_emi_per_month: initialData.total_emi_per_month || null,
      amount_invested_monthly: initialData.amount_invested_monthly || null,
      payment_behaviour: initialData.payment_behaviour || '',
      monthly_balance: initialData.monthly_balance || null,
      credit_history_age_months: initialData.credit_history_age_months || null,
    } : {
      nom: '',
      prenom: '',
      age: null,
      num_of_delayed_payment: null,
      changed_credit_limit: null,
      num_credit_inquiries: null,
      credit_mix: 'Standard',
      outstanding_debt: null,
      credit_utilization_ratio: null,
      credit_history_age: '',
      payment_of_min_amount: 'Yes',
      total_emi_per_month: null,
      amount_invested_monthly: null,
      payment_behaviour: '',
      monthly_balance: null,
      credit_history_age_months: null,
    },
  });

  const onFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clean up the data - convert empty strings to undefined and handle nulls
    const cleanedData: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
      nom: data.nom || undefined,
      prenom: data.prenom || undefined,
      age: data.age ?? undefined,
      num_of_delayed_payment: data.num_of_delayed_payment ?? undefined,
      changed_credit_limit: data.changed_credit_limit ?? undefined,
      num_credit_inquiries: data.num_credit_inquiries ?? undefined,
      credit_mix: data.credit_mix,
      outstanding_debt: data.outstanding_debt ?? undefined,
      credit_utilization_ratio: data.credit_utilization_ratio ?? undefined,
      credit_history_age: data.credit_history_age || undefined,
      payment_of_min_amount: data.payment_of_min_amount,
      total_emi_per_month: data.total_emi_per_month ?? undefined,
      amount_invested_monthly: data.amount_invested_monthly ?? undefined,
      payment_behaviour: data.payment_behaviour || undefined,
      monthly_balance: data.monthly_balance ?? undefined,
      credit_history_age_months: data.credit_history_age_months ?? undefined,
    };
    
    onSubmit(cleanedData);
    toast({
      title: initialData ? 'Client mis à jour' : 'Client ajouté',
      description: `${data.prenom || ''} ${data.nom || ''} a été ${initialData ? 'mis à jour' : 'ajouté'} avec succès.`,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-display text-2xl font-bold">
          {initialData ? 'Modifier le Client' : 'Ajouter un Client'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" {...register('nom')} />
              {errors.nom && (
                <p className="text-sm text-destructive">{errors.nom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" {...register('prenom')} />
              {errors.prenom && (
                <p className="text-sm text-destructive">{errors.prenom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Credit Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de Crédit</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="num_of_delayed_payment">Paiements en Retard</Label>
              <Input
                id="num_of_delayed_payment"
                type="number"
                step="0.1"
                {...register('num_of_delayed_payment', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="changed_credit_limit">Modification Limite de Crédit (%)</Label>
              <Input
                id="changed_credit_limit"
                type="number"
                step="0.01"
                {...register('changed_credit_limit', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="num_credit_inquiries">Demandes de Crédit</Label>
              <Input
                id="num_credit_inquiries"
                type="number"
                step="0.1"
                {...register('num_credit_inquiries', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type de Crédit (Credit Mix)</Label>
              <Select
                value={watch('credit_mix') || 'Standard'}
                onValueChange={(value) => setValue('credit_mix', value as 'Standard' | 'Good' | 'Bad')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Bon</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Bad">Mauvais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outstanding_debt">Dettes Impayées ($)</Label>
              <Input
                id="outstanding_debt"
                type="number"
                step="0.01"
                {...register('outstanding_debt', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_utilization_ratio">Ratio d'Utilisation (%)</Label>
              <Input
                id="credit_utilization_ratio"
                type="number"
                step="0.01"
                {...register('credit_utilization_ratio', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_history_age">Ancienneté de l'Historique</Label>
              <Input
                id="credit_history_age"
                placeholder="ex: 5 Years and 3 Months"
                {...register('credit_history_age')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_history_age_months">Historique (mois)</Label>
              <Input
                id="credit_history_age_months"
                type="number"
                step="0.1"
                {...register('credit_history_age_months', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de Paiement</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Paiement Minimum</Label>
              <Select
                value={watch('payment_of_min_amount') || 'Yes'}
                onValueChange={(value) => setValue('payment_of_min_amount', value as 'Yes' | 'No' | 'NM')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Oui</SelectItem>
                  <SelectItem value="No">Non</SelectItem>
                  <SelectItem value="NM">Non Mentionné</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_emi_per_month">EMI Total/Mois ($)</Label>
              <Input
                id="total_emi_per_month"
                type="number"
                step="0.01"
                {...register('total_emi_per_month', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount_invested_monthly">Investissement Mensuel ($)</Label>
              <Input
                id="amount_invested_monthly"
                type="number"
                step="0.01"
                {...register('amount_invested_monthly', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_behaviour">Comportement de Paiement</Label>
              <Input
                id="payment_behaviour"
                placeholder="ex: Low_spent_Small_value_payments"
                {...register('payment_behaviour')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_balance">Solde Mensuel ($)</Label>
              <Input
                id="monthly_balance"
                type="number"
                step="0.01"
                {...register('monthly_balance', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Enregistrement...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {initialData ? 'Mettre à jour' : 'Ajouter'}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
