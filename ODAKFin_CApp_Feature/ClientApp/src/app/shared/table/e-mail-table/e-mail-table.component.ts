import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  SimpleChanges,
  Input,
  OnChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Globals } from "src/app/globals";
import { DataService } from "src/app/services/data.service";
import Swal from "sweetalert2";
import { CommonService } from "src/app/services/common.service";
import { Category } from "../../../model/common";
import { MatDatepickerInputEvent } from "@angular/material";

@Component({
  selector: "app-e-mail-table",
  templateUrl: "./e-mail-table.component.html",
  styleUrls: ["./e-mail-table.component.css"],
  providers: [DatePipe],
})
export class EMailTableComponent implements OnInit, OnChanges {
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  endMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  emailForm: FormGroup;
  DynamicSlotEmailMaster: any = [];
  // EID: number = 0;
  editSeletedIdex: any = "";
  editRadio = false;
  isEditMode = false;
  entityDateFormat =
    this.commonDataService.getLocalStorageEntityConfigurable("DateFormat");
  @Input() tableData;
  @Input() OrgId;
  @Input() CategoryTypeName; // * used for category List API switch case
  @Output() saveTable = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();
  categoryList: any;
  isUpdate: boolean;
  deleteList: any;

  constructor(
    public fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private commonDataService: CommonService
  ) {}

  ngOnInit() {
    this.CreateForm();
    // this.getCategoryList();
    this.getCategory(this.CategoryTypeName);
  }

  CreateForm() {
    const emailRegEx: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    this.emailForm = this.fb.group({
       ID: [0],
      OrgId: this.OrgId,
      Category: ["", [Validators.required]],
      EmailId: ["", [Validators.required, Validators.pattern(emailRegEx)]],
      StartDate: ["", Validators.required],
      EndDate: ["", Validators.required],
      CreatedBy: localStorage.getItem("UserID"),
      UpdatedBy: localStorage.getItem("UserID"),
      CreatedDate: new Date(),
      ModifiedDate: new Date(),
    });
  }

  // fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
  //   console.log(`${type}: ${event.value}`);
  //   const today = new Date();
  //   if (event.value !== null && event.value >= today) {
  //     this.emailForm.get('StartDate').setValue(event.value);
  //   }
  // }

  // toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
  //   console.log(`${type}: ${event.value}`);
  //   const today = new Date();
  //   if (event.value !== null && event.value >= today) {
  //     this.emailForm.get('EndDate').setValue(event.value);
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    this.tableData = this.tableData ? this.tableData : [];
    this.DynamicSlotEmailMaster = [...this.tableData];
    this.DynamicSlotEmailMaster.length
      ? (this.isUpdate = true)
      : (this.isUpdate = false);
    // this.tableData.forEach(element => {
    //   const newData =     {
    //     'ID': element.ID,
    //     'OrgId': element.OrgId,
    //     'Category': element.Category,
    //     'EmailId': element.EmailId,
    //     'StartDate': element.StartDate,
    //     'EndDate': element.EndDate,
    //     'CreatedBy': element.CreatedBy,
    //     'UpdatedBy': element.UpdatedBy,
    //     'CreatedDate': element.CreatedDate,
    //     'ModifiedDate': element.ModifiedDate
    // };
    // this.DynamicSlotEmailMaster.push(newData);
    // });
    // console.log('email table input', this.tableData );
  }

  OnClickAddValue() {
    if (this.emailForm.invalid) {
      this.addFormValidation();
      return;
    }
    // edit mode
    if (this.isEditMode) {
      this.DynamicSlotEmailMaster[this.editSeletedIdex] = this.emailForm.value;
      this.isEditMode = !this.isEditMode;
      this.OnClearEmailForm();
      return;
    }
    // create mode
    this.DynamicSlotEmailMaster.push(this.emailForm.value);
    this.OnClearEmailForm();
  }

  OnClearEmailForm() {
    // const emailRegEx: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    this.emailForm.reset({
      ID: 0
      // OrgId: this.OrgId,
      // Category: ["", [Validators.required]],
      // EmailId: ["", [Validators.required, Validators.pattern(emailRegEx)]],
      // StartDate: ["", Validators.required],
      // EndDate: ["", Validators.required],
      // CreatedBy: localStorage.getItem("UserID"),
      // UpdatedBy: localStorage.getItem("UserID"),
      // CreatedDate: new Date(),
      // ModifiedDate: new Date(),
    });
    this.clearValidation(this.emailForm);
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

  OnClickEditValue() {
    // console.log('row', row, index)
    let editRow = this.DynamicSlotEmailMaster[this.editSeletedIdex];
    editRow.StartDate = this.datePipe.transform(
      editRow.StartDate,
      "yyyy-MM-dd"
    );
    editRow.EndDate = this.datePipe.transform(editRow.EndDate, "yyyy-MM-dd");
    this.patchEmailForm(editRow);
    this.isEditMode = !this.isEditMode;
  }

  OnClickDeleteValue() {
    if (this.editSeletedIdex === "") {
      return;
    }
    Swal.fire({
      showCloseButton: true,
      title: "",
      icon: "question",
      text: "Do you want to delete this record?",
      showCancelButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "Cancel",
      reverseButtons: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        this.deleteList = this.DynamicSlotEmailMaster.splice(
          this.editSeletedIdex,
          1
        );
        this.editSeletedIdex = "";
      }
    });
  }

  patchEmailForm(editRow) {
    this.emailForm.patchValue({
      ID: editRow.ID,
      OrgId: editRow.OrgId,
      Category: editRow.Category,
      EmailId: editRow.EmailId,
      StartDate: editRow.StartDate,
      EndDate: editRow.EndDate,
      CreatedBy: editRow.CreatedBy,
      UpdatedBy: editRow.UpdatedBy,
      CreatedDate: editRow.CreatedDate,
      ModifiedDate: editRow.ModifiedDate,
    });
    this.setEndMinDate();
  }

  OnSubmit() {
    if (this.isEditMode && this.emailForm.invalid) {
      const validationMessage = 'Please complete the edit';
      Swal.fire(validationMessage);
      return;
    }

    // if ( this.emailForm.invalid && !this.emailForm.value.Category || !this.emailForm.value.EmailId) {
    //   const validationMessage = 'Please complete the create';
    //   Swal.fire(validationMessage);
    //   return;
    // }

    this.saveTable.emit(this.DynamicSlotEmailMaster);
    this.deleteRecord.emit(this.deleteList);
  }

  // * construct URL for category based on the page
  getCategory(type = "default") {
    const typeName = type.toLowerCase();
    switch (typeName) {
      case "entity":
        this.getCategoryList("/Common/GetEntityEmailCategorys");
        break;
      case "office":
        this.getCategoryList("/Customer/GetCustomerEmailCategorys");
        break;
      case "customer":
        this.getCategoryList("/Customer/GetCustomerEmailCategorys");
        break;
      default:
        this.getCategoryList("/Organization/GetCategoryList");
        break;
    }
  }

  getCategoryList(path) {
    const URL = `${this.globals.APIURL + path}`;
    this.dataService.post(URL, {}).subscribe(
      (result: any) => {
        if (result.data.Table.length > 0) {
          this.categoryList = result.data.Table;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addFormValidation() {
    // let validation = '';
    // validation += '<span style=\'color:red;\'>*</span> <span>Please Enter Valid Details </span></br>';
    // Swal.fire(validation);

    let validation = "";
    if (!this.emailForm.value.Category) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Select Category</span></br>";
    }

    if (!this.emailForm.value.EmailId) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter Email ID</span></br>";
    } else if (this.emailForm.get("EmailId").invalid) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter a Valid Email</span></br>";
    }

    if (!this.emailForm.value.StartDate) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Start Date</span></br>";
    }

    if (!this.emailForm.value.EndDate) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select End Date</span></br>";
    }

    Swal.fire(validation);
  }

  setEndMinDate() {
    let nextdate = new Date(this.emailForm.value.StartDate);
    nextdate = new Date(nextdate.setDate(nextdate.getDate() + 1));
    this.endMinDate = this.datePipe.transform(nextdate, "yyyy-MM-dd");
  }
}
