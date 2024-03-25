import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Status, StatusView } from 'src/app/model/common';
import { DataService } from 'src/app/services/data.service';
import { RegionConfigurationService } from 'src/app/services/financeModule/region-configuration.service';
import { Office } from '../../../../../model/org';
import { Globals } from 'src/app/globals';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-region-configuration',
  templateUrl: './region-configuration.component.html',
  styleUrls: ['./region-configuration.component.css']
})
export class RegionConfigurationComponent implements OnInit {

  ModifiedOn: any;
  CreatedOn: any;
  CreatedBy: any;
  divisionDropdownList: any;
  isUpdate: boolean = false;
  statusValue: Status[] = new StatusView().statusvalues;
  officeDropdownList: any[];
  regionConfigForm: any;
  regionId: Number = 0;
  isUpdateMode: boolean = false;
  regionsSelectedList: any;
  selectedOfficeList: any = [];
  RegionName: string = "";
  officeList: any[];
  isUpdateEnable: boolean = false;
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private regionService: RegionConfigurationService,
    private globals: Globals,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
  ) {

  }

  ngOnInit(): void {
    this.getUnUsedRegionList();
    // this.getOfficeList();
    this.getDivisionList();
    this.createRegionConfigForm();
    this.route.params.subscribe(param => {
      if (param.id) {
        this.regionId = param.id;
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateEnable = true
        this.regionConfigForm.disable();
        this.getRegionInfo();
      }
    })
  }

  createRegionConfigForm() {
    this.regionConfigForm = this.fb.group({
      Id: [0],
      DivisionId: [''],
      RegionName: [''],
      ShortName: [''],
      OfficeId: [''],
      IsActive: ['true'],
    })
  }

  getRegionInfo() {
    var service = `${this.globals.APIURL}/AgingConfiguration/GetRegionsConfig`;
    this.dataService.post(service, {
      Id: this.regionId,
      Region: '',
      Division: '',
      IsActive: 0
    }).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        let info = result.data.Table[0];
        this.selectedOfficeList = [];
        if (info) {
          this.RegionName = info.RegionName;
          this.regionConfigForm.patchValue({
            DivisionId: info.DivisionId,
            RegionName: info.RegionName,
            ShortName: info.ShortName,
            OfficeId: JSON.parse(info.OfficeId),
            IsActive: info.IsActive == true ? 'true' : 'false',
          });
          var table1 = [];
          var table2 = [];
          if (result.data.Table1.length > 0) table1 = result.data.Table1;
          if (result.data.Table2.length > 0) table2 = result.data.Table2;
          this.selectedOfficeList = [...table1, ...table2];
        }
      }
    }, error => {
      console.error(error);
    });
  }

  // async getOfficeList() {
  //   await this.getUnUsedRegionList();
  //   this.regionService.getOfficeList().subscribe((result: any) => {
  //     if (result.message == 'Success') {
  //       this.officeDropdownList = [];
  //       if (this.regionsSelectedList.length > 0 && result.data.Office.length > 0) {
  //         this.officeDropdownList = result.data.Office.filter(element => !this.regionsSelectedList.includes(element.ID));
  //       }
  //       else {
  //         this.officeDropdownList = result.data.Office;
  //       }
  //     }
  //   })
  // }

  getDivisionList() {
    this.regionService.getDivisionList().subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.divisionDropdownList = [];
        this.divisionDropdownList = result.data.Table;
      }
    })
  }

  getOfficeNmeById(officeId) {
    return this.officeDropdownList.find((office) => office.ID == officeId).OfficeName
  }

  save() {
    var validation = "";
    if (this.regionConfigForm.value.DivisionId == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Division</span></br>"
    }
    if (this.regionConfigForm.value.RegionName == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Region Name</span></br>"
    }
    if (this.regionConfigForm.value.ShortName == '') {
      validation += "<span style='color:red;'>*</span> <span>Please enter Short Name</span></br>"
    }
    if (this.regionConfigForm.value.OfficeId == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Office</span></br>"
    }
    // if (this.regionConfigForm.value.IsActive == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Active</span></br>"
    // }

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
        let info = {
          Id: this.regionId,
          DivisionId: this.regionConfigForm.value.DivisionId,
          RegionName: this.regionConfigForm.value.RegionName,
          ShortName: this.regionConfigForm.value.ShortName,
          OfficeId: this.regionConfigForm.value.OfficeId.toString(),
          IsActive: this.regionConfigForm.value.IsActive == "true" ? true : false,
        }
        let payload = { Region: { Table: [info] } }
        let service = `${this.globals.APIURL}/AgingConfiguration/SaveRegionsConfig`;
        this.dataService.post(service, payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.data, '', 'success');
            this.router.navigate(['/views/region/region-view']);
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

  async getUnUsedRegionList() {
    var service = `${this.globals.APIURL}/AgingConfiguration/GetRegionOffice`;
    await this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeDropdownList = [];
      if (result.data.Table.length > 0) {
        this.officeDropdownList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }
  getOfficeList(DivisionId) {
    return new Promise((resolve, rejects) => {
      const payload = { DivisionId };
      this.commonService.getOfficeByDivisionId(payload).subscribe((result: any) => {
        this.officeList = [];
        if (result.message == 'Success') {
          if (result.data && result.data.Table.length > 0) {
            this.officeList.push(...result.data.Table);
            resolve(true);
          }
        }
      }, error => {
        rejects();
      });
    });
  }
}
