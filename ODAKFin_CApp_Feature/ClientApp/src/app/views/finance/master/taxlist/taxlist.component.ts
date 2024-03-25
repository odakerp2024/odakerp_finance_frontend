import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Associated, AssociatedGLMappingDetails, TaxType } from 'src/app/model/Createtaxtype';
import { TaxDetails, TaxtypeModel } from 'src/app/model/Taxmodel';
import { Country, CountrySearch, DynamicGridColumn, GetAssociatedType, GetAssociatedTypeSearch } from 'src/app/model/Taxtype';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { TaxtypeService } from 'src/app/services/taxtype.service';
import { StatusNew, TransactionTypeView, } from 'src/app/model/common';
import Swal from 'sweetalert2';
declare let $: any;


@Component({
  selector: 'app-taxlist',
  templateUrl: './taxlist.component.html',
  styleUrls: ['./taxlist.component.css'],
  providers: [DatePipe]
})
export class TaxlistComponent implements OnInit {
  statusvalues: any[] = [
    { value: 'true', viewValue: 'Yes' },
    { value: 'false', viewValue: 'No' },
  ];


  fg: FormGroup;

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';

  basictaxtypeDetails: TaxType = new TaxType();
  basicassociatedeDetails: Associated = new Associated();

  TaxtypeModel: TaxtypeModel = new TaxtypeModel();
  taxtypeDetailsSave: TaxDetails = new TaxDetails();
  Taxtype: Associated[] = [];
  marked = false;
  Taxgroupform: FormGroup;
  GLMappingform: FormGroup;
  AccTypecontrys: Country[];
  CountryLook: CountrySearch;
  AccTypeassociated: GetAssociatedType[];
  AssociatedLook: GetAssociatedTypeSearch;
  tempTaxtype: Associated[];
  isCreate: boolean = true;
  isUpdateEnable: boolean = false;
  editTaxId: Number = 0;
  tempAssociatedTakList: any = [];
  chipsList: any;
  isUpdate: boolean = false;
  autoGenerateCodeList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  selectedTabName: string = 'Basic';
  transactionTypeList: StatusNew[] = new TransactionTypeView().glvalues;
  TaxTypeId: number = 0;
  OfficeList: any[];
  AccountList: any[];
  SubLedgerList: any[];
  DynamicGrid: Array<DynamicGridColumn> = [];
  editSelectedIndex: number;
  isEditMode = false;
  AssociatedDetails: AssociatedGLMappingDetails = new AssociatedGLMappingDetails();

  constructor(private router: Router, private route: ActivatedRoute, private service: TaxtypeService, private fb: FormBuilder,
    private datePipe: DatePipe, private dataService: DataService, private globals: Globals,
    private autoCodeService: AutoCodeService,
    private commonDataService: CommonService
  ) {
    this.getNumberRange();
    this.route.queryParams.subscribe(params => {
      this.fg = this.fb.group({
        ID: params['id']
      });
      if (params['id']) {
        this.TaxTypeId = Number(params['id'])
      }
    });
  }

  updateBasicTaxDetails() {
    this.basictaxtypeDetails.TaxTypeName = this.Taxgroupform.value.Taxtypename;
    // this.basictaxtypeDetails.CountryId = Number($('#ddlCountry').val())
    this.basictaxtypeDetails.CountryId = this.Taxgroupform.value.Country;
    this.basictaxtypeDetails.EffectiveDate = this.Taxgroupform.value.EffectiveDate;
    // this.basictaxtypeDetails.IsActive = (Number($('#ddlStatus').val()) == 1 ? true : false);
    this.basictaxtypeDetails.IsActive = this.Taxgroupform.value.Status == 'true' ? true : false;
    this.basictaxtypeDetails.TaxTypeId = this.editTaxId;
    this.basictaxtypeDetails.CreatedBy = 1;
    this.basictaxtypeDetails.UpdatedBy = 0;
    this.basictaxtypeDetails.TaxCode = this.Taxgroupform.value.TaxCode;
    this.basictaxtypeDetails.ShortName = this.Taxgroupform.value.shortName;

  }

  updateBasicAssociatedDetails() {
    this.basicassociatedeDetails.AssociatedTaxTypeName = this.Taxgroupform.value.Associatedtax;
    //this.basicassociatedeDetails.AssociatedTaxTypeName= ;
  }
  ngOnInit(): void {
    $('.my-select').select2();
    this.createForm();
    this.OnBindDropdownCountry();
    this.OnBindDropdownAssociated();
    this.getOfficeList();
    this.GetCOAAccountList(1);
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.isUpdate = true;
        this.isCreate = false;
        this.Taxgroupform.disable()
      }
    })

  }

  onBack() {
    this.router.navigate(['/views/finance/master/taxlist/taxlistView']);
  }


  createForm() {
    this.Taxgroupform = this.fb.group({
      ID: 0,
      Country: 0,
      Taxtypename: '',
      EffectiveDate: '',
      Associatedtax: '',
      Status: '',
      shortName: '',
      TaxCode: ''
    });

    this.GLMappingform = this.fb.group({
      ID: 0,
      TaxTypeId: this.TaxTypeId,
      AssociatedtaxId: [0],
      TransactionType: [0],
      OfficeId: [0],
      AccountId: [0],
      SubLedgerId: [0],
      Status: ['true']
    });
  }

  getOfficeList() {
    this.commonDataService.getOffice({}).subscribe((result: any) => {
      this.OfficeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.OfficeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  GetCOAAccountList(value) {
    const payload = {
      Mode: value
    }
    this.commonDataService.GetCOAAccountList(payload).subscribe(data => {
      debugger
      if (value == 1) {
        this.AccountList = data["data"].Table;
      }
    });
  }

  GetCOAAccountMappingList(value) {
    debugger
    const payload = {
      AccountId: value
    }
    this.commonDataService.GetCOAAccountMappingList(payload).subscribe(data => {
      this.SubLedgerList = data["data"].Table;
    });
  }


  OnBindDropdownCountry() {
    this.CountryLook = { "countryId": 0, };
    console.log(this.CountryLook);

    this.service.getCountryList(this.CountryLook).subscribe(data => {
      this.AccTypecontrys = data['data'];
      console.log(this.AccTypecontrys)
    });
  }

  OnBindDropdownAssociated() {
    this.AssociatedLook = { "associatedtypeId": 0, };
    console.log(this.AssociatedLook);

    this.service.getAssociatedList(this.AssociatedLook).subscribe(data => {
      this.AccTypeassociated = data['data'];
      console.log(this.AccTypeassociated)
      if (this.route.snapshot.params['id'] > 0) {
        this.editTaxId = this.route.snapshot.params['id'];
        this.getTaxtypeGetDetails(this.editTaxId);

      }

    });
  }

  onSubmit() {
    var validation = "";

    // if (this.Taxgroupform.value.Country== "") {
    //validation += "<span style='color:red;'>*</span> <span>Please Select  Country </span></br>"
    //}

    if ($('#ddlCountry').val() == "null") {
      validation += "<span style='color:red;'>*</span> <span>Please select Country</span></br>"
    }

    if (this.Taxgroupform.value.Taxtypename == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter  Taxtype Name </span></br>"
    }
    if (this.Taxgroupform.value.EffectiveDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please  select  Effective Date </span></br>"
    }
    //if (this.Taxgroupform.value.Status== "") {
    //validation += "<span style='color:red;'>*</span> <span>Please  Select  Status </span></br>"
    //}
    if ($('#ddlStatus').val() == "null") {
      validation += "<span style='color:red;'>*</span> <span>Please select  Status</span></br>"
    }

    if (this.Taxgroupform.value.Associatedtax == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select  Associatedtax </span></br>"
    }

    if (this.Taxgroupform.value.shortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Short Name </span></br>"
    }

    if (this.Taxgroupform.value.TaxCode == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Short Name </span></br>"
    }

    // if (this.DynamicGrid.length == 0) {
    //   validation += "<span style='color:red;'>*</span> <span> Please select atleast one GL Mapping</span><br>"
    // }


    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    let tempTaxtype = [];
    this.AccTypeassociated.forEach(element => {
      if (this.Taxgroupform.value.Associatedtax.indexOf(element.AssociatedTypeID) != -1) {
        var saveObj = { "AssociatedTaxTypeId": this.getAssociateTaxTypeId(element.AssociatedTypeID), "TaxTypeId": this.editTaxId, "AssociatedTaxTypeName": element.AssociatedType, "AssociatedTaxType": Number(element.AssociatedTypeID) }
        this.taxtypeDetailsSave.Table1.push(saveObj)
      }
    });

    this.updateBasicTaxDetails();
    this.updateBasicAssociatedDetails()
    this.taxtypeDetailsSave.Table.push(this.basictaxtypeDetails)
    //console.log(this.taxtypeDetailsSave.Table1=this.Taxtype);
    this.TaxtypeModel.TaxType = this.taxtypeDetailsSave;
    // this.TaxtypeModel = this.taxtypeDetailsSave;
    debugger
    for (let item of this.DynamicGrid) {
      this.AssociatedDetails = new AssociatedGLMappingDetails();
      this.AssociatedDetails.TaxTypeId = item.TaxTypeId ? item.TaxTypeId : 0;
      this.AssociatedDetails.ID = item.MappingGLTaxTypeId ? item.MappingGLTaxTypeId : 0;
      this.AssociatedDetails.AssociatedtaxId = item.AssociatedtaxId;
      this.AssociatedDetails.TransactionType = item.TransactionType;
      this.AssociatedDetails.OfficeId = item.OfficeId;
      this.AssociatedDetails.AccountId = item.AccountId;
      this.AssociatedDetails.SubLedgerId = item.SubLedgerId;
      this.AssociatedDetails.Status = item.Status == 'true' ? true : false;
      this.taxtypeDetailsSave.Table2.push(this.AssociatedDetails);
    };

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
          this.service.savetaxtype(this.TaxtypeModel).subscribe(response => {
            //this.FinancialForm.reset();
            // Swal.fire(response['data'])
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

            // this.router.navigate(['/views/finance/master/taxlist/taxlistView']);
          },
            (error: HttpErrorResponse) => {
              Swal.fire(error.message)
            });
        }
        //console.log('cancel');
      });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Tax Type');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
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
        if (result.value) { this.router.navigate(['/views/finance/master/taxlist/taxlistView']); }
        //console.log('cancel');
      });
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]

  }
  getTaxtypeGetDetails(id) {
    let temp = { "TaxTypeId": id };
    this.service.getTaxtypeDetails(temp).subscribe(response => {
      // console.log(this.Taxgroupform.controls);
      // console.log(this.FinancialForm.controls.BankName.setValue(response['data'].Table[0]['BankName']));   
      this.Taxgroupform.controls.Country.setValue(response['data'].Table[0]['CountryId']);
      $('#ddlCountry').val(response['data'].Table[0]['CountryId']).trigger('change');
      this.Taxgroupform.controls.Taxtypename.setValue(response['data'].Table[0]['TaxTypeName']);
      this.Taxgroupform.controls.EffectiveDate.setValue(response['data'].Table[0]['EffectiveDate'].split('T')[0]);
      this.Taxgroupform.controls.Status.setValue(response['data'].Table[0]['IsActive'] == true ? 'true' : 'false');
      // $('#ddlStatus').val(response['data'].Table[0]['IsActive'] == true ? 1 : 2).trigger('change');

      this.Taxgroupform.controls.TaxCode.setValue(response['data'].Table[0]['TaxCode']);
      this.Taxgroupform.controls.shortName.setValue(response['data'].Table[0]['ShortName']);

      this.CreatedOn = this.datePipe.transform(response['data'].Table[0]['CreatedOn'].split('T')[0], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
      this.CreatedBy = localStorage.getItem('UserName')
      this.ModifiedOn = this.datePipe.transform(response['data'].Table[0]['UpdatedOn'].split('T')[0], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
      this.ModifiedBy = localStorage.getItem('UserName')


      //console.log(this.Taxgroupform.controls.Country.setValue(response['data'].Table[0]['CountryId']));
      if (response['data'].Table1.length > 0) {
        let tempAss = [];
        response['data'].Table1.forEach(element => {
          tempAss.push(element.AssociatedTaxType)
        })
        this.tempAssociatedTakList = response['data'].Table1
        console.log(this.tempAssociatedTakList);
        this.Taxgroupform.controls.Associatedtax.setValue(tempAss);

      }
      this.DynamicGrid.length = 0;
      if (response['data'].Table2.length > 0) {
        for (let item of response['data'].Table2) {

          this.DynamicGrid.push({
            MappingGLTaxTypeId: item.ID,
            TaxTypeId: item.TaxTypeId,
            AssociatedtaxId: item.AssociatedtaxId,
            TransactionType: item.TransactionType,
            OfficeId: item.OfficeId,
            AccountId: item.AccountId,
            SubLedgerId: item.SubLedgerId,
            Status: item.Status == true ? 'true' : 'false',
            IsSelected: 0,
            AssociatedTaxName: item.AssociatedTax,
            TransactionTypeName: item.TransactionTypeName,
            OfficeName: item.OfficeName,
            AccountName: item.AccountName,
            SubLedgerName: item.SubLedgerName,
            StatusName: item.StatusName
          })
        }
      }
      else {
        // this.GridPushEmptyrow();
      }

    });

  }



  getAssociateTaxTypeId(AssociatedTaxType) {
    if (this.tempAssociatedTakList.length > 0) {
      for (let i = 0; i < this.tempAssociatedTakList.length; i++) {
        if (this.tempAssociatedTakList[i].AssociatedTaxType == AssociatedTaxType) {
          console.log(this.tempAssociatedTakList[i].AssociatedTaxTypeId)
          return this.tempAssociatedTakList[i].AssociatedTaxTypeId;
        }
      }
      return 0;

    }
    else {
      return 0;
    }
  }

  taxChanges(event: any) {
    debugger
    this.chipsList = [];
    if (event.length > 0) {
      for (let data of event) {
        let fil = this.AccTypeassociated.find(x => x.AssociatedTypeID == data);
        this.chipsList.push(fil)
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
          this.autoGenerateCodeList = result.data.Table
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any) {
    if (!this.isUpdate) {
      if (event) {
        var Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Tax Type');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.Taxgroupform.controls['TaxCode'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Tax Type.')
        }
      }
      else {
        this.Taxgroupform.controls['TaxCode'].setValue('');
      }
    }
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, TaxTypeCode: string) {
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

  checkPermission(value) {
    if (value == 'GL' && this.isUpdate == true) {
      this.selectedTabName = 'GL'
    } else if (value == 'Basic') {
      this.selectedTabName = 'Basic'
    } else {
      this.selectedTabName = 'GL'
      // Swal.fire('Please Update Basic Details first');
    }
  }

  GridRowValidation(newRow): boolean {
    debugger
    const existingRow = this.DynamicGrid.find(gRow => gRow.AssociatedtaxId === newRow.AssociatedtaxId
      && gRow.TransactionType === newRow.TransactionType && gRow.OfficeId === newRow.OfficeId && gRow.SubLedgerId === newRow.SubLedgerId
      && gRow.AccountId === newRow.AccountId && gRow.MappingGLTaxTypeId !== newRow.MappingGLTaxTypeId);

    return !!existingRow;
  }

  DynamicGridAddRow() {
    debugger
    const gRow = this.GLMappingform.value;
    var validation = "";

    if (!gRow.AssociatedtaxId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Associated Tax</span></br>"
    }

    if (!gRow.TransactionType) {
      validation += "<span style='color:red;'>*</span> <span>Please select Transaction Type</span></br>"
    }

    if (!gRow.OfficeId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office </span></br>"
    }

    if (!gRow.AccountId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account</span></br>"
    }

    if (!gRow.SubLedgerId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Sub Ledger</span></br>"
    }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }
    let IsExists = this.GridRowValidation(gRow);

    if (IsExists) {
      Swal.fire("", "Linked GL Mapping combination already Exists", 'warning');
      return;
    }
    const AssociatedType = this.chipsList.find(e => { return e.AssociatedTypeID == gRow.AssociatedtaxId })
    const TransactionType = this.transactionTypeList.find(e => { return e.value == gRow.TransactionType })
    const Office = this.OfficeList.find(e => { return e.ID == gRow.OfficeId })
    const Account = this.AccountList.find(e => { return e.ID == gRow.AccountId })
    const SubLedger = this.SubLedgerList.find(e => { return e.ID == gRow.SubLedgerId })


    gRow.AssociatedTaxName = AssociatedType ? AssociatedType.AssociatedType : '-';
    gRow.TransactionTypeName = TransactionType ? TransactionType.viewValue : '-';
    gRow.OfficeName = Office ? Office.OfficeName : '-';
    gRow.AccountName = Account ? Account.AccountName : '-';
    gRow.SubLedgerName = SubLedger ? SubLedger.AccountName : '-';
    gRow.StatusName = gRow.Status == 'true' ? 'YES' : 'NO';

    if (this.isEditMode) {
      this.DynamicGrid[this.editSelectedIndex] = gRow;
      this.isEditMode = !this.isEditMode;
      // this.GridRowValidation();
      this.clearLinkedGLForm();
      return;
    } else {
      this.DynamicGrid.push(gRow);

      this.clearLinkedGLForm();
    }
  }

  clearLinkedGLForm() {
    this.GLMappingform.reset({
      MappingGLTaxTypeId: 0,
      TaxTypeId: this.TaxTypeId,
      AssociatedtaxId: 0,
      TransactionType: 0,
      OfficeId: 0,
      AccountId: 0,
      SubLedgerId: 0,
      Status: 'true',
      IsSelected: 0
    });
  }

  radioChange(event: any, index: number) {
    this.editSelectedIndex = index;
  }

  OnClickEditValue() {
    // console.log('row', row, index)
    debugger
    const editRow = this.DynamicGrid[this.editSelectedIndex];
    this.GetCOAAccountMappingList(editRow.AccountId)
    this.patchLinkedGLForm(editRow);
    this.isEditMode = !this.isEditMode
  }

  patchLinkedGLForm(editRow) {
    this.GLMappingform.patchValue({
      MappingGLTaxTypeId: editRow.MappingGLTaxTypeId,
      TaxTypeId: this.TaxTypeId,
      AssociatedtaxId: editRow.AssociatedtaxId,
      TransactionType: editRow.TransactionType,
      OfficeId: editRow.OfficeId,
      AccountId: editRow.AccountId,
      SubLedgerId: editRow.SubLedgerId,
      Status: editRow.Status,
      IsSelected: editRow.IsSelected
    });
  }

}
