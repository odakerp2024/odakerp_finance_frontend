import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { tap } from 'rxjs/operators';
import { Country } from 'src/app/model/Organzation';
import Swal from 'sweetalert2';
import { City, Depot, Port, DynamicGrid } from '../../../../model/common';
import { MastersService } from '../../../../services/masters.service';
declare let $: any;
@Component({
    selector: 'app-depot',
    templateUrl: './depot.component.html',
    styleUrls: ['./depot.component.css']
})
export class DepotComponent implements OnInit {
    PID = null;
    HDArrayIndex = '';
    PIDValue = '';
    DynamicGrid: Array<DynamicGrid> = [];
    val: any = {};
    statusvalues: Status[] = [
        { value: '1', viewValue: 'ACTIVE' },
        { value: '2', viewValue: 'IN-ACTIVE' },
    ];

    myControl = new FormControl('');
    depotForm: FormGroup;
    dataSource: Depot[];
    dscountryItem: Country[];
    dscityItem: City[];
    dsPortItem: Depot[];

    constructor(private router: Router, private route: ActivatedRoute, private service: MastersService, private fb: FormBuilder) {
        this.route.queryParams.subscribe(params => {
            this.depotForm = this.fb.group({
                ID: params['id'],
            });

        });
    }

    //addRow(index) {
    //    this.newDynamic = { PID: 0, Port: "", PortID: 0 };
    //    this.dynamicArray.push(this.newDynamic);
    //    //this.toastr.success('New row added successfully', 'New Row');
    //    console.log(this.dynamicArray);
    //    return true;
    //}


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
        this.OnBindDropdownCity();
        /* this.OnBindDropdownPort();*/
        this.PortNameChange();
    }
    InitBind() {
      
      

    }
    OnBindDropdownCountry() {
        this.service.getCountryBind().subscribe(data => {
            this.dscountryItem = data;
        });
    }

    OnBindDropdownCity() {
        this.service.getCityBind(this.depotForm.value).subscribe(data => {
            this.dscityItem = data;
        });
    }

    //OnBindDropdownPort() {
    //    this.service.getPortByCountryBind().subscribe(data => {
    //        this.dsPortItem = data;
    //    });
    //}
    PortNameChange() {
        this.service.getPortByCountryBind(this.depotForm.get('DepCountry').value).subscribe(data => {
            this.dsPortItem = data;
        });

        this.service.getCityByCountryBind(this.depotForm.get('DepCountry').value).subscribe(data => {
            this.dscityItem = data;
        });
    }
    createForm() {
        this.service.getDepotedit(this.depotForm.value).pipe(

        ).subscribe(data => {
            this.depotForm.patchValue(data[0]);
            $('#ddlDepCountry').select2().val(data[0].DepCountry);
            $('#ddlStatus').select2().val(data[0].Status);
            $('#ddlCity').select2().val(data[0].DepCity);
            this.PortNameChange();
        });


        //this.service.getDepotedit(this.depotForm.value).pipe()
        //.subscribe(data => {
        //    this.depotForm.patchValue(data[0]); $('#ddlStatus').select2().val(data[0].Status);


        //    this.PortNameChange();
        //});

        this.service.getDepoteditDtls(this.depotForm.value).pipe(tap(data2 => {
            this.DynamicGrid.splice(0, 1);

            for (let item of data2) {

                this.DynamicGrid.push({
                    'PID': item.PID,
                    'PortID': item.PortID,
                    'Port': item.Port,
                });
                //this.OfficeLocChanged(item.OfficeLocID, item);

            }
        }
        )).subscribe();


        this.depotForm = this.fb.group({
            ID: 0,
            DepName: '',
            DepAddress: '',
            DepCountry: 0,
            DepCity: '',
            Status: 0,
            CityName: '',
            PortName: '',
        });
    }
    OnClickAddValue() {
        var PIDValue;
        PIDValue = (this.PID == null) ? 0 : this.PID;
        this.val = {
            PID: PIDValue,
            Port: $("#ddlPort option:selected").text(),
            PortID: $("#ddlPort").val(),
           
        };

        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicGrid[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicGrid.push(this.val);
        }
        $("#ddlPort").val(0).trigger("change");
       
        this.PID = 0;

    }

    OnclickSelectvalues(DynamicGrid, index) {
        this.HDArrayIndex = index;
        this.PID = this.DynamicGrid[index].PID;
        $("#ddlPort").select2().val(this.DynamicGrid[index].PortID).trigger("change");
        


    }

    OnclickRemove(DynamicGrid, index) {

        this.DynamicGrid.splice(index, 1);
    }

    onSubmit() {

       

        var validation = "";

        if (this.depotForm.value.DepName == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Depot Name</span></br>"
        }
        if (this.depotForm.value.DepAddress == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Depot Address</span></br>"
        }
        if (this.depotForm.value.DepCountry == 0) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Country</span></br>"
        }

        if (validation != "") {
            Swal.fire(validation)
            return false;
        } else {
            var ItemsSchedule = [];

            for (let item of this.DynamicGrid) {

                var intPID = item.PID;
                if (typeof item.PID == "undefined") {
                    intPID = 0;
                }
                ItemsSchedule.push('Insert:' + intPID, item.PortID, item.Port
                );
            }
            this.depotForm.value.Itemsv = ItemsSchedule.toString();
            console.log(ItemsSchedule.toString());
            this.service.saveDepot(this.depotForm.value).subscribe(data => { Swal.fire("Record Saved Successfully") });
        }

    }

}

interface Status {
    value: string;
    viewValue: string;

}
