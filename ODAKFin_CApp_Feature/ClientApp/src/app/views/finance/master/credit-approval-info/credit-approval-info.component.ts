import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Table, Table1, Table2, Table3, Table4, creditModel } from 'src/app/model/financeModule/credit';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-approval-info',
  templateUrl: './credit-approval-info.component.html',
  styleUrls: ['./credit-approval-info.component.css'],
  providers: [DatePipe]
})
export class CreditApprovalInfoComponent implements OnInit {


  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');

  selectedTabName: string = 'Documents';
  isUpdate: boolean = false;
  creditId: number = 0;
  divisionList: any[];
  creditInfo: any = [];
  approvedInfo: any = [];
  documentInfo: any = [];
  quesInfo: any = [];
  approvalList: any[];
  workFlowEventList: any[];
  creditFormInfo: FormGroup;
  ApprovalForm: FormGroup;
  DocumentForm: FormGroup;
  QuestionForm: FormGroup;
  selectedCreditInfoID: any;
  selectedApprovalInfoID: any;
  selectedDocumentInfoID: any;
  selectedQuestionInfoID: any;
  CASDivisionId: Number = 0;
  isUpdateModeEnable: boolean = false;
  isCloneRecord: boolean = false;

  creditModel: creditModel = new creditModel();
  Table: Table = new Table();
  Table1: Table1 = new Table1();
  Table2: Table2 = new Table2();
  Table3: Table3 = new Table3();
  Table4: Table4 = new Table4();

  isEditMode: boolean = false;
  isEditMode1: boolean = false;
  selectCredit: boolean = false;
  selectApproval: boolean = false;
  selectDocument: boolean = false;
  selectQuestion: boolean = false;
  creditList: any[];
  isCreate: boolean = true;

  isApproval: boolean = false;
  isDocuments: boolean = false;
  isQuestionnaire: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private globals: Globals,
    private datePipe: DatePipe,
    private commonDataService: CommonService
  ) { }

  ngOnInit(): void {
    this.getCreditApprovalList();
    this.getApprovalMethod();
    this.getWorkFlowEvent();
    this.getDivisionList();
    this.creditForm();
    this.createApprovalForm();
    this.createDocumentForm();
    this.createQuestionForm();
    this.route.params.subscribe(res => {
      if (res.id) {
        this.creditId = res.id;
        this.isUpdate = res.isUpdate == 'true' ? true : false;
        this.isUpdateModeEnable = true;
        this.isCreate = false;
        this.getCreditDetails(res.id);
        if (res.isCopy) {
          this.isCloneRecord = true;
          this.isCreate = true;
        }
        else if (!this.isCloneRecord) {
          this.creditFormInfo.disable();
          this.ApprovalForm.disable();
          this.DocumentForm.disable();
          this.QuestionForm.disable();
        }

        this.getPermissionListForUpdate(622, 'Approval');
        this.getPermissionListForUpdate(623, 'Documents');
        this.getPermissionListForUpdate(624, 'Questionnaire');


      } else {
        this.getPermissionListForCreate(622, 'Approval');
        this.getPermissionListForCreate(623, 'Documents');
        this.getPermissionListForCreate(624, 'Questionnaire');
      }
    });
  }

  getPermissionListForUpdate(value, route) {
    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {


      // if (route == 'Approval') {      COMMENTED THE BELOW PERMISSION DUE TO THE REMOVED THE APPROVAL TAB - 08-03-2024
      //   if (data.length > 0) {
      //     console.log("PermissionObject", data);

      //     if (data[0].SubfunctionID == paylod.SubfunctionID) {

      //       if (data[0].Update_Opt == 2) {
      //         this.isApproval = true;
      //         this.selectedTabName = 'Approval'
      //       } else {
      //         this.isApproval = false;
      //       }
      //     }
      //   } else {
      //     this.isApproval = false;
      //   }
      // }

      if (route == 'Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isDocuments = true;
              if (this.isApproval == false) {
                this.selectedTabName = 'Documents'
              }
            } else {
              this.isDocuments = false;
            }
          }
        } else {
          this.isDocuments = false;
        }
      }

      if (route == 'Questionnaire') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isQuestionnaire = true;
              if (this.isDocuments == false) {
                this.selectedTabName = 'Documents'
              }
            } else {
              this.isQuestionnaire = false;
            }
          }
        }
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForCreate(value, route) {
    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (route == 'Approval') {
        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isApproval = true;
              this.selectedTabName = 'Approval'
            } else {
              this.isApproval = false;
            }
          }
        } else {
          this.isApproval = false;
        }
      }

      if (route == 'Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isDocuments = true;
              if (this.isApproval == false) {
                this.selectedTabName = 'Documents'
              }
            } else {
              this.isDocuments = false;
            }
          }
        } else {
          this.isDocuments = false;
        }
      }

      if (route == 'Questionnaire') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isQuestionnaire = true;
              if (this.isDocuments == false) {
                this.selectedTabName = 'Documents'
              }
            } else {
              this.isQuestionnaire = false;
            }
          }
        }
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }

  checkPermission(value) {
    if (value == 'Approval' && this.isApproval == true) {
      this.selectedTabName = 'Approval'
    } else if (value == 'Documents' && this.isDocuments == true) {
      this.selectedTabName = 'Documents'
    } else if (value == 'Questionnaire' && this.isQuestionnaire == true) {
      this.selectedTabName = 'Questionnaire'
    } else {
      Swal.fire('Please Contact Administrator');
    }
  }


  creditForm() {
    this.creditFormInfo = this.fb.group({
      divisionId: [0],
      maxCreditDay: [''],
      maxCreditAmount: [''],
      effectiveDate: ['']
    });
  }

  createApprovalForm() {
    this.ApprovalForm = this.fb.group({
      Id: [0],
      CreditApprovalSetupId: [0],
      ApprovalMethodId: [0],
      WorkflowEventId: [0],
      EffectiveDate: ['']
    });
  }

  createDocumentForm() {
    this.DocumentForm = this.fb.group({
      Id: [0],
      CreditApprovalSetupId: [0],
      DocumentType: [''],
    });
  }

  createQuestionForm() {
    this.QuestionForm = this.fb.group({
      Id: [0],
      CreditApprovalSetupId: [0],
      Description: [''],
      CASDivisionId: [0],
    });
  }

  getApprovalMethod() {
    var service = `${this.globals.APIURL}/CreditManagement/GetSetupApprovalMethods`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.approvalList = [];
      if (result.data.Table.length > 0) {
        this.approvalList = result.data.Table;
      }
    }, error => { });
  }

  getWorkFlowEvent() {
    var service = `${this.globals.APIURL}/CreditManagement/GetCreditWorkFlowEVent`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.workFlowEventList = [];
      if (result.data.Table.length > 0) {
        this.workFlowEventList = result.data.Table;
      }
    }, error => { });
  }

  getCreditDetails(id: Number) {
    let service = `${this.globals.APIURL}/CreditManagement/GetCreditSetupApproval`;
    let payload = { Id: id, Division: '', ApprovalMethod: '' }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.creditInfo = [];
      this.approvedInfo = [];
      this.documentInfo = [];
      this.quesInfo = [];
      if (result.data.Table.length > 0) {
        this.creditFormInfo.controls['divisionId'].setValue(result.data.Table[0].DivisionId);
        this.CASDivisionId = result.data.Table[0].CASDivisionId;
      }
      if (result.data.Table1.length > 0) { this.creditInfo = result.data.Table1; }
      if (result.data.Table2.length > 0) { this.approvedInfo = result.data.Table2; }
      if (result.data.Table3.length > 0) { this.documentInfo = result.data.Table3; }
      if (result.data.Table4.length > 0) { this.quesInfo = result.data.Table4; }
    }, error => { });
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {};
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  addCreditInfo(type: string) {
    var validation = "";
    if (this.creditFormInfo.value.divisionId == "") { validation += "<span style='color:red;'>*</span> <span>Please select Division</span></br>" }
    if (type == 'creditInfo') {
      if (this.creditFormInfo.value.maxCreditDay == "") { validation += "<span style='color:red;'>*</span> <span>Please enter Max Credit (In Days)</span></br>" }
      if (this.creditFormInfo.value.maxCreditAmount == "") { validation += "<span style='color:red;'>*</span> <span>Please enter Max Credit (In Amount)</span></br>" }
      if (this.creditFormInfo.value.effectiveDate == "") { validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>" }
    }
    else if (type == 'Approval') {
      if (this.ApprovalForm.value.ApprovalMethodId == "") { validation += "<span style='color:red;'>*</span> <span>Please select Approval Method</span></br>" }
      // if (this.ApprovalForm.value.WorkflowEventId == "") { validation += "<span style='color:red;'>*</span> <span>Please select Workflow Event</span></br>" }
      if (this.ApprovalForm.value.EffectiveDate == "") { validation += "<span style='color:red;'>*</span> <span>Please select Effective Date</span></br>" }
    }
    else if (type == 'Document') {
      if (this.DocumentForm.value.DocumentType == "") { validation += "<span style='color:red;'>*</span> <span>Please enter Document Type</span></br>" }
    }
    else if (type == "Question") {
      if (this.QuestionForm.value.Description == "") { validation += "<span style='color:red;'>*</span> <span>Please enter Description</span></br>" }
    }
    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    if (type == 'creditInfo') {
      var creditInfo = this.creditFormInfo.value;
      this.creditInfo.push({
        CreditApprovalSetupId: 0,
        DivisionId: Number(creditInfo.divisionId),
        MaxCreditDays: Number(creditInfo.maxCreditDay),
        MaxCreditAmount: Number(creditInfo.maxCreditAmount),
        EffectiveDate: creditInfo.effectiveDate,
        CreatedBy: Number(localStorage.getItem('UserID')),
        CreatedDate: new Date(),
        UpdatedBy: Number(localStorage.getItem('UserID')),
        UpdatedDate: new Date()
      });

      this.creditFormInfo.patchValue({
        maxCreditDay: '',
        maxCreditAmount: '',
        effectiveDate: ''
      });
    }
    else if (type == 'Approval') {
      let approvalData = this.ApprovalForm.value;
      this.approvedInfo.push({
        Id: 0,
        CreditApprovalSetupId: this.creditId,
        ApprovalMethod: approvalData.ApprovalMethodId,
        EventName: approvalData.WorkflowEventId,
        EffectiveDate: new Date(approvalData.EffectiveDate)
      });
      this.createApprovalForm();
    }
    else if (type == 'Document') {
      if (this.isEditMode) {
        this.documentInfo[this.selectedDocumentInfoID] = this.DocumentForm.value;
        this.isEditMode = !this.isEditMode;
        this.createDocumentForm();

        return;
      }
      else {
        this.documentInfo.push({
          Id: 0,
          CreditApprovalSetupId: this.creditId,
          DocumentType: this.DocumentForm.value.DocumentType
        });
        this.createDocumentForm();
      }
    }
    else if (type == 'Question') {
      if (this.isEditMode1) {
        this.quesInfo[this.selectedQuestionInfoID] = this.QuestionForm.value;
        this.isEditMode1 = !this.isEditMode1;
        this.createQuestionForm();

        return;
      }
      this.quesInfo.push({
        Id: 0,
        CreditApprovalSetupId: this.creditId,
        Description: this.QuestionForm.value.Description,
        CASDivisionId: this.CASDivisionId
      });
      this.createQuestionForm();
    }
  }


  saveCredit() {
    var validation = "";
    if (this.creditFormInfo.value.divisionId == "") { validation += "<span style='color:red;'>*</span> <span>Please select Division</span></br>" }
    if (this.isCloneRecord || this.isCreate) {
      let divisionInfo = this.creditList.filter(x => x.DivisionId == this.creditFormInfo.value.divisionId)
      if (divisionInfo.length > 0) { validation += "<span style='color:red;'>*</span><span>Already, a division has been created. Please select a new division.</span></br>" }
    }

    if (validation != "") {
      Swal.fire(validation); return false;
    }

    this.creditModel = new creditModel();

    if (this.creditInfo.length > 0) {
      this.creditModel.CreditManagement.Table = [];
      this.Table = new Table();
      this.Table.DivisionId = this.creditFormInfo.value.divisionId ? this.creditFormInfo.value.divisionId : 0;
      this.Table.CASDivisionId = this.isCloneRecord ? 0 : this.CASDivisionId;
      this.creditModel.CreditManagement.Table.push(this.Table);
    }

    if (this.creditInfo.length > 0) {
      this.creditModel.CreditManagement.Table1 = [];
      for (let data of this.creditInfo) {
        this.Table1 = new Table1();
        this.Table1.CreditApprovalSetupId = this.isCloneRecord ? 0 : data.CreditApprovalSetupId;
        this.Table1.MaxCreditDays = data.MaxCreditDays;
        this.Table1.MaxCreditAmount = data.MaxCreditAmount;
        this.Table1.EffectiveDate = data.EffectiveDate;
        this.Table1.CreatedBy = data.CreatedBy;
        this.Table1.CreatedDate = data.CreatedDate;
        this.Table1.UpdatedBy = data.UpdatedBy;
        this.Table1.UpdatedDate = data.UpdatedDate;
        this.Table1.CASDivisionId = this.isCloneRecord ? 0 : this.CASDivisionId;
        this.creditModel.CreditManagement.Table1.push(this.Table1);
      }
    }

    if (this.approvedInfo.length > 0) {
      this.creditModel.CreditManagement.Table2 = [];
      for (let data of this.approvedInfo) {
        this.Table2 = new Table2();
        let workFlowEvent = this.workFlowEventList.find(x => x.EventName == data.EventName);
        let CreditApproval = this.approvalList.find(x => x.ApprovalMethod == data.ApprovalMethod);
        this.Table2.Id = this.isCloneRecord ? 0 : data.Id;
        this.Table2.CreditApprovalSetupId = this.isCloneRecord ? 0 : this.creditId;
        this.Table2.ApprovalMethodId = CreditApproval.Id;
        this.Table2.WorkflowEventId = workFlowEvent ? workFlowEvent.Id : 0;
        this.Table2.EffectiveDate = new Date(data.EffectiveDate);
        this.Table2.CASDivisionId = this.isCloneRecord ? 0 : this.CASDivisionId;
        this.creditModel.CreditManagement.Table2.push(this.Table2);
      }
    }

    if (this.documentInfo.length > 0) {
      this.creditModel.CreditManagement.Table3 = [];
      for (let data of this.documentInfo) {
        this.Table3 = new Table3();
        this.Table3.Id = this.isCloneRecord ? 0 : data.Id;
        this.Table3.CreditApprovalSetupId = this.isCloneRecord ? 0 : this.creditId;
        this.Table3.DocumentType = data.DocumentType;
        this.Table3.CASDivisionId = this.isCloneRecord ? 0 : this.CASDivisionId;
        this.creditModel.CreditManagement.Table3.push(this.Table3);
      }
    }

    if (this.quesInfo.length > 0) {
      this.creditModel.CreditManagement.Table4 = [];
      for (let data of this.quesInfo) {
        this.Table4 = new Table4();
        this.Table4.Id = this.isCloneRecord ? 0 : data.Id;
        this.Table4.CreditApprovalSetupId = this.isCloneRecord ? 0 : this.creditId;
        this.Table4.Description = data.Description;
        this.Table4.CASDivisionId = this.isCloneRecord ? 0 : this.CASDivisionId;
        this.creditModel.CreditManagement.Table4.push(this.Table4);
      }
    }

    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to save this Details?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        var service = `${this.globals.APIURL}/CreditManagement/SaveCreditSetupApproval`;
        this.dataService.post(service, this.creditModel).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.data, '', 'success');
          }
          this.router.navigate(['/views/credit/credit-view']);
        }, error => {
          console.error(error);
        });
      } else { }
    });
  }

  OnClickDeleteValue(type: string) {
    if (type == "credit" && this.selectCredit) {
      this.creditInfo.splice(this.selectedCreditInfoID, 1);
      this.selectCredit = false;
    }
    else if (type == "approval" && this.selectApproval) {
      this.approvedInfo.splice(this.selectedApprovalInfoID, 1);
      this.selectApproval = false;
    }
    else if (type == "Document" && this.selectDocument) {
      this.documentInfo.splice(this.selectedDocumentInfoID, 1);
      this.selectDocument = false;
    }
    else if (type == "Question" && this.selectQuestion) {
      this.quesInfo.splice(this.selectedQuestionInfoID, 1);
      this.selectQuestion = false;
    }
    else {
      Swal.fire('Please select the item!!.');
    }
  }

  OnClickRadio(index: Number, rowValue: Object, type: string) {
    if (type == "creditInfo") {
      this.selectedCreditInfoID = index;
      this.selectCredit = true;
    }
    else if (type == "Approval") {
      this.selectedApprovalInfoID = index;
      this.selectApproval = true;
    }
    else if (type == "Document") {
      this.selectedDocumentInfoID = index;
      this.selectDocument = true;
    }
    else if (type == "Question") {
      this.selectedQuestionInfoID = index;
      this.selectQuestion = true;
    }
  }

  OnClickEditValue(type: string) {
    if (type == "Question" && this.selectQuestion) {
      const editRow = this.quesInfo[this.selectedQuestionInfoID];
      this.QuestionForm.patchValue(editRow);
      this.isEditMode1 = !this.isEditMode1;
    }
    else if (type == "Document" && this.selectDocument) {
      const editRow = this.documentInfo[this.selectedDocumentInfoID];
      this.DocumentForm.patchValue(editRow);
      this.isEditMode = !this.isEditMode;
    }
    else {
      Swal.fire('Please select the item!!.');
    }
  }

  getCreditApprovalList() {
    let service = `${this.globals.APIURL}/CreditManagement/GetCreditSetupApproval`;
    this.dataService.post(service, { Id: 0, Division: '', ApprovalMethod: '' }).subscribe((result: any) => {
      this.creditList = [];
      if (result.data.Table.length > 0) {
        this.creditList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

}
