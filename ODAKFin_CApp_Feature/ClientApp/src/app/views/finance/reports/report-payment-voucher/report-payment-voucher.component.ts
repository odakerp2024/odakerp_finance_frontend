import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ReportDashboardService } from 'src/app/services/financeModule/report-dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-payment-voucher',
  templateUrl: './report-payment-voucher.component.html',
  styleUrls: ['./report-payment-voucher.component.css']
})

export class ReportPaymentVoucherComponent implements OnInit  {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  customerList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  paymentModeList: any[];
  TypeList = [
    {TypeId: 1, TypeName: 'Invoice' },
    {TypeId: 2, TypeName: 'On Account' },
    {TypeId: 3, TypeName: 'Security Deposit' }
  ];
  bankList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  currentDate = new Date();
  constructor(
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private dataService: DataService,
    private reportService: ReportDashboardService,
    public excelService : ExcelService
  ) { }

  ngOnInit(): void {
    // this.getCustomerList();
    this.createReportForm();
    this.getDivisionList();
    this.getVoucherList();
  }

  createReportForm() {
    this.reportFilter = this.fb.group({
      Division: [0],
      Office: [0],
      Vendor: [0],
      StartDate: [new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 2)],
      EndDate: [this.datePipe.transform(this.currentDate, "yyyy-MM-dd")],
      Amount: [''],
      Type: [0],
      PaymentMode: [0],
      Paidfrom: [0]
    });
    this.getReceiptReportList();
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

  getVoucherList() {
    return new Promise((resolve, rejects) => {
     

      let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
      this.dataService.post(service, { CustomerId: 0 }).subscribe((result: any) => {
        this.customerList = result.data.Table2;
        this.paymentModeList = result.data.Table4;
       
        resolve(true)
      }, error => {
        console.error(error);
        resolve(true)
      });
    })
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
          this.bankList = result.data.Table;
        }
      }, error => {
        console.error(error);
      });
    }
  }

  getReceiptReportList() {
    this.reportService.GetReceiptVoucherReportList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
        this.setPage(1)
      } else {
        this.pager ={};
        this.pagedItems =[];
      }
    })
  }


  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;

    this.pager = this.ps.getPager(this.reportList.length, page);
    this.pagedItems = this.reportList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  
  clear() {
    this.reportFilter.reset({
      Division: 0,
      Office: 0,
      Vendor: 0,
      StartDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 2),
      EndDate: this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
      Amount: '',
      Type: 0,
      PaymentMode: 0,
      Paidfrom: 0
    });
  }

  downloadAsCSV() {
    this.excelService.exportToCSV(this.reportList,'Report-ReceiptVoucher')
    if(this.reportForExcelList.length > 0){
      this.excelService.exportToCSV(this.reportForExcelList,'Report-ReceiptVoucher')
    } else {
      Swal.fire('no record found');
    }
  }
  
  downloadAsExcel() {
    this.excelService.exportToCSV(this.reportList,'Report-ReceiptVoucher')
    if(this.reportForExcelList.length > 0){
      this.excelService.exportAsExcelFile(this.reportForExcelList,'Report-ReceiptVoucher')
    } else {
      Swal.fire('no record found');
    }
  }


}
