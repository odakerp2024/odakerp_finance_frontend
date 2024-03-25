import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-info',
  templateUrl: './template-info.component.html',
  styleUrls: ['./template-info.component.css'],
  providers: [DatePipe]
})
export class TemplateInfoComponent implements OnInit {

  statusvalues: Status[] = new StatusView().statusvalues;
  templateCreateForm: FormGroup;
  templateCategoryList: any = [];
  templateFileTypeList: any = [];
  isUpdate: boolean = false;
  autoGenerateCodeList: any[];
  templateId: any = 0;
  isEditMode: boolean = false;
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  selectFileName: string = 'No file selected.';
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  fileAcceptType: string = '';

  constructor(
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private autoCodeService: AutoCodeService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private commonDataService: CommonService,
    private global: Globals
  ) { }

  ngOnInit(): void {
    this.getNumberRange();
    this.getTemplateFileType();
    this.getTemplateCategory();
    this.createTemplateForm();

    this.route.params.subscribe(param => {
      if (param.id) {
        this.templateId = param.id;
        this.isUpdate = true;
        this.isEditMode = true;
        this.getByTemplateInfo();
        this.templateCreateForm.disable();
      }
    });
  }

  createTemplateForm() {
    this.templateCreateForm = this.fb.group({
      Id: [this.templateId],
      TemplateNo: [''],
      TemplateName: [''],
      CategoryId: [''],
      FileTypeId: [''],
      FileUrl: [''],
      Remarks: [''],
      CreatedDate: [new Date()],
      UpdatedDate: [new Date()],
      CreatedBy: localStorage.getItem('UserID'),
      UpdatedBy: localStorage.getItem('UserID'),
      Active: [1]
    });
  }

  getByTemplateInfo() {
    var service = `${this.globals.APIURL}/Template/GetTemplatesList`;
    this.dataService.post(service, { Id: this.templateId, TemplateNo: "", TemplateName: "", CategoryId: "", Active: 0 }).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        let info = result.data.Table[0];
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat);
        this.ModifiedOn = this.datePipe.transform(info.UpdatedBy, this.entityDateFormat);
        this.getUpdatedByRecord([info.CreatedBy, info.UpdatedBy]);
        this.templateCreateForm.patchValue({
          Id: this.templateId,
          TemplateNo: info.TemplateNumber,
          TemplateName: info.TemplateName,
          CategoryId: info.CategoryId,
          FileTypeId: info.FileTypeId,
          FileUrl: info.FileUrl,
          Remarks: info.Remarks,
          CreatedDate: info.CreatedDate,
          UpdatedDate: new Date(),
          CreatedBy: info.CreatedBy,
          UpdatedBy: localStorage.getItem('UserID'),
          Active: info.Active == true ? 1 : 0
        });
      }
    }, error => {
      console.error(error);
    });
  }

  onFileSelected(event) {
    console.log(event)
  }

  getTemplateCategory() {
    var service = `${this.globals.APIURL}/Template/GETTemplateCategoryType`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.templateCategoryList = [];
      if (result.data.Table.length > 0) {
        this.templateCategoryList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  getTemplateFileType() {
    var service = `${this.globals.APIURL}/Template/TemplateFileType`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.templateFileTypeList = [];
      if (result.data.Table.length > 0) {
        this.templateFileTypeList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any) {
    if (!this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Templates');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.templateCreateForm.controls['TemplateNo'].setValue(code.trim().toUpperCase());
        }
        else { Swal.fire('Please create the auto-generation code for Templates.') }
      }
      else { this.templateCreateForm.controls['TemplateNo'].setValue(''); }
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

  getNumberRange() {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
    this.dataService.post(service, { Id: 0, ObjectId: 0 }).subscribe((result: any) => {
      if (result.message = "Success") {
        this.autoGenerateCodeList = [];
        if (result.data.Table.length > 0) {
          this.autoGenerateCodeList = result.data.Table
        }
      }
    }, error => {
      console.error(error);
    });
  }

  saveTemplate() {
    var validation = "";
    if (this.templateCreateForm.value.TemplateNo == '') {
      validation += "<span style='color:red;'>*</span> <span>Please generate Template Number</span></br>"
    }
    if (this.templateCreateForm.value.TemplateName == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Template Name</span></br>"
    }
    if (this.templateCreateForm.value.CategoryId == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Category</span></br>"
    }
    if (this.templateCreateForm.value.FileTypeId == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select File Type</span></br>"
    }
    if (this.templateCreateForm.value.AccountMappingIds == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select Mapping</span></br>"
    }
    if (this.templateCreateForm.value.FileUrl == "") {
      validation += "<span style='color:red;'>*</span> <span>Please upload File</span></br>"
    }

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
    }).then((result) => {
      if (result.isConfirmed) {
        let payload = { template: { Table: [this.templateCreateForm.value] } }
        let service = `${this.globals.APIURL}/Template/SaveTemplatesInfo`;
        this.dataService.post(service, payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
            if (!this.isUpdate) { this.updateAutoGenerated(); }
            this.router.navigate(['/views/template/template-view']);
          }
          else {
            Swal.fire(result.message, '', 'error');
          }
        }, error => {
          console.error(error);
        });
      } else { }
    });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Templates');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  goBack() {
    this.router.navigate(['/views/template/template-view']);
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

  fileSelected(event) {
    this.templateCreateForm.controls['FileUrl'].setValue('');
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      if (file.type !== this.fileAcceptType) {
        // Invalid file type
        Swal.fire('Invalid file type. Selected file type must be allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // File size exceeds 1MB
        Swal.fire('File size exceeds the limit of 5MB.');
        return;
      }

      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this.http.post(`${this.global.APIURL}/Common/UploadFiles`, formData, { headers: headers })
        .subscribe(
          (response) => {
            if (response['message'] = "Success") {
              this.templateCreateForm.controls['FileUrl'].setValue(response['data']);
              Swal.fire('File uploaded successfully.');
            }
            else { this.templateCreateForm.controls['FileUrl'].setValue(''); }
          },
          (error) => {
            Swal.fire('Error uploading file.');
          }
        );
    }
  }

  fileTypeSelected(event) {
    let data = this.templateFileTypeList.find(x => x.Id == event);
    if (data.FileTypeName == "TXT") { this.fileAcceptType = "text/plain" }
    else if (data.FileTypeName == "EXCEL") { this.fileAcceptType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    else if (data.FileTypeName == "CSV") { this.fileAcceptType = ".csv" }
    else if (data.FileTypeName == "EDI") { this.fileAcceptType = ".edi" }
    this.templateCreateForm.controls['FileUrl'].setValue('');
  }

  onChange(event) {
    if (this.isUpdate) {
      if (event == 0) {
        Swal.fire(
          'If you deactivate the template, it will be removed from your banking statement. Make sure you want to change the status to "NO".');
      }
    }
  }

}
