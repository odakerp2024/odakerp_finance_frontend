import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ReportDashboardService } from 'src/app/services/financeModule/report-dashboard.service';
import { ContraVoucherService } from 'src/app/services/contra-voucher.service';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { GridSort } from 'src/app/model/common';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();


@Component({
  selector: 'app-report-contra-voucher',
  templateUrl: './report-contra-voucher.component.html',
  styleUrls: ['./report-contra-voucher.component.css']
})

export class ReportContraVoucherComponent implements OnInit  {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  customerList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  pagesort: any = new GridSort().sort;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  PeroidList = [
    { peroidId: 'today', peroidName: 'CURRENT DAY' },
    { peroidId: 'week', peroidName: 'CURRENT WEEK' },
    { peroidId: 'month', peroidName: 'CURRENT MONTH' },
    { peroidId: 'year', peroidName: 'CURRENT FINANCIAL YEAR' },
    { peroidId: 'custom', peroidName: 'CUSTOM' },
    { peroidId: 'previoustoday', peroidName: 'PREVIOUS DAY' },
    { peroidId: 'previousweek', peroidName: 'PREVIOUS WEEK' },
    { peroidId: 'previousmonth', peroidName: 'PREVIOUS MONTH' },
    { peroidId: 'previousyear', peroidName: 'PREVIOUS FINANCIAL YEAR' }



  ];
  selectedOption: string;
  bankList: any;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  fromAccount: any;
  toAccount = [];
  startDate = '';
  endDate = '';
  currentDate = new Date();

  constructor(
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private contraVoucherService: ContraVoucherService,
    private dataService: DataService,
    private reportService: ReportDashboardService,
    public excelService : ExcelService
  ) { }

  ngOnInit(): void {
    this.createReportForm();
    this.onOptionChange('month');
    this.getDivisionList();
    this.getBankList();
    this.getVoucherList();
    this.reportFilter.controls.Peroid.setValue('month');
  }

  clickTransactionNumber(id: number, Trans_Number: string) {
    // Check if transType or Trans_Number is empty and return immediately if either is
    if (!Trans_Number) {
      console.warn('Transaction type or Transaction number is empty. Staying in the same place.');
      return;
    }

    let url: string;

    url = this.router.serializeUrl(
      this.router.createUrlTree(['/views/contra-info/contra-info-view', { contraId: id }])
    )
    // Open the URL in a new tab if url is defined
    if (url) {
      window.open(url, '_blank');
    }
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

      case 'previoustoday':
        const previousDay = new Date(this.currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousDay, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousDay, "yyyy-MM-dd"));
        break;

      case 'previousweek':
        const previousWeekStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay() - 7);
        const previousWeekEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay() - 1);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousWeekStartDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousWeekEndDate, "yyyy-MM-dd"));
        break;

      case 'previousmonth':
        const previousMonthStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        const previousMonthEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousMonthStartDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousMonthEndDate, "yyyy-MM-dd"));
        break;

      case 'previousyear':
        const previousYear = this.currentDate.getFullYear() - 1;
        const previousYearStartDate = new Date(previousYear, 3, 1);
        const previousYearEndDate = new Date(previousYear + 1, 2, 31);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousYearStartDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousYearEndDate, "yyyy-MM-dd"));
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

 
  async createReportForm() {
    this.reportFilter = this.fb.group({
      DivisionId: [0],
      OfficeId: [0],
      FromAccount: [0],
      ToAccount: [0],
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      Amount: [''],
      Peroid: [''],
    });
    this.onOptionChange('month');
    await this.getContraReportList();
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

  getBankList() {
    let payload = {
      OfficeId: 0,
      DivisionId: 0,
    };

    this.commonDataService
      .getBankByOfficeId(payload)
      .subscribe((result: any) => {
        if (result.message == "Success") {
          this.bankList = result["data"].Table;
          this.fromAccount = this.bankList;
        }
      });
  }

  getToAccount(fromAccountId) {
    this.reportFilter.controls["ToAccount"].setValue("");
    const toAccount = this.bankList?.filter(
      (res) => res.BankID != +fromAccountId
    );
    this.toAccount = toAccount;
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

  getContraReportList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.GetContraVoucherReportList(this.reportFilter.value).subscribe(result => {
    this.reportList = [];
    this.reportForExcelList = [];
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


  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;

    this.pager = this.ps.getPager(this.reportList.length, page, 12);
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
      FromAccount: 0,
      ToAccount: 0,
      FormData:  this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
      ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      Amount: '',
    });
    this.officeList = [];
    this.reportFilter.controls.Peroid.setValue('month');
    this.getContraReportList();
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
 
     const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Contra Voucher', '']);
     subtitleRow.getCell(6).font = { size: 14 };
     subtitleRow.getCell(6).alignment = { horizontal: 'center' };
 
     // Merge cells for the subtitle
     worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);
 


    const dateRow = worksheet.addRow(
      ['', '', '', '', '', `FROM ${this.datePipe.transform(this.startDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))} - TO ${this.datePipe.transform(this.endDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`]);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';
    dateRow.getCell(6).numFmt = 'dd-MM-yyyy';

    // Merge cells for "FROM Date" and "TO Date"
    worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);

    // Define header row and style it with yellow background, bold, and centered text
    const header = Object.keys(this.reportForExcelList[0]).filter(key => key !== 'Symbol');
    const headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' }, // Yellow background
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFF7' } // Bold font
      };
      cell.alignment = {
        horizontal: 'center', // Center alignment
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    this.reportForExcelList.forEach((data) => {

      //To Remove Time from date field data
      const date = data.Date
      const formattedDate = date.split('T')[0];
      // data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      if(formattedDate != date){
        data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      }
      else{
        data.Date =  formattedDate
      }
      const defalutvalue = 0;
      
       const mergedICYAmount = `${data['Amount'] !== null ? parseFloat(data['Amount']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
       const Localamount = `${data['Local Amount'] !== null ? parseFloat(data['Local Amount']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;

      // Filter out properties you don't want to include in the Excel sheet
      const filteredData = Object.keys(data)
        .filter(key => key !== 'Symbol' )
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});

      // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
      filteredData['Amount'] = mergedICYAmount;
      filteredData['Local Amount'] = Localamount;

      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(filteredData));

       // Set text color for specific columns and align them
       const columnsToColorRight =  ['Contra Voucher #', 'Amount'];
       const columnsToAlignLeft  =  ['Contra Voucher #']; // Specify columns to align left
       const columnsToAlignRight =  ['Amount','Local Amount']; // Specify columns to align right
  
       columnsToColorRight.forEach(columnName => {
         const columnIndex = Object.keys(filteredData).indexOf(columnName);
         if (columnIndex !== -1) {
           const cell = row.getCell(columnIndex + 1);
           cell.font = { color: { argb: '8B0000' }, bold: true }; // Red color
         }
       });
  
       columnsToAlignLeft.forEach(columnName => {
         const columnIndex = Object.keys(filteredData).indexOf(columnName);
         if (columnIndex !== -1) {
           const cell = row.getCell(columnIndex + 1);
           cell.alignment = { horizontal: 'left' };
         }
       });
  
       columnsToAlignRight.forEach(columnName => {
         const columnIndex = Object.keys(filteredData).indexOf(columnName);
         if (columnIndex !== -1) {
           const cell = row.getCell(columnIndex + 1);
           cell.alignment = { horizontal: 'right' };
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
      column.width = maxLength + 2; // Add some padding
    });

    // Style the footer row with yellow background, bold, and centered text
    const footerRow = worksheet.addRow(['End of Report']); // Footer text
    footerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' }, // Yellow background
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
    saveAs(blob, 'Report-ContraVoucher.xlsx');
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
    const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Contra Voucher', '']);
    subtitleRow.getCell(6).font = { size: 14 };
    subtitleRow.getCell(6).alignment = { horizontal: 'center' };

    // Merge cells for the subtitle
    worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

    // Add "FROM Date" and "TO Date" to the worksheet
    const dateRow = worksheet.addRow(
      ['', '', '', '', '', `FROM ${this.datePipe.transform(this.startDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))} - TO ${this.datePipe.transform(this.endDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`]
    );
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(6).numFmt = this.commonDataService.convertToLowerCaseDay(this.entityDateFormat);
    dateRow.getCell(6).numFmt = this.commonDataService.convertToLowerCaseDay(this.entityDateFormat);

    // Merge cells for "FROM Date" and "TO Date"
    worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);  


    // Define header row and style it with yellow background, bold, and centered text
    const header = Object.keys(this.reportForExcelList[0]).filter(key => key !== 'Symbol');
    const headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' }, // Yellow background
      };
      cell.font = {
        bold: true, // Bold font
        color: { argb: 'FFFFF7' }
      };
      cell.alignment = {
        horizontal: 'center', // Center alignment
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Add data rows
    this.reportForExcelList.forEach((data) => {
       //To Remove Time from date field data
       const date = data.Date
       const formattedDate = date.split('T')[0];
       //data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
       if(formattedDate != date){
        data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      }
      else{
        data.Date =  formattedDate
      }
      // data.Date = formattedDate;
       const defalutvalue = 0;
      
       const mergedICYAmount = data['Amount'] !== null ? parseFloat(data['Amount']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction);
       const Localamount = `${data['Local Amount'] !== null ? parseFloat(data['Local Amount']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      
       // Filter out properties you don't want to include in the Excel sheet
       const filteredData = Object.keys(data)
         .filter(key => key !== 'Symbol')
         .reduce((obj, key) => {
           obj[key] = data[key];
           return obj;
         }, {});
 
       // Update the 'Amount' property in the filtered data object with the merged amount
       filteredData['Amount'] = mergedICYAmount;
       filteredData['Local Amount'] = Localamount;

       // Add the filtered data to the worksheet
       const row = worksheet.addRow(Object.values(filteredData));

     // Set text color for specific columns and align them
     const columnsToColorRight =  ['Contra Voucher #', 'Amount'];
     const columnsToAlignLeft  =  ['Contra Voucher #']; // Specify columns to align left
     const columnsToAlignRight =  ['Amount', 'Local Amount']; // Specify columns to align right

     columnsToColorRight.forEach(columnName => {
       const columnIndex = Object.keys(filteredData).indexOf(columnName);
       if (columnIndex !== -1) {
         const cell = row.getCell(columnIndex + 1);
         cell.font = { color: { argb: '8B0000' }, bold: true }; // Red color
       }
     });

     columnsToAlignLeft.forEach(columnName => {
       const columnIndex = Object.keys(filteredData).indexOf(columnName);
       if (columnIndex !== -1) {
         const cell = row.getCell(columnIndex + 1);
         cell.alignment = { horizontal: 'left' };
       }
     });

     columnsToAlignRight.forEach(columnName => {
       const columnIndex = Object.keys(filteredData).indexOf(columnName);
       if (columnIndex !== -1) {
         const cell = row.getCell(columnIndex + 1);
         cell.alignment = { horizontal: 'right' };
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
      column.width = maxLength + 2; // Add some padding
    });

    // Style the footer row with yellow background, bold, and centered text
    const footerRow = worksheet.addRow(['End of Report']); // Footer text
    footerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '8A9A5B' }, // Yellow background
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
    saveAs(blob, 'Report-ContraVoucher.xlsx');
  }

}

