import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-financemaster',
  templateUrl: './financemaster.component.html',
  styleUrls: ['./financemaster.component.css']
})
export class FinanceMasterComponent implements OnInit {

  isShow: boolean = true;
  selectedTabName: string = 'Masters';
  title = 'Finance';
  isEmailids: boolean = false;
  isDocuments: boolean = false;
  isReadDocument: boolean = false;
  isDeleteDocument: boolean = false;

  isSummary: boolean = false;
  isBook: boolean = false;
  isStatement: boolean = false;
  isStatementCreate: boolean = false;
  isReconciliation: boolean = false;
  isUnreconciled: boolean = false;

  isRequest: boolean = false;
  isProgress: boolean = false;
  isPayments: boolean = false;

  private wfAllItems = [];
  private wfItems = [];
  private wfAllItemsHistory = [];
  Pager: any = {};
  PagedItems = [];

  PagerH: any = {};
  PagedItemsH = [];

  wfEventList: any = [];

  isShowWorkflowInbox: boolean = true;
  isShowWorkflowDetails: boolean = false;

  workflowIndexList: any = [];

  workFlowUpdateForm: FormGroup;
  workflowSubmitted: boolean = false;
  workflowDetailTitle: string = 'test-test';
  workflowDetailsList: any = [];
  isNotApproval:boolean=false;
  dispStyle: any = 'none';

  userName: string='';

  wfnumber: string = "0";
  eventnumber: string = "0";
  fromdate: string = "0";
  tilldate: string = "0";
  event_value: string = "0";
  customername: string = "0";
  status: string = "pending";

  wfnumberH: string = "0";
  eventnumberH: string = "0";
  fromdateH: string = "0";
  tilldateH: string = "0";
  event_valueH: string = "0";
  customernameH: string = "0";

  cusBID: string='';
  eventName: string='';
  redirectURL: string='';

  constructor(
    private titleService: Title, private workflow: WorkflowService, public ps: PaginationService,
    private router: Router,private fb: FormBuilder,
    private route: ActivatedRoute,
    private LService: CommonService
  ) {

    this.workFlowUpdateForm = fb.group({
      userEmail: "",
      workflowNo: "",
      currentStep: "",
      totalStep: "",
      remarks: "",
      status: "",
    })

    this.getUserDtls();
    //this.getWorkflowInbox();
   }

  getPermissionListForCreate(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.LService.GetUserPermissionObject(paylod).subscribe(data => {
      if (route == 'Email ids') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isEmailids = true;
            } else {
              this.isEmailids = false;
            }
          }
        } else {
          this.isEmailids = false;
        }
      }

      if (route == 'Documents') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isDocuments = true;
            } else {
              this.isDocuments = false;
            }

            if (data[0].read_Opt == 2) {
              this.isReadDocument = true;
            } else {
              this.isReadDocument = false;
            }

            if (data[0].delete_Opt == 2) {
              this.isDeleteDocument = true;
            } else {
              this.isDeleteDocument = false;
            }
          }
        } else {
          this.isDocuments = false;
          this.isReadDocument = false;
          this.isDeleteDocument = false;
        }

        this.router.navigate(['views/entity/entity-view', { isEmailids: this.isEmailids, isDocuments: this.isDocuments, isReadDocument: this.isReadDocument, isDeleteDocument: this.isDeleteDocument }]);

      }


    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForBanking(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.LService.GetUserPermissionObject(paylod).subscribe(data => {


      if (route == 'Bank Summary') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isSummary = true;
            } else {
              this.isSummary = false;
            }
          }
        } else {
          this.isSummary = false;
        }
      }

      if (route == 'Bank Book') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isBook = true;
            } else {
              this.isBook = false;
            }
          }
        } else {
          this.isBook = false;
        }
      }

      if (route == 'Bank statement') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isStatementCreate = true;
            } else {
              this.isStatementCreate = false;
            }

            if (data[0].read_Opt == 2) {
              this.isStatement = true;
            } else {
              this.isStatement = false;
            }
          }
        } else {
          this.isStatement = false;
          this.isStatementCreate = false;
        }
      }

      if (route == 'Bank Reconciliation') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isReconciliation = true;
            } else {
              this.isReconciliation = false;
            }
          }
        } else {
          this.isReconciliation = false;
        }
      }

      if (route == 'Bank Unreconciled') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isUnreconciled = true;
            } else {
              this.isUnreconciled = false;
            }
          }
        } else {
          this.isUnreconciled = false;
        }
      }


      this.router.navigate(['views/transactions/banking/bank-view',
        {
          isSummary: this.isSummary, isBook: this.isBook, isStatementCreate: this.isStatementCreate,
          isStatement: this.isStatement, isReconciliation: this.isReconciliation, isUnreconciled: this.isUnreconciled
        }]);


    }, err => {
      console.log('errr----->', err.message);
    });
  }

  getPermissionListForPaymentBatch(value, route) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.LService.GetUserPermissionObject(paylod).subscribe(data => {
   

      if (route == 'Open Request') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Create_Opt == 2) {
              this.isRequest = true;
            } else {
              this.isRequest = false;
            }
          }
        } else {
          this.isRequest = false;
        }
      }

      if (route == 'In Progress') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Update_Opt == 2) {
              this.isProgress = true;
            } else {
              this.isProgress = false;
            }
          }
        } else {
          this.isProgress = false;
        }
      }

      if (route == 'Closed Payments') {

        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].Read_Opt == 2) {
              this.isPayments = true;
            } else {
              this.isPayments = false;
            }
          }
        } else {
          this.isPayments = false;
        }

        this.router.navigate(['views/transactions/payment-request/payment-batch',
          { isRequest: this.isRequest, isProgress: this.isProgress, isPayments: this.isPayments }]);

      }


    }, err => {
      console.log('errr----->', err.message);
    });
  }


  ngOnInit() {
    this.titleService.setTitle(this.title);
    $('.my-select').select2();
    //this.getUserDtls();
    if (localStorage.getItem('DashboardType')) {
      this.selectedTabName = localStorage.getItem('DashboardType');
    }

    this.route.params.subscribe(param => {
      if (!param.tabName) {
        return
      }
      if (param.tabName == 'myWorkspace') {
        this.selectedTabName = 'myWorkspace'
      } else if (param.tabName == 'transactions') {
        this.selectedTabName = 'Transactions'
      } else if (param.tabName == 'dashboard') {
        this.selectedTabName = 'Dashboards'
      } else if (param.tabName == 'reports') {
        this.selectedTabName = 'Reports'
      } else {
        this.selectedTabName = 'Masters'
      }
    });
  }

  getUserDtls(){
    var userid = localStorage.getItem("UserID");
    var payload = {
      "UserID": userid,
    }
    this.workflow.getUserDtls(payload).subscribe({
      next:(res)=>{
        console.log('getUserDtls', { res })
        this.userName = res[0].UserName;
        this.getWorkflowInbox();
        this.getWorkflowInboxSearch();
        this.getwfEventList();
      },
      error:(e)=>{
        console.log('error', { e })
      }
    });
  }

  tabClick(value){
    if(value == 1){
      this.wfnumber = "0";
      this.event_value = "0";
      this.eventnumber = "0";
      this.customername = "0";
      this.fromdate = "0";
      this.tilldate = "0";
      this.status = "pending";
      $('#pending').show();
      $('#history').hide();
      this.getWorkflowInboxSearch();
      this.wfClear();
    }
    else if(value == 2){
      this.wfnumber = "0";
      this.event_value = "0";
      this.eventnumber = "0";
      this.customername = "0";
      this.fromdate = "0";
      this.tilldate = "0";
      this.status = "approve";
      $('#history').show();
      $('#pending').hide();
      this.getWorkflowInboxSearch();
      this.wfClearHistory();
    }
  }

  getWorkflowInboxSearch() {
    let payload = {
      userEmail: this.userName,
      wfnumber: "0",
      eventnumber: "0",
      fromdate: "0",
      tilldate: "0",
      event_value:"0",
      customername: "0",
      status: this.status,
    }
    
    this.workflow.getWorkflowInbox(payload).subscribe(data => {
        console.log(data)
        if ((data.Status == true) && (data.AlertMegId == 1)) {
          
          this.wfItems = data.Data
          
        }
        else {
          
        }
      });
  }

  wfSearch(){
    
    if($('#ddlwfnumber').val() == "" || $('#ddlwfnumber').val() == null){
      this.wfnumber = "0";
    }
    else{
      this.wfnumber = $('#ddlwfnumber').val().toString();
    }
    //this.wfnumber = $('#ddlwfnumber').val() ? $('#ddlwfnumber').val().toString() : "0";
    
    if($('#ddlwfdetails').val() == "" || $('#ddlwfdetails').val() == null){
      this.event_value = "0";
    }
    else{
      this.event_value = $('#ddlwfdetails').val().toString();
    }
    //this.event_value = $('#ddlwfdetails').val() ? $('#ddlwfdetails').val().toString() : "0";
    
    this.eventnumber = $('#ddlwfeventName').val() ? $('#ddlwfeventName').val().toString() : "0";
    
    if($('#ddlCustomerName').val() == "" || $('#ddlCustomerName').val() == null){
      this.customername = "0";
    }
    else{
      this.customername = $('#ddlCustomerName').val().toString();
    }
    //this.customername = $('#ddlCustomerName').val() ? $('#ddlCustomerName').val().toString() : "0";
    this.fromdate = $('#ddlfromDate').val() ? $('#ddlfromDate').val().toString() : "0";
    this.tilldate = $('#ddltillDate').val() ? $('#ddltillDate').val().toString() : "0";
    
    
    this.getWorkflowInbox();
  }

  wfSearchHistory(){
    if($('#ddlwfnumberH').val() == "" || $('#ddlwfnumberH').val() == null){
      this.wfnumberH = "0";
    }
    else{
      this.wfnumberH = $('#ddlwfnumberH').val().toString();
    }
    //this.wfnumberH = $('#ddlwfnumberH').val() ? $('#ddlwfnumberH').val().toString() : "0";

    if($('#ddlwfdetailsH').val() == "" || $('#ddlwfdetailsH').val() == null){
      this.event_valueH = "0";
    }
    else{
      this.event_valueH = $('#ddlwfdetailsH').val().toString();
    }
    //this.event_valueH = $('#ddlwfdetailsH').val() ? $('#ddlwfdetailsH').val().toString() : "0";
    this.eventnumberH = $('#ddlwfeventNameH').val() ? $('#ddlwfeventNameH').val().toString() : "0";

    if($('#ddlCustomerNameH').val() == "" || $('#ddlCustomerNameH').val() == null){
      this.customernameH = "0";
    }
    else{
      this.customernameH = $('#ddlCustomerNameH').val().toString();
    }
    //this.customernameH = $('#ddlCustomerNameH').val() ? $('#ddlCustomerNameH').val().toString() : "0";
    this.fromdateH = $('#ddlfromDateH').val() ? $('#ddlfromDateH').val().toString() : "0";
    this.tilldateH = $('#ddltillDateH').val() ? $('#ddltillDateH').val().toString() : "0";
    // alert($('#ddlwfStatusH').val());
    if($('#ddlwfStatusH').val() == 0 || $('#ddlwfStatusH').val() == null){
      this.status = "approve";
    }
    else{
      this.status = $('#ddlwfStatusH').val().toString();
    }
    //this.status = $('#ddlwfStatusH').val() ? $('#ddlwfStatusH').val().toString() : "approve";
    // alert(this.status);
    this.getWorkflowInboxHistory();
  }

  wfClear(){
    $('#ddlwfnumber').val('').trigger("change");
    $('#ddlwfdetails').val('').trigger("change");
    $('#ddlwfeventName').val(0).trigger("change");
    $('#ddlCustomerName').val('').trigger("change");
    $('#ddlfromDate').val('').trigger("change");
    $('#ddltillDate').val('').trigger("change");
    
    this.wfnumber = "0";
    this.event_value = "0";
    this.eventnumber = "0";
    this.customername = "0";
    this.fromdate = "0";
    this.tilldate = "0";

    this.getWorkflowInbox();
  }

  wfClearHistory(){
    $('#ddlwfnumberH').val('').trigger("change");
    $('#ddlwfdetailsH').val('').trigger("change");
    $('#ddlwfeventNameH').val(0).trigger("change");
    $('#ddlCustomerNameH').val('').trigger("change");
    $('#ddlfromDateH').val('').trigger("change");
    $('#ddltillDateH').val('').trigger("change");
    $('#ddlwfStatusH').val(0).trigger("change");
    this.wfnumberH = "0";
    this.event_valueH = "0";
    this.eventnumberH = "0";
    this.customernameH = "0";
    this.fromdateH = "0";
    this.tilldateH = "0";
    this.status = "approve";

    this.getWorkflowInboxHistory();
  }

  getwfEventList(){
    let payload = {

    }
    this.workflow.getwfEventList(payload).subscribe(data => {
      console.log(data);
      this.wfEventList = data;
    });
  }

  getWorkflowInbox() {
    let payload = {
      //userEmail: "anuja@odaksolutions.com",
      userEmail: this.userName,
      wfnumber: this.wfnumber,
      eventnumber: this.eventnumber,
      fromdate: this.fromdate,
      tilldate: this.tilldate,
      event_value: this.event_value,
      customername: this.customername,
      status: this.status,
    }

    this.workflow.getWorkflowInbox(payload).subscribe(data => {
        console.log(data)
        if ((data.Status == true) && (data.AlertMegId == 1)) {
          this.wfAllItems = data.Data
          this.setPageWF(1)
        }
        else {
          this.wfAllItems = []
          this.setPageWF(1)
        }
      });
  }

  getWorkflowInboxHistory() {
    let payload = {
      //userEmail: "anuja@odaksolutions.com",
      userEmail: this.userName,
      wfnumber: this.wfnumberH,
      eventnumber: this.eventnumberH,
      fromdate: this.fromdateH,
      tilldate: this.tilldateH,
      event_value: this.event_valueH,
      customername: this.customernameH,
      status: this.status,
    }

    this.workflow.getWorkflowInbox(payload).subscribe(data => {
        console.log(data)
        if ((data.Status == true) && (data.AlertMegId == 1)) {
          this.wfAllItemsHistory = data.Data
          this.setPageWFH(1)
        }
        else {
          this.wfAllItemsHistory = []
          this.setPageWFH(1)
        }
      });
  }

  getWorkflowDetails(workflowData: any, value) {
    console.log(workflowData)
    this.redirectURL = workflowData.redirectURL;
    console.log(this.redirectURL);
    if (workflowData?.workflowno) {
      let payload = {

      }
      this.workflow.getWorkflowDetails(workflowData?.workflowno).subscribe({
        next: (res: any) => {
          console.log(res)
          if (res?.Status == true || res?.AlertMegId == 1) {
            let resData = res?.Data
            
            let findUser = resData?.find((item:any) => item?.user?.toLowerCase() == this.userName.toLowerCase() && item?.step !=0)
            let findPending = resData?.find((item:any)=> item?.status?.toLowerCase() == 'pending')
            // let findUser = res?.Data?.find((item:any) => item?.user?.toLowerCase() == this.userName?.toLowerCase() && item?.step !=0)
            // let findstep = res?.Data?.find((item:any) => item?.status?.toLowerCase() == 'pending' && item?.step !=0)
            // let findPending = res?.Data?.find((item:any)=> item?.status?.toLowerCase() == 'pending' && findstep?.step == item?.step)
            if(findUser?.step == findPending?.step){
              this.isNotApproval=true;
            }
            let mapUserPool=resData?.reduce((acc: any, item: any) => {
              const existingItem = acc.find((group: any) => group.step === item.step);
              if (existingItem) {
                existingItem.user = existingItem?.user + ', ' + item?.user;
              } else {
                acc.push(item);
              }
              return acc;
            }, []);
            console.log(mapUserPool)

            this.workflowDetailsList = this.isNotApproval ?  resData?.filter((item: any) => item?.status?.toLowerCase() !== "pending") : mapUserPool
            
            this.isShowWorkflowDetails = true;
            this.isShowWorkflowInbox = false;
            console.log("testworkflow",findUser,findPending);
            this.cusBID = workflowData.details;
            this.eventName = workflowData?.eventname;
            //alert(this.cusBID);
            console.log('CusBID',this.cusBID);
            this.workflowDetailTitle = `${workflowData?.workflowno} - ${workflowData?.eventname} - ${workflowData.details} - ${workflowData.customername}`
            this.workFlowUpdateForm.patchValue({
              userEmail: this.userName,
              workflowNo: workflowData.workflowno,
              currentStep: workflowData.currentstep,
              totalStep: workflowData.totalstep
            });
            if(value == 1){
              ($('#progressModel') as any).modal('show');
            }
            if(value == 2){
              ($('#progressModelHistory') as any).modal('show');
            }
            
            // this.dispStyle = 'block'
          }
          else {
            Swal.fire(res?.message ? res?.message : "");
          }
        },
        error: (err: any) => {
          console.log('my-workspace', 'getWorkflowDetails()', (err))
          Swal.fire(err?.message ? err?.message : "");
        }
      })
    }
  }

  // OnApproval(){
  //   if(this.eventName.toUpperCase().trim() == "CREDIT APPLICATION"){
  //     this.KYCValidation();
  //   }
  //   else{
  //     this.updateWorkflowStatus('1');
  //   }
  // }

  // KYCValidation(){
  //   let payload = {
  //     "CusBranchCode": this.cusBID,
  //   }
  //   this.workflow.KYCValidation(payload).subscribe(data => {
  //     if(data.length > 0){
  //       this.updateWorkflowStatus('1');
  //     }
  //     else {
  //       Swal.fire("Please Update the Accounting Details");
  //     }
      
  //   });
  // }

  updateWorkflowStatus(statuscode: string) {
    if (this.workFlowUpdateForm.valid) {
      this.workflowSubmitted = false;
      console.log(this.workFlowUpdateForm.value);
      var temp;
      if(statuscode == '0'){
        temp = 'reject';
      }
      else{
        temp = 'approve';
      }
      let payload = {
        "wfnumber": this.workFlowUpdateForm.value.workflowNo,
        "step_id": +this.workFlowUpdateForm.value.currentStep,
        //"remarks": this.workFlowUpdateForm.value.remarks,
        "remarks": $('#ddlRemarks').val(),
        "statuscode": statuscode,
        "statustext": temp,
        "approvaluser": { "usertype": "string", "userid": this.userName }
      }
      console.log(this.workFlowUpdateForm.value, 'payload', payload)

      this.workflow.updateWorkflowStatus(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res?.Status == true || res?.AlertMegId == 1) {
            Swal.fire("Updated Successfully");
            this.onBackWorkflowInbox()
          } else {
            Swal.fire(res?.message ? res?.message : "")
          }
        },
        error: (err: any) => {
          console.log('my-workspace', 'updateWorkflowStatus()', (err?.error))
          let msg = err?.error && err?.error?.AlertMessage ? err?.error?.AlertMessage : err?.message ? err?.message : ""
          Swal.fire(msg)
        }
      })
    }
    else {
      this.workflowSubmitted = true
      return
    }

  }

  onBackWorkflowInbox() {
    this.isShowWorkflowDetails = false;
    this.isShowWorkflowInbox = true;
    this.isNotApproval=false;
    this.workFlowUpdateForm.reset();
    this.getWorkflowInbox()
    this.dispStyle = 'none',
    ($('#progressModel') as any).modal('hide')
  }

  getSuffix(step: number): string {
    if (step == 1) {
      return 'st';
    } else if (step == 2) {
      return 'nd';
    } else if (step == 3) {
      return 'rd';
    } else {
      return 'th';
    }
  }

  setPageWF(page: number) {
    
    this.Pager = this.ps.getPager(this.wfAllItems.length, page);
    this.PagedItems = this.wfAllItems.slice(this.Pager.startIndex, this.Pager.endIndex + 1)
  }

  setPageWFH(page: number) {
    
    this.PagerH = this.ps.getPager(this.wfAllItemsHistory.length, page);
    this.PagedItemsH = this.wfAllItemsHistory.slice(this.PagerH.startIndex, this.PagerH.endIndex + 1)
  }

  routePage(routePage: string) {

    if (routePage == 'Entity') {
      this.getPermissionListForCreate(537, 'Email ids');
      this.getPermissionListForCreate(538, 'Documents');

    }
    else if (routePage == 'transactions-banking') {
      this.getPermissionListForBanking(486, 'Bank Summary');
      this.getPermissionListForBanking(487, 'Bank Book');
      this.getPermissionListForBanking(488, 'Bank statement');
      this.getPermissionListForBanking(489, 'Bank Reconciliation');
      this.getPermissionListForBanking(490, 'Bank Unreconciled');
    }
    else if (routePage == 'payment-batch') {
      this.getPermissionListForPaymentBatch(491, 'Open Request');
      this.getPermissionListForPaymentBatch(492, 'In Progress');
      this.getPermissionListForPaymentBatch(493, 'Closed Payments');
    }
    else {
      this.getPermissionList(routePage);
    }

    // if (routePage == 'Entity') this.router.navigate(['views/entity/entity-view']);

    // else if (routePage == 'Division') this.router.navigate(['views/division/division-view']);
    // else if (routePage == 'office') this.router.navigate(['views/office/office-view']);
    // else if (routePage == 'cao-view') this.router.navigate(['/views/coa/cao-view']);
    // else if (routePage == 'cao-type') this.router.navigate(['/views/coa-type/cao-type-view']);
    // else if (routePage == 'Exchange Rate Pair') this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
    // else if (routePage == 'auto-code') this.router.navigate(['/views/auto-generate/auto-view']);
    // else if (routePage == 'party') this.router.navigate(['/views/party-mapping/party-mapping-view']);
    // else if (routePage == 'ledger') this.router.navigate(['/views/ledger-mapping/Ledger-mapping-view']);
    // else if (routePage == 'templates') this.router.navigate(['/views/template/template-view']);
    // else if (routePage == 'credit') this.router.navigate(['/views/credit/credit-view']);
    // else if (routePage == 'aging') this.router.navigate(['/views/aging/aging-list']);
    // else if (routePage == 'region') this.router.navigate(['/views/region/region-view']);
    // else if (routePage === 'journal') this.router.navigate(['/views/transactions/journal']);
    // else if (routePage === 'receipt') this.router.navigate(['/views/transactions/receipt']);
    // else if (routePage === 'payment') this.router.navigate(['/views/transactions/payment']);
    // else if (routePage === "contra") this.router.navigate(['/views/contra/contra-view']);
    // else if (routePage === "transactions-banking") this.router.navigate(['/views/transactions/banking/bank-view']);
    // else if (routePage === "purchase") this.router.navigate(['/views/purchase/purchase-view']);
    // else if (routePage === "internal") this.router.navigate(['/views/internal-order/internal-view']);
    // else if (routePage === "voucher") this.router.navigate(['/views/voucher/voucher-reversals']);
    // else if (routePage === "InvoiceAR") this.router.navigate(['/views/transactions/invoices_AR_view']);
    // else if (routePage === "vendorNotes") this.router.navigate(['/views/vendor-notes/vendor-view']);
    // else if (routePage === "InvoiceAP") this.router.navigate(['/views/transactions/invoices_AP_view']);
    // else if (routePage === "Adjustment") this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
    // else if (routePage === "employee-mini-master") this.router.navigate(['/views/finance/master/mini-master']);
    // else if (routePage === "purchase-invoice") this.router.navigate(['/views/purchase-invoice/purchase-invoice-view']);
    // else if (routePage === 'transactionLocks') this.router.navigate(['/views/transactions/transaction-locks']);
    // else if (routePage === "Credit-Review") this.router.navigate(['/views/credit-review/credit-review-view']);
    // else if (routePage === 'payment-request') this.router.navigate(['/views/transactions/payment-request/payment-request-view']);
    // else if (routePage === 'payment-batch') this.router.navigate(['/views/transactions/payment-request/payment-batch']);
    // else if (routePage === 'credit-application') this.router.navigate(['/views/transactions/credit-application/credit-application-view']);
    // else if (routePage === 'Credit-Revise-Revoke') this.router.navigate(['/views/credit-Review/credit-revoke']);
    // else if (routePage === 'account-receivable') this.router.navigate(['/views/transactions/openingBalances/account-receivable']);
    // else if (routePage === 'account-payable') this.router.navigate(['/views/transactions/openingBalances/account-payable']);
    // else if (routePage === 'asset') this.router.navigate(['/views/transactions/openingBalances/asset']);
    // else if (routePage === 'expenses') this.router.navigate(['/views/transactions/openingBalances/expenses']);
    // else if (routePage === 'bank') this.router.navigate(['/views/transactions/openingBalances/bank']);
    // else if (routePage === 'liability') this.router.navigate(['/views/transactions/openingBalances/liability']);
    // else if (routePage === 'equity') this.router.navigate(['/views/transactions/openingBalances/equity']);
    // else if (routePage === 'income') this.router.navigate(['/views/transactions/openingBalances/income']);


  }

  currentModule(type: string) {
    localStorage.setItem('DashboardType', type);
  }

  getPermissionList(routePage: string) {

    // Check Permission for Division Search
    let SubfunctionID = 0;
    if (routePage == 'Division') {
      SubfunctionID = 539;
    } else if (routePage == 'office') {
      SubfunctionID = 542;
    } else if (routePage == 'party') {
      SubfunctionID = 565;
    } else if (routePage == 'ChargeCode') {
      SubfunctionID = 582;
    }
    else if (routePage == 'TaxType') {
      SubfunctionID = 584;
    }
    else if (routePage == 'TaxGroup') {
      SubfunctionID = 586;
    }
    else if (routePage == 'TDS') {
      SubfunctionID = 588;
    }
    else if (routePage == 'SAC') {
      SubfunctionID = 588;
    }
    else if (routePage == 'EmployeeMiniMaster') {
      SubfunctionID = 616;
    }
    else if (routePage == 'AccountReceivable') {
      SubfunctionID = 592;
    }
    else if (routePage == 'AccountPayable') {
      SubfunctionID = 594;
    }
    else if (routePage == 'Asset') {
      SubfunctionID = 612;
    }
    else if (routePage == 'Expenses') {
      SubfunctionID = 598;
    }
    else if (routePage == 'Bank') {
      SubfunctionID = 600;
    }
    else if (routePage == 'Liability') {
      SubfunctionID = 602;
    }
    else if (routePage == 'Equity') {
      SubfunctionID = 604;
    }
    else if (routePage == 'Income') {
      SubfunctionID = 606;
    }
    else if (routePage == 'FinancialYear') {
      SubfunctionID = 618;
    }
    else if (routePage == 'CreditApproval') {
      SubfunctionID = 620;
    }
    else if (routePage == 'Aging') {
      SubfunctionID = 625;
    }
    else if (routePage == 'Region') {
      SubfunctionID = 627;
    }
    else if (routePage == 'NumberRange') {
      SubfunctionID = 629;
    }
    else if (routePage == 'Ledger') {
      SubfunctionID = 579;
    }
    else if (routePage == 'COANumberRange') {
      SubfunctionID = 574;
    }
    else if (routePage == 'Customers') {
      SubfunctionID = 547;
    }
    else if (routePage == 'Vendors') {
      SubfunctionID = 556;
    }
    else if (routePage == 'Templates') {
      SubfunctionID = 573;
    }
    else if (routePage == 'Exchange Rate Pair') {
      SubfunctionID = 608;
    }
    else if (routePage == 'Exchange Rate') {
      SubfunctionID = 610;
    }
    else if (routePage == 'COAType') {
      SubfunctionID = 575;
    }
    else if (routePage == 'COA Master') {
      SubfunctionID = 577;
    }
    else if (routePage == 'Credit-Review') {
      SubfunctionID = 494;
    }
    else if (routePage == 'Credit-Revise-Revoke') {
      SubfunctionID = 496;
    }
    else if (routePage == 'receipt') {
      SubfunctionID = 498;
    }
    else if (routePage == 'payment') {
      SubfunctionID = 500;
    }
    else if (routePage == 'journal') {
      SubfunctionID = 502;
    }
    else if (routePage == 'contra') {
      SubfunctionID = 504;
    }
    else if (routePage == 'Adjustment') {
      SubfunctionID = 506;
    }
    else if (routePage == 'voucher') {
      SubfunctionID = 508;
    }
    else if (routePage == 'purchase-invoice') {
      SubfunctionID = 510;
    }
    else if (routePage == 'vendorNotes') {
      SubfunctionID = 512;
    }
    else if (routePage == 'InvoiceAR') {
      SubfunctionID = 518;
    }
    else if (routePage == 'InvoiceAP') {
      SubfunctionID = 520;
    }
    else if (routePage == 'credit-application') {
      SubfunctionID = 522;
    }
    else if (routePage == 'payment-request') {
      SubfunctionID = 524;
    }
    else if (routePage == 'transactionLocks') {
      SubfunctionID = 526;
    }
    else if (routePage == 'purchase') {
      SubfunctionID = 531;
    }
    else if (routePage == 'internal') {
      SubfunctionID = 533;
    }
    else if (routePage == 'BankMaster') {
      SubfunctionID = 567;
    }
    else if (routePage == 'provision') {
      this.router.navigate(['/views/provision/provision-view']);
    } 
    else if (routePage == 'trailBalance') {
      this.router.navigate(['/views/finance/reports/levelone']);
    } 

    else if (routePage == 'DayBook') {
      this.router.navigate(['/views/reports/report-day-book']);
    } 
    
    else if (routePage == 'recieptVoucher') {
      this.router.navigate(['/views/reports/report-receipt-voucher']);
    } 

    else if (routePage == 'PaymentVoucher') {
      this.router.navigate(['/views/reports/report-payment-voucher']);
    } 

    else if (routePage == 'ContraVoucher') {
      this.router.navigate(['/views/reports/report-contra-voucher']);
    } 

    else if (routePage == 'JournalVoucher') {
      this.router.navigate(['/views/reports/report-journal-voucher']);
    }

    else if (routePage == 'AdjustmentVoucher') {
      this.router.navigate(['/views/reports/report-adjustment-voucher']);
    }

    else if (routePage == 'VoucherReversals') {
      this.router.navigate(['/views/reports/report-voucher-reversal']);
    }
    else if (routePage == 'SalesVoucher') {
      this.router.navigate(['/views/reports/report-sales-voucher']);
    }

    else if (routePage == 'PurchaseVoucher') {
      this.router.navigate(['/views/reports/report-purchase-voucher']);
    }

    else if (routePage == 'ARBalanceSummary') {
      this.router.navigate(['/views/reports/report-ar-levelone']);
    } 

    else if (routePage == 'ARAgingSummary') {
      this.router.navigate(['/views/reports/report-ar-leveltwo']);
    } 

    else if (routePage == 'ARSalesSummary') {
      this.router.navigate(['/views/reports/report-ar-levelthree']);
    } 

    else if (routePage == 'APBalanceSummary') {
      this.router.navigate(['/views/reports/report-ap-levelone']);
    } 

    else if (routePage == 'APAgingSummary') {
      this.router.navigate(['/views/reports/report-ap-leveltwo']);
    } 


    
    
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: SubfunctionID
    }
    if (SubfunctionID != 0) {
      this.LService.GetUserPermissionObject(paylod).subscribe(data => {
        if (data.length > 0) {
          console.log("PermissionObject", data);

          if (data[0].SubfunctionID == paylod.SubfunctionID) {

            if (data[0].SubFunctionName.trim() == 'Search') {

              if (routePage == 'Division') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['views/division/division-view']);
                }
              } else if (routePage == 'office') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['views/office/office-view']);
                }
              } else if (routePage == 'party') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/party-mapping/party-mapping-view']);
                }
              }
              else if (routePage == 'ChargeCode') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/chargecode/chargecodeview']);
                }
              }
              else if (routePage == 'TaxType') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/taxlist/taxlistView']);
                }
              }
              else if (routePage == 'TaxGroup') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/taxgroup/taxgroupview']);
                }
              }
              else if (routePage == 'TDS') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/tds/tdsview']);
                }
              }
              else if (routePage == 'SAC') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/SAC/SACview']);
                }
              }
              else if (routePage == 'EmployeeMiniMaster') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/mini-master']);
                }
              }
              else if (routePage == 'AccountReceivable') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/account-receivable']);
                }
              }
              else if (routePage == 'AccountPayable') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/account-payable']);
                }
              }
              else if (routePage == 'Asset') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/asset']);
                }
              }
              else if (routePage == 'Expenses') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/expenses']);
                }
              }
              else if (routePage == 'Bank') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/bank']);
                }
              }
              else if (routePage == 'Liability') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/liability']);
                }
              }
              else if (routePage == 'Equity') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/equity']);
                }
              }
              else if (routePage == 'Income') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/openingBalances/income']);
                }
              }
              else if (routePage == 'FinancialYear') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/financialyearview']);
                }
              }
              else if (routePage == 'CreditApproval') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/credit/credit-view']);
                }
              }
              else if (routePage == 'Aging') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/aging/aging-list']);
                }
              }
              else if (routePage == 'Region') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/region/region-view']);
                }
              }
              else if (routePage == 'Customers') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/Customer/Customerview']);
                }
              }
              else if (routePage == 'Vendors') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/Vendor/Vendorview']);
                }
              }
              else if (routePage == 'Exchange Rate Pair') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
                }
              }
              else if (routePage == 'Exchange Rate') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/exchangerate/exchangerateview']);
                }
              }
              else if (routePage == 'COAType') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/coa-type/cao-type-view']);
                }
              }
              else if (routePage == 'COA Master') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/chartaccounts/chartaccountsView']);
                }
              }
              else if (routePage == 'Credit-Review') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/credit-review/credit-review-view']);
                }
              }
              else if (routePage == 'Credit-Revise-Revoke') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/credit-Review/credit-revoke']);
                }
              }
              else if (routePage == 'receipt') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/receipt']);
                }
              }
              else if (routePage == 'payment') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/payment']);
                }
              }
              else if (routePage == 'journal') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/journal/journal-view']);
                }
              }
              else if (routePage == 'contra') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/contra/contra-view']);
                }
              }
              else if (routePage == 'Adjustment') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/Adjustment/Adjustment-Voucher']);
                }
              }
              else if (routePage == 'voucher') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/voucher/voucher-reversals']);
                }
              }
              else if (routePage == 'purchase-invoice') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/purchase-invoice/purchase-invoice-view']);
                }
              }
              else if (routePage == 'vendorNotes') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/vendor-notes/vendor-view']);
                }
              }
              else if (routePage == 'InvoiceAR') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/invoices_AR_view/invoices_AR_view']);
                }
              }
              else if (routePage == 'InvoiceAP') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/invoices_AP_view/invoices_AP_view']);
                }
              }
              else if (routePage == 'credit-application') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/credit-application/credit-application-view']);
                }
              }
              else if (routePage == 'payment-request') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/payment-request/payment-request-view']);
                }
              }
              else if (routePage == 'transactionLocks') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/transactions/transaction-locks/transaction-locks-view']);
                }
              }
              else if (routePage == 'purchase') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/purchase/purchase-view']);
                }
              }
              else if (routePage == 'internal') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/internal-order/internal-view']);
                }
              }
              else if (routePage == 'BankMaster') {
                
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/finance/master/bank-account/bank-accountview']);
                }
              }
              // else if (routePage == 'provision') {
                
              //   if (data[0].Read_Opt != 2) {
              //     Swal.fire('Please Contact Administrator');
              //   }
              //   else {
              //     this.router.navigate(['/views/provision/provision-view']);
              //   }
              // }


              else {
                Swal.fire('Please Contact Administrator');
              }
            }
            else {
              if (routePage == 'NumberRange') {
                if (data[0].Create_Opt != 2) {
                  if (data[0].Update_Opt != 2) {
                    if (data[0].Read_Opt != 2) {
                      Swal.fire('Please Contact Administrator');
                    }
                    else {
                      this.router.navigate(['/views/auto-generate/auto-view']);
                    }
                  }
                  else {
                    this.router.navigate(['/views/auto-generate/auto-view']);
                  }
                }
                else {
                  this.router.navigate(['/views/auto-generate/auto-view']);
                }
              } else if (routePage == 'Ledger') {
                if (data[0].Update_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/ledger-mapping/Ledger-mapping-view']);
                }
              } else if (routePage == 'COANumberRange') {
                if (data[0].Read_Opt != 2) {
                  Swal.fire('Please Contact Administrator');
                }
                else {
                  this.router.navigate(['/views/coa/cao-view']);
                }
              }
              else if (routePage == 'Templates') {
                if (data[0].Read_Opt != 2) {
                  if (data[0].Create_Opt != 2) {
                    if (data[0].Update_Opt != 2) {
                      Swal.fire('Please Contact Administrator');
                    }
                    else {
                      this.router.navigate(['/views/template/template-view']);
                    }
                  }
                  else {
                    this.router.navigate(['/views/template/template-view']);
                  }
                }
                else {
                  this.router.navigate(['/views/template/template-view']);
                }
              }

              else {
                Swal.fire('Please Contact Administrator');
              }
            }
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
}
