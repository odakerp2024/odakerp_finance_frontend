import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ReportDashboardService } from 'src/app/services/financeModule/report-dashboard.service';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { GridSort } from 'src/app/model/common';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();


@Component({
  selector: 'app-report-voucher-reversal',
  templateUrl: './report-voucher-reversal.component.html',
  styleUrls: ['./report-voucher-reversal.component.css']
})

export class ReportVoucherReversalComponent implements OnInit  {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  customerList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  pagesort: any = new GridSort().sort;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  PeroidList = [
    { peroidId: 'today', peroidName: 'CURRENT DAY' },
    { peroidId: 'week', peroidName: 'CURRENT WEEK' },
    { peroidId: 'month', peroidName: 'CURRENT MONTH' },
    { peroidId: 'year', peroidName: 'CURRENT FINANCIAL YEAR' },
    { peroidId: 'custom', peroidName: 'CUSTOM' }
  ];
  selectedOption: string;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  startDate = '';
  endDate = '';
  dropDownListVoucherList: any = [];
  currentDate = new Date();
  constructor(
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private dataService: DataService,
    private reportService: ReportDashboardService,
    public excelService : ExcelService
  ) { }

  ngOnInit(): void {
    // this.getCustomerList();
    this.createReportForm();
    this.onOptionChange('month');
    this.getDivisionList();
    this.getVoucherList();
    this.getDropDownValue();
    this.reportFilter.controls.Peroid.setValue('month');
  }
  onOptionChange(selectedOption: string) {
    this.selectedOption = '';
    switch (selectedOption) {
      case 'today':
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(this.currentDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(this.currentDate, "yyyy-MM-dd"));
        break;
      case 'week':
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay()), "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + (6 - this.currentDate.getDay())), "yyyy-MM-dd"));
        break;
      case 'month':
        const startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd")
        const endDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd")
        this.reportFilter.controls.FromDate.setValue(startDate);
        this.reportFilter.controls.ToDate.setValue(endDate);


        break;
        case 'year':
          const currentYear = this.currentDate.getFullYear();
          const startYear = this.currentDate.getMonth() >= 3 ? currentYear : currentYear - 1;
          const endYear = startYear + 1;
          this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(new Date(startYear, 3, 1), "yyyy-MM-dd"));
          this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(new Date(endYear, 2, 31), "yyyy-MM-dd"));
          
          break;
      case 'custom':
        this.selectedOption = 'custom';
        this.startDate = this.reportFilter.controls.FromDate.value;
        this.endDate = this.reportFilter.controls.ToDate.value;
        break;
      default:
        this.selectedOption = '';
        break;
    }
  }
  createReportForm() {
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      OfficeId: [0],
      VoucherType: [0], 
      Peroid: ['']
    });
    this.getVoucherReversalReportList();
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => {
      console.log('err--', error);
     });
  }

  getOfficeList(id: number) {
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    })
  }

  getVoucherList() {
    return new Promise((resolve, rejects) => {
     

      let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
      this.dataService.post(service, { CustomerId: 0 }).subscribe((result: any) => {
        this.customerList = result.data.Table2;
        resolve(true)
      }, error => {
        console.error(error);
        resolve(true)
      });
    })
  }

  getDivisionBasedOffice(officeId: number, divisoinId: any) {
    if (officeId && divisoinId) {
      let service = `${this.globals.APIURL}/Common/GetBankByOfficeId`;
      let payload = {
        "OfficeId": officeId,
        "DivisionId": divisoinId
      }
      this.dataService.post(service, payload).subscribe((result: any) => {
        if (result.message = "Success") {
   
        }
      }, error => {
        console.error(error);
      });
    }
  }

  getVoucherReversalReportList() {
    this.reportService.getVoucherReversalReportList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];

      this.startDate = this.reportFilter.controls.FromDate.value;
      this.endDate = this.reportFilter.controls.ToDate.value;
      
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1)
      } else {
        this.pager ={};
        this.pagedItems =[];
      }
    })
  }

  getDropDownValue() {
    var service = `${this.globals.APIURL}/VoucherReversals/GetVoucherReversalsDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.dropDownListVoucherList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.dropDownListVoucherList = result.data.Table1;
      }
    }, error => { });
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;

    this.pager = this.ps.getPager(this.reportList.length, page);
    this.pagedItems = this.reportList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }
  
  clear() {

    this.startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd");
    this.endDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd");
   
    this.reportFilter.reset({
      DivisionId: 0,
      OfficeId: 0,
      VoucherType: 0,
      FromDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 2),
      ToDate: this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),

    });
    this.reportFilter.controls.Peroid.setValue('month');
    this.getVoucherReversalReportList();
  }


  async downloadAsExcel() {
    if (this.reportForExcelList.length === 0) {
      Swal.fire('No record found');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add title and subtitle rows
    const titleRow = worksheet.addRow(['', '', '', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '']);
    titleRow.getCell(6).font = { size: 15, bold: true };
    titleRow.getCell(6).alignment = { horizontal: 'center' };

    // Calculate the length of the title string
    const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;

    // Iterate through each column to adjust the width based on the title length
    worksheet.columns.forEach((column) => {
      if (column.number === 6) {
        column.width = titleLength + 2;
      }
    });

    // Merge cells for the title
    worksheet.mergeCells(`F${titleRow.number}:G${titleRow.number}`);

    // Add subtitle row
    const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Voucher Reversal', '']);
    subtitleRow.getCell(6).font = { size: 14 };
    subtitleRow.getCell(6).alignment = { horizontal: 'center' };

    // Merge cells for the subtitle
    worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

    // Add "FROM Date" and "TO Date" to the worksheet
    const dateRow = worksheet.addRow(['', '', '', '', '', `FROM ${this.startDate} - TO ${this.endDate}`]);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';

    // Merge cells for "FROM Date" and "TO Date"
    worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);


    const header = Object.keys(this.reportForExcelList[0]);
    const headerRow = worksheet.addRow(header);


    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' }
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

    // Add data rows with concatenated symbol and amount
    this.reportForExcelList.forEach((data) => {

      //To Remove Time from date field data
      const date = data.Date
      const formattedDate = date ? date.split('T')[0] : null;

      data.Date = formattedDate;



      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(data));

      // Set text color for customer, receipt, and amount columns
      const columnsToColor = ['Voucher Reversal'];
      columnsToColor.forEach(columnName => {
        const columnIndex = Object.keys(data).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true, }; // Red color
        }
      });

    });

    // Adjust column widths to fit content
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

    // Style the footer row with yellow background, bold, and centered text
    const footerRow = worksheet.addRow(['End of Report']);
    footerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' }
      };
      cell.alignment = {
        horizontal: 'center',
      };
    });

    // Merge footer cells if needed
    worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

    // Write to Excel and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Report-VoucherReversal.xlsx');
  }

 
  async downloadAsCSV() {
    if (this.reportForExcelList.length === 0) {
      Swal.fire('No record found');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add title and subtitle rows
    const titleRow = worksheet.addRow(['', '', '', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '']);
    titleRow.getCell(6).font = { size: 15, bold: true };
    titleRow.getCell(6).alignment = { horizontal: 'center' };

    // Calculate the length of the title string
    const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;

    // Iterate through each column to adjust the width based on the title length
    worksheet.columns.forEach((column) => {
      if (column.number === 6) {
        column.width = titleLength + 2;
      }
    });

    // Merge cells for the title
    worksheet.mergeCells(`F${titleRow.number}:G${titleRow.number}`);

    // Add subtitle row
    const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Voucher Reversal', '']);
    subtitleRow.getCell(6).font = { size: 14 };
    subtitleRow.getCell(6).alignment = { horizontal: 'center' };

    // Merge cells for the subtitle
    worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

    // Add "FROM Date" and "TO Date" to the worksheet
    const dateRow = worksheet.addRow(['', '', '', '', '', `FROM ${this.startDate} - TO ${this.endDate}`]);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';

    // Merge cells for "FROM Date" and "TO Date"
    worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);


    const header = Object.keys(this.reportForExcelList[0]);
    const headerRow = worksheet.addRow(header);


    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' }
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

    // Add data rows with concatenated symbol and amount
    this.reportForExcelList.forEach((data) => {

      //To Remove Time from date field data
      const date = data.Date
      const formattedDate = date ? date.split('T')[0] : null;

      data.Date = formattedDate;



      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(data));

      // Set text color for customer, receipt, and amount columns
      const columnsToColor = ['Voucher Reversal'];
      columnsToColor.forEach(columnName => {
        const columnIndex = Object.keys(data).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true, }; // Red color
        }
      });

    });

    // Adjust column widths to fit content
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

    // Style the footer row with yellow background, bold, and centered text
    const footerRow = worksheet.addRow(['End of Report']);
    footerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' }
      };
      cell.alignment = {
        horizontal: 'center',
      };
    });

    // Merge footer cells if needed
    worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

    // Write to Excel and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Report-VoucherReversal.xlsx');
  }



}