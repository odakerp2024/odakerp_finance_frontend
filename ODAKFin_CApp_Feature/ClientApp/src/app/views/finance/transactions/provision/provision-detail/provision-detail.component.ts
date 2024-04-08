import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Globals } from 'src/app/globals';
import { StatusNew, Provision } from 'src/app/model/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DynamicProvisionItem, DynamicProvisionItemColumn } from 'src/app/model/financeModule/Provision';
import { DataService } from 'src/app/services/data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProvisionService } from 'src/app/services/financeModule/provision.service';
import { AutoGenerationCodeService } from 'src/app/services/auto-generation-code.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';

@Component({
  selector: 'app-provision-detail',
  templateUrl: './provision-detail.component.html',
  styleUrls: ['./provision-detail.component.css']
})
export class ProvisionDetailComponent implements OnInit {

  ProvisionForm: FormGroup;
  CreatedBy = localStorage.getItem('UserID');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  statusValues: StatusNew[] = new Provision().glvalues;
  provisionItemsTableList: Array<DynamicProvisionItemColumn> = [];
  divisionList: any[];
  officeList: any[];
  AccountList: any[];
  currencyList: any[];
  private ngUnsubscribe = new Subject<void>();
  editSelectedIndex: number;
  TotalAmount: number = 0;
  isGridEditMode = false;
  isEditMode: boolean = true;
  isEditMode1: boolean =false;
  isUpdate = true;
  provisionId: number;
  numberRangeList: any;
  IsFinal : boolean = false;
  IsExchangeEnable: boolean = false;
  companyCurrencyId: Number;
  Remarks: string = '';
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private commonDataService: CommonService,
    private globals: Globals,
    private router: Router,
    private dataService: DataService,
    private provisionService: ProvisionService,
    private autoGenerationCodeService: AutoGenerationCodeService,
    private autoCodeService: AutoCodeService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDivisionList();
    this.getParentAccountList();
    this.getCurrency();
    this.getNumberRangeList();


    this.route.params.subscribe(param => {
      if (param.ProvisionId) {
        this.provisionId = param.ProvisionId;
        this.ProvisionForm.disable();
        this.getByIdRouteFunction();
  
         
      }
    });

  }

  createForm() {
    this.ProvisionForm = this.fb.group({
      Table: this.fb.group({
        ProvisionId: [0],
        DivisionId: [''],
        OfficeId: [''],
        Number: [''],
        Date: [new Date()],
        Status: [1],
        Remarks: [''],
        Amount: [0],
        IsFinal: [0],
        IsClosedProvision: [0],
        CreatedBy: [this.CreatedBy]
      }),
      Table1: this.fb.group({
        ProvisionItemsId: 0
        , Account: 0
        , AccountName: ''
        , Rate: 0
        , Qty: 0
        , Amount: 0
        , Currency: ''
        , CurrencyName: ''
        , ExchangeRate: 1
        , AmountCCR: 0
      })
    });
  }
  
  enableEdit() {
     this.ProvisionForm.enable();
     this.isUpdate = true;
     this.isEditMode = true;
     this.isEditMode1 = true;
   }

  getByIdRouteFunction() {   
    var service = `${this.globals.APIURL}/Provision/GetProvisionById`; 
    var payload = { Id: this.provisionId };
    this.dataService.post(service, payload).subscribe(async (result: any) => {
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.provisionItemsTableList = [];
        let info = result.data.Table[0];
        if (info.StatusId == 2) {
          this.isEditMode = true;
          this.IsFinal = true; // Set isFinal to true if StatusId is 2
      }
      if (info.StatusId == 3) {
        this.isEditMode = true;
        this.IsFinal = false; // Set isFinal to true if StatusId is 2
       }
        await this.getOffice(info.DivisionId);
        //console.log("Info before patching form:", info); // Log info before patching the form
        this.Remarks = info.Remarks; 
          const table1Data = result.data.Table1[0];
        this.TotalAmount = table1Data.AmountCCR;
        this.ProvisionForm.get('Table').patchValue({
          ProvisionId: info.ProvisionId,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          Number: info.ProvisionNumber,
          Date: info.ProvisionDate,
          Status: info.StatusId,
          Remarks: this.Remarks,
          TotalAmount: this.TotalAmount,
          IsFinal: info.IsFinal ? 1 : 0,
          IsClosedProvision: info.IsClosedProvision
        });
       // console.log("Form values after patching:", this.ProvisionForm.value); // Log form values after patching
        
        this.getCurrency();
        this.getParentAccountList();
        if (result.data.Table1.length > 0) {
          // Patch values into Table1 form group
          const table1FormGroup = this.ProvisionForm.get('Table1') as FormGroup;
          const table1Data = result.data.Table1[0]; // Assuming only one item is patched
          // Format the AmountCCR to two decimal places
          const formattedAmountCCR = parseFloat(table1Data.AmountCCR).toFixed(2);
          // console.log("table1Data before patching form:", table1Data);
          table1FormGroup.patchValue({
            ProvisionItemsId: table1Data.ProvisionItemsId,
            Account: table1Data.Account,
            Rate: table1Data.Rate,
            Qty: table1Data.Qty,
            Amount: table1Data.Amount,
            Currency: table1Data.Currency,
            ExchangeRate: table1Data.ExchangeRate,
            AmountCCR: formattedAmountCCR,
            AccountName: await this.getAccountName(table1Data.Account),
            CurrencyName: await this.getCurrencyName(table1Data.Currency)
          
          });
          // console.log("Form values after patching:", table1FormGroup.value);
          // Set provisionItemsTableList separately
          this.provisionItemsTableList = result.data.Table1.map(item => ({
            ...item,
            AccountName: this.getAccountName(item.Account),
            CurrencyName: this.getCurrencyName(item.Currency)
          }));
         // console.log(this.provisionItemsTableList, 'table 1');
        }
        
      }
    }, error => { });
  }
  
  


  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => {
      console.log('err--', error);
    });
  }

  // getOfficeList() {
  //   var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
  //   this.dataService.post(service, {}).subscribe((result: any) => {
  //     this.officeList = [];
  //     if (result.message == 'Success' && result.data.Office.length > 0) {
  //       this.officeList = result.data.Office.filter(x => x.Active == true);
  //     }
  //   }, error => { 
  //     console.log('err--', error);
  //   });
  // }

  getOffice(DivisionId) {   
    return new Promise((resolve, reject) => {
      const payload = { DivisionId: DivisionId }
      this.commonDataService.getOfficeByDivisionId(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        this.officeList = [];
        this.ProvisionForm.controls['Table']['controls']['OfficeId'].setValue('');
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

  getParentAccountList() {
    this.commonDataService.getChartaccountsFilter().subscribe(async data => {
      this.AccountList = [];
      if (data["data"].length > 0) {
        data["data"].forEach(e => e.AccountName = e.AccountName.toUpperCase());
        this.AccountList = data["data"];
        // this.groupedCoaTypeList = this.groupDataByCEOGroupId(this.AccountList);
      }
    });
  }

   getAccountName(accountId: number){
    this.getParentAccountList(); 
    const account = this.AccountList.find(acc => acc.ChartOfAccountsId.toString().toLowerCase() === accountId.toString().toLowerCase());
    return account.AccountName; 
  }

  getCurrencyName(ID: number): string {
    const currency = this.currencyList.find(c => c.ID === ID);
    return  currency.CurrencyCode; // Return currency name if found, else return an empty string
  }


  async getCurrency() {
    return new Promise((resolve, rejects) => {
      const payload = { "currencyId": 0, "countryId": 0 };
      let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
      this.dataService.post(service, {}).subscribe((result: any) => {
        if (result.length > 0) {
          this.currencyList = result;
          const entityInfo: any = this.commonDataService.getLocalStorageEntityConfigurable();
          const val = entityInfo['Currency'];
          let info = this.currencyList.find(x => x.Currency.toUpperCase() == val);
          this.companyCurrencyId = info.ID
          this.ProvisionForm.controls['Table1']['controls']['Currency'].setValue(this.companyCurrencyId)
          resolve(true)
        }
      });
    })
  }

  radioChange(event: any, index: number) {
    this.editSelectedIndex = index;
  }

  DynamicGridAddRow() {
 
    const gRow = this.ProvisionForm.value.Table1;
    var validation = "";

    if (gRow.Account === 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account</span></br>"
    }

    if (!gRow.Rate) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Rate</span></br>"
    }

    if (!gRow.Currency) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency </span></br>"
    }

    if (!gRow.Qty) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Qty</span></br>"
    }

    if (!gRow.Amount) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Amount</span></br>"
    }

    if (!gRow.ExchangeRate) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Exchange Rate</span></br>"
    }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }

    const Account = this.AccountList.find(e => { return e.ChartOfAccountsId == gRow.Account })
    const Currency = this.currencyList.find(e => { return e.ID == gRow.Currency })

    gRow.AccountName = Account ? Account.AccountName : '-';
    gRow.CurrencyName = Currency ? Currency.CurrencyCode : '-';

    // gRow.Amount_CCR = Number(gRow.ROE * gRow.Amount_LCR).toFixed(this.entityFraction);

    const AmountCCR = Number(gRow.AmountCCR)
    const value = Number(AmountCCR) + Number(this.TotalAmount)
    this.TotalAmount = Number(value.toFixed(this.entityFraction))
    // this.ProvisionForm.controls['Table']['controls']['Amount'].setValue(value.toFixed(this.entityFraction));

    if (this.isGridEditMode) {
      this.provisionItemsTableList[this.editSelectedIndex] = gRow;
      this.isGridEditMode = !this.isGridEditMode;
      this.clearAccountDetailsForm();
      return;
    } else {
      this.provisionItemsTableList.push(gRow);
      this.clearAccountDetailsForm();
    }


  }

  OnClickEditValue() {
    // console.log('row', row, index)
 
    if (this.editSelectedIndex >= 0 && this.editSelectedIndex != null) {
      const editRow = this.provisionItemsTableList[this.editSelectedIndex];

      this.patchAccountDetailsForm(editRow);
      this.isGridEditMode = !this.isGridEditMode;
    } else {
      Swal.fire('Please select the Item!!');
    }

  }

  clearAccountDetailsForm() {
 
    this.ProvisionForm.controls['Table1']['controls']['ProvisionItemsId'].setValue(0);
    this.ProvisionForm.controls['Table1']['controls']['Account'].setValue(0);
    this.ProvisionForm.controls['Table1']['controls']['Rate'].setValue(0);
    this.ProvisionForm.controls['Table1']['controls']['Qty'].setValue(0);
    this.ProvisionForm.controls['Table1']['controls']['Amount'].setValue('');
    this.ProvisionForm.controls['Table1']['controls']['Currency'].setValue(this.companyCurrencyId);
    this.ProvisionForm.controls['Table1']['controls']['ExchangeRate'].setValue(1);
    this.ProvisionForm.controls['Table1']['controls']['AmountCCR'].setValue(0);
  }

  patchAccountDetailsForm(editRow) {
    this.ProvisionForm.controls['Table1'].patchValue({
      ProvisionItemsId: editRow.ProvisionItemsId
      , Account: editRow.Account
      , Rate: editRow.Rate
      , Qty: editRow.Qty
      , Amount: editRow.Amount
      , Currency: editRow.Currency
      , ExchangeRate: editRow.ExchangeRate
      , AmountCCR: editRow.AmountCCR
    });
    const value = Number(editRow.AmountCCR) - Number(this.TotalAmount)
    this.TotalAmount = Math.abs(Number(value.toFixed(this.entityFraction)))
    // this.ProvisionForm.controls['Table']['controls']['Amount'].setValue(value.toFixed(this.entityFraction));
  }

  DynamicGridDeleteRow() {
    if (this.editSelectedIndex >= 0 && this.editSelectedIndex != null) {
      const AmountCCR = Number(this.provisionItemsTableList[this.editSelectedIndex].AmountCCR)
      const value = AmountCCR - Number(this.TotalAmount)
      this.TotalAmount = Math.abs(Number(value.toFixed(this.entityFraction)))
      // this.ProvisionForm.controls['Table']['controls']['Amount'].setValue(value.toFixed(this.entityFraction));
      this.provisionItemsTableList.splice(this.editSelectedIndex, 1);
      this.editSelectedIndex = null;
      this.clearAccountDetailsForm();
    }
    else {
      Swal.fire('Please select the Item!!');
    }
  }

  async submit(isClosed = false) {
    const validation = this.validationCheck();

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (isClosed) {
          this.ProvisionForm.controls['Table']['controls']['IsClosedProvision'].setValue(1);
          this.ProvisionForm.controls['Table']['controls']['Status'].setValue(3);
          // Retrieve the value of 'Status' form control
          const statusValue = this.ProvisionForm.controls['Table']['controls']['Status'].value;
         // console.log(statusValue);
        } else {
          this.ProvisionForm.controls['Table']['controls']['IsClosedProvision'].setValue(0);
        }
        const payload = this.getFinalPayload();
        console.log('payload', payload);
        // return
        this.savePayment(payload, 'draft');

      } else {

      }
    });

  }

  validationCheck() {
    const Table = this.ProvisionForm.value.Table
    var validation = "";
    if (Table.DivisionId == "" || Table.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (Table.OfficeId == "" || Table.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }

    if (this.provisionItemsTableList.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select atleast one Provision Items </span></br>"
    }

    return validation;
  }


getFinalPayload() {
  // Create a shallow copy of provisionItemsTableList with unnecessary keys removed
  const modifiedTableList = this.provisionItemsTableList.map(item => {
    const { CurrencyName, AccountName, ...rest } = item;
    return rest;
  });

  this.ProvisionForm.controls['Table']['controls']['Amount'].setValue(this.TotalAmount);
  this.ProvisionForm.controls['Table']['controls']['Remarks'].setValue(this.Remarks);

  // Construct the final payload
  const payload = {
    Provision: {
      Table: [this.ProvisionForm.value.Table],
      Table1: modifiedTableList
    }
    // Remarks: this.Remarks,
    // TotalAmount: this.TotalAmount, 
  };

  return payload;
}


  savePayment(payload, type) {
 
    this.provisionService.savePayment(payload).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result.message == "Success") {
        // console.log('result the payment voucher', result);

        Swal.fire(result.message, '', 'success');
        if (type === 'draft') {
          this.isEditMode = false;
         // this.isEditMode1 = true;
          this.provisionId = Number(result.data.Id)
          // this.editView(result.data.Id)
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

  backToMain() {
    this.router.navigate(['/views/provision/provision-view']);
  }

  async finalSubmit() {

    this.validationCheck();

    const validation = this.validationCheck();

    if (validation != "") {
      Swal.fire(validation)
      return false;
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



        await this.autoCodeGeneration('Provision');
        this.updateAutoGenerated();
        const payload = this.getFinalPayload();
        console.log('final payload', payload)
        payload.Provision.Table[0].IsFinal = 1; // set as final
        payload.Provision.Table[0].Status = 2; // ! set save type(draft(1) or final(2) or canceled(3));
        payload.Provision.Table[0].Date = new Date();
        // return
        this.savePayment(payload, 'final');

        // return
        this.savePayment(payload, 'draft');

      } else {

      }
    });

  }
  autoCodeGeneration(event: any) {
    return new Promise(async (resolve, reject) => {
      // if (!this.isUpdate) {
      if (event) {
        let paymentVoucher = this.numberRangeList.filter(x => x.ObjectName == 'Provision');
        if (paymentVoucher.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: paymentVoucher[0].SectionA }, { sectionB: paymentVoucher[0].SectionB }, { sectionC: paymentVoucher[0].SectionC }, { sectionD: paymentVoucher[0].SectionD }], paymentVoucher[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(paymentVoucher[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);

          // if (code) this.ProvisionForm.controls['Number'].setValue(code.trim().toUpperCase());
          if (code) this.ProvisionForm.get('Table.Number').setValue(code.trim().toUpperCase());
          resolve(true);
        }
        else {
          Swal.fire('Please create the auto-generation code for Provision.')
          resolve(true);
        }
      }
      else {
        this.ProvisionForm.controls['Number'].setValue('');
        reject(false);
      }
      // } else {
      //   resolve(true);
      // }
    });
  }


  updateAutoGenerated() {
    let Info = this.numberRangeList.filter(x => x.ObjectName == 'Provision');
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

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (this.ProvisionForm.value.Table.DivisionId && this.ProvisionForm.value.Table.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.ProvisionForm.value.Table.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.ProvisionForm.value.Table.DivisionId);
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

  getNumberRangeList() {
    this.autoGenerationCodeService.getNumberRangeList({ Id: 0 }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
      if (result.message == "Success") {
        this.numberRangeList = result['data'].Table;
        // this.autoCodeGeneration();
       // console.log('numberRangeList', this.numberRangeList)
      }
    })
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
        html: ` Provision is not yet finalized <br> Do you want to still exit ?`,
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

  rateQuantityChangeEvent(event) {
 
    const rate = Number(this.ProvisionForm.controls['Table1']['controls']['Rate'].value)
    const qty = Number(this.ProvisionForm.controls['Table1']['controls']['Qty'].value)
    const exRate = Number(this.ProvisionForm.controls['Table1']['controls']['ExchangeRate'].value)

    const amount = rate * qty;
    this.ProvisionForm.controls['Table1']['controls']['Amount'].setValue(amount.toFixed(this.entityFraction));
    
    const currentAmountValue = Number(this.ProvisionForm.controls['Table1']['controls']['Amount'].value);
    const amountCCR = exRate * currentAmountValue;
    this.ProvisionForm.controls['Table1']['controls']['AmountCCR'].setValue(amountCCR.toFixed(this.entityFraction));
    
    // this.ProvisionForm.controls['Table1']['controls']['Amount'].setValue((rate * qty).toFixed(this.entityFraction))

    // this.ProvisionForm.controls['Table1']['controls']['AmountCCR'].setValue((exRate * qty).toFixed(this.entityFraction))
  }

  changeCurrencyEvent(currencyId: any) {
 
    let entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
    const val = entityInfo['Currency'];
    let info = this.currencyList.find(x => x.Currency.toUpperCase() == val);
   // let info = this.currencyList.find(x => x.Currency == entityInfo['Currency']);
    console.log(this.currencyList , 'Currency List')
    console.log(info , 'info')
    if (info.ID == currencyId) {
      this.ProvisionForm.controls['Table1']['controls']['ExchangeRate'].setValue(1);
      this.IsExchangeEnable = false;
    }
    else {
      this.IsExchangeEnable = true;
    }
  }

}
