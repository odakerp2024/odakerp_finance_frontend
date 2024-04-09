import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionComponent } from './division.component';
import { DebugElement } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Globals } from 'src/app/globals';
import { CommonService } from 'src/app/services/common.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
// import { By } from 'protractor';
import { By } from '@angular/platform-browser';

describe('DivisionComponent', () => {
  let component: DivisionComponent;
  let fixture: ComponentFixture<DivisionComponent>;
  let debugElement: DebugElement;
  let formBuilder: FormBuilder;
  let dataService: jasmine.SpyObj<DataService>;
  let globals: Globals;
  let commonService: CommonService;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  //main heading
  it('should render the heading "Division"', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Division');
  });

  it('should have the correct classes applied', () => {
    const compiled = fixture.nativeElement;
    const divElement = compiled.querySelector('.col-md-9');
    const headingElement = compiled.querySelector('h4');

    expect(divElement).toBeTruthy();
    expect(headingElement).toBeTruthy();

    expect(divElement.classList.contains('col-md-9')).toBe(true);
    expect(headingElement.classList.contains('ml-2')).toBe(true);
    expect(headingElement.classList.contains('mt-2')).toBe(true);
  });


//table headers
  it('should display the correct table headers', () => {
    const headerElements = debugElement.nativeElement.querySelectorAll('th');
    const headerTexts = Array.from(headerElements).map((el: HTMLElement) => el.textContent?.trim());
    expect(headerTexts).toEqual(['Division Code', 'Division Name', 'Short Name', 'Active']);
  });

//search button
  it('should call getDivisionList method with "search" argument when button is clicked', () => {
    spyOn(component, 'getDivisionList');
    const button = debugElement.query(By.css('.searchinfo'));
    button.triggerEventHandler('click', null);
    expect(component.getDivisionList).toHaveBeenCalledWith('search');
  });
  

  //clearBtn
  it('should call getDivisionList and divisionForm methods when button is clicked', () => {
    spyOn(component, 'getDivisionList');
    spyOn(component, 'divisionForm');
    const button = debugElement.query(By.css('.clearbtn'));
    button.nativeElement.click();
    expect(component.getDivisionList).toHaveBeenCalled();
    expect(component.divisionForm).toHaveBeenCalled();
  });

  // it('should create a FormGroup with the expected form controls', () => {
  //   // Arrange
  //   const expectedFormGroupValues = {
  //     Id: 0,
  //     DivisionCode: [''],
  //     DivisionName: [''],
  //     Active: ['']
  //   };

  //   // Act
  //   const component = new DivisionComponent(formBuilder); // Replace YourComponent with the actual component name
  //   component.divisionForm();

  //   // Assert
  //   expect(component.divisionFilter).toBeDefined();
  //   expect(component.divisionFilter instanceof FormGroup).toBe(true);

  //   // Check the form controls
  //   expect(component.divisionFilter.get('Id').value).toBe(expectedFormGroupValues.Id);
  //   expect(component.divisionFilter.get('DivisionCode').value).toBe(expectedFormGroupValues.DivisionCode);
  //   expect(component.divisionFilter.get('DivisionName').value).toBe(expectedFormGroupValues.DivisionName);
  //   expect(component.divisionFilter.get('Active').value).toBe(expectedFormGroupValues.Active);
  // });

//edit division method
  it('should call getPermissionListForUpdate with correct arguments', () => {
    // Arrange
    const id = 123; // Example id

    // Spy on the method
    spyOn(component, 'getPermissionListForUpdate');

    // Act
    component.editDivision(id);

    // Assert
    expect(component.getPermissionListForUpdate).toHaveBeenCalledWith(540, 'Division', id);
  });



  //sort method
  it('should call pagesort with correct arguments', () => {
    // Arrange
    const property = 'propertyName'; // Example property
    const pagedItems = [];

    // Spy on the method
    spyOn(component, 'pagesort');

    // Act
    component.sort(property);

    // Assert
    expect(component.pagesort).toHaveBeenCalledWith(property, pagedItems);
  });



//getpermissionlistforcreate method

//ngOnInit
it('should call getDivisionList and divisionForm on ngOnInit', () => {
  // Arrange
  spyOn(component, 'getDivisionList');
  spyOn(component, 'divisionForm');

  // Act
  component.ngOnInit();

  // Assert
  expect(component.getDivisionList).toHaveBeenCalled();
  expect(component.divisionForm).toHaveBeenCalled();
});


//division form method
it('should create divisionForm correctly', () => {
  // Arrange
  spyOn(formBuilder, 'group').and.callThrough(); // Spy on formBuilder.group method

  // Act
  component.divisionForm();

  // Assert
  expect(formBuilder.group).toHaveBeenCalled(); // Ensure formBuilder.group is called
  expect(component.divisionFilter.get('Id').value).toEqual(0); // Check if Id control is initialized correctly
  expect(component.divisionFilter.get('DivisionCode').value).toEqual(''); // Check if DivisionCode control is initialized correctly
  expect(component.divisionFilter.get('DivisionName').value).toEqual(''); // Check if DivisionName control is initialized correctly
  expect(component.divisionFilter.get('Active').value).toEqual(''); // Check if Active control is initialized correctly
});

//divisionInfoRoute
it('should call getPermissionListForCreate with correct arguments', () => {
  // Arrange
  spyOn(component, 'getPermissionListForCreate');

  // Act
  component.divisionInfoRoute();

  // Assert
  expect(component.getPermissionListForCreate).toHaveBeenCalledWith(540, 'Division', 0);
});

//getpermissionlistforcreate
//getpermissionListForUpdate

// it('should call getAllState and getOfficeList on component initialization', waitForAsync(async () => {
//   // Arrange
//   dataService.getAllState.and.returnValue(Promise.resolve()); // Mock the getAllState method to return a resolved promise
//   dataService.getOfficeList.and.returnValue(Promise.resolve()); // Mock the getOfficeList method to return a resolved promise

//   // Act
//   await component.ngOnInit();

//   // Assert
//   expect(dataService.getAllState).toHaveBeenCalled(); // Check if getAllState was called
//   expect(dataService.getOfficeList).toHaveBeenCalled(); // Check if getOfficeList was called
// }));


//getdivisionlist
// xit('should call DataService post method with filter payload when filter is provided', () => {
//   // Setup
//   const filter = 'mockFilter';
//   const expectedServiceUrl = `${component.globals.APIURL}/Division/GetOrganizationDivisionFilter`;
//   const expectedPayload = component.divisionFilter.value;
//   const mockResponse = { data: { Table: [/* Your mock division data */] } };
//   dataService.post.and.returnValue(of(mockResponse));

//   // Execution
//   component.getDivisionList(filter);

//   // Assertion
//   expect(dataService.post).toHaveBeenCalledWith(expectedServiceUrl, expectedPayload);
//   expect(component.divisionList).toEqual([/* Your mock division data */]);
//   expect(component.setPage).toHaveBeenCalledWith(1);
// });



// xit('should call DataService post method without filter payload when filter is not provided', () => {
//   // Setup
//   const expectedServiceUrl = `${component.globals.APIURL}/Division/GetOrganizationDivisionList`;
//   const expectedPayload = {};
//   const mockResponse = { data: { Table: [] } };
//   dataService.post.and.returnValue(of(mockResponse));

//   // Execution
//   component.getDivisionList();

//   // Assertion
//   expect(dataService.post).toHaveBeenCalledWith(expectedServiceUrl, expectedPayload);
//   expect(component.divisionList).toEqual([]);
//   expect(component.pagedItems).toEqual([]);
// });


//getpermisssionlistforcreate
it('should display error message when user does not have permission to create division', () => {
  // Setup
  const mockPermission = [{ SubfunctionID: 1, Create_Opt: 1 }];
  spyOn(localStorage, 'getItem').and.returnValue('1');
  spyOn(commonService, 'GetUserPermissionObject').and.returnValue(of(mockPermission));
  spyOn(Swal, 'fire');

  // Execution
  component.getPermissionListForCreate(1, 'Division', 123);

  // Assertion
  expect(localStorage.getItem).toHaveBeenCalledWith('UserID');
  expect(commonService.GetUserPermissionObject).toHaveBeenCalledWith({
    userID: 1,
    Ref_Application_Id: '4',
    SubfunctionID: 1
  });
  expect(Swal.fire).toHaveBeenCalledWith('Please Contact Administrator');
});


//getPermissionListForCreate


//getdivisionlist
it('should call dataService.post with correct arguments when filter is not provided', () => {
  // Arrange
  const mockResponse = { data: { Table: [] } };

  spyOn(dataService, 'post').and.returnValue(of(mockResponse)); // Mock DataService.post method

  // Act
  component.getDivisionList();

  // Assert
  const expectedServiceUrl = `${component.globals.APIURL}/Division/GetOrganizationDivisionList`;
  expect(dataService.post).toHaveBeenCalledWith(expectedServiceUrl, {});
  expect(component.divisionList).toEqual([]);
  expect(component.pagedItems).toEqual([]);
});


//getpermissionlistforupdate
it('should set isDivision to true when CommonService returns data and route is Division', () => {
  // Arrange
  // this.getPermissionListForUpdate(540, 'Division', id); 
  const value = 540;
  const id = 'id';
  const mockData = [{ SubfunctionID: 123, Update_Opt: 2 }]; // Sample mock data
  (commonService.GetUserPermissionObject as jasmine.Spy).and.returnValue(of(mockData));
  
  // Act
  component.getPermissionListForUpdate(value, 'Division', id);

  // Assert
  expect(component.isDivision).toBe(true);
});








});
