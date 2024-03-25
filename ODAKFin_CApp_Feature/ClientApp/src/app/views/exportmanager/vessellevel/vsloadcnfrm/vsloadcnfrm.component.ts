import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationService } from '../../../../pagination.service';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
import { VesseltaskService } from '../../../../services/vesseltask.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
    selector: 'app-vsloadcnfrm',
    templateUrl: './vsloadcnfrm.component.html',
    styleUrls: ['./vsloadcnfrm.component.css']
})
export class VsloadcnfrmComponent implements OnInit {
    title = 'Vessel Tasks - Loading Confirmation ';
    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private titleService: Title, public uk: VesseltaskService, public ps: PaginationService, private vsl: VesseltaskService, private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.vesselForm = this.fb.group({
                VesselID: params['VesselID'],
                VoyageID: params['VoyageID'],
            });

        });
    }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    vesselForm: FormGroup;
    VesselID = 0;
    VoyageID = 0;


    ngOnInit() {
        this.titleService.setTitle(this.title);

        var queryString = new Array();
        var queryStringVs = new Array();
        var queryStringVy = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyPara = Parameter.split('&');
            var KeyPara1 = "";
            var KeyPara2 = "";
            for (var i = 0; i < KeyPara.length; i++) {
                if (i == 0)
                    var KeyPara1 = KeyPara[0].split(',');
                if (i == 1)
                    var KeyPara2 = KeyPara[1].split(',');
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

            if (queryString["VesselID"] != "") {

                this.vesselForm = this.fb.group({
                    VesselID: queryStringVs["VesselID"],

                });
                this.VesselID = queryStringVs["VesselID"];
                this.VoyageID = queryStringVy["VoyageID"];
            }

        });
        this.refreshDepList();

    }
    refreshDepList() {
        this.vesselForm.value.VesselID = this.VesselID;
        this.vesselForm.value.VoyageID = this.VoyageID;
        this.uk.getVesselLoadCnfrmViewlist(this.vesselForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }
    OnNextClick() {
        var values = "VesselID: " + this.VesselID + "&VoyageID:" + this.VoyageID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/exportmanager/vessellevel/vsloadcnfrm/loadcnfrmsts/loadcnfrmsts/'], { queryParams: { encrypted } });
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
            this.router.navigate(['/views/exportmanager/vessellevel/vsloadcnfrm/loadcnfrm/'], { queryParams: { encrypted } });
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
    setPage(page: number) {
        //if (page < 1 || page > this.pager.totalPages) {
        //    return;
        //}

        // get pager object from service
        this.pager = this.ps.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}
