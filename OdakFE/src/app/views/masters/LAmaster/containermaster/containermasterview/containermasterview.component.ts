import { Component, OnInit } from '@angular/core';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from 'src/app/pagination.service';
import { Inventory } from '../../../../../model/Inventory';
import { InventoryService } from '../../../../../services/inventory.service';
import { Title } from '@angular/platform-browser';
declare let $: any;


@Component({
    selector: 'app-containermasterview',
    templateUrl: './containermasterview.component.html',
    styleUrls: ['./containermasterview.component.css']
})
export class ContainermasterviewComponent implements OnInit {
    title = 'Container Master';

    constructor(private IS: InventoryService, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];

    DepartmentList: any = [];
    dataSource: Inventory[];
    searchForm: FormGroup;
    dsCntrType: Inventory[];
    dsModule: Inventory[];
    dsPrincipal: Inventory[];
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
        this.ContainerList();
        this.onInitalBinding();
    }

    onInitalBinding() {

        this.OnBindDropdownCntrType();
        this.OnBindDropdownModule();
        this.OnBindPrincipalBind();

    }
    OnBindDropdownCntrType() {
        this.IS.CntrTypeDropdown(this.searchForm.value).subscribe(data => {
            this.dsCntrType = data;
        });
    }
    OnBindDropdownModule() {
        this.IS.ModuleDropdown(this.searchForm.value).subscribe(data => {
            this.dsModule = data;
        });
    }

    OnBindPrincipalBind() {
        this.IS.PrincipalMasterBind(this.searchForm.value).subscribe(data => {
            this.dsPrincipal = data;
        });
    }
    ContainerList() {

        this.IS.getContainerList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            CntrNo: '',
            TypeID: 0,
            LineID: 0,
            ModuleID: 0,
            StatusID: 0
        });
    }
    clearSearch() {
        this.searchForm.value.StatusID = $('#ddlStatusV').val();
        this.searchForm.value.TypeID = $('#ddlSizeV').val();
        this.searchForm.value.LineID = $('#ddlLineV').val();
        this.searchForm.value.ModuleID = $('#ddlModuleV').val();
        this.createForm();
        this.ContainerList();
        $('#ddlStatusV').val(0).trigger("change");
        $('#ddlSizeV').val(0).trigger("change");
        $('#ddlLineV').val(0).trigger("change");
        $('#ddlModuleV').val(0).trigger("change");
    }
    onSubmit() {

        this.searchForm.value.StatusID = $('#ddlStatusV').val();
        this.searchForm.value.TypeID = $('#ddlSizeV').val();
        this.searchForm.value.LineID = $('#ddlLineV').val();
        this.searchForm.value.ModuleID = $('#ddlModuleV').val();
        this.IS.getContainerList(this.searchForm.value).subscribe(off => {
            this.allItems = off;
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

