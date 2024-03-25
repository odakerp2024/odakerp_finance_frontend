import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Voyage, VesselMaster, TerminalMaster, TerminalGrid, VoyageNoteTypeMaster, GridVoyageNoteMaster, PortMaster } from '../../../../model/Voyage';
import { Country, City, MyAgency, Port, Terminal } from 'src/app/model/common';
import { VoyageService } from '../../../../services/voyage.service';
import { Region, Office, State, Org, DynamicGrid, SalesOffice, SalesOfficeDD } from '../../../../model/org';
import { PartyService } from '../../../../services/party.service';
import { RateapprovalService } from '../../../../services/rateapproval.service';
declare let $: any;

@Component({
    selector: 'app-voyage',
    templateUrl: './voyage.component.html',
    styleUrls: ['./voyage.component.css']
})
export class VoyageComponent implements OnInit {
    val: any = {};
    HDArrayIndex = '';
    TIDValue = '';
    OID = null;
    TID = null;
    TLID = null;
    myControl = new FormControl('');
    Voyageform: FormGroup;
    dataSource: Voyage[];
    ddlVesselItem: VesselMaster[];
    ddlPortItem: Port[];
    ddlPortValues: PortMaster[];
    ddlVoyageNoteItem: VoyageNoteTypeMaster[];
    ddlterminalItem: TerminalMaster[];
    DynamicTerminalMaster: Array<TerminalGrid> = [];
    newDynamicTerminal: any = {};
    DynamicVoyageNoteMaster: Array<GridVoyageNoteMaster> = [];
    newDynamicVoyageNoteMaster: any = {};
    gridterminalItem: TerminalMaster[];


    constructor(private router: Router, private route: ActivatedRoute, private service: VoyageService, private fb: FormBuilder, private rs: RateapprovalService) {
        this.route.queryParams.subscribe(params => {
            this.Voyageform = this.fb.group({
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
        this.newDynamicTerminal = { TID: '', TerminalID: 0, RotationNo: '', TerminalName: '' };
        //this.DynamicTerminalMaster.push(this.newDynamicTerminal);
        this.newDynamicVoyageNoteMaster = { VID: '', NoteType: 0, Notes: '' };
        this.DynamicVoyageNoteMaster.push(this.newDynamicVoyageNoteMaster);
        this.createForm();
        this.Binddropdowns();
    }

    Binddropdowns() {
        this.OnBindDropdownVessel();
        this.OnBindDropdownport();
        //this.OnBindDropdownTerminal();
        this.OnBindDropdownVoyageNote();
        $('#ddlPort').on('select2:select', (e, args) => {
            this.OnClickPortTerminal($("#ddlPort").val());
        });
    }
    OnClickPortTerminal(PortIDv) {

        this.Voyageform.value.PortID = PortIDv
        this.service.getTerminalList(this.Voyageform.value).subscribe(data => {
            this.ddlterminalItem = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    OnBindDropdownVessel() {
        this.service.getVesselBind(this.Voyageform.value).subscribe(data => {
            this.ddlVesselItem = data;
        });
    }
    OnBindDropdownport() {
        this.service.getPortList(this.Voyageform.value).subscribe(data => {
            this.ddlPortValues = data;
        }, (error: HttpErrorResponse) => {
            Swal.fire(error.message);
        });
    }
    //OnBindDropdownport() {
    //    this.rs.getPortMasterBind(this.Voyageform.value).subscribe(data => {
    //        this.ddlPortItem = data;
    //    });
    //}
    //OnBindDropdownTerminal() {
    //    this.service.getTerminalMasterBind(this.Voyageform.value).subscribe(data => {
    //        this.gridterminalItem = data;
    //    });
    //}
    OnBindDropdownVoyageNote() {
        this.service.getVoyageNoteTypeMasterBind(this.Voyageform.value).subscribe(data => {
            this.ddlVoyageNoteItem = data;
        });
    }
    createForm() {
        if (this.Voyageform.value.ID != null) {

            this.service.getVoyageEdit(this.Voyageform.value).pipe(
            ).subscribe(data => {
                this.Voyageform.patchValue(data[0]);
                $('#ddlVessel').select2().val(data[0].VesselID);
                $('#ddlPort').select2().val(data[0].PortID);
                this.OnClickPortTerminal(data[0].PortID);
            });
            this.service.getVoyageEditTerminal(this.Voyageform.value).pipe(tap(data1 => {
                this.DynamicTerminalMaster.splice(0, 1);

                for (let item of data1) {

                    this.DynamicTerminalMaster.push({

                        'TID': item.TID,
                        'TerminalID': item.TerminalID,
                        'RotationNo': item.RotationNo,
                        'TerminalName': item.TerminalName,
                    });
                }

            }

            )).subscribe();

            this.service.getVoyNoteEdit(this.Voyageform.value).subscribe((data1) => {
                this.DynamicVoyageNoteMaster.splice(0, 1);


                if (data1.length > 0) {
                    this.DynamicVoyageNoteMaster.length = 0;
                    for (let item of data1) {

                        this.DynamicVoyageNoteMaster.push({

                            'NID': item.NID,
                            'NotesType': item.NotesType,
                            'Notes': item.Notes,
                        });

                    }
                }
                else {

                    this.newDynamicVoyageNoteMaster = { VID: '', NoteType: 0, Notes: '' };
                    this.DynamicVoyageNoteMaster.push(this.newDynamicVoyageNoteMaster);
                }
            }
            );

            this.Voyageform = this.fb.group
                ({
                    ID: 0,
                    VesselID: 0,
                    PortID: 0,
                    VoyageID: 0,
                    ETA: '',
                    ETD: '',
                    ATA: '',
                    ATD: '',
                    VoyageNo: '',
                    CutOffDate: '',
                    EGMDate: '',
                    EGMNo: '',
                    IGMDate: '',
                    IGMNo: '',
                });
        }
        else {
            //insert values passing
            this.Voyageform = this.fb.group
                ({
                    ID: 0,
                    VesselID: 0,
                    PortID: 0,
                    VoyageID: 0,
                    ETA: '',
                    ETD: '',
                    ATA: '',
                    ATD: '',
                    VoyageNo: '',
                    CutOffDate: '',
                    EGMDate: '',
                    EGMNo: '',
                    IGMDate: '',
                    IGMNo: '',
                });
            $('#ddlVessel').select2().val(0);
            $('#ddlPort').select2().val(0);

        }
    }
    AddTerminal() {


        var validation = "";

        var ddlTerminal = $('#ddlTerminal').val();
        if (ddlTerminal == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select Terminal Name</span></br>"
        }
        for (var i = 0; i < this.DynamicTerminalMaster.length; i++) {

            if (this.DynamicTerminalMaster[i].TerminalID == $('#ddlTerminal').val()) {

                validation += "<span style='color:red;'>*</span> <span>Terminal Name Already Exists </span></br>"
            }

        }
        if (validation != "") {
            Swal.fire(validation)
            return false;
        }

        var TIDValue;

        TIDValue = (this.TID == null) ? 0 : this.TID;

        this.val = {

            TID: TIDValue,
            TerminalID: $("#ddlTerminal").val(),
            TerminalName: $("#ddlTerminal option:selected").text(),
            RotationNo: $("#txtRotationNo").val(),

        };


        if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
            this.DynamicTerminalMaster[this.HDArrayIndex] = this.val;
        } else {
            this.DynamicTerminalMaster.push(this.val);
        }
        console.log('terminal', this.val)
        $("#ddlTerminal").select2().val(0, "").trigger("change");
        this.HDArrayIndex = "";
    }
    OnclickTerminalSelectvalues(DynamicTerminalMaster, index) {

        this.HDArrayIndex = index;
        this.TID = this.DynamicTerminalMaster[index].TID;
        $("#ddlTerminal").select2().val(this.DynamicTerminalMaster[index].TerminalID).trigger("change");
        /* $("#txtRotationNo").select2().val(this.DynamicTerminalMaster[index].RotationNo).trigger("change");*/
        $("#txtRotationNo").val(this.DynamicTerminalMaster[index].RotationNo);
    }
    OnclickTerminalRemove(DynamicTerminalMaster, index, TID) {
        if (this.DynamicTerminalMaster.length == 1) {
            Swal.fire("Can't delete the row when there is only one row", 'Warning')
            return false;
        } else {
            this.DynamicTerminalMaster.splice(index, 1);           
            this.Voyageform.value.TID = TID;
            this.service.getTeminalDelete(this.Voyageform.value).subscribe(Data => {
                //delete to anthere values binding 
                this.createForm();

                Swal.fire("Deleted Successfully", 'Warning')
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
            return true;
        }
    }
    AddVoyage(index) {
        var validation = "";

        if ($('#ddlVoyageNote').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select VoyageNote</span></br>"
        }

        if (validation != "") {

            Swal.fire(validation)
            return false;
        }

        this.newDynamicVoyageNoteMaster = {
            NoteType: 0,
            Notes: '',
        };
        this.DynamicVoyageNoteMaster.push(this.newDynamicVoyageNoteMaster);
        console.log(this.DynamicVoyageNoteMaster);
        return true;
    }
    deleteRowVoyageNote(DynamicVoyageNoteMaster, index, NID) {
        if (this.DynamicVoyageNoteMaster.length == 1) {
            Swal.fire("Can't delete the row when there is only one row", 'Warning')
            return false;
        } else {
            this.DynamicVoyageNoteMaster.splice(index, 1);
            this.Voyageform.value.NID = NID;
            this.service.getVoyageNoteDelete(this.Voyageform.value).subscribe(Data => {
                this.createForm();
                Swal.fire("Deleted Successfully", 'Warning')
            },
                (error: HttpErrorResponse) => {
                    Swal.fire(error.message)
                });
            return true;
        }

    }

    onSubmit() {
        var validation = "";
        if (this.Voyageform.value.VoyageNo == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter Voyage Number</span></br>"
        }
        if (this.Voyageform.value.ETA == "") {
            validation += "<span style='color:red;'>*</span> <span>Please Enter ETA</span></br>"
        }
        if ($('#ddlPort').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select PortName</span></br>"
        }
        if ($('#ddlVessel').val() == null) {
            validation += "<span style='color:red;'>*</span> <span>Please Select VesselName</span></br>"
        }
        //grid validation
        //for (let item of this.DynamicTerminalMaster) {
        //    if (item.TerminalID == 0) {
        //        validation += "Please Select Terminal</br>";
        //    }

        //}
        if (validation != "") {

            Swal.fire(validation)
            return false;
        }


        //myselect use
        this.Voyageform.value.VesselID = $('#ddlVessel').val();
        this.Voyageform.value.PortID = $('#ddlPort').val();
        //this.Voyageform.value.TerminalID = $('#ddlTerminal').val();


        var ItemsPr = [];
        for (let item of this.DynamicTerminalMaster) {

            var intTID = 0;

            ItemsPr.push('Insert:' + intTID, item.TerminalID, item.RotationNo, item.TerminalName);


        };
        this.Voyageform.value.Itemsv1 = ItemsPr.toString();
        console.log('terminal', ItemsPr.toString());
        var ItemsPr1 = [];

        for (let item of this.DynamicVoyageNoteMaster) {


            var intNID = 0;
            if (item.Notes != "") {
                if (typeof item.NID == "undefined")
                    intNID = 0;
                else
                    intNID = item.NID;

                ItemsPr1.push('Insert:' + intNID, item.NotesType, item.Notes);
            }
        };
        this.Voyageform.value.Itemsv2 = ItemsPr1.toString();
        this.service.getsaveVoyageform(this.Voyageform.value).subscribe(Data => {
            this.Voyageform.value.ID = Data[0].ID;
            Swal.fire(Data[0].AlertMessage)
        },

            (error: HttpErrorResponse) => {
                Swal.fire(error.message)
            });
    }

}



