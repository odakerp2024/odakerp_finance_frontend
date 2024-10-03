import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { promises, resolve } from 'dns';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { BankBookService } from 'src/app/services/financeModule/bank-book.service';
import { ExportFileService } from 'src/app/shared/service/export-file.service';
import { rejects } from 'assert';
import Swal from 'sweetalert2';
import { filterColumnNames} from './bank-book.model'
import { ExcelService } from 'src/app/services/excel.service';
import { MatOption } from '@angular/material';
import { DataService } from 'src/app/services/data.service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-bank-book',
  templateUrl: './bank-book.component.html',
  styleUrls: ['./bank-book.component.css']
})
export class BankBookComponent implements OnInit {
  // * pagination start

  @ViewChild('allSelected') private allSelected: MatOption;      
  @ViewChild('allSelected1') private allSelected1: MatOption; 
  entityFraction = +this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions');

  @Input() bankSummaryFilterData;
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end
  divisionDropdown = [];
  showTable: boolean = true;
  officeDropdown = []
  bankDropdown = []
  balanceBookTable = [];
  bankBookCountTable = [];
  searchByList = [];
  bankBookMiniStatement = []; 
  filterForm: any;
  bankBookCountPagedItems: any[];
  currentDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable("DateFormat");
  fromMaxDate = this.currentDate;
  toMaxDate = this.currentDate;
  bankBookDetails: any;
  // filterColumnNames = ['Date', 'Voucher', 'Party', 'PaymentType', 'Reference', 'Debit', 'Credit', 'ReconcileStatus', 'ClosingBalance']
  filterColumnNames = filterColumnNames;
  bankCurrency: any;
  exceldata: any =[];
  bankBookCountTable1: any;
  bankBookCountPagedItems1: any = [];
  allValues: boolean;
  modeOfPayment: any;
  constructor(
    private fb: FormBuilder,
    private bankBookService: BankBookService,
    private ps: PaginationService,
    public exportTo: ExportFileService,
    public datePipe: DatePipe,
    public commonService: CommonService,
    private excelService : ExcelService,
    private commonDataService: CommonService,
    private dataService: DataService,
    private globals: Globals,

  ) { }

  ngOnInit(): void {
    this.filterFormCreate();
    this.getBankBookDetailForm();
    // this.getBankBookList();
    this.getDivisionDropdown();
    this.getVoucherList();
  }

  ngOnChanges(changes: SimpleChanges) {
        
    const currentValue = changes.bankSummaryFilterData.currentValue;
    const previousValue = changes.bankSummaryFilterData.previousValue;
    if(currentValue != previousValue){
      this.bankBookDetails.patchValue({
        fromPeriod: currentValue.FromDate,
        toPeriod: currentValue.FromDate,
        divisionId: currentValue.DivisionIds,
        officeId: currentValue.OfficeIds,
        bankId: currentValue.bankId
      })
      this.getBankBookList();
    }
    
}


  filterFormCreate() {
    this.filterForm = this.fb.group({
      SearchBy: [''],
      SearchByValue: [''],
      IsActive: 1

    });
  }

  getBankBookDetailForm() {
    this.bankBookDetails = this.fb.group({
      fromPeriod: [this.currentDate],
      toPeriod: [this.currentDate],
      divisionId: [],
      officeId: [],
      bankId: [0]
    })
  }
  tosslePerOne(event: any) {
    this.allValues = true
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    } else {

    }
    // If no division then empty the office
    if(!this.bankBookDetails.value.divisionId.length){
      this.bankBookDetails.controls.officeId.patchValue([]);
      this.bankBookDetails.controls.bankId.patchValue(0);
    }
    
    // this.getBankDropdown();
    this.getOfficeDropdown();

    if (this.bankBookDetails.controls.divisionId.value.length == this.divisionDropdown.length)
      this.allSelected.select();

  }

  //  Division select
   toggleAllSelection() {
     if (this.allSelected.selected){
       this.allValues = true
       this.bankBookDetails.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
       this.getOfficeDropdown()
      } else {
       this.bankBookDetails.controls.divisionId.patchValue([]);
       this.allValues = false
       this.officeDropdown = [];
       this.bankDropdown = [];
       this.bankBookDetails.controls.bankId.patchValue(0);
       this.bankBookDetails.controls.officeId.patchValue([]);
     }
   }

  tosslePerOneOffice(event: any) {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      return false;
    } else {

    }
    this.getBankDropdown();
    if (this.bankBookDetails.controls.officeId.value.length == this.officeDropdown.length)
      this.allSelected1.select();
  }

   toggleAllSelectionOffiece() {
     if (this.allSelected1.selected) {
       this.bankBookDetails.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
       this.getBankDropdown();
     } else {
       this.bankBookDetails.controls.officeId.patchValue([]);
       this.bankDropdown = [];
     }
   } 

  getBankBookList() {
    const filterData =  this.bankBookDetails.value;

    if (!filterData.fromPeriod) {
      return
    }

    if (!filterData.toPeriod) {
      return
    }

    if (!filterData.bankId) {
      return
    }

    // update the bank currency value

    this.bankCurrency = this.bankDropdown.find((bank) => bank.BankID == filterData.bankId).CurrencyName

    const payload = {
      "FromDate": filterData.fromPeriod ? this.datePipe.transform(filterData.fromPeriod, "yyyy-MM-dd") : '',
      "ToDate": filterData.toPeriod ? this.datePipe.transform(filterData.toPeriod, "yyyy-MM-dd") : '',
      "Bank": filterData.bankId
    }
    this.bankBookService.getBankBookDetails(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.bankBookMiniStatement = result.data.Table;
        this.bankBookCountTable = result.data.Table1
        this.bankBookCountTable1 = result.data.Table1


        this.setPage(1);
      }
    })
  }

  filter() {
    const selectedColumn = this.filterForm.value.SearchBy;
    const selectedColumnValue = this.filterForm.value.SearchByValue;
    const filterData =  this.bankBookDetails.value;
    let payload = {
      "FromDate": filterData.fromPeriod ? this.datePipe.transform(filterData.fromPeriod, "yyyy-MM-dd") : '',
      "ToDate": filterData.toPeriod ? this.datePipe.transform(filterData.toPeriod, "yyyy-MM-dd") : '',
      "Bank":filterData.bankId,
      "Date":"",
      "Bank Date":"",
      "Voucher":"",
      "PaymentType":"",
      "Party":"",
      "Reference":"",
      "Debit":"",
      "Credit":"",
      "ReconcileStatus":""
      
    }

    if (!filterData.bankId) {
      Swal.fire('Please Select The Bank');
      return;
    }

    if (selectedColumn === 'Date') {
      payload[selectedColumn] =  this.datePipe.transform(new Date(selectedColumnValue), "yyyy-MM-dd");
    } else {
      payload[selectedColumn] = selectedColumnValue
    }
    this.bankBookService.bankBookDetailsFilter(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.bankBookCountTable = result.data.Table1;
        this.setPage(1);
      }
    })
  }

  clearFilter() {
    this.filterFormCreate();
    this.filter();
  }

  // * pagination start
  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.bankBookCountTable.length, page);

    if (this.bankBookCountTable.length == 0) {
      this.bankBookCountPagedItems = [];
    }

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get current page of items
    this.bankBookCountPagedItems = this.bankBookCountTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.bankBookCountPagedItems1 = this.bankBookCountTable
    // this.bankBookMiniStatement[0].openingBalance =   this.bankBookCountPagedItems[0].Debit
  }


  // * pagination end

  downloadAsPDF() {
    this.bankBookCountPagedItems =  this.bankBookCountPagedItems1
    this.pager = {}
    setTimeout(() => {
      let bankBook = document.getElementById("bankBookTable") as HTMLTableElement;
      this.setPage(1)
      this.excelService.exportToPdf(bankBook, 'bank-statement')
    }, 1000); 
}
  downloadAsCSV() {
    const filterData =  this.bankBookDetails.value;

    if (!filterData.fromPeriod) {
      return
    }

    if (!filterData.toPeriod) {
      return
    }

    if (!filterData.bankId) {
      return
    }

    // update the bank currency value

    this.bankCurrency = this.bankDropdown.find((bank) => bank.BankID == filterData.bankId).CurrencyName

    const payload = {
      "FromDate":filterData.fromPeriod ? new Date(filterData.fromPeriod) : '',
      "ToDate": filterData.toPeriod ? new Date(filterData.toPeriod) : '',
      "Bank": filterData.bankId
    }
    this.bankBookService.getBankBookDetails(payload).subscribe((result: any) => {
      
      if (result.message == 'Success') {
        this.bankBookMiniStatement = result.data.Table;
        this.bankBookCountTable = result.data.Table1
          var summaryList = result.data.Table1;
          for (var i = 0; i < summaryList.length; i++) {
            this.exceldata.push({
              Date: summaryList[i].Date,
              Voucher: summaryList[i].Voucher,
              Party: summaryList[i].Party,
              PaymentMode: summaryList[i].PaymentType,
              Reference: summaryList[i].Reference,
              BankDate: 'NA',
              Debit: summaryList[i].Debit,
              Credit: summaryList[i].Credit,
              ReconciliationStatus: summaryList[i].ReconcileStatus,
            })
          }
          this.excelService.exportToCSV(this.exceldata,'bank-statement')
      }
    })



      }

  downloadAsExcel() {
    const filterData =  this.bankBookDetails.value;

    if (!filterData.fromPeriod) {
      return
    }

    if (!filterData.toPeriod) {
      return
    }

    if (!filterData.bankId) {
      return
    }

    // update the bank currency value

    this.bankCurrency = this.bankDropdown.find((bank) => bank.BankID == filterData.bankId).CurrencyName

    const payload = {
      "FromDate":filterData.fromPeriod ? new Date(filterData.fromPeriod) : '',
      "ToDate": filterData.toPeriod ? new Date(filterData.toPeriod) : '',
      "Bank": filterData.bankId
    }
    this.bankBookService.getBankBookDetails(payload).subscribe((result: any) => {
      
      if (result.message == 'Success') {
        this.bankBookMiniStatement = result.data.Table;
        this.bankBookCountTable = result.data.Table1
          var summaryList = result.data.Table1;
          for (var i = 0; i < summaryList.length; i++) {
            this.exceldata.push({
              Date: summaryList[i].Date,
              Voucher: summaryList[i].Voucher,
              Party: summaryList[i].Party,
              PaymentMode: summaryList[i].PaymentType,
              Reference: summaryList[i].Reference,
              BankDate: 'NA',
              Debit: summaryList[i].Debit,
              Credit: summaryList[i].Credit,
              ReconciliationStatus: summaryList[i].ReconcileStatus,
            })
          }
          this.excelService.exportAsExcelFile(this.exceldata,'bank-statement')
      }
    })
  }

  getOffice(event) {
    
  }

  updateFromDate(data) {
    this.fromMaxDate = this.datePipe.transform(data, "yyyy-MM-dd");


    const filterData = this.bankBookDetails.value;
    const fromDate = filterData.fromPeriod;
    const toDate = filterData.toPeriod;

    if (fromDate > toDate) {
      this.bankBookDetails.controls.fromPeriod.setValue(toDate)
    } else if (fromDate < toDate) {
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
    this.bankBookDetails.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
    this.getOfficeDropdown(true)

  }

  async getOfficeDropdown(isSelectAll = false) {
    const selectedDivisionIds = this.bankBookDetails.value.divisionId;
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

    if(isSelectAll){
      this.bankBookDetails.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
      this.getBankDropdown();
    }

  }

  async getBankDropdown() {
    const selectedOfficeIds = this.bankBookDetails.value.officeId;
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

  resetValue() {
    this.filterForm.controls.SearchByValue.setValue('')
  }
  getVoucherList() {
    let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
    this.dataService.post(service, { CustomerId: 0 }).subscribe((result: any) => {
      if (result.data.Table4.length > 0) { this.modeOfPayment = result.data.Table4; }
    }, error => { });
  }
}
