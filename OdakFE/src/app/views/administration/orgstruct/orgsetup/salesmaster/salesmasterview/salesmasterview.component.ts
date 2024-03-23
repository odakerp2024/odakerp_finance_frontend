import { Component, OnInit } from '@angular/core';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region } from '../../../../../../model/org';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
  selector: 'app-salesmasterview',
  templateUrl: './salesmasterview.component.html',
  styleUrls: ['./salesmasterview.component.css']
})
export class SalesmasterviewComponent implements OnInit {

    title = 'Sales Office Master';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    constructor(private os: OrgService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    private allItems: any[];
    pager: any = {};

    pagedItems: any[];

    DepartmentList: any = [];
    dataSource: Region[];
    searchForm: FormGroup;
    ActivateAddEditDepComp: boolean = false;

    ngOnInit() {
        this.titleService.setTitle(this.title);
        $('.my-select').select2();
        this.createForm();
        this.onSubmit()
        this.SalesOfficeList();
    }
    SalesOfficeList() {
        this.os.getSalesOfficeView(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            SalesOffLoc: '',
            Status: 0,
        });
    }
    clearSearch() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.createForm();
        this.SalesOfficeList();
        $('#ddlStatusv').val(0).trigger("change");
    }
    onSubmit() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.os.getSalesOfficeView(this.searchForm.value).subscribe(data => {
            this.allItems = data;
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
        this.pager = this.ps.getPager(this.allItems.length, page);
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
