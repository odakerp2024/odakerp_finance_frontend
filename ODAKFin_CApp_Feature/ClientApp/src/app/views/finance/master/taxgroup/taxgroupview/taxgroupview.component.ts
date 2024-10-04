import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Image_List, TaxgroupFillter } from 'src/app/model/taxgroup';
import { TaxgroupService } from 'src/app/services/taxgroup.service';
import { PaginationService } from 'src/app/pagination.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-taxgroupview',
  templateUrl: './taxgroupview.component.html',
  styleUrls: ['./taxgroupview.component.css']
})

export class TaxgroupviewComponent implements OnInit {
  searchForm: FormGroup;
  ///private allItems: any[];
  //private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  allItems: any = [];// paged items
  searchData: TaxgroupFillter = new TaxgroupFillter();
  statusvalues: Status[] = [
    { value: 'true', viewValue: 'Yes' },
    { value: 'false', viewValue: 'No' },
  ];
  pagedItems: any[];
  imagenotfound: any = new Image_List().Not_Found_for_List;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');

  constructor(private fb: FormBuilder, public ps: PaginationService, private ms: TaxgroupService, private titleService: Title, private router: Router,
    private commonDataService: CommonService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.PageLoadinggroupLists();
  }

  createForm() {
    this.searchForm = this.fb.group({
      Taxgroup: "",
      Rate: null,
      Status: ''
    });
  }


  onSubmit() {
    this.searchData.TaxGroupName = this.searchForm.value.Taxgroup;
    this.searchData.TaxRate = Number(this.searchForm.value.Rate);
    // this.searchData.IsActive = this.searchForm.value.Status == 1 ? true : false;
    this.searchData.IsActive = this.searchForm.value.Status == '' ? true : this.searchForm.value.Status;
    this.ms.gettaxgroupFilter(this.searchData).subscribe(Taxgrouplist => {
      // set items to json response
      if (Taxgrouplist['data'])
        this.allItems = Taxgrouplist['data'].Table;

      // initialize to page 1
      this.setPage(1);

    });
  }

  PageLoadinggroupLists() {
    this.ms.taxgroupList(this.searchForm.value).subscribe(data => {
      this.allItems = data['data'].Table;
      this.setPage(1);
    });
  }
  clearSearch() {
    this.createForm();
    this.PageLoadinggroupLists();
  }

  setPage(page: number) {
    if (page < 1) {
      return;
    }
    this.pager = this.ps.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  isDesc: boolean = false;
  column: string = '';
  sort(property) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.pagedItems.sort(function (a, b) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };

  editTaxGroup(id: number) {
    this.router.navigate(['/views/finance/master/taxgroup/taxgroup/', { isCreate: false, id: id }])
  }

  // taxGroupRoute(routePAth: string) {
  //   if (routePAth == 'add') this.router.navigate(['/views/finance/master/taxgroup/taxgroup']);
  //   else if (routePAth == 'finance') this.router.navigate(['views/finance/financemaster']);
  // }

  checkAddPermission() {
    this.getPermissionListForCreate(587);
  }
  checkUpdatePerission(id) {
    this.getPermissionListForUpdate(587, id);
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
            this.router.navigate(['views/finance/master/taxgroup/taxgroup', { isCreate: true }]);
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

          if (data[0].Update_Opt == 2 || data[0].Read_Opt == 2) {
           this.router.navigate(['/views/finance/master/taxgroup/taxgroup/', { isCreate: false, id: id }])
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
  value: string;
  viewValue: string;
}