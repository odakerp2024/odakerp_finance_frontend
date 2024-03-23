import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { log } from "console";
import { PaginationService } from "src/app/pagination.service";
import { CommonService } from "src/app/services/common.service";
import { ContraVoucherService } from "src/app/services/contra-voucher.service";
import { PaymentBatchService } from "src/app/services/financeModule/payment-batch.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-open-request",
  templateUrl: "./open-request.component.html",
  styleUrls: ["./open-request.component.css"],
})
export class OpenRequestComponent implements OnInit {
  // @Output() activeTab = new EventEmitter()
  openRequestDropdownForm: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  vendorsList: any = [];
  PaymentBatchOpenRequestList: any = [];
  bankList: any;
  openRequestForm: FormGroup;
  totalOpenRequest: any;
  amount: any;
  priorityRequest: any;
  entityDateFormat =
    this.commonService.getLocalStorageEntityConfigurable("DateFormat");
  isListWise: boolean = false;
  selectedInvoiceId: any;
  totalAmount = 0;
  selectedAmount: any;
  isCheck: boolean = false;
  isCheck1: boolean = false;
  IsListInvoiceWise = 0;
  finalSave: any;
  PRresultArray = [];
  invoiceResultArray = [];
  finalPRresultArray = [];
  finalInvoiceresultArray = [];
  newArray1: any[];
  totalOpenRequestListAmount: any;
  sumWithInitial = 0;
  pager: any = {};
  pagedItems: any[];// paged items
  isChecked = false;

  constructor(
    private fb: FormBuilder,
    private commonDataService: CommonService,
    private paymentBatchService: PaymentBatchService,
    private contraVoucherService: ContraVoucherService,
    public commonService: CommonService,
    private router: Router,
    private ps: PaginationService,
  ) {}

  ngOnInit(): void {
    this.IsListInvoiceWise = 0;
     this.isListWise = false;
    this.getDivisionList();
    this.getOfficeList();
    this.getVendorList();
    this.getBankList();
    this.getAllDropdown();
    this.CreateForm();
    this.GetPaymentBatchOpenRequestList();
  }

  CreateForm() {
    this.openRequestDropdownForm = this.fb.group({
      DivisionId: [0],
      VendorId: [0],
      OfficeId: [0],
      Amount: [],
      RequestPriority: [0],
    });

    this.openRequestForm = this.fb.group({
      BankId: [0],
      PaymentDate: [new Date()],
      PRNumber: [0],
      PaymentRequestId: [0],
      PaymentRequestInvoiceId: [0],
      PurchaseInvoice: [0],
      Amount: [],
    });
  }

  GetPaymentBatchOpenRequestList() {
    const payload = {
      DivisionId: this.openRequestDropdownForm.value.DivisionId,
      VendorId: this.openRequestDropdownForm.value.VendorId,
      OfficeId: this.openRequestDropdownForm.value.OfficeId,
      Amount: this.openRequestDropdownForm.value.Amount
        ? this.openRequestDropdownForm.value.Amount
        : 0,
      RequestPriority: this.openRequestDropdownForm.value.RequestPriority,
      IsListInvoiceWise: this.IsListInvoiceWise,
    };
    this.paymentBatchService
      .GetPaymentBatchOpenRequestList(payload)
      .subscribe((result) => {
        if (result.message == "Success") {
          const resultData = result.data;
          this.totalOpenRequest = result.data.countList[0].TotalOpenRequest;
          this.amount = result.data.countList[0].TotalAmount;
          this.totalOpenRequestListAmount =
            result.data.countList[0].PurchaseInvoiceAmount;
          this.PaymentBatchOpenRequestList = resultData.paymentRequestList
            .length
            ? resultData.paymentRequestList
            : [];
            this.setPage(1);
        }
        
      });
  }

  newSelect(event: any) {

  }

  getDivisionList() {
    console.log(this.isListWise, "this.isListWise");
    this.commonDataService.getDivision({}).subscribe(
      (result: any) => {
        this.divisionList = [];
        if (result.data.Table.length > 0) {
          let divisionList = result.data.Table;
          this.divisionList = divisionList.filter((x) => x.Active == true);
        }
      },
      (error) => {}
    );
  }

  getOfficeList() {
    this.commonDataService.getOffice({}).subscribe(
      (result: any) => {
        this.officeList = [];
        if (result.message == "Success" && result.data.Office.length > 0) {
          this.officeList = result.data.Office.filter((x) => x.Active == true);
        }
      },
      (error) => {}
    );
  }

  getVendorList() {
    this.commonDataService.GetAllVendorDropdownList({}).subscribe(
      (result: any) => {
        this.vendorsList = [];
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.vendorsList = result.data.Table;
        }
      },
      (error) => {}
    );
  }

  getAllDropdown() {
    this.paymentBatchService.getDropdown({}).subscribe((result) => {
      if (result.message == "Success") {
        const resultData = result.data;
        this.priorityRequest = resultData.Table2.length
          ? resultData.Table2
          : [];
      }
    });
  }

  OnClickRadio(selectedId: any) {
    const selectedInvoice = this.PaymentBatchOpenRequestList.find(
      (invoice) => invoice.id === selectedId
    );
    this.selectedAmount = selectedInvoice.Amount;
    this.totalAmount = selectedInvoice.Amount + this.totalAmount;

    var saveResult = {
      PaymentRequestId: selectedId.PaymentRequestId,
      PRNumber: selectedId.PRNumber,
      PaymentDate: this.openRequestForm.value.PaymentDate,
      BankId: this.openRequestForm.value.BankId,
    };

    this.finalSave.push(saveResult);
  }

  // getBankList() {
  //   let payload = {
  //     BankID: 0,
  //     BankName: "",
  //     AccountNo: "",
  //     Currency: "",
  //     IFSCCode: "",
  //     SwiftCode: null,
  //     IsActive: ,
  //   };

   

  //   this.contraVoucherService
  //     .getBankAccountList(payload)
  //     .subscribe((result: any) => {
  //       if (result.message == "Success") {
  //         this.bankList = result["data"].Table;
  //       }
  //     });
  // }
  getBankList() {
    let payload = {
      BankName: "",
      AccountNo: "",
      Currency: "",
      IFSCCode: "",
      SwiftCode: null,
      IsActive: 1,
    };
    this.contraVoucherService
      .getbankaccountFilter(payload)
      .subscribe((result: any) => {
        if (result.message == "Success") {
          this.bankList = result["data"].Table;
        }
      });
  }

  search() {
    this.GetPaymentBatchOpenRequestList();
  }

  clear() {
    this.isListWise = false
    this.pager = [0]
    this.sumWithInitial = 0
    this.invoiceResultArray = []
    this.PRresultArray = []
    this.isChecked = false
    this.IsListInvoiceWise = 0;
    this.isChecked = false
    this.CreateForm();
    this.GetPaymentBatchOpenRequestList();
  }

  ListInvoiceWise() {
    this.isListWise = !this.isListWise;
    if (this.isListWise) {
      this.IsListInvoiceWise = 1;
      this.isChecked = false
    } else {
      this.IsListInvoiceWise = 0;
      this.isChecked = true
    }
    this.sumWithInitial = 0
    this.invoiceResultArray = []
    this.PRresultArray = []
    this.GetPaymentBatchOpenRequestList();
  }

  selectInvoice(event: any, item: any) {
    if (event.target.checked) {
      this.invoiceResultArray.push(item);
      this.sumWithInitial = this.getSumInvoiceValues(this.invoiceResultArray) 

    } else {
      const index = this.invoiceResultArray.findIndex(
        (x) => {
          return x.PRNumber === item.PRNumber
        }
      );
      this.invoiceResultArray.splice(index, 1);
      this.sumWithInitial = this.getSumInvoiceValues(this.invoiceResultArray) 
    }
    this.finalInvoiceresultArray = this.invoiceResultArray.map(
      ({
        PaymentRequestInvoiceId,
        PurchaseInvoice,
        PaymentRequestId,
        PRNumber,
      }) => ({
        PaymentRequestInvoiceId,
        PurchaseInvoice,
        PaymentRequestId,
        PRNumber,
      })
    );
  }

  getSumPRValues(data: any) {
    const initialValue = 0;
    return data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.PaymentRequestAmount;
    }, initialValue); 
  }


  getSumInvoiceValues(data: any) {
    const initialValue = 0;
    return data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.PurchaseInvoiceAmount;
    }, initialValue); 
  }

  selectPR(event: any, item: any) {
    if (event.target.checked) {
      this.PRresultArray.push(item);
      this.sumWithInitial = this.getSumPRValues(this.PRresultArray) 
    } else {
      const index = this.PRresultArray.findIndex(
        (x) => {
          return x.PRNumber === item.PRNumber
        }
      );
      this.PRresultArray.splice(index, 1);

      this.sumWithInitial = this.getSumPRValues(this.PRresultArray);
    }

    this.finalPRresultArray = this.PRresultArray.map(
      ({ PaymentRequestId, PRNumber }) => ({ PaymentRequestId, PRNumber })
    );
    console.log(this.finalPRresultArray, "newArray");
  }

  Submit() {
    const openRequestForm = this.openRequestForm.value;
    var validation = "";
    if (openRequestForm.BankId == 0) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Bank.</span></br>";
      Swal.fire(validation);
    }

    if (
      this.finalPRresultArray.length == 0 &&
      this.finalInvoiceresultArray.length == 0
    ) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Atleast one invoice.</span></br>";
      Swal.fire(validation);
    }

    // else if (this.finalInvoiceresultArray.length == 0  ){
    //   validation += "<span style='color:red;'>*</span> <span>Please select Atleast one invoice.</span></br>";
    //   Swal.fire(validation);
    // }

    if (validation != "") {
      Swal.fire(validation);
      return false;
    }
    // this.checkValidation();
   // this.openRequestForm.value.PaymentDate = new Date();
    if (!this.isListWise) {
      var newArray = this.finalPRresultArray.map((obj) => ({
        ...obj,
        PaymentDate: this.openRequestForm.value.PaymentDate.toISOString(),
      }));
      this.newArray1 = newArray.map((obj) => ({
        ...obj,
        BankId: this.openRequestForm.value.BankId,
      }));
      console.log( this.openRequestForm.value.PaymentDate ,'paymentdate before payload')
      const payload = {
        PaymentBatchRequest: {
          Table: this.newArray1,
        },
      };
      this.paymentBatchService.SavePaymentBatch(payload).subscribe((result) => {
        console.log(payload, "payloadpayloadpayload");
        if (result.message == "Success") {
          Swal.fire(result.data);
          // this.activeTab.emit('In Progress')
          // this.router.navigate(['/views/transactions/payment-request/payment-batch'])
          this.ngOnInit();
        }
      });
    } else {
    //  this.openRequestForm.value.PaymentDate = new Date();
      var newArray = this.finalInvoiceresultArray.map((obj) => ({
        ...obj,
        PaymentDate: this.openRequestForm.value.PaymentDate.toISOString(),
      }));
      this.newArray1 = newArray.map((obj) => ({
        ...obj,
        BankId: this.openRequestForm.value.BankId,
      }));
      console.log( this.openRequestForm.value.PaymentDate ,'paymentdate payload')
      const payload = {
        PaymentBatchRequest: {
          Table: this.newArray1,
        },
      };
      this.paymentBatchService
        .SavePaymentBatchInvoieWise(payload)
        .subscribe((result) => {
          if (result.message == "Success") {
            Swal.fire(result.data);
            this.IsListInvoiceWise = 0;

            this.isListWise = false;
            this.isChecked = false
            // this.router.navigate(['/views/transactions/payment-request/payment-batch'])
            this.ngOnInit();
            // window.location.reload();
          }
        });
    }
  }

  //   Submit() {
  //  debugger
  //     const openRequestForm = this.openRequestForm.value;
  //     var validation = "";
  //     if (openRequestForm.BankId == 0){
  //       validation += "<span style='color:red;'>*</span> <span>Please select Bank.</span></br>";
  //       Swal.fire(validation);
  //     }

  //     if (!this.newArray1){
  //       validation += "<span style='color:red;'>*</span> <span>Please select Atleast one invoice.</span></br>";
  //       Swal.fire(validation);
  //     }

  //     if (validation != "") {
  //       Swal.fire(validation)
  //       return false;
  //     }
  //     this.save()
  //   }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.PaymentBatchOpenRequestList.length, page);

    if(this.PaymentBatchOpenRequestList.length == 0){
      this.pagedItems = [];
    }
    
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get current page of items
    this.pagedItems = this.PaymentBatchOpenRequestList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
