import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { BasicchargesDetails, Charges, chargesDetails, ChargesList, chargesModel, DynamicGridColumn, DynamicOtherDivisionColumn, linkOtherDivisionDetails } from 'src/app/model/financeModule/ChargeCode';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChargecodeService } from 'src/app/services/financeModule/chargecode.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chargecode',
  templateUrl: './chargecode.component.html',
  styleUrls: ['./chargecode.component.css'],
  providers: [DatePipe]
})
export class ChargecodeComponent implements OnInit {

  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  selectedTabName: string = 'Basic';
  invoiceForm: FormGroup;

  categoryList: Array<object> = [{ name: "Test 1", id: 1 }, { name: "Test 2", id: 2 }];


  fg: FormGroup;
  FillSAC: any[];
  ActivityList: any[];
  WIPList: any[];
  IsIncome: boolean = false;
  OtherDivisionIsIncome: boolean = false;
  ProvisionAccountList: any[];
  TransactionTypeList: any[];
  FillGSTGroup: any[];
  FillDivision: any[];
  FillGLLink: any[];
  isUpdate: boolean = false;
  isUpdateEnable: boolean = false;

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  GLMappingStatus: string = 'PENDING';
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');


  basicchargesDetails: BasicchargesDetails = new BasicchargesDetails();
  chargesDetails: chargesDetails = new chargesDetails();
  linkOtherDivisionDetailsDetails: linkOtherDivisionDetails = new linkOtherDivisionDetails();
  chargesList: ChargesList = new ChargesList();
  chargesModel: chargesModel = new chargesModel();

  //charges: Charges = new Charges();

  EmptyDynamicGrid: any = {};
  DynamicGrid: Array<DynamicGridColumn> = [];
  DynamicOtherDivisionGrid: Array<DynamicOtherDivisionColumn> = [];
  FormMode: String = "A";
  Charges_Id: number = 0;
  statusvalues: Status[] = new StatusView().statusvalues;
  divisionList: any = [];
  divisionGLList: any = [];
  linkedGLForm: FormGroup;
  linkedOtherGLForm: FormGroup;
  editSelectedIndex: number;
  editOtherDivisionSelectedIndex: number;
  isEditMode = false;
  isOtherDivisoinEditMode = false;
  chipsList: any[];
  coaAccountList: any[];
  autoGenerateCodeList: any[];
  isFFDivisoinMode = false;

  constructor(private router: Router, private route: ActivatedRoute, private ms: MastersService, private fb: FormBuilder
    , private ChargeService: ChargecodeService, private datePipe: DatePipe,
    private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService,
    private chartaccountService: ChartaccountService, private autoCodeService: AutoCodeService
  ) {
    this.getNumberRange();
    this.getDivisionList();
    this.route.params.subscribe(params => {
      this.fg = this.fb.group({ ChargesId: params['id'] });
      if (params['id']) {
        this.isUpdate = true;
        this.isUpdateEnable = true;
      }
    });
    this.createLinkedGLForm();
    this.createLinkedOtherGLForm();
    this.invoiceForm = this.fb.group({
      quantities: this.fb.array([]),
    });
    this.getCartOfAccount();
  }

  ngOnInit(): void {
    // this.GridPushEmptyrow();
    this.getFFGLActivityList();
    this.GetCOAAccountList(1);
    this.getCoaGroup();
    this.createForm();
    this.OnBindDropdownSAC();
    this.OnBindDropdownGSTGroup();
    this.OnBindDropdownDivision();
    this.OnBindDropdowngetGLLink();
    if (this.isUpdate) {
      this.fg.disable();
    }

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
            this.isUpdateEnable = false;
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

  quantities(): FormArray {
    return this.invoiceForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      category: null,
      email: '',
      startDate: '',
      endDate: '',
      radio: false
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }
  // onnSubmit() {
  //   console.log(this.invoiceForm.value);
  // }

  radioChange(event: any, index: number) {
    // let isChecked = this.invoiceForm.value.quantities[index].checkBox;
    // for (let data of this.invoiceForm.value.quantities) { data.checkBox = false; }
    // if (isChecked) { this.invoiceForm.value.quantities[index].checkBox = true; }

    // this.invoiceForm.patchValue({
    //   quantities: this.invoiceForm.value.quantities
    // });

    //  new

    this.editSelectedIndex = index;
  }

  OtherDivisionRadioChange(event: any, index: number) {
    this.editOtherDivisionSelectedIndex = index;
  }



  onBack() {
    this.router.navigate(['/views/finance/master/chargecode/chargecodeview']);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }


  updateBasicOrgDetails() {
    this.basicchargesDetails.ChargesId = this.fg.value.ID;
    this.basicchargesDetails.ChargeName = this.fg.value.ChargeName;
    this.basicchargesDetails.SACID = this.fg.value.SACID;
    // this.basicchargesDetails.GSTGroupID = this.fg.value.GSTGroupID;
    this.basicchargesDetails.DivisionID = this.fg.value.Division.toString();
    this.basicchargesDetails.TaxGroupID = this.fg.value.GSTGroupID;
    this.basicchargesDetails.IsActive = this.fg.value.IsActive == 'true' ? true : false;
    this.basicchargesDetails.ShortName = this.fg.value.shortName;
    this.basicchargesDetails.ChargeCode = this.fg.value.tariffCode;
  }

  createForm() {
    if (this.fg.value.ChargesId != null) {
      this.FormMode = "B";
      this.Charges_Id = this.fg.value.ChargesId;
      var queryParams = { "ChargesId": this.fg.value.ChargesId }
      this.ChargeService.getChargesbyId(queryParams).pipe().subscribe(async data => {
        let info = data['data'].ChargeCode[0];
        // let division = [];
        // if (info.DivisionID) {
        //   let divisionInfo = info.DivisionID.split(',')
        //   for (let div of divisionInfo) { division.push(Number(div)); }
        //   await this.divisionChanges(division);
        // }

        this.GLMappingStatus = info.GLMappingStatus;

        this.fg.patchValue({
          ID: info.ChargesId,
          ChargeName: info.ChargeName,
          SACID: info.SACID,
          GSTGroupID: info.TaxGroupID,
          IsActive: info.IsActive == true ? 'true' : 'false',
          Status: info.Status,
          EffectiveDate: '',
          IsSelected: '',
          Id: info.ChargesId,
          tariffCode: info.ChargeCode,
          shortName: info.ShortName,
          Tax: info.DivisionID,
          Division: info.DivisionID
        });

        //;

        // this.fg.value.ChargeName=data["data"]["Table"][0]["ChargeName"];
        // this.fg.value.SACID=data["data"]["Table"][0]["SACID"];
        // this.fg.value.GSTGroup=data["data"]["Table"][0]["GSTGroupID"];
        // this.fg.value.Status=data["data"]["Table"][0]["IsActive"];

        // //-----------------------------------------
        debugger

        const Division = this.divisionGLList.find(e => { return e.ID == info.DivisionID && e.Application !== 'FF' })

        if (Division && this.isFFDivisoinMode == true) {
          this.isFFDivisoinMode = false;
          this.clearLinkedGLForm();
          this.DynamicGrid = [];
        } else if (!Division) {
          this.isFFDivisoinMode = true;
          this.clearLinkedOtherGLForm();
          this.DynamicOtherDivisionGrid = [];
        } else {
          this.isFFDivisoinMode = false;
        }

        this.DynamicGrid.length = 0;
        if (data['data'].FFDMappingDetails.length > 0) {
          for (let item of data['data'].FFDMappingDetails) {

            const Activity = this.ActivityList.find(e => { return e.ID == item.ActivityId })

            item.Activity = Activity ? Activity.Name : '-';

            this.DynamicGrid.push({
              MappingFFDivisionId: item.ID,
              ID: item.ChargeId,
              ActivityId: item.ActivityId,
              TransactionType: item.TransactionType,
              WIP: item.WIP,
              ProvisionAccountId: item.ProvisionAccountId,
              ActualAccountId: item.ActualAccountId,
              EffectiveDate: item.EffectiveDate.slice(0, 10),
              Status: item.Status == true ? 'true' : 'false',
              IsSelected: item.IsSelected,
              Activity: item.Activity,
              TransactionTypeName: item.TransactionTypeName,
              WIPName: item.WIPName,
              ProvisionAccount: item.ProvisionAccount,
              ActualAccount: item.ActualAccount,
              StatusName: item.StatusName
            })
          }
        }
        else {
          // this.GridPushEmptyrow();
        }

        this.DynamicOtherDivisionGrid.length = 0;
        if (data['data'].OtherDivisionMappingDetails.length > 0) {
          for (let item of data['data'].OtherDivisionMappingDetails) {

            const Division = this.divisionGLList.find(e => { return e.ID == item.DivisionId })
            item.Division = Division ? Division.DivisionName : '-';

            this.DynamicOtherDivisionGrid.push({
              MappingFFDivisionId: item.ID,
              ID: item.ChargeId,
              DivisionId: item.DivisionId,
              TransactionType: item.TransactionType,
              WIP: item.WIP,
              ProvisionAccountId: item.ProvisionAccountId,
              ActualAccountId: item.ActualAccountId,
              EffectiveDate: item.EffectiveDate.slice(0, 10),
              Status: item.Status,
              IsSelected: item.IsSelected,
              Division: item.Division,
              TransactionTypeName: item.TransactionTypeName,
              WIPName: item.WIPName,
              ProvisionAccount: item.ProvisionAccount,
              ActualAccount: item.ActualAccount,
              StatusName: item.StatusName
            })
          }
        }
        else {
          // this.GridPushEmptyrow();
        }

        //--------------------------------------


      });


      this.fg = this.fb.group({
        ID: this.fg.value.ChargesId,
        ChargeName: '',
        SACID: 0,
        GSTGroupID: 0,
        IsActive: ['true'],
        Status: '',
        EffectiveDate: '',
        IsSelected: '',
        Id: 0,
        tariffCode: '',
        shortName: '',
        Tax: '',
        Division: ''
      });

    }
    else {
      this.fg = this.fb.group({
        ID: 0,
        ChargeName: '',
        SACID: 0,
        GSTGroupID: 0,
        IsActive: ['true'],
        Status: '',
        EffectiveDate: '',
        IsSelected: '',
        Id: 0,
        tariffCode: '',
        shortName: '',
        Tax: '',
        Division: ''
      }
      );
    }
  }

  createLinkedGLForm() {
    this.linkedGLForm = this.fb.group({
      MappingFFDivisionId: [0],
      ID: this.Charges_Id,
      ActivityId: [0],
      TransactionType: [0],
      WIP: [0],
      ProvisionAccountId: [0],
      ActualAccountId: [0],
      EffectiveDate: [0],
      Status: ['true'],
      IsSelected: [0]
    });
  }

  createLinkedOtherGLForm() {
    this.linkedOtherGLForm = this.fb.group({
      MappingFFDivisionId: [0],
      ID: this.Charges_Id,
      DivisionId: [0],
      TransactionType: [0],
      WIP: [0],
      ProvisionAccountId: [0],
      ActualAccountId: [0],
      EffectiveDate: [0],
      Status: ['true'],
      IsSelected: [0]
    });
  }

  patchLinkedGLForm(editRow) {
    this.linkedGLForm.patchValue({
      MappingFFDivisionId: editRow.MappingFFDivisionId,
      ID: this.Charges_Id,
      ActivityId: editRow.ActivityId,
      TransactionType: editRow.TransactionType,
      WIP: editRow.WIP,
      ProvisionAccountId: editRow.ProvisionAccountId,
      ActualAccountId: editRow.ActualAccountId,
      EffectiveDate: editRow.EffectiveDate,
      Status: editRow.Status == false ? 'false' : 'true',
      IsSelected: editRow.IsSelected
    });
  }

  patchLinkedOtherGLForm(editRow) {
    this.linkedOtherGLForm.patchValue({
      MappingFFDivisionId: editRow.MappingFFDivisionId,
      ID: this.Charges_Id,
      DivisionId: editRow.DivisionId,
      TransactionType: editRow.TransactionType,
      WIP: editRow.WIP,
      ProvisionAccountId: editRow.ProvisionAccountId,
      ActualAccountId: editRow.ActualAccountId,
      EffectiveDate: editRow.EffectiveDate,
      Status: editRow.Status == false ? 'false' : 'true',
      IsSelected: editRow.IsSelected
    });
  }

  clearLinkedGLForm() {
    this.linkedGLForm.reset({
      MappingFFDivisionId: 0,
      ID: this.Charges_Id,
      ActivityId: 0,
      TransactionType: 0,
      WIP: 0,
      ProvisionAccountId: 0,
      ActualAccountId: 0,
      EffectiveDate: 0,
      Status: 'true',
      IsSelected: 0
    });
  }

  clearLinkedOtherGLForm() {
    this.linkedOtherGLForm.reset({
      MappingFFDivisionId: 0,
      ID: this.Charges_Id,
      DivisionId: 0,
      TransactionType: 0,
      WIP: 0,
      ProvisionAccountId: 0,
      ActualAccountId: 0,
      EffectiveDate: 0,
      Status: 'true',
      IsSelected: 0
    });
  }

  OnBindDropdownSAC() {
    var queryParams = { "sacID": 0 }
    this.ChargeService.getSAC(queryParams).subscribe(data => {
      this.FillSAC = data["data"];
    });
  }

  OnBindDropdownGSTGroup() {
    var queryParams = { "gstGroupId": 0 }
    this.ChargeService.getGSTGroup(queryParams).subscribe(data => {
      this.FillGSTGroup = data["data"];
    });
  }

  OnBindDropdownDivision() {
    this.ChargeService.getDivision().subscribe(data => {
      this.FillDivision = data["data"];
    });
  }

  OnBindDropdowngetGLLink() {
    var queryParams = { "chartOfAccountsID": 0 }
    this.ChargeService.getGLLink(queryParams).subscribe(data => {
      this.FillGLLink = data["data"];
    });
  }

  onSubmit() {
    var validation = "";

    if (this.fg.value.ChargeName == "") {
      validation += "<span style='color:red;'>*</span> <span> Please enter Tariff Name </span><br>"
    }

    if (this.fg.value.shortName == "") {
      validation += "<span style='color:red;'>*</span> <span> Please enter Short Name </span><br>"
    }

    if (this.fg.value.Division == "") {
      validation += "<span style='color:red;'>*</span> <span> Please enter Applicable to Division(s) </span><br>"
    }

    var ddlSACCode = $('#ddlSACCode').val();
    if (this.fg.value.SACID == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select SAC code</span><br>"
    }

    var ddlGSTGroup = $('#ddlGSTGroup').val();
    if (this.fg.value.GSTGroupID == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select tax group</span><br>"
    }

    var ddlStatus = $('#ddlStatus').val();
    if (ddlStatus == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select status</span><br>"
    }

    var validationgrid = "";

    // let IsExists = this.GridRowValidation(this.DynamicGrid);

    // if (IsExists) {
    //   validationgrid += "<span style='color:red;'>*</span> <span>Linked GL and Division combination exists </span><br>"
    // }


    // var CntrTruevalue = 0;
    // for (let item of this.DynamicGrid) {
    //   var CntrTableID = item.LinkedGL
    //   // if (item.LinkedGL == item2.LinkedGL && item.LinkedGL == item2.LinkedGL && index_1 != index_2) {
    //   // }
    // }

    if (validationgrid != "") {
      validation += "<br><h5 style='font-size:15px;color: #636161; font-weight: 600;text-decoration: underline;'> Grid Validation </h5>";
      validation += validationgrid;
    }
    if (this.DynamicGrid.length == 0 && this.isFFDivisoinMode == true) {
      validation += "<span style='color:red;'>*</span> <span> Please select atleast one Mapping for FFD</span><br>"
    }

    if (this.DynamicOtherDivisionGrid.length == 0 && this.isFFDivisoinMode == false) {
      validation += "<span style='color:red;'>*</span> <span> Please select atleast one Mapping for Other Division</span><br>"
    }

    // if (this.DynamicGrid.length == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>At least add one charge detail.</span><br>"
    // }

    if (validation != "") {
      validation = "<div class='col-md-12' style='text-align: left;'>" + validation + "</div>";
      Swal.fire('', validation, 'warning');
      return false;
    }
    else {

      this.chargesModel = new chargesModel();
      this.updateBasicOrgDetails();
      this.chargesModel.charges.Table.push(this.basicchargesDetails);
      //this.fg.value.Status = $('#ddlStatus').val();


      // var ItemsST = [];
      // for (let item of this.DynamicGrid) {

      //   ItemsST.push(
      //     'ChargesId:' + item.ID.toString(),
      //     'ChartOfAccountID:' + item.LinkedGL,
      //     'DivisionId:' + item.Division,
      //     'EffectiveDate:' + item.EffectiveFrom,
      //     'IsSelected:' + item.Deselect);
      // };

      if (this.isFFDivisoinMode) {
        for (let item of this.DynamicGrid) {
          this.chargesDetails = new chargesDetails();
          this.chargesDetails.MappingFFDivisionId = item.MappingFFDivisionId ? item.MappingFFDivisionId : 0;
          this.chargesDetails.ID = item.ID ? item.ID : 0;
          this.chargesDetails.ActivityId = item.ActivityId;
          this.chargesDetails.TransactionType = item.TransactionType;
          this.chargesDetails.WIP = item.WIP;
          this.chargesDetails.ProvisionAccountId = item.ProvisionAccountId;
          this.chargesDetails.ActualAccountId = item.ActualAccountId;
          this.chargesDetails.EffectiveDate = item.EffectiveDate;
          this.chargesDetails.Status = item.Status == 'true' ? true : false;
          this.chargesDetails.IsSelected = item.IsSelected ? item.IsSelected : 0;
          // this.chargesList.Table1.push(this.chargesDetails);
          this.chargesModel.charges.Table1.push(this.chargesDetails);

          // this.chargesList.Table.push(
          //   'ChargesId:' + item.ID.toString(),
          //   'ChartOfAccountID:' + item.LinkedGL,
          //   'DivisionId:' + item.Division,
          //   'EffectiveDate:' + item.EffectiveFrom,
          //   'IsSelected:' + item.Deselect);
          //this.chargesList.Table.push();
          //let a="";
          //this.chargesList.Table.push(a);
        };
      } else {
        this.chargesModel.charges.Table1 = [];
      }

      if (!this.isFFDivisoinMode) {
        for (let item of this.DynamicOtherDivisionGrid) {
          this.linkOtherDivisionDetailsDetails = new linkOtherDivisionDetails();
          this.linkOtherDivisionDetailsDetails.MappingFFDivisionId = item.MappingFFDivisionId ? item.MappingFFDivisionId : 0;
          this.linkOtherDivisionDetailsDetails.ID = item.ID ? item.ID : 0;
          this.linkOtherDivisionDetailsDetails.DivisionId = item.DivisionId;
          this.linkOtherDivisionDetailsDetails.TransactionType = item.TransactionType;
          this.linkOtherDivisionDetailsDetails.WIP = item.WIP;
          this.linkOtherDivisionDetailsDetails.ProvisionAccountId = item.ProvisionAccountId;
          this.linkOtherDivisionDetailsDetails.ActualAccountId = item.ActualAccountId;
          this.linkOtherDivisionDetailsDetails.EffectiveDate = item.EffectiveDate;
          this.linkOtherDivisionDetailsDetails.Status = item.Status == 'true' ? true : false;
          this.linkOtherDivisionDetailsDetails.IsSelected = item.IsSelected ? item.IsSelected : 0;
          // this.chargesList.Table1.push(this.chargesDetails);
          this.chargesModel.charges.Table2.push(this.linkOtherDivisionDetailsDetails);

          // this.chargesList.Table.push(
          //   'ChargesId:' + item.ID.toString(),
          //   'ChartOfAccountID:' + item.LinkedGL,
          //   'DivisionId:' + item.Division,
          //   'EffectiveDate:' + item.EffectiveFrom,
          //   'IsSelected:' + item.Deselect);
          //this.chargesList.Table.push();
          //let a="";
          //this.chargesList.Table.push(a);
        } ;
      } else {
        this.chargesModel.charges.Table2 = [];
      }

      //this.fg.value.charges = ItemsST.toString();
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
            this.ChargeService.SaveCharges(this.chargesModel).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    if (!this.isUpdate) { this.updateAutoGenerated(); }
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
          }
        });


    }

  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Charge Code');
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

  // dynamicArray: Array<DynamicGrid> = [];
  // newDynamic: any = {};

  // addRow(index) {
  //   this.newDynamic = { RegionID: 0, OfficeLocID: 0, SalesOffLocID: 0 };
  //   this.dynamicArray.push(this.newDynamic);
  //   console.log(this.dynamicArray);
  //   return true;
  // }

  // deleteRow(dynamicArray, index, CID) {

  //   if (this.dynamicArray.length == 1) {
  //     Swal.fire("Can't delete the row when there is only one row", 'Warning')
  //     return false;
  //   } else {
  //     this.dynamicArray.splice(index, 1);
  //     this.orgForm.value.ID = CID;
  //     this.service.OrgOfficeDtlsDelete(this.orgForm.value).subscribe(Data => {
  //       Swal.fire(Data[0].AlertMessage)
  //     },
  //       (error: HttpErrorResponse) => {
  //         Swal.fire(error.message)
  //       });
  //     return true;
  //   }
  // }
  GridPushEmptyrow() {
    this.EmptyDynamicGrid = { ChargeDetailId: 0, ID: this.Charges_Id, LinkedGL: 0, Division: 0, EffectiveFrom: "", IsSelected: 0 };
    this.DynamicGrid.push(this.EmptyDynamicGrid);
  }

  GridRowValidation(newRow): boolean {
    
    const existingRow = this.DynamicGrid.find(gRow => gRow.ActivityId === newRow.ActivityId
      && gRow.TransactionType === newRow.TransactionType && gRow.WIP === newRow.WIP && gRow.ProvisionAccountId === newRow.ProvisionAccountId
      && gRow.ActualAccountId === newRow.ActualAccountId && gRow.MappingFFDivisionId !== newRow.MappingFFDivisionId);

    return !!existingRow;
  }

  GridRowOtherDivisionValidation(newRow): boolean {
    const existingRow = this.DynamicOtherDivisionGrid.find(gRow => gRow.DivisionId === newRow.DivisionId
      && gRow.TransactionType === newRow.TransactionType && gRow.WIP === newRow.WIP && gRow.ProvisionAccountId === newRow.ProvisionAccountId
      && gRow.ActualAccountId === newRow.ActualAccountId && gRow.MappingFFDivisionId !== newRow.MappingFFDivisionId);

    return !!existingRow;
  }

  DynamicGridAddRow() {
    const gRow = this.linkedGLForm.value;
    var validation = "";

    if (gRow.ActivityId === 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Activity</span></br>"
    }

    if (!gRow.TransactionType) {
      validation += "<span style='color:red;'>*</span> <span>Please select Transaction Type</span></br>"
    }

    if (!gRow.WIP) {
      validation += "<span style='color:red;'>*</span> <span>Please select WIP Account </span></br>"
    }

    if (!gRow.ProvisionAccountId && this.IsIncome == false) {
      validation += "<span style='color:red;'>*</span> <span>Please select Provision Account</span></br>"
    }

    if (!gRow.ActualAccountId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Actual Account</span></br>"
    }

    if (!gRow.EffectiveDate) {
      validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>"
    }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }

    // this.clearLinkedGLForm();
    // this.linkedGLForm.controls['ID'].setValue(0);
    // this.linkedGLForm.controls['MappingFFDivisionId'].setValue(0);
    // this.linkedGLForm.controls['IsSelected'].setValue(0);

    let IsExists = this.GridRowValidation(gRow);
    // let index_1 = 0; let index_2 = 0;
    //
    // for (let item of this.DynamicGrid) {
    //   index_1 += 1; index_2 = 0;
    //   for (let item2 of this.DynamicGrid) {
    //     index_2 += 1;
    //     if (item.LinkedGL == item2.LinkedGL && item.LinkedGL == item2.LinkedGL && index_1 != index_2) {
    //       IsExists = true;
    //     }
    //   }
    // }

    if (IsExists) {
      Swal.fire("", "Linked GL Mapping combination already Exists", 'warning');
      return;
    }
    //  this.GridPushEmptyrow();
    //   edit mode

    const Activity = this.ActivityList.find(e => { return e.ID == gRow.ActivityId })
    const TransactionType = this.TransactionTypeList.find(e => { return e.ID == gRow.TransactionType })
    const WIP = this.WIPList.find(e => { return e.ID == gRow.WIP })
    if (!this.IsIncome) {
      const ProvisionAccount = this.ProvisionAccountList.find(e => { return e.ID == gRow.ProvisionAccountId })
      gRow.ProvisionAccount = ProvisionAccount ? ProvisionAccount.AccountName : '-';
    } else {
      gRow.ProvisionAccount = '-';
    }
    const ActualAccount = this.ProvisionAccountList.find(e => { return e.ID == gRow.ActualAccountId })

    gRow.Activity = Activity ? Activity.Name : '-';
    gRow.TransactionTypeName = TransactionType ? TransactionType.GroupName : '-';
    gRow.WIPName = WIP ? WIP.AccountName : '-';
    gRow.ActualAccount = ActualAccount ? ActualAccount.AccountName : '-';
    gRow.StatusName = gRow.Status == 'true' ? 'YES' : 'NO';

    if (this.isEditMode) {
      this.DynamicGrid[this.editSelectedIndex] = gRow;
      this.isEditMode = !this.isEditMode;
      // this.GridRowValidation();
      this.clearLinkedGLForm();
      return;
    } else {
      if (gRow.ActivityId == '') {
        // Loop through the activity records
        this.ActivityList.forEach(activityRecord => {
          // if (activityRecord.ID === gRow.ActivityId) {
          this.DynamicGrid.push({
            ...gRow,
            ActivityId: activityRecord.ID,
            Activity: activityRecord.Name
          });
          // }
        });


        // for (let item of this.ActivityList) {
        //   const Activity = this.ActivityList.find(e => { return e.ID == gRow.ActivityId })
        //   gRow.Activity = Activity ? Activity.Name : '-';
        //   let data = item;
        //   this.DynamicGrid.push(data);
        // }
      } else {
        this.DynamicGrid.push(gRow);
      }
      // this.ActivityList.forEach(item => {
      //   let items = gRow;
      //   items.ActivityId = item.ID
      //   items.Activity = item.Name
      //   this.DynamicGrid.push(items);
      // })
      // this.DynamicGrid.push(gRow);
      this.clearLinkedGLForm();
    }
  }

  DynamicOtherDivisionGridAddRow() {
    const gRow = this.linkedOtherGLForm.value;
    var validation = "";

    if (gRow.DivisionId === 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Activity</span></br>"
    }

    if (!gRow.TransactionType) {
      validation += "<span style='color:red;'>*</span> <span>Please select Transaction Type</span></br>"
    }

    if (!gRow.WIP) {
      validation += "<span style='color:red;'>*</span> <span>Please select WIP Account </span></br>"
    }

    if (!gRow.ProvisionAccountId && this.OtherDivisionIsIncome == false) {
      validation += "<span style='color:red;'>*</span> <span>Please select Provision Account</span></br>"
    }

    if (!gRow.ActualAccountId) {
      validation += "<span style='color:red;'>*</span> <span>Please select Actual Account</span></br>"
    }

    if (!gRow.EffectiveDate) {
      validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>"
    }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }

    // this.clearLinkedGLForm();
    // this.linkedGLForm.controls['ID'].setValue(0);
    // this.linkedGLForm.controls['MappingFFDivisionId'].setValue(0);
    // this.linkedGLForm.controls['IsSelected'].setValue(0);

    // let IsExists = this.GridRowValidation(gRow);
    // let index_1 = 0; let index_2 = 0;
    //
    // for (let item of this.DynamicGrid) {
    //   index_1 += 1; index_2 = 0;
    //   for (let item2 of this.DynamicGrid) {
    //     index_2 += 1;
    //     if (item.LinkedGL == item2.LinkedGL && item.LinkedGL == item2.LinkedGL && index_1 != index_2) {
    //       IsExists = true;
    //     }
    //   }
    // }

    // if (IsExists) {
    //   gRow.LinkedGL = "0";
    //   gRow.Division = "0";
    //   gRow.EffectiveDate = "";
    //   gRow.IsSelected = "";
    //   Swal.fire("", "Linked GL and Division combination already Exists", 'warning');
    //   return;
    // }
    //  this.GridPushEmptyrow();
    //   edit mode

    let IsExists = this.GridRowOtherDivisionValidation(gRow);
    if (IsExists) {
      Swal.fire("", "Linked GL Mapping Other Division combination already Exists", 'warning');
      return;
    }

    const Division = this.divisionGLList.find(e => { return e.ID == gRow.DivisionId })
    const TransactionType = this.TransactionTypeList.find(e => { return e.ID == gRow.TransactionType })
    const WIP = this.WIPList.find(e => { return e.ID == gRow.WIP })
    if (!this.OtherDivisionIsIncome) {
      const ProvisionAccount = this.ProvisionAccountList.find(e => { return e.ID == gRow.ProvisionAccountId })
      gRow.ProvisionAccount = ProvisionAccount ? ProvisionAccount.AccountName : '-';
    } else {
      gRow.ProvisionAccount = '-';
    }
    // const ProvisionAccount = this.ProvisionAccountList.find(e => { return e.ID == gRow.ProvisionAccountId })
    const ActualAccount = this.ProvisionAccountList.find(e => { return e.ID == gRow.ActualAccountId })


    gRow.Division = Division ? Division.DivisionName : '-';
    gRow.TransactionTypeName = TransactionType ? TransactionType.GroupName : '-';
    gRow.WIPName = WIP ? WIP.AccountName : '-';
    // gRow.ProvisionAccount = ProvisionAccount ? ProvisionAccount.AccountName : '-';
    gRow.ActualAccount = ActualAccount ? ActualAccount.AccountName : '-';
    gRow.StatusName = gRow.Status == 'true' ? 'YES' : 'NO';

    if (this.isOtherDivisoinEditMode) {
      this.DynamicOtherDivisionGrid[this.editOtherDivisionSelectedIndex] = gRow;
      this.isOtherDivisoinEditMode = !this.isOtherDivisoinEditMode;
      // this.GridRowValidation();
      this.clearLinkedOtherGLForm();
      return;
    } else {
      // this.ActivityList.forEach(item => {
      //   let items = gRow;
      //   items.ActivityId = item.ID
      //   items.Activity = item.Name
      //   this.DynamicGrid.push(items);
      // })
      this.DynamicOtherDivisionGrid.push(gRow);
      this.clearLinkedOtherGLForm();
    }
  }


  DynamicGridDeleteRow() {
    //;
    const LinkedGLv = this.DynamicGrid[this.editSelectedIndex].ActivityId;

    if (this.DynamicGrid.length == 1 && LinkedGLv == 0) {
      Swal.fire("", "No Rows to Delete", 'warning');
      return false;
    }
    this.DynamicGrid.splice(this.editSelectedIndex, 1);

    //this.DynamicGrid.splice(index, 1);
    // this.fg.value.EnqCntrID = Id;

    // if (Id != 0) {
    //   this.ChargeService.DeleteEnqCntrType(this.fg.value).subscribe((data) => {

    //   }, (error: HttpErrorResponse) => {
    //     Swal.fire(error.message);
    //   });

    //   this.ChargeService.bindExstingList(this.fg.value).subscribe((data) => {
    //     this.DynamicGrid.length = 0;
    //     if (data.length > 0) {
    //       for (let item of data) {
    //         this.DynamicGrid.push({
    //           'ID': item.ID,
    //           'LinkedGL': item.LinkedGL,
    //           'Division': item.Division,
    //           'EffectiveFrom': item.EffectiveFrom,
    //           'IsSelected': item.IsSelected
    //         })
    //       }
    //     }
    //     else {
    //       this.GridPushEmptyrow();
    //     }
    //   }, (error: HttpErrorResponse) => {
    //     Swal.fire(error.message);
    //   });

    // }
    // else {
    //   this.DynamicGrid.splice(index, 1);
    // }

    // if (this.DynamicGrid.length == 0) {
    //   this.GridPushEmptyrow();
    //   return false;
    // }


  }

  async getDivisionList(filter?: string) {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
        this.divisionGLList = result.data.Table.filter(e => e.Application !== 'FF');
      }
    }, error => { });
  }

  OnClickEditValue() {
    // console.log('row', row, index)
    const editRow = this.DynamicGrid[this.editSelectedIndex];
    if (editRow.TransactionType == 4) {
      this.IsIncome = true;
      this.GetCOAAccountList(2)
    } else if (editRow.TransactionType == 5) {
      this.GetCOAAccountList(3)
      this.IsIncome = false;
    }
    this.patchLinkedGLForm(editRow);
    this.isEditMode = !this.isEditMode;

  }

  OnClickOtherDivisionEditValue() {
    // console.log('row', row, index)
    const editRow = this.DynamicOtherDivisionGrid[this.editOtherDivisionSelectedIndex];
    if (editRow.TransactionType == 4) {
      this.GetCOAAccountList(2)
      this.OtherDivisionIsIncome = true;
    } else if (editRow.TransactionType == 5) {
      this.GetCOAAccountList(3)
      this.OtherDivisionIsIncome = false;
    }
    this.patchLinkedOtherGLForm(editRow);
    this.isOtherDivisoinEditMode = !this.isOtherDivisoinEditMode;

  }

  getCartOfAccount() {
    this.chartaccountService.getChartaccountList(this.fg.value).subscribe(data => {
      this.coaAccountList = [];
      if (data["data"].length > 0) {
        this.coaAccountList = data["data"];
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
      });
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
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Charge Code');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event)
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.fg.controls['tariffCode'].setValue(code.trim().toUpperCase());
        }
        else {
          Swal.fire('Please create the auto-generation code for Charge Code.')
        }
      }
      else {
        this.fg.controls['tariffCode'].setValue('');
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


  divisionChanges(event: any) {
    const Division = this.divisionGLList.find(e => { return e.ID == event && e.Application !== 'FF' })

    if (Division && this.isFFDivisoinMode == true) {
      this.isFFDivisoinMode = false;
      this.clearLinkedGLForm();
      this.DynamicGrid = [];
    } else if (!Division) {
      this.isFFDivisoinMode = true;
      this.clearLinkedOtherGLForm();
      this.DynamicOtherDivisionGrid = [];
    } else {
      this.isFFDivisoinMode = false;
    }
    // this.chipsList = [];
    // if (event.length > 0) {
    //   for (let data of event) {
    //     if (this.divisionList.length > 0) {
    //       let fil = this.divisionList.find(x => x.ID == data);
    //       this.chipsList.push(fil)
    //     }
    //   }
    // }
  }

  checkPermission(value) {
    if (value == 'GL' && this.isUpdate == true) {

      if (this.fg.value.Division == '') {
        Swal.fire('Please select any Applicable to Division(s)');
        return;
      }
      this.selectedTabName = 'GL'
    } else if (value == 'Basic') {
      this.selectedTabName = 'Basic'
    } else {
      if (this.fg.value.Division == '') {
        Swal.fire('Please select any Applicable to Division(s)');
        return;
      }
      this.selectedTabName = 'GL'
    }
  }

  getFFGLActivityList() {
    this.commonDataService.getFFGLActivityList().subscribe(data => {
      this.ActivityList = data["data"].Table;
    });
  }

  GetCOAAccountList(value) {
    const payload = {
      Mode: value
    }
    this.commonDataService.GetCOAAccountList(payload).subscribe(data => {
      if (value == 1) {
        this.WIPList = data["data"].Table;
      } else if (value == 2) {
        this.ProvisionAccountList = data["data"].Table;

      } else if (value == 3) {
        this.ProvisionAccountList = data["data"].Table;
      }
    });
  }

  OnTransactionChange(type: any = '') {

    if (type == 4) {
      this.IsIncome = true;
      this.linkedGLForm.controls['ProvisionAccountId'].setValue(0);
      this.linkedGLForm.controls['ActualAccountId'].setValue(0);
      this.GetCOAAccountList(2)
    } else if (type == 5) {
      this.IsIncome = false;
      this.linkedGLForm.controls['ProvisionAccountId'].setValue(0);
      this.linkedGLForm.controls['ActualAccountId'].setValue(0);
      this.GetCOAAccountList(3)
    }
  }
  
  OnOtherDivisionTransactionChange(type: any = '') {

    if (type == 4) {
      this.OtherDivisionIsIncome = true;
      this.linkedOtherGLForm.controls['ProvisionAccountId'].setValue(0);
      this.linkedOtherGLForm.controls['ActualAccountId'].setValue(0);
      this.GetCOAAccountList(2)
    } else if (type == 5) {
      this.OtherDivisionIsIncome = false;
      this.linkedOtherGLForm.controls['ProvisionAccountId'].setValue(0);
      this.linkedOtherGLForm.controls['ActualAccountId'].setValue(0);
      this.GetCOAAccountList(3)
    }
  }

  async getCoaGroup() {
    let service = `${this.globals.APIURL}/COAType/GetCOAGroupList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.TransactionTypeList = [];
      if (result.data.Table.length > 0) {
        this.TransactionTypeList = result.data.Table.filter(e => e.ID > 3);
      }
    }, error => {
      console.error(error);
    });
  }

  IsAllSelect(event) {
  }

}

