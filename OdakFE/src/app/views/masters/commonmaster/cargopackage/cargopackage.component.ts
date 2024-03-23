import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Cargo } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';
declare let $: any;
@Component({
    selector: 'app-cargopackage',
    templateUrl: './cargopackage.component.html',
    styleUrls: ['./cargopackage.component.css']
})
export class CargopackageComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    cargoForm: FormGroup;
    dataSource: Cargo[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.cargoForm = this.fb.group({
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
    }

    createForm() {
        if (this.cargoForm.value.ID != null) {

            this.service.getCargoedit(this.cargoForm.value).pipe(
            ).subscribe(data => {
                this.cargoForm.patchValue(data[0]);
                $('#ddlStatus').select2().val(data[0].Status);
            });

            this.cargoForm = this.fb.group({
                ID: 0,
                PkgCode: '',
                PkgDescription: '',
                Status: 0
            });
        }
        else {
            this.cargoForm = this.fb.group({
                ID: 0,
                PkgCode: '',
                PkgDescription: '',
                Status: 1
            });
            $('#ddlStatus').select2().val(0);
        }
    }

    onSubmit() {
        var validation = "";

        if (this.cargoForm.value.PkgCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Package Code</span></br>"
        }
        if (this.cargoForm.value.PkgDescription == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Package Description</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation)
            return false;
        } else {
            this.cargoForm.value.Status = $('#ddlStatus').val();
            this.service.saveCargo(this.cargoForm.value).subscribe(Data => {
                Swal.fire(Data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }


    }
    onBack() {
        if (this.cargoForm.value.ID == 0) {
            var validation = "";
            if (this.cargoForm.value.PkgCode != "" || this.cargoForm.value.PkgDescription != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/cargopackage/cargopackageview']);
                    }
                })
                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/cargopackage/cargopackageview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/cargopackage/cargopackageview']);
        }
    }
}

interface Status {
    value: string;
    viewValue: string;
}
