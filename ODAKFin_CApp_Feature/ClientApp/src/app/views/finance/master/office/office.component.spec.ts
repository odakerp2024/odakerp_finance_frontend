import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeComponent } from './office.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('OfficeComponent', () => {
  let component: OfficeComponent;
  let fixture: ComponentFixture<OfficeComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render the heading "Division"', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Office');
  });


//table headers
  it('should display the correct table headers', () => {
    const headerElements = debugElement.nativeElement.querySelectorAll('th');
    const headerTexts = Array.from(headerElements).map((el: HTMLElement) => el.textContent?.trim());
    expect(headerTexts).toEqual(['Office Code', 'Office Name', 'Short Name', 'State', 'GST No', 'Active']);
  });

//search button
  it('should call getDivisionList method with "search" argument when button is clicked', () => {
    spyOn(component, 'getOfficeList');
    const button = debugElement.query(By.css('.searchinfo'));
    button.triggerEventHandler('click', null);
    expect(component.getOfficeList).toHaveBeenCalledWith('search');
  });

//clearBtn
    it('should call getOfficeList() method when the button is clicked', () => {
      // Arrange
      spyOn(component, 'getOfficeList');
  
      // Act
      const button = fixture.debugElement.query(By.css('.clearbtn'));
      button.triggerEventHandler('click', null);
      fixture.detectChanges();
  
      // Assert
      expect(component.getOfficeList).toHaveBeenCalled();
    });


    
  it('should call pagesort method with property and pagedItems', () => {
    // Arrange
    const property = 'propertyName'; // Replace with your property name
    const pagedItems = ['item1', 'item2', 'item3']; // Replace with your paged items

    spyOn(component, 'pagesort');

    // Act
    component.sort(property);

    // Assert
    expect(component.pagesort).toHaveBeenCalledWith(property, component.pagedItems);
  });


//officeInRoute
  it('should call getPermissionListForCreate method with correct parameters', () => {
    // Arrange
    spyOn(component, 'getPermissionListForCreate');

    // Act
    component.officeInfoRoute('someRoutePath');

    // Assert
    expect(component.getPermissionListForCreate).toHaveBeenCalledWith(544, 'Office Details');
  });

//editOffice
  it('should call getPermissionListForUpdate method with correct parameters', () => {
    // Arrange
    const id = 123; // Sample id for testing
    spyOn(component, 'getPermissionListForUpdate');

    // Act
    component.editOffice(id);

    // Assert
    expect(component.getPermissionListForUpdate).toHaveBeenCalledWith(544, 'Office Details', id);
  });


//sort
  it('should call pagesort method with correct parameters', () => {
    // Arrange
    const property = 'propertyName'; // Replace with your property name
    const pagedItems = ['item1', 'item2', 'item3']; // Replace with your paged items
    spyOn(component, 'pagesort');

    // Act
    component.sort(property);

    // Assert
    expect(component.pagesort).toHaveBeenCalledWith(property, component.pagedItems);
  });


//createOfficeForm
  it('should create the office filter form with default values', () => {
    // Act
    component.createOfficeForm();

    // Assert
    expect(component.officeFilter).toBeTruthy(); 
    expect(component.officeFilter.get('Id').value).toEqual(0); 
    expect(component.officeFilter.get('officeCode').value).toEqual('');
    expect(component.officeFilter.get('OfficeName').value).toEqual('');
    expect(component.officeFilter.get('ShortName').value).toEqual('');
    expect(component.officeFilter.get('StateId').value).toEqual(0);
    expect(component.officeFilter.get('GSTNo').value).toEqual(''); 
    expect(component.officeFilter.get('Active').value).toEqual(''); 
  });


  //getstateinfo

  // it('should fetch state information from the server', () => {
  //   // Arrange
  //   const mockResponse = { message: 'Success', data: { Table: [{ id: 1, name: 'State 1' }, { id: 2, name: 'State 2' }] } };

  //   // Act
  //   component.getStateInfo();

  //   // Assert
  //   const req = httpTestingController.expectOne(`${component.globals.APIURL}/Office/GetOrganizationOfficeList`);
  //   expect(req.request.method).toEqual('POST');

  //   // Respond with mock data
  //   req.flush(mockResponse);

  //   // Check if officeList is updated with the data received from the server
  //   expect(component.officeList).toEqual(mockResponse.data.Table);
  // });



//getOrganization



});
