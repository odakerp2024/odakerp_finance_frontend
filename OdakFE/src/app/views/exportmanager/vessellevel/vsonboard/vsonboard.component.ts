import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { VesselTaskMaster } from '../../../../model/vesseltask';
import { PaginationService } from '../../../../pagination.service';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
import { VesseltaskService } from '../../../../services/vesseltask.service';
declare let $: any;

@Component({
  selector: 'app-vsonboard',
  templateUrl: './vsonboard.component.html',
  styleUrls: ['./vsonboard.component.css']
})
export class VsonboardComponent implements OnInit {

    prealert: VesselTaskMaster[];
    pager: any = {};
    pagedItems: any[];
    private allItems: any[];

    vesselForm: FormGroup;
    VesselID = 0;
    VoyageID = 0;
    PrincipalID = 0;
    PODAgentID = 0;

    public CusEmail: string = "";
    public BLNumber: string = "";
    public CustomerID: string = "";

    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, public ps: PaginationService, private vsl: VesseltaskService, private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.vesselForm = this.fb.group({
                VesselID: params['VesselID'],
                VoyageID: params['VoyageID'],
            });

        });
    }


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

        this.OnboardConfirm();
    }


    createForm() {
        this.vesselForm = this.fb.group({
            ID: 0,
            VesselID: 0,
            VoyageID: 0,
            CustomerID: 0,
            BLNumber: '',
            EmailID: '',
        });
    }

    OnboardConfirm() {
        this.vesselForm.value.VesselID = this.VesselID;
        this.vesselForm.value.VoyageID = this.VoyageID;
        this.vsl.getOnboardConfirmBind(this.vesselForm.value).subscribe(data => {
            this.CusEmail = data[0].CusEmail;
            this.BLNumber = data[0].BLNumber;
            this.CustomerID = data[0].CustomerID;

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

    mailSent() {
        Swal.fire({
            title: 'Customer OnBoard Confirmation Sent Successfully',
            showDenyButton: false,
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                this.OnboardConfirm();
            }
        });
    }

    sendMail() {
        this.vesselForm.value.VesselID = this.VesselID;
        this.vesselForm.value.VoyageID = this.VoyageID;
        this.vsl.getOnboardEmailSend(this.vesselForm.value).subscribe(data => {

        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
        delay(500);
        this.mailSent();
    }

    onClickEdit() {
        $('#EmailEntry').modal('show');
    }

    onSaveEmail() {
        alert($('#txtEmail').val());
        this.vesselForm.value.VesselID = this.VesselID;
        this.vesselForm.value.VoyageID = this.VoyageID;
        this.vesselForm.value.BLNumber = this.BLNumber;
        this.vesselForm.value.CustomerID = this.CustomerID;
        this.vesselForm.value.EmailID = $('#txtEmail').val();
        this.vsl.insertOnboardMail(this.vesselForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

}
