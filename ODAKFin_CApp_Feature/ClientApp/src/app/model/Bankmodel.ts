import { Attachment, Bank, Cheque, Statement } from "./Createbankaccount";

export class BankDetails {
    Table : Bank[] =[];
    Table1:Cheque[] =[];
    Table2:Attachment[] =[];
    Table3:Statement[] =[];

    
   
 }
 export class BankaccountModel{
   
    Bank:BankDetails;
 }
 export class BankaccountGetDetails{
   BankId:Number=0;
}