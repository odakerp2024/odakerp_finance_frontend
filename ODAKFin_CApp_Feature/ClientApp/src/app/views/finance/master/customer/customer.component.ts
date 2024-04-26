import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatGridTileHeaderCssMatStyler } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Category, City, DivisionMaster, Status, StatusView } from 'src/app/model/common';
import { AccountLink, Alerttype, BasicCustomerDetails, CreditDetails, CustomerModel, Division, DivisionLable, DivisionTypes, EmailId, InputPage, Interface, KYCDocument, OfficeDetails, SalesPICList } from 'src/app/model/financeModule/Customer';
import { WF_EVENTS, workflowEventObj } from 'src/app/model/financeModule/labels.const';
import { Country, States } from 'src/app/model/Organzation';
import { AutoCodeService } from 'src/app/services/auto-code.service';

import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { CustomerService } from 'src/app/services/financeModule/customer.service';
import { MastersService } from 'src/app/services/masters.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [DatePipe]
})

export class CustomerComponent implements OnInit {

  fg: FormGroup;
  FormMode: String = "A";
  CategoryMaster: Category = new Category();
  customerdivision: Division[] = [];

  isSalesPICMandatory: boolean = true;
  customerModel: CustomerModel = new CustomerModel();
  basicCustomerDetail: BasicCustomerDetails = new BasicCustomerDetails();
  inputPage: InputPage = new InputPage();
  TabOfficeDetails: OfficeDetails = new OfficeDetails();
  salesPICListModel: SalesPICList = new SalesPICList();
  TabKYCDocument: KYCDocument = new KYCDocument();
  TabAccountLink: AccountLink = new AccountLink();
  TabCreditDetails: CreditDetails = new CreditDetails();
  TabEmailId: EmailId = new EmailId();
  TabInterface: Interface = new Interface();
  TabDivision: Division = new Division();
  FillAlertType: Alerttype[];

  FillDivisionMaster: DivisionLable[] = [];
  categoryList: any;
  emailCategoryList: any;
  divisionList: any[];
  isEditMode: boolean = false;
  editSeletedIdex: any;
  DynamicSlotRelatedParty: any = [];
  divisionMaster: DivisionTypes = new DivisionTypes();

  FillCountry: Country[];
  FillCategory: Category[];
  FillGSTCategory: any[];
  FillCompanyStatus: any[];
  FillState: States[];
  FillCity: City[];
  FillAgreement: any[];
  FillCustomerStatus: any[];
  FillCurrency: any[];
  FillCustomerEmailHistory: any[];
  pinCodePattern = '^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$';
  Customer_Code: string = "";
  Branch_Code: string = "";
  LoginUsername = localStorage.getItem("UserName");
  DateNow = new Date().toISOString().split('T')[0];
  Current_Tab: string = '';
  statusvalues: Status[] = new StatusView().statusvalues;
  CustomerListItem: any = [];
  countryList: any;
  stateList: any;
  divisionListPayload: any = [];
  sourceList: any = [];
  isSalesPICDropDown: boolean = false;
  salesPICList: any = [];
  SalesPICPayload: any = [];
  isUpdate: boolean = false;
  documentPayloadInfo: any = [];
  GSTCategoryList: any[];
  currencyList: any;
  coaTypeList: any[];
  emailIDPayLoad: any = [];
  customerEmailList: any;
  customerEmailLists: any;
  officeDetailsSubmit: boolean = false;
  telephonePattern = '^[1-9][0-9]*$';
  updateCustomerId: any;
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  onBoardList: any[];
  divisionNameList: any = [];
  gstCategoryName: string = '';
  entityDateFormat = this.commonservice.getLocalStorageEntityConfigurable('DateFormat')
  //  set the currency name
  entityInfo = this.commonservice.getLocalStorageEntityConfigurable();
  entityCurrencyName = this.entityInfo['Currency'];
  autoGenerateCodeList: any = [];
  divisionDisableList: any = [];
  selectedCategoryList: any = [];
  countryStateList: any = [];
  customerCreditList: any;
  ModuleId: any
  modules: any;
  moduleName = 'Customer'
  mappingSuccess: boolean = false;
  errorMessage: any;

  isOffBranchDetails: boolean = false;
  isKYCDocuments: boolean = false;
  isSalesPICLink: boolean = false;
  isAccountingLink: boolean = false;
  isEmailids: boolean = false;
  isInterfaces: boolean = false;
  parentAccountList: any[];
  selectedFile: File = null;

  isKYClength: boolean = false;

  disableSave = true;

  workflowParamsNo:any=[];
  workFlowObj!:workflowEventObj;
  redirectURL:string='';
  cusID: string='';
  cusBID: string='';
  userName: string='';
  userDiv: string='';
  userOff: string='';

  onBoardStatus: any;

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private ms: MastersService
    , private commonservice: CommonService, private customerService: CustomerService,
    private dataService: DataService, private globals: Globals, private customerservice: CustomerService,
    private datePipe: DatePipe,private workflow: WorkflowService,
    private autoCodeService: AutoCodeService,
  ) {
    // this.getNumberRange();
    this.getDivisionList();
    this.route.params.subscribe(params => {
      if (params['customer_ID']) {
        this.updateCustomerId = params['customer_ID'];
        this.getCreditList();

        this.getPermissionListForUpdate(549, 'Branch Details');
        this.getPermissionListForUpdate(550, 'Sales PIC Link');
        this.getPermissionListForUpdate(551, 'KYC Documents');
        this.getPermissionListForUpdate(552, 'Accounting Link');
        this.getPermissionListForUpdate(554, 'Email ids');
        this.getPermissionListForUpdate(555, 'Interfaces');

      } else {
        this.getPermissionListForCreate(549, 'Branch Details');
        this.getPermissionListForCreate(550, 'Sales PIC Link');
        this.getPermissionListForCreate(551, 'KYC Documents');
        this.getPermissionListForCreate(552, 'Accounting Link');
        this.getPermissionListForCreate(554, 'Email ids');
        this.getPermissionListForCreate(555, 'Interfaces');
      }
      this.fg = this.fb.group({
        CustomerID: params['customer_ID'],
        CustomerBranchID: params['customer_BranchID'],
      });

      this.cusID = params['customer_ID'];
      this.cusBID = params['customer_BranchID'];

      // check permissions
    });
  }

  checkPermission(value) {
    debugger
    if (value == 'tabBranch' && this.isOffBranchDetails == true) {
      this.Current_Tab = 'tabBranch'
    } else if (value == 'tabSales' && this.isSalesPICLink == true) {
      this.Current_Tab = 'tabSales'
    } else if (value == 'tabKYC' && this.isKYCDocuments == true) {
      this.Current_Tab = 'tabKYC'
    } else if (value == 'tabAccounting' && this.isAccountingLink == true) {
      this.Current_Tab = 'tabAccounting'
    } else if (value == 'tabEmail' && this.isEmailids == true) {
      this.Current_Tab = 'tabEmail'
    } else if (value == 'tabInterfaces' && this.isInterfaces == true) {
      this.Current_Tab = 'tabInterfaces'
    }
    else {
      this.Current_Tab = this.Current_Tab
      Swal.fire('Please Contact Administrator');
    }
  }

  getPermissionListForCreate(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonservice.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (route == 'Branch Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isOffBranchDetails = true;
            } else {
              this.isOffBranchDetails = false;
            }
          }
        } else {
          this.isOffBranchDetails = false;
        }
      }

      if (route == 'Sales PIC Link') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isSalesPICLink = true;
            } else {
              this.isSalesPICLink = false;
            }
          }
        } else {
          this.isSalesPICLink = false;
        }
      }

      if (route == 'KYC Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isKYCDocuments = true;

            } else {
              this.isKYCDocuments = false;
            }
          }
        } else {
          this.isKYCDocuments = false;
        }
      }

      if (route == 'Accounting Link') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isAccountingLink = true;
            } else {
              this.isAccountingLink = false;
            }
          }
        } else {
          this.isAccountingLink = false;
        }
      }

      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isEmailids = true;
            } else {
              this.isEmailids = false;
            }
          }
        } else {
          this.isEmailids = false;
        }
      }

      if (route == 'Interfaces') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isInterfaces = true;
            } else {
              this.isInterfaces = false;
            }
          }
        } else {
          this.isInterfaces = false;
        }
      }

      if (this.isOffBranchDetails == true) {
        this.Current_Tab = 'tabBranch';
      }
      else if (this.isSalesPICLink == true) {
        this.Current_Tab = 'tabSales';
      }
      else if (this.isKYCDocuments == true) {
        this.Current_Tab = 'tabKYC';
      }
      else if (this.isAccountingLink == true) {
        this.Current_Tab = 'tabAccounting';
      }
      // else if (this.isCreditDetails == true) {
      //   this.Current_Tab = 'creditDetails';
      // }
      else if (this.isEmailids == true) {
        this.Current_Tab = 'tabEmail';
      }
      else if (this.isInterfaces == true) {
        this.Current_Tab = 'tabInterfaces';
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForUpdate(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonservice.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (route == 'Branch Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isOffBranchDetails = true;
              this.Current_Tab = 'tabBranch';
            } else {
              this.isOffBranchDetails = false;
            }
          }
        } else {
          this.isOffBranchDetails = false;
        }
      }

      if (route == 'Sales PIC Link') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isSalesPICLink = true;
              this.Current_Tab = 'tabSales';
            } else {
              this.isSalesPICLink = false;
            }
          }
        } else {
          this.isSalesPICLink = false;
        }
      }

      if (route == 'KYC Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isKYCDocuments = true;
              this.Current_Tab = 'tabKYC';

            } else {
              this.isKYCDocuments = false;
            }
          }
        } else {
          this.isKYCDocuments = false;
        }
      }

      if (route == 'Accounting Link') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isAccountingLink = true;
              this.Current_Tab = 'tabAccounting';
            } else {
              this.isAccountingLink = false;
            }
          }
        } else {
          this.isAccountingLink = false;
        }
      }

      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isEmailids = true;
              this.Current_Tab = 'tabEmail';
            } else {
              this.isEmailids = false;
            }
          }
        } else {
          this.isEmailids = false;
        }
      }

      if (route == 'Interfaces') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isInterfaces = true;
              this.Current_Tab = 'tabInterfaces';
            } else {
              this.isInterfaces = false;
            }
          }
        } else {
          this.isInterfaces = false;
        }
      }

      if (this.isOffBranchDetails == true) {
        this.Current_Tab = 'tabBranch';
      }
      else if (this.isSalesPICLink == true) {
        this.Current_Tab = 'tabSales';
      }
      else if (this.isKYCDocuments == true) {
        this.Current_Tab = 'tabKYC';
      }
      else if (this.isAccountingLink == true) {
        this.Current_Tab = 'tabAccounting';
      }
      // else if (this.isCreditDetails == true) {
      //   this.Current_Tab = 'creditDetails';
      // }
      else if (this.isEmailids == true) {
        this.Current_Tab = 'tabEmail';
      }
      else if (this.isInterfaces == true) {
        this.Current_Tab = 'tabInterfaces';
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }




  ngOnInit(): void {
    this.getLedgerMappingParentAccountList();
    //------ ledger maping validate conditions are removed due to mapped account in customer itself --08-03-2024
    // this.getModuleType();
    this.getOnboardingList();
    this.getCategoryList();
    this.getEmailCategoryList();
    //console.log(this.route.snapshot.params['customer_ID']);
    //console.log(this.route.snapshot.params['customer_BranchID']);
    localStorage.getItem("UserName");
    this.getBusinessDivision();
    this.OnBindDropdownCountry();
    this.getCategory();
    this.getGSTCategory();
    this.OnBindCompanyStatus();
    this.OnBindDropdownStates(53);
    this.OnBindAgreement();
    this.OnBindCustomerStatus();
    this.getCurrency();
    this.OnBindDropdownAlerttype();
    this.DynamicGridEmail.length = 0;
    this.GridPushEmptyrow_Email();
    this.createForm();
    this.GetGSTCategory();
    this.CustomerList();
    this.getCountryList();
    this.getCustomerSourceList();
    this.getCoaType();
    if (this.updateCustomerId) {
      this.isUpdate = true;
      this.fg.disable();
    }
    this.getWFParams();
    this.getUserDtls();

    this.redirectURL= window.location.href
    console.log('redirectURL',this.redirectURL,window.location)
  }


  getUserDtls(){
    var userid = localStorage.getItem("UserID");
    var payload = {
      "UserID": userid,
    }
    this.workflow.getUserDtls(payload).subscribe({
      next:(res)=>{
        console.log('getUserDtls', { res })
        this.userDiv = res[0].DivisionName
        this.userOff = res[0].OfficeName
        this.userName = res[0].UserName
      },
      error:(e)=>{
        console.log('error', { e })
      }
    });
  }

  getCoaType() {
    var service: any = `${this.globals.APIURL}/Customer/GetReceivablePayCustomer`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.coaTypeList = [];
      if (result.data.Table.length > 0) {
        this.coaTypeList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }


  onBack() {
    this.router.navigate(['/views/finance/Customer/Customerview']);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  // OnBindDropdownCountry() {
  //   this.ms.getCountryBind().subscribe(data => {
  //     // console.log(data);
  //     this.FillCountry = data;
  //   });
  // }

  async OnBindDropdownCountry() {
    debugger
    var payload = {};
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCountries`;
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.FillCountry = result;
    }, error => { });
  }


  OnBindCompanyStatus() {
    this.commonservice.getCompanyStatus().subscribe(data => {
      this.FillCompanyStatus = data['data'];
    });
  }

  OnBindAgreement() {
    this.customerService.getAgreement().subscribe(data => {
      // console.log(data['data'])
      this.FillAgreement = data['data'];
    });
  }

  OnBindCustomerStatus() {
    this.customerService.getCustomerStatus().subscribe(data => {
      // console.log(data['data'])
      this.FillCustomerStatus = data['data'];
    });
  }

  OnBindDropdownStates(CountryID) {
    var queryParams = { "stateID": CountryID }
    this.ms.getStateLists(queryParams).subscribe(data => {
      // console.log(data['data']);
      this.FillState = data['data'];
    });
  }

  OnBindDropdownAlerttype() {
    var queryParams = { "alertID": 0 };
    this.ms.getAlertLists(queryParams).subscribe(data => {
      this.FillAlertType = data['data'];
    });
  }

  OnChangeCity(Stateval) {
    var queryParams = { "countryID": Stateval, "stateID": '' };
    this.commonservice.getCities(queryParams).subscribe(data => {
      this.FillCity = data["data"];
    });
  }

  OnChangeCountry(country_Id) {

    if (country_Id == 53) {
      this.fg.value.PANNumber = '';
      $("#divPAN").removeClass("is-hide");
      this.fg.value.PlaceofSupplyState = 0;
      $("#divState").removeClass("is-hide");
      this.fg.value.PlaceofSupplyCity = 0;
      $("#divCity").removeClass("is-hide");
    }
    else {
      $("#divPAN").addClass("is-hide");
      $("#divState").addClass("is-hide");
      $("#divCity").addClass("is-hide");
    }

    var queryParams = { "countryId": country_Id, "currencyId": 0 };
    this.customerService.getCurrency(queryParams).subscribe(data => {

      this.FillCurrency = data["data"];
      if (data["data"].length > 0)
        ((document.getElementById("ddlCurrency")) as HTMLSelectElement).selectedIndex = 1
      else
        ((document.getElementById("ddlCurrency")) as HTMLSelectElement).selectedIndex = 0;
    });
  }

  OnChageGSTCategory(Stateval) {
    let category = this.GSTCategoryList.find(x => x.Id == Stateval);
    this.gstCategoryName = category.CategoryName ? category.CategoryName : '';
    // console.log(category.CategoryName, "category.CategoryName")
    this.fg.controls['PlaceofSupplyState'].setValue('');
    this.fg.controls['GSTNumber'].setValue('');
    this.fg.controls['LegalTradeName'].setValue('');
    this.fg.controls['CompanyStatus'].setValue('');
    this.fg.controls['Currency'].setValue('');
    this.fg.controls['PANNumber'].setValue('');
    this.fg.controls['TANNumber'].setValue('');
    this.fg.controls['MSMENumber'].setValue('');
    this.fg.controls['ReceivableSubCategoryId'].setValue('');
  }

  getBusinessDivision() {
    this.customerService.getBusinessDivision(this.divisionMaster).subscribe(data => {

      //this.FillDivisionMaster = data['data'];

      if (data['data'].length > 0) {
        data['data'].forEach(element => {

          this.FillDivisionMaster.push({
            "CustomerDivisionID": 0,
            "CustomerID": Number(this.fg.controls.CustomerID), "DivisionID": element.Id, "DivisionLable": element.DivisionName, "isChecked": false
          })
        });
      }
    })
  }

  getCategory() {
    var queryParams = { "categoryID": 0 }
    this.commonservice.getCategory(queryParams).subscribe(data => {
      // console.log(data['data'])
      this.FillCategory = data['data'];
    });
  }

  getGSTCategory() {
    var queryParams = { "gstCategoryID": 0 }
    this.commonservice.getGSTCategory(queryParams).subscribe(data => {
      // console.log(data['data'])
      this.FillGSTCategory = data['data'];
    });
  }


  // getChecked(id) {

  //   this.customerdivision.forEach((element) => {

  //     if (element.DivisionID == id) { return true; }
  //   })
  // }

  generateCustomerCode(Type_Id: Number, Customer_ID: Number): any {
    var queryParams = { "TypeId": Type_Id, "CustomerID": Customer_ID }
    this.customerService.generateCustomerCode(queryParams).subscribe(data => {
      if (Type_Id == 1) { this.Customer_Code = data['data']; }
      else { this.Branch_Code = data['data']; }
      return data['data'];
    });
  }

  getCustomerEmailHistory(CustomerBranch_ID) {
    var queryParams = { "CustomerBranchID": CustomerBranch_ID }
    this.customerService.getCustomerEmailHistory(queryParams).subscribe(data => {
      this.FillCustomerEmailHistory = data['data'].Table;
    });
  }

  EditModeValueBInd(response) {

    // Table (Customer Information)
    if (response['data'].Table.length > 0) {
      this.fg.controls.CustomerID.setValue(response['data'].Table[0]['CustomerID']);
      this.fg.controls.CustomerCode.setValue(response['data'].Table[0]['CustomerCode']);
      this.fg.controls.CustomerName.setValue(response['data'].Table[0]['CustomerName']);
      this.fg.controls.StatusAuto.setValue(response['data'].Table[0]['CustomerStatus']);
      this.fg.controls.CountryID.setValue(response['data'].Table[0]['CountryId']);
      this.fg.controls.Category.setValue(JSON.parse(response['data'].Table[0]['CategoryId']));
      this.fg.controls.ShortName.setValue(response['data'].Table[0]['ShortName']);
      this.fg.controls.URL.setValue(response['data'].Table[0]['URL']);
      this.fg.controls.IsActive.setValue(response['data'].Table[0]['IsActive'] ? 'true' : 'false');
      this.CreatedOn = this.datePipe.transform(response['data'].Table[0]['CreatedDate'], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
      this.CreatedBy = localStorage.getItem('UserName')
      this.ModifiedOn = this.datePipe.transform(response['data'].Table[0]['UpdatedDate'], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
      this.ModifiedBy = localStorage.getItem('UserName')
    }

    this.selectedCategoryList = this.fg.value.Category;
    //Office Details

    if (response['data'].Table1.length > 0) {
      this.fg.controls.CustomerBranchID.setValue(response['data'].Table1[0]['CustomerBranchID']);
      this.fg.controls.BranchCode.setValue(response['data'].Table1[0]['BranchCode']);
      this.fg.controls.BranchCity.setValue(response['data'].Table1[0]['City']);
      this.fg.controls.PinCode.setValue(response['data'].Table1[0]['Pincode']);
      this.fg.controls.PrimaryContact.setValue(response['data'].Table1[0]['Name']);
      this.fg.controls.IsActiveBranch.setValue(response['data'].Table1[0]['IsActive'] ? 'true' : 'false');
      this.fg.controls.Address.setValue(response['data'].Table1[0]['Address']);
      this.fg.controls.emailid.setValue(response['data'].Table1[0]['EmailId']);
      this.fg.controls.designation.setValue(response['data'].Table1[0]['Designation']);
      this.fg.controls.PhoneNo.setValue(response['data'].Table1[0]['TelephoneNo']);
      this.fg.controls.mobile.setValue(response['data'].Table1[0]['MobileNo']);
      this.fg.controls.primaryTelephone.setValue(response['data'].Table1[0]['primaryTelephone']);
      this.fg.controls.onboardstatus.setValue(response['data'].Table1[0]['OnBoard']);
      
      this.onBoardStatus = response['data'].Table1[0]['OnBoard'];
      
    }

    //Sales PIC
    if (response['data'].Table2.length > 0) {
      this.SalesPICPayload = response['data'].Table2;
    }

    //KYC Documents
    if (response['data'].Table3.length > 0) {
      this.documentPayloadInfo = response['data'].Table3;
      if(this.onBoardStatus != 2){
        this.disableSave = false;
      }
    }

    //Account Link
    if (response['data'].Table4.length > 0) {
      this.fg.controls.CustomerAccountID.setValue(response['data'].Table4[0]['CustomerAccountID']);
      this.fg.controls.GSTCategory.setValue(response['data'].Table4[0]['GSTCategory']);
      this.fg.controls.GSTNumber.setValue(response['data'].Table4[0]['GSTNumber']);
      this.fg.controls.PlaceofSupplyState.setValue(response['data'].Table4[0]['PlaceOfSupply1']);
      this.fg.controls.PlaceofSupplyCity.setValue(response['data'].Table4[0]['PlaceOfSupply2']);
      this.fg.controls.Currency.setValue(response['data'].Table4[0]['CurrencyId']);
      this.fg.controls.LegalTradeName.setValue(response['data'].Table4[0]['LegalName']);
      this.fg.controls.CompanyStatus.setValue(response['data'].Table4[0]['CompanyStatus']);
      this.fg.controls.PANNumber.setValue(response['data'].Table4[0]['PANNo']);
      this.fg.controls.MSMENumber.setValue(response['data'].Table4[0]['MSMENo']);
      this.fg.controls.TANNumber.setValue(response['data'].Table4[0]['TANNo']);
      this.fg.controls.ReceivableSubCategoryId.setValue(response['data'].Table4[0]['ReceivableSubCategoryId']);
      this.fg.controls.LedgerMappingId.setValue(response['data'].Table4[0]['LedgerMappingId']);
    }

    //Credit Details
    // if (response['data'].Table5.length > 0) {
    //   this.fg.controls.CustomerCreditID.setValue(response['data'].Table4[0]['CustomerCreditID']);
    //   this.fg.controls.Agreement.setValue(response['data'].Table4[0]['Agreement']);
    //   this.fg.controls.CreditDays.setValue(response['data'].Table4[0]['CreditDays']);
    //   this.fg.controls.CreditLimit.setValue(response['data'].Table4[0]['CreditLimit']);
    //   this.fg.controls.ApprovedBy.setValue(response['data'].Table4[0]['ApprovedBy']);
    //   this.fg.controls.EffectiveDate.setValue(response['data'].Table4[0]['EffectiveDate']);
    // }
    //Emails ID
    if (response['data'].Table5.length > 0) {
      this.customerEmailList = [];
      this.customerEmailLists = [];
      for (let emailInfo of response['data'].Table5) {
        let category = this.emailCategoryList.find(x => x.CategoryID == emailInfo.Category);

        this.customerEmailList.push({
          ID: emailInfo.CustomerEmailID,
          OrgId: 0,
          Category: category.CategoryID,
          EmailId: emailInfo.EmailId,
          StartDate: this.datePipe.transform(emailInfo.StartDate, 'YYYY-MM-dd'),
          EndDate: this.datePipe.transform(emailInfo.EndDate, 'YYYY-MM-dd'),
          CreatedBy: emailInfo.UpdatedBy,
          UpdatedBy: emailInfo.UpdatedBy,
          CreatedDate: emailInfo.CreatedOn,
          ModifiedDate: emailInfo.UpdatedBy,
        })

        this.customerEmailLists.push({
          ID: emailInfo.CustomerEmailID,
          OrgId: 0,
          Category: category.Category,
          EmailId: emailInfo.EmailId,
          StartDate: this.datePipe.transform(emailInfo.StartDate, 'YYYY-MM-dd'),
          EndDate: this.datePipe.transform(emailInfo.EndDate, 'YYYY-MM-dd'),
          CreatedBy: emailInfo.UpdatedBy,
          UpdatedBy: emailInfo.UpdatedBy,
          CreatedDate: emailInfo.CreatedOn,
          ModifiedDate: emailInfo.UpdatedBy,
        })

      }
      let gstInfo = this.GSTCategoryList.find(x => x.Id == response['data'].Table5[0]['GSTCategory']);
      if (gstInfo) {
        this.OnChageGSTCategory(gstInfo.CategoryName);
      }

    }

    //Interface
    if (response['data'].Table6.length > 0) {
      this.fg.controls.CustomerInterfaceID.setValue(response['data'].Table6[0]['CustomerInterfaceID']);
      this.fg.controls.NDPCode.setValue(response['data'].Table6[0]['NDPCode']);
      this.fg.controls.DigitalCode.setValue(response['data'].Table6[0]['DigitalCode']);
      this.fg.controls.Others.setValue(response['data'].Table6[0]['Others']);
    }

    if (response['data'].Table7.length > 0) {
      var divisionList = [];
      for (let data of response['data'].Table7) {
        divisionList.push(data.DivisionID);
      }
      this.divisionListPayload = response['data'].Table7;
      this.fg.controls['CustomerOfDivision'].setValue(divisionList);
      this.divisionDisableList = divisionList;
      this.selectedDivision(divisionList);
    }

    this.getRelativeParties();

  }

  numericOnly(event, maxchar) {

    let reg = /^\d{0,16}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  PANFormat(event) {
    // let reg = /^\d{0,10}$/;
    const reg = /^\[A-Z]{5}$|(?=^.{0,6}$)^\d+\.\d{0,2}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  PANFormat1(event): boolean {

    // var inputvalues = event.target.value;
    // var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    // if (!regex.test(inputvalues)) {
    //   $(".pan").val(""  );
    //   alert("invalid PAN no");
    //   return regex.test(inputvalues);
    // }

    //let patt = /^([A-Za-z]){0,4}$/;
    let patt = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    let result = patt.test(event.target.value);
    return result;
  }

  PANFormat12(event) {

    //let reg = /[A-Za-z]/;
    const reg = /^\[A-Za-z]{0,3}$|(?=^.{0,6}$)^\d+\.\d{0,2}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  nameMask(rawValue: string): RegExp[] {

    const mask = /[A-Za-z]/;
    const strLength = String(rawValue).length;
    const nameMask: RegExp[] = [];

    for (let i = 0; i <= strLength; i++) {
      nameMask.push(mask);
    }
    return nameMask;
  }

  Pincode(event) {

    let reg = /^[0-9-\s]*$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  createForm() {
    if (this.fg.value.CustomerID != null && this.fg.value.CustomerBranchID != null) {
      this.FormMode = "E";
      this.customerService.getCustomerId(this.fg.value).pipe().subscribe(response => {

        this.EditModeValueBInd(response);
        //this.fg.patchValue(response["data"][0]);
        this.getCustomerEmailHistory(response['data'].Table1[0]['CustomerBranchID']);
      });
    }
    else {
      // this.generateCustomerCode(1, 0); // Customer_Code
      // this.generateCustomerCode(2, 0); // Branch_Code
    }

    this.fg = this.fb.group({
      CustomerID: 0,
      CustomerBranchID: 0,
      CustomerCode: this.Customer_Code,
      CustomerName: '',
      StatusAuto: new FormControl({ value: 336, disabled: true }, Validators.required),
      CountryID: 0,
      Category: [],
      IsActive: 'true',
      ShortName: '',
      URL: '',
      onboardstatus: '1',
      //Status: '',
      primaryTelephone: ['', [Validators.pattern(this.telephonePattern), Validators.minLength(12), Validators.maxLength(16)]],

      // Sales PIc
      SalesId: 0,
      Source: '',
      SalesPIC: '',
      EffectiveSalesDate: '',
      Remarks: '',
      CustomerOfDivision: [],

      // Related Party (s)
      ID: 0,
      RelatedCustomerCode: '',
      Name: '',

      // Tab1
      BranchCode: this.Branch_Code,
      BranchCity: '',
      PinCode: ['', Validators.pattern(this.pinCodePattern)],
      PrimaryContact: '',
      Address: '',
      IsActiveBranch: 'true',
      Telephone: ['', [Validators.pattern(this.telephonePattern), Validators.minLength(12), Validators.maxLength(16)]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      designation: '',
      emailid: ['', [Validators.required, Validators.email]],

      BusinessDivisions: this.fb.array([]),
      PhoneNo: [''],
      DocumentName: '',

      //AccountLink
      CustomerAccountID: 0,
      GSTCategory: 0,
      GSTNumber: '',
      PlaceofSupplyState: 0,
      PlaceofSupplyCity: 0,
      Currency: 0,
      LegalTradeName: '',
      CompanyStatus: 0,
      PANNumber: '',
      MSMENumber: '',
      TANNumber: '',
      ReceivableSubCategoryId: '',
      LedgerMappingId: 0,

      //CreditDetails
      CustomerCreditID: 0,
      Agreement: 0,
      CreditDays: 0,
      CreditLimit: 0,
      ApprovedBy: '',
      EffectiveDate: '',

      //Interface
      CustomerInterfaceID: 0,
      NDPCode: '',
      DigitalCode: '',
      Others: '',
    });

  }


  updateBasicCustomerDetail() {
    this.autoCodeGeneration(true);
    var CusStatus = $('#ddlStatusAuto').val();
    this.basicCustomerDetail.CustomerID = this.fg.value.CustomerID;
    this.basicCustomerDetail.CustomerCode = this.fg.value.CustomerCode == "" ? this.Customer_Code : this.fg.value.CustomerCode;
    this.basicCustomerDetail.CustomerName = this.fg.value.CustomerName;
    this.basicCustomerDetail.CustomerStatus = 337;
    this.basicCustomerDetail.CountryId = Number(this.fg.value.CountryID);
    this.basicCustomerDetail.CategoryId = JSON.stringify(this.fg.value.Category);
    this.basicCustomerDetail.IsActive = this.fg.value.IsActive === 'true' ? 1 : 0;
    this.basicCustomerDetail.ShortName = this.fg.value.ShortName;
    this.basicCustomerDetail.URL = this.fg.value.URL;


    // if (this.Current_Tab == "tabKYC") this.basicCustomerDetail.InputPage = "KYC";
    // else if (this.Current_Tab == "tabAccounting") this.basicCustomerDetail.InputPage = "Account";
    // else if (this.Current_Tab == "tabCredit") this.basicCustomerDetail.InputPage = "Credit";
    // else if (this.Current_Tab == "tabEmail") this.basicCustomerDetail.InputPage = "Email";
    // else if (this.Current_Tab == "tabInterfaces") this.basicCustomerDetail.InputPage = "Interface";
    // else this.basicCustomerDetail.InputPage = "";

    this.customerModel.Customer.Table.push(this.basicCustomerDetail);
  }

  updateOfficeDetails() {

    debugger
    this.TabOfficeDetails.CustomerBranchID = this.fg.value.CustomerBranchID;
    this.TabOfficeDetails.CustomerID = this.fg.value.CustomerID;
    this.TabOfficeDetails.BranchCode = this.fg.value.BranchCode == "" ? this.Branch_Code :  this.fg.value.BranchCode;

    var status = 1;
    if (this.fg.value.IsActiveBranch == "true") { status = 1 }
    else if (this.fg.value.IsActiveBranch == "false") { status = 0 }

    // this.TabOfficeDetails.City = Number(this.fg.value.BranchCity);
    this.TabOfficeDetails.City = this.fg.value.BranchCity;
    this.TabOfficeDetails.PrimaryContact = "";
    this.TabOfficeDetails.Pincode = this.fg.value.PinCode;
    this.TabOfficeDetails.PhoneNo = this.fg.value.primaryTelephone;
    this.TabOfficeDetails.MobileNo = this.fg.value.mobile;
    this.TabOfficeDetails.Address = this.fg.value.Address;
    this.TabOfficeDetails.IsActive = status;
    this.TabOfficeDetails.Name = this.fg.value.PrimaryContact;
    this.TabOfficeDetails.Designation = this.fg.value.designation;
    this.TabOfficeDetails.EmailId = this.fg.value.emailid;
    this.TabOfficeDetails.OnBoard = this.fg.value.onboardstatus;
    this.TabOfficeDetails.TelephoneNo = this.fg.value.PhoneNo;
    //}

    this.customerModel.Customer.Table1.push(this.TabOfficeDetails);
  }

  updateSalesPIc() {
    if (this.SalesPICPayload.length > 0) {
      this.customerModel.Customer.Table2 = [];
      for (let data of this.SalesPICPayload) {
        this.salesPICListModel = new SalesPICList();
        this.salesPICListModel.SalesId = data.SalesId;
        this.salesPICListModel.CustomerBranchID = this.fg.value.CustomerBranchID;
        this.salesPICListModel.Source = data.Source;
        this.salesPICListModel.SalesPIC = data.SalesPIC;
        this.salesPICListModel.EffectiveDate = data.EffectiveDate ? data.EffectiveDate : data.Effectivedate;
        this.salesPICListModel.Remarks = data.Remarks;
        this.customerModel.Customer.Table2.push(this.salesPICListModel);
      }
    }
  }

  updateKYCDocument() {
    for (let data of this.documentPayloadInfo) {
      this.TabKYCDocument = new KYCDocument();
      this.TabKYCDocument.CustomerDocumentsID = data.CustomerDocumentsID;
      this.TabKYCDocument.CustomerBranchID = data.CustomerBranchID;
      this.TabKYCDocument.DocumentName = data.DocumentName;
      this.TabKYCDocument.FilePath = data.FilePath;
      // this.TabKYCDocument.UpdateOn = new Date(data.UpdateOn)!;
      this.TabKYCDocument.UniqueFilePath = data.UniqueFilePath;
      this.customerModel.Customer.Table3.push(this.TabKYCDocument);
    }
  }

  updateAccountLink() {

    this.TabAccountLink.CustomerAccountID = this.fg.value.CustomerAccountID;
    this.TabAccountLink.CustomerBranchID = this.fg.value.CustomerBranchID;

    if (this.Current_Tab == "tabAccounting") {
      this.TabAccountLink.DocumentName = this.fg.value.DocumentName ? this.fg.value.DocumentName : '';
      this.TabAccountLink.GSTCategory = this.fg.value.GSTCategory ? this.fg.value.GSTCategory : '';
      this.TabAccountLink.GSTNumber = this.fg.value.GSTNumber ? this.fg.value.GSTNumber : '';
      this.TabAccountLink.LegalName = this.fg.value.LegalTradeName ? this.fg.value.LegalTradeName : '';
      this.TabAccountLink.PANNo = this.fg.value.PANNumber ? this.fg.value.PANNumber : '';
      this.TabAccountLink.TANNo = this.fg.value.TANNumber ? this.fg.value.TANNumber : '';
      this.TabAccountLink.PlaceOfSupply1 = this.fg.value.PlaceofSupplyState ? this.fg.value.PlaceofSupplyState : '';
      this.TabAccountLink.PlaceOfSupply2 = this.fg.value.PlaceofSupplyCity ? this.fg.value.PlaceofSupplyCity : '';
      this.TabAccountLink.CurrencyId = this.fg.value.Currency ? this.fg.value.Currency : '';
      this.TabAccountLink.CompanyStatus = this.fg.value.CompanyStatus ? this.fg.value.CompanyStatus : '';
      this.TabAccountLink.MSMENo = this.fg.value.MSMENumber ? this.fg.value.MSMENumber : '';
      this.TabAccountLink.ReceivableSubCategoryId = this.fg.value.ReceivableSubCategoryId
      this.TabAccountLink.LedgerMappingId = this.fg.value.LedgerMappingId;

      // this.basicCustomerDetail.CustomerStatus = 337;
      this.customerModel.Customer.Table4.push(this.TabAccountLink);
    }

  }

  // updateCreditDetails() {
  //   this.TabCreditDetails.CustomerCreditID = this.fg.value.CustomerCreditID;
  //   this.TabCreditDetails.CustomerBranchID = this.fg.value.CustomerBranchID;
  //   if (this.Current_Tab == "tabCredit") {

  //     this.TabCreditDetails.Agreement = this.fg.value.Agreement;
  //     this.TabCreditDetails.CreditDays = this.fg.value.CreditDays;
  //     this.TabCreditDetails.CreditLimit = this.fg.value.CreditLimit;
  //     this.TabCreditDetails.ApprovedBy = this.fg.value.ApprovedBy;
  //     this.TabCreditDetails.EffectiveDate = this.fg.value.EffectiveDate;
  //     this.customerModel.Customer.Table5.push(this.TabCreditDetails);
  //   }

  // }

  updateEmailId() {
    if (this.Current_Tab == "tabEmail") {
      for (let item of this.emailIDPayLoad) {
        let category = this.emailCategoryList.find(x => x.Category == item.Category)
        this.TabEmailId = new EmailId();
        this.TabEmailId.CustomerEmailID = item.ID;
        this.TabEmailId.CustomerBranchID = this.fg.value.CustomerBranchID;
        this.TabEmailId.AlertTypeId = 1;
        this.TabEmailId.EmailId = item.EmailId;
        this.TabEmailId.CreatedOn = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
        this.TabEmailId.UpdateOn = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
        this.TabEmailId.UpdatedBy = localStorage.getItem('UserName');
        this.TabEmailId.Category = category.CategoryID;
        this.TabEmailId.StartDate = item.StartDate;
        this.TabEmailId.EndDate = item.EndDate;
        this.customerModel.Customer.Table6.push(this.TabEmailId);
      };
    }
  }

  updateInterface() {
    if (this.Current_Tab == "tabInterfaces") {
      this.TabInterface.CustomerInterfaceID = this.fg.value.CustomerInterfaceID;
      this.TabInterface.CustomerBranchID = this.fg.value.CustomerBranchID;
      this.TabInterface.NDPCode = this.fg.value.NDPCode;
      this.TabInterface.DigitalCode = this.fg.value.DigitalCode;
      this.TabInterface.Others = this.fg.value.Others;
      this.customerModel.Customer.Table7.push(this.TabInterface);
    }
  }

  updateDivision() {
    if (this.divisionListPayload.length > 0) {
      this.divisionListPayload.forEach((element) => {
        let TabDivision = new Division();
        TabDivision.CusDivId = element.CusDivId;
        TabDivision.CustomerId = element.CustomerId >= 0 ? element.CustomerId : element.CustomerID;
        TabDivision.DivisionId = element.DivisionId ? element.DivisionId : element.DivisionID;
        TabDivision.CustomerBranchId = element.CustomerBranchId;
        this.customerModel.Customer.Table8.push(TabDivision);
      });
    }

    // for (let item of this.FillDivisionMaster) {

    //   let TabDivision = new Division();
    //   TabDivision.CustomerDivisionID = item.CustomerDivisionID;
    //   TabDivision.DivisionID = item.DivisionID;
    //   TabDivision.CustomerID = this.fg.value.CustomerID;
    //   this.customerModel.Customer.Table7.push(TabDivision);
    // };
  }
  //------ ledger maping validate conditions are removed due to mapped account in customer itself --08-03-2024

  // async getModuleType() {

  //   let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerDropDownList`;
  //   this.dataService.post(service, {}).subscribe(async (result: any) => {
  //     if (result.message = "Success") {
  //       // this.ledgerSubModuleList = [];

  //       this.modules = result.data.Module

  //       let subModule = this.modules.find(x => x.ModuleName.toUpperCase() == this.moduleName.toUpperCase());
  //       this.ModuleId = subModule.ID
  //      // await this.checkLedgerMapping()
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

  async onSubmit() {
    // if (this.mappingSuccess == false) {
    //   Swal.fire(this.errorMessage)
    //   return false;
    // }
    await this.getNumberRange();
    this.officeDetailsSubmit = true;
    var validation = "";

    if (this.Current_Tab == 'tabBranch') {
      if (this.fg.value.mobile.length != 10 && this.fg.value.mobile != '') {
        validation += "<span style='color:red;'>*</span> <span>Please enter valid Mobile number</span></br>"
      }

      if (this.fg.value.Telephone.length != 12 && this.fg.value.Telephone != '') {
        validation += "<span style='color:red;'>*</span> <span>Please enter valid Primary Telephone number</span></br>"
      }

      if (this.fg.value.primaryTelephone.length != 12 && this.fg.value.primaryTelephone != '') {
        validation += "<span style='color:red;'>*</span> <span>Please enter valid Telephone number</span></br>"
      }

      if (this.fg.get('PinCode').invalid) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please enter a valid Pin Code</span></br>';
      }
    }

    //#region Main---------------------------------------------------------------------------------------------------------------------
    // if (this.fg.value.CustomerCode == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Customer Code </span></br>"
    // }

    if (this.fg.value.CustomerName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Customer Name</span></br>"
    }

    if (this.fg.value.ShortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Short Name</span></br>"
    }

    // var ddlCountry = $('#ddlCountry').val();
    if (this.fg.value.CountryID == null || this.fg.value.CountryID == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Country</span></br>"
    }

    if (this.fg.value.Address == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Address</span></br>"
    }

    if (this.fg.value.PinCode == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Pin code</span></br>"
    }

    // if (this.fg.value.primaryTelephone == '') {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter Telephone number</span></br>"
    // }

    if (!this.fg.value.Category || this.fg.value.Category.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Category</span></br>"
    }

    if (!this.fg.value.CustomerOfDivision || this.fg.value.CustomerOfDivision.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Customer Of Division</span></br>"
    }

    // var ddlCategory = $('#ddlCategory').val();
    // if (ddlCategory == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select category</span></br>"
    // }

    // var ddlIsActive = $('#ddlIsActive').val();
    if (this.fg.value.IsActive == null || this.fg.value.IsActive == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Active</span></br>"
    }

    // if (this.fg.value.URL == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter URL</span></br>"
    // }

    if (this.fg.get('emailid').invalid && this.fg.value.emailid != '') {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter a Valid Email</span></br>';
    }

    // var ddlLocCity = $('#ddlStatusAuto').val();
    // if (ddlLocCity == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select customer status</span></br>"
    // }

    // var ddlIsActive = $('#ddlIsActive').val();
    // if (ddlIsActive == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select active</span></br>"
    // }
    
    var IsDivisionchecked = 0;
    this.FillDivisionMaster.forEach((element) => {
      if (element.isChecked) {
        IsDivisionchecked = 1;
      }
    })
    // if (IsDivisionchecked == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select division</span></br>"
    // }

    //#endregion Main---------------------------------------------------------------------------------------------------------------------

    //#region Office Details---------------------------------------------------------------------------------------------------------------------
    // if (this.Current_Tab == "tabBranch") {
    // if (this.fg.value.BranchCode == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please check branch code not Generate</span></br>"
    // }

    if (this.fg.value.BranchCity == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Branch/City</span></br>"
    }
    // }
    //#endregion Office Details---------------------------------------------------------------------------------------------------------------------


    //#region KYC Documents---------------------------------------------------------------------------------------------------------------------

    //#endregion KYC Documents---------------------------------------------------------------------------------------------------------------------

    //#region Account Link---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab == "tabAccounting") {

      if (this.gstCategoryName != "Overseas") {
        var ddlplaceofSupplystate = $('#ddlplaceofSupplystate').val();
        if (ddlplaceofSupplystate == null || ddlplaceofSupplystate == '') {
          validation += "<span style='color:red;'>*</span> <span>Please select Place of Supply.</span></br>"
        }
      }

      var ddlGSTCategory = $('#ddlGSTCategory').val();
      if (ddlGSTCategory == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select GST Category</span></br>"
      }

      if (this.gstCategoryName != 'Unregistered' && this.gstCategoryName != 'Overseas') {
        var ddlGSTCategorytext = $("#ddlGSTCategory option:selected").text().trim();
        if (ddlGSTCategorytext != "Unregistered Business")
          if (this.fg.value.GSTNumber == "") {
            validation += "<span style='color:red;'>*</span> <span>Please enter GST Number</span></br>"
          }
      }


      // var ddlGSTCategory = $('#ddlplaceofSupplystate').val();
      // if (ddlGSTCategory == null) {
      //   validation += "<span style='color:red;'>*</span> <span>Please select place of supply state</span></br>"
      // }

      // var ddlGSTCategory = $('#ddlplaceofSupplycity').val();
      // if (ddlGSTCategory == null) {
      //   validation += "<span style='color:red;'>*</span> <span>Please select place of supply city</span></br>"
      // }

      if (this.fg.value.Currency == "") {
        validation += "<span style='color:red;'>*</span> <span>Please enter Currency</span></br>"
      }

      if (this.fg.value.LegalTradeName == "") {
        validation += "<span style='color:red;'>*</span> <span>Please enter Legal Trade Name</span></br>"
      }

      if (this.gstCategoryName != "Overseas")
        var ddlGSTCategory = $('#ddlcompanyStatus').val();
      if (ddlGSTCategory == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select Company Status</span></br>"
      }

      if (this.gstCategoryName != "Overseas") {
        if (this.fg.value.TANNumber == "") {
          validation += "<span style='color:red;'>*</span> <span>Please enter TAN Number</span></br>"
        }
      }

      if (this.fg.value.ReceivableSubCategoryId == "") {
        validation += "<span style='color:red;'>*</span> <span>Please select Receivable SubCategory</span></br>"
      }

      if (this.gstCategoryName != "Overseas") {
        if (this.fg.value.PANNumber == "") {
          validation += "<span style='color:red;'>*</span> <span>Please enter PAN Number</span></br>"
        }
      }

      if ($('#ddlLedger').val() == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select LedgerMapping</span></br>"
      }

    }
    //#endregion Account Link---------------------------------------------------------------------------------------------------------------------

    //#region Email Id---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab == "tabEmail") {

      let GridResponse = this.GridRowValidation("submit");

      if (!GridResponse) {
        return false;
      }
    }
    //#endregion Email Id---------------------------------------------------------------------------------------------------------------------

    //#region Interface---------------------------------------------------------------------------------------------------------------------

    //#endregion Interface---------------------------------------------------------------------------------------------------------------------

    // var ddlIsActive = $('#ddlIsActive').val();
    // if (ddlIsActive == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Select Status</span></br>"
    // }

    // if (this.Current_Tab == "tabInterfaces") {    
    //   if (this.fg.value.NDPCode == "") {
    //     validation += "<span style='color:red;'>*</span> <span>Please enter NDP Code</span></br>"
    //   }
    //   if (this.fg.value.DigitalCode == "") {
    //     validation += "<span style='color:red;'>*</span> <span>Please enter Digital Code</span></br>"
    //   }
    //   if (this.fg.value.Others == "") {
    //     validation += "<span style='color:red;'>*</span> <span>Please enter Others</span></br>"
    //   }
    // }

    if (validation != "") { 
      validation = "<div class='col-md-12' style='text-align: left;'>" + validation + "</div>";
      Swal.fire('', validation, 'warning');
      return false;
    } 
    else {

      this.customerModel = new CustomerModel();

      if (this.Current_Tab == 'tabAccounting') { this.fg.controls['onboardstatus'].setValue(1); }
   
      this.updateBasicCustomerDetail();
      //this.customerModel.Customer.Table.push(this.basicCustomerDetail);

      this.updateOfficeDetails();
      //this.customerModel.Customer.Table1.push(this.TabOfficeDetails);

      this.updateSalesPIc();

        this.updateKYCDocument();
      //this.customerModel.Customer.Table2.push(this.TabKYCDocument);

      this.updateAccountLink();
      //this.customerModel.Customer.Table3.push(this.TabAccountLink);

      // this.updateCreditDetails();
      //this.customerModel.Customer.Table4.push(this.TabCreditDetails);

      this.updateEmailId();
      //this.customerModel.Customer.Table5.push(this.TabEmailId);

      this.updateInterface();
      //this.customerModel.Customer.Table6.push(this.TabInterface);

      this.updateDivision();

      this.updateInputPage();

     
      // Related Party
debugger
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
            //-----
debugger  

            this.customerModel.Customer.Table1[0].BranchCode = this.fg.value.BranchCode == "" ? this.Branch_Code :  this.fg.value.BranchCode;

            this.customerService.SaveCustomer(this.customerModel).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {               
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.onBack();
                  }
                })
                 if (!this.isUpdate) { this.updateAutoGenerated(); }
              }

              // this.fg.value.ID = data[0].ID;
              // Swal.fire('', data[0].AlertMessage, 'warning');

            },
              (error: HttpErrorResponse) => {
                Swal.fire(error.message, 'error')
              });
            //------ 
          }
        });
    }
  }

  getWFParams(){
    this.workflow.getWorkflowParams(WF_EVENTS['customerApproval'].EVENT_NO).subscribe({
      next:(res)=>{
        console.log('getWorkflowParams', { res })
        if (res?.AlertMegId == 1) {
          this.workflowParamsNo = res?.Data ? res?.Data : []
        }
      },
      error:(e)=>{
        console.log('getWorkflowParams', { e })
      }
    });
  }

  submitApproval(){
    //alert("approval");

    let eventData: any = {}
    let checkOutstand = 'Fail'

    this.workflowParamsNo.forEach((param: any) => {
      const paramName: any = `param${param?.paramnumber}`;
      if (WF_EVENTS['customerApproval'].PARAMS.Division.toLowerCase().trim() == param?.paramname?.toLocaleLowerCase().trim()) {
        eventData[paramName] = this.userDiv
      }
      else if (WF_EVENTS['customerApproval'].PARAMS.Category.toLowerCase().trim() == param?.paramname?.toLocaleLowerCase().trim()) {
        eventData[paramName] = JSON.stringify(this.fg.value.Category);
      }
      else if (WF_EVENTS['customerApproval'].PARAMS.Country.toLowerCase().trim() == param?.paramname?.toLocaleLowerCase().trim()) {
        eventData[paramName] = this.fg.value.CountryID 
      }
      else if (WF_EVENTS['customerApproval'].PARAMS.Created_by.toLowerCase().trim() == param?.paramname?.toLocaleLowerCase().trim()) {
        eventData[paramName] = this.userName
      }
      
      else {
        eventData[paramName] = ""
      }
    });

    let callbackPayload={
      //"isdata": "U",
      //"customerID": this.cusID,
      "CusBranchID": this.cusBID,
      "status": 0,
      //"method":WF_EVENTS['customerApproval'].CALLBACK_METHOD
    }

    this.workFlowObj = {
      eventnumber: WF_EVENTS['customerApproval'].EVENT_NO,
      eventvalue: this.Branch_Code  ? this.Branch_Code : "" ,
      app: this.globals.appName,
      division: this.userDiv ? this.userDiv :'',
      office: this.userOff ? this.userOff :'',
      eventdata: eventData,
      Initiator: { userid: this.userName ? this.userName : '', usertype: "string" },
      //callbackURL:`${this.globals.APIURLlocal}${WF_EVENTS['customerApproval'].apiEndPoint}`,
      callbackURL:`${this.globals.APIURL}${WF_EVENTS['customerApproval'].apiEndPoint}`,
      callbackURLcontent:JSON.stringify(callbackPayload),
      redirectURL:this.redirectURL
    }
    console.log(this.workFlowObj, 'workflow Obj');

    this.workflow.workflowTrigger(this.workFlowObj).subscribe({
      next: (res) => {
        console.log('workflowTrigger', { res })
        if(res?.AlertMegId  > 0 ){
          
          if(res?.AlertMegId == 1){
            let payload = {
              "CusBranchCode": this.Branch_Code,
            }
            this.workflow.KYCValidation(payload).subscribe(data => {
              if (data.length > 0){
                let dataQ = {
                  "CusBranchID": this.cusBID,
              }
              this.workflow.CustomerConfirm(dataQ).subscribe(xyz => {
                console.log(xyz);
              });

              Swal.fire("Your request has Approved");

              }
              else{
                Swal.fire("Please Update the Accounting Details");
              }
            });
          }
          else{
            Swal.fire("Your request waiting for Approval");
          }         

        }
        else if(res?.AlertMegId == -1){
          Swal.fire(res?.AlertMessage ?  res?.AlertMessage : "")
          return
        }
      },
      error: (err) => {
        console.log('workflowTrigger', { err })
        Swal.fire("Your request not claim approval");
        // this.workflowEventMsg= "Your Quotation not claim approval"
        // this.save();  
      }
  });

  }

  updateAutoGenerated() {
    debugger
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Customers');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  updateInputPage() {

    if (this.Current_Tab == 'tabBranch' && this.divisionListPayload.length == 0) {
      this.inputPage.InputPage = "";
    }
    else if (this.Current_Tab == 'tabBranch' && this.divisionListPayload.length > 0) {
      this.inputPage.InputPage = "Division";
    }
    else if (this.Current_Tab == 'tabSales') {
      this.inputPage.InputPage = "Sales";
    }
    else if (this.Current_Tab == 'tabKYC') {
      this.inputPage.InputPage = "Documents";
    }
    else if (this.Current_Tab == 'tabAccounting') {
      this.inputPage.InputPage = "Account";
    }
    else if (this.Current_Tab == 'tabCredit') {
      this.inputPage.InputPage = "Credit";
    }
    else if (this.Current_Tab == 'tabEmail') {
      this.inputPage.InputPage = "Email";
    }
    else if (this.Current_Tab == 'tabInterfaces') {
      this.inputPage.InputPage = "Interface";
    }
    this.customerModel.Customer.Table9.push(this.inputPage);
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

  btnNewBranch() {

    if (this.fg.value.CustomerID != null && this.fg.value.CustomerBranchID != null) {
      // this.generateCustomerCode(2, this.fg.value.CustomerID); // Branch_Code
      this.getBranchCodeAPI(this.fg.value.CustomerCode);
      var VenStatus = $('#ddlStatusAuto').val();
      this.fg.patchValue({
        CustomerID: this.fg.value.CustomerID,
        CustomerBranchID: 0,

        CustomerCode: this.fg.value.CustomerCode,
        CustomerName: this.fg.value.CustomerName,
        StatusAuto: VenStatus ? VenStatus : '',//this.fg.value.StatusAuto,
        CountryID: this.fg.value.CountryID,
        Category: this.fg.value.Category,
        IsActive: this.fg.value.IsActive,
        ShortName: this.fg.value.ShortName,
        URL: this.fg.value.URL,
        //Status: '',

        //Status: '', 

        // Tab1
        BranchCode: this.Branch_Code,
        BranchCity: '',
        onboardstatus: '1',
        PinCode: '',
        PrimaryContact: '',
        PhWork: '',
        PhMobile: '',
        Address: '',
        IsActiveBranch: 0,
        Telephone: '',
        designation: '',
        emailid: '',
        primaryTelephone: '',
        mobile: '',
        PhoneNo: '',

        DocumentName: '',
        //AccountLink
        CustomerAccountID: 0,
        // GSTCategory: 0,
        GSTNumber: '',
        PlaceofSupplyState: 0,
        PlaceofSupplyCity: 0,
        // Currency: 0,
        // LegalTradeName: '',
        // CompanyStatus: 0,
        // PANNumber: '',
        // MSMENumber: '',
        // TANNumber: '',
        // ReceivableSubCategoryId: '',

        //CreditDetails
        CustomerCreditID: 0,
        Agreement: 0,
        CreditDays: '',
        CreditLimit: '',
        ApprovedBy: '',
        EffectiveDate: '',

        //Interface
        CustomerInterfaceID: 0,
        NDPCode: '',
        DigitalCode: '',
        Others: ''

      });

      this.SalesPICPayload = [];
      this.documentPayloadInfo = [];
      this.customerEmailList = [];

      // this.DynamicGridEmail.length = 0;
      // this.GridPushEmptyrow_Email();
    }
  }

  //----------------------------------------------------------------------------------
  //#region Grid
  DynamicGridEmail: EmailId[] = [];
  EmptyDynamicGrid: any = {};
  //DynamicGrid: Array<EmailId> = [];

  // CustomerEmailID = 0;
  // CustomerBranchID = 0;
  // AlertTypeId = 1;
  // EmailId = "";
  // CreatedOn = "";
  // UpdatedOn = ""

  GridPushEmptyrow_Email() {

    this.EmptyDynamicGrid = { CustomerEmailID: 0, CustomerBranchID: 0, AlertTypeId: 0, EmailId: "", CreatedOn: null, UpdatedOn: null, UpdatedBy: this.LoginUsername };
    this.DynamicGridEmail.push(this.EmptyDynamicGrid);
  }

  GridRowDuplicateValidation(): boolean {
    //let IsExists = false;

    let index_1 = 0; let index_2 = 0;

    for (let item of this.DynamicGridEmail) {
      index_1 += 1; index_2 = 0;

      for (let item2 of this.DynamicGridEmail) {
        index_2 += 1;

        if (item.AlertTypeId == item2.AlertTypeId && item.EmailId.toUpperCase() == item2.EmailId.toUpperCase() && index_1 != index_2) {
          return true;
        }
      }
    }
    return false;
  }

  DynamicGridDeleteRowEmail1(id) {
    this.DynamicGridEmail.forEach((element, index) => {
      if (element.AlertTypeId == id) {
        //delete this.DynamicGridEmail[index];
        this.DynamicGridEmail.splice(index, 1);
        //Swal.fire("Selected Alert type Already Added!");
      }
    });
    // console.log(this.DynamicGridEmail)

    if (this.DynamicGridEmail.length == 0) {
      this.GridPushEmptyrow_Email();
      return false;
    }

  }

  GridRowValidation(flag): boolean {
    var validation = "";

    if (this.DynamicGridEmail.length == 1 && flag == "submit") {
      if (this.DynamicGridEmail[0].AlertTypeId == 0 && this.DynamicGridEmail[0].EmailId == "") {
        return true;
      }
    }

    let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    let index_1 = 0; let index_2 = 0;

    for (let item of this.DynamicGridEmail) {

      if (item.AlertTypeId <= 0) {
        Swal.fire('', "Please select alert type", 'warning');
        //validation = "Please select alert type";
        return false;
      }

      if (!item.EmailId || item.EmailId.trim() == '') {
        Swal.fire('', "Please enter alert email", 'warning');
        //validation = "Please enter alert email";
        return false;
      }

      if (item.EmailId.trim() != "") {
        if (!item.EmailId.trim().match(emailPattern)) {
          Swal.fire('', "Please enter valid alert email", 'warning');
          //validation = "Please enter valid alert email";
          return false;
        }
        else {
          let IsDuplicate = this.GridRowDuplicateValidation();

          if (IsDuplicate) {
            // gRow.AlertTypeId = 0;
            // gRow.EmailId = "";
            Swal.fire('', "Selected alert type and email already added!", 'warning');
            //validation = "Selected alert type and email already added!";
            return false;
          }

          // var saveObj = { "CustomerEmailID": 0, "CustomerBranchID": 0, "AlertTypeId": 0, "EmailId": "", "CreatedOn": this.DateNow, "UpdatedOn": this.DateNow, "UpdatedBy": this.LoginUsername }
          // this.DynamicGridEmail.push(saveObj);
        }
      }
    }
    return true;
  }

  DynamicGridAddRowEmail(gRow, id) {

    let GridResponse = this.GridRowValidation("addrow");

    if (GridResponse) {
      this.GridPushEmptyrow_Email();
    }
  }


  // DynamicGridAddRowEmail(gRow, id) {
  //   this.GridRowValidation();
  //   let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  //   if (this.DynamicGridEmail[0].AlertTypeId < 0) {
  //     Swal.fire('', "Please select alert type", 'warning');
  //     return false;
  //   }
  //   if (!this.DynamicGridEmail[0].EmailId || this.DynamicGridEmail[0].EmailId.trim() == '') {
  //     Swal.fire('', "Please enter alert email", 'warning');
  //     return false;
  //   }
  //   if (this.DynamicGridEmail[0].EmailId.trim() != "") {
  //     if (!this.DynamicGridEmail[0].EmailId.trim().match(emailPattern)) {
  //       Swal.fire('', "Please enter valid alert email", 'warning');
  //       return false;
  //     }
  //     else {
  //       let IsDuplicate = this.GridRowDuplicateValidation();

  //       if (IsDuplicate) {
  //         gRow.AlertTypeId = 0;
  //         gRow.EmailId = "";
  //         Swal.fire('', "Selected Alert type and Email Already Added!", 'warning');
  //         return false;
  //       }

  //       var saveObj = { "CustomerEmailID": 0, "CustomerBranchID": 0, "AlertTypeId": 0, "EmailId": "", "CreatedOn": this.DateNow, "UpdatedOn": this.DateNow, "UpdatedBy": this.LoginUsername }
  //       this.DynamicGridEmail.push(saveObj);
  //     }
  //   }
  // }

  //-----------
  DynamicGridDeleteRowEmail(DynamicGridEmail, index, Id) {

    var AlertTypeId = DynamicGridEmail[index].AlertTypeId;

    if (this.DynamicGridEmail.length == 1 && AlertTypeId == 0) {
      Swal.fire("", "No Rows to Delete", 'warning');
      return false;
    }

    this.DynamicGridEmail.splice(index, 1);

    if (this.DynamicGridEmail.length == 0) {
      this.GridPushEmptyrow_Email();
      return false;
    }


  }
  //#endregion Grid

  editOrgId: Number = 0;
  divisionChange(event) {

    this.FillDivisionMaster.forEach((element) => {

      if (element.DivisionID == event.target.value) {
        element.isChecked = element.isChecked == true ? false : true;
      }
    })
  }
  //---------------------------------------------------------------------------------------------

  CurrentTAB(tabname) {
    // console.log(tabname);
    this.Current_Tab = tabname;
  }


  getCategoryList() {
    const URL = `${this.globals.APIURL}/Organization/GetCategoryList`;
    this.dataService.post(URL, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.categoryList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  getEmailCategoryList() {
    const URL = `${this.globals.APIURL + '/Customer/GetCustomerEmailCategorys'}`;
    this.dataService.post(URL, {}).subscribe(
      (result: any) => {
        if (result.data.Table.length > 0) {
          this.emailCategoryList = result.data.Table;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getDivisionList(filter?: string) {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        for (let data of result.data.Table) {
          if (data.Active) {
            this.divisionList.push(data)
          }
        }
      }
    }, error => { });
  }

  GetGSTCategory() {
    var service = `${this.globals.APIURL}/Customer/GetGSTCategory`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.GSTCategoryList = [];
      if (result.data.Table.length > 0) {
        this.GSTCategoryList = result.data.Table;
      }
    }, error => { });
  }


  // Related Party (s)
  OnClickAddValue() {

    var validation = "";
    if (this.fg.value.RelatedCustomerCode == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Customer Code </span></br>"
    }
    if (this.fg.value.Name === "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Name</span></br>"
    }

    let relatedInfo = this.fg.value;

    if (!this.isEditMode) {
      let customerCode = this.DynamicSlotRelatedParty.filter(x => x.RelatedCustomerCode == relatedInfo.RelatedCustomerCode);
      if (customerCode.length > 0) {
        validation += "<span style='color:red;'>*</span> <span>Already, a related party has been created; please map the new related party.</span></br>"
      }
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    let relatedInfoDetails = { ID: relatedInfo.ID, RelatedCustomerCode: relatedInfo.RelatedCustomerCode, Name: relatedInfo.Name };

    this.relativePartyUpdate(relatedInfoDetails)

    // edit mode
    if (this.isEditMode) {
      this.DynamicSlotRelatedParty[this.editSeletedIdex] = relatedInfoDetails;
      this.isEditMode = !this.isEditMode;
    }
    else {
      // create mode
      this.DynamicSlotRelatedParty.push(relatedInfoDetails);
    }
    this.fg.controls['ID'].setValue(0);
    this.fg.controls['RelatedCustomerCode'].setValue('');
    this.fg.controls['Name'].setValue('');
  }

  OnClickRadio(index, selectedEID) {
    this.editSeletedIdex = index;
  }

  OnClickEditValue(row, index) {
    const editRow = this.DynamicSlotRelatedParty[this.editSeletedIdex];
    this.patchEmailForm(editRow);
    this.isEditMode = !this.isEditMode;

  }

  OnClickDeleteValue() {
    let deleteInfo = this.DynamicSlotRelatedParty[this.editSeletedIdex].ID
    let service = `${this.globals.APIURL}/Customer/DeleteCustomerRelatedParties`;
    this.dataService.post(service, { RelatedPartiesId: deleteInfo }).subscribe((result: any) => {
      this.getRelativeParties();
    }, error => {
      console.error(error);
    });
  }

  patchEmailForm(editRow) {
    this.fg.patchValue({
      ID: editRow.ID,
      RelatedCustomerCode: editRow.RelatedCustomerCode,
      Name: editRow.Name,
    });
  }

  async CustomerList() {
    await this.customerservice.getCustomerList(this.fg.value).subscribe(data => {
      this.CustomerListItem = [];
      if (data['data'].Table.length > 0) {
        for (let info of data['data'].Table) {
          if (info.CustomerCode != this.Customer_Code) {
            this.CustomerListItem.push(info);
          }
        }
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
      });
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

  async getStateList(countryId?) {
    let payload = {};
    if (countryId) {
      payload = {
        CountryID: countryId
      };
    }
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCities`;
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.stateList = result;
    }, error => { });

    this.getStateListOnly(countryId);
  }

  selectedDivision(event) {
    event = [...new Set(event)];
    this.divisionListPayload = [];
    this.divisionNameList = [];
    if (event.length > 0) {
      for (let data of event) {
        let formDivisionList = this.divisionList.find(x => x.ID == data);
        this.divisionNameList.push(formDivisionList.DivisionName);
        this.divisionListPayload.push({
          CusDivId: 0,
          CustomerId: 0,
          DivisionId: formDivisionList.ID,
          CustomerBranchId: 0
        });
      }
    }
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.length > 0) {
        this.currencyList = result;
      }
    }, error => { });
  }

  async getCustomerSourceList() {
    debugger
    var service = `${this.globals.APIURL}/Customer/GetSalesSource`;
    await this.dataService.post(service, {}).subscribe((result: any) => {
      this.sourceList = [];
      if (result.data.Table.length > 0) {
        this.sourceList = result.data.Table;
        // console.log(this.sourceList, "this.sourceList")
      }
    }, error => { });
  }

  sourceChanged(event) {
    debugger
    if (event == 'Overseas Agent' || event == 'Local Sales') {
      this.isSalesPICDropDown = true;
      var service = `${this.globals.APIURL}/Customer/${event == 'Overseas Agent' ? 'GetSalesAgent' : event == 'Local Sales' ? 'GetSalesEmployee' : ''}`;
      this.dataService.post(service, {}).subscribe((result: any) => {
        this.salesPICList = [];
        if (result.data.Table.length > 0) {
          this.salesPICList = result.data.Table;
        }
      }, error => { });
    }
    else {
      this.isSalesPICDropDown = false;
    }
  }

  addSalesPIC() {
    var validation = "";
    if (this.fg.value.Source == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select source </span></br>"
    }

    if (this.fg.value.Source == 'Local Sales') {
      if (this.fg.value.SalesPIC == "") {
        validation += "<span style='color:red;'>*</span> <span>Please select Sales PIC</span></br>"
      }
    }
    // if (this.fg.value.Source === 'Corporate' || this.fg.value.Source === 'Import Customer') {
    //   if (this.fg.value.SalesPIC === "") {
    //     validation += "<span style='color:red;'>*</span> <span>Please Enter Sales PIC</span></br>"
    //   }
    // }
    if (this.fg.value.EffectiveSalesDate === "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>"
    }

    // if (this.fg.value.Remarks === "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Remarks</span></br>"
    // }
    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    this.SalesPICPayload.push({
      SalesId: 0,
      CustomerBranchID: this.fg.value.CustomerBranchID,
      Source: this.fg.value.Source,
      SalesPIC: this.fg.value.SalesPIC,
      EffectiveDate: this.fg.value.EffectiveSalesDate,
      Remarks: this.fg.value.Remarks
    });

    this.fg.controls['Source'].setValue('');
    this.fg.controls['SalesPIC'].setValue('');
    this.fg.controls['EffectiveSalesDate'].setValue('');
    this.fg.controls['Remarks'].setValue('');
  }

  uploadDocument(event: any) {
    debugger
    if (event) {

      this.selectedFile = event.file.target.files[0];
      const filedata = new FormData();
      filedata.append('file', this.selectedFile, this.selectedFile.name)

      this.commonservice.AttachUpload(this.selectedFile).subscribe(data => {
        if (data) {
          this.documentPayloadInfo.push({
            CustomerDocumentsID: 0,
            CustomerBranchID: this.fg.value.CustomerBranchID,
            DocumentName: event.DocumentName,
            FilePath: event.FilePath,
            UniqueFilePath: data.FileNamev,
            // UpdateOn: this.datePipe.transform(new Date(), 'YYYY-MM-dd')
          });
        }
      },
        (error: HttpErrorResponse) => {
          Swal.fire(error.message, 'error')
        });
    }
  }

  // deleteDocument(deleteIndex) {
  //   const index = this.documentPayloadInfo.findIndex((element) => element.CustomerDocumentsID == deleteIndex.CustomerDocumentsID)
  //   this.documentPayloadInfo.splice(index, 1);
  // }
  deleteDocument(event) {
    debugger
    const indexToDelete = event;
    if (indexToDelete >= 0 && indexToDelete < this.documentPayloadInfo.length) {
      this.documentPayloadInfo.splice(indexToDelete, 1);
    }
  }


  saveOfficeDetails(event: any) {
    if (event.length > 0 || event.length == 0) {
      this.emailIDPayLoad = event;
      this.onSubmit();
    }
  }

  public checkError = (formGroupName: string, controlName: string, errorName: string) => {
    return this.fg.controls[controlName].hasError(errorName);
  }

  get f() {
    return this.fg.controls;
  }


  getOnboardingList() {
    var service = `${this.globals.APIURL}/Customer/GetOnBoardList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.onBoardList = [];
      if (result.data.Table.length > 0) {
        this.onBoardList = result.data.Table;
      }
    }, error => { });
  }

  relatedCustomerCodeSelect(event) {
    if (event) {
      let info = this.CustomerListItem.find(x => x.CustomerCode == event);
      if (info.CustomerCode == this.Customer_Code) {
        this.fg.controls['RelatedCustomerCode'].setValue('');
        this.CustomerList();
        var validation = '';
        validation += "<span style='color:red;'>*</span> <span>If the selected customer code and the current customer code are the same, please select a different customer code.</span></br>"
        Swal.fire(validation)
        return false;
      }
      else {
        this.fg.controls['Name'].setValue(info.CustomerName);
      }
    }
  }

  relativePartyUpdate(relatedInfoDetails) {
    this.DynamicSlotRelatedParty = [];
    if (this.isUpdate) {
      let relatedPayLoad = [];
      for (let data of [relatedInfoDetails]) {
        let info = this.CustomerListItem.find(x => x.CustomerCode == data.RelatedCustomerCode);
        relatedPayLoad.push({
          RelatedPartiesId: data.ID,
          CustomerID: info.CustomerID,
          CustomerName: data.Name,
          ParentCustomerId: this.fg.value.CustomerID,
          CustomerCode: info.CustomerCode
        });
      }
      var service = `${this.globals.APIURL}/Customer/SaveRelatedParties`; var payload: any = { RelatedParties: { Table: relatedPayLoad } }
      this.dataService.post(service, payload).subscribe((result: any) => { this.getRelativeParties(); }, error => { });
    }
  }

  getRelativeParties() {
    this.DynamicSlotRelatedParty = [];
    var service = `${this.globals.APIURL}/Customer/GetRelatedCustomer`; var payload: any = { CustomerCode: this.Customer_Code }
    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.data.CustomerSalesPIC.length > 0) {
        for (let data of result.data.CustomerSalesPIC) {
          if (data.CustomerCode != null) {
            this.DynamicSlotRelatedParty.push({
              ID: data.RelatedPartiesId,
              RelatedCustomerCode: data.CustomerCode,
              Name: data.CustomerName,
            })
          }
        }
      }
    }, error => { });
  }


 async getNumberRange() {
    debugger
    return new Promise(async (resolve, rejects) => {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
    this.dataService.post(service, { Id: 0, ObjectId: 0 }).subscribe((result: any) => {
      if (result.message = "Success") {
        this.autoGenerateCodeList = [];
        if (result.data.Table.length > 0) {
          for (let data of result.data.Table) {
            data.EffectiveDate = this.datePipe.transform(data.EffectiveDate, 'YYYY-MM-dd');
          } resolve(true);
          this.autoGenerateCodeList = result.data.Table;  
        } 
        resolve(true);
      } 
    }, error => {
      console.error(error);
      resolve(true);
    });
  })
  }
  async autoCodeGeneration(event: any) {
    if (!this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Customers');
        if (Info.length > 0) {
          let sectionOrderInfo =  this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.fg.controls['CustomerCode'].setValue(code.trim().toUpperCase());
          this.Customer_Code = code.trim().toUpperCase();
          this.getBranchCodeAPI(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Customer.');
        }
      }
      else {
       this.fg.controls['CustomerCode'].setValue('');
        this.getNumberRange();
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

  getBranchCodeAPI(code: string) {
    let service = `${this.globals.APIURL}/Customer/CustomerBranchCodeGeneration`;
    this.dataService.post(service, { ID: this.updateCustomerId ? this.updateCustomerId : 0, Code: code.match(/\d+/g).join("") }).subscribe((result: any) => {
      if (result.message = "Success") {
        if (result.data.Table.length > 0) {
          this.Branch_Code = result.data.Table[0].BranchCode;
          this.fg.controls['BranchCode'].setValue(result.data.Table[0].BranchCode);
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async getStateListOnly(countryId?) {

    let payload = {};
    if (countryId) {
      payload = {
        CountryID: countryId
      };
    }
    var service = `${this.globals.SaApi}/SystemAdminApi/GetState`;
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.countryStateList = result;
    }, error => { });
  }

  async validatePAN(event: any) {
    if (event) {
      let payload = { Id: this.fg.value.CustomerID, PANNo: event, ModuleId: 1 }
      await this.commonservice.panValidation(payload).subscribe(result => {
        if (result['data'].Table[0].Message == 'PAN no already exists') {
          Swal.fire(`Already, the PAN Number (${event}) exists.`);
          this.fg.controls['PANNumber'].setValue('');
        }
        else { return false; }
      })
    }
  }

  getCreditList() {
    const payload = {
      "CustomerId": this.updateCustomerId
    }
    this.customerService.getCustomerCreditList(payload).subscribe((result) => {
      if (result.message == 'Success') {
        this.customerCreditList = result.data.Table;
      }
    })
  }

  getLedgerMappingParentAccountList() {
    debugger
    const payload = {
      ModuleType: 1
    }
    this.commonservice.getLedgerMappingParentAccountList(payload).subscribe(data => {
      this.parentAccountList = data["data"].Table;
    });
  }

}
