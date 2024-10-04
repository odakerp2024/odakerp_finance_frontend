import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Globals } from 'src/app/globals';
import { GridSort, Image_List, Status, StatusView } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chartaccountsview',
    templateUrl: './chartaccountsview.component.html',
    styleUrls: ['./chartaccountsview.component.css']
})
export class ChartaccountsviewComponent implements OnInit {

    /*Variable */
    title = 'Chart Of Accounts';
    fg: FormGroup;

    Is_DataFound: Boolean = true;
    imagenotfound: any = new Image_List().Not_Found_for_List;
    pagesort: any = new GridSort().sort;

    FillAccountType: any[] = [];
    FillParentAccount: any[] = [];
    FillMainGroup: any[] = [];

    private allItems: any[];// array of all items to be paged  
    pager: any = {};// pager object  
    pagedItems: any[];// paged items

    statusvalues: Status[] = new StatusView().statusvalues;
    coaTypeList: any = [];

    constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, public ps: PaginationService,
        private chartaccountService: ChartaccountService, private dataService: DataService, private globals: Globals,
        private CommonService: CommonService,
        private router: Router
    ) {
        this.getCoaType();
    }

    checkAddPermission(route, id) {
        this.getPermissionListForCreate(578, route, id);
      }

    getPermissionListForCreate(value, route, id) {

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
    
              if (data[0].Create_Opt == 2 && route != 'edit') {
                this.router.navigate(['views/finance/master/chartaccounts/chartaccounts']);
              } else if (data[0].Update_Opt == 2 || data[0].Read_Opt == 2 && route == 'edit') {
                this.router.navigate(['/views/finance/master/chartaccounts/chartaccounts', { id: id }]);
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
        this.clearSearch();
        this.titleService.setTitle(this.title);
        this.OnBindDropdownAccountType();
        this.OnBindDropdownParentAccount();
        this.OnBindDropdownMainGroup()
    }

    OnBindDropdownAccountType() {
        this.chartaccountService.getAccountType().subscribe(data => {
            this.FillAccountType = data["data"];
        });
    }

    OnBindDropdownParentAccount() {
        var service: any = `${this.globals.APIURL}/ChartOfAccounts/GetChartAccountName/`;
        this.dataService.post(service, {}).subscribe((result: any) => {
            // console.log(result.data, "result")
            if (result.data.length > 0) {
                this.FillParentAccount = result.data
            }
        }, error => {
            console.error(error);
        });

        // var queryParams = { "chartOfAccountsID": 0 };
        // this.chartaccountService.getParentAccount(queryParams).subscribe(data => {
        //     this.FillParentAccount = data["data"];
        // });
    }

    OnBindDropdownMainGroup() {
        this.chartaccountService.getMainAccountGroup().subscribe(data => {
            this.FillMainGroup = data["data"];
        });
    }

    createForm() {
        this.fg = this.fb.group({
            ID: 0,
            ChartOfAccountsId: 0,
            AcctCode: '',
            AccountName: '',
            AccountType: 0,
            MainGroup: 0,
            ParentAccountID: 0,
            IsActive: '',
            Status: '',
        });
    }

    clearSearch() {
        this.createForm();
        this.ChartAccountList();
    }

    onSubmit() {
        var queryParams = {
            "ChartOfAccountsId": 0,
            "OrganizationName": "",
            "AccountTypeID": this.fg.value.AccountType,
            "AccountCode": this.fg.value.AcctCode,
            "AccountName": this.fg.value.AccountName,
            "IsSubAccount": 0,
            "ParentAccount": this.fg.value.ParentAccountID,
            "IsJobAccount": 0,
            "DivisionName": "",
            "IsPrincipal": 0,
            "Principal": "",
            "Remarks": "",
            "IsActive": this.fg.value.IsActive,
            "MainGroupID": this.fg.value.MainGroup,
            "ShortName": '',
            "AccountNameId": ''
        }

              
        this.chartaccountService.getChartaccountFilter(queryParams).subscribe(data => {
            if (data["data"].length == 0) { this.Is_DataFound = false; }
            else {
                this.Is_DataFound = true;
                this.allItems = data["data"];
                // console.log(data["data"]);
                // initialize to page 1
                this.setPage(1);
            }
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message, 'error')
                this.Is_DataFound = false;
            });
    }

    ChartAccountList() {
        this.chartaccountService.getChartaccountList(this.fg.value).subscribe(async data => {
            if (data["data"].length == 0) { this.Is_DataFound = false; }
            else {
                if (this.coaTypeList.length == 0) { await this.getCoaType(); }
                this.Is_DataFound = true;
                this.allItems = data["data"];
                for (let data of this.allItems) {
                    let info = this.coaTypeList.find(x => x.ID == data.AccountTypeID);

                    // console.log(info)

                    if (info) { data.SubAccountGroupName = info.COATypeName; }
                    else { data.SubAccountGroupName = '' }
                }
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

        this.pagedItems.map(x => {
            if (x.AccountNameId) {
                let accountName = this.FillAccountType.find(y => y.SubAccountGroupId == x.AccountNameId);
                x.AccountName = accountName.SubAccountGroupName
            }
        })
    }
    sort(property) {
        this.pagesort(property, this.pagedItems);
    }

    async getCoaType() {
        var service: any = `${this.globals.APIURL}/COAType/GetCOATypeList`;
        await this.dataService.post(service, {}).subscribe((result: any) => {
            this.coaTypeList = [];
            if (result.data.Table.length > 0) {
                this.coaTypeList = result.data.Table;
            }
        }, error => {
            console.error(error);
        });
    }


}

