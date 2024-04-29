import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import { PaymentVoucherService } from 'src/app/services/payment-voucher.service';
import Swal from 'sweetalert2';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import { PaginationService } from 'src/app/pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCodeService } from 'src/app/services/auto-code.service';

@Component({
  selector: 'app-vendor-credit-notes-info',
  templateUrl: './vendor-credit-notes-info.component.html',
  styleUrls: ['./vendor-credit-notes-info.component.css'],
  providers: [DatePipe]
})
export class VendorCreditNotesInfoComponent implements OnInit {


  ModifiedOn: string = '';
  ModifiedBy: string = '';
  CreatedOn: string = '';
  CreatedBy: string = '';
  isUpdate: boolean = false;
  isUpdateMode: boolean = false;
  isUpdateMode1: boolean = false;
  FileList: any = [];
  vendorCreateForm: FormGroup;
  divisionList: any = [];
  officeList: any = [];
  accountName: any = [];
  debitCreditList: any = [];
  currencyList: any = [];
  vendorCreditId: number = 0;
  vendorsList: any = [];
  private ngUnsubscribe = new Subject<void>();
  vendorBranch: any = [];
  officeCityId: any;
  GSTCategoryList: any = [];
  taxList: any = [];
  entityCurrencyID: any;
  isEditMode: boolean = false;
  vendorTableList: any = [];
  editSelectedIdex: any;
  pager: any = {};
  pagedItems: any = [];
  payload: any;
  maxDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  autoGenerateCodeList: any = [];
  isFinalRecord: boolean = false;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityCurrencyName: any;
  newOne: any;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private globals: Globals,
    private datePipe: DatePipe,
    private VendorService: VendorService,
    public ps: PaginationService,
    private router: Router,
    private route: ActivatedRoute,
    private autoCodeService: AutoCodeService,
    public commonDataService: CommonService,
    private paymentService: PaymentVoucherService,
    private chartAccountService: ChartaccountService
  ) { }

  async ngOnInit(): Promise<void> {
  // Concurrently execute independent operations
  const independentOperations = Promise.all([
    this.createVendorCreditForm(),
    this.getDivisionList(),
    this.ChartAccountList(),
    this.getCurrency(),
    this.getVendorList(),
    this.GetGSTCategory(),
    this.getTaxGroup(),
    this.getNumberRange(),
  ]);
  // Wait for independent operations to complete
  await independentOperations;

    this.route.params.subscribe(param => {
      if (param.id) {
        this.vendorCreditId = param.id;
        this.isUpdate = true;
        this.isUpdateMode = true;
        this.isUpdateMode1 = false;
        this.getVendorInfo();
        this.vendorCreateForm.disable();
      }
    });
  }

  updateValues(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 513,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.vendorCreateForm.enable();
            this.isUpdateMode = false;
            this.isUpdateMode1 = true;
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  deleteValues(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 513,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.OnClickDeleteValue();
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  deleteValuesMain(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 513,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.saveInfo(0,true);
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  deleteValuesAttach(index){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 513,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.OnClickDeleteValueFile(index);
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {
        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });
  }

  createVendorCreditForm() {
    this.vendorCreateForm = this.fb.group({
      VendorCreditNoteId: [this.vendorCreditId],
      DivisionId: [0],
      OfficeId: [0],
      OfficeGST: [''],
      StatusId: [4],
      VCNVoucherNumber: [''],
      VCNVoucherDate: [''],
      VendorId: [0],
      VendorBranchId: [0],
      VendorType: [''],
      VendorInvoice: [''],
      VCNNote: [''],
      VendorCreditNoteDate: [''],
      VendorGST: [''],
      VendorGSTCategory: [''],
      SubTotal: [''],
      IGST: [0],
      CGST: [0],
      SGST: [0],
      InvoiceAmount: [0],
      InvoiceCurrency: [0],
      CreatedBy: localStorage.getItem('UserID'),

      // Table
      Id: [0],
      AccountId: [0],
      Rate: [''],
      Qty: [''],
      Amount: [''],
      CurrencyId: [1],
      ExRate: [''],
      LocalAmount: [''],
      IsTaxable: [''],
      GSTGroupId: [''],
      IsDelete: [0]
    });

    let entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
    this.entityCurrencyName = entityInfo['Currency'];
    this.vendorCreateForm.controls['InvoiceCurrency'].setValue(this.entityCurrencyName);
  }

  getVendorInfo() {
    var service = `${this.globals.APIURL}/VendorCreditNotes/GetVendorCreditNotesById`; var payload = { Id: this.vendorCreditId }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.vendorTableList = [];
      this.FileList = [];
      this.pagedItems = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        let info = result.data.Table[0];

        this.CreatedBy = info.CreatedByName;
        this.CreatedOn = info.CreatedDate;
        this.ModifiedOn = info.UpdatedDate;
        this.ModifiedBy = info.UpdatedByName;
        if (info.StatusId == 2) this.isFinalRecord = true;

        this.vendorCreateForm.patchValue({
          VendorCreditNoteId: this.vendorCreditId,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          OfficeGST: info.OfficeGST,
          StatusId: info.StatusId,
          VCNVoucherNumber: info.VCNVoucherNumber,
          VCNVoucherDate: this.datePipe.transform(info.VCNVoucherDate, 'y-MM-dd'),
          VendorId: info.VendorId,
          VendorBranchId: info.VendorBranchId,
          VendorType: info.VendorType,
          VendorInvoice: info.VendorInvoice,
          VCNNote: info.VCNNote,
          VendorCreditNoteDate: this.datePipe.transform(info.VendorCreditNoteDate, 'y-MM-dd'),
          VendorGST: info.VendorGST,
          VendorGSTCategory: info.VendorGSTCategory,
          SubTotal: info.SubTotal,
          IsDelete: info.IsDelete ? info.IsDelete : 0,
          IGST: info.IGST,
          CGST: info.CGST,
          SGST: info.SGST,
          InvoiceAmount: info.InvoiceAmount,
          InvoiceCurrency: info.InvoiceCurrency,
          CreatedBy: localStorage.getItem('UserID')
        });
        this.getOfficeList(info.DivisionId);
        this.getVendorBranchList(info.VendorId, false, info.VendorBranchId);

        if (result.data.Table1.length > 0) {
          this.vendorTableList = result.data.Table1;
          this.setPage(1);
          if (result.data.Table2.length > 0) {
            this.FileList = result.data.Table2;
          }
        };
      }
    }, error => { });
  }

  fileSelected(event) {
    if (event.target.files.length > 0 && this.FileList.length < 5) {
      this.FileList.push({
        Id: 0,
        VendorCreditNoteId: this.vendorCreditId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name
      })
    }
    else {
      Swal.fire('A maximum of five files must be allowed.')
    }
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

  getOfficeList(id: number) {
    this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
      this.officeList = [];
      if (result['data'].Table.length > 0) {
        this.officeList = result['data'].Table;
      }
    });
  }

  ChartAccountList() {
    this.commonDataService.getChartaccountsFilter().subscribe(async data => {
      this.accountName = [];
      if (data["data"].length > 0) {
        this.accountName = data["data"];
      }
    });
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.currencyList = [];
      if (result.length > 0) {
        this.currencyList = result;
        let entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
        this.entityCurrencyName = entityInfo['Currency'];
        let info = this.currencyList.find(x => x.Currency == this.entityCurrencyName)
        this.vendorCreateForm.controls['InvoiceCurrency'].setValue(info.ID);
      }
    }, error => { });
  }

  getVendorList() {
    return new Promise((resolve, reject) => {
      this.paymentService.getVendorList({}).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
        if (result.message == "Success") {
          if (result["data"].Table.length) {
            this.vendorsList = result["data"].Table.filter(x => x.OnboradName == 'CONFIRMED' && x.Status == 'Active');
            resolve(true);
          }
        }
      }, (error: HttpErrorResponse) => {
        reject();
      });
    })
  }

  getVendorBranchList(event: any, isSelectBranch = false , branchId?: any) {
    this.vendorBranch = [];
    this.vendorBranch = this.vendorsList.filter(x => x.VendorID == event);

    if(this.vendorBranch.length === 1 && isSelectBranch){
      const singleBranch =  this.vendorBranch[0];
      this.vendorCreateForm.controls['VendorBranchId'].setValue(singleBranch.VendorBranchID);
      this.getVendorDetailsInfo(singleBranch.VendorBranchID)
    }

    // if(branchId){
    //   this.vendorCreateForm.controls['VendorBranchId'].setValue(branchId);
    // }

    // this.branches = this.vendorBranch.length
    // this.newOne = this.vendorBranch[0].BranchCode;
}

  getOfficeGST(event) {
    let officeInfo = this.officeList.find(x => x.ID == event);
    if (officeInfo) this.vendorCreateForm.controls['OfficeGST'].setValue(officeInfo.GSTNo);
  }

  getVendorDetailsInfo(event) {
    let vendorInfo = this.vendorBranch.find(x => x.VendorBranchID == event);
    if (vendorInfo) {
      this.VendorService.getVendorId({ VendorID: vendorInfo.VendorID, VendorBranchID: event }).pipe().subscribe(response => {
        if (response['data'].Table1.length > 0) { this.officeCityId = response['data'].Table1[0].City; }
        if (response['data'].Table4.length > 0) {
          this.vendorCreateForm.controls['VendorGSTCategory'].setValue(response['data'].Table4[0].GSTCategory ? response['data'].Table4[0].GSTCategory : '');
          this.vendorCreateForm.controls['VendorGST'].setValue(response['data'].Table4[0].GSTNumber ? response['data'].Table4[0].GSTNumber : '');

          if (response['data'].Table4[0].GSTCategory) {
            let info = this.GSTCategoryList.find(x => x.Id == response['data'].Table4[0].GSTCategory);
            if (info.CategoryName == 'Overseas') { this.vendorCreateForm.controls['VendorType'].setValue('Overseas'); }
            else { this.vendorCreateForm.controls['VendorType'].setValue('Local'); }
          }
        }
      });
    }
  }

  GetGSTCategory() {
    var service = `${this.globals.APIURL}/Customer/GetGSTCategory`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.GSTCategoryList = [];
      if (result.data.Table.length > 0) {
        this.GSTCategoryList = result.data.Table;
      }
    }, error => { });
  }

  getTaxGroup() {
    let service = `${this.globals.APIURL}/TaxGroup/GetTaxGroupList`
    this.dataService.post(service, { Taxgroup: '', Rate: null, Status: '1' }).subscribe((result: any) => {
      this.taxList = [];
      if (result.message = 'Success' && result.data.Table.length > 0) {
        this.taxList = result.data.Table.filter(x => x.Active == "Active");
      }
    }, error => { });
  }

  rateQuantityChangeEvent(event) {
    this.vendorCreateForm.controls['LocalAmount'].setValue((this.vendorCreateForm.value.Rate ? this.vendorCreateForm.value.Rate : 1)
      * (this.vendorCreateForm.value.Qty ? this.vendorCreateForm.value.Qty : 1) * (this.vendorCreateForm.value.ExRate ? this.vendorCreateForm.value.ExRate : 1));
  }

  changeCurrencyEvent(currencyId: any) {
    let entityInfo = this.commonDataService.getLocalStorageEntityConfigurable();
    let info = this.currencyList.find(x => x.Currency == entityInfo['Currency']);
    this.entityCurrencyID = info.ID;
    if (this.entityCurrencyID == currencyId) {
      this.vendorCreateForm.controls['ExRate'].setValue(1);
      this.vendorCreateForm.controls['LocalAmount'].setValue(1 * this.vendorCreateForm.value.Rate * this.vendorCreateForm.value.Qty);
      this.vendorCreateForm.get('ExRate').disable();
    }
    else {
      this.vendorCreateForm.get('ExRate').enable();
    }
  }

  exchangeRateChangeEvent(event) {
    this.vendorCreateForm.controls['LocalAmount'].setValue(event * this.vendorCreateForm.value.Rate * this.vendorCreateForm.value.Qty);
  }

  taxableChangeEvent(event) {
    if (event == "false") {
      this.vendorCreateForm.controls['GSTGroupId'].setValue('');
      this.vendorCreateForm.get('GSTGroupId').disable();
    }
    else {
      this.vendorCreateForm.get('GSTGroupId').enable();
    }
  }

  addRow() {
    var validation = "";
    if (this.vendorCreateForm.value.AccountId == "" || this.vendorCreateForm.value.AccountId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Account Name.</span></br>"
    }
    if (this.vendorCreateForm.value.Rate == "" || this.vendorCreateForm.value.Rate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Rate.</span></br>"
    }
    if (this.vendorCreateForm.value.Qty == "" || this.vendorCreateForm.value.Qty == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Qty.</span></br>"
    }
    if (this.vendorCreateForm.value.CurrencyId == "" || this.vendorCreateForm.value.CurrencyId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Currency.</span></br>"
    }
    if (this.vendorCreateForm.value.ExRate == "" || this.vendorCreateForm.value.ExRate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter ExRate.</span></br>"
    }
    if (this.vendorCreateForm.value.LocalAmount == "" || this.vendorCreateForm.value.LocalAmount == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Local Amount.</span></br>"
    }
    if (this.vendorCreateForm.value.IsTaxable == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Select Taxable.</span></br>"
    }
    if (this.vendorCreateForm.value.IsTaxable == "true") {
      if (this.vendorCreateForm.value.GSTGroupId == "" || this.vendorCreateForm.value.GSTGroupId == 0) {
        validation += "<span style='color:red;'>*</span> <span>Please Enter GST Group.</span></br>"
      }
    }
    if (validation != "") { Swal.fire(validation); return false; }
    let info = this.vendorCreateForm.value;
    let account = this.accountName.find(x => x.ChartOfAccountsId == info.AccountId);
    let currency = this.currencyList.find(x => x.ID == info.CurrencyId);

    if (this.isEditMode) {
      let editValue = {
        Id: info.Id,
        VendorCreditNoteId: this.vendorCreditId,
        AccountId: info.AccountId,
        Rate: info.Rate,
        Qty: info.Qty,
        Amount: info.Rate * info.Qty,
        CurrencyId: info.CurrencyId,
        ExRate: info.ExRate ? info.ExRate : 1,
        LocalAmount: info.LocalAmount,
        IsTaxable: info.IsTaxable,
        GSTGroupId: info.GSTGroupId ? info.GSTGroupId : '',
        CurrencyName: currency.Currency,
        AccountName: account.AccountName,
        IGST: 0,
        CGST: 0,
        SGST: 0,
        InvoiceAmount: 0,
        InvoiceCurrency: 0
      }

      this.vendorTableList[this.editSelectedIdex] = editValue;
      this.isEditMode = !this.isEditMode;
      this.resetTable();
      this.setPage(1);
      this.calculateTotalAmount(editValue, 'edit');
      return;
    }

    this.vendorTableList.unshift({
      Id: info.Id,
      VendorCreditNoteId: this.vendorCreditId,
      AccountId: info.AccountId,
      Rate: info.Rate,
      Qty: info.Qty,
      Amount: info.Rate * info.Qty,
      CurrencyId: info.CurrencyId,
      ExRate: info.ExRate ? info.ExRate : 1,
      LocalAmount: info.LocalAmount,
      IsTaxable: info.IsTaxable,
      GSTGroupId: info.GSTGroupId ? info.GSTGroupId : '',
      CurrencyName: currency.Currency,
      AccountName: account.AccountName,
      IGST: 0,
      CGST: 0,
      SGST: 0,
      InvoiceAmount: 0,
      InvoiceCurrency: 0
    });
    this.resetTable();
    this.setPage(1);
    this.calculateTotalAmount(this.vendorTableList[0], 'create');
  }

  resetTable() {
    this.vendorCreateForm.controls['Id'].setValue(0);
    this.vendorCreateForm.controls['AccountId'].setValue(0);
    this.vendorCreateForm.controls['Rate'].setValue('');
    this.vendorCreateForm.controls['Qty'].setValue('');
    this.vendorCreateForm.controls['Amount'].setValue('');
    this.vendorCreateForm.controls['CurrencyId'].setValue(1);
    this.vendorCreateForm.controls['ExRate'].setValue('');
    this.vendorCreateForm.controls['LocalAmount'].setValue('');
    this.vendorCreateForm.controls['IsTaxable'].setValue('');
    this.vendorCreateForm.controls['GSTGroupId'].setValue('');
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) { return; }
    this.pager = this.ps.getPager(this.vendorTableList.length, page);
    this.pagedItems = this.vendorTableList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  calculateTotalAmount(purchaseInfoTableValue?: any, methodType?: any) {
    var subTotalAmount = 0;
    if (this.vendorTableList.length > 0) {
      this.vendorTableList.forEach(element => { subTotalAmount += element.LocalAmount; });
      this.vendorCreateForm.controls['SubTotal'].setValue(subTotalAmount);
    } else { this.vendorCreateForm.controls['SubTotal'].setValue(''); }

    if (purchaseInfoTableValue.IsTaxable) {
      let officeInfo = this.officeList.find(x => x.ID == this.vendorCreateForm.value.OfficeId);
      if (this.officeCityId == officeInfo.StateId ? officeInfo.StateId : 0) {
        let info = subTotalAmount * (purchaseInfoTableValue.GSTGroupId / 100);
        purchaseInfoTableValue.CGST = Math.trunc(info / 2);
        purchaseInfoTableValue.SGST = Math.trunc(info / 2);
        purchaseInfoTableValue.IGST = 0;
      }
      else {
        let info = subTotalAmount * (purchaseInfoTableValue.GSTGroupId / 100);
        purchaseInfoTableValue.CGST = 0;
        purchaseInfoTableValue.SGST = 0;
        purchaseInfoTableValue.IGST = Math.trunc(info / 2);
      }
      this.vendorTableList[methodType == 'create' ? 0 : this.editSelectedIdex] = purchaseInfoTableValue;
    }
    this.editSelectedIdex = null;

    var CGST = 0;
    var SGST = 0;
    var IGST = 0;

    this.vendorTableList.forEach(element => {
      CGST += element.CGST ? element.CGST : 0;
      SGST += element.SGST ? element.SGST : 0;
      IGST += element.IGST ? element.IGST : 0;
    });

    this.vendorCreateForm.controls['CGST'].setValue(CGST);
    this.vendorCreateForm.controls['SGST'].setValue(SGST);
    this.vendorCreateForm.controls['IGST'].setValue(IGST);
    this.vendorCreateForm.controls['InvoiceAmount'].setValue(CGST + SGST + IGST + subTotalAmount);
  }

  OnClickRadio(index) {
    this.editSelectedIdex = index;
  }

  OnClickEditValue() {
    let info = this.vendorTableList[this.editSelectedIdex];
    this.vendorCreateForm.patchValue({
      Id: info.Id,
      VendorCreditNoteId: this.vendorCreditId,
      AccountId: info.AccountId,
      Rate: info.Rate,
      Qty: info.Qty,
      Amount: info.Amount,
      CurrencyId: info.CurrencyId,
      ExRate: info.ExRate,
      LocalAmount: info.LocalAmount,
      IsTaxable: info.IsTaxable,
      GSTGroupId: info.GSTGroupId
    })
    this.isEditMode = !this.isEditMode;
  }

  OnClickDeleteValue() {
    if (this.editSelectedIdex >= 0 && this.editSelectedIdex != null) {
      this.vendorTableList.splice(this.editSelectedIdex, 1);
      this.editSelectedIdex = null;
      this.setPage(1);
      this.calculateTotalAmount();
    }
    else {
      Swal.fire('Please select the Item!!');
    }
  }

  async saveInfo(status, isDelete = false) {
    var validation = "";
    if (this.vendorCreateForm.value.DivisionId == "" || this.vendorCreateForm.value.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (this.vendorCreateForm.value.OfficeId == "" || this.vendorCreateForm.value.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    // if (this.vendorCreateForm.value.VCNVoucherNumber == "" || this.vendorCreateForm.value.VCNVoucherNumber == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please create Purchase VCN Voucher Number#.</span></br>"
    // }
    if (this.vendorCreateForm.value.VCNVoucherDate == "" || this.vendorCreateForm.value.VCNVoucherDate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select VCN Voucher Date.</span></br>"
    }
    if (this.vendorCreateForm.value.VendorId == "" || this.vendorCreateForm.value.VendorId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Vendor.</span></br>"
    }
    if (this.vendorCreateForm.value.VendorBranchId == "" || this.vendorCreateForm.value.VendorBranchId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Vendor Branch.</span></br>"
    }
    if (this.vendorCreateForm.value.VendorInvoice == "" || this.vendorCreateForm.value.VendorInvoice == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Vendor Invoice #.</span></br>"
    }
    if (this.vendorCreateForm.value.VCNNote == "" || this.vendorCreateForm.value.VCNNote == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Vendor credit Note.</span></br>"
    }
    if (this.vendorCreateForm.value.VendorCreditNoteDate == "" || this.vendorCreateForm.value.VendorCreditNoteDate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Vendor Credit Note Date.</span></br>"
    }
    if (this.vendorTableList.length == 0) {
      validation += "<span style='color:red;'>*</span> <span>Attest one record must be create in the Vendor credit Table.</span></br>"
    }
    if(this.FileList.length == 0){
      validation += "<span style='color:red;'>*</span> <span>Please choose a File</span></br>"
    }

    if (validation != "") {
      if(status != 3){
      Swal.fire(validation)
      return false;
      }
    }

     let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit`;
    let deleteMsg = `Do you want to Delete this Details?`;
    
    let combinedText: string;
    if (status === 2) {
      combinedText = finalMsg;
    } else if (status === 1) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else {
      combinedText = closeMsg;
    }
    
        // set Delete flag
          if(isDelete && this.isUpdate){
            this.vendorCreateForm.controls['IsDelete'].setValue(1); 
          }

      //  Its finaled already and cancelled
      if (status == 3 && this.isFinalRecord) {
        this.ViewPage();
        return;
      }


      Swal.fire({
            showCloseButton: true,
            title: '',
            icon: 'question',
            html: combinedText,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: false,
            allowOutsideClick: false
          }).then(async(result) => {
            if (result.isConfirmed) {
      
           // If canceled 
      
              if(status == 3 ){

                this.ViewPage();
                return;
              }
        if(status == 2 && !this.isFinalRecord){
          await this.autoCodeGeneration('VendorCreditNotes');
        }

        await this.createPayload(status);

        let service = `${this.globals.APIURL}/VendorCreditNotes/SaveVendorCreditNotesInfo`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.data.Message, '', 'success');
         
            this.isUpdateMode = true;
            this.isUpdateMode1 = true;
           
            if(status == 1){
               this.vendorCreditId = result.data.Id;
               this.isUpdateMode = true;
               this.isUpdateMode1 = true;
              }
          
              if (this.isUpdate && status && !this.isFinalRecord) {
                this.updateAutoGenerated();
                }
                if(isDelete && this.isUpdate){
                  this.ViewPage();
                }
                        
               if (!this.isUpdate && !this.isFinalRecord) {
               const VendorCreditNoteId = result.data.Id;
                this.editVendorCreditNote(VendorCreditNoteId)
               } 
               }
             if(status == 2){
             this.ViewPage();
                                     
            return;          
          }
        }, error => {
          console.error(error);
        });
      }
    });
  }
  editVendorCreditNote(id: number) {
    this.router.navigate(['/views/vendor-info-notes/vendor-info-view', { id: id, isUpdate: true }]);
  }
  
  ViewPage(){
    this.router.navigate(['/views/vendor-notes/vendor-view']);
  }

  goBack(){
    // If finaled allow to rediret to list page
    if(this.isFinalRecord){
       this.ViewPage();
      return
    }

    // confirm user before redirect to list page
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      html:`Voucher is not yet finalized <br> Do you want to still exit?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
         this.ViewPage();
      }
    })
  }


  createPayload(status) {
    let info = this.vendorCreateForm.value;
    let Table = {
      VendorCreditNoteId: this.vendorCreditId,
      DivisionId: Number(info.DivisionId),
      OfficeId: Number(info.OfficeId),
      OfficeGST: status,
      StatusId: status,
      VCNVoucherNumber: info.VCNVoucherNumber,
      VCNVoucherDate: new Date(info.VCNVoucherDate),
      VendorId: Number(info.VendorId),
      VendorBranchId: Number(info.VendorBranchId),
      VendorType: info.VendorType,
      VendorInvoice: info.VendorInvoice,
      VCNNote: info.VCNNote,
      VendorCreditNoteDate: new Date(info.VendorCreditNoteDate),
      VendorGST: info.VendorGST,
      VendorGSTCategory: info.VendorGSTCategory,
      SubTotal: info.SubTotal,
      IGST: info.IGST,
      CGST: info.CGST,
      SGST: info.SGST,
      IsDelete: info.IsDelete,
      InvoiceAmount: info.InvoiceAmount,
      InvoiceCurrency: info.InvoiceCurrency,
      CreatedBy: Number(info.CreatedBy)
    }
    let purchaseTableList = this.vendorTableList;
    purchaseTableList.forEach(element => {
      delete element.AccountName; delete element.CurrencyName;
    });
    this.payload = {
      "VendorCreditNotes": {
        "Table": [Table],
        "Table 1": purchaseTableList,
        "Table 2": this.FileList
      }
    }
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Vendor Credit Note');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  getNumberRange() {
    let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
    this.dataService.post(service, { Id: 0, ObjectId: 0 }).subscribe((result: any) => {
      if (result.message = "Success") {
        this.autoGenerateCodeList = [];
        if (result.data.Table.length > 0) {
          for (let data of result.data.Table) {
            data.EffectiveDate = this.datePipe.transform(data.EffectiveDate, 'YYYY-MM-dd');
          }
          this.autoGenerateCodeList = result.data.Table;
          // await this.autoCodeGeneration('vendorCredit')
        }
      }
    }, error => {
      console.error(error);
    });
  }

  async autoCodeGeneration(event: any) {
    return new Promise(async (resolve, rejects) => {
    if (this.isUpdate) {
      if (event) {
        let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Vendor Credit Note');
        if (Info.length > 0) {
          let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
          let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          if (code) this.vendorCreateForm.controls['VCNVoucherNumber'].setValue(code.trim().toUpperCase());
          resolve(true);
        }
        else {
          Swal.fire('Please create the auto-generation code for Vendor credit note.')
          resolve(true);
        }
      }
      else {
        this.vendorCreateForm.controls['VCNVoucherNumber'].setValue('');
        resolve(true);
      }
    }
  })
}

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string) {
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (this.vendorCreateForm.value.DivisionId && this.vendorCreateForm.value.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.vendorCreateForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.vendorCreateForm.value.DivisionId);
    }

    for (var i = 0; i < sectionInfo.length; i++) {
      var condition = i == 0 ? sectionInfo[i].sectionA : i == 1 ? sectionInfo[i].sectionB : i == 2 ? sectionInfo[i].sectionC : i == 3 ? sectionInfo[i].sectionD : sectionInfo[i].sectionD;
      switch (condition) {
        case 'Office Code (3 Chars)': i == 0 ? sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 1 ? sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 2 ? sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 3 ? sectionD = officeInfo.OfficeName : ''; break;
        case 'Running Number (3 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (4 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (5 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (6 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (7 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Office Code (4 Chars)': i == 0 ? sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 1 ? sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 2 ? sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 3 ? sectionD = officeInfo.OfficeName : ''; break;
        case 'Division Code (4 Chars)': i == 0 ? sectionA = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 1 ? sectionB = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 2 ? sectionC = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 3 ? sectionD = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : ''; break;
        case 'Division Code (3 Chars)': i == 0 ? sectionA = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 1 ? sectionB = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 2 ? sectionC = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 3 ? sectionD = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : ''; break;
        case 'FY (4 Char e.g. 2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (5 Char e.g. 22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (6 Char e.g. FY2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (7 Char e.g. FY22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POFD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        default: break;
      }
    }
    return { sectionA: sectionA, sectionB: sectionB, sectionC: sectionC, sectionD: sectionD };
  }

  OnClickDeleteValueFile(index: number) {
    this.FileList.splice(index, 1);
  }

}
