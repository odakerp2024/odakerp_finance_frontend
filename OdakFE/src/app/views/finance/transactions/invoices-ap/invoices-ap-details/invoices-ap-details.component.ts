import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices-ap-details',
  templateUrl: './invoices-ap-details.component.html',
  styleUrls: ['./invoices-ap-details.component.css']
})
export class InvoicesApDetailsComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  isUpdateMode: boolean = false;
  isUpdateMode1: boolean = false;
  isUpdate: boolean = false;
  IsFinal: boolean = false;
  ModifiedOn: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedBy: string = '';
  invoiceForm: FormGroup;
  statusList: any = [];
  vendorsList: any = [];
  FileList: any = [];
  receiptList: any = [];
  openInvoiceList: any = [];
  autoGenerateCodeList: any = [];
  invoiceAPId: number = 0;
  private ngUnsubscribe = new Subject<void>();
  TotalDebitAmount: any;
  TotalCreditAmount: any;
  payload: any;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  newReceiptList : any =[];
  newInvoiceList : any =[];
  constructor(
    private ps: PaginationService,
    private autoCodeService: AutoCodeService,
    private fb: FormBuilder,
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private globals: Globals,
    private paymentService: PaymentVoucherService,
    private dataService: DataService,
  ) { }


  ngOnInit(): void {
    this.createInvoiceForm();
    this.getNumberRange();
    this.getStatus();
    this.getVendorList();
    this.route.params.subscribe(res => {
      if (res.id) {
       {
        this.invoiceAPId = res.id;
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateMode1 = false;
        this.getInvoiceInfo();
        this.invoiceForm.disable();
        }
    }
    })
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 521,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.invoiceForm.enable();
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

  getInvoiceInfo() {
    var service = `${this.globals.APIURL}/OutStandingInvoiceAP/GetOutStandingInvoiceAPById`;
    this.dataService.post(service, { OutStandingInvoiceId: this.invoiceAPId }).subscribe(async (result: any) => {
      this.FileList = [];
      this.receiptList = [];
      this.openInvoiceList = [];
      if (result.message == 'Success' && result['data'].Table.length > 0) {
        let tableInfo = result['data'].Table[0];
        this.ModifiedOn = tableInfo.UpdatedDate;
        this.CreatedOn = tableInfo.CreatedDate;
        this.ModifiedBy = tableInfo.UpdatedByName;
        this.CreatedBy = tableInfo.CreatedByName;
        for (let data of result['data'].Table1) { this.addReceiptInfo(); data.VoucherDate = this.datePipe.transform(data.VoucherDate, 'y-MM-dd') }
        for (let data of result['data'].Table2) { this.addOpenInvoiceInfo(); data.InvoiceDate = this.datePipe.transform(data.InvoiceDate, 'y-MM-dd') }
        if (tableInfo.IsFinal) this.IsFinal = true;
        this.invoiceForm.patchValue({
          OutStandingInvoiceId: tableInfo.OutStandingInvoiceId,
          ReferenceNo: tableInfo.ReferenceNo,
          OutStandingReferenceDate: this.datePipe.transform(tableInfo.OutStandingReferenceDate, 'yyyy-MM-dd'),
          StatusId: tableInfo.StatusId,
          PartyId: tableInfo.PartyId,
          Remarks: tableInfo.Remarks,
          TotalDebitAmount: tableInfo.TotalDebitAmount,
          TotalCreditAmount: tableInfo.TotalCreditAmount,
          TotalVoucherSetOffAmount: tableInfo.TotalVoucherSetOffAmount,
          TotalInvoiceSetOffAmount: tableInfo.TotalInvoiceSetOffAmount,
          IsFinal: tableInfo.IsFinal,
          IsDelete: tableInfo.IsDelete ? tableInfo.IsDelete : 0,
          CreatedBy: tableInfo.CreatedBy,
          receiptInfo: result['data'].Table1,
          openInvoiceInfo: result['data'].Table2
        });
        this.receiptList = result['data'].Table1;
        this.openInvoiceList = result['data'].Table1;
        this.TotalDebitAmount = tableInfo.TotalDebitAmount;
        this.TotalCreditAmount = tableInfo.TotalCreditAmount;
        if (result['data'].Table3.length > 0) this.FileList = result['data'].Table3;
      }
    }, error => { console.error(error) });
  }

  createInvoiceForm() {
    this.invoiceForm = this.fb.group({
      OutStandingInvoiceId: [this.invoiceAPId],
      ReferenceNo: [''],
      OutStandingReferenceDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      StatusId: [1],
      PartyId: [0],
      Remarks: [''],
      TotalDebitAmount: [''],
      TotalCreditAmount: [''],
      TotalVoucherSetOffAmount: [''],
      TotalInvoiceSetOffAmount: [''],
      IsFinal: [0],
      IsDelete: [0],
      CreatedBy: [localStorage.getItem('UserID')],
      receiptInfo: this.fb.array([]),
      openInvoiceInfo: this.fb.array([])
    })
  }

  addReceiptInfo() {
    const add = this.invoiceForm.get('receiptInfo') as FormArray;
    add.push(this.fb.group({
      InvoiceVoucherDetailId: [0],
      OutStandingInvoiceId: [this.invoiceAPId],
      VoucherId: [0],
      VoucherNumber: '',
      VoucherDate: [''],
      VoucherAmount: [''],
      IsAdjusted: ['NO'],
      PendingAmount: [''],
      AdjustedAmount: [''],
      IsSelect: [0]
    }));
  }

  addOpenInvoiceInfo() {
    const add = this.invoiceForm.get('openInvoiceInfo') as FormArray;
    add.push(this.fb.group({
      OutStandingInvoiceDetailId: [0],
      OutStandingInvoiceId: [this.invoiceAPId],
      InvoiceId: [0],
      InvoiceNumber: [''],
      InvoiceDate: [''],
      InvoiceAmount: [''],
      IsAdjusted: ['No'],
      PendingAmount: [''],
      AdjustedAmount: [''],
      IsSelect: [0]
    }));
  }

  getStatus() {
    var service = `${this.globals.APIURL}/Common/GetStatusDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.statusList = result.data.Table;
      }
    }, error => { });
  }

  getVendorList() {
    return new Promise((resolve, reject) => {
      this.paymentService.getVendorList({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          if (result["data"].Table.length) {
            this.vendorsList = result["data"].Table.filter(x => x.OnboradName == 'CONFIRMED' && x.Status == 'Active');
            resolve(true);
          }
        }
      }, (error: HttpErrorResponse) => {
        reject();
      });
    })
  }

  partyEvent(event) {
    var service = `${this.globals.APIURL}/OutStandingInvoiceAP/OutStandingInvoiceAPDropDown`;
    this.dataService.post(service, { VendorId: event }).subscribe((result: any) => {
      this.receiptList = [];
      this.openInvoiceList = [];
      this.clearFormArray();
      if (result.message == "Success" && result.data.Table.length > 0) {
        for (let data of result.data.Table) {
          this.addReceiptInfo();
          this.receiptList.push({
            InvoiceVoucherDetailId: 0,
            OutStandingInvoiceId: this.invoiceAPId,
            VoucherId: 0,
            VoucherNumber: data.Voucher,
            VoucherDate: this.datePipe.transform(new Date(data.Date), 'dd-MM-y'),
            VoucherAmount: Number(data.Amount),
            IsAdjusted: 'NO',
            PendingAmount: data.OpenAmount ? data.OpenAmount : Number(data.Amount),
            AdjustedAmount: '',
            IsSelect: 0
          });
        }
        this.invoiceForm.patchValue({ receiptInfo: this.receiptList });
        this.newReceiptList = this.receiptList;
        if (result.data.Table1.length > 0) {
          for (let data of result.data.Table1) {
            this.addOpenInvoiceInfo();
            this.openInvoiceList.push({
              OutStandingInvoiceDetailId: 0,
              OutStandingInvoiceId: this.invoiceAPId,
              InvoiceId: 0,
              InvoiceNumber: data.Voucher,
              InvoiceDate: this.datePipe.transform(new Date(data.Date), 'dd-MM-y'),
              InvoiceAmount: Number(data.Amount),
              IsAdjusted: 'NO',
              PendingAmount: data.OpenAmount ? data.OpenAmount : Number(data.Amount),
              AdjustedAmount: '',
              IsSelect: 0
            });
          }
        }
        this.invoiceForm.patchValue({ openInvoiceInfo: this.openInvoiceList });
        this.newInvoiceList = this.openInvoiceList;
      }
    }, error => { });
  }

  get ReceiptInfo(): FormArray {
    return this.invoiceForm.get('receiptInfo') as FormArray;
  }

  get OpenInvoiceInfo(): FormArray {
    return this.invoiceForm.get('openInvoiceInfo') as FormArray;
  }

  clearFormArray(): void {
    const items1 = this.invoiceForm.get('receiptInfo') as FormArray;
    const items2 = this.invoiceForm.get('openInvoiceInfo') as FormArray;
    items1.clear();
    items2.clear();
  }

  setOffChangeEvent(data, index, type) {
    if (type == 'Receipts') {
      const controlAtIndex = this.ReceiptInfo.at(index);
      const pendingAmount = this.newReceiptList.at(index).PendingAmount - controlAtIndex.value.AdjustedAmount;
      if (pendingAmount >= 0) {
        controlAtIndex.patchValue({ PendingAmount: pendingAmount });
      }
      else {
        Swal.fire('Your amount has exceeded the limit!');
        controlAtIndex.patchValue({ PendingAmount: controlAtIndex.value.PendingAmount });
        controlAtIndex.patchValue({ AdjustedAmount: 0 });
      }
      this.calculateCreditDebitAmount(type);
    }
    else if (type == 'Invoices') {
      const controlAtIndex = this.OpenInvoiceInfo.at(index);
      const pendingAmount = this.newInvoiceList.at(index).PendingAmount - controlAtIndex.value.AdjustedAmount;
      if (pendingAmount >= 0) {
        controlAtIndex.patchValue({ PendingAmount: pendingAmount });
      }
      else {
        Swal.fire('Your amount has exceeded the limit!');
        controlAtIndex.patchValue({ PendingAmount: controlAtIndex.value.PendingAmount });
        controlAtIndex.patchValue({ AdjustedAmount: 0 });
      }
      this.calculateCreditDebitAmount(type);
    }
  }
  
  onSelectEvent(index: number, type: string) {
    if (type == 'Receipts') {
      const controlAtIndex = this.ReceiptInfo.at(index);
      if (controlAtIndex.value.IsSelect == true) { controlAtIndex.patchValue({ IsAdjusted: 'YES' }); }
      else { controlAtIndex.patchValue({ IsAdjusted: 'NO' }); }
      this.calculateCreditDebitAmount(type);
    }
    else if (type == 'Invoices') {
      const controlAtIndex = this.OpenInvoiceInfo.at(index);
      if (controlAtIndex.value.IsSelect == true) { controlAtIndex.patchValue({ IsAdjusted: 'YES' }); }
      else { controlAtIndex.patchValue({ IsAdjusted: 'NO' }); }
      this.calculateCreditDebitAmount(type);
    }
  }

  calculateCreditDebitAmount(type: string) {
    if (type == 'Receipts') {
      var AdjustedAmountReceipt = 0;
      if (this.invoiceForm.value.receiptInfo.length > 0) {
        for (let data of this.invoiceForm.value.receiptInfo) {
          if (data.IsSelect) { AdjustedAmountReceipt += data.AdjustedAmount; }
        }
        this.invoiceForm.controls['TotalDebitAmount'].setValue(AdjustedAmountReceipt);
        this.TotalDebitAmount = AdjustedAmountReceipt;
      }
      else { this.invoiceForm.controls['TotalDebitAmount'].setValue(AdjustedAmountReceipt); }
    }
    else if (type == 'Invoices') {
      var AdjustedAmountInvoice = 0;
      if (this.invoiceForm.value.openInvoiceInfo.length > 0) {
        for (let data of this.invoiceForm.value.openInvoiceInfo) {
          if (data.IsSelect) { AdjustedAmountInvoice += data.AdjustedAmount; }
        }
        this.invoiceForm.controls['TotalCreditAmount'].setValue(AdjustedAmountInvoice);
        this.TotalCreditAmount = AdjustedAmountInvoice;
      }
      else { this.invoiceForm.controls['TotalCreditAmount'].setValue(AdjustedAmountInvoice); }
    }
  }

  fileSelected(event) {
    if (event.target.files.length > 0 && this.FileList.length < 5) {
      this.FileList.push({
        OutStandingDocumentId: 0,
        OutStandingInvoiceId: this.invoiceAPId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name
      })
    }
    else {
      Swal.fire('A maximum of five files must be allowed.');
    }
  }

  OnClickDeleteValueFile(index: number) {
    this.FileList.splice(index, 1);
  }

  async saveInfo(status, isDelete = false) {
  
    var validation = "";
    if (this.invoiceForm.value.StatusId == "" || this.invoiceForm.value.StatusId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Status.</span></br>"
    }
    // if (this.invoiceForm.value.ReferenceNo == "" || this.invoiceForm.value.ReferenceNo == 0) {
    //    validation += "<span style='color:red;'>*</span> <span>Please generate AP set off reference #.</span></br>"
    // }
    if (this.invoiceForm.value.PartyId == "" || this.invoiceForm.value.PartyId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Party.</span></br>"
    }

    if(status == 2 && !this.invoiceAPId){
      this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_view']);
      return
    }
     
  if(status && !this.IsFinal){
    await this.autoCodeGeneration('Invoice')
  }
  

    if (validation != "") {
      if(status != 2){
      Swal.fire(validation)
      return false;
      }
    }

    await this.createPayload(status);
     let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit`;
    let deleteMsg = `Do you want to Delete this Details?`;
    
    let combinedText: string;

    if (status === 1) {
      combinedText = finalMsg;
    } else if (status === 0) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else {
      combinedText = closeMsg;
    }
     // set Delete flag
          if(isDelete && this.isUpdate){
            this.invoiceForm.controls['IsDelete'].setValue(1); 
          }

      //  Its finaled already and cancelled
      if (status == 2 && this.IsFinal) {
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
    }).then((result) => {
      if (result.isConfirmed) {

     // If canceled 

        if(status == 2 ){
          this.ViewPage();
          return;
        }

        let service = `${this.globals.APIURL}/OutStandingInvoiceAP/SaveOutStandingInvoiceAP`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {


            Swal.fire(result.data.Message, '', 'success');
         
            this.isUpdateMode = true;
            this.isUpdateMode1 = true;

            if(status == 0){
              this.invoiceAPId = Number(result.data.Id);
                this.isUpdateMode = true;
                this.isUpdateMode1 = true;
            }
          
            if (this.isUpdate && status && !this.IsFinal) {
               this.updateAutoGenerated();
               }

               if(isDelete && this.isUpdate){
                this.ViewPage();
              }

               if (!this.isUpdate && !this.IsFinal) {
                  const OutStandingInvoiceId = result.data.Id;
                  this.editinvoiceAP(OutStandingInvoiceId)
                } 
          }
          if(status == 1){
           this.ViewPage();
             
            return;          
          }

        }, error => {
          console.error(error);
        });
      }
    });
  }

  editinvoiceAP(id: number) {
    this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_Details', { id: id, isUpdate: true }]);
  }

  ViewPage(){
    this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_view']);
  }

  goBack(){
    // If finaled allow to rediret to list page
    if(this.IsFinal){
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
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Invoices set off AP');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  createPayload(status) {
    let info = this.invoiceForm.value;
    let table = {
      OutStandingInvoiceId: this.invoiceAPId,
      ReferenceNo: info.ReferenceNo,
      OutStandingReferenceDate: new Date(info.OutStandingReferenceDate),
      StatusId: status == 1 ? 2 : 1,
      PartyId: info.PartyId,
      Remarks: info.Remarks,
      TotalDebitAmount: Number(info.TotalDebitAmount),
      TotalCreditAmount: Number(info.TotalCreditAmount),
      TotalVoucherSetOffAmount: Number(info.TotalDebitAmount),
      TotalInvoiceSetOffAmount: Number(info.TotalCreditAmount),
      IsFinal: status,
      IsDelete: info.IsDelete,
      CreatedBy: info.OutStandingInvoiceId
    }
    let table1 = this.invoiceForm.value.receiptInfo.filter(x => x.IsSelect == true);
    let table2 = this.invoiceForm.value.openInvoiceInfo.filter(x => x.IsSelect == true);
    table1.map(x => {
      x.VoucherDate = new Date(x.VoucherDate);
      x.IsAdjusted = x.IsAdjusted == 'YES' ? 1 : 0;
      x.IsSelect = x.IsSelect == true ? 1 : 0;
    })
    table2.map(x => {
      x.InvoiceDate = new Date(x.InvoiceDate);
      x.IsAdjusted = x.IsAdjusted == 'YES' ? 1 : 0;
      x.IsSelect = x.IsSelect == true ? 1 : 0;
    })
    this.payload = {
      OutStandingInvoiceAP: {
        'Table': [table],
        'Table 1': table1,
        'Table 2': table2,
        'Table 3': this.FileList
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
          // this.autoCodeGeneration('Invoice');
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
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Invoices set off AP');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.invoiceForm.controls['ReferenceNo'].setValue(code.trim().toUpperCase());
          resolve(true);
        }
        else {
          Swal.fire('Please create the auto-generation code for Invoices set off AP.')
          resolve(true);
       }
      }
      else {
        this.invoiceForm.controls['ReferenceNo'].setValue('');
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

    for (var i = 0; i < sectionInfo.length; i++) {
      var condition = i == 0 ? sectionInfo[i].sectionA : i == 1 ? sectionInfo[i].sectionB : i == 2 ? sectionInfo[i].sectionC : i == 3 ? sectionInfo[i].sectionD : sectionInfo[i].sectionD;
      switch (condition) {
        case 'Office Code (3 Chars)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'Running Number (3 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (4 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (5 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (6 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (7 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Office Code (4 Chars)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'Division Code (4 Chars)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'Division Code (3 Chars)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
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

}
