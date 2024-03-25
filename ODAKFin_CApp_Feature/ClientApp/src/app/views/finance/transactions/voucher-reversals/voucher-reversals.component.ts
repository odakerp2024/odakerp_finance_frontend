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
  selector: 'app-voucher-reversals',
  templateUrl: './voucher-reversals.component.html',
  styleUrls: ['./voucher-reversals.component.css'],
  providers: [DatePipe]
})
export class VoucherReversalsComponent implements OnInit {

  voucherFilter: FormGroup;
  VoucherList: any = [];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  dropDownListStatus: any = [];
  dropDownListVoucherList: any = [];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private ps: PaginationService,
    private commonDataService: CommonService,
    private dataService: DataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createVoucherReversalFilter();
    this.getAllVoucherList();
    this.getDropDownValue();
  }

  createVoucherReversalFilter() {
    this.voucherFilter = this.fb.group({
      Id: [0],
      ReversalReference: [null],
     // DateOfReversal: [''],
      VoucherTypeId: [0],
      VoucherNumber: [''],
      VoucherId: [0],
      Status: [0],
      Party: [0] ,
      StartDate :[''],
      EndDate :['']
    });
  }

  getAllVoucherList() {
    var service = `${this.globals.APIURL}/VoucherReversals/GetVoucherReversalsList`;
    this.dataService.post(service, this.voucherFilter.value).subscribe((result: any) => {
      this.VoucherList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.VoucherList = result.data.Table;
        this.setPage(1)
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) { return; }
    this.pager = this.ps.getPager(this.VoucherList.length, page);
    this.pagedItems = this.VoucherList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDropDownValue() {
    var service = `${this.globals.APIURL}/VoucherReversals/GetVoucherReversalsDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.dropDownListStatus = [];
      this.dropDownListVoucherList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.dropDownListStatus = result.data.Table;
        this.dropDownListVoucherList = result.data.Table1;
      }
    }, error => { });
  }

  createVOucher(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 509,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/voucher-info/voucher-reversals-info']);
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

  voucherInfoRoute(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 509,
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
              this.router.navigate(['/views/voucher-info/voucher-reversals-info', { id: id, isUpdate: true }]);
            }            
          }
          else {
            this.router.navigate(['/views/voucher-info/voucher-reversals-info', { id: id, isUpdate: true }]);
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

  // voucherEvent(event: any) {
  //   debugger
  //   this.voucherFilter.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  // }

  isDesc: boolean = false;
  column: string = '';
  sort(property) {
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      let direction = this.isDesc ? 1 : -1;

      this.pagedItems.sort(function (a, b) {
          if (a[property] < b[property]) {
              return -1 * direction;
          }
          else if (a[property] > b[property]) {
              return 1 * direction;
          }
          else {
              return 0;
          }
      });
  };

}
