import { Component, OnInit } from '@angular/core';
import { MastersService } from 'src/app/services/masters.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, DynamicPDF1 } from '../../../../../model/common';
import { PaginationService } from 'src/app/pagination.service';
declare let $: any;
import { Globals } from '../../../../../globals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
@Component({
    selector: 'app-countryview1',
    templateUrl: './countryview1.component.html',
    styleUrls: ['./countryview1.component.css']
})
export class Countryview1Component implements OnInit {
    title = 'Country Master';
   
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    aclFilename: DynamicPDF1[];
    constructor(private http: HttpClient, private globals: Globals, private ms: MastersService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, public ps: PaginationService, private titleService: Title) { }

    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};
  
    // paged items
    pagedItems: any[];

    DepartmentList: any = [];
    dataSource: Country[];
    searchForm: FormGroup;
    ActivateAddEditDepComp: boolean = false;
    dep: any;

    DepartmentIdFilter: string = "";
    DepartmentNameFilter: string = "";
    DepartmentListWithoutFilter: any = [];

    ngOnInit(): void {
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
        this.CountryList();
        this.clearSearch();
    }

    CountryList() {
        this.ms.getCountryList(this.searchForm.value).subscribe(data => {
            // set items to json response           
            this.allItems = data;
            console.log(data);
            // initialize to page 1
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            CountryName: '',
            CountryCode: '',
            Status: 0,
            pdfFilename:''
        });
    }
    clearSearch() {     
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.createForm()
        this.CountryList();
        $('#ddlStatusv').val(0).trigger("change");
    }

    onSubmit() {
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.ms.getCountryList(this.searchForm.value).subscribe(country => {
            // set items to json response
            this.allItems = country;

            // initialize to page 1
            this.setPage(1);

        });
       
    }
   
    public selectedName: any;
    public highlightRow(dataItem) {
        this.selectedName = dataItem.CountryCode;
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

    pdflink() {

        this.ms.getPDF(this.searchForm.value).subscribe(data => {
            console.log(data[0].aclFilename);
            window.open("assets/pdfFiles/" + data[0].aclFilename + ".pdf");
        });
        
        //alert('hi');
     //this.http.get(this.globals.APIURL + '/home/BLPrintPDF/').subscribe(res => {

     //   });
       
      
        /*window.open(RouterLink("BLPrintPDF", "BLPrint")');*/

        /*window.open("assets/pdfFiles/test.pdf");*/
    }

    //openpdf() {
    //    $('#pdfview').modal('show');
    //}

    isDesc: boolean = false;
    column: string = '';
    sort(property) {
        this.isDesc = !this.isDesc; 
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


