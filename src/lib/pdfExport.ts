import { jsPDF } from 'jspdf';
import { Client } from '@/types/client';
import { calculateCreditScore } from './creditScoring';

export function exportClientReport(client: Client): void {
  const { score, grade, riskLevel } = calculateCreditScore(client);
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CreditScore AI', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Rapport d\'Évaluation de Crédit', pageWidth - 20, 25, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Client Name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${client.prenom || ''} ${client.nom || 'Client'}`, 20, 55);
  
  // Report Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 20, 62);
  
  // Credit Score Box
  const gradeColors: Record<string, [number, number, number]> = {
    'A': [34, 197, 94],
    'B': [132, 204, 22],
    'C': [250, 204, 21],
    'D': [249, 115, 22],
    'E': [239, 68, 68],
  };
  
  const [r, g, b] = gradeColors[grade] || [100, 100, 100];
  doc.setFillColor(r, g, b);
  doc.roundedRect(pageWidth - 60, 45, 40, 40, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(grade, pageWidth - 40, 70, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Score: ${score}`, pageWidth - 40, 80, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 95, pageWidth - 20, 95);
  
  // Section: Personal Information
  let yPos = 110;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations Personnelles', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const personalInfo = [
    ['Nom', client.nom || '-'],
    ['Prénom', client.prenom || '-'],
    ['Âge', client.age ? `${client.age} ans` : '-'],
    ['Historique', client.credit_history_age || '-'],
  ];
  
  personalInfo.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  // Section: Credit Information
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Informations de Crédit', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const creditInfo = [
    ['Dettes Impayées', `$${(client.outstanding_debt || 0).toLocaleString()}`],
    ['Ratio d\'Utilisation', `${(client.credit_utilization_ratio || 0).toFixed(1)}%`],
    ['Credit Mix', client.credit_mix || '-'],
    ['Paiements en Retard', (client.num_of_delayed_payment ?? '-').toString()],
    ['Demandes de Crédit', (client.num_credit_inquiries ?? '-').toString()],
  ];
  
  creditInfo.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  // Section: Payment Information
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Informations de Paiement', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const paymentInfo = [
    ['Paiement Minimum', client.payment_of_min_amount === 'Yes' ? 'Oui' : client.payment_of_min_amount === 'No' ? 'Non' : 'N/A'],
    ['EMI Mensuel', `$${(client.total_emi_per_month || 0).toLocaleString()}`],
    ['Solde Mensuel', `$${(client.monthly_balance || 0).toLocaleString()}`],
    ['Investissement Mensuel', `$${(client.amount_invested_monthly || 0).toLocaleString()}`],
  ];
  
  paymentInfo.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 80, yPos);
    yPos += 7;
  });
  
  // Section: Risk Assessment
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Évaluation des Risques', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.setTextColor(100, 100, 100);
  doc.text('Niveau de Risque:', 20, yPos);
  doc.setTextColor(r, g, b);
  doc.setFont('helvetica', 'bold');
  doc.text(riskLevel, 80, yPos);
  yPos += 15;
  
  // Risk factors
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const riskFactors: string[] = [];
  
  if ((client.credit_utilization_ratio || 0) > 30) {
    riskFactors.push(`• Ratio d'utilisation élevé (${(client.credit_utilization_ratio || 0).toFixed(1)}%)`);
  }
  if ((client.num_of_delayed_payment || 0) > 0) {
    riskFactors.push(`• Paiements en retard (${client.num_of_delayed_payment})`);
  }
  if (client.payment_of_min_amount === 'No') {
    riskFactors.push('• Ne paie pas le minimum requis');
  }
  if (client.credit_mix === 'Bad') {
    riskFactors.push('• Mauvaise diversification de crédit');
  }
  if (grade === 'A') {
    riskFactors.push('✓ Excellent profil de crédit - Risque faible');
  }
  
  if (riskFactors.length === 0) {
    riskFactors.push('Aucun facteur de risque significatif identifié');
  }
  
  riskFactors.forEach(factor => {
    doc.text(factor, 25, yPos);
    yPos += 7;
  });
  
  // Footer
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 270, pageWidth, 30, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Ce rapport est généré par CreditScore AI à titre informatif uniquement.', pageWidth / 2, 280, { align: 'center' });
  doc.text('Il ne constitue pas un conseil financier.', pageWidth / 2, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`rapport-credit-${client.prenom || 'client'}-${client.nom || ''}-${new Date().toISOString().split('T')[0]}.pdf`);
}
