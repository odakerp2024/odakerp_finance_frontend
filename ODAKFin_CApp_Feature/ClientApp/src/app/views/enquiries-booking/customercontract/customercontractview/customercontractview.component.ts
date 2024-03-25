import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomercontractService } from 'src/app/services/customercontract.service';
import { PaginationService } from 'src/app/pagination.service';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Title } from '@angular/platform-browser';
import { MyCustomerDropdown } from 'src/app/model/Admin';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { Agency, CustomerContract, CustomerMaster, Port } from 'src/app/model/CustomerContract';
declare let $: any;


//export enum StatusColor {
//    Low = "low",
//    Medium = "medium",
//    High = "high"
//}
@Component({
    selector: 'app-customercontractview',
    templateUrl: './customercontractview.component.html',
    styleUrls: ['./customercontractview.component.css']
})
export class CustomercontractviewComponent implements OnInit {
    title = 'Customer Contract';
    statusvalues: Status[] = [
        { value: '1', viewValue: 'Open' },
        { value: '2', viewValue: 'Confirmed' },
        { value: '3', viewValue: 'Lost' },
        { value: '4', viewValue: 'Cancelled' }
    ];

    validityvalues: Valid[] = [
        { value: '1', viewValue: 'Valid' },
        { value: '2', viewValue: 'Expired' },
    ];

    constructor(private router: Router, private route: ActivatedRoute, private service: CustomercontractService, private uk: EnquiryService, private fb: FormBuilder, public ps: PaginationService, private ES: EncrDecrServiceService, private titleService: Title) { }
    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];
    DepartmentList: any = [];
    dataSource: CustomerContract[];
    searchForm: FormGroup;
    ddlCustomerItem: CustomerMaster[];
    ddlPrincipalItem: Agency[];
    ddlOriginItem: Port[];
    ddlLoadPortItem: Port[];
    ddlDischargePortItem: Port[];
    ddlDestinationItem: Port[];
    OfficeMasterAllvalues: MyCustomerDropdown[];
    ActivateAddEditDepComp: boolean = false;
    dep: any;
    DepartmentIdFilter: string = "";
    DepartmentNameFilter: string = "";
    DepartmentListWithoutFilter: any = [];
    /*bgColor: string = 'grey';*/
    statusActive: boolean[] = [];
    statusApprove: boolean[] = [];
    statusReject: boolean[] = [];
    statusCancel: boolean[] = [];
    btnConfirm: boolean[] = [];
    btnCancel: boolean[] = [];
    Openvalue: number = 0;


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
        this.clearSearch();
        this.createForm();
        /*this.CustomerContractList();*/
        this.onInitalBinding();
        


    }
    onInitalBinding() {
        this.OnBindDropdownCustomer();
        this.OnBindDropdownPrincipal();
        this.OnBindDropdownOrigin();
        this.OnBindDropdownDischargePort();
        this.OnBindDropdownLoadPort();
        this.OnBindDropdownDestination();
        this.OnBindDropdownOffice();

    }
    OnBindDropdownCustomer() {
        this.service.getCustomerMaster(this.searchForm.value).subscribe(data => {
            this.ddlCustomerItem = data;
        });
    }

    OnBindDropdownPrincipal() {
        this.service.getPrincipalMaster(this.searchForm.value).subscribe(data => {
            this.ddlPrincipalItem = data;
        });
    }
    OnBindDropdownOrigin() {
        this.service.getOrignMaster().subscribe(data => {
            this.ddlOriginItem = data;
        });
    }
    OnBindDropdownDischargePort() {
        this.service.getDischargePort().subscribe(data => {
            this.ddlLoadPortItem = data;
        });
    }
    OnBindDropdownLoadPort() {
        this.service.getLoadPort().subscribe(data => {
            this.ddlDischargePortItem = data;
        });
    }
    OnBindDropdownDestination() {
        this.service.getDestination().subscribe(data => {
            this.ddlDestinationItem = data;
        });
    }
    OnBindDropdownOffice() {
        this.uk.getOfficeList().subscribe(data => {
            this.OfficeMasterAllvalues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }

    CustomerContractList() {
        this.searchForm.value.ValidStatusID = $('#ddlValidv').val();
        this.service.getCustomerContractList(this.searchForm.value).subscribe(data => {

            for (let i = 0; i < data.length; i++) {
               
              
                if (data[i].Status == 1) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = true;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].Status == 2) {
                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = true;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].Status == 3) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = true;
                    this.statusCancel[i] = false;
                }
                if (data[i].Status == 4) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = true;
                }
                if (data[i].Status == 2 && data[i].ValidStatusID == 1) {

                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                }
                if (data[i].Status == 2 && data[i].ValidStatusID == 2) {

                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                }
                this.allItems = data;
                this.Openvalue += parseInt(data[i].OpenCount.toString());
            }
            this.setPage(1);

        });



    }


    createForm() {

        this.searchForm = this.fb.group({
            ID: 0,
            CustomerID: 0,
            PrincipalID: 0,
            OriginID: 0,
            LoadPortID: 0,
            DischargePortID: 0,
            DestinationID: 0,
            ContractNo: '',
            ContractDate: '',
            ContractDateTill: '',
            Status: 0,
            ValidStatusID: 0,
            OfficeLocation:0,


        });

    }
    onSubmit() {
      
        this.searchForm.value.CustomerID = $('#ddlCustomerv').val();
        this.searchForm.value.PrincipalID = $('#ddlPrincipalv').val();
        this.searchForm.value.LoadPortID = $('#ddlLoadPortv').val();
        this.searchForm.value.DischargePortID = $('#ddlDischargePortv').val();
        this.searchForm.value.DestinationID = $('#ddlDestinationv').val();
        this.searchForm.value.ContractDate = $('#ddlContractDate').val();
        this.searchForm.value.ContractDateTill = $('#ddlContractDateTill').val();
        this.searchForm.value.Status = $('#ddlStatusv').val();
        this.searchForm.value.ValidStatusID = $('#ddlValidv').val();
        this.searchForm.value.OfficeLocation = $('#OfficeCode').val();
        this.service.getCustomerContractList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
            for (let i = 0; i < data.length; i++) {
                if (data[i].Status == 1) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = true;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].Status == 2) {
                    this.btnConfirm[i] = true;
                    this.btnCancel[i] = false;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = true;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = false;
                }
                if (data[i].Status == 3) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = true;
                    this.statusCancel[i] = false;
                }
                if (data[i].Status == 4) {
                    this.btnConfirm[i] = false;
                    this.btnCancel[i] = true;
                    this.statusActive[i] = false;
                    this.statusApprove[i] = false;
                    this.statusReject[i] = false;
                    this.statusCancel[i] = true;
                }
                this.allItems = data;
            }
        });

    }
    clearSearch() {
        this.Openvalue = 0;
        this.createForm();        
        $('#ddlCustomerv').val(0).trigger("change");
        $('#ddlPrincipalv').val(0).trigger("change");
        $('#ddlLoadPortv').val(0).trigger("change");
        $('#ddlDischargePortv').val(0).trigger("change");
        $('#ddlDestinationv').val(0).trigger("change");
        $('#ddlContractDate').val(0).trigger("change");
        $('#ddlStatusv').val(0).trigger("change");
        $('#ddlValidv').val(0).trigger("change");
        $('#OfficeCode').val(0).trigger("change");
        this.CustomerContractList();
    }

    public selectedName: any;
    public highlightRow(dataItem) {
        this.selectedName = dataItem.CountryCode;
    }
    setPage(page: number) {
        this.pager = this.ps.getPager(this.allItems.length, page);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    OnClickEdit(IDv) {

        var values = "ID: " + IDv + "&CopyID:" + 0;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/enquiries-booking/customercontract/customercontract/'], { queryParams: { encrypted } });
    }
    OnClickCopy(IDv) {

        Swal.fire({
            title: 'Do you want to Copy Customer Contract?',
            showDenyButton: true,
            confirmButtonText: 'YES',
            denyButtonText: `NO`,
        }).then((result) => {
            if (result.isConfirmed) {
                var values = "ID: " + IDv + "&CopyID:" + 1;
                this.searchForm.value.SessionFinYear = "2022";
                var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
                this.router.navigate(['/views/enquiries-booking/customercontract/customercontract/'], { queryParams: { encrypted } });
            } else {

            }
        })



        //var values = "ID: " + IDv;
        //this.searchForm.value.ID = IDv;
        //this.searchForm.value.SessionFinYear = "2022";
        //this.service.saveCopyContract(this.searchForm.value).subscribe(data => {

        //    Swal.fire("Copied Successfully");
        //    this.onSubmit();

        //},
        //    (error: HttpErrorResponse) => {

        //        Swal.fire(error.message)
        //    });

    }

}
interface Status {
    value: string;
    viewValue: string;
}
interface StatusColor {
    value: string;
    viewValue: string;
}

interface Valid {
    value: string;
    viewValue: string;
}