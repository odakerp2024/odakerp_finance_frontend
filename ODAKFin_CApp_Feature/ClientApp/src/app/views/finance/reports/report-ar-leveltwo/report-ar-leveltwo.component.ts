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
import { debug } from 'console';
import { debugOutputAstAsTypeScript } from '@angular/compiler';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-report-ar-leveltwo',
  templateUrl: './report-ar-leveltwo.component.html',
  styleUrls: ['./report-ar-leveltwo.component.css']
})
export class ReportArLeveltwoComponent implements OnInit {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  pager: any = {};// pager object
  pagedItems: any[];// paged items
  specifiedFields: string[] = [ "Balance (Invoice Currency)", "Balance (Company Currency)", "Invoice Amount", "Age (Days)" ];
  customerList: any[];
  agingGroupDropdown: any[];
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
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  startDate = '';
  endDate = '';
  type = 'overall';
  subtype: number;
  subtypecustomerId: number;
  ZeroToFifteenDaysTotal = 0;
  SixteenToThirtyDaysTotal = 0;
  ThirtyOneToFourtyFiveDaysTotal = 0;
  FourtyFiveSixtyDaysTotal = 0;
  MoreThanSixtyDaysTotal = 0;
  DueAmountTotal = 0;
  CreditAmountTotal = 0;
  BalanceICYTotal = 0;
  AgingTotal = 0;
  InvoiceCCYTotal = 0;
  DueAmountCCYTotal = 0;
  headers: string[] = [];
  data: any[] = [];
  sortOrder: { [key: string]: 'asc' | 'desc' } = {};
  totals: any;

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
    this.createReportForm();
    this.onOptionChange('month');
    this.getDivisionList();
    this.getCustomerList(0);
    this.getAgingDropdown().then(() => {
      this.getOverallList();
      this.search();
      this.reportFilter.controls.Peroid.setValue('month');
      console.log('Initialization Complete');
    });
  }


  


  async goBack() {
    if (this.type === 'customerinvoicewise') {
      this.type = 'customerwise';
      //await this.createReportForm();
      await this.showCustomerWise(0);
    } else if (this.type === 'customerwise') {
      this.type = 'overall';
      await this.createReportForm();
      await this.getOverallList();
      await this.getAgingDropdown();
    }
  }
  async showCustomerWise(subTypeId: number) {
    this.subtype = subTypeId;
    this.pagedItems = [];
    this.type = 'customerwise';
  
    // Set the report type and sub-type
    this.reportFilter.controls.Type.setValue(1);
    this.reportFilter.controls.SubTypeId.setValue(this.subtype);
  
    // Get the selected AgingTypeId from the form
    const selectedAgingTypeId = this.reportFilter.controls.AgingTypeId.value;
    this.reportFilter.controls.AgingTypeId.setValue(selectedAgingTypeId);
  
    await this.getCustomerWiseList();
  }
  
  async showCustomerInvoiceWise(subtypecustomerId: number) {
    this.subtypecustomerId = subtypecustomerId;
    this.pagedItems = [];
    this.type = 'customerinvoicewise';
  
    // Set the report type and sub-type
    this.reportFilter.controls.Type.setValue(2);
    this.reportFilter.controls.SubTypeId.setValue(this.subtypecustomerId);
  
    // Get the selected AgingTypeId from the form
    const selectedAgingTypeId = this.reportFilter.controls.AgingTypeId.value;
    this.reportFilter.controls.AgingTypeId.setValue(selectedAgingTypeId);
  
    await this.getInvoiceWiseList();
  }
  
  // async showCustomerWise(subTypeId: number) {
  //   this.subtype = subTypeId;
  //   this.pagedItems = [];
  //   this.type = 'customerwise';
  //   //await this.createReportForm();
  //   this.reportFilter.controls.Type.setValue(1);
  //   this.reportFilter.controls.SubTypeId.setValue(this.subtype);
  //   this.reportFilter.controls.AgingTypeId.setValue(1);
  //   await this.getCustomerWiseList();
  // }

  // async showCustomerInvoiceWise(subtypecustomerId: number) {
  //   this.subtypecustomerId = subtypecustomerId;
  //   this.pagedItems = [];
  //   this.type = 'customerinvoicewise';
  //   //await this.createReportForm();
  //   this.reportFilter.controls.AgingTypeId.setValue(1);
  //   this.reportFilter.controls.Type.setValue(2);
  //   this.reportFilter.controls.SubTypeId.setValue(this.subtypecustomerId);
  //   await this.getInvoiceWiseList();
  // }



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
        Type: [0],
        CustomerId: [0],
        SubTypeId: [0],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        Peroid: [''],
        AgingTypeId: [0]
      });
    } else if (this.type == 'customerwise') {
      this.reportFilter = this.fb.group({
        DivisionId: [0],
        OfficeId: [0],
        CustomerId: [0],
        Type: [1],
        AgingTypeId: [0],
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
        Type: [2],
        AgingTypeId: [0],
        SubTypeId: [this.subtypecustomerId],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        Peroid: [''],
      });
    }
    
    await this.getAgingDropdown();
    this.reportFilter.controls.Peroid.setValue('month');
    this.onOptionChange('month');
    
    if (this.type == 'overall') {
      await this.getOverallList();
    } else if (this.type == 'customerwise') {
      await this.getCustomerWiseList();
    } else {
      await this.getInvoiceWiseList();
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

  // getAgingDropdown() {
  //   const payload = {
  //     type: 2,
  //   }

  //   this.reportService.getAgingDropdown(payload).subscribe((result: any) => {
  //     if (result.message == 'Success') {
  //       this.reportFilter.controls.AgingTypeId.setValue('');
  //       this.agingGroupDropdown = [];
  //       if (result["data"].Table.length > 0) {
  //         this.agingGroupDropdown = result.data.Table;

  //       }
  //       this.reportFilter.controls.AgingTypeId.setValue(this.agingGroupDropdown[0].AgingTypeId);

  //     }
  //   }), error => {
  //     console.error(error);
  //   }
  // }

  // async getAgingDropdown() {
  //   const payload = { type: 2 };
  
  //   return this.reportService.getAgingDropdown(payload).toPromise().then((result: any) => {
  //     if (result.message === 'Success') {
  //       this.agingGroupDropdown = result.data.Table || [];
  //       if (this.agingGroupDropdown.length > 0) {
  //         this.reportFilter.controls.AgingTypeId.setValue(this.agingGroupDropdown[0].AgingTypeId);
  //       }
  //     }
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // }
  // //Dynamic Overall List
  // getOverallList() {
  //   this.startDate = this.reportFilter.controls.FromDate.value;
  //   this.endDate = this.reportFilter.controls.ToDate.value;

  //   this.reportService.getAgingSummaryList(this.reportFilter.value).subscribe(result => {
  //     this.reportList = [];
  //     if (result.message == "Success" && result.data && result.data.Table) {
  //       this.reportList = result['data'].Table;
  //       let tableData = result.data.Table;

  //       if (tableData.length > 0) {
  //         // Set headers from the first data row
  //         this.headers = Object.keys(tableData[0]).filter(header => header !== 'Id');
  //         // Format the data rows
  //         this.pagedItems = tableData.map(row => ({
  //           ...row,
  //           'Balance (Company Currency)': Number(row['Balance (Company Currency)']).toFixed(this.entityFraction)
  //         }));
  //         this.setPage(1);
  //       } else {
  //         this.showNoDataAlert();
  //         this.headers = [];  // Clear headers when no data is found
  //         this.pagedItems = [];
  //       }
  //     } else {
  //       this.showNoDataAlert();
  //       this.headers = [];  // Clear headers when no data is found
  //       this.pagedItems = [];
  //     }
  //   }, error => {
  //     console.log(error);
  //   });
  // }
  
  // showNoDataAlert() {
  //   Swal.fire({
  //     icon: 'warning',
  //     title: 'No Data',
  //     text: 'No data found, please configure AP settings.',
  //     confirmButtonText: 'OK'
  //   });
  // }
  
  async getAgingDropdown() {
    const payload = { type: 2 };

    return this.reportService.getAgingDropdown(payload).toPromise().then((result: any) => {
      if (result.message === 'Success') {
        this.agingGroupDropdown = result.data.Table || [];
        if (this.agingGroupDropdown.length > 0) {
          // Set the first aging group with data as the selected one
          const firstGroupWithData = this.agingGroupDropdown.find(group => group.HasData);
          const selectedAgingTypeId = firstGroupWithData ? firstGroupWithData.AgingTypeId : this.agingGroupDropdown[0].AgingTypeId;
          
          this.reportFilter.controls.AgingTypeId.setValue(selectedAgingTypeId);
          
          // Call getOverallList to populate the overall list based on the selected AgingTypeId
          this.getOverallList();
        }
      }
    }).catch(error => {
      console.error(error);
    });
  }

  getOverallList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAgingSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result.message == "Success" && result.data && result.data.Table) {
        this.reportList = result['data'].Table;
        let tableData = result.data.Table;

        if (tableData.length > 0) {
          // Set headers from the first data row
          this.headers = Object.keys(tableData[0]).filter(header => header !== 'Id');
          // Format the data rows
          this.pagedItems = tableData.map(row => ({
            ...row,
            'Balance (Company Currency)': Number(row['Balance (Company Currency)']).toFixed(this.entityFraction)
          }));
          this.setPage(1);
        } else {
          const selectedGroupName = this.agingGroupDropdown.find(group => group.AgingTypeId === this.reportFilter.controls.AgingTypeId.value)?.AgingGroupName;
          this.showNoDataAlert(selectedGroupName);
          this.headers = [];  // Clear headers when no data is found
          this.pagedItems = [];
        }
      } else {
        const selectedGroupName = this.agingGroupDropdown.find(group => group.AgingTypeId === this.reportFilter.controls.AgingTypeId.value)?.AgingGroupName;
        this.showNoDataAlert(selectedGroupName);
        this.headers = [];  // Clear headers when no data is found
        this.pagedItems = [];
      }
    }, error => {
      console.log(error);
    });
  }

  showNoDataAlert(agingGroupName?: string) {
    Swal.fire({
      icon: 'warning',
      title: 'No Data',
      text: agingGroupName ? `No data found for ${agingGroupName}, please configure Aging Configuration settings.` : 'No data found, please configure AP settings.',
      confirmButtonText: 'OK'
    });
  }


  getInvoiceWiseList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAgingSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result.message == "Success" && result.data && result.data.Table) {
        this.reportList = result['data'].Table;
        let tableData = result.data.Table;

        if (tableData.length > 0) {
          this.headers = Object.keys(tableData[0]).filter(header => header !== 'CustomerID');

          // Extract 'Balance (Company Currency)' field and format it
          this.pagedItems = tableData.map(row => ({
            ...row,
            'Invoice Amount': Number(row['Invoice Amount']).toFixed(this.entityFraction),
            'Balance (Invoice Currency)': Number(row['Balance (Invoice Currency)']).toFixed(this.entityFraction),
            'Balance (Company Currency)': Number(row['Balance (Company Currency)']).toFixed(this.entityFraction)
          }));
          this.setPage(1);
        } else {
          this.pagedItems = [];
        }
      } console.error();
    });
  }

  //Dynamic CustomerWise List
  getCustomerWiseList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getAgingSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result.message == "Success" && result.data && result.data.Table) {
        this.reportList = result['data'].Table;
        let tableData = result.data.Table;

        if (tableData.length > 0) {
          // Set headers from the first data row
          this.headers = Object.keys(tableData[0]).filter(header => header !== 'CustomerID');

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
      } console.error();
    });
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

  //Dynamic Grand Total Calculation Methods Customer Wise
  calculateHeadersCustomerwise(): string[] {
    let excludedColumns: string[] = ['CustomerID']; // Define columns to be excluded

    if (this.pagedItems.length > 0) {
      return Object.keys(this.pagedItems[0])
        .filter(key => !excludedColumns.includes(key));
    }

    return [];
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  customerTotals(header: string): any {
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

  calculateCustomerTotals(header: string): any {
    const total = this.customerTotals(header);
    return this.isNumeric(total) ? total : '';
  }




  //Dynamic Header Invoice Wise
  calculateHeadersInvoicewise(): string[] {
    let excludedColumns: string[] = ['CustomerID']; // Define columns to be excluded
    if (this.pagedItems.length > 0) {
      // var list = Object.keys(this.pagedItems[0])
      // .filter(key => !excludedColumns.includes(key));
      return Object.keys(this.pagedItems[0])
        .filter(key => !excludedColumns.includes(key));
    }

    return [];
  }

  isDate(value: any): boolean {
    return !isNaN(Date.parse(value));
  }


  


  InvoiceTotals(header: string): any {
    console.log('Header value:', header); // Log the header value
    const specifiedFields = [
      "Balance (Invoice Currency)",
      "Balance (Company Currency)",
      "Invoice Amount",
      "Age (Days)",
    ];

    //Check if the header is one of the specified fields
    if (!specifiedFields.includes(header)) {
      return ''; // Return empty for non-specified fields
    }
    // const isNumeric = this.pagedItems.some(item => !isNaN(parseFloat(item[header])));

    // // If none of the fields are numeric, return an empty string
    // if (!isNumeric) {
    //   return '';
    // }


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


  async search() {

    if (this.type == 'overall') {
      await this.getOverallList();
    }
    else if (this.type == 'customerwise') {
      await this.getCustomerWiseList();
    } else {
      await this.getInvoiceWiseList();
    }
  }

  clear() {
    this.startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd");
    this.endDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd");
    if (this.type == 'overall') {
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        CustomerId: 0,
        AgingTypeId: 1,
        Type: 0,
        SubTypeId: 0,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    } else if (this.type == 'customerwise') {
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        CustomerId: 0,
        AgingTypeId: 1,
        Type: 1,
        SubTypeId: this.subtype,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    } else {
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        CustomerId: 0,
        AgingTypeId: 1,
        Type: 2,
        SubTypeId: this.subtypecustomerId,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      });
    }
    this.officeList = [];
    this.reportFilter.controls.Peroid.setValue('month');
    this.getAgingDropdown();
    if (this.type == 'overall') {
      this.getOverallList();
    }
    else if (this.type == 'customerwise') {
      this.getCustomerWiseList();
    } else {
      this.getInvoiceWiseList();
    }
  }

  export() {
    if (this.type == "overall") {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'overall');
    }
    else if (this.type == "customerwise") {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'customerwise');
    }
    else {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'customerinvoicewise');
    }
  }

  async downloadAsExcel(
    reportList: any[],
    startDate: string,
    endDate: string,
    reportType: 'overall' | 'customerwise' | 'customerinvoicewise'
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
    this.totals = [];


    switch (reportType) {
      case 'overall':
        titleHeader = 'Receivable Aging Summary - Overall';
        excludeKeys = ['Id'];
        columnsToColor = ['Sub Category', 'Balance (Company Currency)'],
          columnsToAlignLeft = ['Sub Category'];
        columnsToAlignRight = ['Balance (Company Currency)'];
        break;
      case 'customerwise':
        titleHeader = 'Receivable Aging Summary - Customer Wise';
        excludeKeys = ['CustomerID', 'InvoiceDate'];
        columnsToColor = ['Customer', 'Credit Amount', 'Balance (Company Currency)', 'Balance (Invoice Currency)']
        columnsToAlignLeft = ['Customer'];
        columnsToAlignRight = ['Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice Currency)', 'Balance (Company Currency)'];
        break;
      case 'customerinvoicewise':
        titleHeader = 'Receivable Aging Summary - Invoice Wise';
        excludeKeys = ['CustomerID'];
        columnsToColor = [ 'Balance (Invoice Currency)', 'Balance (Company Currency)']
        columnsToAlignLeft = ['Invoice #', 'Transaction Type'];
        columnsToAlignRight = ['Invoice Amount', 'Balance (Invoice Currency)', 'Balance (Company Currency)'];
        break;
      default:
        titleHeader = 'Receivable Aging Summary';
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

    const dateRow = worksheet.addRow(['', '', '', `FROM ${this.datePipe.transform(this.startDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))} - TO ${this.datePipe.transform(this.endDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`, '', '', '']);
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
    let totalBalanceCompanyCurrency = 0;
    let totaInvoiceCurrency = 0;
    let totalBalanceInvoiceCustomerWise = 0;
    let totalBalanceCustomerWise = 0;
    let totalBalanceCompanyCustomerWise = 0;
    let totalinvoiceamount = 0;
    let agingSlab =0;

    reportList.forEach((data) => {
      let filteredData: { [key: string]: any } = {};
      const defaultValue = 0;

      switch (reportType) {
        case 'customerinvoicewise':

        if (!this.totals) {
          this.totals = {};
        }

          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});


          filteredData['Balance (Invoice Currency)'] = `${data['Balance (Invoice Currency)'] !== null ? parseFloat(data['Balance (Invoice Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          //filteredData['Aging Slab'] = `${data['Aging Slab'] !== null ? parseFloat(data['Aging Slab']).toFixed(this.entityFraction) : defaultValue.toFixed()}`;

          // Accumulate totals

          totaInvoiceCurrency += parseFloat(data['Balance (Invoice Currency)']) || 0;
          totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
          //agingSlab += parseFloat(data['Aging Slab']) || 0;

          if (!this.headers) {
            this.headers = [];
          }

          // Add dynamic headers if the value is a number and update totals
          Object.keys(filteredData).forEach(key => {
            if (!isNaN(filteredData[key]) && key !== 'Id' && key !== 'Sub Category' && key !== 'Customer' && key !== 'Branch' && key !== 'Sales Person') {
              if (!this.headers.includes(key)) {
                this.headers.push(key);
              }
              // Update totals for each numeric column
              if (!this.totals[key]) {
                this.totals[key] = 0;
              }
              this.totals[key] += parseFloat(filteredData[key]) || 0;
            }
          });

          break;

        // case 'overall':
        //     filteredData = Object.keys(data)
        //         .filter((key) => !excludeKeys.includes(key))
        //         .reduce((obj, key) => {
        //             obj[key] = data[key];
        //             return obj;
        //         }, {});

        //     filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
        //     // Accumulate totals
        //     totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
        //     break;

        case 'overall':
          // Initialize totals object if it doesn't exist
          if (!this.totals) {
            this.totals = {};
          }

          // Process and filter the data
          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});

          // Format and update Balance (Company Currency)
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;

          // Accumulate totals
          totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;

          // Initialize the headers array if it doesn't exist
          if (!this.headers) {
            this.headers = [];
          }

          // Add dynamic headers if the value is a number and update totals
          Object.keys(filteredData).forEach(key => {
            if (!isNaN(filteredData[key]) && key !== 'Id' && key !== 'Sub Category') {
              if (!this.headers.includes(key)) {
                this.headers.push(key);
              }
              // Update totals for each numeric column
              if (!this.totals[key]) {
                this.totals[key] = 0;
              }
              this.totals[key] += parseFloat(filteredData[key]) || 0;
            }
          });

          break;
        case 'customerwise':
          if (!this.totals) {
            this.totals = {};
          }

          filteredData = Object.keys(data)
            .filter((key) => !excludeKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key] !== null ? data[key] : defaultValue;
              return obj;
            }, {});

          filteredData['Credit Amount'] = `${data['Credit Amount'] !== null ? parseFloat(data['Credit Amount']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Invoice Currency)'] = `${data['Balance (Invoice Currency)'] !== null ? parseFloat(data['Balance (Invoice Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
          // Accumulate totals
          totalCreditAmount += parseFloat(data['Credit Amount']) || 0;
          totalBalanceInvoiceCustomerWise += parseFloat(data['Balance (Invoice Currency)']) || 0;
          totalBalanceCustomerWise += parseFloat(data['Balance (Company Currency)']) || 0;
          totalBalanceCompanyCustomerWise += parseFloat(data['Balance (Invoice Currency))']) || 0;


          if (!this.headers) {
            this.headers = [];
          }

          // Add dynamic headers if the value is a number and update totals
          Object.keys(filteredData).forEach(key => {
            if (!isNaN(filteredData[key]) && key !== 'Id' && key !== 'Sub Category' && key !== 'Customer' && key !== 'Branch' && key !== 'Sales Person') {
              if (!this.headers.includes(key)) {
                this.headers.push(key);
              }
              // Update totals for each numeric column
              if (!this.totals[key]) {
                this.totals[key] = 0;
              }
              this.totals[key] += parseFloat(filteredData[key]) || 0;
            }
          });

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




    const footerData = ['Grand Total']; // Initialize footerData within the function
    console.log('Report Type:', reportType);
    console.log('Headers:', this.headers);
    console.log('Totals:', this.totals);
    console.log('Entity Fraction:', this.entityFraction);

    if (reportType === 'overall') {
      this.headers.forEach((header, index) => {
        if (index === 0) {
          // Skip the first column which already has 'Grand Total'
          return;
        }
        console.log('Processing header:', header);
        if (header in this.totals) {
          const total = this.totals[header];
          console.log(`Total for ${header}:`, total);
          if (total != null && !isNaN(total)) {
            // Apply decimal formatting only to 'Balance (Company Currency)'
            if (header === 'Balance (Company Currency)') {
              footerData.push(total.toFixed(this.entityFraction));
            } else {
              footerData.push(total.toFixed(0)); // No decimals for other columns
            }
          } else {
            footerData.push('');
          }
        } else {
          footerData.push('');
        }
      });



    }  else if (reportType === 'customerwise') {
      this.headers.forEach((header, index) => {
        if (index === 0) {
          // Skip the first column which already has 'Grand Total'
          return;
        }
        console.log('Processing header:', header);
        if (header in this.totals) {
          const total = this.totals[header];
          console.log(`Total for ${header}:`, total);
          if (total != null && !isNaN(total)) {
            // Apply decimal formatting only to 'Balance (Company Currency)' and 'Balance (Invoice Currency)'
            if (header === 'Balance (Company Currency)' || header === 'Balance (Invoice Currency)' || header === 'Credit Amount') {
              footerData.push(total.toFixed(this.entityFraction));
            } else {
              footerData.push(total.toFixed(0)); // No decimals for other columns
            }
          } else {
            footerData.push('');
          }
        } else {
          footerData.push('');
        }
      });
    } else if (reportType === 'customerinvoicewise') {
      this.headers.forEach((header, index) => {
        if (index === 0) {
          // Skip the first column which already has 'Grand Total'
          return;
        }
        console.log('Processing header:', header);
        if (header in this.totals) {
          const total = this.totals[header];
          console.log(`Total for ${header}:`, total);
          if (total != null && !isNaN(total)) {
            if (header === 'Balance (Company Currency)' || header === 'Balance (Invoice Currency)' || header === 'Invoice Amount')  {
              footerData.push(total.toFixed(this.entityFraction));
            } else {
              footerData.push(total.toFixed(0)); // No decimals for other columns
            }
          } else {
            footerData.push('');
          }
        } else {
          footerData.push('');
        }
      });
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
    // const applyFooterStyles = (footerData, worksheet, colNumberCondition) => {
    //   const footerRow = worksheet.addRow(footerData);
    //   footerRow.eachCell((cell, colNumber) => {
    //     cell.font = { bold: true };
    //     cell.alignment = { horizontal: colNumberCondition(colNumber) ? 'left' : 'right' };
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: 'FFFF99' }, // Example color, change as needed
    //     };
    //   });
    // };


    // const type = 'customerinvoicewise' || 'overall' || 'customerwise';

    // // const footerData = []; // Your footer data here
    // // const worksheet = {}; // Your worksheet object here

    // switch (type) {
    //   case 'overall':
    //     applyFooterStyles(footerData, worksheet, colNumber => colNumber >= 3);
    //     break;

    //   case 'customerinvoicewise':
    //     applyFooterStyles(footerData, worksheet, colNumber => colNumber <= 4);
    //     break;

    //   case 'customerwise':
    //     applyFooterStyles(footerData, worksheet, colNumber => colNumber <= 3);
    //     break;

    // }


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
    saveAs(blob, `ReceivableAgingSummary-${reportType}.xlsx`);
  }


}
