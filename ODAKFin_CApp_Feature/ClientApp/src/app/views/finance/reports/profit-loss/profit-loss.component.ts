
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
  currentFinancialYears: string;
  selectedDivisionId: number;
  bankListDetails: any = [];
  TemplateUploadURL = this.globals.TemplateUploadURL;
  dataList: any;
  totalAmount   = 0;
  totalAmount1   = 0;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  entityThousands = Number(this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat'));
  // sortOrder: { [key: string]: 'asc' | 'desc' } = {};
  fromMaxDate = this.currentDate;

  PeroidList = [
    { peroidId: 'today', peroidName: 'CURRENT DAY' },
    { peroidId: 'week', peroidName: 'CURRENT WEEK' },
    { peroidId: 'month', peroidName: 'CURRENT MONTH' },
    { peroidId: 'year', peroidName: 'CURRENT FINANCIAL YEAR' },
    { peroidId: 'custom', peroidName: 'CUSTOM' },
    { peroidId: 'previoustoday', peroidName: 'PREVIOUS DAY' },
    { peroidId: 'previousweek', peroidName: 'PREVIOUS WEEK' },
    { peroidId: 'previousmonth', peroidName: 'PREVIOUS MONTH' },
    { peroidId: 'previousyear', peroidName: 'PREVIOUS FINANCIAL YEAR' }
  ];

  sortOrder: { [key: string]: 'asc' | 'desc' } = {
    ChildAccountName: 'asc',
    ParentAccountName: 'asc',
    ChildNet_Balance: 'asc',
  };

  expandedParents: { [key: string]: boolean } = {};
  selectedOption: string;
  startDate = '';
  endDate = '';


  @ViewChild('table') table: ElementRef;

  constructor(public ps: PaginationService,
    private fb: FormBuilder,
    private router: Router, private datePipe: DatePipe,   private globals: Globals,
    private dataService: DataService,
    private commonDataService: CommonService, 
    private contraVoucherService: ContraVoucherService,
    private reportService: ReportDashboardService,
    private http: HttpClient) { 
      this.createReportForm();
    }

  ngOnInit(): void {
    this.createReportForm();
    this.getDivisionList();
    this.getOfficeList();
  }

  onOptionChange(selectedOption: string) {
    
    this.selectedOption = '';
    switch (selectedOption) {

      case 'today':
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(this.currentDate, "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(this.currentDate, "yyyy-MM-dd"));
        break;

      case 'week':
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay()), "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + (6 - this.currentDate.getDay())), "yyyy-MM-dd"));
        break;
        case 'month':
        const startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd")
        const nextMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        const lastDayOfMonth = new Date(nextMonth);
        lastDayOfMonth.setDate(nextMonth.getDate() - 1);
        const endDate = this.datePipe.transform(lastDayOfMonth, "yyyy-MM-dd");
        this.filterForm.controls.FromDate.setValue(startDate);
        this.filterForm.controls.ToDate.setValue(endDate); 
        break;

      case 'year':
        const currentYear = this.currentDate.getFullYear();
        const startYear = this.currentDate.getMonth() >= 3 ? currentYear : currentYear - 1;
        const endYear = startYear + 1;
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(new Date(startYear, 3, 1), "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(new Date(endYear, 2, 31), "yyyy-MM-dd"));
        break;

      case 'previoustoday':
        const previousDay = new Date(this.currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(previousDay, "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(previousDay, "yyyy-MM-dd"));
        break;

      case 'previousweek':
        const previousWeekStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay() - 7);
        const previousWeekEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay() - 1);
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(previousWeekStartDate, "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(previousWeekEndDate, "yyyy-MM-dd"));
        break;

      case 'previousmonth':
        
        const previousMonthStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        const previousMonthEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(previousMonthStartDate, "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(previousMonthEndDate, "yyyy-MM-dd"));
        break;

      case 'previousyear':
        const previousYear = this.currentDate.getFullYear() - 1;
        const previousYearStartDate = new Date(previousYear, 3, 1);
        const previousYearEndDate = new Date(previousYear + 1, 2, 31);
        this.filterForm.controls.FromDate.setValue(this.datePipe.transform(previousYearStartDate, "yyyy-MM-dd"));
        this.filterForm.controls.ToDate.setValue(this.datePipe.transform(previousYearEndDate, "yyyy-MM-dd"));
        break;

      case 'custom':
        this.selectedOption = 'custom';
        this.startDate = this.filterForm.controls.FromDate.value;
        this.endDate = this.filterForm.controls.ToDate.value;
        break;
      default:
        this.selectedOption = '';
        break;
    }
    this.trailbalanceList()
  }


  toggleParent(groupName: string, parentName: string): void {
    const key = `${groupName}-${parentName}`;
    this.expandedParents[key] = !this.expandedParents[key];
  }

  isParentExpanded(groupName: string, parentName: string): boolean {
    const key = `${groupName}-${parentName}`;
    return this.expandedParents[key];
  }

  navigate(){    this.nav=false;
  }

  // onDateChange(event: any): void {
  //   this.selectedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
  //   this.BasedOnDate(this.selectedDate);
  //   // this.calculateCurrentFinancialYear(this.selectedDate);
  // } 

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
    
    // let financedate;
    // if (payload.Date === "") {
    //   financedate = this.currentDate
    //   this.selectedDate = this.currentDate
     
    // }
    // this.calculateCurrentFinancialYear(financedate);

    this.calculateCurrentFinancialYear();

    this.startDate = this.filterForm.controls.FromDate.value;
    this.endDate = this.filterForm.controls.ToDate.value;
    

    this.reportService.GetProfitLossList(this.filterForm.value).subscribe(result => {
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
          const items1 = groupedItems[group];
  
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
            let total = 0;
            let total1 = 0;
            
            // Check if any transaction date is less than or equal to selectedDate
            const hasSelectedDate = parentItems.some(item => {
              const transDate = new Date(item.Trans_Date);
              const startDate = new Date(this.startDate);
              const endDate = new Date(this.endDate);
              return transDate >= startDate && transDate <= endDate;
          });
  
          // Extract start and end dates from currentFinancialYears
          const startDateStr = this.currentFinancialYears.substring(0, 10);
          const endDateStr = this.currentFinancialYears.substring(13, 23);
  
         
          
          // Check if any transaction date falls within the financial year range
          const isWithinFinancialYear = parentItems.some(item => {
              // const transDate = new Date(item.Trans_Date);
              return item.Trans_Date >= startDateStr && item.Trans_Date <= endDateStr;
          });
          console.log("hasSelectedDate>", hasSelectedDate);
          console.log("isWithinFinancialYear>", isWithinFinancialYear);
            
              // Calculate total based on the condition
              if (hasSelectedDate) {
                total += this.calculateParentTotal(parentItems);
              } 
              if(isWithinFinancialYear)  {
              total1 += this.calculateParentTotal1(parentItems);
              }
              
              const itemsWithTotals = parentItems.map(item => {
                
                const ChildNet = hasSelectedDate ? (item.ChildNet_Balance || 0) : 0;
                const ChildNet1 = isWithinFinancialYear ? (item.ChildNet_Balance || 0) : 0;
                return {
                    ...item,
                    ChildNet,
                    ChildNet1
                };
            });
            return {
              ParentAccountName: parentName,
              items: itemsWithTotals ,
              // ChildNet: hasSelectedDate ? ChildNet : 0,  
              // ChildNet1: isWithinFinancialYear ? ChildNet1 : 0,  
  
              Amount: total,
              Amount1: total1
  
            };
          });
  
          // Calculate total credit and debit for the group
          
          const GroupTotals = parentTotals.reduce((sum, pt) => sum + pt.Amount, 0);
          const GroupTotals1 = parentTotals.reduce((sum, pt) => sum + pt.Amount1, 0);
          return {
            GroupName: group,
            parentTotals: parentTotals,
            totalAmount: GroupTotals,
            totalAmount1: GroupTotals1
          };
        });
  
        // Assign grouped list to pagedItems
        this.pagedItems = this.balanceList;
        this.setPage(1);
        // this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
        // this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
          this.totalAmount = this.calculateTotalAmount(this.pagedItems);
          this.totalAmount1 = this.calculateTotalAmount1(this.pagedItems);
        
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
  calculateParentTotal1(parentItems: any[]): number {
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

  calculateTotalAmount1(items: any[]): number {
    return items.reduce((sum, group) => {
      return sum + group.totalAmount1;
    }, 0);
  }
  
  async createReportForm() {
  this.filterForm = this.fb.group({
    FromDate: [this.startDate],
    ToDate: [this.endDate],
    OfficeId: [''],
    DivisionId: [''],
    Peroid: [''],
  });

//   if(this.filterForm.controls.DivisionId.value == "" || this.filterForm.controls.OfficeId.value == "")
//   this.filterForm.controls.Peroid.setValue('month');
// else{

// }
this.filterForm.controls.Peroid.setValue('month');
  this.onOptionChange('month');
  await this.trailbalanceList();
}

async editBalance(id: number) {

  // const payload = {
  //   "AccountId": id,
  //   "Date": "",
  //   "DivisionId": "",
	// "OfficeId" : ""
  // };
  
  
  // Define the form group
  this.filterForm = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      OfficeId: [this.filterForm.controls.OfficeId.value],
      DivisionId: [this.filterForm.controls.DivisionId.value],
      Peroid: [this.filterForm.controls.Peroid.value],
  });

  

  // Call the service
  this.reportService.GetProfitLossList(this.filterForm.value).subscribe(data => {
      // Navigate to the leveltwo-profitloss component with query parameters
      this.router.navigate(['/views/reports/leveltwo-profitloss', { 
          id: id,
          FromDate: this.filterForm.controls.FromDate.value,
          ToDate: this.filterForm.controls.ToDate.value,
          OfficeId: this.filterForm.controls.OfficeId.value,
          DivisionId: this.filterForm.controls.DivisionId.value,
          Peroid: this.filterForm.controls.Peroid.value
      }]);
      
  }, err => {
      console.log('error:', err.message);
  });
}

async onDivisionChange(value: any) {
  
  this.filterForm = this.fb.group({
  FromDate: [this.startDate],
  ToDate: [this.endDate],
  OfficeId: [''],
  DivisionId: [value],
  Peroid: [this.filterForm.controls.Peroid.value],

});

// this.onOptionChange()


  this.reportService.GetProfitLossList(this.filterForm.value).subscribe(result => {
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
        const items1 = groupedItems[group];

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
          let total = 0;
          let total1 = 0;
          
          // Check if any transaction date is less than or equal to selectedDate
          const hasSelectedDate = parentItems.some(item => {
            const transDate = new Date(item.Trans_Date);
            const startDate = new Date(this.startDate);
              const endDate = new Date(this.endDate);
              return transDate >= startDate && transDate <= endDate;
        });

        // Extract start and end dates from currentFinancialYears
        const startDateStr = this.currentFinancialYears.substring(0, 10);
        const endDateStr = this.currentFinancialYears.substring(13, 23);

       
        
        // Check if any transaction date falls within the financial year range
        const isWithinFinancialYear = parentItems.some(item => {
            // const transDate = new Date(item.Trans_Date);
            return item.Trans_Date >= startDateStr && item.Trans_Date <= endDateStr;
        });
        console.log("hasSelectedDate>", hasSelectedDate);
        console.log("isWithinFinancialYear>", isWithinFinancialYear);
          
            // Calculate total based on the condition
            if (hasSelectedDate) {
              total += this.calculateParentTotal(parentItems);
            } 
            if(isWithinFinancialYear)  {
            total1 += this.calculateParentTotal1(parentItems);
            }
            
            const itemsWithTotals = parentItems.map(item => {
              
              const ChildNet = hasSelectedDate ? (item.ChildNet_Balance || 0) : 0;
              const ChildNet1 = isWithinFinancialYear ? (item.ChildNet_Balance || 0) : 0;
              return {
                  ...item,
                  ChildNet,
                  ChildNet1
              };
          });
          return {
            ParentAccountName: parentName,
            items: itemsWithTotals ,
            // ChildNet: hasSelectedDate ? ChildNet : 0,  
            // ChildNet1: isWithinFinancialYear ? ChildNet1 : 0,  

            Amount: total,
            Amount1: total1

          };
        });

        // Calculate total credit and debit for the group
        
        const GroupTotals = parentTotals.reduce((sum, pt) => sum + pt.Amount, 0);
        const GroupTotals1 = parentTotals.reduce((sum, pt) => sum + pt.Amount1, 0);

        

        return {
          GroupName: group,
          parentTotals: parentTotals,
          totalAmount: GroupTotals,
          totalAmount1: GroupTotals1
        };
      });

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      // this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
      // this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
        this.totalAmount = this.calculateTotalAmount(this.pagedItems);
        this.totalAmount1 = this.calculateTotalAmount1(this.pagedItems);
      
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





  async onOfficeChange(values: any) {
    
    this.filterForm = this.fb.group({
    FromDate: [this.startDate],
    ToDate: [this.endDate],
    OfficeId: [values],
    DivisionId: [this.filterForm.controls.DivisionId.value],
    Peroid: [this.filterForm.controls.Peroid.value],
  
  });


  this.reportService.GetProfitLossList(this.filterForm.value).subscribe(result => {
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
        const items1 = groupedItems[group];

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
          let total = 0;
        let total1 = 0;
        let ChildNet = 0;
        let ChildNet1 = 0;
        

        // Check if any transaction date is less than or equal to selectedDate
        const hasSelectedDate = parentItems.some(item => {
            const transDate = new Date(item.Trans_Date);
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);
            return transDate >= startDate && transDate <= endDate;
        });

        // Extract start and end dates from currentFinancialYears
        const startDateStr = this.currentFinancialYears.substring(0, 10);
        const endDateStr = this.currentFinancialYears.substring(13, 23);

       
        
        // Check if any transaction date falls within the financial year range
        const isWithinFinancialYear = parentItems.some(item => {
            // const transDate = new Date(item.Trans_Date);
            return item.Trans_Date >= startDateStr && item.Trans_Date <= endDateStr;
        });
        console.log("hasSelectedDate>", hasSelectedDate);
        console.log("isWithinFinancialYear>", isWithinFinancialYear);
          
            // Calculate total based on the condition
            if (hasSelectedDate) {
              ChildNet = parentItems.reduce((sum, item) => sum + (item.ChildNet_Balance || 0), 0);
              total += this.calculateParentTotal(parentItems);
              

            } 
            if(isWithinFinancialYear)  {
              ChildNet1 = parentItems.reduce((sum, item) => sum + (item.ChildNet_Balance || 0), 0);
              total1 += this.calculateParentTotal1(parentItems);
            }

            const itemsWithTotals  = parentItems.map(item => ({
              ...item,
              ChildNet: hasSelectedDate ? ChildNet : 0,
              ChildNet1: isWithinFinancialYear ? ChildNet1 : 0
          }));

          return {
            ParentAccountName: parentName,
            items: itemsWithTotals ,
            // ChildNet: hasSelectedDate ? ChildNet : 0,  
            // ChildNet1: isWithinFinancialYear ? ChildNet1 : 0,  

            Amount: total,
            Amount1: total1

          };
        });

        // Calculate total credit and debit for the group
        
        const GroupTotals = parentTotals.reduce((sum, pt) => sum + pt.Amount, 0);
        const GroupTotals1 = parentTotals.reduce((sum, pt) => sum + pt.Amount1, 0);

        

        return {
          GroupName: group,
          parentTotals: parentTotals,
          totalAmount: GroupTotals,
          totalAmount1: GroupTotals1
        };
      });

      // Assign grouped list to pagedItems
      this.pagedItems = this.balanceList;
      this.setPage(1);
      // this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
      // this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
        this.totalAmount = this.calculateTotalAmount(this.pagedItems);
        this.totalAmount1 = this.calculateTotalAmount1(this.pagedItems);
      
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

calculateCurrentFinancialYear() {
  const today = new Date;
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
  const startDates = `${startYear}-04-01`;
  const endDates = `${endYear}-03-31`;
  this.currentFinancialYear = `${startDate} - ${endDate}`;
  this.currentFinancialYears = `${startDates} - ${endDates}`;
 
}

// BasedOnDate(selectedDate: any) {

//   var payload = {
//     "DivisionId": "",
//     "OfficeId": "",
//     "Date": selectedDate
//   };
//   this.reportService.GetProfitLossList(payload).subscribe(result => {
//     this.balanceList = [];
//     this.pagedItems = [];
//     if (result.message === 'Success' && result.data.Table.length > 0) {
//       // Group the items by GroupName
//       const groupedItems = result.data.Table.reduce((groups: any, item: any) => {
//         const group = item.GroupName;
//         if (!groups[group]) {
//           groups[group] = [];
//         }
//         groups[group].push(item);
//         return groups;
//       }, {});
//       console.log("Grouped items:", groupedItems);

//       // Process each group to calculate parent totals and group totals
//       this.balanceList = Object.keys(groupedItems).map(group => {
//         const items = groupedItems[group];
//         const items1 = groupedItems[group];

//         // Group items by ParentAccountName within the group
//         const parentGroupedItems = items.reduce((parents: any, item: any) => {
//           const parent = item.ParentAccountName;
//           if (!parents[parent]) {
//             parents[parent] = [];
//           }
//           // Ensure unique child account names
//           if (!parents[parent].some((child: any) => child.ChildAccountName === item.ChildAccountName)) {
//             parents[parent].push(item);
//           }
//           return parents;
//         }, {});
//         console.log("Grouped items by ParentAccountName:", parentGroupedItems);

//         // Calculate totals for each parent account within the group
//           const parentTotals = Object.keys(parentGroupedItems).map(parentName => {
//           const parentItems = parentGroupedItems[parentName];
//           let total = 0;
//           let total1 = 0;
          
//           // Check if any transaction date is less than or equal to selectedDate
//           const hasSelectedDate = parentItems.some(item => {
//             const transDate = new Date(item.Trans_Date);
//             const selectedDate = new Date(this.selectedDate);
//             return transDate <= selectedDate;
//         });

//         // Extract start and end dates from currentFinancialYears
//         const startDateStr = this.currentFinancialYears.substring(0, 10);
//         const endDateStr = this.currentFinancialYears.substring(13, 23);

       
        
//         // Check if any transaction date falls within the financial year range
//         const isWithinFinancialYear = parentItems.some(item => {
//             // const transDate = new Date(item.Trans_Date);
//             return item.Trans_Date >= startDateStr && item.Trans_Date <= endDateStr;
//         });
//         console.log("hasSelectedDate>", hasSelectedDate);
//         console.log("isWithinFinancialYear>", isWithinFinancialYear);
          
//             // Calculate total based on the condition
//             if (hasSelectedDate) {
//               total += this.calculateParentTotal(parentItems);
//             } 
//             if(isWithinFinancialYear)  {
//             total1 += this.calculateParentTotal1(parentItems);
//             }
            
//             const itemsWithTotals = parentItems.map(item => {
              
//               const ChildNet = hasSelectedDate ? (item.ChildNet_Balance || 0) : 0;
//               const ChildNet1 = isWithinFinancialYear ? (item.ChildNet_Balance || 0) : 0;
//               return {
//                   ...item,
//                   ChildNet,
//                   ChildNet1
//               };
//           });
//           return {
//             ParentAccountName: parentName,
//             items: itemsWithTotals ,
//             // ChildNet: hasSelectedDate ? ChildNet : 0,  
//             // ChildNet1: isWithinFinancialYear ? ChildNet1 : 0,  

//             Amount: total,
//             Amount1: total1

//           };
//         });

//         // Calculate total credit and debit for the group
        
//         const GroupTotals = parentTotals.reduce((sum, pt) => sum + pt.Amount, 0);
//         const GroupTotals1 = parentTotals.reduce((sum, pt) => sum + pt.Amount1, 0);

        

//         return {
//           GroupName: group,
//           parentTotals: parentTotals,
//           totalAmount: GroupTotals,
//           totalAmount1: GroupTotals1
//         };
//       });

//       // Assign grouped list to pagedItems
//       this.pagedItems = this.balanceList;
//       this.setPage(1);
//       // this.totalcreditamount = this.calculateTotalCreditAmount(this.pagedItems);
//       // this.totaldebitamount = this.calculateTotalDebitAmount(this.pagedItems);
//         this.totalAmount = this.calculateTotalAmount(this.pagedItems);
//         this.totalAmount1 = this.calculateTotalAmount1(this.pagedItems);
      
//     } else {
//       this.totalAmount = 0
//       this.pager = {};
//       this.balanceList = [];
//       this.pagedItems = [];
//     }
//   }, error => {
//     console.error("Error occurred:", error);
//   });
// }

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
  const titleRow = worksheet.addRow([, 'ODAK SOLUTIONS PRIVATE LIMITED']);
  titleRow.getCell(1).font = { size: 15, bold: true };
  titleRow.getCell(1).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`);

  // added based on the Proift and loss scenerio

  const subtitleRow = worksheet.addRow(['Profit and Loss']);
  subtitleRow.getCell(1).font = { size: 15, bold: true };
  subtitleRow.getCell(1).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`A${subtitleRow.number}:C${subtitleRow.number}`);

  // Add date row
  const currentDate = new Date();
  // const subtitleRow1 = worksheet.addRow(['', `From ${this.datePipe.transform(this.selectedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`, '', '']);
  const subtitleRow1 = worksheet.addRow([`From ${this.datePipe.transform(this.startDate, 'dd-MM-yyyy')} To ${this.datePipe.transform(this.endDate, 'dd-MM-yyyy')}`]);
  subtitleRow.getCell(1).font = { size: 14, bold: false };
  subtitleRow1.getCell(1).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`A${subtitleRow1.number}:C${subtitleRow1.number}`);

  // Define header row
  const headers = ['Account', 'Total', `Year To Date\n${this.currentFinancialYear}`];
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
      vertical: 'middle',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  let grandTotal = 0;
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
    let groupTotal = 0;
    let groupTotalFY = 0;

    group.parentTotals.forEach(parent => {
      let parentTotal = 0;
      let parentTotalFY = 0;

      parent.items.forEach(balance => {
        const rowData = [
          balance.ParentAccountName + ' - ' + balance.ChildAccountName,
          balance.ChildNet ? balance.ChildNet: 0,
          balance.ChildNet1 ? balance.ChildNet1: 0
         ];

        const row = worksheet.addRow(rowData);

        // Apply styles based on column index
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1 ) {
            cell.font = { color: { argb: '8B0000' }, bold: true }; // Red color for ChildAccountName
            cell.alignment = { horizontal: 'left' };
          } else if (colNumber === 2 || colNumber === 3) {
            cell.alignment = { horizontal: 'right' }; // Right align for Net Debit and Net Credit
          }
        });

      
       
          parentTotal += balance.ChildNet;
          parentTotalFY += balance.ChildNet1;
       
       
      });
      

      // Add parent total row
      const parentTotalRow = worksheet.addRow([`${parent.ParentAccountName} Total`, parentTotal, parentTotalFY]);
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
    const groupTotalRow = worksheet.addRow([`${group.GroupName.toUpperCase()} Total`, groupTotal, groupTotalFY]);
    grandTotal += groupTotal;
    grandTotalFY += groupTotalFY;

    groupTotalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'right' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCAe9F6' },
      };
    });
  });

  // Add grand total row
  const grandTotalRow = worksheet.addRow(['Grand Total', grandTotal, grandTotalFY]);
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
  worksheet.mergeCells(`A${footerRow.number}:C${footerRow.number}`);

  // Write to Excel and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Report-ProfitandLoss.xlsx');
}




}
