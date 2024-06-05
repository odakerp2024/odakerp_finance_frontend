import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class ReportExportService {

  async downloadAsExcel(
    reportList: any[],
    startDate: string,
    endDate: string,
    reportType: 'overall' | 'customerwise' | 'customerinvoicewise'
  ) {
    if (reportList.length === 0) {
      alert('No record found');
      return;
    }

 const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Report');

    // Set title based on report type
    let titleHeader: string;
    switch (reportType) {
      case 'overall':
        titleHeader = 'Receivable Balance Summary - Overall';
        break;
      case 'customerwise':
        titleHeader = 'Receivable Balance Summary - Customer Wise';
        break;
      case 'customerinvoicewise':
        titleHeader = 'Receivable Balance Summary - Invoice Wise';
        break;
      default:
        titleHeader = 'Receivable Balance Summary';
        break;
    }

    // Add title row
    const titleRow = worksheet.addRow(['', '', '', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '']);
    titleRow.getCell(6).font = { size: 15, bold: true };
    titleRow.getCell(6).alignment = { horizontal: 'center' };
    const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;
    worksheet.columns.forEach((column) => {
      if (column.number === 6) {
        column.width = titleLength + 2;
      }
    });
    worksheet.mergeCells(`F${titleRow.number}:G${titleRow.number}`);

    // Add subtitle row
    const subtitleRow = worksheet.addRow(['', '', '', '', '', titleHeader, '']);
    subtitleRow.getCell(6).font = { size: 14 };
    subtitleRow.getCell(6).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

    // Add date row
    const dateRow = worksheet.addRow(['', '', '', '', '', `FROM ${startDate} - TO ${endDate}`]);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';
    worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);

    // Add header row
    const header = Object.keys(reportList[0]);
    const headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' },
      };
      cell.alignment = {
        horizontal: 'center',
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Add data rows
    reportList.forEach((data) => {
      const row = worksheet.addRow(Object.values(data));

      // Format specific columns
      const columnsToColor = ['Payees', 'DueAmount', 'CustomerName', 'CreditAmount','BalanceICY', 'BalanceICY1', 'CustomerName', 'CreditAmount',];
      columnsToColor.forEach((columnName) => {
        const columnIndex = header.indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true };
        }
      });
    });

    // Auto-size columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = maxLength + 2;
    });

    // Add footer row
    const footerRow = worksheet.addRow(['End of Report']);
    footerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' },
      };
      cell.alignment = {
        horizontal: 'center',
      };
    });
    worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

    // Generate Excel file and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Report-ReceivableBalanceSummary-${reportType}.xlsx`);
  }
  
}