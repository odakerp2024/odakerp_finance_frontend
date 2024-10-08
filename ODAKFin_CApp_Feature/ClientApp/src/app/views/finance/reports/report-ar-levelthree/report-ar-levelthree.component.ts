

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
  totalamounticy  : number = 0;
  totalamountccy : number = 0;

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
    //await this.createReportForm();
    this.reportFilter.controls.Type.setValue(1);
    this.reportFilter.controls.SubTypeId.setValue(this.subtype);
    await this.getCustomerWiseList();
  }

    async showCustomerInvoiceWise(subtypecustomerId:number) {
    this.subtypecustomerId = subtypecustomerId;
    this.pagedItems = []; 
    this.type = 'customerinvoicewise';
    //await this.createReportForm();
    this.reportFilter.controls.SubTypeId.setValue(this.subtypecustomerId);
    this.reportFilter.controls.Type.setValue(2);
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

  getInvoiceWiseList() {
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
        this. totalamounticy  = 0;
        this. totalamountccy = 0;
      }
    })
  }

  clickTransactionNumber(RedirectUrl: string) {
    debugger
    
    let url: string;

    url = RedirectUrl;
       
    if (url) {
        window.open(url, '_blank');
    }
  }

  calculateTotalDays(reportList: any[]): void {
    // Initialize totals to 0
    this.totalcustomer = 0;
    this.totalinvoice = 0;
    this.totalbalance = 0;
    this.totalcreditamount = 0;
    this.totalbalanceinvoice = 0;
    this.totalnetbalance = 0;
    this.totalbalanceamountcc = 0;
    this.totalamounticy = 0;
    this.totalamountccy = 0;

    if (this.type == "overall") {
        reportList.forEach(item => {
            this.totalcustomer += item['No of Customer'];
            this.totalinvoice += item['No of Invoices'];
            this.totalbalance += item['Balance (Company Currency)'];
        });
    } else if (this.type == "customerwise") {
        reportList.forEach(item => {
            this.totalcreditamount += item['Credit Amount'];
            this.totalbalanceinvoice += item['Balance (Invoice Currency)'];
            this.totalnetbalance += item['Net Balance (Invoice Currency)'];
            this.totalbalanceamountcc += item['Balance (Company Currency)'];
        });
    } else {
        reportList.forEach(item => {
            this.totalamounticy += item['Balance (Invoice Currency)'];
            this.totalamountccy += item['Balance (Company Currency)'];
        });
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
  
      let columnsToColor: string[] = [];
      let columnsToAlignLeft: string[] = [];
      let columnsToAlignRight: string[] = [];
  
      switch (reportType) {
          case 'overall':
              titleHeader = 'Receivable Sales Summary - Overall';
              excludeKeys = ['SalesId'];
              columnsToColor = ['Sales Person', 'Balance (Company Currency)'];
              columnsToAlignLeft = ['Sub Category'];
              columnsToAlignRight = ['Balance (Company Currency)'];
              break;
          case 'customerwise':
              titleHeader = 'Receivable Sales Summary - Customer Wise';
              excludeKeys = ['CustomerID', 'InvoiceDate', 'SalesId'];
              columnsToColor = ['Customer', 'Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice Currency)', 'Balance (Company Currency)'];
              columnsToAlignLeft = ['Customer'];
              columnsToAlignRight = ['Credit Amount', 'Balance (Invoice Currency)', 'Net Balance (Invoice Currency)', 'Balance (Company Currency)'];
              break;
          case 'customerinvoicewise':
              titleHeader = 'Receivable Sales Summary - Invoice Wise';
              excludeKeys = ['RedirectUrl','BLType'];
              columnsToColor = ['Invoice #', 'Transaction Type', 'Invoice Amount', 'Balance (Invoice Currency)', 'Balance (Company Currency)'];
              columnsToAlignLeft = ['Invoice #', 'Transaction Type'];
              columnsToAlignRight = ['Invoice Amount', 'Balance (Invoice Currency)', 'Balance (Company Currency)'];
              break;
          default:
              titleHeader = 'Receivable Sales Summary';
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
      let totalcustomer = 0;
      let totalInvoice = 0;
      let totaInvoiceCurrency = 0;
      let totalBalanceInvoiceCustomerWise = 0;
      let totalNetBalanceInvoiceCustomerWise = 0;
      let totalBalanceCompanyCustomerWise = 0;
  
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
  
                  filteredData['Balance (Invoice Currency)'] = `${data['Balance (Invoice Currency)'] !== null ? parseFloat(data['Balance (Invoice Currency)']) : defaultValue.toFixed(this.entityFraction)}`;
                  filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']): defaultValue.toFixed(this.entityFraction)}`;
  
                  // Accumulate totals
                  totaInvoiceCurrency += parseFloat(data['Balance (Invoice Currency)']) || 0;
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
                  filteredData['No of Customer'] = `${data['No of Customer'] !== null ? parseFloat(data['No of Customer']) : defaultValue}`;
                  filteredData['No of Invoices'] = `${data['No of Invoices'] !== null ? parseFloat(data['No of Invoices']) : defaultValue}`;
                  // Accumulate totals
                  totalcustomer += parseFloat(data['No of Customer']) || 0;
                  totalInvoice += parseFloat(data['No of Invoices']) || 0;
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
                  filteredData['Balance (Invoice Currency)'] = `${data['Balance (Invoice Currency)'] !== null ? parseFloat(data['Balance (Invoice Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                  filteredData['Net Balance (Invoice Currency)'] = `${data['Net Balance (Invoice Currency)'] !== null ? parseFloat(data['Net Balance (Invoice Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                  filteredData['Balance (Company Currency)'] = `${data['Balance (Company Currency)'] !== null ? parseFloat(data['Balance (Company Currency)']).toFixed(this.entityFraction) : defaultValue.toFixed(this.entityFraction)}`;
                  
                  // Accumulate totals
                  totalCreditAmount += parseFloat(data['Credit Amount']) || 0;
                  totalBalanceInvoiceCustomerWise += parseFloat(data['Balance (Invoice Currency)']) || 0;
                  totalNetBalanceInvoiceCustomerWise += parseFloat(data['Net Balance (Invoice Currency)']) || 0;
                  totalBalanceCompanyCustomerWise += parseFloat(data['Balance (Company Currency)']) || 0;
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
          if (header[i] == 'No of Customer') {
            footerData.push(totalcustomer.toFixed(0));
          } else if (header[i] == 'No of Invoices') {
            footerData.push(totalInvoice.toFixed(0));
          } else if (header[i] == 'Balance (Company Currency)') {
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
          } else if (header[i] == 'Net Balance (Invoice Currency)') {
            footerData.push(totalNetBalanceInvoiceCustomerWise.toFixed(this.entityFraction));
          } else if (header[i] == 'Balance (Company Currency)') {
            footerData.push(totalBalanceCompanyCustomerWise.toFixed(this.entityFraction));
          } else {
            footerData.push('');
          }
        }
      } else if (reportType === 'customerinvoicewise') {
        for (let i = 1; i < header.length; i++) { // Start loop from 1 to skip the first column
            if (header[i] == 'Balance (Invoice Currency)') {
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

      // const footerRow = worksheet.addRow(footerData);
      // footerRow.eachCell((cell, colNumber) => {
      //     cell.font = { bold: true };
      //     cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'right' }; // Align first column to left
      //     cell.fill = {
      //         type: 'pattern',
      //         pattern: 'solid',
      //         fgColor: { argb: 'FFFF99' }, // Example color, change as needed
      //     };
      // });
  
      const type = 'overall';
      if (type !== 'overall') {
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
      } else if (type === 'overall') {
        const footerRow = worksheet.addRow(footerData);
        footerRow.eachCell((cell, colNumber) => {
          cell.font = { bold: true };
          // Align columns 1, 2, and 3 to left, others to right
          cell.alignment = { horizontal: colNumber <= 3 ? 'left' : 'right' }; 
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF99' }, // Example color, change as needed
          };
        });
      }
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
      saveAs(blob, `ReceivableSalesSummary-${reportType}.xlsx`);
  }
  
    
  }
  

