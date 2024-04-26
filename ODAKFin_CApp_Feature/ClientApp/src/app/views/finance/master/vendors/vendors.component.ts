

import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, City, Status, StatusView } from 'src/app/model/common';
import { AccountLink, Alerttype, BasicVendorDetails, VendorModel, Division, DivisionLable, DivisionTypes, EmailId, Interface, KYCDocument, OfficeDetails, TDSLink, CreditDetails } from 'src/app/model/financeModule/Vendor';

import { CommonService } from 'src/app/services/common.service';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
//import * as _ from 'lodash';
import { FinancialyearService } from 'src/app/services/financeModule/financialyear.service';
import { Country, States } from 'src/app/model/Organzation';
import { TDSService } from 'src/app/services/financeModule/tds.service';
import { Section } from 'src/app/model/financeModule/TDS';
import { Globals } from 'src/app/globals';
import { DataService } from 'src/app/services/data.service';
import { CustomerService } from 'src/app/services/financeModule/customer.service';
import { DatePipe } from '@angular/common';
import { CommonPatternService } from 'src/app/shared/service/common-pattern.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  fg: FormGroup;
  FormMode: String = "A";
  CategoryMaster: Category = new Category();
  Vendordivision: Division[] = [];

  minDate: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  VendorModel: VendorModel = new VendorModel();
  basicVendorDetail: BasicVendorDetails = new BasicVendorDetails();
  TabOfficeDetails: OfficeDetails = new OfficeDetails();
  TabKYCDocument: KYCDocument = new KYCDocument();
  TabAccountLink: AccountLink = new AccountLink();
  TabCreditDetails: CreditDetails = new CreditDetails();
  TabTDSLink: TDSLink = new TDSLink();
  TabEmailId: EmailId = new EmailId();
  TabInterface: Interface = new Interface();
  TabDivision: Division = new Division();

  FillAlertType: Alerttype[];
  FillFinancialyear: any[];
  FillDivisionMaster: DivisionLable[] = []; tdsTableForm: FormGroup;
  editSelectedTdsIndex: any;
  tdsTableEditMode: boolean;
  creditDetailsForm: FormGroup;

  divisionMaster: DivisionTypes = new DivisionTypes();

  countryList: any;
  FillCategory: Category[];
  gstCategoryList: any[];
  FillCompanyStatus: any[];
  FillState: States[];
  FillCity: City[];
  countryStateList: any = [];
  FillAgreement: any[];
  FillVendorStatus: any[];
  FillCurrency: any[];
  FillVendorEmailHistory: any[];

  FillDITReasonGrid: any[];
  FillDITReason: any[];
  FillTDSApplicability: any[];
  FillReasonForNonTDS: any[];
  FillSection: any[];
  Vendor_Code: string = "";
  Branch_Code: string = "";
  LoginUsername = localStorage.getItem("UserName");
  DateNow = new Date().toISOString().split('T')[0];
  Current_Tab: string = "tabBranch";
  TDSValue = "";
  NonTDSValue = "";
  NonTDSID = 0;
  countryId = 0;
  statusvalues: Status[] = new StatusView().statusvalues;
  TDSApplicability = [{ name: 'Yes', id: 1 }, { name: 'No', id: 2 }, { name: 'LDC', id: 3 }]
  tdsSectionData: Section[] = [];
  tdsTableData: any[] = [];
  creditDetailsTableData: any[] = [];
  editSelectedCreditIndex: any;
  creditTableEditMode: any;
  divisionList: any[] = [];
  DynamicSlotRelatedParty: any[] = [];
  relatedPartyForm: FormGroup;
  relatedPartyEditMode: any;
  editSelectedPartyIndex: any;
  categoryList: any;
  CustomerListItem: any = [];
  selectedCustomerDivsions: any[] = [];
  bankDetailsList: any[] = [];

  vendorEmailList: any[] = [];

  onboardStatusList: any;
  currencyList: any[] = [];
  payableSubList: any[] = [];
  emailIDPayLoad: any = [];
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  documentInfo = []
  ModuleId: any
  modules: any;
  moduleName = 'Vendor'
  mappingSuccess: boolean = false;
  errorMessage: any;
  entityDateFormat = this.commonservice.getLocalStorageEntityConfigurable('DateFormat')
  //  ** need to send the tab name to API for the below object used
  InputPage = {
    tabBranch: 'Division',
    tabbankDetails: 'Bank',
    tabKYC: 'Documents',
    tabAccounting: 'Account',
    tabTDSLink: 'TDS',
    creditDetails: 'Credit',
    tabEmail: 'Email',
    tabInterfaces: 'Interface',
  };
  tdsFormDisable = {
    tds_yes: false,
    tds_no: false,
    LDC: false
  }
  panPattern = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/;
  gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  documentPayloadInfo: any = [];
  vendorDetailsById: any = [];
  vendarList: any = [];
  isUpdate: boolean = false;
  updateVendorId: any;
  isVendorEditMode = false;
  formSubmit: boolean;
  bankDetailsAdd: boolean;
  reasonList: any;
  companyDetailId: any;
  entityCurrency: any;
  entityCurrencyID: any;
  savedVendorsCode: any[]

  gstCategoryInput = {
    placeOfSupport: true,
    GST: true,
    legalName: true,
    companyStatus: true,
    currency: true,
    pan: true,
    tan: true,
    MSME: true,
    SubCategory: true
  }

  gstCategoryFields = {
    Registered: {
      placeOfSupport: true,
      GST: true,
      legalName: true,
      companyStatus: true,
      currency: true,
      pan: true,
      tan: true,
      MSME: false,
      SubCategory: true
    },
    Unregistered: {
      placeOfSupport: true,
      GST: false,
      legalName: true,
      companyStatus: true,
      currency: true,
      pan: true,
      tan: true,
      MSME: false,
      SubCategory: true
    },
    Overseas: {
      placeOfSupport: false,
      GST: false,
      legalName: true,
      companyStatus: false,
      currency: true,
      pan: false,
      tan: false,
      MSME: false,
      SubCategory: true
    },
    Composition: {
      placeOfSupport: true,
      GST: true,
      legalName: true,
      companyStatus: true,
      currency: true,
      pan: true,
      tan: true,
      MSME: false,
      SubCategory: true
    },
    SEZ: {
      placeOfSupport: true,
      GST: true,
      legalName: true,
      companyStatus: true,
      currency: true,
      pan: true,
      tan: true,
      MSME: false,
      SubCategory: true
    }
  }
  autoGenerateCodeList: any = [];
  divisionDisableList: any = [];
  categoryDisableList: any = [];
  bankEditSelectedIndex = '';
  isBankEditMode = false;

  isBranchDetails: boolean = false;
  isBankDetails: boolean = false;
  isKYCDocuments: boolean = false;
  isAccounting: boolean = false;
  isTDS: boolean = false;
  isCreditDetails: boolean = false;
  isEmailids: boolean = false;
  isInterfaces: boolean = false;
  parentAccountList: any[];
  selectedFile: File = null;
  fileUrl: string;

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private ms: MastersService
    , private commonservice: CommonService, private VendorService: VendorService, private fy: FinancialyearService,
    private tdsService: TDSService, private globals: Globals, private dataService: DataService, private autoCodeService: AutoCodeService,
    private customerservice: CustomerService, private datePipe: DatePipe, private patternService: CommonPatternService) {
    this.route.params.subscribe(params => {
      if (params['Vendor_ID']) {
        this.updateVendorId = params['Vendor_ID']
        this.getPermissionListForUpdate(563, 'Branch Details');
        this.getPermissionListForCreate(563, 'Bank Details');
        this.getPermissionListForCreate(558, 'KYC Documents');
        this.getPermissionListForCreate(559, 'Accounting');
        this.getPermissionListForCreate(560, 'TDS');
        this.getPermissionListForCreate(561, 'Credit Details');
        this.getPermissionListForCreate(561, 'Email ids');
        this.getPermissionListForCreate(564, 'Interfaces');
      } else {
        this.getPermissionListForCreate(563, 'Branch Details');
        this.getPermissionListForCreate(563, 'Bank Details');
        this.getPermissionListForCreate(558, 'KYC Documents');
        this.getPermissionListForCreate(559, 'Accounting');
        this.getPermissionListForCreate(560, 'TDS');
        this.getPermissionListForCreate(561, 'Credit Details');
        this.getPermissionListForCreate(561, 'Email ids');
        this.getPermissionListForCreate(564, 'Interfaces');
      }

      this.fg = this.fb.group({
        VendorID: params['Vendor_ID'],
        VendorBranchID: params['Vendor_BranchID']
      });
    });
    this.getEntityCompanyDetails(); // get the entity details
    this.createTdsTableForm();
    this.createCreditDetailsForm();
    this.createRelatedPartyForm();
  }

  checkPermission(value) {
    if (value == 'tabBranch' && this.isBranchDetails == true) {
      this.Current_Tab = 'tabBranch'
    } else if (value == 'tabbankDetails' && this.isBankDetails == true) {
      this.Current_Tab = 'tabbankDetails'
    } else if (value == 'tabKYC' && this.isKYCDocuments == true) {
      this.Current_Tab = 'tabKYC'
    } else if (value == 'tabAccounting' && this.isAccounting == true) {
      this.Current_Tab = 'tabAccounting'
    } else if (value == 'tabTDSLink' && this.isTDS == true) {
      this.Current_Tab = 'tabTDSLink'
    } else if (value == 'creditDetails' && this.isCreditDetails == true) {
      this.Current_Tab = 'creditDetails'
    } else if (value == 'tabEmail' && this.isEmailids == true) {
      this.Current_Tab = 'tabEmail'
    } else if (value == 'tabInterfaces' && this.isInterfaces == true) {
      this.Current_Tab = 'tabInterfaces'
    }
    else {
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
      if (route == 'Branch Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isBranchDetails = true;
            } else {
              this.isBranchDetails = false;
            }
          }
        } else {
          this.isBranchDetails = false;
        }
      }

      if (route == 'Bank Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isBankDetails = true;
            } else {
              this.isBankDetails = false;
            }
          }
        } else {
          this.isBankDetails = false;
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

      if (route == 'Accounting') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isAccounting = true;
            } else {
              this.isAccounting = false;
            }
          }
        } else {
          this.isAccounting = false;
        }
      }

      if (route == 'TDS') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isTDS = true;

            } else {
              this.isTDS = false;
            }
          }
        } else {
          this.isTDS = false;
        }
      }

      if (route == 'Credit Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isCreditDetails = true;

            } else {
              this.isCreditDetails = false;
            }
          }
        } else {
          this.isCreditDetails = false;
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

      if (this.isBranchDetails == true) {
        this.Current_Tab = 'tabBranch';
      }
      else if (this.isBankDetails == true) {
        this.Current_Tab = 'tabbankDetails';
      }
      else if (this.isKYCDocuments == true) {
        this.Current_Tab = 'tabKYC';
      }
      else if (this.isAccounting == true) {
        this.Current_Tab = 'tabAccounting';
      }
      else if (this.isTDS == true) {
        this.Current_Tab = 'tabTDSLink';
      }
      else if (this.isCreditDetails == true) {
        this.Current_Tab = 'creditDetails';
      }
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

      if (route == 'Branch Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isBranchDetails = true;
            } else {
              this.isBranchDetails = false;
            }
          }
        } else {
          this.isBranchDetails = false;
        }
      }

      if (route == 'Bank Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isBankDetails = true;
            } else {
              this.isBankDetails = false;
            }
          }
        } else {
          this.isBankDetails = false;
        }
      }

      if (route == 'KYC Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isKYCDocuments = true;
            } else {
              this.isKYCDocuments = false;
            }
          }
        } else {
          this.isKYCDocuments = false;
        }
      }

      if (route == 'Accounting') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isAccounting = true;
            } else {
              this.isAccounting = false;
            }
          }
        } else {
          this.isAccounting = false;
        }
      }

      if (route == 'TDS') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isTDS = true;

            } else {
              this.isTDS = false;
            }
          }
        } else {
          this.isTDS = false;
        }
      }

      if (route == 'Credit Details') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isCreditDetails = true;

            } else {
              this.isCreditDetails = false;
            }
          }
        } else {
          this.isCreditDetails = false;
        }
      }

      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
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

            if (data[0].Update_Opt == 2) {
              this.isInterfaces = true;
            } else {
              this.isInterfaces = false;
            }
          }
        } else {
          this.isInterfaces = false;
        }
      }

      if (this.isBranchDetails == true) {
        this.Current_Tab = 'tabBranch';
      }
      else if (this.isBankDetails == true) {
        this.Current_Tab = 'tabbankDetails';
      }
      else if (this.isKYCDocuments == true) {
        this.Current_Tab = 'tabKYC';
      }
      else if (this.isAccounting == true) {
        this.Current_Tab = 'tabAccounting';
      }
      else if (this.isTDS == true) {
        this.Current_Tab = 'tabTDSLink';
      }
      else if (this.isCreditDetails == true) {
        this.Current_Tab = 'creditDetails';
      }
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

  async ngOnInit(): Promise<void> {
    // this.getModuleType(); //------ ledger maping validate conditions are removed due to mapped account in Vendor itself --08-03-2024
    this.getLedgerMappingParentAccountList();
    if (this.autoGenerateCodeList.length == 0) { this.getNumberRange() };
    //console.log(this.route.snapshot.params['Vendor_ID']);
    //console.log(this.route.snapshot.params['Vendor_BranchID']);
    this.getCategoryList();
    this.OnBindDropdownCountry();
    this.createForm();
    this.getBusinessDivision();
    this.getCategory();
    this.getGSTCategory();
    this.OnBindCompanyStatus();
    this.OnBindDropdownStates(53);
    this.OnBindAgreement();
    this.OnBindVendorStatus();
    this.OnBindDropdownSection();
    this.OnBindDropdownAlerttype();
    this.DynamicGridEmail.length = 0;
    // this.GridPushEmptyrow_Email();
    this.GridPushEmptyrow_DIT();
    this.OnBindDITReason();
    this.OnBindReasonForNonTDS();
    this.OnBindTDSApplicability();
    this.OnBindTDSSection();
    this.getDivisionList();
    this.CustomerList();
    this.getPayableSubCategory();
    this.getOnBoard();
    this.getReasonList();
    // this.getCurrency();
    this.OnBindDropdownfinancialYear();

    // this.getVendorPartyList();
    $("#divPAN").addClass("is-hide");
    $("#divTAN").addClass("is-hide");
    $("#divState").addClass("is-hide");
    $("#divCity").addClass("is-hide");
    $("#divGSTCategory").addClass("is-hide");
    $("#divGSTNumber").addClass("is-hide");
    if (this.updateVendorId) {
      this.isUpdate = true;
      this.fg.disable();
      this.tdsTableForm.controls['StartDate'].disable();
      this.tdsTableForm.controls['EndDate'].disable();
      this.tdsTableForm.controls['Date'].disable();

    }

  }

  createTdsTableForm() {
    this.tdsTableForm = this.fb.group({
      VendorTDSID: [],
      TDSApplicability: [0],
      TDSSectionId: [0],
      Reason: [0],
      CertificateName: [],
      CertificatePath: [],
      Rate: [],
      StartDate: [],
      EndDate: [],
      Date: [],
      TDSRate: [0]

    })
  }

  createCreditDetailsForm() {
    this.creditDetailsForm = this.fb.group({
      VendorCreditID: [0],
      CreditDays: [],
      CreditLimit: [],
      Currency: [],
      Effectivedate: [],
      ApprovedBy: [this.LoginUsername],
      Date: [this.DateNow]
    });
  }

  createRelatedPartyForm() {
    this.relatedPartyForm = this.fb.group({
      RelatedPartiesId: 0,
      VendorID: 0,
      VendorName: ['', Validators.required],
      ParentVendorId: this.fg.value.VendorID,
      VendorCode: ['', Validators.required],
    });
  }

  onBack() {
    this.router.navigate(['/views/finance/Vendor/Vendorview']);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  createForm() {

    if (this.fg.value.VendorID != null && this.fg.value.VendorBranchID != null) {
      this.isVendorEditMode = true;
      this.FormMode = "E";
      const payload = {
        VendorID: this.fg.value.VendorID,
        VendorBranchID: this.fg.value.VendorBranchID
      };
      this.VendorService.getVendorId(payload).pipe().subscribe(response => {

        this.EditModeValueBInd(response);
        //this.fg.patchValue(response["data"][0]);
        this.getVendorEmailHistory(response['data'].Table1[0]['VendorBranchID']);
      });
    }
    else {
      // this.generateVendorCode(1, 0); // Vendor_Code
      // this.generateVendorCode(2, 0); // Branch_Code
    }

    this.fg = this.fb.group({

      // Vendor (main page)
      // ** table start
      VendorID: 0,
      VendorCode: this.Vendor_Code,
      VendorName: '',
      VendorStatus: '',
      CountryID: 0,
      // CategoryId: '',
      CategoryId: [],
      IsActive: 'true',
      ShortName: '',
      URL: '',
      // ** Table end

      //StatusAuto: 336,
      StatusAuto: new FormControl({ value: 336, disabled: true }, Validators.required),

      customerDivision: [],
      // Category: 0,

      //Status: '',

      // ** Table1 start
      VendorBranchID: 0,
      BranchCode: this.Branch_Code,
      BranchCity: '',
      onboardStatus: '1',
      IsActiveBranch: 'true',
      PinCode: ['', Validators.pattern(this.patternService.pinCodePattern)],
      Address: '',
      PrimaryContact: '',
      designation: '',
      emailid: ['', [Validators.required, Validators.email]],
      PhoneNo: ['', [Validators.pattern(this.patternService.telephonePattern), Validators.minLength(12), Validators.maxLength(16)]],
      MobileNo: ['', [Validators.pattern(this.patternService.mobilePattern)]],
      TelephoneNo: ['', [Validators.pattern(this.patternService.telephonePattern), Validators.minLength(12), Validators.maxLength(16)]],
      // ** Table1 end

      // PhWork: '',
      // PhMobile: '',
      //officeIsActive: '',

      //  ** Table2 start
      VendorBankId: 0,
      VendorId: 0,
      BankAccountCode: '',
      bankShortName: '',
      AccountNumberId: '',
      CurrencyId: 0,
      IFSCCode: ['', [Validators.pattern(this.patternService.IFSCPattern)]],
      bankCountryId: 0,
      SwiftCode: '',
      bankIsActive: [true],
      BankName: '',

      // ** Table2 end

      BusinessDivisions: this.fb.array([]),

      DocumentName: '',

      //AccountLink

      // ** Table 4 start
      VendorAccountID: 0,
      // "VendorBranchID":0,
      GSTCategory: 0,
      GSTNumber: ['', [Validators.pattern(this.patternService.gstPattern)]],
      LegalName: '',
      PANNo: ['', [Validators.pattern(this.patternService.panPattern)]],
      SourceOfSupply: '',
      PlaceofSupplyCity: 0,
      AccountCurrencyId: 0,
      CompanyStatus: 0,
      SourceOfSupply1: 1,
      SourceOfSupply2: 1,
      TANNo: ['', [Validators.pattern(this.patternService.tanPattern)]],
      MSMONo: '',
      PayableSubCategoryId: 0,
      LedgerMappingId: 0,

      // ** Table 4 emd

      LegalTradeName: '',

      // //CreditDetails
      // VendorCreditID: 0,
      // Agreement: 0,
      // CreditDays: '',
      // CreditLimit: '',
      // ApprovedBy: '',
      // EffectiveDate: '',

      // ** TAble5 start
      TDSApplicability: 0,
      TDSSectionId: 0,
      Reason: 0,
      CertificatePath: [],
      Rate: '',
      StartDate: '',
      EndDate: '',
      Date: '',
      TDSRate: 0,

      // ** TAble5 end
      // TDS Link


      ReasonForNonTDS: 0,
      LDCRate: 0,

      //TDS Grid --> TABLE 4

      //Interface
      // * Table7 start
      VendorInterfaceID: 0,
      NDPCode: '',
      DigitalCode: '',
      Others: '',
      // * Table7 end

    });

  }
  disableFbForm() {
    this.fg.enable();
    this.tdsTableForm.controls['TDSApplicability'].enable();

    this.tdsTableForm.controls['Date'].enable();
  }

  //#region Dropdown Bind
  // OnBindDropdownCountry() {
  //   this.ms.getCountryBind().subscribe(data => {
  //     const countryData = data.sort(function (a, b) {
  //       return a.CountryName.localeCompare(b.CountryName);
  //     });
  //     this.countryList = countryData;
  //   });
  // }

  async OnBindDropdownCountry() {
    var payload = {};
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCountries`;
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.countryList = result;
    }, error => { });
  }

  OnBindCompanyStatus() {
    this.commonservice.getCompanyStatus().subscribe(data => {
      this.FillCompanyStatus = data['data'];
    });
  }

  OnBindAgreement() {
    this.VendorService.getAgreement().subscribe(data => {
      // console.log(data['data'])
      this.FillAgreement = data['data'];
    });
  }

  OnBindVendorStatus() {
    this.VendorService.getCustomerStatus().subscribe(data => {
      // console.log("Vendorstatus")
      // console.log(data['data'])
      this.FillVendorStatus = data['data'];
    });
  }
  // OnBindDropdownSection() {
  //   const payLoad = {
  //     'TDSRatesId': 0,
  //     'TaxName': '',
  //     'RatePercentage': '',
  //     'sectionID': 0,
  //     'SectionID': 0,
  //     'SectionName': '',
  //     'EffectiveDate': '',
  //     'IsActive': true,
  //     'Status': '',
  //     'Remarks': '',

  //   };
  //   this.tdsService.getSection(payLoad).subscribe(data => {
  // 
  //     this.tdsSectionData = data['data'];
  //     // console.log('OnBindDropdownSection', this.tdsSectionData);

  //   });
  // }

  OnBindDropdownSection() {
    const payLoad = {
      'TDSRatesId': 0,
      'TaxName': '',
      'RatePercentage': '',
      'sectionID': 0,
      'SectionID': 0,
      'SectionName': '',
      'Date': '',
      'IsActive': true,
      'Status': '',
      'Remarks': '',
      'TDSRate': 0

    };
    this.VendorService.getVendorSectionRate(payLoad).subscribe(data => {
      ;
      this.tdsSectionData = data['data']['Table'];
      // Now, this.tdsSectionData contains the array you want
      // console.log('OnBindDropdownSection', this.tdsSectionData);
    });

  }

  getTdsSection(SectionName) {

    const TDSRate: any = this.tdsSectionData.find((item) => item.SectionID == SectionName);
    this.tdsTableForm.controls.TDSRate.setValue(TDSRate.Rate)
  }


  OnBindDropdownStates(CountryID) {

    // this.fg.controls['PANNumber'].setValue(null)
    // this.stateLook={"stateID":this.Organizationform.value.BusinessLocation};
    //let CountryID = this.fg.value.CountryID == '' || this.fg.value.CountryID === undefined ? 0 : this.fg.value.CountryID;

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

  OnBindDITReason() {
    this.VendorService.getDITReason().subscribe(data => {
      // console.log(data['data'])
      this.FillDITReason = data['data'];
    });
  }

  OnBindTDSApplicability() {
    this.VendorService.GetTDSApplicability().subscribe(data => {
      // console.log(data['data'])
      this.FillTDSApplicability = data['data'];
    });
  }

  OnBindReasonForNonTDS() {
    this.VendorService.getReasonForNonTDS().subscribe(data => {
      // console.log(data['data'])
      this.FillReasonForNonTDS = data['data'];
    });
  }

  OnBindTDSSection() {
    var queryParams = { "sectionID": 0 };
    this.VendorService.getVendorSectionRate(queryParams).subscribe(data => {
      this.FillSection = data["data"];
    });
  }

  OnBindDropdownfinancialYear() {
    var queryParams = { "financialYearID": 0 }
    this.fy.getFinancialYear(queryParams).subscribe(data => {
      this.FillFinancialyear = data["data"];
    });
  }
  //#endregion Dropdown Bind

  //#region Dropdown onChange
  // OnChangeCity(Stateval) {
  //   var queryParams = { "countryID": Stateval, "stateID": '' };
  //   this.commonservice.getCities(queryParams).subscribe(data => {
  //     this.FillCity = data['data'].sort(function (a, b) {
  //       return a.CityName.localeCompare(b.CityName);
  //     });
  //   });
  // }

  OnChangeCity(Stateval) {
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCities`; var payload: any = { countryID: Stateval, stateID: 0 }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.FillCity = [];
      if (result.length > 0) {
        this.FillCity = result;
      }
    }, error => { });
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

  getOnBoard() {
    this.VendorService.getOnboardingStatus({}).subscribe((response) => {
      this.onboardStatusList = response['data'].Table;
    });
  }

  // Get company information
  getEntityCompanyDetails() {
    const service = `${this.globals.SaApi}/SystemAdminApi/GetCompanyDetails`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.length > 0) {
        const res = result[0];
        this.companyDetailId = res.ID;
        this.getEntityOrganization();
      }
    }, error => { });
  }
  // get entity organization
  getEntityOrganization() {
    const service = `${this.globals.APIURL}/Organization/GetOrganizationEntityId`;
    return new Promise((resolve, reject) => {
      this.dataService.post(service, { 'OrgId': this.companyDetailId }).subscribe((result: any) => {
        if (result.data.Table1.length > 0) {
          this.entityCurrency = result.data.Table1[0].Currency;
          this.getCurrency();
          // console.log('entityCurrency',this.entityCurrency);
        }
      }, error => {
        console.error(error);
      });
    });
  }

  IfscCode(event): boolean {
    const patt = /^([a-zA-Z0-9])$/;
    const result = patt.test(event.key);
    return result;
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.length > 0) {
        this.currencyList = result;
        // const entitySelectedCurrency = this.currencyList.find(c => c.Currency == this.entityCurrency);
        const entitySelectedCurrency = this.currencyList.find(c => c.Currency === this.entityCurrency.toUpperCase());

        if (entitySelectedCurrency) {
          this.creditDetailsForm.controls.Currency.setValue(entitySelectedCurrency.ID);
          this.fg.controls.CurrencyId.setValue(entitySelectedCurrency.ID);
          this.fg.controls.AccountCurrencyId.setValue(entitySelectedCurrency.ID);

          this.entityCurrencyID = entitySelectedCurrency.ID
        }
      }
    }, error => { });
  }

  getGSTCategory() {
    this.VendorService.getGstCategory({}).subscribe((result: any) => {
      this.gstCategoryList = [];
      if (result.data.Table.length > 0) {
        this.gstCategoryList = result.data.Table;
      }
    });
  }

  getPayableSubCategory() {
    this.VendorService.getPayableSubCategory({}).subscribe((result: any) => {
      this.payableSubList = [];
      if (result.data.Table.length > 0) {
        this.payableSubList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  OnChangeCountry(country_Id) {
    if (country_Id == 53) //IND
    {
      this.fg.value.PANNumber = '';
      $("#divPAN").removeClass("is-hide");
      this.fg.value.TANNumber = '';
      $("#divTAN").removeClass("is-hide");
      this.fg.value.PlaceofSupplyState = 0;
      $("#divState").removeClass("is-hide");
      this.fg.value.PlaceofSupplyCity = 0;
      $("#divCity").removeClass("is-hide");
      this.fg.value.GSTCategory = 0;
      $("#divGSTCategory").removeClass("is-hide");
      this.fg.value.GSTNumber = '';
      $("#divGSTNumber").removeClass("is-hide");
      document.getElementById("gstnum").innerHTML = "GST Number";

    }
    else if (country_Id == 123)//UK
    {
      $("#divPAN").addClass("is-hide");
      $("#divTAN").addClass("is-hide");
      $("#divState").addClass("is-hide");
      $("#divCity").addClass("is-hide");
      $("#divGSTCategory").addClass("is-hide");
      //$("#divGSTNumber").addClass("is-hide");
      this.fg.value.GSTNumber = '';
      $("#divGSTNumber").removeClass("is-hide");
      document.getElementById("gstnum").innerHTML = "VAT Number";
    }
    else {
      $("#divPAN").addClass("is-hide");
      $("#divTAN").addClass("is-hide");
      $("#divState").addClass("is-hide");
      $("#divCity").addClass("is-hide");
      $("#divGSTCategory").addClass("is-hide");
      $("#divGSTNumber").addClass("is-hide");
    }

    var queryParams = { "countryId": country_Id, "currencyId": 0 };
    this.VendorService.getCurrency(queryParams).subscribe(data => {
      this.FillCurrency = data["data"];
      if (data["data"].length > 0) {
        // ((document.getElementById("ddlCurrency")) as HTMLSelectElement).selectedIndex = 1;
      }
      else {
        // ((document.getElementById("ddlCurrency")) as HTMLSelectElement).selectedIndex = 0;
      }
    });

    this.OnChangeCity(country_Id);
    this.getStateListOnly(country_Id);
  }

  // OnChageTDSApplicable(Stateval) {

  //   this.TDSValue = Stateval.target.options[Stateval.target.options.selectedIndex].text;

  //   this.fg.controls.TDSSectionId.setValue(0);
  //   this.fg.controls.ReasonForNonTDS.setValue(0);
  //   this.fg.controls.LDCRate.setValue("");
  // }

  OnChageReasonForNonTDS(Stateval) {

    this.NonTDSValue = Stateval.target.options[Stateval.target.options.selectedIndex].text;
  }

  OnChageGSTCategory(Stateval, index) {
    let slectedGstCategory;
    if (Stateval) {
      slectedGstCategory = Stateval.target.options[Stateval.target.options.selectedIndex].text;
    }
    if (slectedGstCategory == 'REGISTERED' || index == 1) {
      this.gstCategoryInput = this.gstCategoryFields.Registered;
    } else if (slectedGstCategory == 'UNREGISTERED' || index == 2) {
      this.gstCategoryInput = this.gstCategoryFields.Unregistered;
    } else if (slectedGstCategory == 'OVERSEAS' || index == 3) {
      this.gstCategoryInput = this.gstCategoryFields.Overseas;
    } else if (slectedGstCategory == 'COMPOSITION' || index == 4) {
      this.gstCategoryInput = this.gstCategoryFields.Composition;
    } else if (slectedGstCategory == 'SEZ' || index == 5) {
      this.gstCategoryInput = this.gstCategoryFields.SEZ;
    }
    // if (slectedGstCategory == "Unregistered Business")
    //   $("#gstnum").removeClass("str");
    // else
    //   $("#gstnum").addClass("str");
  }
  //#endregion Dropdown onChange

  resetAccountValue() {
    this.fg.controls.SourceOfSupply.setValue('');
    this.fg.controls.GSTNumber.setValue('');
    this.fg.controls.LegalName.setValue('');
    this.fg.controls.CompanyStatus.setValue(0);
    this.fg.controls.AccountCurrencyId.setValue(this.entityCurrencyID);
    this.fg.controls.PANNo.setValue('');
    this.fg.controls.TANNo.setValue('');
    this.fg.controls.MSMONo.setValue('');
    this.fg.controls.PayableSubCategoryId.setValue(0);
  }

  getBusinessDivision() {
    this.VendorService.getBusinessDivision(this.divisionMaster).subscribe(data => {

      //this.FillDivisionMaster = data['data'];

      if (data['data'].length > 0) {
        data['data'].forEach(element => {
          this.FillDivisionMaster.push({
            "VendorDivisionID": 0,
            "VendorID": Number(this.fg.controls.VendorID), "DivisionID": element.Id, "DivisionLable": element.DivisionName, "isChecked": false
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

  // getGSTCategory() {
  //   var queryParams = { "gstCategoryID": 0 }
  //   this.commonservice.getGSTCategory(queryParams).subscribe(data => {
  //     console.log(data['data'])
  //     this.FillGSTCategory = data['data'];
  //   });
  // }


  // getChecked(id) {this.Vendordivision.forEach((element) => {if (element.DivisionID == id) { return true; }})}

  generateVendorCode(Type_Id: Number, Vendor_ID: Number): any {

    var queryParams = { "Type": Type_Id, "VendorID": Vendor_ID }
    this.VendorService.generateVendorCode(queryParams).subscribe(data => {

      if (Type_Id == 1) { this.Vendor_Code = data['data']; }
      else { this.Branch_Code = data['data']; }
      return data['data'];
    });
  }

  getVendorEmailHistory(VendorBranch_ID) {
    var queryParams = { "VendorBranchID": VendorBranch_ID }
    this.VendorService.getVendorEmailHistory(queryParams).subscribe(data => {

      // console.log(data['data'])
      this.FillVendorEmailHistory = data['data'].Table;
    });
  }

  EditModeValueBInd(response) {
    this.vendorDetailsById = response;
    var tblcount: number = 0;
    if (response['data'].Table.length > 0) {
      this.fg.controls.VendorID.setValue(response['data'].Table[0]['VendorID']);
      this.fg.controls.VendorCode.setValue(response['data'].Table[0]['VendorCode']);
      this.fg.controls.VendorName.setValue(response['data'].Table[0]['VendorName']);
      this.fg.controls.VendorStatus.setValue(response['data'].Table[0]['VendorStatus']);
      this.fg.controls.CountryID.setValue(response['data'].Table[0]['CountryId']);
      this.fg.controls.CategoryId.setValue(JSON.parse(response['data'].Table[0]['CategoryId']));
      // this.fg.controls.CategoryId.setValue([]); // test
      this.fg.controls.IsActive.setValue(response['data'].Table[0]['IsActive'] ? 'true' : 'false');
      this.fg.controls.ShortName.setValue(response['data'].Table[0]['ShortName']);
      this.fg.controls.URL.setValue(response['data'].Table[0]['URL']);
      this.CreatedOn = this.datePipe.transform(response['data'].Table[0]['CreatedDate'], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
      this.CreatedBy = localStorage.getItem('UserName')
      this.ModifiedOn = this.datePipe.transform(response['data'].Table[0]['UpdatedDate'], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
      this.ModifiedBy = localStorage.getItem('UserName')

      // this.fg.controls.TDSApplicability.setValue(response['data'].Table[0]['TDSApplicability']);
      // console.log(response['data'].Table[0]['TDSApplicability']);
      // this.fg.controls.TDSSection.setValue(response['data'].Table[0]['TDSSection']);
      // this.fg.controls.ReasonForNonTDS.setValue(response['data'].Table[0]['NonTDSReason']);
      // this.fg.controls.LDCRate.setValue(response['data'].Table[0]['TDSLDCRate']);

      // this.TDSValue = $("#ddlTDSapplicability option:selected").text().trim();
      // this.NonTDSValue = $("#ddlReasonNonTDS option:selected").text().trim();
      // if (this.NonTDSValue == "") this.NonTDSValue = this.fg.value.ReasonForNonTDS;
      // if (this.TDSValue == "") {
      //   this.TDSValue = this.fg.value.TDSApplicability == 355 ? "NO" : this.fg.value.TDSApplicability == 354 ? "YES" : "LDC";
      // }
      //this.OnChageReasonForNonTDS();
      // console.log(this.TDSValue + " - dit - " + this.NonTDSValue);
      // console.log(" TDS Appli - " + this.fg.value.TDSApplicability);

      //var Stateval =((document.getElementById("ddlCurrency")) as HTMLSelectElement);
      //this.TDSValue = Stateval.target.options[Stateval.target.options.selectedIndex].text;

      //var Stateval = document.getElementById("ddlCurrency");
      //this.TDSValue = Stateval.target.options[Stateval.target.options.selectedIndex].text;

      this.OnChangeCountry(this.fg.value.CountryID);
      const CategoryIdArray = JSON.parse(response['data'].Table[0]['CategoryId'])
      this.categoryDisableList.push(...CategoryIdArray);
    }

    //Office Details // Table 1
    if (response['data'].Table1.length > 0) {
      const Table1 = response['data'].Table1[0];
      this.fg.controls.VendorBranchID.setValue(Table1['VendorBranchID']);
      this.fg.controls.BranchCode.setValue(Table1['BranchCode']);
      this.fg.controls.BranchCity.setValue(Table1['City']);
      this.fg.controls.onboardStatus.setValue(Table1['OnBoard']);
      this.fg.controls.IsActiveBranch.setValue(Table1['IsActive'] ? 'true' : 'false');
      this.fg.controls.PinCode.setValue(Table1['Pincode']);
      this.fg.controls.Address.setValue(Table1['Address']);
      // this.fg.controls.PrimaryContact.setValue(Table1['PrimaryContact']);
      this.fg.controls.PrimaryContact.setValue(Table1['Name']);
      this.fg.controls.designation.setValue(Table1['Designation']);
      this.fg.controls.emailid.setValue(Table1['EmailId']);
      this.fg.controls.PhoneNo.setValue(Table1['PhoneNo']);
      this.fg.controls.MobileNo.setValue(Table1['MobileNo']);
      this.fg.controls.TelephoneNo.setValue(Table1['TelephoneNo']);
    }

    //KYC Details //Table 2
    if (response['data'].Table2.length > 0) {
      this.bankDetailsList = response['data'].Table2;
    }
    if (response['data'].Table3.length > 0) {
      this.documentPayloadInfo = response['data'].Table3;
    }

    //Account Link
    if (response['data'].Table3.length > 0) {
      this.documentPayloadInfo = response['data'].Table3;
      this.documentInfo = this.constructDocumentPayload(this.documentPayloadInfo);
    }

    //TDS Link
    if (response['data'].Table4.length > 0) {

      // start
      this.fg.controls.VendorAccountID.setValue(response['data'].Table4[0]['VendorAccountID']);
      this.fg.controls.VendorBranchID.setValue(response['data'].Table4[0]['VendorBranchID']);
      this.fg.controls.GSTCategory.setValue(response['data'].Table4[0]['GSTCategory']);
      this.fg.controls.SourceOfSupply.setValue(response['data'].Table4[0]['SourceOfSupply']);
      this.fg.controls.GSTNumber.setValue(response['data'].Table4[0]['GSTNumber']);
      this.fg.controls.LegalName.setValue(response['data'].Table4[0]['LegalName']);
      this.fg.controls.CompanyStatus.setValue(response['data'].Table4[0]['CompanyStatus']);
      this.fg.controls.AccountCurrencyId.setValue(response['data'].Table4[0]['CurrencyId']);
      this.fg.controls.PANNo.setValue(response['data'].Table4[0]['PANNo']);
      this.fg.controls.TANNo.setValue(response['data'].Table4[0]['TANNo']);
      this.fg.controls.MSMONo.setValue(response['data'].Table4[0]['MSMONo']);
      this.fg.controls.PayableSubCategoryId.setValue(response['data'].Table4[0]['PayableSubCategoryId']);
      this.fg.controls.SourceOfSupply1.setValue(response['data'].Table4[0]['SourceOfSupply1']);
      this.fg.controls.SourceOfSupply2.setValue(response['data'].Table4[0]['SourceOfSupply2']);
      this.fg.controls.LedgerMappingId.setValue(response['data'].Table4[0]['LedgerMappingId']);


      this.OnChageGSTCategory(null, this.fg.value.GSTCategory)

      //  end

    }


    if (response['data'].Table6.length > 0) {
      this.creditDetailsTableData = [];
      this.creditDetailsTableData.push(...response['data'].Table6);

    }

    if (response['data'].Table5.length > 0) {
      this.tdsTableData = [];
      this.tdsTableData.push(...response['data'].Table5);
    }

    if (response['data'].Table7.length > 0) {
      this.vendorEmailList = [];
      for (let emailInfo of response['data'].Table7) {
        let category = this.categoryList.find(x => x.CategoryID == emailInfo.Category);
        this.vendorEmailList.push({
          ID: emailInfo.VendorEmailID,
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

      this.emailIDPayLoad = this.vendorEmailList;
    }

    //Interface
    if (response['data'].Table8.length > 0) {
      this.fg.controls.VendorInterfaceID.setValue(response['data'].Table8[0]['VendorInterfaceID']);
      this.fg.controls.NDPCode.setValue(response['data'].Table8[0]['NDPCode']);
      this.fg.controls.DigitalCode.setValue(response['data'].Table8[0]['DigitalCode']);
      this.fg.controls.Others.setValue(response['data'].Table8[0]['Others']);
    }

    //Division
    if (response['data'].Table9.length > 0) {

      //getBusinessDivision
      const divisionIds = [];
      response['data'].Table9.forEach(element => {
        // tempDivision.push(e)

        // this.FillDivisionMaster.forEach((divsionValue) => {
        // if (element.DivisionID == divsionValue.ID) {

        // divsionValue.isChecked = true;
        // divsionValue.VendorDivisionID = element.VendorDivisionID;
        // divsionValue.DivisionID = element.DivisionID;
        // }
        divisionIds.push(+element.DivisionID);

      });
      this.selectedCustomerDivsions = divisionIds;
      this.fg.controls.customerDivision.setValue(divisionIds);
      this.divisionDisableList = divisionIds;

      // })
    }
    this.getVendorPartyList();
  }


  numericOnly(event, maxchar) {

    let reg = /^\d{0,16}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }


  decimalFilter(event: any) {
    //const reg = /^-?\d*(\.\d{0,2})?$/;
    const reg = /^\d{0,2}$|(?=^.{0,5}$)^\d+\.\d{0,2}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  Pincode(event) {
    const reg = /^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$/;
    const input = String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      return false;
    }
    return true;
  }

  // patternValidation(pattern, input) {
  //   if (!pattern.test(input)) {
  //     return false;
  //   }
  //   return true;
  // }

  special(event): boolean {
    const patt = /^([0-9])$/;
    const result = patt.test(event.key);
    return result;
  }
  // get the selected division name by division id
  getDivisionName(division_id) {
    if (division_id && this.divisionList.length) {
      const category = this.divisionList.find((d) => d.ID == division_id)
      return category ? category.DivisionName.toUpperCase() : '';
    }
  }

  updateBasicVendorDetail() {
    this.autoCodeGeneration(true)
    // var VenStatus = $('#ddlStatusAuto').val();

    this.basicVendorDetail.VendorID = this.fg.value.VendorID;
    this.basicVendorDetail.VendorCode = this.fg.value.VendorCode == "" ?  this.Vendor_Code : this.fg.value.VendorCode;
    this.basicVendorDetail.VendorName = this.fg.value.VendorName;
    // this.basicVendorDetail.VendorStatus = VenStatus as number;//this.fg.value.StatusAuto;
    this.basicVendorDetail.CountryId = this.fg.value.CountryID;
    this.basicVendorDetail.CategoryId = JSON.stringify(this.fg.value.CategoryId);
    this.basicVendorDetail.IsActive = this.fg.value.IsActive === 'true' ? 1 : 0;
    this.basicVendorDetail.VendorStatus = 337;
    this.basicVendorDetail.URL = this.fg.value.URL;
    this.basicVendorDetail.ShortName = this.fg.value.ShortName;
    // this.basicVendorDetail.TDSApplicability = this.fg.value.TDSApplicability;
    // this.basicVendorDetail.NonTDSReason = this.fg.value.ReasonForNonTDS;
    // this.basicVendorDetail.TDSSection = this.fg.value.TDSSection;
    // this.basicVendorDetail.TDSLDCRate = (this.fg.value.LDCRate == "" || this.fg.value.LDCRate == null) ? 0 : this.fg.value.LDCRate;

    // if (this.Current_Tab == "tabKYC") this.basicVendorDetail.InputPage = "KYC";
    // else if (this.Current_Tab == "tabAccounting") this.basicVendorDetail.InputPage = "Account";
    // else if (this.Current_Tab == "tabTDSLink") this.basicVendorDetail.InputPage = "TDS";
    // else if (this.Current_Tab == "tabEmail") this.basicVendorDetail.InputPage = "Email";
    // else if (this.Current_Tab == "tabInterfaces") this.basicVendorDetail.InputPage = "Interface";
    // else this.basicVendorDetail.InputPage = "";

    this.VendorModel.Vendor.Table.push(this.basicVendorDetail);
  }

  updateOfficeDetails() {
    // this.TabOfficeDetails.VendorBranchID = this.fg.value.VendorBranchID;
    // this.TabOfficeDetails.VendorID = this.fg.value.VendorID;

    //if (this.Current_Tab == "tabBranch") {
    this.TabOfficeDetails.VendorBranchID = this.fg.value.VendorBranchID;
    this.TabOfficeDetails.VendorID = this.fg.value.VendorID;
    this.TabOfficeDetails.BranchCode = this.fg.value.BranchCode == "" ? this.Branch_Code : this.fg.value.BranchCode; //1
    this.TabOfficeDetails.City = this.fg.value.BranchCity;// 2
    this.TabOfficeDetails.PrimaryContact = '';
    this.TabOfficeDetails.Pincode = this.fg.value.PinCode;
    this.TabOfficeDetails.PhoneNo = this.fg.value.PhoneNo;
    this.TabOfficeDetails.MobileNo = this.fg.value.MobileNo;
    this.TabOfficeDetails.Address = this.fg.value.Address;
    this.TabOfficeDetails.OnBoard = +this.fg.value.onboardStatus;
    this.TabOfficeDetails.KYCStatus = 1;
    this.TabOfficeDetails.IsActive = this.fg.value.IsActiveBranch === 'true' ? 'true' : 'false';
    this.TabOfficeDetails.Name = this.fg.value.PrimaryContact;
    this.TabOfficeDetails.Designation = this.fg.value.designation;
    this.TabOfficeDetails.emailid = this.fg.value.emailid;
    this.TabOfficeDetails.TelephoneNo = this.fg.value.TelephoneNo;


    //}
    this.VendorModel.Vendor.Table1.push(this.TabOfficeDetails);
  }

  updateBankDetails() {
    this.VendorModel.Vendor.Table2.push(...this.bankDetailsList);
  }

  updateKYCDocument() {
    for (let element of this.documentPayloadInfo) {
      this.TabKYCDocument = new KYCDocument();
      this.TabKYCDocument.VendorDocumentsID = 0;
      this.TabKYCDocument.VendorBranchID = this.fg.value.VendorBranchID;
      this.TabKYCDocument.DocumentName = element.DocumentName;
      this.TabKYCDocument.FilePath = element.FilePath;
      this.TabKYCDocument.UpdateOn = element.UpdateOn;
      this.TabKYCDocument.UniqueFilePath = !element.UniqueFilePath ? 'Test' : element.UniqueFilePath;
      this.VendorModel.Vendor.Table3.push(this.TabKYCDocument);
    }
  }

  updateAccountLink() {

    this.TabAccountLink.VendorAccountID = this.fg.value.VendorAccountID;
    this.TabAccountLink.VendorBranchID = this.fg.value.VendorBranchID;

    // if (this.Current_Tab == "tabAccounting" || this.Current_Tab == 'tabBranch') {
    this.TabAccountLink.VendorAccountID = this.fg.value.VendorAccountID;
    this.TabAccountLink.VendorBranchID = this.fg.value.VendorBranchID;
    //this.TabAccountLink.DocumentName = this.fg.value.DocumentName;
    this.TabAccountLink.GSTCategory = this.fg.value.GSTCategory;
    this.TabAccountLink.GSTNumber = this.fg.value.GSTNumber;
    this.TabAccountLink.LegalName = this.fg.value.LegalName;
    this.TabAccountLink.PANNo = this.fg.value.PANNo;
    this.TabAccountLink.SourceOfSupply = this.fg.value.SourceOfSupply;
    this.TabAccountLink.CurrencyId = this.fg.value.AccountCurrencyId;
    this.TabAccountLink.CompanyStatus = this.fg.value.CompanyStatus;
    this.TabAccountLink.SourceOfSupply1 = 1;
    this.TabAccountLink.SourceOfSupply2 = 1;
    this.TabAccountLink.TANNo = this.fg.value.TANNo;
    this.TabAccountLink.MSMONo = this.fg.value.MSMONo;
    this.TabAccountLink.PayableSubCategoryId = this.fg.value.PayableSubCategoryId;
    this.TabAccountLink.LedgerMappingId = this.fg.value.LedgerMappingId;

    // this.basicVendorDetail.VendorStatus = 337;// this.fg.value.StatusAuto;
    this.VendorModel.Vendor.Table4.push(this.TabAccountLink);

    // this.fg.controls.onboardStatus.setValue('2')
    // ! set the onboarding status as true in the branch tab
    if (this.Current_Tab == "tabAccounting") {
      this.TabOfficeDetails.OnBoard = 2;
    }

    this.VendorModel.Vendor.Table1 = [];
    this.VendorModel.Vendor.Table1.push(this.TabOfficeDetails);
    // }


  }

  updateTDSLInk() {

    // if (this.Current_Tab == "tabTDSLink") {

    // VendorTDSID = 0;
    // VendorBranchID = 0;
    // Date = '';
    // FinancialYearID = 0;
    // DITNumber = '';
    // Reason = '';
    // CertificateName = '';
    // CertificatePath = '';
    // Rate = '';
    // TDSSectionId = '';
    // StartDate = '';
    // EndDate = '';
    // TDSApplicability = '';

    this.VendorModel.Vendor.Table5.push(...this.tdsTableData);
    return;
    // if (this.NonTDSValue == "DIT" || this.NonTDSValue == "357") {
    //   for (let item of this.DynamicGridDIT) {
    //     this.TabTDSLink = new TDSLink();
    //     this.TabTDSLink.VendorTDSID = item.VendorTDSID;
    //     this.TabTDSLink.VendorBranchID = item.VendorBranchID;
    //     this.TabTDSLink.Date = item.Date;
    //     this.TabTDSLink.FinancialYearID = item.FinancialYearID;
    //     this.TabTDSLink.DITNumber = item.DITNumber;
    //     this.TabTDSLink.Reason = item.Reason;
    //     this.TabTDSLink.CertificateName = item.CertificateName;
    //     this.TabTDSLink.CertificatePath = item.CertificatePath;
    //     this.VendorModel.Vendor.Table5.push(this.TabTDSLink);
    //   };
    // }

    // else {
    //   this.TabTDSLink.VendorBranchID = this.fg.value.VendorBranchID;
    //   this.DynamicGridDIT.length = 0;
    //   // this.TabTDSLink.VendorTDSID = 0;
    //   // this.TabTDSLink.VendorBranchID = 0;
    //   // this.TabTDSLink.Date = '';
    //   // this.TabTDSLink.FinancialYearID = 0;
    //   // this.TabTDSLink.DITNumber = '';
    //   // this.TabTDSLink.Reason = '';
    //   // this.TabTDSLink.CertificateName = '';
    //   // this.TabTDSLink.CertificatePath = '';
    //   //this.VendorModel.Vendor.Table4.push(this.TabTDSLink);
    // }
    // }
    //else { this.VendorModel.Vendor.Table4.push(this.TabTDSLink); }
  }

  updateCreditDetails() {
    this.VendorModel.Vendor.Table6.push(...this.creditDetailsTableData);
    // if (this.Current_Tab == "creditDetails") {
    //   this.VendorModel.Vendor.Table6.push(...this.creditDetailsTableData);
    // }

  }

  updateEmailId() {
    // if (this.Current_Tab == "tabEmail") {
    //   for (let item of this.DynamicGridEmail) {
    //     this.TabEmailId = new EmailId();
    //     this.TabEmailId.VendorEmailID = item.VendorEmailID;
    //     this.TabEmailId.VendorBranchID = item.VendorBranchID;
    //     this.TabEmailId.AlertTypeId = item.AlertTypeId;
    //     this.TabEmailId.EmailId = item.EmailId;
    //     this.TabEmailId.CreatedOn = item.CreatedOn;
    //     this.TabEmailId.UpdatedOn = item.UpdatedOn;
    //     this.TabEmailId.UpdatedBy = item.UpdatedBy;

    if (this.emailIDPayLoad.length > 0) {
      for (let item of this.emailIDPayLoad) {
        // console.log(item, "item")
        let category = this.categoryList.find(x => x.Category == item.Category)
        this.TabEmailId = new EmailId();
        // console.log(this.TabEmailId, "tab")
        this.TabEmailId.VendorEmailID = item.ID;
        this.TabEmailId.VendorBranchID = this.fg.value.VendorBranchID;
        this.TabEmailId.AlertTypeId = 1;
        this.TabEmailId.emailid = item.EmailId;
        this.TabEmailId.CreatedOn = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
        this.TabEmailId.UpdatedOn = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
        this.TabEmailId.UpdatedBy = localStorage.getItem('UserName');
        this.TabEmailId.Category = category.CategoryID;
        this.TabEmailId.StartDate = item.StartDate;
        this.TabEmailId.EndDate = item.EndDate;
        this.VendorModel.Vendor.Table7.push(this.TabEmailId);
      };
    }
    else {
      this.TabEmailId.VendorBranchID = this.fg.value.VendorBranchID;
      this.VendorModel.Vendor.Table7.push(this.TabEmailId);
    }

  }

  updateInterface() {
    //this.TabInterface.VendorInterfaceID = this.fg.value.VendorInterfaceID;
    this.TabInterface.VendorBranchID = this.fg.value.VendorBranchID;
    if (this.Current_Tab == "tabInterfaces") {
      this.TabInterface.VendorInterfaceID = this.fg.value.VendorInterfaceID;
      this.TabInterface.VendorBranchID = this.fg.value.VendorBranchID;
      this.TabInterface.NDPCode = this.fg.value.NDPCode;
      this.TabInterface.DigitalCode = this.fg.value.DigitalCode;
      this.TabInterface.Others = this.fg.value.Others;
      this.VendorModel.Vendor.Table8.push(this.TabInterface);
    }


  }

  updateDivision() {

    this.FillDivisionMaster.forEach((element) => {

      if (element.isChecked) {

        let TabDivision = new Division();
        TabDivision.VendorDivisionID = element.VendorDivisionID;
        TabDivision.DivisionID = element.DivisionID;
        TabDivision.VendorID = this.fg.value.VendorID;
        // this.VendorModel.Vendor.Table7.push(TabDivision);
      }
    })

    // for (let item of this.FillDivisionMaster) {

    //   let TabDivision = new Division();
    //   TabDivision.VendorDivisionID = item.VendorDivisionID;
    //   TabDivision.DivisionID = item.DivisionID;
    //   TabDivision.VendorID = this.fg.value.VendorID;
    //   this.VendorModel.Vendor.Table7.push(TabDivision);
    // };
  }

  // async getModuleType() {
  //   let service = `${this.globals.APIURL}/LedgerMapping/GetLedgerDropDownList`;
  //   this.dataService.post(service, {}).subscribe(async (result: any) => {
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

  async onSubmit() {
    debugger
    // if (this.mappingSuccess == false) {
    //   Swal.fire(this.errorMessage)
    //   return false;
    // }

    await this.getNumberRange();
    this.formSubmit = true;
    var validation = "";

    //#region Main---------------------------------------------------------------------------------------------------------------------
    // if (!this.fg.value.VendorCode) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Vendor Code </span></br>"
    // }

    if (!this.fg.value.VendorName) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Vendor Name</span></br>"
    }

    if (!this.fg.value.ShortName) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Short Name</span></br>"
    }

    // var ddlLocCity = $('#ddlStatusAuto').val();
    // if (ddlLocCity == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select vendor status</span></br>"
    // }
    // if (this.fg.value.StatusAuto == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Status(Auto Update)</span></br>"
    // }

    // var ddlLocCity = $('#ddlCountry').val();
    if (!this.fg.value.CountryID) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
    }

    // var ddlCategory = $('#ddlCategory').val();
    if (!this.fg.value.CategoryId) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Category</span></br>"
    }

    // var ddlIsActive = $('#ddlIsActive').val();
    if (!this.fg.value.IsActive) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Status</span></br>"
    }

    // if (!this.fg.value.URL) {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter URL</span></br>"
    // }

    // var IsDivisionchecked = 0;
    // this.FillDivisionMaster.forEach((element) => {
    //   if (element.isChecked) {
    //     IsDivisionchecked = 1;
    //   }
    // })
    // if (IsDivisionchecked == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select division</span></br>"
    // }
    //#endregion Main---------------------------------------------------------------------------------------------------------------------

    //#region Office Details---------------------------------------------------------------------------------------------------------------------
    //if (this.Current_Tab == "tabBranch") {


    // var ddlIsActiveBranch = $('#ddlIsActiveBranch').val();
    // if (ddlIsActiveBranch == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Branch status</span></br>"
    // }

    //}
    if (this.Current_Tab === 'tabBranch') {
      // if (!this.fg.value.BranchCode) {
      //   validation += '<span style=\'color:red;\'>*</span> <span>Please Check Branch Code Not Generate</span></br>';
      // }

      if (!this.fg.value.BranchCity) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Branch/cCity</span></br>';
      }

      if (!this.fg.value.onboardStatus) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select The Onboarding Status/City</span></br>';
      }

      if (!this.fg.value.IsActiveBranch) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select The Active Status/City</span></br>';
      }

      if (!this.fg.value.Address) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Address</span></br>';
      }

      if (!this.fg.value.PinCode) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter PIN Code</span></br>';
      }
      if (!this.fg.value.customerDivision || this.fg.value.customerDivision && !this.fg.value.customerDivision.length) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select The Vendor Of Division</span></br>';
      }

      // if (!this.fg.value.TelephoneNo) {
      //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter Telephone</span></br>';
      // }

      if (validation === '') {
        // if (!this.patternService.validateWithPattern(this.patternService.pinCodePattern, +this.fg.value.PinCode)) {
        //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter valid pincode number</span></br>';
        // }

        if (this.fg.value.PinCode && this.fg.get('PinCode').invalid) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Enter A Valid Pin Code</span></br>';
        }

        if (this.fg.value.emailid && this.fg.get('emailid').invalid) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Enter A Valid Email </span></br>';
        }

        if (this.fg.value.MobileNo && this.fg.get('MobileNo').invalid) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Enter a Valid Mobile Number </span></br>';
        }

        if (this.fg.value.PhoneNo && this.fg.controls.PhoneNo.errors) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Valid Telephone Number</span></br>';
        }

      }
    }
    //#endregion Office Details---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab === 'tabbankDetails') {

    }

    //#region Bank Details---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab == "tabBank") {

    }

    //#endregion KYC Documents---------------------------------------------------------------------------------------------------------------------

    //#region Account Link---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab == "tabAccounting") {

      const ddlLocCity = $('#ddlCountry').val();
      if (ddlLocCity == 53) {
        // const ddlGSTCategory = $('#ddlGSTCategory').val();
        // if (ddlGSTCategory == null) {
        //   validation += '<span style=\'color:red;\'>*</span> <span>Please select GST category</span></br>';
        // }


        // const ddlGSTCategorytext = $('#ddlGSTCategory option:selected').text().trim();
        // if (ddlGSTCategorytext != 'Unregsistered') {
        //   var reg = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
        //   if (this.fg.value.GSTNumber == "") {
        //     validation += '<span style=\'color:red;\'>*</span> <span>Please enter GST number</span></br>';
        //   } else if (this.fg.value.GSTNumber.length != 15) {
        //     validation += '<span style=\'color:red;\'>*</span> <span>Please enter valid GST number</span></br>';
        //   } else if (!reg.test(this.fg.value.GSTNumber)) {
        //     validation += '<span style=\'color:red;\'>*</span> <span>Please enter valid GST number.</span></br>';
        //   }
        // }


        // var reg = /[A-Z]{5}\d{4}[A-Z]{1}/;
        // if (this.fg.value.PANNo == "") {
        //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter PAN number</span></br>'
        // } else if (!reg.test(this.fg.value.PANNo)) {
        //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter valid PAN number</span></br>'
        // }

        // if (this.fg.value.TANNo != "") {
        //   let reg = /[A-Z]{4}\d{5}[A-Z]{1}/;
        //   if (!reg.test(this.fg.value.TANNo.toUpperCase())) {
        //     validation += '<span style=\'color:red;\'>*</span> <span>Please enter valid TAN number</span></br>'
        //   }
        // }

      }
      // else if (ddlLocCity == 123) {
      //   if (this.fg.value.GSTNumber == "") {
      //     validation += "<span style='color:red;'>*</span> <span>Please enter VAT number</span></br>"
      //   }
      // }


      if (!this.fg.value.GSTCategory) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter GST Category</span></br>'
      }

      if (!this.fg.value.SourceOfSupply && this.gstCategoryInput.placeOfSupport) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select Place of Support</span></br>';
      }

      if (!this.fg.value.GSTNumber && this.gstCategoryInput.GST) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter GST Number</span></br>'
      }

      if (!this.fg.value.LegalName && this.gstCategoryInput.legalName) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Legal Trade/ Name </span></br>'
      }

      if (!this.fg.value.CompanyStatus && this.gstCategoryInput.companyStatus) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select Company Status</span></br>'
      }

      if (!this.fg.value.AccountCurrencyId && this.gstCategoryInput.currency) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Currency</span></br>'
      }

      if (!this.fg.value.PANNo && this.gstCategoryInput.pan) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter PAN Number</span></br>'
      }
      if (!this.fg.value.TANNo && this.gstCategoryInput.tan) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter TAN Number</span></br>'
      }
      // if (this.fg.value.TANNo && this.fg.get('TANNo').invalid) {
      //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter valid TAN number</span></br>';
      // }

      if (this.fg.value.PANNo && this.fg.get('PANNo').invalid) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Valid PAN Number</span></br>';
      }
      if (this.fg.value.GSTNumber && this.fg.get('GSTNumber').invalid) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Valid GST Number</span></br>';
      }
      if (!this.fg.value.PayableSubCategoryId && this.gstCategoryInput.SubCategory) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select Payable SubCategory</span></br>';
      }

      if ($('#ddlLedger').val() == null) {
        validation += "<span style='color:red;'>*</span> <span>Please select LedgerMapping</span></br>"
      }



    }
    //#endregion Account Link---------------------------------------------------------------------------------------------------------------------

    //#region TABCREDIT---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab == "tabTDSLink") {
    }
    //#endregion TABCREDIT---------------------------------------------------------------------------------------------------------------------

    //#region Email Id---------------------------------------------------------------------------------------------------------------------
    if (this.Current_Tab == "tabEmail") {

      // let GridResponse = this.GridRowValidation("submit");

      // if (!GridResponse) {
      //   return false;
      // }
    }
    //#endregion Email Id---------------------------------------------------------------------------------------------------------------------

    //#region Interface---------------------------------------------------------------------------------------------------------------------

    //#endregion Interface---------------------------------------------------------------------------------------------------------------------

    // var ddlIsActive = $('#ddlIsActive').val();
    // if (ddlIsActive == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Select Status</span></br>"
    // }




    if (validation != "") {
      validation = "<div class='col-md-12' style='text-align: left;'>" + validation + "</div>";
      Swal.fire('', validation, 'warning');
      return false;
    }
    else {


      this.VendorModel = new VendorModel();

      this.updateBasicVendorDetail();
      //this.VendorModel.Vendor.Table.push(this.basicVendorDetail);

      this.updateOfficeDetails();
      //this.VendorModel.Vendor.Table1.push(this.TabOfficeDetails);

      //table2 bank data
      this.updateBankDetails()

      this.updateKYCDocument();
      //this.VendorModel.Vendor.Table2.push(this.TabKYCDocument);

      this.updateAccountLink();
      //this.VendorModel.Vendor.Table3.push(this.TabAccountLink);

      this.updateCreditDetails();
      //this.VendorModel.Vendor.Table4.push(this.TabCreditDetails);

      this.updateTDSLInk();
      //this.VendorModel.Vendor.Table4.push(this.TabTDSLink);

      this.updateEmailId();
      //this.VendorModel.Vendor.Table5.push(this.TabEmailId);

      this.updateInterface();
      // this.VendorModel.Vendor.Table5.push(this.TabInterface);

      this.updateDivision();
      this.constructDivision();

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

            // ** get and set the tab name for the API payload
            let InputPage = this.InputPage[this.Current_Tab];
            //  if(!InputPage &&  this.fg.value.customerDivision  && this.fg.value.customerDivision.length) {
            //   InputPage = 'Division';
            //  }
            this.VendorModel.Vendor.Table10[0] = { 'InputPage': InputPage };
            
            this.VendorModel.Vendor.Table1[0].BranchCode = this.fg.value.BranchCode == "" ? this.Branch_Code : this.fg.value.BranchCode;
            
            //-----
            // console.log('VendorModel', this.VendorModel);
            // return
            this.VendorService.SaveVendor(this.VendorModel).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {
                if (!this.isUpdate) {
                  this.updateAutoGenerated();
                }
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.onBack();
                  }
                })
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


  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Vendors');
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
    })
      .then((result) => { if (result.value) this.onBack(); });
  }

  btnNewBranch() {

    if (this.fg.value.VendorID != null && this.fg.value.VendorBranchID != null) {
      // this.generateVendorCode(2, this.fg.value.VendorID); // Branch_Code
      this.getBranchCodeAPI(this.fg.value.VendorCode);
      this.setFgForm();
      this.clearTableData();
      this.goToBranchDetails();
      // this.DynamicGridEmail.length = 0;
      // this.GridPushEmptyrow_Email();
    }
  }

  clearTableData() {
    this.bankDetailsList = [];
    this.documentPayloadInfo = [];
    this.tdsTableData = [];
    this.creditDetailsTableData = [];
    this.vendorEmailList = [];
    this.documentInfo = []
  }

  setFgForm() {
    const oldFgValue = this.fg.value;
    // this.fg.reset();
    this.fg.patchValue({

      // ** table start
      VendorID: oldFgValue.VendorID,
      VendorCode: oldFgValue.VendorCode,
      VendorName: oldFgValue.VendorName,
      VendorStatus: oldFgValue.VendorStatus,
      CountryID: oldFgValue.CountryID,
      CategoryId: oldFgValue.CategoryId,
      IsActive: oldFgValue.IsActive,
      ShortName: oldFgValue.ShortName,
      URL: oldFgValue.URL,
      // ** Table end

      // * division start
      customerDivision: oldFgValue.customerDivision,
      // * division end

      // ** Table1 start
      VendorBranchID: 0,
      BranchCode: this.Branch_Code,
      BranchCity: '',
      onboardStatus: '1',
      IsActiveBranch: '',
      PinCode: '',
      Address: '',
      PrimaryContact: '',
      designation: '',
      emailid: '',
      PhoneNo: '',
      MobileNo: '',
      TelephoneNo: '',
      // ** Table1 end

      //  ** Table2 start
      VendorBankId: 0,
      VendorId: 0,
      BankAccountCode: '',
      bankShortName: '',
      AccountNumberId: '',
      CurrencyId: 1,
      IFSCCode: '',
      bankCountryId: 0,
      SwiftCode: '',
      bankIsActive: true,
      BankName: '',

      // ** Table2 end


      // ** Table 4 start
      VendorAccountID: 0,
      GSTCategory: oldFgValue.GSTCategory,
      GSTNumber: '',
      LegalName: oldFgValue.LegalName,
      PANNo: oldFgValue.PANNo,
      SourceOfSupply: '',
      PlaceofSupplyCity: oldFgValue.PlaceofSupplyCity,
      AccountCurrencyId: oldFgValue.AccountCurrencyId,
      CompanyStatus: oldFgValue.CompanyStatus,
      SourceOfSupply1: oldFgValue.SourceOfSupply1,
      SourceOfSupply2: oldFgValue.SourceOfSupply2,
      TANNo: oldFgValue.TANNo,
      MSMONo: oldFgValue.MSMONo,
      PayableSubCategoryId: oldFgValue.PayableSubCategoryId,

      // ** Table 4 emd


      // ** TAble5 start
      TDSApplicability: 0,
      TDSSectionId: 0,
      Reason: 0,
      CertificatePath: [],
      Rate: '',
      StartDate: '',
      EndDate: '',
      Date: '',
      TDSRate: 0,

      // ** TAble5 end

      // * Table7 start
      VendorInterfaceID: 0,
      NDPCode: '',
      DigitalCode: '',
      Others: '',
      // * Table7 end

      ReasonForNonTDS: 0,

    });

    this.OnChangeCity(oldFgValue.CountryID);
  }

  //#region DITGrid

  DynamicGridAddRow_DIT(gRow, i) {

    var validation = "";

    if (gRow.Date == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Select Date</span></br>"
    }

    if (gRow.FinancialYearID == "0") {
      validation += "<span style='color:red;'>*</span> <span>Please Select Year</span></br>"
    }

    if (gRow.DITNumber == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter DIT Number</span></br>"
    }
    if (gRow.Reason == "0") {
      validation += "<span style='color:red;'>*</span> <span>Please Select Reason</span></br>"
    }

    if (gRow.CertificateName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Certificate Name</span></br>"
    }
    // if (gRow.CertificatePath == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Select Effective From</span></br>"
    // }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }


    // let IsExists = this.GridRowValidation();

    // if (IsExists) {
    //   gRow.Date = "0";
    //   gRow.FinancialYearID = "0";
    //   gRow.DITNumber = "0";
    //   gRow.Reason = "0";
    //   gRow.CertificateName = ""
    //   gRow.CertificatePath = ""
    //   Swal.fire("","Linked GL and Division combination already Exists", 'warning');
    //   return;
    // }
    this.GridPushEmptyrow_DIT();
  }

  // alertEmailRemove1(id) {
  //   this.DynamicGridEmail.forEach((element, index) => {
  //     if (element.AlertTypeId == id) {
  //       //delete this.DynamicGridEmail[index];
  //       this.DynamicGridEmail.splice(index, 1);
  //       //Swal.fire("Selected Alert type Already Added!");
  //     }
  //   });
  //   console.log(this.DynamicGridEmail)
  // }

  DynamicGridDeleteRowDIT(DynamicGridDIT, index, Id) {

    var gridDate = DynamicGridDIT[index].Date;

    if (this.DynamicGridDIT.length == 1 && gridDate == "") {
      Swal.fire("", "No Rows to Delete", 'warning');
      return false;
    }

    this.DynamicGridDIT.splice(index, 1);

    if (this.DynamicGridDIT.length == 0) {
      this.GridPushEmptyrow_DIT();
      return false;
    }


  }

  //#endregion DITGrid


  //----------------------------------------------------------------------------------
  DynamicGridEmail: EmailId[] = [];
  EmptyDynamicGrid: any = {};

  DynamicGridDIT: TDSLink[] = [];
  EmptyDynamicDIT: any = {};
  //DynamicGrid: Array<EmailId> = [];

  VendorEmailID = 0;
  VendorBranchID = 0;
  AlertTypeId = 1;
  EmailId = "";
  // CreatedOn = "";
  // UpdatedOn = ""

  // GridPushEmptyrow_Email() {
  //   //this.DynamicGridEmail.length = 0;
  //   this.EmptyDynamicGrid = { VendorEmailID: 0, VendorBranchID: 0, AlertTypeId: 0, EmailId: "", CreatedOn: null, UpdatedOn: null, UpdatedBy: this.LoginUsername };
  //   this.DynamicGridEmail.push(this.EmptyDynamicGrid);
  // }

  GridPushEmptyrow_DIT() {
    //this.DynamicGridDIT.length = 0;
    this.EmptyDynamicDIT = { VendorTDSID: 0, VendorBranchID: 0, Date: "", FinancialYearID: 0, DITNumber: "", Reason: 0, CertificateName: "", CertificatePath: "" };
    this.DynamicGridDIT.push(this.EmptyDynamicDIT);
  }

  // GridRowDuplicateValidation(): boolean {
  //   //let IsExists = false;

  //   let index_1 = 0; let index_2 = 0;

  //   for (let item of this.DynamicGridEmail) {
  //     index_1 += 1; index_2 = 0;

  //     for (let item2 of this.DynamicGridEmail) {
  //       index_2 += 1;

  //       if (item.AlertTypeId == item2.AlertTypeId && item.emailid.toUpperCase() == item2.emailid.toUpperCase() && index_1 != index_2) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  DynamicGridAddRowEmail(gRow, id) {

    // let GridResponse = this.GridRowValidation("addrow");

    // if (GridResponse) {
    //   this.GridPushEmptyrow_Email();
    // }
  }

  // DynamicGridAddRowEmail(gRow, id) {
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

  //       var saveObj = { "VendorEmailID": 0, "VendorBranchID": 0, "AlertTypeId": 0, "EmailId": "", "CreatedOn": "", "UpdatedOn": "", "UpdatedBy": "" }
  //       this.DynamicGridEmail.push(saveObj);
  //     }
  //   }
  // }

  // alertEmailRemove(id) {

  //   this.DynamicGridEmail.forEach((element, index) => {
  //     if (element.AlertTypeId == id) {
  //       //delete this.DynamicGridEmail[index];
  //       this.DynamicGridEmail.splice(index, 1);
  //       //Swal.fire("Selected Alert type Already Added!");
  //     }
  //   });
  //   console.log(this.DynamicGridEmail)
  // }

  //-----------
  // DynamicGridDeleteRowEmail(DynamicGridEmail, index, Id) {

  //   var AlertTypeId = DynamicGridEmail[index].AlertTypeId;

  //   if (this.DynamicGridEmail.length == 1 && AlertTypeId == 0) {
  //     Swal.fire("", "No Rows to Delete", 'warning');
  //     return false;
  //   }

  //   this.DynamicGridEmail.splice(index, 1);

  //   if (this.DynamicGridEmail.length == 0) {
  //     this.GridPushEmptyrow_Email();
  //     return false;
  //   }


  // }

  // GridRowValidation(flag): boolean {
  //   var validation = "";

  //   if (this.DynamicGridEmail.length == 1 && flag == "submit") {
  //     if (this.DynamicGridEmail[0].AlertTypeId == 0 && this.DynamicGridEmail[0].emailid == "") {
  //       return true;
  //     }
  //   }

  //   let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  //   let index_1 = 0; let index_2 = 0;

  //   for (let item of this.DynamicGridEmail) {

  //     if (item.AlertTypeId <= 0) {
  //       //Swal.fire('', "Please select alert type", 'warning');
  //       validation += "<span style='color:red;'>*</span> <span>Please select alert type</span></br>"
  //       //return false;
  //     }

  //     if (!item.emailid || item.emailid.trim() == '') {
  //       //Swal.fire('', "Please enter alert email", 'warning');
  //       validation += "<span style='color:red;'>*</span> <span>Please enter alert email</span></br>"
  //       //return false;
  //     }

  //     if (item.emailid.trim() != "") {
  //       if (!item.EmailId.trim().match(emailPattern)) {
  //         //Swal.fire('', "Please enter valid alert email", 'warning');
  //         validation += "<span style='color:red;'>*</span> <span>Please enter valid alert email</span></br>"
  //         //return false;
  //       }
  //       else {
  //         let IsDuplicate = this.GridRowDuplicateValidation();

  //         if (IsDuplicate) {
  //           // gRow.AlertTypeId = 0;
  //           // gRow.EmailId = "";
  //           //Swal.fire('', "Selected alert type and email already added!", 'warning');
  //           validation += "<span style='color:red;'>*</span> <span>Selected alert type and email Combination already available!</span></br>"
  //           //return false;
  //         }

  //         // var saveObj = { "CustomerEmailID": 0, "CustomerBranchID": 0, "AlertTypeId": 0, "EmailId": "", "CreatedOn": this.DateNow, "UpdatedOn": this.DateNow, "UpdatedBy": this.LoginUsername }
  //         // this.DynamicGridEmail.push(saveObj);
  //       }
  //     }

  //     if (validation != "") {
  //       Swal.fire('', validation, 'warning');
  //       return false;
  //     }

  //   }
  //   return true;
  // }


  //---------


  editOrgId: Number = 0;
  divisionChange(event) {


    // console.log(event.target.value)

    this.FillDivisionMaster.forEach((element) => {

      if (element.DivisionID == event.target.value) {
        // console.log(element)
        element.isChecked = element.isChecked == true ? false : true;
      }
    })



  }

  getDivisionList(filter?: string) {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) { this.divisionList = result.data.Table; }
    }, error => { });
  }

  getCategoryList() {
    return new Promise((resolve, rejects) => {
      const URL = `${this.globals.APIURL}/Organization/GetCategoryList`;
      this.dataService.post(URL, {}).subscribe((result: any) => {
        if (result.data.Table.length > 0) {
          this.categoryList = result.data.Table;
          resolve(true);
        }
      }, error => {
        console.error(error);
        resolve(false);
      });
    })
  }

  getReasonList() {
    this.VendorService.getTDSReason({}).subscribe((response) => {
      this.reasonList = response['data'].Table;
    });

  }

  //-----------
  CurrentTAB(tabname) {
    // console.log(tabname);
    this.Current_Tab = tabname;
  }

  customerDivision(event) {

    this.selectedCustomerDivsions = event.value;
    // console.log('customerDivision', this.selectedCustomerDivsions);


  }
  categorySelected(event) {
    this.fg.value.CategoryId = event.value;
  }


  constructDivision() {
    const divisionData = [];
    const responseDivision = this.vendorDetailsById.length ? this.vendorDetailsById['data'].Table9 : [];
    this.selectedCustomerDivsions.forEach(element => {
      const divisionExits = responseDivision.find(data => data.DivisionID == element);
      if (divisionExits) {
        const selectedDivision = {
          VendorDivisionId: divisionExits.VendorDivisionID,
          VendorId: divisionExits.VendorID,
          DivisionId: divisionExits.DivisionID
        };
        divisionData.push(selectedDivision);
      } else {
        const selectedDivision = {
          VendorDivisionId: 0,
          VendorId: 0,
          DivisionId: element
        };
        divisionData.push(selectedDivision);
      }
    });
    this.VendorModel.Vendor.Table9.push(...divisionData);
  }


  // ! document start

  constructDocumentPayload(docList) {
    if (docList) {
      const newDocument = [];
      docList.forEach((item) => {
        const payload = {
          VendorDocumentsID: item.VendorDocumentsID,
          uploadedOn: item.UpdateOn,
          DocumentName: item.DocumentName,
          FilePath: item.FilePath,
        };
        newDocument.push(payload);
      });
      return newDocument;
    }
  }

  uploadDocument(event: any) {
    if (event) {

      this.selectedFile = event.file.target.files[0];
      const filedata = new FormData();
      filedata.append('file', this.selectedFile, this.selectedFile.name)

      this.commonservice.AttachUpload(this.selectedFile).subscribe(data => {
        if (data) {
          this.documentPayloadInfo.push({
            VendorDocumentsID: 0,
            VendorBranchID: this.fg.value.VendorBranchID,
            DocumentName: event.DocumentName,
            FilePath: event.FilePath,
            UpdateOn: this.datePipe.transform(new Date(), 'YYYY-MM-dd'),
            UniqueFilePath: data.FileNamev,
          });
        }
      },
        (error: HttpErrorResponse) => {
          Swal.fire(error.message, 'error')
        });
    }
  }

  /*File Download*/
  download = (fileUrl) => {
    debugger
    this.fileUrl = "UploadFolder\\Attachments\\" + fileUrl;
    this.commonservice.download(fileUrl).subscribe((event) => {

      if (event.type === HttpEventType.UploadProgress) {

      } else if (event.type === HttpEventType.Response) {
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

  // deleteDocument(deleteIndex) {
  //   debugger

  //   const index = this.documentPayloadInfo.findIndex((element) => element.VendorDocumentsID == deleteIndex.VendorDocumentsID)
  //   this.documentPayloadInfo.splice(index, 1);
  //   // this.onSubmit();
  // }

  deleteDocument(event) {
    debugger
    const indexToDelete = event;
    if (indexToDelete >= 0 && indexToDelete < this.documentPayloadInfo.length) {
      this.documentPayloadInfo.splice(indexToDelete, 1);

      // this.documentInfo = this.constructDocumentPayload(this.documentPayloadInfo);
    }
  }


  // **  document end




  // !  tds table start

  OnClickAddTds() {

    const TdsApplicability = +this.tdsTableForm.value.TDSApplicability;
    let validation = '';
    if (!TdsApplicability) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Select TDS Applicability</span></br>'
    } else {
      // Yes option
      if (TdsApplicability == 1) {

        if (!this.tdsTableForm.value.TDSSectionId) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Select Section</span></br>'
        }
      }
      // No option
      if (TdsApplicability == 2) {
        if (!this.tdsTableForm.value.Reason) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Select Reason For Non TDS</span></br>';
        }

        if (!this.tdsTableForm.value.CertificatePath && !this.tdsTableForm.value.CertificateName) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Upload The Document For Non TDS</span></br>';
        }
      }
      // LDC option
      if (TdsApplicability == 3) {
        if (!this.tdsTableForm.value.Rate) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Enter LDC Rate</span></br>';
        }
        if (!this.tdsTableForm.value.StartDate) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Select Start Date</span></br>';
        }
        if (!this.tdsTableForm.value.EndDate) {
          validation += '<span style=\'color:red;\'>*</span> <span>Please Select Start Date</span></br>';
        }
      }
      // check effective date is entered
      if (!this.tdsTableForm.value.Date) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please Select Effective Date</span></br>';
      }
    }
    if (validation != '') {
      Swal.fire('', validation, 'warning');
      return false;
    }
    if (this.tdsTableForm.valid) {
      let tdsData = this.tdsTableForm.value;
      let payload = {
        VendorTDSID: 0,
        VendorBranchID: this.fg.value.VendorBranchID,
        Date: tdsData.Date ? tdsData.Date : '',
        FinancialYearID: 0,
        DITNumber: '',
        Reason: tdsData.Reason ? tdsData.Reason : '',
        CertificateName: tdsData.CertificateName ? tdsData.CertificateName : '',
        CertificatePath: tdsData.CertificatePath ? tdsData.CertificatePath : '',
        Rate: tdsData.Rate ? +tdsData.Rate : 0,
        TDSSectionId: tdsData.TDSSectionId ? tdsData.TDSSectionId : 0,
        StartDate: null,
        EndDate: null,
        TDSApplicability: tdsData.TDSApplicability ? +tdsData.TDSApplicability : '',
        TDSRate: tdsData.TDSRate ? tdsData.TDSRate : 0
      };
      // * IF LDC then assign the selected start and end date value
      if (TdsApplicability == 3) {
        payload.StartDate = this.tdsTableForm.value.StartDate;
        payload.EndDate = this.tdsTableForm.value.EndDate;
      }

      //* Edit mode setup
      if (this.tdsTableEditMode) {
        payload.VendorTDSID = this.tdsTableForm.value.VendorTDSID ? this.tdsTableForm.value.VendorTDSID : 0;
        this.tdsTableData[this.editSelectedTdsIndex] = payload;
        this.tdsTableEditMode = false;
        this.resetTdsTableForm();
      } else { //* create new TDS record
        this.tdsTableData.push(payload);
        this.resetTdsTableForm();
      }
      this.tdsApplicability(0);
    }
  }

  OnClickEditTds() {
    this.tdsTableEditMode = true;
    const data = this.tdsTableData[this.editSelectedTdsIndex];
    if (data) {
      this.tdsApplicability(data.TDSApplicability);
      this.patchTdsForm(data);
    }
  }

  OnClickDeleteTds() {
    if (this.editSelectedTdsIndex === '') {
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
          this.tdsTableData.splice(this.editSelectedTdsIndex, 1);
          this.editSelectedTdsIndex = '';
        }
      });
  }

  patchTdsForm(patch) {
    this.tdsTableForm.patchValue({
      VendorTDSID: patch.VendorTDSID,
      TDSApplicability: patch.TDSApplicability,
      TDSSectionId: patch.TDSSectionId,
      Reason: patch.Reason,
      CertificateName: patch.CertificateName,
      // CertificatePath: patch.CertificatePath,
      CertificatePath: '',
      Rate: patch.Rate,
      StartDate: patch.StartDate,
      EndDate: patch.EndDate,
      Date: patch.Date,
      TDSRate: patch.TDSRate
    })
  }

  resetTdsTableForm() {
    this.tdsTableForm.reset();
  }

  OnClickTdsRadio(index, row) {
    this.editSelectedTdsIndex = index;
  }

  tdsApplicability(data) {
    const selectedTds = +data;
    if (selectedTds === 1) {
      this.tdsFormDisable = {
        tds_yes: true,
        tds_no: false,
        LDC: false,
      };
      this.tdsTableForm.controls['StartDate'].disable();
      this.tdsTableForm.controls['EndDate'].disable();
    } else if (selectedTds === 2) {
      this.tdsFormDisable = {
        tds_yes: false,
        tds_no: true,
        LDC: false
      };
      this.tdsTableForm.controls['StartDate'].disable();
      this.tdsTableForm.controls['EndDate'].disable();
    } else if (selectedTds === 3) {
      this.tdsFormDisable = {
        tds_yes: false,
        tds_no: false,
        LDC: true
      };
      this.tdsTableForm.controls['StartDate'].enable();
      this.tdsTableForm.controls['EndDate'].enable();
    } else {
      this.tdsFormDisable = {
        tds_yes: false,
        tds_no: false,
        LDC: false
      };
      this.tdsTableForm.controls['StartDate'].disable();
      this.tdsTableForm.controls['EndDate'].disable();
    }
  }
  patchTdsValue() {
    this.tdsTableForm.patchValue({
      TDSApplicability: this.tdsTableForm.value.TDSApplicability,
      TDSSectionId: 0,
      Reason: 0,
      CertificateName: '',
      CertificatePath: '',
      Rate: '',
      StartDate: '',
      EndDate: '',
      Date: '',
      TDSRate: 0
    });
  }

  // ********  tds table end


  // ! credit Details start

  OnClickAddCredit() {
    var validation = "";

    if (!this.creditDetailsForm.value.CreditDays) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Credit Days </span></br>'
    }

    if (!this.creditDetailsForm.value.CreditLimit) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Credit Limit </span></br>'
    }

    if (!this.creditDetailsForm.value.Currency) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter The Currency </span></br>'
    }

    if (!this.creditDetailsForm.value.Effectivedate) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Select Effective Date </span></br>'
    }

    if (!this.creditDetailsForm.value.ApprovedBy) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Updated By </span></br>'
    }

    if (!this.creditDetailsForm.value.Date) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Select Date </span></br>'
    }

    if (validation != '') {
      Swal.fire('', validation, 'warning');
      return false;
    }
    else if (this.creditDetailsForm.valid) {
      const creditData = this.creditDetailsForm.value;
      const payload = {
        VendorCreditID: 0,
        VendorBranchId: this.fg.value.VendorBranchID,
        Agreement: '',
        CreditDays: creditData.CreditDays,
        CreditLimit: creditData.CreditLimit,
        ApprovedBy: creditData.ApprovedBy,
        Effectivedate: creditData.Effectivedate,
        Currency: creditData.Currency,
        Date: creditData.Date,
      }


      if (this.creditTableEditMode) {
        payload.VendorCreditID = creditData.VendorCreditID ? creditData.VendorCreditID : 0
        this.creditDetailsTableData[this.editSelectedCreditIndex] = payload;
        this.creditTableEditMode = false;
        this.resetcreditTableForm();
      } else {
        this.resetcreditTableForm();
        this.creditDetailsTableData.push(payload)
      }
    }
  }

  OnClickEditCredit() {
    this.creditTableEditMode = true;
    const data = this.creditDetailsTableData[this.editSelectedCreditIndex];
    if (data) {
      this.patchcreditForm(data);
    }
  }


  OnClickDeleteCredit() {
    if (this.editSelectedCreditIndex === '') {
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
          this.creditDetailsTableData.splice(this.editSelectedCreditIndex, 1);
          this.editSelectedCreditIndex = '';
        }
      });
  }


  OnClickCreditRadio(index, row) {
    this.editSelectedCreditIndex = index;
  }

  patchcreditForm(patch) {
    this.creditDetailsForm.patchValue({
      VendorCreditID: patch.VendorCreditID,
      CreditDays: patch.CreditDays,
      CreditLimit: patch.CreditLimit,
      Currency: patch.Currency,
      Effectivedate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
      ApprovedBy: patch.ApprovedBy,
      Date: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
    })
  }

  resetcreditTableForm() {
    //  this.creditDetailsForm.reset();
    this.creditDetailsForm.controls['VendorCreditID'].reset();
    this.creditDetailsForm.controls['CreditDays'].reset();
    this.creditDetailsForm.controls['CreditLimit'].reset();
    this.creditDetailsForm.controls['Currency'].reset();
    this.creditDetailsForm.controls['Effectivedate'].reset();
  }

  // *** credit Details end


  // ! Related party start

  OnClickAddParty() {
    if (!this.relatedPartyForm.value.VendorCode || !this.relatedPartyForm.value.VendorName) {
      Swal.fire('Please Select Vendor Code', '', 'error');
      return;
    }

    const isPartyAlreadySelected = this.DynamicSlotRelatedParty.find((relatedParty) => {
      return relatedParty.VendorCode == this.relatedPartyForm.value.VendorCode
    })

    if (isPartyAlreadySelected) {
      Swal.fire('This Vendor Code Already Selected', '', 'error');
      return;
    }
    const payload = {
      RelatedParties: {
        Table: [this.relatedPartyForm.value]
      }
    };

    this.VendorService.saveRelatedParty(payload).subscribe(data => {
      if (data["message"] == 'Failed') {
        Swal.fire(data['data'], '', 'error');
        this.createRelatedPartyForm();
      } else {
        this.getVendorPartyList();
        this.resetPartyForm();
        this.createRelatedPartyForm();
      }
    });

  }

  getVendorPartyList() {
    this.VendorService.getRelatedVendor({ VendorCode: this.fg.value.VendorCode }).subscribe((data: any) => {
      // console.log(data, "getVendorPartyList")
      if (data.data.VendorRelatedParties.length > 0 && data.data.VendorRelatedParties[0].RelatedPartiesId != null) {
        this.DynamicSlotRelatedParty = [];
        this.DynamicSlotRelatedParty = data.data.VendorRelatedParties;
        this.savedVendorsCode = [];
        this.DynamicSlotRelatedParty.forEach((related) => {
          this.savedVendorsCode.push(related.VendorCode);
        });
        // console.log('savedVendorsCode', this.savedVendorsCode);

      } else {
        this.DynamicSlotRelatedParty = [];
      }
    });
  }

  OnClickEditParty() {
    this.relatedPartyEditMode = true;
    const data = this.DynamicSlotRelatedParty[this.editSelectedPartyIndex];
    if (data) {
      this.patchRelatedPartyForm(data);
    }
  }

  OnClickDeleteParty() {
    if (this.editSelectedPartyIndex === '') {
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
    }).then((result) => {
      if (result.value) {
        // this.DynamicSlotRelatedParty.splice(this.editSelectedPartyIndex, 1);
        // this.editSelectedPartyIndex = '';
        const seletedVendor = this.DynamicSlotRelatedParty[this.editSelectedPartyIndex];
        const payload = {
          ID: seletedVendor.RelatedPartiesId
        };
        this.VendorService.deleteRelatedVendor(payload).subscribe(data => {
          Swal.fire('Vendor deleted successfully', '', 'success');
          this.getVendorPartyList();
          this.editSelectedPartyIndex = '';
        }, errr => {
          Swal.fire('Failed to delete the vendor', '', 'error');
        });
      }
    });
  }

  OnClickPartyRadio(index, row) {
    this.editSelectedPartyIndex = index;
  }

  patchRelatedPartyForm(patch) {
    this.relatedPartyForm.patchValue({
      ID: patch.VendorID,
      VendorName: patch.VendorName,
      VendorCode: patch.VendorCode
    });
  }

  resetPartyForm() {
    this.relatedPartyForm.reset();
  }


  // **** Related party end


  //  *** Bank details start

  addBankDetails() {
    this.bankDetailsAdd = true;
    var validation = "";

    // based on requirment BankAccountCode remvoed on 06-03-2024

    // if (!this.fg.value.BankAccountCode) {
    //   validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Bank Account Code </span></br>'
    // }

    if (!this.fg.value.BankName) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Bank Name </span></br>'
    }

    if (!this.fg.value.bankShortName) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Bank Account Code </span></br>'
    }

    if (!this.fg.value.AccountNumberId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Bank Account Number </span></br>'
    }

    if (!this.fg.value.CurrencyId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Select Currency </span></br>'
    }

    if (this.fg.value.bankCountryId == 53 && !this.fg.value.IFSCCode) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter The IFSC Code </span></br>'
    }


    if (!this.fg.value.bankCountryId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Select Country </span></br>'
    }

    if (!this.fg.value.SwiftCode) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter Swift/IBAN Code </span></br>'
    }

    // if (this.fg.value.IFSCCode && this.fg.controls.IFSCCode.errors) {
    //   validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Valid IFSC Number</span></br>';
    // }

    if (!this.fg.value.bankIsActive) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Select Active </span></br>'
    }

    if (validation != '') {
      Swal.fire('', validation, 'warning');
      return false;
    } else {
      this.bankDetailsAdd = false;

      const bankDetailsObj = {
        VendorBankId: this.fg.value.VendorBankId,
        VendorId: this.fg.value.VendorId,
        vendorBranchId: this.fg.value.VendorBranchID ? this.fg.value.VendorBranchID : 0,
        BankAccountCode: this.fg.value.BankAccountCode,
        ShortName: this.fg.value.bankShortName,
        AccountNumberId: this.fg.value.AccountNumberId,
        CurrencyId: this.fg.value.CurrencyId,
        // IFSCCode: this.fg.value.IFSCCode,  --changes based on Requirment - 06-03-2024
        IFSCCode: this.fg.value.SwiftCode,
        CountryId: +this.fg.value.bankCountryId,
        SwiftCode: this.fg.value.SwiftCode,
        IsActive: this.fg.value.bankIsActive == 'true' || this.fg.value.bankIsActive == true ? 1 : 0,
        BankName: this.fg.value.BankName
      }

      // edit mode
      if (this.isBankEditMode) {
        this.bankDetailsList[this.bankEditSelectedIndex] = bankDetailsObj;
        this.isBankEditMode = !this.isBankEditMode;
        this.bankEditSelectedIndex = '';
        this.clearBankDetails();
        return;
      }

      // create mode

      this.bankDetailsList.push(bankDetailsObj);
      this.clearBankDetails();

    }

  }

  patchBankDetails(patchData) {
    console.log(patchData)
    this.fg.controls.BankAccountCode.setValue(patchData.BankAccountCode);
    this.fg.controls.BankName.setValue(patchData.BankName);
    this.fg.controls.bankShortName.setValue(patchData.ShortName);
    this.fg.controls.AccountNumberId.setValue(patchData.AccountNumberId);
    this.fg.controls.CurrencyId.setValue(patchData.CurrencyId);
    this.fg.controls.IFSCCode.setValue(patchData.IFSCCode ? patchData.IFSCCode : '');
    this.fg.controls.bankCountryId.setValue(patchData.CountryId);
    this.fg.controls.SwiftCode.setValue(patchData.SwiftCode);
    this.fg.controls.bankIsActive.setValue(patchData.IsActive ? 'true' : 'false');
    this.fg.controls.VendorBankId.setValue(patchData.VendorBankId);
    this.fg.controls.VendorId.setValue(patchData.VendorId);
    this.fg.controls.VendorBranchId.setValue(patchData.vendorBranchId);
  }

  clearBankDetails() {
    this.fg.controls.BankAccountCode.setValue('');
    this.fg.controls.BankName.setValue('');
    this.fg.controls.bankShortName.setValue('');
    this.fg.controls.AccountNumberId.setValue('');
    // this.fg.controls.CurrencyId.setValue('');
    this.fg.controls.CurrencyId.setValue(this.entityCurrencyID);
    this.fg.controls.IFSCCode.setValue('');
    this.fg.controls.bankCountryId.setValue('');
    this.fg.controls.SwiftCode.setValue('');
    this.fg.controls.bankIsActive.setValue(true);
  }

  //  ** Bank details end

  // Email Ids start
  updateEmailDetails(event: any) {

    if (event.length > 0 || event.length == 0) {
      this.emailIDPayLoad = event;
      this.onSubmit();
    }

  }


  CustomerList() {

    // this.VendorService.getVendorList({
    //   ID: 0, VendorName: '', Category: '', BranchCode: '', GSTCategory: '', GSTNumber: '', IsActive: true, Status: '', VendorCode: '', CityName: ''
    // }).subscribe(data => {
    //   if (data["data"].Table.length > 0) {
    //     const vendorData = data['data'].Table.filter(t => t.VendorCode != this.Vendor_Code);
    //     this.vendarList = [];
    //     this.vendarList = [...vendorData];

    //   }

    // },
    //   (error: HttpErrorResponse) => {
    //     Swal.fire(error.message, 'error')

    //   });
    this.commonservice.getVendorListDropdown({}).subscribe((result: any) => {
      if (result.message == 'Success') {
        if (result["data"].Table.length > 0) {
          const vendorData = result['data'].Table.filter(t => t.VendorCode != this.Vendor_Code);
          this.vendarList = [];
          this.vendarList = [...vendorData];

        }
      }
    })
  }

  selectVendor(event) {
    if (event) {
      let vendorInfo = this.vendarList.filter(x => x.VendorCode == event);
      this.relatedPartyForm.controls['VendorName'].setValue(vendorInfo[0].VendorName);
      this.relatedPartyForm.controls['VendorID'].setValue(vendorInfo[0].VendorID);
    }

  }

  public checkError = (formGroupName: string, controlName: string, errorName: string) => {
    return this.fg.controls[controlName].hasError(errorName);
  }

  onFileChange(event) {
    const filePath = event.target.files[0];
    const reader = new FileReader();
    let localUrl: any = '';
    let fileName = filePath.name;
    // tslint:disable-next-line:no-shadowed-variable
    reader.onload = (event) => {
      localUrl = event.target.result;
      // console.log('url data', localUrl);
    };
    reader.readAsDataURL(event.target.files[0]);
    this.tdsTableForm.controls.CertificateName.setValue(fileName);

  }
  checkVendorPresent(VendorCode) {
    // return true;
    if (this.savedVendorsCode) {
      const isVendors: any = this.savedVendorsCode.includes(VendorCode);
      if (isVendors < 0) {
        return true
      } else {
        return false
      }
    }
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
          }
          this.autoGenerateCodeList = result.data.Table;
        }resolve(true);
      }
    }, error => {
      console.error(error);
      resolve(true);
    });
  })
  }
  

  async autoCodeGeneration(event: any) {
    debugger
    if (!this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Vendors');
        if (Info.length > 0) {
          let sectionOrderInfo =  this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.fg.controls['VendorCode'].setValue(code.trim().toUpperCase());
          this.Vendor_Code = code.trim().toUpperCase();
          this.getBranchCodeAPI(code.trim().toUpperCase())
        }
        else {
          Swal.fire('Please Create The Auto-Generation Code For Vendor.')
        }
      }
      else {
        this.fg.controls['VendorCode'].setValue('');
        this.getNumberRange();
      }
    }
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    debugger
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
    let service = `${this.globals.APIURL}/Vendor/VendorBranchCodeGeneration`;
    this.dataService.post(service, { ID: this.updateVendorId ? this.updateVendorId : 0, Code: code.match(/\d+/g).join("") }).subscribe((result: any) => {
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

  async validatePAN(event: any) {
    if (event) {
      let payload = { Id: this.fg.value.VendorID, PANNo: event, ModuleId: 2 }
      await this.commonservice.panValidation(payload).subscribe(result => {
        if (result['data'].Table[0].Message == 'PAN number already exists') {
          Swal.fire(`Already, the PAN Number (${event}) exists.`);
          this.fg.controls['PANNo'].setValue('');
        }
        else { return false; }
      })
    }
  }

  OnClickRadio(data, index) {
    console.log(data)
    this.bankEditSelectedIndex = index;
    this.clearBankDetails();
  }

  OnClickEditValue() {
    // console.log('row', row, index)
    let editRow = this.bankDetailsList[this.bankEditSelectedIndex];
    this.isBankEditMode = !this.isBankEditMode;
    this.patchBankDetails(editRow);
  }

  // Navigvate back to the branch details tab
  goToBranchDetails() {
    document.getElementById("branchDetails").click();
  }

  getLedgerMappingParentAccountList() {
    const payload = {
      ModuleType: 2
    }
    this.commonservice.getLedgerMappingParentAccountList(payload).subscribe(data => {
      this.parentAccountList = data["data"].Table;
    });
  }

}

