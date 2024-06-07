
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
  selector: 'app-report-ap-leveltwo',
  templateUrl: './report-ap-leveltwo.component.html',
  styleUrls: ['./report-ap-leveltwo.component.css']
})

export class ReportApLeveltwoComponent implements OnInit {

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
subtypevendorId: number;
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  totalBalancecc : number;
  startDate = '';
  endDate = '';
 
  ZeroToFifteenDaysTotal : number;
  SixteenToThirtyDaysTotal : number;
  ThirtyOneToFourtyFiveDaysTotal : number;
  FourtyFiveSixtyDaysTotal : number;
  MoreThanSixtyDaysTotal : number;
  DueAmountTotal : number;
  BalanceICYTotal : number;
  CreditAmountTotal : number;
  AgingTotal : number;
  InvoiceCCYTotal : number ;
  DueAmountCCYTotal : number


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
    // this.getVoucherList();
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
      VendorID: [0],
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
      VendorID: [0],
       Type:[1],
        SubTypeId: [this.subtype],
      Peroid: [''],
    });
  } else {
        this.reportFilter = this.fb.group({
          DivisionId: [0],
          OfficeId: [0],
          VendorID: [0],
          Type:[2],
          SubTypeId: [this.subtypevendorId],
          FromDate: [this.startDate],
          ToDate: [this.endDate],
          Peroid: [''],
        });
    }

    this.onOptionChange('month');
     if(this.type == 'Overall-list'){
      await this.getAPAgingOverallList();
    }
    else if(this.type == 'Vendor-wise'){
      await this.getAPAgingVendorList();
    }else{
      await this.getAPAgingInvoiceList();
    }
  }
  
  async showVendor(SubTypeId:number){
  this.subtype = SubTypeId;
    this.pagedItems = [];
    this.type = 'Vendor-wise';
    await this.createReportForm();
       this.reportFilter.controls.Peroid.setValue('month');
        await this.getAPAgingVendorList();

  }

  async showVendorinvoicewise(subtypevendorId: number){
   this.subtypevendorId = subtypevendorId;
    this.pagedItems = [];
    this.type = 'Vendor-Invoice-wise';
    await this.createReportForm();
    this.reportFilter.controls.Peroid.setValue('month');
    await this.getAPAgingInvoiceList();

  }

  async Cancel() {
    if (this.type === 'Vendor-Invoice-wise') {
      this.type = 'Vendor-wise';
      await this.createReportForm();
      await this.showVendor(0); 
    } else if (this.type === 'Vendor-wise') {
      this.type = 'Overall-list';
      await this.createReportForm();    
      await this.getAPAgingOverallList();
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
      await this.getAPAgingOverallList();
    }else if(this.type  == 'Vendor-wise'){
      await this.getAPAgingVendorList();
    }else{
      await this.getAPAgingInvoiceList();
    }
  }
  

  getAPAgingOverallList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAPAgingList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        // this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.calculateTotalDays(this.reportList);
      }
      else {     
      this.pager = {};
      this.pagedItems = [];
      this.ZeroToFifteenDaysTotal = 0;
      this.SixteenToThirtyDaysTotal = 0;
      this.ThirtyOneToFourtyFiveDaysTotal = 0;
      this.FourtyFiveSixtyDaysTotal = 0;
      this.MoreThanSixtyDaysTotal = 0;
      this.DueAmountTotal = 0;
      }
        error => {
        console.log(error);
        }
    })
  }

getAPAgingVendorList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.getAPAgingList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.calculateTotalDays(this.reportList);
        
      } else {
        this.pager = {};
        this.pagedItems = [];
        this.ZeroToFifteenDaysTotal = 0;
        this.SixteenToThirtyDaysTotal = 0;
        this.ThirtyOneToFourtyFiveDaysTotal = 0;
        this.FourtyFiveSixtyDaysTotal = 0;
        this.MoreThanSixtyDaysTotal = 0;
        this.DueAmountTotal = 0;
        this.BalanceICYTotal = 0;
        this.CreditAmountTotal = 0;
      
      }
    })
  }

 getAPAgingInvoiceList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.getAPAgingList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.calculateTotalDays(this.reportList);
      
      } else {
        this.pager = {};
        this.pagedItems = [];
        this.ZeroToFifteenDaysTotal = 0;
        this.SixteenToThirtyDaysTotal = 0;
        this.ThirtyOneToFourtyFiveDaysTotal = 0;
        this.FourtyFiveSixtyDaysTotal = 0;
        this.MoreThanSixtyDaysTotal = 0;
        this.DueAmountTotal = 0;
        this.BalanceICYTotal = 0;
        this.CreditAmountTotal = 0;
        this.AgingTotal = 0;
        this.InvoiceCCYTotal = 0;
        this.DueAmountCCYTotal = 0;
      }
    })
  }

  calculateTotalDays(reportList: any[]): void {
    let zeroToFifteenDaysTotal = 0;
    let sixteenToThirtyDaysTotal = 0;
    let thirtyOneToFortyFiveDaysTotal = 0;
    let fortyFiveToSixtyDaysTotal = 0;
    let moreThanSixtyDaysTotal = 0;
    let dueAmountTotal = 0;
    let creditAmountTotal = 0;
    let amountICYTotal = 0;
    let agingTotal = 0;
    let invoiceCCYTotal = 0;
    let dueAmountCCYTotal = 0;
  
    if(this.type == "Overall-list"){
      reportList.forEach(item => {
        zeroToFifteenDaysTotal += item['0-15 DAYS'] ;
        sixteenToThirtyDaysTotal += item['16-30 DAYS'];
        thirtyOneToFortyFiveDaysTotal += item['31-45 DAYS'] ;
        fortyFiveToSixtyDaysTotal += item['45-60 DAYS'] ;  
        moreThanSixtyDaysTotal += item['>60 DAYS'];  
        dueAmountTotal += item['Total (Company Currency)'];
      });
    
      this.ZeroToFifteenDaysTotal = zeroToFifteenDaysTotal;
      this.SixteenToThirtyDaysTotal = sixteenToThirtyDaysTotal;
      this.ThirtyOneToFourtyFiveDaysTotal = thirtyOneToFortyFiveDaysTotal;
      this.FourtyFiveSixtyDaysTotal = fortyFiveToSixtyDaysTotal;
      this.MoreThanSixtyDaysTotal = moreThanSixtyDaysTotal;
      this.DueAmountTotal = dueAmountTotal;
    }
    else if(this.type =="Vendor-wise"){
        reportList.forEach(item => {
        creditAmountTotal += item['Credit Amount'] ;
        zeroToFifteenDaysTotal += item['0-15 DAYS'] ;
        sixteenToThirtyDaysTotal += item['16-30 DAYS'];
        thirtyOneToFortyFiveDaysTotal += item['31-45 DAYS'];
        fortyFiveToSixtyDaysTotal += item['45-60 DAYS'];  
        moreThanSixtyDaysTotal += item['>60 DAYS'];  
        dueAmountTotal += item['Balance (Company Currency)'];
        amountICYTotal += item['Balance (Invoice currency)'];
      }); 
      this.CreditAmountTotal = creditAmountTotal;
      this.ZeroToFifteenDaysTotal = zeroToFifteenDaysTotal;
      this.SixteenToThirtyDaysTotal = sixteenToThirtyDaysTotal;
      this.ThirtyOneToFourtyFiveDaysTotal = thirtyOneToFortyFiveDaysTotal;
      this.FourtyFiveSixtyDaysTotal = fortyFiveToSixtyDaysTotal;
      this.MoreThanSixtyDaysTotal = moreThanSixtyDaysTotal;
      this.DueAmountTotal = dueAmountTotal;
      this.BalanceICYTotal = amountICYTotal;
    }
    else{
      reportList.forEach(item => {
      agingTotal += item['Age (Days)'] ;  
      invoiceCCYTotal += item['Invoice Amount'];  
      dueAmountTotal += item['Balance (Invoice currency)'];
      dueAmountCCYTotal += item['Balance (Company Currency)'];
    }); 
    this.AgingTotal = agingTotal;
    this.InvoiceCCYTotal = invoiceCCYTotal;
    this.DueAmountTotal = dueAmountTotal;
    this.DueAmountCCYTotal = dueAmountCCYTotal;
  }

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
    }else if(this.type == 'vendor-wise'){
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        Type: 1,
        VendorID: 0,
        SubTypeId: this.subtype,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }else{
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        VendorID: 0,
        Type: 2,
        SubTypeId: this.subtypevendorId,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }
    this.officeList = [];
    this.reportFilter.controls.Peroid.setValue('month');
    if(this.type  == 'Overall-list'){
      this.getAPAgingOverallList();
    }else if(this.type == 'Vendor-wise'){
      this.getAPAgingVendorList();
    }else{
      this.getAPAgingInvoiceList();
    }
  }


  export(){
    debugger
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
    debugger
    if (reportList.length === 0) {
      Swal.fire('No record found');
      return;
    }
  
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');
  
    let titleHeader: string;
    let excludeKeys: string[];
  
    switch (reportType) {
      case 'Overall-list':
        titleHeader = 'Payable Balance Summary - Overall';
        excludeKeys = ['Id'];
        break;
      case 'Vendor-wise':
        titleHeader = 'Payable Balance Summary - Vendor Wise';
        excludeKeys = ['VendorID', 'InvoiceDate', 'BalanceCCY'];
        break;
      case 'Vendor-Invoice-wise':
        titleHeader = 'Payable Balance Summary - Invoice Wise';
        excludeKeys = [];
        break;
      default:
        titleHeader = 'Payable Balance Summary';
        excludeKeys = [];
        break;
    }
  
    const header = Object.keys(reportList[0]).filter((key) => !excludeKeys.includes(key));
  
    const titleRow = worksheet.addRow(['', '', '', 'NAVIO SHIPPING PRIVATE LIMITED','', '', '']);
    titleRow.getCell(4).font = { size: 15, bold: true };
    titleRow.getCell(4).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`D${titleRow.number}:E${titleRow.number}`);
  
    const subtitleRow = worksheet.addRow(['', '', '', titleHeader,'', '', '']);
    subtitleRow.getCell(4).font = { size: 14 };
    subtitleRow.getCell(4).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`D${subtitleRow.number}:E${subtitleRow.number}`);
  
    const dateRow = worksheet.addRow(['', '', '',  `FROM ${startDate} - TO ${endDate}`,'', '', '']);
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
  
    const columnColorMapping = {
      'Overall-list': ['Sub Category', 'Total (Company Currency)'],
      'Vendor-wise': ['Vendor', 'Credit Amount', 'Balance (Company Currency)', 'Balance (Invoice currency)'],
      'Vendor-Invoice-wise': ['Vendor Invoice #', 'Transaction Type', 'Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)']
    };
    const columnsToColor = columnColorMapping[reportType];
  
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
  
          filteredData['Invoice Amount'] = `${data['Invoice Amount'] !== null ? parseFloat(data['Invoice Amount']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Invoice currency)'] = `${data['Balance (Invoice currency)'] !== null ? parseFloat(data['Balance (Invoice currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          break;
  
        case 'Overall-list':
          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});
  
          filteredData['Total (Company Currency)'] = `${data['Total (Company Currency)'] !== null ? parseFloat(data['Total (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
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
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
       
          break;
      }
  
      const row = worksheet.addRow(Object.values(filteredData));
  
      columnsToColor.forEach((columnName) => {
        const columnIndex = header.indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true };
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
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `PayableBalanceSummary-${reportType}.xlsx`);
  }
  
}



