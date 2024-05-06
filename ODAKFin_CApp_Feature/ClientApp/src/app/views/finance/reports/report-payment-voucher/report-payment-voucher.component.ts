import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-report-payment-voucher',
  templateUrl: './report-payment-voucher.component.html',
  styleUrls: ['./report-payment-voucher.component.css']
})

export class ReportPaymentVoucherComponent implements OnInit  {

  reportFilter: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  reportList: any[];
  reportForExcelList: any[];
  vendorList: any[];
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  paymentModeList: any[];
  TypeList = [
    {TypeId: 1, TypeName: 'Bill' },
    {TypeId: 2, TypeName: 'On Account' }
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
    public commonDataService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
    private globals: Globals,
    private fb: FormBuilder,
    private ps: PaginationService,
    private dataService: DataService,
    private reportService: ReportDashboardService,
    public excelService : ExcelService
  ) { }

  ngOnInit(): void {
    // this.getCustomerList();
    this.createReportForm();
    this.getDivisionList();
    this.getVoucherList();
    this.getVendorList();
    this.onOptionChange('month');
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
          this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(new Date(this.currentDate.getFullYear(), 2, 1), "yyyy-MM-dd")); // March 1st
          this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(new Date(2025, 3, 30), "yyyy-MM-dd")); // April 30th
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

  createReportForm() {
    this.reportFilter = this.fb.group({
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      DivisionId: [0],
      OfficeId: [0],
      VendorId: [0], 
      Amount: [0],
      Type: [0],
      PaymentMode: [0],
      PaidFrom: [0],
      Peroid: [''],
    });
    this.getPaymentVoucherReportList();
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
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    })
  }

  getVendorList() {
    return new Promise((resolve, reject) => {
      this.reportService.getVendorList().subscribe((result: any) => {
        if (result.message == "Success") {
          if (result["data"].Table.length) {
            const uniqueVendor = this.removeDuplicatesVendorId(result["data"].Table, 'VendorID');
            this.vendorList = uniqueVendor;
            resolve(true);
            // console.log('vendorList', this.vendorList);
          }
        }
      }, (error) => {
        // Swal.fire(error.message, 'error');
        reject();
      });
    })
  }

  removeDuplicatesVendorId(arr, key) {
    const uniqueMap = new Map();
    arr.forEach((item) => {
      const value = item[key];
      if (!uniqueMap.has(value)) {
        uniqueMap.set(value, item);
      }
    });
    return Array.from(uniqueMap.values());
  }

  getVoucherList() {
    return new Promise((resolve, rejects) => {
     

      let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
      this.dataService.post(service, { CustomerId: 0 }).subscribe((result: any) => {
        this.paymentModeList = result.data.Table4;
       
        resolve(true)
      }, error => {
        console.error(error);
        resolve(true)
      });
    })
  }

  getDivisionBasedOffice(officeId: number, divisoinId: any) {
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

  getPaymentVoucherReportList() {

    this.reportService.getPaymentVoucherReportList(this.reportFilter.value).subscribe(result => {
      this.reportList = [];
      this.startDate = this.reportFilter.controls.FromDate.value;
      this.endDate = this.reportFilter.controls.ToDate.value;

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
      FromDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1), "yyyy-MM-dd"),
      ToDate: this.datePipe.transform(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 31), "yyyy-MM-dd"),
      DivisionId: 0,
      OfficeId: 0,
      VendorId: 0,
      Amount: '',
      Type: 0,
      PaymentMode: 0,
      PaidFrom: 0,
      Peroid: ['']
    });
    this.getPaymentVoucherReportList();
  }


  // downloadAsCSV() {
  //   this.excelService.exportToCSV(this.reportList,'Report-ReceiptVoucher')
  //   if(this.reportForExcelList.length > 0){
  //     this.excelService.exportToCSV(this.reportForExcelList,'Report-ReceiptVoucher')
  //   } else {
  //     Swal.fire('no record found');
  //   }
  // }
  
  // downloadAsExcel() {
  //   this.excelService.exportToCSV(this.reportList,'Report-ReceiptVoucher')
  //   if(this.reportForExcelList.length > 0){
  //     this.excelService.exportAsExcelFile(this.reportForExcelList,'Report-ReceiptVoucher')
  //   } else {
  //     Swal.fire('no record found');
  //   }
  // }


   
async  downloadAsExcel() {
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
