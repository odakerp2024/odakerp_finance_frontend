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
import { ReportDashboardService } from 'src/app/services/financeModule/report-dashboard.service';




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
  entityThousands = Number(this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat'));
  
  @ViewChild('table') table: ElementRef;

  constructor(public ps: PaginationService,
    private fb: FormBuilder,
    private router: Router, private datePipe: DatePipe,   private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService, 
    private contraVoucherService: ContraVoucherService,
    private reportService: ReportDashboardService,
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

    const payload = {
      "DivisionId": "",
      "OfficeId": "",
      "Date": ""
    };
    this.reportService.GetTrailBalanceList(payload).subscribe(result => {
      this.balanceList = [];
      if (result.message === 'Success' && result.data.Table.length > 0) {
        // Group the items by GroupName
        const groupedItems = result.data.Table.reduce((groups: any, item: any) => {
          const group = item.GroupName;
          if (!groups[group]) {
            groups[group] = [];
          }
          groups[group].push(item);
          return groups;
        }, {});
  
        // Process each group to calculate parent totals and group totals
        this.balanceList = Object.keys(groupedItems).map(group => {
          const items = groupedItems[group];
  
          // Group items by ParentAccountName within the group
          const parentGroupedItems = items.reduce((parents: any, item: any) => {
            const parent = item.ParentAccountName;
            if (!parents[parent]) {
              parents[parent] = [];
            }
            parents[parent].push(item);
            return parents;
          }, {});
  
          // Calculate totals for each parent account within the group
          const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
            const parentItems = parentGroupedItems[parentName];
            const totalCredit = this.calculateParentTotal(parentItems, 'Credit');
            const totalDebit = this.calculateParentTotal(parentItems, 'Debit');
  
            return {
              ParentAccountName: parentName,
              items: parentItems,
              totalCredit: totalCredit,
              totalDebit: totalDebit
            };
          });
  
          // Calculate total credit and debit for the group
          const totalCredit = this.calculateGroupTotal(items, 'Credit');
          const totalDebit = this.calculateGroupTotal(items, 'Debit');
  
          return {
            GroupName: group,
            parentTotals: parentTotals,
            totalCredit: totalCredit,
            totalDebit: totalDebit
          };
        });
  
        // Assign grouped list to pagedItems
        this.pagedItems = this.balanceList;
        this.setPage(1);
        this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
        this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
      } else {
        this.totalcreditamount = 0;
        this.totaldebitamount = 0;
        this.pager = {};
        this.balanceList = [];
        this.pagedItems = [];
      }
    }, error => {
      console.error("Error occurred:", error);
    });
  }
  
  // Helper function to calculate the total credit or debit for a particular group
  calculateGroupTotal(groupItems: any[], type: string): number {
    return groupItems.reduce((sum, item) => {
      return sum + (item.ChildTransaction_Type === type ? item.ChildNet_Balance : 0);
    }, 0);
  }
  
  // Helper function to calculate the total credit or debit for parent accounts
  calculateParentTotal(parentItems: any[], type: string): number {
    return parentItems.reduce((sum, item) => {
      return sum + (item.ChildTransaction_Type === type ? item.ChildNet_Balance : 0);
    }, 0);
  }
  
  // Helper function to calculate the total credit amount for all groups
  calculateTotalCreditAmount(items: any[]): number {
    return items.reduce((sum, group) => {
      return sum + group.totalCredit;
    }, 0);
  }
  
  // Helper function to calculate the total debit amount for all groups
  calculateTotalDebitAmount(items: any[]): number {
    return items.reduce((sum, group) => {
      return sum + group.totalDebit;
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
  
  const payload = {
    "AccountId": id,
    "Date": "",
    "DivisionId": "",
	"OfficeId" : ""
  };
  this.reportService.GetTrailBalanceList(payload).subscribe(data => {
    this.router.navigate(['/views/finance/reports/leveltwo', { id: id }])
   
  }, err => {
    console.log('error:', err.message);
});
 
}

onDivisionChange(value: any) {
  var selectedDivisionId = value;
  var payload = {
    "DivisionId": value,
    "OfficeId": 0,
    "Date": ""
  };

  this.reportService.GetTrailBalanceList(payload).subscribe(result => {
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

     // this.balanceList = Object.keys(groupedItems).map(group => ({
       //   GroupName: group,
      //    items: groupedItems[group]
     // }));


        // Process each group to calculate parent totals and group totals
        this.balanceList = Object.keys(groupedItems).map(group => {
          const items = groupedItems[group];
  
          // Group items by ParentAccountName within the group
          const parentGroupedItems = items.reduce((parents: any, item: any) => {
            const parent = item.ParentAccountName;
            if (!parents[parent]) {
              parents[parent] = [];
            }
            parents[parent].push(item);
            return parents;
          }, {});
  
          // Calculate totals for each parent account within the group
          const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
            const parentItems = parentGroupedItems[parentName];
            const totalCredit = this.calculateParentTotal(parentItems, 'Credit');
            const totalDebit = this.calculateParentTotal(parentItems, 'Debit');
  
            return {
              ParentAccountName: parentName,
              items: parentItems,
              totalCredit: totalCredit,
              totalDebit: totalDebit
            };
          });
  
          // Calculate total credit and debit for the group
          const totalCredit = this.calculateGroupTotal(items, 'Credit');
          const totalDebit = this.calculateGroupTotal(items, 'Debit');
  
          return {
            GroupName: group,
            parentTotals: parentTotals,
            totalCredit: totalCredit,
            totalDebit: totalDebit
          };
        });

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
        this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
    }else{
      this.totalcreditamount = 0;
        this.totaldebitamount = 0;
      this.pager = {};
      this.balanceList = []
      this.pagedItems = [];
    }
  }, error => {
    console.error("Error occurred:", error); // Log the error for debugging
  });
}


onOfficeChange(values: any) {

  var payload = {
    "DivisionId": "",
    "OfficeId": values,
    "Date": ""
  };
  this.reportService.GetTrailBalanceList(payload).subscribe(result => {
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

  var payload = {
    "DivisionId": "",
    "OfficeId": "",
    "Date": selectedDate
  };
  this.reportService.GetTrailBalanceList(payload).subscribe(result => {
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
     this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
        this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
    }else{
     this.totalcreditamount = 0;
        this.totaldebitamount = 0;
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



async downloadExcel() {
  debugger
  if (!this.pagedItems || this.pagedItems.length === 0) {
    Swal.fire('No record found');
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add title and subtitle rows
  const titleRow = worksheet.addRow(['', 'ODAK SOLUTIONS PRIVATE LIMITED', '', '', '']);
  titleRow.getCell(2).font = { size: 15, bold: true };
  titleRow.getCell(2).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`B${titleRow.number}:B${titleRow.number}`);
  const subtitleRow = worksheet.addRow(['', 'Trail Balance', '', '', '']);
  subtitleRow.getCell(2).font = { size: 15, bold: true };
  subtitleRow.getCell(2).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`B${subtitleRow.number}:B${subtitleRow.number}`);

  // Add date row
  const currentDate = new Date();
  worksheet.addRow(['', `As of ${currentDate.toDateString()}`, '', '', '']);

  // Define header row
  const headers = ['Account', 'Net Credit', 'Net Debit'];
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

  this.pagedItems.forEach(group => {
    // Add group header row
    worksheet.addRow([group.GroupName.toUpperCase(), '', '', '']);
    group.parentTotals.forEach(parent => {
      parent.items.forEach(balance => {
        const rowData = [
          `${balance.GrandParentAccountName} - ${balance.ParentAccountName} - ${balance.ChildAccountName}`,
          balance.ChildTransaction_Type === 'Credit' ? balance.ChildNet_Balance : 0,
          balance.ChildTransaction_Type === 'Debit' ? balance.ChildNet_Balance : 0
        ];
       const row =  worksheet.addRow(rowData);


         // Set text color for specific columns
    const columnsToColor = ['ChildNet_Balance', 'ChildNet_Balance'];
    columnsToColor.forEach(columnName => {
        const columnIndex = Object.keys(group).indexOf(columnName);
        if (columnIndex !== -1) {
            const cell = row.getCell(columnIndex + 1);
            cell.font = { color: { argb: '8B0000' }, bold: true }; 
        }
      });
    });
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
