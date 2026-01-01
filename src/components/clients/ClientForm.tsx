import { useState, useEffect } from 'react';
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

/* =========================
   ZOD SCHEMA (FLASK MODEL)
========================= */
const clientSchema = z.object({
  nom: z.string().min(2).optional(),
  prenom: z.string().min(2).optional(),
  age: z.number().min(0).optional(),

  num_of_delayed_payment: z.number().min(0).optional(),
  changed_credit_limit: z.number().optional(),
  num_credit_inquiries: z.number().min(0).optional(),

  credit_mix: z.string().optional(),

  outstanding_debt: z.number().optional(),
  credit_utilization_ratio: z.number().optional(),

  credit_history_age: z.string().optional(),
  credit_history_age_months: z.number().min(0).optional(),

  payment_of_min_amount: z.enum(['Yes', 'No', 'NM']).optional(),
  total_emi_per_month: z.number().optional(),

  amount_invested_monthly: z.number().optional(),
  payment_behaviour: z.string().optional(),

  monthly_balance: z.number().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

type ClientPayload = Omit<
  Client,
  'id' | 'credit_score' | 'created_at' | 'updated_at'
>;

interface ClientFormProps {
  onSubmit: (data: ClientPayload) => void;
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
    defaultValues: initialData || {
      nom: '',
      prenom: '',
      age: undefined,

      num_of_delayed_payment: 0,
      changed_credit_limit: 0,
      num_credit_inquiries: 0,

      credit_mix: 'Standard',

      outstanding_debt: 0,
      credit_utilization_ratio: 0,

      credit_history_age: '',
      credit_history_age_months: 0,

      payment_of_min_amount: 'Yes',
      total_emi_per_month: 0,

      amount_invested_monthly: 0,
      payment_behaviour: '',

      monthly_balance: 0,
    },
  });

  /* =========================
     AUTO-CALCUL CREDIT HISTORY
  ========================= */
  useEffect(() => {
    const history = watch('credit_history_age');
    if (history?.includes('year')) {
      const years = parseInt(history);
      if (!isNaN(years)) {
        setValue('credit_history_age_months', years * 12);
      }
    }
  }, [watch('credit_history_age'), setValue]);

  const onFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    onSubmit(data as ClientPayload);

    toast({
      title: initialData ? 'Client mis à jour' : 'Client ajouté',
      description: `${data.nom ?? ''} ${data.prenom ?? ''} enregistré avec succès`,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">
          {initialData ? 'Modifier Client' : 'Ajouter Client'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

        {/* ================== PERSONAL INFO ================== */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Nom</Label>
              <Input {...register('nom')} />
              {errors.nom && <p className="text-sm text-destructive">{errors.nom.message}</p>}
            </div>

            <div>
              <Label>Prénom</Label>
              <Input {...register('prenom')} />
              {errors.prenom && <p className="text-sm text-destructive">{errors.prenom.message}</p>}
            </div>

            <div>
              <Label>Âge</Label>
              <Input type="number" {...register('age', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        {/* ================== CREDIT INFO ================== */}
        <Card>
          <CardHeader>
            <CardTitle>Historique Crédit</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Delayed Payments</Label>
              <Input type="number" {...register('num_of_delayed_payment', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Credit Inquiries</Label>
              <Input type="number" {...register('num_credit_inquiries', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Credit Mix</Label>
              <Input {...register('credit_mix')} />
            </div>
          </CardContent>
        </Card>

        {/* ================== FINANCES ================== */}
        <Card>
          <CardHeader>
            <CardTitle>Finances</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Outstanding Debt</Label>
              <Input type="number" {...register('outstanding_debt', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Credit Utilization Ratio</Label>
              <Input
                type="number"
                step="0.01"
                {...register('credit_utilization_ratio', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label>Monthly Balance</Label>
              <Input type="number" {...register('monthly_balance', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        {/* ================== PAYMENT ================== */}
        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Minimum Payment</Label>
              <Select
                value={watch('payment_of_min_amount')}
                onValueChange={(v) => setValue('payment_of_min_amount', v as 'Yes' | 'No')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Total EMI / Month</Label>
              <Input type="number" {...register('total_emi_per_month', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        {/* ================== ACTIONS ================== */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {initialData ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </div>
  );
}
