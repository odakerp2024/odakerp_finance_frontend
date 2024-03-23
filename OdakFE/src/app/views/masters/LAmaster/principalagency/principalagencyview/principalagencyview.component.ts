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
import { PrincipaltariffService } from '../../../../../services/principaltariff.service';
import { error } from 'console';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { PaginationService } from 'src/app/pagination.service';
import { Title } from '@angular/platform-browser';
import { Country } from 'src/app/model/Organzation';

declare let $: any;

@Component({
  selector: 'app-principalagencyview',
  templateUrl: './principalagencyview.component.html',
  styleUrls: ['./principalagencyview.component.css']
})
export class PrincipalagencyviewComponent implements OnInit {
    title = 'Principal/Agency Agreement';

    constructor(private router: Router, private route: ActivatedRoute, private service: PorttariffService, private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService,
        private manage: PrincipaltariffService, private ms: MastersService, private titleService: Title) { }
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    DepartmentList: any = [];
    dataSource: PorttariffService[];
    viewForm: FormGroup;
    dscountryItem: Country[];
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
        this.InitDropdown();
        this.PageLoadingList();
    }

    PageLoadingList() {
       
        
        this.manage.ViewPrincipalTariff(this.viewForm.value).subscribe(data => {
           
           
                this.allItems = data;
                this.setPage(1);
          
          
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message)
        });

        //this.service.SearchTariffPortList(this.Viewform.value).subscribe((data) => {
        //    this.allItems = data;
        //    this.setPage(1);
        //}, (error: HttpErrorResponse) => {
        //    Swal.fire(error.message);
        //});
    }

    createForm() {
        this.viewForm = this.fb.group({
            ID: 0,
            LineName: '',
            CountryID: 0,
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
        this.viewForm.value.CountryID = $('#ddlCountryV').val();
       
        this.PageLoadingList();
        
    }

    clearSearch() {
        this.viewForm.value.CountryID = $('#ddlCountryV').val();
        this.createForm();
        this.PageLoadingList();
        $('#ddlCountryV').val(0).trigger("change");
    }

    OnClickEdit(IDv) {
        var values = "ID: " + IDv;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/masters/LAmaster/Principalagency/Principaldetails/Principaldetails'], { queryParams: { encrypted } });
        //this.router.navigate(['/views/masters/LAmaster/Principalagency/Principaldetails/Principaldetails'], { queryParams: { values } });
    }

    InitDropdown() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
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
