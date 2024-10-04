import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { SacService } from 'src/app/services/financeModule/sac.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sac',
  templateUrl: './sac.component.html',
  styleUrls: ['./sac.component.css'],
  providers: [DatePipe]
})
export class SACComponent implements OnInit {

  fg: FormGroup;
  FormMode: String = "A";
  isUpdateEnable: boolean = false;
  isUpdate: boolean = false;
  isCreate: boolean = true;
  statusvalues: Status[] = new StatusView().statusvalues;
  // CreatedBy: string = localStorage.getItem('UserName');
  // ModifiedBy: string = localStorage.getItem('UserName');
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  autoGenerateCodeList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');

  constructor(private router: Router, private route: ActivatedRoute, private ms: MastersService,
    private fb: FormBuilder, private sacService: SacService,
    private dataService: DataService,
    private globals: Globals, private datePipe: DatePipe,
    private autoCodeService: AutoCodeService,
    private commonDataService: CommonService
  ) {
    this.getNumberRange();
    this.route.queryParams.subscribe(params => {
      this.fg = this.fb.group({ SACID: params['id'] });
    });

  }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.isUpdate = param.isCreate;
        this.isCreate = false;
        this.fg.disable();

        let service = `${this.globals.APIURL}/SAC/GetSACId/`;
        this.dataService.post(service, { 'SACID': param.id }).subscribe((result: any) => {
          console.log(result, "{'SACID' : param.id}")
          if (result.data) {
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
    this.router.navigate(['/views/finance/master/SAC/SACview']);
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 583
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2) {
            this.fg.enable();
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

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  createForm() {
    if (this.fg.value.SACID != null) {
      this.FormMode = "B";
      this.sacService.getSACbyId(this.fg.value).pipe().subscribe(data => {
        this.fg.patchValue(data["data"][0]);
        console.log(data, "data")
      });

      this.fg = this.fb.group({
        SACID: 0,
        SACCode: '',
        SACDescription: '',
        IsActive: '',
        Status: '',
      });
    }
    else {
      this.fg = this.fb.group({
        SACID: 0,
        SACCode: '',
        SACDescription: '',
        IsActive: '',
        Status: '',
      }
      );
    }
  }



  onSubmit() {

    var validation = "";

    var SACCode = this.fg.value.SACCode;
    if (SACCode == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter SAC Code </span></br>"
    }
    // else if (SACCode.length != "6") {
    //   validation += "<span style='color:red;'>*</span> <span> SAC code must be in 6 characters </span></br>"
    // }
    else if (SACCode < 0) {
      validation += "<span style='color:red;'>*</span> <span>SAC code should be greater than 0 </span></br>"
    }

    if (this.fg.value.SACDescription == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter Description</span></br>"
    }

    var ddlIsActive = $('#ddlIsActive').val();
    if (ddlIsActive == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Status</span></br>"
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
            let payload : any = {
              SACID: this.fg.value.SACID,
              SACCode: this.fg.value.SACCode,
              SACDescription: this.fg.value.SACDescription,
              IsActive: this.fg.value.IsActive,
              Status: this.fg.value.Status,
            }
            this.sacService.SaveSAC(payload).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.onBack();
                    this.updateAutoGenerated();
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
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'SAC Master');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
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

  autoCodeGeneration(event: any) {
    if (event) {
      let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'SAC Master');
      if (Info.length > 0) {
        let code = this.autoCodeService.numberRange(Info[0], this.fg.value.SACDescription ? this.fg.value.SACDescription : 'SAC Master');
        if (code) this.fg.controls['SACCode'].setValue(code.trim().toUpperCase());
      }
      else {
        Swal.fire('Please create the auto-generation code for SAC Master.')
      }
    }
    else {
      this.fg.controls['SACCode'].setValue('');
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

}
