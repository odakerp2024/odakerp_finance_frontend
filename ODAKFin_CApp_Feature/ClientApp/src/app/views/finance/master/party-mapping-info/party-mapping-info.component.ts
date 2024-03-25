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
import { CustomerService } from 'src/app/services/financeModule/customer.service';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-party-mapping-info',
  templateUrl: './party-mapping-info.component.html',
  styleUrls: ['./party-mapping-info.component.css']
})
export class PartyMappingInfoComponent implements OnInit {


  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  partyCreateForm: FormGroup;
  customerList: any = [];
  vendorsList: any;
  mergeList: any = [];
  mergeType: any;
  isVendor: boolean = false;
  isUpdate: boolean = false;
  currentId: number = 0;
  vendorInformation: any = {};
  customerInformation: any = {};
  isUpdateMode: boolean = false;
  statusvalues: Status[] = new StatusView().statusvalues;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  mergeTypes: string = 'Merge';
  autoGenerateCodeList: any = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private globals: Globals,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private commonDataService: CommonService,
    private autoCodeService: AutoCodeService
  ) {
    this.getMergeType();
    this.CustomerList();
    this.vendorList();
  }

  ngOnInit(): void {
    this.getNumberRange();
    this.partyMappingForm();
    this.route.params.subscribe(param => {
      if (param.id) {
        this.currentId = param.id
        this.isUpdate = true;
        this.partyCreateForm.disable();
        this.isUpdateMode = true;
        this.getPartyById();
      }
    });
  }

  partyMappingForm() {
    this.partyCreateForm = this.fb.group({
      PartyMappingId: [this.currentId],
      MergeTypeId: [''],
      ReferenceNumber: [''],
      Status: [true],
      FirstParty: [''],
      SecondParty: [''],
      CreatedBy: localStorage.getItem('UserID'),
      CreatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-dd'),
      UpdatedBy: localStorage.getItem('UserID'),
      UpdatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-dd')
    });
    this.partyCreateForm.get('FirstParty').disable();
    this.partyCreateForm.get('SecondParty').disable();

  }

  async CustomerList() {
    let payload = {
      CustomerCode: '', CustomerName: '', Category: '', BranchCode: '', CityName: '', GSTCategory: '', GSTNumber: '', IsActive: true, CompanyStatus: '', OnBoard: ''
    }
    await this.customerService.getCustomerList(payload).subscribe(data => {
      this.customerList = [];
      if (data['data'].Table.length > 0) {
        for (let info of data['data'].Table) {
          if (info.OnboradName == "CONFIRMED" && info.Status == "Active" ) {
            this.customerList.push(info);
          }
        }
      }
    },
      (error: HttpErrorResponse) => { Swal.fire(error.message, 'error') });
  }

  async vendorList() {
    let payload = {
      ID: 0, VendorName: '', Category: '', BranchCode: '', GSTCategory: '', GSTNumber: '', IsActive: true, Status: '', VendorCode: '', CityName: ''
    }
    await this.vendorService.getVendorList(payload).subscribe(data => {
      this.vendorsList = [];
      if (data["data"].Table.length > 0) {
        for (let info of data["data"].Table) {
          if (info.OnboradName == "CONFIRMED" && info.Status == "Active" ) {
            this.vendorsList.push(info);
          }
        }
      }
    },
      (error: HttpErrorResponse) => { Swal.fire(error.message, 'error') });
  }

  async getMergeType() {
    var service = `${this.globals.APIURL}/PartyMapping/GetPartyMergeTypes`;
    await this.dataService.post(service, {}).subscribe((result: any) => {
      this.mergeList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.mergeList = result.data.Table;
      }
    }, error => { });
  }

  partyMergeChanges(id: number) {
      this.partyCreateForm.controls['FirstParty'].enable();
      this.partyCreateForm.controls['SecondParty'].enable();
    if (id) {
      this.partyCreateForm.controls['FirstParty'].setValue("");
      this.partyCreateForm.controls['SecondParty'].setValue("");
      this.vendorInformation = {};
      this.customerInformation = {};
      let info = this.mergeList.find(x => x.PartyMappingTypeId == id);
      if (info.Name.trim() == "Vendor") { this.isVendor = true; return this.isVendor; }
      else { this.isVendor = false; return this.isVendor; }
    }
  }

  savePartyMapping(mergeType?: string) {
    var validation = "";
    if (this.partyCreateForm.value.MergeTypeId == "" || this.partyCreateForm.value.MergeTypeId == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Merge type</span></br>"
    }
    if (this.partyCreateForm.value.ReferenceNumber == "" || this.partyCreateForm.value.ReferenceNumber == null) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Reference Number</span></br>"
    }
    // if (this.partyCreateForm.value.Status == "" || this.partyCreateForm.value.Status == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Active</span></br>"
    // }
    if (this.partyCreateForm.value.FirstParty == "" || this.partyCreateForm.value.FirstParty == null || this.partyCreateForm.value.SecondParty == "" || this.partyCreateForm.value.SecondParty == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Party Name</span></br>"
    }
    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    if (mergeType == "Unmerge") { this.partyCreateForm.controls['Status'].setValue(false); }
    else if (mergeType == "Merge") { this.partyCreateForm.controls['Status'].setValue(true); }

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
        var service = `${this.globals.APIURL}/PartyMapping/SavePartyMapping`;
        let payload = { PartyMapping: { Table: [this.partyCreateForm.value] } }
        this.dataService.post(service, payload).subscribe((result: any) => {
          if (result.message === 'Success') {
            if (result.data === 'Reference Number Already exists') {
              Swal.fire(result.data, '', 'error');
            } else {
              Swal.fire(result.data, '', 'success');
              if (!this.isUpdate) { this.updateAutoGenerated(); }

              this.router.navigate(['/views/party-mapping/party-mapping-view']);
            }
          }
        }, error => {
          console.error(error);
        });
      } else {
      }
    });
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Party Mapping');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }


  async getPartyById() {
    var service = `${this.globals.APIURL}/PartyMapping/GEtPartyMapping`;
    this.dataService.post(service, { Id: Number(this.currentId), ReferenceNumber: '', PartyName: '', Status: null }).subscribe(async (result: any) => {
      if (result.message == "Success" && result.data.Table.length > 0) {
        let partyInfo = result.data.Table[0];
        this.ModifiedOn = this.datePipe.transform(partyInfo.CreatedDate, this.entityDateFormat);
        this.CreatedOn = this.datePipe.transform(partyInfo.UpdatedDate, this.entityDateFormat);
        this.getUpdatedByRecord([partyInfo.CreatedBy, partyInfo.UpdatedBy])

        if (partyInfo.Status == true) {
          this.mergeTypes = 'Merge'
        }
        else {
          this.mergeTypes = 'UnMerge'
        }

        this.partyCreateForm.patchValue({
          PartyMappingId: this.currentId,
          MergeTypeId: partyInfo.MergeTypeId,
          ReferenceNumber: partyInfo.ReferenceNumber,
          Status: partyInfo.Status,
          FirstParty: partyInfo.FirstParty,
          SecondParty: partyInfo.SecondParty,
          CreatedBy: partyInfo.CreatedBy,
          CreatedDate: this.datePipe.transform(partyInfo.CreatedDate, 'YYYY-MM-dd'),
          UpdatedBy: localStorage.getItem('UserID'),
          UpdatedDate: this.datePipe.transform(new Date(), 'YYYY-MM-dd')
        });

        if (partyInfo.MergeTypeId == 1) var isVendor = true
        else var isVendor = false

        if (isVendor) {
          this.isVendor = true;
          await this.partyChanges1(partyInfo.VendorName, partyInfo.VendorPANNo, partyInfo.VendorGST, true);
          await this.partyChanges1(partyInfo.CustomerName, partyInfo.CustomerPANNo, partyInfo.CustomerGST, false);
        }
        if (!isVendor) {
          this.isVendor = false;
          await this.partyChanges1(partyInfo.CustomerName, partyInfo.CustomerPANNo, partyInfo.CustomerGST, false);
          await this.partyChanges1(partyInfo.VendorName, partyInfo.VendorPANNo, partyInfo.VendorGST, true);
        }
      }
    }, error => { });
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

  async partyChanges1(Name, PANNo, GST, isVendor) {
    if (isVendor) { this.vendorInformation = { name: Name, GSt: GST ? GST : '', PAN: PANNo ? PANNo : '' } }
    else {
      this.customerInformation = { name: Name, GSt: GST ? GST : '', PAN: PANNo ? PANNo : '' }
    }
  }

  async partyChanges(event, isVendor) {
    if (isVendor) {
      let vendorInfo = this.vendorsList.find(x => x.VendorID == event);
      this.vendorInformation = { name: vendorInfo.VendorName, GSt: vendorInfo.GSTNumber ? vendorInfo.GSTNumber : '', PAN: vendorInfo.PANNo ? vendorInfo.PANNo : '' }
    }
    else {
      let customerInfo = this.customerList.find(x => x.CustomerID == event);
      this.customerInformation = { name: customerInfo ? customerInfo.CustomerName : '', GSt: customerInfo ? customerInfo.GSTNumber : '', PAN: customerInfo ? customerInfo.PANNo : '' }
    }
  }

  partyListRoute() {
    this.router.navigate(['views/party-mapping/party-mapping-view']);
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
          this.autoGenerateCodeList = result.data.Table;
          this.autoCodeGeneration('party');
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any) {
    if (!this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Party Mapping');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.partyCreateForm.controls['ReferenceNumber'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Party Mapping.')
        }
      }
      else {
        this.partyCreateForm.controls['ReferenceNumber'].setValue('');
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
