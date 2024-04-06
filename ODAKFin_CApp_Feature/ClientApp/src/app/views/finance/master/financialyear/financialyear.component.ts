import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Status, StatusView } from 'src/app/model/common';
import { FinancialyearService } from 'src/app/services/financeModule/financialyear.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { StatusValue } from 'src/app/model/financeModule/Financialyear';
import { Country } from 'src/app/model/Organzation';
import { DataService } from 'src/app/services/data.service';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';

declare let $: any;

@Component({
  selector: 'app-financialyear',
  templateUrl: './financialyear.component.html',
  styleUrls: ['./financialyear.component.css']
})

export class FinancialyearComponent implements OnInit {

  fg: FormGroup;
  dscountryItem: Country[];
  FormMode: String = "A";
  editable: boolean = true;
  //const newTodo = new StatusValue(); //statusvalues: Status[]=this.newTodo.statusvaluesv;
  statusvalues: Status[] = new StatusView().statusvalues;
  finicalYearId: any = 0;
  isUpdate: boolean = false;
  isUpdateEnable: boolean = false;

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  FinicalPeriodList: any;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');

  constructor(private router: Router, private route: ActivatedRoute, private fy: FinancialyearService, private ms: MastersService,
    private fb: FormBuilder,
    private dataService: DataService,
    private globals: Globals,
    private commonDataService: CommonService
  ) {

    this.route.params.subscribe(params => {
      debugger
      this.fg = this.fb.group({ FinancialYearId: params['id'] });
      if (params['id']) {
        this.finicalYearId = params['id'];
        this.isUpdate = true;
        this.isUpdateEnable = true;
      }
    });
    this.getCompanyDetails();
  }


  ngOnInit(): void {
    this.createForm();
    this.OnBindDropdownCountry();
    if (this.isUpdate) {
      this.fg.disable();
    }
    this.getFinicalPeriod();
  }


  onBack() {
    this.router.navigate(['/views/finance/financialyearview']);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  createForm() {

    if (this.fg.value.FinancialYearId != null) {

      this.FormMode = "B";

      let service = `${this.globals.APIURL}/FinancialYear/GetFinancialYearId/`;
      this.dataService.post(service, { FinancialYearId: this.finicalYearId }).subscribe((data: any) => {
        debugger
        // this.fy.getFinancialYearbyId(this.fg.value).pipe().subscribe(data => {
        var startDate = ''
        var endDate = ''
        if (data["data"][0].FromDate) {
          startDate = new Date(data["data"][0].FromDate).getFullYear().toString().slice(-2)
        }
        if (data["data"][0].ToDate) {
          endDate = new Date(data["data"][0].ToDate).getFullYear().toString().slice(-2)
        }

        this.fg.controls.ShortName.setValue(startDate + '' + endDate);

        this.fg.patchValue(data["data"][0]);
        //$('#ddlIsActive').select2().val(data["data"][0].IsActive);
        //$('#txtFromDate').val(data["data"][0].FromDate);
        //$('#txtToDate').val(data["data"][0].FromDate);        
      });

      this.fg = this.fb.group({
        FinancialYearId: 0,
        CountryID: 0,
        FinancialYearName: '',
        FromDate: '',
        ToDate: '',
        IsActive: false,
        FinancialPeriod: 0,
        ShortName: ''
      });
    }
    else {
      this.fg = this.fb.group({
        FinancialYearId: 0,
        CountryID: 0,
        FinancialYearName: '',
        FromDate: '',
        ToDate: '',
        IsActive: true,
        FinancialPeriod: 0,
        ShortName: ''
      }
      );
      //$('#ddlIsActive').select().val(0);
    }
  }

  onSubmit() {

    var validation = "";

    var ddlLocCity = $('#financialPeriod').val();
    if (ddlLocCity == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select finical period</span></br>"
    }

    if (this.fg.value.FinancialYearName == "") {
      validation += "<span style='color:red;'>*</span> <span>Please enter financialYear </span></br>"
    }

    if (this.fg.value.FromDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please pick start date</span></br>"
    }

    if (this.fg.value.ToDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please pick end date</span></br>"
    }

    var invalid = false;
    const from = this.fg && this.fg.get("FromDate").value;
    const to = this.fg && this.fg.get("ToDate").value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    if (invalid) { validation += "<span style='color:red;'>*</span> <span> end date should be greater than start date</span></br>" }


    var ddlIsActive = $('#ddlIsActive').val();
    if (ddlIsActive == null) {
      validation += "<span style='color:red;'>*</span> <span>Please select status</span></br>"
    }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }
    else {

      Swal.fire({
        showCloseButton: true,
        title: '',
        icon: 'question',
        text: 'Do you want to save this Details?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false,
      })
        .then((result) => {
          if (result.value) {
            //-----
            this.fg.value.IsActive = $('#ddlIsActive').val();
            //this.fg.value.Status = $('#ddlIsActive').select2().val();
            this.fy.SaveFinancialYear(this.fg.value).subscribe(data => {
              if (data["message"] == "Failed") { Swal.fire(data["data"], '', 'error') }
              else {
                Swal.fire(data["data"], '', 'success').then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.onBack();
                  }
                })
              }
            },
              (error: HttpErrorResponse) => {
                Swal.fire(error.message, 'error')
              });
            //------ 
          }
        });



    }

  }

  reset() {
    Swal.fire({
      showCloseButton: true,
      title: '',
      icon: 'question',
      text: 'Do you want to cancel this operation?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
    })
      .then((result) => { if (result.value) this.onBack(); });
  }

  //#region 
  OnBindDropdownCountry() {
    this.ms.getCountryBind().subscribe(data => {
      //console.log(data);
      this.dscountryItem = data;
    });
  }

  decimalFilter(event: any) {
    //const reg = /^-?\d*(\.\d{0,2})?$/;
    const reg = /^\d{0,4}$|(?=^.{0,7}$)^\d+\-\d{0,2}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  getFinicalPeriod() {
    let service = `${this.globals.APIURL}/FinancialYear/GetFinancialYearMonths`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.length > 0) {
        this.FinicalPeriodList = result.data;
      }
    }, error => {
      console.error(error);
    });
  }


  getCompanyDetails() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCompanyDetails`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.length > 0) {
        let res = result[0];
        let companyId = res.ID;
        this.getOrganization(companyId);
      }
    }, error => { });
  }

  getOrganization(companyId: number) {
    let service = `${this.globals.APIURL}/Organization/GetOrganizationEntityId`;
    this.dataService.post(service, { "OrgId": companyId }).subscribe((result: any) => {
      this.fg.controls['FinancialPeriod'].setValue(result.data.Table1[0].FinancialPeriod)
    }, error => {
      console.error(error);
    });
  }

  dateChange(event: any) {
    debugger
    // Your logic here
    const selectedDate = event.target.value;
    var startDate = ''
    var endDate = ''
    // const year = selectedDate.getFullYear().toString().slice(-2);

    if (this.fg.controls.FromDate.value) {
      startDate = new Date(this.fg.controls.FromDate.value).getFullYear().toString().slice(-2)
    }
    if (this.fg.controls.ToDate.value) {
      endDate = new Date(this.fg.controls.ToDate.value).getFullYear().toString().slice(-2)
    }

    this.fg.controls.ShortName.setValue(startDate + '' + endDate);

    console.log('Date changed:', selectedDate);
  }


}
