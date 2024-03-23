import { Table } from 'src/app/model/financeModule/credit';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { PaymentRequestService } from 'src/app/services/financeModule/payment-request.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-request-view',
  templateUrl: './payment-request-view.component.html',
  styleUrls: ['./payment-request-view.component.css']
})
export class PaymentRequestViewComponent implements OnInit {

  divisionDropdown = [];

  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any = [];// paged items

  // * pagination end
  
  receiptList: any = [];
  divisionList = [];
  officeList = [];
  vendarList = [];
  paymentRequestFilter: FormGroup;
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  userId = localStorage.getItem('UserID')
  openRequestDetails = []
  requestStatus: any;
  

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private paymentRequestService: PaymentRequestService,
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
  ) { }

  ngOnInit(): void {
   // console.log(this.entityDateFormat)
    this.getDivisionList();
    this.getOfficeList();
    this.CustomerList();
    this.createReceiptFilterForm();
    this.getPaymentRequestList();
    this.getAllDropdown();
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 525,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/transactions/payment-request/payment-request-details']);
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

  EditInfo(id){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 525,
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
              this.router.navigate(['/views/transactions/payment-request/payment-request-details', { paymentRequestId: id}]);
            }
            
          }
          else {
            this.router.navigate(['/views/transactions/payment-request/payment-request-details', { paymentRequestId: id}]);
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
    this.paymentRequestFilter = this.fb.group({
        "PRNumber": [''],
        "RequestDateAndTime": [''],
        DivisionId: [0],
        OfficeId: [0],
        "VendorId": [0],
        "Requester": [''],
        "PaymentDate": [''],
        "Status": [0],
        "StartDate": [''], //EndDate for completion date 
        "EndDate": [''],
        "CompletionStartDate": [],
        "CompletionEndDate": []
    })
  }

  filterPaymentRequest(){
    this.getPaymentRequestList()
  }

  clearFilterPayment(){
    this.createReceiptFilterForm();
    this.getPaymentRequestList()
  }

  getPaymentRequestList(){
    const payload =  this.paymentRequestFilter.value
    this.paymentRequestService.GetPaymentRequestList(payload).subscribe((result) => {
      if(result.message == "Success" && result.data.Table.length > 0){
        this.receiptList = result.data.Table;
        this.openRequestDetails = result.data.Table1 ? result.data.Table1 : [] ;
        this.setPage(1);
      }  else{
        this.receiptList = []
        this.pagedItems = [];
      }
    })
  }

 

  setPage(page: number) {
      if(this.receiptList.length){
        if (page < 1 || page > this.pager.totalPages) {
          return;
        }
      
       // get pager object from service
       this.pager = this.ps.getPager(this.receiptList.length, page);

       // get current page of items
       this.pagedItems = this.receiptList.slice(this.pager.startIndex, this.pager.endIndex + 1);
      
      } else {
        this.pagedItems = [];
      }
  }


  getOfficeList(filter?: string) {
  
    this.paymentRequestService.getOffice({}).subscribe((result: any)=>{
      this.officeList = [];
      if (result.data.Office.length > 0) {
       // this.officeList = result.data.Table;
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getDivisionList(filter?: string) {
  
    this.paymentRequestService.getDivision({}).subscribe((result: any)=>{
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  // getDivision() {
  //   return new Promise((resolve, rejects) => {
  //     this.commonDataService.getDivision({}).subscribe((result: any) => {
  //       this.divisionList = [];
  //       if (result.data.Table.length > 0) {
  //         this.divisionList = result.data.Table;
  //         resolve(true);
  //       }
  //     }, error => { 
  //       rejects(true)
  //     });;
  //   });
  // }

  // getOfficeList(DivisionId) {
  //   return new Promise((resolve, rejects) => {
  //     const payload = { DivisionId }
  //     this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any) => {
  //       this.officeList = [];

  //       // this.FinancialForm.controls.OfficeId.setValue('');
  //       if (result.message == 'Success') {
  //         if (result.data && result.data.Table.length > 0) {
  //           this.officeList.push(...result.data.Table);
  //           resolve(true)
  //         }
  //       }
  //     }, error => {
  //       rejects();
  //     });
  //   })
  // }

  CustomerList() {
  this.commonDataService.getVendorListDropdown({}).subscribe((result: any) => {
    if (result.message == 'Success') {
      if (result["data"].Table.length > 0) {
        // const vendorData = result['data'].Table.filter(t => t.VendorCode != this.Vendor_Code);
        const vendorData = result['data'].Table;
        this.vendarList = [];
        this.vendarList = [...vendorData];
      }
    }
  })
}

getAllDropdown(){
  this.paymentRequestService.getDropdown({}).subscribe((result) => {
    if (result.message == 'Success') {
      const resultData = result.data;
      this.requestStatus = resultData.Table.length ? resultData.Table : [];
      // this.paymentModeList = resultData.Table1.length ? resultData.Table1 : [];
      // this.priorityRequest = resultData.Table2.length ? resultData.Table2 : [];
      // this.requesterTypeList = resultData.Table3.length ? resultData.Table3 : [];
    }
  })
}
  

}