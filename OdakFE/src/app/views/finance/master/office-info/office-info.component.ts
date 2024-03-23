import { DatePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-office-info',
  templateUrl: './office-info.component.html',
  styleUrls: ['./office-info.component.css'],
  providers: [DatePipe]
})
export class OfficeInfoComponent implements OnInit, AfterViewChecked, AfterViewInit {

  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  selectedTabName: string = 'Basic';
  officeForm: FormGroup;
  officeDetailsForm: FormGroup;
  documentForm: FormGroup;
  selectedIndexValue: number;
  selectedItem: boolean = false;
  payload: any;
  isCreate: boolean = true;
  isUpdate: boolean = false;
  officeId: number = 0;
  documentList: any = [{ name: 'File 1', id: 1 }, { name: 'File 2', id: 2 }, { name: 'File 3', id: 3 }];
  statusvalues: Status[] = new StatusView().statusvalues;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);

  entityInfo: { CompanyName: any; companyShortName: any; };
  countryList: any;
  documentListInfo: any = [];
  officeDetails: { officeName: any; officeId: any; };
  stateList: any;
  panCardShow: boolean = false;
  officeDetailsSubmit: boolean;
  addressPattern = '^[a-zA-Z0-9]$';
  gstPattern = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  pinCodePattern = '^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$';
  telephonePattern = '^[1-9][0-9]*$';
  isUpdateEnable: boolean;
  finicalList = [];
  divisionList: any[];
  CreatedOn: string;
  ModifiedOn: string;
  ModifiedBy: string;
  CreatedBy: string;
  emailData: any;

  IsSalesValue = true;
  officeList: any[];
  salesValue: any;
  selectedCountryId: any;
  orgId: any;
  autoGenerateCodeList: any[];
  documentListInfoResponse: any = [];
  businessDivisionArray: any = [];

  isOfficeDetail: boolean = false;
  isEmailids: boolean = false;
  isDocuments: boolean = false;
  isReadDocument: boolean = false;


  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private route: ActivatedRoute,
    private autoCodeService: AutoCodeService,
    private commonDataService: CommonService
  ) {
    this.getNumberRange();
    this.getCountryList();
    this.getCompanyDetails();
    this.getOfficeList();
    this.createEntityForm();
    this.createOfficeDetailsForm();
    this.getStateList();
  }
  ngAfterViewInit(): void {
    this.officeFormDisable();
    if (this.isUpdate) {
      this.officeDetailsFormDisable();
    }
    if (!this.isUpdate) {
      this.officeFormEnable();
      this.isUpdateEnable = true;
    }
  }
  ngAfterViewChecked(): void {
    // if (this.panCardShow) {
    // this.officeFormEnable();
    // }
    this.salesChanged(this.officeDetailsForm.value.IsSalesOffice);
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (param) => {
      debugger
      if (param.id) {
        this.isUpdate = param.isCreate === 'false' ? true : false;
        this.officeId = param.id;
        this.isCreate = false;
        // await this.getCountryList();
        this.getOfficeInfo(this.officeId);
      }
      this.isOfficeDetail = param.isOfficeDetail == 'true' ? true : false;
      this.isEmailids = param.isEmailids == 'true' ? true : false;
      this.isDocuments = param.isDocuments == 'true' ? true : false;
      this.isReadDocument = param.isReadDocument == 'true' ? true : false;


      if (this.isOfficeDetail == true) {
        this.selectedTabName = 'Basic'
      } else if (this.isDocuments == true) {
        this.selectedTabName = 'Attach'
      } else if (this.isEmailids == true && param.isCreate === 'false') {
        this.selectedTabName = 'email'
      }
    });


    // this.createEntityForm();
    // this.createOfficeDetailsForm();
    this.createDocumentForm();
    this.getFinancialYear();
    this.getDivisionList();
  }

  createEntityForm() {
    this.officeForm = this.fb.group({
      Id: [0],
      OrgId: [localStorage.getItem('OrgId')],
      OfficeName: [''],
      BusinessLocation: [''],
      // CIN: ['', [Validators.pattern(this.cinPattern)]],
      // PANNo: ['', [Validators.required, panValidator]],
      CreatedBy: [localStorage.getItem('UserID')],
      CreatedDate: [new Date()],
      UpdatedBy: [localStorage.getItem('UserID')],
      UpdatedDate: [new Date()],
      EntityName: [''],
      EntityShortName: [''],
      BusinessDIvision: [''],
      FinancialYear: [''],
      RegistrationAddress: ['', [Validators.required]]
    });
  }

  createOfficeDetailsForm() {
    this.officeDetailsForm = this.fb.group({
      ID: [0],
      OfficeId: [0],
      IsSalesOffice: [!this.IsSalesValue.toString()], // default value is false
      ParentOffice: [''],
      Active: ['true'],
      OfficeCode: [''],
      OfficeName: [''],
      OfficeShortName: [''],
      StateId: [''],
      PinCode: ['', Validators.pattern(this.pinCodePattern)],
      Telephone: ['', [Validators.pattern(this.telephonePattern), Validators.minLength(12), Validators.maxLength(16)]],
      Address: [''],
      GSTNo: ['', Validators.pattern(this.gstPattern)],
      // GSTNo: [''],
      EffectiveDate: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      CreatedDate: [new Date()],
      UpdatedBy: [localStorage.getItem('UserID')],
      UpdatedDate: [new Date()]
    });

  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      ID: 0,
      OfficeId: 0,
      DocumentName: [''],
      FilePath: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      CreatedDate: [new Date()],
      UpdatedBy: [localStorage.getItem('UserID')],
      UpdatedDate: [new Date()],
      UploadedBy: [localStorage.getItem('UserID')],
      uploadedOn: [new Date()],
    });
  }

  getCompanyDetails() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCompanyDetails`;
    this.dataService.post(service, {}).subscribe(async (result: any) => {
      if (result.length > 0) {
        let res = result[0];
        this.orgId = res.ID;
        let service = `${this.globals.APIURL}/Organization/GetOrganizationConfiguration`;
        this.dataService.post(service, { OrgId: this.orgId }).subscribe(async (entityResult: any) => {
          const entityConfiguration = entityResult.data.Configuration[0];
          await this.getOrganization(this.orgId);
          this.officeForm.patchValue({
            EntityName: res.CompanyName,
            EntityShortName: res.CompanyName,
            CIN: entityConfiguration.CIN,
            PANNo: entityConfiguration.PANNo,
            RegistrationAddress: entityConfiguration.RegistrationAddress,
            FinancialYear: entityConfiguration.FinancialPeriod,
          });
        });
      }
    }, error => { });
  }

  getOrganization(orgID: any) {
    return new Promise((resolve, rejects) => {
      let service = `${this.globals.APIURL}/Organization/GetOrganizationEntityId`;
      this.dataService.post(service, { "OrgId": orgID }).subscribe(async (result: any) => {
        this.officeForm.controls['BusinessLocation'].setValue(result.data.Table1[0].BusinessLocation);
        if (result.data.Table1[0].BusinessLocation === 'INDIA' && !this.isUpdate) {
          this.addNewControlsToOfficeForm();
          this.panCardShow = true;
        }
        await this.getCountryIdByName(result.data.Table1[0].BusinessLocation);
        resolve(true);
      }, error => {
        console.error(error);
        resolve(true);
      });
    })
  }


  getFinancialYear() {
    const url = `${this.globals.MASTER_API_URL}/FinancialYear/GetFinancialYearList`;
    this.dataService.post(url, {})
      .subscribe((response: any) => {
        if (response.data.length > 0) {
          this.finicalList = response.data;
        }
      });
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (event.value !== null && event.value >= today) {
      this.officeDetailsForm.get('EffectiveDate').setValue(event.value);
    }
  }

  filterDates = (date: Date | null): boolean => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate >= today;
    }
    return true;
  };

  getDivisionList() {
    const url = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`;
    this.dataService.post(url, {}).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) { this.divisionList = result.data.Table; }
    }, error => { });
  }


  saveOfficeDetails(emailTableData = []) {
    this.officeDetailsSubmit = true;
    var validation = "";

    if (this.officeForm.value.EntityName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Entity Name</span></br>"
    }
    if (this.officeForm.value.BusinessLocation == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Business Location</span></br>"
    }
    if (this.officeForm.value.CIN == "" && this.panCardShow) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter CIN (incorporation)</span></br>"
    }
    if (this.officeForm.value.RegistrationAddress == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Registration Address</span></br>"
    }
    if (this.officeForm.value.BusinessDIvision == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Business Division</span></br>"
    }
    if (this.officeForm.value.EntityShortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Entity Short Name</span></br>"
    }
    if (this.officeForm.value.PANNo == "" && this.panCardShow) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Entity PAN No</span></br>"
    }
    if (this.officeForm.value.FinancialYear == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Financial Year</span></br>"
    }
    // if (this.officeDetailsForm.value.IsSalesOffice == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Sales Office</span></br>"
    // }
    if (this.officeDetailsForm.value.OfficeCode == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Office Code</span></br>"
    }
    if (this.officeDetailsForm.value.StateId == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter State</span></br>"
    }
    if (this.officeDetailsForm.value.Address == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Address</span></br>"
    }
    if (this.officeDetailsForm.value.ParentOffice == "" && this.salesValue) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Parent Office</span></br>"
    }
    if (this.officeDetailsForm.value.OfficeName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Office Name</span></br>"
    }
    if (this.officeDetailsForm.value.PinCode == "" || this.officeDetailsForm.value.PinCode == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Pin Code</span></br>"
    }
    if (this.officeDetailsForm.value.GSTNo == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter GST Number</span></br>"
    }
    if (this.officeDetailsForm.value.Active === "" || this.officeDetailsForm.value.Active == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Active</span></br>"
    }
    if (this.officeDetailsForm.value.OfficeShortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Office Short Name</span></br>"
    }
    // if (this.officeDetailsForm.value.Telephone == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Telephone</span></br>"
    // }
    if (this.officeDetailsForm.value.EffectiveDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter EffectiveDate</span></br>"
    }

    if (validation !== "") {
      Swal.fire(validation)
      return false;
    }

    // if (this.officeForm.invalid) {
    //   return false;
    // }

    // if (this.officeDetailsForm.invalid) {
    //   return false;
    // }

    this.customPayload(emailTableData);
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
        let service = `${this.globals.APIURL}/Office/SaveOrganizationOffice/`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == 'Success') {
            Swal.fire(result.data, '', 'success');
            // Swal.fire(result.data);
            if (!this.isUpdate) {
              this.updateAutoGenerated();
            }
            this.router.navigate(['/views/office/office-view']);
          }
        }, error => {
          // console.log('SaveOrganizationOffice error', error);
        });
      } else {

      }
    });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Office');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  customPayload(emailTableData) {
    const officeEmail = [];
    emailTableData.forEach(element => {
      const newData = {
        'ID': element.ID,
        'OfficeId': element.OrgId,
        'Category': element.Category,
        'EmailId': element.EmailId,
        'StartDate': element.StartDate,
        'EndDate': element.EndDate,
        'CreatedBy': element.CreatedBy,
        'CreatedDate': element.CreatedDate,
        'UpdatedBy': element.UpdatedBy,
        'UpdatedDate': element.ModifiedDate
      };
      officeEmail.push(newData);
    });

    let Table3 = [{
      ID: 0,
      OfficeId: 0,
      DocumentName: this.documentForm.value.DocumentName,
      FilePath: this.documentForm.value.FilePath,
      CreatedBy: localStorage.getItem('UserID'),
      CreatedDate: new Date(),
      UpdatedBy: localStorage.getItem('UserID'),
      UpdatedDate: new Date(),
      UploadedBy: localStorage.getItem('UserID'),
      uploadedOn: new Date()
    }]

    let table3 = [...this.documentListInfoResponse, ...Table3];
    let officePayload = this.officeForm;
    const businessDivision = this.officeForm.value.BusinessDIvision.toString();
    officePayload.value.BusinessDIvision = businessDivision;
    if (!officePayload.value.CIN) {
      officePayload.value.CIN = '';
    }
    if (!officePayload.value.PANNo) {
      officePayload.value.PANNo = '';
    }
    const Table1 = this.officeDetailsForm.value;
    Table1.IsSalesOffice = Table1.IsSalesOffice.toString();
    Table1.Active = Table1.Active === 'true' ? true : false;
    this.payload = {
      Office: {
        Table: [officePayload.value],
        Table1: [Table1],
        Table2: officeEmail,
        Table3: table3.filter(x => x.DocumentName != '')
      }
    }
  }

  getCountryList() {
    return new Promise((resolve, reject) => {
      let service = `${this.globals.APIURL}/Organization/GetCountryList`;
      this.dataService.post(service, {}).subscribe((result: any) => {
        if (result.data.Table.length > 0) {
          this.countryList = result.data.Table;
          resolve(true);
        }
      }, error => {
        console.error(error);
      });
    });
  }

  getOfficeInfo(id: number) {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeById/`;
    this.dataService.post(service, { Id: id }).subscribe((result: any) => {

      if (result.message == "Success") {
        let info = result.data.Office[0];
        if (info.BusinessLocation === 'INDIA') {
          this.addNewControlsToOfficeForm();
          this.panCardShow = true;
        } else {
          this.removeControlsFromOfficeForm();
        }
        let officeDetails = result.data.OfficeDetails[0];
        if (info.BusinessLocation) {
          this.getCountryIdByName(info.BusinessLocation);
        }
        this.businessDivisionArray = info.BusinessDIvision ? info.BusinessDIvision.split(',') : [];
        // this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat);
        // this.ModifiedOn = this.datePipe.transform(info.UpdatedDate, this.entityDateFormat);
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat1);
        this.ModifiedOn = this.datePipe.transform(info.UpdatedDate, this.entityDateFormat1);
        this.getUpdatedByRecord([info.CreatedBy, info.UpdatedBy])

        this.officeForm.patchValue({
          Id: info.ID,
          OrgId: info.OrgId,
          OfficeName: officeDetails.OfficeName,
          // BusinessLocation: info.BusinessLocation,
          CIN: info.CIN,
          PANNo: info.PANNo,
          CreatedBy: info.CreatedBy,
          CreatedDate: new Date(),
          UpdatedBy: localStorage.getItem('UserID'),
          // UpdatedDate: this.datePipe.transform(new Date(), 'dd-MM-yyy'),
          UpdatedDate: new Date(),
          EntityName: info.EntityName,
          EntityShortName: info.EntityShortName,
          BusinessDIvision: this.businessDivisionArray,
          FinancialYear: info.FinancialYear,
          RegistrationAddress: info.RegistrationAddress
        });

        this.officeDetails = {
          officeName: officeDetails.OfficeName ? officeDetails.OfficeName : '',
          officeId: info.ID
        }
        this.salesValue = officeDetails.ParentOffice === 'true' ? true : false;
        this.officeDetailsForm.patchValue({
          ID: officeDetails.ID,
          OfficeId: info.ID,
          IsSalesOffice: officeDetails.IsSalesOffice.toString(),
          ParentOffice: officeDetails.ParentOffice,
          Active: officeDetails.Active == true ? 'YES' : 'NO',
          OfficeCode: officeDetails.OfficeCode,
          OfficeName: officeDetails.OfficeName,
          OfficeShortName: officeDetails.OfficeShortName,
          StateId: officeDetails.StateId,
          PinCode: officeDetails.PinCode,
          Telephone: officeDetails.Telephone,
          Address: officeDetails.Address,
          GSTNo: officeDetails.GSTNo,
          EffectiveDate: officeDetails.EffectiveDate,
          CreatedBy: localStorage.getItem('UserID'),
          CreatedDate: officeDetails.CreatedDate,
          UpdatedBy: localStorage.getItem('UserID'),
          UpdatedDate: new Date()
        });
        // setTimeout(() => {
        //   this.officeDetailsForm.controls.StateId.setValue(officeDetails.StateId.toString());
        // }, 2000)
        // setTimeout(() => {
        //   this.officeDetailsForm.controls.StateId.setValue(officeDetails.StateId.toString());
        // }, 3000)

        const emailData = [];
        result.data.EmailIds.forEach(element => {
          const newData = {
            'ID': element.ID,
            'OrgId': this.officeId,
            'Category': element.Category,
            'EmailId': element.EmailId,
            'StartDate': element.StartDate,
            'EndDate': element.EndDate,
            'CreatedBy': element.CreatedBy,
            'UpdatedBy': element.UpdatedBy,
            'CreatedDate': element.CreatedDate,
            'ModifiedDate': element.UpdatedDate
          };
          emailData.push(newData);
        });

        this.emailData = emailData
        if (result.data.Documents.length > 0) {
          for (let data of result.data.Documents) {
            data.OfficeId = officeDetails.OfficeId;
          }
        }
        this.documentListInfoResponse = result.data.Documents;
        this.documentListInfo = this.constructDocumentPayload(this.documentListInfoResponse);
      }
    }, error => { });
  }


  officeRoute() {
    this.router.navigate(['/views/office/office-view']);
  }

  async getStateList(countryId?) {
    let payload = {};
    if (countryId) {
      payload = {
        CountryID: countryId
      };
    }
    var service = `${this.globals.SaApi}/SystemAdminApi/GetState`;
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.stateList = result;
    }, error => { });
  }

  locationChanges(event: string) {
    if (event === 'INDIA') {
      this.panCardShow = true;
      this.addNewControlsToOfficeForm();
      setTimeout(() => {
        this.officeFormEnable();
      }, 1000);

    } else {
      this.panCardShow = false;
      this.removeControlsFromOfficeForm();
    }
    this.getCountryIdByName(event);
  }

  // Add form controls (CIN ,PAN)
  addNewControlsToOfficeForm(): void {
    const oldFormValue = this.officeForm.value;
    this.officeForm = this.fb.group({
      Id: [this.officeId ? this.officeId : 0],
      OrgId: [oldFormValue.OrgId],
      OfficeName: [oldFormValue.OfficeName],
      BusinessLocation: [oldFormValue.BusinessLocation],
      CIN: ['', [cinValidation]],
      PANNo: ['', [panValidator]],
      CreatedBy: [localStorage.getItem('UserID')],
      CreatedDate: [oldFormValue.CreatedDate],
      UpdatedBy: [oldFormValue.UpdatedBy],
      UpdatedDate: [oldFormValue.UpdatedDate],
      EntityName: [oldFormValue.EntityName],
      EntityShortName: [oldFormValue.EntityShortName],
      BusinessDIvision: [oldFormValue.BusinessDIvision],
      FinancialYear: [oldFormValue.FinancialYear],
      RegistrationAddress: [oldFormValue.RegistrationAddress, [Validators.required]]
    });

  }
  // remove form controls (CIN, PAN)
  removeControlsFromOfficeForm() {
    if (this.officeForm.controls.CIN) {
      this.officeForm.removeControl('CIN');
    }
    if (this.officeForm.controls.PANNo) {
      this.officeForm.removeControl('PANNo');
    }
  }

  public checkError = (formGroupName: string, controlName: string, errorName: string) => {
    if (formGroupName === 'officeForm') { // company details
      return this.officeForm.controls[controlName].hasError(errorName);
    } else if (formGroupName === 'officeDetailsForm') { // company details
      return this.officeDetailsForm.controls[controlName].hasError(errorName);
    }
  }
  salesChanged(event: any) {
    this.salesValue = event === 'true' ? true : false;
    if (this.salesValue) {

    } else {
      this.officeDetailsForm.controls['ParentOffice'].setValue('');
    }
  }

  officeFormDisable() {
    this.officeForm.disable();
  }

  officeFormEnable() {
    this.officeForm.enable();
  }

  officeDetailsFormDisable() {
    this.officeDetailsForm.disable();
  }
  officeDetailsFormEnable() {
    this.officeDetailsForm.enable();
  }
  configurationFormEnable() {
    this.isUpdateEnable = true;
    this.officeFormEnable();
    this.officeDetailsFormEnable();
  }

  getOfficeList() {
    const url = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    const payload: any = {};
    this.dataService.post(url, payload).subscribe((result: any) => {
      if (result.message === 'Success') {
        this.officeList = [];
        this.officeList = result.data.Office;
      }
    }, error => {
      // console.log('officeList', error);
    });
  }

  async getCountryIdByName(countryName) {
    const countryDetails = this.countryList.find(country => country.CountryName === countryName);
    this.selectedCountryId = countryDetails?.ID ? countryDetails?.ID : '';
    if (this.selectedCountryId) {
      await this.getStateList(this.selectedCountryId);
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
        var Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Office');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.officeDetailsForm.controls['OfficeCode'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Office.')
        }
      }
      else {
        this.officeDetailsForm.controls['OfficeCode'].setValue('');
      }
    }
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, OfficeCode: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    for (var i = 0; i < sectionInfo.length; i++) {
      var condition = i == 0 ? sectionInfo[i].sectionA : i == 1 ? sectionInfo[i].sectionB : i == 2 ? sectionInfo[i].sectionC : i == 3 ? sectionInfo[i].sectionD : sectionInfo[i].sectionD;
      switch (condition) {
        case 'Office Code (3 Chars)': i == 0 ? sectionA = OfficeCode : i == 1 ? sectionB = OfficeCode : i == 2 ? sectionC = OfficeCode : i == 3 ? sectionD = OfficeCode : ''; break;
        case 'Running Number (3 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (4 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (5 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (6 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (7 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Office Code (4 Chars)': i == 0 ? sectionA = OfficeCode : i == 1 ? sectionB = OfficeCode : i == 2 ? sectionC = OfficeCode : i == 3 ? sectionD = OfficeCode : ''; break;
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


  uploadDocument(event) {
    if (event) {
      this.documentListInfoResponse.push({
        ID: 0,
        OfficeId: this.officeId,
        DocumentName: event.DocumentName,
        FilePath: event.FilePath,
        CreatedBy: +localStorage.getItem('UserID'),
        CreatedDate: new Date(),
        UpdatedBy: +localStorage.getItem('UserID'),
        UpdatedDate: new Date().toISOString(),
        UploadedBy: +localStorage.getItem('UserID'),
        UploadedOn: new Date().toISOString()

      });
      this.saveOfficeDetails();
    }
  }


  deleteDocument(deleteIndex) {
    const index = this.documentListInfoResponse.findIndex((element) => element.ID == deleteIndex.OfficeId)
    this.documentListInfoResponse.splice(index, 1);
    this.saveOfficeDetails();
  }

  constructDocumentPayload(docList) {
    if (docList) {
      const newDocument = [];
      docList.forEach((item) => {
        const payload = {
          OfficeId: item.ID,
          uploadedOn: item.UploadedOn,
          DocumentName: item.DocumentName,
          FilePath: item.FilePath,
        };
        newDocument.push(payload);
      });
      return newDocument;
    }
  }

  checkPermission(value) {
    debugger
    if (value == 'Basic' && this.isOfficeDetail == true) {
      this.selectedTabName = 'Basic'
    } else if (value == 'email' && this.isEmailids == true) {
      this.selectedTabName = 'email'
    } else if (value == 'Attach' && this.isDocuments == true) {
      this.selectedTabName = 'Attach'
    } else if (value == 'Attach' && this.isReadDocument == true) {
      this.selectedTabName = 'Attach'
    } else {
      Swal.fire('Please Contact Administrator');
    }
  }

}

function panValidator(control: any) {
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
