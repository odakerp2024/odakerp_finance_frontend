import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auto-generate-code',
  templateUrl: './auto-generate-code.component.html',
  styleUrls: ['./auto-generate-code.component.css'],
  providers: [DatePipe]
})
export class AutoGenerateCodeComponent implements OnInit {

  autoCodeForm: FormGroup;
  autoGenerateCodeList: any = [];
  isEditMode: boolean = false;
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  editSelectedIndex: any;
  objectNameList: any = [];
  sectionList: any = [];
  RangeLimit: number;
  pager: any = {};
  pagedItems: any[];// paged items
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  objectNameId: number = 0;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private globals: Globals,
    private dataService: DataService,
    public ps: PaginationService,
    private router: Router,
    public commonDataService: CommonService
  ) { }

  ngOnInit(): void {
    this.CreateForm();
    this.getObjectName();
    this.getSection();
    this.getNumberRange();
  }

  CreateForm() {
    this.autoCodeForm = this.fb.group({
      Id: [''],
      ObjectName: [''],
      Prefix: ['', Validators.maxLength(4)],
      SectionA: [''],
      SectionB: [''],
      SectionC: [''],
      SectionD: [''],
      EffectiveDate: [''],
      NextNumber: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      CreatedAt: [this.datePipe.transform(new Date(), 'YYYY-MM-dd')],
      UpdatedBy: [localStorage.getItem('UserID')],
      UpdatedAt: [this.datePipe.transform(new Date(), 'YYYY-MM-dd')],
      YearlyReset: [true],
      searchOptionValue: ['']
    });
  }

  getNumberRange(clear?: string) {
    if (clear == 'clear') this.autoCodeForm.controls['searchOptionValue'].setValue('');
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
    this.dataService.post(service, { Id: 0, ObjectId: this.objectNameId }).subscribe((result: any) => {
      this.autoGenerateCodeList = [];
      this.pagedItems = [];
      if (result.message = "Success") {
        if (result.data.Table.length > 0) {
          this.autoGenerateCodeList = result.data.Table;
          this.setPage(1);
        }
      }
    }, error => {
      console.error(error);
    });
  }

  // setPage(page: number) {
  //   this.pager = this.ps.getPager(this.autoGenerateCodeList.length, page);
  //   this.pagedItems = this.autoGenerateCodeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  // }

  setPage(page: number) {
    if(this.autoGenerateCodeList.length){
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
        this.pager = this.ps.getPager(this.autoGenerateCodeList.length, page);
       this.pagedItems = this.autoGenerateCodeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
   } else {
   this.pagedItems = []; 
   }
 }

  getObjectName() {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeObjects`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.message = "Success") {
        if (result.data.Table.length > 0) {
          this.objectNameList = result.data.Table
        }
      }
    }, error => {
      console.error(error);
    });
  }

  getSection() {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeDropDown`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.message = "Success") {
        if (result.data.Table.length > 0) {
          this.sectionList = result.data.Table
        }
      }
    }, error => {
      console.error(error);
    });
  }

  OnClickAddValue() {
    var validation = "";
    let autoList = this.autoGenerateCodeList.filter(x => x.Id == '');
    if (autoList.length > 0) { validation += "<span style='color:red;'>*</span> <span>Please save the preceding data. And then add the new item.</span></br>" }
    if (this.autoCodeForm.value.ObjectName == "" || this.autoCodeForm.value.ObjectName == null) { validation += "<span style='color:red;'>*</span> <span>Please select Object Name </span></br>" }
    if (this.autoCodeForm.value.Prefix == "" || this.autoCodeForm.value.Prefix == null) { validation += "<span style='color:red;'>*</span> <span>Please enter Prefix</span></br>" }
    if (this.autoCodeForm.value.SectionA == "" || this.autoCodeForm.value.SectionA == null) { validation += "<span style='color:red;'>*</span> <span>Please select Section A</span></br>" }
    if (this.autoCodeForm.value.EffectiveDate == "" || this.autoCodeForm.value.EffectiveDate == null) { validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>" }
    if (this.autoCodeForm.value.NextNumber == "" || this.autoCodeForm.value.NextNumber == null) { validation += "<span style='color:red;'>*</span> <span>Please enter Next Number</span></br>" }
    if (this.autoCodeForm.value.YearlyReset == "" || this.autoCodeForm.value.YearlyReset == null) { validation += "<span style='color:red;'>*</span> <span>Please select Yearly Rest.</span></br>" }
    let number = `${this.autoCodeForm.value.NextNumber}`.length;

    if (number != this.RangeLimit) {
      validation += `<span style='color:red;'>*</span> <span>Your selected running number is ${this.RangeLimit} digits, so please make sure your current number is ${this.RangeLimit} digits.</span></br>`
    }

    const [running] = this.autoCodeForm.value.SectionA.split(' ');
    if (running != "Running") {
      const [running1] = this.autoCodeForm.value.SectionB.split(' ');
      if (running1 != "Running") {
        const [running2] = this.autoCodeForm.value.SectionC.split(' ');
        if (running2 != "Running") {
          const [running3] = this.autoCodeForm.value.SectionC.split(' ');
          if (running3 != "Running") {
            const [running4] = this.autoCodeForm.value.SectionD.split(' ');
            if (running4 != "Running") {
              validation += "<span style='color:red;'>*</span> <span>At least one section must select the running option.</span></br>";
            }
          }
        }
      }
    }

    if (validation != "") { Swal.fire(validation); return false; }
    let runningInfo = this.sectionRunningValidate();
    if (!runningInfo) return;

    if (this.isEditMode) {
      this.autoGenerateCodeList[this.editSelectedIndex] = this.autoCodeForm.value;
      this.isEditMode = !this.isEditMode;
      this.CreateForm();
      this.setPage(1);
    }
    else {
      this.autoGenerateCodeList.unshift(this.autoCodeForm.value);
      this.CreateForm();
      this.setPage(1);
    }
  }

  OnClickEditValue() {
    const editRow = this.autoGenerateCodeList[this.editSelectedIndex];
    this.autoCodeForm.patchValue(editRow);
    this.isEditMode = !this.isEditMode;
  }

  OnClickRadio(index) {
    this.editSelectedIndex = index;
  }

  OnClickDeleteValue() {
    if (this.editSelectedIndex >= 0 && this.editSelectedIndex != null) {
      let deleteValue = this.autoGenerateCodeList[this.editSelectedIndex];
      if (Object.keys(deleteValue).length > 0) {

      }
    }
    else {
      Swal.fire('Please select the Item!!');
    }
  }

  submit(status) {
    this.autoGenerateCodeList.forEach(element => {
      delete element.searchOptionValue;
    });

    let saveMsg = `Do you want to Save this Details?`;
    let closeMsg = `Do you want to  exit?`;

    let combinedText: string;

    if (status === 0) {
      combinedText =   saveMsg ;
    } else if (status === 1) {
      combinedText = closeMsg;
    }

    // console.log(this.autoGenerateCodeList, "this.autoGenerateCodeList")
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
    }).then((result) => {
      if (result.isConfirmed) {
        let service = `${this.globals.APIURL}/COAType/SaveNumberRangeCodeGenerator`;
        let payload = { NumberRangeObject: { Table: this.autoGenerateCodeList.filter(x => x.Id == '') } }
        this.dataService.post(service, payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
            this.getNumberRange();
          }
          if (status == 1) { 
            this.router.navigate(['/views/finance/financemaster']);
          }

        }, error => {
          console.error(error);
        });
      }
    });
  }

  sectionRunningValidate() {
    var runningLength = [];
    var validation = "";
    const [runningValue] = this.autoCodeForm.value.SectionA.split(' ');
    const [runningValue1] = this.autoCodeForm.value.SectionB.split(' ');
    const [runningValue2] = this.autoCodeForm.value.SectionC.split(' ');
    const [runningValue13] = this.autoCodeForm.value.SectionD.split(' ');
    runningLength.push(runningValue, runningValue1, runningValue2, runningValue13);
    let runningNumberFilter = runningLength.filter(x => x == "Running")
    if (runningNumberFilter.length > 1) {
      validation += "<span style='color:red;'>*</span> <span>One running number must be selected in the section.</span></br>";
      if (validation != "") { Swal.fire(validation); return false; }
    }
    else {
      return true;
    }
  }

  changeEvent(event) {
    if (event) {
      var [runningNumber] = event.match(/(\d+)/);
      this.RangeLimit = runningNumber
    }
  }

  checkRange(event) {
    if (event.length > this.RangeLimit) {
      const NextNumber = event.slice(0, this.RangeLimit)
      this.autoCodeForm.controls['NextNumber'].setValue(NextNumber)
    }
  }

  searchOption(event) {
    if (event) this.objectNameId = event;
  }

}
