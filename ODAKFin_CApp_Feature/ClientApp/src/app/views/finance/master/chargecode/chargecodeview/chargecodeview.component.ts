import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Globals } from 'src/app/globals';
import { GridSort, Image_List, Status, StatusView, GLMappingStatus } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { ChargecodeService } from 'src/app/services/financeModule/chargecode.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chargecodeview',
  templateUrl: './chargecodeview.component.html',
  styleUrls: ['./chargecodeview.component.css']
})
export class ChargecodeviewComponent implements OnInit {

  /*Variable */
  title = 'Charge Code / Tariff';
  fg: FormGroup;

  private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items

  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;

  FillSAC: any[];
  FillGSTGroup: any[];
  FillDivision: any[];
  FillGLLink: any[];

  statusvalues: Status[] = new StatusView().statusvalues;
  GLStatusvaluesa: Status[] = new GLMappingStatus().glvalues;
  divisionList: any[];
  coaAccountList: any[];
  // isChargeCode: boolean = false;

  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, private chartaccountService: ChartaccountService
    , public ps: PaginationService, private ChargeService: ChargecodeService, private globals: Globals, private dataService: DataService,
    private CommonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.clearSearch();
    this.getDivisionList();
    this.getCartOfAccount();
    this.OnBindDropdownSAC();
    this.OnBindDropdownGSTGroup();
    this.OnBindDropdownDivision();
    this.OnBindDropdowngetGLLink();
  }

  createForm() {
    this.fg = this.fb.group({
      ChargesId: 0,
      ChargeName: "",
      SACCode: "",
      GSTGroup: "",
      Division: "",
      IsActive: "",
      // Status: '',
      GLLink: "",
      ChargeCode: ""
    });
  }

  clearSearch() {
    this.createForm();
    this.FinancialYearList();
  }

  OnBindDropdownSAC() {
    var queryParams = { "sacID": 0 }
    this.ChargeService.getSAC(queryParams).subscribe(data => {
      this.FillSAC = data["data"];
    });
  }

  OnBindDropdownGSTGroup() {
    var queryParams = { "gstGroupId": 0 }
    this.ChargeService.getGSTGroup(queryParams).subscribe(data => {
      this.FillGSTGroup = data["data"];
    });
  }

  OnBindDropdownDivision() {
    this.ChargeService.getDivision().subscribe(data => {
      this.FillDivision = data["data"];
    });
  }

  OnBindDropdowngetGLLink() {
    var queryParams = { "chartOfAccountsID": 0 }
    this.ChargeService.getGLLink(queryParams).subscribe(data => {
      this.FillGLLink = data["data"];
    });
  }

  onSubmit() {

    this.ChargeService.getChargesFilter(this.fg.value).subscribe(data => {
      this.allItems = [];
      this.pagedItems = [];
      if (data["data"]["Table"].length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"]["Table"];
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
    this.ChargeService.getChargesList(this.fg.value).subscribe(data => {
      if (data["data"]["Table"].length == 0) { this.Is_DataFound = false; this.pagedItems = [] }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"]["Table"];

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

  getDivisionList(filter?: string) {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  getCartOfAccount() {
    this.chartaccountService.getChartaccountList(this.fg.value).subscribe(data => {
      this.coaAccountList = [];
      if (data["data"].length > 0) {
        this.coaAccountList = data["data"];
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
      });
  }


  checkAddPermission() {
    this.getPermissionListForCreate(583);
  }

  checkUpdatePerission(id) {
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
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            this.router.navigate(['views/finance/master/chargecode', { isCreate: true, isChargeCode: true }]);
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
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2 || data[0].Read_Opt == 2) {
            this.router.navigate(['views/finance/master/chargecode', { isCreate: true, id: id, isChargeCode: true }]);
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
