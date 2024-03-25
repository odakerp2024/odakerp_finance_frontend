import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginationService } from 'src/app/pagination.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Title } from '@angular/platform-browser';

declare let $: any;

@Component({
  selector: 'app-cntrmovementview',
  templateUrl: './cntrmovementview.component.html',
  styleUrls: ['./cntrmovementview.component.css']
})
export class CntrmovementviewComponent implements OnInit {
    title = 'Container Movement(s) - Status';
    constructor(private router: Router, private route: ActivatedRoute,private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService, private titleService: Title) { }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
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
