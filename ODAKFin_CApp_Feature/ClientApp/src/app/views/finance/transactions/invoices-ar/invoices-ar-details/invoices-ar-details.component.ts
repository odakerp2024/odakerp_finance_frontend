import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { AutoGenerationCodeService } from 'src/app/services/auto-generation-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoices-ar-details',
  templateUrl: './invoices-ar-details.component.html',
  styleUrls: ['./invoices-ar-details.component.css'],
  providers: [DatePipe]
})
export class InvoicesArDetailsComponent implements OnInit {

  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end

  isEditMode = true;
  IsFinal = false;
  ModifiedOn: string = '';
  CreatedOn: string = '';
  ModifiedBy: string = '';
  CreatedBy: string = '';
  statusList: any = [];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  invoiceForm: any;
  partyList = [];
  documentTableList = [];
  invoiceId: number;
  numberRangeList: any;
  customerList: any = [];
  receiptList: any = [];
  openInvoiceList: any = [];
  invoiceARId: any = 0;
  TotalDebitAmount: any;
  TotalCreditAmount: any;
  FileList: any = [];
  isUpdateMode: boolean = false;
  isUpdateMode1: boolean = false;
  newReceiptList : any =[];
  newInvoiceList : any = [];
  selectedFile: File = null;
  fileUrl: string;
  
  payload: any;
  isUpdate: boolean = false;
  autoGenerateCodeList: any[];

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private commonservice: CommonService,
    private route: ActivatedRoute,
    private autoCodeService: AutoCodeService,
    private globals: Globals,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createInvoiceForm();
    this.route.params.subscribe(res => {
      debugger
      if (res.id) {
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateMode1 = false;
        this.invoiceARId = res.id;
        this.getInvoiceInfo();
        this.invoiceForm.disable();
      }
    })
    
    this.getNumberRange();
    this.getStatus();
    this.getCustomerList();
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 519,
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

  deleteValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 519,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.saveInfo(0,true);
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

  deleteValueAttach(index){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 519,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.OnClickDeleteValueFile(index);
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
    var service = `${this.globals.APIURL}/OutStandingInvoiceAR/GetOutStandingInvoiceARById`;
    this.dataService.post(service, { OutStandingInvoiceId: this.invoiceARId }).subscribe(async (result: any) => {
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
          // receiptInfo: result['data'].Table1,
          // openInvoiceInfo: result['data'].Table2
        });
        debugger
        this.receiptList = result['data'].Table1;
        this.openInvoiceList = result['data'].Table2;
        this.TotalDebitAmount = tableInfo.TotalDebitAmount.toFixed(this.entityFraction);
        this.TotalCreditAmount = tableInfo.TotalCreditAmount.toFixed(this.entityFraction);
        if (result['data'].Table3.length > 0) this.FileList = result['data'].Table3;
      }
    }, error => { console.error(error) });
  }

  createInvoiceForm() {
    this.invoiceForm = this.fb.group({
      OutStandingInvoiceId: [this.invoiceARId],
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
      OutStandingInvoiceId: [this.invoiceARId],
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
      OutStandingInvoiceId: [this.invoiceARId],
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

  getCustomerList() {
    let payload = { "CustomerCode": "", "CustomerName": "", "Category": "", "BranchCode": "", "CityName": "", "GSTCategory": "", "GSTNumber": "", "IsActive": true, "CompanyStatus": "", "OnBoard": "CONFIRMED" }
    var service = `${this.globals.APIURL}/Customer/GetCustomerFilter`;
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.customerList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.customerList = result.data.Table;
      }
    }, error => { });
  }

  partyEvent(event) {
    debugger
    var service = `${this.globals.APIURL}/OutStandingInvoiceAR/OutStandingInvoiceARDropDown`;
    this.dataService.post(service, { CustomerId: event }).subscribe((result: any) => {
      this.receiptList = [];
      this.openInvoiceList = [];
      this.clearFormArray();
debugger
      if (result.message == "Success" && result.data.Table.length >= 0) {
        for (let data of result.data.Table) {
          this.addReceiptInfo();
          this.receiptList.push({
            InvoiceVoucherDetailId: 0,
            OutStandingInvoiceId: this.invoiceARId,
            VoucherId: 0,
            VoucherNumber: data.Invoice,
            VoucherDate: this.datePipe.transform(new Date(data.Date), 'dd-MM-y'),
            VoucherAmount: Number(data.Amount),
            IsAdjusted: 'NO',
            PendingAmount: data.OpenAmount ? data.OpenAmount : Number(data.Amount),
            //PendingAmount: data.OpenAmount ,

            AdjustedAmount: '',
            IsSelect: 0
          });
        
       

        }
        debugger
        this.invoiceForm.patchValue({ receiptInfo: this.receiptList });
        // this.newReceiptList = this.receiptList;
      
        if (result.data.Table1.length > 0) {
          
          for (let data of result.data.Table1) {
            this.addOpenInvoiceInfo();
            this.openInvoiceList.push({
              OutStandingInvoiceDetailId: 0,
              OutStandingInvoiceId: this.invoiceARId,
              InvoiceId: 0,
              InvoiceNumber: data.Invoice,
              InvoiceDate: this.datePipe.transform(new Date(data.Date), 'dd-MM-y'),
              InvoiceAmount: Number(data.Amount),
              IsAdjusted: 'NO',
              PendingAmount: data.OpenAmount ? data.OpenAmount : Number(data.Amount),
              AdjustedAmount: '',
              IsSelect: 0
            });
          }
        }
        debugger
        this.invoiceForm.patchValue({ openInvoiceInfo: this.openInvoiceList });
        // this.newInvoiceList = this.openInvoiceList;
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

getIsChecked(i, type){
    
    if (type == 'Receipts') {
    if (i !== undefined){
    return this.ReceiptInfo.value[i].IsSelect == false || this.ReceiptInfo.value[i].IsSelect == null ? false : true;
    }
    return false;
  }
  else if (type == 'Invoices') {
    if (i !== undefined){
      return this.OpenInvoiceInfo.value[i].IsSelect == false || this.OpenInvoiceInfo.value[i].IsSelect == null ? false : true;
      }
      return false;
  }
}
  
   setOffChangeEvent(data, index, type) {
    debugger
     if (type == 'Receipts') {
      const controlAtIndex = this.ReceiptInfo.at(index);
       const pendingAmount = this.receiptList.at(index).VoucherAmount - controlAtIndex.value.AdjustedAmount;
       if (pendingAmount >= 0) {
        controlAtIndex.patchValue({ PendingAmount: pendingAmount.toFixed(this.entityFraction) });
      }
     else {
       Swal.fire('Your amount has exceeded the limit!');
        controlAtIndex.patchValue({ PendingAmount: controlAtIndex.value.VoucherAmount });
        controlAtIndex.patchValue({ AdjustedAmount: 0 });
     }
      this.calculateCreditDebitAmount(type);
   }
    else if (type == 'Invoices') {
      const controlAtIndex = this.OpenInvoiceInfo.at(index);
      const pendingAmount = this.openInvoiceList.at(index).InvoiceAmount - controlAtIndex.value.AdjustedAmount;
      if (pendingAmount >= 0) {
        controlAtIndex.patchValue({ PendingAmount: pendingAmount.toFixed(this.entityFraction) });
      }  
      else {
        Swal.fire('Your amount has exceeded the limit!');
        controlAtIndex.patchValue({ PendingAmount: controlAtIndex.value.InvoiceAmount });
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
        this.TotalDebitAmount = AdjustedAmountReceipt % 1 !== 0 ? AdjustedAmountReceipt.toFixed(this.entityFraction) : AdjustedAmountReceipt;
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
        this.TotalCreditAmount = AdjustedAmountInvoice % 1 !== 0 ? AdjustedAmountInvoice.toFixed(this.entityFraction) : AdjustedAmountInvoice;
      }
      else { this.invoiceForm.controls['TotalCreditAmount'].setValue(AdjustedAmountInvoice); }
    }
  }


  // fileSelected(event) {
  //   if (event.target.files.length > 0 && this.FileList.length < 5) {
  //     this.FileList.push({
  //       OutStandingDocumentId: 0,
  //       OutStandingInvoiceId: this.invoiceARId,
  //       FileName: event.target.files[0].name,
  //       FilePath: event.target.files[0].name
  //     })
  //   }
  //   else {
  //     Swal.fire('A maximum of five files must be allowed.');
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
        OutStandingDocumentId: 0,
        OutStandingInvoiceId: this.invoiceARId,
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

  async saveInfo(status, isDelete = false) {
    var validation = "";
    if (this.invoiceForm.value.StatusId == "" || this.invoiceForm.value.StatusId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Status.</span></br>"
    }
    // if (this.invoiceForm.value.ReferenceNo == "" || this.invoiceForm.value.ReferenceNo == 0) {
    //    validation += "<span style='color:red;'>*</span> <span>Please generate AR set off reference #.</span></br>"
    // }
    if (this.invoiceForm.value.PartyId == "" || this.invoiceForm.value.PartyId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Party.</span></br>"
    }

    if(status == 2 && !this.invoiceARId){
      this.router.navigate(['/views/transactions/invoices_AR_view/invoices_AR_view']);
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
       if(status == 2){
          if(this.IsFinal){
            this.ViewPage();
            return;
          }
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
    }).then(async(result) => {
      if (result.isConfirmed) {
             // If canceled 
        if(status == 2 ){
          this.ViewPage();
          return;
        }
        await this.createPayload(status);
debugger
        let service = `${this.globals.APIURL}/OutStandingInvoiceAR/SaveOutStandingInvoiceAR`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.data.Message, '', 'success');
            this.isUpdateMode = true;
            this.isUpdateMode1 = true;

            if(status == 0){
              this.invoiceARId = result.data.Id;
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
                  this.editinvoiceAR(OutStandingInvoiceId)
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
  editinvoiceAR(id: number) {
    this.router.navigate(['/views/transactions/invoices_AR_view/invoices_AR_Details', { id: id, isUpdate: true }]);
    
  }
  
  ViewPage(){
    this.router.navigate(['/views/transactions/invoices_AR_view/invoices_AR_view']);
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
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Invoices set off AR');
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
      OutStandingInvoiceId: this.invoiceARId,
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
      OutStandingInvoiceAR: {
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
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Invoices set off AR');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.invoiceForm.controls['ReferenceNo'].setValue(code.trim().toUpperCase());
          resolve(true);
        }
        else {
         
          Swal.fire('Please create the auto-generation code for Invoices set off AR.')
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
