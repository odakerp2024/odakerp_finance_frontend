import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency, CurrencySearch, Ledger, LedgerSearch } from 'src/app/model/bankaccount';
import { BankService } from 'src/app/services/bank.service';
import Swal from 'sweetalert2';
import { BankaccountModel, BankDetails } from '../../../../model/Bankmodel';
import { Attachment, Bank, Cheque, Statement } from '../../../../model/Createbankaccount';
import { Globals } from 'src/app/globals';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { MatOption, MatSelect } from '@angular/material';

declare let $: any;
@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css'],
  providers: [DatePipe]
})
export class BankAccountComponent implements OnInit {

  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelected1') private allSelected1: MatOption;
  // @ViewChild('select') select: MatSelect;

  FinancialForm: FormGroup;
  basicbankDetails: Bank = new Bank();
  basicChequeDetails: Cheque = new Cheque();
  basicAttachmentDetails: Attachment = new Attachment();
  basicStaementDetails: Statement = new Statement();
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  BankaccountModel: BankaccountModel = new BankaccountModel();
  bankaccountDetailsSave: BankDetails = new BankDetails();
  BankChequeID: any;
  cheque: Cheque[] = [];
  editbankId: Number = 0;
  countryList: any = [];
  DateOfStart: any;
  BookName: String;
  emailAlerts: any;
  bookName: String;

  Chequename: Cheque[] = [];
  Statement: Statement[] = [];
  StatementData = [];
  Attachment: Attachment[] = [];
  FromNumber: Number;
  ToNumber: Number;
  TotalCheques: Number;
  IsChequePrinting: any;
  editchequeId: Number = 0;
  isBankaccount: boolean = false;
  AccTypecurrency: Currency[];
  CurrencyLook: CurrencySearch;
  AccTypeledger: Ledger[];
  LedgerLook: LedgerSearch;
  FieldsName: any;
  DisplayName: any;
  statusvalues = [{ value: 1, viewValue: 'Yes' }, { value: 0, viewValue: 'No' },];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  isUpdate: boolean = false;
  isCreate: boolean = true;
  isUpdateEnable: boolean = false;

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  checkMangementForm: FormGroup;
  statementForm: FormGroup;
  editSeletedIdex: any;
  isEditMode = false;
  templateDropdown: any;
  editStatementSelectedIndex: any = '';
  isStatementEdit = false;
  documentListInfo: any = [];
  documentInfo = [];
  autoGenerateCodeList: any[];
  officeList: any[];
  divisionList: any[];
  divisionListDataName: any = [];
  nameData: any = [];
  divisionIdData: any = [];
  allValues: boolean;
  allOffice: boolean;
  perOne: boolean;

  selectedCheckboxes: any[] = [];
  bankId: any;
  // allSelected=false;
  ModuleId: any
  modules: any;
  moduleName = 'Banking Setup'
  mappingSuccess: boolean = false;
  errorMessage: any;
  parentAccountList: any[];


  constructor(
    private router: Router, private route: ActivatedRoute, private service: BankService, private fb: FormBuilder,
    private globals: Globals, private dataService: DataService, private autoCodeService: AutoCodeService, private datePipe: DatePipe,
    private commonDataService: CommonService
  ) {
    this.getNumberRange();
    this.route.queryParams.subscribe(params => {
      this.FinancialForm = this.fb.group({
        ID: params['id']
      });
      this.bankId = params['id'] ? params['id'] : 0;
    });
    this.getTemplateName();
    // this.getOffice();
    this.getDivision(true);
  }

  ngOnInit(): void {
    // this.getModuleType(); //------ ledger maping validate conditions are removed due to mapped account in banking itself --08-03-2024
    $('.my-select').select2();
    // * get the office list when division click
    $('#division').on('change', (data) => {

      this.getOffice(data.target.value);

    });

    this.createForm();
    this.getCountryList();

    this.OnBindDropdownCurrency();
    // this.OnBindDropdownLedger();
    //console.log( this.route.snapshot.params['id'])



    if (this.route.snapshot.params['id'] && this.route.snapshot.params['id'] > 0) {
      this.editchequeId = this.route.snapshot.params['id'];
      this.editbankId = this.route.snapshot.params['id'];
      this.getBankaccountDetails(this.editchequeId);
      this.isCreate = false;
      this.isUpdate = true;
      this.FinancialForm.disable();
    } else {
      this.isUpdateEnable = true;
      // var saveObj = { "BankChequeID": 0, "BankID": this.editbankId, "IsChequePrinting": false, "DateOfStart": null, "BookName": null, "FromNumber": 0, "ToNumber": 0, "TotalCheques": 0 }
      // this.Chequename.push(saveObj);
      // this.getStatementList();
      /*var saveObjs = {"BankStatementID":0,"BankID":0,"ID":0,"FieldsName":null,"OrderNo":0,"DisplayName":null}
      this.Statement.push(saveObjs);*/

    }
    this.createCheckManagementForm();
    this.createStatementForm();
  }

  getDivisionName(division_id) {
    if (division_id && this.divisionList.length) {
      const category = this.divisionList.find((d) => d.ID == division_id)
      return category ? category.DivisionName.toUpperCase() : '';

    }

  }

  getOfficeName(office_id) {
    if (office_id && this.officeList.length) {
      const category = this.officeList.find((d) => d.ID == office_id)
      return category ? category.OfficeName.toUpperCase() : '';
    }

  }

  divisionSelectOne(event: any) {
    debugger
    this.allValues = false
    this.allOffice = false
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }

    if (this.FinancialForm.controls.DivisionIds.value.length == this.nameData.length) {
      this.allSelected.select();
      this.allValues = true;
    }
    this.getOffice(this.FinancialForm.controls.DivisionIds.value)
  }

  divisionSelectAll() {
    debugger
    if (this.allSelected.selected) {
      this.allValues = true
      this.FinancialForm.controls.DivisionIds.patchValue([...this.divisionList.map(item => item.ID), 0]);
    }
    else {
      this.FinancialForm.controls.DivisionIds.patchValue([]);
      this.allValues = false
      this.allOffice = false
      this.officeList = []

    }
    this.getOffice(this.FinancialForm.controls.DivisionIds.value)
  }

  OffieceSelectOne(event: any) {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      this.allOffice = false;
      return false;
    }
    if (this.FinancialForm.controls.OfficeIds.value.length == this.officeList.length) {
      this.allSelected1.select();
      this.allOffice = true;
    }
  }

  OffieceSelectAll() {
    if (this.allSelected1.selected) {
      this.allOffice = true
      this.FinancialForm.controls.OfficeIds.patchValue([...this.officeList.map(item => item.ID), 0]);
    } else {
      this.allOffice = false
      this.FinancialForm.controls.OfficeIds.patchValue([]);
    }
  }
  getStatementList() {
    let temp = { "BankId": -1 };
    this.service.getBankaccountDetails(temp).subscribe(response => {
      if (response['data'].Table3.length > 0) {
        this.StatementData = [];

        this.StatementData = response['data'].Table3;
        this.StatementData.forEach((element) => {
          if (element.BankID == null) { element.BankID = 0 }
          if (element.BankStatementID == null) { element.BankStatementID = 0 }
        })

      }
    });
  }

  getTemplateName() {
    const payload = { "Id": 0, "TemplateNo": "", "TemplateName": "", "CategoryId": "", "Active": 1 }
    this.service.getTemplateDetails(payload).subscribe((details: any) => {
      // console.log('GetBankTemplateList', details);
      this.templateDropdown = details.data.Table;
    });
  }
  //  disable the dropdown
  disableDropdownInUpdateView() {
    $('#ddlOffice').prop('disabled', true);
    $('#ddlCountry').prop('disabled', true);
  }

  createStatementForm() {
    this.statementForm = this.fb.group({
      BankStatementID: [0],
      BankID: this.editbankId,
      // ID: [0],
      FieldsName: [0],
      OrderNo: [0],
      DisplayName: [''],
      TemplateId: [0],
      EffectiveDate: ['']
    });
  }

  clearStatementForm() {
    this.statementForm.reset();
  }

  OnClickAddStatement(statementForm) {
    let validation = '';

    if (!this.statementForm.value.TemplateId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter Template Name</span></br>';
    }

    if (!this.statementForm.value.EffectiveDate) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter Effective Date</span></br>';
    }

    if (validation !== '') {
      Swal.fire(validation);
      return false;
    }
    // ! Edit Mode
    if (this.isStatementEdit) {
      if (this.statementForm.value.TemplateId) {
        this.statementForm.value.TemplateId = +this.statementForm.value.TemplateId;
      }
      this.StatementData[this.editStatementSelectedIndex] = this.statementForm.value;
      // this.StatementData = this.statementForm.value;

      this.isStatementEdit = !this.isStatementEdit;
      this.clearStatementForm();
      return;
    } else { // ! add mode
      this.StatementData.push(this.statementForm.value);
      this.clearStatementForm();
    }

  }


  OnClickRadioStatement(index) {
    this.editStatementSelectedIndex = index;
  }

  editStatementForm() {
    this.isStatementEdit = true;
    let editRow = this.StatementData[this.editStatementSelectedIndex];
    this.patchStatementForm(editRow);
  }

  patchStatementForm(editRow) {
    this.statementForm.patchValue({
      BankStatementID: editRow.BankStatementID,
      BankID: this.editbankId,
      FieldsName: editRow.FieldsName,
      OrderNo: editRow.OrderNo,
      DisplayName: editRow.DisplayName,
      TemplateId: editRow.TemplateId,
      EffectiveDate: editRow.EffectiveDate,
    });
  }

  convertToDateString(date) {
    if (!date) {
      return '';
    }
    return date.split('T')[0];
  }

  deleteStatementForm() {
    if (this.editStatementSelectedIndex === '') {
      return;
    }
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to delete this record?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.value) {
          this.StatementData.splice(this.editStatementSelectedIndex, 1);
          this.editStatementSelectedIndex = '';
        }
      });
  }



  createCheckManagementForm() {
    this.checkMangementForm = this.fb.group({
      BankChequeID: [0],
      BankID: [this.editbankId],
      IsChequePrinting: [false],
      DateOfStart: [''],
      BookName: [''],
      FromNumber: [''],
      ToNumber: [''],
      TotalCheques: [''],

    });
  }

  clearCheckManagementForm() {
    this.checkMangementForm.reset();
  }

  getDateFormatString(): string {

    return 'YYYY/MM/DD';

    // return 'DD/MM/YYYY';

  }


  OnClickEditValue(row, index) {
    // console.log('row', row, index)
    const editRow = this.Chequename[this.editSeletedIdex];
    this.patchCheckManagementForm(editRow);
    this.isEditMode = !this.isEditMode;

  }

  OnClickRadio(index, selectedEID) {
    this.editSeletedIdex = index;
  }


  patchCheckManagementForm(editRow) {
    this.checkMangementForm.patchValue({
      BankChequeID: editRow.BankChequeID,
      BankID: editRow.BankID,
      IsChequePrinting: editRow.IsChequePrinting,
      DateOfStart: editRow.DateOfStart,
      BookName: editRow.BookName,
      FromNumber: editRow.FromNumber,
      ToNumber: editRow.ToNumber,
      TotalCheques: editRow.TotalCheques,

    });
  }

  updateBasicBankDetails() {
    // const payload = [{
    //   'BankID' : this.editbankId,
    //   'BankName' : this.FinancialForm.value.BankName,
    //   'CountryID' : Number($('#ddlCountry').val()),
    //   'CurrencyID' : Number($('#ddlOffice').val()),
    //   'AccountNo' : this.FinancialForm.value.BankAcctNo,
    //   'IFSCCode' : this.FinancialForm.value.IfscCode,
    //   'BranchName' : '',
    //   'BranchAddress' : this.FinancialForm.value.BankAddress,
    //   'SwiftCode' : this.FinancialForm.value.Ibancode,
    //   'GLCodeID' : 0,
    //   'StatusID' : Number($('#ddlStatus').val()),
    //   'EffectiveDate':'',
    //   'BankCode' : this.FinancialForm.value.BankAccountCode,
    //   'ShortName' : this.FinancialForm.value.shortName,
    // }];
    // return payload;

    this.basicbankDetails.BankID = this.editbankId;
    this.basicbankDetails.BankName = this.FinancialForm.value.BankName;
    this.basicbankDetails.CountryID = Number($('#ddlCountry').val());
    this.basicbankDetails.CurrencyID = Number($('#ddlOffice').val());
    this.basicbankDetails.AccountNo = this.FinancialForm.value.BankAcctNo;
    this.basicbankDetails.IFSCCode = this.FinancialForm.value.IfscCode;
    this.basicbankDetails.BranchName = '';
    this.basicbankDetails.BranchAddress = this.FinancialForm.value.BankAddress;
    this.basicbankDetails.LedgerMappingId = this.FinancialForm.value.LedgerMappingId;
    this.basicbankDetails.SwiftCode = this.FinancialForm.value.Ibancode;
    this.basicbankDetails.GLCodeID = 0;
    this.basicbankDetails.StatusID = Number($('#ddlStatus').val());
    this.basicbankDetails.LedgerMappingId = Number($('#ddlLedger').val());
    this.basicbankDetails.BankAccountCode = this.FinancialForm.value.BankAccountCode;
    this.basicbankDetails.ShortName = this.FinancialForm.value.shortName;
    // this.basicbankDetails.DivisionId = Number($('#division').val());
    this.basicbankDetails.DivisionIds = this.FinancialForm.controls.DivisionIds.value
    // this.basicbankDetails.OfficeId = Number($('#office').val());
    this.basicbankDetails.OfficeIds = this.FinancialForm.controls.OfficeIds.value;
    this.basicbankDetails.IsBank = this.FinancialForm.controls.IsBank.value;
    this.basicbankDetails.IsCash = this.FinancialForm.controls.IsCash.value;


  }

  updateBasicChequeDetails() {
    this.basicChequeDetails.IsChequePrinting = this.FinancialForm.value.Chequeprinting;
    this.Chequename.forEach(element => {
      element.IsChequePrinting = (this.FinancialForm.value.Chequeprinting == 1 ? true : false)
      element.FromNumber = Number(element.FromNumber)
      element.ToNumber = Number(element.ToNumber)
      element.TotalCheques = Number(element.TotalCheques)
    })
    //this. basicChequeDetails.DateOfStart= this.FinancialForm.value.Dateofstart;
    //this. basicChequeDetails.BookName= this.FinancialForm.value.BookName;
    //this. basicChequeDetails.FromNumber= Number(this.FinancialForm.value.FromNumber);
    //this. basicChequeDetails.ToNumber= Number(this.FinancialForm.value.ToNumber);
    //this. basicChequeDetails.TotalCheques= Number(this.FinancialForm.value.TotalCheque);
  }

  updateBasicStatementDetails() {
    var orderNumberMiss = false;
    for (let i = 0; i < this.Statement.length; i++) {
      if (!this.Statement[i].OrderNo || Number(this.Statement[i].OrderNo) < 0) {
        var validation = "<span style='color:red;'>*</span> <span>Please enter Order Number </span></br>"
        Swal.fire(validation)
        return false;
      }

    }
    let tempStatOrderNo = [];
    this.Statement.forEach(element => {
      element.OrderNo = Number(element.OrderNo)
      tempStatOrderNo.push(element.OrderNo);
    })
    const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)
    const duplicateElements = toFindDuplicates(tempStatOrderNo);
    if (duplicateElements.length > 0) {
      var validation = "<span style='color:red;'>*</span> <span>Duplicate Order Numbers found in Statement Details !</span></br>"
      Swal.fire(validation)
      return false;
    }
  }

  updateAttachment(newDoc) {
    this.basicAttachmentDetails.BankAttachmentsID = newDoc.BankAttachmentsID;
    this.basicAttachmentDetails.BankID = newDoc.BankID;
    this.basicAttachmentDetails.DateOfStart = newDoc.DateOfStart;
    this.basicAttachmentDetails.DocumentName = newDoc.DocumentName;
    this.basicAttachmentDetails.FilePath = newDoc.FilePath;
    this.basicAttachmentDetails.SlNo = newDoc.SlNo;
    this.documentListInfo.push(this.basicAttachmentDetails);
    this.onSubmit();
  }

  onBack() {
    this.router.navigate(['/views/finance/master/bank-account/bank-accountview']);
  }

  // async getModuleType() {
  //   // debugger
  //   let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerDropDownList`;
  //   this.dataService.post(service, {}).subscribe(async (result: any) => {
  //     // debugger
  //     if (result.message = "Success") {
  //       // this.ledgerSubModuleList = [];

  //       this.modules = result.data.Module

  //       let subModule = this.modules.find(x => x.ModuleName.toUpperCase() == this.moduleName.toUpperCase());
  //       this.ModuleId = subModule.ID
  //       await this.checkLedgerMapping()
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }


  // async checkLedgerMapping() {
  //   let service = `${this.globals.APIURL}/Common/CheckModuleAccess`;
  //   this.dataService.post(service, { ModuleId: this.ModuleId }).subscribe(async (result: any) => {
  //     if (result.data == "Access Granted") {
  //       this.mappingSuccess = true
  //     }
  //     else {
  //       this.mappingSuccess = false
  //       this.errorMessage = result.data
  //       Swal.fire(this.errorMessage)
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  onSubmit() {

    // if (this.mappingSuccess == false) {
    //   Swal.fire(this.errorMessage)
    //   return false;
    // }

    var validation = "";

    if (!this.FinancialForm.value.BankName || this.FinancialForm.value.BankName == "" || this.FinancialForm.value.BankName.trim() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Bank Name</span></br>"
    }

    if (!this.FinancialForm.value.BankAccountCode || this.FinancialForm.value.BankAccountCode == "" || this.FinancialForm.value.BankAccountCode.trim() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Bank Code</span></br>"
    }
    if (!this.FinancialForm.value.shortName || this.FinancialForm.value.shortName == "" || this.FinancialForm.value.shortName.trim() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Short Name </span></br>"
    }

    if (this.FinancialForm.value.IsBank && (this.FinancialForm.value.BankAcctNo == "" || this.FinancialForm.value.BankAcctNo.trim() == "")) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Account Number</span></br>"
    }

    if (this.FinancialForm.value.IsBank && (this.FinancialForm.value.BankAcctNo && this.FinancialForm.value.BankAcctNo.length > 20)) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Account Number maximum of 20 character</span></br>"
    }
    // if (this.FinancialForm.value.BranchName == "" || this.FinancialForm.value.BranchName.trim() == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Branch Name</span></br>"
    // }

    //if (!this.FinancialForm.value.Currency||this.FinancialForm.value.Currency.trim() == "") {
    //validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
    //}

    if ($('#ddlOffice').val() == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency</span></br>"
    }

    if ($('#ddlCountry').val() == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Country</span></br>"
    }

    if ($('#ddlStatus').val() == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Active</span></br>"
    }

    if ($('#ddlLedger').val() == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select LedgerMapping</span></br>"
    }

    var reg = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (this.FinancialForm.value.IsBank && (this.FinancialForm.value.IfscCode == "" || this.FinancialForm.value.IfscCode.trim() == "")) {
      validation += "<span style='color:red;'>*</span> <span>Please  enter IFSC Code</span></br>"
    }
    if (this.FinancialForm.value.IsBank && !reg.test(this.FinancialForm.value.IfscCode)) {
      validation += "<span style='color:red;'>*</span> <span>Please  enter valid IFSC Code</span></br>"
    }


    if (this.FinancialForm.value.BankAddress == "" || this.FinancialForm.value.BankAddress.trim() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Bank Address</span></br>"
    }

    if (!this.FinancialForm.value.DivisionIds || this.FinancialForm.value.DivisionIds.length == 0 || this.FinancialForm.value.DivisionIds == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Division</span></br>"
    }

    if (!this.FinancialForm.value.OfficeIds || this.FinancialForm.value.OfficeIds.length == 0 || this.FinancialForm.value.OfficeIds == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Office</span></br>"
    }

    if (!this.FinancialForm.value.IsBank && !this.FinancialForm.value.IsCash) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Bank or Cash</span></br>"
    }

    // if (!$('#division').val()) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Division</span></br>"
    // }

    // if (!$('#office').val()) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Office</span></br>"
    // }

    //if (!this.FinancialForm.value.GLCodeID || this.FinancialForm.value.GLCodeID==null || this.FinancialForm.value.GLCodeID == "") {
    //validation += "<span style='color:red;'>*</span> <span>Please select Link Ledger</span></br>"
    //}
    // if (this.AccTypeledger.length == 0) {
    //   validation += "<span style='color:red;'>*</span> No Link Ledger Options available <span></span></br>"
    // }
    // else if ($('#ddGLCodeID').val() == "null") {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Link Ledger</span></br>"
    // }

    if (!this.FinancialForm.value.EffectiveDate || this.FinancialForm.value.EffectiveDate.trim() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>"
    }


    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    /*let tempcheque = [];
    this.Chequename.forEach(element => { //JSON.parse(JSON.stringify(obj));
      var saveObj = {"BankChequeID":0,"BankID":0,"BookName":this.editchequeId,"FromNumber":Number(element.FromNumber),"ToNumber":Number(element.ToNumber),"TotalCheques":Number(element.TotalCheques),"DateOfStart":element.DateOfStart,"IsChequePrinting":false}
      tempcheque.push(saveObj);
      console.log(tempcheque.push(saveObj));
   });*/

    this.autoCodeGeneration(this.FinancialForm.value.shortName, Number($('#division').val()), Number($('#office').val()));
    const data = this.updateBasicBankDetails();
    this.updateBasicChequeDetails();

    // if (this.updateBasicStatementDetails() == false) {
    //   return false;
    // }

    // this.bankaccountDetailsSave.Table.push(...data);
    this.bankaccountDetailsSave.Table.push(this.basicbankDetails);

    this.bankaccountDetailsSave.Table1 = this.Chequename;
    // this.bankaccountDetailsSave.Table2.push( this.basicAttachmentDetails)
    this.bankaccountDetailsSave.Table3 = this.StatementData;
    ///console.log(  this.bankaccountDetailsSave.Table3=this.Statement);
    this.bankaccountDetailsSave.Table2.push(...this.documentListInfo);
    this.BankaccountModel.Bank = this.bankaccountDetailsSave;

    //console.log(this.bankaccountDetailsSave);
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to save this Details?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.value) {
          // console.log('this.BankaccountModel',this.BankaccountModel);
          // return
          this.service.saveaccount(this.BankaccountModel).subscribe(response => {
            //this.FinancialForm.reset();
            Swal.fire(response['data'])
            //Swal.fire(response[0].AlertMessage)
            if (response["message"] == "Failed") { Swal.fire(response["data"], '', 'error') }
            else {
              Swal.fire(response["data"], '', 'success').then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  if (!this.isUpdate) { this.updateAutoGenerated(); }
                  this.onBack();
                }
              })
            }
            //
            this.router.navigate(['/views/finance/master/bank-account/bank-accountview']);
          },
            (error: HttpErrorResponse) => {
              Swal.fire(error.message)
            });
        }
        //console.log('cancel');
      });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Banking');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  createForm() {
    if (this.FinancialForm.value.ID != null) {

    }
    else {

    }
    this.FinancialForm = this.fb.group({
      ID: 0,
      BankName: '',
      BankAcctNo: '',
      GLCodeID: null,
      Currency: '',
      IfscCode: '',
      BankAddress: '',
      Ibancode: '',
      EffectiveDate: this.getTodays(),
      DocumentName: '',
      Chequeprinting: 0,
      BookName: '',
      DateOfStart: '',
      FromNumber: '',
      ToNumber: '',
      TotalCheques: '',
      BankAccountCode: '',
      shortName: '',
      Status: [1],
      country: '',
      DivisionIds: [0],
      OfficeIds: [0],
      LedgerMappingId: [0],
      IsBank: false,
      IsCash: false
    });
  }



  getBankaccountDetails(id) {
    let temp = { "BankId": id };
    this.service.getBankaccountDetails(temp).subscribe(async response => {
      debugger
      const divisionData = response['data'].Table[0]['DivisionIds'];

      const newDivisionId = JSON.parse(divisionData);

      if (newDivisionId.length == this.divisionList.length) {
        this.allValues = true
        newDivisionId.push(0);
      } else {
        this.allValues = false
      }

      const formData = response['data'].Table[0];

      this.FinancialForm.controls.DivisionIds.patchValue([...newDivisionId.map(item => item), 0]);

      const officeData = response['data'].Table[0]['OfficeIds'];
      await this.getOffice(newDivisionId); //
      const newDOfficeId = JSON.parse(officeData);

      if (newDOfficeId.length == this.officeList.length && this.allValues == true) {
        this.allOffice = true;
        newDOfficeId.push(0);
      } else {
        this.allValues = false
      }
      // console.log(newDOfficeId.length);
      // console.log(this.FinancialForm.controls.BankName.setValue(response['data'].Table[0]['BankName']));
      this.FinancialForm.controls.BankName.setValue(response['data'].Table[0]['BankName']);
      this.FinancialForm.controls.Currency.setValue(response['data'].Table[0]['CurrencyID']);
      $('#ddlOffice').val(response['data'].Table[0]['CurrencyID']).trigger('change');
      // $('#ddlOffice').select2().val(response['data'].Table[0]['CurrencyID']);
      // console.log((response['data'].Table[0]['CurrencyID']));
      //('#ddlPort').select2().Val(response['data'].Table[0]['CurrencyID']);
      this.FinancialForm.controls.BankAcctNo.setValue(response['data'].Table[0]['AccountNo']);
      //console.log(this.FinancialForm.controls.Currency.setValue(response['data'].Table[0]['CurrencyName']));
      this.FinancialForm.controls.IfscCode.setValue(response['data'].Table[0]['IFSCCode']);
      // this.FinancialForm.controls.BranchName.setValue(response['data'].Table[0]['BranchName']);
      this.FinancialForm.controls.BankAddress.setValue(response['data'].Table[0]['BranchAddress']);
      this.FinancialForm.controls.Ibancode.setValue(response['data'].Table[0]['SwiftCode']);
      // $('#division').val(divisionData).trigger('change');
      // $('#office').val(officeData).trigger('change');

      // this.FinancialForm.controls.DivisionId.setValue(divisionData);

      // $('#division').val(divisionData).select2();
      this.FinancialForm.controls.DivisionIds.setValue(newDivisionId);
      this.FinancialForm.controls.OfficeIds.setValue(newDOfficeId);
      //this.FinancialForm.controls.GLCodeID.setValue(response['data'].Table[0]['GLCodeID']);
      setTimeout(function () { $('#ddGLCodeID').val(response['data'].Table[0]['GLCodeID']).trigger('change'); }, 2000)

      this.FinancialForm.controls.country.setValue(response['data'].Table[0]['CountryID']);
      $('#ddlCountry').val(response['data'].Table[0]['CountryID']).trigger('change');

      this.FinancialForm.controls.Status.setValue(response['data'].Table[0]['StatusID']);
      $('#ddlStatus').val(response['data'].Table[0]['StatusID']).trigger('change');

      this.FinancialForm.controls.IsBank.setValue(response['data'].Table[0]['IsBank']);
      this.FinancialForm.controls.IsCash.setValue(response['data'].Table[0]['IsCash']);

      this.FinancialForm.controls.LedgerMappingId.setValue(response['data'].Table[0]['LedgerMappingId']);
      $('#ddlLedger').val(Number(response['data'].Table[0]['LedgerMappingId']));

      this.FinancialForm.controls.BankAccountCode.setValue(response['data'].Table[0]['BankAccountCOde']);
      this.FinancialForm.controls.shortName.setValue(response['data'].Table[0]['ShortName']);

      if (response['data'].Table[0]['EffectiveDate'] != null) {
        this.FinancialForm.controls.EffectiveDate.setValue(response['data'].Table[0]['EffectiveDate'].split('T')[0]);
      }
      // console.log(this.FinancialForm.controls.Ibancode.setValue(response['data'].Table[0]['SwiftCode']));
      if (response['data'].Table1.length > 0) {

        this.FinancialForm.controls.Chequeprinting.setValue(response['data'].Table1[0]['IsChequePrinting'] ? 1 : 0);
        $('#ChequePrinting').val(response['data'].Table1[0]['IsChequePrinting'] ? 1 : 0).trigger('change');
      }
      if (response['data'].Table1.length > 0) {
        this.Chequename = [];
        this.Chequename = response['data'].Table1;
        this.Chequename.forEach(element => {
          if (element.DateOfStart != null && element.DateOfStart != '' && element.DateOfStart.trim() != "") {
            var temp = element.DateOfStart.split("T");
            element.DateOfStart = temp[0];
          }
        })

      }
      else {
        // var saveObj = { "BankChequeID": 0, "BankID": 0, "BookName": this.BookName, "FromNumber": this.FromNumber, "ToNumber": this.ToNumber, "TotalCheques": this.TotalCheques, "DateOfStart": this.DateOfStart, "IsChequePrinting": false }
        // this.Chequename.push(saveObj);
      }
      if (response['data'].Table2.length > 0) {
        this.documentListInfo = response['data'].Table2;
        this.documentInfo = this.constructDocumentPayload(this.documentListInfo);
      }
      if (response['data'].Table3.length > 0) {
        this.StatementData = [];
        this.StatementData = response['data'].Table3;
        this.StatementData.forEach(element => {
          if (element.EffectiveDate != null && element.EffectiveDate != '' && element.EffectiveDate.trim() != "") {
            const newDate = element.EffectiveDate.split('T');
            element.EffectiveDate = newDate[0];
          }
        });

      } else {
        // this.getStatementList();
        /*var saveObjs = {"BankStatementID":0,"BankID":0,"ID":0,"FieldsName":this.FieldsName,"OrderNo":0,"DisplayName":this.DisplayName}
        this.Statement.push(saveObjs);
        console.log(this.Statement.push(saveObjs));*/
      }

      this.setBankOrCash(formData);

    });
  }
  OnClickAddValue(dynamic) {
    var validation = "";
    if (!dynamic.DateOfStart || dynamic.DateOfStart == null || dynamic.DateOfStart == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Date Of Start</span></br>"
    }
    // if (!dynamic.BookName || dynamic.BookName == null || dynamic.BookName == '') {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Book Name</span></br>"
    // }
    if (!dynamic.FromNumber || dynamic.FromNumber == null || dynamic.FromNumber == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter From Number</span></br>"
    }
    if (!dynamic.ToNumber || dynamic.ToNumber == null || dynamic.ToNumber == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter To Number</span></br>"
    }
    // if (!dynamic.TotalCheques || dynamic.TotalCheques == null || dynamic.TotalCheques == '') {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Total Number Of Cheques</span></br>"
    // }


    if (validation != "") {
      Swal.fire(validation);
      return false;
    }
    // edit mode
    if (this.isEditMode) {
      this.Chequename[this.editSeletedIdex] = dynamic;
      this.isEditMode = !this.isEditMode;
      this.clearCheckManagementForm();
      return;
    }
    // add new
    // var saveObj = { "BankChequeID": 0, "BankID": this.editbankId, "BookName": "", "FromNumber": 0, "ToNumber": 0, "TotalCheques": 0, "DateOfStart": "", "IsChequePrinting": false }
    this.Chequename.push(dynamic);
    this.clearCheckManagementForm();

    //this.dynamicContainerArray.push(this.newDynamicContainer);
    return true;
  }

  oldOnClickAddstatement(dynamic, index) {

    var validation = "";
    if (!dynamic.FieldsName || dynamic.FieldsName == null || dynamic.FieldsName == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Fields Name</span></br>"
    }
    if (!dynamic.OrderNo || dynamic.OrderNo == null || dynamic.OrderNo == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Order Number</span></br>"
    }

    if (!dynamic.DisplayName || dynamic.DisplayName == null || dynamic.DisplayName == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Display Name</span></br>"
    }





    if (validation != "") {
      Swal.fire(validation);
      return false;
    }

    // var saveObjs = { "BankStatementID": 0, "BankID": 0, "ID": 0, "FieldsName": "", "OrderNo": 0, "DisplayName": "" }
    // this.Statement.push(saveObjs);
    // console.log(this.Statement.push(saveObjs));

  }

  alertAttchment(id) {
    this.Statement.forEach((element, index) => {

      //delete this.emailAlerts[index];
      this.Statement.splice(index, 1);
      //Swal.fire("Selected Alert type Already Added!");

    });
    //console.log(this.Statement)
  }


  OnBindDropdownCurrency() {
    this.CurrencyLook = { "currencyId": 0, "countryId": 0 };
    // console.log(this.CurrencyLook);

    this.service.getCurrencyLists(this.CurrencyLook).subscribe(data => {
      this.AccTypecurrency = data['data'];
      // console.log(this.AccTypecurrency)

    });
  }
  OnBindDropdownLedger() {
    this.LedgerLook = { "isJobAccount": 0, };
    // console.log(this.LedgerLook);

    this.service.getLedgerLists(this.LedgerLook).subscribe(data => {
      this.AccTypeledger = data['data'];
      // console.log(this.AccTypeledger )

    });
  }
  alertEmailRemove(id, rowIndex) {

    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to delete this record?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: false,
      allowOutsideClick: false
    })

      .then((result) => {
        if (result.value) {
          this.Chequename.splice(rowIndex, 1);

        }
        // if (this.Chequename.length == 0) {
        //   var saveObj = { "BankChequeID": 0, "BankID": this.editbankId, "IsChequePrinting": false, "DateOfStart": null, "BookName": null, "FromNumber": 0, "ToNumber": 0, "TotalCheques": 0 }
        //   this.Chequename.push(saveObj);
        // }

      });

    // console.log(this.Chequename)
  }


  special(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  IfscCode(event): boolean {
    let patt = /^([a-zA-Z0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  fromnumber(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  tonumber(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  reset() {
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to cancel this operation?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.value) { this.router.navigate(['/views/finance/master/bank-account/bank-accountview']); }
        //console.log('cancel');
      });
  }
  getTodays(): string {
    return new Date().toISOString().split('T')[0]

  }
  getTotal(data) {

    if (Number(data.ToNumber) > 0 && Number(data.FromNumber) > Number(data.ToNumber)) {
      Swal.fire(" To cheque number should be greater than from cheque number!");
      data.ToNumber = 0;
      data.FromNumber = 0;
      data.TotalCheques = 0;
    }
    else if (data.ToNumber > 0 && data.FromNumber > 0) {
      data.TotalCheques = (Number(data.ToNumber) + 1) - Number(data.FromNumber);
      this.checkMangementForm.controls.TotalCheques.setValue(data.TotalCheques);
    }
    else {
      data.TotalCheques = 0;
    }
  }
  findDuplicates(arr) {
    return arr.filter((currentValue, currentIndex) =>
      arr.indexOf(currentValue) !== currentIndex);
  }

  getCountryList() {
    let service = `${this.globals.APIURL}/Organization/GetCountryList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.countryList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }
  uploadDocument(event) {
    const payload = {
      BankAttachmentsID: 0,
      BankID: this.editbankId,
      DateOfStart: event.UploadedOn,
      DocumentName: event.DocumentName,
      FilePath: event.FilePath,
      SlNo: 0
    };
    this.updateAttachment(payload);
  }

  deleteDocument(deleteData) {
    const index = this.documentListInfo.findIndex((element) => element.BankAttachmentsID == deleteData.BankAttachmentsID);
    this.documentListInfo.splice(index, 1)
    this.onSubmit();
  }

  // pass the data to document component
  constructDocumentPayload(docList) {
    if (docList) {
      const newDocument = [];
      docList.forEach((item) => {
        const payload = {
          BankAttachmentsID: item.BankAttachmentsID,
          BankID: item.editbankId,
          uploadedOn: item.DateOfStart,
          DocumentName: item.DocumentName,
          FilePath: item.FilePath,
          SlNo: item.SlNo ? item.SlNo : 0
        };
        newDocument.push(payload);
      });
      return newDocument;
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
          this.autoGenerateCodeList = result.data.Table
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any, division?, office?) {
    if (!this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == "Banking");
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event, division, office);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.FinancialForm.controls['BankAccountCode'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Banking.')
        }
      }
      else {
        this.FinancialForm.controls['BankAccountCode'].setValue('');
      }
    }
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string, division, office) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (division && office) {
      officeInfo = this.officeList.find(x => x.ID == office);
      divisionInfo = this.divisionList.find(x => x.ID == division);
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




  getOffice(DivisionIds, isSelect = false) {
    return new Promise((resolve, rejects) => {
      const payload = { DivisionIds: [...DivisionIds] }
      this.commonDataService.getOfficeByDivisionIds(payload).subscribe((result: any) => {
        this.officeList = [];
        // $('#office').val(null)
        this.FinancialForm.controls.OfficeIds.setValue([]); // clear office selected
        if (result.message == 'Success') {
          if (result.data && result.data.Table.length > 0) {
            this.officeList.push(...result.data.Table);

            if (isSelect) {
              this.FinancialForm.controls.OfficeIds.patchValue([...this.officeList.map(item => item.ID), 0]);
              this.allOffice = true
            } else {
              this.allOffice = false
              // this.FinancialForm.controls.OfficeIds.patchValue([...this.officeList.map(item => item.ID)]);
            }
            resolve(true)
          }
          // if (this.allValues == false) {
          //   this.officeList = []
          // }


        }

      }, error => {
        rejects();
      });
    })
  }

  getDivision(isSelect = false) {
    this.commonDataService.getDivision({}).subscribe((result: any) => {
      this.divisionList = [];
      debugger
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table.filter(item => item.Active);

        if (!this.bankId) {
          this.allValues = true;
          this.FinancialForm.controls.DivisionIds.patchValue([...this.divisionList.map(item => item.ID), 0]);
          this.getOffice(this.FinancialForm.controls.DivisionIds.value, isSelect)
        } else {
          this.allValues = false;
        }

        this.nameData = [];
        for (var i = 0; i < this.divisionList.length; i++) {
          let division = this.divisionList[i];
          let divisionIdData = this.divisionList[i].ID;
          if (division.Active === true) {
            this.nameData.push(division);
            this.divisionIdData.push(divisionIdData)

            // console.log(this.divisionIdData,'this.divisionIdData');

          }

        }

        // if (result.data.Table.length == this.divisionIdData.length) {
        //   this.allValues = true;
        // } else {
        //   this.allValues = false;
        // }
      }
    }, error => { });;
  }

  setBank(value, ledgerId = 0) {
    debugger
    if(value == 3){
      this.FinancialForm.patchValue({
        IsBank: true,
        IsCash: false,
        LedgerMappingId: [ledgerId]
      });
      $('#ddlLedger').val(ledgerId);
      this.getLedgerMappingParentAccountList(value)
    } else {
      this.FinancialForm.patchValue({
        IsBank: false,
        IsCash: true,
        LedgerMappingId: [ledgerId]
      });
      $('#ddlLedger').val(ledgerId)
      this.getLedgerMappingParentAccountList(value)
    }
    
  }



  setBankOrCash(formData) {
    if (formData.IsBank) {
      this.setBank(3, formData.LedgerMappingId);
    } else {
      this.setBank(4, formData.LedgerMappingId);
    }
  }


  getLedgerMappingParentAccountList(value) {
    debugger
    const payload = {
      ModuleType: value
    }
    this.commonDataService.getLedgerMappingParentAccountList(payload).subscribe(data => {
      this.parentAccountList = data["data"].Table;
    });
  }
}
