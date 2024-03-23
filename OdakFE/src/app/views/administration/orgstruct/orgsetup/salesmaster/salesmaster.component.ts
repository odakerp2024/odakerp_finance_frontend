import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Region, Office, State } from '../../../../../model/org';
import { City, Country } from '../../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { MastersService } from '../../../../../services/masters.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare let $: any;


@Component({
    selector: 'app-salesmaster',
    templateUrl: './salesmaster.component.html',
    styleUrls: ['./salesmaster.component.css']
})
export class SalesmasterComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    myControl = new FormControl('');
    salesForm: FormGroup;
    dataSource: Office[];
    dscountryItem: Country[];
    dsOffItem: Office[];
    dsOffLocItem: Office[];
    filteredOptions: Observable<string[]>;
    constructor(private router: Router, private route: ActivatedRoute, private service: OrgService, private ms: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.salesForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

    ngOnInit() {
        $('.my-select').select2();
        this.createForm();
        this.onInitalBinding();
        $('#ddlOfficeLoc').on('select2:select', (e, args) => {
            this.OfficeLocChanged($("#ddlOfficeLoc").val());
        });
    }



    onInitalBinding() {

        this.OnBindDropdownOfficeLoc();
    }

    OnBindDropdownOfficeLoc() {
        this.service.getOfficeLocBind(this.salesForm.value).subscribe(data => {
            this.dsOffLocItem = data;
        });
    }
    OfficeLocChanged(countryval) {
        this.salesForm.value.OfficeLocID = countryval;
        this.service.getOfficeByLocs(this.salesForm.value).subscribe(data => this.dsOffItem = data);
    }

    createForm() {

        if (this.salesForm.value.ID != null) {
            this.service.getSalesOfficeEdit(this.salesForm.value).pipe(
            ).subscribe(data => {
                this.salesForm.patchValue(data[0]);
                this.OfficeLocChanged(data[0].OfficeLocID);
                $('#ddlCom').select2().val(data[0].OfficeID);
                $('#ddlOfficeLoc').select2().val(data[0].OfficeLocID);
                $('#ddlStatus').select2().val(data[0].Status);

            });


            this.salesForm = this.fb.group({
                ID: 0,
                SalesOffLoc: '',
                OfficeLocID: 0,
                OfficeID: 0,
                Status: 0
            });
        }
        else {
            this.salesForm = this.fb.group({
                ID: 0,
                SalesOffLoc: '',
                OfficeLocID: 0,
                OfficeID: 0,
                Status: 1
            });
            $('#ddlStatus').select2().val(0);
        }




        //if (this.salesForm.value.ID != null) {
        //    //this.service.getSalesOfficeEdit(this.salesForm.value).pipe().subscribe(data => {
        //    //    this.OfficeLocChanged(),
        //    //    this.salesForm.patchValue(data[0]);
        //    //    //$('#ddlStatus').select2().val(data[0].Status);
        //    //    //$('#ddlOfficeLoc').select2().val(data[0].OfficeLocID);
        //    //    //$('#ddlCom').select2().val(data[0].OfficeID);
        //    //});
        //    this.service.getSalesOfficeEdit(this.salesForm.value).pipe(tap(data => this.salesForm.patchValue(data[0]))
        //    ).subscribe(dt => { this.OfficeLocChanged() });


        //    this.salesForm = this.fb.group({
        //        ID: 0,
        //        SalesOffLoc: '',
        //        OfficeLocID: 0,
        //        OfficeID: 0,
        //        Status: 0
        //    });
        //}
        //else {
        //    this.salesForm = this.fb.group({
        //        ID: 0,
        //        SalesOffLoc: '',
        //        OfficeLocID: 0,
        //        OfficeID: 0,
        //        Status: 1
        //    });

        //}
    }


    onSubmit() {
        var validation = "";

        if (this.salesForm.value.SalesOffLoc == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Select Sales Office Location</span></br>"
        }

        if ($('#ddlOfficeLoc').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Handled by Office</span></br>"
        }
        if ($('#ddlCom').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Operational Company</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        if ($('#ddlCom').val() == null) {
            this.salesForm.value.OfficeID = 0;
        }
        else {
            this.salesForm.value.OfficeID = $('#ddlCom').val();
        }
        this.salesForm.value.OfficeLocID = $('#ddlOfficeLoc').val();
        this.salesForm.value.Status = $('#ddlStatus').val();
        this.service.saveSalesOffice(this.salesForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }


    onBack() {
        if (this.salesForm.value.ID == 0) {
            var validation = "";
            if (this.salesForm.value.SalesOffLoc != "" || $('#ddlOfficeLoc').val() != null || $('#ddlCom').val() != null) {
                validation += "<span style='color:red;'>*</span> <span>Do you want save changes?</span></br>"
            }
            if (validation != "") {
                Swal.fire({
                    title: 'Do you want to save the changes?',
                    showDenyButton: true,
                    confirmButtonText: 'YES',
                    denyButtonText: `NO`,
                }).then((result) => {
                    if (result.isConfirmed) {
                    } else {
                        this.router.navigate(['/views/administration/orgstruct/orgsetup/salesmaster/salesmasterview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/administration/orgstruct/orgsetup/salesmaster/salesmasterview']);
            }
        }
        else {
            this.router.navigate(['/views/administration/orgstruct/orgsetup/salesmaster/salesmasterview']);
        }
    }
}
interface Status {
    value: string;
    viewValue: string;
}