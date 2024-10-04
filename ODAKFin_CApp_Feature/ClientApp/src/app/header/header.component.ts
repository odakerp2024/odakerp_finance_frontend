import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/services/masters.service';
import { Login } from '../model/common';
import { map, take, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../services/login.service';
declare let $: any;
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   /* @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();*/
    constructor(private router: Router, private route: ActivatedRoute, private LService: LoginService, private fb: FormBuilder) { }
    FillMainMenuList = [];
    HeaderForm: FormGroup;
    ngOnInit(): void {
        this.createForm();
        //this.BindDynamicMenu();
    }
    createForm() {
        this.HeaderForm = this.fb.group({

          ID:0,

        });
    }
    btntabclick(tab) {
        
        if (tab == 1)
            this.router.navigate(['/views/finance/financemaster',{tabName : 'myWorkspace'}],);
        else if (tab == 2) {
            this.router.navigate(['/views/finance/financemaster',{tabName : 'transactions'}],);
        }
        else if (tab == 3) {
            this.router.navigate(['/views/finance/financemaster',{tabName : 'dashboard'}],);
        }
        else if (tab == 4) {
            this.router.navigate(['/views/finance/financemaster',{tabName : 'reports'}],);
        }
        else if (tab == 5) {
            this.router.navigate(['/views/finance/financemaster',{tabName : 'masters'}],);
        }
        
    }
}
