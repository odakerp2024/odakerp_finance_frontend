import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Notes } from '../../../../../model/common';
import { PaginationService } from '../../../../../pagination.service';
import { MastersService } from '../../../../../services/masters.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-notesclauseview',
  templateUrl: './notesclauseview.component.html',
  styleUrls: ['./notesclauseview.component.css']
})
export class NotesclauseviewComponent implements OnInit {
    title = 'Notes & Clauses';

    constructor(private ms: MastersService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];


    dataSource: Notes[];
    searchForm: FormGroup;
    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.createForm();
        this.NotesClausesList();
    }
    NotesClausesList() {
        this.ms.getNotesList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            GeneralName: ''
           
        });
    }

    onSubmit() {
        this.ms.getNotesList(this.searchForm.value).subscribe(Notes => {
            this.allItems = Notes;
            this.setPage(1);
        });
    }
    clearSearch() {
        this.createForm();
        this.NotesClausesList();
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
