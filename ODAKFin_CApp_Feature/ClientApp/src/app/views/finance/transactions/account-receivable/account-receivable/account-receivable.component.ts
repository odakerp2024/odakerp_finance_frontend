import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Globals } from 'src/app/globals';
import { GridSort } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { AutoGenerationCodeService } from 'src/app/services/auto-generation-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { PaymentReceivableService } from 'src/app/services/financeModule/payment-receivable.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-account-receivable',
  templateUrl: './account-receivable.component.html',
  styleUrls: ['./account-receivable.component.css']
})
export class AccountReceivableComponent implements OnInit {

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
  amountReceivableForm: FormGroup;
  uploadForm: FormGroup;
  CreatedBy = localStorage.getItem('UserID');
  file: any;
  PaymentReceivableList = []
  @ViewChild('closeBtn') closeBtn: ElementRef;
  numberRangeList: any;
  NextNumber: any;
  autoGenerateCodeList: any;
  formattedDate: any;
  registerCode = '';
  file1: any;
  resultValur: string[];
  resultValues: any;
  formattedErrorMessages: string;
  isAccess: boolean = false;
  TemplateUploadURL = this.globals.TemplateUploadURL;

  openPopup() {
    debugger
    this.getPermissionListForCreate(593);
  }


  formatErrorMessages(): string {
    const groupedErrors: { [key: string]: string[] } = {};

    // Group errors by RowNumber
    this.resultValur.forEach(errorMessage => {
      const rowNumber = errorMessage.match(/RowNumber: (\d+)/);
      if (rowNumber) {
        const key = rowNumber[1];
        groupedErrors[key] = groupedErrors[key] || [];
        groupedErrors[key].push(errorMessage.replace(`RowNumber: ${key}, `, ''));
      }
    });

    // Join grouped errors with line breaks
    return Object.keys(groupedErrors).map(key => {
      return `RowNumber: ${key}, ${groupedErrors[key].join('<br>')}`;
    }).join('<br>');
  }

  constructor(
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private PaymentReceivableService: PaymentReceivableService,
    private ps: PaginationService,
    private autoGenerationCodeService: AutoGenerationCodeService,
    public autoCodeService: AutoCodeService,
    private globals: Globals,
    private dataService: DataService,

  ) { }

  ngOnInit(): void {
    this.CreateForm();
    this.getPaymentReceivableList();
    this.getNumberRange();
  
  }

  

  CreateForm() {
    this.amountReceivableForm = this.fb.group({
      OBReference: [''],
      Customer: [''],
      Invoice: [''],
      Amount: [''],
    });

    this.uploadForm = this.fb.group({
      RegistrationCode: [this.registerCode],
      UploadDate: [this.getCurrentDate()],
      FileName: [''],
    });
  }
  getCurrentDate(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  setPage(page: number) {
    if (this.PaymentReceivableList.length) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
      // get pager object from service
      this.pager = this.ps.getPagers(this.PaymentReceivableList.length, page);

      // get current page of items
      this.pagedItems = this.PaymentReceivableList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.pagedItems = [];
    }
  }
  getPaymentReceivableList() {
    const payload = this.amountReceivableForm.value
    this.PaymentReceivableService.GetPaymentReceivableList(payload).subscribe((result) => {
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.PaymentReceivableList = result.data.Table;
        this.setPage(1);
      } else {
        this.PaymentReceivableList = []
        this.pagedItems = [];
      }
    })
  }

  documentSelected(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0].name;
      const name = this.file.split('.')
      const finalName = name[1].toLowerCase()
      this.file1 = event.target.files;

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
    // this.amountReceivableForm.reset();
    this.CreateForm();
    this.getPaymentReceivableList()
  }

  closeModal(): void {
    this.file = '';
    this.closeBtn.nativeElement.click();
  }

  editDivision(data: any) {
    let value = data

    this.router.navigate(['/views/transactions/openingBalances/account-receivable-detail', { id: value }])
  }

  checkUpdatePerission(id) {
    debugger
    this.getPermissionListForUpdate(593, id);
  }

  search() {
    this.getPaymentReceivableList()
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

    if (event) {
      var Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Accounts Receivable');

      if (Info.length > 0) {

        let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
        let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);

        if (code)
          // this.registerCode = this.uploadForm.controls['RegistrationCode'].setValue(code.trim().toUpperCase());
          // this.uploadForm.patchValue({
          //   RegistrationCode: this.uploadForm.controls['RegistrationCode'].setValue(code.trim().toUpperCase())
          // });
          this.uploadForm.value.RegistrationCode = code
        this.registerCode = this.uploadForm.value.RegistrationCode
      }
      else {
        this.registerCode = ''
        Swal.fire('Please create the auto-generation code for Account Receivable.')
        return
      }

    }
    console.log(this.uploadForm.value, 'sxdfgsfghuis');

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

    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Accounts Receivable');
    if (Info.length > 0) {
      // this.uploadForm.value.RegistrationCode = Info[0].NextNumber
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

      this.uploadForm.value.RegistrationCode = this.registerCode




      let employeeMaster = new FormData();
      employeeMaster.append('file', this.file1[0]);
      employeeMaster.append('createdBy', this.CreatedBy);
      employeeMaster.append('Registrationcode', this.uploadForm.value.RegistrationCode);
      employeeMaster.append('OBDate', this.formattedDate)

      console.log(employeeMaster)


      this.PaymentReceivableService.upload(employeeMaster).subscribe((result: any) => {
        if (result.message == "Success") {
          this.file = '';
          Swal.fire(result.result[0]);
          this.file = '';
          this.closeModal();
          this.updateAutoGenerated()
          this.getPaymentReceivableList();
        this.PaymentReceivableService.uploadTransJournal({Type:"1"}).subscribe((result: any) => {
          if (result.message === "Success") {
            console.log(result.message, 'Success');
          } else {
              // Handle the case where uploadTransJournal does not succeed
              Swal.fire('Failed to upload transaction journal due to ' + result.message);
            }
          }, (error) => {
            Swal.fire("Error uploading transaction journal");
          });
        } else {
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

            this.router.navigate(['/views/transactions/openingBalances/account-receivable-detail', { id: id }])

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
