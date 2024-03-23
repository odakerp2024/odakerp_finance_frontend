import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { StateMaster } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';
import { Country } from 'src/app/model/Organzation';
declare let $: any;
@Component({
    selector: 'app-statemaster',
    templateUrl: './statemaster.component.html',
    styleUrls: ['./statemaster.component.css']
})
export class StatemasterComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    stateForm: FormGroup;
    dataSource: StateMaster[];
    dscountryItem: Country[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.stateForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    ngOnInit() {
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
        this.OnBindDropdownCountry();
    }

    OnBindDropdownCountry() {
        this.service.getCountryBind().subscribe(data => {
            this.dscountryItem = data;

        });
    }

    createForm() {
        if (this.stateForm.value.ID != null) {

            this.service.getStateedit(this.stateForm.value).pipe(
            ).subscribe(data => {
                this.stateForm.patchValue(data[0]);
                $('#ddlStatus').select2().val(data[0].Status);
                $('#ddlCountry').select2().val(data[0].CountryID);
            });

            this.stateForm = this.fb.group({
                ID: 0,
                StateCode: '',
                StateName: '',
                CountryID: 0,
                Status: 0
            });
        }
        else {
            this.stateForm = this.fb.group({
                ID: 0,
                StateCode: '',
                StateName: '',
                CountryID: 0,
                Status: 1
            });
            $('#ddlStatus').select2().val(0);
        }
    }


    onSubmit() {
        var validation = "";
        if ($('#ddlCountry').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Country</span></br>"
        }
        if (this.stateForm.value.StateName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter State Name</span></br>"
        }
        if (this.stateForm.value.StateCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter State Code</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        } else {
            this.stateForm.value.Status = $('#ddlStatus').val();
            this.stateForm.value.CountryID = $('#ddlCountry').val();
            this.service.saveState(this.stateForm.value).subscribe(Data => {
                Swal.fire(Data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }


    }

    onBack() {      
        if (this.stateForm.value.ID == 0) {
            var validation = "";
            if ($('#ddlCountry').val() != null || this.stateForm.value.StateName != "" || this.stateForm.value.StateCode != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/statemaster/statemasterview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/statemaster/statemasterview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/statemaster/statemasterview']);
        }
    }
}

interface Status {
    value: string;
    viewValue: string;
}
