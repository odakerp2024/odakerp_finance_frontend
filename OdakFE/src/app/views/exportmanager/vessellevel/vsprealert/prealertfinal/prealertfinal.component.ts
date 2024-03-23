import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VesselTaskMaster } from '../../../../../model/vesseltask';
import { PaginationService } from '../../../../../pagination.service';
import { EncrDecrServiceService } from '../../../../../services/encr-decr-service.service';
import { VesseltaskService } from '../../../../../services/vesseltask.service';
declare let $: any;

@Component({
  selector: 'app-prealertfinal',
  templateUrl: './prealertfinal.component.html',
  styleUrls: ['./prealertfinal.component.css']
})
export class PrealertfinalComponent implements OnInit {


    prealert: VesselTaskMaster[];
    pager: any = {};
    pagedItems: any[];
    private allItems: any[];

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, public ps: PaginationService, private vsl: VesseltaskService, private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.vesselForm = this.fb.group({
                VesselID: params['VesselID'],
                VoyageID: params['VoyageID'],
                PrincipalID: params['PrincipalID'],
                PODAgentID: params['PODAgentID'],
            });

        });
    }

    vesselForm: FormGroup;
    VesselID = 0;
    VoyageID = 0;
    PrincipalID = 0;
    PODAgentID = 0;

    ngOnInit() {
        $('.my-select').select2();
        var queryString = new Array();
        var queryStringVs = new Array();
        var queryStringVy = new Array();
        var queryStringPr = new Array();
        var queryStringAg = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split('&');
            var KeyPara1 = "";
            var KeyPara2 = "";
            var KeyPara3 = "";
            var KeyPara4 = "";
            for (var i = 0; i < KeyPara.length; i++) {
                if (i == 0)
                    var KeyPara1 = KeyPara[0].split(',');
                if (i == 1)
                    var KeyPara2 = KeyPara[1].split(',');
                if (i == 2)
                    var KeyPara3 = KeyPara[2].split(',');
                if (i == 3)
                    var KeyPara4 = KeyPara[3].split(',');
            }

            for (var i = 0; i < KeyPara1.length; i++) {
                var key = KeyPara1[i].split(':')[0];
                var value = KeyPara1[i].split(':')[1];
                queryStringVs[key] = value;

            }

            for (var i = 0; i < KeyPara2.length; i++) {
                var key = KeyPara2[i].split(':')[0];
                var value = KeyPara2[i].split(':')[1];
                queryStringVy[key] = value;

            }

            for (var i = 0; i < KeyPara3.length; i++) {
                var key = KeyPara3[i].split(':')[0];
                var value = KeyPara3[i].split(':')[1];
                queryStringPr[key] = value;

            }

            for (var i = 0; i < KeyPara4.length; i++) {
                var key = KeyPara4[i].split(':')[0];
                var value = KeyPara4[i].split(':')[1];
                queryStringAg[key] = value;

            }

            if (queryString["VesselID"] != 0) {

                this.vesselForm = this.fb.group({
                    VesselID: queryStringVs["VesselID"],

                });
                this.VesselID = queryStringVs["VesselID"];
                this.VoyageID = queryStringVy["VoyageID"];
                this.PrincipalID = queryStringPr["PrincipalID"];
                this.PODAgentID = queryStringAg["PODAgentID"];
            }

        });

        this.prealertfinal();
    }

    prealertfinal() {
        this.vesselForm.value.VoyageID = this.VoyageID;
        this.vesselForm.value.PrincipalID = this.PrincipalID;
        this.vesselForm.value.PODAgentID = this.PODAgentID;
        this.vsl.getPrealertFinalBind(this.vesselForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    setPage(page: number) {
        this.pager = this.ps.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    btntabclick(tab) {

        var values = "VesselID: " + this.VesselID + "&VoyageID:" + this.VoyageID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/vessellevel/vsloadlist/vsloadlist/'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsprealert/vsprealert/'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsloadcnfrm/vsloadcnfrm/'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsonboard/vsonboard/'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/exportmanager/vessellevel/vstdr/vstdr/'], { queryParams: { encrypted } });
        }
        else if (tab == 6) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsexphandling/vsexphandling/'], { queryParams: { encrypted } });
        }
    }

    onclickNext() {
        var checked = $("#datatable input[type=checkbox]:checked").length;

        if (checked == 0) {
            Swal.fire("Please attach one BOL Number");
        }
        else {
            var values = "VesselID: " + this.VesselID + "&VoyageID:" + this.VoyageID + "&PrincipalID:" + this.PrincipalID + "&PODAgentID:" + this.PODAgentID;
            var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
            this.router.navigate(['/views/exportmanager/vessellevel/vsprealert/prealertmail/prealertmail/'], { queryParams: { encrypted } });
        }
    }

}
