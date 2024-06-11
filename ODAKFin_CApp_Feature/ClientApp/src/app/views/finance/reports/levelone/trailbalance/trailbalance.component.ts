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
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';



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
  totalcreditamount  = 0;
  totaldebitamount   = 0;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  
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
    if (this.balanceList.length) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.balanceList.length, page);

    // get current page of items
    this.pagedItems = this.balanceList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  } else {
    this.pagedItems = [];
  }
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
debugger
this.dataService.post(service, payload).subscribe((result: any) => {
  this.balanceList = [];
  if (result.message === 'Success' && result.data.Table.length > 0) {
      // Group the items by group name
      const groupedItems = result.data.Table.reduce((groups: any, item: any) => {
          const group = item.GroupName;
          if (!groups[group]) {
              groups[group] = [];
          }
          groups[group].push(item);
          return groups;
      }, {});

      this.balanceList = Object.keys(groupedItems).map(group => ({
          GroupName: group,
          items: groupedItems[group]
      }));

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
      this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
  } else {
    this.totalcreditamount  = 0;
    this.totaldebitamount   = 0;
      this.pager = {};
      this.balanceList = [];
      this.pagedItems = [];
  }
}, error => {
  console.error("Error occurred:", error);
});
}

calculateTotalCreditAmount(items: any[]): number {
  return items.reduce((sum, group) => {
      return sum + group.items.reduce((groupSum, item) => {
          return groupSum + (item.ChildTransaction_Type === 'Credit' ? item.ChildNet_Balance : 0);
      }, 0);
  }, 0);
}

calculateTotalDebitAmount(items: any[]): number {
  return items.reduce((sum, group) => {
      return sum + group.items.reduce((groupSum, item) => {
          return groupSum + (item.ChildTransaction_Type === 'Debit' ? item.ChildNet_Balance : 0);
      }, 0);
  }, 0);
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
     // Group the items by group name
      const groupedItems = result.data.Table.reduce((groups: any, item: any) => {
          const group = item.GroupName;
          if (!groups[group]) {
              groups[group] = [];
          }
          groups[group].push(item);
          return groups;
      }, {});

      this.balanceList = Object.keys(groupedItems).map(group => ({
          GroupName: group,
          items: groupedItems[group]
      }));

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
    }else{
      this.pager = {};
      this.balanceList = []
      this.pagedItems = [];
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
      // Group the items by group name
      const groupedItems = result.data.Table.reduce((groups: any, item: any) => {
          const group = item.GroupName;
          if (!groups[group]) {
              groups[group] = [];
          }
          groups[group].push(item);
          return groups;
      }, {});

      this.balanceList = Object.keys(groupedItems).map(group => ({
          GroupName: group,
          items: groupedItems[group]
      }));

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
    }else{
      this.pager = {};
      this.balanceList = []
      this.pagedItems = [];
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
       // Group the items by group name
       const groupedItems = result.data.Table.reduce((groups: any, item: any) => {
        const group = item.GroupName;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {});

    this.balanceList = Object.keys(groupedItems).map(group => ({
        GroupName: group,
        items: groupedItems[group]
    }));

    // Assign grouped list to pagedItems
    this.pagedItems = this.balanceList;
    this.setPage(1);
    }else{
      this.pager = {};
      this.balanceList = []
      this.pagedItems = [];
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


// downloadExcel() {
//   if (!this.table) {
//       console.error('Table element not found.');
//       return;
//   }

//   // Convert the table to a worksheet
//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);

//   // Get the range of the header row
//   const headerRange = XLSX.utils.decode_range(ws['!ref']);
//   for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });

//       // Apply styling to each cell in the header row
//       if (!ws[cellAddress]) {
//           ws[cellAddress] = {};
//       }
//       ws[cellAddress].s = {
//           font: { bold: true }, // Make the header text bold
//           fill: { fgColor: { rgb: "D3D3D3" } } // Set the background color of the header row to light gray
//       };
//   }

//   // Create a new workbook
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();

//   // Add the worksheet to the workbook
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//   // Write the workbook to a file
//   XLSX.writeFile(wb, 'table_data.xlsx');
// }
async downloadExcel() {
  if (!this.pagedItems || this.pagedItems.length === 0) {
    Swal.fire('No record found');
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add title and subtitle rows
  const titleRow = worksheet.addRow(['', '', 'ODAK SOLUTIONS PRIVATE LIMITED', '', '', '']);
  titleRow.getCell(3).font = { size: 15, bold: true };
  titleRow.getCell(3).alignment = { horizontal: 'center' };
  const subtitleRow = worksheet.addRow(['', '', 'Trail Balance', '', '', '']);
  subtitleRow.getCell(3).font = { size: 15, bold: true };
  subtitleRow.getCell(3).alignment = { horizontal: 'center' };

  // Add date row
  const currentDate = new Date();
  worksheet.addRow(['', '', `As of ${currentDate.toDateString()}`, '', '', '']);

  // Define header row
  const headers = ['Account', 'Account Code', 'Net Credit', 'Net Debit'];
  const headerRow = worksheet.addRow(headers);

  // Style the header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8A9A5B' },
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFF7' }
    };
    cell.alignment = {
      horizontal: 'center',
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Add data rows
  this.pagedItems.forEach(group => {
    // Add group header row
    worksheet.addRow([group.GroupName.toUpperCase(), '', '', '']);
    group.items.forEach(balance => {
      const rowData = [
        `${balance.GrandParentAccountName} - ${balance.ParentAccountName} - ${balance.ChildAccountName}`,
        balance.ChartOfAccountsId,
        balance.ChildTransaction_Type === 'Credit' ? balance.ChildNet_Balance : 0,
        balance.ChildTransaction_Type === 'Debit' ? balance.ChildNet_Balance : 0
      ];
      worksheet.addRow(rowData);
      
    });
  });



  // Adjust column widths
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 0;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength + 2;
  });
 // Style the footer row with yellow background, bold, and centered text
 const footerRow = worksheet.addRow(['End of Report']);
 footerRow.eachCell((cell) => {
   cell.fill = {
     type: 'pattern',
     pattern: 'solid',
     fgColor: { argb: '8A9A5B' },
   };
   cell.font = {
     bold: true,
     color: { argb: 'FFFFF7' }
   };
   cell.alignment = {
     horizontal: 'center',
   };
 });

 // Merge footer cells if needed
 worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + headers.length - 1)}${footerRow.number}`);
  // Write to Excel and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Report-TrailBalance.xlsx');
}



}
