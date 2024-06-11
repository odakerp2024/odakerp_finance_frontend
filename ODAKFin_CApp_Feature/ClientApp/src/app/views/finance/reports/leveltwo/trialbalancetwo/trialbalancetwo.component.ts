import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-trialbalancetwo',
  templateUrl: './trialbalancetwo.component.html',
  styleUrls: ['./trialbalancetwo.component.css']
})
export class TrialbalancetwoComponent implements OnInit {

  id: number;
  dataList: any[] = [];
  balancenewList: any[] = [];
  filterForm: any;
  selectedDate: any;
  pager: any = {};
  pagedItems: any[];
  allItems: Vendorlist[] = [];
  officeList: any = [];
  divisionList: any = [];
  balanceList: any = [];
  currentDate: Date = new Date();
  data: any[];
  TemplateUploadURL = this.globals.TemplateUploadURL;
  totalDebitAmount = 0;
  totalCreditAmount = 0;
  totalAmount = 0;   

  @ViewChild('table') table: ElementRef;

  constructor(public ps: PaginationService,  private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe, private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private commonDataService: CommonService, ) { }

  ngOnInit(): void {
    this.getDivisionList();
    this.getOfficeList();
    this. getbyidBalancelist();
    this.createBalanceFilterForm();

    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.fetchData(this.id);
      // this.setPage(1);
    });
  }

  fetchData(id: number): void {
    debugger;
    const service = 'https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById';
  
    const payload = {
      "AccountId": id,
      "Date": "",
      "DivisionId": "",
      "OfficeId": ""
    };

    this.dataService.post(service, payload).subscribe((response: any) => {
      console.log('Response Data:', response); 

      if (response.data.Table.length > 0) {
        this.dataList = response.data.Table; 
        console.log('Data List:', this.dataList); 
        this.setPage(1);
      } else {
        console.error('Error: Invalid response format');
      }
    }, err => {
      console.error('Error:', err);
    });
}

  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.BasedOnDate(this.selectedDate);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.ps.getPager(this.dataList.length, page);

    this.pagedItems = this.dataList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getbyidBalancelist() {
    const service = `https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById`;
    const payload = {
        "AccountId": 784,
        "Date": "2024-04-30",
        "DivisionId": 1,
        "OfficeId": 2
    };

    this.dataService.post(service, payload).subscribe((result: any) => {
        this.balanceList = [];
        if (result.message == 'Success' && result.data.Table.length > 0) {
            this.balanceList = result.data.Table;
            this.calculateTotals();
        }
    }, error => {
        console.error("Error occurred:", error); 
    });
}

calculateTotals() {
    this.totalDebitAmount = this.balanceList.reduce((sum, item) => sum + (item.Debit || 0), 0);
    this.totalCreditAmount = this.balanceList.reduce((sum, item) => sum + (item.Credit || 0), 0);
    this.totalAmount = this.balanceList.reduce((sum, item) => sum + (item.Amount || 0), 0);
}


createBalanceFilterForm() {
  this.filterForm = this.fb.group({
    Date: [''],
    OfficeId: [''],
    DivisionId : ['']
  })
}

BasedOnDate(selectedDate: any ) {
   
  const service = 'https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById';
  
  const payload = {
    "AccountId": "",
    "Date": selectedDate,
    "DivisionId": "",
    "OfficeId": ""
  };

  this.dataService.post(service, payload).subscribe((response: any) => {
    this.dataList = [];
    console.log('Response Data:', response); 

    if (response.data.Table.length > 0) {
      this.dataList = response.data.Table;
      console.log('Data List:', this.dataList); 
    } else {
      console.error('Error: Invalid response format');
    }
  }, err => {
    console.error('Error:', err);
  });
}

onDivisionChange( divisionId: any, id: number): void {
  debugger;
 
  const service = 'https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById';
  
  const payload = {
    "AccountId": id,
    "Date": "",
    "DivisionId": divisionId,
    "OfficeId": ""
  };

  this.dataService.post(service, payload).subscribe((response: any) => {
    this.dataList = [];
    console.log('Response Data:', response); 

    if (response.data.Table.length > 0) {
      this.dataList = response.data.Table; 
      console.log('Data List:', this.dataList);
    } else {
      console.error('Error: Invalid response format');
    }
  }, err => {
    console.error('Error:', err);
  });
}

onOfficeChange( OfficeId: any, id: number): void {
  debugger;
  const service = 'https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById';
  
  const payload = {
    "AccountId": id,
    "Date": "",
    "DivisionId": "",
    "OfficeId": OfficeId
  };

  this.dataService.post(service, payload).subscribe((response: any) => {
    this.dataList = [];
    console.log('Response Data:', response);

    if (response.data.Table.length > 0) {
      this.dataList = response.data.Table; 
      console.log('Data List:', this.dataList);
    } else {
      console.error('Error: Invalid response format');
    }
  }, err => {
    console.error('Error:', err);
  });
}


getOfficeLists(id: number) {
  this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
    this.officeList = [];
    if (result['data'].Table.length > 0) {
      this.officeList = result['data'].Table;
    }
  })
}

downloadExcel() {
  if (!this.table) {
    console.error('Table element not found.');
    return;
  }

  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'table_data.xlsx');
}

}




