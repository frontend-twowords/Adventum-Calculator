import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-cashflowstep3',
  templateUrl: './cashflowstep3.component.html',
  styleUrls: ['./cashflowstep3.component.css']
})
export class Cashflowstep3Component implements OnInit {
  investedTenure: string = '5';
  rentalYeild: string = '';
  rentalGrowthEscalation: string = '';

  calcData: any;

  // Preview values
  grossAnnual: number = 0;
  netAnnual: number = 0;
  netYield: number = 0;

  propertyValue: number = 0;

  constructor(
    private router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData') || '{}') || {};

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.propertyValue = parseFloat(this.calcData.PropertyValue.toString().replace(/,/g, '')) || 0;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)) {
      this.investedTenure = this.calcData.investedTenure;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)) {
      this.rentalYeild = this.calcData.rentalYeild + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalGrowthEscalation)) {
      this.rentalGrowthEscalation = this.calcData.rentalGrowthEscalation + '%';
    }
  }

  ngOnInit(): void {
    this.updatePreview();
  }

  updatePreview() {
    const yieldRate = parseFloat((this.rentalYeild || '0').replace('%', '')) || 0;
    this.grossAnnual = this.propertyValue * (yieldRate / 100);
    this.netAnnual = this.grossAnnual * 0.85; // rough preview (15% costs estimate)
    this.netYield = this.propertyValue > 0 ? (this.netAnnual / this.propertyValue) * 100 : 0;
  }

  next() {
    if (!this.calcData.PropertyValue) return;

    this.calcData.investedTenure = this.investedTenure;
    this.calcData.rentalYeild = parseFloat((this.rentalYeild || '0').replace('%', '')) || 0;
    this.calcData.rentalGrowthEscalation = parseFloat((this.rentalGrowthEscalation || '0').replace('%', '')) || 0;
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem('calcData', JSON.stringify(this.calcData));
    this.router.navigate(['/cashflow/step4']);
  }
}
