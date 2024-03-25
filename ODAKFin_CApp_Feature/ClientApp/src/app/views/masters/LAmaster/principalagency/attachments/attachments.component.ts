import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown, myTerminal } from '../../../../../model/Admin';
import { MyDynamicGridAttached } from '../../../../../model/PrincipalTraiff';
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
declare let $: any;

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private router: Router, private route: ActivatedRoute, private ms: MastersService, private manage: PrincipaltariffService,
        private service: PorttariffService
    ) { }
    AttachedformGrop: FormGroup;
    fillAttachedAgreementType: GeneralMaster[];
    DynamicGridAccLink: Array<MyDynamicGridAttached> = [];
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
                this.AttachedformGrop.value.ID = queryString["ID"].toString();
                //this.ExistingvaluesBind(queryString["ID"].toString());
            }
        });
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
    AddAttach() {
        var validation = "";

        var ddlAttachType = $('#ddlAttachType').val();
        if (ddlAttachType == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Attachment Type</span></br>"
        }

        var txtAttachFile = $('#txtAttachFile').val();
        if (txtAttachFile.length == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Upload File</span></br>"
        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        this.val = {
            AttachID: $("#ddlAttachType").val(),
            AttachName: $("#ddlAttachType option:selected").text(),
            AttachFile: $("#txtAttachFile").val(),
        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGridAccLink[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGridAccLink.push(this.val);
        }

        $("#ddlAttachType").select2().val(0, "").trigger("change");
        $("#txtAttachFile").val("");

        this.HDArrayIndex = "";
    }


    OnSubmitFileAttached() {
        var Items = [];
        for (let item of this.fillAttachedAgreementType) {
            var SIDv = 0;
            //if (item. != "") {
            //    if (typeof item.ID == "undefined")
            //        SIDv = 0;
            //    else
            //        SIDv = item.ID;
            //    //Items.push('Insert:' + SIDv, item, item.CommissionTypeID, item.ShipmentTypeID, item.ChargeTypeID, 0, 0,
            //     //   item.CurrencyID, item.CntrTypeID, item.Amount, 0, 0, 0, 0, 1
            //    );
            //}
        }
        this.AttachedformGrop.value.Items = Items.toString();
        this.manage.InsertPrincipalTariffdtls(this.AttachedformGrop.value).subscribe((data) => {

            if (data.length > 0) {
                //this.formGrop.value.ID = data[0].ID;
                //Swal.fire(data[0].AlertMessage);
                //this.existinggridBind();
            }
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    createform() {

        this.AttachedformGrop = this.fb.group({
            ID: 0,
            AlertMegId: ""
        });
    }

    btntabclick(tab) {


        var values = "ID: " + this.AttachedformGrop.value.ID;
        
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
