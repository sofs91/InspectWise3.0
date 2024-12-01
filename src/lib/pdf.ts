import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Inspection, Template } from '../types';
import { formatDate } from './utils';

export async function generatePDF(inspection: Inspection, template: Template) {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title
  doc.setFontSize(20);
  doc.text('Inspection Report', 20, yPos);
  yPos += 15;

  // Add metadata
  doc.setFontSize(12);
  doc.text(`Template: ${template.name}`, 20, yPos);
  yPos += 10;
  doc.text(`Inspector: ${inspection.inspectorName}`, 20, yPos);
  yPos += 10;
  doc.text(`Location: ${inspection.location}`, 20, yPos);
  yPos += 10;
  doc.text(`Date: ${formatDate(inspection.date)}`, 20, yPos);
  yPos += 10;
  doc.text(`Status: ${inspection.status}`, 20, yPos);
  yPos += 20;

  // Add responses
  doc.setFontSize(16);
  doc.text('Responses', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  for (const question of template.questions) {
    const response = inspection.responses[question.id];

    // Add question
    doc.setFont('helvetica', 'bold');
    const questionText = doc.splitTextToSize(question.question, 170);
    doc.text(questionText, 20, yPos);
    yPos += 10 * questionText.length;

    // Add response
    doc.setFont('helvetica', 'normal');
    switch (question.type) {
      case 'text':
        const textResponse = response || 'No response';
        const wrappedText = doc.splitTextToSize(textResponse, 170);
        doc.text(wrappedText, 20, yPos);
        yPos += 10 * wrappedText.length;
        break;

      case 'multipleChoice':
        doc.text(response || 'No selection', 20, yPos);
        yPos += 10;
        break;

      case 'checkbox':
        if (response && response.length > 0) {
          response.forEach((item: string) => {
            doc.text(`• ${item}`, 20, yPos);
            yPos += 10;
          });
        } else {
          doc.text('No selections', 20, yPos);
          yPos += 10;
        }
        break;

      case 'photo':
        if (response) {
          try {
            const img = await createImageBitmap(response);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imgData = canvas.toDataURL('image/jpeg');
              const imgProps = doc.getImageProperties(imgData);
              const pdfWidth = 170;
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              doc.addImage(imgData, 'JPEG', 20, yPos, pdfWidth, pdfHeight);
              yPos += pdfHeight + 10;
            }
          } catch (error) {
            doc.text('Error loading photo', 20, yPos);
            yPos += 10;
          }
        } else {
          doc.text('No photo uploaded', 20, yPos);
          yPos += 10;
        }
        break;

      case 'signature':
        if (response) {
          const imgProps = doc.getImageProperties(response);
          const pdfWidth = 100;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(response, 'PNG', 20, yPos, pdfWidth, pdfHeight);
          yPos += pdfHeight + 10;
        } else {
          doc.text('No signature provided', 20, yPos);
          yPos += 10;
        }
        break;
    }

    yPos += 10;

    // Add new page if needed
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  }

  // Save the PDF
  doc.save(`inspection-${inspection.id}.pdf`);
}