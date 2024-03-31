import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaymentReceivableService } from 'src/app/services/financeModule/payment-receivable.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
@Component({
  selector: 'app-liability-details',
  templateUrl: './liability-details.component.html',
  styleUrls: ['./liability-details.component.css']
})
export class LiabilityDetailsComponent implements OnInit {

  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  accountReceivableId: any;
  CreatedOn: string = '';
  CreatedBy =  localStorage.getItem('UserID')
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  private ngUnsubscribe = new Subject<void>();
 entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);
  accountLiabilityForm: FormGroup;
  isUpdate: Boolean = false;
  isCreate: Boolean = true;
  isUpdateButtonDisable: boolean = true;
  liabilityId: any
  isSavemode: boolean = false;
  resultValues: any;
  formattedErrorMessages: string;
  divisionList: any = [];
  officeList: any = [];
  accountName: any = [];
  currencyList: any = [];
  debitCreditList = [
    { value: true, TransactionName: 'Debit' },
    { value: false, TransactionName: 'Credit' }
  ];
  AccountList: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globals: Globals,
    private PaymentReceivableService : PaymentReceivableService,
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
    this.route.params.subscribe(async(param) => {
      if (param.id) { 
        this.isUpdate = true;
        this.isCreate = false
        this.accountLiabilityForm.disable();
        // this.createReceiptForm();
        this.liabilityId = parseInt(param.id);
        this.getLiabilityByID();
        // this.receiptForm.disable();
      } 
    })
  }

  CreateForm() {
    this.accountLiabilityForm = this.fb.group({
      Id: [0],
      OBReference: [''],
      OBDate: [''],
      Division: [''],
      DivisionId: [''],
      Office: [''],
      OfficeId: [''],
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
  
async  getLiabilityByID() {
    const payload =  this.liabilityId
    var service = `${this.globals.APIURL}/OpeningBalanceLiability/GetLiabilityListById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      console.log(result)
      if(result.message == 'Success'){
        let info = result.data.Table[0];
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat1);
        this.ModifiedOn = this.datePipe.transform(info.ModifiedDate, this.entityDateFormat1);
        await this.getOffice(info.DivisionId);
        this.accountLiabilityForm.patchValue({
          Division: info.Division,
          DivisionId: info.DivisionId,
          Office: info.Office,
          OfficeId: info.OfficeId,
          AccountName: info.AccountName,
          GroupName: info.GroupName,
          DebitorCredit: info.DebitorCredit,
          Currency: info.Currency,
          Exchange: info.Exchange,
          AmountCCY: info.AmountCCY,
          ModifiedBy: info.ModifiedBy,
          OBReference: info.OBReference,
          OBDate: this.datePipe.transform(info.OBDate, 'dd-MM-y'),
        });
        console.log(this.accountLiabilityForm.value,'accountReceivableFormaccountReceivableForm')

      }
  }
    )
  }

  updateFormattedErrorMessages(): void {
    const groupedErrors: { [key: string]: string[] } = {};

    // Group errors by RowNumber
    this.resultValues.forEach((errorMessage) => {
      const rowNumber = errorMessage.match(/RowNumber: (\d+)/);
      if (rowNumber) {
        const key = rowNumber[1];
        groupedErrors[key] = groupedErrors[key] || [];
        groupedErrors[key].push(
          errorMessage.replace(`RowNumber: ${key}, `, "")
        );
      }
    });

    // Join grouped errors with line breaks
    this.formattedErrorMessages = Object.keys(groupedErrors)
      .map((key) => {
        return `RowNumber: ${key}, ${groupedErrors[key].join("<br>")}`;
      })
      .join("<br>");
  }

  getOffice(Division){
    debugger
      return new Promise((resolve, reject) => {
        const payload = {DivisionId: Division}
        this.commonDataService.getOfficeByDivisionId(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any)=>{
          this.officeList = [];
           this.accountLiabilityForm.controls['OfficeId'].setValue('');
          if(result.message == 'Success'){
            if(result.data && result.data.Table.length > 0) {
              this.officeList.push(...result.data.Table);
              resolve(true);
            }
          }
        }, error => { 
          reject('')
        });
      })
    }

  getGroup() {
    this.commonDataService.getGroupListDropdown({ GroupName :"Liability" }).subscribe(result => {
      this.AccountList = [];
      if (result['data'].Table.length > 0) {
        this.AccountList = result['data'].Table;
      }
    }, error => {
      console.error(error);
    });
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

  getCurrency(){
    return new Promise((resolve, rejects) => {
      const payload = { "currencyId": 0, "countryId": 0 };
      this.PaymentReceivableService.getCurrencyLists(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          this.currencyList = result['data'];
          resolve(true)
        }
      });
    })
  }

  save(){
      this.accountLiabilityForm.value.Id = this.liabilityId
      var validation = "";
      if (this.accountLiabilityForm.value.DivisionId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Division </span></br>"
      }
      if (this.accountLiabilityForm.value.OfficeId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Office</span></br>"
      }
      if (this.accountLiabilityForm.value.AccountName == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Account</span></br>"
      }
      if (this.accountLiabilityForm.value.Group == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Group</span></br>"
      }
      if (this.accountLiabilityForm.value.DebitorCredit == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Debit/Credit</span></br>"
      }
      if (this.accountLiabilityForm.value.Exchange == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Exchange</span></br>"
      }
      if (this.accountLiabilityForm.value.Currency == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Currency</span></br>"
      }
      if (this.accountLiabilityForm.value.AmountCCY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter AmountCCY</span></br>"
      }
      if (validation != "") {
        Swal.fire(validation)
        return false;
      }
      console.log(this.accountLiabilityForm.value,'this.accountLiabilityForm.value')
      this.divisionList = [];
      for (let i = 0; i < this.divisionList.length; i++) { 
        this.accountLiabilityForm.get('Division').setValue(this.divisionList[i].DivisionName);
      }

      this.officeList = [];
      for (let i = 0; i < this.officeList.length; i++) {
        this.accountLiabilityForm.get('Office').setValue(this.officeList[i].OfficeName);
      }


      const data = {
        "Id": this.liabilityId,
        "Division": this.accountLiabilityForm.value.Division,
        "DivisionId": this.accountLiabilityForm.value.DivisionId,
        "OfficeId": this.accountLiabilityForm.value.OfficeId,
        "Office": this.accountLiabilityForm.value.Office,
        "AccountName": this.accountLiabilityForm.value.AccountName,
        "Group": this.accountLiabilityForm.value.GroupName,
        "DebitorCredit": this.accountLiabilityForm.value.DebitorCredit,
        "Currency": this.accountLiabilityForm.value.Currency,
        "Exchange": this.accountLiabilityForm.value.Exchange,
        "AmountCCY": this.accountLiabilityForm.value.AmountCCY,
        "ModifiedBy": parseInt(this.CreatedBy)
      }

  
      const payload = {
        LiabilityAsset: {
          Table: [data],
        },
      };
      console.log(payload,'this.payload.valpayloadForm.value,')
          let service = `${this.globals.APIURL}/OpeningBalanceLiability/UpdateLiabilityListById`;
          this.dataService.post(service, payload).subscribe((result: any) => {
            if(result.message == 'Success'){
              Swal.fire(result.result[0], '', 'success');
              this.router.navigate(['/views/transactions/openingBalances/liability']);
              this.accountLiabilityForm.reset();
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
    const payload =  this.liabilityId
    var service = `${this.globals.APIURL}/OpeningBalanceLiability/DeleteLiabilityListById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      if(result.message == 'Success'){
        Swal.fire(result.result[0], '', 'success');
        this.router.navigate(['/views/transactions/openingBalances/liability']);
        this.accountLiabilityForm.reset();
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


  Cancel(){
    this.router.navigate(['/views/transactions/openingBalances/liability']);
  }
  enableEdit(){
    this.accountLiabilityForm.enable()
    this.isSavemode = true
    }

}