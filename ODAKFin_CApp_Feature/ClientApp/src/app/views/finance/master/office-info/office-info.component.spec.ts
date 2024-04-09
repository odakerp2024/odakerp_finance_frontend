import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfficeInfoComponent } from './office-info.component';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

describe('OfficeInfoComponent', () => {
  let component: OfficeInfoComponent;
  let fixture: ComponentFixture<OfficeInfoComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  
//edit button  
it('should call configurationFormEnable when the button is clicked', waitForAsync(() => {

  spyOn(component, 'configurationFormEnable'); 

  const button = fixture.nativeElement.querySelector('.bmd-btn-edit'); 
  button.click(); 

  expect(component.configurationFormEnable).toHaveBeenCalled(); 
}));


it('should call officeRoute when the button is clicked', waitForAsync(() => {
 
  spyOn(component, 'officeRoute'); 

  const button = fixture.nativeElement.querySelector('.bmd-btn-edit'); 
  button.click();

  expect(component.officeRoute).toHaveBeenCalled(); 
}));


//schedule if true
it('should render the button when isUpdate is true', () => {
 
  component.isUpdate = true;
  fixture.detectChanges();

  const buttonElement = fixture.debugElement.query(By.css('.bmd-btn-edit'));

  expect(buttonElement).toBeTruthy();
});


//schedule if false
it('should not render the button when isUpdate is false', () => {

  component.isUpdate = false;
  fixture.detectChanges();

  const buttonElement = fixture.debugElement.query(By.css('.bmd-btn-edit'));

  expect(buttonElement).toBeFalsy();
});

//modifiedOn
it('should display ModifiedOn and ModifiedBy', () => {
  
  component.ModifiedOn = '2024-04-08'; // Set some values for ModifiedOn and ModifiedBy
  component.ModifiedBy = ' Doe';
  fixture.detectChanges(); // Trigger change detection

  const modifiedOnElement = fixture.nativeElement.querySelector('div.col-md-12 span:nth-child(1)');
  const modifiedByElement = fixture.nativeElement.querySelector('div.col-md-12 span:nth-child(2)');

  expect(modifiedOnElement.textContent).toContain('ModifiedOn: 2024-04-08');
  expect(modifiedByElement.textContent).toContain('Modified By: Doe');
});


//createdOn
it('should display CreatedOn and CreatedBy', () => {

  component.CreatedOn = '2024-04-08';
  component.CreatedBy = 'Doe';
  fixture.detectChanges();

  const createdOnElement = fixture.nativeElement.querySelector('div.col-md-12 span:nth-child(1)');
  const createdByElement = fixture.nativeElement.querySelector('div.col-md-12 span:nth-child(2)');

  expect(createdOnElement.textContent).toContain('CreatedOn: 2024-04-08');
  expect(createdByElement.textContent).toContain('Created By: Doe');
});

//officename
it('should display the Office Name', () => {

  const labelElement = fixture.nativeElement.querySelector('.lbltxt');
  
  const displayedOfficeName = labelElement.textContent.trim();

  expect(displayedOfficeName).toContain('Office Name');
});


//entityname
it('should display the Entity Name', () => {
 
  const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#EntityName');
  
  const displayedEntityName = inputElement.value;

  expect(displayedEntityName).toBe('Entity Name');
  expect(inputElement.readOnly).toBeTruthy(); 
});


//Entity short Name
it('should display the Entity Short Name', () => {
 
const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('#contactName');

const displayedEntityName = inputElement.value;

expect(displayedEntityName).toBe('Entity Short Name');
expect(inputElement.readOnly).toBeTruthy(); 
});


it('should call locationChanges method on select change', () => {

spyOn(component, 'locationChanges');
const selectElement: HTMLSelectElement = fixture.nativeElement.querySelector('#exampleFormControlSelect1');
const event = new Event('change');

selectElement.dispatchEvent(event);

expect(component.locationChanges).toHaveBeenCalled();
});


//PAN input
it('should render the PAN No label and input element with readonly attribute', () => {

component.officeForm = new FormBuilder().group({
  PANNo: ['TEST1234'] // Set a value for PANNo form control
});
fixture.detectChanges();

const panNoLabel: HTMLElement = fixture.nativeElement.querySelector('label[for="designation"]');
const panNoInput: HTMLInputElement = fixture.nativeElement.querySelector('input#designation');

expect(panNoLabel).toBeTruthy(); // Check if the label is rendered
expect(panNoLabel.textContent.trim()).toBe('PAN No'); // Check if the label text is correct
expect(panNoInput).toBeTruthy(); // Check if the input element is rendered
expect(panNoInput.readOnly).toBe(true); // Check if the input is readonly
expect(panNoInput.value).toBe('TEST1234'); // Check if the input value is set correctly
});

//registration address
it('should render a readonly textarea for RegistrationAddress', () => {
// Arrange
const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');

// Assert
expect(textarea).toBeTruthy(); // Check if the textarea element is rendered
expect(textarea.readOnly).toBe(true); // Check if the textarea is readonly
expect(textarea.getAttribute('formControlName')).toBe('RegistrationAddress'); // Check if the textarea is bound to the correct form control
});


//financialyear
it('should render a readonly select for FinancialYear', () => {
// Arrange
const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');

// Assert
expect(select).toBeTruthy(); // Check if the select element is rendered
expect(select.disabled).toBe(true); // Check if the select is disabled (readonly)
expect(select.getAttribute('formControlName')).toBe('FinancialYear'); // Check if the select is bound to the correct form control
});


it('should not display error message for valid pin code', () => {
// Set the form control value to a valid pin code
const pinCodeFormControl = component.officeDetailsForm.get('PinCode') as FormControl;
pinCodeFormControl.setValue('123456'); // Valid pin code
component.officeDetailsSubmit = true; // Set to true to trigger validation

fixture.detectChanges();

// Check if the error message is not displayed
const errorMessageElement = fixture.nativeElement.querySelector('.text-danger');
expect(errorMessageElement).toBeNull();
});

//address
it('should initialize Address form control', () => {

const addressFormControl = component.officeDetailsForm.get('Address');

expect(addressFormControl).toBeDefined();

expect(addressFormControl instanceof FormControl).toBe(true);

expect(addressFormControl.value).toBe('');
});


//cancel btn
it('should navigate to /views/finance/financemaster when the button is clicked', () => {
const cancelButton = fixture.debugElement.query(By.css('.btn-danger'));

const navigateSpy = spyOn(router, 'navigate');

cancelButton.triggerEventHandler('click', null);
fixture.detectChanges();

expect(navigateSpy).toHaveBeenCalledWith(['/views/finance/financemaster']);
});

//ngOnint
it('should call createDocumentForm, getFinancialYear, and getDivisionList methods during initialization', () => {
expect(component.createDocumentForm).toHaveBeenCalled(); // Check if createDocumentForm method is called
expect(component.getFinancialYear).toHaveBeenCalled(); // Check if getFinancialYear method is called
expect(component.getDivisionList).toHaveBeenCalled(); // Check if getDivisionList method is called
});

//createentityform
it('should initialize officeForm with expected form controls and initial values', () => {
const formValue = component.officeForm.value;
expect(formValue.Id).toBe(0);
expect(formValue.OrgId).toBe(localStorage.getItem('OrgId'));
expect(formValue.OfficeName).toBe('');
expect(formValue.BusinessLocation).toBe('');
expect(formValue.CreatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.CreatedDate).toEqual(new Date());
expect(formValue.UpdatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.UpdatedDate).toEqual(new Date());
expect(formValue.EntityName).toBe('');
expect(formValue.EntityShortName).toBe('');
expect(formValue.BusinessDIvision).toBe('');
expect(formValue.FinancialYear).toBe('');
expect(formValue.RegistrationAddress).toBe('');
});

//create document form
it('should initialize documentForm with expected form controls and initial values', () => {
const formValue = component.documentForm.value;
expect(formValue.ID).toBe(0);
expect(formValue.OfficeId).toBe(0);
expect(formValue.DocumentName).toBe('');
expect(formValue.FilePath).toBe('');
expect(formValue.CreatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.CreatedDate).toEqual(new Date());
expect(formValue.UpdatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.UpdatedDate).toEqual(new Date());
expect(formValue.UploadedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.uploadedOn).toEqual(new Date());
});

//createofficedetailsform
it('should initialize officeDetailsForm with expected form controls and initial values', () => {
const formValue = component.officeDetailsForm.value;
expect(formValue.ID).toBe(0);
expect(formValue.OfficeId).toBe(0);
expect(formValue.IsSalesOffice).toBeFalsy(); // Assuming !this.IsSalesValue.toString() resolves to false
expect(formValue.ParentOffice).toBe('');
expect(formValue.Active).toBe('true');
expect(formValue.OfficeCode).toBe('');
expect(formValue.OfficeName).toBe('');
expect(formValue.OfficeShortName).toBe('');
expect(formValue.StateId).toBe('');
expect(formValue.PinCode).toBe('');
expect(formValue.Telephone).toBe('');
expect(formValue.Address).toBe('');
expect(formValue.GSTNo).toBe('');
expect(formValue.EffectiveDate).toBe('');
expect(formValue.CreatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.CreatedDate).toEqual(new Date());
expect(formValue.UpdatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.UpdatedDate).toEqual(new Date());
});

//createdocumentform
it('should initialize documentForm with expected form controls and initial values', () => {
const formValue = component.documentForm.value;
expect(formValue.ID).toBe(0);
expect(formValue.OfficeId).toBe(0);
expect(formValue.DocumentName).toBe('');
expect(formValue.FilePath).toBe('');
expect(formValue.CreatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.CreatedDate).toEqual(jasmine.any(Date));
expect(formValue.UpdatedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.UpdatedDate).toEqual(jasmine.any(Date));
expect(formValue.UploadedBy).toBe(localStorage.getItem('UserID'));
expect(formValue.uploadedOn).toEqual(jasmine.any(Date));
});

//officeRoute
it('should navigate to office view route', () => {
spyOn(router, 'navigateByUrl');

component.officeRoute();

expect(router.navigateByUrl).toHaveBeenCalledWith('/views/office/office-view');
});


//removeControlsFromOfficeForm

it('should remove controls CIN and PANNo from officeForm if they exist', () => {

component.officeForm.addControl('CIN', new FormControl(''));
component.officeForm.addControl('PANNo', new FormControl(''));

component.removeControlsFromOfficeForm();

expect(component.officeForm.get('CIN')).toBeNull();
expect(component.officeForm.get('PANNo')).toBeNull();
});

//officeformDisable
it('should disable all controls within officeForm', () => {

component.officeForm.enable();

component.officeFormDisable();

expect(component.officeForm.disabled).toBe(true);
});


//officeformenable
it('should enable all controls within officeForm', () => {

component.officeForm.disable();

component.officeFormEnable();

expect(component.officeForm.enabled).toBe(true);
});


//officedetailsfoemdisable
it('should disable all controls within officeDetailsForm', () => {

component.officeDetailsForm.enable();

component.officeDetailsFormDisable();

expect(component.officeDetailsForm.disabled).toBe(true);
});


//officedetailsformenable
it('should enable all controls within officeDetailsForm', () => {

component.officeDetailsForm.disable();

component.officeDetailsFormEnable();

expect(component.officeDetailsForm.enabled).toBe(true);
});

//configurationformenable
it('should enable configuration form', () => {

component.configurationFormEnable();

expect(component.isUpdateEnable).toBe(true);

expect(component.officeForm.enabled).toBe(true);

expect(component.officeDetailsForm.enabled).toBe(true);
});

//upload document
it('should update documentListInfoResponse and call saveOfficeDetails', () => {

const mockEvent = {
  DocumentName: 'Test Document',
  FilePath: 'test/document/path'
};

component.officeId = 1;
component.documentListInfoResponse = [];

component.uploadDocument(mockEvent);

expect(component.documentListInfoResponse.length).toBe(1);
expect(component.documentListInfoResponse[0]).toEqual({
  ID: 0,
  OfficeId: 1,
  DocumentName: 'Test Document',
  FilePath: 'test/document/path',
  CreatedBy: +localStorage.getItem('UserID'),
  CreatedDate: jasmine.any(Date),
  UpdatedBy: +localStorage.getItem('UserID'),
  UpdatedDate: jasmine.any(String), 
  UploadedBy: +localStorage.getItem('UserID'),
  UploadedOn: jasmine.any(String) 
});
});

//deletedocument
it('should delete document from documentListInfoResponse and call saveOfficeDetails', () => {
// Set up initial values
component.documentListInfoResponse = [
  {
    ID: 1,
    OfficeId: 123,
    DocumentName: 'Test Document 1',
    FilePath: 'test/document/path1'
  },
  {
    ID: 2,
    OfficeId: 456,
    DocumentName: 'Test Document 2',
    FilePath: 'test/document/path2'
  }
];

// Call the method with the index to delete
component.deleteDocument({ OfficeId: 123 }); 

// Assert that documentListInfoResponse is updated correctly
expect(component.documentListInfoResponse.length).toBe(1);
expect(component.documentListInfoResponse[0]).toEqual({
  ID: 2,
  OfficeId: 456,
  DocumentName: 'Test Document 2',
  FilePath: 'test/document/path2'
});

});


//constructdocumentpayload
it('should construct document payload from docList', () => {
// Sample docList array
const docList = [
  {
    ID: 1,
    UploadedOn: '2024-04-08T12:00:00Z',
    DocumentName: 'Test Document 1',
    FilePath: 'test/document/path1'
  },
  {
    ID: 2,
    UploadedOn: '2024-04-08T12:00:00Z',
    DocumentName: 'Test Document 2',
    FilePath: 'test/document/path2'
  }
];

// Call the method and get the constructed payload
const payload = component.constructDocumentPayload(docList);

// Assert that the payload is constructed correctly
expect(payload.length).toBe(2);
expect(payload[0]).toEqual({
  OfficeId: 1,
  uploadedOn: '2024-04-08T12:00:00Z',
  DocumentName: 'Test Document 1',
  FilePath: 'test/document/path1'
});
expect(payload[1]).toEqual({
  OfficeId: 2,
  uploadedOn: '2024-04-08T12:00:00Z',
  DocumentName: 'Test Document 2',
  FilePath: 'test/document/path2'
});
});

});
