import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'src/app/pagination.service';
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import 'select2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-voucher-view',
  templateUrl: './payment-voucher-view.component.html',
  styleUrls: ['./payment-voucher-view.component.css']
})
export class PaymentVoucherViewComponent implements OnInit {
paymentList = [];
// * pagination start
pager: any = {};// pager object  
pagedItems: any[];// paged items
// * pagination end

// * Dropdown
entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
// minDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
validTillMinDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
  filterForm: any;
  divisionList: any[];
  officeList: any[];
  bankList: any;
  vendorList: any;
  vendorUniqueList = [];
  vendorBranch: any[];
  currencyList: any;
  paymentModeList: any;
  paymentVoucherFor = [
    {
      id: 0,
      name: 'All'
    }, {
      id: 1,
      name: 'Bill'
    }, {
      id: 2,
      name: 'Cash'
    }
  ];
  statusList: any[];

  constructor(
    private ps : PaginationService,
    private paymentService: PaymentVoucherService,
    private fb: FormBuilder,
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    // $('.my-select').select2();
    this.getPaymentList()
    this.createFilterForm();
    this.getDivisionList();
    this.getOfficeList();
    this.getBankList();
    this.getVendorList();
    this.getCurrency();
    this.getModeOfPayment();
    this.getStatusDropDownList();
    
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 501,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/transactions/payment/payment-details']);
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

  editPayment(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 501,
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
              this.router.navigate(['/views/transactions/payment/payment-details', { voucherId: id }])
            }
            
          }
          else {
            this.router.navigate(['/views/transactions/payment/payment-details', { voucherId: id }])
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

  getPaymentList(){
    this.paymentService.getList({}).subscribe((result: any)=>{
      if(result.message == "Success"){
        this.paymentList = result.data.Table;
        this.setPage(1)
        // console.log('payment voucher result', result);
      }
    });
  }

  filterFormReset(){
    this.filterForm.reset();
  }

  createFilterForm(){
    this.filterForm = this.fb.group({
        DivisionId: [''],
        OfficeId: [''],
        PaymentVoucherNumber: [''],
        PaymentVoucherFor: [0],
        VendorName: [''],
        VendorBranch: [''],
        AmountPaid: [''],
        CurrencyName: [''],
        PaidfromId: [''],
        ModeofPaymentId: [''],
        ReferenceNo: [''],
        StartDate :[''],
        EndDate :[''],
        Status: ['']
    })
  }

  paymentFilter(){
    let payload = this.filterForm.value;
    // 'dd-MM-y'
    let PaymentVoucherDate = this.datePipe.transform(payload.PaymentVoucherDate, this.entityDateFormat);
    payload.PaymentVoucherDate = PaymentVoucherDate;
    this.paymentService.getFilterData(payload).subscribe((result: any)=>{
      if(result.message == "Success"){
        this.paymentList = result.data.Table;
        // console.log('paymentFilter result', result);
        this.setPage(1);
      }
    });
  }

  clearFilter() {
    // this.filterFormReset()
    this.createFilterForm();
    this.paymentFilter()
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.paymentList.length, page);

    if(this.paymentList.length == 0){
      this.pagedItems = [];
    }
    
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get current page of items
    this.pagedItems = this.paymentList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList(filter?: string) {
    
    this.paymentService.getDivision({}).subscribe((result: any)=>{
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

// getOffice(DivisionId){
//   const payload = {DivisionId}
//   this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any)=>{
//     this.officeList = [];
//     this.filterForm.controls['OfficeId'].setValue('')
//     if(result.message == 'Success'){
//       if(result.data && result.data.Table.length > 0) {
//         this.officeList.push(...result.data.Table);
//       }
//     }
//   }, error => { 
    
//   });
// }

getOfficeList(filter?: string) {
  this.paymentService.getOffice({}).subscribe((result: any)=>{
    this.officeList = [];
    if (result.data.Office.length > 0) {
     // this.officeList = result.data.Table;
      this.officeList = result.data.Office.filter(x => x.Active == true);
    }
  }, error => { });
}

getBankList(){
  let payload = {
    BankID : 0,
    BankName : '',
    AccountNo : '',
    CurrencyName: '',
    IFSCCode : '',
    SwiftCode : null,
    StatusID : null,
  }
  this.paymentService.getBankAccountList(payload).subscribe((result: any) => {
    if(result.message == "Success"){
      // console.log(result['data'].Table)
      this.bankList = result['data'].Table;
    }
  });
}


getStatusDropDownList(filter?: string) {
  this.commonDataService.getStatusDropDownList({}).subscribe((result: any)=>{
      this.statusList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.statusList = result.data.Table.filter(x => x.StatusName != 'Auto')
      }
  }, error => { });
} 


getVendorList() {
  this.paymentService.getVendorList({}).subscribe((result: any) => {
    if (result.message == "Success") {
      if (result["data"].Table.length) {
        this.vendorList = result["data"].Table;
        const uniqueVendor = this.removeDuplicatesVendorId(result["data"].Table, 'VendorID');
        this.vendorUniqueList = uniqueVendor;
        // console.log('vendorList', this.vendorList);
      }
    }
  },(error: HttpErrorResponse) => {
      Swal.fire(error.message, 'error');
  });
}
  
    // remove the vendor duplicates
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

getVendorBranch(vendorId){
  this.filterForm.controls['VendorBranch'].setValue('')
  const vendorDetails =  this.vendorList.find((vendor) => vendor.VendorID == vendorId);
  this.vendorBranch  = [...this.vendorList.filter( vendor => { return vendor.BranchCode === vendorDetails.BranchCode })];
}

getCurrency(){
  const payload = { "currencyId": 0, "countryId": 0 };
  this.paymentService.getCurrencyLists(payload).subscribe((result: any) => {
    if (result.message == "Success") {
      this.currencyList = result['data'];
      // console.log('currency list', this.currencyList);
    }
  });
}

getModeOfPayment(){
  this.paymentService.getModeOfPayment({}).subscribe((result: any) => {
    if (result.message == "Success") {
      this.paymentModeList = result['data'].Table;
      // console.log('currency list', this.paymentModeList);
    }
  })
}

// paymentEvent(event: any) {
//   this.filterForm.controls['EndDate'].setValue('');
//   this.validTillMinDate = this.datePipe.transform(new Date(event), this.entityDateFormat);
// }

copyPaste(id: number) {
  const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 501,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/transactions/payment/payment-details', { copy_id: id, isCopy: true  }]);
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

}
