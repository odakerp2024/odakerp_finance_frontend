import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-journal-voucher-view',
  templateUrl: './journal-voucher-view.component.html',
  styleUrls: ['./journal-voucher-view.component.css'],
  providers: [DatePipe]
})
export class JournalVoucherViewComponent implements OnInit {

  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end
 
  // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  filterForm: FormGroup;
  divisionDropdown = [];
  journalList: any = [];
  divisionList: any = [];
  officeList: any = [];
  currencyList: any = [];
  accountName: any = [];
  statusList: any = [];
  AccountList: any[];
  groupedCoaTypeList: { [key: string]: any[] };

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private chartAccountService: ChartaccountService
  ) { }

  ngOnInit(): void {
    this.filterFormCreate();
    this.getJournalList();
    this.getDivisionList();
    this.getOfficeList();
    this.getCurrency();
   // this.ChartAccountList();
    this.getDropDownList();
    this.getParentAccountList();
  }

  filterFormCreate() {
    this.filterForm = this.fb.group({
      Id: [0],
      DivisionId: [0],
      OfficeId: [0],
      JournalVoucherNumber: [''],
      AccountId: [''],
      CurrencyId: [0],
      Status: [''],
      StartDate:[''],
      EndDate:['']
    });
  }

  getParentAccountList() {
    
    this.commonDataService.getChartaccountsFilter().subscribe(async data => {
      this.AccountList = [];
      if (data["data"].length > 0) {
        data["data"].forEach(e => e.AccountName = e.AccountName.toUpperCase());
        this.AccountList = data["data"];
        this.groupedCoaTypeList = this.groupDataByCEOGroupId(this.AccountList);
      }
    });
}

 groupDataByCEOGroupId(data: any[]): { [key: string]: any[] } {
    const groupedData: { [key: string]: any[] } = {};

    for (const item of data) {
      const groupId = item.GroupName.toUpperCase();
      if (!groupedData[groupId]) {
        groupedData[groupId] = [];
      }
      groupedData[groupId].push(item);
    }

    return groupedData;
  }
  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 503,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/transactions/journal/journal-details']);
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {

        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getDropDownList() {
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == "Success" && result.data.Table1.length > 0) {
        this.statusList = result.data.Table1.filter(x => x.StatusName != 'Auto')
      }
    }, error => { });
  }

  getJournalList() {
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.journalList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.journalList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.journalList.length, page);
    // get current page of items
    this.pagedItems = this.journalList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.currencyList = [];
      if (result.length > 0) {
        this.currencyList = result;
      }
    }, error => { });
  }

  editJournal(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 503,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Read_Opt != 2) {
            if(data[0].Update_Opt != 2){
              Swal.fire('Please Contact Administrator');
            }
            else{
              this.router.navigate(['/views/transactions/journal/journal-details', { id: id, isUpdate: true }]);
            }            
          }
          else {
            this.router.navigate(['/views/transactions/journal/journal-details', { id: id, isUpdate: true }]);
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
    
  }

  // ChartAccountList() {
  //   let payLoad = { ID: 0, ChartOfAccountsId: 0, AcctCode: '', AccountName: '', AccountType: 0, MainGroup: 0, ParentAccountID: 0, IsActive: true, Status: '' }
  //   this.chartAccountService.getChartaccountList(payLoad).subscribe(async data => {
  //     this.accountName = [];
  //     if (data["data"].length > 0) {
  //       this.accountName = data["data"];
  //     }
  //   })
  // }
  copyPaste(id: number) {
    this.router.navigate(['/views/transactions/journal/journal-details', { copy_id: id, isCopy: true  }]);
  }
  // getOfficeList(id: number) {
  //   console.log(id, "id")
  //   this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
  //     this.officeList = [];
  //     if (result['data'].Table.length > 0) {
  //       this.officeList = result['data'].Table;
  //     }
  //   })
  // }

  // journalEvent(event: any) {
  //   this.filterForm.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  // }

}
