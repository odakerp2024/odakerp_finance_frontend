import { InternalOrderComponent } from './../internal-order/internal-order.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ChartaccountService } from 'src/app/services/financeModule/chartaccount.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-internal-info',
  templateUrl: './internal-info.component.html',
  styleUrls: ['./internal-info.component.css'],
  providers: [DatePipe]
})

export class InternalInfoComponent implements OnInit {

  divisionList: any = [];
  officeList: any = [];
  statusList: any = [];
  toleranceType: any = [];
  pagedItems: any = [];
  internalId: any = 0;
  payload: {};
  pager: any = {};
  internalCreateForm: FormGroup;
  currencyList: any = [];
  accountName: any = [];
  isEditMode: boolean = false;
  internalTableList: any = [];
  editSelectedIdex: any;
  FileList: any = [];
  isUpdateMode: boolean = false;
  autoGenerateCodeList: any[];
  isUpdate: boolean = false;
  isFinalModeEnable: boolean = false; 
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  entityFraction = Number(this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions'));
  entityCurrency = this.commonDataService.getLocalStorageEntityConfigurable('Currency');
  minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  isCopyMode: boolean = false;
  CreatedBy: string = '';
  CreatedOn: string = '';
  ModifiedBy: string = '';
  ModifiedOn: string = '';
  isShowTolerancePercentage: boolean = true;
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  InternalDescription: string = "";
  isEditEnabled = true
  constructor(
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    public ps: PaginationService,
    private chartAccountService: ChartaccountService,
    private datePipe: DatePipe,
    private commonDataService: CommonService,
    private autoCodeService: AutoCodeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.getNumberRange(); 
    this.purchaseForm();
    this.getDivisionList(); 
    // this.getOfficeList();
    this.getStatusList();
    this.getCurrency();
    this.ChartAccountList();
    this.route.params.subscribe(param => {
      if (param.id) {
        if (param.isCopy == "true") { this.isCopyMode = true; }
        else {
          this.isUpdate = true;
          this.isUpdateMode = true;
          this.internalCreateForm.disable();
          this.isEditEnabled = false;
        }
        this.internalId = param.id;
        this.getInternalInfo();
      }
    });
    // if (!this.isUpdate && !this.isCopyMode) { this.getNumberRange(); }
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 534,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.isUpdateMode = false;
            this.internalCreateForm.enable();
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

  deleteValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 534,
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Delete_Opt != 2) {
              Swal.fire('Please Contact Administrator');            
          }
          else {
            this.saveInternal(1,true);
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
      SubfunctionID: 534,
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
      SubfunctionID: 534,
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

  purchaseForm() {
    this.internalCreateForm = this.fb.group({
      InternalOrderId: [0],
      DivisionId: [''],
      OfficeId: [''],
      InternalNumber: [''],
      InternalDate: [''],
      InternalStatusId: [1],
      InternalDescription: [''],
      ShortDescription: [''],
      ValidTill: [''],
      ToleranceTypeId: [0],
      ToleranceId: [0],
      Remarks: [''],
      CreatedBy: [localStorage.getItem('UserID')],
      Status: [0],
      TotalAmount: [''],

      // Table 
      Id: [0],
      AccountId: [0],
      Quantity: [''],
      CurrencyId: [0],
      CurrencyName: [''],
      Rate: [''],
      Amount: [''],
      IsDelete: [0]
    });
  }

  getInternalInfo() {
    var service = `${this.globals.APIURL}/InternalOrder/GetInternalOrderById`;
    this.dataService.post(service, { Id: this.internalId }).subscribe(async(result: any) => {
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.FileList = [];
        this.internalTableList = [];
        let info = result.data.Table[0];
        if (info.Status == 2) this.isFinalModeEnable = true;
        this.CreatedBy = info.CreatedByName;
        this.CreatedOn = this.datePipe.transform(info.CreatedDate, this.entityDateFormat);
        this.ModifiedBy = info.UpdatedByName;
        this.ModifiedOn = this.datePipe.transform(info.UpdatedDate, this.entityDateFormat);
        this.InternalDescription = info.InternalDescription;
        await this.getOfficeList(info.DivisionId);
        this.internalCreateForm.patchValue({
          InternalOrderId: info.Id,
          DivisionId: info.DivisionId,
          OfficeId: info.OfficeId,
          InternalNumber: info.InternalNumber,
          InternalDate: this.datePipe.transform(info.InternalDate, 'y-MM-dd'),
          InternalStatusId: info.InternalStatusId,
          InternalDescription: info.InternalDescription,
          ShortDescription: info.ShortDescription,
          ValidTill: this.datePipe.transform(info.ValidTill, 'y-MM-dd'),
          ToleranceTypeId: info.ToleranceTypeId,
          ToleranceId: info.ToleranceId,
          Remarks: info.Remarks,
          CreatedBy: info.CreatedBy,
          Status: info.Status,
          TotalAmount: info.TotalAmount,
          IsDelete:  info.IsDelete ? info.IsDelete : 0
        });

        if (result.data.Table2.length > 0) this.FileList = result.data.Table2;
        if (result.data.Table1.length > 0) {
          this.internalTableList = result.data.Table1;
          this.setPage(1);
        }

        //  Copy Scenario
        if (this.isCopyMode) {
          this.internalId = 0;
          this.internalCreateForm.controls['InternalStatusId'].setValue(1);
          this.internalCreateForm.controls['InternalOrderId'].setValue(0);
          this.internalCreateForm.controls['InternalNumber'].setValue('');
          this.FileList.forEach(element => { element.Id = 0; element.InternalOrderId = 0; });
          this.internalTableList.forEach(element => { element.Id = 0; element.InternalOrderId = 0; });
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

  
  getOfficeList(DivisionId) {
    debugger
    return new Promise((resolve, reject) => { 
    const payload = {DivisionId}
    this.commonDataService.getOfficeByDivisionId(payload).subscribe((result: any) => {
      this.officeList = [];
       this.internalCreateForm.controls['OfficeId'].setValue('');
      if (result['data'].Table.length > 0) {
        this.officeList.push(...result['data'].Table);
        resolve(true);
          }
       }, error => { 
         reject();
       });
     })
    }


  // getOfficeList() {
  //   var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeFilter`;
  //   var payload: any = { Id: 0, officeCode: '', OfficeName: '', ShortName: '', StateId: null, GSTNo: '', Active: 1 };
  //   this.dataService.post(service, payload).subscribe((result: any) => {
  //     if (result.message == 'Success' && result.data.Table.length > 0) {
  //       this.officeList = result.data.Table;
  //     }
  //   }, error => { });
  // }

  getStatusList() {
    let service = `${this.globals.APIURL}/InternalOrder/GetInternalOrderDropDownList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.statusList = [];
      this.toleranceType = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.statusList = result.data.Table;
        this.toleranceType = result.data.Table1;
      }
    }, error => {
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
        this.internalCreateForm.controls.CurrencyId.setValue(entitySelectedCurrency.ID);
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
    if (this.internalCreateForm.value.AccountId == "" || this.internalCreateForm.value.AccountId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Account.</span></br>"
    }
    if (this.internalCreateForm.value.Quantity == "" || this.internalCreateForm.value.Quantity == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Quantity.</span></br>"
    }
    if (this.internalCreateForm.value.CurrencyId == "" || this.internalCreateForm.value.CurrencyId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Currency.</span></br>"
    }
    if (this.internalCreateForm.value.Rate == "" || this.internalCreateForm.value.Rate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please enter Rate.</span></br>"
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    let info = this.internalCreateForm.value;
    let account = this.accountName.find(x => x.ChartOfAccountsId == info.AccountId);
    let currency = this.currencyList.find(x => x.ID == info.CurrencyId);

    if (this.isEditMode) {
      let editValue = {
        Id: info.Id,
      InternalOrderId: this.internalId ? this.internalId : info.InternalOrderId,
      AccountId: info.AccountId,
      AccountName: account.AccountName,
      Quantity: Number(info.Quantity),
      CurrencyId: info.CurrencyId,
      CurrencyName: currency.CurrencyCode,
      Rate: Number(info.Rate),
      Amount: info.Amount
      }
      this.internalTableList[this.editSelectedIdex] = editValue;
      this.isEditMode = !this.isEditMode;
      this.editSelectedIdex = null;
      this.resetTable();
      this.setPage(1);
      this.CalculateTotalAmount();
      return;
    }

    this.internalTableList.unshift({
      Id: info.Id,
      InternalOrderId: this.internalId ? this.internalId : info.InternalOrderId,
      AccountId: info.AccountId,
      AccountName: account.AccountName,
      Quantity: Number(info.Quantity),
      CurrencyId: info.CurrencyId,
      CurrencyName: currency.CurrencyCode,
      Rate: Number(info.Rate),
      Amount: info.Amount
    });
    this.resetTable();
    this.setPage(1);
    this.CalculateTotalAmount();
  }

  CalculateTotalAmount() {
    var totalAmount = 0;
    this.internalTableList.map(x => {
      totalAmount += x.Amount;
    });

    const fixedTotalAmount = totalAmount.toFixed(this.entityFraction); // Fixed to three decimal places
    this.internalCreateForm.controls['TotalAmount'].setValue(fixedTotalAmount);
}


//   CalculateTotalAmount() {

//     // this.purchaseCreateForm.controls['Amount'].setValue(this.purchaseCreateForm.value.Rate * this.purchaseCreateForm.value.Quantity).toFixed(entityFraction);
//     const rate = this.internalCreateForm.value.Rate;
// const quantity = this.internalCreateForm.value.Quantity;
// const entityFraction = this.entityFraction; // assuming this is a valid number

//     // this.purchaseCreateForm.controls['Amount'].setValue(this.purchaseCreateForm.value.Rate * this.purchaseCreateForm.value.Quantity.toFixed(this.entityFraction));
//     const calculatedAmount = (rate * quantity).toFixed(entityFraction);
    
//     this.internalCreateForm.controls['Amount'].setValue(calculatedAmount);
//    }

  setPage(page: number) {
    this.pager = this.ps.getPager(this.internalTableList.length, page);
    this.pagedItems = this.internalTableList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  resetTable() {
    this.internalCreateForm.controls['AccountId'].setValue(0);
    this.internalCreateForm.controls['Quantity'].setValue('');
    const entitySelectedCurrency = this.currencyList.find(c => c.Currency === this.entityCurrency);
    if (entitySelectedCurrency) {
      this.internalCreateForm.controls.CurrencyId.setValue(entitySelectedCurrency.ID);
    }
    this.internalCreateForm.controls['CurrencyName'].setValue('');
   // this.internalCreateForm.controls['CurrencyId'].setValue(0);
    this.internalCreateForm.controls['Rate'].setValue('');
    this.internalCreateForm.controls['Amount'].setValue('');
  }

  async saveInternal(status: Number, isDelete = false) {
    // if Finaled already return to list
    if(this.isFinalModeEnable){
      this.router.navigate(['/views/internal-order/internal-view']);
      return
    }

    var validation = "";
    if (this.internalCreateForm.value.DivisionId == "" || this.internalCreateForm.value.DivisionId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Division.</span></br>"
    }
    if (this.internalCreateForm.value.OfficeId == "" || this.internalCreateForm.value.OfficeId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Office.</span></br>"
    }
    // if (this.internalCreateForm.value.InternalNumber == "" || this.internalCreateForm.value.InternalNumber == 0) {
    //   validation += "<span style='color:red;'>*</span> <span>Please create Internal order number.</span></br>"
    // }
    if (this.internalCreateForm.value.InternalDate == "" || this.internalCreateForm.value.InternalDate == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select Internal Date.</span></br>"
    }
    if (this.internalCreateForm.value.InternalStatusId == "" || this.internalCreateForm.value.InternalStatusId == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please select IO Status</span></br>"
    }
    if (this.internalCreateForm.value.InternalDescription == "" || this.internalCreateForm.value.InternalDescription == 0 || this.internalCreateForm.value.InternalDescription == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Internal Description.</span></br>"
    }
    if (this.internalCreateForm.value.ShortDescription == "" || this.internalCreateForm.value.ShortDescription == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Short Description.</span></br>"
    }
    if (this.internalCreateForm.value.ValidTill == "" || this.internalCreateForm.value.ValidTill == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Valid Till.</span></br>"
    }
    if (this.internalCreateForm.value.ToleranceTypeId == "" || this.internalCreateForm.value.ToleranceTypeId == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Tolerance Type.</span></br>"
    }
    if (this.internalCreateForm.value.ToleranceId == "" || this.internalCreateForm.value.ToleranceId == null) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Tolerance %.</span></br>"
    }
    if (this.internalTableList.length == 0) validation += "<span style='color:red;'>*</span> <span>At least one account must be create!!</span></br>"
    if (validation != "") { Swal.fire(validation); return false; }

    // set Delete flag
    if(isDelete){
      this.internalCreateForm.controls['IsDelete'].setValue(1);
    }

    if(this.isUpdate && status == 2){
      const iscocdeGenerated =  await this.autoCodeGeneration('Internal');
      if (!iscocdeGenerated) {
        Swal.fire('Failed to generate the Auto generate Code');
        return;
      }
    }
    await this.createPayload(status);


    let saveMsg = `Do you want to Save this Details?`;
    let finalMsg = `Final voucher not possible to edit <br> Do you want proceed?`;
    let closeMsg = `Voucher is not yet finalized <br> Do you want to still exit?`;
    let deleteMsg = `Do you want to Delete this Details?`;

    let combinedText: string;

    if (status === 1) {
      combinedText =  isDelete ? deleteMsg : saveMsg ;
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
    }).then((result) => {
      if (result.isConfirmed) {
        let service = `${this.globals.APIURL}/InternalOrder/SaveInternalOrderInfo`;
        this.dataService.post(service, this.payload).subscribe((result: any) => {
          if (result.message == "Success") {
            Swal.fire(result.message, '', 'success');
            // if deleted navigate to list
            if(isDelete && this.isUpdate){
              this.router.navigate(['/views/internal-order/internal-view']);
            }

            if (this.isUpdate && status == 2) { 
              this.updateAutoGenerated(); 
              this.router.navigate(['/views/internal-order/internal-view']);
            }

            if (!this.isUpdate && !this.isFinalModeEnable) {
              const internalOrderId = result.data.Id;
              this.editView(internalOrderId)
            }
          }
        }, error => {
          console.error(error);
        });
      }
    });
  }

  editView(id){
    this.router.navigate(['/views/internal-info/internal-info-view', { id: id, isUpdate: true, isCopy: false }]);
  }
 
  updateAutoGenerated() {
    let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == "Internal Order");
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
    let info = this.internalCreateForm.value;
    var TotalAmount = 0;
    let internalTableList = this.internalTableList;
    internalTableList.forEach(element => {
      element.AccountName;
      element.CurrencyName;
      TotalAmount += element.Amount;
    });

    let table = {
      InternalOrderId: this.internalId ? this.internalId : info.InternalOrderId,
      DivisionId: info.DivisionId,
      OfficeId: info.OfficeId,
      InternalNumber: info.InternalNumber,
      InternalDate: info.InternalDate,
      InternalStatusId: info.InternalStatusId,
      PurchaseDescription: info.PurchaseDescription,
      InternalDescription: info.InternalDescription,
      ShortDescription: info.ShortDescription,
      ValidTill: info.ValidTill,
      ToleranceTypeId: info.ToleranceTypeId,
      ToleranceId: info.ToleranceId,
      Remarks: info.Remarks,
      CreatedBy: info.CreatedBy,
      Status: status,
      TotalAmount: TotalAmount ? TotalAmount : info.Status,
      IsDelete: info.IsDelete
    }

    this.payload = {
      InternalOrder: {
        'Table': [table],
        'Table 1': internalTableList,
        'Table 2': this.FileList
      }
    }
  }

  totalAmountCalculation(event) {
    this.internalCreateForm.controls['Amount'].setValue(this.internalCreateForm.value.Rate * this.internalCreateForm.value.Quantity);
  }


  
//   totalAmountCalculation(event) {
//     debugger

//     // this.purchaseCreateForm.controls['Amount'].setValue(this.purchaseCreateForm.value.Rate * this.purchaseCreateForm.value.Quantity).toFixed(entityFraction);
//     const rate = this.internalCreateForm.value.Rate;
// const quantity = this.internalCreateForm.value.Quantity;
// const entityFraction = this.entityFraction; // assuming this is a valid number

//     // this.purchaseCreateForm.controls['Amount'].setValue(this.purchaseCreateForm.value.Rate * this.purchaseCreateForm.value.Quantity.toFixed(this.entityFraction));
//     const calculatedAmount = (rate * quantity).toFixed(entityFraction);
    
//     this.internalCreateForm.controls['Amount'].setValue(calculatedAmount);
//    }

  OnClickRadio(event) {
    this.editSelectedIdex = event;
  }

  OnClickDeleteValue() {
    if (this.editSelectedIdex >= 0 && this.editSelectedIdex != null) {
      this.internalTableList.splice(this.editSelectedIdex, 1);
      this.editSelectedIdex = null;
    }
    else { Swal.fire('Please select the Item!!'); }
    this.setPage(1);
    this.CalculateTotalAmount();
  }


  OnClickEditValue() {
    debugger
    let info = this.internalTableList[this.editSelectedIdex];
    this.internalCreateForm.patchValue({
      Id: info.Id,
      InternalOrderId: this.internalId ? this.internalId : info.InternalOrderId,
      AccountId: info.AccountId,
      Quantity: info.Quantity,
      CurrencyId: info.CurrencyId,
      CurrencyName: info.CurrencyName,
      Rate: info.Rate,
      Amount: info.Amount,
      TotalAmount: info.TotalAmount
    })
    this.isEditMode = !this.isEditMode;
  }

  onEditView(){
    debugger
    this.isEditEnabled  = true
  }

  fileSelected(event) {
    if (event.target.files.length > 0 && this.FileList.length < 5) {
      this.FileList.push({
        Id: 0,
        InternalOrderId: this.internalId ? this.internalId : this.internalCreateForm.value.InternalOrderId,
        FileName: event.target.files[0].name,
        FilePath: event.target.files[0].name
      })
    }
    else {
      Swal.fire('A maximum of five files must be allowed.');
    }
  }

  OnClickDeleteValueFile(index: number) {
    this.FileList.splice(index, 1);
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
          // this.autoCodeGeneration('Internal');
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
          let Info = this.autoGenerateCodeList.filter(x => x.ObjectName == "Internal Order");
          if (Info.length > 0) {
            let sectionOrderInfo = await this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }], Info[0].NextNumber, event);
            let code = this.autoCodeService.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
            if (code) this.internalCreateForm.controls['InternalNumber'].setValue(code.trim().toUpperCase());
            if (code)  this.internalCreateForm.controls['InternalStatusId'].setValue(1);
            resolve(true);
          }
          else {
            Swal.fire('Please create the auto-generation code for Internal Order.')
            resolve(false);
          }
        }
        else {
          this.internalCreateForm.controls['InternalNumber'].setValue('');
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

    if (this.internalCreateForm.value.DivisionId && this.internalCreateForm.value.OfficeId) {
      officeInfo = this.officeList.find(x => x.ID == this.internalCreateForm.value.OfficeId);
      divisionInfo = this.divisionList.find(x => x.ID == this.internalCreateForm.value.DivisionId);
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

  internalDateEvent(event: any) {
    this.internalCreateForm.controls['ValidTill'].setValue('');
    this.validTillMinDate = this.datePipe.transform(new Date(event), "yyyy-MM-dd");
  }

  toleranceTypeEvent(event) {
    let type = this.toleranceType.find(x => x.ID == event);
    if (type.TypeName == "Unlimited") {
      this.isShowTolerancePercentage = false;
      this.internalCreateForm.controls['ToleranceId'].setValue('NA');
    }
    else {
      this.isShowTolerancePercentage = true;
      this.internalCreateForm.controls['ToleranceId'].setValue('');
    }
  }
  checkRange(event) {
    if (event.length > 2) {
      const NextNumber = event.slice(0, 2)
      this.internalCreateForm.controls['ToleranceId'].setValue(NextNumber)
    }
  }


}
