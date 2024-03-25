import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Depot, City } from '../../../../../model/common';
import { PaginationService } from '../../../../../pagination.service';
import { MastersService } from '../../../../../services/masters.service';
import { Title } from '@angular/platform-browser';
import { Country } from 'src/app/model/Organzation';
declare let $: any;
@Component({
    selector: 'app-depotview',
    templateUrl: './depotview.component.html',
    styleUrls: ['./depotview.component.css']
})
export class DepotviewComponent implements OnInit {
    title = 'Depot Master';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    countryItem: Country[];
    dscityItem: City[];
    constructor(private ms: MastersService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];


    dataSource: Depot[];
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
        this.OnBindDropdownCountry();
/*        this.OnBindDropdownCity();*/
        /*this.CityChange();*/
    }
    OnBindDropdownCountry() {
       
        this.ms.getCountryBind().subscribe(data => {
            this.countryItem = data;
        });
    }

    //OnBindDropdownCity() {
    //    this.ms.getCityBind(this.searchForm.value).subscribe(data => {
    //        this.dscityItem = data;
    //    });
    //}
    CityChange() {
        this.ms.getCityByCountryBind(this.searchForm.get('DepCountry').value).subscribe(data => {
            this.dscityItem = data;
        });
    }
    refreshDepList() {
        this.ms.getDepotList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            DepName: '',
            Status: 0,
            DepCountry: 0,
            DepCity: 0
        });
    }
    clearSearch() {
        this.searchForm.value.Status = $('#ddlStatus').val();
        this.createForm();
        this.refreshDepList();
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
        this.ms.getDepotList(this.searchForm.value).subscribe(Depot => {
            this.allItems = Depot;
            this.setPage(1);
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
    

}
interface Status {
    value: string;
    viewValue: string;
}