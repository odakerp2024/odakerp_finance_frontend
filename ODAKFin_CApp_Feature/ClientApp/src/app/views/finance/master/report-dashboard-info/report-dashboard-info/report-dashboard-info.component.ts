import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicRepDashGrid } from 'src/app/model/financeModule/FNRepDash';
import { reportdashboardService } from 'src/app/services/financeModule/reportdashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-dashboard-info',
  templateUrl: './report-dashboard-info.component.html',
  styleUrls: ['./report-dashboard-info.component.css']
})
export class ReportDashboardInfoComponent implements OnInit {

  title = 'Reports and Dashboard Configuration';
Typevalues: TypeVal[] = [
    { value: '1', viewValue: 'REPORTS' },
    { value: '2', viewValue: 'DASHBOARDS' },
];
Activevalues: Status[] = [
    { value: '1', viewValue: 'YES' },
    { value: '2', viewValue: 'NO' },
];

  ReportForm: FormGroup;
  
  constructor(private router: Router, private titleService: Title, private route: ActivatedRoute, private fb: FormBuilder,private RS: reportdashboardService) { }

  CreatedOn: string = '';
CreatedBy: string = '';
ModifiedOn: string = '';
ModifiedBy: string = '';
myControl = new FormControl('');
DynamicReport: Array<DynamicRepDashGrid> = [];
val: any = {};
NID = null;
HDArrayIndex = '';
UpdateID = 0;
EdiNID = 0;
chkindex = "0";
RepID = 1;
LinkBtn: boolean[] = [];
NoLinkBtn: boolean[] = [];
RepMainID = 0;
RepTypeID = 0;
RepTypeIDv = 0;
ValidID = 0;
edID = 0;
ItemsDr = [];

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    
    $('.my-select').select2();
    $(document).on('select2:open', (e) => {
    const selecNID = e.target.id

    $(".select2-search__field[aria-controls='select2-" + selecNID + "-results']").each(function (
        key,
        value,
    ) {
        value.focus();
    })
  });
  $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
    $(this).closest(".select2-container").siblings('select:enabled').select2('open');
  });

  this.route.params.subscribe(param => {
    this.RepMainID = param['ID'];
    this.RepTypeID = param['TypeID'];
  });

  this.createForm();
  
  this.BindExistingRouteGrid(this.RepMainID, this.RepTypeID);

  }

  createForm() {
    this.ReportForm = this.fb.group({
        NID: 0,
        TypeID: 0,
        Name: '',
        Description: '',
        ActiveID: 0,
    });
}

checkbutton(index, NID) {

  this.EdiNID = NID;
  this.chkindex = index;
}

OnClickBack() {
  this.router.navigate(['/views/finance/master/report-dashboard-view/report-dashboard-view/', { TypeID: this.RepTypeID }]);
}

OnClickAdd() {
  //alert($('#ddlAction').val());
  var validation = "";

  if ($('#txtName').val() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Name</span></br>"
  }
  if ($('#txtDesign').val() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Design</span></br>"
  }

  if ($('#txtCode').val() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Code</span></br>"
  }
  if ($('#txtDes').val() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Description</span></br>"
  }


  var ddlActive = $('#ddlAction').val();
  if (ddlActive == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Active</span></br>"
  }

  if (validation != "") {
      this.edID = 1;
      this.UpdateID = 0;
      Swal.fire(validation);
      return false;
  }
  this.UpdateID = 1;
  this.edID = 0;

  var NIDValue;

  const mySentence = $('#txtName').val().toString();
  const words = mySentence.split(" ");

  for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  var name = words.join(" ");

  NIDValue = (this.NID == null) ? 0 : this.NID;
  this.val = {
      NID: NIDValue,

      Name: name,
      Design: $("#txtDesign").val(),
      Description: $("#txtDes").val(),
      ActiveID: $("#ddlAction").val(),
      Code: $("#txtCode").val(),

      Active: $("#ddlAction option:selected").text(),

  };

  if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
      this.DynamicReport[this.HDArrayIndex] = this.val;
  } else {
      this.DynamicReport.push(this.val);
  }

  $("#txtName").val("").trigger("change");
  $("#txtCode").val("").trigger("change");
  $("#txtDesign").val("").trigger("change");
  $("#txtDes").val("").trigger("change");
  $('#ddlAction').val(0).trigger("change");

  //this.LinkBtn[i] = false;
  //this.NoLinkBtn = true;
  this.NID = 0;
  this.HDArrayIndex = '';
  this.ValidID = 1;

}

EditReport() {
 
  var checked = $("#datatable input[type=radio]:checked").length;
  if (this.DynamicReport.length != 0) {
      if (checked == 0) {
          Swal.fire("Please Select Any one");
      }
      else {

          //this.UpdateID = 1;
          var NIDV = 0;
          NIDV = this.EdiNID;
        
          this.DynamicReport[this.chkindex].NID = NIDV;
          this.HDArrayIndex = this.chkindex;
          this.NID = this.DynamicReport[this.chkindex].NID;
          this.EdiNID = this.DynamicReport[this.chkindex].NID;


          $("#txtName").val(this.DynamicReport[this.chkindex].Name);
          $("#txtCode").val(this.DynamicReport[this.chkindex].Code);
          $("#txtDesign").val(this.DynamicReport[this.chkindex].Design);
          $("#txtDes").val(this.DynamicReport[this.chkindex].Description);
          $("#ddlAction").select2().val(this.DynamicReport[this.chkindex].ActiveID).trigger("change");
      }
  }
  else {
      Swal.fire("No Records Found");
  }
}

DeleteReport(chkind) {
  chkind = this.chkindex;
  var checked = $("#datatable input[type=radio]:checked").length;
  if (this.DynamicReport.length != 0) {
      if (checked == 0) {
          Swal.fire("Please Select Any one");
      }
      else {

          if (this.ValidID == 1) {
              Swal.fire({
                  title: 'Records Entered will not be Saved, Are you sure want to Delete ?',
                  showDenyButton: true,
                  confirmButtonText: 'YES',
                  cancelButtonText: 'NO',
                  allowOutsideClick: false,
              }).then((result) => {
                  if (result.isConfirmed) {
                      this.ReportForm.value.NID = this.EdiNID;
                      this.ReportForm.value.PageName = "RepDashboard";

                      if (this.ReportForm.value.NID != "") {
                          this.RS.getRepDashMappingDelete(this.ReportForm.value).subscribe(Data => {
                              Swal.fire("Deleted Successfully");

                              $("#txtName").val("").trigger("change");
                              $("#txtDesign").val("").trigger("change");
                              $("#txtDes").val("").trigger("change");
                              $('#ddlAction').val(0).trigger("change");
                              this.BindExistingRouteGrid(this.RepMainID, this.RepTypeID);
                          },
                              (error: HttpErrorResponse) => {
                                  Swal.fire(error.message)
                              });
                      }
                      else {
                          this.DynamicReport.splice(chkind, 1);
                      }
                      document.querySelectorAll('.checkbox').forEach(_radio => {
                          (<HTMLInputElement>_radio).checked = false;
                      });
                  } else {

                  }
              });
          }
          Swal.fire({
              title: 'Are you sure want to Delete ?',
              showDenyButton: true,
              confirmButtonText: 'YES',
              cancelButtonText: 'NO',
              allowOutsideClick: false,
          }).then((result) => {
              if (result.isConfirmed) {
                  this.ReportForm.value.NID = this.EdiNID;
                  this.ReportForm.value.PageName = "RepDashboard";

                  if (this.ReportForm.value.NID != "") {
                      this.RS.getRepDashMappingDelete(this.ReportForm.value).subscribe(Data => {
                          Swal.fire("Deleted Successfully");

                          $("#txtName").val("").trigger("change");
                          $("#txtDesign").val("").trigger("change");
                          $("#txtDes").val("").trigger("change");
                          $('#ddlAction').val(0).trigger("change");
                          this.BindExistingRouteGrid(this.RepMainID, this.RepTypeID);
                      },
                          (error: HttpErrorResponse) => {
                              Swal.fire(error.message)
                          });
                  }
                  else {
                      this.DynamicReport.splice(chkind, 1);
                  }
                  document.querySelectorAll('.checkbox').forEach(_radio => {
                      (<HTMLInputElement>_radio).checked = false;
                  });
              } else {

              }
          });

      }
  }
  else {
      Swal.fire("No Records Found");
  }
}

BindExistingRouteGrid(RepMID,RepTypeIDv) {


  this.ReportForm.value.RepMainID = RepMID;
  this.ReportForm.value.TypeID = RepTypeIDv;

  this.RS.getRepDashMappingEditByID(this.ReportForm.value).subscribe(data1 => {
      this.DynamicReport.length = 0;
      if (data1.length > 0) {

          for (let item of data1) {
              
              this.DynamicReport.push({

                  'NID': item.NID,
                  'Name': item.Name,
                  'Design': item.Design,
                  'Description': item.Description,
                  'Itemsv1': '',
                  'PageName': '',
                  'TypeID': item.TypeID,
                  'Type': item.Type,                        
                  'ActiveID': item.ActiveID,
                  'Active': item.Active,
                  'RepMainID': item.RepMainID,
                  'Code': item.Code,
              });
          }
      }
      else {

      }

  });


}

Onsubmit() {

  var validation = "";

  if (this.DynamicReport.length == 0)
      validation += "<span style='color:red;'>*</span> <span>Please Fill Doc Details</span></br>"

  if (validation != "") {
      Swal.fire(validation);
      return false;
  }

  if (this.UpdateID == 0) {
      this.OnClickAdd();
  }
 
  if (this.edID == 0) {
      
      var ItemsDr = [];
      for (let item of this.DynamicReport) {
          var intNID = 0;

          if (item.Name != "") {
              if (typeof item.NID == "undefined")
                  intNID = 0;
              else
                  intNID = item.NID;

              ItemsDr.push('Insert:' + intNID, item.Name, item.Design,item.ActiveID, item.Active, item.Code, 'Description:' + item.Description);
          }

      };
      this.ReportForm.value.Itemsv1 = ItemsDr.toString();


      this.ReportForm.value.UserID = localStorage.getItem("UserID");
      this.ReportForm.value.SeqNo = 0;
      this.ReportForm.value.PageName = "RepDashboard";
      this.ReportForm.value.RepMainID = this.RepMainID;
      this.ReportForm.value.TypeID = this.RepTypeID;
      this.RS.SaveRepDashMapping(this.ReportForm.value).subscribe(Data => {



          $("#txtName").val("").trigger("change");
          $("#txtCode").val("").trigger("change");
          $("#txtDesign").val("").trigger("change");
          $("#txtDes").val("").trigger("change");
          $('#ddlAction').val(0).trigger("change");
          Swal.fire("Record Saved SuccessFully");
          //this.BindExistingRouteGrid(this.RepID);
          this.ValidID = 0;
          this.UpdateID = 0;
          this.edID = 0;
      },

          (error: HttpErrorResponse) => {
              Swal.fire(error.message)
          });
  }
}


}

interface Status {
  value: string;
  viewValue: string;
}
interface TypeVal {
  value: string;
  viewValue: string;
}
