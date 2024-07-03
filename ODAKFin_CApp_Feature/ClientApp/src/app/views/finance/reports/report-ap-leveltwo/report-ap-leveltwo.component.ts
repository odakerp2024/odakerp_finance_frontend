
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
  agingGroupDropdown: any[];
  paymentModeList: any[];
  vendorBranch: any;
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
  ZeroToFifteenDaysTotal = 0;
  SixteenToThirtyDaysTotal = 0 ;
  ThirtyOneToFourtyFiveDaysTotal = 0 ;
  FourtyFiveSixtyDaysTotal = 0 ;
  MoreThanSixtyDaysTotal = 0;
  DueAmountTotal = 0;
  BalanceICYTotal = 0;
  CreditAmountTotal = 0;
  AgingTotal = 0;
  InvoiceCCYTotal = 0 ;
  DueAmountCCYTotal = 0;
  headers: string[] = [];
  data: any[] = [];
  sortOrder: { [key: string]: 'asc' | 'desc' } = {};
  agingId: any;

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
  ) { 
    this.headers.forEach(header => {
      this.sortOrder[header] = 'asc';
    });
  }

  ngOnInit(): void {
    // Step 1: Initialize the form and other necessary data
    this.createReportForm();
    this.onOptionChange('month');
    this.getDivisionList();
    this.getVendorList();
    
    // Step 2: Fetch the aging dropdown data
    this.getAgingDropdown().then(() => {
      // Step 3: After fetching dropdown data, set form values
      this.reportFilter.controls.Peroid.setValue('month');
      if (this.agingId) {
        this.reportFilter.controls.AgingTypeId.setValue(this.agingId);
        this.createReportForm();
      }
    });
  }

  async getAgingDropdown(): Promise<void> {
    const payload = {
      type: 1,
    };
  
    try {
      const result: any = await this.reportService.getAgingDropdown(payload).toPromise();
      if (result.message === 'Success' && result.data.Table.length > 0) {
        // Process dropdown data as needed
        this.agingGroupDropdown = result.data.Table;
        this.agingId = this.agingGroupDropdown[0].AgingTypeId;
      }
    } catch (error) {
      console.error('Error fetching aging dropdown:', error);
    }
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

async showVendor(SubTypeId:number){
  this.subtype = SubTypeId;
    this.pagedItems = [];
    this.type = 'Vendor-wise';
    await this.createReportForm();
        await this.getAPAgingVendorList();

  }

  async showVendorinvoicewise(subtypevendorId: number){
   this.subtypevendorId = subtypevendorId;
    this.pagedItems = [];
    this.type = 'Vendor-Invoice-wise';
    await this.createReportForm();
    await this.getAPAgingInvoiceList();

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
      AgingTypeId: [this.agingId]
    });
  }else if( this.type == 'Vendor-wise'){
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      OfficeId: [0],
      VendorID: [0],
       Type:[1],
       AgingTypeId: [this.agingId],
        SubTypeId: [this.subtype],
      Peroid: [''],
    });
  } else {
        this.reportFilter = this.fb.group({
          DivisionId: [0],
          OfficeId: [0],
          VendorID: [0],
          Type:[2],
           AgingTypeId: [this.agingId],
          SubTypeId: [this.subtypevendorId],
          FromDate: [this.startDate],
          ToDate: [this.endDate],
          Peroid: [''],
        });
    }
    this.reportFilter.controls.Peroid.setValue('month');
    this.onOptionChange('month');
    this.getAgingDropdown();
     if(this.type == 'Overall-list'){
      await this.getAPAgingOverallList();
    }
    else if(this.type == 'Vendor-wise'){
      await this.getAPAgingVendorList();
    }else{
      await this.getAPAgingInvoiceList();
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
  this.reportFilter.controls.OfficeId.setValue(0);
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
      if (this.officeList.length == 1) {
        const ID =
          this.reportFilter.controls.OfficeId.setValue(this.officeList[0].ID);
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


//  getAgingDropdown() {

//   const payload = {
//     type : 1,
//   }
//     this.reportService.getAgingDropdown(payload).subscribe((result: any) => {
//       if (result.message == 'Success') {
//         this.agingGroupDropdown = [];
//         this.reportFilter.controls.AgingTypeId.setValue('');
//         if (result["data"].Table.length > 0) {
//           this.agingGroupDropdown = result.data.Table;
//         }
//         this.reportFilter.controls.AgingTypeId.setValue(this.agingGroupDropdown[0].AgingTypeId);
//         this.agingId = this.agingGroupDropdown[0].AgingTypeId;
//       }
//     }), error => {
//       console.error(error);
//     }
//   }


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

  
  //Dynamic Overall List 
  getAPAgingOverallList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAPAgingList(this.reportFilter.value).subscribe(result => {
      if (result.message == "Success" && result.data && result.data.Table) {
        this.reportList = result['data'].Table;
        let tableData = result.data.Table;
       
        if (tableData.length > 0) {
          // Set headers from the first data row
          this.headers = Object.keys(tableData[0]).filter(header => header !== 'Id');
          // Extract 'Balance (Company Currency)' field and format it
          this.pagedItems = tableData.map(row => ({
            ...row,
            'Total (Company Currency)': Number(row['Total (Company Currency)']).toFixed(this.entityFraction)
          }));
        this.setPage(1);

      }
      else {    
        
         // No data found, keep existing headers or set default headers
         if (!this.headers || this.headers.length === 0) {
          // Set default headers or handle empty case
          this.headers = ['Sub Category', '0 Days','Total (Company Currency)'];
        }
          this.pagedItems = [];
      }
        error => {
        console.log(error);
        }
      }
    })
  }

  
getAPAgingVendorList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.getAPAgingList(this.reportFilter.value).subscribe(result => {
     this.reportList = [];
     if (result.message == "Success" && result.data && result.data.Table) {
      // if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
     let tableData = result.data.Table;
       
        if (tableData.length > 0) {
          this.headers = Object.keys(tableData[0]); 

          // Extract 'Balance (Company Currency)' field and format it
          this.pagedItems = tableData.map(row => ({
            ...row,
           'Balance (Company Currency)': Number(row['Balance (Company Currency)']).toFixed(this.entityFraction),
            'Balance (Invoice currency)': Number(row['Balance (Invoice currency)']).toFixed(this.entityFraction),
            'Credit Amount': Number(row['Credit Amount']).toFixed(this.entityFraction)
          })); 

        this.setPage(1);
        
      } else {
          this.pagedItems = [];
      
      }
    
      }
    })
  }

 getAPAgingInvoiceList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.getAPAgingList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result.message == "Success" && result.data && result.data.Table) {
      // if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        let tableData = result.data.Table;
       
        if (tableData.length > 0) {
           // Set headers from the first data row
          this.headers = Object.keys(tableData[0]).filter(header => header !== 'VendorID');

          // Extract 'Balance (Company Currency)' field and format it
          this.pagedItems = tableData.map(row => ({
            ...row,
            'Balance (Invoice currency)': Number(row['Balance (Invoice currency)']).toFixed(this.entityFraction),
            'Balance (Company Currency)': Number(row['Balance (Company Currency)']).toFixed(this.entityFraction),
            'Invoice Amount': Number(row['Invoice Amount']).toFixed(this.entityFraction)
          })); 
        this.setPage(1);
      
      } else {
          this.pagedItems = [];
      }
    }
    })
  }
    //Dynamic Grand Total Calculation Methods overall
  calculateDynamicHeaders(): string[] {
    let excludedColumns: string[] = ['Sub Category', 'Id']; // Define columns to be excluded

    if (this.pagedItems.length > 0) {
      return Object.keys(this.pagedItems[0])
        .filter(key => !excludedColumns.includes(key));
    }

    return [];
  }

calculateTotals(header: string): number {
    // Calculate total for the specified header
    return this.pagedItems.reduce((acc, item) => acc + parseFloat(item[header] || 0), 0);
  }

 //Dynamic Grand Total Calculation Methods Vendor Wise 
  calculateHeadersVendorwise(): string[] {
    let excludedColumns: string[] = ['VendorID']; // Define columns to be excluded
  
    if (this.pagedItems.length > 0) {
      return Object.keys(this.pagedItems[0])
        .filter(key => !excludedColumns.includes(key));
    }
  
    return [];
  }
    isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  vendorTotals(header: string): any {
    // Check if the header corresponds to numeric fields
    const isNumeric = this.pagedItems.some(item => !isNaN(parseFloat(item[header])));
  
    // If none of the fields are numeric, return an empty string
    if (!isNumeric) {
      return '';
    }

 // Calculate total for the specified header
    const total = this.pagedItems.reduce((acc, item) => {
      const value = parseFloat(item[header]);
      return isNaN(value) ? acc : acc + value;
    }, 0);
  
    // Return  total 
    return total
  }
  
  calculateVendorTotals(header: string): any {
    const total = this.vendorTotals(header);
    return this.isNumeric(total) ? total : '';
  }
  
  //Dynamic Header Invoice Wise 
  calculateHeadersInvoicewise(): string[] {
    if (this.pagedItems.length > 0) {
      return Object.keys(this.pagedItems[0]) 
    }
    return [];
  }
  
  isDate(value: any): boolean {
    return !isNaN(Date.parse(value));
}

InvoiceTotals(header: string): any {
  const specifiedFields = [
    "Balance (Invoice currency)",
    "Balance (Company Currency)",
    "Invoice Amount",
    "Age (Days)"
  ];

  // Check if the header is one of the specified fields
  if (!specifiedFields.includes(header)) {
    return ''; // Return empty for non-specified fields
  }

  // Calculate total for the specified header
  const total = this.pagedItems.reduce((acc, item) => {
    const value = parseFloat(item[header]);
    return isNaN(value) ? acc : acc + value;
  }, 0);

  return total;
}

  
calculateInvoicewise(header: string): any {
  const total = this.InvoiceTotals(header);
  return this.isNumeric(total) ? total : '';
}

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;

    this.pager = this.ps.getPager(this.reportList.length, page);
    this.pagedItems = this.reportList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  sort(property: string): void {
    this.pagesort(property, this.pagedItems);
  }

  pagesort(property: string, items: any[]): void {
    // Toggle sort order
    const order = this.sortOrder[property] === 'asc' ? 'desc' : 'asc';
    this.sortOrder[property] = order;

    // Sort items based on the property and order
    items.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
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
      AgingTypeId: this.agingId,
        SubTypeId: 0,
        VendorID: 0,
      
    });
    }else if(this.type == 'vendor-wise'){
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        Type: 1,
        VendorID: 0,
        AgingTypeId: this.agingId,
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
        AgingTypeId: this.agingId,
        SubTypeId: this.subtypevendorId,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }
    this.officeList = [];
    this.headers = [];
    this.getAgingDropdown();
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

    let columnsToColor: string[] = [];
    let columnsToAlignLeft: string[] = [];
    let columnsToAlignRight: string[] = [];

    switch (reportType) {
        case 'Overall-list':
            titleHeader = 'Payable Aging Summary - Overall';
            excludeKeys = ['Id'];
            columnsToColor = ['Sub Category', 'Total (Company Currency)'],
            columnsToAlignLeft = ['Sub Category'];
            columnsToAlignRight = ['Balance (Company Currency)'];
            break;
        case 'Vendor-wise':
            titleHeader = 'Payable Aging Summary - Vendor Wise';
            excludeKeys = ['VendorID', 'InvoiceDate', 'BalanceCCY'];
            columnsToColor = ['Vendor', 'Credit Amount', 'Balance (Company Currency)', 'Balance (Invoice currency)'],
            columnsToAlignLeft = ['Vendor'];
            columnsToAlignRight = ['Credit Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)'];
            break;
        case 'Vendor-Invoice-wise':
            titleHeader = 'Payable Aging Summary - Invoice Wise';
            excludeKeys = [];
            columnsToColor = ['Vendor Invoice #', 'Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)']
            columnsToAlignLeft = ['Vendor Invoice #'];
            columnsToAlignRight = ['Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)'];
            break;
        default:
            titleHeader = 'Payable Aging  Summary';
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
    let totalCompanyCurrency = 0;
    let totaInvoiceCurrency = 0;
    let totalBalanceInvoiceVendorWise = 0;
    let totalBalanceCompanyVendorWise = 0;
    let totalBalanceCompanyCurrency = 0;
    let totalInvoiceAmount = 0;

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

                // Accumulate totals
                totalInvoiceAmount += parseFloat(data['Invoice Amount']) || 0;
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

                    filteredData['Total (Company Currency)'] = `${data['Total (Company Currency)'] !== null ? parseFloat(data['Total (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
              
                    totalCompanyCurrency += parseFloat(data['Total (Company Currency)']) || 0;
                break;

            case 'Vendor-wise':
                filteredData = Object.keys(data)
                    .filter((key) => !excludeKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = data[key];
                        return obj;
                    }, {});

                    filteredData['Credit Amount'] = `${data['Credit Amount'] !== null ? parseFloat(data['Credit Amount']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                    filteredData['Balance (Invoice currency)'] = `${data['Balance (Invoice currency)'] !== null ? parseFloat(data['Balance (Invoice currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                    filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                // Accumulate totals
                totalCreditAmount += parseFloat(data['Credit Amount']) || 0;
                totalBalanceInvoiceVendorWise += parseFloat(data['Balance (Invoice currency)']) || 0;
                totalBalanceCompanyVendorWise += parseFloat(data['Balance (Company Currency)']) || 0;
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

    const footerData = ['Grand Total']; // First column with text "Grand Total"

    if (reportType === 'Overall-list') {
      for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
        if (header[i] == 'Total (Company Currency)') {
          footerData.push(totalCompanyCurrency.toFixed(this.entityFraction));
        } else {
          footerData.push('');
        }
      }
    } else if (reportType === 'Vendor-wise') {
      for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
        if (header[i] == 'Credit Amount') {
          footerData.push(totalCreditAmount.toFixed(this.entityFraction));
        }  else if (header[i] == 'Balance (Company Currency)') {
          footerData.push(totalBalanceCompanyVendorWise.toFixed(this.entityFraction));
        } else if (header[i] == 'Balance (Invoice currency)') {
          footerData.push(totalBalanceInvoiceVendorWise.toFixed(this.entityFraction));
        } else {
          footerData.push('');
        }
      }
    } else if (reportType === 'Vendor-Invoice-wise') {
      for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
        if (header[i] == 'Invoice Amount') {
          footerData.push(totalInvoiceAmount.toFixed(this.entityFraction));
        }
        else if (header[i] == 'Balance (Invoice currency)') {
          footerData.push(totaInvoiceCurrency.toFixed(this.entityFraction));
        } else if (header[i] == 'Balance (Company Currency)') {
          footerData.push(totalBalanceCompanyCurrency.toFixed(this.entityFraction));
        } else {
          footerData.push('');
        }
      }
    } else {
      for (let i = 1; i < header.length; i++) {
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
    saveAs(blob, `PayableAgingSummary-${reportType}.xlsx`);
  }

}




