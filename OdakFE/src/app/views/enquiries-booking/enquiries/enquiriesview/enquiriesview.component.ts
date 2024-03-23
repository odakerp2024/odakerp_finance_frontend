import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown } from 'src/app/model/Admin';
import { LinerName, GeneralMaster, ChargeTBMaster, BasicMaster, CurrencyMaster } from 'src/app/model/common';
import { MyDynamicGrid, MYPortTariff } from 'src/app/model/PortTariff';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { PaginationService } from 'src/app/pagination.service';
import { CustomercontractService } from '../../../../services/customercontract.service';
import { CANCELLED } from 'dns';
declare let $: any;
import { Title } from '@angular/platform-browser';
import { Agency, Port, SalesPersonMaster } from 'src/app/model/CustomerContract';

@Component({
    selector: 'app-enquiriesview',
    templateUrl: './enquiriesview.component.html',
    styleUrls: ['./enquiriesview.component.css']
})
export class EnquiriesviewComponent implements OnInit {
    title = 'Customer Enquiry';
    constructor(private router: Router, private route: ActivatedRoute, private service: EnquiryService, private enqservice: CustomercontractService, private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService, private titleService: Title) { }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    DepartmentList: any = [];
    dataSource: EnquiryService[];
    Viewform: FormGroup;
    OfficeMasterAllvalues: MyCustomerDropdown[];
    CustomerMasterAllvalues: MyCustomerDropdown[];
    CntrTypesvalues: MyCntrTypeDropdown[];
    PortAllvalues: MyPortdrodown[];
    ddlCustomerItem: MyCustomerDropdown[];
    ddlPrincipalItem: Agency[];
    ddlSalesPersonItem: SalesPersonMaster[];
    ddlDischargePortItem: Port[];
    ddlDestinationItem: Port[];
    AllListEnquireStatus: CommonValues[];
    statusActive: boolean[] = [];
    statusApprove: boolean[] = [];
    statusReject: boolean[] = [];
    statusCancel: boolean[] = [];

    btnConfirm: boolean[] = [];
    btnCancel: boolean[] = [];
    Openvalue: number = 0;

    validityvalues: Valid[] = [
        { value: '1', viewValue: 'Valid' },
        { value: '2', viewValue: 'Expired' },
    ];

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
        /*this.PageLoadingEnquiryViewList();*/
        this.clearSearch();

    }

    PageLoadingEnquiryViewList() {

        this.Viewform.value.CustomerID = $('#CustomerIDv').val();
        this.Viewform.value.DestinationID = $('#DestinationIDv').val();
        this.Viewform.value.DischargeID = $('#DischargeIDv').val();
        this.Viewform.value.PrincipalID = $('#ddlPrincipalv').val();
        this.Viewform.value.SalesPersonID = $('#ddlSalesPersonv').val();
        this.Viewform.value.Status = $('#ddlStatusv').val();
        this.Viewform.value.ValidStatusID = $('#ddlValidv').val();
        this.Viewform.value.OfficeCode = $('#OfficeCode').val();
        this.service.viewExstingEnquiryList(this.Viewform.value).subscribe((data) => {

            this.allItems = data;
            for (let i = 0; i < data.length; i++) {

                if (data[i].ValidStatusID == 1) {

                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                }
                else {

                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;

                }

                if (data[i].EnquiryStatusID.toString() == "OPEN") {
                    this.Openvalue += 1;
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = true;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].EnquiryStatusID.toString() == "CONFIRMED") {
                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = true;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].EnquiryStatusID.toString() == "LOST") {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = true;
                    this.statusCancel[i] = false;
                }
                if (data[i].EnquiryStatusID.toString() == "CANCELLED") {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = true;
                }

                this.allItems = data;
            }


            this.setPage(1);
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    createForm() {
        this.Viewform = this.fb.group({
            ID: 0,
            CustomerID: 0,
            DestinationID: 0,
            DischargeID: 0,
            EnquiryNo: '',
            EnquiryDate: '',
            EnquiryDateto: '',
            PrincipalID: 0,
            SalesPersonID: 0,
            Status: 0,
            ValidStatusID: 0,
            OfficeCode: 0,
        });
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

    onSubmit() {
        this.Openvalue = 0;
        this.PageLoadingEnquiryViewList();
        //this.Viewform.value.CustomerID = $('#CustomerIDv').val();
        //this.Viewform.value.DestinationID = $('#DestinationIDv').val();
        //this.Viewform.value.DischargeID = $('#DischargeIDv').val();
        //this.Viewform.value.PrincipalID = $('#ddlPrincipalv').val();
        //this.Viewform.value.SalesPersonID = $('#ddlSalesPersonv').val();
        //this.Viewform.value.Status = $('#ddlStatusv').val();
        //this.Viewform.value.ValidStatusID = $('#ddlValidv').val();
        //this.service.viewExstingEnquiryList(this.Viewform.value).subscribe((data) => {

        //    this.allItems = data;
        //    for (let i = 0; i < data.length; i++)
        //    {
        //        if (data[i].ValidStatusID == 1) {

        //            if (data[i].EnquiryStatusID.toString() == "OPEN") {
        //                this.btnConfirm[i] = false;
        //                this.btnCancel[i] = true;
        //                this.statusActive[i] = true;
        //                this.statusApprove[i] = false;
        //                this.statusReject[i] = false;
        //                this.statusCancel[i] = false;
        //            }
        //            if (data[i].EnquiryStatusID.toString() == "CONFIRMED") {
        //                this.btnConfirm[i] = true;
        //                this.btnCancel[i] = false;
        //                this.statusActive[i] = false;
        //                this.statusApprove[i] = true;
        //                this.statusReject[i] = false;
        //                this.statusCancel[i] = false;
        //            }
        //            if (data[i].EnquiryStatusID.toString() == "LOST") {
        //                this.btnConfirm[i] = false;
        //                this.btnCancel[i] = true;
        //                this.statusActive[i] = false;
        //                this.statusApprove[i] = false;
        //                this.statusReject[i] = true;
        //                this.statusCancel[i] = false;
        //            }
        //            if (data[i].EnquiryStatusID.toString() == "CANCELLED") {
        //                this.btnConfirm[i] = false;
        //                this.btnCancel[i] = true;
        //                this.statusActive[i] = false;
        //                this.statusApprove[i] = false;
        //                this.statusReject[i] = false;
        //                this.statusCancel[i] = true;
        //            }
        //        }
        //        else {

        //            this.btnConfirm[i] = false;
        //            this.btnCancel[i] = false;
        //            this.statusActive[i] = false;
        //            this.statusApprove[i] = false;
        //            this.statusReject[i] = false;
        //            this.statusCancel[i] = true;
        //        }
        //        this.allItems = data;
        //    }


        //    this.setPage(1);
        //}, (error: HttpErrorResponse) => {
        //    Swal.fire(error.message);
        //});
    }

    clearSearch() {
        this.Openvalue = 0;
        this.createForm();
        $('#CustomerIDv').val(0).trigger("change");
        $('#DestinationIDv').val(0).trigger("change");
        $('#DischargeIDv').val(0).trigger("change");
        $('#ddlPrincipalv').val(0).trigger("change");
        $('#ddlSalesPersonv').val(0).trigger("change");
        $('#ddlStatusv').val(0).trigger("change");
        $('#ddlValidv').val(0).trigger("change");
        $('#OfficeCode').val(0).trigger("change");
        this.PageLoadingEnquiryViewList();
    }

    OnClickEdit(IDv) {

        var values = "ID: " + IDv + "&CopyID:" + 0;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/enquiries-booking/enquiries/enquiries/'], { queryParams: { encrypted } });
    }


    onInitalBinding() {

        this.AllListEnquireStatus = [

            { ID: "1", Desc: 'Open' },
            { ID: "2", Desc: 'Confirmed' },
            { ID: "3", Desc: 'Lost' },
            { ID: "4", Desc: 'Cancelled' },
        ];


        this.OnBindDropdownCustomer();
        this.OnBindDropdownPrincipal();
        this.OnBindDropdownSalesPerson();
        this.OnBindDropdownDischargePort();
        this.OnBindDropdownDestination();
        this.OnBindDropdownOffice();
    }


    OnBindDropdownCustomer() {
        this.service.getCustomerList().subscribe(data => {
            this.ddlCustomerItem = data;

        });
    }

    OnBindDropdownPrincipal() {
        this.enqservice.getPrincipalMaster(this.Viewform.value).subscribe(data => {
            this.ddlPrincipalItem = data;
        });
    }

    OnBindDropdownSalesPerson() {
        this.enqservice.getSalesPersonMaster(this.Viewform.value).subscribe(data => {
            this.ddlSalesPersonItem = data;
        });
    }

    OnBindDropdownDischargePort() {
        this.enqservice.getDischargePort().subscribe(data => {
            this.ddlDischargePortItem = data;
        });
    }

    OnBindDropdownDestination() {
        this.enqservice.getDestination().subscribe(data => {
            this.ddlDestinationItem = data;
        });
    }
    OnBindDropdownOffice() {
        this.service.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    isDesc: boolean = false;
    column: string = '';
    sort(property) {
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        let direction = this.isDesc ? 1 : -1;

        this.pagedItems.sort(function (a, b) {
            if (a[property] < b[property]) {
                return -1 * direction;
            }
            else if (a[property] > b[property]) {
                return 1 * direction;
            }
            else {
                return 0;
            }
        });
    };



    OnClickCreateBooking(IDv, StatusCheck) {
        if (StatusCheck != "CONFIRMED") {
            /*Swal.fire("Enquiry Confirmed");*/
            return;
        }
        Swal.fire({
            title: 'Do you want to Create Booking?',
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.Viewform.value.ID = IDv

                this.Viewform.value.SessionFinYear = "2022";
                this.service.InsertfromEnquiry(this.Viewform.value).subscribe((data) => {
                    this.PageLoadingEnquiryViewList();
                    if (data.length > 0) {
                        //Swal.fire(data[0].AlertMessage);

                        setTimeout(() => {
                            var values = "ID: " + data[0].BkgId;
                            var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
                            this.router.navigate(['/views/enquiries-booking/booking/booking/'], { queryParams: { encrypted } });
                        }, 2000)

                    }
                }, (error: HttpErrorResponse) => {
                    Swal.fire(error.message);
                });
            }
            else {

            }
        })
    }

    OnClickEnqueryCopy(Idv) {


        Swal.fire({
            title: 'Do you want to Copy Enquiry?',
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                var values = "ID: " + Idv + "&CopyID:" + 1;
                var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
                this.router.navigate(['/views/enquiries-booking/enquiries/enquiries/'], { queryParams: { encrypted } });
            } else {

            }
        })
    }


}

interface Valid {
    value: string;
    viewValue: string;
}
