
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-report-ar-levelthree',
  templateUrl: './report-ar-levelthree.component.html',
  styleUrls: ['./report-ar-levelthree.component.css']
})
export class ReportArLevelthreeComponent implements OnInit {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  customerList: any[];
  salesPerson = [];
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
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  currentDate = new Date();
  selectedOption: string;
  pagesort: any = new GridSort().sort;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  startDate = '';
  endDate = '';
  type = 'overall';
  subtype       : number;
  subtypecustomerId : number;
  totalcustomer : number = 0;
  totalinvoice  : number = 0;
  totalbalance  : number = 0;
  totalcreditamount  : number = 0;
  totalbalanceinvoice : number = 0;
  totalnetbalance : number = 0;
  totalbalanceamountcc : number = 0;

  constructor(
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private dataService: DataService,
    private reportService: ReportDashboardService,
    public excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.createReportForm();
    this.onOptionChange('month');
    this.getDivisionList();
    this.getCustomerList(0);
    this.getSalesPerson();
    this.reportFilter.controls.Peroid.setValue('month');
  }

  async goBack() {
    if (this.type === 'customerinvoicewise') {
      this.type = 'customerwise';
      await this.createReportForm();
      await this.showCustomerWise(0); 
    } else if (this.type === 'customerwise') {
      this.type = 'overall';
      await this.createReportForm();    
      await this.getOverallList();
    }
  }

    async showCustomerWise(subTypeId:number) {
    this.subtype = subTypeId;
    this.pagedItems = [];
    this.type = 'customerwise';
    await this.createReportForm();
    await this.getCustomerWiseList();
  }

    async showCustomerInvoiceWise(subtypecustomerId:number) {
    this.subtypecustomerId = subtypecustomerId;
    this.pagedItems = []; 
    this.type = 'customerinvoicewise';
    await this.createReportForm();
    //await this.getInvoiceWiseList();
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
    if (this.type == 'overall') {
      this.reportFilter = this.fb.group({
        DivisionId: [0],
        OfficeId: [0],
        Type:[0],
        SubTypeId: [0],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        CustomerId : [0],
        SalesPersonId:[0],
        Peroid: [''],
      });
    } else if( this.type == 'customerwise'){
      this.reportFilter = this.fb.group({
        DivisionId: [0],
        OfficeId: [0],
        CustomerId: [0], 
        SalesPersonId:[0],
        Type:[1],
        SubTypeId: [this.subtype],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        Peroid: [''],
      });
    }
      else {
        this.reportFilter = this.fb.group({
          DivisionId: [0],
          OfficeId: [0],
          CustomerId: [0], 
          SalesPersonId:[0],
          Type:[2],
          SubTypeId: [this.subtypecustomerId],
          FromDate: [this.startDate],
          ToDate: [this.endDate],
          Peroid: [''],
        });
    }
    this.reportFilter.controls.Peroid.setValue('month');
    this.onOptionChange('month');
    if(this.type == 'overall'){
      await this.getOverallList();
    }
    else if(this.type == 'customerwise'){
     await this.getCustomerWiseList();
    }
    else{
      //await this.getInvoiceWiseList();
    }
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
    this.reportFilter.controls.Office.setValue(0);
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }

      if (this.officeList.length == 1) {
        const ID =
          this.reportFilter.controls.Office.setValue(this.officeList[0].ID);
      }
    })
  }

  getCustomerList(customerId: any) {
    return new Promise((resolve, rejects) => {
      let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
      this.dataService.post(service, { CustomerId: customerId }).subscribe((result: any) => {
        this.customerList = result.data.Table2;
        resolve(true)
      }, error => {
        console.error(error);
        resolve(true)
      });
    })
  }

  getSalesPerson() {
    const payload = {}
    this.reportService.getSalesPersonDropdowns(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        const resultData = result.data;
        this.salesPerson = resultData.Table1.length ? resultData.Table1 : []
      }
    })
  }

  getOverallList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getSalesSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.calculateTotalDays(this.reportList);
      } else {
        this.pager = {};
        this.pagedItems = [];
        this.totalcustomer  = 0;
        this.totalinvoice   = 0;
        this.totalbalance   = 0;
      }
    })
  }

  getCustomerWiseList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getSalesSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.calculateTotalDays(this.reportList);
      } else {
        this.pager = {};
        this.pagedItems = [];
       this. totalcreditamount  = 0;
       this. totalbalanceinvoice  = 0;
       this. totalnetbalance  = 0;
       this. totalbalanceamountcc  = 0;
      }
    })
  }

  calculateTotalDays(reportList: any[]): void {
    if(this.type == "overall"){
      reportList.forEach(item => {
        this.totalcustomer += item.NoofCustomer;
        this.totalinvoice += item.NoofInvoices;
        this.totalbalance += item.BalanceCompanyCurrency;
      });
    
    }
   else if(this.type =="customerwise"){
       reportList.forEach(item => {
       this. totalcreditamount += item.CreditAmount;
       this. totalbalanceinvoice += item.BalanceInvoiceCurrency;
       this. totalnetbalance += item.NetBalanceInvoiceCurrency;
       this. totalbalanceamountcc += item.BalanceAmountCompanyCurrency;
  
       }); 
     }
  //   else{
  //     reportList.forEach(item => {
  //     agingTotal += item.Aging;  
  //     invoiceCCYTotal += item.InvoiceAmountCCY;  
  //     dueAmountTotal += item.DueAmount;
  //     dueAmountCCYTotal += item.DueAmountCCY;
  //   }); 
  //   this.AgingTotal = agingTotal;
  //   this.InvoiceCCYTotal = invoiceCCYTotal;
  //   this.DueAmountTotal = dueAmountTotal;
  //   this.DueAmountCCYTotal = dueAmountCCYTotal;
  // }

  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;

    this.pager = this.ps.getPager(this.reportList.length, page);
    this.pagedItems = this.reportList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

     
  async search(){
 
    if(this.type  == 'overall'){
      await this.getOverallList();
    }
    else if(this.type  == 'customerwise'){
      await this.getCustomerWiseList();
    }else{
     // await this.getInvoiceWiseList();
    }
  }

    clear() {
      this.startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd");
      this.endDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd");
      if(this.type  == 'overall'){
        this.reportFilter.reset({
          DivisionId: 0,
          OfficeId: 0,
          CustomerId:0,
          Type: 0,
          SubTypeId: 0,
          FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
          ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
        });
      }else if(this.type == 'customerwise'){
        this.reportFilter.reset({
          DivisionId: 0,
          OfficeId: 0,
          CustomerId: 0,
          Type: 1,
          SubTypeId: this.subtype,
          FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
          ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
        });
      }else{
        this.reportFilter.reset({
          DivisionId: 0,
          OfficeId: 0,
          CustomerId: 0,
          Type: 2,
          SubTypeId: this.subtypecustomerId,
          FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
          ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
        });
      }
      this.officeList = [];
      this.reportFilter.controls.Peroid.setValue('month');
      if(this.type  == 'overall'){
        this.getOverallList();
      }
      else if(this.type == 'customerwise'){
        this.getCustomerWiseList();
      }else{
       // this.getInvoiceWiseList();
      }
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
    const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Receivable Sales Summary', '']);
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


    // Define header row and style it with yellow background, bold, and centered text
    const header = Object.keys(this.reportForExcelList[0]).filter(key => key !== 'Symbol');
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
      const formattedDate = date.split('T')[0];
      data.Date = formattedDate;

      const defalutvalue = 0;
      // Merge the symbol and amount into a single string with fixed decimal places
      const mergedICYAmount = `${data.Symbol} ${data['Amount (ICY)'] !== null ? parseFloat(data['Amount (ICY)']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const mergedCCYAmount = `${data.Symbol} ${data['Amount (CCY)'] !== null ? parseFloat(data['Amount (CCY)']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const TDSamount = ` ${data['TDS amount'] !== null ? parseFloat(data['TDS amount']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const ExRateGain = ` ${data['Ex rate Gain'] !== null ? parseFloat(data['Ex rate Gain']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const ExRateLoss = ` ${data['Ex rate Loss'] !== null ? parseFloat(data['Ex rate Loss']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const BankCharges = ` ${data['Bank charges'] !== null ? parseFloat(data['Bank charges']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const Payment = ` ${data['Payment'] !== null ? parseFloat(data['Payment']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;


      // Filter out properties you don't want to include in the Excel sheet
      const filteredData = Object.keys(data)
        .filter(key => key !== 'Symbol')
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});

      // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
      filteredData['Amount (ICY)'] = mergedICYAmount;
      filteredData['Amount (CCY)'] = mergedCCYAmount;
      filteredData['TDS amount'] = TDSamount;
      filteredData['Ex rate Gain'] = ExRateGain;
      filteredData['Ex rate Loss'] = ExRateLoss;
      filteredData['Bank charges'] = BankCharges;
      filteredData['Payment'] = Payment;


      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(filteredData));

      // Set text color for customer, receipt, and amount columns
      const columnsToColor = ['Customer', 'Receipt', 'Amount (CCY)', 'Amount (ICY)'];
      columnsToColor.forEach(columnName => {
        const columnIndex = Object.keys(filteredData).indexOf(columnName);
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
    saveAs(blob, 'Report-ReceivableSalesSummary.xlsx');
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
    const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Receivable Sales Summary', '']);
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


    // Define header row and style it with yellow background, bold, and centered text
    const header = Object.keys(this.reportForExcelList[0]).filter(key => key !== 'Symbol');
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
      const formattedDate = date.split('T')[0];
      data.Date = formattedDate;
      const defalutvalue = 0;
      // Merge the symbol and amount into a single string with fixed decimal places
      const mergedICYAmount = `${data.Symbol} ${data['Amount (ICY)'] !== null ? parseFloat(data['Amount (ICY)']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const mergedCCYAmount = `${data.Symbol} ${data['Amount (CCY)'] !== null ? parseFloat(data['Amount (CCY)']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const TDSamount = ` ${data['TDS amount'] !== null ? parseFloat(data['TDS amount']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const ExRateGain = ` ${data['Ex rate Gain'] !== null ? parseFloat(data['Ex rate Gain']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const ExRateLoss = ` ${data['Ex rate Loss'] !== null ? parseFloat(data['Ex rate Loss']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const BankCharges = ` ${data['Bank charges'] !== null ? parseFloat(data['Bank charges']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const Payment = ` ${data['Payment'] !== null ? parseFloat(data['Payment']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;

      // Filter out properties you don't want to include in the Excel sheet
      const filteredData = Object.keys(data)
        .filter(key => key !== 'Symbol')
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});

      // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
      filteredData['Amount (ICY)'] = mergedICYAmount;
      filteredData['Amount (CCY)'] = mergedCCYAmount;
      filteredData['TDS amount'] = TDSamount;
      filteredData['Ex rate Gain'] = ExRateGain;
      filteredData['Ex rate Loss'] = ExRateLoss;
      filteredData['Bank charges'] = BankCharges;
      filteredData['Payment'] = Payment;


      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(filteredData));

      // Set text color for customer, receipt, and amount columns
      const columnsToColor = ['Customer', 'Receipt', 'Amount (CCY)', 'Amount (ICY)'];
      columnsToColor.forEach(columnName => {
        const columnIndex = Object.keys(filteredData).indexOf(columnName);
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
    saveAs(blob, 'Report-ReceivableSalesSummary.xlsx');
  }
}