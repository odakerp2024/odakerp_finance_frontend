import { BasicOrgDetails,OfficeDetails,EmailAlerts, Division,Attachments} from './Createorganization';

export class OrgDetails {
   Table : BasicOrgDetails[] =[];
   Table1:OfficeDetails[] =[];
   Table2:EmailAlerts[] =[];
   Table3:Attachments[] =[];
   Table4:Division[] =[];
  
}
export class OrganizationModel{
   Organization:OrgDetails;
}

export class OrganizationGetDetails{
   OrganizationId:Number=0;
}