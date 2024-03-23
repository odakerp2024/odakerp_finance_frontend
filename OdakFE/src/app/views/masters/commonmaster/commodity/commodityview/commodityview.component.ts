import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Commodity } from '../../../../../model/common';
import { PaginationService } from '../../../../../pagination.service';
import { MastersService } from '../../../../../services/masters.service';
declare let $: any;
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-commodityview',
  templateUrl: './commodityview.component.html',
  styleUrls: ['./commodityview.component.css']
})
export class CommodityviewComponent implements OnInit {

    title = 'Commodity Master';
    dgflag: DGFlag[] = [
        { value: '1', viewValue: 'YES' },
        { value: '2', viewValue: 'NO' },
    ];
    CommodityItem: Commodity[];
    constructor(private ms: MastersService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];


    dataSource: Commodity[];
    searchForm: FormGroup;

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
        this.onInitalBinding();
  }
    onInitalBinding() {
        this.OnBindDropdownCommodity();
    }
    OnBindDropdownCommodity() {
        this.ms.getCommodityTypes(this.searchForm.value).subscribe(data => {
            this.CommodityItem = data;
        });
    }
    refreshDepList() {
        this.ms.getCommodityList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            CommodityUnCode: '',
            CommodityName: '',
            HSCode: '',
            CommodityTypeID: 0,
            DangerousFlag:0

        });
    }
    clearSearch() {
        this.searchForm.value.CommodityTypeID = $('#ddlCommodityTypev').val();
        this.searchForm.value.DangerousFlag = $('#ddlFlagv').val();
        this.createForm();

        this.refreshDepList();
        $('#ddlCommodityTypev').val(0).trigger("change");
        $('#ddlFlagv').val(0).trigger("change");
    }
    onSubmit() {
        this.searchForm.value.CommodityTypeID = $('#ddlCommodityTypev').val();
        this.searchForm.value.DangerousFlag = $('#ddlFlagv').val();
        this.ms.getCommodityList(this.searchForm.value).subscribe(commodity => {
            // set items to json response
            this.allItems = commodity;

            // initialize to page 1
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
interface DGFlag {
    value: string;
    viewValue: string;
}
