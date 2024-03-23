import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'util';
import { BLNo, DynamicNavioPDF } from '../../../../model/boldata';

import { PaginationService, } from '../../../../pagination.service';

import { PdfService } from 'src/app/services/pdf.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { ExpbolService } from '../../../../services/expbol.service';
import { Title } from '@angular/platform-browser';
import { EnquiryService } from '../../../../services/enquiry.service';
import { MyCustomerDropdown } from '../../../../model/Admin';
import { ExportbookingService } from '../../../../services/exportbooking.service';
declare let $: any;

@Component({
    selector: 'app-blrelease',
    templateUrl: './blrelease.component.html',
    styleUrls: ['./blrelease.component.css']
})
export class BlreleaseComponent implements OnInit {
    title = 'Booking Level Tasksr';
    BookingID = 0;
    navioFilename: DynamicNavioPDF[];
    myControl = new FormControl('');

    printid = 0;
    BLID = 0;
    MainID = 0;
    bkgNo: string = '';
    bkgparty: string = '';
    destination: string = '';
    vesselname: string = '';
    voyageno: string = '';
    loadPort: string = '';
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private titleService: Title, private pdf: PdfService, private bs: ExpbolService, private ES: EncrDecrServiceService, private fb: FormBuilder, public ps: PaginationService, private bss: ExportbookingService) {




        //this.route.queryParams.subscribe(params => {


        //    this.BLID = params['BLId'];


        //    this.bolform = this.fb.group({

        //        BLID: params['BLId'],

        //    });

        //});

    }
    fillPricibleMasterAllvalues: MyCustomerDropdown[];
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    bolform: FormGroup;
    blNoview: BLNo[];

    isLoading?: boolean;
    ngOnInit() {
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
        var queryString = new Array();
        var queryStringMain = new Array();
        this.route.queryParams.subscribe(params => {
            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyParavalue = Parameter.split('&');
            var KeyPara1 = "";
            var KeyPara = "";
            var KeyPara2 = "";
            for (var i = 0; i < KeyParavalue.length; i++) {
                if (i == 0)
                    var KeyPara = KeyParavalue[0].split(',');
                if (i == 1)
                    var KeyPara1 = KeyParavalue[1].split(',');
                if (i == 2)
                    var KeyPara2 = KeyParavalue[2].split(',');
            }


            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;

            }

            for (var i = 0; i < KeyPara1.length; i++) {
                var key = KeyPara1[i].split(':')[0];
                var value = KeyPara1[i].split(':')[1];
                queryStringMain[key] = value;

            }



            if (queryString["BLID"] != null) {
                this.bolform = this.fb.group({
                    BLID: queryString["BLID"].toString(),

                });


                this.MainID = queryStringMain["MainID"];


                this.createForm();
            }
        });



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

                this.BookingID = queryString["ID"].toString();

            }

        });
        this.titleService.setTitle(this.title);

        this.createForm();
        this.Binddropdowns();
        this.BLNumberList();
        this.ViewBkgBasicList();
    }
    ViewBkgBasicList() {
        this.bolform.value.ID = this.BookingID;
        this.bss.getExBookingValues(this.bolform.value).subscribe(data => {
            this.bolform.patchValue(data[0]);
            this.bkgNo = data[0].BookingNo;
            this.bkgparty = data[0].BookingParty;
            this.vesselname = data[0].VesselName;
            this.voyageno = data[0].VoyageNo;
            this.loadPort = data[0].LoadPort;
            this.destination = data[0].Destination;
        });
    }
    Binddropdowns() {
        this.OnBindDropdownPrincipalMaster();
    }
    OnBindDropdownPrincipalMaster() {

        this.service.getPrincibleList().subscribe(data => {
            this.fillPricibleMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    BLNumberList() {
        this.bolform.value.BkgId = this.BookingID;

        this.bs.getBLNumberView(this.bolform.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }
    createForm() {
        this.bolform = this.fb.group({
            ID: 0,
            LineName: '',
            ChkBLID: 0

        });

    }
    BlNumberChk(idv) {

        this.BLID = idv;
    }
    BLPrint() {
        $('#PrintModal').modal('show');

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
    setPage(page: number) {

        this.pager = this.ps.getPager(this.allItems.length, page);


        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    naviopdf() {

      /*  window.open("assets/pdfFiles/acl/177_test.pdf");*/
        this.bolform.value.BLID = this.BLID;

        this.bolform.value.PrintID = $('#ddlBLRelease').val()
            this.pdf.getnavioPDF(this.bolform.value).subscribe(data => {

                window.open("assets/pdfFiles/navio/" + data[0].navioFilename + ".pdf");
               
            });
        }
    }


