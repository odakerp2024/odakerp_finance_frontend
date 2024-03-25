import { Component, OnInit } from '@angular/core';
import { MastersService } from 'src/app/services/masters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City } from '../../../../../model/common';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;
@Component({
  selector: 'app-cityview',
  templateUrl: './cityview.component.html',
  styleUrls: ['./cityview.component.css']
})
export class CityviewComponent implements OnInit {
    title = 'City Master';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];

    constructor(private ms: MastersService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    DepartmentList: any = [];
    dataSource: City[];
    searchForm: FormGroup;
    ActivateAddEditDepComp: boolean = false;
    dep: any;

    DepartmentIdFilter: string = "";
    DepartmentNameFilter: string = "";
    DepartmentListWithoutFilter: any = [];
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
        this.CityList();
  }
    CityList() {
        this.ms.getCityList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            CityName: '',
            CountryCode: '',
            CityCode: '',
            Status: 0
        });
    }
    clearSearch() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.createForm();
        this.CityList();
        $('#ddlStatusv').val(0).trigger("change");
    }
    onSubmit() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.ms.getCityList(this.searchForm.value).subscribe(city => {
            // set items to json response
            this.allItems = city;

            // initialize to page 1
            this.setPage(1);

        });

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