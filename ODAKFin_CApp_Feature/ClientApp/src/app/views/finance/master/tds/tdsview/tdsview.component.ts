import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GridSort, Image_List } from 'src/app/model/common';
import { Section } from 'src/app/model/financeModule/TDS';
import { PaginationService } from 'src/app/pagination.service';
import { TDSService } from 'src/app/services/financeModule/tds.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tdsview',
  templateUrl: './tdsview.component.html',
  styleUrls: ['./tdsview.component.css']
})
export class TdsviewComponent implements OnInit {

  /*Variable */
  title = 'TDS Rates';
  fg: FormGroup;

  private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items

  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;

  Sectionvalues: Section[] = [];

  statusvalues: Status[] = [
    { value: 1, viewValue: 'Yes' },
    { value: 0, viewValue: 'No' },
  ];

  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, public ps: PaginationService, private tdsService: TDSService, private router: Router,
    private CommonService: CommonService) { }
  //constructor(private http: HttpClient, private globals: Globals, private ms: MastersService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.clearSearch();
    this.OnBindDropdownSection();
  }

  createForm() {
    this.fg = this.fb.group({
      TDSRatesId: 0,
      TaxName: '',
      RatePercentage: null,
      SectionID: 0,
      SectionName: '',
      EffectiveDate: null,
      IsActive: '',
      Status: ''
    });
  }

  clearSearch() {
    this.createForm();
    this.FinancialYearList();
  }

  OnBindDropdownSection() {

    var queryParams = { "sectionID": 0 }

    this.tdsService.getSection(queryParams).subscribe(data => {

      this.Sectionvalues = data["data"];
    });
  }

  onSubmit() {
    this.tdsService.getTDSFilter(this.fg.value).subscribe(data => {
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

    this.tdsService.getTDSList(this.fg.value).subscribe(data => {
      if (data["data"].length == 0) { this.Is_DataFound = false; this.allItems = null; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"];
        console.log(data["data"]);
        // initialize to page 1
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  // setPage(page: number) {
  //   // get pager object from service
  //   this.pager = this.ps.getPager(this.allItems.length, page);

  //   // get current page of items
  //   this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  // }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    //   // get pager object from service
    this.pager = this.ps.getPager(this.allItems.length, page);

    //   // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  editTaxMaster(id: number) {
    this.router.navigate(['/views/finance/master/tds', { isCreate: false, id: id }])
  }
  tdsMasterRoute(routePAth: string) {
    if (routePAth == 'add') this.router.navigate(['/views/finance/master/tds']);
    else if (routePAth == 'finance') this.router.navigate(['views/finance/financemaster']);
  }

  checkAddPermission() {
    this.getPermissionListForCreate(589);
  }

  checkUpdatePerission(id) {
    this.getPermissionListForUpdate(589, id);
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
            this.router.navigate(['views/finance/master/tds', { isCreate: true }]);
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
            this.router.navigate(['views/finance/master/tds', { isCreate: true, id: id }]);
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