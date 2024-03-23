import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coa-number-range',
  templateUrl: './coa-number-range.component.html',
  styleUrls: ['./coa-number-range.component.css'],
  providers: [DatePipe]
})
export class CoaNumberRangeComponent implements OnInit {

  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  selectedTabName: string = 'company';
  selectedIndexValue: number;
  selectedItem: boolean = false;
  coaTypeList: any = [];
  coaGroupList: any = [];
  payload: { COANumberRange: { Table: any[]; }; };
  currentRowIndex: number = 1;
  isEditMode: boolean = false;
  coaFormLength: number;
  isCoaGroupSelected: boolean = false;
  emailForm: FormGroup;
  DynamicSlotEmailMaster: any = [];
  editSeletedIdex: any;
  editRadio = false;
  isEditModeEnable: boolean = false;
  copyCOAType: any[];
  isEditable: boolean = false;

  isAdd: boolean = false;
  isUpdate: boolean = false;
  isDelete: boolean = false;

  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private commonDataService: CommonService,
    public ps: PaginationService,
  ) {
    this.getCoaType();
    this.getPermissionListForCreate(574);
  }



  getPermissionListForCreate(value) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2) {
            this.isAdd = true;
          } else {
            this.isAdd = false;
          }

          if (data[0].Update_Opt == 2) {
            this.isUpdate = true;
          } else {
            this.isUpdate = false;
          }

          if (data[0].Delete_Opt == 2) {
            this.isDelete = true;
          } else {
            this.isDelete = false;
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }



  async ngOnInit(): Promise<void> {
    this.CreateForm();
    await this.getCoaGroup();
    this.getCoaNumberRange();
  }

  // quantities(): FormArray {
  //   return this.productForm.get("quantities") as FormArray
  // }

  // newQuantity(): FormGroup {
  //   return this.fb.group({
  //     ID: [''],
  //     COAGroupId: [''],
  //     COATypeId: [''],
  //     FromNumber: [''],
  //     ToNumber: [''],
  //     CurrentNumber: [''],
  //     EffectiveDate: [''],
  //     CreatedDate: [new Date()],
  //     UpadtedDate: [new Date()],
  //     CreatedBy: [localStorage.getItem('UserID')],
  //     UpdatedBy: [localStorage.getItem('UserID')],
  //     checkBox: false
  //   })
  // }

  // addQuantity(isList: boolean) {
  //   if (this.productForm.value.quantities.length > 0 && !isList) {
  //     let arrLength = this.productForm.value.quantities.length;
  //     var validation = "";
  //     if (this.productForm.value.quantities[arrLength - 1].COAGroupId == "" || this.productForm.value.quantities[arrLength - 1].COAGroupId == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter COA Group </span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].COATypeId == "" || this.productForm.value.quantities[arrLength - 1].COATypeId == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter COA Type</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].FromNumber == "" || this.productForm.value.quantities[arrLength - 1].FromNumber == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter Form Number</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].ToNumber == "" || this.productForm.value.quantities[arrLength - 1].ToNumber == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter To Number</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].CurrentNumber == "" || this.productForm.value.quantities[arrLength - 1].CurrentNumber == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter Current Number</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].EffectiveDate == "" || this.productForm.value.quantities[arrLength - 1].EffectiveDate == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter EffectiveDate</span></br>"
  //     }
  //     if (validation != "") {
  //       Swal.fire(validation)
  //       return false;
  //     }
  //   }

  // this.quantities().push(this.newQuantity());
  //   this.coaFormLength = this.productForm.value.quantities.length - 1;
  // }

  // removeQuantity() {
  //   if (this.selectedIndexValue >= 0 && this.selectedItem) {
  //     this.delete();
  //     this.selectedItem = true;
  //     this.selectedIndexValue = undefined;
  //   }
  //   else {
  //     this.selectedItem = true;
  //     this.selectedIndexValue = undefined;
  //     Swal.fire("Please select the Item!!");
  //   }
  // }

  // radioChange(event: any, index: number) {
  //   let isChecked = !this.productForm.value.quantities[index].checkBox;
  //   for (let data of this.productForm.value.quantities) { data.checkBox = false; }
  //   if (isChecked) {
  //     this.productForm.value.quantities[index].checkBox = true;
  //     this.selectedIndexValue = index;
  //     this.selectedItem = true;
  //   }
  //   else {
  //     this.selectedItem = false;
  //     this.selectedIndexValue = undefined;
  //   }
  //   this.productForm.patchValue({
  //     quantities: this.productForm.value.quantities
  //   });
  // }

  // delete() {
  //   let removeId = this.productForm.value.quantities[this.selectedIndexValue].ID;
  //   if (!removeId) return;
  //   let service = `${this.globals.APIURL}/COAType/COANumberRangeDelete`;
  //   this.dataService.post(service, { Id: removeId }).subscribe((result: any) => {
  //     if (result.message = "Success") { Swal.fire('Deleted successfully!!'); }
  //   }, error => {
  //     console.error(error);
  //   });
  // }


  async getCoaNumberRange() {
    //  if (this.coaTypeList.length == 0) { await this.groupNameChanged(); }
    if (this.coaGroupList.length == 0) { await this.getCoaGroup(); }
    let service = `${this.globals.APIURL}/COAType/GetCOANumberRangeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.DynamicSlotEmailMaster = [];
      if (result.data.Table.length > 0) {
        this.DynamicSlotEmailMaster = result.data.Table;
        for (let x of this.DynamicSlotEmailMaster) {
          let groupName = this.coaGroupList.filter(y => y.ID == x.COAGroupId);
          x.coaGroupName = groupName[0].GroupName;
          let typeName = this.coaTypeList.filter(z => z.ID == x.COATypeId);
          if (typeName.length > 0) { x.typeName = typeName[0].COATypeName }
        }

      }
      // this.setPage(1);
    }, error => {
      console.error(error);
    });
  }

  async getCoaGroup() {
    let service = `${this.globals.APIURL}/COAType/GetCOAGroupList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.coaGroupList = [];
      if (result.data.Table.length > 0) {
        this.coaGroupList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  async getCoaType() {
    var service: any = `${this.globals.APIURL}/COAType/GetCOATypeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.coaTypeList = [];
      this.copyCOAType = [];
      if (result.data.Table.length > 0) {
        this.coaTypeList = result.data.Table;
        this.copyCOAType = [...this.coaTypeList]
      }
    }, error => {
      console.error(error);
    });
  }

  // onSubmit() {

  //   if (this.productForm.value.quantities.length > 0) {
  //     let arrLength = this.productForm.value.quantities.length;
  //     var validation = "";
  //     if (this.productForm.value.quantities[arrLength - 1].COAGroupId == "" || this.productForm.value.quantities[arrLength - 1].COAGroupId == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter COA Group </span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].COATypeId == "" || this.productForm.value.quantities[arrLength - 1].COATypeId == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter COA Type</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].FromNumber == "" || this.productForm.value.quantities[arrLength - 1].FromNumber == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter Form Number</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].ToNumber == "" || this.productForm.value.quantities[arrLength - 1].ToNumber == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter To Number</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].CurrentNumber == "" || this.productForm.value.quantities[arrLength - 1].CurrentNumber == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter Current Number</span></br>"
  //     }
  //     if (this.productForm.value.quantities[arrLength - 1].EffectiveDate == "" || this.productForm.value.quantities[arrLength - 1].EffectiveDate == null) {
  //       validation += "<span style='color:red;'>*</span> <span>Please Enter EffectiveDate</span></br>"
  //     }
  //     if (validation != "") {
  //       Swal.fire(validation)
  //       return false;
  //     }
  //   }

  //   this.customPayload();
  //   let service = `${this.globals.APIURL}/COAType/SaveCOANumberRange`;
  //   this.dataService.post(service, this.payload).subscribe((result: any) => {
  //     if (result.message = "Success") {
  //       Swal.fire('Saved successfully!!');
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  // customPayload() {
  //   let copyArray = [...this.productForm.value.quantities];

  //   if (this.isEditMode) {
  //     copyArray.filter(x => x.ID != '');
  //   }
  //   else {
  //     copyArray.filter(x => x.ID == '');
  //   }

  //   copyArray.forEach(object => {
  //     delete object['checkBox'];
  //   });
  //   this.payload = {
  //     COANumberRange: {
  //       Table: copyArray,
  //     }
  //   }
  // }


  // updateCotForm() {

  //   if (this.selectedIndexValue != undefined) {
  //     this.isEditMode = true;
  //     this.coaFormLength = this.selectedIndexValue == 0 ? 0 : this.selectedIndexValue;
  //     console.log(this.coaFormLength, "this.selectedIndexValue")
  //   }
  //   else {
  //     this.selectedItem = true;
  //     this.isEditMode = false;
  //     this.selectedIndexValue = undefined;
  //     Swal.fire("Please select the Item!!");
  //   }
  // }

  // updateForm() {
  //   this.isEditMode = false;
  //   this.onSubmit();
  // }

  // coaGroupChanged(event: any) {
  //   if (event) {
  //     this.isCoaGroupSelected = true;
  //   }
  // }

  CreateForm() {
    this.emailForm = this.fb.group({
      ID: [''],
      COAGroupId: ['', [Validators.required]],
      COATypeId: ['', [Validators.required]],
      FromNumber: ['', [Validators.required]],
      ToNumber: ['', [Validators.required]],
      CurrentNumber: ['', [Validators.required]],
      EffectiveDate: ['', [Validators.required]],
      CreatedDate: [this.datePipe.transform(new Date(), 'y-MM-dd')],
      UpadtedDate: [this.datePipe.transform(new Date(), 'y-MM-dd')],
      CreatedBy: localStorage.getItem('UserID'),
      UpdatedBy: localStorage.getItem('UserID'),
      YearlyReset: [1]
    });
  }


  OnClickAddValue() {

    if (!this.isAdd) {
      Swal.fire('Please Contact Administrator');
    } else {

      if (this.addFormValidation() != '') {
        return;
      }
      let validation = '';
      if (Number(this.emailForm.value.ToNumber) < Number(this.emailForm.value.FromNumber) || Number(this.emailForm.value.ToNumber) == Number(this.emailForm.value.FromNumber)) {
        validation += '<span style=\'color:red;\'>*</span> <span>From number is always less than To number.</span></br>';
      }
      if (Number(this.emailForm.value.ToNumber) == 0 || Number(this.emailForm.value.FromNumber) == 0) {
        validation += '<span style=\'color:red;\'>*</span> <span>Please enter a valid number.</span></br>';
      }

      if (!this.isEditMode) {
        let checkFromSlot = this.DynamicSlotEmailMaster.filter(x => x.FromNumber == this.emailForm.value.FromNumber);
        let checkToSlot = this.DynamicSlotEmailMaster.filter(x => x.ToNumber == this.emailForm.value.ToNumber);

        if (checkFromSlot.length > 0) {
          validation += '<span style=\'color:red;\'>*</span> <span>Already, a number is allocated in From Number.</span></br>';
        }
        if (checkToSlot.length > 0) {
          validation += '<span style=\'color:red;\'>*</span> <span>Already, a number is allocated in To Number.</span></br>';
        }

        // Validate From number and To number number
        if (this.DynamicSlotEmailMaster.length > 0) {
          let validations = this.fromAndToNumberValidate(this.DynamicSlotEmailMaster, this.emailForm.value.FromNumber, this.emailForm.value.ToNumber);

          if (validations != '') {
            return Swal.fire(validations);
          }
        }

      }
      else if ((this.isEditMode)) {
        let selectedValue = this.DynamicSlotEmailMaster.filter(x => x.ID != this.DynamicSlotEmailMaster[this.editSeletedIdex].ID);
        let checkFromSlot = selectedValue.filter(x => x.FromNumber == this.emailForm.value.FromNumber);
        let checkToSlot = selectedValue.filter(x => x.ToNumber == this.emailForm.value.ToNumber);

        if (checkFromSlot.length > 0) {
          validation += '<span style=\'color:red;\'>*</span> <span>Already, a number is allocated in From Number.</span></br>';
        }
        if (checkToSlot.length > 0) {
          validation += '<span style=\'color:red;\'>*</span> <span>Already, a number is allocated in To Number.</span></br>';
        }
        if (this.DynamicSlotEmailMaster.length > 0) {
          let validations = this.fromAndToNumberValidate(selectedValue, this.emailForm.value.FromNumber, this.emailForm.value.ToNumber);

          if (validations != '') {
            return Swal.fire(validations);
          }
        }
      }

      if (validation != '') {
        return Swal.fire(validation);
      }

      let unSavedData = this.DynamicSlotEmailMaster.filter(x => x.ID == '')
      if (unSavedData.length > 0) {
        let validation = '';
        validation += '<span style=\'color:red;\'>*</span> <span>Please save the previous data, and then add the item.</span></br>';
        return Swal.fire(validation);
      }


      // edit mode
      if (this.isEditMode) {
        this.isEditable = false;
        this.DynamicSlotEmailMaster[this.editSeletedIdex] = this.emailForm.value;
        this.isEditMode = !this.isEditMode;
        this.OnClearEmailForm();
        return;
      }
      // create mode

      this.DynamicSlotEmailMaster.push(this.emailForm.value);
      this.OnClearEmailForm();

    }

  }

  OnClearEmailForm() {
    this.emailForm.reset();
    this.clearValidation(this.emailForm);

    for (let x of this.DynamicSlotEmailMaster) {
      let groupName = this.coaGroupList.filter(y => y.ID == x.COAGroupId);
      if (groupName.length > 0) { x.coaGroupName = groupName[0].GroupName; }
      let typeName = this.coaTypeList.filter(z => z.ID == x.COATypeId);
      if (typeName.length > 0) x.typeName = typeName[0].COATypeName;
    }
    this.setPage(1);
  }

  clearValidation(formName) {
    Object.keys(formName.controls).forEach((key) => {
      const control = formName.controls[key];
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  OnClickRadio(index, selectedEID) {
    this.editSeletedIdex = index;
  }

  OnClickEditValue(row, index) {
    if (!this.isUpdate) {
      Swal.fire('Please Contact Administrator');
    } else {
      const editRow = this.DynamicSlotEmailMaster[this.editSeletedIdex];
      editRow.EffectiveDate = this.datePipe.transform(editRow.EffectiveDate, 'yyyy-MM-dd');
      this.patchEmailForm(editRow);
      this.isEditMode = !this.isEditMode;
      this.isEditModeEnable = true;
      this.isEditable = true;
    }
  }

  OnClickDeleteValue() {
    if (!this.isUpdate) {
      Swal.fire('Please Contact Administrator');
    } else {
      if (this.editSeletedIdex >= 0 && this.editSeletedIdex != null) {
        let deleteValue = this.DynamicSlotEmailMaster[this.editSeletedIdex];

        if (Number(deleteValue.FromNumber) < Number(deleteValue.CurrentNumber)) {
          return Swal.fire('Already, the number range is used. Unable to delete it.');;
        }

        if (Object.keys(deleteValue).length > 0) {
          let service = `${this.globals.APIURL}/COAType/COANumberRangeDelete`;
          this.dataService.post(service, { Id: deleteValue.ID }).subscribe((result: any) => {
            if (result.message = "Success") {
              this.getCoaNumberRange();
              this.editSeletedIdex = null;
              Swal.fire('Deleted successfully!!');
            }
          }, error => {
            console.error(error);
          });
        }
      }
      else {
        Swal.fire('Please select the Item');
      }
      this.CreateForm();
    }
  }

  patchEmailForm(editRow) {
    this.emailForm.patchValue({
      ID: editRow.ID,
      COAGroupId: editRow.COAGroupId,
      COATypeId: editRow.COATypeId,
      FromNumber: editRow.FromNumber,
      ToNumber: editRow.ToNumber,
      CurrentNumber: editRow.CurrentNumber,
      EffectiveDate: editRow.EffectiveDate,
      CreatedDate: editRow.CreatedDate,
      UpadtedDate: this.datePipe.transform(new Date(), 'y-MM-dd'),
      CreatedBy: editRow.CreatedBy,
      UpdatedBy: editRow.UpdatedBy
    });
  }

  OnSubmit() {
    if (this.isEditMode && this.emailForm.invalid) {
      const validationMessage = 'Please complete the edit';
      Swal.fire(validationMessage);
      return;
    }
    else if (this.isEditModeEnable) {
      this.isEditModeEnable = !this.isEditModeEnable;
      let accountNumberRange = [...[this.DynamicSlotEmailMaster[this.editSeletedIdex]]];
      accountNumberRange.map(x => { delete x.coaGroupName; delete x.typeName });
      this.payload = { COANumberRange: { Table: accountNumberRange } }
      let service = `${this.globals.APIURL}/COAType/SaveCOANumberRange`;
      this.dataService.post(service, this.payload).subscribe((result: any) => {
        if (result.message = "Success") {
          this.getCoaNumberRange();
          Swal.fire('Update successfully!!');
        }
      }, error => {
        console.error(error);
      });
    }
    else if (!this.isEditModeEnable) {
      if (this.DynamicSlotEmailMaster.length > 0) {
        let accountNumberRange = this.DynamicSlotEmailMaster.filter(x => x.ID == '');
        accountNumberRange.map(x => { delete x.coaGroupName; delete x.typeName });
        this.payload = { COANumberRange: { Table: accountNumberRange } }
        let service = `${this.globals.APIURL}/COAType/SaveCOANumberRange`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message = "Success") {
            this.getCoaNumberRange();
            this.OnClearEmailForm();
            Swal.fire('Saved successfully!!');
          }
        }, error => {
          console.error(error);
        });
      }
    }
  }


  addFormValidation() {
    let validation = '';
    if (!this.emailForm.value.COAGroupId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please select COA Group</span></br>';
    }
    if (!this.emailForm.value.COATypeId) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please select COA Type</span></br>';
    }
    if (!this.emailForm.value.FromNumber) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter From Number</span></br>';
    }

    if (!this.emailForm.value.ToNumber) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please enter To Number</span></br>';
    }
    // if (!this.emailForm.value.CurrentNumber) {
    //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter Current Number</span></br>';
    // }
    if (!this.emailForm.value.EffectiveDate) {
      validation += '<span style=\'color:red;\'>*</span> <span>Please pick Effective Date</span></br>';
    }
    if (Number(this.emailForm.value.ToNumber) < Number(this.emailForm.value.FromNumber)) {
      validation += '<span style=\'color:red;\'>*</span> <span>From number should always less than To number</span></br>';
    }
    if (Number(this.emailForm.value.ToNumber) == Number(this.emailForm.value.FromNumber)) {
      validation += '<span style=\'color:red;\'>*</span> <span>From number should always less than To number</span></br>';
    }

    if (validation != '') {
      Swal.fire(validation);
    }
    return validation;
  }

  groupNameChanged(event: any) {
    var service: any = `${this.globals.APIURL}/COAType/GetCOAGroupById`;
    this.dataService.post(service, { COAGroup: event }).subscribe((result: any) => {
      this.coaTypeList = [];
      this.copyCOAType = [];
      if (result.data.Table.length > 0) {
        this.coaTypeList = result.data.Table;
        this.copyCOAType = [...this.coaTypeList]
        this.copyCOAType = this.coaTypeList.filter(x => x.COAGroup == event);
      }
    }, error => {
      console.error(error);
    });
  }


  fromAndToNumberValidate(rangeList: any, fromNumberValue: any, toNumberValue: any) {
    let validation = '';

    let bookedSlot = [];
    for (let res of rangeList) {
      for (let i = Number(res.FromNumber); i <= Number(res.ToNumber); i++) {
        bookedSlot.push(i)
      }
    }
    var availableSlot = [];
    for (let i = fromNumberValue; i <= toNumberValue; i++) {
      let checkValue = bookedSlot.indexOf(i);

      if (checkValue == -1) {
        availableSlot.push(i)
      }
      else {
        validation += '<span style=\'color:red;\'>*</span> <span>Already, a number is allocated.</span></br>';
        if (availableSlot.length > 0) validation += `Available number is ${availableSlot[0]}-${availableSlot[availableSlot.length - 1]}`;
        else validation += `Slot is not available!!`
        break
      }
    }
    return validation;
  }

  fromNumberChanges(event) {
    this.emailForm.controls['CurrentNumber'].setValue(event);
  }


  setPage(page: number) {

    // get pager object from service
    this.pager = this.ps.getPager(this.DynamicSlotEmailMaster.length, page);

    // get current page of items
    this.pagedItems = this.DynamicSlotEmailMaster.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
