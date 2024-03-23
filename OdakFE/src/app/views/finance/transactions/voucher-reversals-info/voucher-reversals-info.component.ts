import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher-reversals-info',
  templateUrl: './voucher-reversals-info.component.html',
  styleUrls: ['./voucher-reversals-info.component.css'],
  providers: [DatePipe]

})
export class VoucherReversalsInfoComponent implements OnInit {

  isUpdate: boolean = false;
  isUpdateMode: boolean = false;
  isUpdateMode1: boolean = false;
  FileList: any = [];
  voucherCreateForm: FormGroup;
  VoucherReversalsId: any = 0;
  autoGenerateCodeList: any = [];
  dropDownListVoucherList: any = [];
  dropDownListStatus: any = [];
  payload: {};
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  voucherList: any = [];
  pager: any = {};
  pagedItems: any[];
  voucherTableDetails: any = [];
  isFinalRecord: boolean = false;
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  isEditMode = true;

  constructor(
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private ps: PaginationService,
    public commonDataService: CommonService,
    private autoCodeService: AutoCodeService
  ) { }

  ngOnInit(): void {
    this.createVoucherReversalFormCreate();
    this.getNumberRange();
    this.getDropDownValue();

    this.route.params.subscribe(res => {
      if (res.id) {
        this.isEditMode = false
        this.VoucherReversalsId = res.id;
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateMode1 = false;
        this.getVoucherInfo();
        this.voucherCreateForm.disable();
      }
    })
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 509,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.voucherCreateForm.enable();
            this.isUpdateMode =false;
            this.isUpdateMode1 =true;
            this.enableEdit();
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

  createVoucherReversalFormCreate() {
    this.voucherCreateForm = this.fb.group({
      VoucherReversalsId: [this.VoucherReversalsId],
      ReversalReference: [''],
      DateOfReversal: [this.datePipe.transform(new Date(), 'y-MM-dd')],
      StatusId: [1],
      VoucherTypeId: [0],
      VoucherNumber: [''],
      VoucherId: [0],
      Remarks: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      IsDelete: [0]
    });
  }

  getVoucherInfo() {
    var service = `${this.globals.APIURL}/VoucherReversals/GetVoucherReversalsById`;
    this.dataService.post(service, { Id: this.VoucherReversalsId }).subscribe(async (result: any) => {
      this.voucherTableDetails = [];
      this.FileList = [];
      if (result.message == "Success" && result['data'].Table.length > 0) {
        let info = result.data.Table[0];
        this.ModifiedOn = info.UpdatedDate;
        this.ModifiedBy = info.UpdatedByName;
        this.CreatedOn = info.CreatedDate;
        this.CreatedBy = info.CreatedByName;
        await this.voucherTypeChangeEvent(info.VoucherTypeId, info.VoucherNumber);
        if (info.StatusId == 2) this.isFinalRecord = true;
        this.voucherCreateForm.patchValue({
          VoucherReversalsId: this.VoucherReversalsId,
          ReversalReference: info.ReversalReference,
          DateOfReversal: this.datePipe.transform(info.DateOfReversal, 'y-MM-dd'),
          StatusId: info.StatusId,
          VoucherTypeId: info.VoucherTypeId,
          Remarks: info.Remarks,
          CreatedBy: info.CreatedBy,
          VoucherNumber: info.VoucherNumber,
          IsDelete: info.IsDelete ? info.IsDelete : 0,
        });
        if (result['data'].Table1.length > 0) {
          for (let data of result['data'].Table1) {
            this.voucherTableDetails.push({
              Id: data.Id,
              ReferenceNo: data.VRNumber,
              VoucherDate: data.VRDate,
              AccountOrParty: data.AccountOrParty,
              Amount: data.Amount,
            })
          }
          this.setPage(1);
        }
        if (result['data'].Table2.length > 0) this.FileList = result['data'].Table2;
      }
    }, error => { });
  }

  fileSelected(event) {
    if (event.target.files.length > 0 && this.FileList.length < 5) {
      this.FileList.push({
        Id: 0,
        VoucherReversalsId: this.VoucherReversalsId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name
      });
    }
    else {
      Swal.fire('A maximum of five files must be allowed.')
    }
  }

  OnClickDeleteValueFile(index: number) {
    this.FileList.splice(index, 1);
  }

  getDropDownValue() {
    var service = `${this.globals.APIURL}/VoucherReversals/GetVoucherReversalsDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.dropDownListStatus = [];
      this.dropDownListVoucherList = [];
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.dropDownListStatus = result.data.Table;
        this.dropDownListVoucherList = result.data.Table1;
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
          this.autoGenerateCodeList = result.data.Table;
          // this.autoCodeGeneration('voucher');
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any) {
    if (this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Voucher Reversals');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.voucherCreateForm.controls['ReversalReference'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please Create The Auto-Generation Code For Voucher Reversal.');
        }
      }
      else {
        this.voucherCreateForm.controls['ReversalReference'].setValue('');
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

  async saveInfo(status : Number, isDelete = false) {
    var validation = "";
    // if (this.voucherCreateForm.value.ReversalReference == "" || this.voucherCreateForm.value.ReversalReference == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please generate Reversal Reference.</span></br>"
    // }
    if ( this.voucherCreateForm.value.VoucherTypeId == "" || this.voucherCreateForm.value.VoucherTypeId == 0 ) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Voucher Type.</span></br>"
    }
    if (this.voucherCreateForm.value.VoucherNumber == "" || this.voucherCreateForm.value.VoucherNumber == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Voucher #.</span></br>"
    }
    if(status && !this.isFinalRecord){
      await this.autoCodeGeneration('voucher')
    }
    
    if (validation != "") {
      if(status != 3){
      Swal.fire(validation)
      return false;
      }
    }

    let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit`;
    let deleteMsg = `Do you want to Delete this Details?`;


    let combinedText: string;

    if (status === 1) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else if (status === 2) {
      combinedText = finalMsg;
    } else {
      combinedText = closeMsg;
    }

    // when canceled and finaled already navigate to list page
    if (status == 3 && this.isFinalRecord) {
      this.router.navigate(['/views/voucher/voucher-reversals']);
      return;
    }

    // set Delete flag
    if(isDelete && this.isUpdate){
      this.voucherCreateForm.controls['IsDelete'].setValue(1);
    }
   

    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      html: combinedText,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {

         // generate the autogenerate code when finaled
        if(this.isUpdate && status == 2){
          this.autoCodeGeneration('voucher');
        }
       

        // when canceled navigate to list page
        if(status == 3 ){
          this.router.navigate(['/views/voucher/voucher-reversals']);
          return;
        }

        await this.createPayload(status);

        let service = `${this.globals.APIURL}/VoucherReversals/SaveVoucherReversalsInfo`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {

            Swal.fire(result.data.Message, '', 'success');
            this.isUpdateMode = true;
            this.isUpdateMode1 = true;
            if (status == 1) {
            
             this.VoucherReversalsId = Number(result.data.Id);
              this.isUpdateMode = true;
              this.isUpdateMode1 = true;            
             
            }
            // update the current number in auto generate code if in update and final state
            
            if (this.isUpdate && status  && !this.isFinalRecord) { 
              this.updateAutoGenerated(); 
            }
            // if deleted navigate to list
            if(isDelete && this.isUpdate){
              this.router.navigate(['/views/voucher/voucher-reversals']);
            }
           if (!this.isUpdate && !this.isFinalRecord) {
            const VoucherReversalsId = result.data.Id;
            this.editView(VoucherReversalsId)
          }
        }
          // if finaled navigate to list page
          if (status == 2) {
            this.router.navigate(['/views/voucher/voucher-reversals']);
            return;
          }  


        }, error => {
          console.error(error);
        });
      }
    });
  }

  editView(id: Number){
    this.router.navigate(['views/voucher-info/voucher-reversals-info', { id: id, isUpdate: true }])
  }

  enableEdit(){
    this.isEditMode = true;
  }


  createPayload(status) {
    let Table1 = [];
    for (let data of this.voucherTableDetails) {
      Table1.push({
        Id: data.Id ? data.Id : 0,
         VoucherReversalsId: this.VoucherReversalsId,
        VRNumber: data.ReferenceNo ? data.ReferenceNo : data.VoucherNo ,
         VRDate: data.VoucherDate,
        AccountOrParty: data.AccountOrParty,
         Amount: data.Amount
      })
    }
    this.voucherCreateForm.controls['VoucherId'].setValue(Number(this.voucherCreateForm.value.VoucherNumber));
    this.voucherCreateForm.controls['DateOfReversal'].setValue(new Date(this.voucherCreateForm.value.DateOfReversal));
    this.voucherCreateForm.controls['StatusId'].setValue(status);
    
    let info = this.voucherCreateForm.value;

    let voucherTypeId = this.voucherList.find(x => x.VoucherNo == info.VoucherNumber);
  
    let table = {
      VoucherReversalsId: this.VoucherReversalsId ? this.VoucherReversalsId : info.VoucherReversalsId,
      ReversalReference: info.ReversalReference,
      DateOfReversal: info.DateOfReversal,
      StatusId: status,
      VoucherTypeId: Number(info.VoucherTypeId),
      VoucherNumber: info.VoucherNumber,
      VoucherId: Number(voucherTypeId.VoucherId ? voucherTypeId.VoucherId : 0),
      Remarks: info.Remarks,
      CreatedBy: info.CreatedBy,
      IsDelete: info.IsDelete, 
    }

    this.payload = {
      "VoucherReversals": {
        "Table": [table],
        "Table 1": Table1,
        "Table 2": this.FileList
      }
    }
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Voucher Reversals');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  async voucherTypeChangeEvent(event, VoucherNumber?: any) {
    if (event) {
      
      this.pagedItems = [];
      var service = `${this.globals.APIURL}/VoucherReversals/GetVouchersByVoucherType`;
      await this.dataService.post(service, { VoucherType: event }).subscribe((result: any) => {
        this.voucherList = [];
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.voucherList = result.data.Table;
        }
      }, error => { });
    }
  }

  voucherChangeEvent(event) {
    if (event) {
      this.voucherTableDetails = [];
      this.pagedItems = [];
      let voucherDetailsInfo = this.voucherList;
      let info = voucherDetailsInfo.filter(x => x.VoucherNo == event);
      if (info) {
        this.voucherTableDetails = info;
        this.setPage(1);
      }
    }
  }

  setPage(page: number) {
    this.pager = this.ps.getPager(this.voucherTableDetails.length, page);
    this.pagedItems = this.voucherTableDetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
