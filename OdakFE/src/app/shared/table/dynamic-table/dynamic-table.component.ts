import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {
  tableType = 'list'
  constructor() { }

  ngOnInit(): void {
  }
  // @Input() headers: { header: string, key: string }[];
  // @Input() data: any[];

  // getColumnKeys(): string[] {
  //   return this.headers.map(header => header.key);
  // }


  @Input() headers: { header: string, key: string, editable: boolean, type: string, formControlName: string }[];
  @Input() data: any[];
  getColumnKeys(): string[] {
    return this.headers.map(header => header.key);
  }

  // const columnName = this.headers.

  tableData = [
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Smith', age: 30 },
  ]

  OnClickRadio(i){
    
  }
}


