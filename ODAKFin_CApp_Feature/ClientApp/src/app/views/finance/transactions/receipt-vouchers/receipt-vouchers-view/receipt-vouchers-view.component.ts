import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { BankFilter } from 'src/app/model/bankaccount';
import { PaginationService } from 'src/app/pagination.service';
import { BankService } from 'src/app/services/bank.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipt-vouchers-view',
  templateUrl: './receipt-vouchers-view.component.html',
  styleUrls: ['./receipt-vouchers-view.component.css'],
  providers: [DatePipe]
})
export class ReceiptVouchersViewComponent implements OnInit {
  divisionDropdown = [];

  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any = [];// paged items
  filterForm: FormGroup;
  // * pagination end
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  searchData: BankFilter = new BankFilter();
 // maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
//  minDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
 validTillMinDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
 

  receiptList: any = [];
  divisionList: any = [];
  officeList: any = [];
  currencyList: any = [];
  voucherForList: any = [];
  voucherTypeList: any = [];
  voucherCustomerList: any = [];
  voucherCustomerCodeList: any = [];
  voucherReceiptList: any = [];
  bankListDetails: any[];
  isShowBranch: boolean = false;
  statusList: any[];

  constructor(
    private ps: PaginationService,
    private globals: Globals,
    private dataService: DataService,
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private router: Router,
    private ms: BankService,
    private datePipe: DatePipe
    
  ) { }

  ngOnInit(): void {
    this.createReceiptFilterForm();
    this.getReceiptList();
    this.getDivisionList();
    this.getOfficeList();
    this.getCurrency();
    this.getVoucherList();
    this.getBankInfo();
    this.getStatusDropDownList();
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 499,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/transactions/receipt/receipt-details']);
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {

        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  createReceiptFilterForm() {
    this.filterForm = this.fb.group({
      Id: [0],
      DivisionId: [""],
      OfficeId: [""],
      ReceiptVoucherTypeId: [""],
      ReceiptVoucherFor: [0],
      ReceiptVoucherNumber: [""],
     // ReceiptVoucherDate: [""],
      CustomerId: [""],
      CustomerBranch: [""],
      AmountReceived: [""],
      AmountTypeId: [""],
      DepositedBankId: [""],
      ModeOfPaymentId: [""],
      ReferenceNumber: [""],
      StartDate:[""],
      EndDate:[""],
      Status: [""]
    })
  }

  getReceiptList() {
    var service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.receiptList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.receiptList = result.data.Table;
        this.setPage(1)
      }
    }, error => { });
  }


  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.receiptList.length, page);

    // get current page of items
    this.pagedItems = this.receiptList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getStatusDropDownList(filter?: string) {
    this.commonDataService.getStatusDropDownList({}).subscribe((result: any)=>{
        this.statusList = [];
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.statusList = result.data.Table.filter(x => x.StatusName != 'Auto')
        }
    }, error => { });
  } 
  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.currencyList = [];
      if (result.length > 0) {
        this.currencyList = result;
      }
    }, error => { });
  }

  getVoucherList() {
    let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
    this.dataService.post(service, { CustomerId: 0 }).subscribe((result: any) => {
      this.voucherForList = [];
      this.voucherTypeList = [];
      this.voucherCustomerList = [];
      this.voucherReceiptList = [];
      this.voucherCustomerCodeList = [];

      if (result.data.Table.length > 0) { this.voucherForList = result.data.Table; }
      if (result.data.Table1.length > 0) { this.voucherTypeList = result.data.Table1; }
      if (result.data.Table2.length > 0) { this.voucherCustomerList = result.data.Table2; }
      if (result.data.Table3.length > 0 && this.isShowBranch) { this.voucherCustomerCodeList = result.data.Table3; }
      if (result.data.Table4.length > 0) { this.voucherReceiptList = result.data.Table4; }
    }, error => { });
  }

  editReceipt(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 499,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Read_Opt != 2) {
            if(data[0].Update_Opt != 2){
              Swal.fire('Please Contact Administrator');
            }
            else{
              this.router.navigate(['/views/transactions/receipt/receipt-details', { id: id }])
            }
            
          }
          else {
            this.router.navigate(['/views/transactions/receipt/receipt-details', { id: id }])
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });

    
  }

  getBankInfo() {
    this.ms.getbankaccountFilter(this.searchData).subscribe(Bankaccountlist => {
      this.bankListDetails = [];
      this.bankListDetails = Bankaccountlist['data'].Table.filter(x => x.StatusID == 1);
    });
  }

  selectedCustomer(event:any) {
    let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
    this.dataService.post(service, { CustomerId: event }).subscribe((result: any) => {
      this.voucherCustomerCodeList = [];
      if (result.data.Table3.length > 0) { this.voucherCustomerCodeList = result.data.Table3; }
    }, error => { });
  }


  copyPaste(id: number) {
    this.router.navigate(['/views/transactions/receipt/receipt-details', { copy_id: id, isCopy: true  }]);
  }

  // getOfficeList(id: number) {
  //   this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
  //     this.officeList = [];
  //     if (result['data'].Table.length > 0) {
  //       this.officeList = result['data'].Table;
  //     }
  //   })
  // }

  // receiptEvent(event: any) {
  //   this.filterForm.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), this.entityDateFormat);
  // }
}
