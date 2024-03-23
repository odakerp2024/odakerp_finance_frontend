import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'util';
import { BOL, BLNo, BLTypes, BLContainer, PortVessel } from '../../../../model/boldata';
import { PaginationService } from '../../../../pagination.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { ExpbolService } from '../../../../services/expbol.service';
import { Title } from '@angular/platform-browser';
import { ExportbookingService } from '../../../../services/exportbooking.service';
import { CommonValues, MyAgencyDropdown, MyCntrTypeDropdown, MyCustomerDropdown, MyPortdrodown, MyTerminaldrodown } from '../../../../model/Admin';
import { Commodity, ContainerType, CTTypes, drodownVeslVoyage, GeneralMaster, Vessel, VoyageDetails, CurrencyMaster, ChargeTBMaster, MyAgency } from '../../../../model/common';
import { EnquiryService } from '../../../../services/enquiry.service';
import { on } from 'cluster';
declare let $: any;
import { HttpEventType } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { count } from 'console';

@Component({
    selector: 'app-attach',
    templateUrl: './attach.component.html',
    styleUrls: ['./attach.component.css']
})
export class AttachComponent implements OnInit {
    title = 'Booking Level Tasksr';
    BookingID = 0;
    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    bolForm: FormGroup;
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private titleService: Title, private bolservice: ExpbolService, private ES: EncrDecrServiceService, private fb: FormBuilder, public ps: PaginationService, private bss: ExportbookingService) { }

    ngOnInit() {
        $('.my-select').select2();
        this.createForm();
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

                // this.docForm.value.ID = queryString["ID"].toString();


            }

            this.BookingID = queryString["ID"].toString();
            /* this.bolForm.value.BLID = this.BLID;*/

        });
        this.titleService.setTitle(this.title);
        this.ViewBkgBasicList();


    }
    ViewBkgBasicList() {
        this.bolForm.value.ID = this.BookingID;
        this.bss.getExBookingValues(this.bolForm.value).subscribe(data => {

            this.bolForm.patchValue(data[0]);
            this.bkgNo = data[0].BookingNo;
            this.bkgparty = data[0].BookingParty;
            this.vesselname = data[0].VesselName;
            this.voyageno = data[0].VoyageNo;

            this.destination = data[0].Destination;
        });
    }
    btntabclick(tab) {



        var values = "ID: " + this.BookingID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/bookinglevel/bookings/bookings'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/bookinglevel/containers/containers'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/bookinglevel/bol/bol'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blrelease/blrelease'], { queryParams: { encrypted } });
        }
        else if (tab == 6) {
            this.router.navigate(['/views/exportmanager/bookinglevel/exphandling/exphandling'], { queryParams: { encrypted } });
        }
        else if (tab == 7) {
            this.router.navigate(['/views/exportmanager/bookinglevel/invoices/invoices'], { queryParams: { encrypted } });
        }
        else if (tab == 8) {
            this.router.navigate(['/views/exportmanager/bookinglevel/attach/attach'], { queryParams: { encrypted } });
        }
        else if (tab == 9) {
            this.router.navigate(['/views/exportmanager/bookinglevel/blallotment/blallotment'], { queryParams: { encrypted } });
        }


    }
    createForm() {
        this.bolForm = this.fb.group({
            ID: 0,
        });
    }

}
