import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ReportDashboardService } from 'src/app/services/financeModule/report-dashboard.service';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-report-sales-voucher',
  templateUrl: './report-sales-voucher.component.html',
  styleUrls: ['./report-sales-voucher.component.css']
})

export class ReportSalesVoucherComponent implements OnInit {

    reportFilter: FormGroup;
    divisionList: any = [];
    officeList: any = [];
    reportList: any[];
    reportForExcelList: any[];
    customerList: any[];
    branchList: any[];
    pager: any = {};// pager object  
    pagedItems: any[];// paged items
    paymentModeList: any[];
    isShowBranch: boolean = false;
    TypeList = [
      { TypeId: 1, TypeName: 'LA-Export'},
      { TypeId: 2, TypeName: 'LA-Import'},
      { TypeId: 3, TypeName: 'LA-Switch BL'},
      { TypeId: 4, TypeName: 'LA-MNR'},
      { TypeId: 5, TypeName: 'LA-Non-vessel'},
      { TypeId: 6, TypeName: 'LA-Interdivision'},
      { TypeId: 7, TypeName: 'FF-Job'},
      { TypeId: 8, TypeName: 'FF-Interdivision'},
      { TypeId: 9, TypeName: 'FI-Debit Note'},
      { TypeId: 10, TypeName: 'LA-Export'},
      { TypeId: 11, TypeName: 'LA-Import'},
      { TypeId: 12, TypeName: 'LA-Switch BL'},
      { TypeId: 13, TypeName: 'LA-MNR'},
      { TypeId: 14, TypeName: 'LA-Non-vessel'},
      { TypeId: 15, TypeName: 'LA-Interdivision'},
      { TypeId: 16, TypeName: 'FF-Job'},
      { TypeId: 17, TypeName: 'FF-Interdivision'},
      { TypeId: 18, TypeName: 'FI-Debit Note'}
    ];
  
    PeroidList = [
      { peroidId: 'today', peroidName: 'CURRENT DAY' },
      { peroidId: 'week', peroidName: 'CURRENT WEEK' },
      { peroidId: 'month', peroidName: 'CURRENT MONTH' },
      { peroidId: 'year', peroidName: 'CURRENT FINANCIAL YEAR' },
      { peroidId: 'custom', peroidName: 'CUSTOM' }
    ];
    bankList: any[];
    entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat')
    currentDate = new Date();
    selectedOption: string;
  
    campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });
  
    startDate = '';
    endDate = '';
  
    constructor(
      private commonDataService: CommonService,
      private datePipe: DatePipe,
      private router: Router,
      private globals: Globals,
      private fb: FormBuilder,
      private ps: PaginationService,
      private dataService: DataService,
      private reportService: ReportDashboardService,
      public excelService: ExcelService
    ) { }
  
    ngOnInit(): void {
      // this.getCustomerList();
      this.createReportForm();
      this.onOptionChange('month');
      this.getDivisionList();
      this.getVoucherList(0);
      this.reportFilter.controls.Peroid.setValue('month');
    }
  
    onOptionChange(selectedOption: string) {
      this.selectedOption = '';
      switch (selectedOption) {
        case 'today':
          this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(this.currentDate, "yyyy-MM-dd"));
          this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(this.currentDate, "yyyy-MM-dd"));
          break;
        case 'week':
          this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay()), "yyyy-MM-dd"));
          this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + (6 - this.currentDate.getDay())), "yyyy-MM-dd"));
          break;
        case 'month':
          const startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd")
          const endDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd")
  
          this.reportFilter.controls.FromDate.setValue(startDate);
          this.reportFilter.controls.ToDate.setValue(endDate);
          break;
        case 'year':
        
  
            const currentYear = this.currentDate.getFullYear();
            const startYear = this.currentDate.getMonth() >= 3 ? currentYear : currentYear - 1;
            const endYear = startYear + 1;
          
            this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(new Date(startYear, 3, 1), "yyyy-MM-dd"));
            this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(new Date(endYear, 2, 31), "yyyy-MM-dd"));
         
         
          break;
        case 'custom':
          this.selectedOption = 'custom';
          this.startDate = this.reportFilter.controls.FromDate.value;
          this.endDate = this.reportFilter.controls.ToDate.value;
          break;
        default:
          this.selectedOption = '';
          break;
      }
    }
  
  
    async createReportForm() {
      this.reportFilter = this.fb.group({
        DivisionId: [0],
        OfficeId: [0],
        CustomerId: [0],
        BranchId:[0],
        FromDate: [this.startDate],
        ToDate: [this.endDate],
        Amount: [''],
        Type: [0],
        InvoiceNo: [],
        InvoiceType: [0],
        Peroid: [''],
      });
      this.onOptionChange('month');
      await this.getSalesVoucherReportList();
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
  
    getOfficeList(id: number) {
      this.reportFilter.controls.Office.setValue(0);
      this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
        this.officeList = [];
        if (result['data'].Table.length > 0) {
          this.officeList = result['data'].Table;
        }
  
        if (this.officeList.length == 1) {
          const ID =
            this.reportFilter.controls.Office.setValue(this.officeList[0].ID);
        }
      })
    }
  
    getVoucherList(customerId: any) {
      return new Promise((resolve, rejects) => {
        let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
        this.dataService.post(service, { CustomerId: customerId }).subscribe((result: any) => {
          this.customerList = result.data.Table2;
          resolve(true)
        }, error => {
          console.error(error);
          resolve(true)
        });
      })
    }


    selectedCustomerBranch(event:any) {
      let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
      this.dataService.post(service, { CustomerId: event }).subscribe((result: any) => {
        this.branchList = [];
        this.branchList = result.data.Table3;
        if (result.data.Table3.length > 0) { 
            this.reportFilter.controls['BranchId'].setValue(0);
             if (this.branchList.length == 1) {
              const branchCode = this.branchList[0].BranchCode;
              this.reportFilter.controls['BranchId'].setValue(branchCode);          
             }
         }
      }, error => { });
    }

    
  
    getDivisionBasedOffice(officeId: number, divisoinId: any) {
      this.reportFilter.controls.DepositTo.setValue(0);
      if (officeId && divisoinId) {
        let service = `${this.globals.APIURL}/Common/GetBankByOfficeId`;
        let payload = {
          "OfficeId": officeId,
          "DivisionId": divisoinId
        }
        this.dataService.post(service, payload).subscribe((result: any) => {
          if (result.message = "Success") {
            this.bankList = result.data.Table;
          }
        }, error => {
          console.error(error);
        });
      }
    }
  
    getSalesVoucherReportList() {
        this.startDate = this.reportFilter.controls.FromDate.value;
        this.endDate = this.reportFilter.controls.ToDate.value;
  
      this.reportService.getSalesVoucherReportList(this.reportFilter.value).subscribe(result => {
        this.reportList = [];
   
  
        if (result['data'].Table.length > 0) {
          this.reportList = result['data'].Table;
          this.reportForExcelList = !result['data'].Table1 ? [] : result['data'].Table1;
          this.setPage(1)
        } else {
          this.pager = {};
          this.pagedItems = [];
        }
      })
    }
  
  
    setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) return;
  
      this.pager = this.ps.getPager(this.reportList.length, page);
      this.pagedItems = this.reportList.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  
    clear() {
      this.startDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd");
      this.endDate = this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd");
  
      this.reportFilter.reset({
        DivisionId: 0,
        OfficeId: 0,
        CustomerId: 0,
        BranchId: 0,
        FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
        ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
        Amount: '',
        Type: 0,
        InvoiceNo: 0,
        InvoiceType: 0
      });
      this.bankList = [];
      this.officeList = [];
      this.reportFilter.controls.Peroid.setValue('month');
      this.getSalesVoucherReportList();
    }
  
    
    async downloadAsExcel() {
      if (this.reportForExcelList.length === 0) {
        Swal.fire('No record found');
        return;
      }
  
      // Create a new workbook and worksheet
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Report');
  
      // Define header row and style it with yellow background, bold, and centered text
      const header = Object.keys(this.reportForExcelList[0]);
      const headerRow = worksheet.addRow(header);
  
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow background
        };
        cell.font = {
          bold: true, // Bold font
        };
        cell.alignment = {
          horizontal: 'center', // Center alignment
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
  
      // Add data rows
      this.reportForExcelList.forEach((data) => {
        worksheet.addRow(Object.values(data));
      });
  
      // Adjust column widths to fit content
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = maxLength + 2; // Add some padding
      });
  
      // Style the footer row with yellow background, bold, and centered text
      const footerRow = worksheet.addRow(['End of Report']); // Footer text
      footerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow background
        };
        cell.font = {
          bold: true,
        };
        cell.alignment = {
          horizontal: 'center',
        };
      });
  
      // Merge footer cells if needed
      worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);
  
      // Write to Excel and save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Report-ReceiptVoucher.xlsx');
    }
  
    async downloadAsCSV() {
      if (this.reportForExcelList.length === 0) {
        Swal.fire('No record found');
        return;
      }
  
      // Create a new workbook and worksheet
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Report');
  
      // Define header row and style it with yellow background, bold, and centered text
      const header = Object.keys(this.reportForExcelList[0]);
      const headerRow = worksheet.addRow(header);
  
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow background
        };
        cell.font = {
          bold: true, // Bold font
        };
        cell.alignment = {
          horizontal: 'center', // Center alignment
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
  
      // Add data rows
      this.reportForExcelList.forEach((data) => {
        worksheet.addRow(Object.values(data));
      });
  
      // Adjust column widths to fit content
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = maxLength + 2; // Add some padding
      });
  
      // Style the footer row with yellow background, bold, and centered text
      const footerRow = worksheet.addRow(['End of Report']); // Footer text
      footerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow background
        };
        cell.font = {
          bold: true,
        };
        cell.alignment = {
          horizontal: 'center',
        };
      });
  
      // Merge footer cells if needed
      worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);
  
      // Write to Excel and save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Report-ReceiptVoucher.xlsx');
    }
  }
  

