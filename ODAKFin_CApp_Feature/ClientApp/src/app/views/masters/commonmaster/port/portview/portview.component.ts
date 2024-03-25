
import { Component, OnInit } from '@angular/core';
import { MastersService } from 'src/app/services/masters.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, Port } from '../../../../../model/common';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;
@Component({
    selector: 'app-portview',
    templateUrl: './portview.component.html',
    styleUrls: ['./portview.component.css']
})
export class PortviewComponent implements OnInit {
    title = 'Port Master';


    seaportvalues: SeaPort[] = [
        { value: '1', viewValue: 'YES' },
        { value: '2', viewValue: 'NO' },
    ];
    icdportvalues: ICDPort[] = [
        { value: '1', viewValue: 'YES' },
        { value: '2', viewValue: 'NO' },
    ];
    statusvalues: DDLStatus[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    constructor(private ms: MastersService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    dataSource: Port[];
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
        this.PageLoadingPortList();
    }



    PageLoadingPortList() {

        this.ms.getPortList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    createForm() {
       
        this.searchForm = this.fb.group({
            ID: 0,
            PortCode: '',
            PortName: '',
            CountryCode: '',
            MainPort: '',
            SeaPort: '',
            ICDPort: '',
            IsSeaPort: 0,
            IsICDPort:0,
            Status: 0

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

    onSubmit() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.searchForm.value.IsSeaPort = $('#ddlSeaPort').val();
        this.searchForm.value.IsICDPort = $('#ddlICDPort').val();
        this.PageLoadingPortList();
    }

    clearSearch() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.searchForm.value.IsSeaPort = $('#ddlSeaPort').val();
        this.searchForm.value.IsICDPort = $('#ddlICDPort').val();
        this.createForm();
        this.PageLoadingPortList();
        $('#ddlStatusv').val(0).trigger("change");
        $('#ddlSeaPort').val(0).trigger("change");
        $('#ddlICDPort').val(0).trigger("change");
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
interface DDLStatus {
    value: string;
    viewValue: string;
}
interface SeaPort {
    value: string;
    viewValue: string;
}
interface ICDPort {
    value: string;
    viewValue: string;
}