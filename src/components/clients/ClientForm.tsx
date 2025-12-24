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
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  annualIncome: z.number().min(0, 'Annual income must be positive'),
  monthlyDebt: z.number().min(0, 'Monthly debt must be positive'),
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  employmentYears: z.number().min(0, 'Years must be positive'),
  creditHistory: z.enum(['excellent', 'good', 'fair', 'poor', 'none']),
  existingLoans: z.number().min(0, 'Number of loans must be positive'),
  paymentHistory: z.enum(['always-on-time', 'occasional-late', 'frequent-late', 'defaults']),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      annualIncome: 0,
      monthlyDebt: 0,
      employmentStatus: 'employed',
      employmentYears: 0,
      creditHistory: 'good',
      existingLoans: 0,
      paymentHistory: 'always-on-time',
    },
  });

  const onFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(data as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>);
    toast({
      title: initialData ? 'Client updated' : 'Client added',
      description: `${data.firstName} ${data.lastName} has been ${initialData ? 'updated' : 'added'} successfully.`,
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
          {initialData ? 'Edit Client' : 'Add New Client'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income ($)</Label>
              <Input
                id="annualIncome"
                type="number"
                {...register('annualIncome', { valueAsNumber: true })}
              />
              {errors.annualIncome && (
                <p className="text-sm text-destructive">{errors.annualIncome.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyDebt">Monthly Debt ($)</Label>
              <Input
                id="monthlyDebt"
                type="number"
                {...register('monthlyDebt', { valueAsNumber: true })}
              />
              {errors.monthlyDebt && (
                <p className="text-sm text-destructive">{errors.monthlyDebt.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingLoans">Number of Existing Loans</Label>
              <Input
                id="existingLoans"
                type="number"
                {...register('existingLoans', { valueAsNumber: true })}
              />
              {errors.existingLoans && (
                <p className="text-sm text-destructive">{errors.existingLoans.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment & Credit History</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Employment Status</Label>
              <Select
                value={watch('employmentStatus')}
                onValueChange={(value) => setValue('employmentStatus', value as ClientFormData['employmentStatus'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentYears">Years at Current Employment</Label>
              <Input
                id="employmentYears"
                type="number"
                {...register('employmentYears', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Credit History</Label>
              <Select
                value={watch('creditHistory')}
                onValueChange={(value) => setValue('creditHistory', value as ClientFormData['creditHistory'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="none">No History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment History</Label>
              <Select
                value={watch('paymentHistory')}
                onValueChange={(value) => setValue('paymentHistory', value as ClientFormData['paymentHistory'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always-on-time">Always On Time</SelectItem>
                  <SelectItem value="occasional-late">Occasionally Late</SelectItem>
                  <SelectItem value="frequent-late">Frequently Late</SelectItem>
                  <SelectItem value="defaults">Has Defaults</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {initialData ? 'Update Client' : 'Add Client'}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
