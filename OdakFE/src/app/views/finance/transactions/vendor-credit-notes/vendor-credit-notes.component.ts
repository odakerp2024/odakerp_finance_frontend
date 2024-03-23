import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-credit-notes',
  templateUrl: './vendor-credit-notes.component.html',
  styleUrls: ['./vendor-credit-notes.component.css'],
  providers: [DatePipe]
  
})
export class VendorCreditNotesComponent implements OnInit {

  vendorFilter: FormGroup;
  vendorList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  vendorMasterList: any = [];
  statusList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
 // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");


  constructor(
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private dataService: DataService,
    private ps: PaginationService,
    private commonDataService: CommonService,
    private vendorservice: VendorService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.CreateVendorFilter();
    this.getVendorList();
    this.VendorList();
    this.getDropDownList();
  }

  CreateVendorFilter() {
    this.vendorFilter = this.fb.group({
      DivisionId: [0],
      OfficeId: [0],
      VCNVoucherNumber: [''],
      //VCNVoucherDate: [''],
      VendorId: [0],
      InvoiceAmount: [''],
      CurrencyId: [0],
      StatusId: [0],    
      StartDate :[''],
      EndDate :['']
    });
  }

  getVendorList() {
    var service = `${this.globals.APIURL}/VendorCreditNotes/GetVendorCreditNotesList`;
    this.dataService.post(service, this.vendorFilter.value).subscribe((result: any) => {
      this.vendorList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.vendorList = result.data.Table;
        this.setPage(1)
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.ps.getPager(this.vendorList.length, page);
    this.pagedItems = this.vendorList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  VendorList() {
    this.vendorservice.getVendorList({
      ID: 0, VendorBranchID: '', VendorCode: '', VendorName: '', Category: '', BranchCode: '', CityName: '', GSTCategory: '',
      GSTNumber: '', IsActive: '', VendorStatus: '', OnBoard: '', IsBranchActive: ''
    }).subscribe(data => {
      this.vendorMasterList = [];
      if (data['data'].Table.length > 0) this.vendorMasterList = data["data"].Table.filter(x => x.OnboradName == 'CONFIRMED' && x.Status == 'Active');
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
      });
  }

  createnew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 513,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/vendor-info-notes/vendor-info-view']);
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

  vendorInfoRoute(id?: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 513,
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
              this.router.navigate(['/views/vendor-info-notes/vendor-info-view', { id: id, isUpdate: true }]);
            }
            
          }
          else {
            this.router.navigate(['/views/vendor-info-notes/vendor-info-view', { id: id, isUpdate: true }]);
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

  getDropDownList() {
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == "Success" && result.data.Table1.length > 0) {
        this.statusList = result.data.Table1;
      }
    }, error => { });
  }
  // vendorEvent(event: any) {
  //   this.vendorFilter.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  // }

}
