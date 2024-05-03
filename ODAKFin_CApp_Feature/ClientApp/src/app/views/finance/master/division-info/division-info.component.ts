import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-division-info',
  templateUrl: './division-info.component.html',
  styleUrls: ['./division-info.component.css'],
  providers: [DatePipe]
})

export class DivisionInfoComponent implements OnInit {

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';

  selectedTabName: string = 'Basic';
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  divisionForm: FormGroup;
  payload: { Division: { Table: any[]; Table1: any[]; }; };
  isCreate: boolean = true;
  isUpdate: boolean = false;
  isDivision: boolean = false;
  isEmail: boolean = false;
  divisionId: number = 0;
  isUpdateEnable: boolean = false;
  emailData: any;
  statusvalues: Status[] = new StatusView().statusvalues;
  autoGenerateCodeList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(this.entityDateFormat);
  isBasicDetailsFilled: boolean = false

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private route: ActivatedRoute,
    private autoCodeService: AutoCodeService,
    private commonDataService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.getNumberRange();
    this.cerateDivisionForm();
    this.route.params.subscribe((param) => {
      debugger
      if (param.id != 0) {
        this.isUpdate = param.isCreate;
        this.divisionId = param.id;
        this.isCreate = false;
        this.divisionForm.disable();
        this.divisionGetById(this.divisionId);
      }
      this.isDivision = param.isDivision == 'true' ? true : false;
      this.isEmail = param.isEmail == 'true' ? true : false;

      if (this.isDivision == true) {
        this.selectedTabName = 'Basic'
      } else {
        this.selectedTabName = 'email'

      }

    });
    this.divisionForm.valueChanges.subscribe(() => {
      this.checkBasicDetailsFilled();
    });
  }

  EditValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 540,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.divisionForm.enable();
            this.isUpdateEnable = true
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

  cerateDivisionForm() {
    this.divisionForm = this.fb.group({
      Id: [0],
      OrgId: [1],
      DivisionCode: [''],
      DividionName: [''],
      ShortName: [''],
      Application: [''],
      Active: [''],
      createdDate: [new Date()],
      ModifiedDate: [new Date()],
      CreatedBy: [Number(localStorage.getItem('UserID'))],
      Updatedby: [Number(localStorage.getItem('UserID'))]
    });
  }

  divisionListRoute() {
    this.router.navigate(['views/division/division-view']);
  }


  saveDivision() {
    var validation = "";
    // if (this.divisionForm.value.DivisionCode == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Division Code </span></br>"
    // }
    if (!this.divisionForm.value.DividionName) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Division Name </span></br>"
    }
    if (this.divisionForm.value.Application === "" || this.divisionForm.value.Application == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Application (if any)</span></br>"
    }
    if (this.divisionForm.value.DivisionName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Division Name</span></br>"
    }
    if (this.divisionForm.value.Active === "" || this.divisionForm.value.Active == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Status</span></br>"
    }
    if (this.divisionForm.value.ShortName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter ShortName</span></br>"
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    this.customPayload(this.emailData);
    this.divisionCreateAPI();
  }

  emailUpdate(emailTableData?) {
    this.customPayload(emailTableData);
    this.divisionCreateAPI();
  }

  divisionCreateAPI() {
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
        let service = `${this.globals.APIURL}/Division/SaveOrganizationDivision`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
            if (!this.isUpdate) { this.updateAutoGenerated(); }
          }
          this.router.navigate(['/views/division/division-view']);
        }, error => {
          console.error(error);
        });
      } else {

      }
    });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Division');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  customPayload(getOfficeList = []) {
    const emailForm = [];
    getOfficeList.forEach(element => {
      const newData = {
        'ID': element.ID,
        'DivisionId': this.divisionId,
        'Category': element.Category,
        'EmailId': element.EmailId,
        'StartDate': element.StartDate,
        'EndDate': element.EndDate,
        'CreatedDate': element.CreatedDate,
        'Updateddate': element.ModifiedDate,
        'CreatedBy': element.CreatedBy,
        'UpdatedBy': element.UpdatedBy,
      };
      emailForm.push(newData);
    });

    this.payload = {
      Division: {
        Table: [this.divisionForm.value],
        Table1: emailForm
      }
    };
  }

  divisionGetById(id: number) {
    let service = `${this.globals.APIURL}/Division/GetOrganizationDivisionId`;
    this.dataService.post(service, { Id: id }).subscribe((result: any) => {
      if (result.message == 'Success') {
        let info = result?.data.Table[0];
        // this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat);
        // this.ModifiedOn = this.datePipe.transform(info.ModifiedDate, this.entityDateFormat);
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat1);
        this.ModifiedOn = this.datePipe.transform(info.ModifiedDate, this.entityDateFormat1);
        this.getUpdatedByRecord([info.CreatedBy, info.UpdatedBy]);
        this.divisionForm.patchValue({
          Id: info.Id,
          OrgId: info.OrgId,
          DivisionCode: info.DivisionCode,
          DividionName: info.DivisionName,
          ShortName: info.ShortName,
          Application: info.Application,
          Active: info.Active == true ? 'true' : 'false',
          createdDate: this.datePipe.transform(info.createdDate, 'y-MM-dd'),
          ModifiedDate: this.datePipe.transform(info.ModifiedDate, 'y-MM-dd'),
          CreatedBy: info.CreatedBy,
          Updatedby: info.CreatedBy
        });

        for (let i = 0; i < result.data.Table1.length; i++) {
          result.data.Table1[i].StartDate = this.datePipe.transform(result.data.Table1[i].StartDate, 'y-MM-dd');
          result.data.Table1[i].EndDate = this.datePipe.transform(result.data.Table1[i].EndDate, 'y-MM-dd')
        }

        const emailData = [];
        // *  construct data for the emil table component
        result.data.Table1.forEach((editRow) => {
          const payload = {
            ID: editRow.ID,
            OrgId: this.divisionId,
            Category: editRow.Category,
            EmailId: editRow.EmailId,
            StartDate: editRow.StartDate,
            EndDate: editRow.EndDate,
            CreatedBy: editRow.CreatedBy,
            UpdatedBy: localStorage.getItem('UserID'),
            CreatedDate: editRow.CreatedDate,
            ModifiedDate: this.datePipe.transform(new Date(), 'y-MM-dd'),
          };
          emailData.push(payload);
        });
        this.emailData = emailData;

      }
    }, error => {
      console.error(error);
    });

  }

  deleteRecord(event: any) {
    if (event.length > 0) {
      for (let data of event) {
        var service = `${this.globals.APIURL}/Division/DivisionEmailDelete`;
        this.dataService.post(service, { Id: data.ID }).subscribe((result: any) => {
        }, error => { });
      }
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
        var Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Division');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.divisionForm.controls['DivisionCode'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Division.')
        }
      }
      else {
        this.divisionForm.controls['DivisionCode'].setValue('');
      }
    }
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, divisionCode: string) {
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
        case 'Division Code (4 Chars)': i == 0 ? sectionA = divisionCode : i == 1 ? sectionB = divisionCode : i == 2 ? sectionC = divisionCode : i == 3 ? sectionD = divisionCode : ''; break;
        case 'Division Code (3 Chars)': i == 0 ? sectionA = divisionCode : i == 1 ? sectionB = divisionCode : i == 2 ? sectionC = divisionCode : i == 3 ? sectionD = divisionCode : ''; break;
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
  checkBasicDetailsFilled() {
    if (this.divisionForm.value.DivisionCode == "" || this.divisionForm.value.DividionName == "" || this.divisionForm.value.Application === "" || this.divisionForm.value.Application == null || this.divisionForm.value.Active === "" || this.divisionForm.value.Active == null || this.divisionForm.value.ShortName == "") {
      this.isBasicDetailsFilled = false;
    } else {
      this.isBasicDetailsFilled = true;
    }
  }

  checkPermission(value){
    if(value == 'Basic' &&  this.isDivision == true){
      this.selectedTabName = 'Basic'
    } else if(value == 'Basic' &&  this.isDivision == false){
      Swal.fire('Please Contact Administrator');
    }else if(value == 'email' &&  this.isEmail == true){
      this.selectedTabName = 'email'
    } else if(value == 'email' &&  this.isEmail == false){
      Swal.fire('Please Contact Administrator');
    }
  }

}
