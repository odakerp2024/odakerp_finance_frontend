import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GridSort, Image_List, Status, StatusView } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { SacService } from 'src/app/services/financeModule/sac.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sacview',
  templateUrl: './sacview.component.html',
  styleUrls: ['./sacview.component.css']
})
export class SACviewComponent implements OnInit {

  /*Variable */
  title = 'SAC Master';
  fg: FormGroup;
  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;

  private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items

  statusvalues: Status[] = new StatusView().statusvalues;

  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, public ps: PaginationService, private sacService: SacService, private router: Router,
    private CommonService: CommonService) { }
  //constructor(private http: HttpClient, private globals: Globals, private ms: MastersService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.clearSearch();
  }

  createForm() {
    this.fg = this.fb.group({
      SACID: 0,
      SACCode: '',
      SACDescription: '',
      IsActive: '',
      Status: '',

    });
  }

  clearSearch() {
    this.createForm();
    this.FinancialYearList();
  }

  onSubmit() {

    this.sacService.getSACFilter(this.fg.value).subscribe(data => {
      if (data["data"].length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"];
        // initialize to page 1
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  FinancialYearList() {

    this.sacService.getSACList(this.fg.value).subscribe(data => {
      this.allItems = [];
      this.pagedItems = [];
      if (data["data"].length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"];
        // initialize to page 1
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  editSacMaster(id: number) {
    this.router.navigate(['/views/finance/master/SAC', { isCreate: false, id: id }])
  }
  sacMasterRoute(routePAth: string) {
    if (routePAth == 'add') this.router.navigate(['/views/finance/master/SAC']);
    else if (routePAth == 'finance') this.router.navigate(['views/finance/financemaster']);
  }

  checkAddPermission() {
    this.getPermissionListForCreate(583);
  }

  checkUpdatePerission(id) {
    debugger
    this.getPermissionListForUpdate(583, id);
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
            this.router.navigate(['views/finance/master/SAC', { isCreate: true }]);
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
            this.router.navigate(['/views/finance/master/SAC', { isCreate: false, id: id }])
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
