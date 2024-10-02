import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Console } from 'console';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { PaymentBatchService } from 'src/app/services/financeModule/payment-batch.service';
import { PaymentRequestService } from 'src/app/services/financeModule/payment-request.service';

@Component({
  selector: 'app-closed-payments',
  templateUrl: './closed-payments.component.html',
  styleUrls: ['./closed-payments.component.css']
})
export class ClosedPaymentsComponent implements OnInit {

  closedPaymentForm: FormGroup;
  periodsearchForm: FormGroup
  divisionList: any[];
  officeList: any = [];
  vendorsList: any = [];
  priorityRequest: any = [];
  periodList: any[];
  isListWise: boolean = false;
  sumWithInitial = 0;
  IsListInvoiceWise = 0;
  PRresultArray = [];
  invoiceResultArray = [];
  totalOpenRequest: any;
  amount: any;
  totalCloseRequestListAmount: any;
  pager: any = {};
  pagedItems: any = [];
  PaymentBatchCloseRequestList: any = [];
  currentDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable("DateFormat");
  fromMaxDate = this.currentDate;
  toMaxDate = this.currentDate;
  Custom: boolean;
  fromDate: any;
  toDate: any;
  isChecked = false;
  selectedValue: string = 'This Week'
  constructor(
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private paymentRequestService: PaymentRequestService,
    private paymentBatchService: PaymentBatchService,
    private ps: PaginationService,
    public commonService: CommonService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.initializeDateRange()
    this.getOfficeList();
    this.getDivisionList();
    this.getVendorList();
    this.getAllDropdown();
    this.CreateForm();
    this.getPeriodList();
    this.GetPaymentBatchCloseRequestList()

  }



  initializeDateRange() {
    const currentDate = new Date();
    const firstDayOfWeek = this.getFirstDayOfWeek(currentDate);
    const lastDayOfWeek = this.getLastDayOfWeek(currentDate);
    this.fromDate = this.datePipe.transform(firstDayOfWeek, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.toDate = this.datePipe.transform(lastDayOfWeek, 'yyyy-MM-dd HH:mm:ss.SSS');
  }

  getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  getLastDayOfWeek(date: Date): Date {
    const firstDayOfWeek = this.getFirstDayOfWeek(date);
    return new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6));
  }
  

  CreateForm() {
    this.closedPaymentForm = this.fb.group({
      DivisionId: [0],
      VendorId: [0],
      OfficeId: [0],
      Amount: [],
      RequestPriority: [0],
      period:[this.selectedValue],
      fromPeriod: [this.currentDate],
      toPeriod: [this.currentDate]

    });

    this.periodsearchForm = this.fb.group({
      period:[this.selectedValue]
      // fromPeriod: [this.currentDate],
      // toPeriod: [this.currentDate]

    });
  }

  GetPaymentBatchCloseRequestList() {
    const payload = {
      FromDate: this.fromDate,
      ToDate: this.toDate,
      DivisionId: this.closedPaymentForm.value.DivisionId,
      OfficeId: this.closedPaymentForm.value.OfficeId,
      VendorId: this.closedPaymentForm.value.VendorId,
      Amount: this.closedPaymentForm.value.Amount? this.closedPaymentForm.value.Amount : 0,
      RequestPriority: this.closedPaymentForm.value.RequestPriority,
      IsListInvoiceWise: this.IsListInvoiceWise,
    };
   
    console.log(payload)

    this.paymentBatchService.GetPaymentBatchCloseRequestList(payload).subscribe((result) => {
        if (result.message == "Success") {
          const resultData = result.data;
          this.PaymentBatchCloseRequestList = []
          this.PaymentBatchCloseRequestList = resultData.closedPaymentsList;
          this.totalOpenRequest = result.data.countList[0].TotalOpenRequest;
          this.amount = result.data.countList[0].TotalAmount;
          this.totalCloseRequestListAmount = result.data.countList[0].TotalAmount;                                                                                                                                                    
          this.setPage(1);
        }

      });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.PaymentBatchCloseRequestList.length, page);

    if(this.PaymentBatchCloseRequestList.length == 0){
      this.pagedItems = [];
    }
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get current page of items
    this.pagedItems = this.PaymentBatchCloseRequestList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList() {
    this.commonDataService.getDivision({}).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList() {
    this.commonDataService.getOffice({}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getVendorList() {
    this.commonDataService.GetAllVendorDropdownList({}).subscribe((result: any) => {
      this.vendorsList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.vendorsList = result.data.Table
      }
    }, error => { });
  }

  getAllDropdown() {
    this.paymentRequestService.getDropdown({}).subscribe((result) => {
      if (result.message == 'Success') {
        const resultData = result.data;
        this.priorityRequest = resultData.Table2.length ? resultData.Table2 : [];

      }
    });
  }

  getPeriodList() {
    this.commonDataService.getPeriodList({}).subscribe((result: any) => {
      this.periodList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.periodList = result.data.Table
      }
    }, error => { });
  }


  ListInvoiceWise() {
    this.isListWise = !this.isListWise;
    if (this.isListWise) {
      this.IsListInvoiceWise = 1;
      this.isChecked = false
    } else {
      this.IsListInvoiceWise = 0;
      this.isChecked = true
    }
    this.GetPaymentBatchCloseRequestList();
  }

  search() {
    this.GetPaymentBatchCloseRequestList();
  }

  clear() {
    this.isListWise = false
    this.pager = [0]
    this.isChecked = false
    this.IsListInvoiceWise = 0;
    this.selectedValue = 'This Week'
    this.CreateForm();
    console.log(this.isChecked);
    
    this.GetPaymentBatchCloseRequestList();
  }

  getCurrentQuarter(date: Date): number {
    return Math.floor(date.getMonth() / 3) + 1;
  }

  period(period: any){
    if(period == "This Year"){
     
      const currentDate = new Date();
      this.fromDate = new Date(currentDate.getFullYear(), 0, 1); // First day of the current year
      this.toDate = new Date(currentDate.getFullYear(), 11, 31); // Last day of the current year

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.Custom = false
    } 

    else if(period == "Today"){

      this.fromDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.toDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.Custom = false
    }

    else if(period == "This Month"){

      const currentDate = new Date();
      this.fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the month
      this.toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.Custom = false
    }

    else if(period == "This Week"){

      const currentDate = new Date();
      const firstDayOfWeek = this.getFirstDayOfWeek(currentDate);
      const lastDayOfWeek = this.getLastDayOfWeek(currentDate);
      this.fromDate = this.datePipe.transform(firstDayOfWeek, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(lastDayOfWeek, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.Custom = false
    }
    else if(period == "0"){

      const currentDate = new Date();
      const firstDayOfWeek = this.getFirstDayOfWeek(currentDate);
      const lastDayOfWeek = this.getLastDayOfWeek(currentDate);
      this.fromDate = this.datePipe.transform(firstDayOfWeek, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(lastDayOfWeek, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.Custom = false
    }

    else if(period == "This Quarter"){

      const currentDate = new Date();
      const currentQuarter = this.getCurrentQuarter(currentDate);
      
      this.fromDate = new Date(currentDate.getFullYear(), currentQuarter * 3 - 3, 1); // First day of the quarter
      this.toDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 0); // Last day of the quarter

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Year To Date"){

      const currentDate = new Date();
      this.fromDate = new Date(currentDate.getFullYear(), 0, 1); // First day of the current year

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Yesterday"){
     
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
  
      this.fromDate = yesterday;
      this.toDate = yesterday;
      
      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Previous Week"){

      const currentDate = new Date();
    const lastWeekStartDate = new Date(currentDate);
    lastWeekStartDate.setDate(currentDate.getDate() - currentDate.getDay() - 6); // Subtract the current day of the week and go back 6 more days

    const lastWeekEndDate = new Date(currentDate);
    lastWeekEndDate.setDate(currentDate.getDate() - currentDate.getDay() - 1); // Subtract the current day of the week

    this.fromDate = lastWeekStartDate;
    this.toDate = lastWeekEndDate;

    this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.toDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Previous Month"){

      const currentDate = new Date();
      const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  
      this.fromDate = firstDayOfPreviousMonth;
      this.toDate = lastDayOfPreviousMonth;

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Previous Quarter"){

      const currentDate = new Date();
    const currentQuarter = this.getCurrentQuarter(currentDate);

    const firstDayOfPreviousQuarter = new Date(currentDate.getFullYear(), currentQuarter * 3 - 6, 1);
    const lastDayOfPreviousQuarter = new Date(currentDate.getFullYear(), currentQuarter * 3 - 1, 0);

    this.fromDate = firstDayOfPreviousQuarter;
    this.toDate = lastDayOfPreviousQuarter;

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Previous Year"){

      const currentDate = new Date();
      const firstDayOfPreviousYear = new Date(currentDate.getFullYear() - 1, 0, 1);
      const lastDayOfPreviousYear = new Date(currentDate.getFullYear() - 1, 11, 31);
  
      this.fromDate = firstDayOfPreviousYear;
      this.toDate = lastDayOfPreviousYear;

      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');

      this.Custom = false

    }

    else if(period == "Custom"){

      this.Custom = true
    } 

    this.GetPaymentBatchCloseRequestList();


  }


  onDateChange(data: any){

    this.fromDate = data.target.value._d

    this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss.SSS');

  }

  onDateChange1(data: any){

    this.toDate = data.target.value._d

    this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss.SSS');
    this.GetPaymentBatchCloseRequestList();
  }

  updateFromDate(data: any) {
    this.fromDate = this.datePipe.transform(data, "yyyy-MM-dd");
    // const filterData = this.closedPaymentForm.value;
    // const fromDate = filterData.fromPeriod;
    // const toDate = filterData.toPeriod;

    // if (fromDate > toDate) {
    //   this.closedPaymentForm.controls.fromPeriod.setValue(toDate)
    //   // console.log('fromDate is greater than toDate');
    // } else if (fromDate < toDate) {
    //   this.GetPaymentBatchCloseRequestList();
    //   // console.log('fromDate is less than toDate');
    // }

  }

  updateToDate(data: any){
    this.toDate = this.datePipe.transform(data, "yyyy-MM-dd");
  }
}
