import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UOMMaster } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';
declare let $: any;
@Component({
    selector: 'app-uommaster',
    templateUrl: './uommaster.component.html',
    styleUrls: ['./uommaster.component.css']
})
export class UommasterComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    uommasterForm: FormGroup;
    dataSource: UOMMaster[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {

        this.route.queryParams.subscribe(params => {
            this.uommasterForm = this.fb.group({
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
        if (this.uommasterForm.value.ID != null) {

            this.service.getUOMedit(this.uommasterForm.value).pipe(
            ).subscribe(data => {
                this.uommasterForm.patchValue(data[0]);
                $('#ddlStatus').select2().val(data[0].Status);
            });

           
            this.uommasterForm = this.fb.group({
                ID: 0,
                UOMCode: '',
                UOMDesc: '',
                Status: 0
            });
        }
        else {
            this.uommasterForm = this.fb.group({
                ID: 0,
                UOMCode: '',
                UOMDesc: '',
                Status: 1
            });
        }
      
    }

    onSubmit() {
        var validation = "";

        if (this.uommasterForm.value.UOMCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter UOM Code</span></br>"
        }
        if (this.uommasterForm.value.UOMDesc == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter UOM Description</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation)
            return false;
        } else {
            this.uommasterForm.value.Status = $('#ddlStatus').val();
            this.service.saveUOM(this.uommasterForm.value).subscribe(Data => {
                Swal.fire(Data[0].AlertMessage)
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
        }

    }

    onBack() {
        if (this.uommasterForm.value.ID == 0) {
            var validation = "";
            if (this.uommasterForm.value.UOMCode != "" || this.uommasterForm.value.UOMDesc != "") {
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
                        this.router.navigate(['/views/masters/commonmaster/uommaster/uommasterview']);
                    }
                })

                return false;
            }
            else {
                this.router.navigate(['/views/masters/commonmaster/uommaster/uommasterview']);
            }
        }
        else {
            this.router.navigate(['/views/masters/commonmaster/uommaster/uommasterview']);
        }
    }

}

interface Status {
    value: string;
    viewValue: string;
}
