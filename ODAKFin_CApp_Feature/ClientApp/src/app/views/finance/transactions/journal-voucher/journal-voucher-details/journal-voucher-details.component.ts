import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import Swal from 'sweetalert2';
import { runInThisContext } from 'vm';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-journal-voucher-details',
  templateUrl: './journal-voucher-details.component.html',
  styleUrls: ['./journal-voucher-details.component.css'],
  providers: [DatePipe]
})
export class JournalVoucherDetailsComponent implements OnInit {

  ModifiedOn: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedBy: string = '';
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  statusList: any = [];
  journalForm: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  accountName: any = [];
  currencyList: any = [];
  debitCreditList: any = [];
  journalTableList: any = [];
  payload: any = [];
  autoGenerateCodeList: any[];
  isUpdate: boolean = false;
  editSelectedIdex: any;
  isEditMode: boolean = false;
  journalId: number = 0;
  isCopied: Boolean = false;
  isUpdateMode: Boolean = false;
  isUpdateMode1: Boolean = false;
  headers: string[] = [];
  rows: any[] = [];
  pager: any = {};
  pagedItems: any = [];
  totalDifference: number;
  journalFileList: any = [];
  AmountDifference: any;
  isFinalRecord: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    public commonDataService: CommonService,
    private chartAccountService: ChartaccountService,
    private router: Router,
    private autoCodeService: AutoCodeService,
    private route: ActivatedRoute,
    public ps: PaginationService
  ) { }

  ngOnInit(): void {
    
    this.getNumberRange();
    this.getStatus();
    this.createJournalForm();
    this.getDivisionList();
    // this.getOfficeList();
    this.ChartAccountList();
    this.getCurrency();
    this.getDrCr();
    this.route.params.subscribe(param => {
      if (param.id) {
        
        this.journalId = param.id;
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateMode1 = false;
        this.getJournalInfo();
        this.journalForm.disable();
      } else if(param.copy_id){ 
        this.copyAndPasteFromOldvoucher(param.copy_id);
      } 
     
     
    })
  }


  enableEdit() {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 501,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.journalForm.enable();
            this.isUpdateMode = false;
            this.isUpdateMode1 = true;
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

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const worksheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.headers = jsonData[0];
      this.rows = jsonData.slice(1);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  createJournalForm() {
    this.journalForm = this.fb.group({
      JournalVoucherId: [this.journalId],
      JournalVoucherAccountId: [0],
      DivisionId: [0],
      OfficeId: [0],
      JournalNumber: [''],
      JournalDate: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
      TotalDebit: [0],
      TotalCredit: [0],
      AmountDifference: [0],
      Remarks: [''],
      FileName: [''],
      FileURL: [''],
      IsFinal: [0],
      StatusId: [1],
      CreatedBy: localStorage.getItem('UserID'),

      // Table
      Id: [0],
      AccountId: [0],
      AccountName: [''],
      DrCrId: [0],
      Currency: [1],
      CurrencyName: [''],
      ROE: ['1'],
      Amount: [],
      CompanyCurrencyAmount: [0],
      Narration: [''],
      IsDelete: [0]
    })
  }

  async copyAndPasteFromOldvoucher(JournalVoucherId_copy) {
   
   this.isCopied = true;
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherById`;
    this.dataService.post(service, { Id: JournalVoucherId_copy }).subscribe(async (result: any) => {
      // console.log('result', result)
      
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.journalFileList = [];
        this.journalTableList = [];
        // this.autoCodeGeneration('Journal');
        let info = result.data.Table[0];
        
        // console.log('info', info)

        this.journalForm.patchValue({
          JournalVoucherId: 0 ,
          JournalVoucherAccountId: 0,
          DivisionId:info.DivisionId,
          OfficeId: info.OfficeId,
          JournalNumber: '',
          JournalDate: new Date(),
          Remarks: info.Remarks,
          FileName: info.FileName,
          FileURL: info.FileURL,
          CreatedBy: info.CreatedBy,
          StatusId: 1,
          IsFinal: 0,
          IsDelete: 0
    
        });
        
      }
    })
  }

  getJournalInfo() {
    
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherById`; var payload = { Id: this.journalId }
    this.dataService.post(service, payload).subscribe((result: any) => {
      
      this.journalTableList = [];
      this.journalFileList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        let info = result.data.Table[0];
        // this.statusList = [];
       
        // this.statusList = result.data.Table[0].StateId;
        this.CreatedBy = info.CreatedByName;
        this.CreatedOn = info.CreatedDate;
        this.ModifiedOn = info.UpdatedDate;
        this.ModifiedBy = info.UpdatedByName;

        if (info.IsFinal)
         this.isFinalRecord = true;

        this.journalForm.patchValue({
          JournalVoucherId: this.journalId,
          JournalVoucherAccountId: info.JournalVoucherAccountId ? info.JournalVoucherAccountId : 0,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          StatusId: info.StatusId,
          IsFinal: info.IsFinal ,
          JournalNumber: info.JournalNumber,
          JournalDate: this.datePipe.transform(info.JournalDate, "yyyy-MM-dd"),
          TotalDebit: info.TotalDebit,
          TotalCredit: info.TotalCredit,
          AmountDifference: info.AmountDifference,
          Remarks: info.Remarks,
          CreatedBy: info.CreatedBy,
          IsDelete: info.IsDelete ? info.IsDelete : 0
        });
        this.AmountDifference = info.AmountDifference;
        this.getOfficeList(info.DivisionId);
        if (result.data.Table1.length > 0) {
          this.journalTableList = result.data.Table1;
          this.journalTableList.forEach(object => {
            delete object['CreatedBy'];
            delete object['CreatedDate'];
            delete object['UpdatedBy'];
            delete object['UpdatedDate'];
          });
          this.setPage(1);
          if (result.data.Table2.length > 0) {
            this.journalFileList = result.data.Table2;
          }
        };
      }
    }, error => { });

  }


  setPage(page: number) {
    // if (page < 1 || page > this.pager.totalPages) {
    //   return;
    // }
    // get pager object from service
    this.pager = this.ps.getPager(this.journalTableList.length, page);

    // get current page of items
    this.pagedItems = this.journalTableList.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  // getOfficeList() {
  //   var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
  //   this.dataService.post(service, {}).subscribe((result: any) => {
  //     this.officeList = [];
  //     if (result.message == 'Success' && result.data.Office.length > 0) {
  //       this.officeList = result.data.Office.filter(x => x.Active == true);
  //     }
  //   }, error => { });
  // }

  ChartAccountList() {
    this.commonDataService.getChartaccountsFilter().subscribe(async data => {
        this.accountName = [];
        if (data["data"].length > 0) {
          this.accountName = data["data"];
        }
      });
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


  getDrCr() {
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.debitCreditList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.debitCreditList = result.data.Table;
      }
    }, error => { });
  }

  fileSelected(event) {
    if (event.target.files.length > 0 && this.journalFileList.length < 5) {
      this.journalForm.controls.FileName.setValue(event.target.files[0].name);
      this.journalFileList.push({
        Id: 0,
        JournalVoucherId: this.journalId ? this.journalId : this.journalForm.value.JournalVoucherId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name
      })
    }
    else {
      Swal.fire('A maximum of five files must be allowed.')
    }
  }

  addRow() {
    var validation = "";
    if (this.journalForm.value.AccountId == "" || this.journalForm.value.AccountId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account Name.</span></br>"
    }
    if (this.journalForm.value.DrCrId == "" || this.journalForm.value.DrCrId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Dr/Cr.</span></br>"
    }
    if (this.journalForm.value.Currency == "" || this.journalForm.value.Currency == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency. (if any)</span></br>"
    }
    if (this.journalForm.value.ROE == "" || this.journalForm.value.ROE == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter ROE</span></br>"
    }
    if (this.journalForm.value.Amount == "" || this.journalForm.value.Amount == 0 || this.journalForm.value.Amount == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Amount.</span></br>"
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    let info = this.journalForm.value;
    let account = this.accountName.find(x => x.ChartOfAccountsId == info.AccountId);
    let DrCrId = this.debitCreditList.find(x => x.Id == info.DrCrId);
    let currency = this.currencyList.find(x => x.ID == info.Currency);

    if (this.isEditMode) {
      let editValue = {
        Id: info.Id,
        JournalVoucherId: this.journalId ? this.journalId : info.JournalVoucherId,
        AccountId: info.AccountId,
        AccountName: account.AccountName,
        DrCrId: info.DrCrId,
        DrCrName: DrCrId.TransactionName,
        Currency: info.Currency,
        CurrencyName: currency.CurrencyCode,
        ROE: info.ROE,
        Amount: info.Amount,
        CompanyCurrencyAmount: Number(info.ROE) * Number(info.Amount),
        Narration: info.Narration
      }

      this.journalTableList[this.editSelectedIdex] = editValue
      this.isEditMode = !this.isEditMode;
      this.editSelectedIdex = null;
      this.resetJournalTable();
      this.calculateTotalDebitAndCredit();
      this.setPage(1);
      return;
    }

    this.journalTableList.unshift({
      Id: info.Id,
      JournalVoucherId: this.journalId ? this.journalId : info.JournalVoucherId,
      AccountId: info.AccountId,
      AccountName: account.AccountName,
      DrCrId: info.DrCrId,
      DrCrName: DrCrId.TransactionName,
      Currency: info.Currency,
       CurrencyName: currency.CurrencyCode,
      ROE: info.ROE,
      Amount: info.Amount,
      CompanyCurrencyAmount: Number(info.ROE) * Number(info.Amount),
      Narration: info.Narration
    });
    this.resetJournalTable();
    this.calculateTotalDebitAndCredit();
    this.setPage(1);
  }

  resetJournalTable() {
    this.journalForm.controls['Id'].setValue(0);
    this.journalForm.controls['AccountId'].setValue(0);
    this.journalForm.controls['AccountName'].setValue('');
    this.journalForm.controls['DrCrId'].setValue(0);
    this.journalForm.controls['Currency'].setValue(1);
    this.journalForm.controls['CurrencyName'].setValue('');
    this.journalForm.controls['ROE'].setValue('1');
    this.journalForm.controls['Amount'].setValue('');
    this.journalForm.controls['CompanyCurrencyAmount'].setValue(0);
    this.journalForm.controls['Narration'].setValue('');
  }

  calculateTotalDebitAndCredit() {
    let debit = this.journalTableList.filter(x => x.DrCrId == 1);
    let credit = this.journalTableList.filter(x => x.DrCrId == 2);

    var totalCredit = 0;
    var totalDebit = 0;
    var totalDifference = 0;
    for (let data of debit) totalDebit += Number(data.CompanyCurrencyAmount);
    for (let data of credit) totalCredit += Number(data.CompanyCurrencyAmount);
    totalDifference = Math.abs(totalCredit - totalDebit);
    this.AmountDifference = totalDifference;

    this.journalForm.controls['TotalDebit'].setValue(totalDebit);
    this.journalForm.controls['TotalCredit'].setValue(totalCredit);
    this.journalForm.controls['AmountDifference'].setValue(totalDifference);
  }


  async saveJournalInfo(finial: Number, status: Number, isDelete = false) {
    var validation = "";
    if (this.journalForm.value.DivisionId == "" || this.journalForm.value.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (this.journalForm.value.OfficeId == "" || this.journalForm.value.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    if (this.journalTableList.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Attest one record must be create in the Journal Table.</span></br>"
    }
    if(finial == 1 && !this.isFinalRecord){
      await this.autoCodeGeneration('Journal')
    }
    if (validation != "") {
     if(finial != 2){
      Swal.fire(validation)
      return false;
     }
    }


    
    let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit?`;
    let deleteMsg = `Do you want to Delete this Details?`;

    let combinedText: string;

    if (finial === 1) {
      combinedText = finalMsg;
    } else if (finial === 0) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else {
      combinedText = closeMsg;
    }

      // set Delete flag
    if(isDelete && this.isUpdate){
      this.journalForm.controls['IsDelete'].setValue(1); // Need to uncomment
    }

    //  Its finaled already and candelled
    if (finial == 2 && this.isFinalRecord) {
        this.ViewPage();
        return;
    }

    Swal.fire({
      
      showCloseButton: true,
      title: '',
      icon: 'question',
      html: combinedText,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then(async (result) => {
      
      if (result.isConfirmed) {
        // If canceled 
        if(finial == 2 ){
          this.ViewPage();
          return;
        }

        await this.createPayload(finial, status);
        let service = `${this.globals.APIURL}/JournalVoucher/SaveJournalVoucherInfo`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
           
            Swal.fire(result.data.Message, '', 'success');
            this.isUpdateMode = true;
            this.isUpdateMode1 = true;
       
            if(finial == 0){
                this.journalId = Number(result.data.Id);
                this.isUpdateMode = true;
                this.isUpdateMode1 = true;
            }

            if (this.isUpdate && finial && !this.isFinalRecord) {
              this.updateAutoGenerated();
            }

            if(isDelete && this.isUpdate){
              this.ViewPage();
            }

            if (!this.isUpdate && !this.isFinalRecord) {
              const JournalVoucherId = result.data.Id;
              this.editJournal(JournalVoucherId)
            }
          } 
          

          if (finial == 1) {
            this.ViewPage();
            return;
          }
         
        }, error => {
          console.error(error);
        });
      }
    });
  }


  editJournal(id: number) {
    this.router.navigate(['/views/transactions/journal/journal-details', { id: id, isUpdate: true }]);
  }

  ViewPage(){
      this.router.navigate(['/views/transactions/journal/journal-view']);
  }

  goBack(){
    // If finaled allow to rediret to list page
    if(this.isFinalRecord){
       this.ViewPage();
      return
    }

    // confirm user before redirect to list page
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      html:`Voucher is not yet finalized <br> Do you want to still exit?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
         this.ViewPage();
      }
    })
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Journal Voucher');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  createPayload(finial, status) {
    let journalInfo = this.journalForm.value;
    let Table = {
      JournalVoucherId: this.journalId ? this.journalId : journalInfo.JournalVoucherId,
      JournalVoucherAccountId: journalInfo.JournalVoucherAccountId,
      DivisionId: journalInfo.DivisionId,
      OfficeId: journalInfo.OfficeId,
      JournalNumber: journalInfo.JournalNumber,
      JournalDate: new Date(journalInfo.JournalDate),
      TotalDebit: journalInfo.TotalDebit,
      TotalCredit: journalInfo.TotalCredit,
      AmountDifference: journalInfo.AmountDifference,
      Remarks: journalInfo.Remarks,
      IsFinal:  finial == 1 ? 1 : 0,
      StatusId: status,
      CreatedBy: localStorage.getItem('UserID'),
      IsDelete: journalInfo.IsDelete
    }

    this.payload = {
      "JournalVoucher": {
        "Table": [Table],
        "Table 1": this.journalTableList,
        "Table 2": this.journalFileList
      }
    }
  }

  getNumberRange() {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
    this.dataService.post(service, { Id: 0, ObjectId: 0 }).subscribe((result: any) => {
      if (result.message = "Success") {
        this.autoGenerateCodeList = [];
        if (result.data.Table.length > 0) {
          for (let data of result.data.Table) {
            data.EffectiveDate = this.datePipe.transform(data.EffectiveDate, 'YYYY-MM-dd');
          }
          this.autoGenerateCodeList = result.data.Table;
          //  this.autoCodeGeneration('Journal');
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any) {
    return new Promise(async (resolve, rejects) => {
      if (this.isUpdate) {
        if (event) {
          let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Journal Voucher');
          if (Info.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
            let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
            if (code) this.journalForm.controls['JournalNumber'].setValue(code.trim().toUpperCase());
            resolve(true);
          }
          else {
            Swal.fire('Please create the auto-generation code for journal.')
            resolve(true);
          }
        }
        else {
          this.journalForm.controls['JournalNumber'].setValue('');
          resolve(true);
        }
      }
    })
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (this.journalForm.value.DivisionId && this.journalForm.value.OfficeId) {
      
      officeInfo = this.officeList.find(x => x.ID == this.journalForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.journalForm.value.DivisionId);
    }

    for (var i = 0; i < sectionInfo.length; i++) {
      var condition = i == 0 ? sectionInfo[i].sectionA : i == 1 ? sectionInfo[i].sectionB : i == 2 ? sectionInfo[i].sectionC : i == 3 ? sectionInfo[i].sectionD : sectionInfo[i].sectionD;
      switch (condition) {
        case 'Office Code (3 Chars)': i == 0 ? sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 1 ? sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 2 ? sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 3 ? sectionD = officeInfo.OfficeName : ''; break;
        case 'Running Number (3 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (4 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (5 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (6 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (7 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Office Code (4 Chars)': i == 0 ? sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 1 ? sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 2 ? sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 3 ? sectionD = officeInfo.OfficeName : ''; break;
        case 'Division Code (4 Chars)': i == 0 ? sectionA = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 1 ? sectionB = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 2 ? sectionC = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 3 ? sectionD = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : ''; break;
        case 'Division Code (3 Chars)': i == 0 ? sectionA = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 1 ? sectionB = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 2 ? sectionC = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 3 ? sectionD = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : ''; break;
        case 'FY (4 Char e.g. 2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (5 Char e.g. 22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (6 Char e.g. FY2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (7 Char e.g. FY22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POFD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        default: break;
      }
    }
    return { sectionA: sectionA, sectionB: sectionB, sectionC: sectionC, sectionD: sectionD };
  }

  OnClickRadio(index) {
    this.editSelectedIdex = index;
  }


  OnClickDeleteValue() {
    if (this.editSelectedIdex >= 0 && this.editSelectedIdex != null) {
      this.journalTableList.splice(this.editSelectedIdex, 1);
      this.editSelectedIdex = null;
      this.calculateTotalDebitAndCredit();
      this.setPage(1);
    }
    else {
      Swal.fire('Please select the Item!!');
    }
  }

  OnClickEditValue() {
    let editRow = this.journalTableList[this.editSelectedIdex];
    this.journalForm.patchValue({
      Id: editRow.Id,
      AccountId: editRow.AccountId,
      AccountName: editRow.AccountName,
      DrCrId: editRow.DrCrId,
      Currency: editRow.Currency,
      CurrencyName: editRow.CurrencyName,
      ROE: editRow.ROE,
      Amount: editRow.Amount,
      CompanyCurrencyAmount: editRow.CompanyCurrencyAmount,
      Narration: editRow.Narration
    })
    this.isEditMode = !this.isEditMode;
  }

  OnClickDeleteValueFile(index: number) {
    this.journalFileList.splice(index, 1);
  }
  getStatus() {
    
    var service = `${this.globals.APIURL}/JournalVoucher/GetJournalVoucherDropDownList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      // console.log(result, 'status result')
       this.statusList = result.data.Table1
    }, error => { });
  }
  getOfficeList(id: number) {
    // console.log(id, "id")
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    })
  }

}