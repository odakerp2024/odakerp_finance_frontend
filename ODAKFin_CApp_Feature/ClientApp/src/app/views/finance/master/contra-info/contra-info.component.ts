import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PaginationService } from "src/app/pagination.service";
import { AutoCodeService } from "src/app/services/auto-code.service";
import { AutoGenerationCodeService } from "src/app/services/auto-generation-code.service";
import { CommonService } from "src/app/services/common.service";
import { ContraVoucherService } from "src/app/services/contra-voucher.service";
import Swal from "sweetalert2";
import { Table } from "../../../../model/financeModule/credit";
import { Globals } from "src/app/globals";
import { DataService } from "src/app/services/data.service";
import { resolve } from "dns";
import { rejects } from "assert";
import { INFERRED_TYPE } from "@angular/compiler/src/output/output_ast";
import { HttpErrorResponse, HttpEventType, HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-contra-info",
  templateUrl: "./contra-info.component.html",
  styleUrls: ["./contra-info.component.css"],
})
export class ContraInfoComponent implements OnInit {
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromMaxDate = this.minDate;
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  editSelectedDocument: any;
  documentTableList = [];
  // exchangeTableList = [];
  contraForm: any;
  statusList: any = [];
  FileList: any = [];
  ModifiedOn: any;
  ModifiedBy: any;
  CreatedBy = localStorage.getItem("UserID");
  CreatedOn: any;
  divisionList = [];
  officeList = [];
  currencyList: any;
  paymentModeList = [];
  bankList = [];
  fromAccount: any;
  toAccount: any;
  FilePath: any;
  isUpdate = false;
  numberRangeList = [];
  contra_voucher_code = "";
  uploadFileName = "";
  uploadFilePath = "";
  contraId: number = 0;
  CreatedDate = new Date();
  UpdatedBy = localStorage.getItem("UserID");
  isEditMode: Boolean = true;
  isEditMode1: Boolean = false;
  isCopied: Boolean = false;
  IsFinal = false;
  OrgId = localStorage.getItem("OrgId");
  entityDetails: any;
  entityCurrency: any;
  entityCurrencyId: any;
  entityCurrencyName: any;
  isSameCurrency = false;
  exchangePairDetails = [];
  receivedCurrencyName = '';
  showExchangeRate: Boolean = false;
  ContraVoucherId_copy: any;
  selectedFile: File = null;
  fileUrl: string;
  entityDateFormat =
    this.commonDataService.getLocalStorageEntityConfigurable("DateFormat");
  statusId: string;
  constructor(
    private ps: PaginationService,
    private contraVoucherService: ContraVoucherService,
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private commonservice: CommonService,

    private autoGenerationCodeService: AutoGenerationCodeService,
    private autoCodeService: AutoCodeService,
    private route: ActivatedRoute,
    private globals: Globals,
    private dataService: DataService,
    private router: Router
  ) {
    this.createForm();
  }

  async ngOnInit(): Promise<void> {
    this.getBankList();
    this.getDivisionList();
    this.getStatus();
    // this.getOffice();
    this.getModeOfPayment();
    this.getNumberRangeList();
    await this.getCurrency();
    await this.getEntityDetails();
    this.route.params.subscribe(async (param) => {
      this.contraId = +param["contraId"] ? +param["contraId"] : 0;
      if (this.contraId) {
        this.getByIdRotueFunctionality();
        // this.isUpdate = true
      } else if (param.copy_id) {
        this.isCopied = true;
        this.copyAndPasteFromOldvoucher(param.copy_id);
      }
    });
  }

  async getByIdRotueFunctionality() {
    this.isUpdate = true;

    let contraData: any = await this.getContraById();
    if (contraData.IsFinal === true) {
      this.IsFinal = true;
    }
    this.contraForm.disable();
    this.isEditMode = false;
    this.isEditMode1 = false;
  }

  createForm() {
    this.contraForm = this.fb.group({
      ContraVoucherId: [0],
      DivisionId: [""],
      OfficeId: [""],
      ContraVoucherNumber: [""],
      ContraVoucherDate: [''],
      FromAccount: [""],
      ToAccount: [""],
      ReferenceNo: [""],
      AmountPaid: [""],
      CurrencyName: [""],
      CurrencyId: [""],
      ModeofPaymentId: [""],
      Remarks: [""],
      ExchangeRateId: [""],
      TotalAmount: [0],
      // CreatedDate:[this.minDate],
      // CreatedBy: [this.CreatedBy],
      // UpdatedBy: [this.CreatedBy],
      IsFinal: [0],
      StatusId: [1],
      Rate: [0],
      IsDelete: [0],
      CurrentExRate: [0],
      CreatedBy: [localStorage.getItem("UserID")],
      UpdatedBy: [localStorage.getItem("UserID")],
      Exchange: [1],
    });
    const statusId = this.contraForm.get('StatusId').value;
    this.contraForm.get('StatusId').setValue(statusId == 1 ? 'Draft' : statusId == 2 ? 'Confirmed' : 'Cancelled');
  }

  getStatusDisplayValue(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Draft';
      case 2:
        return 'Confirmed';
      case 3:
        return 'Canceled';
      default:
        return '';
    }
  }
  async patchForm(contra) {
    // ! set to account
    const toAccount = this.bankList?.filter(
      (res) => res.BankID != +contra.FromAccount
    );
    this.toAccount = toAccount;
    await this.getOffice(contra.DivisionId);
    this.contraForm.patchValue({
      ContraVoucherId: contra.ContraVoucherId,
      DivisionId: contra.DivisionId,
      OfficeId: contra.OfficeId,
      ContraVoucherNumber: contra.ContraVoucherNumber,
      ContraVoucherDate: this.datePipe.transform(
        contra.ContraVoucherDate,
        "yyyy-MM-dd"
      ),
      FromAccount: contra.FromAccount,
      ToAccount: contra.ToAccount,
      ReferenceNo: contra.ReferenceNo,
      AmountPaid: contra.AmountPaid,
      CurrencyName: contra.CurrencyName,
      CurrencyId: contra.CurrencyId,
      Exchange: contra.Exchange,
      ModeofPaymentId: contra.ModeofPaymentId,
      Remarks: contra.Remarks,
      ExchangeRateId: contra.ExchangeRateId,
      TotalAmount: +contra.TotalAmount,
      CreatedDate: contra.CreatedDate,
      CreatedBy: contra.CreatedBy,
      UpdatedBy: +this.UpdatedBy,
      IsFinal: contra.IsFinal ? 1 : 0,
      StatusId: contra.StatusId,
      IsDelete: contra.IsDelete ? contra.IsDelete : 0,
      CurrentExRate: contra.CurrentExRate ? contra.CurrentExRate : 0,
    });

    // set exchange rate
    if (contra.CurrentExRate) {
      this.showExchangeRate = true;
    }

    if (+this.entityCurrencyId === +contra.CurrencyId) {
      this.isSameCurrency = true;
    }
    this.getsExchangeRate();
  }

  async copyAndPasteFromOldvoucher(ContraVoucherId_copy) {
    this.isCopied = true;
    var service = `${this.globals.APIURL}/ContraVoucher/GetContraVoucherId`;
    this.dataService
      .post(service, { ContraVoucherId: ContraVoucherId_copy })
      .subscribe(async (result: any) => {
        // this.ContraVoucherId_copy = result;

        if (result.message == "Success" && result.data.Table.length > 0) {
          // await this.autoCodeGeneration('Contra Voucher');
          let info = result.data.Table[0];
          const toAccount = this.bankList.filter(
            (res) => res.BankID != +info.FromAccount
          );
          this.toAccount = toAccount;
          await this.getOffice(info.DivisionId);

          this.contraForm.patchValue({
            ContraVoucherId: 0,
            DivisionId: info.DivisionId,
            OfficeId: info.OfficeId,
            ContraVoucherNumber: "",
            ContraVoucherDate: info.ContraVoucherDate,
            FromAccount: info.FromAccount,
            ToAccount: info.ToAccount,
            ReferenceNo: info.ReferenceNo,
            CurrencyName: info.CurrencyName,
            CurrencyId: info.CurrencyId,
            Exchange: info.Exchange,
            ModeofPaymentId: info.ModeofPaymentId,
            CreatedDate: info.CreatedDate,
            CreatedBy: info.CreatedBy,
            UpdatedBy: info.UpdatedBy,
            IsFinal: 0,
            StatusId: 1,
            IsDelete: 0,
            CurrentExRate: 0,
          });
        }
      });
  }

  getContraById() {
    // this.showExchangeRate = true;

    return new Promise((resolve, rejects) => {
      const payload = {
        ContraVoucherId: this.contraId,
      };
      this.contraVoucherService.getById(payload).subscribe((result: any) => {
        if (result.message == "Success") {
          const contraData = result["data"].Table;
          this.CreatedOn = this.datePipe.transform(
            result["data"].Table[0]["CreatedDate"],
            this.datePipe.transform(new Date(), "dd-MM-yyyy")
          );
          this.CreatedBy = localStorage.getItem("UserName");
          this.ModifiedOn = this.datePipe.transform(
            result["data"].Table[0]["UpdatedOn"],
            this.datePipe.transform(new Date(), "dd-MM-yyyy")
          );
          this.ModifiedBy = localStorage.getItem("UserName");
          if (contraData.length) {
            this.patchForm(contraData[0]);
          }
          // Assuming `StatusId` is available in contraData[0]
  const statusId = contraData[0]['StatusId'];
 this.getStatusDescription(statusId);
          let documentList = result["data"].Table1;
          // documentList.forEach(element => {
          //   element.UpdatedBy = +this.UpdatedBy;
          //   element.Updateddate = this.CreatedDate;
          // });
          this.documentTableList = documentList;
          resolve(contraData[0]);
        }
        resolve(0);
      });
    });
  }


  getStatusDescription(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Draft';
      case 2:
        return 'Confirmed';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
  
  
  onFileSelected(index: any) {
    this.editSelectedDocument = index;
  }

  deleteDocument(index) {
    if (this.IsFinal) {
      Swal.fire("Final");
      return;
    }

    if (!this.isEditMode) {
      Swal.fire("Please Click Edit Button to Update");
      return;
    }

    this.documentTableList.splice(index, 1);
  }

  documentSelected(event) {
    if (this.IsFinal) {
      Swal.fire("Final");
      return;
    }

    if (!this.isEditMode) {
      Swal.fire("Please Click Edit Button to Update");
      return;
    }

    if (event.target.files.length > 0) {
      this.uploadFilePath = event.target.files[0].name;
      this.uploadFileName = event.target.files[0].name;
    }
    this.uploadDocument(event);
  }

  uploadDocument(event) {
    if (event) {
      this.selectedFile = event.target.files[0];
      const filedata = new FormData();
      filedata.append('file', this.selectedFile, this.selectedFile.name)
      let validation = "";
      if (
        this.documentTableList.length >= 5 &&
        this.uploadFilePath &&
        this.uploadFileName
      ) {
        validation +=
          "<span style='color:red;'>*</span> <span>You can upload Maximum of 5 </span></br>";
        Swal.fire(validation);
        return true;
      }
      this.commonservice.AttachUpload(this.selectedFile).subscribe(data => {
        if (data) {
          const payload = {
            BankAttachmentsID: 0,
            ContraVoucherId: 0,
            DocumentName: this.uploadFilePath,
            FilePath: this.uploadFileName,
            UniqueFilePath: data.FileNamev,
          };
          this.documentTableList.push(payload);
          this.documentUploadReset();
        }
        (error: HttpErrorResponse) => {
          Swal.fire(error.message, 'error')
        };
      });

    }

  }

  /*File Download*/
  download = (fileUrl) => {
    this.fileUrl = "UploadFolder\\Attachments\\" + fileUrl;
    this.commonDataService.download(fileUrl).subscribe((event) => {

      if (event.type === HttpEventType.UploadProgress) {

      }
      // this.progress1 = Math.round((100 * event.loaded) / event.total);

      else if (event.type === HttpEventType.Response) {
        // this.message = 'Download success.';
        this.downloadFile(event);
      }
    });
  }

  private downloadFile = (data: HttpResponse<Blob>) => {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = this.fileUrl;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }


  documentUploadReset() {
    this.uploadFilePath = "";
    this.uploadFileName = "";
  }

  getDivisionList(filter?: string) {
    this.contraVoucherService.getDivision({}).subscribe(
      (result: any) => {
        this.divisionList = [];
        if (result.data.Table.length > 0) {
          this.divisionList = result.data.Table;
        }
      },
      (error) => { }
    );
  }

  getOffice(DivisionId) {
    return new Promise((resolve, reject) => {
      const payload = { DivisionId };
      this.commonDataService.getOfficeByDivisionId(payload).subscribe(
        (result: any) => {
          this.officeList = [];
          this.contraForm.controls["OfficeId"].setValue("");
          if (result.message == "Success") {
            if (result.data && result.data.Table.length > 0) {
              this.officeList.push(...result.data.Table);
              resolve(true);
            }
          }
        },
        (error) => {
          reject();
        }
      );
    });
  }


  getCurrency() {
    return new Promise((resolve, rejects) => {
      const payload = { "currencyId": 0, "countryId": 0 };
      let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
      this.dataService.post(service, {}).subscribe((result: any) => {
        if (result.length > 0) {
          this.currencyList = result;
          const entityInfo: any = this.commonDataService.getLocalStorageEntityConfigurable();
          let info = this.currencyList.find(x => x.Currency == entityInfo.Currency);
          let currencyCode = entityInfo.Currency.split('-');
          this.receivedCurrencyName = currencyCode[0].trim();
          resolve(true)
        }
      });
    })
  }

  disableField() {
    this.showExchangeRate = true;
  }

  getModeOfPayment() {
    this.contraVoucherService.getModeOfPayment({}).subscribe((result: any) => {
      if (result.message == "Success") {
        this.paymentModeList = result["data"].Table;
      }
    });
  }

  getBankList() {
    let payload = {
      OfficeId: 0,
      DivisionId: 0,
    };

    this.commonDataService
      .getBankByOfficeId(payload)
      .subscribe((result: any) => {
        if (result.message == "Success") {
          // console.log(result['data'].Table)
          this.bankList = result["data"].Table;
          this.fromAccount = this.bankList;
        }
      });
  }

  getToAccount(fromAccountId) {
    this.contraForm.controls["ToAccount"].setValue("");
    const toAccount = this.bankList?.filter(
      (res) => res.BankID != +fromAccountId
    );
    this.toAccount = toAccount;
  }

  contraDetailsValidation(): string {
    const contraDetails = this.contraForm.value;
    let validation = "";

    if (!contraDetails.DivisionId) {
      validation += this.getValidationMessage("Please Select Division");
    }

    if (!contraDetails.OfficeId) {
      validation += this.getValidationMessage("Please Select Office");
    }

    if (!contraDetails.ContraVoucherDate) {
      validation += this.getValidationMessage("Please Select Contra Date");
    }

    if (!contraDetails.FromAccount) {
      validation += this.getValidationMessage("Please Select From Account");
    }

    if (!contraDetails.ToAccount) {
      validation += this.getValidationMessage("Please Select To Account");
    }

    if (!contraDetails.ReferenceNo && contraDetails.ModeofPaymentId != 2) {
      validation += this.getValidationMessage("Please Enter Reference No");
    }

    if (!contraDetails.AmountPaid) {
      validation += this.getValidationMessage("Please Enter Amount");
    }

    if (!contraDetails.CurrencyId) {
      validation += this.getValidationMessage("Please Select Amount Currency");
    }

    if (!contraDetails.Exchange) {
      validation += this.getValidationMessage("Please Enter Exchange Rates");
    }

    if (!contraDetails.ModeofPaymentId) {
      validation += this.getValidationMessage("Please Select Mode Of Payment");
    }

    return validation;
  }
  
  getExchangeRate() {
    const payload = {
      FromCurrencyId: +this.entityCurrencyId,
      ToCurrencyId: +this.contraForm.controls["CurrencyId"].value,
    };


    if (payload.FromCurrencyId !== payload.ToCurrencyId) {
      this.contraForm.controls["Exchange"].setValue(null);
      this.isSameCurrency = false;
    } else {
      this.isSameCurrency = true;
      // Optionally clear the value of ExchangeRates if needed
      this.contraForm.controls["Exchange"].setValue(1);
    }
  }
  getsExchangeRate() {

    this.isSameCurrency = false;

  }

  private getValidationMessage(message: string): string {
    return `<span style='color:red;'>*</span> <span>${message}</span><br>`;
  }

  getNumberRangeList() {
    this.autoGenerationCodeService
      .getNumberRangeList({ Id: 0 })
      .subscribe((result) => {
        if (result.message == "Success") {
          this.numberRangeList = result["data"].Table;
        }
      });
  }

  // autoCodeGeneration() {
  //   return new Promise((resolve, reject) => {
  //     // if (!this.isUpdate) {
  //       let paymentVoucher = this.numberRangeList.filter(x => x.ObjectName == 'Contra Voucher');
  //       if (paymentVoucher.length > 0) {
  //         let code = this.autoCodeService.numberRange(paymentVoucher[0],'PAY');
  //         if (code) this.contraForm.controls['ContraVoucherNumber'].setValue(code.trim().toUpperCase());
  //         this.contra_voucher_code = code.trim().toUpperCase();
  //         resolve(true);
  //       }
  //       else {
  //         Swal.fire('Please create the auto-generation code for Contra Voucher.');
  //         reject(false)
  //       }
  //   // }
  //   });
  // }

  async autoCodeGeneration(event: any) {
    return new Promise(async (resolve, reject) => {
      if (this.isUpdate) {
        if (event) {
          let paymentVoucher = this.numberRangeList.filter(
            (x) => x.ObjectName == "Contra Voucher"
          );
          if (paymentVoucher.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem(
              [
                { sectionA: paymentVoucher[0].SectionA },
                { sectionB: paymentVoucher[0].SectionB },
                { sectionC: paymentVoucher[0].SectionC },
                { sectionD: paymentVoucher[0].SectionD },
              ],
              paymentVoucher[0].NextNumber,
              event
            );
            let code = this.autoCodeService.NumberRange(
              paymentVoucher[0],
              sectionOrderInfo.sectionA,
              sectionOrderInfo.sectionB,
              sectionOrderInfo.sectionC,
              sectionOrderInfo.sectionD
            );

            if (code)
              this.contraForm.controls["ContraVoucherNumber"].setValue(
                code.trim().toUpperCase()
              );
            resolve(true);
          } else {
            Swal.fire(
              "Please create the auto-generation code for Contra Voucher."
            );
            resolve(false);
          }
        } else {
          this.contraForm.controls["ContraVoucherNumber"].setValue("");
          reject(false);
        }
      }
    });
  }

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = "";
    var sectionB = "";
    var sectionC = "";
    var sectionD = "";
    var officeInfo: any = {};
    var divisionInfo: any = {};
    const contraDetails = this.contraForm.value;
    if (contraDetails.DivisionId && contraDetails.OfficeId) {
      officeInfo = this.officeList.find((x) => x.ID == contraDetails.OfficeId);
      divisionInfo = this.divisionList.find(
        (x) => x.ID == contraDetails.DivisionId
      );
    }

    for (var i = 0; i < sectionInfo.length; i++) {
      var condition =
        i == 0
          ? sectionInfo[i].sectionA
          : i == 1
            ? sectionInfo[i].sectionB
            : i == 2
              ? sectionInfo[i].sectionC
              : i == 3
                ? sectionInfo[i].sectionD
                : sectionInfo[i].sectionD;
      switch (condition) {
        case "Office Code (3 Chars)":
          i == 0
            ? (sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : "")
            : i == 1
              ? (sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : "")
              : i == 2
                ? (sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : "")
                : i == 3
                  ? (sectionD = officeInfo.OfficeName)
                  : "";
          break;
        case "Running Number (3 Chars)":
          i == 0
            ? (sectionA = runningNumber)
            : i == 1
              ? (sectionB = runningNumber)
              : i == 2
                ? (sectionC = runningNumber)
                : i == 3
                  ? (sectionD = runningNumber)
                  : "";
          break;
        case "Running Number (4 Chars)":
          i == 0
            ? (sectionA = runningNumber)
            : i == 1
              ? (sectionB = runningNumber)
              : i == 2
                ? (sectionC = runningNumber)
                : i == 3
                  ? (sectionD = runningNumber)
                  : "";
          break;
        case "Running Number (5 Chars)":
          i == 0
            ? (sectionA = runningNumber)
            : i == 1
              ? (sectionB = runningNumber)
              : i == 2
                ? (sectionC = runningNumber)
                : i == 3
                  ? (sectionD = runningNumber)
                  : "";
          break;
        case "Running Number (6 Chars)":
          i == 0
            ? (sectionA = runningNumber)
            : i == 1
              ? (sectionB = runningNumber)
              : i == 2
                ? (sectionC = runningNumber)
                : i == 3
                  ? (sectionD = runningNumber)
                  : "";
          break;
        case "Running Number (7 Chars)":
          i == 0
            ? (sectionA = runningNumber)
            : i == 1
              ? (sectionB = runningNumber)
              : i == 2
                ? (sectionC = runningNumber)
                : i == 3
                  ? (sectionD = runningNumber)
                  : "";
          break;
        case "Office Code (4 Chars)":
          i == 0
            ? (sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : "")
            : i == 1
              ? (sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : "")
              : i == 2
                ? (sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : "")
                : i == 3
                  ? (sectionD = officeInfo.OfficeName)
                  : "";
          break;
        case "Division Code (4 Chars)":
          i == 0
            ? (sectionA = divisionInfo.DivisionName
              ? divisionInfo.DivisionName
              : "")
            : i == 1
              ? (sectionB = divisionInfo.DivisionName
                ? divisionInfo.DivisionName
                : "")
              : i == 2
                ? (sectionC = divisionInfo.DivisionName
                  ? divisionInfo.DivisionName
                  : "")
                : i == 3
                  ? (sectionD = divisionInfo.DivisionName
                    ? divisionInfo.DivisionName
                    : "")
                  : "";
          break;
        case "Division Code (3 Chars)":
          i == 0
            ? (sectionA = divisionInfo.DivisionName
              ? divisionInfo.DivisionName
              : "")
            : i == 1
              ? (sectionB = divisionInfo.DivisionName
                ? divisionInfo.DivisionName
                : "")
              : i == 2
                ? (sectionC = divisionInfo.DivisionName
                  ? divisionInfo.DivisionName
                  : "")
                : i == 3
                  ? (sectionD = divisionInfo.DivisionName
                    ? divisionInfo.DivisionName
                    : "")
                  : "";
          break;
        case "FY (4 Char e.g. 2023)":
          i == 0
            ? (sectionA = "")
            : i == 1
              ? (sectionB = "")
              : i == 2
                ? (sectionC = "")
                : i == 3
                  ? (sectionD = "")
                  : "";
          break;
        case "FY (5 Char e.g. 22-23)":
          i == 0
            ? (sectionA = "")
            : i == 1
              ? (sectionB = "")
              : i == 2
                ? (sectionC = "")
                : i == 3
                  ? (sectionD = "")
                  : "";
          break;
        case "FY (6 Char e.g. FY2023)":
          i == 0
            ? (sectionA = "")
            : i == 1
              ? (sectionB = "")
              : i == 2
                ? (sectionC = "")
                : i == 3
                  ? (sectionD = "")
                  : "";
          break;
        case "FY (7 Char e.g. FY22-23)":
          i == 0
            ? (sectionA = "")
            : i == 1
              ? (sectionB = "")
              : i == 2
                ? (sectionC = "")
                : i == 3
                  ? (sectionD = "")
                  : "";
          break;
        case "POD Port Code (3 Char)":
          i == 0
            ? (sectionA = "")
            : i == 1
              ? (sectionB = "")
              : i == 2
                ? (sectionC = "")
                : i == 3
                  ? (sectionD = "")
                  : "";
          break;
        case "POFD Port Code (3 Char)":
          i == 0
            ? (sectionA = "")
            : i == 1
              ? (sectionB = "")
              : i == 2
                ? (sectionC = "")
                : i == 3
                  ? (sectionD = "")
                  : "";
          break;
        default:
          break;
      }
    }
    return {
      sectionA: sectionA,
      sectionB: sectionB,
      sectionC: sectionC,
      sectionD: sectionD,
    };
  }

  updateAutoGenerated() {
    let Info = this.numberRangeList.filter(
      (x) => x.ObjectName == "Contra Voucher"
    );
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService
        .post(service, {
          NumberRangeObject: {
            Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }],
          },
        })
        .subscribe(
          (result: any) => {
            if (result.message == "Success") {
              Swal.fire(result.data);
            }
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  setCurrencyId(CurrencyID) {
    const currencyDetails = this.currencyList.find((curr) => curr.ID == CurrencyID);
    this.receivedCurrencyName = currencyDetails.CurrencyCode;
    this.contraForm.controls['CurrencyName'].setValue(currencyDetails.CurrencyCode);
    this.contraForm.controls['CurrencyId'].setValue(currencyDetails.ID)
    // this.contraForm.controls['CurrencyId'].setValue(currencyDetails.CurrencyID)

    // this.contraForm.controls['TotalAmount'].setValue(Number(this.contraForm.value.AmountPaid) * Number(this.contraForm.value.Rate));
    // this.contraForm.controls['TotalAmount'].setValue(Number(this.contraForm.value.AmountPaid) * Number(this.contraForm.value.CurrentExRate));
    this.contraForm.controls["TotalAmount"].setValue(
      Number(this.contraForm.value.AmountPaid)
    );
    var CurrencyCode = "";
    var entityCurrency = "";
    CurrencyCode = currencyDetails.CurrencyCode.toLowerCase();
    entityCurrency = this.entityCurrency.toLowerCase();
    if (entityCurrency.includes(CurrencyCode)) {
      this.isSameCurrency = true;
    } else {
      this.isSameCurrency = false;
    }
  }

  calculateLocalAmount() {
    if (this.contraForm.value.AmountPaid && !this.isSameCurrency) {
      const data = (
        Number(this.contraForm.value.AmountPaid) *
        Number(this.contraForm.value.Exchange)
      ).toFixed(this.entityFraction);
      this.contraForm.controls["TotalAmount"].setValue(Number(data));
    } else {
      this.contraForm.controls["TotalAmount"].setValue(
        Number(this.contraForm.value.AmountPaid)
      );
    }
  }

  async saveContra(isDelete = false) {
    if (this.IsFinal) {
      Swal.fire("draft");
      return;
    }

    // set Delete flag
    if (isDelete) {
      this.contraForm.controls["IsDelete"].setValue(1); // Need to uncomment
    }

    const validationContra = this.contraDetailsValidation();
    if (validationContra !== "") {
      Swal.fire(validationContra);
      return;
    }

    const saveMsg = `Do you want to save this Details?`;
    const deleteMsg = `Do you want to Delete this Details?`;

    Swal.fire({
      showCloseButton: true,
      title: "",
      icon: "question",
      text: isDelete ? deleteMsg : saveMsg,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const ContraVoucherNumber = this.contraForm.controls['ContraVoucherNumber'].value;
        // if(ContraVoucherNumber === "" ){
        //   await this.autoCodeGeneration('Contra Voucher');
        //   this.updateAutoGenerated();
        //   const payload = {
        //     "contraVoucher": {
        //         "Table": [this.contraForm.value],
        //         "Table1": [...this.documentTableList]
        //     }
        //   }
        //   this.submitData(payload, 'draft');
        // } else {
        //   const payload = {
        //     "contraVoucher": {
        //         "Table": [this.contraForm.value],
        //         "Table1": [...this.documentTableList]
        //     }
        //   }
        //   this.submitData(payload, 'draft');
        // }
   // Set the StatusId based on the current value
   const statusId = this.contraForm.get('StatusId').value;
   switch (statusId) {
     case 'Draft':
      this.contraForm.value.StatusId = 1;
       break;
     case 'Confirmed':
      this.contraForm.value.StatusId = 2;
       break;
     case 'Cancelled':
      this.contraForm.value.StatusId = 3;
       break;
     default:
      this.contraForm.value.StatusId = 1;  // Default to Draft if none matches
   }
        const payload = {
          contraVoucher: {
            Table: [this.contraForm.value],
            Table1: [...this.documentTableList],
          },
        };
        this.submitData(payload, "draft", isDelete);
      }
    });
  }

  async finalSaveContra() {
    if (this.IsFinal) {
      Swal.fire("Final");
      return;
    }

    const validationContra = this.contraDetailsValidation();
    if (validationContra !== "") {
      Swal.fire(validationContra);
      return;
    }
    // const contraCode = await this.autoCodeGeneration();

    Swal.fire({
      showCloseButton: true,
      title: "",
      icon: "question",
      html: ` Final voucher not possible to edit <br> Do you want proceed?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const ContraVoucherNumber = this.contraForm.controls['ContraVoucherNumber'].value;
        // if(ContraVoucherNumber === "" ){

        //  await this.autoCodeGeneration('Contra Voucher');
        //   this.updateAutoGenerated();
        //   const Table = this.contraForm.value;
        //   Table.IsFinal = 1; // ! set the final Value;
        //   Table.StatusId = 2;

        //   const payload = {
        //     "contraVoucher": {
        //         "Table": [Table],
        //         "Table1": [...this.documentTableList]
        //     }
        //   }
        //   this.submitData(payload , 'final')
        // } else {
        //   const Table = this.contraForm.value;
        //   Table.IsFinal = 1; // ! set the final Value;
        //   Table.StatusId = 2;
        //   const payload = {
        //     "contraVoucher": {
        //         "Table": [Table],
        //         "Table1": [...this.documentTableList]
        //     }
        //   }
        //   this.submitData(payload , 'final')
        // }
        await this.autoCodeGeneration("Contra Voucher");
        const isContraNumber = await this.autoCodeGeneration("Contra Voucher");
        if (!isContraNumber) {
          Swal.fire("Failed to Genrate the Auto Generate Code");
          return;
        }
        // return
        this.updateAutoGenerated();
        const Table = this.contraForm.value;
        Table.IsFinal = 1; // ! set the final Value;
        Table.StatusId = 'Confirmed';

        // Set the StatusId based on the current value
        const statusId = this.contraForm.get('StatusId').value;
        switch (statusId) {
          case 'Draft':
            Table.StatusId = 1;
            break;
          case 'Confirmed':
            Table.StatusId = 2;
            break;
          case 'Cancelled':
            Table.StatusId = 3;
            break;
          default:
            Table.StatusId = 2;  // Default to Draft if none matches
        }

       
        const payload = {
          contraVoucher: {
            Table: [Table],
            Table1: [...this.documentTableList],
          },
        };

        this.submitData(payload, "final");
      }
    });
  }
  async CancelContra() {
    if (this.IsFinal) {
      // Swal.fire("cancel");
      this.backToMain();
      return;
    } else {
      Swal.fire({
        showCloseButton: true,
        title: "",
        icon: "question",
        html: ` Voucher is not yet finalized <br> Do you want to still exit ?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: false,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          {
            this.backToMain();
          }
        }
      });
    }
  }

  submitData(payload, type, isDelete = false) {
    this.contraVoucherService.saveContra(payload).subscribe((result: any) => {
      if (result.message == "Success") {
        // const validation = this.getValidationMessage(result.data);
        Swal.fire(result.message, "", "success");

        if (type === "draft") {
          this.isEditMode = false;
          this.isEditMode1 = true;
          const contraId = result.data.Id;
          this.contraId = +contraId;
          // this.contraForm.controls['ContraVoucherId'].setValue(Number(result.data.Id)) ;
          this.editContravoucher(contraId);
        }

        if (type === "final" || isDelete) {
          this.backToMain();
        }
        // this.backToMain();
        return;
      }
    });
  }

  editContravoucher(id: number) {
    this.router.navigate([
      "/views/contra-info/contra-info-view",
      { contraId: id },
    ]);
    // this.getByIdRotueFunctionality();
  }

  getStatus() {
    var service = `${this.globals.APIURL}/Common/GetStatusDropDownList`;
    var payload: any = {};
    this.dataService.post(service, payload).subscribe(
      (result: any) => {
        // console.log(result, 'status result')
        this.statusList = result.data.Table;
      },
      (error) => { }
    );
  }
  enableEdit() {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 505,
    };
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(
      (data) => {
        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {
            if (data[0].Update_Opt != 2) {
              Swal.fire("Please Contact Administrator");
            } else {
              if (this.IsFinal) {
                Swal.fire("Final");
                return;
              }
              this.contraForm.enable();
              this.isEditMode = true;
              this.isEditMode1 = true;
            }
          } else {
            Swal.fire("Please Contact Administrator");
          }
        } else {
          Swal.fire("Please Contact Administrator");
        }
      },
      (err) => {
        console.log("errr----->", err.message);
      }
    );
  }

  deleteValue() {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 505,
    };
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(
      (data) => {
        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {
            if (data[0].Delete_Opt != 2) {
              Swal.fire("Please Contact Administrator");
            } else {
              this.saveContra(true);
            }
          } else {
            Swal.fire("Please Contact Administrator");
          }
        } else {
          Swal.fire("Please Contact Administrator");
        }
      },
      (err) => {
        console.log("errr----->", err.message);
      }
    );
  }

  getEntityDetails() {
    return new Promise((resolve, rejects) => {
      this.contraVoucherService
        .getEntityDetails({ OrgId: this.OrgId })
        // .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: any) => {
          if (result.message == "Success") {
            this.entityDetails = result.data;
            this.entityCurrency = this.entityDetails.Table1[0].Currency;
            const entityCurrencyCode = this.entityCurrency
              .split("-")[0]
              .replace(" ", "");
            let entityDetails = this.currencyList.find(
              (curr) => curr.CurrencyCode == entityCurrencyCode
            );
            if (entityDetails) {
              this.entityCurrencyId = entityDetails.ID;
              this.entityCurrencyName = entityDetails.CurrencyName;
            }
            // * set entity currency value as default for AMOUNT PAID and BANK CHARGES
            if (this.entityCurrencyId) {
              this.contraForm.controls["CurrencyId"].setValue(
                this.entityCurrencyId
              );
              this.contraForm.controls["CurrencyName"].setValue(
                entityDetails.CurrencyCode
              );
            }
            this.isSameCurrency = true;
            resolve(true);
          }
          resolve(true);
        });
    });
  }

  backToMain() {
    this.router.navigate(["/views/contra/contra-view"]);
  }
}
