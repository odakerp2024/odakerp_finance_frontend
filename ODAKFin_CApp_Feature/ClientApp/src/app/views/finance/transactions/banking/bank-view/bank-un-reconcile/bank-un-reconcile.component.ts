import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material';
import { CommonService } from 'src/app/services/common.service';
import { BankReconciliationService } from 'src/app/services/financeModule/bank-reconciliation.service';

@Component({
  selector: 'app-bank-un-reconcile',
  templateUrl: './bank-un-reconcile.component.html',
  styleUrls: ['./bank-un-reconcile.component.css']
})
export class BankUnReconcileComponent implements OnInit {
  divisionDropdown = [];
  @ViewChild('allSelected') private allSelected: MatOption;      
  @ViewChild('allSelected1') private allSelected1: MatOption; 
  officeDropdown = [];
  bankDropdown = [];
  accountInBook = [];
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable("DateFormat");
  currentDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromMaxDate = this.currentDate;
  toMaxDate = this.currentDate;
  bankUnReconciliationForm: any;
  reconciledTransaction = [];

  IsReconcile: number;
  BankIdsSelectedTable: any = [];
  BooksIdsSelectedTable: any = [];
  accountInBank1: any = [];
  accountInBook1: any = [];
  Book: any = [];
  Bank: any = []
  allValues: boolean;
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private commonService: CommonService,
    private bankReconciliationService: BankReconciliationService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDivisionDropdown();
  }

  tosslePerOne(event: any){ 
    this.allValues = true
     if (this.allSelected.selected) {  
      this.allSelected.deselect();
      return false;
  }
    this.getOfficeDropdown()
    // If no division then empty the office
    if (!this.bankUnReconciliationForm.value.divisionId.length) {
      this.bankUnReconciliationForm.controls.officeId.patchValue([]);
      this.bankUnReconciliationForm.controls.bankId.patchValue([]);
    }
  
    this.getBankDropdown();
  
    if(this.bankUnReconciliationForm.controls.divisionId.value.length == this.divisionDropdown.length)
      this.allSelected.select();
    
  }
    toggleAllSelection() {
      if (this.allSelected.selected) {
       this.allValues = true
        this.bankUnReconciliationForm.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
        // this.getBankDropdown();
        this.getOfficeDropdown()
      } 
      else {
        this.bankUnReconciliationForm.controls.divisionId.patchValue([]);
        this.allValues = false
        this.officeDropdown = []
        this.bankDropdown = [];
        this.bankUnReconciliationForm.controls.bankId.patchValue(0);
        this.bankUnReconciliationForm.controls.officeId.patchValue([]);
      }
    }
    tosslePerOneOffice(event: any){ 
     if (this.allSelected1.selected) {  
      this.allSelected1.deselect();
      return false;
    } else { }
    this.getBankDropdown();
    if(this.bankUnReconciliationForm.controls.officeId.value.length == this.officeDropdown.length)
      this.allSelected1.select();
  }
    toggleAllSelectionOffiece() {
      if (this.allSelected1.selected) {
        this.bankUnReconciliationForm.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
        this.getBankDropdown();
      } else {
        this.bankUnReconciliationForm.controls.officeId.patchValue([]);
        this.bankDropdown = [];
        this.bankUnReconciliationForm.controls.bankId.patchValue('');
      }
    } 


  updateFromDate(data) {
    this.fromMaxDate = this.datePipe.transform(data, "yyyy-MM-dd");

    const filterData = this.bankUnReconciliationForm.value;


    const fromDate = filterData.fromPeriod;
    const toDate = filterData.toPeriod;

    if (fromDate > toDate) {
      this.bankUnReconciliationForm.controls.fromPeriod.setValue(toDate)
      // console.log('fromDate is greater than toDate');
    } else if (fromDate < toDate) {
      // console.log('fromDate is less than toDate');
    }
  }

  createForm() {
    this.bankUnReconciliationForm = this.fb.group({
      fromPeriod: [this.currentDate],
      toPeriod: [this.currentDate],
      divisionId: [],
      officeId: [],
      bankId: []
    })
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
    this.bankUnReconciliationForm.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
    this.getOfficeDropdown(true)
  }


  async getOfficeDropdown(isSelectAll = false) {
    const selectedDivisionIds = this.bankUnReconciliationForm.value.divisionId;
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
      this.bankUnReconciliationForm.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
      this.getBankDropdown();
    }
  }

  async getBankDropdown() {
    const selectedOfficeIds = this.bankUnReconciliationForm.value.officeId;
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


  OnClickRadio(index, type: string, name: any, event: any) {

    const checkedValue = event.target.checked;
    this.reconciledTransaction[index]['IsCheck1'] = checkedValue;
    console.log('accountInBook', this.reconciledTransaction)
  }

  BankUnreconcile(){
    const selectedBook1 =  this.reconciledTransaction.filter((selected) => { return selected.IsCheck1 === true })
    const bookIds1 = [];
    const bankIds1 = [];

    selectedBook1.forEach((book) => {

      if(book.IsFromBank == 0){
        bookIds1.push(book.Id)
      }
      else{
        bankIds1.push(book.Id)
      }
      
    })

    const payload = {
      "BooksIds": bookIds1,
      "BankIds":bankIds1,
      "IsReconcile": 0
    }
    
    this.bankReconciliationService.UpdateBankReconcile(payload).subscribe((res: any) => {
      if (res.message == 'Success') {
        console.log(res,'res');
        this.getReconciliationList()
      }
    })
  }

  getReconciliationList() {
    const bankReconciliation = this.bankUnReconciliationForm.value;
    if (!bankReconciliation.bankId) {
      return
    }
    const payload = {
      "FromDate":bankReconciliation.fromPeriod ? this.datePipe.transform(bankReconciliation.fromPeriod, "dd-MM-yyyy") : '',
      "ToDate":bankReconciliation.toPeriod ? this.datePipe.transform(bankReconciliation.toPeriod, "dd-MM-yyyy") : '',
      "Bank":bankReconciliation.bankId
  }
    this.bankReconciliationService.getBankUnreconcile(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        console.log(result,'result');
        
        const reconciliation = result.data;
        this.reconciledTransaction = reconciliation.Table;
        // this.reconciledTransaction1 = reconciliation.Table;
      }
    })
    }
}
