import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() { }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  DesimalOnly(event: KeyboardEvent, value: string): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
    if (value.indexOf('.') > -1 && charCode === 46) {
      return false;
    }
    return true;
  }
  isNullEmptyUndefined(value: string): boolean {
    if (value === null || value === "" || value === undefined)
      return true;
    else
      return false;
  }
  appendPercent(event: KeyboardEvent, value: string): string {
    const charCode = (event.which) ? event.which : event.keyCode;
    value = value.replace('%', '');
    if (charCode == 8) {
      value = value.slice(0, -1);
    }
    return value;
  }
  amountWithComma(value: string): string {
    value = value.replace(/,/g, '').split('').reverse().join('');//value.replace(',','');
    let valueLen = value.length;
    let pointer = 0;
    for (let i = 0; i < valueLen; i++) {
      if (i % 3 === 0 && i !== 0) {
        value = value.slice(0, i + pointer) + ',' + value.slice(i + pointer, valueLen + pointer);
        pointer++;
      }
    }
    return value.split('').reverse().join('');
  }
  amountWithLakhComma(value: string): string {
    value = value.toString();
    let valueDecimalSeprated = value.split('.');
    let AfterDecimal = "";
    if (valueDecimalSeprated.length > 0) {
      AfterDecimal = valueDecimalSeprated[1];
      value = valueDecimalSeprated[0];
    }
    value = value.replace(/,/g, '').split('').reverse().join('');//value.replace(',','');
    let valueLen = value.length;
    let pointer = 0;
    var str = new String(value);
    let LastChar = str.charAt(0);
    value = value.substring(1);
    for (let i = 0; i < valueLen; i++) {
      if (i % 2 === 0 && i < valueLen - 1 && i !== 0) {
        value = value.slice(0, i + pointer) + ',' + value.slice(i + pointer, valueLen + pointer);
        pointer++;
      }
    }
    return this.isNullEmptyUndefined(AfterDecimal) ? value.split('').reverse().join('') + LastChar : value.split('').reverse().join('') + LastChar + "." + AfterDecimal;
  }
  getCurrentDateWithSpecificFormat(): string {
    let dateString;
    let date = new Date().getDate();
    let month = this.getMonthInString(new Date().getMonth());
    let year = new Date().getFullYear();
    if(date == 1 || date == 21 || date == 31){
      dateString = date.toString() + "st of " + month + ", " + year.toString();
    }
    else if(date == 2 || date == 22){
      dateString = date.toString() + "nd of " + month + ", " + year.toString();
    }
    else if(date == 3 || date == 23){
      dateString = date.toString() + "rd of " + month + ", " + year.toString();
    }
    else{
      dateString = date.toString() + "th of " + month + ", " + year.toString();
    }
  
    return dateString;
  }

  getMonthInString(month: number): string {
    let monthString;
    switch (month) {
      case 0:
        monthString = "January";
        break;
      case 1:
        monthString = "February";
        break;
      case 2:
        monthString = "March";
        break;
      case 3:
        monthString = "April";
        break;
      case 4:
        monthString = "May";
        break;
      case 5:
        monthString = "June";
        break;
      case 6:
        monthString = "July";
        break;
      case 7:
        monthString = "August";
        break;
      case 8:
        monthString = "September";
        break;
      case 9:
        monthString = "October";
        break;
      case 10:
        monthString = "November";
        break;
      case 11:
        monthString = "December";
        break;
      default:
        monthString = "";
        break;
    }
    return monthString;
  }

  checkSession(): boolean {
    let flag = false;
    if (!this.isNullEmptyUndefined(sessionStorage.getItem("UserId"))) {
      flag = true;
    }
    return flag;
  }
}
