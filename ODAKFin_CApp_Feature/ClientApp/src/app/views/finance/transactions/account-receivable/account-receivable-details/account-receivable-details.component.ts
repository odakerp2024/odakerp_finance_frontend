import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, map } from "rxjs/operators";
import { Globals } from "src/app/globals";
import { CommonService } from "src/app/services/common.service";
import { DataService } from "src/app/services/data.service";
import { PaymentReceivableService } from "src/app/services/financeModule/payment-receivable.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-account-receivable-details",
  templateUrl: "./account-receivable-details.component.html",
  styleUrls: ["./account-receivable-details.component.css"],
})
export class AccountReceivableDetailsComponent implements OnInit {
  entityDateFormat =
    this.commonDataService.getLocalStorageEntityConfigurable("DateFormat");
  entityFraction = Number(
    this.commonDataService.getLocalStorageEntityConfigurable("NoOfFractions")
  );
  accountReceivableId: any;
  CreatedOn: string = "";
  private ngUnsubscribe = new Subject<void>();
  CreatedBy = localStorage.getItem("UserID");
  ModifiedOn: string = "";
  ModifiedBy: string = "";
  entityDateFormat1 = this.commonDataService.convertToLowerCaseDayMonth(
    this.entityDateFormat
  );
  accountReceivableForm: FormGroup;
  isUpdate: Boolean = false;
  isCreate: Boolean = true;
  isUpdateButtonDisable: boolean = true;
  isSavemode: boolean;
  isEnable: any;
  isEditButton: boolean = false;
  resultValues: any[];
  formattedErrorMessages: string;
  divisionList: any = [];
  officeList: any = [];
  currencyList: any;
  customerList: any = [];
  CustomerCodeList: any = [];
  customerBranch: any;
  debitCreditList = [
    { value: 1, debitCreditName: "Debit" },
    { value: 0, debitCreditName: "Credit" },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private commonDataService: CommonService,
    private PaymentReceivableService: PaymentReceivableService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.CreateForm();
    this.getCurrency();
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.isUpdate = true;
        this.isCreate = false;
        this.accountReceivableForm.disable();
        // this.createReceiptForm();
        this.getDivisionList();
        // this.getCustomerList();
        this.accountReceivableId = parseInt(param.id);
        this.getAccountReceivableIdByID();
        // this.receiptForm.disable();
      }
    });
  }

  CreateForm() {
    this.accountReceivableForm = this.fb.group({
      Id: [0],
      OBReference: [""],
      OBDate: [""],
      Division: [""],
      DivisionId: [0],
      Office: [""],
      OfficeId: [0],
      Remarks: [""],
      Customer: [""],
      CustomerBranch: [""],
      Invoice: [""],
      InvoiceDate: [""],
      InvoiceCurrency: [""],
      InvoiceAmountICY: [""],
      Exchange: [""],
      InvoiceAmountCCY: [""],
      DebitorCredit: [""],
      DueAmountICY: [""],
      DueAmountCCY: [""],
      CreatedDate: [new Date()],
      ModifiedDate: [new Date()],
      CreatedBy: this.CreatedBy,
      UpdatedBy: [localStorage.getItem("UserID")],
    });
  }

  selectedCustomer(event: any, isUpdate = false) {
    const service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`;
    this.dataService.post(service, { CustomerId: event }).subscribe(
      (result: any) => {
        this.CustomerCodeList = [];
        if (result.data.Table3.length > 0) {
          this.CustomerCodeList = result.data.Table3;
        }
        console.log("okdd");
        // console.log(this.CustomerCodeList, 'customer list');
        if (!isUpdate) {
          this.accountReceivableForm.get("CustomerBranch").setValue("");
          // If customer has only one branch, auto-select it
          if (this.CustomerCodeList.length === 1) {
            this.accountReceivableForm
              .get("CustomerBranch")
              .setValue(this.CustomerCodeList[0].CustomerBranchID);
          }
        }
      },
      (error) => {}
    );
  }

  // getCustomerBranch(CustomerId) {
  //   debugger
  //   const customerDetails = this.CustomerCodeList.find(vendor => vendor.CustomerId === CustomerId);
  //   this.accountReceivableForm.controls['CustomerBranch'].setValue('');
  //   if (customerDetails) {
  //     this.customerBranch = this.CustomerCodeList.filter(vendor => vendor.CustomerName === customerDetails.CustomerName);
  //     if (this.customerBranch.length === 1) { // If customer has only one branch
  //       this.accountReceivableForm.controls['CustomerBranch'].setValue(this.customerBranch[0].CityName);
  //     }
  //   }
  // }

  getAccountReceivableIdByID() {
    debugger;
    const payload = this.accountReceivableId;
    var service = `${this.globals.APIURL}/AccountsReceivable/GetAccountInvoiceListById`;
    this.dataService
      .post(service, { Id: payload })
      .subscribe(async (result: any) => {
        console.log(result);
        if (result.message == "Success") {
          let info = result.data.Table[0];
          console.log(info, "iojwergiheruighawuihguiawheguiwahweguilheriug");
          this.CreatedOn = this.datePipe.transform(
            info.CreatedDate,
            this.entityDateFormat1
          );
          this.ModifiedOn = this.datePipe.transform(
            info.ModifiedDate,
            this.entityDateFormat1
          );
          this.isEnable = info.Isflag;
          if (this.isEnable == 1) {
            Swal.fire(
              "Updating or deleting the selected invoices is not feasible as they are already associated with a Receipt voucher"
            );
          } else if (this.isEnable == 0) {
            this.isEditButton = true;
            // this.isSavemode = true
          } else {
            // Swal.fire("Can't able to edit this invoice !");
            this.isEditButton = false;
          }
          await this.selectedCustomer(info.CustomerId, true);
          await this.getCustomerList(info.DivisionId);
          await this.getOfficeList(info.DivisionId);
          debugger;
          this.accountReceivableForm.patchValue({
            ReceiptVoucherId: this.accountReceivableId,
            DivisionId: info.DivisionId,
            OfficeId: info.OfficeId,
            Customer: info.CustomerId,
            Invoice: info.Invoice,
            // InvoiceDate: this.datePipe.transform(info.InvoiceDate, 'dd-MM-y'),
            InvoiceDate: this.datePipe.transform(
              new Date(info.InvoiceDate),
              "yyyy-MM-dd"
            ),
            InvoiceCurrency: info.InvoiceCurrency,
            Exchange: info.Exchange,
            // CustomerBranchID: info.CustomerBranchId,
            CustomerBranch: info.CustomerBranchId,
            DebitorCredit: info.DebitorCredit,
            InvoiceAmountICY: parseFloat(info.InvoiceAmountICY).toFixed(this.entityFraction),
            InvoiceAmountCCY: parseFloat(info.InvoiceAmountCCY).toFixed(this.entityFraction),
            DueAmountICY: parseFloat(info.DueAmountICY).toFixed(this.entityFraction),
            DueAmountCCY: parseFloat(info.DueAmountCCY).toFixed(this.entityFraction),
            ModifiedBy: info.ModifiedBy,
            OBReference: info.OBReference,
            OBDate: this.datePipe.transform(info.OBDate, "dd-MM-yyyy"),
          });

          // console.log(this.accountReceivableForm.value,'accountReceivableFormaccountReceivableForm')
        }
      });
  }

  omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  updateFormattedErrorMessages(): void {
    const groupedErrors: { [key: string]: string[] } = {};

    // Group errors by RowNumber
    this.resultValues.forEach((errorMessage) => {
      const rowNumber = errorMessage.match(/RowNumber: (\d+)/);
      if (rowNumber) {
        const key = rowNumber[1];
        groupedErrors[key] = groupedErrors[key] || [];
        groupedErrors[key].push(
          errorMessage.replace(`RowNumber: ${key}, `, "")
        );
      }
    });

    // Join grouped errors with line breaks
    this.formattedErrorMessages = Object.keys(groupedErrors)
      .map((key) => {
        return `RowNumber: ${key}, ${groupedErrors[key].join("<br>")}`;
      })
      .join("<br>");
  }

  save() {
    var validation = "";
    if (this.accountReceivableForm.value.DivisionId == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Select Division </span></br>";
    }
    if (this.accountReceivableForm.value.OfficeId == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Select Office</span></br>";
    }
    if (this.accountReceivableForm.value.Customer == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Select Customer Name</span></br>";
    }
    if (this.accountReceivableForm.value.Invoice == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter Invoice number</span></br>";
    }
    if (this.accountReceivableForm.value.InvoiceDate == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter Invoice Date</span></br>";
    }
    if (this.accountReceivableForm.value.InvoiceCurrency == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter InvoiceCurrency</span></br>";
    }
    if (this.accountReceivableForm.value.InvoiceAmountICY == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter InvoiceAmountICY</span></br>";
    }
    if (this.accountReceivableForm.value.DueAmountICY == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter DueAmountICY</span></br>";
    }
    if (this.accountReceivableForm.value.DueAmountCCY == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter DueAmountCCY</span></br>";
    }
    if (this.accountReceivableForm.value.InvoiceAmountCCY == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter InvoiceAmountCCY</span></br>";
    }
    if (this.accountReceivableForm.value.Exchange == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Enter Exchange</span></br>";
    }
    if (this.accountReceivableForm.value.DebitorCredit == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Select Debit/Credit</span></br>";
    }
    if (this.accountReceivableForm.value.CustomerBranch == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please Select Customer Branch</span></br>";
    }
    if (validation != "") {
      Swal.fire(validation);
      return false;
    }
    //  const Division = this.accountReceivableForm.value.DivisionId;
    //  const selectedDivision = this.divisionList.find(x => x.ID === Division);
    //  if (selectedDivision) {
    //   this.accountReceivableForm.controls['Division'].setValue(selectedDivision.DivisionName);
    //  }

    //  const Office = this.accountReceivableForm.value.OfficeId;
    //  const selectedOffice = this.officeList.find(x => x.ID === Office);
    //  if (selectedOffice) {
    //   this.accountReceivableForm.controls['Office'].setValue(selectedOffice.OfficeName);
    //  }

    console.log(
      this.accountReceivableForm.value,
      "this.accountReceivableForm.value"
    );
    debugger;
    const data = {
      Id: this.accountReceivableId,
      Division: this.accountReceivableForm.value.Division,
      DivisionId: this.accountReceivableForm.value.DivisionId,
      Office: this.accountReceivableForm.value.Office,
      OfficeId: this.accountReceivableForm.value.OfficeId,
      Customer: this.accountReceivableForm.value.Customer,
      BranchName: this.accountReceivableForm.value.CustomerBranch,
      Invoice: this.accountReceivableForm.value.Invoice,
      InvoiceDate: this.accountReceivableForm.value.InvoiceDate,
      InvoiceCurrency: this.accountReceivableForm.value.InvoiceCurrency,
      Exchange: this.accountReceivableForm.value.Exchange,
      DebitorCredit: this.accountReceivableForm.value.DebitorCredit,
      InvoiceAmountICY: this.accountReceivableForm.value.InvoiceAmountICY,
      InvoiceAmountCCY: this.accountReceivableForm.value.InvoiceAmountCCY,
      DueAmountICY: this.accountReceivableForm.value.DueAmountICY,
      DueAmountCCY: this.accountReceivableForm.value.DueAmountCCY,
      ModifiedBy: parseInt(this.CreatedBy),
    };

    const payload = {
      AccountInvoice: {
        Table: [data],
      },
    };
    console.log(payload, "this.payload.valpayloadForm.value,");
    let service = `${this.globals.APIURL}/AccountsReceivable/UpdateAccountInvoicedetailById`;
    this.dataService.post(service, payload).subscribe(
      (result: any) => {
        if (result.message == "Success") {
          Swal.fire(result.result[0], "", "success");

          this.router.navigate([
            "/views/transactions/openingBalances/account-receivable",
          ]);
          this.accountReceivableForm.reset();
        } else {
          this.resultValues = [];
          this.resultValues = result.result;

          if (this.resultValues.length == 1) {
            Swal.fire(this.resultValues[0]);
          } else {
            this.updateFormattedErrorMessages();
            console.log(
              this.formattedErrorMessages,
              "formattedErrorMessagesformattedErrorMessages"
            );
            Swal.fire(this.formattedErrorMessages);
          }
        }
      },
      (error) => {
        Swal.fire("error");
        console.error(error);
      }
    );
  }

  deleteRecord() {
    const payload = this.accountReceivableId;
    var service = `${this.globals.APIURL}/AccountsReceivable/AccountInvoiceDeleteById`;
    this.dataService.post(service, { Id: payload }).subscribe(
      async (result: any) => {
        if (result.message == "Success") {
          Swal.fire(result.result[0], "", "success");
          this.router.navigate([
            "/views/transactions/openingBalances/account-receivable",
          ]);
          this.accountReceivableForm.reset();
        } else {
          this.resultValues = [];
          this.resultValues = result.result;

          if (this.resultValues.length == 1) {
            Swal.fire(this.resultValues[0]);
          } else {
            this.updateFormattedErrorMessages();
            console.log(
              this.formattedErrorMessages,
              "formattedErrorMessagesformattedErrorMessages"
            );
            Swal.fire(this.formattedErrorMessages);
          }
        }
      },
      (error) => {
        Swal.fire("error");
        console.error(error);
      }
    );
  }

  cancel() {
    this.router.navigate([
      "/views/transactions/openingBalances/account-receivable",
    ]);
  }
  enableEdit() {
    if (this.isEnable == 0) {
      this.accountReceivableForm.enable();
      this.isSavemode = true;
      this.isUpdate = true;
    } else {
      Swal.fire("Can't able to edit this invoice !");
      this.isUpdate = false;
    }
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`;
    this.dataService
      .post(service, { Id: 0, DivisionCode: "", DivisionName: "", Active: 1 })
      .subscribe(
        (result: any) => {
          this.divisionList = [];
          if (result.data.Table.length > 0) {
            this.divisionList = result.data.Table;
          }
        },
        (error) => {}
      );
  }

  getOfficeList(DivisionId) {
    return new Promise((resolve, reject) => {
      const payload = { DivisionId };
      this.commonDataService.getOfficeByDivisionId(payload).subscribe(
        (result: any) => {
          this.officeList = [];
          this.accountReceivableForm.controls["OfficeId"].setValue("");
          this.accountReceivableForm.controls["Customer"].setValue("");
          this.accountReceivableForm.controls["CustomerBranch"].setValue("");
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

  getCustomerList(ID: number) {
    let payload = { DivisionId: ID };
    var service = `${this.globals.APIURL}/Common/GetCustomerAndVendorByDivisionId`;
    this.dataService.post(service, payload).subscribe(
      (result: any) => {
        this.customerList = [];
        // this.accountReceivableForm.controls['Customer'].setValue('');
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.customerList = result.data.Table;
        }
      },
      (error) => {}
    );
  }

  getCurrency() {
    return new Promise((resolve, rejects) => {
      const payload = { currencyId: 0, countryId: 0 };
      this.PaymentReceivableService.getCurrencyLists(payload)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result: any) => {
          if (result.message == "Success") {
            this.currencyList = result["data"];
            const entityInfo: any =
              this.commonDataService.getLocalStorageEntityConfigurable();
            // this.receivedCurrencyName = entityInfo.Currency
            resolve(true);
          }
        });
    });
  }
}
