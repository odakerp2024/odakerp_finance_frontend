import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { debug } from 'console';
import { Globals } from 'src/app/globals';
import { GridSort, Image_List } from 'src/app/model/common';
import { Country } from 'src/app/model/Organzation';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { FinancialyearService } from 'src/app/services/financeModule/financialyear.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financialyearview',
  templateUrl: './financialyearview.component.html',
  styleUrls: ['./financialyearview.component.css']
})
export class FinancialyearviewComponent implements OnInit {
  /*Variable */
  title = 'Financial Year Master';
  searchForm: FormGroup;
  dscountryItem: Country[];
  FillFinancialyear: any[];

  private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items

  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;
  //  statusvalues: Status[] = new StatusView().statusvalues;

  statusvalues: Status[] = [
    { value: 1, viewValue: 'ACTIVE' },
    { value: 0, viewValue: 'IN-ACTIVE' },
  ];

  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, public ps: PaginationService
    , private fy: FinancialyearService, private globals: Globals, private dataService: DataService,
    private CommonService: CommonService, private router: Router,) { }
  //constructor(private http: HttpClient, private globals: Globals, private ms: MastersService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.OnBindDropdownCountry();
    this.OnBindDropdownfinancialYear();
    this.clearSearch();
  }


  OnBindDropdownCountry() {
    this.ms.getCountryBind().subscribe(data => {
      this.dscountryItem = data;
    });
  }

  OnBindDropdownfinancialYear() {
    var queryParams = { "financialYearID": 0 }
    this.fy.getFinancialYear(queryParams).subscribe(data => {
      this.FillFinancialyear = data["data"];
    });
  }

  createForm() {
    this.searchForm = this.fb.group({
      ID: 0,
      CountryID: 0,
      FinancialYearName: '',
      IsActive: '',

      FromDate: '',
      ToDate: '',
      AssessmentYear: ''
    });
  }

  clearSearch() {
    this.createForm();
    this.FinancialYearList();
  }

  onSubmit() {

    this.fy.getFinancialYearFilter(this.searchForm.value).subscribe(data => {
      if (data["data"].length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"];
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  FinancialYearList() {

    this.fy.getFinancialYearList(this.searchForm.value).subscribe(data => {
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

    // get pager object from service
    this.pager = this.ps.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }


  checkAddPermission() {
    this.getPermissionListForCreate(619);
  }

  checkUpdatePerission(id) {
    debugger
    this.getPermissionListForUpdate(619, id);
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
            this.router.navigate(['views/finance/master/financialyear/financialyear']);
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
            this.router.navigate(['views/finance/master/financialyear/financialyear', { id: id }]);
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


interface Status {
  value: Number;
  viewValue: string;
}