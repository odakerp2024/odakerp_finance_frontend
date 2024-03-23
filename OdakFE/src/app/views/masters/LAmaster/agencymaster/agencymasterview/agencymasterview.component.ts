import { Component, OnInit } from '@angular/core';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationService } from 'src/app/pagination.service';
import { PartyService } from '../../../../../services/party.service';
import { MastersService } from '../../../../../services/masters.service';
import { City } from '../../../../../model/common';
import { AgencyService } from '../../../../../services/agency.service';
import { Agency } from '../../../../../model/Agency';
import { Title } from '@angular/platform-browser';
import { Country } from 'src/app/model/Organzation';
declare let $: any;

@Component({
  selector: 'app-agencymasterview',
  templateUrl: './agencymasterview.component.html',
  styleUrls: ['./agencymasterview.component.css']
})
export class AgencymasterviewComponent implements OnInit {
    title = 'Agency Master';

    constructor(private cs: AgencyService, private OS: OrgService, private fb: FormBuilder, public ps: PaginationService, private ms: MastersService, private titleService: Title) { }

    private allItems: any[];
    pager: any = {};
    pagedItems: any[];
    dscountryItem: Country[];
    DepartmentList: any = [];
    dataSource: Agency[];
    searchForm: FormGroup;
    dsCityItem: City[];
    ActivateAddEditDepComp: boolean = false;

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
        $('#ddlCountry').on('select2:select', (e, args) => {
            this.CountryChanged($("#ddlCountry").val());
        });
        this.createForm();
        this.OnBindDropdownCountry();
        this.partyList();
      
    }

    CountryChanged(countryval) {
        this.searchForm.value.CountryID = countryval;
        this.OS.getCitiesBindByCountry(this.searchForm.value).subscribe(data => {
            this.dsCityItem = data;
        });
  
    }
    partyList() {

        //this.searchForm.value.CountryID = $('#ddlCountry').val();

        this.cs.getAgencyList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }
    OnBindDropdownCountry() {
        this.ms.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            AgencyName: '',
            AgencyCode: '',
            CountryID: 0,
        });
    }
    clearSearch() {
        this.createForm();
        this.partyList();
    }
    onSubmit() {
        this.searchForm.value.CountryID = $('#ddlCountry').val();
        this.searchForm.value.CityID = $('#ddlCityv').val();
        this.cs.getAgencyList(this.searchForm.value).subscribe(data => {
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