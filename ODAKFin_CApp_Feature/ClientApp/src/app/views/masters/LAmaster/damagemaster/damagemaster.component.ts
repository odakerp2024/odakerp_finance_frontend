import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DamageMaster } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';

@Component({
  selector: 'app-damagemaster',
  templateUrl: './damagemaster.component.html',
  styleUrls: ['./damagemaster.component.css']
})
export class DamagemasterComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    damageForm: FormGroup;
    dataSource: DamageMaster[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.damageForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    ngOnInit() {
        this.createForm();
  }

    createForm() {
        this.service.getDamageedit(this.damageForm.value).pipe(tap(data => this.damageForm.patchValue(data[0]))
        ).subscribe();
        this.damageForm = this.fb.group({
            ID: 0,
            DamageCode: '',
            DamageDescription: '',
            Status: 0
        });
    }

    onSubmit() {
        var validation = "";

        if (this.damageForm.value.DamageCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Damage Code</span></br>"
        }
        if (this.damageForm.value.DamageDescription == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Damage Description</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        } else {
            this.service.saveDamage(this.damageForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
        }

        //alert('test');
        //if (this.damageForm.valid) {

        //    this.service.saveDamage(this.damageForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
        //} else {
        //    /* alert('Please check validation failed.');*/
        //}

    }

}

interface Status {
    value: string;
    viewValue: string;
}
