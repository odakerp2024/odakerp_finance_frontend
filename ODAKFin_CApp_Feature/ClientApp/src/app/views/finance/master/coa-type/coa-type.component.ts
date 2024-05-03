import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { GridSort } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coa-type',
  templateUrl: './coa-type.component.html',
  styleUrls: ['./coa-type.component.css']
})
export class CoaTypeComponent implements OnInit {

  coaList: any;
  coaTypeFilter: FormGroup;
  coaGroupList: any;

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  pager: any = {};
  pagedItems: any;
  pagesort: any = new GridSort().sort;

  constructor(
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    public ps: PaginationService,
    private CommonService: CommonService
  ) {
    this.createFilterForm();
  }

  checkAddPermission(route, id) {
    this.getPermissionListForCreate(576, route, id);
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
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2 && route != 'edit') {
            this.router.navigate(['views/coa-type-info/cao-type-info-view']);
          } else if (data[0].Update_Opt == 2 || data[0].Read_Opt == 2 && route == 'edit') {
            this.router.navigate(['views/coa-type-info/cao-type-info-view', { isCreate: false, id: id }]);
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


  async ngOnInit(): Promise<void> {
    await this.getCoaGroup();
    this.getCOA();
    // this.createFilterForm();
  }

  createFilterForm() {
    this.coaTypeFilter = this.fb.group({
      Id: [0],
      COAGroup: [''],
      COAType: [''],
      ShortName: ['']
    })
  }

  coaInfoRoute(routePath: string) {
    if (routePath == 'add') this.router.navigate(['views/coa-type-info/cao-type-info-view']);
  }

  getCOA(filter?: string) {
    if (filter) {
      var payload = this.coaTypeFilter.value;
      var service: any = `${this.globals.APIURL}/COAType/GetCOATypeFilter`;
    }
    else { var service: any = `${this.globals.APIURL}/COAType/GetCOATypeList`; var payload: any = {} }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.coaList = [];
      if (result.data.Table.length > 0) {
        for (let data of result.data.Table) {
          if (data.COAGroup) {
            if (this.coaGroupList) {
              data.COAGroup = this.coaGroupList.find(x => x.ID == data.COAGroup);
            }
          }
        }
        this.coaList = result.data.Table;
        this.setPage(1);
      }
      else {
        this.pagedItems = [];
      }
    }, error => {
      console.error(error);
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.coaList.length, page);

    // get current page of items
    this.pagedItems = [...this.coaList.slice(this.pager.startIndex, this.pager.endIndex + 1)];
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  editCOA(id: number) {
    this.router.navigate(['views/coa-type-info/cao-type-info-view', { isCreate: false, id: id }]);
  }

  async getCoaGroup() {
    return new Promise(async (resolve, reject) => {
      let service = `${this.globals.APIURL}/COAType/GetCOAGroupList`;
      await this.dataService.post(service, {}).subscribe((result: any) => {
        this.coaGroupList = [];
        if (result.data.Table.length > 0) {
          this.coaGroupList = result.data.Table;
          resolve(this.coaGroupList);
        }
      }, error => {
        console.error(error);
      });
    });
  }


}
