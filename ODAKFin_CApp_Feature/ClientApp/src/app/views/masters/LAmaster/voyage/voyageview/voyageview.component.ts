import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Voyage, VesselMaster } from '../../../../../model/Voyage';
import { VoyageService } from '../../../../../services/voyage.service';
import { PaginationService } from '../../../../../pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
    selector: 'app-voyageview',
    templateUrl: './voyageview.component.html',
    styleUrls: ['./voyageview.component.css']
})
export class VoyageviewComponent implements OnInit {

    title = 'Voyage Master';

    constructor(private ms: VoyageService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    dataSource: Voyage[];
    searchForm: FormGroup;
    ddlVesselItem: VesselMaster[];



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
        this.refreshDepList();
        this.OnBindDropdownVessel();
    }
    OnBindDropdownVessel() {
        this.ms.getVesselBind(this.searchForm.value).subscribe(data => {
            this.ddlVesselItem = data;
        });
    }

    refreshDepList() {
        this.ms.getVoyageViewlist(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }
    onSubmit() {
       
        this.searchForm.value.VesselID = $('#ddlVesselv').val();
        this.refreshDepList();
    }
    clearSearch() {
        this.createForm();
        this.refreshDepList();
        $('#ddlVesselv').val(0).trigger("change");

    }
    createForm() {

        this.searchForm = this.fb.group({

            ID: 0,
            VoyageNo: '',
            VesselID: 0,

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
interface Status {
    value: string;
    viewValue: string;
}

