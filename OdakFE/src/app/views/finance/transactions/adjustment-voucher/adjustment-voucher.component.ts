import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adjustment-voucher',
  templateUrl: './adjustment-voucher.component.html',
  styleUrls: ['./adjustment-voucher.component.css'],
  providers: [DatePipe]
})
export class AdjustmentVoucherComponent implements OnInit {

  adjustmentFilter: FormGroup;
  adjustmentList: any = [];
  pager: any = {};
  pagedItems: any[];// paged items
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  // minDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
  validTillMinDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
  accountName: any = [];
  debitCreditList: any = [];
  statusList: any[];

  constructor(
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private dataService: DataService,
    private commonDataService: CommonService,
    public ps: PaginationService,
    private datePipe: DatePipe,
    private chartAccountService: ChartaccountService
  ) { }

  ngOnInit(): void {
    this.createAdjustment();
    this.getAdjustmentList();
    this.ChartAccountList();
    this.getDrCr();
    this.getDropDownList();
  }

  createAdjustment() {
    this.adjustmentFilter = this.fb.group({
      Id: [0],
      DivisionId: [0],
      OfficeId: [0],
      AVNumber: [''],
    //  AVDate: [''],
      AccountId: [0],
      CurrencyId: [0],
      Status: [0],
      TransactionType: [''],
      StartDate:[''],
      EndDate:['']
    });
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 507,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/Adjustment-info/Adjustment-Voucher-info']);
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

  adjustmentInfoRoute(id?: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 507,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
            if(data[0].Read_Opt != 2){
              Swal.fire('Please Contact Administrator');
            }
            else{
              this.router.navigate(['/views/Adjustment-info/Adjustment-Voucher-info', { id: id, isUpdate: true }]);
            }            
          }
          else {
            this.router.navigate(['/views/Adjustment-info/Adjustment-Voucher-info', { id: id, isUpdate: true }]);
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

  getAdjustmentList() {
    var service = `${this.globals.APIURL}/AdjustmentVoucher/GetAdjustmentVoucherList`;
    this.dataService.post(service, this.adjustmentFilter.value).subscribe((result: any) => {
      this.adjustmentList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.adjustmentList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }

  setPage(page: number) {
    this.pager = this.ps.getPager(this.adjustmentList.length, page);
    this.pagedItems = this.adjustmentList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  ChartAccountList() {
    let payLoad = { ID: 0, ChartOfAccountsId: 0, AcctCode: '', AccountName: '', AccountType: 0, MainGroup: 0, ParentAccountID: 0, IsActive: true, Status: '' }
    this.chartAccountService.getChartaccountList(payLoad).subscribe(async data => {
      this.accountName = [];
      if (data["data"].length > 0) {
        this.accountName = data["data"];
      }
    })
  }

  getDrCr() {
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.debitCreditList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.debitCreditList = result.data.Table;
      }
    }, error => { });
  }

  getDropDownList() {
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == "Success" && result.data.Table1.length > 0) {
        this.statusList = result.data.Table1;
      }
    }, error => { });
  }
  copyPaste(id: number) {
    this.router.navigate(['/views/Adjustment-info/Adjustment-Voucher-info', { copy_id: id, isCopy: true  }]);
  }

//  adjustmentEvent(event: any) {
//     this.adjustmentFilter.controls['EndDate'].setValue('');
//     this.validTillMinDate = this.datePipe.transform(new Date(event), this.entityDateFormat);
//   }

}
