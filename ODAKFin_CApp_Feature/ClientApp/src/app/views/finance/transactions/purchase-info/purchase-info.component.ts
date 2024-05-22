import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-info',
  templateUrl: './purchase-info.component.html',
  styleUrls: ['./purchase-info.component.css'],
  providers: [DatePipe]
})
export class PurchaseInfoComponent implements OnInit {

  purchaseCreateForm: FormGroup;
  isUpdateMode: boolean = false;
  divisionList: any = [];
  officeList: any = [];
  statusList: any[];
  vendorList: any[];
  toleranceList: any;
  currencyList: any[];
  accountName: any[];
  PurchaseTableList: any = [];
  editSelectedIdex: any;
  isEditMode: boolean = false;
  pager: any = {};
  pagedItems: any = [];
  purchaseFileList: any = [];
  selectedFile: File = null;
  fileUrl: string;
  purchaseId: any = 0;
  payload: {};
  isUpdate: boolean = false;
  CreatedBy: string = '';
  CreatedOn: string = '';
  ModifiedBy: string = '';
  ModifiedOn: string = '';
  isFinalModeEnable: boolean = false;
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions')); 
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityCurrency = this.commonDataService.getLocalStorageEntityConfigurable('Currency');
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: any = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  autoGenerateCodeList: any[];
  isCopyMode: Boolean = false;
  isShowTolerancePercentage: boolean = true;
  PurchaseDescription: any = '';
  isEditEnabled = true;
  toleranceValue: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private datePipe: DatePipe,
    public ps: PaginationService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private vendorService: VendorService,
    private commonservice: CommonService,
    private commonDataService: CommonService,
    private autoCodeService: AutoCodeService,
    private chartAccountService: ChartaccountService
  ) { }

  ngOnInit(): void {
    this.purchaseForm();
    // this.getNumberRange();
    this.getDivisionList();
    this.getDropDownList();
    this.getVendorList();
    this.ChartAccountList();
    this.getCurrency();
    this.route.params.subscribe(param => {
      if (param.id) {
        if (param.isCopy == "true") { this.isCopyMode = true; }
        else {
          this.isUpdate = true;
          this.isUpdateMode = true;
          this.isEditEnabled = false;
          this.purchaseCreateForm.disable();         
        }
        this.purchaseId = param.id;
        this.getPurchaseInfo();
      }
    });
    // if (!this.isUpdate && !this.isCopyMode) { this.getNumberRange(); }
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 532,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.purchaseCreateForm.enable();
            this.isUpdateMode = false;
            this.onEditView();
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

  purchaseForm() {
    this.purchaseCreateForm = this.fb.group({
      PurchaseOrderId: [0],
      DivisionId: [''],
      OfficeId: [''],
      PurchaseNumber: [''],
      PurchaseDate: [''],
      PurchaseStatusId: [1],
      PurchaseDescription: [''],
      ShortDescription: [''],
      ValidTill: [''],
      VendorId: [0],
      ToleranceTypeId: [0],
      ToleranceId: [''],
      Remarks: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      Status: [0],
      TotalAmount: [0],

      // Table 
      Id: [0],
      AccountId: [0],
      Quantity: [''],
      CurrencyId: [0],
      Currency: [''],
      Rate: [''],
      Amount: [''],
      IsDelete: [0]
    });
  }

  getPurchaseInfo() {
    var service = `${this.globals.APIURL}/PurchaseOrder/GetPurchaseOrderById`;
    this.dataService.post(service, { Id: this.purchaseId }).subscribe(async(result: any) => {
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.purchaseFileList = [];
        this.PurchaseTableList = [];
        let info = result.data.Table[0];
        this.PurchaseDescription = info.PurchaseDescription;
        if (info.Status == 2) this.isFinalModeEnable = true;
        this.CreatedBy = info.CreatedByName;
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat);
        this.ModifiedBy = info.UpdatedByName;
        this.ModifiedOn = this.datePipe.transform(info.UpdatedDate, this.entityDateFormat);
       // const formattedAmount = Number(info.Amount).toFixed(2);
        await this.getOfficeList(info.DivisionId);
        this.purchaseCreateForm.patchValue({
          PurchaseOrderId: info.Id,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          PurchaseNumber: info.PurchaseNumber,
          PurchaseDate: this.datePipe.transform(info.PurchaseDate, 'y-MM-dd'),
          PurchaseStatusId: info.PurchaseStatusId,
          PurchaseDescription: info.PurchaseDescription,
          ShortDescription: info.ShortDescription,
          ValidTill: this.datePipe.transform(info.ValidTill, 'y-MM-dd'),
          VendorId: info.VendorId,
          ToleranceTypeId: info.ToleranceTypeId,
          ToleranceId: info.ToleranceId,
          Remarks: info.Remarks,
          CreatedBy: info.CreatedBy,
          Status: info.Status,
          TotalAmount: info.TotalAmount.toFixed(this.entityFraction),
          IsDelete: info.IsDelete ? info.IsDelete : 0
        });
        // if (this.isCopyMode) this.autoCodeGeneration('Purchase');
        if (result.data.Table2.length > 0)         
          this.purchaseFileList = result.data.Table2;       
        if (result.data.Table1.length > 0) {
          this.PurchaseTableList = result.data.Table1;
            this.PurchaseTableList.forEach(element => { element.Amount = Number(element.Amount).toFixed(this.entityFraction); 
            }); 

          this.setPage(1);
        }

        //  Copy Scenario
        if (this.isCopyMode) {      
          this.purchaseId = 0;
          this.purchaseCreateForm.controls['PurchaseStatusId'].setValue(1);
          this.purchaseCreateForm.controls['PurchaseOrderId'].setValue(0);
          this.purchaseCreateForm.controls['PurchaseNumber'].setValue('');
          this.purchaseFileList.forEach(element => { element.Id = 0; element.PurchaseOrderId = 0; });
          this.PurchaseTableList.forEach(element => { element.Id = 0; element.PurchaseOrderId = 0; });
          this.isCopyMode = false;
          this.isFinalModeEnable = false;
        }
         this.getNumberRange();
      }
    }, error => { });
  }

  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`;
    this.dataService.post(service, { Id: 0, DivisionCode: '', DivisionName: '', Active: 1 }).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        this.divisionList = result.data.Table;
      }
    }, error => { });
  }

  getDropDownList() {
    let service = `${this.globals.APIURL}/PurchaseOrder/GetPurchaseOrderDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      this.toleranceList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.statusList = result.data.Table;
        this.toleranceList = result.data.Table1;
      }
    }, error => {
      console.error(error);
    });
  }

  getVendorList() {
    const payload = {
      ID: 0, VendorBranchID: "", VendorCode: "", VendorName: "", Category: "", BranchCode: "", CityName: "", GSTCategory: "", GSTNumber: "",
      IsActive: 1, VendorStatus: "", OnBoard: "CONFIRMED", IsBranchActive: ""
    }
    this.vendorService.getVendorFilter(payload).subscribe(data => {
      this.vendorList = [];
      if (data["data"].Table.length > 0) {
        this.vendorList = data["data"].Table;
        console.log(this.vendorList, "this.vendorList")
      }
    },
      (error) => {
        console.error(error);
      });
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.currencyList = [];
      if (result.length > 0) {
        this.currencyList = result;
      }
      const entitySelectedCurrency = this.currencyList.find(c => c.Currency === this.entityCurrency);

      if (entitySelectedCurrency) {
        this.purchaseCreateForm.controls.CurrencyId.setValue(entitySelectedCurrency.ID);
      }
    }, error => { });
  }


  ChartAccountList() {
    this.commonDataService.getChartaccountsFilter().subscribe(async data => {
      this.accountName = [];
      if (data["data"].length > 0) {
        this.accountName = data["data"];
      }
    });
  }


  addRow() {
    debugger
    var validation = "";
    if (this.purchaseCreateForm.value.AccountId == "" || this.purchaseCreateForm.value.AccountId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account.</span></br>"
    }
    if (this.purchaseCreateForm.value.Quantity == "" || this.purchaseCreateForm.value.Quantity == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Quantity.</span></br>"
    }
    if (this.purchaseCreateForm.value.CurrencyId == "" || this.purchaseCreateForm.value.CurrencyId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency.</span></br>"
    }
    if (this.purchaseCreateForm.value.Rate == "" || this.purchaseCreateForm.value.Rate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Rate.</span></br>"
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }
    let info = this.purchaseCreateForm.value;
    let account = this.accountName.find(x => x.ChartOfAccountsId == info.AccountId);
    let currency = this.currencyList.find(x => x.ID == info.CurrencyId);
    if (this.isEditMode) {
     // const formattedAmount = Number(info.Amount).toFixed(2);
      let editValue = {
        Id: info.Id,
        PurchaseOrderId: this.purchaseId ? this.purchaseId : info.PurchaseOrderId,
        AccountId: info.AccountId,
        Quantity: Number(info.Quantity).toFixed(this.entityFraction),
        CurrencyId: currency.ID,
        Currency: currency.CurrencyCode,
        Rate: Number(info.Rate).toFixed(this.entityFraction),
        Amount:  Number(info.Amount).toFixed(this.entityFraction),
        AccountName: account.AccountName,
        // Currency: currency.Currency
      }

      this.PurchaseTableList[this.editSelectedIdex] = editValue
      this.isEditMode = !this.isEditMode;
      this.editSelectedIdex = null;
      this.resetPurchaseTable();
      this.setPage(1);
      this.CalculateTotalAmount();
      return;
    }
    //const formattedAmount = Number(info.Amount).toFixed(2);
    this.PurchaseTableList.unshift({
      Id: info.Id,
      PurchaseOrderId: this.purchaseId ? this.purchaseId : info.PurchaseOrderId,
      AccountId: info.AccountId,
      Quantity: Number(info.Quantity).toFixed(this.entityFraction),
      CurrencyId: currency.ID,
      Currency: currency.CurrencyCode,
      Rate: Number(info.Rate).toFixed(this.entityFraction),
      Amount: Number(info.Amount).toFixed(this.entityFraction),
      AccountName: account.AccountName,
      // Currency: currency.Currency
    });
    this.resetPurchaseTable();
    this.setPage(1);
    this.CalculateTotalAmount();
  }

  checkFormat() {
    const parts = this.toleranceValue.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length > 1) || (parts[0].length > 2)) {
      // Prevent further typing
      this.toleranceValue = parts[0] + (parts[1] ? '.' + parts[1][0] : '');
    }
  }

  CalculateTotalAmount() {
    let totalAmount = 0;
    this.PurchaseTableList.forEach(x => {
        totalAmount += Number(x.Amount);
    });

    const formattedTotalAmount = totalAmount.toFixed(this.entityFraction);
    this.purchaseCreateForm.controls['TotalAmount'].setValue(formattedTotalAmount);
}

  setPage(page: number) {
    this.pager = this.ps.getPager(this.PurchaseTableList.length, page);
    this.pagedItems = this.PurchaseTableList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  resetPurchaseTable() {
    this.purchaseCreateForm.controls['AccountId'].setValue(0);
    this.purchaseCreateForm.controls['Quantity'].setValue('');
    const entitySelectedCurrency = this.currencyList.find(c => c.Currency === this.entityCurrency);
    if (entitySelectedCurrency) {
      this.purchaseCreateForm.controls.CurrencyId.setValue(entitySelectedCurrency.ID);
    }
    // this.purchaseCreateForm.controls['CurrencyId'].setValue(1);
    this.purchaseCreateForm.controls['Currency'].setValue('');
    this.purchaseCreateForm.controls['Rate'].setValue('');
    this.purchaseCreateForm.controls['Amount'].setValue('');
  }

  deleteValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 532,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');
          }
          else {
            this.savePurchase(1,true);
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

  deleteValueTable(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 532,
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

  deleteValueAttach(index){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 532,
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

  async savePurchase(status: Number, isDelete = false) {
    // if Finaled already return to list
    if (this.isFinalModeEnable) {
      this.router.navigate(['/views/purchase/purchase-view']);
      return;
    }

    var validation = "";
    if (this.purchaseCreateForm.value.DivisionId == "" || this.purchaseCreateForm.value.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (this.purchaseCreateForm.value.OfficeId == "" || this.purchaseCreateForm.value.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    if (status == 2) {
      if (this.purchaseCreateForm.value.PurchaseNumber == "" || this.purchaseCreateForm.value.PurchaseNumber == 0) {
        validation += "<span style='color:red;'>*</span> <span>Please create Purchase order number.</span></br>"
      }
    }
    if (this.purchaseCreateForm.value.PurchaseDate == "" || this.purchaseCreateForm.value.PurchaseDate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Purchase Date.</span></br>"
    }
    if (this.purchaseCreateForm.value.PurchaseStatusId == "" || this.purchaseCreateForm.value.PurchaseStatusId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select </span></br>"
    }
    if (this.purchaseCreateForm.value.PurchaseDescription == "" || this.purchaseCreateForm.value.PurchaseDescription == 0 || this.purchaseCreateForm.value.PurchaseDescription == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Purchase Description.</span></br>"
    }
    if (this.purchaseCreateForm.value.ShortDescription == "" || this.purchaseCreateForm.value.ShortDescription == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Short Description.</span></br>"
    }
    if (this.purchaseCreateForm.value.ValidTill == "" || this.purchaseCreateForm.value.ValidTill == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Valid Till.</span></br>"
    }
    if (this.purchaseCreateForm.value.VendorId == "" || this.purchaseCreateForm.value.VendorId == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Vendor.</span></br>"
    }
    if (this.purchaseCreateForm.value.ToleranceTypeId == "" || this.purchaseCreateForm.value.ToleranceTypeId == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Tolerance Type.</span></br>"
    }
    if (this.purchaseCreateForm.value.ToleranceId == "" || this.purchaseCreateForm.value.ToleranceId == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Tolerance %.</span></br>"
    }
    if (this.PurchaseTableList.length == 0) validation += "<span style='color:red;'>*</span> <span>At least one account must be create!!</span></br>"
    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    // set Delete flag
    if (isDelete) {
      this.purchaseCreateForm.controls['IsDelete'].setValue(1);
    }

    if (this.isUpdate && status == 2) {
      const iscocdeGenerated = await this.autoCodeGeneration('Purchase');
      if (!iscocdeGenerated) {
        Swal.fire('Failed to generate the Auto generate Code');
        return;
      }
    }   

    let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit?`;
    let deleteMsg = `Do you want to Delete this Details?`;

    let combinedText: string;

    if (status === 1) {
      combinedText = isDelete ? deleteMsg : saveMsg;
    } else if (status === 2) {
      combinedText = finalMsg;
    } else {
      combinedText = closeMsg;
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.createPayload(status);
        
        let service = `${this.globals.APIURL}/PurchaseOrder/SavePurchaseOrderInfo`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
            this.getPurchaseInfo();
            if (this.isUpdate && status === 2) { this.updateAutoGenerated(); }
          }
          // if deleted navigate to list
          if (isDelete && this.isUpdate) {
            this.router.navigate(['/views/purchase/purchase-view']);
          }

          if (this.isUpdate && status === 2) {
            this.router.navigate(['/views/purchase/purchase-view']);
          }

          if (!this.isUpdate && !this.isFinalModeEnable) {
            const internalOrderId = result.data.Id;
            this.editView(internalOrderId)
          }
          this.isCopyMode = false;
        }, error => {
          console.error(error);
        });
      }
    });
  }

  editView(id) {
    this.router.navigate(['/views/purchase-info/purchase-info-view', { id: id, isUpdate: true, isCopy: false }]);
  }

  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == 'Purchase Order');
    if (Info.length > 0) {
      Info[0].NextNumber = Info[0].NextNumber + 1;
      let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
      this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } }).subscribe((result: any) => {
      }, error => {
        console.error(error);
      });
    }
  }

  async createPayload(status) {
    let info = this.purchaseCreateForm.value;
    // var TotalAmount ='';
    let PurchaseTableList = this.PurchaseTableList;
    PurchaseTableList.forEach(element => {
      delete element.AccountName;
      delete element.Currency;
      // TotalAmount += Number(element.Amount).toFixed(this.entityFraction);
    });

    let table = {
      PurchaseOrderId: this.purchaseId ? this.purchaseId : info.PurchaseOrderId,
      DivisionId: info.DivisionId,
      OfficeId: info.OfficeId,
      PurchaseNumber: info.PurchaseNumber,
      PurchaseDate: info.PurchaseDate,
      PurchaseStatusId: info.PurchaseStatusId,
      PurchaseDescription: info.PurchaseDescription,
      ShortDescription: info.ShortDescription,
      ValidTill: info.ValidTill,
      VendorId: info.VendorId,
      ToleranceTypeId: info.ToleranceTypeId,
      ToleranceId: info.ToleranceId,
      Remarks: info.Remarks,
      CreatedBy: info.CreatedBy,
      Status: status,
      //TotalAmount: TotalAmount ? TotalAmount : info.Status,
      //info.TotalAmount.toFixed(this.entityFraction),
      TotalAmount: info.TotalAmount,
      IsDelete: info.IsDelete
    }

    this.payload = {
      PurchaseOrder: {
        'Table': [table],
        'Table 1': PurchaseTableList,
        'Table 2': this.purchaseFileList
      }
    }
  }
 totalAmountCalculation(event) {
    debugger
  const rate = Number(this.purchaseCreateForm.value.Rate)
  const qty = Number( this.purchaseCreateForm.value.Quantity)
 

  const amount = rate * qty;
  this.purchaseCreateForm.controls['Amount'].setValue(amount.toFixed(this.entityFraction));
  const currentAmountValue = Number(this.purchaseCreateForm.controls['Amount'].value);
  this.purchaseCreateForm.controls['Amount'].setValue(currentAmountValue);
  }

 // totalAmountCalculation(event) {

    // this.purchaseCreateForm.controls['Amount'].setValue(this.purchaseCreateForm.value.Rate * this.purchaseCreateForm.value.Quantity).toFixed(entityFraction);
   // const rate = this.purchaseCreateForm.value.Rate;
// const quantity = this.purchaseCreateForm.value.Quantity;
// const entityFraction = this.entityFraction; // assuming this is a valid number

    // this.purchaseCreateForm.controls['Amount'].setValue(this.purchaseCreateForm.value.Rate * this.purchaseCreateForm.value.Quantity.toFixed(this.entityFraction));
    // const calculatedAmount = (rate * quantity).toFixed(entityFraction);
    
    // this.purchaseCreateForm.controls['Amount'].setValue(calculatedAmount);
 //  }

  OnClickRadio(event) {
    this.editSelectedIdex = event;
  }

  OnClickDeleteValue() {
    if (this.editSelectedIdex >= 0 && this.editSelectedIdex != null) {
      this.PurchaseTableList.splice(this.editSelectedIdex, 1);
      this.editSelectedIdex = null;
    }
    else { Swal.fire('Please select the Item!!'); }
    this.setPage(1);
    this.CalculateTotalAmount();
  }

  OnClickEditValue() {
    debugger
    let info = this.PurchaseTableList[this.editSelectedIdex];
    this.purchaseCreateForm.patchValue({
      Id: info.Id,
      PurchaseOrderId: this.purchaseId ? this.purchaseId : info.PurchaseOrderId,
      AccountId: info.AccountId,
      Quantity: info.Quantity,
      CurrencyId: info.CurrencyId,
      Currency: info.CurrencyId,
      Rate: info.Rate,
      Amount: info.Amount,
      TotalAmount: info.TotalAmount
    })
    this.isEditMode = !this.isEditMode;
  }

  onEditView() {
    this.isEditEnabled = true
  }
  // fileSelected(event) {
  //   debugger 
  //   if (event.target.files.length > 0 && this.purchaseFileList.length < 5) {
  //     this.purchaseFileList.push({
  //       Id: 0,
  //       PurchaseOrderId: this.purchaseId ? this.purchaseId : this.purchaseCreateForm.value.PurchaseOrderId,
  //       FileName: event.target.files[0].name,
  //       FilePath: event.target.files[0].name,


  //     });
  //   }else {
  //           Swal.fire('A maximum of five files must be allowed.')
         
  //         }
  //       }
  
  fileSelected(event) {
    if (event) {
      this.selectedFile = event.target.files[0];
      const filedata = new FormData();
      filedata.append('file', this.selectedFile, this.selectedFile.name)

      this.commonservice.AttachUpload(this.selectedFile).subscribe(data => {
        if (data) {

      this.purchaseFileList.push({
        Id: 0,
        PurchaseOrderId: this.purchaseId ? this.purchaseId : this.purchaseCreateForm.value.PurchaseOrderId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name,
        UniqueFilePath: data.FileNamev,

      });
    }
  },
    (error: HttpErrorResponse) => {
      Swal.fire(error.message, 'error')
    });
}
    else {
      Swal.fire('A maximum of five files must be allowed.')  
    }   
  }

   /*File Download*/
download = (fileUrl) => {
  this.fileUrl = "UploadFolder\\Attachments\\" + fileUrl;
  this.commonDataService.download(fileUrl).subscribe((event) => {

      if (event.type === HttpEventType.UploadProgress){ 
        
      }
          // this.progress1 = Math.round((100 * event.loaded) / event.total);

      else if (event.type === HttpEventType.Response) {
          // this.message = 'Download success.';
          this.downloadFile(event);
      }
  });
}

private downloadFile = (data: HttpResponse<Blob>) => {
  const downloadedFile = new Blob([data.body], { type: data.body.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = this.fileUrl;
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}
  OnClickDeleteValueFile(index: number) {
    this.purchaseFileList.splice(index, 1);
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
          // this.autoCodeGeneration('Purchase');
        }
      }
    }, error => {
      console.error(error);
    });
  }
  async autoCodeGeneration(event: any) {
    return new Promise(async (resolve, reject) => {
      if (this.isUpdate) {
        if (event) {
          let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == "Purchase Order");
          if (Info.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
            let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
            if (code) this.purchaseCreateForm.controls['PurchaseNumber'].setValue(code.trim().toUpperCase());
            if (code)  this.purchaseCreateForm.controls['PurchaseStatusId'].setValue(1);
            resolve(true);
          }
          else {
            Swal.fire('Please create the auto-generation code for Purchase Order.')
            resolve(false);
          }
        }
        else {
          this.purchaseCreateForm.controls['PurchaseNumber'].setValue('');
          resolve(false);
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

    if (this.purchaseCreateForm.value.DivisionId && this.purchaseCreateForm.value.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.purchaseCreateForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.purchaseCreateForm.value.DivisionId);
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

  purchaseEvent(event: any) {
    this.purchaseCreateForm.controls['ValidTill'].setValue('');
    this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  }

  toleranceTypeEvent(event) {
    let type = this.toleranceList.find(x => x.ID == event);
    if (type.TypeName == "Unlimited") {
      this.isShowTolerancePercentage = false;
      this.purchaseCreateForm.controls['ToleranceId'].setValue('NA');
    }
    else {
      this.isShowTolerancePercentage = true;
      this.purchaseCreateForm.controls['ToleranceId'].setValue('');
    }
  }

  // getOfficeList(id: number) {
  //   this.commonDataService.getOfficeByDivisionId({ DivisionId: id }).subscribe(result => {
  //     this.officeList = [];
  //     if (result['data'].Table.length > 0) {
  //       this.officeList = result['data'].Table;
  //     }
  //   })
  // }

  getOfficeList(DivisionId) {
    return new Promise((resolve, reject) => {
      const payload = { DivisionId }
      this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any) => {
        this.officeList = [];
        this.purchaseCreateForm.controls['OfficeId'].setValue('');
        if (result.message == 'Success') {
          if (result.data && result.data.Table.length > 0) {
            this.officeList.push(...result.data.Table);
            resolve(true);
          }
        }
      }, error => {
        reject();
      });
    })
  }

  checkRange(event) {
    debugger;
    const decimalIndex = event.indexOf('.'); // Check if decimal is present

    if (decimalIndex !== -1) {
        // If decimal is present
        const beforeDecimal = event.slice(0, decimalIndex);
        const afterDecimal = event.slice(decimalIndex + 1);

        const truncatedBeforeDecimal = beforeDecimal.slice(0, 2); // Allow only 2 digits before decimal
        const truncatedAfterDecimal = afterDecimal.slice(0, 1); // Allow only 1 digit after decimal

        const NextNumber = truncatedBeforeDecimal + '.' + truncatedAfterDecimal;
        this.purchaseCreateForm.controls['ToleranceId'].setValue(NextNumber);
    } else if (event.length > 2) {
        // If no decimal and more than 2 digits, allow only 2 digits
        const NextNumber = event.slice(0, 2);
        this.purchaseCreateForm.controls['ToleranceId'].setValue(NextNumber);
    } else {
        // If no decimal and less than or equal to 2 digits, allow as is
        this.purchaseCreateForm.controls['ToleranceId'].setValue(event);
    }
}

}
