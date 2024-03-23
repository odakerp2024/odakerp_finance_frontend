import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MastersService } from '../../../../../services/masters.service';
import { PrincipaltariffService } from '../../../../../services/principaltariff.service';
import { City, State } from '../../../../../model/common';
import { OrgService } from '../../../../../services/org.service';
import { Country } from 'src/app/model/Organzation';
declare let $: any;

@Component({
  selector: 'app-principaldetails',
  templateUrl: './principaldetails.component.html',
  styleUrls: ['./principaldetails.component.css']
})
export class PrincipaldetailsComponent implements OnInit {

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private router: Router, private service: OrgService, private route: ActivatedRoute, private ms: MastersService, private manage: PrincipaltariffService) { }
    principalformGrop: FormGroup;
    errorMsg: string;
    RegId = 0;
    dscountryItem: Country[];
    dsCityItem: City[];
    dsStateItem: State[];

    ngOnInit()
    {
        this.createform();
        this.InitBind();
        var queryString = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split(',');
            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;
            }
            if (queryString["ID"] != null)
            {
                this.ExistingvaluesBind(queryString["ID"].toString());
            }

        });

        $('#ddlCountryID').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountryID").val());
        });
    }
    createform() {

        this.principalformGrop = this.fb.group({
            ID: 0,
            RegID: 0,
            LineCode: "",
            LineName: "",
            CountryID: 0,
            CityID: 0,
            StateID: 0,
            TaxGST: "",
            PinCode: "",
            Email: "",
            TelNo: "",
            Status: 0,
            Address: "",
            Note: "",
            AlertMessage:""
        });
    }

    InitBind() {
        $('.my-select').select2();
        $(document).on('select2:open', (e) => {
            const selectId = e.target.id

            $(".select2-search__field[aria-controls='select2-" + selectId + "-results']").each(function (
                key,
                value,
            ) {
                value.focus();
            })
        })
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });

    }
    CountryChanged(countryval)
    {

        this.principalformGrop.value.CountryID = countryval;
        this.service.getCitiesBindByCountry(this.principalformGrop.value).subscribe(data => {
            this.dsCityItem = data;
        });
        this.service.getStatesBindByCtry(this.principalformGrop.value).subscribe(data => {
            this.dsStateItem = data;

        });
    }

    onSubmitRecordSaved() {

        var validation = "";

        if (this.principalformGrop.value.LineCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Line Code</span></br>"
        }
        if (this.principalformGrop.value.LineName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Line Name</span></br>"
        }

        if ($('#ddlCountryID').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
        }
        if ($('#ddlCityID').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select City</span></br>"
        }

        if (this.principalformGrop.value.Address == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Address</span></br>"
        }
        if (this.principalformGrop.value.EmailDetail == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Email ID</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.principalformGrop.value.Status = $('#ddlStatus').val();
        this.principalformGrop.value.CityID = $('#ddlCityID').val();
        this.principalformGrop.value.CountryID = $('#ddlCountryID').val();
        if ($('#ddlStateID').val() != null)
            this.principalformGrop.value.StateID = $('#ddlStateID').val();
        else
            this.principalformGrop.value.StateID = 0;

        this.manage.InsertPrincipalTariff(this.principalformGrop.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)

        },(error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });

    }

    ExistingvaluesBind(Idv) {


        this.principalformGrop.value.ID = Idv;
        this.manage.EditPrincipalTariffMaster(this.principalformGrop.value).pipe().subscribe(data => {

            this.principalformGrop.patchValue(data[0]);
            $('#ddlCountryID').select2().val(data[0].CountryID);
            this.CountryChanged(data[0].CountryID);
            $('#ddlCityID').select2().val(data[0].CityID);
            $('#ddlStateID').select2().val(data[0].StateID);
            $('#ddlStatus').select2().val(data[0].Status);

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    btntabclick(tab) {


        var values = "ID: " + this.principalformGrop.value.ID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Principaldetails/Principaldetails'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Portdetails/Portdetails'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Principalagreement/Principalagreement'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Attachments/Attachments'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/masters/LAmaster/Principalagency/Alertmails/Alertmails'], { queryParams: { encrypted } });
        }

    }
    

}
interface Status {
    value: string;
    viewValue: string;
}
