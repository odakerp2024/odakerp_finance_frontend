import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { AutoGenerationCodeService } from 'src/app/services/auto-generation-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { PaymentBatchService } from 'src/app/services/financeModule/payment-batch.service';
import { PaymentRequestService } from 'src/app/services/financeModule/payment-request.service';
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-in-progress',
  templateUrl: './payment-in-progress.component.html',
  styleUrls: ['./payment-in-progress.component.css']
})
export class PaymentInProgressComponent implements OnInit {
  // @Output() activeTab = new EventEmitter()
  inProgressForm: FormGroup
  openRequestDropdownForm: FormGroup
  divisionList: any[];
  officeList: any = [];
  vendorsList: any = [];
  priorityRequest: any = [];
  totalInProgressRequest: any;
  amount: any;
  PaymentBatchInProgressList : any = []
  invoiceResultArray: any = [];
  finalInvoiceresultArray: any = [];
  paymentModeList: any;
  private ngUnsubscribe = new Subject<void>();
  isCheck: boolean = false
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable('DateFormat')
  pager: any = {};
  pagedItems: any[];// paged items
  selectedItems: any = [];
  currencyList: any = [];
  receivedCurrencyName: any = [];
  resultArray: any = [];
  numberRangeList: any;
  NextNumber: any
  NextNumber1: any;
  newGeneratedCode: any
  isSuccess = true;


  constructor(
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private paymentBatchService: PaymentBatchService,
    private paymentService: PaymentVoucherService,
    public commonService: CommonService,
    private ps: PaginationService,
    private autoCodeService: AutoCodeService,
    private globals: Globals,
    private dataService: DataService,
    private autoGenerationCodeService: AutoGenerationCodeService

  ) { }

  ngOnInit(): void {
    
    this.getDivisionList();
    this.getOfficeList();
    this.getVendorList();
    this.getAllDropdown();
    this.getModeOfPayment();
    this.getCurrency();
    this.getNumberRangeList();
    this.CreateForm();
    this.GetPaymentBatchInProgresstList()
  }


  CreateForm() {
    this.openRequestDropdownForm = this.fb.group({
      DivisionId: [0],
      VendorId: [0],
      OfficeId: [0],
      Amount: [],
      RequestPriority: [0]
    });

    this.inProgressForm = this.fb.group({
      BankId: [0],
      PaymentDate: [new Date()],  
      PRNumber: [0],
      PaymentRequestId: [0],
      PaymentRequestInvoiceId: [0],
      PurchaseInvoice: [0],
      Amount: [],
      ModeOfPaymentId: [0],
      CreatedBy: parseInt(localStorage.getItem('UserID')),
      BankCurrencyId:[0],
      BankCharge: [0],
      Reference: [],
      OfficeId: [0],
      DivisionId: [0],
      PaymentVoucherNumber: ['']
    });
  }

  getModeOfPayment(){
    this.paymentService.getModeOfPayment({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result.message == "Success") {
        this.paymentModeList = result['data'].Table;
      }
    })
  }

  GetPaymentBatchInProgresstList(){
    this.resultArray = []
    const payload = 
    {
      DivisionId:  this.openRequestDropdownForm.value.DivisionId,
      VendorId:  this.openRequestDropdownForm.value.VendorId,
      OfficeId:  this.openRequestDropdownForm.value.OfficeId,
      Amount:  this.openRequestDropdownForm.value.Amount ? this.openRequestDropdownForm.value.Amount : 0,
      RequestPriority:  this.openRequestDropdownForm.value.RequestPriority,
    }
    this.paymentBatchService.GetPaymentBatchInProgresstList(payload).subscribe((result) => {

      if (result.message == 'Success') {
        const resultData = result.data;
        this.totalInProgressRequest = result.data.countList[0].TotalOpenRequest
        this.amount = result.data.countList[0].TotalPurchaseInvoiceAmount
        this.PaymentBatchInProgressList = resultData.paymentRequestList.length ? resultData.paymentRequestList : [];

        for (let i = 0; i < this.PaymentBatchInProgressList.length; i++) {
          // Rename the 'code' key to 'newCode'
          this.PaymentBatchInProgressList[i].TotalAmount = this.PaymentBatchInProgressList[i].PurchaseInvoiceAmount;
        }
        this.PaymentBatchInProgressList.forEach(item => {
          (item as any).IsCheck1 = false; // Using `any` to avoid TypeScript errors if `isChecked` doesn't exist in the interface
        });
        this.setPage(1);
      }
    });
  }

  getDivisionList() { 
    this.commonDataService.getDivision({}).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList() {
    this.commonDataService.getOffice({}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getCurrency(){
      const payload = { "currencyId": 0, "countryId": 0 };
      this.paymentService.getCurrencyLists(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          this.currencyList = result['data'];
          const entityInfo: any = this.commonDataService.getLocalStorageEntityConfigurable();
          this.receivedCurrencyName = entityInfo.Currency
        }
      });

  }

  getVendorList() {
    this.commonDataService.GetAllVendorDropdownList({}).subscribe((result: any) => {
      this.vendorsList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.vendorsList = result.data.Table
      }
    }, error => { });
  }
     

  getAllDropdown(){
    this.paymentBatchService.getDropdown({}).subscribe((result) => {
      if (result.message == 'Success') {
        const resultData = result.data;
        this.priorityRequest = resultData.Table2.length ? resultData.Table2 : [];
      }
    });
  }

  search(){

   this.GetPaymentBatchInProgresstList();
  }

  clear(){
    this.pager = [0]
    this.CreateForm();
    this.GetPaymentBatchInProgresstList();
  }

  finalPayload(value: any){
    const Table = [] 
    value.forEach(item => {
      const data = {
        "BatchId": item.BatchId,
        "PaymentRequestId": item.PaymentRequestId,
        "PRNumber": item.PRNumber,
        "DivisionId": item.DivisionId,
        "VendorId": item.VendorId,
        "TotalAmount": item.TotalAmount,
        "BankId": item.BankId,
        "ModeOfPaymentId": item.ModeOfPaymentId,
        "Reference": item.Reference,
        "BankCurrencyId": item.BankCurrencyId,
        "BankCharge": item.BankCharge,
        "PaymentVoucherNumber": item.PaymentVoucherNumber,
        "CreatedBy": 1,
        "RequestType": item.RequestType,
      }
     
      Table.push(data)
    });
   console.log(Table,"wergterghwreher")
    return Table;
  }

  async update(){
    let checkValue = true
    this.selectedItems = this.selectedItems.map(item => {
      return { ...item ,   CreatedBy: this.inProgressForm.value.CreatedBy, PaymentVoucherNumber:  this.inProgressForm.value.PaymentVoucherNumber	};
    });
    

    this.resultArray = this.selectedItems.map(item => {
      const { VendorName,DivisionName,BankName,IsCheck1,RequestDateAndTime,PaymentDate,ReferenceNumber,Requester,PurchaseInvoiceAmount,OfficeId, ...newItem } = item;
      return newItem;
    });

if(this.resultArray.length == 0){
  this.isSuccess = false
  Swal.fire("Please select atleast one invoice");

}

else{
  await this.resultArray.forEach(async obj => {
        if(!obj.ModeOfPaymentId || obj.Reference == null || !obj.BankCurrencyId || obj.Reference == "" ){
          Swal.fire("Please fill all the fields for the selected Invoice !");
          checkValue =  false
        } 
  
        if(!obj.TotalAmount){
          Swal.fire("Amount is not valid for the below PR Number",obj.PRNumber.toUpperCase());
          this.isSuccess = false
          return
        }
      });
}
    if(this.isSuccess && checkValue){

      if(checkValue){
        for (let i = 0; i < this.selectedItems.length; i++) {
          if(i == 0){
            this.NextNumber1 = this.NextNumber
          }
          else{
            this.NextNumber1 = this.NextNumber + i
          }

          this.inProgressForm.value.DivisionId = this.selectedItems[i].DivisionId
          this.inProgressForm.value.OfficeId = this.selectedItems[i].OfficeId
  
          
          await this.autoCodeGeneration('Payment Voucher');
          this.resultArray[i].PaymentVoucherNumber = this.newGeneratedCode
          this.resultArray[i].TotalAmount = this.resultArray[i].TotalAmount.toString()
          this.resultArray[i].BankCharge = this.resultArray[i].BankCharge ? this.resultArray[i].BankCharge : '0'
        }
  
        const payload = {
          PaymentBatchRequest: {
            // Table: this.resultArray,
            Table: this.finalPayload(this.resultArray)
          },
        };
        console.log(payload, 'payloadpayloadpayloadpayload')
        this.updateAutoGenerated();
        this.paymentBatchService.UpdatePaymentBatchInProgresstList(payload).subscribe((result) => {
    
          if (result.message == 'Success') {
            this.PaymentBatchInProgressList = []
            const resultData = result.data;
            this.totalInProgressRequest = result.data.countList[0].TotalOpenRequest
            this.amount = result.data.countList[0].TotalPurchaseInvoiceAmount
            this.PaymentBatchInProgressList = resultData.paymentRequestList.length ? resultData.paymentRequestList : [];
            // this.activeTab.emit('Closed Payments')
    
            // this.PaymentBatchInProgressList.forEach(item => {
            //   (item as any).IsCheck1 = false; 
            // });
            this.setPage(1);
          }
        });
           
      }

    }

  }

  omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  OnClickRadio(index, type: string, data: any, event: any) {
  const checkedValue = event.target.checked;

  // this.PaymentBatchInProgressList[index]['IsCheck1'] = checkedValue;
  if(event.target.checked) {
    // this.isCheck == true
    this.selectedItems.push(this.PaymentBatchInProgressList[index]);
  }
  else{
    const index1 = this.selectedItems.findIndex(
      (x) => {  
        return x.PRNumber === data.PRNumber 
      }
      );
    this.selectedItems.splice(index1, 1);
  }
  }
  setCurrencyId(value: any,data: any){

    var currencyIndex: any = this.selectedItems.findIndex(
      (x) => {
        return x.PRNumber === data.PRNumber  
      })
      this.selectedItems[currencyIndex].BankCurrencyId = this.inProgressForm.value.BankCurrencyId;

  }

  setModeOfPayment(data: any){

    var modeOfPaymentIndex: any = this.selectedItems.findIndex(
      (x) => {
        return x.PRNumber === data.PRNumber  
      })
      this.selectedItems[modeOfPaymentIndex].ModeOfPaymentId = this.inProgressForm.value.ModeOfPaymentId;
     

  }

  setReferenceNumber(data: any){

    var referenceIndex: any = this.selectedItems.findIndex(
      (x) => {
        return x.PRNumber === data.PRNumber  
      })
      this.selectedItems[referenceIndex].Reference = this.inProgressForm.value.Reference;
    
  }

  setBankCharge(data: any){

    var BankChargeIndex: any = this.selectedItems.findIndex(
      (x) => {
        return x.PRNumber === data.PRNumber  
      })
      this.selectedItems[BankChargeIndex].BankCharge = this.inProgressForm.value.BankCharge;
  }
reverseRequest(){
 this.finalInvoiceresultArray = this.selectedItems.map(item => {
  const { DivisionId,VendorId,BankId,ModeOfPaymentId,TotalAmount,RequestType,VendorName,DivisionName,BankName,IsCheck1,RequestDateAndTime,PaymentDate,ReferenceNumber,Requester,PurchaseInvoiceAmount,OfficeId,BankCharge,BankCurrencyId,Reference, ...newItem } = item;
  return newItem;
});

if(this.finalInvoiceresultArray.length==0){
  Swal.fire("Please select Atleast one record!");
}
else{

  console.log(this.finalInvoiceresultArray,'this.finalInvoiceresultArray')
  const payload = {
    "PaymentBatchReverse": {
      "Table": this.finalInvoiceresultArray,
      }
  };
   this.paymentBatchService.ReverseInProgressInvoice(payload).subscribe((result) => {     
    if (result.message == 'Success') {
      Swal.fire(result.data);
      this.ngOnInit();
      // window.location.reload();  
    }
  });
}
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.PaymentBatchInProgressList.length, page);

    if(this.PaymentBatchInProgressList.length == 0){
      this.pagedItems = [];
    }
    
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get current page of items
    this.pagedItems = this.PaymentBatchInProgressList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    // this.inProgressForm.value.DivisionId = obj.DivisionId
    //   this.inProgressForm.value.OfficeId = obj.OfficeId
  
    // if (this.inProgressForm.value.Table.DivisionId && this.inProgressForm.value.Table.OfficeId) {
    //   officeInfo = this.officeList.find(x => x.ID == this.inProgressForm.value.Table.OfficeId);
    //   divisionInfo = this.divisionList.find(x => x.ID == this.inProgressForm.value.Table.DivisionId);
    // }

    if (this.inProgressForm.value.DivisionId && this.inProgressForm.value.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.inProgressForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.inProgressForm.value.DivisionId);
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

  autoCodeGeneration(event: any) {
    return new Promise(async (resolve, reject) => { 
      // if (!this.isUpdate) {
        if (event) {
          let paymentVoucher = this.numberRangeList.filter(x => x.ObjectName == 'Payment Voucher');
          if (paymentVoucher.length > 0) {
            paymentVoucher[0].NextNumber = this.NextNumber1
            let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: paymentVoucher[0].SectionA }, { sectionB: paymentVoucher[0].SectionB }, { sectionC: paymentVoucher[0].SectionC }, { sectionD: paymentVoucher[0].SectionD }],this.NextNumber1, event);
            let code = this.autoCodeService.NumberRange(paymentVoucher[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
            if (code) 
            this.inProgressForm.controls['PaymentVoucherNumber'].setValue(code.trim().toUpperCase());
            // this.newGeneratedCode = this.inProgressForm.controls['PaymentVoucherNumber'].value.setValue(code.trim().toUpperCase());
            this.newGeneratedCode = code.trim().toUpperCase()

            console.log(this.newGeneratedCode,'this.newGeneratedCode')

            // this.selectedItems = this.inProgressForm.controls['PaymentVoucherNumber'].value

            // this.resultArray = this.resultArray.map(item => {
            //   return { ...item, PaymentVoucherNumber: this.inProgressForm.controls['PaymentVoucherNumber'].value};
            // });

            // console.log(this.resultArray,'this.resultArray____new join')
            resolve(true);
          }
          else {
            Swal.fire('Please create the auto-generation code for Receipt Voucher.')
            resolve(true);
          }
        }
        else {
          this.inProgressForm.controls['PaymentVoucherNumber'].setValue('');
          console.log(this.inProgressForm.controls['PaymentVoucherNumber'].setValue(''),'this.inProgressForm.controls')
          reject(false);
        }
      // } else {
      //   resolve(true);
      // }
    });
}


getNumberRangeList(){
  this.autoGenerationCodeService.getNumberRangeList({ Id: 0 }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
    if(result.message == "Success"){
      this.numberRangeList = result['data'].Table;
       let Info = this.numberRangeList.filter(x => x.ObjectName == 'Payment Voucher');
       this.NextNumber = Info[0].NextNumber
      // this.autoCodeGeneration();
      // console.log('numberRangeList', this.numberRangeList)
    }
  })
}

updateAutoGenerated() {

  let Info = this.numberRangeList.filter(x => x.ObjectName == 'Payment Voucher');
  if (Info.length > 0) {
    Info[0].NextNumber = Info[0].NextNumber + this.resultArray.length;
    let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
    this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((result: any) => {
      if (result.message == "Success") {
        Swal.fire(result.data);    
        this.ngOnInit();
      }
    }, error => {
      console.error(error);
    });
  }
}

}
