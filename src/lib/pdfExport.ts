import { jsPDF } from 'jspdf';
import { Client } from '@/types/client';
import { calculateCreditScore } from './creditScoring';

export function exportClientReport(client: Client): void {
  const { score, grade, riskLevel } = calculateCreditScore(client);
  const debtToIncomeRatio = ((client.monthlyDebt * 12) / client.annualIncome * 100).toFixed(1);
  
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
  doc.text('Credit Assessment Report', pageWidth - 20, 25, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Client Name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${client.firstName} ${client.lastName}`, 20, 55);
  
  // Report Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
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
  doc.text('Personal Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const personalInfo = [
    ['Email', client.email],
    ['Phone', client.phone],
    ['Date of Birth', new Date(client.dateOfBirth).toLocaleDateString()],
  ];
  
  personalInfo.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  // Section: Financial Information
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Information', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const financialInfo = [
    ['Annual Income', `$${client.annualIncome.toLocaleString()}`],
    ['Monthly Debt', `$${client.monthlyDebt.toLocaleString()}`],
    ['Debt-to-Income Ratio', `${debtToIncomeRatio}%`],
    ['Existing Loans', client.existingLoans.toString()],
  ];
  
  financialInfo.forEach(([label, value]) => {
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(value, 70, yPos);
    yPos += 7;
  });
  
  // Section: Employment & Credit
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Employment & Credit History', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const employmentInfo = [
    ['Employment Status', client.employmentStatus.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())],
    ['Years at Current Job', `${client.employmentYears} years`],
    ['Credit History', client.creditHistory.replace(/\b\w/g, c => c.toUpperCase())],
    ['Payment History', client.paymentHistory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())],
  ];
  
  employmentInfo.forEach(([label, value]) => {
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
  doc.text('Risk Assessment', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.setTextColor(100, 100, 100);
  doc.text('Risk Level:', 20, yPos);
  doc.setTextColor(r, g, b);
  doc.setFont('helvetica', 'bold');
  doc.text(riskLevel, 70, yPos);
  yPos += 15;
  
  // Risk factors
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const riskFactors: string[] = [];
  
  if (parseFloat(debtToIncomeRatio) > 35) {
    riskFactors.push(`• High debt-to-income ratio (${debtToIncomeRatio}%)`);
  }
  if (client.existingLoans > 3) {
    riskFactors.push(`• Multiple existing loans (${client.existingLoans})`);
  }
  if (client.paymentHistory !== 'always-on-time') {
    riskFactors.push('• Payment history concerns');
  }
  if (client.employmentYears < 2) {
    riskFactors.push('• Limited employment tenure');
  }
  if (grade === 'A') {
    riskFactors.push('✓ Excellent credit profile - Low risk');
  }
  
  if (riskFactors.length === 0) {
    riskFactors.push('No significant risk factors identified');
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
  doc.text('This report is generated by CreditScore AI for informational purposes only.', pageWidth / 2, 280, { align: 'center' });
  doc.text('It should not be considered as financial advice.', pageWidth / 2, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`credit-report-${client.firstName}-${client.lastName}-${new Date().toISOString().split('T')[0]}.pdf`);
}
