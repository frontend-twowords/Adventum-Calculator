import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cashflowstep4',
  templateUrl: './cashflowstep4.component.html',
  styleUrls: ['./cashflowstep4.component.css']
})
export class Cashflowstep4Component implements OnInit {
  foreignbuyer: string = '0';
  stampDutyLandTax: string = '';
  loanOriginationFee: string = '';
  calcData: any;
  country: string = '';
  PropertyValue: string = '';
  letteingManagFee: string = '';
  groundRent: string = '';
  serviceCharges: string = '';
  miscelleneousExpense: string = '';
  PropertyLondon: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData') || '{}') || {};

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.foreignbuyer)) {
      this.foreignbuyer = this.calcData.foreignbuyer;
    } else if (!this.dataService.EmptyNullOrUndefined(this.calcData.ForeignBuyer)) {
      this.foreignbuyer = this.calcData.ForeignBuyer;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.stampDutyLandTax)) {
      this.stampDutyLandTax = this.validation.amountWithComma(String(this.calcData.stampDutyLandTax));
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanOriginationFee)) {
      this.loanOriginationFee = this.calcData.loanOriginationFee + '%';
    }
    if (this.calcData.optmortgage === '0') {
      this.loanOriginationFee = '0%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.Country)) {
      this.country = this.calcData.Country;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.calcData.PropertyValue;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.letteingManagFee)) {
      this.letteingManagFee = this.calcData.letteingManagFee + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.groundRent)) {
      this.groundRent = this.validation.amountWithComma(String(this.calcData.groundRent));
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.serviceCharges)) {
      this.serviceCharges = this.validation.amountWithComma(String(this.calcData.serviceCharges));
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.miscelleneousExpense)) {
      this.miscelleneousExpense = this.validation.amountWithComma(String(this.calcData.miscelleneousExpense));
    }
  }

  ngOnInit(): void {
    this.PropertyLondon = localStorage.getItem('PropertyLondon');
    if (!this.stampDutyLandTax && this.PropertyValue) {
      this.calculatestampduty();
    }
  }

  calculatestampduty() {
    const apiCountry = this.resolveApiCountry(this.country);
    const pv = parseFloat(this.PropertyValue.toString().replace(/,/g, '')) || 0;
    if (!pv) return;

    this.dataService.GetRequest(
      'https://api.propertydata.co.uk/stamp-duty-calculator?key=' + environment.PropertyDataKey +
      '&value=' + pv + '&country=' + apiCountry + '&mode=investment'
    ).subscribe(
      (res: any) => {
        const obj = JSON.parse(JSON.stringify(res));
        if (obj.status === 'success') {
          let sdlt = obj.transaction_tax_payable;
          if (this.foreignbuyer === '1') {
            sdlt = sdlt + (pv * 2 / 100);
          }
          this.stampDutyLandTax = this.validation.amountWithComma(Math.round(sdlt).toString());
        } else {
          this.stampDutyLandTax = this.validation.amountWithComma(
            this.calculateSdltFallback(pv, this.foreignbuyer === '1').toString()
          );
        }
      },
      (_err) => {
        const pv2 = parseFloat(this.PropertyValue.toString().replace(/,/g, '')) || 0;
        this.stampDutyLandTax = this.validation.amountWithComma(
          this.calculateSdltFallback(pv2, this.foreignbuyer === '1').toString()
        );
      }
    );
  }

  resolveApiCountry(raw: string): string {
    if (!raw) return 'england';
    const r = raw.toLowerCase().trim();
    if (r === 'scotland') return 'scotland';
    if (r === 'wales') return 'wales';
    if (r === 'northern-ireland' || r === 'northern ireland') return 'northern-ireland';
    return 'england';
  }

  calculateSdltFallback(value: number, isForeignBuyer: boolean): number {
    let sdlt = 0;
    if (value > 250000) sdlt += Math.min(value - 250000, 675000) * 0.05;
    if (value > 925000) sdlt += Math.min(value - 925000, 575000) * 0.10;
    if (value > 1500000) sdlt += (value - 1500000) * 0.12;
    sdlt += value * 0.05;
    if (isForeignBuyer) sdlt += value * 0.02;
    return Math.round(sdlt);
  }

  next() {
    let flag = true;

    if (!this.dataService.EmptyNullOrUndefined(this.foreignbuyer)) {
      this.calcData.foreignbuyer = this.foreignbuyer;
    } else {
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.stampDutyLandTax)) {
      this.calcData.stampDutyLandTax = parseFloat(this.stampDutyLandTax.replace(/,/g, '')) || 0;
    } else {
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.loanOriginationFee)) {
      this.calcData.loanOriginationFee = parseFloat(this.loanOriginationFee.replace('%', '')) || 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.letteingManagFee)) {
      this.calcData.letteingManagFee = parseFloat(this.letteingManagFee.replace('%', '')) || 0;
    } else {
      this.calcData.letteingManagFee = 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.groundRent)) {
      this.calcData.groundRent = parseFloat(this.groundRent.replace(/,/g, '')) || 0;
    } else {
      this.calcData.groundRent = 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.serviceCharges)) {
      this.calcData.serviceCharges = parseFloat(this.serviceCharges.replace(/,/g, '')) || 0;
    } else {
      this.calcData.serviceCharges = 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.miscelleneousExpense)) {
      this.calcData.miscelleneousExpense = parseFloat(this.miscelleneousExpense.replace(/,/g, '')) || 0;
    } else {
      this.calcData.miscelleneousExpense = 0;
    }

    // Ensure defaults for result component
    if (this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)) {
      this.calcData.homecurrency = 1;
    }
    if (this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)) {
      this.calcData.fxgrowth = 0;
    }

    if (flag) {
      this.calcData.reportSavedOnServer = false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/cashflow/result']);
    }
  }
}
