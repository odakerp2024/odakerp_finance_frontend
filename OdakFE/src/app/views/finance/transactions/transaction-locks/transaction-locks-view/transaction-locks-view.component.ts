import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-transaction-locks-view',
  templateUrl: './transaction-locks-view.component.html',
  styleUrls: ['./transaction-locks-view.component.css']
})
export class TransactionLocksViewComponent implements OnInit {
  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any[];// paged item
  // * pagination end

  filterForm: FormGroup;
  maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  statusList: any = [];
  PeriodList: any = [];
  transactionLocksList: any = [];
  periodList: any = [];
  finalYearList: any = [];

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.filterFormCreate();
    this.getTransactionList();
    this.getDropDowList();
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 527,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/transactions/transaction-locks/transaction-locks-details']);
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

  editTransactionLocks(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 527,
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
              this.router.navigate(['views/transactions/transaction-locks/transaction-locks-details', { isUpdate: true, id: id }]);
            }
            
          }
          else {
            this.router.navigate(['views/transactions/transaction-locks/transaction-locks-details', { isUpdate: true, id: id }]);
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
    this.router.navigate(['views/transactions/transaction-locks/transaction-locks-details', { isUpdate: true, id: id }]);
  }

  filterFormCreate() {
    this.filterForm = this.fb.group({
      FinancialYear: [""],
      PeriodType: [0],
      Status: [0]
    });
  }

  getTransactionList() {
    var service = `${this.globals.APIURL}/TransactionLocks/GetTransactionLocksList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.transactionLocksList = [];
      this.pagedItems = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.transactionLocksList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) { return; }
    this.pager = this.ps.getPager(this.transactionLocksList.length, page);
    this.pagedItems = this.transactionLocksList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDropDowList() {
    var service = `${this.globals.APIURL}/TransactionLocks/TransactionLockDropDownList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.finalYearList = [];
      this.periodList = [];
      this.statusList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.finalYearList = result.data.Table;
        this.periodList = result.data.Table1;
        this.statusList = result.data.Table2;
      }
    }, error => { });
  }
}
