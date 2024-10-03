import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material';
import jsPDF from 'jspdf';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { ExcelService } from 'src/app/services/excel.service';
import { BankSummeryService } from 'src/app/services/financeModule/bank-summery.service';
import { ExportFileService } from 'src/app/shared/service/export-file.service';

@Component({
  selector: 'app-bank-summary',
  templateUrl: './bank-summary.component.html',
  styleUrls: ['./bank-summary.component.css']
})
export class BankSummaryComponent implements OnInit {
  // * pagination start
  @ViewChild('allSelected') private allSelected: MatOption;      
  @ViewChild('allSelected1') private allSelected1: MatOption;
  @Output() switchToBankBook = new EventEmitter();
  // @ViewChild('allSelected') private allSelected: MatOption;
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end
  // * dropdown
  cashSummaryTable = [];
  bankSummeryTablePagedItems: any[];
  divisionList: any = [];
  OfficeList: any = [];
  totalCountByCurrency = [
    {
      "CurrencyID": 1,
      "TotalClosingBalanceSum": 5080810.0
    },
    {
      "CurrencyID": 4,
      "TotalClosingBalanceSum": 1270202.5
    }
  ];
  cashSummaryAmountTable = [];

  bankFilterForm: FormGroup;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable("DateFormat");
  currentDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromMaxDate = this.currentDate;
  toMaxDate = this.currentDate;
  exceldata: any = [];
  bankSummeryTablePagedItems1: any = [];
  allValues: boolean;

  constructor(
    private bankSummeryService: BankSummeryService,
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private ps: PaginationService,
    private fb: FormBuilder,
    public exportTo: ExportFileService,
    public excelService : ExcelService

  ) {
  }

  ngOnInit(): void {
    this.createBankSummaryForm();
    this.getDivisionDropDownList();
  }

  createBankSummaryForm() {
    this.bankFilterForm = this.fb.group({
      // FromDate: [ this.currentDate],
      StatementDate: [this.currentDate],
      Division: [''],
      Office: ['']
    });
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.allValues = true
      this.bankFilterForm.controls.Division.patchValue([...this.divisionList.map(item => item.ID), 0]);
      this.getOfficeDropDownList(this.bankFilterForm.value.Division)
    }
    else {
      this.bankFilterForm.controls.Division.patchValue([]);
      this.bankFilterForm.controls.Office.patchValue([]);
      this.allValues = false
      this.OfficeList = []
    }
  }

  tosslePerOne(event: any) {
    this.allValues = true
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    this.getOfficeDropDownList(this.bankFilterForm.value.Division)
    if (this.bankFilterForm.controls.Division.value.length == this.divisionList.length)
      this.allSelected.select();
  }

   tosslePerOneOffice(event: any){ 
    if (this.allSelected1.selected) {  
     this.allSelected1.deselect();
     return false;
 }
   if(this.bankFilterForm.controls.Office.value.length == this.OfficeList.length)
     this.allSelected1.select();
 }
   toggleAllSelectionOffiece() {
     if (this.allSelected1.selected) {
       this.bankFilterForm.controls.Office.patchValue([...this.OfficeList.map(item => item.ID), 0]);
     } else {
       this.bankFilterForm.controls.Office.patchValue([]);
     }
   } 

  getSummaryList() {
    let info = this.bankFilterForm.value;
    let payLoad = { 
      OfficeIds: info.Office, 
      StatementDate: info.StatementDate ? info.StatementDate: '',
      // ToDate: info.ToDate ? this.datePipe.transform(info.ToDate, "dd-MM-yyyy") : '',
    }
    this.bankSummeryService.getBankSummeryList(payLoad).subscribe((result: any) => {
      this.bankSummeryTablePagedItems = [];
      this.cashSummaryTable = [];
      if (result.message == "Success") {
        this.cashSummaryTable = result['data'].Table;
        this.totalCountByCurrency = result.totalCountByCurrency;
        this.calculateAmount(this.cashSummaryTable);
      }
    })
  }
  
  getTotalAmountByCurrency(CurrencyName){
    const totalByCurrency = this.totalCountByCurrency.find((item) =>  item.CurrencyID ===  CurrencyName)
    return totalByCurrency ? totalByCurrency : ''
  }

  calculateAmount(info) {
    let sortData = info.sort(function (x, y) { return x.CurrencyID - y.CurrencyID; });
    var listInfo = [];
    var i = 0;
    var currentCurrencyID = sortData[0].CurrencyID;
    for (let data of sortData) {
      i = i + 1;
      if (currentCurrencyID == data.CurrencyID) {
        listInfo.push(data);
        if (info.length == i) {
          let totalCurrencyInfo = this.totalCountByCurrency.find(x => x.CurrencyID == currentCurrencyID)
          listInfo.push({
            BankName: '',
            AccountNo: '',
            CurrencyName: 'Total',
            TotalClosingBalance: totalCurrencyInfo.TotalClosingBalanceSum,
            bankBalance: '',
            dueAmount: '',
            StatementUploadedTill: ''
          });
        }
      }
      else {
        let totalCurrencyInfo = this.totalCountByCurrency.find(x => x.CurrencyID == currentCurrencyID)
        listInfo.push({
          BankName: '',
          AccountNo: '',
          CurrencyName: 'Total',
          TotalClosingBalance: totalCurrencyInfo.TotalClosingBalanceSum,
          bankBalance: '',
          dueAmount: '',
          StatementUploadedTill: ''
        });
        currentCurrencyID = data.CurrencyID;
        if (currentCurrencyID == data.CurrencyID) {
          listInfo.push(data);
          if (info.length == i) {
            let totalCurrencyInfo = this.totalCountByCurrency.find(x => x.CurrencyID == currentCurrencyID)
            listInfo.push({
              BankName: '',
              AccountNo: '',
              CurrencyName: 'Total',
              TotalClosingBalance: totalCurrencyInfo.TotalClosingBalanceSum,
              bankBalance: '',
              dueAmount: '',
              StatementUploadedTill: ''
            });
          }
        }
      }
    }
    this.cashSummaryTable = listInfo;
    this.setPage(1);
  }
  // * pagination start
  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.cashSummaryTable.length, page);

    if (this.cashSummaryTable.length == 0) {
      this.bankSummeryTablePagedItems = [];
    }

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get current page of items
    this.bankSummeryTablePagedItems = this.cashSummaryTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.bankSummeryTablePagedItems1 = this.cashSummaryTable
  }
  // * pagination end


  updateFromDate(data) {
    this.fromMaxDate = this.datePipe.transform(data, "yyyy-MM-dd");

    const filterData = this.bankFilterForm.value;
    const fromDate = filterData.FromDate;
    const toDate = filterData.ToDate;

    if (fromDate > toDate) {
      this.bankFilterForm.controls.FromDate.setValue(toDate)
    } else if (fromDate < toDate) {
    }
  }

  getBankSummeryFilter() {
    const payload = {}  
  }



  downloadAsPDF() {
    this.bankSummeryTablePagedItems =  this.bankSummeryTablePagedItems1
    this.pager = {}
    setTimeout(() => {
      let bankBook = document.getElementById("bankSummaryTable") as HTMLTableElement;
      this.setPage(1)
      this.excelService.exportToPdf(bankBook, 'bank-statement')
    }, 1000); 
}

  downloadAsCSV() {
    let info = this.bankFilterForm.value;
    let payLoad = { OfficeIds: info.Office, StatementDate: new Date(info.StatementDate) }
    this.bankSummeryService.getBankSummeryList(payLoad).subscribe((result: any) => {
      if (result.message == "Success") {
        var summaryList = result['data'].Table;;
        for (var i = 0; i < summaryList.length; i++) {
          this.exceldata.push({
            Bank: summaryList[i].BankName,
            Account: summaryList[i].AccountNo,
            Currency: summaryList[i].CurrencyName,
            BalanceInBank: summaryList[i].TotalClosingBalance,
            BalnceInBook: summaryList[i].TotalBankClosingBalance,
            UnreconciledTransactions: summaryList[i].dueAmount,
            BankStatementTill: summaryList[i].StatementUploadedTill,
          })
        }
        this.excelService.exportToCSV(this.exceldata,'bank-statement')
       
      }
    })
  }
  downloadAsExcel() {
    let info = this.bankFilterForm.value;
    let payLoad = { OfficeIds: info.Office, StatementDate: new Date(info.StatementDate) }
    this.bankSummeryService.getBankSummeryList(payLoad).subscribe((result: any) => {
      this.bankSummeryTablePagedItems = [];
      this.cashSummaryTable = [];
      if (result.message == "Success") {
        this.cashSummaryTable = result['data'].Table;
        var summaryList = result['data'].Table;;
        for (var i = 0; i < summaryList.length; i++) {
          this.exceldata.push({
            Bank: summaryList[i].BankName,
            Account: summaryList[i].AccountNo,
            Currency: summaryList[i].CurrencyName,
            BalanceInBank: summaryList[i].TotalClosingBalance,
            BalnceInBook: summaryList[i].TotalBankClosingBalance,
            UnreconciledTransactions: summaryList[i].dueAmount,
            BankStatementTill: summaryList[i].StatementUploadedTill,
          })
        }
        this.excelService.exportAsExcelFile(this.exceldata, 'bank-statement');
       
      }
    })
  }

  getDivisionDropDownList() {
    let payload = { SelectedIds: [], IsForDivision: 1, IsFromDivision: 0, IsFromOffice: 0 };
    this.commonDataService.getMultiSelectDivisionOfficeBankList(payload).subscribe(result => {
      this.divisionList = [];
      if (result['data'].Table.length > 0) {
        this.divisionList = result['data'].Table;
        this.bankFilterForm.controls.Division.patchValue([...this.divisionList.map(item => item.ID), 0]);
        const divisionIds = this.bankFilterForm.value.Division;
        this.getOfficeDropDownList(divisionIds, true); // get all office based on division
      }
    })
  }

  getOfficeDropDownList(event, isSelectAll = false) {
    let payload = { SelectedIds: event, IsForDivision: 0, IsFromDivision: 1, IsFromOffice: 0 };
    this.commonDataService.getMultiSelectDivisionOfficeBankList(payload).subscribe(result => {
      this.OfficeList = [];
      if (result['data'].Table.length > 0) {
        this.OfficeList = result['data'].Table;
        if(isSelectAll){
          this.bankFilterForm.controls.Office.patchValue([...this.OfficeList.map(item => item.ID), 0]);
          this.getSummaryList()
        }
      } else {
        this.bankFilterForm.controls.Office.patchValue([]);
      }
      if(this.allValues == false){
        this.OfficeList = []
         }
    })
  }

  forwardToBankBook(bankId){
    let info = this.bankFilterForm.value;
    let payLoad = { 
      OfficeIds: info.Office, 
      DivisionIds: info.Division,
      FromDate: info.StatementDate ? info.StatementDate : '',
      bankId: bankId
    }
    this.switchToBankBook.emit(payLoad)
  }



}
