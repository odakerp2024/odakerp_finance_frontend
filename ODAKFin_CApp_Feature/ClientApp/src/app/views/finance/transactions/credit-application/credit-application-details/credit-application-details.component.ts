import { resolve } from "dns";
import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "src/app/globals";
import { PaginationService } from "src/app/pagination.service";
import { CommonService } from "src/app/services/common.service";
import { DataService } from "src/app/services/data.service";
import { CreditApplicationService } from "src/app/services/credit-application.service";
import Swal from "sweetalert2";
import { CommonPatternService } from "src/app/shared/service/common-pattern.service";
import { AutoGenerationCodeService } from "src/app/services/auto-generation-code.service";
import { AutoCodeService } from "src/app/services/auto-code.service";
import { rejects } from "assert";
import { relative } from "path";
import { CustomerService } from "src/app/services/financeModule/customer.service";
import { Customer } from "src/app/model/financeModule/Customer";

@Component({
  selector: "app-credit-application-details",
  templateUrl: "./credit-application-details.component.html",
  styleUrls: ["./credit-application-details.component.css"],
})
export class CreditApplicationDetailsComponent implements OnInit {
  // * pagination start
  pager: any = {}; // pager object
  pagedItems: any[]; // paged items
  creditdaysValidation: any;
  creditAmountValidation: any;
  // * pagination end

  IsUpdated:boolean = true;
  ModifiedOn: any;
  CreatedOn: any;
  CreatedBy = localStorage.getItem("UserID");
  ModifiedBy: any;

  maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  creditApplicationForm: any;
  creditId: any = "";

  entityDateFormat =
    this.commonDataService.getLocalStorageEntityConfigurable("DateFormat");
  isUpdate = false;
  isEditMode = true;
  IsFinal = false;

  SAVE_TYPE = "SAVE";
  FINAL_TYPE = "FINAL";

  statusValues = [
    { value: 1, viewValue: "Confirmed" },
    { value: 0, viewValue: "Prospect" },
  ];
  PDCValue = [
    { value: 1, viewValue: "YES" },
    { value: 0, viewValue: "NO" },
  ];
  divisionList = [];
  officeList = [];
  salesPerson = [];
  documentList = [];
  documentInfo: any[];
  dropDownOptions = [];
  // validationList = [];
  creditLimit = [];
  customerAndBranchList = [];
  numberRangeList = [];
  customerBranchList = [];
  getTradeLists = [];
  questionArray = [];
  applicationStatus = [];
  branches: number;
  newOne: any;
  thirdPartyList: any[];
  customerDetail: any[];
  salesPersonid: any;
  customerBranchid: any;
  result: any;
  creditApplicationList = [];
  // creditType: string = "Revise";
  requestType: boolean =false;
  isGetByIdInProgress = false;
  creditType: string ;
  IsRevise: boolean ;
  IsRevoke:boolean ;
  ReviseCreditLimitDays: any;
  ReviseCreditLimitAmount: any;
  RevisePostDatedCheques: any;
  ReviseRequestRemarks: any;

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    public commonDataService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private creditApplicationService: CreditApplicationService,
    private patternService: CommonPatternService,
    private autoGenerationCodeService: AutoGenerationCodeService,
    private autoCodeService: AutoCodeService,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  async ngOnInit() {
    // this.route.paramMap.subscribe(params => {
    //   const requestTypeString = params.get('requestType');
    //     this.IsRevise = requestTypeString == 'true';
    // });

    this.route.paramMap.subscribe(params => {
      this.requestType = params.get('requestType') === 'true';   
    });    
    this.createForm(); 
    await this.getDivision();   
    //this.getCustomerCredit();
    this.getCustomerAndBranch();
    this.getDropdowns();
    this.getCustomerDropDownList();
    this.getTradeList();
    this. getCreditApplication();
    // this.getCustomerDropDown();
    // this.getById();
    this.route.params.subscribe(async (param) => {
      // debugger
      this.creditId = +param["creditId"] ? +param["creditId"] : 0;
      if (this.creditId) {
        this.isUpdate = true;
        debugger;
        this.getById();
      }
    });    
  }

  getByFunctionality() {
    this.isUpdate = true;
    this.getById();
  }

  createForm() {
    this.creditApplicationForm = this.fb.group({
      CreditApplicationId: [0],
      IsRevise: true,
      IsRevoke: false,
      CreditApplicationNumber: [''],
      ApplicationDate: [this.minDate],
      ApplicationStatus: [22],
      DivisionId: [],
      OfficeId: [],
      CustomerId: [0],
      CustomerBranchId: [0],
      SalesPersonId: [],
      Trade: [],
      CustomerStatus: [],
      CustomerPan: ["", [Validators.pattern(this.patternService.panPattern)]],
      CustomerPrimeContact: [],
      Telephone: [],
      Mobile: [],
      Email: [],
      CreditLimitDays: [],
      CreditLimitAmount: [],
      PostDatedCheques: [""],
      RequestRemarks: [],
      // ReviseCreditLimitDays: [],
      // ReviseCreditLimitAmount: [],
      // RevisePostDatedCheques: [""],
      // ReviseRequestRemarks: [],
      CreatedBy: [this.CreatedBy],
      StatusId: [1],
      ApprovedDate: [],
    });
  }

  editMode() {
    this.isEditMode = true;
  }

  // * get the credit application by ID and patch the value to the form
  getById() {
    const payload = {
      CreditApplicationId: this.creditId,
    };

    this.creditApplicationService.getById(payload).subscribe((result: any) => {
      debugger;
      if (result.message == "Success") {
        if (result.data.Table.length) {
          // this.customerBranchList = []
          this.customerBranchid = result.data.Table[0];
          this.salesPersonid = result.data.Table[0].SalesPersonId;
          const Table = result.data.Table[0];
          this.getOfficeList(Table.DivisionId); // get office list
          // this.getBranch(false, +Table.CustomerId)

          if (Table.StatusId === 2) {
            debugger;
            this.IsFinal = true;
          }
          // if(this.IsRevoke == true && this.IsRevise == false){
             
          // }
          //  Table.IsFinal = 1; // ! set the final Value;
          //  Table.StatusId = 2;
          this.creditApplicationForm.disable();
          this.isEditMode = false;
          this.CreatedOn = Table.CreatedDate;
          this.ModifiedOn = Table.UpdatedDate;
          this.CreatedBy = Table.CreatedByName;
          this.ModifiedBy = Table.UpdatedByName;
          this.creditApplicationForm.patchValue({
            CreditApplicationId: Table.CreditApplicationId,
            CreditApplicationNumber: Table.CreditApplicationNumber,
            ApplicationDate: this.datePipe.transform(
              new Date(Table.ApplicationDate),
              "yyyy-MM-dd"
            ),
            ApplicationStatus: Table.ApplicationStatus,
            DivisionId: Table.DivisionId,
            OfficeId: Table.OfficeId,
            CustomerId: Table.CustomerId,
            CustomerBranchId: Table.CityName,
            SalesPersonId: Table.SalesPIC,
            Trade: Table.Trade,
            CustomerStatus: Table.CustomerStatus == "Active" ? 1 : 0,
            CustomerPan: Table.CustomerPan,
            CustomerPrimeContact: Table.CustomerPrimeContact,
            Telephone: Table.Telephone,
            Mobile: Table.Mobile,
            Email: Table.Email,
            IsRevise: Table.IsRevise,
            IsRevoke: Table.IsRevoke,
            CreditLimitDays: Table.CreditLimitDays,
            CreditLimitAmount: Table.CreditLimitAmount,
            PostDatedCheques: Table.PostDatedCheques ? 1 : 0,
            RequestRemarks: Table.RequestRemarks,
            CreatedBy: Table.CreatedBy,
            StatusId: Table.StatusId,
          });         
          this.getWQuestions(result.data.Table1);
        }

        if (result.data.Table2) {
          // debugger
          this.documentList = result.data.Table2;
          this.documentInfo = this.constructDocumentPayload(this.documentList);
        }

        if (result.data.Table1) {
          debugger;
          this.questionArray = result.data.Table1;
        }
      }
    });
  }

  getCreditApplication() {
    debugger
    const payload = {
      "CreditApplicationId": "",
      "CreditApplicationNumber": "",
      "ApplicationDate":"",
      "Customer": 0,
      "customerAndBranchList": 0,
      "CreditLimitDays": "",
      "CreditLimitAmount": "",
      "StatusId": 24,
      "DivisionId": 0,
      "OfficeId": 0,
      "SalesPersonId": 0,    
      "StartDate" : "",
      "EndDate" : ""
      
    }
    // payload.ApplicationDate = new Date(payload.ApplicationDate);
    this.creditApplicationService.getList(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.creditApplicationList = result.data.Table;
         
      }
    })
  }
 
  handleChange(event: any) {
    const selectedCreditApplicationId = event;

    this.getbyId(selectedCreditApplicationId);
  }

getbyId(selectedCreditApplicationId: any) {
  debugger
    const payload = {
        CreditApplicationId: selectedCreditApplicationId,
    };
   
    this.creditApplicationService.getById(payload).subscribe((result: any) => {
        debugger;
        if (result.message == "Success") {
            if (result.data.Table.length) {              
                // this.customerBranchList = []
                this.customerBranchid = result.data.Table[0].CustomerBranchId;
                this.salesPersonid = result.data.Table[0].SalesPersonId;
                const Table = result.data.Table[0];
                console.log(Table, "Table");
                this.getCustomerBranchCode(Table.CustomerId);
           
                this.getOfficeList(Table.DivisionId); // get office list
               
                // this.getBranch(false, +Table.CustomerId)

                // if (Table.StatusId === 2) {
                //     debugger;
                //     this.IsFinal = true;
                // }

                //  Table.IsFinal = 1; // ! set the final Value;
                //  Table.StatusId = 2;                
                this.creditApplicationForm.disable();
                // this.IsUpdated = false;
                this.isEditMode = false;
                // this.CreatedOn = Table.CreatedOn ?? this.minDate,
                // this.CreatedBy =  [this.CreatedBy];
                // this.CreatedOn = Table.CreatedDate;
                this.CreatedBy = this.CreatedBy;               
              //  this.CreatedBy = Table.CreatedByName;    
              this.creditApplicationForm.patchValue({
                    // CreditApplicationId: Table.CreditApplicationId,
                    CreditApplicationId: 0,
                    // CreditApplicationNumber: Table.CreditApplicationNumber,
                    // ApplicationDate: this.datePipe.transform(
                    //     new Date(Table.ApplicationDate),
                    //     "yyyy-MM-dd"
                    // ),

                    ApplicationDate: this.datePipe.transform(
                          new Date(this.minDate),
                          "yyyy-MM-dd"
                      ),
                    ApplicationStatus: [22],
                    
                    DivisionId: Table.DivisionId,
                    OfficeId: Table.OfficeId,
                    CustomerId: Table.CustomerId,
                    CustomerBranchId: Table.CityName,
                    SalesPersonId: Table.SalesPIC,
                    Trade: Table.Trade,
                    CustomerStatus: Table.CustomerStatus == "Active" ? 1 : 0,
                    CustomerPan: Table.CustomerPan,
                    CustomerPrimeContact: Table.CustomerPrimeContact,
                    Telephone: Table.Telephone,
                    Mobile: Table.Mobile,
                    Email: Table.Email,
                    CreditLimitDays: Table.CreditLimitDays,
                    CreditLimitAmount: Table.CreditLimitAmount,
                    PostDatedCheques: Table.PostDatedCheques ? 1 : 0,
                    RequestRemarks: Table.RequestRemarks,
                    CreatedBy: Table.CreatedBy,
                    // IsRevise: Table.IsRevise  ? true : false,
                    // IsRevoke: Table.IsRevoke  ? true : false,
                    StatusId: Table.StatusId,
                  
                });              
                if (this.creditApplicationForm.value.IsRevoke) {
                  this.creditApplicationForm.patchValue({
                      CreditLimitDays: 0,
                      CreditLimitAmount: 0
                  });
              }
                this.getWQuestions(result.data.Table1);
            }

            if (result.data.Table2) {
                // debugger
                this.documentList = result.data.Table2;
                this.documentInfo = this.constructDocumentPayload(this.documentList);
            }

            if (result.data.Table1) {
                debugger;
                this.questionArray = result.data.Table1;
            }
            this.getNumberRangeList();
            this.isGetByIdInProgress = false;       
        }
    });
}

  onCreditLimitDays(event:any){
    console.log(this.creditLimit)
    const highestValue = Math.max(...this.creditLimit.map((res: any) => res.MaxCreditDays))
    if(event.target.value > highestValue){
      this.creditdaysValidation = highestValue
    }
    else{
      const data = {
        CreditLimitDays: event.target.value
      }
      this.creditApplicationForm.patchValue(data);
      this.creditdaysValidation = null; 
    }
  }
  setRevise() {
    
    this.creditType = 'Revise';
    this.creditApplicationForm.patchValue({
      IsRevise: true,
      IsRevoke: false,
    });
    this.createForm();
  }

  // Function to handle the "Revoke" radio button click
  setRevoke() {
    this.createForm();
    this.creditType = 'Revoke';  
    this.creditApplicationForm.patchValue({
      IsRevise: false,
      IsRevoke: true,
      // CreditLimitAmount: 0,
      // CreditLimitDays:  0,
    });   
  }

  onCreditLimitAmount(event:any){
    const highestValue = Math.max(...this.creditLimit.map((res: any) => res.MaxCreditAmount))
    if(event.target.value > highestValue){
      this.creditAmountValidation = highestValue
    }
    else{
      const data = {
        CreditLimitDays: event.target.value
      }
      this.creditApplicationForm.patchValue(data);
      this.creditAmountValidation = null; 
    }
  }

  fileSelected(event) {}

  // * document upload functionality
  uploadDocument(event) {
    let newDoc = {
      CustomerDocumentsID: 0,
      CustomerBranchID: this.creditApplicationForm.value.CustomerBranchId,
      DocumentName: event.DocumentName,
      FilePath: event.FilePath,
      // "UpdatedOn": event.UploadedOn
      UpdateOn: new Date(),
    };

    let payload = [];
    payload.push(...this.documentList, newDoc);
    this.documentList = payload;
    this.documentInfo = this.constructDocumentPayload(this.documentList);
  }

  deleteDocument(event) {
    const indexToDelete = event.ID;
    if (indexToDelete >= 0 && indexToDelete < this.documentList.length) {
      this.documentList.splice(indexToDelete, 1);

      this.documentInfo = this.constructDocumentPayload(this.documentList);
    }
  }

  //  * construct the payload for save and final
  constructPayload() {
    if (!this.isUpdate) {
      this.creditApplicationForm.value.SalesPersonId = 
           this.customerDetail["data"] .Table2[0].SalesId;
    } else {
      this.creditApplicationForm.value.SalesPersonId = this.salesPersonid;

      this.creditApplicationForm.value.CustomerBranchId = this.customerBranchid;
    }
    const Table = this.creditApplicationForm.value;

    if(!this.requestType){
      Table.IsRevise = false;
      Table.IsRevoke = false;
    }

    let payload = {
      CreditApplication: {
        Table: [
          {
            ApplicationDate: this.datePipe.transform(
              new Date(Table.ApplicationDate),
              "yyyy-MM-dd"
            ),
            ApplicationStatus: +Table.ApplicationStatus,
            CreatedBy: +Table.CreatedBy,
            CreditApplicationId: Table.CreditApplicationId,
            CreditApplicationNumber: Table.CreditApplicationNumber,
            CreditLimitDays: Table.ReviseCreditLimitDays ? Table.ReviseCreditLimitDays : Table.CreditLimitDays,
            CreditLimitAmount: this.ReviseCreditLimitAmount ? this.ReviseCreditLimitAmount : Table.CreditLimitAmount,
            CustomerId: +Table.CustomerId,

            IsRevise: +Table.IsRevise ? true : false, 
            IsRevoke: +Table.IsRevoke ? true : false, 
            CustomerPan: Table.CustomerPan,
            CustomerPrimeContact: Table.CustomerPrimeContact,
            CustomerStatus: +Table.CustomerStatus ? "Active" : "Inactive",
            CustomerBranchId: +Table.CustomerBranchId,
            DivisionId: +Table.DivisionId,
            Email: Table.Email,
            Mobile: Table.Mobile,
            OfficeId: +Table.OfficeId,
            PostDatedCheques: Table.RevisePostDatedCheques ? Table.RevisePostDatedCheques : Table.PostDatedCheques,
            RequestRemarks: Table.ReviseRequestRemarks ? Table.ReviseRequestRemarks : Table.RequestRemarks,
            SalesPersonId: Table.SalesPersonId,
            StatusId: +Table.StatusId,
            Telephone: Table.Telephone,
            Trade: +Table.Trade,
            ApprovedDate: "",
          },
        ],
        Table1: [
          ...this.questionArray,
          // {
          //     "CreditValidationId":0,
          //     "CreditApplicationId":0,
          //     "CreditQuestions":"Its me Kavi",
          //     "Response":"Yes"
          // }
        ],
        Table2: [...this.documentList],
      },
    };

    return payload;
  }
  //  * credit save
  confirmFunction(type) {
    debugger;
    const validation = this.validationCheck();
    // *  validation check
    if (validation != "") {
      Swal.fire(validation);
      return;
    }

    Swal.fire({
      showCloseButton: true,
      title: "",
      icon: "question",
      text: `Do you want to save this Details?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        debugger;
        switch (type) {
          case this.SAVE_TYPE:
            this.saveCredit();
            break;
          case this.FINAL_TYPE:
            this.finalCredit();
            break;
          default:
            break;
        }
      }
    });
  }

  saveCredit() {
    // debugger
    // const validation = this.validationCheck();

    // // *  validation check
    // if (validation != '') {
    //   Swal.fire(validation);
    //   return;

    // }

    const payload = this.constructPayload();
    this.creditApplicationService
      .saveCreditApplication(payload)
      .subscribe((result: any) => {
        if (result.message === "Success") {
          if (this.creditId == "") {
            this.updateAutoGenerated();
          }
          Swal.fire("", result.data.Message, "success");
          const creditApplicationId = result.data.Id;
   
         
          const isRevise = payload.CreditApplication.Table[0].IsRevise;
          const isRevoke = payload.CreditApplication.Table[0].IsRevoke;
    
      
          const requestType = isRevise || isRevoke;
    
          this.router.navigate([
            "/views/transactions/credit-application/credit-application-details",
            { creditId: creditApplicationId, requestType: requestType },
          ]);
        }
      });
    }
    
   
  // * credit final
  finalCredit() {
    // const validation = this.validationCheck();
    // // *  validation check
    // if (validation != '') {
    //   Swal.fire(validation);
    //   return;
    // }

     const PendingApprovalDetails = this.applicationStatus.find((status) => status.Status === 'Pending Approval')
    // const ApprovedDetails = this.applicationStatus.find(
    //   (status) => status.Status === "Approved"
    //);
    debugger;
    let payload = this.constructPayload();
    payload.CreditApplication.Table[0].StatusId = 2; // ! set save type(draft(1) or final(2) or canceled(3));
    payload.CreditApplication.Table[0].ApplicationStatus = PendingApprovalDetails.Id;
    payload.CreditApplication.Table[0].ApprovedDate = new Date().toISOString();
    this.creditApplicationService
      .saveCreditApplication(payload)
      .subscribe((result: any) => {
        if (result.message === "Success") {
          if (this.creditId == "") {
            this.updateAutoGenerated();
          }
          this.goBack();
          Swal.fire("", result.data, "success");
        }
      });
  }

  // * construct and pass the data to document component
  constructDocumentPayload(docList) {
    if (docList) {
      const newDocument = [];
      docList.forEach((item) => {
        const payload = {
          CreatedBy: item.CreatedBy ?? this.CreatedBy,
          CreatedOn: item.CreatedOn ?? this.minDate,
          DocumentName: item.DocumentName,
          FilePath: item.FilePath,
          ID: item.CustomerDocumentsID,
          Modifiedon: item.Modifiedon,
          OrgId: item.CustomerBranchID,
          UpdatedBy: item.UpdatedBy,
          UploadedBy: item.UploadedBy,
          uploadedOn: this.datePipe.transform(
            new Date(item.UpdateOn),
            "yyyy-MM-dd"
          ),
        };
        newDocument.push(payload);
      });
      return newDocument;
    }
  }

  //  * validation check all the required fields are present
  validationCheck() {
    // "CreditApplicationId": Table.CreditApplicationId,

    const Table = this.creditApplicationForm.value;
    const Table1 = this.questionArray;
    var validationMessage = false;

    if (Table1.length > 0) {
      Table1.forEach((item) => {
        if (item.Response.trim() === "") {
          // Response is empty, set validationMessage to true
          validationMessage = true;
        }
      });
    }

    // Now you can use the validationMessage variable as needed

    var validation = "";

    if (validationMessage) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please response to the questions it is mandatory</span><br>";
    }

    // if (!Table.CreditApplicationNumber) {
    //   validation +=
    //     "<span style='color:red;'>*</span> <span>Application Number Is Required.</span></br>";
    // }

    if (!Table.ApplicationDate) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Application Date.</span></br>";
    }

    if (Table.ApplicationStatus == "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Application Status.</span></br>";
    }

    if (!Table.DivisionId) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Division.</span></br>";
    }

    if (!Table.OfficeId) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Office.</span></br>";
    }

    if (!Table.CustomerId) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Customer.</span></br>";
    }

    // if (!Table.CustomerBranchId) {
    //   validation +=
    //     "<span style='color:red;'>*</span> <span>Please select Customer Branch.</span></br>";
    // }

    // if (!Table.SalesPersonId) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Sales Person.</span></br>"
    // }

    if (!Table.Trade) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Trade.</span></br>";
    }

    // Customer Details
    if (Table.CustomerStatus == '') {
      validation += "<span style='color:red;'>*</span> <span>Please select Customer Status.</span></br>"
    }

    // if (!Table.CustomerPan) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Customer PAN.</span></br>"
    // }

    // if (!Table.CustomerPrimeContact) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Primary Contact.</span></br>"
    // }

    // if (!Table.Telephone) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Telephone.</span></br>"
    // } 

    // if (!Table.Mobile) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Mobile.</span></br>"
    // }

    // if (!Table.Email) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter Email.</span></br>"
    // }

    // Proposed Credit Limit
    if (!Table.CreditLimitDays) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Limit Days .</span></br>";
    }

    if (!Table.CreditLimitAmount) {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Credit Amount.</span></br>";
    }

    if (Table.PostDatedCheques === "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Post Dated Cheques .</span></br>";
    }

    // if (!Table.RequestRemarks) {
    //   validation += "<span style='color:red;'>*</span> <span>Please Enter The Remarks .</span></br>"
    // }

    if (Table.StatusId === "") {
      validation +=
        "<span style='color:red;'>*</span> <span>Please select Status.</span></br>";
    }

    // if (
    //   Table.CustomerPan &&
    //   this.creditApplicationForm.get("CustomerPan").invalid
    // ) {
    //   validation +=
    //     "<span style='color:red;'>*</span> <span>Please enter valid PAN number</span></br>";
    // }

    // if (Table1.creditvaleus ) {
    //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter All Questions</span></br>';
    // }

    // if(Table1.getWQuestions.questionArray.CreditQuestions.length !=Table.getWQuestions.questionArray.response.length){

    //   validation += '<span style=\'color:red;\'>*</span> <span>Please enter All Questions</span></br>';
    // }

    //   if (Table.questionArray.some(question => question.Response.trim() === '')) {
    //     validation += '<span style=\'color:red;\'>*</span> <span>Please enter all questions</span><br>';
    // }

    return validation;
  }

  getDivision() {
    return new Promise((resolve, rejects) => {
      this.commonDataService.getDivision({}).subscribe(
        (result: any) => {
          this.divisionList = [];
          if (result.data.Table.length > 0) {
            this.divisionList = result.data.Table;
            resolve(true);
          }
        },
        (error) => {
          rejects(true);
        }
      );
    });
  }

  // getCustomerCredit() {
  //
  //   this.creditApplicationService.getCustomerCreditList({}).subscribe((result: any) => {
  //     if(result.message == 'Success') {
  //       this.creditLimit = result.data.Table;
  //     }
  //   })
  // }

  getOfficeList(DivisionId) {
    return new Promise((resolve, rejects) => {
      const payload = { DivisionId };
      this.commonDataService.getOfficeByDivisionId(payload).subscribe(
        (result: any) => {
          this.officeList = [];

          // this.FinancialForm.controls.OfficeId.setValue('');
          if (result.message == "Success") {
            if (result.data && result.data.Table.length > 0) {
              this.officeList.push(...result.data.Table);
              resolve(true);
            }
          }
        },
        (error) => {
          rejects();
        }
      );
    });
  }

  getTradeList() {
    
    debugger;
    this.creditApplicationService.getTradeList({}).subscribe((result: any) => {
      if (result.message == "Success") {
        this.getTradeLists = result.data.Table;
      }
    });
  }

  getCustomerAndBranch() {
    debugger;
    this.creditApplicationService
      .getCustomerAndBranch({})
      .subscribe((result: any) => {
        if (result.message == "Success") {
          this.customerBranchList = result.data.Table;
        }
      });
  }

  // getCustomerDropDown(){

  //     const payload = {}

  //     this.creditApplicationService.getCreditApplicationDropdowns(payload).subscribe((result: any) => {
  //       if (result.message == 'Success') {
  //         this.customerAndBranchList = result.data.Table2;
  //       }
  //     })
  //  }

  getNumberRangeList() {
    //  If credit Id present then not generate a code
    this.creditApplicationForm.value.CreditApplicationNumber = "";
    const creditId = this.creditApplicationForm.value.CreditApplicationNumber;
    if (creditId) {
      return;
    }

    this.autoGenerationCodeService
      .getNumberRangeList({ Id: 0 })
      // .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        if (result.message == "Success") {
          this.numberRangeList = result["data"].Table;
          this.autoCodeGeneration(true);
        }
      });
  }

  goBack() {
    this.router.navigate([
      "/views/transactions/credit-application/credit-application-view",
    ]);
  }

  // * generate the auto generate code (credit Number)
  autoCodeGeneration(event: any) {
    return new Promise(async (resolve, reject) => {
      if (!this.isUpdate) {
        if (event) {
          let creditApplication = this.numberRangeList.filter(
            (x) => x.ObjectName == "Credit Application"
          );
          if (creditApplication.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem(
              [
                { sectionA: creditApplication[0].SectionA },
                { sectionB: creditApplication[0].SectionB },
                { sectionC: creditApplication[0].SectionC },
                { sectionD: creditApplication[0].SectionD },
              ],
              creditApplication[0].NextNumber,
              event
            );
            let code = this.autoCodeService.NumberRange(
              creditApplication[0],
              sectionOrderInfo.sectionA,
              sectionOrderInfo.sectionB,
              sectionOrderInfo.sectionC,
              sectionOrderInfo.sectionD
            );

            if (code)
              this.creditApplicationForm.controls[
                "CreditApplicationNumber"
              ].setValue(code.trim().toUpperCase());
            // this.creditId = code;
            resolve(true);
          } else {
            Swal.fire(
              "Please create the auto-generation code for Receipt Voucher."
            );
            resolve(true);
          }
        } else {
          this.creditApplicationForm.controls[
            "CreditApplicationNumber"
          ].setValue("");
          reject(false);
        }
      } else {
        resolve(true);
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

    const Table = this.creditApplicationForm.value;

    if (Table.DivisionId && Table.OfficeId) {
      officeInfo = this.officeList.find((x) => x.ID == Table.OfficeId);
      divisionInfo = this.divisionList.find((x) => x.ID == Table.DivisionId);
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

  //  * update the sales person value form the customer after branch selected
  updateSalesPerson() {
    const CustomerId = this.creditApplicationForm.value.CustomerId;
    const selectedCustomerDetails = this.customerAndBranchList.find(
      (customer) => customer.CustomerID == CustomerId
    );
    this.creditApplicationForm.controls["SalesPersonId"].setValue(
      selectedCustomerDetails.SalesId
    );
  }

  getCustomerFullDetail(event: any) {
    this.updateSalesPerson();
    if (this.customerBranchList.length > 1) {
      var inputRequest = {
        CustomerBranchID: this.customerBranchList[0].CustomerBranchID,
        CustomerID: this.creditApplicationForm.value.CustomerId,
      };
    } else {
      debugger;
      var inputRequest = {
        CustomerBranchID: event,
        CustomerID: this.creditApplicationForm.value.CustomerId,
      };
      var payloads = {
        CreditApplicationId: this.creditId,
        CustomerBranchID: event,
        CustomerID: this.creditApplicationForm.value.CustomerId,
      };
    }
    this.customerService
      .getCustomerId(inputRequest)
      .pipe()
      .subscribe((response) => {
        debugger;
        this.customerDetail = response;
        //  this.salesPersonid = response.data.Table3.SalesId
        console.log(response, "aekhfuieashufg");
        // debugger
        const doc = this.customerDetail["data"].Table3;
        this.creditApplicationForm.value.SalesPersonId =
          this.customerDetail["data"].Table2[0].SalesId;
        this.documentInfo = this.constructDocumentPayload(doc);
        this.patchCustomerData(this.customerDetail);
      });
    this.customerService
      .getCustomerBranchDuplicate(payloads)
      .subscribe((result: any) => {
        debugger;
        if (result.message == "Success") {
          console.log(result.data, "result");
        } else {
          this.creditApplicationForm.controls["CustomerBranchId"].setValue(0);
          this.creditApplicationForm.controls["CustomerId"].setValue(0);
          Swal.fire(result.data);
        }
      });
  }

  getCustomerBranchCode(event: any) {
    this.creditApplicationForm.value.IsRevise = false;
    debugger;
    let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`;
    this.dataService
      .post(service, { CustomerId: event })
      .subscribe((result: any) => {
        this.customerBranchList = result.data.Table3;

        this.customerBranchList = result.data.Table3;
        if (result.data.Table3.length > 0) {
          this.creditApplicationForm.controls["CustomerBranchId"].setValue(0);
          if (this.customerBranchList.length > 0) {
            const branchCode = this.customerBranchList[0].CustomerBranchID;
            this.creditApplicationForm.controls["CustomerBranchId"].setValue(
              branchCode
            );

            const payload = {
              CreditApplicationId: this.creditId,
              CustomerID: event,
              CustomerBranchID: branchCode,
            };
            this.customerService
              .getCustomerBranchDuplicate(payload)
              .subscribe((result: any) => {
                if (result.message == "Success") {
                  this.getCustomerFullDetail(branchCode);
                } else {
                  this.creditApplicationForm.controls[
                    "CustomerBranchId"
                  ].setValue(0);
                  this.creditApplicationForm.controls["CustomerId"].setValue(0);
                  Swal.fire(result.data);
                }
              });
           
          }
        }
        console.log(result, "resultresultresult");
      });
  }

  Cancel() {
    this.router.navigate([
      "/views/transactions/credit-application/credit-application-view",
    ]);
  }

  // * get Branch dropdown list
  // getBranch(isSelectBranch= false, event) {
  //   debugger
  //   const CustomerId = this.creditApplicationForm.value.CustomerId ? this.creditApplicationForm.value.CustomerId :event;
  //   this.customerBranchList = this.customerAndBranchList.filter((customer) => customer.CustomerID == CustomerId);
  //   if(this.customerBranchList.length){
  //     this.patchCustomerData(this.customerBranchList[0])
  //   }
  //   this.creditApplicationForm.controls['CustomerBranchId'].setValue('0');
  //   this.creditApplicationForm.controls['SalesPersonId'].setValue('');
  //   if(this.customerBranchList.length === 1 &&  isSelectBranch){
  //     const singleBranch =  this.customerBranchList[0];
  //     this.creditApplicationForm.controls['CustomerBranchId'].setValue(singleBranch.CustomerBranchID);
  //   }

  // }
  
  //  * update the auto generated code after save and final
  updateAutoGenerated() {
    let Info = this.numberRangeList.filter(
      (x) => x.ObjectName == "Credit Application"
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
          (result: any) => {},
          (error) => {
            console.error(error);
          }
        );
    }
  }

  // * enable the form to edit the value
  enableEditForm() {
    this.creditApplicationForm.enable();
  }

  // * patch customer details when customer selected form the dropdown
  patchCustomerData(customer: any) {
    debugger;
    this.creditApplicationForm.controls["CustomerStatus"].setValue(
      customer.data.Table1[0].IsActive ? 1 : 0
    );
    this.creditApplicationForm.controls["CustomerPan"].setValue(
      customer.data.Table4[0].PANNo
    );
    this.creditApplicationForm.controls["CustomerPrimeContact"].setValue(
      customer.data.Table1[0].primaryTelephone
    );
    this.creditApplicationForm.controls["Telephone"].setValue(
      customer.data.Table1[0].PhoneNo
    );
    this.creditApplicationForm.controls["Mobile"].setValue(
      customer.data.Table1[0].MobileNo
    );
    this.creditApplicationForm.controls["Email"].setValue(
      customer.data.Table1[0].EmailId
    );
    this.creditApplicationForm.controls["SalesPersonId"].setValue(
      customer.data.Table2[0].SalesPIC
    );
  }

  printPage() {
    window.print();
  }

  getWQuestions(list: any = []) {
    const Table = this.creditApplicationForm.value;

    const payload = {
      Division: +Table.DivisionId,
    };

    debugger;
    this.creditApplicationService.getQuestionAndDropdown(payload).subscribe(
      (result: any) => {
        if (result.message == "Success") {
          this.creditLimit = result.data.Table2;
        }
        if (result.message == "Success") {
          if (list.length > 0) {
            this.questionArray = list;
          } else {
            const finalQuestionList = [];
            result.data.Table1.map((question) => {
              debugger;
              const obj = {
                CreditValidationId: 0,
                CreditApplicationId: 0,
                CreditQuestions: question.CreditQuestions,
                Response: "",
              };
              finalQuestionList.push(obj);
            });
            this.questionArray = finalQuestionList;
            this.dropDownOptions = [...result.data.Table];
          }
        }
      },
      (error) => {}
    );
  }

  getDropdowns() {
    const payload = {};
    this.creditApplicationService
      .getCreditApplicationDropdowns(payload)
      .subscribe((result: any) => {
        if (result.message == "Success") {
          const resultData = result.data;
          // this.customerAndBranchList = result.data.Table2;
          this.applicationStatus = resultData.Table.length
            ? resultData.Table
            : [];
        }
      });
  }

  getCustomerDropDownList() {
    const payload = {};
    this.creditApplicationService
      .getCustomerDropDownList(payload)
      .subscribe((result: any) => {
        if (result.message == "Success") {
          const resultData = result.data;
          this.customerAndBranchList = result.data.Table;
        }
      });
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 523,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.enableEditForm();
            this.editMode();
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
}
