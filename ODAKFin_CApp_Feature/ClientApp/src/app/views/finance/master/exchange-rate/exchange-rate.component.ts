import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { CurrencyPair } from 'src/app/model/financeModule/ExchangeRate';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ExchangeRateService } from 'src/app/services/financeModule/exchange-rate.service';

import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css'],
  providers: [DatePipe]
})
export class ExchangeRateComponent implements OnInit {


  fg: FormGroup;
  FormMode: String = "A";
  dsCurrencyPair: CurrencyPair[];
  isDisable: boolean = false;
  statusvalues: Status[] = new StatusView().statusvalues;
  exchangeList: any[];
  isUpdate: boolean = false;
  exchangeRateName: string = '';
  exchangeRatePairID: any;
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  minDate  : string = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  constructor(private router: Router, private route: ActivatedRoute, private ms: MastersService,
    private fb: FormBuilder, private ERService: ExchangeRateService,
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
    private commonDataService: CommonService
  ) {
    this.route.params.subscribe(params => {
      this.fg = this.fb.group({ ExchangeRateId: params['id'] });
      if (params['id']) {
        this.isUpdate = true;
        this.isDisable = true;
      }
    });


  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    this.OnBindDropdownCurrencyPair();
    await this.getExchangeList();
    if (this.isUpdate) { this.fg.disable(); }
  }

  onBack() {
    this.router.navigate(['/views/finance/master/exchangerate/exchangerateview']);
  }

  updateValue(){
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 611
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt == 2) {
            this.fg.enable();
            this.isDisable = false;
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }


  createForm() {
    if (this.fg.value.ExchangeRateId != null) {
      this.FormMode = "B";
      var queryParams = { "exchangeRateID": this.fg.value.ExchangeRateId }
      this.ERService.getExchangeRatebyId(queryParams).pipe().subscribe(async data => {
        this.fg.patchValue(data["data"][0]);
        this.fg.controls['EffectiveDate'].setValue(this.datePipe.transform(data["data"][0].EffectiveDate, 'y-MM-dd'));
        this.fg.controls['CurrencyPairID'].setValue(data["data"][0].CurrencyPairId);
        this.exchangeRatePairID = data["data"][0].ExchangeRateId;
      });

      this.fg = this.fb.group({
        ExchangeRateId: 0,
        CurrencyPairID: 0,
        Rate: '',
        EffectiveDate: '',
        IsActive: true,
        Status: '',
      });
    }
    else {
      this.fg = this.fb.group({
        ExchangeRateId: 0,
        CurrencyPairID: 0,
        Rate: '',
        EffectiveDate: '',
        IsActive: true,
        Status: '',
      }
      );
    }
  }

  OnBindDropdownCurrencyPair() {
    this.ERService.getCurrencyPair().subscribe(data => {
      this.dsCurrencyPair = data["data"];
    });
  }

  onSubmit() {
    var validation = "";

    var ddlCurrencyPairId = $('#ddlCurrencyPairId').val();
    // if (ddlCurrencyPairId == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select currency pair </span></br>"
    // }
    if (this.fg.value.CurrencyPairID == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select currency pair </span></br>"
    }

    if (this.fg.value.EffectiveDate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter effective date</span></br>"
    }

    if (this.fg.value.Rate == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter rate</span></br>"
    }

    // var ddlIsActive = $('#ddlIsActive').val();
    // if (ddlIsActive == null) {
    //   validation += "<span style='color:red;'>*</span> <span>Please select status</span></br>"
    // }

    if (validation != "") {
      Swal.fire('', validation, 'warning');
      return false;
    }
    else {
      this.fg.value.IsActive = $('#ddlIsActive').val();
      var queryParams = {
        "exchangeRateID": this.fg.value.ExchangeRateId,
        "currencyPaidId": this.fg.value.CurrencyPairID,
        "rate": this.fg.value.Rate,
        "effectiveDate": this.fg.value.EffectiveDate,
        "isActive": true
      };

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
            this.ERService.SaveExchangeRate(queryParams).subscribe(data => {
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

  decimalFilter(event: any) {
    //const reg = /^-?\d*(\.\d{0,2})?$/;
    const reg = /^\d{0,3}$|(?=^.{0,8}$)^\d+\.\d{0,4}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  async getExchangeList() {
    var service = `${this.globals.APIURL}/ExchangeRate/GetExchangeRatePairList`; var payload: any = { Id: 0, FromCurrency: '', ToCurrency: '', Active: 1 }
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.exchangeList = [];
      if (result.data.length > 0) { this.exchangeList = result.data; }
    }, error => { });
  }

  ExchangeRatePair(event?) {
    let info = this.exchangeList.find(x => x.Id == event ? event : this.exchangeRatePairID);
    this.exchangeRateName = `${info.FromCurrency}-${info.ToCurrency}`;
  }

}
