import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Status, StatusView } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  templateFilter: FormGroup;
  statusvalues: Status[] = new StatusView().statusvalues;
  templateList: any = [];
  pager: any = {};
  pagedItems: any[];// paged items
  templateCategoryList: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private globals: Globals,
    private dataService: DataService,
    public ps: PaginationService,
    private CommonService: CommonService
  ) { }

  checkAddPermission() {
    this.getPermissionListForCreate(573, 'add');
  }

  checkUpdatePermission(id) {
    debugger
    this.getPermissionListForCreate(573, 'edit', id);
  }	


  getPermissionListForCreate(value, route, id: Number = 0) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2 && route != 'edit') {
            this.router.navigate(['views/template-info/template-info-view']);
          } else if (data[0].Create_Opt == 2 && route == 'edit') {
            this.router.navigate(['views/template-info/template-info-view', { id: id, isUpdate: true }]);
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }


  ngOnInit(): void {
    this.getTemplateCategory();
    this.createTemplate();
    this.getTemplateList();
  }

  createTemplate() {
    this.templateFilter = this.fb.group({
      Id: [0],
      TemplateNo: [''],
      TemplateName: [''],
      CategoryId: [''],
      Active: [1]
    })
  }

  getTemplateList() {
    var service = `${this.globals.APIURL}/Template/GetTemplatesList`;
    this.dataService.post(service, this.templateFilter.value).subscribe((result: any) => {
      this.templateList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.templateList = result.data.Table;
        this.setPage(1);
      }
    }, error => {
      console.error(error);
    });
  }

  setPage(page: number) {
    if(this.templateList.length){
      if (page < 1 || page > this.pager.totalPages) {
        return;
    }

   // get pager object from service
    this.pager = this.ps.getPager(this.templateList.length, page);
   // get current page of items
    this.pagedItems = this.templateList.slice(this.pager.startIndex, this.pager.endIndex + 1); 
    } else {
    this.pagedItems = []; 
    }
  }

  getTemplateCategory() {
    var service = `${this.globals.APIURL}/Template/GETTemplateCategoryType`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.templateCategoryList = [];
      if (result.data.Table.length > 0) {
        this.templateCategoryList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

  templateInfoRoute() {
    // this.router.navigate(['views/template-info/template-info-view']);
  }

  editTemplate(id: number) {
    this.router.navigate(['views/template-info/template-info-view', { id: id, isUpdate: true }]);
  }

}
