import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DivisionInfoComponent } from './division-info.component';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Globals } from 'src/app/globals';

describe('DivisionInfoComponent', () => {
  let component: DivisionInfoComponent;
  let fixture: ComponentFixture<DivisionInfoComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let router: Router;
  let datePipe: DatePipe;
  let globals: Globals;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  //to check division name
  it('should contain the text "Division"', () => {
    const h4Element = fixture.nativeElement.querySelector('h4');
    expect(h4Element.textContent.trim()).toBe('Division');
  });

  //editbutton

  it('should show the button when isUpdate is true', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  // it('should call onEditClick method on button click', () => {
  //   spyOn(component, 'onEditClick');
  //   const button = fixture.nativeElement.querySelector('button');
  //   button.click();
  //   expect(component.onEditClick).toHaveBeenCalled();
  // });

 //edit
  it('should enable division form and set isUpdateEnable to true on button click', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.divisionForm.enable).toHaveBeenCalled();
    expect(component.isUpdateEnable).toBe(true);
  });

//reply
  it('should call divisionListRoute method on button click', () => {
    spyOn(component, 'divisionListRoute');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.divisionListRoute).toHaveBeenCalled();
  });

  //schedule
  //modifiedOn
  it('should display ModifiedOn and ModifiedBy', () => {
    const testModifiedOn = '2024-04-08';
    const testModifiedBy = 'John Doe';
    component.ModifiedOn = testModifiedOn;
    component.ModifiedBy = testModifiedBy;
    fixture.detectChanges();

    const spanElements = fixture.nativeElement.querySelectorAll('span');
    expect(spanElements.length).toBe(2);

    const modifiedOnText = spanElements[0].textContent.trim();
    const modifiedByText = spanElements[1].textContent.trim();

    expect(modifiedOnText).toBe(`ModifiedOn: ${testModifiedOn}`);
    expect(modifiedByText).toBe(`Modified By: ${testModifiedBy}`);
  });

  it('should display CreatedOn and CreatedBy', () => {
    const testCreatedOn = '2024-04-08';
    const testCreatedBy = 'Jane Doe';
    component.CreatedOn = testCreatedOn;
    component.CreatedBy = testCreatedBy;
    fixture.detectChanges();

    const spanElements = fixture.nativeElement.querySelectorAll('span');
    expect(spanElements.length).toBe(2);

    const createdOnText = spanElements[0].textContent.trim();
    const createdByText = spanElements[1].textContent.trim();

    expect(createdOnText).toBe(`CreatedOn: ${testCreatedOn}`);
    expect(createdByText).toBe(`Created By: ${testCreatedBy}`);
  });


  it('should display Division Name with correct title and content', () => {
    const labelElement: HTMLElement = fixture.nativeElement.querySelector('.header-text-label');
    expect(labelElement).toBeTruthy();
    
    const expectedTitle = 'Test Division';
    const expectedContent = 'TEST DIVISION';
    
    expect(labelElement.getAttribute('title')).toBe(expectedTitle);
    expect(labelElement.textContent.trim()).toBe(`Division Name : ${expectedContent}`);
  });

  //short name
  it('should call autoCodeGeneration method on input change', () => {
    spyOn(component, 'autoCodeGeneration');
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'Test';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.autoCodeGeneration).toHaveBeenCalled();
  });


//update
it('should have the button displayed when isUpdate is true', () => {
  const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
  expect(buttonElement).toBeTruthy();
});

it('should have the button disabled when isUpdateEnable is false', () => {
  component.isUpdateEnable = false;
  fixture.detectChanges();
  const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
  expect(buttonElement.disabled).toBe(true);
});

it('should call saveDivision method when button is clicked', () => {
  spyOn(component, 'saveDivision');
  const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
  buttonElement.click();
  expect(component.saveDivision).toHaveBeenCalled();
});

it('should have correct routerLink', () => {
  const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
  expect(buttonElement.getAttribute('routerLink')).toBe('/views/finance/financemaster');
});

it('should create divisionForm with expected initial values', () => {
  component.cerateDivisionForm();

  const expectedFormValues = {
    Id: 0,
    OrgId: 1,
    DivisionCode: '',
    DividionName: '',
    ShortName: '',
    Application: '',
    Active: '',
    createdDate: jasmine.any(Date),
    ModifiedDate: jasmine.any(Date),
    CreatedBy: 1, // Mocking UserID as 1
    Updatedby: 1 // Mocking UserID as 1
  };

  expect(component.divisionForm).toBeDefined();
  expect(component.divisionForm.value).toEqual(expectedFormValues);
});


//divisionlistroute
it('should navigate to division-view route', () => {
  const navigateSpy = spyOn(router, 'navigate');
  component.divisionListRoute();
  expect(navigateSpy).toHaveBeenCalledWith(['views/division/division-view']);
});

it('should call customPayload with correct argument and divisionCreateAPI', () => {
  // Mock customPayload method
  spyOn(component, 'customPayload');

  // Mock divisionCreateAPI method
  spyOn(component, 'divisionCreateAPI');

  // Call emailUpdate method with a mock argument
  const emailTableData = { /* mock data */ };
  component.emailUpdate(emailTableData);

  // Expect customPayload to have been called with emailTableData
  expect(component.customPayload).toHaveBeenCalledWith(emailTableData);

  // Expect divisionCreateAPI to have been called
  expect(component.divisionCreateAPI).toHaveBeenCalled();
});


//checkBasicDetailsFilled
it('should set isBasicDetailsFilled to false if any basic detail is missing', () => {
  
  component.divisionForm.patchValue({ DivisionCode: '' });

  component.checkBasicDetailsFilled();

  expect(component.isBasicDetailsFilled).toBeFalsy();
});


//checkautosectionitem

it('should set section items correctly based on provided sectionInfo, runningNumber, and divisionCode', () => {
  const sectionInfo = [
    { sectionA: 'Office Code (3 Chars)' },
    { sectionB: 'Running Number (4 Chars)' },
    { sectionC: 'Division Code (3 Chars)' },
    { sectionD: 'FY (4 Char e.g. 2023)' }
  ];
  const runningNumber = '1234';
  const divisionCode = 'DIV';

  const result = component.checkAutoSectionItem(sectionInfo, runningNumber, divisionCode);

  expect(result).toEqual({
    sectionA: '',
    sectionB: runningNumber,
    sectionC: divisionCode,
    sectionD: ''
  });
});


it('should handle default case correctly', () => {
  const sectionInfo = [
    { sectionA: 'Invalid Section' },
    { sectionB: 'Invalid Section' },
    { sectionC: 'Invalid Section' },
    { sectionD: 'Invalid Section' }
  ];
  const runningNumber = '1234';
  const divisionCode = 'DIV';

  const result = component.checkAutoSectionItem(sectionInfo, runningNumber, divisionCode);

  expect(result).toEqual({
    sectionA: '',
    sectionB: '',
    sectionC: '',
    sectionD: ''
  });
});

//checkpermission

//divisionGetById
it('should fetch division by id', fakeAsync(() => {
  const Id = 123;
  const Result = {
    message: 'Success',
    data: {
      Table: [    {
        Id: 1,
        DivisionName: 'Division 1',
      },
      {
        Id: 2,
        DivisionName: 'Division 2', 
      },
    ],
      // Table1: [{ /* table1 data */ }]
    }
  };

  dataService.post.and.returnValue(of(Result));

  // Simulate subscribing to the observable
  component.divisionGetById(Id);
  tick();

  expect(dataService.post).toHaveBeenCalledWith(`${component.globals.APIURL}/Division/GetOrganizationDivisionId`, { Id: Id });
  // Add more expectations based on the behavior inside the subscribe block
}));


//deleteRecord
it('should delete records', () => {
  const Event = [{ ID: 1 }, { ID: 2 }, { ID: 3 }];

  dataService.post.and.returnValue(of({}));

  component.deleteRecord(Event);

  for (const data of Event) {
    expect(dataService.post).toHaveBeenCalledWith(`${component.globals.APIURL}/Division/DivisionEmailDelete`, { Id: data.ID });
  }
});


//getNumberRange
xit('should handle error when API call fails', fakeAsync(() => {
  // Mock DataService post method to return an error observable
  dataService.post.and.returnValue(throwError('API Error'));

  // Call getNumberRange
  component.getNumberRange();
  tick(); // Resolve the observable

  // Expectations
  expect(dataService.post).toHaveBeenCalledWith(`${component.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`, { Id: 0, ObjectId: 0 });
  // Add expectations for error handling as needed
}));

//getNumberRange
it('should update autoGenerateCodeList when API call is successful', fakeAsync(() => {

  const dummyResponse = {
    message: 'Success',
    data: {
      Table: [
        { EffectiveDate: '2023-01-01' },
        { EffectiveDate: '2024-01-01' }
      ]
    }
  };
  spyOn(dataService, 'post').and.returnValue(of(dummyResponse));

  spyOn(datePipe, 'transform').and.callFake((date: any, format: string) => date); // Pass-through transformation

  component.getNumberRange();
  tick(); // Resolve the observable

  // Expectations
  expect(dataService.post).toHaveBeenCalledWith(`${component.globals.APIURL}/COAType/GetNumberRangeCodeGenerator`, { Id: 0, ObjectId: 0 });
  expect(datePipe.transform).toHaveBeenCalledTimes(dummyResponse.data.Table.length); 
  expect(component.autoGenerateCodeList).toEqual(dummyResponse.data.Table); 
}));


//saveDivision
it('should call customPayload and divisionCreateAPI methods', () => {
  // Mock emailData
  const emailData = [
    {
      ID: 1,
      OrgId: 'Category 1',
      Category: 'email',
      EmailId: 'email@example.com',
      StartDate: '2023-12-31',
      EndDate: '2023-01-01',
      
      CreatedBy: 'User1',
      UpdatedBy: 'User2',
      CreatedDate: '2023-01-01',
      ModifiedDate: '2023-02-02'
    },
    {
      ID: 2,
      OrgId: 'Category 2',
      Category: 'email2',
      EmailId: 'email2@example.com',
      StartDate: '2023-2-3',
      EndDate: '2023-07-07',
      
      CreatedBy: 'User1',
      UpdatedBy: 'User2',
      CreatedDate: '2023-04-07',
      ModifiedDate: '2023-08-03'
    }
  ];

  // Spy on customPayload and divisionCreateAPI
  spyOn(component, 'customPayload').and.callThrough();
  spyOn(component, 'divisionCreateAPI').and.callThrough();

  // Call saveDivision
  component.saveDivision();

  // Expectations
  expect(component.customPayload).toHaveBeenCalledWith(emailData);
  expect(component.divisionCreateAPI).toHaveBeenCalled();
});

});
