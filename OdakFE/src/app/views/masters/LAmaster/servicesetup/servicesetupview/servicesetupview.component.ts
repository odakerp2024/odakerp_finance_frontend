import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceSetup } from '../../../../../model/common';
import { SalesOffice } from '../../../../../model/org';
import { PaginationService } from '../../../../../pagination.service';
import { MastersService } from '../../../../../services/masters.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
  selector: 'app-servicesetupview',
  templateUrl: './servicesetupview.component.html',
  styleUrls: ['./servicesetupview.component.css']
})
export class ServicesetupviewComponent implements OnInit {
    title = 'Service Setup';

    constructor(private ms: MastersService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];
    ddGeoLocationItem: SalesOffice[];
    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];


    dataSource: ServiceSetup[];
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
        this.refreshServiceList();
        this.OnBindDropdownGeoLocation();
    }
    refreshServiceList() {
        this.ms.getServiceSetupList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }
    OnBindDropdownGeoLocation() {
        this.ms.getGeoLocBind(this.searchForm.value).subscribe(data => {
            this.ddGeoLocationItem = data;

        });
    }
    createForm() {
        this.searchForm = this.fb.group({

            ID: 0,
            ServiceName: '',
            OffLocID: 0,

        });
    }
    onSubmit() {
        this.searchForm.value.OffLocID = $('#ddlGeoLocationv').val();
        this.ms.getServiceSetupList(this.searchForm.value).subscribe(ServiceSetup => {
            this.allItems = ServiceSetup;
            this.setPage(1);
        });

    }
    clearSearch() {
        this.searchForm.value.OffLocID = $('#ddlGeoLocationv').val();
        this.createForm();
        this.refreshServiceList();
        $('#ddlGeoLocationv').val(0).trigger("change");
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
