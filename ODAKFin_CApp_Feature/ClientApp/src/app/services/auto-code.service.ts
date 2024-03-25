import { rejects } from 'assert';
import { resolve } from 'dns';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { Globals } from '../globals';
import { DataService } from './data.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AutoCodeService {

  constructor(
    private globals: Globals,
    private dataService: DataService,
    private datePipe: DatePipe,
  ) { }


  numberRange(data, Name) {
    var secA = '';
    var secB = '';
    var secC = '';
    var secD = '';

    if (data.SectionA.length > 0) {
      const [Running] = data.SectionA.split(' ');
      secA = this.rangeCalculation(Running, data.SectionA, data.NextNumber, Name);
      if (data.SectionB.length > 0) {
        const [Running1] = data.SectionB.split(' ');
        secB = this.rangeCalculation(Running1, data.SectionB, data.NextNumber, Name);
        if (data.SectionC.length > 0) {
          const [Running2] = data.SectionC.split(' ');
          secC = this.rangeCalculation(Running2, data.SectionC, data.NextNumber, Name);
          if (data.SectionD.length > 0) {
            const [Running3] = data.SectionD.split(' ');
            secD = this.rangeCalculation(Running3, data.SectionD, data.NextNumber, Name);
          }
        }
      }
    }
    return `${data.Prefix}${secA}${secB}${secC}${secD}`;
  }

  rangeCalculation(ObjectName, sectionName, NextNumber, Name) {
    if (ObjectName == "Running") {
      return Number(NextNumber) + 1;
    }
    else if (ObjectName == "Division") {
      const matches = sectionName.split("(");
      const chaLength = matches[1].split(' ');
      return Name.slice(0, chaLength[0]);
    }
    else if (ObjectName == "Office") {
      const matches = sectionName.split("(");
      const chaLength = matches[1].split(' ');
      return Name.slice(0, chaLength[0]);
    }
  }

  // New Auto code generation
  NumberRange(data, SectionA, SectionB, SectionC, SectionD) {
    
    var secA = '';
    var secB = '';
    var secC = '';
    var secD = '';

    if (data.SectionA.length > 0) {
      const [Running] = data.SectionA.split(' ');
      secA = this.RangeCalculation(Running, data.SectionA, data.NextNumber, SectionA);
      if (data.SectionB.length > 0) {
        const [Running1] = data.SectionB.split(' ');
        secB = this.RangeCalculation(Running1, data.SectionB, data.NextNumber, SectionB);
        if (data.SectionC.length > 0) {
          const [Running2] = data.SectionC.split(' ');
          secC = this.RangeCalculation(Running2, data.SectionC, data.NextNumber, SectionC);
          if (data.SectionD.length > 0) {
            const [Running3] = data.SectionD.split(' ');
            secD = this.RangeCalculation(Running3, data.SectionD, data.NextNumber, SectionD);
          }
        }
      }
    }
    return `${data.Prefix}${secA}${secB}${secC}${secD}`;
  }

  RangeCalculation(ObjectName, sectionName, NextNumber, SectionValue) {
    if (ObjectName == "Running") {
      return Number(NextNumber) + 1;
    }
    else {
      const matches = sectionName.split("(");
      const chaLength = matches[1].split(' ');
      return SectionValue.slice(0, chaLength[0]);
    }
  }

  // common auto code generation and update in Number range

  checkAutoSectionItem(sectionInfo: any, runningNumber: any, Code: string, division, office, officeList, divisionList) {
    // return new Promise(() => {})
    var sectionA = '';
    var sectionB = '';
    var sectionC = '';
    var sectionD = '';
    var officeInfo: any = {};
    var divisionInfo: any = {};

    if (division && office) {
      officeInfo = officeList.find(x => x.ID == office);
      divisionInfo = divisionList.find(x => x.ID == division);
    }

    for (var i = 0; i < sectionInfo.length; i++) {
      var condition = i == 0 ? sectionInfo[i].sectionA : i == 1 ? sectionInfo[i].sectionB : i == 2 ? sectionInfo[i].sectionC : i == 3 ? sectionInfo[i].sectionD : sectionInfo[i].sectionD;
      switch (condition) {
        case 'Office Code (3 Chars)': i == 0 ? sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 1 ? sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 2 ? sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 3 ? sectionD = officeInfo.OfficeName : ''; break;
        case 'Running Number (3 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (4 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (5 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (6 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Running Number (7 Chars)': i == 0 ? sectionA = runningNumber : i == 1 ? sectionB = runningNumber : i == 2 ? sectionC = runningNumber : i == 3 ? sectionD = runningNumber : ''; break;
        case 'Office Code (4 Chars)': i == 0 ? sectionA = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 1 ? sectionB = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 2 ? sectionC = officeInfo.OfficeName ? officeInfo.OfficeName : '' : i == 3 ? sectionD = officeInfo.OfficeName : ''; break;
        case 'Division Code (4 Chars)': i == 0 ? sectionA = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 1 ? sectionB = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 2 ? sectionC = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 3 ? sectionD = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : ''; break;
        case 'Division Code (3 Chars)': i == 0 ? sectionA = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 1 ? sectionB = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 2 ? sectionC = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : i == 3 ? sectionD = divisionInfo.DivisionName ? divisionInfo.DivisionName : '' : ''; break;
        case 'FY (4 Char e.g. 2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (5 Char e.g. 22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (6 Char e.g. FY2023)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'FY (7 Char e.g. FY22-23)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        case 'POFD Port Code (3 Char)': i == 0 ? sectionA = '' : i == 1 ? sectionB = '' : i == 2 ? sectionC = '' : i == 3 ? sectionD = '' : ''; break;
        default: break;
      }
    }
    return { sectionA: sectionA, sectionB: sectionB, sectionC: sectionC, sectionD: sectionD };
  }


  getNumberRange() {
    return new Promise((resolve, rejects) => {
      let service = `${this.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`;
      this.dataService.post(service, { Id: 0, ObjectId: 0 }).subscribe((result: any) => {
        if (result.message = "Success") {
          if (result.data.Table.length > 0) {
            for (let data of result.data.Table) {
              data.EffectiveDate = this.datePipe.transform(data.EffectiveDate, 'YYYY-MM-dd');
            }
            resolve(result.data.Table)
          }
        }
      }, error => {
        console.error(error);
        rejects()
      });
    })
  }


  updateAutoGenerated(Info) {
    return new Promise((resolve, rejects) => {
      if (Info.length > 0) {
        Info[0].NextNumber = Info[0].NextNumber + 1;
        let service = `${this.globals.APIURL}/COAType/UpdateAutoGenerateCOdeNextNumber`;
        this.dataService.post(service, { NumberRangeObject: { Table: [{ Id: Info[0].Id, NextNumber: Info[0].NextNumber }] } })
        .subscribe((result: any) => {
          resolve('Success')
        }, error => {
          rejects('error')
          console.error(error);
        });
      }
    })
  }

  async autoCodeGeneration(event: any, Info, officeList, divisionList , division?, office?,) {
    return new Promise((resolve, rejects) => {
      if (Info.length > 0) {
        let sectionOrderInfo = this.checkAutoSectionItem([{ sectionA: Info[0].SectionA }, { sectionB: Info[0].SectionB }, { sectionC: Info[0].SectionC }, { sectionD: Info[0].SectionD }],
          Info[0].NextNumber, event, division, office, officeList, divisionList);
          const code = this.NumberRange(Info[0], sectionOrderInfo.sectionA, sectionOrderInfo.sectionB, sectionOrderInfo.sectionC, sectionOrderInfo.sectionD);
          resolve(code);
      }
    })
  }
  

}
