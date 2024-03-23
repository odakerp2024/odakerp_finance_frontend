import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown } from '../../../../../model/Admin';
import { PorttariffService } from '../../../../../services/porttariff.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MastersService } from '../../../../../services/masters.service';
import { PrincipaltariffService, } from '../../../../../services/principaltariff.service';
import { OrgService } from '../../../../../services/org.service';
import { MYPrincipalTariff, mypricipalPort } from 'src/app/model/PrincipalTraiff';
declare let $: any;

@Component({
  selector: 'app-portdetails',
  templateUrl: './portdetails.component.html',
  styleUrls: ['./portdetails.component.css']
})
export class PortdetailsComponent implements OnInit {

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private router: Router, private route: ActivatedRoute, private ms: MastersService, private manage: PrincipaltariffService,
        private service: PorttariffService
    ) { }
    formGrop: FormGroup;
    errorMsg: string;
    RegId = 0;
    PortAllvalues: MyPortdrodown[];
    DynamicGrid: Array<mypricipalPort> = [];
    newDynamicGrid: any = {};


    ngOnInit() {

        this.createform();

        var queryString = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split(',');
            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;
            }
            if (queryString["ID"] != null) {
                this.ExistingvaluesBind(queryString["ID"].toString());
            }
        });
    }


    createform() {

        this.formGrop = this.fb.group({
            ID: 0,
            LineCode: "",
            LineName:"",
            AlertMessage: ""
        });
    }

    ExistingvaluesBind(Idv) {


        this.formGrop.value.ID = Idv;
        this.manage.EditPrincipalTariffMaster(this.formGrop.value).pipe().subscribe(data => {
        this.formGrop.patchValue(data[0]);
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.newDynamicGrid = {PortName: '', AgencyName: ''};
        this.DynamicGrid.push(this.newDynamicGrid);
        this.manage.PrincipalTariffPortViewMaster(this.formGrop.value).pipe().subscribe(data => {
            if (data.length > 0) {
                this.DynamicGrid.length = 0;
                for (let item of data) {
                    this.DynamicGrid.push({
                        'PortName': item.PortName,
                        'AgencyName': item.AgencyName
                    });
                }
            }

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


    }


    btntabclick(tab) {


        var values = "ID: " + this.formGrop.value.ID;
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
