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
    this.getAgingDropdown();
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

  async showCustomerWise(subTypeId: number) {
    this.subtype = subTypeId;
    this.pagedItems = [];
    this.type = 'customerwise';
    await this.createReportForm();
    await this.getCustomerWiseList();
  }

  async showCustomerInvoiceWise(subtypecustomerId: number) {
    this.subtypecustomerId = subtypecustomerId;
    this.pagedItems = [];
    this.type = 'customerinvoicewise';
    await this.createReportForm();
    await this.getInvoiceWiseList();
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
        Type: [0],
        CustomerId: [0],
        SubTypeId: [0],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        Peroid: [''],
        AgingTypeId: [1]
      });
    } else if (this.type == 'customerwise') {
      this.reportFilter = this.fb.group({
        DivisionId: [0],
        OfficeId: [0],
        CustomerId: [0],
        Type: [1],
        AgingTypeId: [1],
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
        AgingTypeId: [1],
        SubTypeId: [this.subtypecustomerId],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        Peroid: [''],
      });
    }
    this.getAgingDropdown();
    this.reportFilter.controls.Peroid.setValue('month');
    this.onOptionChange('month');
    this.getAgingDropdown();
    if (this.type == 'overall') {
      await this.getOverallList();
    }
    else if (this.type == 'customerwise') {
      await this.getCustomerWiseList();
    }
    else {
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

  getAgingDropdown() {  
    const payload = {
      type : 2,
    }
    
      this.reportService.getAgingDropdown(payload).subscribe((result: any) => {
        if (result.message == 'Success') {
          this.reportFilter.controls.AgingTypeId.setValue('');
          this.agingGroupDropdown = [];
          if (result["data"].Table.length > 0) {
            this.agingGroupDropdown = result.data.Table;
  
          }
          this.reportFilter.controls.AgingTypeId.setValue(this.agingGroupDropdown[0].AgingTypeId);
         
        }
      }), error => {
        console.error(error);
      }
    }


  //Dynamic Overall List 
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
          // Clear the row data but keep the headers
          this.pagedItems = [];
        }
      } else {
        console.error('Error fetching data');
      }
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
          this.headers = Object.keys(tableData[0]); 

          // Extract 'Balance (Company Currency)' field and format it
          this.pagedItems = tableData.map(row => ({
            ...row,
            'Invoice Amount': Number(row['Invoice Amount']).toFixed(this.entityFraction),
            'Balance (Invoice currency)': Number(row['Balance (Invoice currency)']).toFixed(this.entityFraction),
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
            columnsToColor = ['Customer', 'Credit Amount', 'Balance (Company Currency)', 'Balance (Invoice currency)']
            columnsToAlignLeft = ['Customer'];
            columnsToAlignRight = ['Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice Currency)', 'Balance (Company Currency)'];
            break;
        case 'customerinvoicewise':
            titleHeader = 'Receivable Aging Summary - Invoice Wise';
            excludeKeys = [];
            columnsToColor = ['Invoice #', 'Transaction Type', 'Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)']
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
    let totalBalanceCompanyCurrency = 0;
    let totaInvoiceCurrency = 0;
    let totalBalanceInvoiceCustomerWise = 0;
    let totalBalanceCustomerWise = 0;
    let totalBalanceCompanyCustomerWise = 0;
    let totalinvoiceamount = 0;

    reportList.forEach((data) => {
        let filteredData: { [key: string]: any } = {};
        const defaultValue = 0;

        switch (reportType) {
            case 'customerinvoicewise':
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
                totalinvoiceamount += parseFloat(data['Invoice Amount']) || 0;
                totaInvoiceCurrency += parseFloat(data['Balance (Invoice currency)']) || 0;
                totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
                break;

            case 'overall':
                filteredData = Object.keys(data)
                    .filter((key) => !excludeKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = data[key];
                        return obj;
                    }, {});

                filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                // Accumulate totals
                totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
                break;

            case 'customerwise':
                filteredData = Object.keys(data)
                    .filter((key) => !excludeKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = data[key];
                        return obj;
                    }, {});

                    filteredData['Credit Amount'] = `${data['Credit Amount'] !== null ? parseFloat(data['Credit Amount']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                    filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                    filteredData['Balance (Invoice currency)'] = `${data['Balance (Invoice currency)'] !== null ? parseFloat(data['Balance (Invoice currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                // Accumulate totals
                totalCreditAmount += parseFloat(data['Credit Amount']) || 0;
                totalBalanceInvoiceCustomerWise += parseFloat(data['Balance (Invoice Currency)']) || 0;
                totalBalanceCustomerWise += parseFloat(data['Balance (Company Currency)']) || 0;
                totalBalanceCompanyCustomerWise += parseFloat(data['Balance (Invoice currency)']) || 0;
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

    if (reportType === 'overall') {
      for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
        if (header[i] == 'Balance (Company Currency)') {
          footerData.push(totalBalanceCompanyCurrency.toFixed(this.entityFraction));
        } else {
          footerData.push('');
        }
      }
    } else if (reportType === 'customerwise') {
      for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
        if (header[i] == 'Credit Amount') {
          footerData.push(totalCreditAmount.toFixed(this.entityFraction));
        } else if (header[i] == 'Balance (Invoice Currency)') {
          footerData.push(totalBalanceInvoiceCustomerWise.toFixed(this.entityFraction));
        } else if (header[i] == 'Balance (Company Currency)') {
          footerData.push(totalBalanceCustomerWise.toFixed(this.entityFraction));
        } else if (header[i] == 'Balance (Invoice currency)') {
          footerData.push(totalBalanceCompanyCustomerWise.toFixed(this.entityFraction));
        } else {
          footerData.push('');
        }
      }
    } else if (reportType === 'customerinvoicewise') {
      for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
          if (header[i] == 'Balance (Invoice currency)') {
          footerData.push(totaInvoiceCurrency.toFixed(this.entityFraction));
        } else if (header[i] == 'Balance (Company Currency)') {
          footerData.push(totalBalanceCompanyCurrency.toFixed(this.entityFraction));
        } else if (header[i] == 'Invoice Amount') {
          footerData.push(totaInvoiceCurrency.toFixed(this.entityFraction));
        } 
        else {
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
    saveAs(blob, `ReceivableAgingSummary-${reportType}.xlsx`);
}

}
