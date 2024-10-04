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
  selector: 'app-party-mapping',
  templateUrl: './party-mapping.component.html',
  styleUrls: ['./party-mapping.component.css']
})
export class PartyMappingComponent implements OnInit {


  partyFilter: FormGroup;
  partyMappingList: any;
  pager: any = {};
  pagedItems: any = [];
  pageSort: any = new GridSort().sort;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  isPartyMapping: boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    public ps: PaginationService,
    private commonDataService: CommonService
  ) { }

  ngOnInit(): void {
    this.PartyForm();
    this.getPartyList();
  }

  PartyForm() {
    this.partyFilter = this.fb.group({
      Id: [0],
      ReferenceNumber: [''],
      PartyName: [''],
      Status: ['']
    })
  }

  getPartyList(type?: string) {
    this.partyFilter.value.Status = "" ? null : this.partyFilter.value.Status;
    // this.partyFilter.value.Status = true ? '1' : '2';
    if (this.partyFilter.value.Status == "true") {
      this.partyFilter.value.Status = "1"
    }
    if (this.partyFilter.value.Status == "false") {
      this.partyFilter.value.Status = "0"
    }
    var service = `${this.globals.APIURL}/PartyMapping/GEtPartyMapping`;
    this.dataService.post(service, type == "getALL" ? { Id: 0, ReferenceNumber: '', PartyName: '', Status: null } : this.partyFilter.value).subscribe((result: any) => {
      this.partyMappingList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.partyMappingList = result.data.Table;
        this.setPage(1)
      }
    }, error => { });
  }

  setPage(page: number) {
    this.pager = this.ps.getPager(this.partyMappingList.length, page);
    this.pagedItems = this.partyMappingList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pageSort(property, this.pagedItems);
  }


  partyInfoRoute(method: string, id?: number) {


    // if (method == 'add') this.router.navigate(['views/party-mapping-info/party-mapping-info-view']);
    // else this.router.navigate(['views/party-mapping-info/party-mapping-info-view', { id: id, isUpdate: true }]);
    if (method == 'add') {
      this.getPermissionListForCreate(566);
    }
    else {
      this.getPermissionListForUpdate(566, id);
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
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            this.router.navigate(['views/party-mapping-info/party-mapping-info-view'])
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
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2) {
            this.router.navigate(['views/party-mapping-info/party-mapping-info-view', { id: id, isUpdate: true, isPartyMapping: true }]);
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
