import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Globals } from 'src/app/globals';
import { GridSort } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { AutoGenerationCodeService } from 'src/app/services/auto-generation-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { OpeningBalancesIncomeService } from 'src/app/services/financeModule/opening-balances-income.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {

  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable("DateFormat");
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  currentDate: string = this.datePipe.transform(new Date(), "dd-MM-yyyy");
  ImportUrl: any
  divisionList: any;
  divisionFilter: FormGroup;
  pager: any = {};
  pagedItems: any[];// paged items
  pagesort: any = new GridSort().sort;
  fileName: any;
  accountIncomeForm: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  uploadForm: FormGroup;
  CreatedBy = localStorage.getItem('UserID');
  file: any;
  PaymentIncomeList = []
  @ViewChild('closeBtn') closeBtn: ElementRef;
  numberRangeList: any;
  NextNumber: any;
  autoGenerateCodeList: any;
  formattedDate: any;
  registerCode: any;
  file1: any;
  resultValues: any;
  formattedErrorMessages: string;
  TemplateUploadURL = this.globals.TemplateUploadURL;

  constructor(
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private OpeningBalancesIncomeService: OpeningBalancesIncomeService,
    private ps: PaginationService,
    public commonService: CommonService,
    private autoGenerationCodeService: AutoGenerationCodeService,
    public autoCodeService: AutoCodeService,
    private globals: Globals,
    private dataService: DataService,

  ) { }

  ngOnInit(): void {

    this.CreateForm();
    this.getIncomeList();
    this.getNumberRange();
  }

  CreateForm() {
    this.accountIncomeForm = this.fb.group({
      OBReference: [''],
      AccountName: [''],
      Amount: [''],
    });

    this.uploadForm = this.fb.group({
      RegistrationCode: [this.registerCode],
      UploadDate: [this.getCurrentDate()],
      FileName: [''],
    });
  }

  async autoCodeGeneration(event: any) {

    if (event) {
      var Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Income');

      if (Info.length > 0) {

        let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
        let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);

        if (code)
          this.uploadForm.value.RegistrationCode = code
        this.registerCode = this.uploadForm.value.RegistrationCode
      }
      else {
        Swal.fire('Please create the auto-generation code for Account Receivable.')
      }

    }
    console.log(this.uploadForm.value, 'sxdfgsfghuis');

  }

  getCurrentDate(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  setPage(page: number) {
    if (this.PaymentIncomeList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
      // get pager object from service
      this.pager = this.ps.getPagers(this.PaymentIncomeList.length, page);

      // get current page of items
      this.pagedItems = this.PaymentIncomeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }
  getIncomeList() {
    const payload = this.accountIncomeForm.value
    this.OpeningBalancesIncomeService.GetIncomeList(payload).subscribe((result) => {
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.PaymentIncomeList = result.data.Table;
        this.setPage(1);
      } else {
        this.PaymentIncomeList = []
        this.pagedItems = [];
      }
    })
  }

  documentSelected(event: any) {

    if (event.target.files.length > 0) {
      this.file = event.target.files[0].name;
      this.file1 = event.target.files;
      const name = this.file.split('.')
      const finalName = name[1].toLowerCase()

      if (finalName == "xlsx" || finalName == "csv") {
        this.uploadForm.value.FileName = event.target.files[0].name
      }
      else {
        this.CreateForm();
        Swal.fire('Please choose XLSX or CSV file format.')
        return
      }
    }
  }

  popUpClear() {
    this.CreateForm();

  }

  clear() {
    // this.accountIncomeForm.reset();
    this.CreateForm();
    this.getIncomeList()
  }

  openPopup() {
    debugger
    this.getPermissionListForCreate(607);
  }

  closeModal(): void {
    this.file = '';
    this.closeBtn.nativeElement.click();
  }

  editDivision(data: any) {
    this.getPermissionListForUpdate(607, data);
  }
  search() {
    this.getIncomeList()
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

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, COACode: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    for (var i = 0; i < sectionInfo.length; i++) {
      var condition = i == 0 ? sectionInfo[i].sectionA : i == 1 ? sectionInfo[i].sectionB : i == 2 ? sectionInfo[i].sectionC : i == 3 ? sectionInfo[i].sectionD : sectionInfo[i].sectionD;
      switch (condition) {
        case 'Office Code (3 Chars)': i == 0 ? sectionA = COACode : i == 1 ? sectionB = COACode : i == 2 ? sectionC = COACode : i == 3 ? sectionD = COACode : ''; break;
        case 'Running Number (3 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (4 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (5 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (6 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (7 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        // case 'Office Code (4 Chars)': i == 0 ? sectionA = COACode : i == 1 ? sectionB = COACode : i == 2 ? sectionC = COACode : i == 3 ? sectionD = COACode : ''; break;
        // case 'Division Code (4 Chars)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        // case 'Division Code (3 Chars)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
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

  updateAutoGenerated() {

    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Income');
    if (Info.length > 0) {
      this.uploadForm.value.RegistrationCode = Info[0].NextNumber
      Info[0].NextNumber = Info[0].NextNumber + 1;

      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  updateFormattedErrorMessages(): void {
    const groupedErrors: { [key: string]: string[] } = {};

    // Group errors by RowNumber
    this.resultValues.forEach(errorMessage => {
      const rowNumber = errorMessage.match(/RowNumber: (\d+)/);
      if (rowNumber) {
        const key = rowNumber[1];
        groupedErrors[key] = groupedErrors[key] || [];
        groupedErrors[key].push(errorMessage.replace(`RowNumber: ${key}, `, ''));
      }
    });

    // Join grouped errors with line breaks
    this.formattedErrorMessages = Object.keys(groupedErrors).map(key => {
      return `RowNumber: ${key}, ${groupedErrors[key].join('<br>')}`;
    }).join('<br>');
  }


  save() {

    console.log(this.uploadForm.value, 'this.uploadForm.valuethis.uploadForm.value')

    const uploadForm = this.uploadForm.value;
    var validation = "";
    if (uploadForm.FileName == '' || uploadForm.FileName == undefined || uploadForm.FileName == null) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please choose Atleast one file</span></br>";
      Swal.fire(validation);
    }
    else {
      // this.file = this.uploadForm.value.FileName
      console.log(this.file)
      if (!this.file) {
        Swal.fire('', 'Please Choose The File To upload', 'warning');
        return
      }

      // const generationCode = '123'
      let OBDate = new Date(this.uploadForm.value.UploadDate)

      const day = OBDate.getDate().toString().padStart(2, '0');
      const month = (OBDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = OBDate.getFullYear().toString();

      // Concatenate components in "ddmmyyyy" format
      this.formattedDate = year + -+month + -+day;

      console.log(this.formattedDate, 'formattedDateformattedDateformattedDate')
      // this.uploadForm.value.RegistrationCode = this.registerCode


      this.uploadForm.value.RegistrationCode = this.registerCode


      let employeeMaster = new FormData();
      employeeMaster.append('file', this.file1[0]);
      employeeMaster.append('createdBy', this.CreatedBy);
      employeeMaster.append('Registrationcode', this.registerCode);
      employeeMaster.append('OBDate', this.formattedDate)

      console.log(employeeMaster)


      this.OpeningBalancesIncomeService.upload(employeeMaster).subscribe((result: any) => {
        if (result.message == "Success") {
          this.file = '';
          Swal.fire(result.result[0]);
          this.file = '';
          this.closeModal();
          this.updateAutoGenerated()
          this.getIncomeList();
        }

        else {
          this.resultValues = []
          this.resultValues = result.result

          if (this.resultValues.length == 1) {
            Swal.fire(this.resultValues[0]);

          }
          else {
            this.updateFormattedErrorMessages()
            console.log(this.formattedErrorMessages, 'formattedErrorMessagesformattedErrorMessages');
            Swal.fire(this.formattedErrorMessages);

          }


        }
      })

    }
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

            if (this.registerCode == '') {
            }
            else {
              this.CreateForm();
            }

          } else {
            this.closeModal();
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        this.closeModal();
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }


  getPermissionListForUpdate(value, id) {

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

          if (data[0].Update_Opt == 2) {

            this.router.navigate(['/views/transactions/openingBalances/income-detail', { id: id }])

          } else {
            this.closeModal();
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        this.closeModal();
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }



}