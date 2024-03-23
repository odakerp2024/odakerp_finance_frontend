import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown, myTerminal } from '../../../../../model/Admin';
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
import { MYPrincipalTariff, mypricipalPort, myFreightDynamicGrid, myTerminalHandlingDynamicGrid, myLandsideChargesDynamicGrid } from 'src/app/model/PrincipalTraiff';
import { LinerName, GeneralMaster, ChargeTBMaster, BasicMaster, CurrencyMaster } from 'src/app/model/common';
import { Currency } from '../../../../../model/Party';
import { MyDynamicGridAttached, MyDynamicGridEmail } from '../../../../../model/PrincipalTraiff';
declare let $: any;
@Component({
    selector: 'app-alertmails',
    templateUrl: './alertmails.component.html',
    styleUrls: ['./alertmails.component.css']
})
export class AlertmailsComponent implements OnInit {

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private router: Router, private route: ActivatedRoute, private ms: MastersService, private manage: PrincipaltariffService,
        private service: PorttariffService
    ) { }
    formGrop: FormGroup;
    fillAttachedAgreementType: GeneralMaster[];
    DynamicGridEmail: Array<MyDynamicGridEmail> = [];
    errorMsg: string;
    RegId = 0;
    PR_AGREEMENT_ATTACH = "74";
    TID = null;
    HDArrayIndex = '';
    TIDValue = '';
    val: any = {};

    ngOnInit() {

        this.createform();
        this.InitDropdown();



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
            ID: "0",
            AlertTypeID: "",
            LineCode: "",
            LineName: "",
            EmailID: "",
            AlertMessage: "",
            ItemfreightComm: "",
            AlertMegId: ""
        });
    }

    ExistingvaluesBind(Idv) {


        this.formGrop.value.ID = Idv;
        this.manage.EditPrincipalTariffMaster(this.formGrop.value).pipe().subscribe(data => {
            this.formGrop.patchValue(data[0]);
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.existinggridBind();
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


    InitDropdown() {

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
        this.service.getGeneralList(this.PR_AGREEMENT_ATTACH).subscribe(data => {
            this.fillAttachedAgreementType = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    onSubmit() {

        var Validation = "";
        if (Validation != "") {
            Swal.fire(Validation);
            return;
        }
        var Items = [];
        var IDs = "0";
        for (let item of this.DynamicGridEmail) {
            if (typeof item.ID == "undefined")
                IDs = "0";
            else
                IDs = item.ID.toString();

            Items.push('Insert:' + IDs, item.AlertTypeID, item.EmailID);
        }


        this.formGrop.value.Items = Items.toString();
        this.manage.InsertPrincipalTariffEmailAlert(this.formGrop.value).subscribe((data) => {

            if (data.length > 0) {
                this.formGrop.value.ID = data[0].ID;
                Swal.fire(data[0].AlertMessage);
                this.existinggridBind();
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    existinggridBind() {

        this.manage.existingPrincipalEmail(this.formGrop.value).subscribe((data) => {
            if (data.length > 0) {
                this.DynamicGridEmail.length = 0;
                for (let item of data) {
                    this.DynamicGridEmail.push({
                        'ID': item.ID,
                        'AlertTypeID': item.AlertTypeID,
                        'EmailID': item.EmailID,
                        'AlertType': item.AlertType

                    })
                }
            }
            else {

                this.DynamicGridEmail.length = 0;
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }

    onSubmitAdd() {
        var validation = "";
        var ddlAttachType = $('#ddlAttachType').val();
        if (ddlAttachType == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Attachment Type</span></br>"
        }
        var txtEmailID = $('#txtEmailID').val();
        if (txtEmailID.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter EmailID</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }
        this.val = {
            AlertTypeID: $("#ddlAttachType").val(),
            AlertType: $("#ddlAttachType option:selected").text(),
            EmailID: $("#txtEmailID").val(),
        };

        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridEmail[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridEmail.push(this.val);
        }
        $("#ddlAttachType").select2().val(0, "").trigger("change");
        $("#txtEmailID").val("");
        this.HDArrayIndex = "";


    }

    OnclickSelectvalues(DynamicGrid, index) {

        this.HDArrayIndex = index;
        this.TID = this.DynamicGridEmail[index].ID;
        $("#ddlAttachType").select2().val(this.DynamicGridEmail[index].AlertTypeID).trigger("change");
        $("#txtEmailID").val(this.DynamicGridEmail[index].EmailID);
    }
}
