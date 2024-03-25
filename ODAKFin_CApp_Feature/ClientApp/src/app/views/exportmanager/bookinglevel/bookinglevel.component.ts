import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BookingMaster } from '../../../model/booking';
import { MyBkgLevel, CommonValues } from '../../../model/MyBkgLevel';
import { PaginationService } from '../../../pagination.service';
import { BkglevelService } from '../../../services/bkglevel.service';
import { BookingService } from '../../../services/booking.service';
import { EncrDecrServiceService } from '../../../services/encr-decr-service.service';
import { MyCustomerDropdown } from 'src/app/model/Admin';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
    selector: 'app-bookinglevel',
    templateUrl: './bookinglevel.component.html',
    styleUrls: ['./bookinglevel.component.css']
})
export class BookinglevelComponent implements OnInit {
    title = 'Booking Level Tasks';
    SearchTypes: CommonValues[];
    public ShowVessel: boolean = true;
    public ShowBol: boolean = true;
    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, private uk: EnquiryService, private titleService: Title, private bookingservice: BookingService, private router: Router, private bks: BkglevelService, public ps: PaginationService,) { }
    private allItems: any[];
    bookingview: MyBkgLevel[];
    bollevelview: MyBkgLevel[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    searchForm: FormGroup;
    pager: any = {};
    pagedItems: any[];

    ngOnInit() {

        this.titleService.setTitle(this.title);
        this.createForm();
        this.ViewBookinglevelList();
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
        this.ShowVessel = true;
        this.ShowBol = false;
        this.onInitDropdown("1");
        this.onInitDropdownOffice();
    }

    onInitDropdown(value) {

        if (value == "1") {
            this.SearchTypes = [
                { ID: '1', Desc: 'Booking Number' },
                { ID: '2', Desc: 'Voyage Number' },
                { ID: '3', Desc: 'BL Number' },
                { ID: '4', Desc: 'Container Number' },
                { ID: '5', Desc: 'Invoice Number' },
            ];
        }
        else {
            this.SearchTypes = [
                { ID: '1', Desc: 'Booking Number' },
                { ID: '2', Desc: 'BL Number' },


            ];
        }
    }
    onInitDropdownOffice() {
        this.uk.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    StatusChange(value) {
        if (value == "1") {

            this.ShowVessel = true;
            this.ShowBol = false;
            this.ViewBookinglevelList();
            this.onInitDropdown(value);

        } else {
            this.ShowBol = true
            this.ShowVessel = false;
            this.ViewBOLList();
            this.onInitDropdown(value)
        }
    }
    selectedType = 'vessel';

    onChange(event) {

        this.selectedType = event.target.value;
    }

    ViewBookinglevelList() {
        this.bks.viewBookinglevelList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    ViewBOLList() {

        this.bks.BkgLevelBolListView(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });

    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            SearchID: 0,
            SearchValue: '',
            VslBolStatus: 1,

        });
    }


    onSubmit() {
        var validation = "";

        if ($("#ddlSearchType").val() == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Search Type</span></br>"
        }
        if (this.searchForm.value.SearchValue == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Input</span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.searchForm.value.SearchID = $('#ddlSearchType').val();
        if (this.searchForm.value.VslBolStatus == "1") {
            this.bks.viewBookinglevelList(this.searchForm.value).subscribe(data => {
                this.allItems = data;
                this.setPage(1);
            });
        }
        else {
            this.bks.BkgLevelBolListView(this.searchForm.value).subscribe(data => {
                this.allItems = data;
                this.setPage(1);
            });
        }
    }

    clearSearch() {

        $('#ddlSearchType').val(0).trigger("change");


        if (this.searchForm.value.VslBolStatus == "1") {
            this.searchForm = this.fb.group({
                ID: 0,
                SearchID: 0,
                SearchValue: '',
                VslBolStatus: 1,

            });
            this.ViewBookinglevelList();
        }
        else {
            this.searchForm = this.fb.group({
                ID: 0,
                SearchID: 0,
                SearchValue: '',
                VslBolStatus: 2,

            });
            this.ViewBOLList();
        }
    }
    setPage(page: number) {
        this.pager = this.ps.getPager(this.allItems.length, page);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    OnClickEdit(IDv, VoyageID) {
        //[routerLink]="['/views/exportmanager/bookinglevel/bookinglevelview/bookinglevelview']"
        var values = "ID: " + IDv + "&VoyageID:" + VoyageID;

        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/exportmanager/bookinglevel/bookinglevelview/bookinglevelview/'], { queryParams: { encrypted } });

    }
}
interface SearchFields {
    value: string;
    viewValue: string;
}