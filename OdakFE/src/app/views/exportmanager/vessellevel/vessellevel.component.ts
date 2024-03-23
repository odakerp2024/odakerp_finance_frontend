import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VesselTaskMaster } from '../../../model/vesseltask';
import { EncrDecrServiceService } from '../../../services/encr-decr-service.service';
import { VesseltaskService } from '../../../services/vesseltask.service';
import { PaginationService } from '../../../pagination.service';
import { ActivatedRoute, Router } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-vessellevel',
  templateUrl: './vessellevel.component.html',
  styleUrls: ['./vessellevel.component.css']
})
export class VessellevelComponent implements OnInit {

    searchForm: FormGroup;
    VesselID = 0;
    VoyageID = 0;
    vessellevel: VesselTaskMaster[];
    pager: any = {};
    pagedItems: any[];
    private allItems: any[];
    constructor(private fb: FormBuilder, private ES: EncrDecrServiceService, public ps: PaginationService, private vsl: VesseltaskService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        $('.my-select').select2();
        
        this.createForm();
        this.refreshDepList();
    }

    refreshDepList() {
        this.vsl.getVesselTasklistBind(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }
    createForm() {
        this.searchForm = this.fb.group({

            ID: 0,            

        });
    }
    setPage(page: number) {
        this.pager = this.ps.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }


    onclickvesselpage(VesselID, VoyageID) {
        this.VesselID = VesselID;
        this.VoyageID = VoyageID;
        var values = "VesselID: " + VesselID + "&VoyageID:" + VoyageID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        this.router.navigate(['/views/exportmanager/vessellevel/vsloadlist/vsloadlist/'], { queryParams: { encrypted } });
    }

    btntabclick(tab) {

        var values = "VesselID: " + this.VesselID + "&VoyageID:" + this.VoyageID;
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
        if (tab == 1)
            this.router.navigate(['/views/exportmanager/vessellevel/vsloadlist/vsloadlist/'], { queryParams: { encrypted } });
        else if (tab == 2) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsprealert/vsprealert/'], { queryParams: { encrypted } });
        }
        else if (tab == 3) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsloadcnfrm/vsloadcnfrm/'], { queryParams: { encrypted } });
        }
        else if (tab == 4) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsonboard/vsonboard/'], { queryParams: { encrypted } });
        }
        else if (tab == 5) {
            this.router.navigate(['/views/exportmanager/vessellevel/vstdr/vstdr/'], { queryParams: { encrypted } });
        }
        else if (tab == 6) {
            this.router.navigate(['/views/exportmanager/vessellevel/vsexphandling/vsexphandling/'], { queryParams: { encrypted } });
        }
    }


}
interface Status {
    value: string;
    viewValue: string;
}