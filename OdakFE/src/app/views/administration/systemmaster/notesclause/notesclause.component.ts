import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Notes, NotesGrid } from '../../../../model/common';
import { PaginationService } from '../../../../pagination.service';
import { MastersService } from '../../../../services/masters.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-notesclause',
  templateUrl: './notesclause.component.html',
  styleUrls: ['./notesclause.component.css']
})
export class NotesclauseComponent implements OnInit {
    NID = null;
    NIDValue = '';
    dynamicArray: Array<NotesGrid> = [];
    newDynamic: any = {};
    notesForm: FormGroup;
    dataSource: Notes[];
    constructor(private router: Router, private route: ActivatedRoute, private ms: MastersService, private fb: FormBuilder, public ps: PaginationService) {

        this.route.queryParams.subscribe(params => {
           
            this.notesForm = this.fb.group({
                ID: params['id'],
                DocID: params['id'],
                
            });
            alert(this.notesForm.value.DocID);
        });
    }

    ngOnInit() {
        this.dynamicArray.push(this.newDynamic);
        this.createForm();
        this.newDynamic = { ID: 0,Notes: ''};
    }

    createForm() {
      
        
        this.ms.getNotesEditDtls(this.notesForm.value).pipe(tap(data1 => {
            this.dynamicArray.splice(0, 1);

            for (let item of data1) {
                
                this.dynamicArray.push({
                    ID: item.ID,
                    Notes: item.Notes,
                   
                });

            }
        }
        )).subscribe();
        //this.notesForm = this.fb.group({
        //    NID: 0,
        //    Notes: '',
            
        //});
    }

    onSubmit() {


        var ItemsSchedule = [];

        for (let item of this.dynamicArray) {

            var intNID = item.ID;
            if (typeof item.ID == "undefined") {
                intNID = 0;
            }
          
            ItemsSchedule.push('Insert:' + intNID, item.Notes
            );
        }
        this.notesForm.value.Itemsv = ItemsSchedule.toString();
        //this.notesForm.value.DocID = this.notesForm = this.fb.group({
        //    ID: params['id'],

        //});
       
        this.ms.SaveNotes(this.notesForm.value).subscribe(cty => { Swal.fire("Record Saved Successfully") });
        //Swal.fire({
        //    title: 'Are you sure?',
        //    text: "You won't be able to revert this!",
        //    icon: 'warning',
        //    showCancelButton: true,
        //    confirmButtonColor: '#3085d6',
        //    cancelButtonColor: '#d33',
        //    confirmButtonText: 'Yes, delete it!'
        //}).then((result) => {
        //    if (result.isConfirmed) {
        //        Swal.fire(
        //            'Deleted!',
        //            'Your file has been deleted.',
        //            'success'
        //        )
        //    }
        //})
    }
    addRow(index) {
        this.newDynamic = { ID: 0, Notes: ""};
        this.dynamicArray.push(this.newDynamic);
        //this.toastr.success('New row added successfully', 'New Row');
        // console.log(this.dynamicArray);
        return true;
    }

    deleteRow(index, ID) {
        
        this.newDynamic = { ID: 0, Notes: "" };
        this.dynamicArray.push(this.newDynamic);
        this.notesForm.value.ID = ID;
        this.ms.DeleteNotes(this.notesForm.value).subscribe();
        this.dynamicArray.splice(index, 1);
        this.ngOnInit();
        if (this.dynamicArray.length == 1) {
            //this.toastr.error("Can't delete the row when there is only one row", 'Warning');
            return false;
        } else {
            
            // this.toastr.warning('Row deleted successfully', 'Delete row');
            return true;

        }
       
    }
}
