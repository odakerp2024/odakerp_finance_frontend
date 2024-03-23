import { FinancialYear } from './../../../../../model/Organzation';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transaction-locks-details',
  templateUrl: './transaction-locks-details.component.html',
  styleUrls: ['./transaction-locks-details.component.css']
})
export class TransactionLocksDetailsComponent implements OnInit {

  pager: any = {};
  pagedItems: any = [];
  ModifiedOn: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedBy: string = '';
  transactionLockForm: FormGroup;
  finalYearList: any = [];
  periodList: any = [];
  PeriodTypeList: any = [];
  isUpdateMode: boolean = false;
  statusList: any = [];
  TransactionLockId: number = 0;
  isSavemode: boolean = false
  payload: any;
  generatePeriodButton: boolean = false;
  makeGeneratePeriodButton: boolean = false;
  maxDate = new Date();
  minDate = new Date();
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  // isUpdate: boolean;
  isFinalMode: boolean;
  FinancialYearId: number;
  FinancialYearID: number;
  TransactionPeriodId: any;
  newStatus: any;

  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    public commonDataService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getDropDowList();

    this.route.params.subscribe(param => {
      if (param.id) {
        // this.isUpdate = true;
        this.isUpdateMode = true;
        this.TransactionLockId = param.id;
        this.getTransactionList();
        this.transactionLockForm.disable();
      }
      // else {
      //   this.getTransactionList();
      // }
    })
  }

  createForm() {
    this.transactionLockForm = this.fb.group({
      TransactionLockId: [this.TransactionLockId],
      FinancialYear: [0],
      FYStartDate: [''],
      FYEndDate: [''],
      PeriodType: [0],
      IsGenerate: [0],
      StatusId: [1],
      //StatusId: [0],
      IsFinal: [0],
      CreatedBy: [localStorage.getItem('UserID')],
      periodArray: this.fb.array([])
    })
  }

  get items(): FormArray {
    return this.transactionLockForm.get('periodArray') as FormArray;
  }
  getgeneratebutton(){
    this.generatePeriodButton = false;
  }

  checkRecordIsExit(Id){
    console.log('Id', Id)
    var service = `${this.globals.APIURL}/TransactionLocks/GetTransactionLockFinancialYear`;
    this.dataService.post(service, {
      "FinancialYearId": Id
      }).subscribe((result: any) => {
        const resultTableData = result.data.Table;
      if (result.message == "Success" && resultTableData.length > 0) {
        const isFinancialYearExist = resultTableData[0].Result == 'Record does not exist'? false : true;
        isFinancialYearExist ? Swal.fire(resultTableData[0].Result) : ''
        isFinancialYearExist ? this.createForm() : ''
      }
    }, error => { });
  }

  addNewAddressGroup() {
    const add = this.transactionLockForm.get('periodArray') as FormArray;
    add.push(this.fb.group({
      TransactionPeriodId: [0],
      TransactionLockId: [this.TransactionLockId],
      PeriodNo: [''],
      PeriodName: [''],
      FromDate: [''],
      ToDate: [''],
      StatusId: [1]
      //StatusId: [0]
    }))
  }

  getDropDowList() {
    return new Promise((resolve, reject) => {
      var service = `${this.globals.APIURL}/TransactionLocks/TransactionLockDropDownList`;
      this.dataService.post(service, { FinancialYear: "", PeriodType: 0, Status: 0 }).subscribe((result: any) => {
        this.finalYearList = [];
        this.periodList = [];
        this.statusList = [];
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.finalYearList = result.data.Table;
          this.periodList = result.data.Table1;
          this.statusList = result.data.Table2;
          resolve(true)
        }
      }, error => { 
        reject()
      });
    })
  }

  finalYearEvent(event) {
    if (event) {
      let info = this.finalYearList.find(x => x.FinancialYearId == event);
      if(info ?? false){
        this.transactionLockForm.controls['FYStartDate'].setValue(info.FromDate);
        this.transactionLockForm.controls['FYEndDate'].setValue(info.ToDate);
      }
    }
  }

  getPeriodList(value) {

    var validation = "";
    if (this.transactionLockForm.value.FinancialYear == "" || this.transactionLockForm.value.FinancialYear == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Financial Year.</span></br>"
    }
    if (this.transactionLockForm.value.PeriodType == "" || this.transactionLockForm.value.PeriodType == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Period Type.</span></br>"
    }
    if (validation != "") {
      Swal.fire(validation)
      return false;
    }
    var service = `${this.globals.APIURL}/TransactionLocks/GetPeroidTypeList`;
    this.dataService.post(service, { PeriordTypeId: this.transactionLockForm.value.PeriodType, StartDate: (this.transactionLockForm.value.FYStartDate),EndDate : (this.transactionLockForm.value.FYEndDate)}).subscribe((result: any) => {
      this.PeriodTypeList = [];
      this.items.clear();
      // debugger
      if (result.message == "Success" && result.data.Table.length > 0) {
        this.PeriodTypeList = result.data.Table;
        this.PeriodTypeList.map(x => {
          this.addNewAddressGroup();
          // x.FromDate = this.datePipe.transform(x.FromDate, this.entityDateFormat);
          // x.ToDate = this.datePipe.transform(x.ToDate, this.entityDateFormat);
          x.TransactionPeriodId = 0;
          x.TransactionLockId = this.TransactionLockId;
        });
        this.transactionLockForm.patchValue({ periodArray: this.PeriodTypeList });
        if(value == 1){
          this.makeGeneratePeriodButton = true;
          this.generatePeriodButton = true;
        } 
      }
      

      if(value == 2){
        this.transactionLockForm.get('FinancialYear').disable();
        this.transactionLockForm.get('PeriodType').disable();
        this.makeGeneratePeriodButton = false;
        this.isSavemode = true;
      }
    }, error => { });
  }
  

  getTransactionList(){
    var service = `${this.globals.APIURL}/TransactionLocks/GetTransactionLocksById`;
    this.dataService.post(service, { TransactionLockId : this.TransactionLockId }).subscribe(async (result: any) => {
      if (result.message == "Success" && result.data.Table.length > 0) {
     //  this.finalYearList.finc((final) => { return final.finalYearList })
      let info = result.data.Table[0];
     // const entityDateFormat  = this.commonDataService.convertToLowerCaseDay(this.entityDateFormat)
      this.transactionLockForm.patchValue({  
        TransactionLockId :this.TransactionLockId,  
        FinancialYear: info.FinancialYear,   
        FYStartDate : info.FYStartDate,
        FYEndDate : info.FYEndDate,
        PeriodType:info.PeriodType,
        PeriordTypeId : this.TransactionPeriodId,
        PeriodNo:info.PeriodNo,
        PeriodName:info.PeriodName,
        FromDate: info.FromDate,
        ToDate: info.ToDate,
        StatusId:info.StatusId        
       }) 
       if (result.message == "Success" && result.data.Table1.length > 0) {
        this.PeriodTypeList = result.data.Table1;
        this.PeriodTypeList.map(x => {
          this.addNewAddressGroup();
          //  x.FromDateDisplay = this.datePipe.transform(x.FromDate, entityDateFormat);
          //  x.ToDateDisplay = this.datePipe.transform(x.ToDate, entityDateFormat);
          x.FromDate = (x.FromDate);
          x.ToDate   =   (x.ToDate);
          x.TransactionPeriodId = 0;
          x.TransactionLockId = this.TransactionLockId;
        });
       
    } 
    this.transactionLockForm.patchValue({ periodArray: this.PeriodTypeList });
    this.generatePeriodButton = true;
    this.transactionLockForm.disable();
   }   
  });    
}
  async save() {
    this.transactionLockForm.enable();
    var validation = "";
    if (this.transactionLockForm.value.FinancialYear == "" || this.transactionLockForm.value.FinancialYear == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select Financial Year.</span></br>"
    }
    if (this.transactionLockForm.value.PeriodType == "" || this.transactionLockForm.value.PeriodType == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Period Type.</span></br>"
    }
    if (validation != "") {
      Swal.fire(validation)
      return false;
    }
    let status = 1;
    await this.createPayload(status);
    let text = `Do you want to ${status == 1 ? 'Save' : 'Final'} this Details?`;

    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        let service = `${this.globals.APIURL}/TransactionLocks/SaveTransactionLocks`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
          }
          this.router.navigate(['/views/transactions/transaction-locks/transaction-locks-view']);
        }, error => {
          console.error(error);
        });
      }
    });
  }
  
    createPayload(status: number) {
    let info = this.transactionLockForm.value;
    let table = {
      TransactionLockId: this.TransactionLockId,
      FinancialYear: info.FinancialYear,
      FYStartDate: info.FYStartDate,
      FYEndDate: info.FYEndDate,
      PeriodType: Number(info.PeriodType),
      IsGenerate: info.IsGenerate,
      StatusId: info.StatusId,
      IsFinal: status,
      CreatedBy: info.CreatedBy
    }
    
    let table1 = info.periodArray
    // debugger
    table1.map(x => {
      x.FromDate = (x.FromDate);
      x.ToDate =  (x.ToDate);
      x.StatusId = Number(x.StatusId);
      // console.log(x.StatusId, "status check")
      //  this.newStatus = x.StatusId
    })
    //  if(this.newStatus.length == 0){
    //   this.transactionLockForm.value.StatusId = this.newStatus.value
    //  }
    //  else {
    //   this.transactionLockForm.value.StatusId = 1
    //  }
    const isAnythingOpen =  table1.find((periodInfo) => { return periodInfo.StatusId == 1 }); // check anything is open
    table.StatusId = isAnythingOpen ? 1 : 2;
    this.payload = {
      "TransactionLocks": {
        "Table": [table],
        "Table 1": table1,
      }
    }
  }

  enableEdit(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 527,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.makeGeneratePeriodButton = false;
            this.isSavemode = true;
            this.transactionLockForm.enable();
            this.transactionLockForm.get('FinancialYear').disable();
            this.transactionLockForm.get('PeriodType').disable();
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
