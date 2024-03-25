import { Component, OnInit } from '@angular/core';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Office, Org, Region } from '../../../../../../model/org';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;
@Component({
  selector: 'app-orgmasterview',
  templateUrl: './orgmasterview.component.html',
  styleUrls: ['./orgmasterview.component.css']
})
export class OrgmasterviewComponent implements OnInit {
    title = 'Organisation Master';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    constructor(private os: OrgService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

    private allItems: any[];
    pager: any = {};
    pagedItems: any[];

    DepartmentList: any = [];
    dataSource: Org[];
    searchForm: FormGroup;
    ActivateAddEditDepComp: boolean = false;

    ngOnInit() {
        this.titleService.setTitle(this.title);
        $('.my-select').select2();
        this.createForm();
        this.OfficeList();
    }
    OfficeList() {
        this.os.getOrgList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            OrgName: '',
            StatusID: 0
        });
    }
    clearSearch() {
       
        this.createForm();
        this.OfficeList();
        $('#ddlStatus').val(0).trigger("change");
    }
    onSubmit() {
        this.searchForm.value.StatusID = $('#ddlStatus').val();
        this.os.getOrgList(this.searchForm.value).subscribe(off => {
            // set items to json response
            this.allItems = off;

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
