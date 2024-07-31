import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
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

@Component({
  selector: 'app-adjustment-voucher-info',
  templateUrl: './adjustment-voucher-info.component.html',
  styleUrls: ['./adjustment-voucher-info.component.css'],
  providers: [DatePipe]
})
export class AdjustmentVoucherInfoComponent implements OnInit {


  isUpdate: boolean = false;
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  statusList: any = [];
  FileList: any = [];
  isCopied: boolean = false;
  isUpdateMode: boolean = false;
  isUpdateMode1: boolean = false;
  AdjustmentCreateForm: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  AdjustmentId: number = 0;
  AccountId: any
  autoGenerateCodeList: any = [];
  debitCreditList: any = [];
  currencyList: any = [];
  accountName: any = [];
  groupedCoaTypeList: { [key: string]: any[] };
  isEditMode: boolean = false;
  AdjustmentTableList: any = [];
  editSelectedIdex: any;
  pager: any = {};
  pagedItems: any = [];
  AmountDifference: any;
  payload: any = {};
  isFinalRecord: boolean = false;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  entityCurrency = this.commonDataService.getLocalStorageEntityConfigurable('Currency');
  entityCurrency1 = this.commonDataService.getLocalStorageEntityConfigurable('Currency').substring(0, 3);
  AdjustmentForm: any;
  accountMappingIds: any;
  selectedAccountItemObj = {}
  editAccountTable = false;
  accountTypeList = [];
  AccountTypeId: any;
  validation1: any;
  coaMasterData: any;
  CustomerData: any;
  typeId = 0;
  typeIdArray: any;
  accountNameCheck: any;
  resultAccountTypeList: any;
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromMaxDate = this.currentDate;
  selectedFile: File = null;
  fileUrl: string;
  // groupedCoaTypeList: any = {
  //   'AccountName': [],
  //   'CustomerName': [],
  //   'VendorName': []
  // }
  constructor(
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public commonDataService: CommonService,
    private autoCodeService: AutoCodeService,
    public ps: PaginationService,
    private router: Router,
    private route: ActivatedRoute,
    private commonservice: CommonService,
    private chartAccountService: ChartaccountService,
    
  ) { }

  ngOnInit(): void {
    this.createAdjustmentForm();
    this.getNumberRange();
    this.getStatus();
    this.getDivisionList();
    
    this.getDrCr();
    
    this.getCurrency();
    this.ChartAccountList();
    this.route.params.subscribe(param => {
      if (param.id) {
        this.AdjustmentId = param.id;
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateMode1 = false;
        this.getAdjustmentInfo();
        this.AdjustmentCreateForm.disable();
      }else if(param.copy_id){ 
        this.copyAndPasteFromOldvoucher(param.copy_id);
      } 
    })
  }

  updateValue() {
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
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.AdjustmentCreateForm.enable(); 
            this.enableEdit();
            this.isUpdateMode = false; 
            this.isUpdateMode1= true;
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

  deleteValue() {
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

          if (data[0].Delete_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.saveInfo(1,true);
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

  createAdjustmentForm() {
    this.AdjustmentCreateForm = this.fb.group({
      AdjustmentVoucherId: [this.AdjustmentId],
      DivisionId: [0],
      OfficeId: [0],
      AVNumber: [''],
      AVDate: [''],
      TotalDebit: [''],
      TotalCredit: [''],
      AmountDifference: [''],
      Remarks: [''],
      CreatedBy: localStorage.getItem('UserID'),
      StatusId: [1],
      IsFinal: [0],

      // Table
      Id: [0],
      AccountType: [0],
      AccountId: [0],
      DrCrId: [0],
      Currency:  [0],
      ROE:  [''],
      Amount: [],
      CompanyCurrencyAmount: [0],
      Narration: [''],
      ExchangeRate: [''],
      AccountName: [''],
      // CustomerName:[''],
      // VendorName:[''],
      DrCrName: [''],
      CurrencyName: [''],
      IsDelete: [0],
      // AccountType:['']
      
    })
    // Set initial value of StatusId based on your condition
  const statusId = this.AdjustmentCreateForm.get('StatusId').value;
  this.AdjustmentCreateForm.get('StatusId').setValue(statusId == 1 ? 'Draft' : statusId == 2 ? 'Confirmed' : 'Cancelled');

  }
  getStatusDisplayValue(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Draft';
      case 2:
        return 'Confirmed';
      case 3:
        return 'Canceled';
      default:
        return '';
    }
  }
  async copyAndPasteFromOldvoucher(AdjustmentVoucherId_copy) {
   
    this.isCopied = true;
    var service = `${this.globals.APIURL}/AdjustmentVoucher/GetAdjustmentVoucherById`;
    this.dataService.post(service, { Id: AdjustmentVoucherId_copy }).subscribe(async (result: any) => {
      
      
      if (result.message == 'Success' && result.data.Table.length > 0) {
        
        this.FileList = [];
        this.AdjustmentTableList = [];
        this.autoCodeGeneration('Adjustment');
        
        let info = result.data.Table[0];

        this.AdjustmentCreateForm.patchValue({
          AdjustmentVoucherId: 0,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          AVNumber: '',
          AVDate: info.AVDate,
          Remarks: info.Remarks,
          CreatedBy: info.CreatedBy,
          StatusId: 1,
          IsFinal: 0,
          IsDelete: 0
        });
        this.getOfficeList(info.DivisionId);
      }

    })
  }

  getAdjustmentInfo() {
    var service = `${this.globals.APIURL}/AdjustmentVoucher/GetAdjustmentVoucherById`; var payload = { Id: this.AdjustmentId }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.AdjustmentTableList = [];
      this.FileList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        let info = result.data.Table[0];

        this.CreatedBy = info.CreatedByName;
        this.CreatedOn = info.CreatedDate;
        this.ModifiedOn = info.UpdatedDate;
        this.ModifiedBy = info.UpdatedByName;

        if (info.StatusId == 2) 
        this.isFinalRecord = true;
        this.AdjustmentCreateForm.patchValue({
          StatusId: info.StatusId ,
          AdjustmentVoucherId: this.AdjustmentId,
         
          IsFinal: info.IsFinal ? 1 : 0,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          AVNumber: info.AVNumber,
          AVDate: this.datePipe.transform(info.AVDate, "yyyy-MM-dd"),
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
        
          this.AdjustmentTableList = result.data.Table1;
          this.setPage(1);
          if (result.data.Table2.length > 0) {
            this.FileList = result.data.Table2;
          }
        };
      }
    }, error => { });
  }


  // fileSelected(event) {
  //   if (event.target.files.length > 0 && this.FileList.length < 5) {
  //     this.FileList.push({
  //       Id: 0,
  //       AdjustmentVoucherId: this.AdjustmentId,
  //       FileName: event.target.files[0].name,
  //       FilePath: event.target.files[0].name
  //     })
  //   }
  //   else {
  //     Swal.fire('A maximum of five files must be allowed.')
  //   }
  // }

  fileSelected(event) {
    if (event) {
      this.selectedFile = event.target.files[0];
      const filedata = new FormData();
      filedata.append('file', this.selectedFile, this.selectedFile.name)

      this.commonservice.AttachUpload(this.selectedFile).subscribe(data => {
        if (data) {

      this.FileList.push({
        Id: 0,
        AdjustmentVoucherId: this.AdjustmentId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name,
        UniqueFilePath: data.FileNamev,

      });
    }
  },
    (error: HttpErrorResponse) => {
      Swal.fire(error.message, 'error')
    });
}
    else {
      Swal.fire('A maximum of five files must be allowed.')  
    }   
  }

   /*File Download*/
download = (fileUrl) => {
  this.fileUrl = "UploadFolder\\Attachments\\" + fileUrl;
  this.commonDataService.download(fileUrl).subscribe((event) => {

      if (event.type === HttpEventType.UploadProgress){ 
        
      }
          // this.progress1 = Math.round((100 * event.loaded) / event.total);

      else if (event.type === HttpEventType.Response) {
          // this.message = 'Download success.';
          this.downloadFile(event);
      }
  });
}

private downloadFile = (data: HttpResponse<Blob>) => {
  const downloadedFile = new Blob([data.body], { type: data.body.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = this.fileUrl;
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}

  OnClickDeleteValueFile(index: number) {
    this.FileList.splice(index, 1);
  }

  getDivisionList() {
  
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      // this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList(id: number) {
  
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    })
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
          // this.autoCodeGeneration('Adjustment');
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
          let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Adjustment Voucher (Only Debtors and Creditors)');
          if (Info.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
            let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
            if (code) this.AdjustmentCreateForm.controls['AVNumber'].setValue(code.trim().toUpperCase());
            resolve(true);
          }
          else {
            Swal.fire('Please create the auto-generation code for Adjustment voucher.')
          }
        }
        else {
          this.AdjustmentCreateForm.controls['AVNumber'].setValue('');
          resolve(true);
        }
      }
    });
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (this.AdjustmentCreateForm.value.DivisionId && this.AdjustmentCreateForm.value.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.AdjustmentCreateForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.AdjustmentCreateForm.value.DivisionId);
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

  
  async addRow() {  
    debugger
    var validation = "";
    const accountMappingIds = []; // Replace this with your actual data
   const selectedAccountId = this.AccountTypeId;
   const typeId = this.typeId ? this.typeId : 0

  //  await this.fetchAccountMappingIds(selectedAccountId, typeId);  ---commented due to ledger mapping integration was HOLD
    if (this.AdjustmentCreateForm.value.AccountType == "" || this.AdjustmentCreateForm.value.AccountType == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account Type.</span></br>"
    }

    if (this.AdjustmentCreateForm.value.AccountId == "" || this.AdjustmentCreateForm.value.AccountId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account Name.</span></br>"
    }

    if (this.AdjustmentCreateForm.value.DrCrId == "" || this.AdjustmentCreateForm.value.DrCrId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Dr/Cr.</span></br>"
    }
    if (this.AdjustmentCreateForm.value.Currency == "" || this.AdjustmentCreateForm.value.Currency == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency. (if any)</span></br>"
    }

    // we removed the Exchange rate fieldName and validation based on requirement  --27-02-204

    // if (this.AdjustmentCreateForm.value.ExchangeRate == "" || this.AdjustmentCreateForm.value.ExchangeRate == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
    // }
    if (this.AdjustmentCreateForm.value.Amount == "" || this.AdjustmentCreateForm.value.Amount == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Amount</span></br>"
    }
    if (this.AdjustmentCreateForm.value.ROE == "" || this.AdjustmentCreateForm.value.ROE  == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter ROE</span></br>"
    }
  
    if (validation != "") {
     
      Swal.fire(validation); return false;
    }

    let info = this.AdjustmentCreateForm.value;
    // this.selectedAccountItemObj = info.AccountId;
    let account = info.AccountId;
    // let accountledger = this.groupedCoaTypeList.AccountName.find(x => x.Id == info.AccountId);
    // let accountcustomer = this.groupedCoaTypeList.CustomerName.find(x => x.Id == info.AccountId);
    let accountDetails = this.accountName.find(x => x.Id == info.AccountId);
    let DrCrId = this.debitCreditList.find(x => x.Id == info.DrCrId);
     let currency = this.currencyList.find(x => x.ID == info.Currency);

    if (this.editAccountTable) {
      let editValue = {
        Id: info.Id,
        AdjustmentVoucherId: this.AdjustmentId,
        AccountId: info.AccountId,
        DrCrId: info.DrCrId,
        Currency: info.Currency,
        ROE: info.ROE,
        Amount: info.Amount,
        CompanyCurrencyAmount: (Number(info.ROE) * Number(info.Amount)).toFixed(this.entityFraction),
        Narration: info.Narration,
        ExchangeRate: info.ExchangeRate,  
        // {Id: 44, AccountName: 'properties', AccountType: 'ChartOfAccount'}
        AccountName: accountDetails.Name,
        DrCrName: DrCrId.TransactionName,
        CurrencyName: currency.CurrencyCode,
        AccountType: info.AccountType,
      }

      this.AdjustmentTableList[this.editSelectedIdex] = editValue;
      this.editAccountTable = false;
      this.editSelectedIdex = null;
    } else {
      this.AdjustmentTableList.unshift({
        Id: info.Id,
        AdjustmentVoucherId: this.AdjustmentId,
        AccountId: info.AccountId,
        DrCrId: info.DrCrId,
        Currency: info.Currency,
        // ROE: info.ROE,
        // Amount: info.Amount,
        // CompanyCurrencyAmount: Number(info.ROE) * Number(info.Amount),
        ROE: Number(info.ROE) % 1 !== 0 ? Number(info.ROE).toFixed(this.entityFraction) : info.ROE,
        Amount: Number(info.Amount) % 1 !== 0 ? Number(info.Amount).toFixed(this.entityFraction) : info.Amount,
        CompanyCurrencyAmount: Number(info.ROE) % 1 !== 0 ? (Number(info.ROE) * Number(info.Amount)).toFixed(this.entityFraction): Number(info.ROE) * Number(info.Amount),
        Narration: info.Narration,
        ExchangeRate: info.ExchangeRate,
        AccountName: accountDetails.Name,
        DrCrName: DrCrId.TransactionName,
        CurrencyName: currency.CurrencyCode,
        AccountType: info.AccountType,
        // AccountType: JSON.stringify(this.selectedAccountItemObj)
      });
    }

    this.resetTable();
    this.calculateTotalDebitAndCredit();
    this.setPage(1);
    
    // console.log('selectedAccountItemObj', this.selectedAccountItemObj);
    // this.selectedAccountItemObj = {};
    //this.fetchAccountMappingIds(selectedAccountId);
  }
 
  fetchAccountMappingIds(selectedAccountId,typeId) {
    return new Promise((resolve, reject) => {
      let service = `${this.globals.APIURL}/AdjustmentVoucher/AdjustmentLedgerMapping`;
      this.dataService.post(service, { AccountMappingIds: selectedAccountId, typeId }).subscribe(
        (result: any) => {
          this.validation1 = result.data.Table[0].ErrorMessage
          if (result.message === "Success") {
            if (result.data.Table[0].ErrorMessage) {
              Swal.fire(this.validation1); return false;
            }
          } else if (result.data.Table[0].AccountMappingIds) {

          } else {
            // Handle the case when result.message is not "Success" (e.g., display an error message).
          }
          resolve(true)
        },
        (error) => {
          // Handle errors that occur during the HTTP request or processing of the response.
          console.error("Error:", error);
          // You can show an error message to the user if needed.
          resolve(true)
        }
      );
    });
  }


 
  // fetchAccountMappingIds(selectedAccountId) {
  //   ;
  //   let service = `${this.globals.APIURL}/AdjustmentVoucher/AdjustmentLedgerMapping`;
  //   this.dataService.post(service, { AccountMappingIds: selectedAccountId }).subscribe(
  //     (result: any) => {
  //       if (result.message === "Success") {
  //         if (result.data.Table[0].ErrorMessage) {
  //           Swal.fire(result.data.Table[0].ErrorMessage, '');
  //         } else if (result.data.Table[0].AccountMappingIds) {
            
  //         }
  //       } else {
  //         // Handle the case when result.message is not "Success" (e.g., display an error message).
  //       }
  //     },
  //     (error) => {
  //       // Handle errors that occur during the HTTP request or processing of the response.
  //       console.error("Error:", error);
  //       // You can show an error message to the user if needed.
  //     }
  //   );
  // }
  

  onAccountChange(accountName) {
    const selectedAccountId = this.AdjustmentCreateForm.value.AccountId;

    const selectedAccount = this.AdjustmentCreateForm.get('AccountId').value;
 
    if (selectedAccountId) {
      // this.fetchAccountMappingIds(selectedAccountId.Id);
    }
  }
  

  calculateTotalDebitAndCredit() {
    let debit = this.AdjustmentTableList.filter(x => x.DrCrId == 1);
    let credit = this.AdjustmentTableList.filter(x => x.DrCrId == 2);

    var totalCredit = 0;
    var totalDebit = 0;
    var totalDifference = 0;
    for (let data of debit) totalDebit += Number(Number(data.CompanyCurrencyAmount).toFixed(this.entityFraction));
    for (let data of credit) totalCredit += Number(Number(data.CompanyCurrencyAmount).toFixed(this.entityFraction));
     totalDifference = Math.abs(totalCredit - totalDebit);
    totalDifference = Number(totalDifference.toFixed(this.entityFraction));
    this.AmountDifference = totalDifference;

    this.AdjustmentCreateForm.controls['TotalDebit'].setValue(totalDebit);
    this.AdjustmentCreateForm.controls['TotalCredit'].setValue(totalCredit);
    this.AdjustmentCreateForm.controls['AmountDifference'].setValue(totalDifference);
  }

  resetTable() {
    debugger
    this.AdjustmentCreateForm.controls['Id'].setValue(0);
    this.AdjustmentCreateForm.controls['AccountId'].setValue(0);
    this.AdjustmentCreateForm.controls['AccountType'].setValue(0);
    this.AdjustmentCreateForm.controls['DrCrId'].setValue(0);
    // this.AdjustmentCreateForm.controls['Currency'].setValue(this.entityCurrency1);
    const entitySelectedCurrency = this.currencyList.find(c => c.Currency === this.entityCurrency);
      if (entitySelectedCurrency) {
        this.AdjustmentCreateForm.controls.Currency.setValue(entitySelectedCurrency.ID);
      }
    this.AdjustmentCreateForm.controls['ROE'].setValue('');
    this.AdjustmentCreateForm.controls['Amount'].setValue('');
    this.AdjustmentCreateForm.controls['CompanyCurrencyAmount'].setValue(0);
    this.AdjustmentCreateForm.controls['Narration'].setValue('');
    this.AdjustmentCreateForm.controls['ExchangeRate'].setValue('');
  }

  setPage(page: number) {
    // if (page < 1 || page > this.pager.totalPages) {
    //   return;
    // }
    this.pager = this.ps.getPager(this.AdjustmentTableList.length, page);
    this.pagedItems = this.AdjustmentTableList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  ChartAccountList() {
    const service: any = `${this.globals.APIURL}/AdjustmentVoucher/AdjustmentVoucherDropdown`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if ( Object.keys(result.data).length > 0) {
        const groupedData: { [key: string]: any[] } = {
          'AccountName': [...result.data.Table],
          'CustomerName': [...result.data.Table1],
          'VendorName': [...result.data.Table2]
        };
        this.accountTypeList = result.data.Table3;
        this.coaMasterData = result.data.Table1;
        this.CustomerData = result.data.Table2;
        this.resultAccountTypeList = result.data.Table5
        this.groupedCoaTypeList = groupedData;
        // console.log('groupedCoaTypeList', this.groupedCoaTypeList);
      }
    }, error => {
      console.error(error);
    });
  }

  getAccountNameDropdown(accountName){
    // this.typeIdArray = this.accountName.filter((item) =>item.AccountType === accountName )
    // console.log(this.typeIdArray,"this.AccountIdthis.AccountId")

    // this.typeId = this.typeIdArray[0].AccountTypeId
    if(this.accountNameCheck == "COA MASTER"){
      this.typeId = accountName
    }
    else{
      this.typeId = 0
    }
    

  }

  getAccountDropdown(accountTypeName){
    this.accountNameCheck = accountTypeName

    // this.AccountTypeId = []

    // this.AccountId = this.accountTypeList.filter((item) =>item.AccountType === accountTypeName )

    // console.log(this.AccountId,"this.AccountIdthis.AccountId")

    // if(accountTypeName != "COA MASTER"){
    //   this.AccountTypeId = this.AccountId[0].AccountTypeId
    // }
    // else{
    //   this.AccountTypeId = 0
    // }
    console.log(this.resultAccountTypeList)
    if(accountTypeName != "COA MASTER"){
      this.AccountTypeId = []
    this.AccountId = this.resultAccountTypeList.filter((item) => {
      return item.ModuleName.toUpperCase() === accountTypeName   
    })

      this.AccountTypeId = this.AccountId[0].Id
    }
    else{
      this.AccountTypeId = 0
    }
    // console.log(this.resultAccountTypeList)
    // if(accountTypeName != "COA MASTER"){
    //   this.AccountTypeId = []
    // this.AccountId = this.resultAccountTypeList.filter((item) =>item.ModuleName === accountTypeName )
    //   this.AccountTypeId = this.AccountId[0].Id
    // }
    // else{
    //   this.AccountTypeId = 0
    // }
    // this.accountNameCheck = this.AccountId[0].AccountType
    // this.fetchAccountMappingIds(this.AccountTypeId);

    // debugger
    this.accountName = []
    if(accountTypeName == 'COA MASTER') {
      this.accountName = this.groupedCoaTypeList['AccountName'];
    } else if(accountTypeName == 'CUSTOMER'){
      this.accountName = this.groupedCoaTypeList['CustomerName'];
    } else {
      this.accountName = this.groupedCoaTypeList['VendorName'];
    }
    this.AdjustmentCreateForm.patchValue({
      AccountId: '',
      AccountName: ''
    })
  }
  
  // groupDataByPropertyName(data: any[]): { [key: string]: any[] } {
  //   ;
  //   const groupedData: { [key: string]: any[] } = {
  //     'AccountName': [],
  //     'CustomerName': [],
  //     'VendorName': []
  //   };
  
  //   for (const item of data) {
  //     if (item.hasOwnProperty('AccountName')) {
  //       groupedData['AccountName'].push(item);
  //     } else if (item.hasOwnProperty('CustomerName')) {
  //       groupedData['CustomerName'].push(item);
  //     } else if (item.hasOwnProperty('VendorName')) {
  //       groupedData['VendorName'].push(item);
  //     }
  //   }
  
  //   return groupedData;
  // }
  
  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.currencyList = [];
      if (result.length > 0) {
        this.currencyList = result;
      }
      const entitySelectedCurrency = this.currencyList.find(c => c.Currency === this.entityCurrency);
      if (entitySelectedCurrency) {
        this.AdjustmentCreateForm.controls.Currency.setValue(entitySelectedCurrency.ID);
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

  OnClickRadio(index) {
    this.editSelectedIdex = index;
    this.editAccountTable = true;
  }


  OnClickEditValue() {
    let editRow = this.AdjustmentTableList[this.editSelectedIdex];
    this.getAccountDropdown(editRow.AccountType);
    // this.selectedAccountItemObj = JSON.parse(editRow.AccountType);
    this.AdjustmentCreateForm.patchValue({
      Id: editRow.Id,
      AccountType: editRow.AccountType,
      AccountId: editRow.AccountId,
      AccountName: editRow.AccountName,
      DrCrId: editRow.DrCrId,
      Currency: editRow.Currency,
      CurrencyName: editRow.CurrencyName,
      ROE: editRow.ROE,
      ExchangeRate: editRow.ExchangeRate,
      Amount: editRow.Amount,
      CompanyCurrencyAmount: editRow.CompanyCurrencyAmount,
      Narration: editRow.Narration
    })
    this.isEditMode = !this.isEditMode;
    
  }

  OnClickDeleteValue() {
    if (this.editSelectedIdex >= 0 && this.editSelectedIdex != null) {
      this.AdjustmentTableList.splice(this.editSelectedIdex, 1);
      this.editSelectedIdex = null;
      this.editAccountTable = false;
      this.calculateTotalDebitAndCredit();
      this.setPage(1);
    }
    else {
      Swal.fire('Please select the Item!!');
    }
  }

  async saveInfo(status: Number, isDelete = false) {

    var validation = "";
    if (this.AdjustmentCreateForm.value.DivisionId == "" || this.AdjustmentCreateForm.value.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (this.AdjustmentCreateForm.value.OfficeId == "" || this.AdjustmentCreateForm.value.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    if (this.AdjustmentTableList.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Attest one record must be create in the Adjustment Table.</span></br>"
    }

    if (this.FileList.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select upload file.</span></br>"
    }

    if(this.COAValidation()){
      validation += "<span style='color:red;'>*</span> <span>Please select at least a Customer or Vendor to adjust</span></br>"
    }
    if(this.CustomerValidation()){
      validation += "<span style='color:red;'>*</span> <span>Please select at least a COA Master or Vendor to adjust</span></br>"
    }
    if(this.VendorValidation()){
      validation += "<span style='color:red;'>*</span> <span>Please select at least a COA Master or Customer to adjust</span></br>"
    }

    if (validation != "") {
      if(status != 3){
      Swal.fire(validation)
      return false;
      }
    }

    // set Delete flag
    if(isDelete){
      this.AdjustmentCreateForm.controls['IsDelete'].setValue(1); // Need to uncomment
    }

    let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit`;
    let deleteMsg = `Do you want to Delete this Details?`;

    let combinedText: string;

    if (status === 1) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else if (status === 2) {
      combinedText = finalMsg;
    } else {
      combinedText = closeMsg;
    }


    if (status == 3 && this.isFinalRecord) {
      this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
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

        // If cancelled clicked
        if(status == 3 ){
          this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
          return;
        }

        // generate the auto generate code if finaled
        if(this.isUpdate && status == 2){
          await this.autoCodeGeneration('Adjustment');
        }

        let service = `${this.globals.APIURL}/AdjustmentVoucher/SaveAdjustmentVoucherInfo`;
        

        await this.createPayload(status);
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.data.Message, '', 'success');
            this.isUpdateMode = true;
            this.isUpdateMode1 = true; 
            if(status == 1){
              const AdjustmentId = Number(result.data.Id);
                // this.router.navigate(['/views/Adjustment-info/Adjustment-Voucher-info', { id: result.data.Id }]);  
                this.isUpdateMode = true;
                this.isUpdateMode1 = true;
                this.adjustmentVoucherEdit(AdjustmentId)
              }
              if (this.isUpdate && status == 2) { this.updateAutoGenerated();}  
              // if deleted navigate to list
              if(isDelete && this.isUpdate){
                this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
              }
        }
         
        if(status == 2){
          this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
          return;
          }  
          
        }, error => {
          console.error(error);
        });
      }
    });
  }

  // * check its having COA and customer or vendor matching the scenerio
CustomerValidation(){
    debugger
    const isCoaAccount1 = this.AdjustmentTableList.some((item) => {  return item.DrCrName == "Dr" && item.AccountType == "CUSTOMER" });
    const isCoaAccount = this.AdjustmentTableList.some((item) => {  return item.DrCrName == "Cr" && item.AccountType == "CUSTOMER" });
    const isCusdtomer = this.AdjustmentTableList.some((item) => { return item.AccountType == "COA MASTER" || item.AccountType == "VENDOR"});
      return((isCoaAccount && isCoaAccount1 && !isCusdtomer)
   ) 
  }

  VendorValidation(){
    debugger
    const isCoaAccount1 = this.AdjustmentTableList.some((item) => {  return item.DrCrName == "Dr" && item.AccountType == "VENDOR" });
    const isCoaAccount = this.AdjustmentTableList.some((item) => {  return item.DrCrName == "Cr" && item.AccountType == "VENDOR" });
    const isCusdtomer = this.AdjustmentTableList.some((item) => { return item.AccountType == "COA MASTER" || item.AccountType == "CUSTOMER"});
      return((isCoaAccount && isCoaAccount1 && !isCusdtomer)
   ) 
  }

  COAValidation(){
    debugger
    const isCoaAccount1 = this.AdjustmentTableList.some((item) => {  return item.DrCrName == "Dr" && item.AccountType == "COA MASTER" });
    const isCoaAccount = this.AdjustmentTableList.some((item) => {  return item.DrCrName == "Cr" && item.AccountType == "COA MASTER" });
    const isCusdtomer = this.AdjustmentTableList.some((item) => { return item.AccountType == "CUSTOMER" || item.AccountType == "VENDOR"});
      return((isCoaAccount && isCoaAccount1 && !isCusdtomer)
   ) 
  }
    
   
    

  

  adjustmentVoucherEdit(id?: number) {
    this.router.navigate(['/views/Adjustment-info/Adjustment-Voucher-info', { id: id, isUpdate: true }]);
  }

  enableEdit(){
    this.isEditMode = true;
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Adjustment Voucher (Only Debtors and Creditors)');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }
  getStatus() {
    
    var service = `${this.globals.APIURL}/Common/GetStatusDropDownList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      
       this.statusList = result.data.Table
    }, error => { });
  }
  createPayload(status) {
    let info = this.AdjustmentCreateForm.value;
    let Table = {
      AdjustmentVoucherId: this.AdjustmentId ? this.AdjustmentId : info.AdjustmentVoucherId,
      DivisionId: info.DivisionId,
      OfficeId: info.OfficeId,
      AVNumber: info.AVNumber,
      AVDate: new Date(info.AVDate),
      TotalDebit: info.TotalDebit,
      TotalCredit: info.TotalCredit,
      AmountDifference: info.AmountDifference,
      Remarks: info.Remarks,
      CreatedBy: localStorage.getItem('UserID'),
      StatusId: status,
      IsFinal: status == 2 ? 1 : 0,
      IsDelete: info.IsDelete,
      
    }

    this.payload = {
      "AdjustmentVoucher": {
        "Table": [Table],
        "Table 1": this.AdjustmentTableList,
        "Table 2": this.FileList
      }
    }
  }


}
