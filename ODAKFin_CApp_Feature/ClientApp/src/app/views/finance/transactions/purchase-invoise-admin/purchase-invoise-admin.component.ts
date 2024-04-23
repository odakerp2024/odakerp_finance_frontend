import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-invoise-admin',
  templateUrl: './purchase-invoise-admin.component.html',
  styleUrls: ['./purchase-invoise-admin.component.css'],
  providers: [DatePipe]
})

export class PurchaseInvoiseAdminComponent implements OnInit {

  purchaseFilter: FormGroup;
  purchaseInvoiceList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  //maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  //minDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
  validTillMinDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
  divisionList: any = [];
  officeList: any = [];
  vendorsList: any = [];
  private ngUnsubscribe = new Subject<void>();
  vendorBranch: any = [];
  currencyList: any = [];
  statusList: any = [];

  constructor(
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private commonDataService: CommonService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private vendorService: VendorService,
    private paymentService: PaymentVoucherService
  ) { }

  ngOnInit(): void {
    this.createPurchaseForm();
    this.getPurchaseInvoice();
    this.getDivisionList();
    this.getOfficeList();
    this.getVendorList();
    this.getCurrency();
    this.getStatus();
  }

  createPurchaseForm() {
    this.purchaseFilter = this.fb.group({
      Id: [0],
      PINumber: [''],
      //PIDate: [''],
      VendorType: [''],
      VendorId: [0],
      VendorBranch: [0],
      InvoiceAmount: [null],
      InvoiceCurrency: [0],
      Division: [0],
      Office: [0],
      StatusId: [0],
      StartDate :[''],
      EndDate :['']
    });
  }

  getPurchaseInvoice() {
    var service = `${this.globals.APIURL}/PurchaseInvoice/GetPurchaseInvoiceList`;
    this.dataService.post(service, this.purchaseFilter.value).subscribe((result: any) => {
      this.purchaseInvoiceList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.purchaseInvoiceList = result.data.Table;
        this.setPage(1);
      }
    }, error => { console.error(error) });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;
    this.pager = this.ps.getPager(this.purchaseInvoiceList.length, page);
    this.pagedItems = this.purchaseInvoiceList.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  // getOfficeList(id: number) {
  //   this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
  //     this.officeList = [];
  //     if (result['data'].Table.length > 0) {
  //       this.officeList = result['data'].Table;
  //     }
  //   })
  // }

  getVendorList() {
    return new Promise((resolve, reject) => {
      this.paymentService.getVendorList({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          if (result["data"].Table.length) {
            this.vendorsList = result["data"].Table.filter(x => x.OnboradName == 'CONFIRMED' && x.Status == 'Active');
            resolve(true);
          }
        }
      }, (error: HttpErrorResponse) => {
        reject();
      });
    })
  }

  getVendorBranchList(event: any) {
    this.vendorBranch = [];
    this.vendorBranch = this.vendorsList.filter(x => x.VendorID == event);
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

  createPurchase(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 511,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/purchase-admin-info/purchase-invoice-info']);
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

  purchaseInfoRoute(id?: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 511,
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
              this.router.navigate(['/views/purchase-admin-info/purchase-invoice-info', { id: id, isUpdate: true }]);
            }
            
          }
          else {
            this.router.navigate(['/views/purchase-admin-info/purchase-invoice-info', { id: id, isUpdate: true }]);
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

  getStatus() {
    var service = `${this.globals.APIURL}/PurchaseInvoice/GetPurchaseInvoiceDropDownList`; var payload: any = {Id: 0}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.statusList = [];
      if (result.data.Table.length > 0) {
        this.statusList = result.data.Table;
      }
    }, error => { });
  }

  // purchaseEvent(event: any) {
  //   this.purchaseFilter.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), this.entityDateFormat);
  // }

}
