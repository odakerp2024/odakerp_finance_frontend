import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrgService } from 'src/app/services/org.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Region } from '../../../../../model/org'
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MastersService } from '../../../../../services/masters.service';
declare let $: any;

@Component({
    selector: 'app-regionmaster',
    templateUrl: './regionmaster.component.html',
    styleUrls: ['./regionmaster.component.css']
})
export class RegionmasterComponent implements OnInit {

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    myControl = new FormControl('');
    regionForm: FormGroup;
    dataSource: Region[];
    DepartmentList: any = [];
    filteredOptions: Observable<string[]>;
    constructor(private router: Router, private route: ActivatedRoute, private service: OrgService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.regionForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

    ngOnInit() {
        $('.my-select').select2();
        this.createForm();

    }

    createForm() {

        if (this.regionForm.value.ID != null) {
            this.service.getRegionEdit(this.regionForm.value).pipe().subscribe(data => {
                this.regionForm.patchValue(data[0]);
                $('#ddlStatus').select2().val(data[0].Status);
            });
            this.regionForm = this.fb.group({
                ID: 0,
                RegionName: '',
                Status: 0,
                StatusV: ''
            });
        }
        else {
            this.regionForm = this.fb.group({
                ID: 0,
                RegionName: '',
                Status: 1,
                StatusV: ''
            });
        }

    }

    onSubmit() {
        var validation = "";


        if (this.regionForm.value.RegionName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Region Name</span></br>"
        }
        if (this.regionForm.value.Status == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Status</span></br>"
        }
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        this.regionForm.value.Status = $('#ddlStatus').val();
        this.service.saveRegion(this.regionForm.value).subscribe(Data => {
            Swal.fire(Data[0].AlertMessage)
        },
            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }
    
    onBack() {
        if (this.regionForm.value.ID == 0) {
            var validation = "";
            if (this.regionForm.value.RegionName != "") {
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
                        this.router.navigate(['/views/administration/orgstruct/orgsetup/regionmaster/regionmasterview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/administration/orgstruct/orgsetup/regionmaster/regionmasterview']);
            }
        }
        else {
            this.router.navigate(['/views/administration/orgstruct/orgsetup/regionmaster/regionmasterview']);
        }
    }
}
interface Status {
    value: string;
    viewValue: string;
}