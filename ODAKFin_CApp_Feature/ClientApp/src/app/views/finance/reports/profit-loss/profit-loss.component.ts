
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
import { GridSort } from 'src/app/model/common';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportDashboardService } from 'src/app/services/financeModule/report-dashboard.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {

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
  currentFinancialYear: string;
  selectedDivisionId: number;
  bankListDetails: any = [];
  TemplateUploadURL = this.globals.TemplateUploadURL;
  dataList: any;
  totalAmount   = 0;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  entityThousands = Number(this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat'));
  // sortOrder: { [key: string]: 'asc' | 'desc' } = {};
  fromMaxDate = this.currentDate;

  sortOrder: { [key: string]: 'asc' | 'desc' } = {
    ChildAccountName: 'asc',
    ParentAccountName: 'asc',
    ChildNet_Balance: 'asc',
  };

  expandedParents: { [key: string]: boolean } = {};
 


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


  toggleParent(groupName: string, parentName: string): void {
    const key = `${groupName}-${parentName}`;
    this.expandedParents[key] = !this.expandedParents[key];
  }

  isParentExpanded(groupName: string, parentName: string): boolean {
    const key = `${groupName}-${parentName}`;
    return this.expandedParents[key];
  }

  navigate(){
    this.nav=false;
  }

  onDateChange(event: any): void {
    this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.BasedOnDate(this.selectedDate);
    this.calculateCurrentFinancialYear(this.selectedDate);
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


sort(properties: string[]) {
  properties.forEach(property => {
    this.sortOrder[property] = this.sortOrder[property] === 'asc' ? 'desc' : 'asc';
  });

  const compare = (a, b) => {
    for (const property of properties) {
      const valueA = a[property];
      const valueB = b[property];
      if (valueA < valueB) {
        return this.sortOrder[property] === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder[property] === 'asc' ? 1 : -1;
      }
    }
    return 0;
  };

  // Sort the parent groups
  this.pagedItems.sort((a, b) => compare(a, b));

  // Sort the parent items within each group
  this.pagedItems.forEach(group => {
    group.parentTotals.sort((a, b) => compare(a, b));

    // Sort the items within each parent
    group.parentTotals.forEach(parent => {
      parent.items.sort((a, b) => compare(a, b));
    });
  });
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

    let financedate;
    if (payload.Date === "") {
      financedate = this.currentDate
     
    }
    this.calculateCurrentFinancialYear(financedate);

    this.reportService.GetProfitLossList(payload).subscribe(result => {
      this.balanceList = [];
      this.pagedItems = [];
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
        console.log("Grouped items:", groupedItems);
  
        // Process each group to calculate parent totals and group totals
        this.balanceList = Object.keys(groupedItems).map(group => {
          const items = groupedItems[group];
  
          // Group items by ParentAccountName within the group
          const parentGroupedItems = items.reduce((parents: any, item: any) => {
            const parent = item.ParentAccountName;
            if (!parents[parent]) {
              parents[parent] = [];
            }
            // Ensure unique child account names
            if (!parents[parent].some((child: any) => child.ChildAccountName === item.ChildAccountName)) {
              parents[parent].push(item);
            }
            return parents;
          }, {});
          console.log("Grouped items by ParentAccountName:", parentGroupedItems);
  
          // Calculate totals for each parent account within the group
          const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
            const parentItems = parentGroupedItems[parentName];
            const total = this.calculateParentTotal(parentItems);
            
            return {
              ParentAccountName: parentName,
              items: parentItems,
              Amount: total
            };
          });
  
          // Calculate total credit and debit for the group
          const GroupTotals = this.calculateGroupTotal(items);
  
          return {
            GroupName: group,
            parentTotals: parentTotals,
            totalAmount: GroupTotals
          };
        });
  
        // Assign grouped list to pagedItems
        this.pagedItems = this.balanceList;
        this.setPage(1);
        this.totalAmount = this.calculateTotalAmount(this.pagedItems);
      } else {
        this.totalAmount = 0
        this.pager = {};
        this.balanceList = [];
        this.pagedItems = [];
      }
    }, error => {
      console.error("Error occurred:", error);
    });
  }
  
  
  
  // Helper function to calculate the total credit or debit for a particular group
 
  calculateParentTotal(parentItems: any[]): number {
    return parentItems.reduce((sum, item) => {
      return sum + (item.ChildNet_Balance? item.ChildNet_Balance : 0);
    }, 0);
  }

  calculateGroupTotal(groupItems: any[]): number {
    return groupItems.reduce((sum, item) => {
      return sum + (item.ChildNet_Balance ? item.ChildNet_Balance : 0);
    }, 0);
  }

  
  
  // Helper function to calculate the total credit amount for all groups
  calculateTotalAmount(items: any[]): number {
    return items.reduce((sum, group) => {
      return sum + group.totalAmount;
    }, 0);
  }

  

createFilterForm(){
  this.filterForm = this.fb.group({
    Date: [this.currentDate],
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
  this.reportService.GetProfitLossList(payload).subscribe(data => {

    //Waiting for the screens while redirecting from the KK in profit and loss

    this.router.navigate(['/views/finance/reports/leveltwo', { id: id }])
    this.router.navigate(['/views/finance/repodrts/leveltwo', { id: id }])
   
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

  this.reportService.GetProfitLossList(payload).subscribe(result => {
    this.balanceList = [];
    this.pagedItems = [];
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
      console.log("Grouped items:", groupedItems);

      // Process each group to calculate parent totals and group totals
      this.balanceList = Object.keys(groupedItems).map(group => {
        const items = groupedItems[group];

        // Group items by ParentAccountName within the group
        const parentGroupedItems = items.reduce((parents: any, item: any) => {
          const parent = item.ParentAccountName;
          if (!parents[parent]) {
            parents[parent] = [];
          }
          // Ensure unique child account names
          if (!parents[parent].some((child: any) => child.ChildAccountName === item.ChildAccountName)) {
            parents[parent].push(item);
          }
          return parents;
        }, {});
        console.log("Grouped items by ParentAccountName:", parentGroupedItems);

        // Calculate totals for each parent account within the group
        const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
          const parentItems = parentGroupedItems[parentName];
          const total = this.calculateParentTotal(parentItems);
          

          return {
            ParentAccountName: parentName,
            items: parentItems,
            Amount: total
          };
        });

        // Calculate total credit and debit for the group
        const GroupTotals = this.calculateGroupTotal(items);

        return {
          GroupName: group,
          parentTotals: parentTotals,
          totalAmount: GroupTotals
        };
      });

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      this.totalAmount = this.calculateTotalAmount(this.pagedItems);
    } else {
      this.totalAmount = 0;
      this.pager = {};
      this.balanceList = [];
      this.pagedItems = [];
    }
  }, error => {
    console.error("Error occurred:", error);
  });
}


onOfficeChange(values: any) {

  var payload = {
    "DivisionId": "",
    "OfficeId": values,
    "Date": ""
  };
  this.reportService.GetProfitLossList(payload).subscribe(result => {
    this.balanceList = [];
    this.pagedItems = [];
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
      console.log("Grouped items:", groupedItems);

      // Process each group to calculate parent totals and group totals
      this.balanceList = Object.keys(groupedItems).map(group => {
        const items = groupedItems[group];

        // Group items by ParentAccountName within the group
        const parentGroupedItems = items.reduce((parents: any, item: any) => {
          const parent = item.ParentAccountName;
          if (!parents[parent]) {
            parents[parent] = [];
          }
          // Ensure unique child account names
          if (!parents[parent].some((child: any) => child.ChildAccountName === item.ChildAccountName)) {
            parents[parent].push(item);
          }
          return parents;
        }, {});
        console.log("Grouped items by ParentAccountName:", parentGroupedItems);

        // Calculate totals for each parent account within the group
        const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
          const parentItems = parentGroupedItems[parentName];
          const total = this.calculateParentTotal(parentItems);
          

          return {
            ParentAccountName: parentName,
            items: parentItems,
            Amount: total
          };
        });

        // Calculate total credit and debit for the group
        const GroupTotals = this.calculateGroupTotal(items);
   

        return {
          GroupName: group,
          parentTotals: parentTotals,
          totalAmount: GroupTotals
        };
      });

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      this.totalAmount = this.calculateTotalAmount(this.pagedItems);
    } else {
      this.totalAmount = 0
      this.pager = {};
      this.balanceList = [];
      this.pagedItems = [];
    }
  }, error => {
    console.error("Error occurred:", error);
  });
}

calculateCurrentFinancialYear(selectedDate: string) {
  debugger
  const today = new Date(selectedDate);
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // months are 0-indexed, so +1

  let startYear: number;
  let endYear: number;

  if (month >= 4) {
    startYear = year;
    endYear = year + 1;
  }
  else {
   
    startYear = year - 1;
    endYear = year;
  }
  const startDate = `01/04/${startYear}`;
  const endDate = `31/03/${endYear}`;
  this.currentFinancialYear = `${startDate} - ${endDate}`;
 
}

BasedOnDate(selectedDate: any) {

  var payload = {
    "DivisionId": "",
    "OfficeId": "",
    "Date": selectedDate
  };
  this.reportService.GetProfitLossList(payload).subscribe(result => {
    this.balanceList = [];
    this.pagedItems = [];
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
      console.log("Grouped items:", groupedItems);

      // Process each group to calculate parent totals and group totals
      this.balanceList = Object.keys(groupedItems).map(group => {
        const items = groupedItems[group];

        // Group items by ParentAccountName within the group
        const parentGroupedItems = items.reduce((parents: any, item: any) => {
          const parent = item.ParentAccountName;
          if (!parents[parent]) {
            parents[parent] = [];
          }
          // Ensure unique child account names
          if (!parents[parent].some((child: any) => child.ChildAccountName === item.ChildAccountName)) {
            parents[parent].push(item);
          }
          return parents;
        }, {});
        console.log("Grouped items by ParentAccountName:", parentGroupedItems);

        // Calculate totals for each parent account within the group
          const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
          const parentItems = parentGroupedItems[parentName];
          const total = this.calculateParentTotal(parentItems);

          return {
            ParentAccountName: parentName,
            items: parentItems,
            Amount: total

          };
        });

        // Calculate total credit and debit for the group
        
        const GroupTotals = this.calculateGroupTotal(items);
        

        debugger
        return {
          GroupName: group,
          parentTotals: parentTotals,
          totalAmount: GroupTotals
        };
      });

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      // this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
      // this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
        this.totalAmount = this.calculateTotalAmount(this.pagedItems);
      
    } else {
      this.totalAmount = 0
      this.pager = {};
      this.balanceList = [];
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
  if (!this.pagedItems || this.pagedItems.length === 0) {
    Swal.fire('No record found');
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Report');
  
  // Add title and subtitle rows
  // const titleRow = worksheet.addRow(['', 'ODAK SOLUTIONS PRIVATE LIMITED', '', '']);
  // titleRow.getCell(2).font = { size: 15, bold: true };
  // titleRow.getCell(2).alignment = { horizontal: 'center' };
  // worksheet.mergeCells(`B${titleRow.number}:C${titleRow.number}`);

  // added based on the Proift and loss scenerio

  const subtitleRow = worksheet.addRow(['', 'Profit and Loss', '', '']);
  subtitleRow.getCell(2).font = { size: 15, bold: true };
  subtitleRow.getCell(2).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`B${subtitleRow.number}:C${subtitleRow.number}`);

  // Add date row
  const currentDate = new Date();
  debugger
  // const subtitleRow1 = worksheet.addRow(['', `From ${this.datePipe.transform(this.selectedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`, '', '']);
  const subtitleRow1 = worksheet.addRow(['', `From ${this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')} To ${this.datePipe.transform(this.selectedDate, 'dd-MM-yyyy')}`, '', '']);

  subtitleRow1.getCell(2).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`B${subtitleRow1.number}:C${subtitleRow1.number}`);

  // Define header row
  const headers = ['Account', 'Account Code', 'Total', 'Year To Date'];
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
      color: { argb: 'FFFFF7' },
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

  let grandTotal = 0;
  let AccountCode = '';
  let grandTotalFY = 0;

  this.pagedItems.forEach(group => {
    // Add group header row
    const groupRow = worksheet.addRow([group.GroupName.toUpperCase(), '', '']);
    groupRow.font = { bold: true };

    // Apply color only to content cells
    groupRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f0f0f0' },
    };
    groupRow.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f0f0f0' },
    };
    groupRow.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f0f0f0' },
    };
    groupRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f0f0f0' },
    };
    let groupTotal = 0;
    let groupTotalFY = 0;

    group.parentTotals.forEach(parent => {
      let AccountCode = '';
      let parentTotal = 0;
      let parentTotalFY = 0;

      parent.items.forEach(balance => {
        const rowData = [
          balance.ParentAccountName + ' - ' + balance.ChildAccountName,
          balance.AccountCode,
          balance.ChildNet_Balance ? balance.ChildNet_Balance: 0,
          balance.ChildNet_Balance ? balance.ChildNet_Balance: 0
         ];

        const row = worksheet.addRow(rowData);

        // Apply styles based on column index
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1 || colNumber === 2) {
            cell.font = { color: { argb: '8B0000' }, bold: true }; // Red color for ChildAccountName
            cell.alignment = { horizontal: 'left' };
          } else if (colNumber === 3 || colNumber === 4) {
            cell.alignment = { horizontal: 'right' }; // Right align for Net Debit and Net Credit
          }
        });

       debugger
       
          parentTotal += balance.ChildNet_Balance;
          parentTotalFY += balance.ChildNet_Balance;
       
       
      });
      

      // Add parent total row
      const parentTotalRow = worksheet.addRow([`${parent.ParentAccountName} Total`, AccountCode, parentTotal, parentTotalFY]);
      parentTotalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'right' }; // Align first column to left
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f0f0f0' },
        };
      });

      groupTotal += parentTotal;
      groupTotalFY += parentTotalFY;
    });

    // Add group total row
    const groupTotalRow = worksheet.addRow([`${group.GroupName.toUpperCase()} Total`, '', groupTotal, groupTotalFY]);
    grandTotal += groupTotal;
    grandTotalFY += groupTotalFY;

    groupTotalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'right' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f0f0f0' },
      };
    });
  });

  // Add grand total row
  const grandTotalRow = worksheet.addRow(['Grand Total', '', grandTotal, grandTotalFY]);
  grandTotalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'right' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF99' },
    };
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

  // Style the footer row
  const footerRow = worksheet.addRow(['End of Report']);
  footerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8A9A5B' },
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFF7' },
    };
    cell.alignment = {
      horizontal: 'center',
    };
  });
  worksheet.mergeCells(`A${footerRow.number}:D${footerRow.number}`);

  // Write to Excel and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Report-ProfitandLoss.xlsx');
}




}
