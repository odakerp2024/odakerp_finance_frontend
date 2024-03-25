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
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  providers: [DatePipe]
})
export class PurchaseComponent implements OnInit {

  PurchaseFilter: FormGroup;
  purchaseList: any = [];
  vendorList: any = [];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  statusList: any = [];
  pager: any = {};// pager object  
  pagedItems: any = [];// paged items
  //maxDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private vendorService: VendorService,
    private commonDataService: CommonService,
    private ps: PaginationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createPurchaseForm();
    this.getPurchaseList();
    this.getVendorList();
    this.getDropDownList();
  }

  createPurchaseForm() {
    this.PurchaseFilter = this.fb.group({
      Id: [0],
      PurchaseNumber: [''],
      PurchaseDate: [''],
      VendorId: [0],
      StatusId: [0],
      StartDate:[''],
      EndDate:['']
    })
  }

  purchaseInfo() {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 532,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/purchase-info/purchase-info-view']);
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

  getPurchaseList() {
    let service = `${this.globals.APIURL}/PurchaseOrder/GetPurchaseOrderList`;
    this.dataService.post(service, this.PurchaseFilter.value).subscribe((result: any) => {
      this.purchaseList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.purchaseList = result.data.Table;
        this.setPage(1);
      }
    }, error => {
      console.error(error);
    });
  }

  getVendorList() {
    const payload = {
      "ID": 0,
      "VendorBranchID": "",
      "VendorCode": "",
      "VendorName": "",
      "Category": "",
      "BranchCode": "",
      "CityName": "",
      "GSTCategory": "",
      "GSTNumber": "",
      "IsActive": "1",
      "VendorStatus": "",
      "OnBoard": "CONFIRMED",
      "IsBranchActive": "1"
    }
    this.vendorService.getVendorFilter(payload).subscribe(data => {
      this.vendorList = [];
      if (data["data"].Table.length > 0) {
        this.vendorList = data["data"].Table;
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
      });
  }

  getDropDownList() {
    let service = `${this.globals.APIURL}/PurchaseOrder/GetPurchaseOrderDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.statusList = result.data.Table.filter(x => x.StatusName != 'Auto');
      }
    }, error => {
      console.error(error);
    });
  }

  setPage(page: number) {
    this.pager = this.ps.getPager(this.purchaseList.length, page);
    this.pagedItems = this.purchaseList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  editPurchase(id: number, isCopy?: Boolean) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 532,
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
              this.router.navigate(['/views/purchase-info/purchase-info-view', { id: id, isUpdate: true, isCopy: isCopy }]);
            }            
          }
          else {
            this.router.navigate(['/views/purchase-info/purchase-info-view', { id: id, isUpdate: true, isCopy: isCopy }]);
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
