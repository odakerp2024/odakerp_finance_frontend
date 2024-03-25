import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { Section } from 'src/app/model/financeModule/TDS';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { TDSService } from 'src/app/services/financeModule/tds.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tds',
  templateUrl: './tds.component.html',
  styleUrls: ['./tds.component.css'],
  providers: [DatePipe]
})
export class TDSComponent implements OnInit {

  fg: FormGroup;
  FormMode: String = "A";
  Sectionvalues: Section[] = [];
  isUpdateEnable: boolean = false;
  isUpdate: boolean = false;
  isCreate: boolean = true;
  statusvalues: Status[] = new StatusView().statusvalues;
  dataFormat = "DD-MM-YYYY"


  taxGroupList: any = [];
  // CreatedBy: string = localStorage.getItem('UserName');
  // ModifiedBy: string = localStorage.getItem('UserName');
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  autoGenerateCodeList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");


  constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private ms: MastersService,
    private fb: FormBuilder, private tdsService: TDSService,
    private globals: Globals,
    private dataService: DataService,
    private global: Globals,
    private datePipe: DatePipe,
    private autoCodeService: AutoCodeService,
    private commonDataService: CommonService
  ) {
    this.getNumberRange();
    // this.getTaxGroup();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fg = this.fb.group({ TDSRatesId: params['id'] });
    });
    this.createForm();
    this.OnBindDropdownSection();
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.isUpdate = param.isCreate;
        this.isCreate = false;
        this.fg.disable();
        let service = `${this.global.APIURL}/TDSRates/GetTDSRatesId/`;
        this.dataService.post(service, { 'TDSRatesId': param.id }).subscribe((result: any) => {
          if (result.data) {

           // console.log(result.data, "result.data")
            this.fg.patchValue(result["data"][0]);
            this.fg.get('IsActive').patchValue(result['data'][0]['IsActive'] === true ? 'YES' : 'NO');
            this.CreatedOn = this.datePipe.transform(result['data'][0]['CreatedDate'], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
            this.CreatedBy = localStorage.getItem('UserName')
            this.ModifiedOn = this.datePipe.transform(result['data'][0]['UpdatedDate'], this.datePipe.transform(new Date(), "dd-MM-yyyy"));
            this.ModifiedBy = localStorage.getItem('UserName')
         
          }
        }, error => {
          console.error(error);
        });
      }
    })
  }

  onBack() {
    this.router.navigate(['/views/finance/master/tds/tdsview']);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  OnBindDropdownSection() {
    this.tdsService.getSection(this.fg.value).subscribe(data => {
      this.Sectionvalues = data["data"];
    });
  }

  createForm() {
    if (this.fg.value.TDSRatesId != null) {
      this.FormMode = "B";
      this.tdsService.getTDSbyId(this.fg.value).pipe().subscribe(data => {
        ;
        this.fg.patchValue(data["data"][0]);
      });

      this.fg = this.fb.group({
        TDSRatesId: 0,
        TaxName: '',
        RatePercentage: '',
        sectionID: 0,
        SectionID: 0,
        SectionName: '',
        EffectiveDate: '',
        IsActive: ['true'],
        Status: '',
        Remarks: '',
        RateCode: '',
        CreatedDate: '',
        UpdatedDate: new Date(),
        CreatedBy: '',
        UpdatedBy: ''
      });
    }
    else {
      this.fg = this.fb.group({
        TDSRatesId: 0,
        TaxName: '',
        RatePercentage: '',
        sectionID: 0,
        SectionID: 0,
        SectionName: '',
        EffectiveDate: '',
        IsActive:  ['true'],
        Status: '',
        Remarks: '',
        RateCode: '',
        CreatedDate: new Date(),
        UpdatedDate: new Date(),
        CreatedBy: localStorage.getItem('UserID'),
        UpdatedBy: localStorage.getItem('UserID')
      });
    }
  }



  onSubmit() {
    var validation = "";

    if (this.fg.value.TaxName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Tax Name </span></br>"
    }

    // if (this.fg.value.RateCode == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please enter RateCode </span></br>"
    // }
    
    if(this.fg.value.SectionID == ""){
      validation += "<span style='color:red;'>*</span> <span>Please Enter Section </span></br>"
    }
    if (this.fg.value.RatePercentage == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Rate(%)</span></br>"
    }

    var ddlSection = $('#ddlSection').val();
    if (ddlSection == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Section</span></br>"
    }

    if (this.fg.value.EffectiveDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Select Effective Date</span></br>"
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
            // this.fg.value.IsActive = $('#ddlIsActive').val();

            let payload: any = {
              TDSRatesId: this.fg.value.TDSRatesId,
              TaxName: this.fg.value.TaxName,
              RatePercentage: this.fg.value.RatePercentage,
              SectionID: Number(this.fg.value.SectionID),
              EffectiveDate: this.fg.value.EffectiveDate,
              IsActive: this.fg.value.IsActive,
              Remarks: this.fg.value.Remarks,
              RateCode: this.fg.value.RateCode,
              CreatedDate: this.fg.value.CreatedDate,
              UpdatedDate: this.fg.value.UpdatedDate,
              CreatedBy: this.fg.value.CreatedBy,
              UpdatedBy: this.fg.value.UpdatedBy
            }

            this.tdsService.SaveTDS(payload).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.onBack();
                    if (!this.isUpdate) { this.updateAutoGenerated(); }
                  }
                })
              }
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
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'TDS');
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

  decimalFilter(event: any) {
    //const reg = /^-?\d*(\.\d{0,2})?$/;
    const reg = /^\d{0,3}$|(?=^.{0,6}$)^\d+\.\d{0,2}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  // getTaxGroup() {
  //   let service = `${this.global.APIURL}/TaxType/GetTaxTypeList`
  //   this.dataService.post(service, {}).subscribe((result: any) => {
  //     if (result.data.Table) {
  //       this.taxGroupList = result.data.Table;
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }

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
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'TDS');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.fg.controls['RateCode'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for TDS Tax.');
        }
      }
      else {
        this.fg.controls['RateCode'].setValue('');
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

}
