import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { BankReconciliationService } from 'src/app/services/financeModule/bank-reconciliation.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MatOption } from '@angular/material';


@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html',
  styleUrls: ['./bank-reconciliation.component.css']
})
export class BankReconciliationComponent implements OnInit {
  @ViewChild('allSelected') private allSelected: MatOption;      
@ViewChild('allSelected1') private allSelected1: MatOption; 
  
  divisionDropdown = [];
  officeDropdown = [];
  bankDropdown = [];

  transactionTableOne = [];
  accountInBook = [];
  accountInBank = [];

  matchedRecordsBook = [];
  matchedRecordsBank = [];
  reconciledTransaction = [];
  InBookAndBank = [];
  AsPerBookAndBank = [];
  currentDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable("DateFormat");
  fromMaxDate = this.currentDate;
  toMaxDate = this.currentDate;
  bankReconciliationForm: any;
  // SelectedIndexTable: any = [];
  BankIdsSelectedIndexTable: any = [];
  BooksIdsSelectedIndexTable: any = [];
  IsReconcile: number;
  BankIdsSelectedTable: any = [];
  BooksIdsSelectedTable: any = [];
  Book: any = [];
  Bank: any = [];
  accountInBank1: any = [];
  accountInBook1: any = [];
  allValues: boolean;
  constructor(
    private datePipe: DatePipe,
    private commonService: CommonService,
    private fb: FormBuilder,
    private bankReconciliationService: BankReconciliationService
  ) { }

  ngOnInit(): void {
    this.getDivisionDropdown();
    this.createForm();
  }

  createForm() {
    this.bankReconciliationForm = this.fb.group({
      fromPeriod: [this.currentDate],
      toPeriod: [this.currentDate],
      divisionId: [],
      officeId: [],
      bankId: [0]
    })
  }

  tosslePerOne(event: any){ 
   this.allValues = true
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     return false;
 }
 this.getOfficeDropdown();
  // If no division then empty the office
  if (!this.bankReconciliationForm.value.divisionId.length) {
    this.bankReconciliationForm.controls.officeId.patchValue([]);
    this.bankReconciliationForm.controls.bankId.patchValue(0);
  }

  this.getBankDropdown();
   if(this.bankReconciliationForm.controls.divisionId.value.length == this.divisionDropdown.length)
     this.allSelected.select();
   
 }
   toggleAllSelection() {
     if (this.allSelected.selected) {
      this.allValues = true
       this.bankReconciliationForm.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
      //  this.getBankDropdown();
      this.getOfficeDropdown()
     } 
     else {
       this.bankReconciliationForm.controls.divisionId.patchValue([]);
       this.allValues = false
       this.officeDropdown = []
       this.bankDropdown = [];
       this.bankReconciliationForm.controls.bankId.patchValue(0);
       this.bankReconciliationForm.controls.officeId.patchValue([]);
       
     }

   }
   
  tosslePerOneOffice(event: any) {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      return false;
    } else { }
    this.getBankDropdown();
    if (this.bankReconciliationForm.controls.officeId.value.length == this.officeDropdown.length)
      this.allSelected1.select();
  }

   toggleAllSelectionOffiece() {
     if (this.allSelected1.selected) {
       this.bankReconciliationForm.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
       this.getBankDropdown();
     } else {
       this.bankReconciliationForm.controls.officeId.patchValue([]);
       this.bankDropdown = [];
       this.bankReconciliationForm.controls.bankId.patchValue('');
     }
   }


  updateFromDate(data) {
    this.fromMaxDate = this.datePipe.transform(data, "yyyy-MM-dd");

    const filterData = this.bankReconciliationForm.value;
    const fromDate = filterData.fromPeriod;
    const toDate = filterData.toPeriod;

    if (fromDate > toDate) {
      this.bankReconciliationForm.controls.fromPeriod.setValue(toDate)
      // console.log('fromDate is greater than toDate');
    } else if (fromDate < toDate) {
      // console.log('fromDate is less than toDate');
    }
  }


  async getDivisionDropdown() {
    const payload = {
      "SelectedIds": [],
      "IsForDivision": 1,
      "IsFromDivision": 0,
      "IsFromOffice": 0
    }
    const divisionList: any = await this.commonDropdown(payload);
    this.divisionDropdown = [];
    this.divisionDropdown.push(...divisionList);
    this.bankReconciliationForm.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
    this.getOfficeDropdown(true)
  }


  async getOfficeDropdown(isSelectAll = false) {
    const selectedDivisionIds = this.bankReconciliationForm.value.divisionId;
    const payload = {
      "SelectedIds": [...selectedDivisionIds],
      "IsForDivision": 0,
      "IsFromDivision": 1,
      "IsFromOffice": 0
    }
    const officeDropdown: any = await this.commonDropdown(payload);
    this.officeDropdown = [];
    this.officeDropdown.push(...officeDropdown);
    if(this.allValues == false){
      this.officeDropdown = []
       }

    if (isSelectAll) {
      this.bankReconciliationForm.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
      this.getBankDropdown();
    }
  }

  async getBankDropdown() {
    const selectedOfficeIds = this.bankReconciliationForm.value.officeId;
    const payload = {
      "SelectedIds": [...selectedOfficeIds],
      "IsForDivision": 0,
      "IsFromDivision": 0,
      "IsFromOffice": 1
    };
    const bankDropdown: any = await this.commonDropdown(payload);
    this.bankDropdown = [];
    this.bankDropdown.push(...bankDropdown);
    // this.getBankBookList();
  }




  commonDropdown(payload) {
    return new Promise((resolve, reject) => {
      this.commonService.getMultiSelectDivisionOfficeBankList(payload).subscribe((result: any) => {
        if (result.message == 'Success') {
          resolve(result.data.Table)
        } else {
          reject()
        }
      });
    })
  }
  OnClickRadioAccountInBook(index, type: string, name: any, event: any) {
    const checkedValue = event.target.checked;
    this.accountInBook[index]['IsCheck'] = checkedValue;
    console.log('accountInBook', this.accountInBook)
  }

  OnClickRadioAccountInBank(index, type: string, name: any, event: any) {
    const checkedValue = event.target.checked;
    this.accountInBank[index]['IsCheck'] = checkedValue;
    console.log('accountInBank', this.accountInBank)
  }

  BankReconcile() {
    const selectedBook = this.accountInBook.filter((selected) => { return selected.IsCheck === true })
    const selectedBank = this.accountInBank.filter((selected) => { return selected.IsCheck === true })

    const bookIds = [];
    const bankIds = [];
    selectedBook.forEach((book) => {
      bookIds.push(book.Id)
    })

    selectedBank.forEach((bank) => {
      bankIds.push(bank.Id)
    })

    const payload = {
      "BooksIds": bookIds,
      "BankIds": bankIds,
      "IsReconcile": 1
    }

    this.bankReconciliationService.UpdateBankReconcile(payload).subscribe((res: any) => {
      if (res.message == 'Success') {
        console.log(res, 'res');
        this.getReconciliationList()
      }
    })
  }

  OnClickRadio(index, type: string, name: any, event: any) {

    const checkedValue = event.target.checked;
    this.accountInBook1[index]['IsCheck1'] = checkedValue;
    console.log('accountInBook', this.accountInBook1)
  }


  BankUnreconcile() {
    const selectedBook1 = this.accountInBook1.filter((selected) => { return selected.IsCheck1 === true })
    const bookIds1 = [];
    const bankIds1 = [];

    selectedBook1.forEach((book) => {

      if (book.IsFromBank == 0) {
        bookIds1.push(book.Id)
      }
      else {
        bankIds1.push(book.Id)
      }

    })

    const payload = {
      "BooksIds": bookIds1,
      "BankIds": bankIds1,
      "IsReconcile": 0
    }

    this.bankReconciliationService.UpdateBankReconcile(payload).subscribe((res: any) => {
      if (res.message == 'Success') {
        console.log(res, 'res');
        this.getReconciliationList()
      }
    })
  }

  getReconciliationList() {
    const bankReconciliation = this.bankReconciliationForm.value;
    if (!bankReconciliation.bankId) {
      return
    }
    // const payload = {"FromDate":"01-01-2023","ToDate":"12-01-2023","Bank":"25"}
    const payload = {
      "FromDate": bankReconciliation.fromPeriod ? this.datePipe.transform(bankReconciliation.fromPeriod, "dd-MM-yyyy") : '',
      "ToDate": bankReconciliation.toPeriod ? this.datePipe.transform(bankReconciliation.toPeriod, "dd-MM-yyyy") : '',
      "Bank": bankReconciliation.bankId
    }
    this.bankReconciliationService.getBankReconciliation(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        console.log(result, 'result');

        const reconciliation = result.data;
        this.transactionTableOne = reconciliation.Table5;
        this.accountInBook = reconciliation.Table;
        this.accountInBook1 = result.data.Table4
        this.accountInBank1 = result.data.Table4
        this.accountInBank = reconciliation.Table1;
        this.matchedRecordsBook = reconciliation.Table2;
        this.matchedRecordsBank = reconciliation.Table3;
        this.reconciledTransaction = reconciliation.Table4;
        this.InBookAndBank = reconciliation.Table6;
        this.AsPerBookAndBank = reconciliation.Table7;
      }
    })
  }
}


