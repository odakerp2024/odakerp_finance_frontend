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
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices-ap-view',
  templateUrl: './invoices-ap-view.component.html',
  styleUrls: ['./invoices-ap-view.component.css']
})
export class InvoicesApViewComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
 // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  filterForm: FormGroup;
  invoiceAPList = [];
  statusList: any = [];
  vendorsList: any = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private globals: Globals,
    private router: Router,
    private paymentService: PaymentVoucherService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.createFilterForm();
    this.getAPListInfo();
    this.getStatus();
    this.getVendorList();
  }

  createFilterForm() {
    this.filterForm = this.fb.group({
      ReferenceNo: [''],
      //OutStandingReferenceDate: [''],
      PartyId: [0],
      StatusId: [0],
      TotalDebitAmount: [''],
      StartDate :[''],
      EndDate :['']
    })
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 521,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_Details']);
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

  getAPListInfo() {
    var service = `${this.globals.APIURL}/OutStandingInvoiceAP/GetOutStandingInvoiceAPList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.invoiceAPList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.invoiceAPList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) { return; }
    this.pager = this.ps.getPager(this.invoiceAPList.length, page);
    this.pagedItems = this.invoiceAPList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getStatus() {
    var service = `${this.globals.APIURL}/Common/GetStatusDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.statusList = result.data.Table;
      }
    }, error => { });
  }

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

  editInvoice(id) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 521,
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
              this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_Details', { id: id, isUpdate: true }]);
            }
            
          }
          else {
            this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_Details', { id: id, isUpdate: true }]);
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

  // invoicevent(event: any) {
  //   this.filterForm.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  // }

}
