import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-cashflowstep2',
  templateUrl: './cashflowstep2.component.html',
  styleUrls: ['./cashflowstep2.component.css']
})
export class Cashflowstep2Component implements OnInit {
  // Property & Mortgage fields
  propertyValueDisplay: string = '';
  optmortgage: string = '1';
  loanAmount: string = '75';
  interestRate: string = '';
  loanTenure: string = '10';
  mortgageType: string = '1';

  calcData: any;

  // Preview values
  deposit: number = 0;
  loanAmountVal: number = 0;
  annualMortgage: number = 0;
  propertyValue: number = 0;

  constructor(
    public router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData') || '{}') || {};

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.propertyValue = parseFloat(this.calcData.PropertyValue.toString().replace(/,/g, '')) || 0;
      this.propertyValueDisplay = this.validation.amountWithComma(this.calcData.PropertyValue.toString());
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanAmount)) {
      this.loanAmount = this.calcData.loanAmount;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanTenure)) {
      this.loanTenure = this.calcData.loanTenure;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.optmortgage)) {
      this.optmortgage = this.calcData.optmortgage;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageType)) {
      this.mortgageType = this.calcData.mortgageType;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageInterestRate)) {
      this.interestRate = this.calcData.mortgageInterestRate + '%';
    }
  }

  ngOnInit(): void {
    this.updatePreview();
  }

  updatePreview() {
    this.propertyValue = parseFloat((this.propertyValueDisplay || '0').replace(/,/g, '')) || 0;
    const ltv = parseFloat(this.loanAmount) / 100;
    const loan = this.propertyValue * ltv;
    const dep = this.propertyValue - loan;
    const rate = parseFloat((this.interestRate || '5').replace('%', '')) || 5;
    const tenure = parseInt(this.loanTenure) || 10;

    this.deposit = dep;
    this.loanAmountVal = loan;

    if (this.optmortgage !== '1') {
      this.annualMortgage = 0;
      return;
    }

    if (this.mortgageType === '1') {
      // Interest only
      this.annualMortgage = loan * (rate / 100);
    } else {
      // Repayment
      const r = rate / 100 / 12;
      const n = tenure * 12;
      if (r === 0) {
        this.annualMortgage = (loan / n) * 12;
      } else {
        const monthly = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        this.annualMortgage = monthly * 12;
      }
    }
  }

  next() {
    this.propertyValue = parseFloat((this.propertyValueDisplay || '0').replace(/,/g, '')) || 0;
    if (!this.propertyValue) return;

    this.calcData.PropertyValue = this.propertyValue;
    this.calcData.loanAmount = parseFloat(this.loanAmount) || 0;
    this.calcData.loanTenure = this.loanTenure;
    this.calcData.optmortgage = this.optmortgage;
    this.calcData.mortgageType = this.mortgageType;
    this.calcData.mortgageInterestRate = parseFloat((this.interestRate || '0').replace('%', '')) || 0;
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem('calcData', JSON.stringify(this.calcData));
    this.router.navigate(['/cashflow/step3']);
  }
}
