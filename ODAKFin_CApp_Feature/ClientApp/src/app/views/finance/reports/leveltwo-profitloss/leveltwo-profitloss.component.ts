import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
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
  selector: 'app-leveltwo-profitloss',
  templateUrl: './leveltwo-profitloss.component.html',
  styleUrls: ['./leveltwo-profitloss.component.css']
})
export class LeveltwoProfitlossComponent implements OnInit {

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
  fromMaxDate = this.currentDate;
  data: any[];
  TemplateUploadURL = this.globals.TemplateUploadURL;
  totalDebitAmount: any;
  totalCreditAmount: any;
  totalAmount: any;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  entityThousands = Number(this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat'));
  TypeList: any;
  pagesort: any = new GridSort().sort;
  transactionSearchTerm: any;
  filteredData: any;
  selectedDivision: string;
  selectedOffice: string;

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

  selectedOption: string;
  startDate = '';
  endDate = '';

  @ViewChild('table') table: ElementRef;
  divisionId: any;

  constructor(public ps: PaginationService, private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe, private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportDashboardService,
    private commonDataService: CommonService,) { }

  ngOnInit(): void {
    this.getDivisionList();
    this.getOfficeList();
    this.getDivisionAndOfficeList();
    this.getDropDownType();
    //this.createBalanceFilterForm();

    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.fetchData(this.id);
      // this.setPage(1);
    });
  }
  Cancel() {
    this.router.navigate(['/views/reports/profit-loss', {}])
  }


  clickTransactionNumber(id: number, transType: string, Trans_Number: string, RedirectUrl: string) {
    // Check if transType or Trans_Number is empty and return immediately if either is
    if (!transType || !Trans_Number) {
      console.warn('Transaction type or Transaction number is empty. Staying in the same place.');
      return;
    }

    let url: string;

    // Use switch case on transType alone, as switch (transType && Trans_Number) does not work
    switch (transType) {
      case 'Receipt Voucher':
        url = this.router.serializeUrl(
          this.router.createUrlTree(['/views/transactions/receipt/receipt-details', { id: id }])
        );
        break;

      case 'Payment Voucher':
        url = this.router.serializeUrl(
          this.router.createUrlTree(['/views/transactions/payment/payment-details', { voucherId: id }])
        );
        break;

      case 'Journal Voucher':
        url = this.router.serializeUrl(
          this.router.createUrlTree(['/views/transactions/journal/journal-details', { id: id, isUpdate: true }])
        );
        break;

      case 'Contra Voucher':
        url = this.router.serializeUrl(
          this.router.createUrlTree(['/views/contra-info/contra-info-view', { contraId: id }])
        );
        break;

      case 'Adjustment Voucher':
      url = this.router.serializeUrl(
        this.router.createUrlTree(['/views/Adjustment-info/Adjustment-Voucher-info', { id: id, isUpdate: true }])
      );
      break;
        
      case 'Voucher Reversal':
      url = this.router.serializeUrl(
        this.router.createUrlTree(['/views/voucher-info/voucher-reversals-info', { id: id, isUpdate: true }])
      );
      break;

      case 'Provision Final - FI':
      url = this.router.serializeUrl(
        this.router.createUrlTree(['/views/provision/provision-detail', { ProvisionId: id}])
      );
      break;

      // case 'Purchase Voucher':
      //   url = this.router.serializeUrl(
      //     this.router.createUrlTree(['/views/purchase-info/purchase-info-view', { id: id, isUpdate: true, isCopy: false }])
      //   );
      //   break;

      // case 'Vendor Credit':
      //   url = this.router.serializeUrl(
      //     this.router.createUrlTree(['/views/vendor-info-notes/vendor-info-view', { id: id, isUpdate: true }])
      //   );
      //   break;

      case 'Opening Balance':
        Swal.fire('Cannot Open. This Item Belongs To Opening Balance');
        return; // Exit the function to prevent opening a new tab 
      default:

        if (transType.includes('FI – Purchase Inv')) {
          url = this.router.serializeUrl(
            this.router.createUrlTree(['/views/purchase-admin-info/purchase-invoice-info', { id: id, isUpdate: true }])
          );
          break;
        }
        
        else if (transType.includes('LA') || transType.includes('FF')) {
            url = RedirectUrl 
            break;
          }

        console.error('Unhandled Trans_Type:', transType);
        return; // Exit the function to prevent opening a new tab
    }

    // Open the URL in a new tab if url is defined
    if (url) {
      window.open(url, '_blank');
    }
  }



  onDateChange(event: any): void {
    this.onOptionChange(event)
    this.BasedOnDate(this.id);
  }


  sort(property) {
    this.pagesort(property, this.dataList);
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
  
  getDivisionAndOfficeList() {
    const divisionService = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`;
    const officeService = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;

    // Fetch division list
    this.dataService.post(divisionService, {}).subscribe((divisionResult: any) => {
        this.divisionList = [];
        if (divisionResult.data.Table.length > 0) {
            this.divisionList = divisionResult.data.Table.filter(x => x.Active === true);
        }

        // Now fetch office list
        this.dataService.post(officeService, {}).subscribe((officeResult: any) => {
            this.officeList = [];
            if (officeResult.message === 'Success' && officeResult.data.Office.length > 0) {
                this.officeList = officeResult.data.Office.filter(x => x.Active === true);
            }

            // Check if both lists have items before calling fetchData
            if (this.divisionList.length > 0 && this.officeList.length > 0) {
                this.fetchData(this.id);
            } else {
                console.warn('Division or Office list is empty.');
            }
        }, error => {
            console.error('Error fetching office list:', error);
        });
    }, error => {
        console.error('Error fetching division list:', error);
    });
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

  getDropDownType() {
    this.commonDataService.getTypeDropdown({}).subscribe((result: any) => {
      if (result.message == 'Success') {
        this.TypeList = [];
        if (result["data"].Table.length > 0) {
          this.TypeList = result.data.Table;
        }
      }
    }), error => {
      console.error(error);
    }
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
     
  }
  
  fetchData(id){

   
      const fromDate = this.route.snapshot.paramMap.get('FromDate');
      const toDate = this.route.snapshot.paramMap.get('ToDate');
      const officeId = this.route.snapshot.paramMap.get('OfficeId');
      const divisionId = this.route.snapshot.paramMap.get('DivisionId');
      const peroid = this.route.snapshot.paramMap.get('Peroid');
  
      this.startDate = fromDate
      this.endDate = toDate
  
      const selectedDivision = this.divisionList.find(division => division.ID == divisionId);
      this.selectedDivision = selectedDivision ? selectedDivision.DivisionName: '';
      const selectedOffice = this.officeList.find(Office => Office.OfficeId == officeId);
      this.selectedOffice = selectedOffice ? selectedOffice.OfficeName : '';
      const OfficeName =  this.selectedOffice.toUpperCase();
      const divisionName = this.selectedDivision.toUpperCase();
      
      this.filterForm = this.fb.group({
        AccountId:id,
        FromDate: [fromDate],
        ToDate: [toDate],
        OfficeId: [officeId],
        DivisionId: [divisionId],
        DivisionName:[divisionName],
        OfficeName:[OfficeName],
        Type: [''],
        Transaction: [''],
        Peroid: [peroid]
        
      });
      this.reportService.GetProfitLossById(this.filterForm.value).subscribe(response => {
        if (response.data && Array.isArray(response.data.Table) && response.data.Table.length > 0) {
          this.dataList = response.data.Table;
          this.setPage(1);
          // Calculate total debit amount
          this.totalDebitAmount = this.dataList.reduce((sum, item) => sum + (parseFloat(item.Debit) || 0), 0);
  
          // Calculate total credit amount
          this.totalCreditAmount = this.dataList.reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0);
  
  
          // Calculate the difference between total credit and debit
          this.totalAmount = Math.abs(this.totalDebitAmount - this.totalCreditAmount);
        } else {
          this.totalDebitAmount = 0;
          this.totalCreditAmount = 0;
          this.totalAmount = 0;
          this.pager = {};
          this.dataList = [];
          // console.error('Error: Invalid response format');
        }
      }, err => {
        console.error('Error:', err);
      });
    }
  
  createBalanceFilterForm() {
    this.filterForm = this.fb.group({
      AccountId: [this.id],
      FromDate: [this.startDate],
      ToDate: [this.endDate],
      OfficeId: [''],
      DivisionId: [''],
      Type: [''],
      Transaction: [''],
      period: ['']
    })
    
    this.startDate = this.filterForm.controls.FromDate.value;
    this.endDate = this.filterForm.controls.ToDate.value;
    this.trialbalancelist()
    
  }

  trialbalancelist(){

    this.reportService.GetProfitLossById(this.filterForm.value).subscribe(response => {
      if (response.data && Array.isArray(response.data.Table) && response.data.Table.length > 0) {
        this.dataList = response.data.Table;
        this.setPage(1);
        // Calculate total debit amount
        this.totalDebitAmount = this.dataList.reduce((sum, item) => sum + (parseFloat(item.Debit) || 0), 0);

        // Calculate total credit amount
        this.totalCreditAmount = this.dataList.reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0);


        // Calculate the difference between total credit and debit
        this.totalAmount = Math.abs(this.totalDebitAmount - this.totalCreditAmount);



      } else {
        this.totalDebitAmount = 0;
        this.totalCreditAmount = 0;
        this.totalAmount = 0;
        this.pager = {};
        this.dataList = [];
        // console.error('Error: Invalid response format');
      }
    }, err => {
      console.error('Error:', err);
    });
  }
  
  BasedOnDate(id: number) {

    
   
    this.startDate = this.filterForm.controls.FromDate.value;
    this.endDate = this.filterForm.controls.ToDate.value;
   

    if (this.startDate && this.endDate) {
        // this.applyFilter('FromDate', this.startDate, id), this.applyFilter('ToDate', this.endDate, id);
        this.applyFilter('DateRange', { FromDate: this.startDate, ToDate: this.endDate }, id);
    } else {
        console.warn('Start date or end date is Invalid.');
    }
  }
  
  onDivisionChange(divisionId: any, id: number) {
    this.applyFilter('DivisionId', divisionId, id);
  }

  onOfficeChange(officeId: any, id: number) {
    this.applyFilter('OfficeId', officeId, id);
  }

  onTransactionTypeChange(type: any, id: number): void {
    this.applyFilter('Type', type, id);
  }
  
  OnVoucher(Transaction: any, id: number): void {
    this.applyFilter('Transaction', Transaction, id);
  }
  


  applyFilter(filterType: string, value: any, id: number): void {
    let payload: any = {
      "AccountId": id,
      "FromDate": this.startDate,
      "ToDate": this.endDate,
      "DivisionId": this.divisionId,
      "OfficeId": "",
      "Type": "",
      "Transaction": ""
    };

    switch (filterType) {
      case 'DateRange':
        payload.FromDate = value.FromDate;
        payload.ToDate = value.ToDate;
        
        break;
    case 'ToDate':
        payload.ToDate = value;
        break;
      case 'DivisionId':
        payload.DivisionId = value;
        break;
      case 'OfficeId':
        payload.OfficeId = value;
        break;
      case 'Type':
        payload.Type = value;
        break;
      case 'Transaction':
        payload.Transaction = value;
        break;
      default:
        console.error('Invalid filter type');
        return;
    }

    this.reportService.GetProfitLossById(payload).subscribe(response => {
      this.dataList = [];
      console.log('Response Data:', response);

      if (response.data.Table && response.data.Table.length > 0) {
        this.dataList = response.data.Table;
        this.setPage(1);
        // Calculate total debit amount
        this.totalDebitAmount = this.dataList.reduce((sum, item) => sum + (parseFloat(item.Debit) || 0), 0);

        // Calculate total credit amount
        this.totalCreditAmount = this.dataList.reduce((sum, item) => sum + (parseFloat(item.Credit) || 0), 0);


        // Calculate the difference between total credit and debit
        this.totalAmount = Math.abs(this.totalDebitAmount - this.totalCreditAmount);



      } else {
        this.totalDebitAmount = 0;
        this.totalCreditAmount = 0;
        this.totalAmount = 0;
        this.pager = {};
        this.dataList = [];
        // console.error('Error: Invalid response format');
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


  async downloadExcel() {
    if (!this.dataList || this.dataList.length === 0) {
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
    subtitleRow.getCell(3).font = { size: 14, bold: true };
    subtitleRow.getCell(3).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`C${subtitleRow.number}:D${subtitleRow.number}`);
  
    const subtitleRow1 = worksheet.addRow(['', '', 'Accounts Receivable', '', '', '']);
    subtitleRow1.getCell(3).font = { size: 13, bold: true };
    subtitleRow1.getCell(3).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`C${subtitleRow1.number}:D${subtitleRow1.number}`);
  
    const currentDate = new Date();
    const subtitleRow2 = worksheet.addRow(['', '', `From ${this.datePipe.transform(this.startDate, 'dd-MM-yyyy')} To ${this.datePipe.transform(this.endDate, 'dd-MM-yyyy')}`, '', '','' ]);
    subtitleRow2.getCell(3).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`C${subtitleRow2.number}:D${subtitleRow2.number}`);
  
    // Define header row
    const headers = ['Trans_Date', 'Trans_Account_Name', 'Trans_Details', 'Trans_Type', 'Transaction', 'Trans_Ref_Details', 'Amount'];
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
    this.dataList.forEach(group => {
      const date = group.Trans_Date;
      const formattedDate = date ? date.split('T')[0] : null;
      group.Trans_Date = formattedDate != date
        ? this.datePipe.transform(formattedDate, this.commonDataService.convertToLowerCaseDay(this.entityDateFormat))
        : formattedDate;
  
      const rowData = [
        group.Trans_Date,
        group.Trans_Account_Name,
        group.Trans_Details,
        group.Trans_Type,
        group.Trans_Number,
        group.Trans_Ref_Details,
        // group.Debit.toFixed(this.entityFraction),
        // group.Credit.toFixed(this.entityFraction),
        group.Amount.toFixed(this.entityFraction)
      ];
  
      const row = worksheet.addRow(rowData);
  
      const columnsToColor = ['Trans_Number', 'Trans_Details', 'Debit', 'Credit', 'Amount'];
      const columnsToLeft = ['Trans_Number', 'Trans_Details'];
      const columnsToRight = ['Debit', 'Credit', 'Amount'];
  
      columnsToColor.forEach(columnName => {
        const columnIndex = Object.keys(group).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.font = { color: { argb: '8B0000' }, bold: true };
        }
      });
  
      columnsToLeft.forEach(columnName => {
        const columnIndex = Object.keys(group).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.alignment = { horizontal: 'left' };
        }
      });
  
      columnsToRight.forEach(columnName => {
        const columnIndex = Object.keys(group).indexOf(columnName);
        if (columnIndex !== -1) {
          const cell = row.getCell(columnIndex + 1);
          cell.alignment = { horizontal: 'right' };
        }
      });
    });
  
    // Add Grand Total row
    const totalRow = worksheet.addRow([
      'Grand Total:',
      '',
      '',
      '',
      '',
      '',
      // this.totalDebitAmount.toFixed(this.entityFraction),
      // this.totalCreditAmount.toFixed(this.entityFraction),
      this.totalAmount.toFixed(this.entityFraction)
    ]);
  
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'right' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF99' },
      };
    });
  
    worksheet.getRow(totalRow.number).getCell(1).alignment = { horizontal: 'left' };
  
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
  
    //Style the footer row with yellow background, bold, and centered text
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
  
    //Merge footer cells if needed
    worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + headers.length - 1)}${footerRow.number}`);
  
    // Write to Excel and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Report-ProfitandLoss_Account Transactions.xlsx');
  }
  

}




