import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicRepDashGrid } from 'src/app/model/financeModule/FNRepDash';
import { reportdashboardService } from 'src/app/services/financeModule/reportdashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-dashboard-view',
  templateUrl: './report-dashboard-view.component.html',
  styleUrls: ['./report-dashboard-view.component.css']
})
export class ReportDashboardViewComponent implements OnInit {

  Typevalues: TypeVal[] = [
    { value: '1', viewValue: 'REPORTS' },
    { value: '2', viewValue: 'DASHBOARDS' },
];
Activevalues: Status[] = [
    { value: '1', viewValue: 'YES' },
    { value: '2', viewValue: 'NO' },
];

ReportForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute,private fb: FormBuilder,private RS: reportdashboardService) { }

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
RepTypeID = 0;

  ngOnInit(): void {
    $('.my-select').select2();
  
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
    this.RepTypeID = param['TypeID'];
  });

    this.createForm();

    if(this.RepTypeID == 1){
      $('#ddlTypeID').val(1);
    }

    $('#ddlTypeID').on('select2:select', (e, args) => {

      if ($('#ddlTypeID').val() == 1) {
          this.OnchangeReports($('#ddlTypeID').val());
      }
      else {
          $('#ddlTypeID').val() == 2;
          var TypeIDv = $('#ddlTypeID').val();
          this.router.navigate(['/views/finance/master/report-dashboard-info/report-dashboard-info', { ID: 0, TypeID: TypeIDv}]);
      }
 });

  }

  createForm() {
    this.ReportForm = this.fb.group({
        NID: 0,
        TypeID: 0,
        Name: '',
        Description: '',
        ActiveID: 0
    });
}

checkbutton(index,NID) {
   
  this.EdiNID = NID;
  this.chkindex = index;
}

OnchangeReports(idv) {
  this.ReportForm.value.TypeID = idv;
  this.RS.getRepDashboardEditByID(this.ReportForm.value).subscribe(data1 => {
    this.DynamicReport.length = 0;
    if (data1.length > 0) {

        for (let item of data1) {
           
            $('#ddlTypeID').select2().val(data1[0].TypeID).trigger("change");;
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

OnClickAdd() {
  var validation = "";
  
  if ($('#txtName').val() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Name</span></br>"
  }
  if ($('#txtDes').val() == "") {
      validation += "<span style='color:red;'>*</span> <span>Please Enter Description</span></br>"
  }


  var ddlActive = $('#ddlAction').val();
  if (ddlActive == 0) {
      validation += "<span style='color:red;'>*</span> <span>Please Select Active</span></br>"
  }

  if (validation != "") {
      Swal.fire(validation);
      return false;
  }

  const mySentence = $('#txtName').val().toString();
  const words = mySentence.split(" ");

  for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  var name = words.join(" ");

  this.UpdateID = 0;

  var NIDValue;

  NIDValue = (this.NID == null) ? 0 : this.NID;
  this.val = {
      NID: NIDValue,
     
      Name: name,
      Description: $("#txtDes").val(),
      ActiveID: $("#ddlAction").val(),
      
      Active: $("#ddlAction option:selected").text(),
      
  };
 
  if (this.HDArrayIndex != null && this.HDArrayIndex.length != 0) {
      this.DynamicReport[this.HDArrayIndex] = this.val;
  } else {
      this.DynamicReport.push(this.val);
  }

  $("#txtName").val("").trigger("change");
  $("#txtDes").val("").trigger("change");
  $('#ddlAction').val(0).trigger("change");
 
 
  this.NID = 0;
  this.HDArrayIndex = '';

}

EditReport() {
  var checked = $("#datatable input[type=radio]:checked").length;
  if (this.DynamicReport.length != 0) {
      if (checked == 0) {
          Swal.fire("Please Select Any one");
      }
      else {
         
          this.UpdateID = 1;
          var NIDV = 0;
          NIDV = this.EdiNID;
         
          this.DynamicReport[this.chkindex].NID = NIDV;
          this.HDArrayIndex = this.chkindex;
          this.NID = this.DynamicReport[this.chkindex].NID;
          this.EdiNID = this.DynamicReport[this.chkindex].NID;


          $("#txtName").val(this.DynamicReport[this.chkindex].Name);
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
                      this.RS.getRepDashDelete(this.ReportForm.value).subscribe(Data => {
                          Swal.fire("Deleted Successfully");

                          $("#txtName").val("").trigger("change");
                          $("#txtDes").val("").trigger("change");
                          $('#ddlAction').val(0).trigger("change");
                          this.OnchangeReports($('#ddlTypeID').val());
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

OnClickEdit(IDv, TypeIDv) {
 
  var values = "ID: " + IDv + "&TypeID:" + TypeIDv;
  this.router.navigate(['/views/finance/master/report-dashboard-info/report-dashboard-info/', { ID: IDv, TypeID: TypeIDv}]);

}

Onsubmit() {

  var validation = "";
 
  if (this.DynamicReport.length == 0){
    validation += "<span style='color:red;'>*</span> <span>Please Fill Doc Details</span></br>"
  }
      

  if (validation != "") {
      Swal.fire(validation);
      return false;
  }

  if (this.UpdateID == 1) {
      this.OnClickAdd();
  }

  var ItemsDr = [];
  for (let item of this.DynamicReport) {
      var intNID = 0;

      if (item.Name != "") {
          if (typeof item.NID == "undefined")
              intNID = 0;
          else
              intNID = item.NID;

          ItemsDr.push('Insert:' + intNID, item.Name, item.ActiveID, item.Active, 'Description:' + item.Description);
          //var itemArray = ['Insert:' + intNID, item.Name, item.ActiveID, item.Active, 'Description:' + item.Description];
      }

  };
  this.ReportForm.value.Itemsv1 = ItemsDr.toString();
  console.log(ItemsDr.toString());

  this.ReportForm.value.UserID = localStorage.getItem("UserID");
  this.ReportForm.value.SeqNo = 0;
  this.ReportForm.value.PageName = "RepDashboard";
  this.ReportForm.value.TypeID = $('#ddlTypeID').val();
  this.RS.SaveRepDashboard(this.ReportForm.value).subscribe(Data => {
      $("#txtName").val("").trigger("change");
      $("#txtDes").val("").trigger("change");
      $('#ddlAction').val(0).trigger("change");
      Swal.fire("Record Saved SuccessFully");

  },
      (error: HttpErrorResponse) => {
          Swal.fire(error.message)
      });

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
