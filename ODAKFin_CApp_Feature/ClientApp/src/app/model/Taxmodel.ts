import { Associated, TaxType, AssociatedGLMappingDetails } from "./Createtaxtype";


export class TaxDetails {
    Table : TaxType[] =[];
    Table1:Associated[] =[];
    Table2:AssociatedGLMappingDetails[] =[];
 }
 export class TaxtypeModel{
   
   TaxType:TaxDetails;
 }

 export class TaxtypeGetDetails{
  TaxTypeId:Number=0;
}