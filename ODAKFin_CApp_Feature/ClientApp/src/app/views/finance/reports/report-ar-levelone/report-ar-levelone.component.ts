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
  selector: 'app-report-ar-levelone',
  templateUrl: './report-ar-levelone.component.html',
  styleUrls: ['./report-ar-levelone.component.css']
})
export class ReportArLeveloneComponent implements OnInit {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  customerList: any[];
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
  totalcustomer : number = 0;
  totalinvoice  : number = 0;
  totalbalance  : number = 0;
  totalcreditamount  : number = 0;
  totalbalanceicy    : number = 0;
  totalnetbalance    : number = 0;
  totalbalanceccy    : number = 0;
  totalinvoicewiseamount : number = 0;
  totalinvoicewisebalance : number = 0;
  totalinvoicewiseccy : number = 0;
  subtype       : number;
  subtypecustomerId : number;
  

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
        Type:[0],
        SubTypeId: [0],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        CustomerId : [0],
        Peroid: [''],
      });
    } else if( this.type == 'customerwise'){
      this.reportFilter = this.fb.group({
        DivisionId: [0],
        OfficeId: [0],
        CustomerId: [0], 
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

  getOverallList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;

    this.reportService.getBalanceSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.totalcustomer = this.calculateTotalCustomers(this.reportList);
        this.totalinvoice = this.calculateTotalInvoices(this.reportList);
        this.totalbalance = this.calculateTotalBalance(this.reportList);
      } else {
        this.pager = {};
        this.pagedItems = [];
        this.totalcustomer = 0;
        this.totalinvoice = 0;
        this.totalbalance = 0;
      }
    })
  }

  getCustomerWiseList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.getBalanceSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.totalcreditamount = this.calculateTotalCreditAmount(this.reportList);
        this.totalbalanceicy = this.calculateTotalInvoiceCurrency(this.reportList);
        this.totalnetbalance = this.calculateTotalNetBalance(this.reportList);
        this.totalbalanceccy = this.calculateTotalCompanyCurrency(this.reportList);
      } else {
        this.pager = {};
        this.pagedItems = [];
       this.totalcreditamount  = 0;
       this.totalbalanceicy   = 0;
       this.totalnetbalance    = 0;
       this.totalbalanceccy    = 0;
      }
    })
  }

  
  getInvoiceWiseList() {
    this.startDate = this.reportFilter.controls.FromDate.value;
    this.endDate = this.reportFilter.controls.ToDate.value;
    this.reportService.getBalanceSummaryList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.pagedItems =[];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1);
        this.totalinvoicewiseamount = this.calculateTotalInvoicewiseCurrency(this.reportList);
        this.totalinvoicewisebalance = this.calculateTotalInvoicewiseNetBalance(this.reportList);
        this.totalinvoicewiseccy = this.calculateTotalInvoicewiseCompanyCurrency(this.reportList);
      
      } else {
        this.pager = {};
        this.pagedItems = [];
        this.totalinvoicewiseamount  = 0;
        this.totalinvoicewisebalance = 0;
        this.totalinvoicewiseccy  = 0;
      }
    })
  }

  async getallcategorylist(){
    await this.showCustomerWise(0);
  }

  async getallcustomerlist(){
   await this.showCustomerInvoiceWise(0);
  }

  calculateTotalCustomers(items: any[]): number {
    return items.reduce((sum, item) => sum + item['No of Customer (Open)'], 0);
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
  calculateTotalInvoicewiseCurrency(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Invoice Amount'], 0);
  }

  calculateTotalInvoicewiseNetBalance(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Balance (Invoice currency)'], 0);
  }

  calculateTotalInvoicewiseCompanyCurrency(items: any[]): number {
    return items.reduce((sum, item) => sum + item['Balance (Company Currency)'], 0);
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
      await this.getInvoiceWiseList();
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
      this.getInvoiceWiseList();
    }
  }

  export(){
    if(this.type =="overall")
    {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'overall');
    }
   else if(this.type =="customerwise")
    {
      this.downloadAsExcel(this.reportList, this.startDate, this.endDate, 'customerwise');
    }
  else
    {
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
  
    // Define column color and alignment mappings for each report type
    let columnsToColor: string[] = [];
    let columnsToAlignLeft: string[] = [];
    let columnsToAlignRight: string[] = [];
  
    switch (reportType) {
      case 'overall':
        titleHeader = 'Receivable Balance Summary - Overall';
        excludeKeys = ['Id'];
        columnsToColor = ['Sub Category', 'Balance (Company Currency)'];
        columnsToAlignLeft = ['Sub Category'];
        columnsToAlignRight = ['Balance (Company Currency)'];
        break;
      case 'customerwise':
        titleHeader = 'Receivable Balance Summary - Customer Wise';
        excludeKeys = ['CustomerID', 'InvoiceDate'];
        columnsToColor = ['Customer', 'Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice currency)', 'Balance (Company Currency)'];
        columnsToAlignLeft = ['Customer'];
        columnsToAlignRight = ['Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice currency)', 'Balance (Company Currency)'];
        break;
      case 'customerinvoicewise':
        titleHeader = 'Receivable Balance Summary - Invoice Wise';
        excludeKeys = [];
        columnsToColor = ['Invoice #', 'Transaction Type', 'Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)'];
        columnsToAlignLeft = ['Invoice #', 'Transaction Type'];
        columnsToAlignRight = ['Invoice Amount', 'Balance (Invoice currency)', 'Balance (Company Currency)'];
        break;
      default:
        titleHeader = 'Receivable Balance Summary';
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
  
    const dateRow = worksheet.addRow(['', '', '', `FROM ${this.datePipe.transform(this.startDate, this.entityDateFormat)} - TO ${this.datePipe.transform(this.endDate, this.entityDateFormat)}`, '', '', '']);
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
    let totalcustomer = 0;
    let totalInvoice = 0;
    let totalInvoiceAmount = 0;
    let totaInvoiceCurrency = 0;
  
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
          filteredData['Balance (Invoice currency)'] = `${data['Balance (Invoice currency)'] !== null ? parseFloat(data['Balance (Invoice currency)']) : defaultValue.toFixed(this.entityFraction)}`;
          filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']): defaultValue.toFixed(this.entityFraction)}`;
  
          // Accumulate totals
          totalInvoiceAmount += parseFloat(data['Invoice Amount']) || 0;
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
          filteredData['No of Customer (Open)'] = `${data['No of Customer (Open)'] !== null ? parseFloat(data['No of Customer (Open)']) : defaultValue}`;
          filteredData['No of Invoices (Open)'] = `${data['No of Invoices (Open)'] !== null ? parseFloat(data['No of Invoices (Open)']) : defaultValue}`;
          // Accumulate totals
          totalcustomer += parseFloat(data['No of Customer (Open)']) || 0;
          totalInvoice += parseFloat(data['No of Invoices (Open)']) || 0;
          totalBalanceCompanyCurrency += parseFloat(data['Balance (Company Currency)']) || 0;
          break;
  
        case 'customerwise':
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
      else if(header[i] === 'No of Customer (Open)'){
        footerData.push(totalcustomer.toFixed(defaultValue));
      } else if(header[i] === 'No of Invoices (Open)'){
        footerData.push(totalInvoice.toFixed(defaultValue));
      }else if (header[i] === 'Balance (Invoice Currency)') {
        footerData.push(totalBalanceInvoiceCurrency.toFixed(this.entityFraction));
      } else if (header[i] === 'Net Balance (Invoice currency)') {
        footerData.push(totalNetBalanceInvoiceCurrency.toFixed(this.entityFraction));
      } else if (header[i] === 'Balance (Company Currency)') {
        footerData.push(totalBalanceCompanyCurrency.toFixed(this.entityFraction));
      } else if(header[i] === 'Invoice Amount'){
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
    saveAs(blob, `ReceivableBalanceSummary-${reportType}.xlsx`);
  }
  
  
  
}
