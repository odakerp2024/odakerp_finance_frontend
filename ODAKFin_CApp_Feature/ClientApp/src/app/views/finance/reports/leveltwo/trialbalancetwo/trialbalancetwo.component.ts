import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

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
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  entityThousands = Number(this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat'));

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
  Cancel(){
    this.router.navigate(['/views/finance/reports/levelone', {  }])
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
  debugger
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

// downloadExcel() {
//   if (!this.table) {
//     console.error('Table element not found.');
//     return;
//   }

//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//   XLSX.writeFile(wb, 'table_data.xlsx');
// }


async downloadExcel() {
  debugger
  if (!this.balanceList || this.balanceList.length === 0) {
    Swal.fire('No record found');
    return;
  }
 
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add title and subtitle rows
  const titleRow = worksheet.addRow(['', '', 'ODAK SOLUTIONS PRIVATE LIMITED', '', '', '']);
  titleRow.getCell(3).font = { size: 15, bold: true };
  titleRow.getCell(3).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`C${titleRow.number}:D${titleRow.number}`);
  const subtitleRow = worksheet.addRow(['', '', 'Account Transactions', '', '', '']);
  subtitleRow.getCell(3).font = { size: 15, bold: true };
  subtitleRow.getCell(3).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`C${subtitleRow.number}:D${subtitleRow.number}`);
  const subtitleRow1 = worksheet.addRow(['', '', ' Accounts Receivable', '', '', '']);
  subtitleRow1.getCell(3).font = { size: 15, bold: true };
  subtitleRow1.getCell(3).alignment = { horizontal: 'center' };
  worksheet.mergeCells(`C${subtitleRow1.number}:D${subtitleRow1.number}`);

  // Add date row
  const currentDate = new Date();
  worksheet.addRow(['', '', `As of ${currentDate.toDateString()}`, '', '', '']);
 

  // Define header row
  const headers = ['Trans_Date', 'Trans_Account_Name', 'Trans_Details', 'Transaction_Type', 'Trans_Type', 'Trans_Ref_Details', 'Debit', 'Credit', 'Amount'];
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

  
 
    // Add group header row
  //     const rowData = [
  //       group.Trans_Date ,
  //       group.Trans_Account_Name,
  //       group.Trans_Details,
  //       group.Transaction_Type,
  //       group.Trans_Type,
  //       group.Trans_Ref_Details,
  //       group.ChildTransaction_Type === 'Credit' ? group.Credit : 0,
  //       group.ChildTransaction_Type === 'Debit' ? group.Debit : 0,
  //       group.Amount
  //     ];
  //     worksheet.addRow(rowData);
  // });

  this.balanceList.forEach(group => {
    const rowData = [
            group.Trans_Date ,
            group.Trans_Account_Name,
            group.Trans_Details,
            group.Transaction_Type,
            group.Trans_Type,
            group.Trans_Ref_Details,
            group.ChildTransaction_Type === 'Credit' ? group.Credit : 0,
            group.ChildTransaction_Type === 'Debit' ? group.Debit : 0,
            group.Amount
          ];
          worksheet.addRow(rowData);
        });
       
  //   const date = group.Trans_Date
  //   const formattedDate = date.split('T')[0];
  //   group.Trans_Date = formattedDate;

  //   const defalutvalue=0;
  //   // Merge the symbol and amount into a single string with fixed decimal places
  //   const mergeddebit = group['Debit'] !== null ? parseFloat(group['Debit']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction);
  //   const mergedcredit = group['Credit'] !== null ? parseFloat(group['Credit']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction);
  //   const amount = group['Amount'] !== null ? parseFloat(group['Amount']).toFixed(this.entityFraction) :  (defalutvalue).toFixed(this.entityFraction);
    
  //   // Filter out properties you don't want to include in the Excel sheet
  //   const filteredData = Object.keys(group)
      
  //   filteredData['Debit'] = mergeddebit;
  //   filteredData['Credit'] = mergedcredit;
  //   filteredData['Amount'] = amount;
   

  //   // // Add the filtered data to the worksheet
  //   const row = worksheet.addRow(Object.values(filteredData ));

  //   // Set text color for customer, receipt, and amount columns
  //   const columnsToColor = [ 'Account_Name', 'Debit', 'Credit', 'Amount'];
  //   columnsToColor.forEach(columnName => {
  //     const columnIndex = Object.keys(group).indexOf(columnName);
  //     if (columnIndex !== -1) {
  //       const cell = row.getCell(columnIndex + 1);
  //       cell.font = { color: { argb: '8B0000' }, bold: true, }; // Red color
  //     }
  //   });
  

  // });

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
  saveAs(blob, 'Report-Account Transactions.xlsx');
}

}




