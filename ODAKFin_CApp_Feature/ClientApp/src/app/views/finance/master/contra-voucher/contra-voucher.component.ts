import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { ContraVoucherService } from 'src/app/services/contra-voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contra-voucher',
  templateUrl: './contra-voucher.component.html',
  styleUrls: ['./contra-voucher.component.css']
})

export class ContraVoucherComponent implements OnInit, OnDestroy {
  // * pagination start
  paymentList = [];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
// * pagination end
  filterForm: any;
  divisionList: any[];
  officeList: any[];
  currencyList: any;
  bankList: any;
  statusList: any[];
  fromAccount: any;
  toAccount = [];
  paymentModeList: any;

//  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
 validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
 entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
 entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  contraVoucherList: any[];
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private router: Router,
    private ps : PaginationService,
    private contraVoucherService: ContraVoucherService,
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private datePipe: DatePipe,
  ) {
    this.createFilterForm()
  }

  ngOnInit(): void {
    this.getListData();
    this.getDivisionList();
    this.getOfficeList();
    this.getCurrency();
    this.getModeOfPayment();
    this.getBankList();
    this.getStatusDropDownList();
    
  }

  CreateNew(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 505,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/contra-info/contra-info-view']);
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

  editPayment(id: number) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 505,
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
              this.router.navigate(['/views/contra-info/contra-info-view', { contraId: id }]);
            }
            
          }
          else {
            this.router.navigate(['/views/contra-info/contra-info-view', { contraId: id }]);
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

  createFilterForm(){
    this.filterForm = this.fb.group({
        DivisionId: [''],
        OfficeId: [''],
        ContraVoucherNumber: [''],
        FromAccount: [''],
        ToAccount: [''],
        VendorBranch: [''],
        AmountPaid: [''],
        CurrencyName: [''],
        ModeofPaymentId: [''],
        ReferenceNo: [''],
        StartDate :[''],
        EndDate :[''],
        Status: ['']
    })
  }
  getListData(){
    this.contraVoucherService.getList({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result.message == "Success") {
        this.contraVoucherList = result.data.Table;
        // console.log('result contra voucher', result);

        this.paymentList = result.data.Table;
        this.setPage(1);
      }
    });
  }

  getDivisionList(filter?: string) {
    this.contraVoucherService.getDivision({}).subscribe((result: any)=>{
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }


  getOfficeList(filter?: string) {
    this.contraVoucherService.getOffice({}).subscribe((result: any)=>{
      this.officeList = [];
      if (result.data.Office.length > 0) {
       // this.officeList = result.data.Table;
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  // getOffice(DivisionId){
  //   const payload = {DivisionId}
  //   this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any)=>{
  //     this.officeList = [];
  //     this.filterForm.controls['OfficeId'].setValue('')
  //     if(result.message == 'Success'){
  //       if(result.data && result.data.Table.length > 0) {
  //         this.officeList.push(...result.data.Table);
  //       }
  //     }
  //   }, error => { 
      
  //   });
  // }

  getStatusDropDownList(filter?: string) {
    this.commonDataService.getStatusDropDownList({}).subscribe((result: any)=>{
        this.statusList = [];
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.statusList = result.data.Table.filter(x => x.StatusName != 'Auto')
        }
    }, error => { });
  }

  getCurrency(){
    const payload = { "currencyId": 0, "countryId": 0 };
    this.contraVoucherService.getCurrencyLists(payload).subscribe((result: any) => {
      if (result.message == "Success") {
        this.currencyList = result['data'];
      }
    });
  }

  getModeOfPayment(){
    this.contraVoucherService.getModeOfPayment({}).subscribe((result: any) => {
      if (result.message == "Success") {
        this.paymentModeList = result['data'].Table;
      }
    })
  }

  getBankList(){
    let payload = {
      BankID : 0,
      BankName : '',
      AccountNo : '',
      CurrencyName: '',
      IFSCCode : '',
      SwiftCode : null,
      StatusID : null,
    }
    this.contraVoucherService.getBankAccountList(payload).subscribe((result: any) => {
      if(result.message == "Success"){
        this.bankList = result['data'].Table;
        this.fromAccount = this.bankList;
      }
    });
  }

  getToAccount(fromAccountId){
    this.filterForm.controls['ToAccount'].setValue('');
    const toAccount = this.bankList?.filter((res) => res.BankID != +fromAccountId)
    this.toAccount = toAccount;
  }

  filterContra(){
    this.contraVoucherService.contraFilter(this.filterForm.value).subscribe((result: any) => {
      if (result.message == "Success") {
        this.contraVoucherList = result.data.Table;
        this.paymentList = result.data.Table;
        this.setPage(1);
        // console.log('result filter contra', result);
      }
    })
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.paymentList.length, page);

    if(this.paymentList.length == 0){
      this.pagedItems = [];
    }

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get current page of items
    this.pagedItems = this.paymentList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  clearFilter() {
    // this.filterFormReset()
    this.createFilterForm();
    this.filterContra()
  }

  filterFormReset(){
    this.filterForm.reset()
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  copyPaste(id: number) {
    this.router.navigate(['/views/contra-info/contra-info-view/', { copy_id: id, isCopy: true  }]);
  
  }


  // contraEvent(event: any) {
  //   this.filterForm.controls['EndDate'].setValue('');
  //   this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  // }
  getTooltipNameById(id: number): string {
    // Assuming bankList is an array of objects with BankID and BankName properties
    const bank = this.bankList?.find(bank => bank.BankID === id);
  
    if (bank) {
      const truncatedBankName = bank.BankName.slice(0, 20); // Get the first 20 characters
      return truncatedBankName.toUpperCase(); // Convert to uppercase if needed
    } else {
      return '';
    }
  }
 }
