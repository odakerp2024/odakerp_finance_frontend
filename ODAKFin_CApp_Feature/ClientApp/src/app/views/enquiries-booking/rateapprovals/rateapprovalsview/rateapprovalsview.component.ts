import { Component, OnInit } from '@angular/core';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from 'src/app/pagination.service';
import { RateapprovalService } from '../../../../services/rateapproval.service';
import { MyRateApproval } from '../../../../model/RateApproval';
import { City, Country, Port } from '../../../../model/common';
import {  MyCustomerDropdown } from 'src/app/model/Admin';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { EnquiryService } from 'src/app/services/enquiry.service';
declare let $: any;
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-rateapprovalsview',
    templateUrl: './rateapprovalsview.component.html',
    styleUrls: ['./rateapprovalsview.component.css']
})
export class RateapprovalsviewComponent implements OnInit {
    title = 'Principal Rate Approval';
    constructor(private router: Router, private rs: RateapprovalService, private service: EnquiryService, private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService, private titleService: Title) { }

    statusvalues: Status[] = [
        { value: '1', viewValue: 'Open' },
        { value: '2', viewValue: 'Confirmed' },
        { value: '3', viewValue: 'Lost' },
        { value: '4', viewValue: 'cancelled' },
    ];

    validityvalues: Valid[] = [
        { value: '1', viewValue: 'Valid' },
        { value: '2', viewValue: 'Expired' },
    ];

    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    dsPorts: Port[];
    /*    dscountryItem: Country[];*/
    DepartmentList: any = [];
    dataSource: MyRateApproval[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    searchForm: FormGroup;
    ActivateAddEditDepComp: boolean = false;
    dsPrincipleTypes: MyRateApproval[];
    statusActive: boolean[] = [];
    statusApprove: boolean[] = [];
    statusReject: boolean[] = [];
    statusCancel: boolean[] = [];
    btnConfirm: boolean[] = [];
    btnCancel: boolean[] = [];

    Openvalue: number = 0;
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
        this.clearSearch();
        this.createForm();
        // this.OnBindDropdownCountry();
        /*this.RateApprovalList();*/
        this.onInitalBinding();
        

    }
    onInitalBinding() {

        this.OnBindPrinciples();
        this.OnBindPorts();
        this.OnBindOffice();

    }
    OnBindOffice() {
        this.service.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    OnBindPrinciples() {
        this.rs.getPrincipleBind(this.searchForm.value).subscribe(data => {
            this.dsPrincipleTypes = data;
        });
    }
    OnBindPorts() {
        this.rs.getPortMasterBind(this.searchForm.value).subscribe(data => {
            this.dsPorts = data;
        });
    }

    RateApprovalList() {

        this.rs.getRateApprovalView(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            var opencount = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i].StatusID == 1) {

                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = true;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].StatusID == 2) {
                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = true;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].StatusID == 3) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = true;
                    this.statusCancel[i] = false;
                }
                if (data[i].StatusID == 4) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = true;
                }

                if (data[i].StatusID == 2 && data[i].ValidStatus == "VALID") {

                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                }
                if (data[i].StatusID == 2 && data[i].ValidStatus == "EXPIRED") {

                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                }
                this.allItems = data;
                this.Openvalue += parseInt(data[i].OpenCount.toString());
            }


            this.setPage(1);
        });

        //this.rs.getRateApprovalOpenCount(this.searchForm.value).subscribe(data => {
        //    this.allItems = data;

        //});
    }


    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            RequestNo: '',
            StatusID: 0,
            ValidStatusID: 0,
            EnquiryID: 0,
            PrincipleID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            RequestTo: '',
            RequestFrom: '',
            OfficeLocID:0,
        });
    }
    clearSearch() {
        this.createForm();
        $('#ddlPrinciplev').val(0).trigger("change");
        $('#ddlPOLv').val(0).trigger("change");
        $('#ddlPODv').val(0).trigger("change");
        $('#ddlFPODv').val(0).trigger("change");
        $('#ddlStatusv').val(0).trigger("change");
        $('#ddlValidv').val(0).trigger("change");
        $('#OfficeCode').val(0).trigger("change");
        this.Openvalue = 0;
        this.RateApprovalList();
    }
    onSubmit() {
        //this.searchForm.value.DestinationID = $('#ddlStatusV').val();
        this.searchForm.value.PrincipleID = $('#ddlPrinciplev').val();
        this.searchForm.value.LoadPortID = $('#ddlPOLv').val();
        this.searchForm.value.DischargePortID = $('#ddlPODv').val();
        this.searchForm.value.DestinationID = $('#ddlFPODv').val();
        this.searchForm.value.StatusID = $('#ddlStatusv').val();
        this.searchForm.value.ValidStatusID = $('#ddlValidv').val();
        this.searchForm.value.OfficeLocID = $('#OfficeCode').val();
        //this.searchForm.value.RequestFrom = $('#txtRequestFrom').val();
        //this.searchForm.value.RequestTo = $('#txtRequestTo').val();
        /*alert(this.searchForm.value.RequestFrom);*/
        this.rs.getRateApprovalView(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            // this.Openvalue = data[0].OpenCount;

            for (let i = 0; i < data.length; i++) {
                if (data[i].StatusID == 1) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = true;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].StatusID == 2) {
                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = true;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].StatusID == 3) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = true;
                    this.statusCancel[i] = false;
                }
                if (data[i].StatusID == 4) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = true;
                }
                if (data[i].StatusID == 2 && data[i].ValidStatus == "VALID") {

                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                }
                if (data[i].StatusID == 2 && data[i].ValidStatus == "EXPIRED") {

                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                }
                this.allItems = data;
            }


            this.setPage(1);
        });

    }

    clickCopy(RRID, status, ValidStatus) {

        Swal.fire({
            title: 'Do you want to Copy Rate Request?',
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                var validation = "";

                if (status == "LOST" || status == "CANCELLED") {
                    validation += "<span style='color:red;'>*</span> <span>Cannot Copy Lost/Cancelled Rate request</span></br>"

                    if (validation != "") {

                        Swal.fire(validation)
                        return false;
                    }
                } else {
                    var values = "ID: " + RRID + "&CopyID: " + 1;
                    var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
                    this.router.navigate(['/views/enquiries-booking/rateapprovals/rateapprovals/'], { queryParams: { encrypted } });
                }
            }
        })


    }

    public selectedName: any;
    public highlightRow(dataItem) {
        this.selectedName = dataItem.CityCode;
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

        var values = "ID: " + IDv + "&CopyID: " + 0;

        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/enquiries-booking/rateapprovals/rateapprovals/'], { queryParams: { encrypted } });
    }
}

interface Status {
    value: string;
    viewValue: string;
}

interface Valid {
    value: string;
    viewValue: string;
}