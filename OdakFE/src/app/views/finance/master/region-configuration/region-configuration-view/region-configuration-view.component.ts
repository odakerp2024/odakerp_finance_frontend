import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { StatusView } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { RegionConfigurationService } from 'src/app/services/financeModule/region-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-region-configuration-view',
  templateUrl: './region-configuration-view.component.html',
  styleUrls: ['./region-configuration-view.component.css']
})
export class RegionConfigurationViewComponent implements OnInit {

  regionsList: any = [];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  filterForm: any;
  regionDropdownList: any;
  officeDropdownList: any[];
  divisionDropdownList: any[];
  statusvalues: Status[] = [
    { value: 1, viewValue: 'Yes' },
    { value: 0, viewValue: 'No' },
  ];
  constructor(
    public ps: PaginationService,
    private fb: FormBuilder,
    private dataService: DataService,
    private regionService: RegionConfigurationService,
    private globals: Globals,
    private router: Router,
    private CommonService: CommonService
  ) {
    this.getOfficeList();
    this.getDivisionList();
  }

  checkAddPermission() {
    this.getPermissionListForCreate(628);
  }

  checkUpdatePermission(id) {
    this.getPermissionListForUpdate(628, id);
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
            this.router.navigate(['views/region/region-configuration']);
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
            this.router.navigate(['/views/region/region-configuration', { id: id, isUpdate: true }])
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



  ngOnInit(): void {
    this.filterFormCreate();
    this.getRegionsList();
  }

  getOfficeList() {
    this.regionService.getOfficeList().subscribe((result: any) => {
      if (result.message == 'Success') {
        this.officeDropdownList = [];
        this.officeDropdownList = result.data.Office;
      }
    })
  }

  getDivisionList() {
    this.regionService.getDivisionList().subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.divisionDropdownList = [];
        this.divisionDropdownList = result.data.Table;
      }
    })
  }

  getRegionsList() {
    var service = `${this.globals.APIURL}/AgingConfiguration/GetRegionsConfig`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.regionsList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.regionsList = result.data.Table;
        this.setPage(1);
      }
    }, error => {
      console.error(error);
    });
  }

  filterFormCreate() {
    this.filterForm = this.fb.group({
      Id: 0,
      Region: '',
      Division: 0,
      IsActive: '',
    });
  }

  editRegion(id: Number) {
    this.router.navigate(['/views/region/region-configuration', { id: id, isUpdate: true }])
  }

  setPage(page: number) {
    if (this.regionsList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // get pager object from service
      this.pager = this.ps.getPager(this.regionsList.length, page);
      // get current page of items
      this.pagedItems = this.regionsList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }

}

interface Status {
  value: Number;
  viewValue: string;
}
