import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AutoGenerationCodeService } from 'src/app/services/auto-generation-code.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import Swal from 'sweetalert2';
import { StatusNew } from 'src/app/model/common';
import { CommonService } from 'src/app/services/common.service';
import { Globals } from 'src/app/globals';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DynamicAccountDetail, DynamicAccountDetailColumn } from 'src/app/model/financeModule/paymentVoucher';


@Component({
  selector: 'app-payment-voucher-details',
  templateUrl: './payment-voucher-details.component.html',
  styleUrls: ['./payment-voucher-details.component.css']
})
export class PaymentVoucherDetailsComponent implements OnInit {
  @ViewChild('autoResizeTextArea') autoResizeTextArea: ElementRef;
  vendorTanDetails: any;
  newOne: any;
  branches: any;
  TotalDebitAccountAmount: number = 0;
  onTextareaInput(event: Event): void {
    const textarea = this.autoResizeTextArea.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  ModifiedOn: any;
  CreatedOn: any;
  CreatedBy = localStorage.getItem('UserID');

  // * dropdown
  paymentModeList = [];
  bankChargesList = [];

  // ** dropdown end

  paymentDetailsTableList = [];
  accountDetailsTableList: Array<DynamicAccountDetailColumn> = [];
  accountDetailsTableDetail = new DynamicAccountDetail();
  accountDetailsTableDetailList: Array<DynamicAccountDetail> = [];
  AccountForm: FormGroup;
  divisionList: any[];
  officeList: any[];
  bankList: any;
  sameCurrencyBankList = [];
  vendorList: any;
  vendorUniqueList = []
  vendorBranch: any;
  statusList: any = [];
  currencyList = [];
  statusValues: StatusNew[] = [
    { value: 1, viewValue: 'Yes' },
    { value: 0, viewValue: 'No' },
  ];
  paymentVoucherFor = '';
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  // ** table data

  // exchangeTableList = [];
  documentTableList = [];
  paymentType = 'IsBill';
  isAccountType = false;
  // * common ID
  paymentId = 0
  voucherGetByIdDetails: any;
  paymentForm: any;
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  amountPaidListDropdown: any;
  numberRangeList: any;
  isUpdate = false;
  payment_voucher_code: string;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  OrgId = localStorage.getItem('OrgId');
  entityDetails: any;
  entityCurrency: any
  isSameCurrency = true;
  CreatedDate = new Date();
  UpdatedBy = localStorage.getItem('UserID');
  private ngUnsubscribe = new Subject<void>();
  TotalAmount = '';
  exchangePairDetails = []
  searchedInvoiceIds = [];
  invoiceSearch = ''
  // * common end
  TotalAmountFinal = 0
  isSameAmount = false
  selectedInvoiceTotal = 0
  // isEditDueBill: boolean;
  isPaymentForBill = undefined;
  editSelectedDocument: any;
  entityCurrencyId: any;
  isEditMode = true;
  isEditMode1 = false;
  IsFinal = false;
  showExchangeRate: Boolean = false;
  entityCurrencyName: any;
  entityCurrencyCode: any;
  isTds: boolean = false;
  receivedCurrencyName = '';
  isCopied = false;
  exchangeRateInput = 0
  ModuleId: any
  modules: any;
  moduleName = 'PAYMENT VOUCHER'
  mappingSuccess: boolean = false;
  errorMessage: any;
  debitCreditList: any[];
  AccountList: any[];
  editSelectedIndex: number;
  isGridEditMode = false;
  groupedCoaTypeList: { [key: string]: any[] };
  TotalDebit = 0;
  TotalCredit = 0;
  AmountDifference = 0;
  IsTDSEnable: boolean = false;
  IsExchangeRateEnable: boolean = false;
  IsExGainEnable: boolean = false;
  IsExLossEnable: boolean = false;
  IsVendorEnable: boolean = false;
  IsBranchEnable: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentVoucherService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private autoGenerationCodeService: AutoGenerationCodeService,
    private autoCodeService: AutoCodeService,
    private commonDataService: CommonService,
    private globals: Globals,
    private dataService: DataService,
    private router: Router
  ) {
    this.createForm();
  }

  async ngOnInit(): Promise<void> {
    this.getModuleType();
    await this.getCurrency();
    await this.getEntityDetails();
    this.getDivisionList();
    this.getStatus();
    // this.getOffice();
    // this.getBankList();
    await this.getVendorList();
    this.getModeOfPayment();
    this.getNumberRangeList();
    this.route.params.subscribe(async param => {
      this.paymentId = +param['voucherId'] ? +param['voucherId'] : 0;
      if (this.paymentId) {
        this.getByIdRotueFunctionality();
      } else if (param.copy_id) { // copy functionality
        this.isCopied = true;
        await this.copyAndPasteFromOldvoucher(param.copy_id);
      }
      else {
        // this.getNumberRangeList()
        this.setPaymentVoucherRadio(this.paymentType) // * set default bill value
        this.getBankList();
      }
    })
    if (this.mappingSuccess == false) {
      Swal.fire(this.errorMessage)
    }

    this.getDrCr();
    this.getParentAccountList();

  }

  createForm() {
    this.paymentForm = this.fb.group({

      Table: this.fb.group({
        PaymentVoucherId: [0],
        DivisionId: [''],
        OfficeId: [''],
        IsBill: [''],
        IsOnAccount: [''],
        PaymentVoucherNumber: [''],
        PaymentVoucherDate: [this.currentDate],
        VendorId: [''],
        VendorBranch: [''],
        AmountPaid: [''],
        CurrencyName: [''],
        CurrencyId: [''],
        TdsDeducted: [''],
        VendorTan: [''],
        PaidfromId: [''],
        ModeofPaymentId: [''],
        ReferenceNo: [''],
        BankCharges: [0],
        BankCurrencyName: [''],
        BankCurrencyId: [''],
        CreatedBy: [this.CreatedBy],
        UpdatedBy: [this.CreatedBy],
        IsFinal: [0],
        ExchangeRateId: [0],
        TotalAmount: [0],
        Remarks: [''],
        StatusId: [1],
        IsDelete: [0],
        CurrentExRate: [this.exchangeRateInput],
        IsVendor: true,
        IsAccount: false,
        TDSAmount: 0,
        ExGain: 0,
        ExLoss: 0,
        ExchangeRate: [1],
        TotalDebit: 0,
        TotalCredit: 0,
        AmountDifference: 0,
        AmountPaidCCY: [0],
        TotalTDSAmount: [0],
        TotalPaymentAmount: [0]
      }),
      Table1: this.fb.group({

      }),
      Table2: this.fb.group({
        OnAccountId: [0],
        PaymentVoucherInvoiceId: [this.paymentId],
        CreatedDate: [this.CreatedDate],
        CreatedBy: [this.CreatedBy],
        // OnAccountRemarks: [""],
        IsCheck: [false]
      }),
      Table3: this.fb.group({

      }),
      document: this.fb.group({
        BankAttachmentsID: [0],
        PaymentVoucherId: [0],
        DocumentName: [''],
        FilePath: [''],
        IsBill: [''],
        IsOnAccount: [''],
        CreatedDate: [this.CreatedDate],
        CreatedBy: [this.CreatedBy],
      }),
      Table4: this.fb.group({
        PaymentAccountsId: [0],
        PaymentVoucherInvoiceId: this.paymentId,
        AccountId: [0],
        TransactionType: [0],
        CurrencyId: [''],
        ROE: [1],
        Amount_LCR: [0],
        Amount_CCR: [0],
        Narration: ['']
      })
    });
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

  getParentAccountList() {
    debugger
    this.commonDataService.getChartaccountsFilter().subscribe(async data => {
      this.AccountList = [];
      if (data["data"].length > 0) {
        data["data"].forEach(e => e.AccountName = e.AccountName.toUpperCase());
        this.AccountList = data["data"];
        this.groupedCoaTypeList = this.groupDataByCEOGroupId(this.AccountList);
      }
    });

    // var service = `${this.globals.APIURL}/ChartOfAccounts/GetChartAccountName`; var payload: any = {}
    // this.dataService.post(service, payload).subscribe((result: any) => {
    //   this.AccountList = [];
    //   if (result.data.length > 0) { this.AccountList = result.data; }
    // }, error => { });
  }

  setVendor(value) {
    debugger
    if (value == 1 && this.isPaymentForBill) {
      this.paymentForm.controls.Table.controls['IsVendor'].setValue(true);
      this.paymentForm.controls.Table.controls['IsAccount'].setValue(false);
      // this.paymentForm.controls.Table.controls['TDSAmount'].disable();
      // this.paymentForm.controls.Table.controls['VendorId'].enable();
      // this.paymentForm.controls.Table.controls['VendorBranch'].enable();
      this.IsTDSEnable = false;
      this.IsVendorEnable = true;
      this.IsBranchEnable = true;
      // this.paymentForm.controls.Table.controls['VendorId'].setValue('');
      // this.paymentForm.controls.Table.controls['VendorBranch'].setValue('');
      // this.paymentForm.controls.Table.controls['TDSAmount'].setValue(0);
      this.isAccountType = false;

    } else if (value == 2 && this.isPaymentForBill) {
      this.paymentForm.controls.Table.controls['IsVendor'].setValue(false);
      this.paymentForm.controls.Table.controls['IsAccount'].setValue(true);
      // this.paymentForm.controls.Table.controls['TDSAmount'].enable();
      // this.paymentForm.controls.Table.controls['VendorId'].disable();
      // this.paymentForm.controls.Table.controls['VendorBranch'].disable();

      this.IsTDSEnable = true;
      this.IsVendorEnable = false;
      this.IsBranchEnable = false;

      // this.paymentForm.controls.Table.controls['VendorId'].setValue('');
      // this.paymentForm.controls.Table.controls['VendorBranch'].setValue('');
      this.paymentForm.controls.Table.controls['TDSAmount'].setValue(0);
      this.isAccountType = true;
    } else if (value == 1 && !this.isPaymentForBill) {
      this.paymentForm.controls.Table.controls['IsVendor'].setValue(true);
      this.paymentForm.controls.Table.controls['IsAccount'].setValue(false);
      // this.paymentForm.controls.Table.controls['TDSAmount'].enable();
      // this.paymentForm.controls.Table.controls['VendorId'].enable();
      // this.paymentForm.controls.Table.controls['VendorBranch'].enable();
      this.IsTDSEnable = true;
      this.IsVendorEnable = true;
      this.IsBranchEnable = true;
      // this.paymentForm.controls.Table.controls['VendorId'].setValue('');
      // this.paymentForm.controls.Table.controls['VendorBranch'].setValue('');
      // this.paymentForm.controls.Table.controls['TDSAmount'].setValue(0);
      this.isAccountType = false;
    } else if (value == 2 && !this.isPaymentForBill) {
      this.paymentForm.controls.Table.controls['IsVendor'].setValue(false);
      this.paymentForm.controls.Table.controls['IsAccount'].setValue(true);
      // this.paymentForm.controls.Table.controls['TDSAmount'].enable();
      // this.paymentForm.controls.Table.controls['VendorId'].disable();
      // this.paymentForm.controls.Table.controls['VendorBranch'].disable();
      this.IsTDSEnable = true;
      this.IsVendorEnable = false;
      this.IsBranchEnable = false;
      // this.paymentForm.controls.Table.controls['VendorId'].setValue('');
      // this.paymentForm.controls.Table.controls['VendorBranch'].setValue('');
      // this.paymentForm.controls.Table.controls['TDSAmount'].setValue(0);
      this.isAccountType = true;
    }

  }

  async getByIdRotueFunctionality() {
    this.isUpdate = true;

    let paymentData: any = await this.getVendorPaymentById();
    if (paymentData.Table[0].IsFinal === true) {
      this.IsFinal = true;
    }
    this.paymentForm.disable();
    this.isEditMode = false;
    this.isEditMode1 = false;
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
            if (this.IsFinal) {
              Swal.fire("Final");
              return
            }
            this.paymentForm.enable();
            this.isEditMode = true;
            this.isEditMode1 = true;

            if (this.paymentForm.controls['Table'].value.CurrencyId != this.entityCurrencyId) {
              // this.paymentForm.controls.Table.controls['ExchangeRate'].enable();
              // this.paymentForm.controls.Table.controls['ExGain'].enable();
              // this.paymentForm.controls.Table.controls['ExLoss'].enable();
              this.IsExGainEnable = true;
              this.IsExLossEnable = true;
              this.IsExchangeRateEnable = true;
            } else {
              // this.paymentForm.controls.Table.controls['ExchangeRate'].disable();
              // this.paymentForm.controls.Table.controls['ExGain'].disable();
              // this.paymentForm.controls.Table.controls['ExLoss'].disable();
              this.IsExGainEnable = false;
              this.IsExLossEnable = false;
              this.IsExchangeRateEnable = false;
            }
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


  paymentDetailsValidation(): string {
    const paymentDetails = this.paymentForm.value.Table;
    let validation = '';

    if (!paymentDetails.DivisionId) {
      validation += this.getValidationMessage('Please Select Division');
    }

    if (!paymentDetails.OfficeId) {
      validation += this.getValidationMessage('Please Select Office');
    }

    if (paymentDetails.IsBill === '' && paymentDetails.IsOnAccount === '') {
      validation += this.getValidationMessage('Please Select Payment Voucher For');
    }

    if (!paymentDetails.PaymentVoucherDate) {
      validation += this.getValidationMessage('Please Select Payment Date');
    }

    if (!paymentDetails.VendorId && paymentDetails.IsVendor) {
      validation += this.getValidationMessage('Please Select Vendor Name');
    }

    if (!paymentDetails.VendorBranch && paymentDetails.IsVendor) {
      validation += this.getValidationMessage('Please Select Vendor Branch');
    }

    // if (!paymentDetails.VendorTan) {
    //   validation += this.getValidationMessage('Please Enter Vendor TAN');
    // }

    if (!paymentDetails.AmountPaid) {
      validation += this.getValidationMessage('Please Enter Amount Paid');
    }

    if (!paymentDetails.CurrencyId) {
      validation += this.getValidationMessage('Please Select Paid Currency');
    }

    if (paymentDetails.TdsDeducted === "") {
      validation += this.getValidationMessage('Please Select TDS');
    }

    if (!paymentDetails.PaidfromId && paymentDetails.IsVendor) {
      validation += this.getValidationMessage('Please Select Paid From');
    }

    if (!paymentDetails.ModeofPaymentId) {
      validation += this.getValidationMessage('Please Select Mode Of Payment');
    }

    if (!paymentDetails.ReferenceNo && paymentDetails.ModeofPaymentId != 2) {
      validation += this.getValidationMessage('Please Enter Reference No');
    }

    return validation;
  }


  private getValidationMessage(message: string): string {
    return `<span style='color:red;'>*</span> <span>${message}</span><br>`;
  }


  async submit(isDelete = false) {
    debugger
    if (this.mappingSuccess == false) {
      Swal.fire(this.errorMessage)
      return false;
    }

    if (this.IsFinal) {
      Swal.fire("Final");
      return
    }

    if (this.AmountDifference != 0) {
      Swal.fire("Amount mismatch");
      return
    }

    const validation = this.validationCheck();

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    // if (this.isPaymentForBill && !this.isSameAmount ) {
    //   Swal.fire("Invoice Total Not Match With Amount Paid.");
    //   return
    // }

    const paymentValidation = this.paymentDetailsValidation();
    if (paymentValidation !== '') {
      Swal.fire(paymentValidation);
      return;
    }

    let popupText = ''
    if (isDelete) {
      this.paymentForm.controls.Table.controls['IsDelete'].setValue(1);
      popupText = `Do you want to Delete this Details?`;
    } else {
      popupText = `Do you want to save this Details?`
    }
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: popupText,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {

        const PaymentVoucherNumber = this.paymentForm.controls['Table'].controls['PaymentVoucherNumber'].value
        if (PaymentVoucherNumber == '') {
          // await this.autoCodeGeneration('Payment Voucher');
          // this.updateAutoGenerated();
          const payload = this.getFinalPayload();
          console.log('payload', payload);
          payload.paymentVoucher.Table[0].StatusId = 1; // set save type(draft(1) or final(2) or canceled(3));
          // return
          this.savePayment(payload, 'draft');
        } else {
          const payload = this.getFinalPayload();
          // alert('else')
          console.log('payload', payload)
          payload.paymentVoucher.Table[0].StatusId = 1; // set save type(draft(1) or final(2) or canceled(3));
          // return
          this.savePayment(payload, 'draft');
        }

      } else {

      }
    });
  }

  async Cancel() {
    if (this.IsFinal) {
      // Swal.fire("cancel");
      this.backToMain();
      return
    }

    else {
      Swal.fire({
        showCloseButton: true,
        title: '',
        icon: 'question',
        html: ` Voucher is not yet finalized <br> Do you want to still exit ?`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false,
        allowOutsideClick: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          {
            this.backToMain();
          }
        }
      })
    }
  }


  async getModuleType() {
    // debugger
    let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerDropDownList`;
    this.dataService.post(service, {}).subscribe(async (result: any) => {
      // debugger
      if (result.message = "Success") {
        // this.ledgerSubModuleList = [];

        this.modules = result.data.Module

        let subModule = this.modules.find(x => x.ModuleName.toUpperCase() == this.moduleName.toUpperCase());
        this.ModuleId = subModule.ID
        await this.checkLedgerMapping()
      }
    }, error => {
      console.error(error);
    });
  }


  async checkLedgerMapping() {
    // debugger
    let service = `${this.globals.APIURL}/Common/CheckModuleAccess`;
    this.dataService.post(service, { ModuleId: this.ModuleId }).subscribe(async (result: any) => {
      // debugger
      if (result.data == "Access Granted") {
        this.mappingSuccess = true
      }
      else {
        this.mappingSuccess = false
        this.errorMessage = result.data
      }
    }, error => {
      console.error(error);
    });
  }



  async finalSubmit() {

    if (this.IsFinal) {
      Swal.fire("Final");
      return
    }

    if (this.AmountDifference != 0) {
      Swal.fire("Amount mismatch");
      return
    }

    const validation = this.validationCheck();

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }


    // if (this.isPaymentForBill && !this.isSameAmount) {
    //   Swal.fire("Invoice Total Not Match With Amount Paid.");
    //   return
    // }

    const paymentValidation = this.paymentDetailsValidation();
    if (paymentValidation !== '') {
      Swal.fire(paymentValidation);
      return;
    }

    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      html: 'Final voucher not possible to edit  <br> Do you want proceed?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const PaymentVoucherNumber = this.paymentForm.controls['Table'].controls['PaymentVoucherNumber'].value;
        // if(PaymentVoucherNumber == '' ){
        await this.autoCodeGeneration('Payment Voucher');
        this.updateAutoGenerated();
        const payload = this.getFinalPayload(true);
        console.log('final payload', payload)
        payload.paymentVoucher.Table[0].IsFinal = 1; // set as final
        payload.paymentVoucher.Table[0].StatusId = 2; // ! set save type(draft(1) or final(2) or canceled(3));
        payload.paymentVoucher.Table[0].PaymentVoucherDate = new Date();
        // return
        this.savePayment(payload, 'final');
        // } else {
        //   const payload = this.getFinalPayload();
        //   this.savePayment(payload);
        // }
      } else {

      }
    });

  }

  savePayment(payload, type) {
    this.paymentService.savePayment(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result.message == "Success") {
        // console.log('result the payment voucher', result);

        Swal.fire(result.message, '', 'success');
        if (type === 'draft') {
          this.isEditMode = false;
          this.isEditMode1 = true;
          this.paymentId = Number(result.data.Id)

          this.editView(result.data.Id)
        }
        if (type === 'final') {
          this.backToMain();
        }
        // this.backToMain();
        return;
      }
    }, err => {
      console.log('errrr', err);

    });
  }

  editView(id: Number) {
    // this.router.navigate(['/views/transactions/payment/payment-details', { voucherId: id  }],{
    //   relativeTo: this.route,
    //   queryParamsHandling: 'merge',
    // });
    this.getByIdRotueFunctionality();
  }

  getFinalPayload(isFinal = false) {
    this.paymentForm.value.Table.CurrentExRate = this.exchangeRateInput;
    let Table2 = this.paymentForm.value.Table2
    // Table2.PaymentVoucherInvoiceId = this.paymentId;
    Table2.IsCheck = Table2.IsCheck ? 1 : 0;
    let selectedInvoices = this.paymentDetailsTableList.filter((invoice) => { return invoice.IsCheck === true || invoice.IsCheck == 1 });

    // delete the un-wanted key from the object
    selectedInvoices.forEach((v) => {
      // set the due amount as same if it is not Final
      // v.IsCheck = true;
      if (!isFinal) {
        v.DueAmount = v.DueAmountActual
      }

      delete v.DueAmountActual;
      delete v.BillDueAmount;

    });
    this.accountDetailsTableDetailList = [];
    for (let item of this.accountDetailsTableList) {
      this.accountDetailsTableDetail = new DynamicAccountDetail();
      this.accountDetailsTableDetail.PaymentAccountsId = item.PaymentAccountsId ? item.PaymentAccountsId : 0;
      this.accountDetailsTableDetail.PaymentVoucherInvoiceId = item.PaymentVoucherInvoiceId ? item.PaymentVoucherInvoiceId : 0;
      this.accountDetailsTableDetail.AccountId = item.AccountId;
      this.accountDetailsTableDetail.TransactionType = item.TransactionType === 1 ? true : false;
      this.accountDetailsTableDetail.CurrencyId = item.CurrencyId;
      this.accountDetailsTableDetail.ROE = item.ROE;
      this.accountDetailsTableDetail.Amount_LCR = item.Amount_LCR;
      this.accountDetailsTableDetail.Amount_CCR = item.Amount_CCR;
      this.accountDetailsTableDetail.Narration = item.Narration;
      // this.chargesList.Table1.push(this.chargesDetails);
      this.accountDetailsTableDetailList.push(this.accountDetailsTableDetail);

      // this.chargesList.Table.push(
      //   'ChargesId:' + item.ID.toString(),
      //   'ChartOfAccountID:' + item.LinkedGL,
      //   'DivisionId:' + item.Division,
      //   'EffectiveDate:' + item.EffectiveFrom,
      //   'IsSelected:' + item.Deselect);
      //this.chargesList.Table.push();
      //let a="";
      //this.chargesList.Table.push(a);
    };

    // TotalDebit = 0;
    // TotalCredit = 0;
    // AmountDifference = 0;

    // this.paymentForm.controls['Table'].controls['TotalDebit'].setValue(this.TotalDebit);
    // this.paymentForm.controls['Table'].controls['TotalCredit'].setValue(this.TotalCredit);
    this.paymentForm.controls['Table'].controls['AmountDifference'].setValue(this.AmountDifference);

    // this.paymentForm.controls['Table'].controls['VendorId'].setValue(0);
    // this.paymentForm.controls['Table'].controls['VendorBranhId'].setValue(0);
    this.paymentForm.controls['Table'].controls['ExchangeRateId'].setValue(0);

    let payload = {
      "paymentVoucher": {
        "Table": [this.paymentForm.value.Table],
        "Table1": [...selectedInvoices],

        "Table2": [Table2],
        "Table3": [...this.documentTableList],
        "Table4": [...this.accountDetailsTableDetailList]
      }
    }
    // document.IsOnAccount = Table.IsOnAccount ? 1 : 0;
    const Table = this.paymentForm.value.Table
    if (Table.IsBill) {
      payload.paymentVoucher.Table2 = [];
    } else if (Table.IsBill && Table.IsVendor) {
      payload.paymentVoucher.Table2 = [];
      payload.paymentVoucher.Table4 = [];
    } else if (Table.IsOnAccount && Table.IsVendor) {
      payload.paymentVoucher.Table1 = [];
      payload.paymentVoucher.Table4 = [];
    } else if (Table.IsOnAccount && Table.IsAccount) {
      payload.paymentVoucher.Table1 = [];
      payload.paymentVoucher.Table2 = [];
    }
    return payload;
  }

  async patchForm(data) {
    debugger
    const tableData = data.Table[0];
    const table1Data = data.Table1;
    const table2Data = data.Table2[0];
    const table3Data = data.Table3;
    const table4Data = data.Table4;
    this.getVendorBranch(Number(tableData.VendorId));
    await this.getOffice(tableData.DivisionId)


    this.exchangeRateInput = tableData.CurrentExRate;
    this.TotalAmount = tableData.TotalAmount;

    const paymentVoucherFor = tableData.IsBill ? 'IsBill' : 'IsOnAccount'
    await this.setPaymentVoucherRadio(paymentVoucherFor)

    this.accountDetailsTableList = [];

    const Table = {
      PaymentVoucherId: tableData.PaymentVoucherId,
      DivisionId: tableData.DivisionId,
      OfficeId: tableData.OfficeId,
      IsBill: tableData.IsBill,
      IsOnAccount: tableData.IsOnAccount,
      PaymentVoucherNumber: tableData.PaymentVoucherNumber,
      PaymentVoucherDate: this.datePipe.transform(new Date(tableData.PaymentVoucherDate), "yyyy-MM-dd"),
      VendorId: tableData.VendorId,
      VendorBranch: tableData.VendorBranch,
      AmountPaid: tableData.AmountPaid,
      CurrencyName: tableData.CurrencyName,
      CurrencyId: tableData.CurrencyId,
      TdsDeducted: tableData.TdsDeducted ? 1 : 0,
      VendorTan: tableData.VendorTan,
      PaidfromId: tableData.PaidfromId,
      ModeofPaymentId: tableData.ModeofPaymentId,
      ReferenceNo: tableData.ReferenceNo,
      BankCharges: tableData.BankCharges,
      BankCurrencyName: tableData.BankCurrencyName,
      BankCurrencyId: tableData.BankCurrencyId,
      CreatedBy: tableData.CreatedBy ? tableData.CreatedBy : 1,
      UpdatedBy: tableData.CreatedBy ? tableData.CreatedBy : 1,
      IsFinal: tableData.IsFinal ? 1 : 0,
      ExchangeRateId: tableData.ExchangeRateId ? tableData.ExchangeRateId : 0,
      TotalAmount: tableData.TotalAmount ? tableData.TotalAmount : 0,
      Remarks: tableData.Remarks ? tableData.Remarks : '',
      StatusId: tableData.StatusId >= 0 ? tableData.StatusId : 1,
      // StatusId: table1Data.StatusId >= 0 ? table1Data.StatusId : 1,
      IsDelete: table1Data.IsDelete ? table1Data.IsDelete : 0,
      CurrentExRate: tableData.CurrentExRate ? tableData.CurrentExRate : 0,
      IsVendor: tableData.IsVendor,
      IsAccount: tableData.IsAccount,
      TDSAmount: tableData.TDS_Amount,
      ExGain: tableData.EX_Gain_DR,
      ExLoss: tableData.EX_Loss_CR,
      ExchangeRate: tableData.ExchangeRate,
    }

    this.isTds = tableData.TdsDeducted ? true : false;

    // set exchange rate 
    if (tableData.CurrentExRate) {
      this.showExchangeRate = true;
    }
    this.TotalAmount = tableData.TotalAmount ? tableData.TotalAmount : 0;
    this.CreatedOn = tableData.CreatedDate

    const Table1 = {}


    this.paymentForm.get('Table').patchValue(Table);
    this.paymentForm.get('Table1').patchValue(Table1);
    this.paymentForm.get('Table2').patchValue(table2Data);
    await this.getBankList(true);
    debugger
    let toCurrency = this.currencyList.find(x => x.ID == tableData.CurrencyId);
    debugger

    var totalTDSAmount = 0;
    var totalPaymentAmount = 0;

    table1Data.forEach(element => {
      const dueAmount = element.DueAmount ? element.DueAmount : element.BillAmount;
      // element.DueAmountActual = dueAmount + element.TDS + element.Payment; // previous logic
      element.DueAmountActual = dueAmount;
      if (this.IsFinal) {
        element.DueAmount = element.DueAmount;
      } else {
        const newDue = dueAmount - (element.TDS + element.Payment);
        if (newDue < 0) {
          element.DueAmount = dueAmount;
          element.TDS = 0;
          element.Payment = 0;
        } else {
          element.DueAmount = newDue;
        }
      }

      if (element.Currency == toCurrency.CurrencyCode) {
        // element.InvoiceAmountCCY = element.InvoiceAmountCCY * this.exchangePairDetails[0].Rate
        // element.DueAmountCCY = element.DueAmountCCY * this.exchangePairDetails[0].Rate
        element.InvoiceAmountCCY = element.BillAmount
        element.DueAmountCCY = element.DueAmount
      }

      totalTDSAmount += (Number(element.TDS) * Number(!element.ExchangeRate ? 1 : element.ExchangeRate )),
        totalPaymentAmount += (Number(element.Payment) * Number(!element.ExchangeRate ? 1 : element.ExchangeRate))

      // if (element.PaymentVoucherInvoiceId) {
      //   element.DueAmount = element.BillDueAmount;
      // }
    });

    this.paymentForm.controls['Table'].controls['TotalTDSAmount'].setValue(totalTDSAmount.toFixed(this.entityFraction))
    this.paymentForm.controls['Table'].controls['TotalPaymentAmount'].setValue(totalPaymentAmount.toFixed(this.entityFraction))

    for (var i = 0; i < table4Data.length; i++) {

      var value = new DynamicAccountDetailColumn();

      const Account = this.AccountList.find(e => { return e.ChartOfAccountsId == table4Data[i].AccountId })
      const Currency = this.currencyList.find(e => { return e.ID == table4Data[i].CurrencyId })

      table4Data[i].AccountName = Account ? Account.AccountName : '-';
      table4Data[i].CurrencyName = Currency ? Currency.CurrencyCode : '-';

      value.PaymentAccountsId = table4Data[i].PaymentAccountsId ? table4Data[i].PaymentAccountsId : 0;
      value.PaymentVoucherInvoiceId = table4Data[i].PaymentVoucherInvoiceId ? table4Data[i].PaymentVoucherInvoiceId : 0;
      value.AccountId = table4Data[i].AccountId;
      value.TransactionType = table4Data[i].TransactionType == true ? 1 : 0;
      value.CurrencyId = table4Data[i].CurrencyId;
      value.ROE = table4Data[i].ROE;
      value.Amount_LCR = table4Data[i].Amount_LCR;
      value.Amount_CCR = table4Data[i].Amount_CCR;
      value.Narration = table4Data[i].Narration;
      value.AccountName = table4Data[i].AccountName;
      value.CurrencyName = table4Data[i].CurrencyName;
      value.TransactionTypeName = table4Data[i].TransactionType == true ? 'DR' : 'CR';

      this.accountDetailsTableList.push(value);
    }


    this.paymentDetailsTableList = table1Data;
    console.log('paymentDetailsTableList patch data', this.paymentDetailsTableList)

    let isDiffCurrencyInvoice = table1Data.find((x) => x.Currency != this.entityCurrencyCode)

    isDiffCurrencyInvoice = isDiffCurrencyInvoice == undefined ? this.entityCurrencyCode : isDiffCurrencyInvoice.Currency;

    if (this.entityCurrencyCode === isDiffCurrencyInvoice) {
      this.isSameCurrency = true
    }
    // this.getExchangeRate(this.entityCurrencyCode, isDiffCurrencyInvoice.Currency)


    this.documentTableList.push(...table3Data) //! push the doc file

    // ! set Radio button value

    // ! set isTds value(based on this show and hide the (TDS)fields)
    this.isTds = tableData.TdsDeducted ? true : false;
    // this.calculateFinalTotal();

    const VendorId = this.paymentForm.controls['Table'].controls['IsVendor'].value ? 1 : this.paymentForm.controls['Table'].controls['IsAccount'].value ? 2 : '';
    this.setVendor(VendorId);
    this.paymentForm.controls.Table.controls['TDSAmount'].setValue(tableData.TDS_Amount);
    this.calculateFinalTotal();
    this.summaryAmountCalculation();
  }

  updateAmount(amount) {
    this.paymentForm.controls.Table.controls['TotalAmount'].setValue(+amount);
  }

  getVendorPaymentById() {

    return new Promise((resolve, rejects) => {

      let payload = {
        PaymentVoucherId: this.paymentId,

      };
      this.paymentService.getVendorPaymentById(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (result: any) => {
          if (result.message == "Success") {
            if (result.data.Table.length > 0) {

              this.voucherGetByIdDetails = result.data;
              if (this.voucherGetByIdDetails.Table[0].IsFinal === true) {
                this.IsFinal = true;
              }

              this.patchForm(this.voucherGetByIdDetails);
              resolve(this.voucherGetByIdDetails)
            }
          }
        },
        (error) => { }
      );
    })
  }

  // copy and page the existing voucher functionality to form
  async copyAndPasteFromOldvoucher(receiptVoucherId_copy) {
    let payload = {
      PaymentVoucherId: receiptVoucherId_copy,
    };
    this.paymentService.getVendorPaymentById(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      async (result: any) => {
        if (result.message == "Success") {
          const data = result.data;
          const tableData = data.Table[0];
          // const table1Data = data.Table1;
          // const table2Data = data.Table2[0];
          // const table3Data = data.Table3;
          this.getVendorBranch(tableData.VendorId);
          await this.getOffice(tableData.DivisionId)
          const Table = {
            PaymentVoucherId: 0,
            DivisionId: tableData.DivisionId,
            OfficeId: tableData.OfficeId,
            IsBill: tableData.IsBill,
            IsOnAccount: tableData.IsOnAccount,
            PaymentVoucherNumber: '',
            PaymentVoucherDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
            VendorId: tableData.VendorId,
            VendorBranch: tableData.VendorBranch,
            AmountPaid: tableData.AmountPaid,
            CurrencyName: tableData.CurrencyName,
            CurrencyId: tableData.CurrencyId,
            TdsDeducted: tableData.TdsDeducted ? 1 : 0,
            VendorTan: tableData.VendorTan,
            PaidfromId: tableData.PaidfromId,
            ModeofPaymentId: tableData.ModeofPaymentId,
            ReferenceNo: '',
            BankCharges: tableData.BankCharges,
            BankCurrencyName: tableData.BankCurrencyName,
            BankCurrencyId: tableData.BankCurrencyId,
            CreatedBy: this.CreatedBy,
            UpdatedBy: this.CreatedBy,
            IsFinal: 0,
            ExchangeRateId: tableData.ExchangeRateId ? tableData.ExchangeRateId : 0,
            TotalAmount: tableData.TotalAmount ? tableData.TotalAmount : 0,
            Remarks: tableData.Remarks ? tableData.Remarks : '',
            StatusId: 1,
            IsDelete: 0,
            CurrentExRate: 0,
          }
          this.paymentForm.get('Table').patchValue(Table);
          this.getInvoiceList(tableData.VendorId);
          this.getBankList(true);
          // ! set Radio button value
          const paymentVoucherFor = tableData.IsBill ? 'IsBill' : 'IsOnAccount'
          // ! set isTds value(based on this show and hide the (TDS)fields)
          this.isTds = tableData.TdsDeducted ? true : false;
          this.setPaymentVoucherRadio(paymentVoucherFor);

          if (this.entityCurrency === tableData.CurrencyId) {
            this.isSameCurrency = true
          }
        }
      })
  }

  getDivisionList(filter?: string) {
    this.paymentService.getDivision({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  getOffice(DivisionId) {

    return new Promise((resolve, reject) => {
      const payload = { DivisionId: DivisionId }
      this.commonDataService.getOfficeByDivisionId(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        this.officeList = [];
        this.paymentForm.controls.Table.controls['OfficeId'].setValue('');
        if (result.message == 'Success') {
          if (result.data && result.data.Table.length > 0) {
            this.officeList.push(...result.data.Table);
            resolve(true);
          }
        }
      }, error => {
        reject('')
      });
    })
  }

  editclick() {
    this.showExchangeRate = true;

  }

  getSameCurrencyBank() {
    this.sameCurrencyBankList = this.bankList.filter((bank) => {
      return this.receivedCurrencyName.includes(bank.CurrencyCode);
    })
  }

  clearSameCurrenyBankList() {
    this.sameCurrencyBankList = [];
    this.paymentForm.controls.Table.controls['PaidfromId'].setValue('');
  }

  getBankList(getSameCurrencyBank = false) {
    // let payload = {
    //   BankID : 0,
    //   BankName : '',
    //   AccountNo : '',
    //   CurrencyName: '',
    //   IFSCCode : '',
    //   SwiftCode : null,
    //   StatusID : null,
    // }
    // this.paymentService.getBankAccountList(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
    //   if(result.message == "Success"){
    //     // console.log(result['data'].Table)
    //     this.bankList = result['data'].Table;
    //   }
    // });

    let payload = {
      "OfficeId": this.paymentForm.value.Table.OfficeId,
      "DivisionId": this.paymentForm.value.Table.DivisionId
    }
    this.commonDataService.getBankByOfficeId(payload).subscribe((result: any) => {
      if (result.message == "Success") {
        this.bankList = result['data'].Table;
        if (getSameCurrencyBank) {
          this.getSameCurrencyBank()
        }
      }
    })

  }


  getVendorList() {
    return new Promise((resolve, reject) => {
      this.paymentService.getVendorList({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          if (result["data"].Table.length) {
            this.vendorList = result["data"].Table;
            const uniqueVendor = this.removeDuplicatesVendorId(result["data"].Table, 'VendorID');
            this.vendorUniqueList = uniqueVendor;
            resolve(true);
            // console.log('vendorList', this.vendorList);
          }
        }
      }, (error: HttpErrorResponse) => {
        // Swal.fire(error.message, 'error');
        reject();
      });
    })
  }

  // remove the vendor duplicates
  removeDuplicatesVendorId(arr, key) {
    const uniqueMap = new Map();
    arr.forEach((item) => {
      const value = item[key];
      if (!uniqueMap.has(value)) {
        uniqueMap.set(value, item);
      }
    });
    return Array.from(uniqueMap.values());
  }



  getVendorBranch(vendorId) {
    debugger
    const vendorDetails = this.vendorList.find((vendor) => vendor.VendorID == vendorId);
    this.paymentForm.controls['Table'].controls['VendorBranch'].setValue('');
    if (vendorDetails) {
      this.vendorBranch = this.vendorList.filter(vendor => { return vendor.VendorName === vendorDetails.VendorName });
      this.paymentForm.controls['Table'].controls['VendorBranch'].setValue('');
      this.paymentForm.controls['Table'].controls['VendorTan'].setValue(''); // clear brach value
      this.paymentForm.controls['Table'].controls['TdsDeducted'].setValue(0); // set NO to TDS
      this.isTds = false;
      if (this.vendorBranch.length) {
        const selectedBranch = this.vendorBranch[0].BranchCode;
        this.paymentForm.value.vendorBranch = this.vendorBranch[0].CityName
        this.getVendorTan(selectedBranch);
        this.paymentForm.controls['Table'].controls['VendorBranch'].setValue(this.vendorBranch[0].CityName);
      }
      // this.branches = this.vendorBranch.length
      // this.newOne = this.vendorBranch[0].BranchCode;
    }
  }

  getVendorTan(vendorBranch) {
    debugger
    const vendorTanDetails = this.vendorList.filter(vendor => { return vendor.BranchCode == vendorBranch }); // ! need to vendorTanDetails is present
    if (vendorTanDetails.length == 0) {
      return;
    }
    const payload = {
      VendorID: vendorTanDetails[0].VendorID,
      VendorBranchID: vendorTanDetails[0].VendorBranchID
    };

    this.paymentService.getVendorId(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result.message == "Success") {
        const vendorTanDetails = result['data'];
        if (vendorTanDetails.Table.length) {
          const TAN_no = vendorTanDetails.Table[0].TANNo
          if (TAN_no) {
            this.paymentForm.controls['Table'].controls['VendorTan'].setValue(TAN_no);
            this.paymentForm.controls['Table'].controls['TdsDeducted'].setValue(1);  // set YES to TDS
            this.isTds = true;
          } else {
            this.paymentForm.controls['Table'].controls['TdsDeducted'].setValue(0);  // set NO to TDS
            this.isTds = false;
          }
        }
        // console.log('vendorBranch', vendorTanDetails)
      }
    });
  }

  getCurrency() {
    return new Promise((resolve, rejects) => {
      const payload = { "currencyId": 0, "countryId": 0 };
      let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
      this.dataService.post(service, {}).subscribe((result: any) => {
        if (result.length > 0) {
          this.currencyList = result;
          const entityInfo: any = this.commonDataService.getLocalStorageEntityConfigurable();
          let info = this.currencyList.find(x => x.Currency == entityInfo.Currency);
          let currencyCode = entityInfo.Currency.split('-');
          this.receivedCurrencyName = currencyCode[0].trim();
          resolve(true)
        }
      });
    })
  }

  getModeOfPayment() {
    this.paymentService.getModeOfPayment({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result.message == "Success") {
        this.paymentModeList = result['data'].Table;
      }
    })
  }

  getNumberRangeList() {
    this.autoGenerationCodeService.getNumberRangeList({ Id: 0 }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
      if (result.message == "Success") {
        this.numberRangeList = result['data'].Table;
        // this.autoCodeGeneration();
        // console.log('numberRangeList', this.numberRangeList)
      }
    })
  }


  autoCodeGeneration(event: any) {
    return new Promise(async (resolve, reject) => {
      // if (!this.isUpdate) {
      if (event) {
        let paymentVoucher = this.numberRangeList.filter(x => x.ObjectName == 'Payment Voucher');
        if (paymentVoucher.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: paymentVoucher[0].SectionA }, { sectionB: paymentVoucher[0].SectionB }, { sectionC: paymentVoucher[0].SectionC }, { sectionD: paymentVoucher[0].SectionD }], paymentVoucher[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(paymentVoucher[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);

          if (code) this.paymentForm.controls['Table'].controls['PaymentVoucherNumber'].setValue(code.trim().toUpperCase());
          resolve(true);
        }
        else {
          Swal.fire('Please create the auto-generation code for Receipt Voucher.')
          resolve(true);
        }
      }
      else {
        this.paymentForm.controls['PaymentVoucherNumber'].setValue('');
        reject(false);
      }
      // } else {
      //   resolve(true);
      // }
    });
  }


  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (this.paymentForm.value.Table.DivisionId && this.paymentForm.value.Table.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.paymentForm.value.Table.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.paymentForm.value.Table.DivisionId);
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


  updateAutoGenerated() {
    let Info = this.numberRangeList.filter(x => x.ObjectName == 'Payment Voucher');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.data);
          }
        }, error => {
          console.error(error);
        });
    }
  }


  setDueBill(value) {
    debugger
    if (value == 0) {
      this.isTds = false;
    } else {
      this.isTds = true;
    }

  }

  setPaymentVoucherRadio(type) {
    debugger
    if (type === 'IsBill') {
      this.paymentForm.controls['Table'].controls['IsBill'].setValue(1);
      this.paymentForm.controls['Table'].controls['IsOnAccount'].setValue(0)
      this.paymentType = 'IsBill';
      this.isPaymentForBill = true;
      this.isSameAmount = false;
      this.calculateFinalTotal();
      const VendorId = this.paymentForm.controls['Table'].controls['IsVendor'].value ? 1 : this.paymentForm.controls['Table'].controls['IsAccount'].value ? 2 : '';
      this.setVendor(VendorId);
    } else {
      // this.isEditMode = true;
      // this.isSameAmount = true;
      this.paymentForm.controls['Table'].controls['IsOnAccount'].setValue(1)
      this.paymentForm.controls['Table'].controls['IsBill'].setValue(0);
      this.paymentType = 'IsOnAccount';
      this.isPaymentForBill = false;
      this.isSameAmount = true;
      const AccountId = this.paymentForm.controls['Table'].controls['IsAccount'].value ? 2 : this.paymentForm.controls['Table'].controls['IsVendor'].value ? 1 : '';
      this.setVendor(AccountId);
    }
    this.updatePaymentForInDocument(); // update the billing type in documentLust array
  }

  setCurrencyId(CurrencyID) {
    debugger
    const currencyDetails = this.currencyList.find((curr) => curr.ID == CurrencyID);
    this.receivedCurrencyName = currencyDetails.CurrencyCode;
    this.getSameCurrencyBank();
    this.paymentForm.controls['Table'].controls['CurrencyName'].setValue(currencyDetails.CurrencyCode);
    this.paymentForm.controls['Table'].controls['CurrencyId'].setValue(currencyDetails.ID)

    if (this.paymentForm.controls['Table'].value.CurrencyId != this.entityCurrencyId) {
      this.paymentForm.controls.Table.controls['ExchangeRate'].setValue(0);
      this.paymentForm.controls.Table.controls['ExGain'].setValue(0);
      this.paymentForm.controls.Table.controls['ExLoss'].setValue(0);
      this.IsExGainEnable = true;
      this.IsExLossEnable = true;
      this.IsExchangeRateEnable = true;
    } else {
      this.paymentForm.controls.Table.controls['ExchangeRate'].setValue(1);
      this.paymentForm.controls.Table.controls['ExGain'].setValue(0);
      this.paymentForm.controls.Table.controls['ExLoss'].setValue(0);
      this.IsExGainEnable = false;
      this.IsExLossEnable = false;
      this.IsExchangeRateEnable = false;
    }
  }

  setBankCharge(CurrencyID) {
    const currencyDetails = this.currencyList.find((curr) => curr.ID == CurrencyID);
    this.paymentForm.controls['Table'].controls['BankCurrencyName'].setValue(currencyDetails.CurrencyCode);
    this.paymentForm.controls['Table'].controls['BankCurrencyId'].setValue(currencyDetails.ID)
  }

  getDueAmount(tds = 0, bill = 0, payment = 0, index, dueAmount, type, isChecked = false) {
    debugger
    !tds ? tds = 0 : '';
    !payment ? payment = 0 : '';
    let currentRow = this.paymentDetailsTableList[index];
    const totalPayment = +tds + +payment
    let toCurrency = this.currencyList.find(x => x.ID == this.paymentForm.value.Table.CurrencyId);
    // ! check total payment(tds + payment) is greater then actual due amount 
    if (totalPayment > currentRow.DueAmountActual) {
      type == 'tds' ? this.paymentDetailsTableList[index].TDS = currentRow.DueAmountActual - currentRow.Payment : '';
      type == 'payment' ? this.paymentDetailsTableList[index].Payment = currentRow.DueAmountActual - currentRow.TDS : '';
      currentRow = this.paymentDetailsTableList[index]; // 
      // * check the alert when input is typed in the input field 
      if (!isChecked) {
        Swal.fire(`${type} amount has exceeded the due amount limit!`);
      }

      this.paymentDetailsTableList[index].DueAmount = +currentRow.DueAmountActual - (+currentRow.TDS + +currentRow.Payment)

      if (this.paymentDetailsTableList[index].Currency != toCurrency.CurrencyCode) {
        this.paymentDetailsTableList[index].DueAmountCCY = Number(this.paymentDetailsTableList[index].Payment * Number((!this.paymentDetailsTableList[index].ExchangeRate ? 1 : this.paymentDetailsTableList[index].ExchangeRate))).toFixed(this.entityFraction)
      } else {
        this.paymentDetailsTableList[index].DueAmountCCY = Number(this.paymentDetailsTableList[index].Payment).toFixed(this.entityFraction)
      }

      // this.paymentDetailsTableList[index].DueAmountCCY = +currentRow.DueAmountCCY - (+currentRow.TDS + +currentRow.Payment)

    } else {
      // this.paymentDetailsTableList[index].DueAmount = +dueAmount - (+tds + +payment);
      this.paymentDetailsTableList[index].DueAmount = Number(+currentRow.DueAmountActual - (+tds + +payment)).toFixed(this.entityFraction)

      if (this.paymentDetailsTableList[index].Currency != toCurrency.CurrencyCode) {
        this.paymentDetailsTableList[index].DueAmountCCY = Number(this.paymentDetailsTableList[index].DueAmountActual * Number((!this.paymentDetailsTableList[index].ExchangeRate ? 1 : this.paymentDetailsTableList[index].ExchangeRate))).toFixed(this.entityFraction)
      } else {
        this.paymentDetailsTableList[index].DueAmountCCY = this.paymentDetailsTableList[index].DueAmountActual.toFixed(this.entityFraction)
      }
    }
    this.calculateFinalTotal();
    console.log('paymentDetailsTableList edit tds and pay', this.paymentDetailsTableList)

  }


  onFileSelected(index: any) {
    this.editSelectedDocument = index;
  }

  deleteDocument(i) {
    if (this.IsFinal) {
      Swal.fire("Final");
      return
    }
    if (!this.isEditMode) {
      Swal.fire("Please Click Edit Button to Delete");
      return;
    }
    this.documentTableList.splice(i, 1)
  }

  documentSelected(event) {

    if (this.IsFinal) {
      Swal.fire("Final");
      return
    }

    if (!this.isEditMode) {
      Swal.fire("Please Click Edit Button to Add");
      return;
    }

    if (event.target.files.length > 0) {
      this.paymentForm.controls.document.controls.FilePath.setValue(event.target.files[0].name);
      this.paymentForm.controls.document.controls.DocumentName.setValue(event.target.files[0].name);
      this.uploadDocument();
    }
  }

  uploadDocument() {
    let validation = '';
    if (this.documentTableList.length >= 5) {
      validation += '<span style=\'color:red;\'>*</span> <span>You can upload Maximum of 5 </span></br>';
      Swal.fire(validation);
      return true;
    }
    if (!this.paymentForm.value.document.DocumentName) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please select Document Name </span></br>';
    }
    if (!this.paymentForm.value.document.FilePath) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please upload Browser File</span></br>';
    }
    if (validation !== '') {
      Swal.fire(validation);
      return false;
    } else {
      const Table = this.paymentForm.value.Table
      let document = this.paymentForm.value.document;
      document.IsBill = Table.IsBill ? 1 : 0;
      document.IsOnAccount = Table.IsOnAccount ? 1 : 0;
      this.documentTableList.push(document)
      this.documentUploadReset()
    }
  }

  documentUploadReset() {
    this.paymentForm.controls['document'].controls['FilePath'].setValue('');
    this.paymentForm.controls['document'].controls['IsOnAccount'].setValue('');
  }

  getStatus() {
    var service = `${this.globals.APIURL}/Common/GetStatusDropDownList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      console.log(result, 'status result')
      this.statusList = result.data.Table
    }, error => { });
  }

  getEntityDetails() {
    return new Promise((resolve, rejects) => {
      this.paymentService.getEntityDetails({ "OrgId": this.OrgId })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: any) => {
          if (result.message == "Success") {
            this.entityDetails = result.data;
            this.entityCurrency = this.entityDetails.Table1[0].Currency;
            const entityCurrencyCode = this.entityCurrency.split('-')[0].replace(' ', '')
            let entityDetails = this.currencyList.find((curr) => curr.CurrencyCode == entityCurrencyCode);
            if (entityDetails) {
              this.entityCurrencyId = entityDetails.ID;
              this.entityCurrencyName = entityDetails.CurrencyName;
              this.entityCurrencyCode = entityCurrencyCode;
            }
            // * set entity currency value as default for AMOUNT PAID and BANK CHARGES
            if (this.entityCurrencyId) {
              this.paymentForm.controls['Table'].controls['CurrencyId'].setValue(this.entityCurrencyId);
              this.paymentForm.controls['Table'].controls['CurrencyName'].setValue(entityDetails.CurrencyCode);
              this.paymentForm.controls['Table'].controls['BankCurrencyId'].setValue(this.entityCurrencyId);
              this.paymentForm.controls['Table'].controls['BankCurrencyName'].setValue(this.entityCurrencyName);

              if (this.paymentForm.controls['Table'].value.CurrencyId != this.entityCurrencyId) {
                // this.paymentForm.controls.Table.controls['ExchangeRate'].enable();
                // this.paymentForm.controls.Table.controls['ExGain'].enable();
                // this.paymentForm.controls.Table.controls['ExLoss'].enable();
                this.IsExGainEnable = true;
                this.IsExLossEnable = true;
                this.IsExchangeRateEnable = true;
              } else {
                // this.paymentForm.controls.Table.controls['ExchangeRate'].disable();
                // this.paymentForm.controls.Table.controls['ExGain'].disable();
                // this.paymentForm.controls.Table.controls['ExLoss'].disable();
                this.IsExGainEnable = false;
                this.IsExLossEnable = false;
                this.IsExchangeRateEnable = false;
              }

            }
            debugger
            if (this.entityCurrencyId === +this.paymentForm.controls['Table'].controls['CurrencyId'].value) {
              this.isSameCurrency = true
            }
          }
          resolve(true)
        });
    })
  }


  // * calculate total Amount
  calculateAmount() {
    const AmountPaid = this.paymentForm.controls.Table.controls['AmountPaid'].value;
    if (this.exchangePairDetails.length) {
      this.paymentForm.controls.Table.controls['TotalAmount'].setValue(+AmountPaid * this.exchangePairDetails[0].Rate);
      this.TotalAmount = this.paymentForm.value.Table.TotalAmount;
    } else {
      this.paymentForm.controls.Table.controls['TotalAmount'].setValue(0);
      this.TotalAmount = '';
    }
  }

  CurrentExRate($event) {
    if (!this.exchangeRateInput) {
      return
    }

    this.paymentForm.controls.Table.controls['TotalAmount'].setValue(Number(this.paymentForm.value.Table.AmountPaid) * Number(this.exchangeRateInput));
    this.TotalAmount = this.paymentForm.value.Table.TotalAmount;
  }

  amountChange($event) {
    debugger
    this.TotalCredit = Number($event);

    this.AmountDifference = Math.abs(this.TotalDebit - (this.TotalCredit == 0 ? this.paymentForm.value.Table.AmountPaid : this.TotalCredit));
    this.paymentForm.controls.Table.controls['AmountPaidCCY'].setValue(Number(this.paymentForm.value.Table.AmountPaid) * Number(this.paymentForm.value.Table.ExchangeRate));

    // if (!this.exchangeRateInput) {
    //   return
    // }

    // this.paymentForm.controls.Table.controls['TotalAmount'].setValue(Number(this.paymentForm.value.Table.AmountPaid) * Number(this.exchangeRateInput));
    // this.TotalAmount = this.paymentForm.value.Table.TotalAmount;
  }


  // this.paymentForm.get('CurrentExRate').disable();
  // if((this.paymentForm.value.CurrentExRate  === '') && (this.paymentForm.value.CurrentExRate === null )){
  //   this.TotalAmount;
  // }




  getExchangeRate(fromCurrencyCode = '', toCurrencyCode = '') {
    debugger
    const payload = {
      FromCurrency: fromCurrencyCode,
      ToCurrency: toCurrencyCode
    }
    if (payload.FromCurrency != payload.ToCurrency) {
      // this.isSameCurrency = false;
      // // this.exchangePairDetails = [];
      // const amountPaid = this.paymentForm.controls.Table.controls['AmountPaid'].value;
      // // let service = `${this.globals.APIURL}/Common/GetVoucherExchangeRates`;
      // this.dataService.post(service, payload)
      //   // .pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe((result: any) => {
      //     if (result.message = "Success" && result.data.Table.length > 0) {
      //       this.exchangePairDetails = result.data.Table;
      //       this.paymentForm.value.Table.CurrentExRate = this.exchangeRateInput;
      //       this.paymentForm.value.Table.TotalAmount = this.TotalAmount;
      //       if (this.exchangePairDetails.length) {
      //         const exchangePairId = result.data.Table[0].Id
      //         this.paymentForm.controls['Table'].controls['ExchangeRateId'].setValue(1);
      //         this.paymentForm.controls.Table.controls['TotalAmount'].setValue(+amountPaid * this.exchangeRateInput ? this.exchangeRateInput : this.exchangePairDetails[0].Rate);
      //         this.paymentForm.controls['Table'].controls['CurrentExRate'].setValue(this.exchangeRateInput);
      //         // this.paymentForm.controls['CurrentExRate'].setValue(this.exchangeRateInput);

      //         this.paymentForm.controls.Table.controls['TotalAmount'].setValue(Number(this.paymentForm.value.Table.AmountPaid) * Number(this.exchangeRateInput));
      //         this.TotalAmount = this.paymentForm.value.Table.TotalAmount;

      //         let toCurrency = this.currencyList.find(x => x.ID == this.paymentForm.value.Table.CurrencyId);

      //         this.paymentDetailsTableList.forEach((invoice) => {
      //           if (invoice.Currency != toCurrency.CurrencyCode) {
      //             invoice.InvoiceAmountCCY = invoice.BillAmount * this.exchangePairDetails[0].Rate
      //             invoice.DueAmountCCY = invoice.DueAmount * this.exchangePairDetails[0].Rate
      //           } else {
      //             invoice.InvoiceAmountCCY = invoice.BillAmount
      //             invoice.DueAmountCCY = invoice.DueAmount
      //           }
      //         })
      //       }
      //     }
      //     else {
      //       this.paymentForm.controls['Table'].controls['ExchangeRateId'].setValue(1);
      //       this.paymentForm.controls.Table.controls['TotalAmount'].setValue(0);
      //       this.TotalAmount = this.paymentForm.value.Table.TotalAmount;
      //     }
      //   }, error => {
      //     console.error(error);
      //     this.isSameCurrency = true;
      //   });
      let toCurrency = this.currencyList.find(x => x.ID == this.paymentForm.value.Table.CurrencyId);
      this.paymentDetailsTableList.forEach((invoice) => {
        if (invoice.Currency != toCurrency.CurrencyCode) {
          invoice.InvoiceAmountCCY = (invoice.BillAmount * (!invoice.ExchangeRate ? 1 : invoice.ExchangeRate)).toFixed(this.entityFraction)
          invoice.DueAmountCCY = (invoice.DueAmount * (!invoice.ExchangeRate ? 1 : invoice.ExchangeRate)).toFixed(this.entityFraction)
        } else {
          invoice.InvoiceAmountCCY = Number(invoice.BillAmount).toFixed(this.entityFraction)
          invoice.DueAmountCCY = Number(invoice.DueAmount).toFixed(this.entityFraction)
        }
      })
    } else {
      this.paymentForm.controls.Table.controls['TotalAmount'].setValue(0);
      this.isSameCurrency = true;
    }
  }

  calculateLocalAmount() {
    const amountPaid = this.paymentForm.controls.Table.controls['AmountPaid'].value;
    if (amountPaid && this.exchangePairDetails.length) {
      this.paymentForm.controls.Table.controls['TotalAmount'].setValue(+amountPaid * this.exchangePairDetails[0].Rate);

      this.TotalAmount = this.paymentForm.value.Table.TotalAmount;
    } else {
      this.paymentForm.controls.Table.controls['TotalAmount'].setValue(0);
      this.TotalAmount = this.paymentForm.value.Table.TotalAmount;
    }
  }

  updatePaymentForInDocument() {
    const Table = this.paymentForm.value.Table
    if (this.documentTableList.length) {
      this.documentTableList.forEach(document => {
        document.IsBill = Table.IsBill ? 1 : 0;
        document.IsOnAccount = Table.IsOnAccount ? 1 : 0;
      });
    }
  }

  backToMain() {
    this.router.navigate(['/views/transactions/payment/payment-view']);
  }

  getInvoiceList(Vendor_id) {
    const payload = {
      "VendorId": Vendor_id
    }
    this.paymentService.getInvoicePaymentList(payload).subscribe(async (result: any) => {
      debugger
      if (result.message == "Success") {

        const constructArray = [];
        const isDiffCurrencyInvoice = result.data.Table.find((x) => x.CurrencyCode != this.entityCurrencyCode)
        // console.log('isDiffCurrencyInvoice', isDiffCurrencyInvoice)
        if (isDiffCurrencyInvoice) {
          await this.getExchangeRate(this.entityCurrencyCode, isDiffCurrencyInvoice.CurrencyCode);
          this.isSameCurrency = false;
        }
        debugger
        // const val = this.exchangePairDetails;
        result.data.Table.forEach((invoice) => {
          const due = {
            BillDueId: 0,
            PaymentVoucherInvoiceId: this.paymentId,
            BillDate: invoice.PIDate,
            InvoiceNumber: invoice.PINumber,
            Currency: invoice.CurrencyCode,
            BillAmount: invoice.InvoiceAmount,
            TDS: invoice.TDSAmount ?? 0,
            DueAmountActual: invoice.DueAmount ? +invoice.DueAmount : +invoice.InvoiceAmount,
            DueAmount: invoice.DueAmount ? +invoice.DueAmount : +invoice.InvoiceAmount,
            Payment: '',
            CreatedBy: this.CreatedBy,
            CreatedDate: this.CreatedDate,
            IsCheck: 0,
            PurchaseInvoiceId: invoice.PurchaseInvoiceId,
            InvoiceAmountCCY: invoice.InvoiceAmountCCY,
            DueAmountCCY: invoice.DueAmountCCY,
            ExchangeRate: invoice.ExchangeRate
          };

          // const exchangeRate = this.exchangePairDetails.length ? +this.exchangePairDetails[0].Rate : 0
          // due.BillAmountLocal =  due.BillAmount * +exchangeRate;
          // due.DueAmountLocal =  due.DueAmountActual * +exchangeRate;

          constructArray.push(due)
        })
        this.paymentDetailsTableList = constructArray;
        console.log('paymentDetailsTableList get invo id', this.paymentDetailsTableList)
      }
    })
  }

  OnClickRadio(index, InvoiceNumber, selectedValue) {
    debugger
    this.paymentDetailsTableList[+index].IsCheck = this.paymentDetailsTableList[index].IsCheck == 0 ? 1 : 0;
  }
  // * Invoice selected total amount calculation;
  calculateFinalTotal() {
    if (!this.isPaymentForBill) {
      this.isSameAmount = true;
      return
    }

    if (this.paymentDetailsTableList.length > 0) {
      let info = this.paymentDetailsTableList.filter(x => x.IsCheck == true);
      var totalAmountCal = 0;
      var totalTDSAmount = 0;
      var totalPaymentAmount = 0;
      if (info.length > 0) {

        info.forEach(element => {
          totalAmountCal += Number(Number(element.Payment) * Number(element.ExchangeRate));
          totalTDSAmount += (Number(element.TDS) * Number(element.ExchangeRate)),
            // totalPaymentAmount += (Number(element.Payment) * Number(element.ExchangeRate))
            totalPaymentAmount += (Number(element.TDS) * Number(element.ExchangeRate)) + (Number(element.Payment) * Number(element.ExchangeRate));
        });
      }
      // this.paymentForm.controls.Table.controls['TotalAmount'].setValue(totalAmountCal);
      this.selectedInvoiceTotal = Number(totalAmountCal.toFixed(this.entityFraction));;
      const amountPaid = this.paymentForm.controls.Table.controls['AmountPaid'].value;
      const totalAmount = this.selectedInvoiceTotal;
      if (amountPaid == totalAmount) {
        this.isSameAmount = true;
      } else {
        this.isSameAmount = false;
      }

      this.paymentForm.controls['Table'].controls['TotalTDSAmount'].setValue(totalTDSAmount.toFixed(this.entityFraction))
      this.paymentForm.controls['Table'].controls['TotalPaymentAmount'].setValue(totalPaymentAmount.toFixed(this.entityFraction))
    }

    this.summaryAmountCalculation();

  }

  // Method to handle key press in the input field
  onInputKeyUp(event: KeyboardEvent) {
    event.stopPropagation(); // Prevent the event from propagating to parent elements
    event.preventDefault()
    const value = (event.target as HTMLInputElement).value.trim();

    // Check if Enter key or comma is pressed and the input value is not empty
    if (event.key === 'Enter' && value !== '') {
      this.addInvoiceToList(value); // Add the invoice number to the array
      this.invoiceSearch = ''; // Clear the input field
    } else if (event.key === ',' && value !== '') {
      this.addInvoiceToList(value); // Add the invoice number to the array
      this.invoiceSearch = ''; // Clear the input field
    }
  }

  // Method to add the invoice number to the array
  addInvoiceToList(invoiceNumber: string) {
    // Remove trailing comma, if present
    invoiceNumber = invoiceNumber.trim().replace(/,$/, '');
    this.searchedInvoiceIds.push(invoiceNumber);
  }

  remove(index, invoiceNo): void {
    if (index >= 0) {
      this.searchedInvoiceIds.splice(index, 1);
      const listIndex = this.paymentDetailsTableList.findIndex((invoice) => { return invoice.InvoiceNumber === invoiceNo })
      this.paymentDetailsTableList[listIndex].IsCheck = 0;
      this.calculateFinalTotal();
    }
  }

  clearInvoices() {
    this.searchedInvoiceIds = [];
    this.invoiceSearch = ''
  }

  searchInvoices(byClick) {

    if (!this.searchedInvoiceIds.length && !byClick) {
      return
    }

    const filteredInvoice = [];
    this.searchedInvoiceIds.forEach((Invoice) => {
      const index = this.paymentDetailsTableList.findIndex((invoice) => { return invoice.InvoiceNumber === Invoice })
      if (index >= 0) {
        let selectedInvoice = this.paymentDetailsTableList.splice(index, 1);
        if (selectedInvoice && !selectedInvoice[0].IsCheck) {
          selectedInvoice[0]['IsCheck'] = 1;
          selectedInvoice[0]['Payment'] = selectedInvoice[0].DueAmount;
          selectedInvoice[0]['DueAmount'] = 0;
        }
        filteredInvoice.push(...selectedInvoice);
      }
    })

    let newPaymentDetailsTableList = [];
    newPaymentDetailsTableList = this.paymentDetailsTableList;

    this.paymentDetailsTableList = [];
    this.paymentDetailsTableList = [...filteredInvoice, ...newPaymentDetailsTableList];
  }

  // move the selcted invoices to top
  groupSelectedAtTop() {
    debugger
    const selectedInvoicesIndices = this.paymentDetailsTableList.reduce((indices, invoice, index) => {
      if (invoice.IsCheck === 1) {
        indices.push(index);
      }
      return indices;
    }, []);
    const filteredInvoices = selectedInvoicesIndices.map(index => this.paymentDetailsTableList.splice(index, 1)).flat();
    const nonSelectedInvoices = this.paymentDetailsTableList;
    this.paymentDetailsTableList = [...filteredInvoices, ...nonSelectedInvoices];
  }


  //  set payment Amount as due Amount when checked;
  setInitalPaymentAmount(checkedIndex, seletedInvoice) {
    debugger
    if (!seletedInvoice.Payment && seletedInvoice.IsCheck) {
      this.paymentDetailsTableList[checkedIndex].Payment = seletedInvoice.DueAmount;
      this.getDueAmount(seletedInvoice.TDS, seletedInvoice.BillAmount, seletedInvoice.DueAmount, checkedIndex, seletedInvoice.DueAmount, 'payment', true);
    } else {
      let toCurrency = this.currencyList.find(x => x.CurrencyCode == this.paymentDetailsTableList[checkedIndex].Currency);
      if (this.paymentDetailsTableList[checkedIndex].Payment) {
        this.paymentDetailsTableList[checkedIndex].DueAmount = this.paymentDetailsTableList[checkedIndex].DueAmountActual;
        this.paymentDetailsTableList[checkedIndex].Payment = 0;
        this.paymentDetailsTableList[checkedIndex].TDS = this.paymentDetailsTableList[checkedIndex].TDS;

        if (this.paymentDetailsTableList[checkedIndex].Currency != toCurrency.CurrencyCode) {
          this.paymentDetailsTableList[checkedIndex].DueAmountCCY = this.paymentDetailsTableList[checkedIndex].DueAmount * Number((!this.paymentDetailsTableList[checkedIndex].ExchangeRate ? 1 : this.paymentDetailsTableList[checkedIndex].ExchangeRate))
        } else {
          this.paymentDetailsTableList[checkedIndex].DueAmountCCY = this.paymentDetailsTableList[checkedIndex].DueAmount
        }
      }
    }
    this.groupSelectedAtTop(); // move the selcted invoices to top
  }

  validationCheck() {
    const Table = this.paymentForm.value.Table
    var validation = "";
    if (Table.DivisionId == "" || Table.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (Table.OfficeId == "" || Table.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    if (Table.PaymentVoucherDate == "" || Table.PaymentVoucherDate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Payment Voucher Date.</span></br>"
    }
    if ((Table.VendorId == "" || Table.VendorId == 0) && Table.IsVendor) {
      validation += "<span style='color:red;'>*</span> <span>Please select Vendor Name.</span></br>"
    }
    if ((Table.VendorBranch == "" || Table.VendorBranch == 0) && Table.IsVendor) {
      validation += "<span style='color:red;'>*</span> <span>Please select Vendor Branch.</span></br>"
    }
    if (Table.AmountPaid == '' || Table.AmountPaid == null) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Amount Paid.</span></br>"
    }

    if (Table.TdsDeducted == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select TDS Deducted.</span></br>"
    }
    if ((Table.PaidfromId == "" || Table.PaidfromId == 0) && Table.IsVendor) {
      validation += "<span style='color:red;'>*</span> <span>Please select Paid From.</span></br>"
    }
    if (Table.ModeofPaymentId == "" || Table.ModeofPaymentId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Mode of Payment.</span></br>"
    }
    if ((Table.ReferenceNo == "" || Table.ReferenceNo == null) && Table.ModeofPaymentId != 2) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Reference No.</span></br>"
    }

    // if (this.isPaymentForBill && !this.isSameAmount && Table.IsVendor) {
    //   validation += "<span style='color:red;'>*</span> <span>Invoice Total Not Match With Amount Paid.</span></br>"
    //   // Swal.fire("Invoice Total Not Match With Amount Paid.");
    //   // return
    // }

    // if (this.isPaymentForBill && !this.isSameAmount && Table.IsVendor) {
    //   validation += "<span style='color:red;'>*</span> <span>Invoice Total Not Match With Amount Paid.</span></br>"
    //   // Swal.fire("Invoice Total Not Match With Amount Paid.");
    //   // return
    // }

    return validation;
  }


  ngOnDestroy() {
    // ! 1 Note: It's important to add the takeUntil operator as the last one to prevent leaks with intermediate Observables in the operator chain

    // ! 2. We then call this.ngUnsubscribe.next(); this.ngUnsubscribe.complete(); in our ngOnDestroy() methods.

    // ! 3.The secret sauce (as noted already by @metamaker) is to call takeUntil(this.ngUnsubscribe)
    // ! before each of our .subscribe() calls which will guarantee all subscriptions will be cleaned up when the component is destroyed.

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getIsChecked(i) {
    if (i !== undefined) {

      const inputData = this.paymentDetailsTableList[i].Payment;
      const enteredDecimalCount = inputData % 1 !== 0 ? inputData.toString().split('.')[1]?.length || 0 : 0;
      if (enteredDecimalCount > this.entityFraction) {
        const fixedDecimal = inputData.toFixed(this.entityFraction);
        this.paymentDetailsTableList[i].Payment = fixedDecimal;
      }

      const inputData1 = this.paymentDetailsTableList[i].TDS;
      const enteredDecimalCount1 = inputData1 % 1 !== 0 ? inputData1.toString().split('.')[1]?.length || 0 : 0;
      if (enteredDecimalCount1 > this.entityFraction) {
        const fixedDecimal1 = inputData1.toFixed(this.entityFraction);
        this.paymentDetailsTableList[i].TDS = fixedDecimal1
      }
      return this.paymentDetailsTableList[i].IsCheck == 0 || this.paymentDetailsTableList[i].IsCheck == null ? false : true;
    }
    return false;
  }


  DynamicGridAddRow() {
    debugger
    const gRow = this.paymentForm.value.Table4;
    var validation = "";

    if (gRow.AccountId === 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account</span></br>"
    }

    if (!gRow.TransactionType) {
      validation += "<span style='color:red;'>*</span> <span>Please select DR/CR</span></br>"
    }

    if (!gRow.CurrencyId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency </span></br>"
    }

    if (!gRow.ROE) {
      validation += "<span style='color:red;'>*</span> <span>Please enter ROE</span></br>"
    }

    if (!gRow.Amount_LCR) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Amount_LCR</span></br>"
    }

    // if (!gRow.Amount_CCR) {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Amount_CCR</span></br>"
    // }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }

    // let IsExists = this.GridRowValidation(gRow);

    // if (IsExists) {
    //   Swal.fire("", "", 'warning');
    //   return;Linked GL Mapping combination already Exists
    // }

    const Account = this.AccountList.find(e => { return e.ChartOfAccountsId == gRow.AccountId })
    const Currency = this.currencyList.find(e => { return e.ID == gRow.CurrencyId })

    gRow.AccountName = Account ? Account.AccountName : '-';
    gRow.TransactionTypeName = gRow.TransactionType == 1 ? 'DR' : 'CR';
    gRow.CurrencyName = Currency ? Currency.CurrencyCode : '-';

    // this.accountDetailsTableList.push(gRow);

    gRow.Amount_CCR = Number(gRow.ROE * gRow.Amount_LCR).toFixed(this.entityFraction);

    if (this.isGridEditMode) {
      this.accountDetailsTableList[this.editSelectedIndex] = gRow;
      this.isGridEditMode = !this.isGridEditMode;
      this.clearAccountDetailsForm();

      if (gRow.TransactionType == 1) {
        this.TotalDebit = Number(this.TotalDebit + Number(gRow.Amount_LCR).toFixed(this.entityFraction));
      } else if (gRow.TransactionType == 2) {
        this.TotalCredit = this.TotalCredit + Number(gRow.Amount_LCR);
      }

      this.AmountDifference = Math.abs(this.TotalDebit - (this.TotalCredit == 0 ? this.paymentForm.value.Table.AmountPaid : this.TotalCredit));
      this.summaryAmountCalculation();

      return;
    } else {
      // if (gRow.ActivityId == '') {
      //   // Loop through the activity records
      //   this.AccountList.forEach(activityRecord => {
      //     // if (activityRecord.ID === gRow.ActivityId) {
      //     this.accountDetailsTableList.push({
      //       ...gRow,
      //       ActivityId: activityRecord.ID,
      //       Activity: activityRecord.Name
      //     });
      //     // }
      //   });
      // } else {
      //   this.accountDetailsTableList.push(gRow);
      // }
      if (gRow.TransactionType == 1) {
        this.TotalDebit = Number(this.TotalDebit + Number(gRow.Amount_LCR).toFixed(this.entityFraction));
      } else if (gRow.TransactionType == 2) {
        this.TotalCredit = this.TotalCredit + Number(gRow.Amount_LCR);
      }

      this.AmountDifference = Math.abs(this.TotalDebit - (this.TotalCredit == 0 ? this.paymentForm.value.Table.AmountPaid : this.TotalCredit));
      this.accountDetailsTableList.push(gRow);
      this.clearAccountDetailsForm();
      this.summaryAmountCalculation();
    }
  }

  clearAccountDetailsForm() {
    this.paymentForm.controls['Table4'].controls['PaymentAccountsId'].setValue(0);
    this.paymentForm.controls['Table4'].controls['PaymentVoucherInvoiceId'].setValue(this.paymentId);
    this.paymentForm.controls['Table4'].controls['AccountId'].setValue(0);
    this.paymentForm.controls['Table4'].controls['TransactionType'].setValue(0);
    this.paymentForm.controls['Table4'].controls['CurrencyId'].setValue('');
    this.paymentForm.controls['Table4'].controls['ROE'].setValue(1);
    this.paymentForm.controls['Table4'].controls['Amount_LCR'].setValue(0);
    this.paymentForm.controls['Table4'].controls['Amount_CCR'].setValue(0);
    this.paymentForm.controls['Table4'].controls['Narration'].setValue('');
  }

  radioChange(event: any, index: number) {
    this.editSelectedIndex = index;
  }

  OnClickEditValue() {
    // console.log('row', row, index)
    debugger
    const editRow = this.accountDetailsTableList[this.editSelectedIndex];

    if (editRow.TransactionType == true) {
      this.TotalDebit = Number((this.TotalDebit - Number(editRow.Amount_LCR)).toFixed(this.entityFraction));
    } else if (editRow.TransactionType == false) {
      this.TotalCredit = this.TotalCredit - Number(editRow.Amount_LCR);
    }
    this.AmountDifference = Math.abs(this.TotalDebit - (this.TotalCredit == 0 ? this.paymentForm.value.Table.AmountPaid : this.TotalCredit));

    this.patchAccountDetailsForm(editRow);
    this.isGridEditMode = !this.isGridEditMode;

    this.paymentForm.controls['Table'].controls['TotalDebit'].setValue(this.TotalDebit.toFixed(this.entityFraction))
    this.paymentForm.controls['Table'].controls['TotalCredit'].setValue(this.TotalCredit.toFixed(this.entityFraction))

  }

  DynamicGridDeleteRow() {
    if (this.editSelectedIndex >= 0 && this.editSelectedIndex != null) {
      this.summaryAmountCalculation();
      this.accountDetailsTableList.splice(this.editSelectedIndex, 1);
      this.editSelectedIndex = null;
    }
    else {
      Swal.fire('Please select the Item!!');
    }
  }

  patchAccountDetailsForm(editRow) {
    this.paymentForm.controls['Table4'].patchValue({
      PaymentAccountsId: editRow.PaymentAccountsId,
      PaymentVoucherInvoiceId: this.paymentId,
      AccountId: editRow.AccountId,
      TransactionType: editRow.TransactionType,
      CurrencyId: editRow.CurrencyId,
      ROE: editRow.ROE,
      Amount_LCR: editRow.Amount_LCR,
      Amount_CCR: editRow.Amount_CCR,
      Narration: editRow.Narration
    });
  }

  groupDataByCEOGroupId(data: any[]): { [key: string]: any[] } {
    const groupedData: { [key: string]: any[] } = {};

    for (const item of data) {
      const groupId = item.GroupName.toUpperCase();
      if (!groupedData[groupId]) {
        groupedData[groupId] = [];
      }
      groupedData[groupId].push(item);
    }

    return groupedData;
  }

  summaryAmountCalculation() {
    debugger
    var TotalDebit = 0;
    var TotalCredit = 0;
    var TotalTDS = 0;
    
    // this.paymentForm.value.Table.AmountPaid

    if (this.paymentForm.value.Table.IsVendor && this.isPaymentForBill) {
      // this.paymentForm.controls.Table.controls['IsVendor'].setValue(true);
      // this.paymentForm.controls.Table.controls['IsAccount'].setValue(false);
      // this.paymentForm.controls.Table.controls['TDSAmount'].disable();
      // this.paymentForm.controls.Table.controls['VendorId'].enable();
      // this.paymentForm.controls.Table.controls['VendorBranch'].enable();
      // this.IsTDSEnable = false;
      // this.IsVendorEnable = true;
      // this.IsBranchEnable = true;
      // this.paymentForm.controls.Table.controls['VendorId'].setValue('');
      // this.paymentForm.controls.Table.controls['VendorBranch'].setValue('');
      // this.paymentForm.controls.Table.controls['TDSAmount'].setValue(0);
      // this.isAccountType = false;

      // TotalTDS = this.paymentForm.value.Table.TDSAmount
      // let info = this.paymentDetailsTableList.filter(x => x.IsCheck == true);
      // var totalAmountCal = 0;
      // var totalTDSAmount = 0;
      // var totalPaymentAmount = 0;
      // info.forEach(element => {
      //   TotalCredit += Number(element.TDS),
      //   TotalTDS += Number(element.TDS),
      //   TotalDebit += Number(element.Payment)
      // });

      TotalDebit = Number(this.paymentForm.value.Table.TotalPaymentAmount) + Number(this.paymentForm.value.Table.ExLoss) + Number((this.paymentForm.value.Table.BankCharges * this.paymentForm.value.Table.ExchangeRate))

      TotalCredit += Number(this.paymentForm.value.Table.TotalTDSAmount);

    } else if (this.paymentForm.value.Table.IsVendor && !this.isPaymentForBill) {
      TotalDebit = Number((this.paymentForm.value.Table.AmountPaid * this.paymentForm.value.Table.ExchangeRate))
        + Number(this.paymentForm.value.Table.ExLoss) + Number((this.paymentForm.value.Table.TDSAmount * this.paymentForm.value.Table.ExchangeRate)) + Number((this.paymentForm.value.Table.BankCharges * this.paymentForm.value.Table.ExchangeRate))
    } else if (this.paymentForm.value.Table.IsAccount) {
      this.TotalDebitAccountAmount = 0;
      TotalDebit += Number(this.paymentForm.value.Table.ExLoss) + Number((this.paymentForm.value.Table.TDSAmount * this.paymentForm.value.Table.ExchangeRate)) + Number((this.paymentForm.value.Table.BankCharges * this.paymentForm.value.Table.ExchangeRate))
      
      this.accountDetailsTableList.forEach(element => {

        if (element.TransactionType == 1) {
          TotalDebit += Number(element.Amount_CCR);
        } else {
          TotalCredit += Number(element.Amount_CCR);
          this.TotalDebitAccountAmount += Number(element.Amount_CCR);
        }
        // TotalTDS += Number(element.),
      });

    }


    TotalCredit += Number((this.paymentForm.value.Table.AmountPaid * this.paymentForm.value.Table.ExchangeRate)) + Number((this.paymentForm.value.Table.TDSAmount * this.paymentForm.value.Table.ExchangeRate))
      + Number((this.paymentForm.value.Table.BankCharges * this.paymentForm.value.Table.ExchangeRate)) + Number(this.paymentForm.value.Table.ExGain)

    // this.TotalCredit = Number(TotalCredit.toFixed(this.entityFraction));

    this.paymentForm.controls['Table'].controls['TotalCredit'].setValue(TotalCredit.toFixed(this.entityFraction))
    this.paymentForm.controls['Table'].controls['TotalDebit'].setValue(TotalDebit.toFixed(this.entityFraction))

    // this.paymentForm.controls['Table'].controls['TotalTDSAmount'].setValue(TotalTDS.toFixed(this.entityFraction))
    this.TotalDebit = Number(TotalDebit.toFixed(this.entityFraction));

    this.AmountDifference = (TotalDebit - TotalCredit);

    this.isSameAmount = this.AmountDifference == 0 ? true : false;
  }



}
