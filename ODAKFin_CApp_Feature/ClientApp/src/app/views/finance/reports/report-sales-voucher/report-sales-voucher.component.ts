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
import { GridSort } from 'src/app/model/common';
import { error } from 'console';


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
  TypeList: any[];
  isShowBranch: boolean = false;
  pagesort: any = new GridSort().sort;
  VoucherTypeList = [
      { TypeId: 2, TypeName: 'CREDIT'},
      { TypeId: 1, TypeName: 'DEBIT'}
  ];

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
  bankList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
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
    this.createReportForm();
    this.onOptionChange('month');
    this.getDivisionList();
    this.getVoucherList(0);
    this.getVoucherTypeList();
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

      case 'previoustoday':
        const previousDay = new Date(this.currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousDay, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousDay, "yyyy-MM-dd"));
        break;

      case 'previousweek':
        const previousWeekStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay() - 7);
        const previousWeekEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - this.currentDate.getDay() - 1);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousWeekStartDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousWeekEndDate, "yyyy-MM-dd"));
        break;

      case 'previousmonth':
        const previousMonthStartDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        const previousMonthEndDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousMonthStartDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousMonthEndDate, "yyyy-MM-dd"));
        break;

      case 'previousyear':
        const previousYear = this.currentDate.getFullYear() - 1;
        const previousYearStartDate = new Date(previousYear, 3, 1);
        const previousYearEndDate = new Date(previousYear + 1, 2, 31);
        this.reportFilter.controls.FromDate.setValue(this.datePipe.transform(previousYearStartDate, "yyyy-MM-dd"));
        this.reportFilter.controls.ToDate.setValue(this.datePipe.transform(previousYearEndDate, "yyyy-MM-dd"));
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
      BranchId: [0],
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      Amount: [''],
      Type: [0],
      InvoiceNo: [ ''],
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
    this.reportFilter.controls.OfficeId.setValue(0);
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
      if (this.officeList.length == 1) {
        const ID =
          this.reportFilter.controls.OfficeId.setValue(this.officeList[0].ID);
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


  selectedCustomerBranch(event: any) {
    let service = `${this.globals.APIURL}/ReceiptVoucher/GetReceiptVoucherDropDownList`
    this.dataService.post(service, { CustomerId: event }).subscribe((result: any) => {
      this.branchList = [];
      this.branchList = result.data.Table3;   
      if (result.data.Table3.length > 0) {
        this.reportFilter.controls['BranchId'].setValue(0);
        if (this.branchList.length == 1) {
          const CustomerBranchID = this.branchList[0].CustomerBranchID;
          this.reportFilter.controls['BranchId'].setValue(CustomerBranchID);
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
      this.reportForExcelList = [];
      if (result['data'].Table.length > 0) {
        this.reportList = result['data'].Table;
        this.setPage(1)
      } else {
        this.pager = {};
        this.pagedItems = [];
      }
    }), error => {
      console.error(error);
    };
  }
 

//List Based on Income
  getVoucherTypeList() {
   this.commonDataService.getVoucherTypeList().subscribe(data => {
      this.TypeList = data["data"].Table;
      this.TypeList = this.TypeList.filter(x => x.seqName == "INCOME" );
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) return;

    this.pager = this.ps.getPager(this.reportList.length, page,12);
    this.pagedItems = this.reportList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
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
      InvoiceNo: '',
      InvoiceType: 0
    });
    this.bankList = [];
    this.officeList = [];
    this.reportFilter.controls.Peroid.setValue('month');
    this.getSalesVoucherReportList();
  }

  clickTransactionNumber(RedirectUrl: string) {
    
    let url: string;

    url = RedirectUrl;
       
    if (url) {
        window.open(url, '_blank');
    }
  }

  async downloadAsExcel() {
    if (this.pagedItems.length === 0) {
      Swal.fire('No record found');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add title and subtitle rows
    const titleRow = worksheet.addRow(['', '', '',  'NAVIO SHIPPING PRIVATE LIMITED', '']);
    titleRow.getCell(4).font = { size: 15, bold: true };
    titleRow.getCell(4).alignment = { horizontal: 'center' };

    // Calculate the length of the title string
    const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;

    // Iterate through each column to adjust the width based on the title length
    worksheet.columns.forEach((column) => {
      if (column.number === 4) {
        column.width = titleLength + 2;
      }
    });

    // Merge cells for the title
    worksheet.mergeCells(`D${titleRow.number}:E${titleRow.number}`);

    // Add subtitle row
    const subtitleRow = worksheet.addRow(['', '', '',  'Sales Voucher', '']);
    subtitleRow.getCell(4).font = { size: 14 };
    subtitleRow.getCell(4).alignment = { horizontal: 'center' };

    // Merge cells for the subtitle
    worksheet.mergeCells(`D${subtitleRow.number}:E${subtitleRow.number}`);

    // Add "FROM Date" and "TO Date" to the worksheet
    const dateRow = worksheet.addRow(['', '', '', `FROM ${this.datePipe.transform(this.startDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))} - TO ${this.datePipe.transform(this.endDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`]);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(4).numFmt = this.commonDataService.convertToLowerCaseDay(this.entityDateFormat);
    dateRow.getCell(4).numFmt =  this.commonDataService.convertToLowerCaseDay(this.entityDateFormat);

    // Merge cells for "FROM Date" and "TO Date"
    worksheet.mergeCells(`D${dateRow.number}:E${dateRow.number}`);


    // Define header row and style it with yellow background, bold, and centered text
    const keysToRemove = ['Symbol', 'BLTpes','RedirectUrl'];

    const header = Object.keys(this.pagedItems[0])
        .filter(key => !keysToRemove.includes(key));
    const headerRow = worksheet.addRow(header);


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

    // Add data rows with concatenated symbol and amount
      this.reportList.forEach((data) => {

      //To Remove Time from date field data
      const date = data.Date
      // const formattedDate = date.split('T')[0];
      // data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      const formattedDate = date ? date.split('T')[0] : null;
      if(formattedDate != date){
        data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      }
      else{
        data.Date =  formattedDate
      }
      const defalutvalue = 0;
      // Merge the symbol and amount into a single string with fixed decimal places
      const mergedICYAmount = `${data['Invoice Amount (ICY)']  !== null ? parseFloat(data['Invoice Amount (ICY)'] ).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const mergedCCYAmount = `${data['Invoice Amount (CCY)'] !== null  ? parseFloat(data['Invoice Amount (CCY)']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const invoicetax = `${data['Total Tax'] !== null ? parseFloat(data['Total Tax']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;


      // Filter out properties you don't want to include in the Excel sheet
      
    
      const keysToRemove = ['Symbol', 'BLTpes','RedirectUrl'];

      const filteredData = Object.keys(data)
          .filter(key => !keysToRemove.includes(key))
          .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
          }, {});

      const  defalutJobValue = 'NA'
      // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
      filteredData['Invoice Amount (ICY)'] = mergedICYAmount;
      filteredData['Invoice Amount (CCY)'] = mergedCCYAmount;
      filteredData['Total Tax'] = invoicetax;
      filteredData['Job #'] = data['Job #'] == null ? defalutJobValue : data['Job #'];
      filteredData['GST #'] = data['GST #'] == null ? defalutJobValue : data['GST #'];
      filteredData['Container'] = data['Container'] == null ? defalutJobValue : data['Container'];
      filteredData['BL #'] = data['BL #'] == null ? defalutJobValue : data['BL #'];
      
      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(filteredData));

          // Set text color for specific columns and align them
          const columnsToColorRight = ['Invoice', 'Customer Name', 'Invoice Amount (ICY)', 'Invoice Amount (CCY)','Total Tax'];
          const columnsToAlignLeft =  ['Invoice', 'Customer Name',]; 
          const columnsToAlignRight = [ 'Invoice Amount (ICY)', 'Invoice Amount (CCY)','Total Tax'];
    
          columnsToColorRight.forEach(columnName => {
            const columnIndex = Object.keys(filteredData).indexOf(columnName);
            if (columnIndex !== -1) {
              const cell = row.getCell(columnIndex + 1);
              cell.font = { color: { argb: '8B0000' }, bold: true }; // Red color
            }
          });
    
          columnsToAlignLeft.forEach(columnName => {
            const columnIndex = Object.keys(filteredData).indexOf(columnName);
            if (columnIndex !== -1) {
              const cell = row.getCell(columnIndex + 1);
              cell.alignment = { horizontal: 'left' };
            }
          });
    
          columnsToAlignRight.forEach(columnName => {
            const columnIndex = Object.keys(filteredData).indexOf(columnName);
            if (columnIndex !== -1) {
              const cell = row.getCell(columnIndex + 1);
              cell.alignment = { horizontal: 'right' };
            }
          });
    
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
    worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

    // Write to Excel and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Report-SalesVoucher.xlsx');
  }



  async downloadAsCSV() {
    if (this.pagedItems.length === 0) {
      Swal.fire('No record found');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add title and subtitle rows
    const titleRow = worksheet.addRow(['', '', '', '', '', 'NAVIO SHIPPING PRIVATE LIMITED', '']);
    titleRow.getCell(6).font = { size: 15, bold: true };
    titleRow.getCell(6).alignment = { horizontal: 'center' };

    // Calculate the length of the title string
    const titleLength = 'NAVIO SHIPPING PRIVATE LIMITED'.length;

    // Iterate through each column to adjust the width based on the title length
    worksheet.columns.forEach((column) => {
      if (column.number === 6) {
        column.width = titleLength + 2;
      }
    });

    // Merge cells for the title
    worksheet.mergeCells(`F${titleRow.number}:G${titleRow.number}`);

    // Add subtitle row
    const subtitleRow = worksheet.addRow(['', '', '', '', '', 'Sales Voucher', '']);
    subtitleRow.getCell(6).font = { size: 14 };
    subtitleRow.getCell(6).alignment = { horizontal: 'center' };

    // Merge cells for the subtitle
    worksheet.mergeCells(`F${subtitleRow.number}:G${subtitleRow.number}`);

    // Add "FROM Date" and "TO Date" to the worksheet
    const dateRow = worksheet.addRow(['', '', '', '', '', `FROM ${this.datePipe.transform(this.startDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))} - TO ${this.datePipe.transform(this.startDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))}`]);
    dateRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });
    dateRow.getCell(6).numFmt = this.commonDataService.convertToLowerCaseDay(this.entityDateFormat);
    dateRow.getCell(6).numFmt = this.commonDataService.convertToLowerCaseDay(this.entityDateFormat);

    // Merge cells for "FROM Date" and "TO Date"
    worksheet.mergeCells(`F${dateRow.number}:G${dateRow.number}`);


    // Define header row and style it with yellow background, bold, and centered text
    const keysToRemove = ['Symbol', 'BLTpes','RedirectUrl'];

    const header = Object.keys(this.pagedItems[0])
        .filter(key => !keysToRemove.includes(key));
    
    const headerRow = worksheet.addRow(header);


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

    // Add data rows with concatenated symbol and amount
    this.reportList.forEach((data) => {

      //To Remove Time from date field data
      const date = data.Date
      // const formattedDate = date.split('T')[0];
      // data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      const formattedDate = date ? date.split('T')[0] : null;
      if(formattedDate != date){
        data.Date =  this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat));
      }
      else{
        data.Date =  formattedDate
      }
      const defalutvalue = 0;
      // Merge the symbol and amount into a single string with fixed decimal places
      const mergedICYAmount = `${data['Invoice Amount (ICY)']  !== null ? parseFloat(data['Invoice Amount (ICY)'] ).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const mergedCCYAmount = `${data['Invoice Amount (CCY)'] !== null  ? parseFloat(data['Invoice Amount (CCY)']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;
      const invoicetax = `${data['Total Tax'] !== null ? parseFloat(data['Total Tax']).toFixed(this.entityFraction) : (defalutvalue).toFixed(this.entityFraction)}`;

    
      // Filter out properties you don't want to include in the Excel sheet

      const keysToRemove = ['Symbol', 'BLTpes','RedirectUrl'];

      const filteredData = Object.keys(data)
          .filter(key => !keysToRemove.includes(key))
          .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
          }, {});
      
    
       const  defalutJobValue = 'NA'
        // Update the 'Amount (ICY)' property in the filtered data object with the merged amount
      filteredData['Invoice Amount (ICY)'] = mergedICYAmount;
      filteredData['Invoice Amount (CCY)'] = mergedCCYAmount;
      filteredData['Total Tax'] = invoicetax;
      filteredData['Job #'] = data['Job #'] == null ? defalutJobValue : data['Job #'];
      filteredData['GST #'] = data['GST #'] == null ? defalutJobValue : data['GST #'];
      filteredData['Container'] = data['Container'] == null ? defalutJobValue : data['Container'];
      filteredData['BL #'] = data['BL #'] == null ? defalutJobValue : data['BL #'];


      // Add the filtered data to the worksheet
      const row = worksheet.addRow(Object.values(filteredData));

      // Set text color for specific columns and align them
      const columnsToColorRight = ['Invoice', 'Customer Name', 'Invoice Amount (ICY)', 'Invoice Amount (CCY)','Total Tax'];
      const columnsToAlignLeft =  ['Invoice', 'Customer Name',]; 
      const columnsToAlignRight = [ 'Invoice Amount (ICY)', 'Invoice Amount (CCY)','Total Tax'];

      columnsToColorRight.forEach(columnName => {
        const columnIndex = Object.keys(filteredData).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true }; // Red color
        }
      });

      columnsToAlignLeft.forEach(columnName => {
        const columnIndex = Object.keys(filteredData).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.alignment = { horizontal: 'left' };
        }
      });

      columnsToAlignRight.forEach(columnName => {
        const columnIndex = Object.keys(filteredData).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.alignment = { horizontal: 'right' };
        }
      });

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
    worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + header.length - 1)}${footerRow.number}`);

    // Write to Excel and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Report-SalesVoucher.xlsx');

  }


}


