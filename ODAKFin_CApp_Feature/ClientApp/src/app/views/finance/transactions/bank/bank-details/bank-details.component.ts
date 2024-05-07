import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { PaymentReceivableService } from 'src/app/services/financeModule/payment-receivable.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {

  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  bankId: any;
  CreatedOn: string = '';
  private ngUnsubscribe = new Subject<void>();
  CreatedBy =  localStorage.getItem('UserID')
  ModifiedOn: string = '';
  ModifiedBy: string = '';
 entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);
  accountBankForm: FormGroup;
  isUpdate: Boolean = false;
  isCreate: Boolean = true;
  isUpdateButtonDisable: boolean = true;
  isSavemode: boolean = false;
  resultValues: any[];
  formattedErrorMessages: any;
  officeList:any;
  divisionList:any;
  currencyList:any;
  debitCreditList = [
    { value: 1, debitCreditName: 'Debit' },
    { value: 0, debitCreditName: 'Credit' }
  ];
  AccountList:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private PaymentReceivableService : PaymentReceivableService,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private commonDataService: CommonService,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {

    this.CreateForm();
    this.getDivisionList();
    this.getCurrency();
    this.getGroup();
    this.route.params.subscribe(param => {
      if (param.id) { 
        this.isUpdate = true;
        this.isCreate = false
        this.accountBankForm.disable();
        // this.createReceiptForm();
        this.bankId = parseInt(param.id);
        this.getAccountReceivableIdByID();
        // this.receiptForm.disable();
      } 
    })
  }

  CreateForm() {
    this.accountBankForm = this.fb.group({
      Id: [0],
      OBReference: [''],
      OBDate: [''],
      Division: [''],
      DivisionId:[0],
      Office: [''],
      OfficeId:[0],
      AccountName: [''],
      GroupName: [''],
      DebitorCredit: [''],
      Exchange: [''],
      Currency: [''],
      AmountCCY: [''],
      CreatedDate: [new Date()],
      ModifiedDate: [new Date()],
      CreatedBy: this.CreatedBy,
      UpdatedBy: [localStorage.getItem('UserID')],
    });
  }
  
  getAccountReceivableIdByID() {
    const payload =  this.bankId
    var service = `${this.globals.APIURL}/OpeningBalanceBank/GetBankListById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      console.log(result)
      if(result.message == 'Success'){
        let info = result.data.Table[0];

        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat1);
        this.ModifiedOn = this.datePipe.transform(info.ModifiedDate, this.entityDateFormat1); 
        await this.getOfficeList(info.DivisionId);
        this.accountBankForm.patchValue({
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          AccountName: info.AccountName,
          GroupName: info.GroupName,
          DebitorCredit: info.DebitorCredit,
          Currency: info.Currency,
          Exchange: info.Exchange,
          AmountCCY: info.AmountCCY,
          ModifiedBy: info.ModifiedBy,
          OBReference: info.OBReference,
          OBDate: this.datePipe.transform(info.OBDate, "dd-MM-yyyy"),
        });
        console.log(this.accountBankForm.value,'accountReceivableFormaccountReceivableForm')

      }
  }
    )
  }

  updateFormattedErrorMessages(): void {
    const groupedErrors: { [key: string]: string[] } = {};
  
    // Group errors by RowNumber
    this.resultValues.forEach(errorMessage => {
      const rowNumber = errorMessage.match(/RowNumber: (\d+)/);
      if (rowNumber) {
        const key = rowNumber[1];
        groupedErrors[key] = groupedErrors[key] || [];
        groupedErrors[key].push(errorMessage.replace(`RowNumber: ${key}, `, ''));
      }
    });
  
    // Join grouped errors with line breaks
    this.formattedErrorMessages = Object.keys(groupedErrors).map(key => {
      return `RowNumber: ${key}, ${groupedErrors[key].join('<br>')}`;
    }).join('<br>');
  }
  

  save(){
      this.accountBankForm.value.Id = this.bankId
      var validation = "";
      if (this.accountBankForm.value.DivisionId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Division </span></br>"
      }
      if (this.accountBankForm.value.OfficeId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Office</span></br>"
      }
      if (this.accountBankForm.value.AccountName == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Account</span></br>"
      }
      if (this.accountBankForm.value.Group == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Group</span></br>"
      }
      if (this.accountBankForm.value.DebitorCredit == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Debit/Credit</span></br>"
      }
      if (this.accountBankForm.value.Exchange == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Exchange</span></br>"
      }
      if (this.accountBankForm.value.Currency == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Currency</span></br>"
      }
      if (this.accountBankForm.value.AmountCCY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter AmountCCY</span></br>"
      }
      if (validation != "") {
        Swal.fire(validation)
        return false;
      }


// Account Name
  // let selectedBank = this.accountBankForm.value.AccountName ; 
  // let filteredAccounts = this.AccountList.filter(AccountList => AccountList.AccountName === selectedBank);
  // let accountNumbers = filteredAccounts.map(AccountList => AccountList.AccountNo);
  // this.accountBankForm.controls['AccountNUmber'].setValue(accountNumbers);
  // this.accountBankForm.controls['AccountName'].setValue(this.AccountList.AccountName);
  // this.accountBankForm.get('AccountName').setValue(this.AccountList.AccountName);

  
// let selectedBank = this.accountBankForm.value.AccountName;
// let filteredAccounts = this.AccountList.filter(AccountList => AccountList.AccountName === selectedBank);
// let filteredAccountsNumber = this.AccountList.filter(AccountList => AccountList.AccountName === selectedBank);

  // let accountName = filteredAccounts[0].AccountName.split(' - ')[0];
  // let accountNumber = filteredAccountsNumber[0].AccountName.split(' - ')[1]; // Use [1] to get the account number part

//   // Set the extracted account name and account number to the form controls
  // this.accountBankForm.controls['AccountName'].setValue(accountName);
  // this.accountBankForm.controls['AccountNUmber'].setValue(accountNumber);



  // const Division = this.accountBankForm.value.DivisionId;
  // const selectedDivision = this.divisionList.find(x => x.ID === Division);
  // if (selectedDivision) {
  //  this.accountBankForm.controls['Division'].setValue(selectedDivision.DivisionName);
  // }

  // const Office = this.accountBankForm.value.OfficeId;
  // const selectedOffice = this.officeList.find(x => x.ID === Office);
  // if (selectedOffice) {
  //  this.accountBankForm.controls['Office'].setValue(selectedOffice.OfficeName);
  // }

      console.log(this.accountBankForm.value,'this.accountBankForm.value')
      const data = {
        "Id": this.bankId,
        "Division": this.accountBankForm.value.Division,
        "DivisionId":this.accountBankForm.value.DivisionId,
        "Office": this.accountBankForm.value.Office,
        "OfficeId":this.accountBankForm.value.OfficeId,
        "AccountName": this.accountBankForm.value.AccountName,
        "Group": this.accountBankForm.value.GroupName,
        "DebitorCredit": this.accountBankForm.value.DebitorCredit,
        "Currency": this.accountBankForm.value.Currency,
        "Exchange": this.accountBankForm.value.Exchange,
        "AmountCCY": this.accountBankForm.value.AmountCCY,
        "ModifiedBy": parseInt(this.CreatedBy)
      }

  
      const payload = {
        IncomeAsset: {
          Table: [data],
        },
      };
      console.log(payload,'this.payload.valpayloadForm.value,')
          let service = `${this.globals.APIURL}/OpeningBalanceBank/UpdateBankListById`;
          this.dataService.post(service, payload).subscribe((result: any) => {
            if(result.message == 'Success'){
              Swal.fire(result.result[0], '', 'success');
              this.router.navigate(['/views/transactions/openingBalances/bank']);
              this.accountBankForm.reset();
              }else {
                this.resultValues = []
                this.resultValues = result.result
  
                if(this.resultValues.length == 1){
                  Swal.fire(this.resultValues[0]);
  
                }
                else {
                  this.updateFormattedErrorMessages()
                  console.log(this.formattedErrorMessages,'formattedErrorMessagesformattedErrorMessages');
                    Swal.fire(this.formattedErrorMessages);
                }
              }
            }, error => {
              Swal.fire('error');
              console.error(error);
            });  
    }
  deleteRecord() {
    const payload =  this.bankId
    var service = `${this.globals.APIURL}/OpeningBalanceBank/DeleteBankListById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      if(result.message == 'Success'){
        Swal.fire(result.result[0], '', 'success');
        this.router.navigate(['/views/transactions/openingBalances/bank']);
        this.accountBankForm.reset();
        }else {
          this.resultValues = []
          this.resultValues = result.result

          if(this.resultValues.length == 1){
            Swal.fire(this.resultValues[0]);

          }
          else {
            this.updateFormattedErrorMessages()
            console.log(this.formattedErrorMessages,'formattedErrorMessagesformattedErrorMessages');
              Swal.fire(this.formattedErrorMessages);
          }
        }
      }, error => {
        Swal.fire('error');
        console.error(error);
      });  
}
  enableEdit(){
    this.accountBankForm.enable()
    this.isSavemode = true
    }
  Cancel(){
    this.router.navigate(['/views/transactions/openingBalances/bank']);
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`;
    this.dataService.post(service, { Id: 0, DivisionCode: '', DivisionName: '', Active: 1 }).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  
  }

  getOfficeList(DivisionId) {
    return new Promise((resolve, reject) => {
      const payload = { DivisionId }
      this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any) => {
        this.officeList = [];
       // this.accountBankForm.controls['OfficeId'].setValue('');
        if (result.message == 'Success') {
          if (result.data && result.data.Table.length > 0) {
            this.officeList.push(...result.data.Table);
            resolve(true);
          }
        }
      }, error => {
        reject();
      });
    })
  }

  getCurrency(){
    return new Promise((resolve, rejects) => {
      const payload = { "currencyId": 0, "countryId": 0 };
      this.PaymentReceivableService.getCurrencyLists(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          this.currencyList = result['data'];
          const entityInfo: any = this.commonDataService.getLocalStorageEntityConfigurable();
          // this.receivedCurrencyName = entityInfo.Currency
          resolve(true)
        }
      });
    })
  }

  getGroup() {
    debugger
    const payload = {
      ModuleType: 5
    }
    this.commonDataService.getLedgerMappingParentAccountList(payload).subscribe(data => {
      this.AccountList = data["data"].Table;
    });
  }

  // getGroup( ) {    
  //   const divisionId = this.accountBankForm.get('DivisionId').value;
  //   const officeId =  this.accountBankForm.get('OfficeId').value;
  //   const payload = { DivisionId: divisionId, OfficeId: officeId};
  // this.commonDataService.GetAccountBankList((payload)).subscribe(result => {
  //    this.AccountList = [];
  //     if (result['data'].Table.length > 0) {
  //       this.AccountList = result['data'].Table;
  //     }
  //   }, error => {
  //     console.error(error);
  //   }); 
  // }
}

