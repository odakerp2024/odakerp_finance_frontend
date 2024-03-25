import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { MyUsers, CommonValues, MyDivision } from '../../../../../model/Admin';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../../services/admin.service';
import { User } from 'oidc-client';
import { PaginationService } from 'src/app/pagination.service';
import { EncrDecrServiceService } from 'src/app/services/encr-decr-service.service';
import { Title } from '@angular/platform-browser';
declare let $: any;


@Component({
  selector: 'app-userprofileview',
  templateUrl: './userprofileview.component.html',
  styleUrls: ['./userprofileview.component.css']
})
export class UserprofileviewComponent implements OnInit {
    title = 'User Details';

    constructor(private router: Router, private route: ActivatedRoute, private service: AdminService, private fb: FormBuilder, private titleService: Title, public ps: PaginationService, private ES: EncrDecrServiceService) { }
    private allItems: any[];
    // pager object
    pager: any = {};
    pagedItems: any[];
    DepartmentList: any = [];
    dataSource: AdminService[];
    searchForm: FormGroup;

    ngOnInit()
    {
        this.titleService.setTitle(this.title);

        this.createForm();
        this.PageLoadingUserList();
    }

    PageLoadingUserList() {

        this.service.getUserList(this.searchForm.value).subscribe(data => {
            this.allItems = data;
            this.setPage(1);
        });
    }

    createForm() {
        this.searchForm = this.fb.group({
            ID: 0,
            UserName: '',
            City: '',
            Division: '',
            Department: '',
            Designation: '',
            Status: 0
        });
    }
    setPage(page: number) {
        //if (page < 1 || page > this.pager.totalPages) {
        //    return;
        //}
        // get pager object from service
        this.pager = this.ps.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onSubmit() {
        this.PageLoadingUserList();
    }

    clearSearch() {
        
        this.createForm();
        this.PageLoadingUserList();

    }

    OnClickEdit(IDv) {

        var values = "ID: " + IDv + ", Name: 'muthuuu'";
        var encrypted = this.ES.set(localStorage.getItem("EncKey"), values);
      
        this.router.navigate(['/views/administration/userconfig/userprofile/userprofile'], { queryParams: { encrypted } });
    }
}
