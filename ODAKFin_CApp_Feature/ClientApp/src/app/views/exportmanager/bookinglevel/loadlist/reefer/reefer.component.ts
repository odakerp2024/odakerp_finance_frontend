import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookingMaster } from '../../../../../model/booking';
import { City, Country, Port } from '../../../../../model/common';
import { MyBkgLevel, CommonValues, MyBkgDocs } from '../../../../../model/MyBkgLevel';
import { PaginationService } from '../../../../../pagination.service';
import { BkglevelService } from '../../../../../services/bkglevel.service';
import { BookingService } from '../../../../../services/booking.service';
import { EncrDecrServiceService } from '../../../../../services/encr-decr-service.service';
import { RateapprovalService } from '../../../../../services/rateapproval.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-reefer',
    templateUrl: './reefer.component.html',
    styleUrls: ['./reefer.component.css']
})
export class ReeferComponent implements OnInit {
    title = 'Booking Level Tasks';
    reeferForm: FormGroup;
    BookingID = 0;
    dsPorts: Port[];
    dsDocs: MyBkgDocs[];

    constructor(private fb: FormBuilder, private bookingservice: BookingService, private titleService: Title, private router: Router, private bks: BkglevelService, public ps: PaginationService, private rs: RateapprovalService, private route: ActivatedRoute, private ES: EncrDecrServiceService,) { }

    ngOnInit() {
        this.titleService.setTitle(this.title);
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
                //this.oogForm.value.ID = queryString["ID"].toString();
                this.BookingID = queryString["ID"].toString();
            }

        });
        this.createForm();
        this.ViewDocList();
    }
    ViewDocList() {
        this.reeferForm.value.ID = this.BookingID;
        this.bks.getDocsreeferlist(this.reeferForm.value).subscribe(data => {
            this.dsDocs = data;

        });
    }
    createForm() {
        this.reeferForm = this.fb.group({
            ID: 0,
            AttachType: 0,
            AttachFile: '',

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

    }

    doctab(tab) {


        var values = "ID: " + this.BookingID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/haz/haz'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/oog/oog'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/reefer/reefer'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/bookinglevel/loadlist/odo/odo'], { queryParams: { encrypted } });
        }

    }
}