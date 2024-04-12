import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { CreditApplicationService } from 'src/app/services/credit-application.service';
import { DataService } from 'src/app/services/data.service';
import { Table } from '../../../../../model/financeModule/credit';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-application-view',
  templateUrl: './credit-application-view.component.html',
  styleUrls: ['./credit-application-view.component.css']
})
export class CreditApplicationViewComponent implements OnInit {
  // * pagination start
pager: any = {};// pager object  
pagedItems: any[];// paged items
  
// * pagination end
//maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
 // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  creditApplicationList = [];
  divisionList = [];
  officeList = [];
  customerList = [];
  creditAmount = [];
  customer = [];
  creditDays = [];
  salesPerson = [];
  customerAndBranchList = [];
  creditLimit = []
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
  statusValues = [
    { value: 1, viewValue: 'Active' },
    { value: 0, viewValue: 'Inactive' },
  ]
  creditList: any = [];

  filterForm: any;
  applicationStatus = [];
  constructor(
    private ps: PaginationService,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService,
    private router: Router,
    private datePipe: DatePipe,
    private creditApplicationService: CreditApplicationService
  ) { }

  ngOnInit(): void {
    this.getCustomerCredit();
    this.filterFormCreate();
    this.getCreditApplication();
    this.getDivisionList();
    this.getCustomerAndBranch();
    this.getDropdowns();
    this.getOfficeList();
    this.getCustomerList();   
  }


  filterFormCreate() {
    this.filterForm = this.fb.group({
      "CreditApplicationId": [''],
      "CreditApplicationNumber": [''],
      "ApplicationDate":[''],
      "Customer": [0],
      "customerAndBranchList": [0],
      "CreditLimitDays": [''],
      "CreditLimitAmount": [''],
      "StatusId": [0],
      "DivisionId": [0],
      "OfficeId": [0],
      "SalesPersonId": [0],    
      "StartDate" :[''],
      "EndDate" :['']
    });
  }
  CreateNew(requestType: boolean){

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

          if (data[0].Create_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['/views/transactions/credit-application/credit-application-details', { requestType: requestType }]);
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

  setPage(page: number) {
    this.pager = this.ps.getPager(this.creditApplicationList.length, page);

    if (page < 0 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    
    // get current page of items
    this.pagedItems = this.creditApplicationList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getCreditApplication() {
    const payload = this.filterForm.value
    payload.ApplicationDate = new Date(payload.ApplicationDate);
    this.creditApplicationService.getList(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.creditApplicationList = result.data.Table;    
        this.setPage(1)
      }
    })
  }

  creditApplicationFilter() {
    this.getCreditApplication();
  }

  editCreditApplication(id, IsRevise, IsRevoke) {
    const userID = localStorage.getItem("UserID");
    const payload = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 523,
    }
    this.commonDataService.GetUserPermissionObject(payload).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);
  
        if (data[0].SubfunctionID === payload.SubfunctionID) {
          if (data[0].Read_Opt !== 2) {
            Swal.fire('Please Contact Administrator');
          } else {
            const isReviseOrRevoke = IsRevise || IsRevoke|| this.checkReviseOrRevokeInList(); // Check if IsRevise is true or revise/revoke values present in the list
            this.pager = {};
            this.filterFormCreate();
            this.getCreditApplication();
            this.navigateToCreditApplicationDetails(id, isReviseOrRevoke); // Set requestType based on IsRevise or presence of revise/revoke values
          }
        } else {
          Swal.fire('Please Contact Administrator');
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('Error:', err.message);
    });
  }
  
  checkReviseOrRevokeInList() {
    // Check if "revise" or "revoke" values are present in the creditApplicationList
    for (const application of this.creditApplicationList) {
      if (application.action === "revise" || application.action === "revoke") {
        return true;
      }
    }
    return false;
  }
  
  navigateToCreditApplicationDetails(id, requestType) {
    // Navigate to credit application details with specified parameters
    this.router.navigate(['/views/transactions/credit-application/credit-application-details', { creditId: id, requestType: requestType }]);
  }
  
  // getDivision() {
  //   return new Promise((resolve, rejects) => {
  //     this.commonDataService.getDivision({}).subscribe((result: any) => {
  //       this.divisionList = [];
  //       if (result.data.Table.length > 0) {
  //         this.divisionList = result.data.Table;
  //         resolve(true);
  //       }
  //     }, error => { 
  //       rejects(true)
  //     });;
  //   });
  // }

  // getOfficeList(DivisionId) {
  //   return new Promise((resolve, rejects) => {
  //     const payload = { DivisionId }
  //     this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any) => {
  //       this.officeList = [];

  //       // this.FinancialForm.controls.OfficeId.setValue('');
  //       if (result.message == 'Success') {
  //         if (result.data && result.data.Table.length > 0) {
  //           this.officeList.push(...result.data.Table);
  //           resolve(true)
  //         }
  //       }
  //     }, error => {
  //       rejects();
  //     });
  //   })
  // }
  getCreditReviewList() {
    var service = `${this.globals.APIURL}/CreditReview/GetCreditReviewList`;
    this.dataService.post(service, this.filterForm.value).subscribe((result: any) => {
      this.creditList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.creditList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }
  getOfficeList(filter?: string) {
  
    this.creditApplicationService.getOffice({}).subscribe((result: any)=>{
      this.officeList = [];
      if (result.data.Office.length > 0) {
       // this.officeList = result.data.Table;
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getDivisionList(filter?: string) {
  
    this.creditApplicationService.getDivision({}).subscribe((result: any)=>{
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  getCustomerList(filter?: string) {
  
    this.commonDataService.getCustomerList({}).subscribe((result: any)=>{
      this.customerList = [];
      if (result.data.Table.length > 0) {
        this.customerList = result.data.Table;
      }
    }, error => { });
  }

    getCustomerAndBranch() {
    this.creditApplicationService.getCustomerAndBranch({}).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.customerAndBranchList = result.data.Table;
      }
    })
    }
  

    getCustomerCredit() {
      this.creditApplicationService.getCustomerCreditList({}).subscribe((result: any) => {
        if(result.message == 'Success') {
          this.creditLimit = result.data.Table;
        }
      })
    }


    getDropdowns(){
      const payload = {}
      this.creditApplicationService.getCreditApplicationDropdowns(payload).subscribe((result: any) => {
        if(result.message == 'Success'){
          const resultData = result.data;
          this.applicationStatus = resultData.Table.length ? resultData.Table : []
          this.salesPerson = resultData.Table1.length ? resultData.Table1 : []
        }
      })
    }

    creditEvent(event: any) {
      this.filterForm.controls['EndDate'].setValue('');
      this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
    }
  
}
