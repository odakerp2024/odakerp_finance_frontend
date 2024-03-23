import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices-ar-view',
  templateUrl: './invoices-ar-view.component.html',
  styleUrls: ['./invoices-ar-view.component.css']
})
export class InvoicesArViewComponent implements OnInit {

  pager: any = {};// pager object  
  pagedItems: any = [];// paged items
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
 // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  invoiceList: any = [];
  filterForm: FormGroup;
  customerList: any = [];
  statusList: any = [];

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private globals: Globals,
    private router: Router,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.createFilterForm();
    this.getInvoiceList();
    this.getCustomerList();
    this.getStatus();
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
      SubfunctionID: 519,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['views/transactions/invoices_AR_view/invoices_AR_Details']);
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

  getInvoiceList() {
    var service = `${this.globals.APIURL}/OutStandingInvoiceAR/GetOutStandingInvoiceARList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.invoiceList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.invoiceList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }

  getCustomerList() {
    let payload = { "CustomerCode": "", "CustomerName": "", "Category": "", "BranchCode": "", "CityName": "", "GSTCategory": "", "GSTNumber": "", "IsActive": true, "CompanyStatus": "", "OnBoard": "CONFIRMED" }
    var service = `${this.globals.APIURL}/Customer/GetCustomerFilter`;
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.customerList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.customerList = result.data.Table;
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) { return; }
    this.pager = this.ps.getPager(this.invoiceList.length, page);
    this.pagedItems = this.invoiceList.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  editInvoice(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 519,
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
              this.router.navigate(['/views/transactions/invoices_AR_view/invoices_AR_Details', { id: id, isUpdate: true }]);
            }
            
          }
          else {
            this.router.navigate(['/views/transactions/invoices_AR_view/invoices_AR_Details', { id: id, isUpdate: true }]);
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

  // invoiceEvent(event: any) {
  //   this.filterForm.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  // }

}
