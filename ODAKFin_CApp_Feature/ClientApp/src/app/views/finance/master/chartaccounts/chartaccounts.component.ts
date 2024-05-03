import { Currency } from 'src/app/model/Party';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import { MastersService } from 'src/app/services/masters.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

declare let $: any;

@Component({
  selector: 'app-chartaccounts',
  templateUrl: './chartaccounts.component.html',
  styleUrls: ['./chartaccounts.component.css']
})
export class ChartaccountsComponent implements OnInit {

  fg: FormGroup;
  public showPAccount: boolean = false;
  public showBDivision: boolean = false;
  public showPrincipal: boolean = false;
  FormMode: String = "A";
  Account_Code: string = "";

  OrgID: String = '1';
  OrgName: String;

  FillAccountType: any[] = [];
  FillParentAccount: any[] = [];
  FillDivision: any[];
  FillPrincipal: any[] = [];
  FillEntity: any[] = [];
  isUpdateMode: boolean = false;
  isUpdateEnable: boolean = true;
  accountValue: any;
  jobValue: any;
  principalValue: any

  statusvalues: Status[] = new StatusView().statusvalues;
  coaTypeList: any[];
  groupedCoaTypeList: { [key: string]: any[] };
  divisionList: any[];
  ParentAccountList: any[];
  currentSequencyId: any[];
  AccountName: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private CommonService: CommonService,
    private ms: MastersService, private fb: FormBuilder, private ChartaccountService: ChartaccountService,
    private dataService: DataService, private globals: Globals
  ) {
    this.route.params.subscribe(params => {
      this.fg = this.fb.group({ ChartOfAccountsId: params['id'] });
      if (params['id']) {
        this.isUpdateMode = true;
      }
    });
    this.getCoaType();
    this.getDivisionList();
    this.getParentAccountList();
  }
  ngOnInit(): void {
    this.createForm();
    this.OnBindDropdownAccountType();
    this.OnBindDropdownParentAccount();
    this.OnBindDropdownDivision();
    this.OnBindDropdownPrincipal();
    this.OnBindDropdownOrganization();

    if (this.isUpdateMode) {
      this.fg.disable();
    }

    $('.my-select').select2();
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
        const paylod = {
          userID: Number(userID),
          Ref_Application_Id: "4",
          SubfunctionID: 578
        }
        this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
          debugger
          if (data.length > 0) {
            console.log("PermissionObject", data);
    
            if (data[0].SubfunctionID == paylod.SubfunctionID) {
    
              if (data[0].Update_Opt == 2) {
                this.fg.enable();
                this.isUpdateEnable = false
              } else {
                Swal.fire('Please Contact Administrator');
              }
            }
          } else {
            Swal.fire('Please Contact Administrator');
          }
    
        }, err => {
          console.log('errr----->', err.message);
        });
  }

  onBack() {
    this.router.navigate(['/views/finance/master/chartaccounts/chartaccountsView']);
  }

  OnBindDropdownOrganization() {
    this.ms.getoraganzationList(this.fg.value).subscribe(data => {
      this.FillEntity = data["data"]["Table"];
      this.OrgID = data["data"]["Table"][0].OrganizationId;
      this.OrgName = data["data"]["Table"][0].OrganizationName;

      //$('#ddlOrganizationID').val(data["data"]["Table"][0].CompanyIncorporationNo);
      this.fg.value.OrganizationID = data["data"]["Table"][0].OrganizationId;
      this.fg.value.OrganizationName = data["data"]["Table"][0].OrganizationName;
    });
  }

  OnBindDropdownAccountType() {
    this.ChartaccountService.getAccountType().subscribe(data => {
      this.FillAccountType = data["data"];
    });
  }

  OnBindDropdownParentAccount() {
    var queryParams = { "chartOfAccountsID": 0 };
    this.ChartaccountService.getParentAccount(queryParams).subscribe(data => {
      this.FillParentAccount = data["data"];
    });
  }

  OnBindDropdownDivision() {
    this.ChartaccountService.getDivision().subscribe(data => {
      this.FillDivision = data["data"];
    });
  }

  OnBindDropdownPrincipal() {
    var queryParams = { "principalID": 0 };
    this.ChartaccountService.getPrincipal(queryParams).subscribe(data => {
      this.FillPrincipal = data["data"];
    });
  }



  createForm() {
    if (this.fg.value.ChartOfAccountsId != null) {
      this.FormMode = "B";
      var queryParams = { "ChartOfAccountsId": this.fg.value.ChartOfAccountsId }
      this.ChartaccountService.getChartaccountbyId(queryParams).pipe().subscribe(data => {
        this.fg.patchValue(data["data"][0]);
        this.fg.get('IsActive').patchValue(data['data'][0]['IsActive'] === true ? 'true' : 'false');
        this.AccountName = data["data"][0].AccountName;

        // this.CreatedOn
        // this.CreatedBy
        // this.ModifiedOn
        // ModifiedBy

        //this.fg.value.CurrencyPairID=data["data"][0]["CurrencyPairId"];
        this.showPAccount = this.fg.value.IsSubAccount != 0 ? true : false;
        this.showBDivision = this.fg.value.IsJobAccount != 0 ? true : false;
        this.showPrincipal = this.fg.value.IsPrincipal != 0 ? true : false;
        //this.fg.controls.AccountTypeID.setValue(data['data']['AccountTypeID']);
        // this.fg.controls.AccountName.setValue(data["data"][0].AccountNameId);
      });

      this.fg = this.fb.group({
        ID: 0,
        ChartOfAccountsId: '',
        OrganizationID: localStorage.getItem('OrgId') ? localStorage.getItem('OrgId') : this.OrgID,
        OrganizationName: '',
        AccountTypeID: '0',
        AccountCode: '',
        AccountName: '',//ACC 01
        IsSubAccount: '',
        ParentAccountID: '',
        ParentAccount: '',
        IsJobAccount: '',
        DivisionId: '',
        DivisionName: '',
        IsPrincipal: '',
        PrincipalID: '',
        Principal: '',
        Remarks: '',
        IsActive: '',
        Status: '',
        ShortName: '',
        SequenceId: 0
      });
    }
    else {
      this.fg = this.fb.group({
        ID: 0,
        ChartOfAccountsId: '0',
        //AccountName: new FormControl({value: '1', disabled: true}, Validators.required),
        OrganizationID: localStorage.getItem('OrgId') ? localStorage.getItem('OrgId') : this.OrgID,
        OrganizationName: '',
        AccountTypeID: '0',
        AccountCode: '',
        AccountName: '',//ACC 01
        IsSubAccount: 'false',
        ParentAccountID: '',
        ParentAccount: '',
        IsJobAccount: 'false',
        DivisionId: '',
        DivisionName: '',
        IsPrincipal: 'false',
        PrincipalID: '',
        Principal: '',
        Remarks: '',
        IsActive: '',
        Status: '',
        ShortName: '',
        SequenceId: 0
      });
    }

  }

  onSubmit() {

    var validation = "";
    //commented due to conditions are validated in backend itself so here we not validated
    
    // if (!this.isUpdateMode) {
    //   // var data = this.ParentAccountList.filter(x => x.AccountName.toLowerCase() == this.fg.value.AccountName.toLowerCase());
    //   var data = this.ParentAccountList.filter(x => 
    //     x.AccountName.toLowerCase() == this.fg.value.AccountName.toLowerCase() &&
    //     x.AccountTypeId == this.fg.value.AccountTypeID
    // );
    
    // }
    // else if (this.isUpdateMode) {
    //   let removedCurrentAccount = this.ParentAccountList.filter(x => x.AccountName != this.AccountName)
    //   var data = removedCurrentAccount.filter(x => x.AccountName.toLowerCase() == this.fg.value.AccountName.toLowerCase());
    // }

    // if (data.length > 0) {
    //   debugger
    //   validation += "<span style='color:red;'>*</span> <span>Already account name exits!!</span></br>"
    //   return Swal.fire('', validation, 'warning');
    // }

    //     this.fg.value.AccountCode = $('#txtAcctCode').val();
    // console.log( $('#txtAcctCode').val());
    //     if (this.fg.value.AccountCode == "") {
    //       validation += "<span style='color:red;'>*</span> <span>Please Enter Entity value </span></br>"
    //     }

    var ddlAccType = this.fg.value.AccountTypeID;
    // var ddlActive = (Number($('#ddlStatus').val()));


    if (ddlAccType == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select account type</span></br>"
    }

    if (this.fg.value.AccountCode == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter account code </span></br>"
    }

    if (this.fg.value.AccountName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter account name </span></br>"
    }


    if (this.fg.value.ShortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Short Name </span></br>"
    }

    // if (ddlActive == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Active</span></br>"
    // }


    if (this.fg.value.IsSubAccount == true) {
      var ddlPAccount = $('#ddlPAccount').val();
      if (ddlPAccount == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select parent account</span></br>"
      }
    }

    if (this.fg.value.IsJobAccount == true) {
      var ddlBusinessDivision = $('#ddlBusinessDivision').val();
      if (ddlBusinessDivision == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select business division</span></br>"
      }
    }

    if (this.fg.value.IsPrincipal == true) {
      var ddlPrincipalAccount = $('#ddlPrincipalAccount').val();
      if (ddlPrincipalAccount == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select principal</span></br>"
      }
    }

    var ddlStatus = $('#ddlIsActive').val();
    if (ddlStatus == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select status</span></br>"
    }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }
    else {

      let queryParams = {
        "ChartOfAccountID": this.fg.value.ChartOfAccountsId,
        "OrganizationID": this.fg.value.OrganizationID,
        "AccountTypeID": this.fg.value.AccountTypeID,
        "AccountCode": this.fg.value.AccountCode,
        "AccountName": this.fg.value.AccountName,
        "IsSubAccount": this.fg.value.IsSubAccount,
        "ParentAccountID": this.fg.value.IsSubAccount ? this.fg.value.ParentAccountID : 0,
        "IsJobAccount": this.fg.value.IsJobAccount,
        "DivisionId": this.fg.value.IsJobAccount ? this.fg.value.DivisionId : 0,
        "IsPrincipal": this.fg.value.IsPrincipal,
        "PrincipalID": this.fg.value.IsPrincipal ? this.fg.value.PrincipalID : 0,
        "Remarks": this.fg.value.Remarks,
        "IsActive": this.fg.value.IsActive == 'true' ? true : false,
        "ShortName": this.fg.value.ShortName,
        "AccountNameId": 0,
        "SequenceId": this.fg.value.currentSequencyId ? this.fg.value.currentSequencyId : 0,
      };


      Swal.fire({
        showCloseButton: true,
        title: '',
        icon: 'question',
        text: 'Do you want to save this Details?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false,
      })
        .then((result) => {
          if (result.value) {
            //-------

            this.ChartaccountService.SaveChartaccount(queryParams).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.onBack();
                  }
                })
              }
            },
              (error: HttpErrorResponse) => {
                Swal.fire(error.message, 'error')
              });
            //-------
          }
          //console.log('cancel');
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
    })
      .then((result) => { if (result.value) this.onBack(); });
  }

  AccountCodegen(typeval) {
    if (this.fg.value.AccountTypeID != 0) {
      var queryParams = { "AccountTypeID": this.fg.value.AccountTypeID };
      this.ChartaccountService.getChartOfAccountCode(queryParams).subscribe(data => {
        this.Account_Code = data["data"];
        // console.log(data["data"]);

        //this.fg.controls.Account_Code.setValue(data['data']);
        //$('#txtAcctCode').val(data["data"]);
        //console.log( $('#txtAcctCode').val())
      });
    }
    else { this.Account_Code = "" }
  }

  //#region CheckBox_Event
  marked = false;
  IsSubAccountChange(e) {
    this.marked = e.target.checked;

    if (this.marked == true) {
      this.showPAccount = true;
    }
    else {
      this.showPAccount = false;
    }
  }

  JobAccountChange(e) {
    this.marked = e.target.checked;

    if (this.marked == true) {
      this.showBDivision = true;
    }
    else {
      this.showBDivision = false;
    }
  }

  PrincipalAcctChange(e) {
    this.marked = e.target.checked;

    if (this.marked == true) {
      this.showPrincipal = true;
    }
    else {
      this.showPrincipal = false;
    }
  }


  accountsChanged(event: any) {
    this.accountValue = event === 'true' ? true : false;
    if (!this.accountValue) {
      this.fg.controls['ParentAccountID'].setValue('');
    }
  }

  jobChanged(event: any) {
    this.jobValue = event === 'true' ? true : false;
    if (!this.jobValue) {
      this.fg.controls['DivisionId'].setValue('');
    }
  }
  principalChanged(event: any) {
    this.principalValue = event === 'true' ? true : false;
    if (!this.principalValue) {
      this.fg.controls['PrincipalID'].setValue('');
    }
  }

  getCoaType() {
    var service: any = `${this.globals.APIURL}/COAType/GetCOATypeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.coaTypeList = [];
      if (result.data.Table.length > 0) {
        this.coaTypeList = result.data.Table;

        this.groupedCoaTypeList = this.groupDataByCEOGroupId(this.coaTypeList);
      }
    }, error => {
      console.error(error);
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

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) { this.divisionList = result.data.Table; }
    }, error => { });
  }

  getParentAccountList() {
    var service = `${this.globals.APIURL}/ChartOfAccounts/GetChartAccountName`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.ParentAccountList = [];
      if (result.data.length > 0) { this.ParentAccountList = result.data; }
    }, error => { });
  }

  accountTypeChanged(event: any) {
    if (!this.isUpdateMode) {
      var service = `${this.globals.APIURL}/ChartOfAccounts/GetCOACurrentNumber`; var payload: any = { COATypeId: event }
      this.dataService.post(service, payload).subscribe((result: any) => {
        if (result.data.length > 0) {
          this.currentSequencyId = result.data[0].SequenceId;
          if (!this.isUpdateMode) { this.fg.controls['AccountCode'].setValue(result.data[0].CurrentNumber); }
          else {
            // if (result.data[0].FromNumber != Number(result.data[0].CurrentNumber)) {
            //   this.fg.controls['AccountCode'].setValue(Number(result.data[0].CurrentNumber) + 1);
            // }
            // else {
            this.fg.controls['AccountCode'].setValue(Number(result.data[0].CurrentNumber));
            // }
          }
        }
        else {
          this.fg.controls['AccountCode'].setValue('');
        }
      }, error => { });
    }
  }

  // onSearchChange(event: any) {
  //   let data = this.ParentAccountList.filter(x => x.AccountName.toLowerCase() == event.toLowerCase());
  //   if (data.length > 0) {
  //     let validation = '';
  //     validation += "<span style='color:red;'>*</span> <span>Already account name exits!!</span></br>"
  //     Swal.fire('', validation, 'warning');
  //   }
  // }

}

