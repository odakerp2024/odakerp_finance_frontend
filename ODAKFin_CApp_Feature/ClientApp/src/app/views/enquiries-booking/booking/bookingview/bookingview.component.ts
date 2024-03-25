import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaginationService } from '../../../../pagination.service';
import { BookingService } from '../../../../services/booking.service';
import { CustomercontractService } from '../../../../services/customercontract.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown } from 'src/app/model/Admin';
declare let $: any;
import { Title } from '@angular/platform-browser';
import { drodownVeslVoyage} from 'src/app/model/Organzation';
import { Agency, Port, SalesPersonMaster } from 'src/app/model/CustomerContract';

@Component({
    selector: 'app-bookingview',
    templateUrl: './bookingview.component.html',
    styleUrls: ['./bookingview.component.css']
})
export class BookingviewComponent implements OnInit {
    title = 'Booking and CRO';
    constructor(private router: Router, private route: ActivatedRoute, private Enqservice: EnquiryService, private service: CustomercontractService, private bookingservice: BookingService, private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    searchForm: FormGroup;
    ddlCustomerItem: MyCustomerDropdown[];
    ddlPrincipalItem: Agency[];
    ddlSalesPersonItem: SalesPersonMaster[];
    ddlDischargePortItem: Port[];
    ddlDestinationItem: Port[];
    FillVoyageMaster: drodownVeslVoyage[];
    fillVeslVoyage: drodownVeslVoyage[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    AllListEnquireStatus: CommonValues[];
    statusActive: boolean[] = [];
    statusApprove: boolean[] = [];
    statusCancel: boolean[] = [];
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
        $('#VesselID').on('select2:select', (e, args) => {
            this.OnClickVoyageID($("#VesselID").val());
        });
        this.createForm();
        this.onInitalBinding();
        /*this.ViewBookingList();*/
        this.clearSearch();
    }

    onInitalBinding() {

        this.AllListEnquireStatus = [

            { ID: "1", Desc: 'Open' },
            { ID: "2", Desc: 'Confirmed' },

        ];
        this.Enqservice.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

        this.Enqservice.getCustomerList().subscribe(data => {
            this.ddlCustomerItem = data;

        });
        this.service.getPrincipalMaster(this.searchForm.value).subscribe(data => {
            this.ddlPrincipalItem = data;
        });
        this.service.getSalesPersonMaster(this.searchForm.value).subscribe(data => {
            this.ddlSalesPersonItem = data;
        });
        this.service.getDischargePort().subscribe(data => {
            this.ddlDischargePortItem = data;
        });
        this.service.getDestination().subscribe(data => {
            this.ddlDestinationItem = data;
        });

        this.Enqservice.getVslVoyList().subscribe(data => {
            this.fillVeslVoyage = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });


    }

    OnClickVoyageID(VesselID) {

        this.Enqservice.getVoyageList(VesselID).subscribe(data => {

            this.FillVoyageMaster = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }






    ViewBookingList() {

    

        if ($('#CustomerIDv').val() != null)
            this.searchForm.value.CustomerID = $('#CustomerIDv').val();
        else
            this.searchForm.value.CustomerID = 0;
        if ($('#POL').val() != null)
            this.searchForm.value.POL = $('#POL').val();
        else
            this.searchForm.value.POL = 0;
        if ($('#FPOD').val() != null)
            this.searchForm.value.FPOD = $('#FPOD').val();
        else
            this.searchForm.value.FPOD = 0;
        if ($('#ddlSalesPersonv').val() != null)
            this.searchForm.value.SalesPersonID = $('#ddlSalesPersonv').val();
        else
            this.searchForm.value.SalesPersonID = 0;


        if ($('#ddlStatusv').val() != null)
            this.searchForm.value.Status = $('#ddlStatusv').val();
        else
            this.searchForm.value.Status = 0;

        if ($('#VesselID').val() != null)
            this.searchForm.value.VesselID = $('#VesselID').val();
        else
            this.searchForm.value.VesselID = 0;

        if ($('#VoyageID').val() != null)
            this.searchForm.value.VoyageID = $('#VoyageID').val();
        else
            this.searchForm.value.VoyageID = 0;

        this.searchForm.value.OfficeCode = $('#OfficeCode1').val();



        this.bookingservice.viewBookingList(this.searchForm.value).subscribe((data) => {

            this.allItems = data;

            for (let i = 0; i < data.length; i++) {
                if (data[i].Satusv.toString() == "Open") {

                    this.statusActive[i] = true;
                    this.statusApprove[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].Satusv.toString() == "Confirmed") {
                    this.statusActive[i] = false;
                    this.statusApprove[i] = true;
                    this.statusCancel[i] = false;
                }

                if (data[i].Satusv.toString() == "Cancelled") {
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
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
        this.searchForm = this.fb.group({
            ID: 0,
            CustomerID: 0,
            BookingNo: '',
            BookingDate: '',
            BookingDateto: '',
            PrincipalID: 0,
            SalesPersonID: 0,
            POL: 0,
            FPOD: 0,
            EnquiryNo: '',
            Status: 0,
            VesselID: 0,
            VoyageID: 0,
            OfficeCode:0,


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

    OnClickEdit(IDv) {

        var values = "ID: " + IDv;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/enquiries-booking/booking/booking/'], { queryParams: { encrypted } });
    }


    onSubmit() {
        this.ViewBookingList();
       

    }

    clearSearch() {

        this.createForm();

        $('#CustomerIDv').val(0).trigger("change");
        $('#POL').val(0).trigger("change");
        $('#FPOD').val(0).trigger("change");
        $('#ddlSalesPersonv').val(0).trigger("change");
        $('#ddlStatusv').val(0).trigger("change");
        $('#VesselID').val(0).trigger("change");
        $('#VoyageID').val(0).trigger("change");
        $('#OfficeCode1').val(0).trigger("change");
        this.ViewBookingList();


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
}
