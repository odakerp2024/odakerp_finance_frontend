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
  selector: 'app-internal-order',
  templateUrl: './internal-order.component.html',
  styleUrls: ['./internal-order.component.css']
})
export class InternalOrderComponent implements OnInit {

  internalFilter: FormGroup;
  internalOderList: any = [];
  pager: any = {};// pager object  
  pagedItems: any = [];// paged items
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  statusList: any[];
  maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private ps: PaginationService,
    private commonDataService: CommonService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createInternalForm();
    this.getInternalOrderList();
    this.getStatusList();
  }

  CreateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 534,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.router.navigate(['/views/internal-info/internal-info-view']);
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

  createInternalForm() {
    this.internalFilter = this.fb.group({
      Id: [0],
      InternalNumber: [''],
      InternalDescription: [''],
      InternalDate: [''],
      StatusId: [0],
      StartDate:[''],
      EndDate:['']
    })
  }

  getStatusList() {
    let service = `${this.globals.APIURL}/InternalOrder/GetInternalOrderDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.statusList = result.data.Table.filter(x => x.StatusName != 'Auto');
      }
    }, error => {
      console.error(error);
    });
  }

  getInternalOrderList() {
    let service = `${this.globals.APIURL}/InternalOrder/GetInternalOrderList`;
    this.dataService.post(service, this.internalFilter.value).subscribe((result: any) => {
      this.internalOderList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.internalOderList = result.data.Table;
        this.setPage(1);
      }
    }, error => {
      console.error(error);
    });
  }

  setPage(page: number) {
    if(this.internalOderList.length){
      if (page < 1 || page > this.pager.totalPages) {
        return;
    }

   // get pager object from service
    this.pager = this.ps.getPager(this.internalOderList.length, page);
   // get current page of items
    this.pagedItems = this.internalOderList.slice(this.pager.startIndex, this.pager.endIndex + 1); 
    } else {
    this.pagedItems = []; 
    }
  }

  internalInfo() {
    this.router.navigate(['/views/internal-info/internal-info-view']);
  }

  editOrder(id: number, isCopy?: Boolean) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 534,
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
              this.router.navigate(['/views/internal-info/internal-info-view', { id: id, isUpdate: true, isCopy: isCopy }]);
            }
          }
          else {
            this.router.navigate(['/views/internal-info/internal-info-view', { id: id, isUpdate: true, isCopy: isCopy }]);
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
