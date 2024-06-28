
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
      VendorID: [0],
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
      VendorID: [0],
      OfficeId: [0],
      SubTypeId: [this.subtype],
       Type:[1], 
      Peroid: [''],
    });
  }else if( this.type == 'Vendor-Invoice-wise'){
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      VendorID: [0],
      OfficeId: [0],
      SubTypeId: [this.invoicevendortype],
       Type:[2], 
      Peroid: [''],
    });
  }
  this.reportFilter.controls.Peroid.setValue('month');
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
   this.subtype = subTypeId;
    this.pagedItems = [];
    this.type = 'Vendor-wise';
    await this.createReportForm();
    this.reportFilter.controls.Peroid.setValue('month');
    await this.getAccountPayableVendorList();
   

  }

  async showVendorinvoicewise(subTypeId:number){
    this.invoicevendortype = subTypeId;
    this.pagedItems = [];
    this.type = 'Vendor-Invoice-wise';
    await this.createReportForm();
    this.reportFilter.controls.Peroid.setValue('month');
    await this.getAccountPayableInvoiceVendorList();
  }

  async Cancel() {
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
        this.pager = {};
        this.pagedItems = [];
        this.totalVendors = 0;
        this.totalinvoice = 0;
        this.totalbalance = 0;
      }
    })
  }

getAccountPayableVendorList() {
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
    return items.reduce((sum, item) => sum + item['No of Vendors (Open)'], 0);
  }

  calculateTotalInvoices(items: any[]): number {
    return items.reduce((sum, item) => sum + item['No of Invoices (Open)'], 0);
  }

  calculateTotalBalance(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Balance (Company Currency)'], 0);
  }
   calculateTotalCreditAmount(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Credit Amount'], 0);
  }

  calculateTotalInvoiceCurrency(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Balance (Invoice Currency)'], 0);
  }

  calculateTotalNetBalance(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Net Balance (Invoice currency)'], 0);
  }

  calculateTotalCompanyCurrency(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Balance (Company Currency)'], 0);
  }
  calculateTotalInvoiceAmount(items: any[]): number{
    return items.reduce((sum, item) => sum + item['Purchase Invoice Amount'], 0);
  }
  calculateTotalBalanceicy(items: any[]): number{
    return items.reduce((sum, item) => sum + item['Balance (Invoice currency)'] , 0);
  }
  calculateTotalBalanceccy(items: any[]): number{
    return items.reduce((sum, item) => sum + item['Balance (Company Currency)'], 0);
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
        VendorID: 0,
      
    });
    }
    else if(this.type == 'Vendor-wise'){
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        VendorID: 0,
        Type: 1,
        SubTypeId: this.subtype,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }else if(this.type == 'Vendor-Invoice-wise'){
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        VendorID: 0,
        Type: 2,
        SubTypeId: this.invoicevendortype,
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
    }else{
      this.getAccountPayableInvoiceVendorList();
    }
  }
  
  export(){
    if(this.type =="Overall-list")
    {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'Overall-list');
    }
   else if(this.type =="Vendor-wise")
    {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'Vendor-wise');
    }
  else
    {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'Vendor-Invoice-wise');
    }
  } 
  
  async downloadAsExcel(
    reportList: any[],
    startDate: string,
    endDate: string,
    reportType: 'Overall-list' | 'Vendor-wise' | 'Vendor-Invoice-wise'
  ) {
    if (reportList.length === 0) {
      Swal.fire('No record found');
      return;
    }
  
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');
  
    let titleHeader: string;
    let excludeKeys: string[];
  
    // Define column color and alignment mappings for each report type
    let columnsToColor: string[] = [];
    let columnsToAlignLeft: string[] = [];
    let columnsToAlignRight: string[] = [];
  
    switch (reportType) {
      case 'Overall-list':
        titleHeader = 'Payable Balance Summary - Overall';
        excludeKeys = ['Id'];
        columnsToColor = ['Sub Category', 'Balance (Company Currency)'],
        columnsToAlignLeft = ['Sub Category'];
        columnsToAlignRight = ['Balance (Company Currency)'];
        break;
      case 'Vendor-wise':
        titleHeader = 'Payable Balance Summary - Vendor Wise';
        excludeKeys = ['VendorID', 'InvoiceDate'];
        columnsToColor = ['Vendor', 'Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice currency)', 'Balance (Company Currency)'],
        columnsToAlignLeft = ['Vendor'];
        columnsToAlignRight = ['Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice currency)', 'Balance (Company Currency)'];
        break;
      case'Vendor-Invoice-wise':
        titleHeader = 'Payable Balance Summary - Invoice Wise';
        excludeKeys = [];
        columnsToColor = ['Vendor Invoice #', 'Vendor', 'Purchase Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)']
        columnsToAlignLeft = ['Vendor Invoice #', 'Vendor'];
        columnsToAlignRight = ['Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)'];
        break;
      default:
        titleHeader = 'Payable Balance Summary';
        excludeKeys = [];
        break;
    }
  
    const header = Object.keys(reportList[0]).filter((key) => !excludeKeys.includes(key));
  
    const titleRow = worksheet.addRow(['', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '', '', '']);
    titleRow.getCell(4).font = { size: 15, bold: true };
    titleRow.getCell(4).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`D${titleRow.number}:E${titleRow.number}`);
  
    const subtitleRow = worksheet.addRow(['', '', '', titleHeader, '', '', '']);
    subtitleRow.getCell(4).font = { size: 14 };
    subtitleRow.getCell(4).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`D${subtitleRow.number}:E${subtitleRow.number}`);
  
    const dateRow = worksheet.addRow(['', '', '', `FROM ${startDate} - TO ${endDate}`, '', '', '']);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    worksheet.mergeCells(`D${dateRow.number}:E${dateRow.number}`);
  
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
  
    // Initialize totals
    let totalCreditAmount = 0;
    let totalBalanceInvoiceCurrency = 0;
    let totalNetBalanceInvoiceCurrency = 0;
    let totalBalanceCompanyCurrency = 0;
    let totalvendor = 0;
    let totalInvoice = 0;
    let totalInvoiceAmount = 0;
    let totaInvoiceCurrency = 0;
  
    reportList.forEach((data) => {
      let filteredData: { [key: string]: any } = {};
      const defaultValue = 0;
  
      switch (reportType) {
        case 'Vendor-Invoice-wise':
          data.Date = data.Date.split('T')[0];
          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});
  
          filteredData['Purchase Invoice Amount'] = `${data['Purchase Invoice Amount'] !== null ? parseFloat(data['Purchase Invoice Amount']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Invoice currency)'] = `${data['Balance (Invoice currency)'] !== null ? parseFloat(data['Balance (Invoice currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction): defaultValue.toFixed(this.entityFraction)}`;
  
          // Accumulate totals
          totalInvoiceAmount += parseFloat(data['Purchase Invoice Amount']) || 0;
          totaInvoiceCurrency += parseFloat(data['Balance (Invoice currency)']) || 0;
          totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
          break;
  
        case 'Overall-list':
          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});
  
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['No of Vendors (Open)'] = `${data['No of Vendors (Open)'] !== null ? parseFloat(data['No of Vendors (Open)']) : defaultValue}`;
          filteredData['No of Invoices (Open)'] = `${data['No of Invoices (Open)'] !== null ? parseFloat(data['No of Invoices (Open)']) : defaultValue}`;
          // Accumulate totals
          totalvendor += parseFloat(data['No of Vendors (Open)']) || 0;
          totalInvoice += parseFloat(data['No of Invoices (Open)']) || 0;
          totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
          break;
  
        case 'Vendor-wise':
        default:
          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});
  
          filteredData['Credit Amount'] = `${data['Credit Amount'] !== null ? parseFloat(data['Credit Amount']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Invoice Currency)'] = `${data['Balance (Invoice Currency)'] !== null ? parseFloat(data['Balance (Invoice Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Net Balance (Invoice currency)'] = `${data['Net Balance (Invoice currency)'] !== null ? parseFloat(data['Net Balance (Invoice currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
         
        
          // Accumulate totals
    
          totalCreditAmount += parseFloat(data['Credit Amount']) || 0;
          totalBalanceInvoiceCurrency += parseFloat(data['Balance (Invoice Currency)']) || 0;
          totalNetBalanceInvoiceCurrency += parseFloat(data['Net Balance (Invoice currency)']) || 0;
          totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
          break;
      }
  
      const row = worksheet.addRow(Object.values(filteredData));
  
      // Apply color and alignment based on the category
      columnsToColor.forEach((columnName) => {
        const columnIndex = header.indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true };
          cell.alignment = { horizontal: 'right' };
        }
      });
  
      columnsToAlignLeft.forEach((columnName) => {
        const columnIndex = header.indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.alignment = { horizontal: 'left' };
        }
      });
  
      columnsToAlignRight.forEach((columnName) => {
        const columnIndex = header.indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.alignment = { horizontal: 'right' };
        }
      });
    });
  
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
  
    let defaultValue = 0
    // Add footer row with totals
    const footerData = ['Grand Total']; // First column with text "Grand Total"
    for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
      if (header[i] === 'Credit Amount') {
        footerData.push(totalCreditAmount.toFixed(this.entityFraction));
      }
      else if(header[i] === 'No of Vendors (Open)'){
        footerData.push(totalvendor.toFixed(defaultValue));
      } else if(header[i] === 'No of Invoices (Open)'){
        footerData.push(totalInvoice.toFixed(defaultValue));
      }else if (header[i] === 'Balance (Invoice Currency)') {
        footerData.push(totalBalanceInvoiceCurrency.toFixed(this.entityFraction));
      } else if (header[i] === 'Net Balance (Invoice currency)') {
        footerData.push(totalNetBalanceInvoiceCurrency.toFixed(this.entityFraction));
      } else if (header[i] === 'Balance (Company Currency)') {
        footerData.push(totalBalanceCompanyCurrency.toFixed(this.entityFraction));
      } else if(header[i] === 'Purchase Invoice Amount'){
        footerData.push(totalInvoiceAmount.toFixed(this.entityFraction));
      }
      else if(header[i] === 'Balance (Invoice currency)'){
        footerData.push(totaInvoiceCurrency.toFixed(this.entityFraction));  
      }
      else {
        footerData.push('');
      }
    }
    const footerRow = worksheet.addRow(footerData);
    footerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'right' }; // Align first column to left
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF99' }, // Example color, change as needed
      };
    });
  
    // Add "End of Report" row
    const endOfReportRow = worksheet.addRow(['End of Report']);
    endOfReportRow.eachCell((cell) => {
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
    worksheet.mergeCells(`A${endOfReportRow.number}:${String.fromCharCode(65 + header.length - 1)}${endOfReportRow.number}`);
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `PayableBalanceSummary-${reportType}.xlsx`);
  }
  
  
  
}

  

  


