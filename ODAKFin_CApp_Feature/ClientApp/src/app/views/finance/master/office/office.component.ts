import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { Globals } from 'src/app/globals';
import { GridSort } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { CommonDataService } from 'src/app/services/common-data.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {

  officeList: any = [];
  officeFilter: FormGroup;
  stateList: any;
  StatusList: Array<object> = [
    { value: 'true', viewValue: 'Yes' },
    { value: 'false', viewValue: 'No' },
  ];
  allStates: any;
  pager: any = {};
  pagedItems: any;
  pagesort: any = new GridSort().sort;

  isOfficeDetail: boolean = false;
  isEmailids: boolean = false;
  isDocuments: boolean = false;
  isReadDocument: boolean = false;


  constructor(
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    public ps: PaginationService,
    private CommonService: CommonService
  ) {
    this.createOfficeForm();
    this.getStateList();
    this.getOrganization();
  }

  async ngOnInit(): Promise<void> {
    await this.getAllState();
    this.getOfficeList();
  }

  createOfficeForm() {
    this.officeFilter = this.fb.group({
      Id: [0],
      officeCode: [''],
      OfficeName: [''],
      ShortName: [''],
      StateId: [0],
      GSTNo: [''],
      Active: ['']
    })
  }

  officeInfoRoute(routePAth: string) {

    this.getPermissionListForCreate(544, 'Office Details');

    // if (routePAth == 'add') this.router.navigate(['views/office-info/office-info-view']);
    // else if (routePAth == 'finance') this.router.navigate(['views/finance/financemaster']);
  }

  getOfficeList(filter?: string) {
    if (filter) {
      var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeFilter`;
      var payload: any = this.officeFilter.value;
      payload.Active = payload.Active === 'true' ? 1 :payload.Active === 'false'? 0:'';

    }
    else {
      var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
      var payload: any = {};

      this.officeFilter.reset({
        Id: 0,
        officeCode: '',
        OfficeName: '',
        ShortName: '',
        StateId: 0,
        GSTNo: '',
        Active: ''
      });
    }


    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.officeList = [];
        let finalResult = [];
        filter ? finalResult = result.data.Table : finalResult = result.data.Office;
        finalResult.map((office) => {
          const stateData = this.allStates.find((state) => state.ID == office.StateId);
          if (stateData) {
            office.StateId = stateData.StateName;
          } else {
            office.StateId = '';
          }
        });
        this.officeList = finalResult;
        this.setPage(1);
        // this.officeList = filter ? result.data.Table : result.data.Office ;
      }
    }, error => { });
  }

  getStateInfo() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.officeList = [];
        this.officeList = result.data.Table;
      }
    }, error => { });
  }

  editOffice(id: number) {

    this.getPermissionListForUpdate(544, 'Office Details',id);
  }

  async getStateList() {
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCities`; // need to ask OP
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.stateList = result;
      this.setPage(1);
    }, error => { });
  }


  getAllState() {
    return new Promise((resolve, reject) => {
      var service = `${this.globals.SaApi}/SystemAdminApi/GetState`;
      this.dataService.post(service, {}).subscribe((result: any) => {
        this.allStates = result;
        resolve(true);
      }, error => { });
    });
  }

  setPage(page: number) {
    if (this.officeList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // get pager object from service
      this.pager = this.ps.getPager(this.officeList.length, page);
      // get current page of items
      this.pagedItems = this.officeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }
  getOrganization() {
    let service = `${this.globals.APIURL}/Organization/GetOrganizationEntityId`;
    this.dataService.post(service, { "OrgId": 1 }).subscribe((result: any) => {

    }, error => {
      console.error(error);
    });
  }

  getPermissionListForCreate(value, route) {
    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (route == 'Office Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isOfficeDetail = true;
            } else {
              this.isOfficeDetail = false;
            }
          }
        } else {
          this.isOfficeDetail = false;
        }
        this.getPermissionListForCreate(545, 'Email ids');
      }

      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isEmailids = true;
            } else {
              this.isEmailids = false;
            }
          }
        } else {
          this.isEmailids = false;
        }
        this.getPermissionListForCreate(546, 'Documents');
      }

      if (route == 'Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isDocuments = true;
            } else {
              this.isDocuments = false;
            }
          }

          if (this.isOfficeDetail == false && this.isEmailids == false && this.isDocuments == false) {
            Swal.fire('Please Contact Administrator');
          } else {
            this.router.navigate(['views/office-info/office-info-view', { isCreate: true, isOfficeDetail: this.isOfficeDetail, isEmailids: this.isEmailids, isDocuments: this.isDocuments, isReadDocument: false }]);
          }
        } else {
          // this.isDocuments = false;

          if (this.isOfficeDetail == true && this.isEmailids == true) {
            this.router.navigate(['views/office-info/office-info-view', { isCreate: true, isOfficeDetail: this.isOfficeDetail, isEmailids: this.isEmailids, isDocuments: false, isReadDocument: false }]);
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForUpdate(value, route, id) {
    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (route == 'Office Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isOfficeDetail = true;
            } else {
              this.isOfficeDetail = false;
            }
          }
        } else {
          this.isOfficeDetail = false;
        }
        this.getPermissionListForUpdate(545, 'Email ids',id);
      }

      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isEmailids = true;
            } else {
              this.isEmailids = false;
            }
          }
        } else {
          this.isEmailids = false;
        }
        this.getPermissionListForUpdate(546, 'Documents',id);
      }

      if (route == 'Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isDocuments = true;
            } else {
              this.isDocuments = false;
            }
            
            if (data[0].Read_Opt == 2) {
              this.isReadDocument = true;
            } else {
              this.isReadDocument = false;
            }
          }

          if (this.isOfficeDetail == false && this.isEmailids == false && this.isDocuments == false && this.isReadDocument == false) {
            Swal.fire('Please Contact Administrator');
          } else {
            this.router.navigate(['views/office-info/office-info-view', { isCreate: false,  id: id, isOfficeDetail: this.isOfficeDetail, isEmailids: this.isEmailids, isDocuments: this.isDocuments, isReadDocument: this.isReadDocument }]);
          }
        } else {
          // this.isDocuments = false;

          if (this.isOfficeDetail == true && this.isEmailids == true) {
            this.router.navigate(['views/office-info/office-info-view', { isCreate: false,  id: id, isOfficeDetail: this.isOfficeDetail, isEmailids: this.isEmailids, isDocuments: false, isReadDocument: false }]);
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

}
