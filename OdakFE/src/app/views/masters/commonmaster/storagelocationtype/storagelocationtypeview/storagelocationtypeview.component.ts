import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageLoactionMaster } from '../../../../../model/StorageLocation';
import { PaginationService } from '../../../../../pagination.service';
import { Title } from '@angular/platform-browser';
import { StorageLocationService } from '../../../../../services/storage-location.service';
import { MyCustomerDropdown } from 'src/app/model/Admin';
import { EnquiryService } from '../../../../../services/enquiry.service';
declare let $: any;

@Component({
  selector: 'app-storagelocationtypeview',
  templateUrl: './storagelocationtypeview.component.html',
  styleUrls: ['./storagelocationtypeview.component.css']
})
export class StoragelocationtypeviewComponent implements OnInit {
   title = 'Storage Location Master';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    
    SLTypevalues: Status1[] = [
        { value: '1', viewValue: 'Port' },
        { value: '2', viewValue: 'Depot' },
        { value: '3', viewValue: 'Customer' },
    ];

    constructor(private fb: FormBuilder, public ps: PaginationService, private titleService: Title, private service: EnquiryService, private uk: StorageLocationService) { }

    // array of all items to be paged
    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    searchForm: FormGroup;
    dataSource: StorageLoactionMaster[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
  

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
        this.onInitalBinding();
        this.refreshDepList();
    }
    onInitalBinding() {
        this.OnBindDropdownOfficeLocation();
    }
    OnBindDropdownOfficeLocation() {

        this.service.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });

    }
    refreshDepList() {
        this.uk.getStorageLocationList(this.searchForm.value).subscribe(data => {
            // set items to json response
            this.allItems = data;

            // initialize to page 1
            this.setPage(1);
        });
    }
    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            OfficeID: 0,
            status: 0,
            statusTypes: 0,
            StorageLoc: '',
            StorageCode:'',

        });
    }
    clearSearch() {
        this.searchForm.value.OfficeID = $('#ddlOfficeID').val();
        this.searchForm.value.StatusID = $('#ddlStatusv').val();
        this.searchForm.value.SLTypeID = $('#ddlStatusv1').val();
        this.createForm();
        
        $('#ddlOfficeID').val(0).trigger("change");
        $('#ddlStatusv').val(0).trigger("change");
        $('#ddlStatusv1').val(0).trigger("change");
        this.refreshDepList();
    }
    onSubmit() {
        this.searchForm.value.OfficeID = $('#ddlOfficeID').val();
        this.searchForm.value.StatusID = $('#ddlStatusv').val();
        this.searchForm.value.SLTypeID = $('#ddlStatusv1').val();
        this.refreshDepList();
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
interface Status {
    value: string;
    viewValue: string;
}
interface Status1 {
    value: string;
    viewValue: string;
}



