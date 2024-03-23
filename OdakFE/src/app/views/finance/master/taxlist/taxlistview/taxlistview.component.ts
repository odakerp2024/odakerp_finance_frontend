import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GetTaxTypeFilter, Image_List } from 'src/app/model/Taxtype';
import { TaxtypeService } from 'src/app/services/taxtype.service';
import { PaginationService } from 'src/app/pagination.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taxlistview',
  templateUrl: './taxlistview.component.html',
  styleUrls: ['./taxlistview.component.css']
})
export class TaxlistviewComponent implements OnInit {

  /*Variable */
  title = 'Financial Year Master';
  searchForm: FormGroup;

  allItems: any[] = [];// array of all items to be paged
  pager: any = {};// pager object
  pagedItems: any[];// paged items
  Taxtypeform: FormGroup;
  searchData: GetTaxTypeFilter = new GetTaxTypeFilter();
  taxtypeform: FormGroup;
  statusvalues: Status[] = [
    { value: 1, viewValue: 'Yes' },
    { value: 0, viewValue: 'No' },
  ];
  imagenotfound: any = new Image_List().Not_Found_for_List;
  countryList: any = [];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')


  constructor(private fb: FormBuilder,
    public ps: PaginationService, private ms: TaxtypeService, private titleService: Title, private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private commonDataService: CommonService
  ) {
    this.getCountryList();
    this.createForm();
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.PageLoadingtypeLists();
  }
  createForm() {
    this.searchForm = this.fb.group({
      TaxTypeId: 0,
      ShortName: '',
      TaxName: '',
      Status: ''
    });
  }
  clearSearch() {
    this.createForm()
    this.PageLoadingtypeLists();
  }

  async PageLoadingtypeLists() {
    this.ms.associatedgetList(this.searchForm.value).subscribe(async data => {
      this.allItems = data['data'].Table;
      await this.getCountryList();
      this.allItems.map(async x => {
        if (this.countryList.length > 0) {
          let countryName = this.countryList.find(res => res.ID == x.CountryId);
          x.countryName = countryName ? countryName.CountryName : '';
        }
      });

      // console.log(this.countryList, " this.countryList")
      this.setPage(1);
    });
  }

  onSubmit() {
    this.searchData.ShortName = this.searchForm.value.ShortName;
    this.searchData.taxTypeName = this.searchForm.value.TaxName;
    // this.searchData.IsActive = this.searchForm.value.Status === ''? 1 : Number(this.searchForm.value.Status);
    this.searchData.IsActive = this.searchForm.value.Status

    // console.log(this.searchData.IsActive)
    this.ms.getassociatedFilter(this.searchData).subscribe(async GetTaxTypeFilter => {
      // set items to json response
      this.allItems = GetTaxTypeFilter['data'].Table;
      await this.getCountryList();
      this.allItems.map(async x => {
        if (this.countryList.length > 0) {
          let countryName = this.countryList.find(res => res.ID == x.CountryId);
          x.countryName = countryName ? countryName.CountryName : '';
        }
      });


      // initialize to page 1
      this.setPage(1);

    });
  }


  setPage(page: number) {
    if (page < 1) {
       return;
    }
    this.pager = this.ps.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    // console.log(this.allItems);
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

  editTaxType(id: number) {
    this.router.navigate(['/views/finance/master/taxlist/taxlist/', { isCreate: false, id: id }]);
  }

  checkUpdatePerission(id) {
    debugger
    this.getPermissionListForUpdate(585, id);
  }	

  checkAddPermission(routePAth: string) {
    this.getPermissionListForCreate(585);
    // if (routePAth == 'add') this.router.navigate(['/views/finance/master/taxlist/taxlist']);
    // else if (routePAth == 'finance') this.router.navigate(['views/finance/financemaster']);
  }

  async getCountryList() {
    return new Promise((resolve, reject) => {
      let service = `${this.globals.APIURL}/Organization/GetCountryList`;
      this.dataService.post(service, {}).subscribe((result: any) => {
        if (result.data.Table.length > 0) {
          this.countryList = result.data.Table;
        }
        resolve('');
      }, error => {
        console.error(error);
        reject('');
      });
    });
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
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            this.router.navigate(['views/finance/master/taxlist/taxlist', { isCreate: true }]);
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
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2) {
            this.router.navigate(['/views/finance/master/taxlist/taxlist/', { isCreate: false, id: id }]);
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
