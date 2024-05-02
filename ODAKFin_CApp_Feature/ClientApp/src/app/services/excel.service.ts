import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import html2canvas from "html2canvas";
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  constructor( private commonService: CommonService) { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

      // Add custom formatting to the header row (row 1)
      const headerRow = 1;
      const range = XLSX.utils.decode_range(myworksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: headerRow, c: C });
        if (!myworksheet[headerCell]) {
          continue;
        }
        myworksheet[headerCell].s = {
          font: { bold: true }, // Make text bold
          fill: { fgColor: { rgb: 'FFFF00' } } // Set background color (e.g., yellow)
        };
      }

      // const formattedWorksheet: XLSX.WorkSheet = {
      //   ...myworksheet, // Copy original worksheet data
      //   A1: { t: 's', v: 'Header Cell A1', s: { font: { bold: true }, fill: { fgColor: { rgb: 'FFFF00' } } } }, // Example formatting for cell A1
      //   B1: { t: 's', v: 'Header Cell B1', s: { font: { bold: true }, fill: { fgColor: { rgb: 'FFFF00' } } } }, // Example formatting for cell B1
      //   // Add more cells as needed with desired formatting
      // };

    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported'+ EXCEL_EXTENSION);
  }
  



  exportToCSV(data: any, filename: string) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
  
    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    a.href = url;
    a.setAttribute("download", `${filename}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}



exportToPdf(element: HTMLTableElement, filename: string) {
  this.commonService.spinnerStart()
  const doc = new jsPDF("p", "pt", "letter"); // Set the initial canvas dimensions and orientation
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tableHeight = element.clientHeight; 
  const pages = Math.ceil(tableHeight / pageHeight);

  const capturePage = (pageNumber, yOffset) => {
    if (pageNumber >= pages) {
      doc.save(`${filename}.pdf`);
      this.commonService.SpinnerStop();
      return;
    }

    html2canvas(element, {
      scrollY: -pageHeight * pageNumber,
      useCORS: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (pageNumber > 0) {
        doc.addPage(); // Add a new page for subsequent captures
      }

      // Adjust the image height to fit the page height
      const remainingPageHeight = pageHeight - yOffset;
      const pageImgHeight = Math.min(imgHeight, remainingPageHeight);

      // Add the image to the PDF
      doc.addImage(imgData, "PNG", 0, yOffset, imgWidth, pageImgHeight);

      // Adjust the vertical position for the next page
      yOffset -= remainingPageHeight;
      yOffset += pageImgHeight;

      // Introduce a delay before capturing the next page
      setTimeout(() => {
        capturePage(pageNumber + 1, yOffset);
      }, 100); // Adjust the delay as needed
    });
  };

  capturePage(0, 0);
}

}
