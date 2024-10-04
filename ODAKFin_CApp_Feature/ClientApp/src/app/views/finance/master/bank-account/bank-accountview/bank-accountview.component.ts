import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BankService } from 'src/app/services/bank.service';
import { MastersService } from 'src/app/services/masters.service';
import { Bankaccountlist, BankFilter, Currency, CurrencySearch, Image_List } from '../../../../../model/bankaccount';
import { PaginationService } from 'src/app/pagination.service';
import { Status, StatusNew } from '../../../../../model/common';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bank-accountview',
  templateUrl: './bank-accountview.component.html',
  styleUrls: ['./bank-accountview.component.css']
})

export class BankAccountviewComponent implements OnInit {

  /*Variable */
  title = 'Financial Year Master';

  searchForm: FormGroup;
  searchData: BankFilter = new BankFilter();
  allItems: any[] = [];// array of all items to be paged
  pager: any = {};// pager object
  pagedItems: any[];// paged items
  AccTypecurrency: Currency[];
  CurrencyLook: CurrencySearch;
  statusvalues: StatusNew[] = [
    { value: 1, viewValue: 'Yes' },
    { value: 0, viewValue: 'No' },
  ];

  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  //pagesort: any = new GridSort().sort;
  constructor(private fb: FormBuilder, public ps: PaginationService, private ms: BankService, private titleService: Title,
    private commonDataService: CommonService,private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.OnBindDropdownAccType();
    this.clearSearch();
    this.PageLoadingbankaccountList()
  }

  onEditPermission(Id){
    this.getPermissionListForCreate(568, Id);
  }
  
  onAddPermission(){
    this.getPermissionListForCreate(568);
  }

  
  getPermissionListForCreate(value, Id = 0) {

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

          if (data[0].Create_Opt == 2 && Id == 0) {
            this.router.navigate(['/views/finance/master/bank-account/bank-account/']);
          } else if (data[0].Update_Opt == 2 || data[0].Read_Opt == 2 && Id != 0) {
            this.router.navigate(['/views/finance/master/bank-account/bank-account/', { id: Id }]);
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

  OnBindDropdownAccType() {
    this.CurrencyLook = { "currencyId": 0, "countryId": 0 };
    // console.log(this.CurrencyLook);

    this.ms.getCurrencyLists(this.CurrencyLook).subscribe(data => {
      this.AccTypecurrency = data['data'];
      // console.log(this.AccTypecurrency)

    });

  }

  createForm() {
    this.searchForm = this.fb.group({
      ID: 0,
      BankName: '',
      AccountName: '',
      Ifsccode: '',
      AccountType: 0,
      Currency: [''],
      Status: ''
    });
  }

  clearSearch() {
    this.createForm();
    this.onSubmit();
  }
  onSubmit() {
    this.searchData.BankName = this.searchForm.value.BankName;
    this.searchData.AccountNo = this.searchForm.value.AccountName;
    this.searchData.Currency = this.searchForm.value.Currency;
    this.searchData.IFSCCode = "";
    this.searchData.SwiftCode = null;
    this.searchData.IsActive = this.searchForm.value.Status;
    if (this.searchForm.value.Ifsccode) { this.searchData.IFSCCode = this.searchForm.value.Ifsccode; }

    // console.log(this.searchData.BankName);
    this.ms.getbankaccountFilter(this.searchData).subscribe(Bankaccountlist => {
      // set items to json response
      this.allItems = Bankaccountlist['data'].Table;
      this.pagedItems = this.allItems
      // initialize to page 1
      this.setPage(1);

    });
  }

  PageLoadingbankaccountList() {

    this.ms.getbankaccountList(this.searchForm.value).subscribe(data => {
      // console.log(data['data'].Table)
      this.allItems = data['data'].Table;
      this.setPage(1);
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
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


}
