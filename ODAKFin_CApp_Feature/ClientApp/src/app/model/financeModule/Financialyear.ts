export class FinancialYearList {
    FinancialYearId = 0;
    FinancialYearName = '';
    FromDate = '';
    ToDate = '';
    IsActive = false;
    Status ='';
    CountryID = '';
    CountryCode = '';
    CountryName = '';
     AssessmentYear = '';
}
export class StatusValue {
statusvaluesv: Status[] = [
    { value: true, viewValue: 'ACTIVE' },
    { value: false, viewValue: 'IN-ACTIVE' },
  ];
}

interface Status {
    value: boolean;
    viewValue: string;
  }