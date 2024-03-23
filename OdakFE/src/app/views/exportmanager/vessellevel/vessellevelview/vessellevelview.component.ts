import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnquiryService } from 'src/app/services/enquiry.service';
import Swal from 'sweetalert2';
import { drodownVeslVoyage } from '../../../../../../src/app/model/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MyBkgLevel } from '../../../../model/MyBkgLevel';
import { BkglevelService } from '../../../../services/bkglevel.service';
import { VesseltaskService } from '../../../../services/vesseltask.service'
import { PaginationService } from '../../../../pagination.service';
import { EncrDecrServiceService } from '../../../../services/encr-decr-service.service';
declare let $: any;

@Component({
    selector: 'app-vessellevelview',
    templateUrl: './vessellevelview.component.html',
    styleUrls: ['./vessellevelview.component.css']
})
export class VessellevelviewComponent implements OnInit {
    title = 'Vessel Tasks - Search ';
    constructor(private titleService: Title, private ES: EncrDecrServiceService, private fb: FormBuilder, private Enqservice: EnquiryService, public ps: PaginationService, public uk: VesseltaskService, private bks: BkglevelService, private router: Router, private route: ActivatedRoute) { }

    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    searchForm: FormGroup;
    FillVoyageMaster: drodownVeslVoyage[];
    fillVeslVoyage: drodownVeslVoyage[];
    dsCntrNos: MyBkgLevel[];
    dsBOL: MyBkgLevel[];
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
        $('#VesselID').on('select2:select', (e, args) => {
            this.OnClickVoyageID($("#VesselID").val());
        });
        this.createForm();
        this.onInitalBinding();
        this.refreshDepList();
    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            VesselID: 0,
            VoyageID: 0,
            CntrID: 0,
            ETDDateTo: '',
            ETDDateFrom: '',
        });
    }
    onInitalBinding() {
        this.Enqservice.getVslVoyList().subscribe(data => {
            this.fillVeslVoyage = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
        this.bks.getCntrNoList(this.searchForm.value).subscribe(data => {
            this.dsCntrNos = data;
        });
        this.bks.getBLNoList(this.searchForm.value).subscribe(data => {
            this.dsBOL = data;
        });
    }
    OnClickVoyageID(VesselID) {

        this.Enqservice.getVoyageList(VesselID).subscribe(data => {

            this.FillVoyageMaster = data;

        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    onclickvesselpage(VesselID, VoyageID) {
        this.VesselID = VesselID;
        this.VoyageID = VoyageID;
        var values = "VesselID: " + VesselID + "&VoyageID:" + VoyageID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/exportmanager/vessellevel/vsloadlist/vsloadlist/'], { queryParams: { encrypted } });
    }
    ViewBookingList() {
        if ($('#VesselID').val() != null)
            this.searchForm.value.VesselID = $('#VesselID').val();
        else
            this.searchForm.value.VesselID = 0;

        if ($('#VoyageID').val() != null)
            this.searchForm.value.VoyageID = $('#VoyageID').val();
        else
            this.searchForm.value.VoyageID = 0;
    }
    onSubmit() {
        this.ViewBookingList();
        this.searchForm.value.CntrID = $('#ddlContainer').val();
        this.searchForm.value.BLID = $('#ddlBL').val();
        this.refreshDepList();
    }
    clearSearch() {
        this.createForm();
        $('#VesselID').val(0).trigger("change");
        $('#VoyageID').val(0).trigger("change");
        $('#ddlContainer').val(0).trigger("change");
        $('#ddlBL').val(0).trigger("change");
        this.refreshDepList();
    }
    refreshDepList() {
        this.uk.getVesselTaskViewlist(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
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
}
interface Status {
    value: string;
    viewValue: string;
}