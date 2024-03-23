import { Component, OnInit } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';
import { CommonService } from 'src/app/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentNumbering } from '../../../../../model/system';
import { LinerName } from '../../../../../model/common';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
  selector: 'app-documentnumberingview',
  templateUrl: './documentnumberingview.component.html',
  styleUrls: ['./documentnumberingview.component.css']
})
export class DocumentnumberingviewComponent implements OnInit {
    title = 'Document Numbering';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    linerItem: LinerName[];

    constructor(private ms: SystemService, private cs: CommonService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    searchForm: FormGroup;
    ngOnInit() {
        this.titleService.setTitle(this.title);
        $('.my-select').select2();
        this.createForm();
        this.DocNumbList();
        this.onInitalBinding();
    }
    DocNumbList() {
        this.ms.getDocNumbList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }
    onInitalBinding() {

        this.OnBindDropdownLiner();
    }

    OnBindDropdownLiner() {
        this.cs.getLinerNameList(this.searchForm.value).subscribe(data => {
            this.linerItem = data;
        });
    }
  
    onSubmit() {
        this.searchForm.value.Status = $('#ddlStatus').val();
        this.ms.getDocNumbList(this.searchForm.value).subscribe(DocumentNumbering => {
            this.allItems = DocumentNumbering;
            this.setPage(1);
        });
        
    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            LinerID: 0,
            Status: 0,
            Module: 0,
            Program:0
            
        });
    }
    clearSearch() {
        this.searchForm.value.Status = $('#ddlStatus').val();
        this.createForm();
        this.DocNumbList();
        $('#ddlStatus').val(0).trigger("change");
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
interface Status {
    value: string;
    viewValue: string;
}