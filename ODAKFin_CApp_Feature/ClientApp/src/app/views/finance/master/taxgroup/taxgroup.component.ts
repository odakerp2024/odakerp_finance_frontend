import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PurchasesTaxGroupBifurication, SalesTaxGroupBifurication, TaxGroup, TaxGroupBasic, TaxGroupBifurication, TaxGroupBifuricationLable, TaxGroupIdModel, TaxGroupModel } from 'src/app/model/TaxGoupModel';
import { Status, StatusView } from 'src/app/model/common';
import { GetAssociatedType, GetAssociatedTypeSearch, GetSales, GetSalesSearch, GetTaxgroup, GettaxTypeSearch, TaxBifurcationClass } from 'src/app/model/taxgroup';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { TaxgroupService } from 'src/app/services/taxgroup.service';
import { UtilityService } from 'src/app/services/utility';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taxgroup',
  templateUrl: './taxgroup.component.html',
  styleUrls: ['./taxgroup.component.css'],
  providers: [DatePipe]
})

export class TaxgroupComponent implements OnInit {

  AccTypeassociated: GetAssociatedType[];

  AccTypegroup: GetTaxgroup[];
  TaxtypeLook: GettaxTypeSearch;

  AssociatedLook: GetAssociatedTypeSearch;
  AccTypesales: GetSales[];
  purchaseList: GetSales[];
  SalesLook: GetSalesSearch = new GetSalesSearch();
  searchForm: FormGroup;
  TaxBifurcationList: TaxBifurcationClass[] = [];
  taxGroupModel: TaxGroup = new TaxGroup();
  taxGroupBifuricationLable: TaxGroupBifuricationLable[] = [];
  saleTaxGroupLable: TaxGroupBifuricationLable[] = [];
  purchaseTaxGroupLable: TaxGroupBifuricationLable[] = [];
  salesSelection: String;
  editGroupId: Number = 0;
  salesFieldReadonly: boolean = true;
  purFieldReadonly: boolean = true;
  isUpdateEnable: boolean = false;
  isUpdate: boolean = false;
  isCreate: boolean = true;
  taxGroupId: number = 0;
  Table1: any;
  CreatedOn: any;
  ModifiedOn: any;
  CreatedBy: any;
  ModifiedBy: unknown;
  statusvalues: Status[] = new StatusView().statusvalues;
  autoGenerateCodeList: any[];
  TaxTypeList: any = [];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  searchData : any ;

  constructor(private router: Router, private route: ActivatedRoute, private service: TaxgroupService, private fb: FormBuilder,
    private globals: Globals, private dataService: DataService, private datePipe: DatePipe,
    private utilityService: UtilityService,
    private autoCodeService: AutoCodeService,
    public commonDataService: CommonService
  ) {
    this.getNumberRange();
    // this.route.queryParams.subscribe(params => {
    //   this.searchForm = this.fb.group({
    //     ID: params['id']
    //   });
    // });
  }

  ngOnInit(): void {
    this.createForm();
    this.OnBindDropdownAssociated();
    // this.OnBindDropdownSales();
    // this.OnBindDropdownPurchase();
    // if (this.route.snapshot.params['id'] > 0) {
    //   this.editGroupId = this.route.snapshot.params['id'];
    this.getTaxGroupDetails(this.editGroupId);
    // }
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.taxGroupId = param.id;
        this.isUpdate = param.isCreate;
        this.isCreate = false;
        this.searchForm.disable();
        this.getTaxGroup(param.id);
      }
    })
  }

  createForm() {
    this.searchForm = this.fb.group({
      taxGroup: null,
      taxGroupName: "",
      shortName: "",
      TaxType: "",
      effectiveDate: "",
      Status: '',
      taxRate: "",
      asso1: "",
      asso2: "",
      asso3: ""
    });
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 587
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2) {
            this.searchForm.enable();
            this.isUpdateEnable = true;
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
        if (result.value) { this.router.navigate(['/views/finance/master/taxgroup/taxgroupview']); }
        ////console.log('cancel');
      });
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]

  }
  // OnBindDropdownAssociated() {
  //   this.AssociatedLook = { "TaxTypeId": 0, };
  //   //console.log(this.AssociatedLook);

  //   this.service.gettaxgroupLists(this.AssociatedLook).subscribe(response => {
  //     this.AccTypeassociated = response['data'].Table;
  //     //console.log(this.AccTypeassociated )

  //   });
  // }
    OnBindDropdownAssociated() {
    
    this.searchData = {"taxTypeName":"","ShortName":"","IsActive":1};
    //console.log(this.AssociatedLook);

    this.service.getassociatedFilter(this.searchData).subscribe(response => {
      this.AccTypeassociated = response['data'].Table;


    });
  }

  OnBindDropdowntax() {
    this.AssociatedLook = { "TaxTypeId": this.searchForm.value.TaxType };

    if (!this.isUpdate) {
      this.searchForm.controls['asso1'].setValue('');
      this.searchForm.controls['asso2'].setValue('');
      this.searchForm.controls['asso3'].setValue('');
      this.searchForm.controls['taxRate'].setValue('');
    }

    //console.log(this.AssociatedLook);
    let TaxGroup = "";
    this.taxGroupBifuricationLable = [];
    this.saleTaxGroupLable = [];
    this.purchaseTaxGroupLable = [];
    this.service.gettaxgroupList(this.AssociatedLook).subscribe(response => {
      this.TaxTypeList = [];
      if (response['data'].Table1.length > 0) {
        this.TaxTypeList = response['data'].Table1;
        // response['data'].Table1.forEach(element => {
        //   let tempBifurication = new TaxGroupBifuricationLable();
        //   tempBifurication.AssociatedTaxTypeId = element.AssociatedTaxTypeId;
        //   tempBifurication.TaxBifurcation = 0.0;
        //   tempBifurication.AssociatedTaxTypeLable = element.AssociatedTaxTypeName;
        //   this.taxGroupBifuricationLable.push(tempBifurication)
        //TaxGroup+=element.AssociatedTaxTypeName+",";
        // });
        // //console.log(TaxGroup)
        // this.searchForm.controls.TaxGroup.setValue(TaxGroup);
        // this.saleTaxGroupLable = JSON.parse(JSON.stringify(this.taxGroupBifuricationLable));
        // this.purchaseTaxGroupLable = JSON.parse(JSON.stringify(this.taxGroupBifuricationLable));
        //console.log( this.saleTaxGroupLable)
      }
    });
    //this.getCountryFinancialYear();
  }
  OnBindDropdowntaxEmpty() {
    this.AssociatedLook = { "TaxTypeId": this.searchForm.value.TaxType };
    //console.log(this.AssociatedLook);
    let TaxGroup = "";
    let temptaxGroupBifuricationLable = [];
    this.service.gettaxgroupList(this.AssociatedLook).subscribe(response => {
      if (response['data'].Table1.length > 0) {

        response['data'].Table1.forEach(element => {
          let tempBifurication = new TaxGroupBifuricationLable();
          tempBifurication.AssociatedTaxTypeId = element.AssociatedTaxTypeId;
          tempBifurication.TaxBifurcation = 0.0;
          tempBifurication.AssociatedTaxTypeLable = element.AssociatedTaxTypeName;
          tempBifurication.TaxGroupId = this.editGroupId;
          temptaxGroupBifuricationLable.push(tempBifurication)

          //TaxGroup+=element.AssociatedTaxTypeName+",";
        });
        //console.log(temptaxGroupBifuricationLable)
        // this.searchForm.controls.TaxGroup.setValue(TaxGroup);
        this.saleTaxGroupLable = JSON.parse(JSON.stringify(temptaxGroupBifuricationLable));
        // this.purchaseTaxGroupLable = JSON.parse(JSON.stringify(temptaxGroupBifuricationLable));
        //console.log( this.saleTaxGroupLable)
      }
    });
    //this.getCountryFinancialYear();
  }
  OnBindDropdowntaxPurchaseEmpty() {
    this.AssociatedLook = { "TaxTypeId": this.searchForm.value.TaxType };
    //console.log('=>',this.AssociatedLook);
    let TaxGroup = "";
    let temptaxGroupBifuricationLable = [];
    this.service.gettaxgroupList(this.AssociatedLook).subscribe(response => {
      if (response['data'].Table1.length > 0) {

        response['data'].Table1.forEach(element => {
          let tempBifurication = new TaxGroupBifuricationLable();
          tempBifurication.AssociatedTaxTypeId = element.AssociatedTaxTypeId;
          tempBifurication.TaxBifurcation = 0.0;
          tempBifurication.AssociatedTaxTypeLable = element.AssociatedTaxTypeName;
          tempBifurication.TaxGroupId = this.editGroupId;
          console.log(tempBifurication)
          temptaxGroupBifuricationLable.push(tempBifurication)
          //TaxGroup+=element.AssociatedTaxTypeName+",";
        });
        // //console.log(TaxGroup)
        // this.searchForm.controls.TaxGroup.setValue(TaxGroup);
        //this.saleTaxGroupLable = JSON.parse(JSON.stringify(temptaxGroupBifuricationLable));
        this.purchaseTaxGroupLable = JSON.parse(JSON.stringify(temptaxGroupBifuricationLable));
        console.log(this.purchaseTaxGroupLable)
      }
    });
    //this.getCountryFinancialYear();
  }
  OnEditBindDropdowntax(taxBifurcationData, taxAccountlinkData) {
    this.AssociatedLook = { "TaxTypeId": this.searchForm.value.TaxType };
    //console.log(this.AssociatedLook);
    let TaxGroup = "";
    this.service.gettaxgroupList(this.AssociatedLook).subscribe(response => {
      if (response['data'].Table1.length > 0) {

        response['data'].Table1.forEach(element => {
          if (taxBifurcationData.length > 0) {
            taxBifurcationData.forEach((bifurication) => {
              if (bifurication.AssociatedTaxTypeId == element.AssociatedTaxTypeId) {
                let tempBifurication = new TaxGroupBifuricationLable();
                tempBifurication.AssociatedTaxTypeId = element.AssociatedTaxTypeId;
                tempBifurication.TaxBifurcation = bifurication.TaxBifurcation;
                tempBifurication.TaxBifurcationId = bifurication.TaxBifurcationId;
                tempBifurication.TaxGroupId = this.editGroupId;
                tempBifurication.AssociatedTaxTypeLable = element.AssociatedTaxTypeName;
                this.taxGroupBifuricationLable.push(tempBifurication)
              }
            })
          }

        });
        // //console.log(TaxGroup)
        // this.searchForm.controls.TaxGroup.setValue(TaxGroup);

        let temptaxGroupBifuricationLable = JSON.parse(JSON.stringify(this.taxGroupBifuricationLable));
        let tempSalesData = {};
        let tempPurData = {};
        taxAccountlinkData.forEach(element => {
          if (element.TaxGroupAccountType == "S") {
            if (!tempSalesData.hasOwnProperty(element.AssociatedTaxTypeId)) {
              tempSalesData[element.AssociatedTaxTypeId] = element.TaxGroupAccountDetail;
            }
          }
          if (element.TaxGroupAccountType == "P") {
            if (!tempPurData.hasOwnProperty(element.AssociatedTaxTypeId)) {
              tempPurData[element.AssociatedTaxTypeId] = element.TaxGroupAccountDetail;
            }

          }
        });
        /* //console.log(tempSalesData)
         //console.log(tempPurData)*/
        let tempSalesBifuricationData = []
        temptaxGroupBifuricationLable.forEach((element) => {
          ////console.log(element.AssociatedTaxTypeId.valueOf())
          if (tempSalesData.hasOwnProperty(element.AssociatedTaxTypeId.valueOf())) {
            element.TaxBifurcation = tempSalesData[element.AssociatedTaxTypeId.valueOf()];
            tempSalesBifuricationData.push(JSON.parse(JSON.stringify(element)))
          }
        })
        let tempPurchaseBifuricationData = []
        temptaxGroupBifuricationLable.forEach((element) => {
          if (tempPurData.hasOwnProperty(element.AssociatedTaxTypeId.valueOf())) {
            element.TaxBifurcation = tempPurData[element.AssociatedTaxTypeId.valueOf()];
            tempPurchaseBifuricationData.push(JSON.parse(JSON.stringify(element)))
          }
        })
        // //console.log(tempSalesBifuricationData);
        if (tempSalesBifuricationData.length > 0) {
          this.saleTaxGroupLable = JSON.parse(JSON.stringify(tempSalesBifuricationData));
        }
        else {
          this.OnBindDropdowntaxEmpty();
        }
        if (tempPurchaseBifuricationData.length > 0) {
          this.purchaseTaxGroupLable = JSON.parse(JSON.stringify(tempPurchaseBifuricationData));
        }
        else {
          this.OnBindDropdowntaxPurchaseEmpty();
        }



      }
    });
    //this.getCountryFinancialYear();
  }

  OnBindDropdownSales() {
    this.SalesLook.MainGroupID = 2;
    // this.SalesLook={"ChartOfAccountsId":0,"OrganizationName":"","MainGroupID":2,"AccountTypeID":0,"AccountCode":"","AccountName":"","IsSubAccount":0,"ParentAccount":"", "IsJobAccount":0,"DivisionName":"", "IsPrincipal":0,"Principal":"","Remarks":"","IsActive":1};
    //console.log(this.SalesLook);

    this.service.getSales(this.SalesLook).subscribe(data => {
      this.AccTypesales = data['data'];
      ////console.log(this.AccTypesales )

    });
  }
  OnBindDropdownPurchase() {
    this.SalesLook.MainGroupID = 1;
    // this.SalesLook={"ChartOfAccountsId":0,"OrganizationName":"","MainGroupID":2,"AccountTypeID":0,"AccountCode":"","AccountName":"","IsSubAccount":0,"ParentAccount":"", "IsJobAccount":0,"DivisionName":"", "IsPrincipal":0,"Principal":"","Remarks":"","IsActive":1};
    //console.log(this.SalesLook);

    this.service.getSales(this.SalesLook).subscribe(data => {
      this.purchaseList = data['data'];
      //console.log(this.AccTypesales )

    });
  }
  onSaleSection() {
    console.log(this.searchForm.get('Sales').value);
    if (this.searchForm.get('Sales').value.length == 0) {
      this.saleTaxGroupLable.forEach((element) => {
        element.TaxBifurcation = null;
      });
      this.salesFieldReadonly = true;

    }
    else {
      this.salesFieldReadonly = false;
    }
  }
  onPurchaseSection() {
    //console.log(this.searchForm.get('Purchases').value);
    if (this.searchForm.get('Purchases').value.length == 0) {
      this.purchaseTaxGroupLable.forEach((element) => {
        element.TaxBifurcation = null;
      });
      this.purFieldReadonly = true;
    }
    else {
      this.purFieldReadonly = false;
    }
  }
  salesAssociateRemove(id) {
    if (this.saleTaxGroupLable.length == 1) {
      Swal.fire("Minimum one tax group type value required !");
      return false;
    }
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to remove this type?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.value) {
          this.saleTaxGroupLable.forEach((element, index) => {
            if (element.AssociatedTaxTypeId == id) {
              this.saleTaxGroupLable.splice(index, 1);
              //delete  this.saleTaxGroupLable[index];
            }
          })
        }
        ////console.log('cancel');
      });
  }
  purchaseAssociateRemove(id) {
    if (this.purchaseTaxGroupLable.length == 1) {
      Swal.fire("Minimum one tax group type value required !");
      return false;
    }
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to remove this type?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.value) {
          this.purchaseTaxGroupLable.forEach((element, index) => {
            if (element.AssociatedTaxTypeId == id) {
              this.purchaseTaxGroupLable.splice(index, 1);
              //delete  this.saleTaxGroupLable[index];
            }
          })
        }
        ////console.log('cancel');
      });
  }
  onSubmit() {
    //console.log(this.taxGroupModel)
    var validation = "";
    let step1 = false;
    let step2 = false;
    let step3 = false;
    if (!this.searchForm.value.TaxType || this.searchForm.value.TaxType <= 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Tax Type</span></br>"
    }
    if (!this.searchForm.value.TaxRates || this.searchForm.value.TaxRates == "" || this.searchForm.value.TaxRates < 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Tax Rate</span></br>"
    }
    if (!this.searchForm.value.TaxGroup || this.searchForm.value.TaxGroup == "" || this.searchForm.value.TaxGroup < 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Tax Group</span></br>"
    }
    this.taxGroupBifuricationLable.forEach((element) => {
      if (Number(element.TaxBifurcation) <= 0 && step1 == false) {
        step1 = true;
      }
    })


    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    let taxGroupBasic = new TaxGroupBasic();
    taxGroupBasic.TaxGroupName = this.searchForm.value.TaxGroup;
    taxGroupBasic.TaxTypeId = Number(this.searchForm.value.TaxType)
    taxGroupBasic.TaxRate = Number(this.searchForm.value.TaxRates)
    taxGroupBasic.TaxGroupId = Number(this.editGroupId);
    this.taxGroupModel.TaxGroup.Table.push(taxGroupBasic)

    this.taxGroupBifuricationLable.forEach((element) => {
      let temp = JSON.parse(JSON.stringify(element));
      delete temp.AssociatedTaxTypeLable;
      temp.TaxGroupId = Number(this.editGroupId);
      this.taxGroupModel.TaxGroup.Table1.push(temp);
    })
    if (this.searchForm.get('Sales').value) {
      this.searchForm.get('Sales').value.forEach(element => {
        let tempSales = new SalesTaxGroupBifurication();
        tempSales.TaxGroupAccountType = "S";
        tempSales.ChartOfAccountsId = element;
        tempSales.TaxGroupId = Number(this.editGroupId);
        this.taxGroupModel.TaxGroup.Table2.push(tempSales);

        this.saleTaxGroupLable.forEach((value) => {
          let tempValue = new PurchasesTaxGroupBifurication();
          tempValue.TaxGroupAccountType = tempSales.TaxGroupAccountType;
          tempValue.TaxGroupAccountDetail = Number(value.TaxBifurcation)
          tempValue.AssociatedTaxTypeId = Number(value.AssociatedTaxTypeId);
          tempValue.TaxGroupId = Number(this.editGroupId);
          this.taxGroupModel.TaxGroup.Table3.push(tempValue);
        })

      });
    }
    //console.log(this.taxGroupModel.TaxGroup.Table2)
    if (this.searchForm.get('Purchases').value) {
      this.searchForm.get('Purchases').value.forEach(element => {
        let tempSales1 = new SalesTaxGroupBifurication();
        tempSales1.TaxGroupAccountType = "P";
        tempSales1.ChartOfAccountsId = element;
        tempSales1.TaxGroupId = Number(this.editGroupId);
        this.taxGroupModel.TaxGroup.Table2.push(tempSales1);
        this.purchaseTaxGroupLable.forEach((value) => {
          let tempValue = new PurchasesTaxGroupBifurication();
          tempValue.TaxGroupAccountType = tempSales1.TaxGroupAccountType;
          tempValue.TaxGroupAccountDetail = Number(value.TaxBifurcation)
          tempValue.AssociatedTaxTypeId = Number(value.AssociatedTaxTypeId);
          tempValue.TaxGroupId = Number(this.editGroupId);
          this.taxGroupModel.TaxGroup.Table3.push(tempValue);
        })
      });
    }
    //console.log(this.taxGroupModel)
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

          this.service.saveTaxGroup(this.taxGroupModel).subscribe(response => {
            //this.FinancialForm.reset();
            Swal.fire(response['data'])
            //Swal.fire(response[0].AlertMessage)
            if (response["message"] == "Failed") { Swal.fire(response["data"], '', 'error') }
            else {
              Swal.fire(response["data"], '', 'success').then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  this.onBack();
                }
              })
            }
            this.router.navigate(['/views/finance/master/taxgroup/taxgroupview']);
          },
            (error: HttpErrorResponse) => {
              Swal.fire(error.message)
            });
        }
        ////console.log('cancel');
      });
  }
  onBack() {
    this.router.navigate(['/views/finance/master/taxgroup/taxgroupview']);
  }

  getTaxGroupDetails(editGroupId: Number) {
    let taxGroupIdModel = new TaxGroupIdModel();
    taxGroupIdModel.TaxGroupId = editGroupId;
    this.service.getTaxGroupDetails(taxGroupIdModel).subscribe(response => {

      let taxGroupInfo = response['data'].Table[0];
      let taxGroup = response['data'].Table1;
      this.searchForm.patchValue({

        taxGroup: '',
        taxGroupName: taxGroupInfo.TaxGroupName,
        // shortName: taxGroupInfo.ShortName,
        TaxType: taxGroupInfo.TaxTypeId,
        // effectiveDate: taxGroupInfo,
        Status: taxGroupInfo.Active == 'Inactive' ? 'false' : 'true',
        taxRate: taxGroupInfo.TaxRate,
        asso1: taxGroup[0] ? taxGroup[0].TaxBifurcation : '',
        asso2: taxGroup[1] ? taxGroup[1].TaxBifurcation : '',
        asso3: taxGroup[2] ? taxGroup[2].TaxBifurcation : ''
      });

      // this.searchForm.controls.TaxType.setValue(response['data'].Table[0].TaxTypeId);
      // this.searchForm.controls.TaxRates.setValue(response['data'].Table[0].TaxRate);
      // this.searchForm.controls.TaxGroup.setValue(response['data'].Table[0].TaxGroupName)

      let tempSalesAccount = [];
      let tempPurchaseAccount = [];



      response['data'].Table2.forEach(element => {
        if (element.TaxGroupAccountType == "S") {
          this.salesFieldReadonly = false;
          tempSalesAccount.push(element.ChartOfAccountsId)
        }
      });

      this.searchForm.controls.Sales.setValue(tempSalesAccount);
      response['data'].Table2.forEach(element => {
        if (element.TaxGroupAccountType == "P") {
          this.purFieldReadonly = false;
          tempPurchaseAccount.push(element.ChartOfAccountsId)
        }
      });
      this.salesFieldReadonly = false;
      // if(response['data'].Table3.length==0){
      //{ this.salesFieldReadonly = true;}

      //}
      this.searchForm.controls.Purchases.setValue(tempPurchaseAccount);
      console.log(response['data'].Table3)
      /* if(response['data'].Table2.length==0)
         {
           this.OnBindDropdowntaxEmpty();
         }
         if(response['data'].Table3.length==0){ this.OnBindDropdowntaxEmpty();}
         else if(response['data'].Table2.length>0 && response['data'].Table3.length>0){

         }*/
      this.OnEditBindDropdowntax(response['data'].Table1, response['data'].Table3);
    });
  }



  saveTaxGroup() {
    // 
    var validation = "";
    let step1 = false;
    let step2 = false;
    let step3 = false;

    // if (!this.searchForm.value.taxGroup || this.searchForm.value.taxGroup == "" || this.searchForm.value.taxGroup < 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Tax Group</span></br>"
    // }
    if (!this.searchForm.value.taxGroupName || this.searchForm.value.taxGroupName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Tax Group Name</span></br>"
    }
    if (!this.searchForm.value.shortName || this.searchForm.value.shortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Short Name</span></br>"
    }
    if (!this.searchForm.value.TaxType || this.searchForm.value.TaxType <= 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Tax Name</span></br>"
    }
    if (!this.searchForm.value.effectiveDate || this.searchForm.value.effectiveDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Effective Date</span></br>"
    }
    if (!this.searchForm.value.Status || this.searchForm.value.Status == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Status</span></br>"
    }
    if (!this.searchForm.value.taxRate || this.searchForm.value.taxRate == "" || this.searchForm.value.taxRate < 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Tax Rate</span></br>"
    }

    this.taxGroupBifuricationLable.forEach((element) => {
      if (Number(element.TaxBifurcation) <= 0 && step1 == false) {
        step1 = true;
      }
    })

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    if (this.TaxTypeList.length == 3) {
      let totalTax = Number(this.searchForm.value.asso1) + Number(this.searchForm.value.asso2);
      if (totalTax != Number(this.searchForm.value.taxRate)) { return Swal.fire("Associated taxes differ from tax rates."); }
    }
    else if (this.TaxTypeList.length == 2) {
      if (this.TaxTypeList[1].AssociatedTaxTypeName == 'IGST') {
        if (Number(this.searchForm.value.asso1) != Number(this.searchForm.value.taxRate)) { return Swal.fire("Associated taxes differ from tax rates."); }
      }
      else {
        let totalTax = Number(this.searchForm.value.asso1) + Number(this.searchForm.value.asso2);
        if (totalTax != Number(this.searchForm.value.taxRate)) { return Swal.fire("Associated taxes differ from tax rates."); }
      }
    }
    else if (this.TaxTypeList.length == 1) {
      if (this.TaxTypeList[0].AssociatedTaxTypeName != 'IGST') {
        if (Number(this.searchForm.value.asso1) != Number(this.searchForm.value.taxRate)) { return Swal.fire("Associated taxes differ from tax rates."); }
      }
    }

    let info = this.searchForm.value;
    if (this.isUpdate) {
      var taxBifurcation = this.Table1[0] ? this.Table1[0].TaxBifurcation : 0;
      var taxBifurcation01 = this.Table1[1] ? this.Table1[1].TaxBifurcation : 0;
      var taxBifurcation02 = this.Table1[2] ? this.Table1[2].TaxBifurcation : 0;
    }

    let payload: any = {
      TaxGroup: {
        Table: [{
          TaxGroupId: this.taxGroupId ? this.taxGroupId : 0,
          TaxGroupName: info.taxGroupName,
          TaxTypeId: info.TaxType,
          TaxRate: info.taxRate,
          IsActive: info.Status == 'true'? true: false,
          CreatedBy: localStorage.getItem('UserID'),
          CreatedOn: new Date(),
          UpdatedBy: localStorage.getItem('UserID'),
          TaxGroupCode: info.taxGroup,
          EffectiveDate: info.effectiveDate,
          ShortName: info.shortName
        }],
        Table1: [{
          TaxBifurcationId: taxBifurcation ? taxBifurcation : 0,
          TaxGroupId: this.taxGroupId ? this.taxGroupId : 0,
          AssociatedTaxTypeId: info.TaxType,
          TaxBifurcation: info.asso1 ? info.asso1 : 0
        },
        {
          TaxBifurcationId: taxBifurcation01 ? taxBifurcation01 : 0,
          TaxGroupId: this.taxGroupId ? this.taxGroupId : 0,
          AssociatedTaxTypeId: info.TaxType,
          TaxBifurcation: info.asso2 ? info.asso2 : 0
        },
        {
          TaxBifurcationId: taxBifurcation02 ? taxBifurcation02 : 0,
          TaxGroupId: this.taxGroupId ? this.taxGroupId : 0,
          AssociatedTaxTypeId: info.TaxType,
          TaxBifurcation: info.asso3 ? info.asso3 : 0
        }
        ],
        Table2: [{}],
        Table3: [{}]
      }
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.saveTaxGroup(payload).subscribe(response => {
          if (response['message'] == 'Success') {
            Swal.fire(response['data']);
            if (!this.isUpdate) { this.updateAutoGenerated(); }
          }
          this.router.navigate(['/views/finance/master/taxgroup/taxgroupview']);
        },
          (error: HttpErrorResponse) => {
            Swal.fire(error.message)
          });
      } else {
      }
    });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Tax Group');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  getTaxGroup(id: any) {
    let service = `${this.globals.APIURL}/TaxGroup/GetTaxGroupId`;
    this.dataService.post(service, { TaxGroupId: id }).subscribe(async (result: any) => {

      let Table = result.data.Table[0];
      this.Table1 = result.data.Table1;
      if (result.data.Table.length > 0) {
        this.searchForm.patchValue({
          taxGroup: Table.TaxGroupCOde,
          taxGroupName: Table.TaxGroupName,
          shortName: Table.ShortName,
          TaxType: Table.TaxTypeId,
          effectiveDate: this.datePipe.transform(Table.EffectiveDate, 'y-MM-dd'),
          Status: Table.IsActive == true ? 'true' : 'false',
          taxRate: Table.TaxRate,
          asso1: this.Table1[0] ? this.Table1[0].TaxBifurcation : 0,
          asso2: this.Table1[1] ? this.Table1[1].TaxBifurcation : 0,
          asso3: this.Table1[2] ? this.Table1[2].TaxBifurcation : 0
        }); this.OnBindDropdowntax();
      }
      this.CreatedOn = Table.CreatedOn;
      this.ModifiedOn = Table.UpdatedOn;
      this.CreatedBy = await this.utilityService.getUserNameById(Table.CreatedBy);
      this.ModifiedBy = await this.utilityService.getUserNameById(Table.UpdatedBy);

    }, error => {
      console.error(error);
    });
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
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Tax Group');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.searchForm.controls['taxGroup'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Tax group.');
        }
      }
      else {
        this.searchForm.controls['taxGroup'].setValue('');
      }
    }
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


  taxCalculation(event?, taxType?, formName?) {
    if (this.TaxTypeList.length == 3) {
      for (let data of this.TaxTypeList) {
        switch (data.AssociatedTaxTypeName) {
          case "CGST": this.searchForm.controls["asso1"].setValue(Number(this.searchForm.value.taxRate) / 2); break;
          case "SGST": this.searchForm.controls["asso2"].setValue(Number(this.searchForm.value.taxRate) / 2); break;
          case "IGST": this.searchForm.controls["asso3"].setValue(Number(this.searchForm.value.taxRate)); break;
          default: break;
        }
      }
    }
    if (this.TaxTypeList.length == 2) {
      for (let data of this.TaxTypeList) {
        switch (data.AssociatedTaxTypeName) {
          case "CGST": this.searchForm.controls["asso1"].setValue(Number(this.searchForm.value.taxRate) / 2); break;
          case "SGST": this.searchForm.controls["asso2"].setValue(Number(this.searchForm.value.taxRate) / 2); break;
          default: this.searchForm.controls["asso2"].setValue(Number(this.searchForm.value.taxRate)); break;
        }
      }
    }
    if (this.TaxTypeList.length == 1) {
      for (let data of this.TaxTypeList) {
        switch (data.AssociatedTaxTypeName) {
          case "CGST": this.searchForm.controls["asso1"].setValue(Number(this.searchForm.value.taxRate) / 2); break;
          case "SGST": this.searchForm.controls["asso1"].setValue(Number(this.searchForm.value.taxRate) / 2); break;
          default: this.searchForm.controls["asso1"].setValue(Number(this.searchForm.value.taxRate)); break;
        }
      }
    }
  }

}
