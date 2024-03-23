import { Injectable } from "@angular/core";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { CommonService } from '../../services/common.service';
@Injectable({
  providedIn: "root",
})
//* export the HTML as pdf, csv or excl format
export class ExportFileService {
  constructor(
    private commonService: CommonService
  ) {}

  //* Function to export HTML as PDF
  exportToPdfold(element: HTMLTableElement, filename: string) {
    const doc = new jsPDF();
    html2canvas(element).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imageData, "PNG", 0, 0, imgWidth, imgHeight);
      doc.save(`${filename}.pdf`);
    });
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
  

  //*  Function to export HTML as Excel (XLSX)
  exportToExcel(htmlTable: HTMLTableElement, filename: string): void {
    const workbook = XLSX.utils.table_to_book(htmlTable);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  // Function to export data as CSV
  exportToCSV(htmlTable: HTMLTableElement, filename: string): void {
    const csvContent = this.getCSVContent(htmlTable);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    link.click();
  }

  private getCSVContent(htmlTable: HTMLTableElement): string {
    let csvContent = "";
    const rows = htmlTable.querySelectorAll("tr");

    rows.forEach((row) => {
      const columns = row.querySelectorAll("th,td");
      const rowData = Array.from(columns)
        .map((column) => column.textContent.trim())
        .join(",");

      csvContent += rowData + "\r\n";
    });
    return csvContent;
  }
}
