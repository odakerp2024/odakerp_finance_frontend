import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentNumbering } from '../../../../model/system';
import { LinerName, GeneralMaster } from '../../../../model/common';
import { SystemService } from 'src/app/services/system.service';
import { CommonService } from 'src/app/services/common.service';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-documentnumbering',
  templateUrl: './documentnumbering.component.html',
  styleUrls: ['./documentnumbering.component.css']
})
export class DocumentnumberingComponent implements OnInit {
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];
    modid = "7";
    progid = "54";
    
/*    ProgramID: 0;*/
    linerItem: LinerName[];
    moduleItem: GeneralMaster[];
    programItem: GeneralMaster[];
    logItem: DocumentNumbering[];
    myControl = new FormControl('');
    docnumbForm: FormGroup;
    
    constructor(private router: Router, private route: ActivatedRoute, private cs: CommonService, private ss: SystemService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {

            this.docnumbForm = this.fb.group({
                ID: params['id'],

            });
        });
    }

    ngOnInit() {

        $('.my-select').select2();
        this.createForm();
        this.onInitalBinding();
    }
    onInitalBinding() {

        this.OnBindDropdownLiner();
        this.OnBindDropdownModule();
        this.OnBindDropdownProgram();
        /*this.OnBindDropdownNumbLogics();*/
        this.ProgramChange();
    }
    OnBindDropdownLiner() {
        this.cs.getLinerNameList(this.docnumbForm.value).subscribe(data => {
            this.linerItem = data;
        });
    }
    
    OnBindDropdownModule() {

        this.cs.getModuleList(this.modid).subscribe(data => {
            this.moduleItem = data;
        });
    }

    OnBindDropdownProgram() {

        this.cs.getProgramList(this.progid).subscribe(data => {
            this.programItem = data;
        });
    }
    //OnBindDropdownNumbLogics() {

    //    this.ss.getNumbLogicList(this.docnumbForm.value).subscribe(data => {
    //        this.logItem = data;
    //    });
    //}

    ProgramChange() {
        this.ss.getProgramChange(this.docnumbForm.get('ProgramID').value).subscribe(data => {
            this.logItem = data;
        });
    }
    createForm() {
        this.ss.getDocNumbEdit(this.docnumbForm.value).pipe().subscribe(data => {
            this.docnumbForm.patchValue(data[0]);
            $('#ddlModule').select2().val(data[0].Module);
            $('#ddlProgram').select2().val(data[0].Program);
            $('#ddlStatus').select2().val(data[0].Status);
            $('#ddlNumbLogic').select2().val(data[0].BLNoLogic);
            $('#ddlLinerName').select2().val(data[0].LinerName);
            this.ProgramChange()
        });
        this.docnumbForm = this.fb.group({
            ID: 0,
            ModuleID: 0,
            ProgramID: 0,
            StatusID: 1,
            LinerCode: '',
            LinerID: 0,
            BLNoLogicID: 0,
            LinerName: '',
            BLNoLogic: '',
            StatusResult: '',
            Module: '',
            Program: '',
            Status:''

        });
    }
    onSubmit() {
        this.docnumbForm.value.Module = $('#ddlModule').val();
        this.docnumbForm.value.Program = $('#ddlProgram').val();
        this.docnumbForm.value.Status = $('#ddlStatus').val();
        this.docnumbForm.value.NumbLogic = $('#ddlNumbLogic').val();
        this.docnumbForm.value.LinerName = $('#ddlLinerName').val();

        if (this.docnumbForm.valid) {

            this.ss.saveDocNumb(this.docnumbForm.value).subscribe(DocumentNumbering => { Swal.fire("Record Saved Successfully") });
        } else {
            /* alert('Please check validation failed.');*/
        }

    }
}
interface Status {
    value: string;
    viewValue: string;
}
