import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { Country } from '../../../../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    // options: string[] = ['One', 'Two', 'Three'];



    myControl = new FormControl('');
    countryForm: FormGroup;
    dataSource: Country[];
    DepartmentList: any = [];
    filteredOptions: Observable<string[]>;
    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
       
        this.route.queryParams.subscribe(params => {
            this.countryForm = this.fb.group({
                ID: params['id'],
                //CountryName: '',
                //CountryCode: '',
                //Status: 0
            });
        });
    }


    ngOnInit() {
        //$('.my-select').select2();
        this.createForm();
       
    }

    createForm() {
        if (this.countryForm.value.ID != null) {

            this.service.getCountryEdit(this.countryForm.value).pipe(
            ).subscribe(data => {
                this.countryForm.patchValue(data[0]);
                $('#ddlStatus').select2().val(data[0].Status);
            });
           
            this.countryForm = this.fb.group({
                ID: 0,
                CountryName: '',
                CountryCode: '',
                Status: 0
            });
        }
        else {
            this.countryForm = this.fb.group({
                ID: 0,
                CountryName: '',
                CountryCode: '',
                Status: 1
            });
            $('#ddlStatus').select2().val(0);
        }
    }

    onSubmit() {
 
        var validation = "";

     
        if (this.countryForm.value.CountryName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Country Name </span></br>"
        }
        if (this.countryForm.value.CountryCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Country Code</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }
        else {
            this.countryForm.value.Status = $('#ddlStatus').val();
            this.service.saveCtry(this.countryForm.value).subscribe(data => {
                
                this.countryForm.value.ID = data[0].ID;
                Swal.fire(data[0].AlertMessage);
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }

    }

    onBack() {
        if (this.countryForm.value.ID == 0) {
            var validation = "";
            if (this.countryForm.value.CountryName != "" || this.countryForm.value.CountryCode != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/country/countryview1']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/country/countryview1']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/country/countryview1']);
        }
    }
}
interface Status {
    value: string;
    viewValue: string;
}
