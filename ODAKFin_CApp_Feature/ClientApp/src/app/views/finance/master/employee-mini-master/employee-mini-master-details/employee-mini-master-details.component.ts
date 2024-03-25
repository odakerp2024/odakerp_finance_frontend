import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { StatusNew } from 'src/app/model/common';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { EmployeeMiniMasterService } from 'src/app/services/financeModule/employee-mini-master.service';

@Component({
  selector: 'app-employee-mini-master-details',
  templateUrl: './employee-mini-master-details.component.html',
  styleUrls: ['./employee-mini-master-details.component.css']
})
export class EmployeeMiniMasterDetailsComponent implements OnInit {

  // ModifiedOn: any;
  CreatedOn = this.datePipe.transform(new Date(), "dd-MM-yyyy");;
  // CreatedBy: any;
  // entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');

  statusValues = [
    { value: true, viewValue: 'Active' },
    { value: false, viewValue: 'In-Active' },
  ];


  divisionList = [];
  officeList = [];
  
  employeeId = '';
  employeeDetails: any = {};
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private commonDataService: CommonService,
    private globals: Globals,
    private dataService: DataService,
    private router: Router,
    private employeeMiniMasterService: EmployeeMiniMasterService
    
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.employeeId = params.Id;
    });
    if (this.employeeId) {
      this.getEmployeeDetails()
    }
  }

  CurrentTab(_){

  }

  getOffice(event){
    
  }

  getEmployeeDetails() {
    const payload = {
      "Id" : this.employeeId
    }
    this.employeeMiniMasterService.getEmployeeById(payload).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.employeeDetails = result.data.Table[0];
        this.CreatedOn = this.employeeDetails.CreatedDate ? this.employeeDetails.CreatedDate : '';
      }
    });
  }

  getFormattedDate(date): string {
    return this.datePipe.transform(date, "dd-MM-yyyy");
  }

}
