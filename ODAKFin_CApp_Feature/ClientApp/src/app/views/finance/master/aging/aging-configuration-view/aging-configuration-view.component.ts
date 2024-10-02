import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Status, StatusView } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { AgingConfigurationService } from 'src/app/services/financeModule/aging-configuration.service';
import { data } from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aging-configuration-view',
  templateUrl: './aging-configuration-view.component.html',
  styleUrls: ['./aging-configuration-view.component.css']
})
export class AgingConfigurationViewComponent implements OnInit {
  agingList = [];
  private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  statusValue: Status[] = new StatusView().statusvalues;
  filterForm: any;
  reportDropdown = [];
  agingGroupDropdown = []
  constructor(
    public ps: PaginationService,
    private fb: FormBuilder,
    private dataService: DataService,
    private agingService: AgingConfigurationService,
    private CommonService: CommonService,
    private router: Router,
  ) {
    this.filterFormCreate();
    this.getAgingList()
    this.getDropdown();

  }
  checkAddPermission() {
    this.getPermissionListForCreate(583);
  }

  checkUpdatePermission(AgingId, ReportId, Id) {
    // [queryParams]="{'AgingId': agingData.AgingId, ReportId: agingData.ReportId, Id: agingData.Id}"
    this.getPermissionListForUpdate(583, AgingId, ReportId, Id);
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
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            this.router.navigate(['views/aging/aging-details']);
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

  getPermissionListForUpdate(value, AgingId, ReportId, Id) {
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

          if (data[0].Update_Opt == 2) {
            this.router.navigate(['views/aging/aging-details', { isCreate: true, Id: Id, AgingId:AgingId, ReportId:ReportId }]);
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

  }

  filterFormCreate() {
    this.filterForm = this.fb.group({
      ReportName: [''],
      AgingName: [''],
      IsActive: 1
    });
  }

  filterFormReset() {
    this.filterForm.reset();
  }



  onSubmit() {

    this.filterFormReset();
    this.getAgingList();
  }

  clearSearch() {
    this.filterFormReset();
    this.getAgingList();
  }

  getAgingList() {
    this.agingService.getAllAgingList(this.filterForm.value).subscribe((result: any) => {
      if (result.message == "Success") {
        this.agingList = [];
        // this.pagedItems = [];
        this.agingList = result.data.Table;
        this.setPage(1);
      }
    })
  }

  getDropdown() {
    this.agingService.getDropdownList({})
      .subscribe((result: any) => {
        if (result.message == "Success") {

          if (result.data.Table.length) {
            this.reportDropdown = result.data.Table;
          }

          if (result.data.Table1.length) {
            this.agingGroupDropdown = result.data.Table1;
          }

        }
      })
  }

  setPage(page: number) {
    if (this.agingList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      // get pager object from service
      this.pager = this.ps.getPager(this.agingList.length, page);
      // get current page of items
      this.pagedItems = this.agingList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }

}
