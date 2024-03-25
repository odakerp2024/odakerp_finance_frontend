import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { GridSort } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent implements OnInit {


  StatusList: Array<object> = [
    { value: '1', viewValue: 'Yes' },
    { value: '0', viewValue: 'No' },
  ];

  divisionList: any;
  divisionFilter: FormGroup;
  pager: any = {};
  pagedItems: any[];// paged items
  pagesort: any = new GridSort().sort;
  isDivision: Boolean = false;;
  isEmail: Boolean = false;;

  constructor(
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    public ps: PaginationService,
    private CommonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getDivisionList();
    this.divisionForm();
  }

  divisionForm() {
    this.divisionFilter = this.fb.group({
      Id: 0,
      DivisionCode: [''],
      DivisionName: [''],
      Active: ['']
    });
  }

  divisionInfoRoute() {
    debugger
    this.getPermissionListForCreate(540, 'Division', 0);
    // if (routePAth == 'add') this.router.navigate(['views/division-info/division-info-view']);
    // else if (routePAth == 'finance') this.router.navigate(['views/finance/financemaster']);
  }

  getDivisionList(filter?: string) {
    if (filter) {
      var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionFilter`;
      var payload: any = this.divisionFilter.value
    }
    else { var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {} }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table; this.setPage(1);
      }
      else {
        this.pagedItems = [];
      }
    }, error => { });
  }

  editDivision(id: number) {
    this.getPermissionListForUpdate(540, 'Division', id); 
    // this.router.navigate(['views/division-info/division-info-view', { isCreate: false, id: id }]);
  }


  setPage(page: number) {
    if (this.divisionList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // get pager object from service
      this.pager = this.ps.getPager(this.divisionList.length, page);
      // get current page of items
      this.pagedItems = this.divisionList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  getPermissionListForCreate(value, route, id) {
    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2 && route == 'Division') {
            Swal.fire('Please Contact Administrator');
          }
          else if (data[0].Create_Opt == 2 && route == 'Division') {
            this.router.navigate(['views/division-info/division-info-view', { isCreate: false, id: id, isDivision: true }]);
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


  getPermissionListForUpdate(value, route, id) {
    // Check Permission for Division Add
    debugger
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {

      if (route == 'Division') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2 && route == 'Division') {
              this.isDivision = true;
            } else {
              this.isDivision = false;
            }
          }
        } else {
          this.isDivision = false;
        }
        this.getPermissionListForUpdate(541, 'Email', id);
      }

      if (route == 'Email') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2 && route == 'Email') {
              this.isEmail = true;
            } else {
              this.isEmail = false;
            }

            if (this.isDivision == true && this.isEmail == true) {
              this.router.navigate(['views/division-info/division-info-view', { isCreate: false, id: id, isDivision: true, isEmail: true }]);
            } else if (this.isDivision == true) {
              this.router.navigate(['views/division-info/division-info-view', { isCreate: false, id: id, isDivision: true, isEmail: false }]);
            }
            else if (this.isEmail == true) {
              this.router.navigate(['views/division-info/division-info-view', { isCreate: false, id: id, isDivision: false, isEmail: true }]);
            } else {
              Swal.fire('Please Contact Administrator');
            }
          }
        } else {
          if (this.isDivision == true) {
            this.router.navigate(['views/division-info/division-info-view', { isCreate: false, id: id, isDivision: true, isEmail: false }]);
          }
        }

      }
      else {
        this.isEmail = false;
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

}
