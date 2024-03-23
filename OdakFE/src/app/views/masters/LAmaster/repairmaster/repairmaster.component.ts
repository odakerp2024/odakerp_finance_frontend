import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RepairMaster } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';

@Component({
  selector: 'app-repairmaster',
  templateUrl: './repairmaster.component.html',
  styleUrls: ['./repairmaster.component.css']
})
export class RepairmasterComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    id = "0";
    myControl = new FormControl('');
    repairForm: FormGroup;
    dataSource: RepairMaster[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.repairForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.service.getRepairedit(this.repairForm.value).pipe(tap(data => this.repairForm.patchValue(data[0]))
        ).subscribe();
        this.repairForm = this.fb.group({
            ID: 0,
            RepairCode: '',
            RepairDescription: '',
            Status: 0
        });
    }

    onSubmit() {
        var validation = "";

        if (this.repairForm.value.RepairCode == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Repair Code</span></br>"
        }
        if (this.repairForm.value.RepairDescription == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Repair Description</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        } else {
            this.service.saveRepair(this.repairForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
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
