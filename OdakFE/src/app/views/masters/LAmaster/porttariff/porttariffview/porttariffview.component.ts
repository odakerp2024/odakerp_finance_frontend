import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { CommonValues, MyCustomerDropdown, MyCntrTypeDropdown, MyPortdrodown, MyTerminaldrodown, MyGeneraldropdown } from 'src/app/model/Admin';
import { LinerName, GeneralMaster, ChargeTBMaster, BasicMaster, CurrencyMaster } from 'src/app/model/common';
import { MyDynamicGrid, MYPortTariff } from 'src/app/model/PortTariff';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PorttariffService } from 'src/app/services/porttariff.service';
import { User } from 'oidc-client';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Key } from 'protractor';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
    selector: 'app-porttariffview',
    templateUrl: './porttariffview.component.html',
    styleUrls: ['./porttariffview.component.css']
})
export class PorttariffviewComponent implements OnInit {
    title = 'Port/Liner Tariff';
    //statusvalues: Status[] = [
    //    { value: '1', viewValue: 'ACTIVE' },
    //    { value: '2', viewValue: 'IN-ACTIVE' },
    //];
    constructor(private router: Router, private route: ActivatedRoute, private service: PorttariffService, private titleService: Title, private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService) { }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    DepartmentList: any = [];
    dataSource: PorttariffService[];
    PortViewform: FormGroup;
    CustomerMasterAllvalues: MyCustomerDropdown[];
    CntrTypesvalues: MyCntrTypeDropdown[];
    PortAllvalues: MyPortdrodown[];
    ngOnInit() {
        this.titleService.setTitle(this.title);
        this.createForm();
        this.InitDropdown();
        this.PageLoadingPortTariffList();
    }

    PageLoadingPortTariffList() {
        this.PortViewform.value.PrincibleID = $('#ddlPrinciple').val();
        this.PortViewform.value.PortID = $('#ddlPort').val();
        this.PortViewform.value.EquipmentTypeID = $("#ddlEquipmentType").val();

        this.service.SearchTariffPortList(this.PortViewform.value).subscribe((data) => {
            this.allItems = data;
            this.setPage(1);
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    createForm() {
        this.PortViewform = this.fb.group({
            ID: 0,
            PrincibleID: 0,
            PortID: 0,
            EquipmentTypeID: 0,
            Status: 0
        });
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.ps.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onSubmit() {
        /*this.PortViewform.value.Status = $('#ddlStatusv').val();*/
        this.PageLoadingPortTariffList();
    }

    clearSearch() {
       /* this.PortViewform.value.Status = $('#ddlStatusv').val();*/
        this.createForm();
        this.PageLoadingPortTariffList();
        /*$('#ddlStatusv').val(0).trigger("change");*/
    }

    OnClickEdit(IDv) {

        var values = "ID: " + IDv;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/masters/LAmaster/porttariff/porttariff'], { queryParams: { encrypted } });
    }

    InitDropdown() {

        $('.my-select').select2();
        this.service.getPrincibleList().subscribe(data => {
            this.CustomerMasterAllvalues = data;
        });

        this.service.getCntrTypesList().subscribe(data => {
            this.CntrTypesvalues = data;
        });
        this.service.getPortList().subscribe(data => {
            this.PortAllvalues = data;
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
//interface Status {
//    value: string;
//    viewValue: string;
//}