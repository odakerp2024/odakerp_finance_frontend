import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VesselTaskMaster } from '../../../../model/vesseltask';
import { PaginationService } from '../../../../pagination.service';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
import { VesseltaskService } from '../../../../services/vesseltask.service';

@Component({
  selector: 'app-vstdr',
  templateUrl: './vstdr.component.html',
  styleUrls: ['./vstdr.component.css']
})
export class VstdrComponent implements OnInit {

    prealert: VesselTaskMaster[];
    pager: any = {};
    pagedItems: any[];
    private allItems: any[];

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, public ps: PaginationService, private vsl: VesseltaskService, private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.vesselForm = this.fb.group({
                //VesselID: params['VesselID'],
                //VoyageID: params['VoyageID'],
            });

        });
    }

    vesselForm: FormGroup;
    VesselID = 0;
    VoyageID = 0;

    chkVessel = 0;
    chkVoyage = 0;
    chkPrincipal = 0;
    chkAgent = 0;

    ngOnInit() {

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

            if (queryString["VesselID"] != 0) {


                this.VesselID = queryStringVs["VesselID"];
                this.VoyageID = queryStringVy["VoyageID"];
            }
        });

        this.tdrstatus();
    }

    tdrstatus() {
        this.vesselForm.value.VesselID = this.VesselID;
        this.vesselForm.value.VoyageID = this.VoyageID;
        this.vsl.getPrealertStatusBind(this.vesselForm.value).subscribe(data => {
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

        if (checked > 1) {
            Swal.fire({
                title: 'More than One Principal(s) are checked',
                showDenyButton: false,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.tdrstatus();
                }
            })

            return false;
        }
        if (checked == 0) {
            Swal.fire("Please check a Principal.");
        }
        if (checked == 1) {
            var values = "VesselID: " + this.chkVessel + "&VoyageID:" + this.chkVoyage + "&PrincipalID:" + this.chkPrincipal + "&PODAgentID:" + this.chkAgent;
            var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
            this.router.navigate(['/views/exportmanager/vessellevel/vstdr/tdrfinal/tdrfinal/'], { queryParams: { encrypted } });
        }
    }

    checkbutton(VesselID, VoyageID, PrincipalID, AgentID) {
        this.chkVessel = VesselID;
        this.chkVoyage = VoyageID;
        this.chkPrincipal = PrincipalID;
        this.chkAgent = AgentID;
    }

}
