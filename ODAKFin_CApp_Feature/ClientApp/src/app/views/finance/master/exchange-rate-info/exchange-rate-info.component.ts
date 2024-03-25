import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exchange-rate-info',
  templateUrl: './exchange-rate-info.component.html',
  styleUrls: ['./exchange-rate-info.component.css']
})
export class ExchangeRateInfoComponent implements OnInit {

  fg: FormGroup
  currencyList: any;
  statusValues: Array<object> = [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]
  isUpdate: boolean = false;
  isDisableMode: boolean = false;

  CreatedOn: string = '';
  CreatedBy: string = '';
  ModifiedOn: string = '';
  ModifiedBy: string = '';
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');


  constructor(
    private dataService: DataService,
    private globals: Globals,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonDataService: CommonService
  ) { }

  ngOnInit(): void {
    this.createExchangeForm();
    this.getCurrency();

    this.route.params.subscribe(param => {
      if (param.id) {
        this.fg.controls.Id.setValue(param.id);
        this.isUpdate = true;
        this.isDisableMode = true;
        this.getExchangeParam();
        this.fg.disable();
      }
    });

  }

  createExchangeForm() {
    this.fg = this.fb.group({
      Id: [0],
      FromCurrency: [''],
      ToCurrency: [''],
      Active: [1]
    });
  }

  getCurrency() {
    let service = `${this.globals.SaApi}/SystemAdminApi/GetCurrency`
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.length > 0) {
        this.currencyList = result;
      }
    }, error => { });
  }

  onSubmit() {
  debugger
    var validation = "";
    if (this.fg.value.FromCurrency == "") {
      validation += "<span style='color:red;'>*</span> <span>Please  select From Currency </span></br>"
    }
    if (this.fg.value.ToCurrency == "") {
      validation += "<span style='color:red;'>*</span> <span>Please select To Currency</span></br>"
    }
    // if (this.fg.value.Active == "") {
    //   validation += "<span style='color:red;'>*</span> <span>Please select Active</span></br>"
    // }
    if(this.fg.value.FromCurrency && this.fg.value.ToCurrency != "" ) {
      if (this.fg.value.FromCurrency == this.fg.value.ToCurrency) {
        validation += "<span style='color:red;'>*</span> <span>From currency and to currency will be the same, so please choose a different currency to convert.</span></br>"
      }
    }

    if (validation != "") {
      Swal.fire(validation)
      return false;
    }

    let service = `${this.globals.APIURL}/ExchangeRate/SaveExchangeRatePair`;
    this.dataService.post(service, this.fg.value).subscribe((result: any) => {
      if (result.message == 'Success') {
        if (result.data == "Record already EXIST") {
          return Swal.fire(result.data);
        }
        if (this.isUpdate) Swal.fire(result.data);
        else Swal.fire(result.data);
        this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
      }
    }, error => { });
  }

  getExchangeParam() {
    var service = `${this.globals.APIURL}/ExchangeRate/GetExchangeRateList`; var payload: any = {
      exchangeRateID: this.fg.value.Id, FromCurrency: '', ToCurrency: '', Active: '1'
    }
    this.dataService.post(service, payload).subscribe((result: any) => {
      if (result.data.length > 0) {
        this.fg.patchValue(result.data[0]);
        this.fg.controls.Active.setValue(result.data[0].Active == true ? 1 : 0);
      }
    }, error => { });
  }

  onBack() {
    this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
  }
  reset() {
    this.router.navigate(['/views/exchange-rate-info/exchange-ratePair-info']);
  }

}
