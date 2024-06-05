
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
  selector: 'app-report-ap-levelone',
  templateUrl: './report-ap-levelone.component.html',
  styleUrls: ['./report-ap-levelone.component.css']
})
export class ReportApLeveloneComponent implements OnInit {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  IsBranchEnable: boolean = false;
  vendorList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  paymentModeList: any[];
  vendorBranch: any;
  pagesort: any = new GridSort().sort;
  TypeList = [
    { TypeId: 1, TypeName: 'Bill' },
    { TypeId: 2, TypeName: 'On Account' }
  ];
  totalVendors : Number = 0;
  totalinvoice : Number = 0;
  totalbalance : Number = 0;
  totalcreditamount : Number = 0;
  totalbalanceicy : Number = 0;
  totalnetbalance : Number = 0;
  totalbalanceccy : Number = 0;
  totalinvoiceamount   = 0;
  
  
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
  type = 'Overall-list';
  subtype       : number;
  invoicevendortype  : number;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  startDate = '';
  endDate = '';

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
    this.getVendorList();
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
    if (this.type == 'Overall-list' ){
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      OfficeId: [0],
      Type:[0],
        SubTypeId: [0],
      Peroid: [''],
    });
  }else if( this.type == 'Vendor-wise'){
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      OfficeId: [0],
      SubTypeId: [this.subtype],
       Type:[1], 
      Peroid: [''],
    });
  }else if( this.type == 'Vendor-Invoice-wise'){
    debugger
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      OfficeId: [0],
      SubTypeId: [this.invoicevendortype],
       Type:[2], 
      Peroid: [''],
    });
  }
  
    this.onOptionChange('month');
    if(this.type == 'Overall-list'){
      await this.getAccountPayableOverallList();
    }
    else if(this.type == 'Vendor-wise'){
      await this.getAccountPayableVendorList();
    }
    else if(this.type == 'Vendor-Invoice-wise'){
      await this.getAccountPayableInvoiceVendorList();
    }
  
  }
  
  
  async showVendor(subTypeId:number){
    debugger
   this.subtype = subTypeId;
    this.pagedItems = [];
    this.type = 'Vendor-wise';
    await this.createReportForm();
    this.reportFilter.controls.Peroid.setValue('month');
    await this.getAccountPayableVendorList();
   

  }

  async showVendorinvoicewise(subTypeId:number){
    debugger
    this.invoicevendortype = subTypeId;
    this.pagedItems = [];
    this.type = 'Vendor-Invoice-wise';
    await this.createReportForm();
    this.reportFilter.controls.Peroid.setValue('month');
    await this.getAccountPayableInvoiceVendorList();
  }

  async Cancel() {
    debugger
    if (this.type === 'Vendor-Invoice-wise') {
      this.type = 'Vendor-wise';
      await this.createReportForm();
      await this.showVendor(0); 
    } else if (this.type === 'Vendor-wise') {
      this.type = 'Overall-list';
      await this.createReportForm();    
      await this.getAccountPayableOverallList();
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
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    })
  }

  getVendorList() {
    return new Promise((resolve, reject) => {
      this.reportService.getVendorList().subscribe((result: any) => {
        if (result.message == "Success") {
          if (result["data"].Table.length) {
            const uniqueVendor = this.removeDuplicatesVendorId(result["data"].Table, 'VendorID');
            this.vendorList = uniqueVendor;
            resolve(true);
            // console.log('vendorList', this.vendorList);
          }
        }
      }, (error) => {
        // Swal.fire(error.message, 'error');
        reject();
      });
    })
  }


  removeDuplicatesVendorId(arr, key) {
    const uniqueMap = new Map();
    arr.forEach((item) => {
      const value = item[key];
      if (!uniqueMap.has(value)) {
        uniqueMap.set(value, item);
      }
    });
    return Array.from(uniqueMap.values());
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
  
  async search(){
 debugger
    if(this.type  == 'Overall-list'){
      await this.getAccountPayableOverallList();
    }
    else if(this.type  == 'Vendor-wise'){
      await this.getAccountPayableVendorList();
    }
    else if(this.type  == 'Vendor-Invoice-wise'){
      await this.getAccountPayableInvoiceVendorList();
    }
  }

  getAccountPayableOverallList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAccountPayableList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        // this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.totalVendors = this.calculateTotalVendors(this.reportList);
        this.totalinvoice = this.calculateTotalInvoices(this.reportList);
        this.totalbalance = this.calculateTotalBalance(this.reportList);
      } else {
        // this.pager = {};
        // this.pagedItems = [];
        this.totalVendors = 0;
        this.totalinvoice = 0;
        this.totalbalance = 0;
      }
    })
    this.pager = {};
    this.pagedItems = [];
  }

getAccountPayableVendorList() {
    debugger
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAccountPayableList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        // this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
         this.totalcreditamount = this.calculateTotalCreditAmount(this.reportList);
        this.totalbalanceicy = this.calculateTotalInvoiceCurrency(this.reportList);
        this.totalnetbalance = this.calculateTotalNetBalance(this.reportList);
        this.totalbalanceccy = this.calculateTotalCompanyCurrency(this.reportList);
      } else {
        // this.pager = {};
        // this.pagedItems = [];
       this.totalcreditamount  = 0;
       this.totalbalanceicy   = 0;
       this.totalnetbalance    = 0;
       this.totalbalanceccy    = 0;
      }
    })
    this.pager = {};
    this.pagedItems = [];
  }

  getAccountPayableInvoiceVendorList() {
    debugger
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAccountPayableList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        // this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        
        this.totalinvoiceamount = this.calculateTotalInvoiceAmount(this.reportList);
        this.totalbalanceicy = this.calculateTotalBalanceicy(this.reportList);
        this.totalbalanceccy = this.calculateTotalBalanceccy(this.reportList);
      } else {
        this.pager = {};
        this.pagedItems = [];
        
       this.totalinvoiceamount   = 0;
       this.totalbalanceicy    = 0;
       this.totalbalanceccy    = 0;
      }
    })
    this.pager = {};
    this.pagedItems = [];
  }


  calculateTotalVendors(items: any[]): number {
    return items.reduce((sum, item) => sum + item.VendorCount, 0);
  }

  calculateTotalInvoices(items: any[]): number {
    return items.reduce((sum, item) => sum + item.InvoiceNumberCount, 0);
  }

  calculateTotalBalance(items: any[]): number {
    return items.reduce((sum, item) => sum + item.DueAmount, 0);
  }
   calculateTotalCreditAmount(items: any[]): number {
    return items.reduce((sum, item) => sum + item.CreditAmount, 0);
  }

  calculateTotalInvoiceCurrency(items: any[]): number {
    return items.reduce((sum, item) => sum + item.BalanceICY, 0);
  }

  calculateTotalNetBalance(items: any[]): number {
    return items.reduce((sum, item) => sum + item.BalanceICY1, 0);
  }

  calculateTotalCompanyCurrency(items: any[]): number {
    return items.reduce((sum, item) => sum + item.BalanceCCY, 0);
  }
  calculateTotalInvoiceAmount(items: any[]): number{
    return items.reduce((sum, item) => sum + item.InvoiceAmountCCY, 0);
  }
  calculateTotalBalanceicy(items: any[]): number{
    return items.reduce((sum, item) => sum + item.DueAmount, 0);
  }
  calculateTotalBalanceccy(items: any[]): number{
    return items.reduce((sum, item) => sum + item.DueAmountCCY, 0);
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
     if(this.type  == 'Overall-list'){
    this.reportFilter.reset({
      FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
      ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      DivisionId: 0,
      OfficeId: 0,
      Type: 0,
        SubTypeId: 0,
      VendorId: 0,
      
    });
    }
    else if(this.type == 'Vendor-wise'){
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        Customer: 0,
        Type: [1],
        SubTypeId: [this.subtype],
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }else if(this.type == 'Vendor-Invoice-wise'){
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        Customer: 0,
        Type: [1],
        SubTypeId: [this.invoicevendortype],
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }
    this.officeList = [];
    this.reportFilter.controls.Peroid.setValue('month');
    if(this.type  == 'Overall-list'){
      this.getAccountPayableOverallList();
    }
    else if(this.type == 'Vendor-wise'){
      this.getAccountPayableVendorList();
    }
  }
  

  // async downloadAsExcel() {
  //   if (this.reportForExcelList.length === 0) {
  //     Swal.fire('No record found');
  //     return;
  //   }

  //   // Create a new workbook and worksheet
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Report');

  //   // Add title and subtitle rows
  //   const titleRow = worksheet.addRow(['', '', '', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '']);
  //   titleRow.getCell(6).font = { size: 15, bold: true };
  //   titleRow.getCell(6).alignment = { horizontal: 'center' };

  //   // Calculate the length of the title string
  //   const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;

  //   // Iterate through each column to adjust the width based on the title length
  //   worksheet.columns.forEach((column) => {
  //     if (column.number === 6) {
  //       column.width = titleLength + 2;
  //     }
  //   });

  //   // Merge cells for the title
  //   worksheet.mergeCells(`F${titleRow.number}:G${titleRow.number}`);

  //   // Add subtitle row
  //   const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Payment Voucher', '']);
  //   subtitleRow.getCell(6).font = { size: 14 };
  //   subtitleRow.getCell(6).alignment = { horizontal: 'center' };

  //   // Merge cells for the subtitle
  //   worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

  //   // Add "FROM Date" and "TO Date" to the worksheet
  //   const dateRow = worksheet.addRow(['', '', '', '', '', `FROM ${this.startDate} - TO ${this.endDate}`]);
  //   dateRow.eachCell((cell) => {
  //     cell.alignment = { horizontal: 'center' };
  //   });
  //   dateRow.getCell(6).numFmt = 'dd-MM-yyyy';
  //   dateRow.getCell(6).numFmt = 'dd-MM-yyyy';

  //   // Merge cells for "FROM Date" and "TO Date"
  //   worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);


  //   // Define header row and style it with yellow background, bold, and centered text
  //   const header = Object.keys(this.reportForExcelList[0]).filter(key => key !== 'Symbol');
  //   const headerRow = worksheet.addRow(header);


  //   headerRow.eachCell((cell) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '8A9A5B' },
  //     };
  //     cell.font = {
  //       bold: true,
  //       color: { argb: 'FFFFF7' }
  //     };
  //     cell.alignment = {
  //       horizontal: 'center',
  //     };
  //     cell.border = {
  //       top: { style: 'thin' },
  //       left: { style: 'thin' },
  //       bottom: { style: 'thin' },
  //       right: { style: 'thin' },
  //     };
  //   });

  //   // Add data rows with concatenated symbol and amount
  //   this.reportForExcelList.forEach((data) => {

  //     //To Remove Time from date field data
  //     const date = data.Date
  //     const formattedDate = date.split('T')[0];
  //     data.Date = formattedDate;
  //     const defalutvalue=0;
  //     // Merge the symbol and amount into a single string with fixed decimal places
  //     const mergedICYAmount = `${data.Symbol} ${data['Amount (ICY)'] !== null ? parseFloat(data['Amount (ICY)']).toFixed(2) : '0.00'}`;
  //     const mergedCCYAmount = `${data.Symbol} ${data['Amount (CCY)'] !== null ? parseFloat(data['Amount (CCY)']).toFixed(2) : '0.00'}`;
  //     const TDSamount = ` ${data['TDS amount'] !== null ? parseFloat(data['TDS amount']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
  //     const ExRateGain = ` ${data['Ex rate Gain'] !== null ? parseFloat(data['Ex rate Gain']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
  //     const ExRateLoss = ` ${data['Ex rate Loss'] !== null ? parseFloat(data['Ex rate Loss']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
  //     const BankCharges = ` ${data['Bank charges'] !== null ? parseFloat(data['Bank charges']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
  //     const Payment = ` ${data['Payments'] !== null ? parseFloat(data['Payments']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;



  //     // Filter out properties you don't want to include in the Excel sheet
  //     const filteredData = Object.keys(data)
  //       .filter(key => key !== 'Symbol')
  //       .reduce((obj, key) => {
  //         obj[key] = data[key];
  //         return obj;
  //       }, {});

  //     // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
  //     filteredData['Amount (ICY)'] = mergedICYAmount;
  //     filteredData['Amount (CCY)'] = mergedCCYAmount;
  //     filteredData['TDS amount']   =TDSamount;
  //     filteredData['Ex rate Gain'] = ExRateGain;
  //     filteredData['Ex rate Loss'] = ExRateLoss;
  //     filteredData['Bank charges']  =BankCharges;
  //     filteredData['Payments']  =Payment;


  //     // Add the filtered data to the worksheet
  //     const row = worksheet.addRow(Object.values(filteredData));

  //     // Set text color for customer, receipt, and amount columns
  //     const columnsToColor = ['Vendor', 'Payment', 'Amount (CCY)', 'Amount (ICY)'];
  //     columnsToColor.forEach(columnName => {
  //       const columnIndex = Object.keys(filteredData).indexOf(columnName);
  //       if (columnIndex !== -1) {
  //         const cell = row.getCell(columnIndex + 1);
  //         cell.font = { color: { argb: '8B0000' }, bold: true, }; // Red color
  //       }
  //     });

  //   });

  //   // Adjust column widths to fit content
  //   worksheet.columns.forEach((column) => {
  //     let maxLength = 0;
  //     column.eachCell({ includeEmpty: true }, (cell) => {
  //       const cellLength = cell.value ? cell.value.toString().length : 0;
  //       if (cellLength > maxLength) {
  //         maxLength = cellLength;
  //       }
  //     });
  //     column.width = maxLength + 2;
  //   });

  //   // Style the footer row with yellow background, bold, and centered text
  //   const footerRow = worksheet.addRow(['End of Report']);
  //   footerRow.eachCell((cell) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '8A9A5B' },
  //     };
  //     cell.font = {
  //       bold: true,
  //       color: { argb: 'FFFFF7' }
  //     };
  //     cell.alignment = {
  //       horizontal: 'center',
  //     };
  //   });

  //   // Merge footer cells if needed
  //   worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

  //   // Write to Excel and save
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   saveAs(blob, 'Report-PaymentVoucher.xlsx');
  // }



  // async downloadAsCSV() {
  //   if (this.reportForExcelList.length === 0) {
  //     Swal.fire('No record found');
  //     return;
  //   }

  //   // Create a new workbook and worksheet
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Report');

  //   // Add title and subtitle rows
  //   const titleRow = worksheet.addRow(['', '', '', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '']);
  //   titleRow.getCell(6).font = { size: 15, bold: true };
  //   titleRow.getCell(6).alignment = { horizontal: 'center' };

  //   // Calculate the length of the title string
  //   const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;

  //   // Iterate through each column to adjust the width based on the title length
  //   worksheet.columns.forEach((column) => {
  //     if (column.number === 6) {
  //       column.width = titleLength + 2;
  //     }
  //   });

  //   // Merge cells for the title
  //   worksheet.mergeCells(`F${titleRow.number}:G${titleRow.number}`);

  //   // Add subtitle row
  //   const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Payment Voucher', '']);
  //   subtitleRow.getCell(6).font = { size: 14 };
  //   subtitleRow.getCell(6).alignment = { horizontal: 'center' };

  //   // Merge cells for the subtitle
  //   worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

  //   // Add "FROM Date" and "TO Date" to the worksheet
  //   const dateRow = worksheet.addRow(['', '', '', '', '', `FROM ${this.startDate} - TO ${this.endDate}`]);
  //   dateRow.eachCell((cell) => {
  //     cell.alignment = { horizontal: 'center' };
  //   });
  //   dateRow.getCell(6).numFmt = 'dd-MM-yyyy';
  //   dateRow.getCell(6).numFmt = 'dd-MM-yyyy';

  //   // Merge cells for "FROM Date" and "TO Date"
  //   worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);


  //   // Define header row and style it with yellow background, bold, and centered text
  //   const header = Object.keys(this.reportForExcelList[0]).filter(key => key !== 'Symbol');
  //   const headerRow = worksheet.addRow(header);


  //   headerRow.eachCell((cell) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '8A9A5B' },
  //     };
  //     cell.font = {
  //       bold: true,
  //       color: { argb: 'FFFFF7' }
  //     };
  //     cell.alignment = {
  //       horizontal: 'center',
  //     };
  //     cell.border = {
  //       top: { style: 'thin' },
  //       left: { style: 'thin' },
  //       bottom: { style: 'thin' },
  //       right: { style: 'thin' },
  //     };
  //   });

  //   // Add data rows with concatenated symbol and amount
  //   this.reportForExcelList.forEach((data) => {

  //     //To Remove Time from date field data
  //     const date = data.Date
  //     const formattedDate = date.split('T')[0];
  //     data.Date = formattedDate;

  //     const defalutvalue=0;
  //     // Merge the symbol and amount into a single string with fixed decimal places
  //     const mergedICYAmount = `${data.Symbol} ${data['Amount (ICY)'] !== null ? parseFloat(data['Amount (ICY)']).toFixed(2) : '0.00'}`;
  //     const mergedCCYAmount = `${data.Symbol} ${data['Amount (CCY)'] !== null ? parseFloat(data['Amount (CCY)']).toFixed(2) : '0.00'}`;
  //     const TDSamount = ` ${data['TDS amount'] !== null ? parseFloat(data['TDS amount']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
  //     const ExRateGain = ` ${data['Ex rate Gain'] !== null ? parseFloat(data['Ex rate Gain']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
  //     const ExRateLoss = ` ${data['Ex rate Loss'] !== null ? parseFloat(data['Ex rate Loss']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
  //     const BankCharges = ` ${data['Bank charges'] !== null ? parseFloat(data['Bank charges']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
  //     const Payment = ` ${data['Payments'] !== null ? parseFloat(data['Payments']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction)}`;
      

  //     // Filter out properties you don't want to include in the Excel sheet
  //     const filteredData = Object.keys(data)
  //       .filter(key => key !== 'Symbol')
  //       .reduce((obj, key) => {
  //         obj[key] = data[key];
  //         return obj;
  //       }, {});

  //     // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
  //     filteredData['Amount (ICY)'] = mergedICYAmount;
  //     filteredData['Amount (CCY)'] = mergedCCYAmount;
  //     filteredData['TDS amount']   =TDSamount;
  //     filteredData['Ex rate Gain'] = ExRateGain;
  //     filteredData['Ex rate Loss'] = ExRateLoss;
  //     filteredData['Bank charges']  =BankCharges;
  //     filteredData['Payments']  =Payment;


  //     // Add the filtered data to the worksheet
  //     const row = worksheet.addRow(Object.values(filteredData));

  //     // Set text color for customer, receipt, and amount columns
  //     const columnsToColor = ['Vendor', 'Payment', 'Amount (CCY)', 'Amount (ICY)'];
  //     columnsToColor.forEach(columnName => {
  //       const columnIndex = Object.keys(filteredData).indexOf(columnName);
  //       if (columnIndex !== -1) {
  //         const cell = row.getCell(columnIndex + 1);
  //         cell.font = { color: { argb: '8B0000' }, bold: true, }; // Red color
  //       }
  //     });

  //   });

  //   // Adjust column widths to fit content
  //   worksheet.columns.forEach((column) => {
  //     let maxLength = 0;
  //     column.eachCell({ includeEmpty: true }, (cell) => {
  //       const cellLength = cell.value ? cell.value.toString().length : 0;
  //       if (cellLength > maxLength) {
  //         maxLength = cellLength;
  //       }
  //     });
  //     column.width = maxLength + 2;
  //   });

  //   // Style the footer row with yellow background, bold, and centered text
  //   const footerRow = worksheet.addRow(['End of Report']);
  //   footerRow.eachCell((cell) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: '8A9A5B' },
  //     };
  //     cell.font = {
  //       bold: true,
  //       color: { argb: 'FFFFF7' }
  //     };
  //     cell.alignment = {
  //       horizontal: 'center',
  //     };
  //   });

  //   // Merge footer cells if needed
  //   worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

  //   // Write to Excel and save
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   saveAs(blob, 'Report-PaymentVoucher.xlsx');
  // }
  
}

