import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookingMaster } from '../../../../model/booking';
import { City, Country, Port } from '../../../../model/common';
import { MyBkgLevel, CommonValues } from '../../../../model/MyBkgLevel';
import { PaginationService } from '../../../../pagination.service';
import { BkglevelService } from '../../../../services/bkglevel.service';
import { BookingService } from '../../../../services/booking.service';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
import { RateapprovalService } from '../../../../services/rateapproval.service';
import { Title } from '@angular/platform-browser';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { MyCustomerDropdown } from 'src/app/model/Admin';
declare let $: any;

@Component({
    selector: 'app-bookinglevelview',
    templateUrl: './bookinglevelview.component.html',
    styleUrls: ['./bookinglevelview.component.css']
})
export class BookinglevelviewComponent implements OnInit {
    title = 'Booking Level Tasks';

    constructor(private fb: FormBuilder, private bookingservice: BookingService, private uk: EnquiryService, private titleService: Title, private router: Router, private bks: BkglevelService, public ps: PaginationService, private rs: RateapprovalService, private route: ActivatedRoute, private ES: EncrDecrServiceService,) { }
    searchForm: FormGroup;
    pager: any = {};
    pagedItems: any[];
    private allItems: any[];
    dsPorts: Port[];
    dsBOL: MyBkgLevel[];
    dsBooking: MyBkgLevel[];
    dsVoyage: MyBkgLevel[];
    dsBkgParty: MyBkgLevel[];
    dsCntrNos: MyBkgLevel[];
    dsUserList: MyBkgLevel[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    VesselID = 0;
    VoyageID = 0;
    ngOnInit() {
        this.titleService.setTitle(this.title);

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
        this.createForm();

        this.onInitalBinding();

        var queryString = new Array();
        var queryStringVoy = new Array();
        this.route.queryParams.subscribe(params => {

            var Parameter = this.ES.get(localStorage.getItem("EncKey"), params['encrypted']);
            var KeyParavalue = Parameter.split('&');
            var KeyPara1 = "";
            var KeyPara = "";
            for (var i = 0; i < KeyParavalue.length; i++) {
                if (i == 0)
                    var KeyPara = KeyParavalue[0].split(',');
                if (i == 1)
                    var KeyPara1 = KeyParavalue[1].split(',');
            }


            for (var i = 0; i < KeyPara.length; i++) {
                var key = KeyPara[i].split(':')[0];
                var value = KeyPara[i].split(':')[1];
                queryString[key] = value;

            }

            for (var i = 0; i < KeyPara1.length; i++) {
                var key = KeyPara1[i].split(':')[0];
                var value = KeyPara1[i].split(':')[1];
                queryStringVoy[key] = value;

            }


            this.VesselID = queryString["ID"].toString();
            this.VoyageID = queryStringVoy["VoyageID"].toString();
            if (queryString["ID"] != null) {

                this.searchForm = this.fb.group({
                    ID: queryString["ID"].toString(),

                });

                this.createForm();
                this.onInitalBinding();
                $('#ddlVslVoy').select2().val(this.VoyageID);
                this.ViewBookinglevelList();
            }


        });

        this.createForm();
        this.onInitalBinding();
        this.ViewBookinglevelList();
        this.clearSearch();
    }
    onInitalBinding() {

        this.OnBindPorts();
        this.OnBindBookingNoList();
        this.OnBindBLList();
        this.OnBindBkgPartyList();
        this.OnBindVesselVoyList();
        this.OnBindCntrNoList();
        this.OnBindUserDetails();
        this.OnBindUserOffice();
    }


    OnBindPorts() {
        this.rs.getPortMasterBind(this.searchForm.value).subscribe(data => {
            this.dsPorts = data;
        });
    }
    OnBindBookingNoList() {
        this.bks.getBookingNoList(this.searchForm.value).subscribe(data => {
            this.dsBooking = data;
        });
    }
    OnBindBLList() {
        this.bks.getBLNoList(this.searchForm.value).subscribe(data => {
            this.dsBOL = data;
        });
    }
    OnBindBkgPartyList() {
        this.bks.getBkgPartyList(this.searchForm.value).subscribe(data => {
            this.dsBkgParty = data;
        });
    }
    OnBindVesselVoyList() {
        this.bks.getVesselVoyList(this.searchForm.value).subscribe(data => {
            this.dsVoyage = data;
        });
    }
    OnBindCntrNoList() {
        this.bks.getCntrNoList(this.searchForm.value).subscribe(data => {
            this.dsCntrNos = data;
        });
    }
    OnBindUserDetails() {
        this.bks.getUserDetails(this.searchForm.value).subscribe(data => {
            this.dsUserList = data;
        });
    }
    OnBindUserOffice() {
        this.uk.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            BookingID: 0,
            LoadPortID: 0,
            BLID: 0,
            CustomerID: 0,
            DestinationID: 0,
            CntrID: 0,
            ETDTo: '',
            ETDFrom: '',
            SalesPersonID: 0,
            VoyageID: 0,
            OfficeCode: 0,

        });
    }
    ViewBookinglevelList() {

        this.searchForm.value.ID = this.VesselID;
        this.searchForm.value.VoyageID = this.VoyageID;
        this.bks.viewBkglevelTaskSearch(this.searchForm.value).subscribe(data => {
            //this.searchForm.patchValue(data[0]);
            // $('#ddlVslVoy').select2().val(data[0].VoyageID);
            this.allItems = data;
            this.setPage(1);
        });
    }
    onSubmit() {
        this.searchForm.value.ID = this.VesselID;
        this.searchForm.value.BookingID = $('#ddlBooking').val();
        this.searchForm.value.LoadPortID = $('#ddlPOL').val();
        this.searchForm.value.BLID = $('#ddlBL').val();
        this.searchForm.value.CustomerID = $('#ddlBkgParty').val();
        this.searchForm.value.DestinationID = $('#ddlPOD').val();
        this.searchForm.value.CntrID = $('#ddlContainer').val();
        this.searchForm.value.SalesPersonID = $('#ddlUser').val();
        this.searchForm.value.VoyageID = $('#ddlVslVoy').val();
        this.searchForm.value.OfficeCode = $('#OfficeCode1').val();
        this.ViewBookinglevelList();


        this.bks.viewBkglevelTaskSearch(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });

    }

    clearSearch() {

        this.searchForm.value.ID = this.VesselID;
        this.searchForm.value.BookingID = $('#ddlBooking').val();
        this.searchForm.value.LoadPortID = $('#ddlPOL').val();
        this.searchForm.value.BLID = $('#ddlBL').val();
        this.searchForm.value.CustomerID = $('#ddlBkgParty').val();
        this.searchForm.value.DestinationID = $('#ddlPOD').val();
        this.searchForm.value.CntrID = $('#ddlContainer').val();
        this.searchForm.value.SalesPersonID = $('#ddlUser').val();
        this.searchForm.value.VoyageID = $('#ddlVslVoy').val();
        this.searchForm.value.OfficeCode = $('#OfficeCode1').val();

        this.createForm();
        $('#ddlBooking').val(0).trigger("change");
        $('#ddlPOL').val(0).trigger("change");
        $('#ddlBL').val(0).trigger("change");
        $('#ddlBkgParty').val(0).trigger("change");
        $('#ddlPOD').val(0).trigger("change");
        $('#ddlContainer').val(0).trigger("change");
        $('#ddlUser').val(0).trigger("change");
        $('#ddlVslVoy').val(0).trigger("change"),
            $('#OfficeCode1').val(0).trigger("change");
        this.ViewBookinglevelList();

    }
    setPage(page: number) {

        this.pager = this.ps.getPager(this.allItems.length, page);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }


    OnClickEdit(IDv) {
        var values = "ID: " + IDv;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/exportmanager/bookinglevel/bookings/bookings'], { queryParams: { encrypted } });

    }
}
