import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-provision-view',
  templateUrl: './provision-view.component.html',
  styleUrls: ['./provision-view.component.css']
})
export class ProvisionViewComponent implements OnInit {

  provisionFilter: FormGroup;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  validTillMinDate: string = this.datePipe.transform(new Date(), this.entityDateFormat);
  divisionList: any = [];
  officeList: any = [];
  statusList: any = [];
  provisionList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items

  constructor(
    private commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.createProvisoinForm();
    this.getDivisionList();
    this.getOfficeList();
    this.getStatusDropDownList();
    this.getProvisionList();
  }

  createProvisoinForm() {
    this.provisionFilter = this.fb.group({
      ProvisionNumber: [''],
      Division: [0],
      Office: [0],
      StartDate: [''],
      EndDate: [''],
      Amount: [''],
      StatusId: [''],
      Id:['']
    });
  }

  getProvisionList() {
    debugger
    var service = `${this.globals.APIURL}/Provision/GetProvisionList`;
    this.dataService.post(service, this.provisionFilter.value).subscribe((result: any) => {
      this.provisionList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.provisionList = result.data.Table;
        this.setPage(1);
      }
    }, error => { console.error(error) });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;
    this.pager = this.ps.getPager(this.provisionList.length, page);
    this.pagedItems = this.provisionList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => {
      console.log('err--', error);
     });
  }

  getOfficeList() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { 
      console.log('err--', error);
    });
  }

  getStatusDropDownList(filter?: string) {
    this.commonDataService.getStatusDropDownList({}).subscribe((result: any)=>{
        this.statusList = [];
        if (result.message == "Success" && result.data.Table.length > 0) {
          this.statusList = result.data.Table.filter(x => x.StatusName != 'Auto')
        }
    }, error => { });
  } 

  createProvision(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 511,
    }

    this.router.navigate(['/views/provision/provision-detail']);

    // this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
    //   if (data.length > 0) {
    //     console.log("PermissionObject", data);

    //     if (data[0].SubfunctionID == paylod.SubfunctionID) {

    //       if (data[0].Create_Opt != 2) {
    //           Swal.fire('Please Contact Administrator');            
    //       }
    //       else {
    //         this.router.navigate(['/views/purchase-admin-info/purchase-invoice-info']);
    //       }
    //     }
    //     else {
    //       Swal.fire('Please Contact Administrator');
    //     }
    //   }
    //   else {
    //     Swal.fire('Please Contact Administrator');
    //   }
    // }, err => {
    //   console.log('errr----->', err.message);
    // });
  }


  
  ProvisionInfo(ProvisionId?: number){
    
    this.router.navigate(['/views/provision/provision-detail',{ ProvisionId: ProvisionId }]);

  }

}
