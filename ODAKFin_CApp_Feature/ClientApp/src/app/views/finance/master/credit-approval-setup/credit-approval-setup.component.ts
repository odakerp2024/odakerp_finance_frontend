import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-approval-setup',
  templateUrl: './credit-approval-setup.component.html',
  styleUrls: ['./credit-approval-setup.component.css']
})
export class CreditApprovalSetupComponent implements OnInit {

  creditList: any = [];
  creditFilter: FormGroup;
  divisionList: any = [];
  approvalList: any = [];
  pager: any = {};
  pagedItems: any[];// paged items

  constructor(
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    public ps: PaginationService,
    private CommonService: CommonService
  ) {

  }

  ngOnInit(): void {
    this.getDivisionList();
    this.getApprovalMethod();
    this.creditFilterForm();
    this.getCreditList();
  }

  creditFilterForm() {
    this.creditFilter = this.fb.group({
      Id: 0,
      Division: [''],
      ApprovalMethod: ['']
    });
  }

  getCreditList() {
    let service = `${this.globals.APIURL}/CreditManagement/GetCreditSetupApproval`;
    this.dataService.post(service, this.creditFilter.value).subscribe((result: any) => {
      this.creditList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.creditList = result.data.Table;
        this.setPage(1);
      }
    }, error => {
      console.error(error);
    });
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  getApprovalMethod() {
    var service = `${this.globals.APIURL}/CreditManagement/GetSetupApprovalMethods`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.approvalList = [];
      if (result.data.Table.length > 0) {
        this.approvalList = result.data.Table;
      }
    }, error => { });
  }

  creditInfoRoute(id?: Number, copyValue?: string) {

    if (copyValue) {
      this.router.navigate(['views/credit-info/credit-info-view', { id: id, isUpdate: true, isCopy: true }]);
    } else if (id) {
      this.getPermissionListForUpdate(621, id);
    } else {
      this.getPermissionListForCreate(621);
    }
    // else if (id) {
    //   this.router.navigate(['views/credit-info/credit-info-view', { id: id, isUpdate: true }]);
    // }
    // else {
    //   this.router.navigate(['views/credit-info/credit-info-view']);
    // }
  }

  creditFilterReset() {
    this.creditFilterForm();
    this.getCreditList();
  }

  setPage(page: number) {
    if (this.creditList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // get pager object from service
      this.pager = this.ps.getPager(this.creditList.length, page);
      // get current page of items
      this.pagedItems = this.creditList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }

  getPermissionListForCreate(value) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            this.router.navigate(['views/credit-info/credit-info-view']);
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForUpdate(value, id) {
    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2) {
            this.router.navigate(['views/credit-info/credit-info-view', { id: id, isUpdate: true }]);
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }
  


}
