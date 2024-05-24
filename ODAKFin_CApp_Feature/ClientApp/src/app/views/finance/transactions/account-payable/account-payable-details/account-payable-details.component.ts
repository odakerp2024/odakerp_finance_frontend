
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
  selector: 'app-account-payable-details',
  templateUrl: './account-payable-details.component.html',
  styleUrls: ['./account-payable-details.component.css']
})
export class AccountPayableDetailsComponent  implements OnInit {
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  accountPayableId: any;
  divisionList: any[];
  officeList: any[];
  currencyList: any[];

  vendorList: any;
  CreatedOn: string = '';
  CreatedBy =  localStorage.getItem('UserID')
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);
  accountPayableForm: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  isUpdate: Boolean = false;
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  isCreate: Boolean = true;
  isUpdateButtonDisable: boolean = true;
  Isflag: any[];
  isSavemode: boolean;
  isEnable: number;
  isEditButton: boolean = false;
  resultValues: any[];
  formattedErrorMessages: any;
  VendorCodeList: any;
  VendorBranch:any;
  debitCreditList = [
    { value: 1, debitCreditName: 'Debit' },
    { value: 0, debitCreditName: 'Credit' }
  ];



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private PaymentReceivableService : PaymentReceivableService,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private commonDataService: CommonService,
    private fb: FormBuilder,

  ) {  } 

  ngOnInit(): void {

    this.CreateForm(); 
     this.getCurrency();
    this.getDivisionList();
     
    this.route.params.subscribe(async(param) => {
      if (param.id) {
        this.isUpdate = true;
        this.isCreate = false
        this.accountPayableForm.disable();
        // this.createReceiptForm();
        this.accountPayableId = parseInt(param.id);
        this.getAccountPayableIdByID();
        // this.receiptForm.disable();
      } 
    })
  }

  CreateForm() {
    this.accountPayableForm = this.fb.group({
      Id: [0],
      OBReference: [''],
      OBDate: [''],
      Division: [''],
      DivisionId:[''],
      Office: [''],
      OfficeId:[''],
      Remarks: [''],
      VendorName: [''],
      VendorBranch: [''],
      PurchaseInvoice: [''],
      PurchaseInvoiceDate: [this.currentDate],
      InvoiceCurrency: [''],
      Exchange: [''],
      DebitorCredit: [''],
      InvoiceAmountICY: [''],
      InvoiceAmountCCY: [''],
      DueAmountICY: [''],
      DueAmountCCY: [''],
      CreatedDate: [new Date()],
      ModifiedDate: [new Date()],
      CreatedBy: this.CreatedBy,
      UpdatedBy: [localStorage.getItem('UserID')],
    });
  }
  
 async getAccountPayableIdByID() {
  debugger
    const payload =  this.accountPayableId
    var service = `${this.globals.APIURL}/AccountsPayable/GetAccountPayableListId`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {

      console.log(result,'AccountsPayable/GetAccountPayableListId')
      if(result.message == 'Success'){
        let info = result.data.Table[0];
        this.isEnable = info.Isflag
        if(this.isEnable == 0){
          this.isEditButton = true
          // this.isSavemode = true
        } else {
          
          // Swal.fire("Can't able to edit this invoice !");
          this.isEditButton = false
        }
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat1);
        this.ModifiedOn = this.datePipe.transform(info.ModifiedDate, this.entityDateFormat1);
       debugger
       await this.getVendorBranch(info.VendorId, true);
       await this.getVendorList(info.DivisionId);
       await this.getOffice(info.DivisionId);
        this.accountPayableForm.patchValue({      
          ReceiptVoucherId: this.accountPayableId,
          VendorName: info.VendorId,
          VendorBranch: info.VendorBranchId,
          Division: info.Division,
          DivisionId: info.DivisionId,
          Office: info.Office,
          OfficeId: info.OfficeId,
          PurchaseInvoice: info.PurchaseInvoice,
          PurchaseInvoiceDate: this.datePipe.transform(new Date(info.PurchaseInvoiceDate), "yyyy-MM-dd") ,
          InvoiceCurrency: info.InvoiceCurrency,
          Exchange: info.Exchange,
          DebitorCredit: info.DebitorCredit,
          InvoiceAmountICY: parseFloat(info.InvoiceAmountICY).toFixed(3),
          InvoiceAmountCCY: parseFloat(info.InvoiceAmountCCY).toFixed(3),
          DueAmountICY: parseFloat(info.DueAmountICY).toFixed(3),
          DueAmountCCY: parseFloat(info.DueAmountCCY).toFixed(3),
          ModifiedBy: info.ModifiedBy,
          OBReference: info.OBReference,
          OBDate: this.datePipe.transform(info.OBDate, 'dd-MM-yyyy'),
          Isflag:info.Isflag,
        });

     var validation = "";
      if(info.Isflag == 1){
        debugger
          validation += "<span>Updating or deleting the selected invoices is not feasible as they are already associated with a Payment voucher.</span></br>"
      }  
      if (validation != "") {
        Swal.fire(validation)
        return false;
      }

    }
  })
  }

  getVendorBranch(event: any, isUpdate = false) {
    debugger
    const service = `${this.globals.APIURL}/PaymentVoucher/PaymentVoucherBillDuePaymentList`;
    this.dataService.post(service, { VendorId: event }).subscribe((result: any) => {
      this.VendorCodeList = [];
      if (result.data.Table1.length > 0) { 
        this.VendorCodeList = result.data.Table1;
      }
      console.log("okdd");
      if (!isUpdate) {
      // console.log(this.CustomerCodeList, 'customer list');
      this.accountPayableForm.get('VendorBranch').setValue('');
      // If customer has only one branch, auto-select it
      if (this.VendorCodeList.length === 1) {
        this.accountPayableForm.get('VendorBranch').setValue(this.VendorCodeList[0].VendorBranchID);
      }
    }
      
    }, error => { });
  }

  // getVendorBranchList(VendorId) {
  //   debugger
  //   const customerDetails = this.VendorCodeList.find(vendor => vendor.VendorID === VendorId);
  //   this.accountPayableForm.controls['CustomerBranch'].setValue('');
  //   if (customerDetails) {
  //     this.VendorBranch = this.VendorCodeList.filter(vendor => vendor.CustomerName === customerDetails.CustomerName);
  //     if (this.VendorBranch.length === 1) { // If customer has only one branch
  //       this.accountPayableForm.controls['CustomerBranch'].setValue(this.VendorBranch[0].CityName);
  //     }
  //   }
  // }
  getVendorList(ID) {
    debugger
    return new Promise((resolve, reject) => {
       let payload = { "DivisionId": ID }
       var service = `${this.globals.APIURL}/Common/GetCustomerAndVendorByDivisionId`;
   
       this.dataService.post(service, payload).subscribe((result: any) => {
         this.vendorList = [];
           this.accountPayableForm.controls['VendorName'].setValue('');
         if (result.message == "Success" && result.data.Table1.length > 0) {
           this.vendorList = result.data.Table1;
            resolve(true);
           }
       }, error => { 
          reject('')
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
  getDivisionList(filter?: string) { 
    debugger
    this.PaymentReceivableService.getDivision({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any)=>{
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  getOffice(Division){
    debugger
      return new Promise((resolve, reject) => {
        const payload = {DivisionId: Division}
        this.commonDataService.getOfficeByDivisionId(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any)=>{
          this.officeList = [];
           this.accountPayableForm.controls['OfficeId'].setValue('');
           this.accountPayableForm.controls['VendorName'].setValue('');
           this.accountPayableForm.controls['VendorBranch'].setValue('');
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
    debugger
      this.accountPayableForm.value.Id = this.accountPayableId
      var validation = "";
      if (this.accountPayableForm.value.DivisionId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Division </span></br>"
      }
      if (this.accountPayableForm.value.VendorBranch == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Vendor Branch </span></br>"
      }
      if (this.accountPayableForm.value.OfficeId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Office</span></br>"
      }
      if (this.accountPayableForm.value.VendorName == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Vendor Name</span></br>"
      }
      if (this.accountPayableForm.value.PurchaseInvoice == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter PurchaseInvoice</span></br>"
      }
      if (this.accountPayableForm.value.InvoiceCurrency == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter InvoiceCurrency</span></br>"
      }
      if (this.accountPayableForm.value.InvoiceAmountICY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter InvoiceAmountICY</span></br>"
      }
      if (this.accountPayableForm.value.DueAmountICY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter DueAmountICY</span></br>"
      }
      if (this.accountPayableForm.value.DueAmountCCY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter DueAmountCCY</span></br>"
      }
      if (this.accountPayableForm.value.InvoiceAmountCCY == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter InvoiceAmountCCY</span></br>"
      }
      if (this.accountPayableForm.value.Exchange == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Exchange</span></br>"
      }
      if (this.accountPayableForm.value.DebitorCredit == "") {
        validation += "<span style='color:red;'>*</span> <span>Please Select Debit/Credit</span></br>"
      }
      if (validation != "") {
        Swal.fire(validation)
        return false;
      }

    this.divisionList = [];
    for (let i = 0; i < this.divisionList.length; i++) { 
      this.accountPayableForm.get('Division').setValue(this.divisionList[i].DivisionName);
    }

    this.officeList = [];
    for (let i = 0; i < this.officeList.length; i++) {
      this.accountPayableForm.get('Office').setValue(this.officeList[i].OfficeName);
    }

    // this.vendorList = [];
    // for (let i = 0; i < this.vendorList.length; i++) {
    //   this.accountPayableForm.get('Vendor').setValue(this.vendorList[i].VendorName);
    // }
 
      const data = {
        "Id": this.accountPayableId,
        "Division": this.accountPayableForm.value.Division,
        "DivisionId": this.accountPayableForm.value.DivisionId,
        "OfficeId": this.accountPayableForm.value.OfficeId,
        "Office": this.accountPayableForm.value.Office,
        "Vendor": this.accountPayableForm.value.VendorName,
        "BranchName": this.accountPayableForm.value.VendorBranch,
        "PurchaseInvoice": this.accountPayableForm.value.PurchaseInvoice,
        "PurchaseInvoiceDate": this.accountPayableForm.value.PurchaseInvoiceDate,
        "InvoiceCurrency": this.accountPayableForm.value.InvoiceCurrency,
        "Exchange": this.accountPayableForm.value.Exchange,
        "DebitorCredit": this.accountPayableForm.value.DebitorCredit,
        "InvoiceAmountICY": this.accountPayableForm.value.InvoiceAmountICY,
        "InvoiceAmountCCY": this.accountPayableForm.value.InvoiceAmountCCY,
        "DueAmountICY": this.accountPayableForm.value.DueAmountICY,
        "DueAmountCCY": this.accountPayableForm.value.DueAmountCCY,
        "ModifiedBy": parseInt(this.CreatedBy)
      }

  
      const payload = {
        AccountsVendor: {
          Table: [data],
        },
      };
      console.log(payload,'this.payload.valpayloadForm.value,')
          let service = `${this.globals.APIURL}/AccountsPayable/UpdateAccountsPayableById`;
          this.dataService.post(service, payload).subscribe((result: any) => {
              if(result.message == 'Success'){
                Swal.fire(result.result[0], '', 'success');
                this.router.navigate(['/views/transactions/openingBalances/account-payable']);
                this.accountPayableForm.reset();
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
    const payload =  this.accountPayableId
    var service = `${this.globals.APIURL}/AccountsPayable/DeleteAccountPayableById`;
    this.dataService.post(service, { Id: payload }).subscribe(async (result: any) => {
      console.log(result)
     if(result.message == 'Success'){
                Swal.fire(result.result[0], '', 'success');
                this.router.navigate(['/views/transactions/openingBalances/account-payable']);
                this.accountPayableForm.reset();
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

    if(this.isEnable == 0){
      this.accountPayableForm.enable()
      this.isSavemode = true
      this.isUpdate = true
    } else {
      
      Swal.fire("Can't able to edit this invoice !");
      this.isUpdate = false
    }
    }
  Cancel(){
    this.router.navigate(['/views/transactions/openingBalances/account-payable']);
  }

}

