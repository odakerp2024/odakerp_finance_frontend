import { Component, OnInit, ViewChild } from '@angular/core';
import { BankSummeryService } from '../../../../../../services/financeModule/bank-summery.service';
import { CommonDataService } from '../../../../../../services/common-data.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { BankStatementService } from '../../../../../../services/financeModule/bank-statement.service';
import { DatePipe } from '@angular/common';
import { PaginationService } from 'src/app/pagination.service';
import { FormBuilder } from '@angular/forms';
import { ExportFileService } from 'src/app/shared/service/export-file.service';
import { ExcelService } from 'src/app/services/excel.service';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-bank-statement',
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./bank-statement.component.css']
})
export class BankStatementComponent implements OnInit {
    // * pagination start
pager: any = {};// pager object  
pagedItems: any[];// paged items
// * pagination end
@ViewChild('allSelected') private allSelected: MatOption;      
@ViewChild('allSelected1') private allSelected1: MatOption; 
  divisionDropdown = [];
  bankStatementTable = [];
  bankDropdown = [];
  officeDropdown = [];
  divisionList = [];
  bankStatementTablePagedItems = [];
  bankStatementTablePagedItems1 = []
  bankList = [];
  selectedBank: any = {};
  file: any;
  StatementUploadedDate = ''
  templateDownloadPath = ''
  asd = false
  asd1 = true
  currentDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable("DateFormat");
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  fromMaxDate = this.currentDate;
  toMaxDate = this.currentDate;

  // reviewPeriod = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  // reviewDivision = '';
  // reviewOffice = '';
  // reviewBank = '';
  bankSummaryDetailsForm: any;
  bankStatementTable1: any = [];
  exceldata: any = [];
  allValues: boolean;
  constructor(
    private bankStatementService: BankStatementService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private ps: PaginationService,
    private fb: FormBuilder,
    public exportTo: ExportFileService,
    public excelService : ExcelService,
    private commonDataService: CommonService
  ) {

  }

  ngOnInit(): void {
    this.getBankSummeryDetailForm();
    this.getDivisionDropdown();
    this.getExcelUploadList();
    this.getBankList();
  }

  fileSelected(event: any) {
    // Handle file selection
    this.file = event.target.files[0];
}

uploadFile() {
  // Check if the file, selected bank, and date are provided
  if (this.file && this.selectedBank && this.StatementUploadedDate) {
      const selectedBank = this.bankList.find((bank) => bank.BankID == this.selectedBank);
      const formData = new FormData();
      formData.append('file', this.file); // Append file
      formData.append('BankId', selectedBank.BankID);
      formData.append('StatementUploadedDate', new Date(this.StatementUploadedDate).toISOString());
      formData.append('BankName', selectedBank.BankName);

      this.bankStatementService.uploadFile(formData).subscribe((result: any) => {
          if (result.message === 'Success') {
              Swal.fire(result.data);

              // Reset file input and variables
              this.selectedBank = '';
              this.file = null;
              (document.getElementById('myFile') as HTMLInputElement).value = ''; // Clear the file input
              this.templateDownloadPath = '';
              this.StatementUploadedDate = '';
          }
      });
  } else {
      // Show error message if any of the required fields are missing
      Swal.fire('Select The Bank, File And Date To Upload The File.');
  }
}


  // fileSelected(event) {
  //   debugger
  //   // console.log('xls file', event);
  //   this.file = event.target.files[0];
  // }
  

  // uploadFile() {
  //   debugger
  //   if (this.file && this.selectedBank) {
  //     const selectedBank = this.bankList.find((bank) => { return bank.BankID == this.selectedBank });
  //     const formData = new FormData();
  //     formData.append('file', this.file   ); // Append files
  //     formData.append('BankId', selectedBank.BankID);
  //     formData.append('StatementUploadedDate', new Date(this.StatementUploadedDate).toISOString());
  //     formData.append('BankName',selectedBank.BankName);
  //     this.bankStatementService.uploadFile(formData).subscribe((result: any) => {
  //       if (result.message == 'Success') {
  //         Swal.fire(result.data);
  //         this.selectedBank = '';
  //         this.file = '';
  //         this.templateDownloadPath = '';
  //         this.StatementUploadedDate = '';
  //       }
  //     }) 
  //   } else {
  //     Swal.fire('Select The Bank, File And Date To Uploaded The File.');
  //   }
  // }

  getBankSummeryDetailForm() {
    this.bankSummaryDetailsForm = this.fb.group({
      fromPeriod: [this.currentDate],
      toPeriod: [this.currentDate],
      divisionId: [],
      officeId: [],
      bankId: ['']
    })
  }

  tosslePerOne(event: any) {
    this.allValues = true
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    } else {
      
    }
    this.getOfficeDropdown();
    // If no division then empty the office
    if(!this.bankSummaryDetailsForm.value.divisionId.length){
      this.bankSummaryDetailsForm.controls.officeId.patchValue([]);
      this.bankSummaryDetailsForm.controls.bankId.patchValue('');
    }
    this.getBankDropdown();
    if (this.bankSummaryDetailsForm.controls.divisionId.value.length == this.divisionDropdown.length)
      this.allSelected.select();
  }

   toggleAllSelection() {
     if (this.allSelected.selected) {
      this.allValues = true
       this.bankSummaryDetailsForm.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
      //  this.getBankDropdown();
      this.getOfficeDropdown()
     } 
     else {
       this.bankSummaryDetailsForm.controls.divisionId.patchValue([]);
       this.allValues = false
       this.officeDropdown = []
       this.bankDropdown = [];
       this.bankSummaryDetailsForm.controls.bankId.patchValue('');
       this.bankSummaryDetailsForm.controls.officeId.patchValue([]);
     }
     
   }
  tosslePerOneOffice(event: any) {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      return false;
    } else { }
    this.getBankDropdown();
    if (this.bankSummaryDetailsForm.controls.officeId.value.length == this.officeDropdown.length)
      this.allSelected1.select();
  }

   toggleAllSelectionOffiece() {
     if (this.allSelected1.selected) {
       this.bankSummaryDetailsForm.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
       this.getBankDropdown();
     } else {
       this.bankSummaryDetailsForm.controls.officeId.patchValue([]);
       this.bankDropdown = [];
       this.bankSummaryDetailsForm.controls.bankId.patchValue('');
     }
   } 
  getExcelUploadList() {
    const filterData = this.bankSummaryDetailsForm.value;
    // if (!filterData.bankId) {
    //   return;
    // }

    // if (!filterData.fromPeriod) {
    //   return;
    // }

    // if (!filterData.toPeriod) {
    //   return;
    // }
    
    const payload = {
      "FromDate": filterData.fromPeriod ? this.datePipe.transform(filterData.fromPeriod, "dd-MM-yyyy") : '',
      "ToDate": filterData.toPeriod ? this.datePipe.transform(filterData.toPeriod, "dd-MM-yyyy") : '',
      "Bank": filterData.bankId
    };
    // const payload = {FromDate: "01-01-2023", ToDate: "12-12-2023", Bank: "26"}
    this.bankStatementService.getExcelUploadList(payload).subscribe((result: any) => {
      if (result.message == 'Success'){
        this.bankStatementTable = result.data.Table;
        this.bankStatementTable1 = result.data.Table;
        this.setPage(1);
      }
    })
  }

  clearUpload() {
    this.file = null; // Clear the file
    this.selectedBank = ''; // Clear the selected bank
    this.StatementUploadedDate = ''; // Clear the date field
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
    this.bankSummaryDetailsForm.controls.divisionId.patchValue([...this.divisionDropdown.map(item => item.ID), 0]);
    this.getOfficeDropdown(true)
  }


  async getOfficeDropdown(isSelectAll = false) {
    const selectedDivisionIds = this.bankSummaryDetailsForm.value.divisionId;
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
      this.bankSummaryDetailsForm.controls.officeId.patchValue([...this.officeDropdown.map(item => item.ID), 0]);
      this.getBankDropdown();
    }
  }

  async getBankDropdown() {
    const selectedOfficeIds = this.bankSummaryDetailsForm.value.officeId;
    const payload = {
      "SelectedIds": [...selectedOfficeIds],
      "IsForDivision": 0,
      "IsFromDivision": 0,
      "IsFromOffice": 1
    };
    const bankDropdown: any = await this.commonDropdown(payload);
    this.bankDropdown = [];
    this.bankDropdown.push(...bankDropdown);
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

  // * pagination start
  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.bankStatementTable?.length, page);

    if(this.bankStatementTable.length == 0){
      this.bankStatementTablePagedItems = [];
      this.bankStatementTablePagedItems1 = [];
    }

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get current page of items
    this.bankStatementTablePagedItems = this.bankStatementTable.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.bankStatementTablePagedItems1 = this.bankStatementTable;
    console.log(this.bankStatementTablePagedItems1,'jdhgfjshdgfjh');
    
  }
  // * pagination end
  

  downloadAsPDF() {
      this.bankStatementTablePagedItems =  this.bankStatementTablePagedItems1
      this.pager = {}
      setTimeout(() => {
        let bankBook = document.getElementById("bankStatementTable") as HTMLTableElement;
        this.setPage(1)
        this.excelService.exportToPdf(bankBook, 'bank-statement')
      }, 1000); 
  }
  downloadAsCSV() {
    // return

    // if (this.bankStatementTablePagedItems.length < 1) {
    //   return;
    // }
    // const bankBook = document.getElementById("bankStatementTable") as HTMLTableElement;
    // this.exportTo.exportToCSV(bankBook, 'bank-statement')
    const filterData = this.bankSummaryDetailsForm.value;
    if (!filterData.bankId) {
      return;
    }

    if (!filterData.fromPeriod) {
      return;
    }

    if (!filterData.toPeriod) {
      return;
    }
    
    const payload = {
      "FromDate": filterData.fromPeriod ? this.datePipe.transform(filterData.fromPeriod, "dd-MM-yyyy") : '',
      "ToDate": filterData.toPeriod ? this.datePipe.transform(filterData.toPeriod, "dd-MM-yyyy") : '',
      "Bank": filterData.bankId
    };
    this.bankStatementService.getExcelUploadList(payload).subscribe((result: any) => {
      if (result.message == 'Success'){
        this.bankStatementTable = result.data.Table;
        this.bankStatementTable1 = result.data.Table;
        var summaryList = result.data.Table;
        for (var i = 0; i < summaryList.length; i++) {
        this.exceldata.push({
        Date: summaryList[i].StatementDate,
        BankReference: summaryList[i].BankReference,
        Deposits: summaryList[i].Deposits,
        Withdrawals: summaryList[i].Withdrawals,
        BankClosingBalance: summaryList[i].BankClosingBalance,
        IsReconcile: summaryList[i].IsReconcile,
        Credit: summaryList[i].Credit,
      })
    }
    this.excelService.exportToCSV(this.exceldata,'bank-statement')
      }
    })
  }

  downloadAsExcel() {
    // return

    if (this.bankStatementTablePagedItems.length < 1) {
      return;
    }
    const bankBook = document.getElementById("bankStatementTable") as HTMLTableElement;
    this.exportTo.exportToExcel(bankBook, 'bank-statement')



    const filterData = this.bankSummaryDetailsForm.value;
    if (!filterData.bankId) {
      return;
    }

    if (!filterData.fromPeriod) {
      return;
    }

    if (!filterData.toPeriod) {
      return;
    }
    
    const payload = {
      "FromDate": filterData.fromPeriod ? this.datePipe.transform(filterData.fromPeriod, "dd-MM-yyyy") : '',
      "ToDate": filterData.toPeriod ? this.datePipe.transform(filterData.toPeriod, "dd-MM-yyyy") : '',
      "Bank": filterData.bankId
    };
    this.bankStatementService.getExcelUploadList(payload).subscribe((result: any) => {
      if (result.message == 'Success'){
        this.bankStatementTable = result.data.Table;
        this.bankStatementTable1 = result.data.Table;
        var summaryList = result.data.Table;
        for (var i = 0; i < summaryList.length; i++) {
        this.exceldata.push({
        Date: summaryList[i].StatementDate,
        BankReference: summaryList[i].BankReference,
        Deposits: summaryList[i].Deposits,
        Withdrawals: summaryList[i].Withdrawals,
        BankClosingBalance: summaryList[i].BankClosingBalance,
        IsReconcile: summaryList[i].IsReconcile,
        Credit: summaryList[i].Credit,
      })
    }
    this.excelService.exportAsExcelFile(this.exceldata,'bank-statement')
      }
    })

  }

  updateFromDate(data) {
    
    this.fromMaxDate = this.datePipe.transform(data, "yyyy-MM-dd");
    const filterData = this.bankSummaryDetailsForm.value;


    const fromDate = filterData.fromPeriod;
    const toDate = filterData.toPeriod;

    if (fromDate > toDate) {
      this.bankSummaryDetailsForm.controls.fromPeriod.setValue(toDate)
      // console.log('fromDate is greater than toDate');
    } else if (fromDate < toDate) {
      // console.log('fromDate is less than toDate');
    }

  }

  getBankTemplateURL(bankName) {
    const payload = {
      "BankName": bankName
    }
    this.bankStatementService.getBankTemplate(payload).subscribe((result: any) => {
      if(result.message == "Success"){
        let templateDetails = result['data'].Table;
        this.templateDownloadPath =  templateDetails[0] ? templateDetails[0].FileUrl : ''; 
      }
    })

  }
  
  // * make template link as downloadable 
  downloadTemplateFile() {
    if (!this.templateDownloadPath) {
      return Swal.fire('To download a template, please choose a bank.');
    }
    const link = document.createElement('a');
    link.href = this.templateDownloadPath;
    link.target = '_blank';
    link.download = 'template.xlsx'; // Specify the desired filename with extension
    link.click();
  }

  getBankList() {
    let payload = {
      AccountNo: '',
      BankName: '',
      Currency: '',
      IFSCCode: '',
      IsActive: 1,
      SwiftCode: null
     }
     this.commonService.getbankaccountFilter(payload).subscribe((result: any) => {
      
      if (result.message == "Success") {
        this.bankList = result['data'].Table;
      }
    })
  }
  // trim string
  truncateString(bankReference: string, length = 25): string {
    if (bankReference && bankReference.length > length) {
      return bankReference.slice(0, length) + '...';
    } else {
      return bankReference || '-';
    }
  }

  categorySelected(event) {
    
  }

}
