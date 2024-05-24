import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { PaymentReceivableService } from 'src/app/services/financeModule/payment-receivable.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-equity-details',
  templateUrl: './equity-details.component.html',
  styleUrls: ['./equity-details.component.css']
})
export class EquityDetailsComponent implements OnInit {

  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  equityId: any;
  CreatedOn: string = '';
  private ngUnsubscribe = new Subject<void>();
  CreatedBy =  localStorage.getItem('UserID')
  ModifiedOn: string = '';
  ModifiedBy: string = '';
 entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);
  accountEquityForm: FormGroup;
  isUpdate: Boolean = false;
  isCreate: Boolean = true;
  isUpdateButtonDisable: boolean = true;
  isSavemode: boolean = false;
  resultValues: any;
  formattedErrorMessages: string;
  officeList:any;
  divisionList:any;
  currencyList:any
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
        this.accountEquityForm.disable();
        // this.createReceiptForm();
        this.equityId = parseInt(param.id);
        this.getEquityByID();
        // this.receiptForm.disable();
      } 
    })
  }

  CreateForm() {
    this.accountEquityForm = this.fb.group({
      Id: [0],
      OBReference: [''],
      OBDate: [''],
      Division: [''],
      DivisionId:[0],
      Office: [''],
      OfficeId:[0],
      AccountName: [''],
      Group: [''],
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
  
  getEquityByID() {
    const payload =  this.equityId
    var service = `${this.globals.APIURL}/OpeningBalanceEquity/GetEquityListById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      console.log(result)
      if(result.message == 'Success'){
        let info = result.data.Table[0];

        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat1);
        this.ModifiedOn = this.datePipe.transform(info.ModifiedDate, this.entityDateFormat1);
        await this.getOfficeList(info.DivisionId);
        this.accountEquityForm.patchValue({
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          AccountName: info.AccountName,
          Group: info.GroupName,
          DebitorCredit: info.DebitorCredit,
          Currency: info.Currency,
          Exchange: info.Exchange,
          AmountCCY: parseFloat(info.AmountCCY).toFixed(3),
          ModifiedBy: info.ModifiedBy,
          OBReference: info.OBReference,
          OBDate: this.datePipe.transform(info.OBDate, 'dd-MM-yyyy'),
        });
        console.log(this.accountEquityForm.value,'accountReceivableFormaccountReceivableForm')

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
      this.accountEquityForm.value.Id = this.equityId
      var validation = "";
      if (this.accountEquityForm.value.DivisionId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Division </span></br>"
      }
      if (this.accountEquityForm.value.OfficeId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Office</span></br>"
      }
      if (this.accountEquityForm.value.AccountName == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Account</span></br>"
      }
      if (this.accountEquityForm.value.Group == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Group</span></br>"
      }
      if (this.accountEquityForm.value.DebitorCredit == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Debit/Credit</span></br>"
      }
      if (this.accountEquityForm.value.Exchange == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Exchange</span></br>"
      }
      if (this.accountEquityForm.value.Currency == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Currency</span></br>"
      }
      if (this.accountEquityForm.value.AmountCCY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter AmountCCY</span></br>"
      }
      if (validation != "") {
        Swal.fire(validation)
        return false;
      }
      console.log(this.accountEquityForm.value,'this.accountEquityForm.value')
      const data = {
        "Id": this.equityId,
        "Division": this.accountEquityForm.value.Division,
        "DivisionId":this.accountEquityForm.value.DivisionId,
        "Office": this.accountEquityForm.value.Office,
        "OfficeId":this.accountEquityForm.value.OfficeId,
        "AccountName": this.accountEquityForm.value.AccountName,
        "Group": this.accountEquityForm.value.Group,
        "DebitorCredit": this.accountEquityForm.value.DebitorCredit,
        "Currency": this.accountEquityForm.value.Currency,
        "Exchange": this.accountEquityForm.value.Exchange,
        "AmountCCY": this.accountEquityForm.value.AmountCCY,
        "ModifiedBy": parseInt(this.CreatedBy)
      }
      const payload = {
        EquityAsset: {
          Table: [data],
        },
      };
      console.log(payload,'this.payload.valpayloadForm.value,')
          let service = `${this.globals.APIURL}/OpeningBalanceEquity/UpdateEquityListById`;
          this.dataService.post(service, payload).subscribe((result: any) => {
            if(result.message == 'Success'){
              Swal.fire(result.result[0], '', 'success');
              this.router.navigate(['/views/transactions/openingBalances/equity']);
              this.accountEquityForm.reset();
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
    const payload =  this.equityId
    var service = `${this.globals.APIURL}/OpeningBalanceEquity/DeleteEquityListById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      if(result.message == 'Success'){
              Swal.fire(result.result[0], '', 'success');
              this.router.navigate(['/views/transactions/openingBalances/equity']);
              this.accountEquityForm.reset();
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
    this.accountEquityForm.enable()
    this.isSavemode = true
    }
  Cancel(){
    this.router.navigate(['/views/transactions/openingBalances/equity']);
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
        //this.accountEquityForm.controls['OfficeId'].setValue('');
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
    this.commonDataService.getGroupListDropdown({ GroupName :"Equity" }).subscribe(result => {
      this.AccountList = [];
      if (result['data'].Table.length > 0) {
        this.AccountList = result['data'].Table;
      }
    }, error => {
      console.error(error);
    });
  }

}
