import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Globals } from 'src/app/globals';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import { ContraVoucherService } from 'src/app/services/contra-voucher.service';
// import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-trailbalance',
  templateUrl: './trailbalance.component.html',
  styleUrls: ['./trailbalance.component.css']
})
export class TrailbalanceComponent implements OnInit {

  pager: any = {};
  pagedItems: any[];
  nav: boolean = true;
  selectedDate: any;
  PaymentLiabilityList = [];
  divisionList: any = [];
  officeList: any = [];
  balanceList: any = [];
  adjustmentList: any = [];
  adjustmentFilter: FormGroup;
  currentDate: Date = new Date();
  filterForm: any;
  selectedDivisionId: number;
  bankListDetails: any = [];
  TemplateUploadURL = this.globals.TemplateUploadURL;
  dataList: any;

  @ViewChild('table') table: ElementRef;

  constructor(public ps: PaginationService,
    private fb: FormBuilder,
    private router: Router, private datePipe: DatePipe,   private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService, 
    private contraVoucherService: ContraVoucherService,
    private http: HttpClient) { 
      this.createFilterForm();
    }

  ngOnInit(): void {
    this.getDivisionList();
    this.getOfficeList();
    this.trailbalanceList();
    // this.createAdjustment();
    this.createFilterForm();
  }

  navigate(){
    this.nav=false;
  }

  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.BasedOnDate(this.selectedDate);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.balanceList.length, page);

    // get current page of items
    this.pagedItems = this.balanceList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
        console.log("Division List:", divisionList);
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
      // let data of pagedItems
    }, error => { });
  }

  
  trailbalanceList() {
    debugger;
    var service = `
    https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList
    `;
  
    var payload = {
        "DivisionId": 1,
        "OfficeId": 0,
        "Date": ""
    };

    this.dataService.post(service, payload).subscribe((result: any) => {
        this.balanceList = [];
        if (result.message == 'Success' && result.data.Table.length > 0) {
            this.balanceList = result.data.Table;
            this.setPage(1);
        }
    }, error => {
        console.error("Error occurred:", error); 
    });
}

createFilterForm(){
  this.filterForm = this.fb.group({
    Date: [''],
    OfficeId: [''],
    DivisionId: ['']
  })
}


editBalance(id: number) {
  debugger
  var service = `
  https://odakfnqa.odaksolutions.in/api/Reports/GetLedgerDataById
  `;
  
  const payload = {
    "AccountId": id,
    "Date": "",
    "DivisionId": "",
	"OfficeId" : ""
  };

 
  this.dataService.post(service, payload).subscribe(data => {
    this.router.navigate(['/views/finance/reports/leveltwo', { id: id }])
   
  }, err => {
    console.log('error:', err.message);
  });
}

onDivisionChange(value: any) {
  debugger
  var selectedDivisionId = value;
  var service = `https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList`;

  var payload = {
    "DivisionId": value,
    "OfficeId": 0,
    "Date": ""
  };

  this.dataService.post(service, payload).subscribe((result: any) => {
    this.balanceList = [];
    if (result.message == 'Success' && result.data.Table.length > 0) {
      this.balanceList = result.data.Table;
      this.setPage(1);
    }
  }, error => {
    console.error("Error occurred:", error); // Log the error for debugging
  });
}

onOfficeChange(values: any) {

  var service = `https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList`;

  var payload = {
    "DivisionId": "",
    "OfficeId": values,
    "Date": ""
  };

  this.dataService.post(service, payload).subscribe((result: any) => {
    this.balanceList = [];
    if (result.message == 'Success' && result.data.Table.length > 0) {
      this.balanceList = result.data.Table;
      this.setPage(1);
    }
  }, error => {
    console.error("Error occurred:", error); 
  });

}

BasedOnDate(selectedDate: any) {
  debugger

  var service = `https://odakfnqa.odaksolutions.in/api/Reports/GetTrailBalanceList`;

  var payload = {
    "DivisionId": "",
    "OfficeId": "",
    "Date": selectedDate
  };

  this.dataService.post(service, payload).subscribe((result: any) => {
    this.balanceList = [];
    if (result.message == 'Success' && result.data.Table.length > 0) {
      this.balanceList = result.data.Table;
      this.setPage(1);
    }
  }, error => {
    console.error("Error occurred:", error); 
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

getDivisionBasedOffice(officeId, divisoinId: any) {
debugger
  if (officeId && divisoinId) {
    let service = `${this.globals.APIURL}/Common/GetBankByOfficeId`;
    let payload = {
      "OfficeId": officeId,
      "DivisionId": divisoinId
    }
    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.message = "Success") {
        this.bankListDetails = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }
}


downloadExcel() {
  if (!this.table) {
      console.error('Table element not found.');
      return;
  }

  // Convert the table to a worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);

  // Get the range of the header row
  const headerRange = XLSX.utils.decode_range(ws['!ref']);
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });

      // Apply styling to each cell in the header row
      if (!ws[cellAddress]) {
          ws[cellAddress] = {};
      }
      ws[cellAddress].s = {
          font: { bold: true }, // Make the header text bold
          fill: { fgColor: { rgb: "D3D3D3" } } // Set the background color of the header row to light gray
      };
  }

  // Create a new workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Write the workbook to a file
  XLSX.writeFile(wb, 'table_data.xlsx');
}




}
