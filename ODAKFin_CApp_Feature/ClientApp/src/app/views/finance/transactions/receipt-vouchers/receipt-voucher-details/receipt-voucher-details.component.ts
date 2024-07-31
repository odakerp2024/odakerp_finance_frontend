import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { BankFilter } from 'src/app/model/bankaccount';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { BankService } from 'src/app/services/bank.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipt-voucher-details',
  templateUrl: './receipt-voucher-details.component.html',
  styleUrls: ['./receipt-voucher-details.component.css'],
  providers: [DatePipe]
})

export class ReceiptVoucherDetailsComponent implements OnInit {
  @ViewChild('autoResizeTextArea') autoResizeTextArea: ElementRef;
  // branches: any;
  // newOne: any;
  receivedCurrencyName = '';
  statusId: string;
  onTextareaInput(event: Event): void {
    const textarea = this.autoResizeTextArea.nativeElement as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  ModifiedOn: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedBy: string = '';
  paymentType: string = 'invoice';
  PaymentVoucherFor = '1';
  divisionList: any = [];
  officeList: any = [];
  currencyList: any = [];
  voucherForList: any = [];
  voucherCustomerList: any = [];
  voucherReceiptList: any = [];
  statusList: any = [];
  securityDepositList: any = [];
  voucherCustomerCodeList: any = [];
  voucherTypeList: any = [];
  paymentDetailsTableList: any = [];
  exchangeTableList: any = [];
  bankListDetails: any = [];
  sameCurrencyBankList: any[];
  searchData: BankFilter = new BankFilter();
  receiptForm: FormGroup;
  thirdPartyList: any = [];
  paymentVoucherType: string = 'Invoice';
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  voucherFileList: any = [];
  payload: any = [];
  autoGenerateCodeList: any[];
  isUpdate: Boolean = false;
  receiptVoucherId: Number = 0;
  showExchangeRate: Boolean = false;
  isEditMode = true;
  isUpdateMode: boolean = true;
  isUpdateMode1: boolean = false;
  isFinalMode: boolean = false;
  isThirdPartyPaymentEnable: boolean = false;
  entityInfo: any;
  currency: any;
  ExchangeRatePairList: any = [];
  pager: any = {};
  pagedItems: any[];
  isShowTDSColumn: boolean = true;
  searchInvoiceNumber: string = "";
  copyPaymentData: any;
  isShowBranch: boolean = false;
  totalAmount: number = 0;
  totalTDSAmount: number = 0;
  totalPaymentAmount: number = 0;
  AmountDifference: number = 0;
  AmountTypeId: any;
  searchedInvoiceIds = [];
  invoiceSearch = '';
  ModuleId: any
  modules: any;
  moduleName = 'RECEIPT VOUCHER'
  mappingSuccess: boolean = false;
  errorMessage: any;
  isReceiptForInvoice = 0;
  IsTDSEnable: boolean = false;
  IsExchangeRateEnable: boolean = false;
  IsExGainEnable: boolean = false;
  IsExLossEnable: boolean = false;
  selectedFile: File = null;
  fileUrl: string;
  statusDisplayValue: string = '';

  isCopied = false;
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromMaxDate = this.currentDate;
  isInvoiceCurrencyDifferent = false
  constructor(
    private ps: PaginationService,
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public commonDataService: CommonService,
    private ms: BankService,
    private router: Router,
    
  private commonservice: CommonService,
    private autoCodeService: AutoCodeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getModuleType();
    // this.checkLedgerMapping();
    this.createReceiptForm();
    this.getNumberRange();
    this.getDivisionList();
    this.getStatus();
    this.getCurrency();

    // this.getBankInfo();

    this.route.params.subscribe(param => {
      if (param.id) {
        this.createReceiptForm();
        this.receiptVoucherId = param.id;
        this.getByIdRotueFunctionality();
        // this.receiptForm.disable();
      } else if (param.copy_id) { // copy functionality
        this.isCopied = true;
        this.copyAndPasteFromOldvoucher(param.copy_id);
      }
      else {
        this.getVoucherList(0, false);
      }
    })

  }

  editValue() {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 499,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.isUpdateMode = true;
            this.isUpdateMode1 = false;
            this.receiptForm.enable();
            this.checkTDSFiled();
            this.enableEdit();
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

  getByIdRotueFunctionality() {
    this.isUpdate = true;
    this.isUpdateMode = true;
    this.isUpdateMode1 = true;
    this.isEditMode = false;
    this.isFinalMode = false;

    this.getReceiptVoucherInfo();
  }

  createReceiptForm() {
    this.receiptForm = this.fb.group({
      ReceiptVoucherId: [this.receiptVoucherId],

      DivisionId: [0],
      OfficeId: [0],
      IsInvoice: [true],
      IsOnAccount: [false],
      IsSecurityDeposit: [false],
      VoucherNumber: [''],
      VoucherDate: [''],
      VoucherTypeId: [1],
      CustomerId: [0],
      CustomerBranch: [0],
      PaymentbythirdParty: [0],
      AmountReceived: [0],
      AmountTypeId: [0],
      AmountTypeName: [''],
      TDSDeducted: [null],
      CustomerTAN: [''],
      DepositTo: [''],
      ModeOfPayment: [0],
      ReferenceNo: [''],
      BankCharges: [''],
      BankChargesTypeId: [0],
      BankChargesTypeName: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      ReceiptRemarks: [''],
      RatePairId: [0],
      Rate: [0],
      TotalAmount: [0],
      IsFinal: [0],
      IsFileUpload: [0],
      paymentDetailsArray: this.fb.array([]),
      LocalAmount: [0],
      StatusId: [1], 
      SDMode: [''],
      IsDelete: [0],
      CurrentExRate: [0],
      TDSAmount: [0],
      ExGain: [0],
      ExLoss: [0],
      ExchangeRate: [1],
      TotalTDSAmount: [0],
      TotalPaymentAmount: [0],
      TotalDebit: [0],
      TotalCredit: [0],
      AmountReceivedCCY: [0]
    })
    if (this.receiptForm.value['IsInvoice'] == true) {
      this.isReceiptForInvoice = 1;
      this.setPaymentVoucherType(1)
    } else if (this.receiptForm.value['IsOnAccount'] == true) {
      this.isReceiptForInvoice = 2;
      this.setPaymentVoucherType(2)
    } else if (this.receiptForm.value['IsSecurityDeposit'] == true) {
      this.isReceiptForInvoice = 3;
      this.setPaymentVoucherType(3)
    }

  
  // Set initial value of StatusId based on your condition
  const statusId = this.receiptForm.get('StatusId').value;
  this.receiptForm.get('StatusId').setValue(statusId == 1 ? 'Draft' : statusId == 2 ? 'Confirmed' : 'Cancelled');

  }
  // Set from reports voucher value of StatusId based on your condition
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
  addNewAddressGroup() {
    const add = this.receiptForm.get('paymentDetailsArray') as FormArray;
    // Push a new group to the current value
    const paymentGroup = this.fb.group({
      Id: [0],
      ReceiptVoucherId: [this.receiptVoucherId ? this.receiptVoucherId : 0],
      CustomerId: [0],
      InvoiceId: [0],
      InvoiceNo: [''],
      InvoiceDate: [''],
      InvoiceAmount: [''],
      CurrencyId: [0],
      CurrencyCode: [''],
      DueAmountActual: [0],
      DueAmount: [''],
      DueDate: [''],
      TDS: [''],
      Payment: [''],
      IsSelect: [false],
      InvoiceAmountCCY: [''],
      DueAmountCCY: [''],
      ExchangeRate: [0],
      IsOpening: [false]
    })
    // Set the updated value back to paymentDetailsArray
    add.push(paymentGroup);
  }

  // copy and page the existing voucher functionality to form
  async copyAndPasteFromOldvoucher(receiptVoucherId_copy) {

    var service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherById`;
    this.dataService.post(service, { Id: receiptVoucherId_copy }).subscribe(async (result: any) => {
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.voucherFileList = [];
        this.ExchangeRatePairList = [];
        let info = result.data.Table[0];
        this.isShowBranch = true;
        await this.getVoucherList(info.CustomerId, false, info.CustomerId, info.PaymentbythirdParty);
        await this.getDivisionBasedOffice(info.OfficeId, info.DivisionId);
        // this.autoCodeGeneration(true, '');
        this.receiptForm.patchValue({
          ReceiptVoucherId: 0,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          IsInvoice: info.IsInvoice == true ? 1 : 0,
          IsOnAccount: info.IsOnAccount == true ? 1 : 0.,
          IsSecurityDeposit: info.IsSecurityDeposit == true ? 1 : 0,
          VoucherNumber: '',
          VoucherDate: info.VoucherDate,
          VoucherTypeId: info.VoucherTypeId,
          CustomerId: info.CustomerId,
          CustomerBranch: info.CustomerBranch,
          PaymentbythirdParty: info.PaymentbythirdParty,
          AmountReceived: info.AmountReceived,

          AmountTypeId: info.AmountTypeId,
          AmountTypeName: info.AmountTypeName,
          TDSDeducted: info.TDSDeducted == true ? 1 : 0,
          CustomerTAN: info.CustomerTAN,
          DepositTo: info.DepositTo,
          ModeOfPayment: info.ModeOfPayment,
          ReferenceNo: info.ReferenceNo,
          BankCharges: info.BankCharges,
          BankChargesTypeId: info.BankChargesTypeId,
          BankChargesTypeName: info.BankChargesTypeName,
          CreatedBy: info.CreatedBy,
          ReceiptRemarks: info.ReceiptRemarks,
          RatePairId: info.RatePairId,
          Rate: info.Rate,
          IsDelete: 0,
          TotalAmount: info.TotalAmount,
          IsFinal: 0,
          LocalAmount: info.LocalAmount,
          StatusId: 1, // set as draft
          SDMode: info.SDMode,
          CurrentExRate: info.CurrentExRate ? info.CurrentExRate : 0
        });
        // this.receiptForm.controls['AmountTypeId'].setValue(info.AmountTypeId)
        this.getOfficeList(info.DivisionId);

        if (info.IsOnAccount) {
          this.paymentVoucherType = 'On account';
          this.paymentType = 'account';
          // this.receiptForm.controls['TDSAmount'].enable();
          this.IsTDSEnable = true;
        }
        else if (info.IsSecurityDeposit) {
          this.paymentVoucherType = 'Security Deposit';
          this.paymentType = 'security';
          // this.receiptForm.controls['TDSAmount'].enable();
          this.IsTDSEnable = true;
        }
        else {
          this.paymentVoucherType = 'Invoice'; this.paymentType = 'invoice'
          // this.receiptForm.controls['TDSAmount'].disable();
          this.IsTDSEnable = false;
          this.getInvoicePaymentList(info.CustomerId);
        }
      }
    })
  }

  getReceiptVoucherInfo() {
    
    var service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherById`;
    this.dataService.post(service, { Id: this.receiptVoucherId }).subscribe(async (result: any) => {
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.voucherFileList = [];
        this.ExchangeRatePairList = [];
        let info = result.data.Table[0];
        await this.getVoucherList(info.CustomerId, false, info.CustomerId, info.PaymentbythirdParty);
        // ! set currency name based on currency id and set in receivedCurrencyName variable
        let toCurrency = this.currencyList.find(x => x.ID == info.AmountTypeId);
        this.receivedCurrencyName = toCurrency.CurrencyCode;
        //  ********

        this.entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
        let currencyCode = this.entityInfo.Currency.split('-');
        const asd = currencyCode[0].trim();

        if (this.receivedCurrencyName == asd) {
          // this.receiptForm.controls['ExchangeRate'].disable();
          // this.receiptForm.controls['ExGain'].disable();
          // this.receiptForm.controls['ExLoss'].disable();
          this.receiptForm.controls['ExchangeRate'].setValue(1);
          this.IsExchangeRateEnable = false;
          this.IsExGainEnable = false;
          this.IsExLossEnable = false;
        } else {
          // this.receiptForm.controls['ExchangeRate'].enable();
          // this.receiptForm.controls['ExGain'].enable();
          // this.receiptForm.controls['ExLoss'].enable();
          this.IsExchangeRateEnable = true;
          this.IsExGainEnable = true;
          this.IsExLossEnable = true;
        }
        await this.getDivisionBasedOffice(info.OfficeId, info.DivisionId);
        this.isShowBranch = true;
        this.ModifiedOn = info.UpdatedDate;
        this.CreatedOn = info.CreatedDate;
        this.CreatedBy = info.CreatedByName;
        this.ModifiedBy = info.UpdatedByName;
        if (info.IsFinal) this.isFinalMode = true;
        this.receiptForm.patchValue({
          ReceiptVoucherId: info.Id,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          IsInvoice: info.IsInvoice == true ? 1 : 0,
          IsOnAccount: info.IsOnAccount == true ? 1 : 0.,
          IsSecurityDeposit: info.IsSecurityDeposit == true ? 1 : 0,
          VoucherNumber: info.VoucherNumber,
          VoucherDate: info.VoucherDate,
          VoucherTypeId: info.VoucherTypeId,
          CustomerId: info.CustomerId,
          CustomerBranch: info.CustomerBranch,
          PaymentbythirdParty: info.PaymentbythirdParty,
          AmountReceived: info.AmountReceived,
          AmountTypeId: info.AmountTypeId,
          AmountTypeName: info.AmountTypeName,
          TDSDeducted: info.TDSDeducted == true ? 1 : 0,
          CustomerTAN: info.CustomerTAN,
          DepositTo: info.DepositTo,
          ModeOfPayment: info.ModeOfPayment,
          ReferenceNo: info.ReferenceNo,
          BankCharges: info.BankCharges,
          BankChargesTypeId: info.BankChargesTypeId,
          BankChargesTypeName: info.BankChargesTypeName,
          CreatedBy: info.CreatedBy,
          ReceiptRemarks: info.ReceiptRemarks,
          RatePairId: info.RatePairId,
          Rate: info.Rate,

          TotalAmount: info.TotalAmount,
          IsFinal: info.IsFinal ? 1 : 0,
          LocalAmount: info.LocalAmount,
          StatusId: info.StatusId ,
          SDMode: info.SDMode,
          IsDelete: info.IsDelete ? info.IsDelete : 0,
          CurrentExRate: info.CurrentExRate ? info.CurrentExRate : 0,
          TDSAmount: info.TDS_Amount,
          ExGain: info.EX_Gain_DR,
          ExLoss: info.EX_Loss_CR,
          ExchangeRate: info.ExchangeRate == 0 ? 1 : info.ExchangeRate
        });
        this.getStatusName(info.StatusId )
        if (info.IsInvoice == true) {
          this.isReceiptForInvoice = 1;
          this.setPaymentVoucherType(1)
        } else if (info.IsOnAccount == true) {
          this.isReceiptForInvoice = 2;
          this.setPaymentVoucherType(2)
        } else if (info.IsSecurityDeposit == true) {
          this.isReceiptForInvoice = 3;
          this.setPaymentVoucherType(3)
        }

        // set exchange rate 
        if (info.CurrentExRate) {
          this.showExchangeRate = true;
        }

        this.totalAmount = info.TotalAmount;
        this.AmountTypeId = info.AmountTypeId

        this.getOfficeList(info.DivisionId);
        this.isShowTDSColumn = false;
        if (info.RatePairId) {
          this.ExchangeRatePairList = [{
            Id: info.RatePairId,
            RatePair: info.RatePairName,
            Rate: info.Rate,
            CurrentExRate: info.CurrentExRate,
          }]
        }
        if (info.PaymentbythirdParty) this.isThirdPartyPaymentEnable = true;
        if (info.IsOnAccount) {
          this.paymentVoucherType = 'On account';
          this.paymentType = 'account';
          // this.receiptForm.controls['TDSAmount'].enable();
          this.IsTDSEnable = true;
        }
        else if (info.IsSecurityDeposit) { this.paymentVoucherType = 'Security Deposit'; this.paymentType = 'security'; this.IsTDSEnable = true; }
        else {
          this.paymentVoucherType = 'Invoice';
          this.paymentType = 'invoice';
          this.createPaymentDetailsPayload(result.data.Table1, info.Rate);
          this.onSelectEvent();
          this.IsTDSEnable = false;
        }
        if (result.data.Table2.length > 0) this.voucherFileList = result.data.Table2;

        this.receiptForm.disable();
        this.summaryAmountCalculation();
      }
    }, error => { console.error(error) });
  }

  getStatusName(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Draft';
      case 2:
        return 'Confirmed';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  enableEdit() {
    if (this.isFinalMode) {
      Swal.fire("Final");
      return
    }
    this.isEditMode = true;
    this.isUpdateMode = false;

  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table.filter(x => x.Active == true);
      }
    }, error => { console.error(error) });
  }

  getCurrency() {
    
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.currencyList = [];
      if (result.length > 0) {
        this.currencyList = result;
        this.entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
        let currencyCode = this.entityInfo.Currency.split('-');
        this.receivedCurrencyName = currencyCode[0].trim();
        let info = this.currencyList.find(x => x.CurrencyCode == this.receivedCurrencyName);
        this.currency = info.ID;

        if (this.receivedCurrencyName == info.CurrencyCode) {
          // this.receiptForm.controls['ExchangeRate'].disable();
          // this.receiptForm.controls['ExGain'].disable();
          // this.receiptForm.controls['ExLoss'].disable();
          this.IsExchangeRateEnable = false;
          this.IsExGainEnable = false;
          this.IsExLossEnable = false;
          this.receiptForm.controls['ExchangeRate'].setValue(1);
        } else {
          // this.receiptForm.controls['ExchangeRate'].enable();
          // this.receiptForm.controls['ExGain'].enable();
          // this.receiptForm.controls['ExLoss'].enable();
          this.IsExchangeRateEnable = true;
          this.IsExGainEnable = true;
          this.IsExLossEnable = true;
        }
        if (!this.isUpdate) {
          this.receiptForm.controls['AmountTypeId'].setValue(this.currency);
          this.receiptForm.controls['BankChargesTypeId'].setValue(this.currency);
        }
      }
    }, error => { console.error(error) });
  }


  editclick() {
    this.showExchangeRate = true;

  }

  getVoucherList(customerCode: Number, isChange, customerId?: any, thirdPartyCustomer?: any) {
    return new Promise((resolve, rejects) => {
      let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
      this.dataService.post(service, { CustomerId: customerCode }).subscribe((result: any) => {
        this.voucherForList = [];
        if (!isChange) this.voucherTypeList = [];
        if (!isChange) this.voucherCustomerList = [];
        this.voucherCustomerCodeList = [];
        this.voucherReceiptList = [];
        this.securityDepositList = [];
        if (result.data.Table.length > 0) { this.voucherForList = result.data.Table; }
        if (result.data.Table1.length > 0 && !isChange) { this.voucherTypeList = result.data.Table1; }
        if (result.data.Table2.length > 0 && !isChange) { this.voucherCustomerList = result.data.Table2; }
        this.voucherCustomerCodeList = result.data.Table3;
        if (result.data.Table3.length > 0 && this.isShowBranch) {
          this.receiptForm.controls['CustomerBranch'].setValue(0);
          if (this.voucherCustomerCodeList.length == 1) {
            const branchCode = this.voucherCustomerCodeList[0].BranchCode;
            this.receiptForm.controls['CustomerBranch'].setValue(branchCode);
            this.getCustomerBranchTAN(branchCode);
          }
        }
        if (result.data.Table4.length > 0) { this.voucherReceiptList = result.data.Table4; }
        if (result.data.Table6.length > 0) { this.securityDepositList = result.data.Table6; }
        if (customerId && thirdPartyCustomer) {
          this.thirdPartyList = this.voucherCustomerList.filter(x => x.CustomerID != customerId);
          this.receiptForm.controls['PaymentbythirdParty'].setValue(thirdPartyCustomer);
        }
        resolve(true)
      }, error => {
        console.error(error);
        resolve(true)
      });
    })
  }

  getCustomerBranchCode(event) {
    this.getVoucherList(event, true);
    this.receiptForm.controls['CustomerBranch'].setValue(0);
    this.receiptForm.controls['CustomerTAN'].setValue('');
    this.receiptForm.controls['TDSDeducted'].setValue(0);
    this.thirdPartyList = [];
    this.thirdPartyList = this.voucherCustomerList.filter(x => x.CustomerID != event);
    this.getInvoicePaymentList(event);
  }
  // getBankInfo() {
  //   this.ms.getbankaccountFilter(this.searchData).subscribe(Bankaccountlist => {voucherCustomerCodeList
  //     this.bankListDetails = [];
  //     this.bankListDetails = Bankaccountlist['data'].Table.filter(x => x.StatusID == 1);
  //   });
  // }

  getCustomerBranchTAN(event) {
    if (event) {
      let info = this.voucherCustomerCodeList.find(x => x.BranchCode == event);
      // this.branches = info.length
      // this.newOne = info[0].BranchCode;
      this.receiptForm.controls['CustomerTAN'].setValue(info.TANNo ? info.TANNo : '');
      if (this.receiptForm.value.CustomerTAN != '') {
        this.receiptForm.controls['TDSDeducted'].setValue(1);
        this.isShowTDSColumn = true;
        // this.receiptForm.controls['TDSAmount'].enable();
        // this.IsTDSEnable = true;
      }
      else {
        this.receiptForm.controls['TDSDeducted'].setValue(0);
        this.isShowTDSColumn = false;
        // this.receiptForm.controls['TDSAmount'].disable();
        // this.IsTDSEnable = false;
      }
    }
  }

  TDSDeductedEvent(event) {
    if (event == 1) {
      if (this.receiptForm.value.CustomerTAN == '') {
        Swal.fire('Update Customer TAN value.');
        this.receiptForm.controls['TDSDeducted'].setValue(0);
        // this.IsTDSEnable = false;
      } else {
        // this.receiptForm.controls['TDSAmount'].enable();
        // this.IsTDSEnable = true;
      }
    } else {
      // this.receiptForm.controls['TDSAmount'].disable();
      // this.IsTDSEnable = false;
    }
  }

  // fileSelected(event) {

  //   if (this.isFinalMode || !this.isEditMode) {
  //     if (!this.isEditMode) Swal.fire('Clik edit to Upload')
  //     return;
  //   }
  //   if (event.target.files.length > 0 && this.voucherFileList.length < 5) {
  //     this.voucherFileList.push({
  //       Id: 0,
  //       ReceiptVoucherId: 0,
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

      this.voucherFileList.push({
        Id: 0,
        ReceiptVoucherId: 0,
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
    this.voucherFileList.splice(index, 1);
  }


  async getModuleType() {
    // 
    let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerDropDownList`;
    this.dataService.post(service, {}).subscribe(async (result: any) => {
      // 
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
    
    let service = `${this.globals.APIURL}/Common/CheckModuleAccess`;
    this.dataService.post(service, { ModuleId: this.ModuleId }).subscribe(async (result: any) => {
      // 
      if (result.data == "Access Granted") {
        this.mappingSuccess = true
      }
      else {
        this.mappingSuccess = false
        this.errorMessage = result.data
        Swal.fire(this.errorMessage)
        return false;
      }
    }, error => {
      console.error(error);
    });
  }

  deleteValue() {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 499,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.saveVoucherInfo(0, true);
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

  async saveVoucherInfo(finalNumber: number, isDelete = false) {
    this.summaryAmountCalculation();

    if (this.AmountDifference != 0) {
      Swal.fire('Amount mismatch')
      return false;
    }

    if (this.mappingSuccess == false) {
      Swal.fire(this.errorMessage)
      return false;
    }
    //  ! finalNumber 0 = save, 1 = final, 2 = cancel
    var validation = "";
    if (this.receiptForm.value.DivisionId == "" || this.receiptForm.value.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (this.receiptForm.value.OfficeId == "" || this.receiptForm.value.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    if (this.receiptForm.value.VoucherTypeId == "" || this.receiptForm.value.VoucherTypeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Receipt Voucher Type.</span></br>"
    }
    if (this.receiptForm.value.CustomerId == "" || this.receiptForm.value.CustomerId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Customer Name.</span></br>"
    }
    if (this.receiptForm.value.CustomerBranch == "" || this.receiptForm.value.CustomerBranch == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Customer Branch.</span></br>"
    }
    // if (this.receiptForm.value.PaymentbythirdParty == "" || this.receiptForm.value.PaymentbythirdParty == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Payment by 3rd Party.</span></br>"
    // }
    if (this.receiptForm.value.AmountReceived == '' || this.receiptForm.value.AmountReceived == null) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Amount Received.</span></br>"
    }
    // if (this.receiptForm.value.AmountTypeId == "" || this.receiptForm.value.AmountTypeId == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Amount Received Currency.</span></br>"
    // }
    if (this.receiptForm.value.TDSDeducted == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select TDS Deducted.</span></br>"
    }
    if (this.receiptForm.value.DepositTo == "" || this.receiptForm.value.DepositTo == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Deposit To.</span></br>"
    }
    if (this.receiptForm.value.ModeOfPayment == "" || this.receiptForm.value.ModeOfPayment == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Mode of Payment.</span></br>"


    }
    if ((this.receiptForm.value.ReferenceNo == "" || this.receiptForm.value.ReferenceNo == null) && this.receiptForm.value.ModeOfPayment != 2) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Reference No.</span></br>"
    }

    if (this.paymentType == 'security' && this.receiptForm.value.SDMode == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Security Deposit.</span></br>"
    }

    if (this.receiptForm.value.VoucherDate == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Receipt Voucher Date.</span></br>"
    }

    

    if (validation != "") {
      if (finalNumber != 2) {
        Swal.fire(validation)
        return false;
      }
    }

    if (this.receiptForm.value.BankCharges == '') {
      this.receiptForm.controls['BankCharges'].setValue(0);
    }

    if (this.paymentVoucherType == 'On account') { this.receiptForm.controls['IsOnAccount'].setValue(1) }
    else if (this.paymentVoucherType == 'Security Deposit') { this.receiptForm.controls['IsSecurityDeposit'].setValue(1) }
    else { this.receiptForm.controls['IsInvoice'].setValue(1) }
    if (this.voucherFileList.length > 0) this.receiptForm.controls['IsFileUpload'].setValue(1);
    if (finalNumber === 1) {
      await this.autoCodeGeneration('Receipt', this.receiptForm.value.OfficeId, this.receiptForm.value.DivisionId)
      this.updateAutoGenerated();
      //  this.receiptForm.controls['IsFinal'].setValue(1); this.receiptForm.controls['StatusId'].setValue(2);
    }

    // await this.createPayload(finalNumber === 1);


    let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit?`;
    let deleteMsg = `Do you want to Delete this Details?`;


    let combinedText: string;

    if (finalNumber === 1) {
      combinedText = finalMsg;
    } else if (finalNumber === 0) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else {
      combinedText = closeMsg;
    }

    // set Delete flag
    if (isDelete && this.isUpdate) {
      // 
      this.receiptForm.controls['IsDelete'].setValue(1);
    }

    //  Its finaled already and candelled
    if (finalNumber == 2 && this.isFinalMode) {
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
        if (finalNumber == 2) {
          this.ViewPage();
          return;
        }
        if (finalNumber == 1) {
          this.receiptForm.controls['IsFinal'].setValue(1); this.receiptForm.controls['StatusId'].setValue('Confirmed');
        }
        await this.createPayload(finalNumber === 1);
        let service = `${this.globals.APIURL}/ReceiptVoucher/SaveReceiptVoucherInfo`;
        // console.log('payload', this.payload);
        // return
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            // 
            Swal.fire(result.data.Message, '', 'success');
            this.isUpdateMode1 = true;
            this.isUpdateMode = false;

            //  save or draft funtion 
            if (finalNumber == 0 && !isDelete) {
              this.receiptForm.controls['ReceiptVoucherId'].setValue(Number(result.data.Id));
              //  this.receiptVoucherId = Number(result.data.Id);
              // this.isUpdateMode1 = true;
              // this.isUpdateMode = false;

              const ReceiptVoucherId = Number(result.data.Id);
              this.editreceipt(ReceiptVoucherId)
              return
            }


            // Final voucher function (update the auto generate code)
            if (this.isUpdate && finalNumber && !this.isFinalMode) {
              this.updateAutoGenerated();
              this.ViewPage();
              return;
            }
            // Delete voucher funcuion
            if (isDelete && this.isUpdate) {
              this.ViewPage();
            }
            // save the voucher in draft mode
            if (this.isUpdate && finalNumber == 0 && !this.isFinalMode) {
              this.ViewPage();
              return
            }
          }



        }, error => {
          console.error(error);
        });
      }
    });
  }


  editreceipt(id: number) {
    this.router.navigate(['/views/transactions/receipt/receipt-details', { id: id },]);
    // this.createReceiptForm();
    // this.getByIdRotueFunctionality();
  }

  ViewPage() {
    this.router.navigate(['/views/transactions/receipt/receipt-view']);
  }

  goBack() {
    // If finaled allow to rediret to list page
    if (this.isFinalMode) {
      this.ViewPage();
      return
    }

    // confirm user before redirect to list page
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      html: `Voucher is not yet finalized <br> Do you want to still exit?`,
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
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Receipt Voucher');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  createPayload(isFinal = false) {
    if (this.paymentVoucherType == 'Invoice') {
      let paymentInfo = this.receiptForm.value.paymentDetailsArray;
      var table1: any = paymentInfo.filter(x => x.IsSelect == true);
      // delete the un-wanted key from the object
      table1.forEach((v) => {
        // set the due amount as same if it is not Final
        if (!isFinal) {
          v.DueAmount = v.DueAmountActual;
        }
        delete v.DueAmountActual;
        delete v.BillDueAmount;
      });
      if (table1.length > 0) for (let data of table1) data.InvoiceDate = new Date(data.InvoiceDate);
    } else { 
      var table1: any = []; 
    }
    let table = this.receiptForm.value;
    table.VoucherDate = table.VoucherDate;
    delete table.paymentDetailsArray;
  
 
         // Set the StatusId based on the current value
  const statusId = this.receiptForm.get('StatusId').value;
    switch (statusId) {
      case 'Draft':
        table.StatusId = 1;
        break;
      case 'Confirmed':
        table.StatusId = 2;
        break;
      case 'Cancelled':
        table.StatusId = 3;
        break;
      default:
        table.StatusId = 1;  // Default to Draft if none matches
    }

 

  
    this.payload = {
      ReceiptVoucher: {
        Table: [table],
        Table1: table1,
        Table2: this.voucherFileList,
      }
    };
  }

  getNumberRange() {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
    this.dataService.post(service, { Id: 0, ObjectId: 0 }).subscribe((result: any) => {
      if (result.message = "Success") {
        this.autoGenerateCodeList = [];
        if (result.data.Table.length > 0) {
          for (let data of result.data.Table) {
            data.EffectiveDate = this.datePipe.transform(data.EffectiveDate, this.entityDateFormat);
          }
          this.autoGenerateCodeList = result.data.Table;
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any, value: any, division: any) {
    return new Promise(async (resolve, rejects) => {
      if (this.isUpdate) {
        if (event) {
          let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Receipt Voucher');
          if (Info.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
            let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
            if (code) this.receiptForm.controls['VoucherNumber'].setValue(code.trim().toUpperCase());
          }
          else {
            Swal.fire('Please create the auto-generation code for Receipt Voucher.')
          }
        }
        else {
          this.receiptForm.controls['VoucherNumber'].setValue('');
        }
        this.getDivisionBasedOffice(value, division);
        resolve(true)
        // }

      }
    })
  }

  getSameCurrencyBank() {
    this.sameCurrencyBankList = this.bankListDetails.filter((bank) => {
      return this.receivedCurrencyName.includes(bank.CurrencyCode);
    })
  }
  clearSameCurrenyBankList() {
    this.sameCurrencyBankList = [];
    this.receiptForm.controls['DepositTo'].setValue('')
  }

  getDivisionBasedOffice(officeId, divisoinId: any) {

    if (officeId && divisoinId) {
      let service = `${this.globals.APIURL}/Common/GetBankByOfficeId`;
      let payload = {
        "OfficeId": officeId,
        "DivisionId": divisoinId
      }
      this.dataService.post(service, payload).subscribe((result: any) => {
        if (result.message = "Success") {
          this.bankListDetails = result.data.Table;
          this.getSameCurrencyBank()
        }
      }, error => {
        console.error(error);
      });
    }
  }

  getStatus() {
    var service = `${this.globals.APIURL}/Common/GetStatusDropDownList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      // console.log(result, 'status result')
      this.statusList = result.data.Table
    }, error => { });
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (this.receiptForm.value.DivisionId && this.receiptForm.value.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.receiptForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.receiptForm.value.DivisionId);
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
        case "FY (5 Char e.g. /2223)": i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '/2223' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (6 Char e.g. FY2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (7 Char e.g. FY22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POFD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        default: break;
      }
    }
    return { sectionA: sectionA, sectionB: sectionB, sectionC: sectionC, sectionD: sectionD };
  }

  paymentByPartyChecked(event) {
    this.receiptForm.controls['PaymentbythirdParty'].setValue(0);
    if (event == 1) { this.isThirdPartyPaymentEnable = true; }
    else {
      this.isThirdPartyPaymentEnable = false;
    }
  }

  amountChangeEvent(event) {
    this.ExchangeRatePairList = [];
    this.receiptForm.controls['RatePairId'].setValue(0);
    this.receiptForm.controls['Rate'].setValue(0);
    // this.receiptForm.controls['CurrentExRate'].setValue(0);

    this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
    this.receiptForm.controls['AmountReceivedCCY'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
    // (this.receiptForm.controls['ExchangeRate'].setValue(Number(1)));


    let fromCurrency = this.currencyList.find(x => x.ID == this.currency);
    let toCurrency = this.currencyList.find(x => x.ID == event);
    this.receivedCurrencyName = toCurrency.CurrencyCode;
    this.getSameCurrencyBank();
    if (this.currency != event) {
      // let service = `${this.globals.APIURL}/Common/GetVoucherExchangeRates`;
      // this.dataService.post(service, { FromCurrency: fromCurrency.CurrencyCode, ToCurrency: toCurrency.CurrencyCode }).subscribe((result: any) => {
      //   if (result.message = "Success" && result.data.Table.length > 0) {
      //     this.ExchangeRatePairList = result.data.Table;
      //     const CurrentExRate = +this.receiptForm.value.CurrentExRate;
      //     this.receiptForm.controls['RatePairId'].setValue(this.ExchangeRatePairList[0].Id);
      //     this.receiptForm.controls['Rate'].setValue(this.ExchangeRatePairList[0].Rate);
      //     // this.receiptForm.controls['CurrentExRate'].setValue(this.receiptForm.value.CurrentExRate);
      //     this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) *
      //       (CurrentExRate ? CurrentExRate : Number(this.ExchangeRatePairList[0].Rate)));
      //     // this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) * Number(this.receiptForm.value.CurrentExRate));
      //   }
      //   else {
      //     this.receiptForm.controls['LocalAmount'].setValue(0);
      //   }
      //   if (this.receiptForm.value.CustomerId) {
      //     this.getInvoicePaymentList(this.receiptForm.value.CustomerId);
      //   }
      // }, error => {
      //   console.error(error);
      // });

      this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
      this.receiptForm.controls['AmountReceivedCCY'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
      // this.receiptForm.controls['ExchangeRate'].enable();
      // this.receiptForm.controls['ExGain'].enable();
      // this.receiptForm.controls['ExLoss'].enable();
      this.IsExchangeRateEnable = true;
      this.IsExGainEnable = true;
      this.IsExLossEnable = true;
      this.receiptForm.controls['ExchangeRate'].setValue(1);
      this.receiptForm.controls['ExGain'].setValue(0);
      this.receiptForm.controls['ExLoss'].setValue(0);
    } else {
      this.ExchangeRatePairList = [];
      if (this.receiptForm.value.CustomerId) {
        this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) * 1);
        this.receiptForm.controls['AmountReceivedCCY'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
        // this.receiptForm.controls['ExchangeRate'].disable();
        // this.receiptForm.controls['ExLoss'].disable();
        // this.receiptForm.controls['ExGain'].disable();
        this.getInvoicePaymentList(this.receiptForm.value.CustomerId);
      }
      this.IsExchangeRateEnable = false;
      this.IsExGainEnable = false;
      this.IsExLossEnable = false;
      this.receiptForm.controls['ExchangeRate'].setValue(1);
      this.receiptForm.controls['ExGain'].setValue(0);
      this.receiptForm.controls['ExLoss'].setValue(0);
    }

    this.summaryAmountCalculation();
  }

  getExchangeRate(fromCurrencyCode, toCurrencyCode) {
    // return new Promise((resolve, reject) => {
    //   let service = `${this.globals.APIURL}/Common/GetVoucherExchangeRates`;
    //   this.dataService.post(service, { FromCurrency: fromCurrencyCode, ToCurrency: toCurrencyCode }).subscribe((result: any) => {
    //     if (result.message = "Success" && result.data.Table.length > 0) {
    //       this.ExchangeRatePairList = result.data.Table;
    //       const CurrentExRate = +this.receiptForm.value.CurrentExRate;
    //       this.receiptForm.controls['RatePairId'].setValue(this.ExchangeRatePairList[0].Id);
    //       this.receiptForm.controls['Rate'].setValue(this.ExchangeRatePairList[0].Rate);
    //       this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) *
    //         (CurrentExRate ? CurrentExRate : Number(this.ExchangeRatePairList[0].Rate)));
    //       resolve(true);
    //     }
    //   });
    // })
    // this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) *
    //         (CurrentExRate ? CurrentExRate : Number(this.ExchangeRatePairList[0].Rate)));
  }

  amountChange(event) {
    this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) * Number(this.receiptForm.value.ExchangeRate));
    this.receiptForm.controls['AmountReceivedCCY'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
  }


  CurrentExRate() {
    if (!this.receiptForm.value.CurrentExRate) {
      return
    }
    this.receiptForm.controls['LocalAmount'].setValue(Number(this.receiptForm.value.AmountReceived) * Number(this.receiptForm.value.ExchangeRate));
    this.receiptForm.controls['AmountReceivedCCY'].setValue(Number(this.receiptForm.value.AmountReceived) * this.receiptForm.value.ExchangeRate);
  }

  getOfficeList(id: number) {
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    })
  }

  getInvoicePaymentList(customerId: number) {
    let service = `${this.globals.APIURL}/ReceiptVoucher/ReceiptVoucherDuePaymentList`;
    this.dataService.post(service, { CustomerId: customerId }).subscribe(async (result: any) => {

      this.clearFormArray();
      if (result.message = "Success" && result.data.Table.length > 0) {
        let entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
        const entityCurrencyCode = entityInfo['Currency'].split('-')[0].replace(' ', '');
        // console.log('Currency', entityCurrencyCode);
        const isDiffCurrencyInvoice = result.data.Table.find((x) => x.CurrencyCode != entityCurrencyCode)
        // console.log('isDiffCurrencyInvoice', isDiffCurrencyInvoice)
        if (isDiffCurrencyInvoice) {
          // await this.getExchangeRate(entityCurrencyCode, isDiffCurrencyInvoice.CurrencyCode);
          this.isInvoiceCurrencyDifferent = true;
        } else {
          // if (this.currency == this.receiptForm.value.AmountTypeId) {
          this.ExchangeRatePairList = []; // Clear the exchange rate pair list
          // }
          this.isInvoiceCurrencyDifferent = false;
        }
        this.createPaymentDetailsPayload(result.data.Table);
        this.onSelectEvent();
      }
    }, error => {
      console.error(error);
    });
  }

  clearFormArray(): void {
    const items1 = this.receiptForm.get('paymentDetailsArray') as FormArray;
    items1.clear();
  }

  createPaymentDetailsPayload(info, exchangeRate = 0) {
    
    this.paymentDetailsTableList = [];
    for (let data of info) {
      // const exchangeRate = this.ExchangeRatePairList.length ? +this.ExchangeRatePairList[0].Rate : 0
      this.addNewAddressGroup();
      // const newDue = dueAmount - (data.TDS + data.Payment);
      const invoceObj = {
        Id: data.Id ? data.Id : 0,
        ReceiptVoucherId: this.receiptVoucherId ? this.receiptVoucherId : 0,
        CustomerId: data.CustomerId,
        InvoiceId: data.InvoiceId,
        InvoiceNo: data.InvoiceNumber,
        InvoiceDate: this.datePipe.transform(new Date(data.InvoiceDate), 'y-MM-dd'),
        InvoiceAmount: Number(data.InvoiceAmount).toFixed(this.entityFraction),
        InvoiceAmountCCY: data.InvoiceAmountCCY ? +data.InvoiceAmountCCY : '0',
        CurrencyId: data.CurrencyId,
        CurrencyCode: data.CurrencyCode,
        DueAmountActual: data.DueAmount ? +data.DueAmount : +data.InvoiceAmount,
        // DueAmount: data.DueAmount ? data.DueAmount : data.InvoiceAmount,
        DueAmount: '0',
        DueAmountCCY: data.DueAmountCCY ? +data.DueAmountCCY : '0',
        DueDate: data.DueDate,
        TDS: data.TDS ? data.TDS : 0,
        Payment: data.Payment ? +data.Payment : 0,
        IsSelect: data.IsSelect ? data.IsSelect : false,
        ExchangeRate: data.ExchangeRate,
        IsOpening: data.IsOpening
      }

      // invoceObj.InvoiceAmountCCY =  invoceObj.InvoiceAmount * (this.ExchangeRatePairList.length ? +this.ExchangeRatePairList[0].Rate : 0);
      // invoceObj.DueAmountCCY =  (+invoceObj.TDS + +invoceObj.Payment) * (this.ExchangeRatePairList.length ? +this.ExchangeRatePairList[0].Rate : 0);


      // if (this.isFinalMode) {
      //   invoceObj.DueAmount = data.DueAmount;
      // } else {
      //   // const exchangeRate = this.ExchangeRatePairList.length ? +this.ExchangeRatePairList[0].Rate : 0
      //   invoceObj.InvoiceAmountCCY =  invoceObj.InvoiceAmount * exchangeRate
      //   // ! when it is new Invoice then DueAmountCCY is calculated based on exchange rate * 
      //   if(invoceObj.TDS == 0 && invoceObj.Payment == 0){
      //     invoceObj.DueAmountCCY = data.DueAmountCCY ? +data.DueAmountCCY : (+data.InvoiceAmount * exchangeRate);
      //   } else {
      //     invoceObj.DueAmountCCY =  (+invoceObj.TDS + +invoceObj.Payment) * exchangeRate
      //   }
      if (this.isFinalMode) {
        invoceObj.DueAmount = Number(data.DueAmount).toFixed(this.entityFraction);
      } else {
        // const exchangeRate = this.ExchangeRatePairList.length ? +this.ExchangeRatePairList[0].Rate : 0
        invoceObj.InvoiceAmountCCY = Number(invoceObj.InvoiceAmount) * (data.ExchangeRate ? data.ExchangeRate : 1);
        invoceObj.InvoiceAmountCCY = invoceObj.InvoiceAmountCCY.toFixed(this.entityFraction)
        // invoceObj.InvoiceAmountCCY = (Number(invoceObj.InvoiceAmount) * data.ExchangeRate).toFixed(entityFraction);

        // ! when it is new Invoice then DueAmountCCY is calculated based on exchange rate * 
        if (invoceObj.TDS == 0 && invoceObj.Payment == 0) {
          invoceObj.DueAmountCCY = data.DueAmountCCY ? +data.DueAmountCCY : (+data.DueAmount * (data.ExchangeRate ? data.ExchangeRate : 1));
          invoceObj.DueAmountCCY = invoceObj.DueAmountCCY.toFixed(this.entityFraction)
        } else {
          // invoceObj.DueAmountCCY =  (+invoceObj.TDS + +invoceObj.Payment) * exchangeRate
        }

        const dueAmount = data.DueAmount ? data.DueAmount : data.InvoiceAmount;
        const newDue = dueAmount - (+invoceObj.TDS + +invoceObj.Payment);
        if (newDue < 0) {
          invoceObj.DueAmount = dueAmount.toFixed(this.entityFraction);
          invoceObj.TDS = 0;
          invoceObj.Payment = 0;
        } else {
          invoceObj.DueAmount = newDue.toFixed(this.entityFraction);
        }
      }

      this.paymentDetailsTableList.push(invoceObj)
    }
    this.receiptForm.patchValue({ paymentDetailsArray: this.paymentDetailsTableList });
  }

  get myArray(): FormArray {
    return this.receiptForm.get('paymentDetailsArray') as FormArray;
  }

  // * Below function not using now insted of using this function getDueAmount()

  // tdsChangeEvent(event, index, type) {
  //   const controlAtIndex = this.myArray.at(index);
  //   if (type == 'TDS') {
  //     if (controlAtIndex.value.Payment) {
  //       let dueAmount = (controlAtIndex.value.InvoiceAmount - event) - (controlAtIndex.value.Payment ? controlAtIndex.value.Payment : 0);
  //       if (dueAmount >= 0) { controlAtIndex.patchValue({ DueAmount: dueAmount }); }
  //       else {
  //         controlAtIndex.patchValue({ TDS: 0 });
  //         let dueAmount = (controlAtIndex.value.InvoiceAmount - controlAtIndex.value.TDS) - (controlAtIndex.value.Payment ? controlAtIndex.value.Payment : 0);
  //         controlAtIndex.patchValue({ DueAmount: dueAmount });
  //         Swal.fire('Your amount has exceeded the limit!');
  //       }
  //     }
  //     else {
  //       let dueAmount = controlAtIndex.value.InvoiceAmount - event;
  //       if (dueAmount >= 0) { controlAtIndex.patchValue({ DueAmount: dueAmount }); }
  //       else {
  //         Swal.fire('Your amount has exceeded the limit!');
  //         controlAtIndex.patchValue({ TDS: 0 });
  //         let dueAmount = controlAtIndex.value.InvoiceAmount - controlAtIndex.value.TDS;
  //         controlAtIndex.patchValue({ DueAmount: dueAmount });
  //       }
  //     }
  //   }
  //   else if (type == 'Payment') {
  //     let dueAmount = controlAtIndex.value.InvoiceAmount - (controlAtIndex.value.TDS ? controlAtIndex.value.TDS : 0) - event;
  //     if (dueAmount >= 0) { controlAtIndex.patchValue({ DueAmount: dueAmount }); }
  //     else {
  //       Swal.fire('Your amount has exceeded the limit!');
  //       controlAtIndex.patchValue({ Payment: 0 });
  //       let dueAmount = controlAtIndex.value.InvoiceAmount - (controlAtIndex.value.TDS ? controlAtIndex.value.TDS : 0) - controlAtIndex.value.Payment;
  //       controlAtIndex.patchValue({ DueAmount: dueAmount });
  //     }
  //   }
  //   this.onSelectEvent();
  // }


  getDueAmount(index, type) {
    const controlAtIndex = this.myArray.at(index);
    !controlAtIndex.value.TDS ? controlAtIndex.value.TDS = 0 : '';
    !controlAtIndex.value.Payment ? controlAtIndex.value.Payment = 0 : '';
    let currentRow = this.myArray.at(index);
    const totalPayment = +controlAtIndex.value.TDS + +controlAtIndex.value.Payment
    // ! check total payment(tds + payment) is greater then actual due amount 
    if (totalPayment > currentRow.value.DueAmountActual) {
      type == 'tds' ? controlAtIndex.value.TDS = currentRow.value.DueAmountActual - currentRow.value.Payment : '';
      type == 'payment' ? controlAtIndex.value.Payment = currentRow.value.DueAmountActual - currentRow.value.TDS : '';
      currentRow = controlAtIndex.value; // 
      Swal.fire(`${type} amount has exceeded the due amount limit!`);
      controlAtIndex.value.DueAmount = +currentRow.value.DueAmountActual - (+currentRow.value.TDS + +currentRow.value.Payment)

    } else {
      // controlAtIndex.value.DueAmount = +dueAmount - (+tds + +payment);
      controlAtIndex.value.DueAmount = +currentRow.value.DueAmountActual - (+controlAtIndex.value.TDS + +controlAtIndex.value.Payment)
    }
    // const exchangeRate = this.ExchangeRatePairList[0] ? +this.ExchangeRatePairList[0].Rate : 0
    controlAtIndex.value.DueAmountCCY = (controlAtIndex.value.ExchangeRate * controlAtIndex.value.DueAmount).toFixed(this.entityFraction);
    // this.calculateFinalTotal();
    // console.log('paymentDetailsTableList edit tds and pay', this.paymentDetailsTableList)
  }

  //  set payment Amount as due Amount when checked;
  setInitalPaymentAmount(checkedIndex) {
    
    const controlAtIndex = this.myArray.at(checkedIndex);
    controlAtIndex.value.IsSelect = controlAtIndex.value.IsSelect == true ? false : true;
    if (!controlAtIndex.value.Payment && controlAtIndex.value.IsSelect) {
      controlAtIndex.value.Payment = controlAtIndex.value.DueAmount;
      this.getDueAmount(checkedIndex, 'payment');
    } else {
      if (controlAtIndex.value.Payment) {
        controlAtIndex.value.DueAmount = controlAtIndex.value.DueAmountActual.toFixed(this.entityFraction);
        controlAtIndex.value.DueAmountCCY = (controlAtIndex.value.DueAmount * controlAtIndex.value.ExchangeRate).toFixed(this.entityFraction);
        controlAtIndex.value.Payment = 0;
        controlAtIndex.value.TDS = 0;
      }
    }
  }

  onSelectEvent() {
    
    if (this.receiptForm.value.paymentDetailsArray.length > 0) {
      let info = this.receiptForm.value.paymentDetailsArray.filter(x => x.IsSelect == true);
      var totalAmount = 0;
      var totalTDSAmount = 0;
      var totalPaymentAmount = 0;
      if (info.length > 0) {

        info.forEach(element => {
          totalAmount += Number(Number(element.Payment) * Number(!element.ExchangeRate ? 1 : element.ExchangeRate));
          totalTDSAmount += (Number(element.TDS) * Number(!element.ExchangeRate ? 1 : element.ExchangeRate)),
            // totalPaymentAmount += (Number(element.Payment) * Number(element.ExchangeRate))
            totalPaymentAmount += (Number(element.TDS) * Number(!element.ExchangeRate ? 1 : element.ExchangeRate)) + (Number(element.Payment) * Number(!element.ExchangeRate ? 1 : element.ExchangeRate));
        });
      }
      
      this.receiptForm.controls['TotalTDSAmount'].patchValue(totalTDSAmount.toFixed(this.entityFraction));
      this.receiptForm.controls['TotalPaymentAmount'].patchValue(totalPaymentAmount.toFixed(this.entityFraction));
      this.totalAmount = Number(totalAmount.toFixed(this.entityFraction));
    }
    // this.summaryAmountCalculation();
  }

  invoiceNumberSearch(event) {
    if (event) {
      this.searchInvoiceNumber = event;
    }
    else this.searchInvoiceNumber = '';
  }

  searchInvoiceNumberInfo() {
    this.copyPaymentData = this.receiptForm.value.paymentDetailsArray;
    if (this.searchInvoiceNumber && this.copyPaymentData.length > 0) {
      let filterInfo = this.copyPaymentData.filter(x => x.InvoiceNo.includes(this.searchInvoiceNumber));
      this.receiptForm.patchValue({ paymentDetailsArray: filterInfo });

      filterInfo.map(x => {
        x.IsSelect = true;
      })
      let filterInfo1 = this.copyPaymentData.filter(x => !x.InvoiceNo.includes(this.searchInvoiceNumber));
      filterInfo1.sort((a, b) => (a.IsSelect === b.IsSelect) ? 0 : a.IsSelect ? -1 : 1);
    }
    this.receiptForm.patchValue({ paymentDetailsArray: this.copyPaymentData });
  }

  //Enter Method for search Invoice 
  onInputKeyUp(event: KeyboardEvent) {

    this.searchInvoiceNumberInfo();
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
      this.onSelectEvent();
    }
  }

  clearInvoices() {
    this.searchedInvoiceIds = [];
    this.invoiceSearch = '';
  }

  searchInvoices(byClick) {
    if (!this.searchedInvoiceIds.length && !byClick) {
      return
    }
    const filteredInvoice = [];
    const paymentDetailsArray = this.receiptForm.value.paymentDetailsArray
    this.searchedInvoiceIds.forEach((Invoice) => {
      // InvoiceNumber

      const index = paymentDetailsArray.findIndex((invoice) => { return invoice.InvoiceNo === Invoice })
      if (index >= 0) {
        let selectedInvoice = paymentDetailsArray.splice(index, 1);
        if (selectedInvoice && !selectedInvoice[0].IsSelect) {
          selectedInvoice[0]['Payment'] = selectedInvoice[0].DueAmount;
          selectedInvoice[0]['DueAmount'] = 0;
          selectedInvoice[0]['IsSelect'] = true;
        }
        filteredInvoice.push(...selectedInvoice);
      }
    })
    let newPaymentDetailsTableList = [];
    newPaymentDetailsTableList = paymentDetailsArray;

    this.paymentDetailsTableList = [];
    this.paymentDetailsTableList = [...filteredInvoice, ...newPaymentDetailsTableList];
    this.receiptForm.patchValue({ paymentDetailsArray: this.paymentDetailsTableList });
    this.onSelectEvent();
  }

  checkTDSFiled() {
    if (this.receiptForm.value.TDSDeducted == 1) {
      this.isShowTDSColumn = true;
    }
    else {
      this.isShowTDSColumn = false;
    }
  }

  // getIsChecked(i) {
  // 
  //   const paymentDetailsArray = this.receiptForm.controls.paymentDetailsArray.value
  //   console.log(paymentDetailsArray,'sort')
  //   paymentDetailsArray.sort((a, b) => a.booleanControl < b.booleanControl)
  //   this.receiptForm.controls.paymentDetailsArray.patchValue(paymentDetailsArray)
  //   if(i != undefined){
  //     const paymentDetailsArray = this.receiptForm.get('paymentDetailsArray') as FormArray;
  //     const rowControl = paymentDetailsArray.at(i) as FormGroup;
  //     return  rowControl.get('IsSelect').value;

  //   }
  //}

  getIsChecked(i) {
    const paymentDetailsArray = this.receiptForm.controls.paymentDetailsArray.value;
    // Sort the paymentDetailsArray based on the IsSelect boolean value (true comes first).
    paymentDetailsArray.sort((a, b) => {
      if (a.IsSelect && !b.IsSelect) {
        return -1; // a comes first
      } else if (!a.IsSelect && b.IsSelect) {
        return 1; // b comes first
      } else {
        return 0; // no change in order
      }
    });
    paymentDetailsArray.forEach(a => {

      const inputData = +a.Payment;
      const enteredDecimalCount = inputData % 1 !== 0 ? inputData.toString().split('.')[1]?.length || 0 : 0;
      if (enteredDecimalCount > this.entityFraction) {
        const fixedDecimal = inputData.toFixed(this.entityFraction);
        a.Payment = fixedDecimal;
      }

      const inputData1 = +a.TDS;
      const enteredDecimalCount1 = inputData1 % 1 !== 0 ? inputData1.toString().split('.')[1]?.length || 0 : 0;
      if (enteredDecimalCount1 > this.entityFraction) {
        const fixedDecimal1 = inputData1.toFixed(this.entityFraction);
        a.TDS = fixedDecimal1
      }
    });

    // Update the FormArray with the sorted values.
    this.receiptForm.controls.paymentDetailsArray.patchValue(paymentDetailsArray);
    if (i !== undefined) {
      const paymentDetailsArray = this.receiptForm.get('paymentDetailsArray') as FormArray;
      const rowControl = paymentDetailsArray.at(i) as FormGroup;
      return rowControl.get('IsSelect').value;
    }
  }

  setPaymentVoucherType(isInvoice = 0) {
    
    if (isInvoice == 1) {
      this.paymentType = 'invoice';
      this.paymentVoucherType = 'Invoice';
      this.receiptForm.controls['IsInvoice'].setValue(true);
      this.receiptForm.controls['IsOnAccount'].setValue(false);
      this.receiptForm.controls['IsSecurityDeposit'].setValue(false);
      // this.receiptForm.controls['TDSAmount'].setValue(0);
      this.IsTDSEnable = false;
    } else if (isInvoice == 2) {
      this.receiptForm.controls['IsInvoice'].setValue(false);
      this.receiptForm.controls['IsOnAccount'].setValue(true);
      this.receiptForm.controls['IsSecurityDeposit'].setValue(false);
      // this.receiptForm.controls['TDSAmount'].setValue(0);

      this.receiptForm.controls['TotalPaymentAmount'].setValue(0);
      // this.receiptForm.controls['TotalTDSAmount'].setValue(0);

      this.IsTDSEnable = true;
      this.paymentType = 'account';
      this.paymentVoucherType = 'On account'
    } else if (isInvoice == 3) {
      this.receiptForm.controls['IsInvoice'].setValue(false);
      this.receiptForm.controls['IsOnAccount'].setValue(false);
      this.receiptForm.controls['IsSecurityDeposit'].setValue(true);
      // this.receiptForm.controls['TDSAmount'].setValue(0);
      this.IsTDSEnable = true;
      this.paymentType = 'security';
      this.paymentVoucherType = 'Security Deposit'
      this.receiptForm.controls['TotalPaymentAmount'].setValue(0);
      this.receiptForm.controls['TotalTDSAmount'].setValue(0);
    }

    this.summaryAmountCalculation();
  }

  summaryAmountCalculation() {
    
    var TotalDebit = 0;
    var TotalCredit = 0;
    var TotalTDS = 0;

    if (this.receiptForm.value.IsInvoice) {
      // this.onSelectEvent();
      
      TotalTDS = this.receiptForm.value.TotalTDSAmount

      TotalCredit = Number((!this.receiptForm.value.TotalPaymentAmount ? 0 :
        Number(this.receiptForm.value.TotalPaymentAmount)) + Number(this.receiptForm.value.ExLoss)) + (this.receiptForm.value.BankCharges * (!this.receiptForm.value.ExchangeRate ? 0 : this.receiptForm.value.ExchangeRate));
    } else {
       TotalTDS = Number(this.receiptForm.value.TDSAmount);

      TotalCredit = Number((this.receiptForm.value.AmountReceived * (!this.receiptForm.value.ExchangeRate ? 0 : this.receiptForm.value.ExchangeRate))
        + Number(TotalTDS) + Number(this.receiptForm.value.ExLoss)) + (this.receiptForm.value.BankCharges * (!this.receiptForm.value.ExchangeRate ? 0 : this.receiptForm.value.ExchangeRate));
    }

    TotalDebit = Number((this.receiptForm.value.AmountReceived * (!this.receiptForm.value.ExchangeRate ? 0 : this.receiptForm.value.ExchangeRate))
      + Number(TotalTDS) + (this.receiptForm.value.BankCharges * (!this.receiptForm.value.ExchangeRate ? 0 : this.receiptForm.value.ExchangeRate))
      + Number(this.receiptForm.value.ExGain));

    this.receiptForm.controls['TotalDebit'].setValue(TotalDebit.toFixed(this.entityFraction));
    this.receiptForm.controls['TotalCredit'].setValue(TotalCredit.toFixed(this.entityFraction));

    this.AmountDifference = this.receiptForm.value.TotalDebit - this.receiptForm.value.TotalCredit
  }

}