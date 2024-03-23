import { Component, OnInit } from '@angular/core';
import { SlotmgmtService } from 'src/app/services/slotmgmt.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/pagination.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Slot } from '../../../model/slot';
import { data } from 'jquery';
import { VoyageDetails } from '../../../model/common';
declare let $: any;
@Component({
    selector: 'app-slotmanagementview',
    templateUrl: './slotmanagementview.component.html',
    styleUrls: ['./slotmanagementview.component.css']
})
export class SlotmanagementviewComponent implements OnInit {

    constructor(private ms: SlotmgmtService, private router: Router, private fb: FormBuilder, private ES: EncrDecrServiceService, public ps: PaginationService) { }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    dataSource: Slot[];
    searchForm: FormGroup;
    ddlVoyageItem: VoyageDetails[];
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
        this.createForm();
        this.BindDropDown();
        this.PageLoadingSlotList();
    }
    BindDropDown() {

        this.ms.getVoyageBindMaster(this.searchForm.value).subscribe(data => {
            this.ddlVoyageItem = data;
        });
    }
    createForm() {

        this.searchForm = this.fb.group({
            VoyageID: 0,
            ETAfrom: '',
            ETAto: '',
            ETDfrom: '',
            ETDto: '',

        });

    }
    PageLoadingSlotList() {

        this.ms.getSlotList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }
    setPage(page: number) {
        this.pager = this.ps.getPager(this.allItems.length, page);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    onSubmit() {
        this.searchForm.value.VoyageID = $('#ddlVoyage').val();
        this.ms.getSlotList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);

        });
    }
    OnClickEdit(IDv) {
        var values = "ID: " + IDv;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/slotmanagement/slotmanagement'], { queryParams: { encrypted } });

    }
    clearSearch() {
        $('#ddlVoyage').val(0).trigger("change");
        this.createForm();
        this.PageLoadingSlotList();
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
