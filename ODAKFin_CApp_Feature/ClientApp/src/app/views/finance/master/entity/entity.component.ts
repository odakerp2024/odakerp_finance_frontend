import { DatePipe, formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css'],
  providers: [DatePipe]
})


export class EntityComponent implements OnInit, AfterViewInit {

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';

  companyForm: FormGroup;
  configurationForm: FormGroup;
  selectedCurrency: string = '';
  selectedIndexValue: number;
  documentForm: FormGroup;
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  selectedTabName: string = 'company';
  productForm: FormGroup;

  categoryList: any;
  currencyList: any;
  finicalList: any;
  companyInformation: any = {};
  payload: { Organization: { Table: { OrgId: number; CompanyName: any; CompanyCode: any; Address: any; ContactName: any; POBox: any; ZipCode: any; Designation: any; TelePhone1: any; TelePhone2: any; ContactEmailID: any; EmailID: any; URL: any; MobileNo: any; LogoFileName: any; AlertMegId: number; AlertMessage: string; CountryID: any; CityID: any; Country: any; City: any; CreatedDate: Date; ModifiedDate: Date; }[]; Table1: { OrgId: number; BusinessLocation: any; CIN: any; PANNo: any; RegistrationAddress: any; FinancialPeriod: any; Currency: any; CurrencyFormat: any; NoOfFractions: any; DateFormat: any; CreatedDate: Date; ModifiedDate: Date; }[]; Table2: any[]; Table3: any[]; }; };
  countryList: any;
  selectedItem: boolean = false;

  documentList: any = [{ name: 'File 1', id: 1 }, { name: 'File 2', id: 2 }, { name: 'File 3', id: 3 }];
  documentListInfo: any = [];
  getOrganizationInfo: any;
  editEmailId: boolean = false;
  organizationId: number;
  companyDetailId: any;
  isUpdate = false;
  isUpdateEnable = false;
  lastUpdatedDate: any;
  panPattern = '^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$';
  cinPattern = '^[a-zA-Z0-9]{21}$';
  addressPattern = '^[a-zA-Z0-9]$';
  configurationSubmit: boolean;
  dateFormatType = [];
  currencyFormat: any;
  emailData: any;
  documentInfo = [];
  isDeleteDocument: boolean = false;
  isDocuments: boolean = false;
  isEmailids: boolean = false;
  isReadDocument: boolean = false;
  selectedFile: File = null;


  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private commonDataService: CommonService,
    private LService: CommonService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.isDeleteDocument = params.isDeleteDocument == 'true' ? true : false;
      this.isDocuments = params.isDocuments == 'true' ? true : false;
      this.isEmailids = params.isEmailids == 'true' ? true : false;
      this.isReadDocument = params.isReadDocument == 'true' ? true : false;
      debugger
    });


    this.productForm = this.fb.group({
      quantities: this.fb.array([]),
    });
    this.getCurrency();
    this.getFinicalPeriod();
    this.getCountryList();
    this.getCategoryList();
    // this.getOrganization(); // note
    this.createConfigurationForm();
    this.getDateFormat();
    this.getCurrencyFormat();
  }

  checkPermission(value) {
    debugger
    if (value == 'email' && this.isEmailids == true) {
      this.selectedTabName = 'email'
    } else if (value == 'documents' && this.isDocuments == true) {
      this.selectedTabName = 'documents'
    } else if (value == 'documents' && this.isReadDocument == true) {
      this.selectedTabName = 'documents'
    } else if (value == 'documents' && (this.isDeleteDocument == true || (this.isReadDocument == true || this.isDocuments == true))) {
      this.selectedTabName = 'documents'
    } else {
      Swal.fire('Please Contact Administrator');
    }
  }


  async ngOnInit() {
    this.createCompanyForm();
    this.createDocumentForm();
    await this.getCompanyDetails();
    this.getOrganization();
  }

  ngAfterViewInit(): void {
    this.companyForm.disable();
  }

  createCompanyForm() {
    this.companyForm = this.fb.group({
      companyName: [''],
      companyShortName: [''],
      address: [''],
      city: [''],
      zipCode: [''],
      poBox: [''],
      country: [''],
      telephone1: [''],
      telephone2: [''],
      eMail: [''],
      URL: [''],
      contactName: [''],
      designation: [''],
      emailId: [''],
      mobile: [''],
      logo: ['']
    });
  }

  createConfigurationForm() {
    this.configurationForm = this.fb.group({
      ID: 0,
      businessLocation: ['', [Validators.required]],
      // CIN: ['', [Validators.pattern(this.cinPattern)]],
      // panNo: ['', [Validators.pattern(this.panPattern)]],
      address: ['', [Validators.required]],
      finicalPeriod: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      currencyFormat: ['', [Validators.required]],
      noFractions: ['', [Validators.required]],
      dateFormat: ['', [Validators.required]],
      CreatedDate: ['']
    });
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      ID: 0,
      OrgId: 0,
      DocumentName: [''],
      FilePath: [''],
      UniqueFilePath: [''],
      UploadedBy: [localStorage.getItem('UserID')],
      uploadedOn: [localStorage.getItem('UserID')],
      CreatedBy: [localStorage.getItem('UserID')],
      UpdatedBy: [localStorage.getItem('UserID')],
      CreatedOn: [new Date()],
      Modifiedon: [new Date()],   
    });
  }

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  f(): any {
    return (this.productForm.get('quantities') as FormArray).controls;
  }

  public checkError = (formGroupName: string, controlName: string, errorName: string) => {
    if (formGroupName === 'companyForm') { // company details
      return this.companyForm.controls[controlName].hasError(errorName);
    } else if (formGroupName === 'configurationForm') {  // configuration
      return this.configurationForm.controls[controlName].hasError(errorName);
    } else if (formGroupName === 'productForm') { // email
      return this.productForm.controls[controlName].hasError(errorName);
    } else if (formGroupName === 'documentForm') { // documents
      return this.documentForm.controls[controlName].hasError(errorName);
    }

  }
  newQuantity(): FormGroup {
    return this.fb.group({
      ID: 0,
      OrgId: 0,
      Category: ['', Validators.required],
      EmailId: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      CreatedBy: localStorage.getItem('UserID'),
      UpdatedBy: localStorage.getItem('UserID'),
      CreatedDate: new Date(),
      ModifiedDate: new Date(),
      checkBox: false
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity() {
    if (this.selectedIndexValue >= 0 && this.selectedItem) {
      this.quantities().removeAt(this.selectedIndexValue);
      this.selectedItem = true;
      this.selectedIndexValue = undefined;
    }
    else {
      this.selectedItem = true;
      this.selectedIndexValue = undefined;
      Swal.fire("Please select the Item!!");
    }
  }


  radioChange(event: any, index: number) {

    let isChecked = !this.productForm.value.quantities[index].checkBox;
    for (let data of this.productForm.value.quantities) { data.checkBox = false; }
    if (isChecked) {
      this.productForm.value.quantities[index].checkBox = true;
      this.selectedIndexValue = index;
      this.selectedItem = true;
    }
    else {
      this.selectedItem = false;
      this.selectedIndexValue = undefined;
    }
    this.productForm.patchValue({
      quantities: this.productForm.value.quantities
    });
  }

  entityRoute() {
    this.router.navigate(['views/finance/financemaster']);
  }


  // Get company information
  getCompanyDetails() {
    return new Promise((resolve, reject) => {
      let service = `${this.globals.SaApi}/SystemAdminApi/GetCompanyDetails`;
      this.dataService.post(service, {}).subscribe((result: any) => {
        if (result.length > 0) {
          let res = result[0];

          this.companyInformation = {
            CountryID: res.CountryID,
            CityID: res.CityID,
            CompanyCode: res.CompanyCode,
            Designation: res.Designation
          }
          this.companyDetailId = res.ID;
          localStorage.setItem('OrgId', this.companyDetailId);
          // this.companyForm.patchValue({
          //   companyName: res.CompanyName,
          //   companyShortName: res.CompanyName,
          //   address: res.Address,
          //   city: res.City,
          //   zipCode: res.ZipCode,
          //   poBox: res.POBox,
          //   country: res.Country,
          //   telephone1: res.TelePhone1,
          //   telephone2: res.TelePhone2,
          //   eMail: res.EmailID,
          //   URL: res.URL,
          //   contactName: res.ContactName,
          //   designation: res.Designation,
          //   emailId: res.EmailID,
          //   mobile: res.MobileNo,
          //   logo: res.LogoFileName
          // });
          resolve(true);
        }
      }, error => { });
    });
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.length > 0) {
        this.currencyList = result;
      }
    }, error => { });
  }

  currencyChanged(event: any) {
    this.selectedCurrency = event;
    if (this.selectedCurrency === 'INDIA') {
      this.addNewControlsToConfiguration();
    } else {
      this.removeControlsFromConfiguration();
    }
  }

  // Add form controls (CIN ,PAN)
  addNewControlsToConfiguration(): void {
    const oldData = this.configurationForm.value;
    this.configurationForm = this.fb.group({
      // ...this.configurationForm.controls,
      // CIN: ['', [cinValidation]],
      // panNo: ['', [panValidator]],
      ID: oldData.ID,
      businessLocation: [oldData.businessLocation, [Validators.required]],
      CIN: ['', [cinValidation]],
      panNo: ['', [panValidator]],
      address: [oldData.address, [Validators.required]],
      finicalPeriod: [oldData.finicalPeriod, [Validators.required]],
      currency: [oldData.currency, [Validators.required]],
      currencyFormat: [oldData.currencyFormat, [Validators.required]],
      noFractions: [oldData.noFractions, [Validators.required]],
      dateFormat: [oldData.dateFormat, [Validators.required]],
      CreatedDate: [oldData.CreatedDate]
    });
  }
  // remove form controls (CIN, PAN)
  removeControlsFromConfiguration() {
    this.configurationForm.removeControl('CIN');
    this.configurationForm.removeControl('panNo');
  }

  getFinicalPeriod() {
    let service = `${this.globals.APIURL}/FinancialYear/GetFinancialYearMonths`
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.length > 0) {
        this.finicalList = result.data;
      }
    }, error => { });
  }

  // Create configuration info
  async saveConfiguration(emailUpdate?: string) {
    this.configurationSubmit = true;
    var validation = "";
    if (!this.configurationForm.value.businessLocation) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Business Location </span></br>"
    }
    if (!this.configurationForm.value.CIN && this.selectedCurrency == 'INR - INDIAN RUPEE') {
      validation += "<span style='color:red;'>*</span> <span>Please Enter CIN</span></br>"
    }
    if (!this.configurationForm.value.panNo && this.selectedCurrency == 'INR - INDIAN RUPEE') {
      validation += "<span style='color:red;'>*</span> <span>Please Enter PAN NO</span></br>"
    }
    if (!this.configurationForm.value.address) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Registration address</span></br>"
    }
    if (!this.configurationForm.value.finicalPeriod) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Financial Period</span></br>"
    }
    if (!this.configurationForm.value.currency) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Currency</span></br>"
    }
    if (!this.configurationForm.value.currencyFormat) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Currency Format</span></br>"
    }
    if (!this.configurationForm.value.noFractions) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter No of Fractions</span></br>"
    }
    if (!this.configurationForm.value.dateFormat) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Date Format</span></br>"
    }

    if (!this.configurationForm.value.panNo && this.selectedCurrency == 'INDIA') {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Entity PAN No</span></br>"
    }

    if (!this.configurationForm.value.CIN && this.selectedCurrency == 'INDIA') {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Entity CIN No</span></br>"
    }

    if (validation != "") {
      Swal.fire(validation);
      return false;
    }
    if (this.configurationForm.invalid) {
      return false;
    }

    this.customService();
  }

  configurationFormPatch(data) {
    if (data.BusinessLocation === 'INDIA') {
      this.addNewControlsToConfiguration();
    } else {
      this.removeControlsFromConfiguration();
    }

    this.CreatedOn = this.datePipe.transform(data.CreatedDate, this.entityDateFormat1);
    this.ModifiedOn = this.datePipe.transform(data.ModifiedDate, this.entityDateFormat1);
    this.ModifiedBy = localStorage.getItem('UserID');
    this.CreatedBy = localStorage.getItem('UserID');
    this.getUpdatedByRecord([data.CreatedBy, data.UpdatedBy]);

    this.configurationForm.patchValue({
      ID: data.ID,
      businessLocation: data.BusinessLocation,
      CIN: data.CIN,
      panNo: data.PANNo,
      address: data.RegistrationAddress,
      finicalPeriod: data.FinancialPeriod,
      currency: data.Currency,
      currencyFormat: data.CurrencyFormat,
      noFractions: data.NoOfFractions,
      dateFormat: data.DateFormat,
      CreatedDate: data.CreatedDate
    });
    this.isUpdate = true;
    this.configurationFormDisable();
    // this.lastUpdatedDate = dateFormat;
    this.selectedCurrency = data.BusinessLocation;
  }
  configurationFormDisable() {
    this.configurationForm.disable();
  }

  configurationFormEnable() {
    this.isUpdateEnable = true;
    this.configurationForm.enable();
  }

  async customService(newDocument?) {
  await this.getCompanyDetails();
    await this.customPayload(newDocument);
    let service = `${this.globals.APIURL}/Organization/SaveOrganizationEntity`;
    this.dataService.post(service, this.payload).subscribe((result: any) => {
      if (result.data.length > 0) {
        this.finicalList = result.data;
        // Swal.fire("Record Saved Successfully");
        Swal.fire(this.finicalList);

        this.configurationFormDisable();
        // this.router.navigate(['/views/entity/entity-view']);
        this.getOrganization();

      }
    }, error => {
      console.error(error);
    });
  }

  restForm() {
    this.configurationForm.reset();
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

  saveEmailDetails() {
    if (this.productForm.invalid) {
      this.productFormValidation();
      return;
    }
    this.customService();
  }

  productFormValidation() {
    let validation = '';
    if (this.productForm.invalid) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Valid Details </span></br>';
    }
    if (validation !== '') {
      Swal.fire(validation);
    }
  }

  customPayload(newDocument?) {
    let configurationInfo = this.configurationForm.value;
    let Table = {
      OrgId: this.companyDetailId,
      CompanyName: this.companyForm.value.companyName,
      CompanyCode: this.companyInformation.CompanyCode,
      Address: this.companyForm.value.address,
      ContactName: this.companyForm.value.contactName,
      POBox: this.companyForm.value.poBox,
      ZipCode: this.companyForm.value.zipCode,
      Designation: this.companyInformation.Designation,
      TelePhone1: this.companyForm.value.telephone1,
      TelePhone2: this.companyForm.value.telephone2,
      ContactEmailID: this.companyForm.value.emailId,
      EmailID: this.companyForm.value.emailId,
      URL: this.companyForm.value.URL,
      MobileNo: this.companyForm.value.mobile,
      LogoFileName: this.companyForm.value.logo,
      AlertMegId: 0,
      AlertMessage: '',
      CountryID: this.companyInformation.CountryID,
      CityID: this.companyInformation.CityID,
      Country: this.companyForm.value.country,
      City: this.companyForm.value.city,
      CreatedBy: localStorage.getItem('UserID'),
      UpdatedBy: localStorage.getItem('UserID'),
      CreatedDate: new Date(),
      ModifiedDate: new Date()
    }

    let Table1 = {
      ID: this.configurationForm.value ? this.configurationForm.value.ID : 0,
      OrgId: this.companyDetailId,
      BusinessLocation: configurationInfo.businessLocation ? configurationInfo.businessLocation : '',
      CIN: configurationInfo.CIN ? configurationInfo.CIN : '',
      PANNo: configurationInfo.panNo ? configurationInfo.panNo : '',
      RegistrationAddress: configurationInfo.address,
      FinancialPeriod: configurationInfo.finicalPeriod,
      Currency: configurationInfo.currency,
      CurrencyFormat: configurationInfo.currencyFormat,
      NoOfFractions: configurationInfo.noFractions,
      DateFormat: configurationInfo.dateFormat,
      CreatedBy: localStorage.getItem('UserID'),
      UpdatedBy: localStorage.getItem('UserID'),
      CreatedDate: configurationInfo.CreatedDate,
      ModifiedDate: new Date(),
    }

    // if (this.productForm.value.quantities.length == 0) {
    //   var Table2: any = [{
    //     ID: 0,
    //     OrgId: this.companyDetailId,
    //     Category: '',
    //     EmailId: '',
    //     StartDate: '',
    //     EndDate: '',
    //     CreatedBy: localStorage.getItem('UserID'),
    //     UpdatedBy: localStorage.getItem('UserID'),
    //     CreatedDate: new Date(),
    //     ModifiedDate: new Date()
    //   }]
    // }
    // else {
    //   let copyArray = [...this.productForm.value.quantities];
    //   copyArray.forEach(object => {
    //     delete object['checkBox'];
    //     object.OrgId = this.companyDetailId
    //   });
    //   var Table2: any = copyArray;
    // }
    let emailData = [];
    if (this.emailData) {
      emailData = this.customEmail(this.emailData);
    }
    let Table3 = [];
    if (newDocument) {
      Table3 = [{
        ID: 0,
        OrgId: this.companyDetailId,
        DocumentName: newDocument.DocumentName,
        FilePath: newDocument.FilePath,
        UniqueFilePath: newDocument.UniqueFilePath,
        UploadedBy: localStorage.getItem('UserID'),
        uploadedOn: new Date(),
        CreatedBy: localStorage.getItem('UserID'),
        UpdatedBy: localStorage.getItem('UserID'),
        CreatedOn: new Date(),
        Modifiedon: new Date(),
       
      }];

    }
    let table3 = [...this.documentListInfo, ...Table3];
    this.payload = {
      Organization: {
        Table: [Table],
        Table1: [Table1],
        Table2: emailData,
        Table3: table3
      }
    }
  }

  getCategoryList() {
    let service = `${this.globals.APIURL}/Organization/GetCategoryList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.categoryList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  getOrganization() {
    let service = `${this.globals.APIURL}/Organization/GetOrganizationEntityId`;
    this.dataService.post(service, { "OrgId": this.companyDetailId }).subscribe((result: any) => {
      this.getOrganizationInfo = result.data ? result.data : {};
      const res = result.data.Table[0];
      if (res) {
        this.companyForm.patchValue({
          companyName: res.CompanyName,
          companyShortName: res.CompanyName,
          address: res.Address,
          city: res.City,
          zipCode: res.ZipCode,
          poBox: res.POBox,
          country: res.Country,
          telephone1: res.TelePhone1,
          telephone2: res.TelePhone2,
          eMail: res.EmailID,
          URL: res.URL,
          contactName: res.ContactName,
          designation: res.Designation,
          emailId: res.EmailID,
          mobile: res.MobileNo,
          logo: res.LogoFileName
        });
      }

      if (result.data.Table2.length > 0) {
        this.documentListInfo = [];
        for (let i = 0; i < result.data.Table2.length; i++) {
          this.addQuantity();
          result.data.Table2[i].StartDate = this.datePipe.transform(result.data.Table2[i].StartDate, 'y-MM-dd');
          result.data.Table2[i].EndDate = this.datePipe.transform(result.data.Table2[i].EndDate, 'y-MM-dd')
        }
        this.productForm.patchValue({
          quantities: result.data.Table2
        });
        this.emailData = result.data.Table2;
      }

      if (result.data.Table3.length > 0) {
        this.documentListInfo = result.data.Table3;
        this.documentInfo = this.constructDocumentPayload(this.documentListInfo);
        // console.log(docInfo,"doc Data")
        // return docInfo
      }

      if (result.data.Table1.length > 0) {
        this.configurationFormPatch(result.data.Table1[0]);
      }
    }, error => {
      console.error(error);
    });
  }

   uploadDocument(event) {
    // alert('common component');
    // return;
    var validation = "";
    // if (this.documentForm.value.DocumentName == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Document Name </span></br>"
    // }
    // if (this.documentForm.value.FilePath == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Browser File</span></br>"
    // }
    if (event) {
      this.selectedFile = event.file.target.files[0];
      const filedata = new FormData();
      filedata.append('file', this.selectedFile, this.selectedFile.name)

      if (!event.DocumentName) {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Document Name </span></br>"
      }
      if (!event.FilePath) {
        validation += "<span style='color:red;'>*</span> <span>Please Enter Browser File</span></br>"
      }
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }
    return new Promise((resolve) => {
    this.commonDataService.AttachUpload(this.selectedFile).subscribe(data => {
      if (data) {
        debugger
        event.UniqueFilePath = data.FileNamev
      } resolve(true);

      this.customService(event);
      this.getOrganization();

  }, error => { });
});
  }

  updateEmailDetails(emailTableData) {
    // if (this.productForm.invalid) {
    //   this.productFormValidation();
    //   return;
    // }
    // let copyArray = [...this.productForm.value.quantities];
    // copyArray.forEach(object => {
    //   delete object['checkBox'];
    // });

    // this.getOrganizationInfo.Table2 = this.productForm.value.quantities;
    // this.getOrganizationInfo.Table;

    // [ID][OrgId][Category][EmailId][StartDate][EndDate][CreatedBy][UpdatedBy][CreatedDate][ModifiedDate] // email order
    let emailData = [];

    if (emailTableData) {
      emailData = this.customEmail(emailTableData);
    }

    let payload = {
      Organization: {
        Table: this.getOrganizationInfo.Table,
        Table1: this.getOrganizationInfo.Table1,
        Table2: emailData,
        Table3: this.getOrganizationInfo.Table3
      }
    }
    // if(payload.Organization.Table2.length == this.emailData.length ){
    //   return
    // }
    let service = `${this.globals.APIURL}/Organization/SaveOrganizationEntity`;
    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.data.length > 0) {
        this.finicalList = result.data;
        Swal.fire("Updated Successfully");
        this.getOrganization();
      }
    }, error => {
      console.error(error);
    });
  }

  getDateFormat() {
    const service = `${this.globals.APIURL}/Common/GetDateFormatList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.dateFormatType = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  getCurrencyFormat() {
    const service = `${this.globals.APIURL}/Common/GetCurrenceyFormatList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.currencyFormat = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  customEmail(emailTableData) {
    const emailPayload = [];
    emailTableData.forEach(element => {
      const newData = {
        'ID': element.ID,
        'OrgId': element.OrgId,
        'Category': element.Category,
        'EmailId': element.EmailId,
        'StartDate': element.StartDate,
        'EndDate': element.EndDate,
        'CreatedBy': element.CreatedBy,
        'UpdatedBy': element.UpdatedBy,
        'CreatedDate': element.CreatedDate,
        'ModifiedDate': element.ModifiedDate
      };
      emailPayload.push(newData);

    });
    return emailPayload;
  }
  // pass the data to document component
  constructDocumentPayload(docList) {

    if (docList) {
      const newDocument = [];
      docList.forEach((item) => {
        const payload = {
          ID: item.ID,
          OrgId: item.OrgId,
          DocumentName: item.DocumentName,
          FilePath: item.FilePath,
          UniqueFilePath: item.UniqueFilePath,
          Modifiedon: item.Modifiedon,
          UpdatedBy: item.UpdatedBy,
          UploadedBy: item.UploadedBy,
          uploadedOn: item.uploadedOn,
          CreatedBy: item.CreatedBy,
          CreatedOn: item.CreatedOn,
         

        };
        newDocument.push(payload);
      });
      return newDocument;
    }
  }

  deleteDocument(event) {
    const indexToDelete = event;
    // let index = this.documentListInfo.findIndex((element) => element.ID == deleteIndex.ID);
    if (indexToDelete >= 0 && indexToDelete < this.documentListInfo.length) {
      this.documentListInfo.splice(indexToDelete, 1);
      // this.documentListInfoResponse.splice(index, 1);
      Swal.fire("Deleted Successfully");
      console.log('documentListInfo');
      this.saveConfiguration();
    }
  }

  getUpdatedByRecord(data: any) {
    var service = `${this.globals.APIURL}/UserApi/UserViewRecord`;
    this.dataService.post(service, { ID: data[0] }).subscribe((result: any) => {
      if (result.length > 0) {
        this.CreatedBy = result[0].UserName;
      }
    }, error => { });

    this.dataService.post(service, { ID: data[1] }).subscribe((result: any) => {
      if (result.length > 0) {
        this.ModifiedBy = result[0].UserName;
      }
    }, error => { });

  }

}

function panValidator(control) {
  const panPattern = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/;
  if (control.value && !panPattern.test(control.value)) {
    return { invalidPan: true };
  }
  return null;
}

function cinValidation(control) {
  const cinPattern = /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
  if (control.value && !cinPattern.test(control.value)) {
    return { invalidCin: true };
  }
  return null;
}

function getPermissionList(value) {
  this.MenuForm.value.UserID = localStorage.getItem("UserId");
  this.MenuForm.value.Ref_Application_Id = "4";
  this.MenuForm.value.SubfunctionID = value;

  this.LService.GetUserPermissionObject(this.MenuForm.value).subscribe(data => {
    if (data.length > 0) {
      console.log("PermissionObject", data);
      if (data[0].SubfunctionID == value) {
        if (data[0].Read_Opt != 2) {

          Swal.fire('Please Contact Administrator');
        }
        else {
          this.router.navigate(['/views/masters/LAmaster/Principalagency/Principalagencyview'],);
        }
      }
      else {

        Swal.fire('Please Contact Administrator');
      }
    }
    else {

      Swal.fire('Please Contact Administrator');
    }
  });
}
