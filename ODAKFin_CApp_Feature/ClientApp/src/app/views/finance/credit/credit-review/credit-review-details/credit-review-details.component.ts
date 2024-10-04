import { Table } from './../../../../../model/financeModule/credit';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CreditReviewService } from 'src/app/services/financeModule/credit-review.service';

@Component({
  selector: 'app-credit-review-details',
  templateUrl: './credit-review-details.component.html',
  styleUrls: ['./credit-review-details.component.css']
})
export class CreditReviewDetailsComponent implements OnInit {

  isUpdate: boolean = false;
  isFinalRecord: boolean = false;
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')

  creditApprovalList: any = [];
  businessPerformance: any = [];
  paymentPerformance: any = [];
  creditReviewId: string | number;
  creditForm: any;
  creditApprovalCard: any;
  businessPerformanceCard: any;
  paymentPerformanceCard: any;
  CustomerId: number;
  CreditLimitAmount: any;
  CreditLimitDays: any;

  constructor(
    private route: ActivatedRoute,
    private creditReviewService: CreditReviewService,
    private fb: FormBuilder,
    private router: Router,
    private commonDataService: CommonService
  ) {
    this.createForm();
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.creditReviewId = +params['Id'] ? +params['Id'] : '';
      this.CustomerId = +params['CustomerId'] ? +params['CustomerId']: 0
      if(this.creditReviewId){
        this.getById();
      }
    })
  }

  createForm(){
    this.creditForm = this.fb.group({
      "Customer": [""],
      "CustomerBranch": [""],
      "CustomerPrimeContact": [""],
      "Division": [""],
      "Office": [""],
      "SalesPerson": [""]
    })
  }

  getById(){
    const payload = {
      "CreditReviewId" : this.creditReviewId,
      "CustomerId" : this.CustomerId
    };

    this.creditReviewService.getById(payload).subscribe((result: any) => {
      if (result.message == 'Success'){
        const resultData = result.data;
        this.CreditLimitAmount = result.data.Table1[0].CreditLimitAmount
        this.CreditLimitDays = result.data.Table1[0].CreditLimitDays
        
        this.creditForm.patchValue(resultData.Table[0])

        this.creditApprovalList = resultData.Table1;
        this.businessPerformance = resultData.Table3;
        this.paymentPerformance = resultData.Table5;
        this.creditApprovalCard = resultData.Table2[0] ?  resultData.Table2[0] : [] ;
        this.businessPerformanceCard = resultData.Table4[0] ? resultData.Table4[0] : [];
        this.paymentPerformanceCard = resultData.Table6[0] ? resultData.Table6[0] : [];
      }
    });
  }

  convertToThousand(value){
    if (value >= 1e7) {
      // Convert to crores (C)
      const roundedValue = Math.round(value / 1e6) / 10; // Round to 1 decimal place
      return `${roundedValue}C`;
    } else if (value >= 1e5) {
      // Convert to lakhs (L)
      const roundedValue = Math.round(value / 1e5); // Round to the nearest whole number
      return `${roundedValue}L`;
    } else if (value >= 1e3) {
      // Convert to thousands (K)
      const roundedValue = Math.round(value / 1e2) / 10; // Round to 1 decimal place
      return `${roundedValue}K`;
    } else {
      return `${0}`;
    }
}
}
