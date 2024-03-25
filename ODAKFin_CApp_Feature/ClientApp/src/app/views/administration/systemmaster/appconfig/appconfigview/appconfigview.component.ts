import { Component, OnInit } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../../../../model/system';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-appconfigview',
  templateUrl: './appconfigview.component.html',
  styleUrls: ['./appconfigview.component.css']
})
export class AppconfigviewComponent implements OnInit {
    title = 'App Configuration';

    constructor(private ms: SystemService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    searchForm: FormGroup;
    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.createForm();
        this.AppConfigList();
  }
    AppConfigList() {
        this.ms.getAppConfigList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }
    onSubmit() {
        this.ms.getAppConfigList(this.searchForm.value).subscribe(AppConfig => {
            // set items to json response
            this.allItems = AppConfig;

            // initialize to page 1
            this.setPage(1);

        });

    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            RefCode: '',
            GeneralName: ''
        });
    }
    clearSearch() {
        this.createForm();

        this.AppConfigList();
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

}
