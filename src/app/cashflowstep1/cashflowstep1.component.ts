import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-cashflowstep1',
  templateUrl: './cashflowstep1.component.html',
  styleUrls: ['./cashflowstep1.component.css']
})
export class CashflowStep1Component implements OnInit {
  City: string = '';
  Pincode: string = '';
  searchQuery: string = '';
  PropertyValue: string = '';
  loanAmount: string = '75';
  loanTenure: string = '10';
  optmortgage: string = '1';
  mortgageType: string = '1';
  foreignbuyer: string = '1';
  calcData: any;

  cityData: any = {
    'London':     { desc: 'Capital city, strong long-term appreciation',       yield: '3.8%', growth: '+12%', price: '£850k' },
    'Liverpool':  { desc: 'Highest rental yields in the UK',                    yield: '8.1%', growth: '+19%', price: '£195k' },
    'Manchester': { desc: 'Prime investment zone with highest rental demand',   yield: '6.8%', growth: '+28%', price: '£425k' },
    'Birmingham': { desc: 'UK\'s second city with strong regeneration',         yield: '6.2%', growth: '+22%', price: '£320k' },
    'Others':     { desc: 'Explore other UK investment opportunities',          yield: '6.0%', growth: '+18%', price: '£280k' },
  };

  heroData: any = {
    'London':     { yield: '3.8%', growth: '+12%' },
    'Liverpool':  { yield: '8.1%', growth: '+19%' },
    'Manchester': { yield: '6.8%', growth: '+28%' },
    'Birmingham': { yield: '6.2%', growth: '+22%' },
    'Others':     { yield: '6.0%', growth: '+18%' },
  };

  constructor(
    public router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData') || '{}') || {};
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.City)) {
      this.City = this.calcData.City;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.Pincode)) {
      this.Pincode = this.calcData.Pincode;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.validation.amountWithComma(String(this.calcData.PropertyValue));
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
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.ForeignBuyer)) {
      this.foreignbuyer = this.calcData.ForeignBuyer;
    }
  }

  ngOnInit(): void {
    localStorage.setItem('CalculatorType', '6');
  }

  selectCity(city: string, pincode: string, latVal: number, longVal: number) {
    this.City = city;
    this.Pincode = pincode;
    this.searchQuery = pincode;
    this.calcData.Pincode = pincode;
    this.calcData.City = city;
    this.calcData.lat = latVal;
    this.calcData.long = longVal;
    this.calcData.Country = city === 'London' ? 'england' : city.toLowerCase();
    this.calcData.reportSavedOnServer = false;
    if (city === 'London') {
      localStorage.setItem('PropertyLondon', '1');
    } else {
      localStorage.setItem('PropertyLondon', '0');
    }
    localStorage.setItem('calcData', JSON.stringify(this.calcData));
  }

  getCityDesc(): string { return this.cityData[this.City]?.desc || ''; }
  getCityStat(type: string): string { return this.cityData[this.City]?.[type] || ''; }
  getHeroYield(): string { return this.heroData[this.City]?.yield || '6.5%'; }
  getHeroGrowth(): string { return this.heroData[this.City]?.growth || '+23%'; }

  next() {
    if (!this.City) return;

    this.calcData.City = this.City;
    this.calcData.loanAmount = this.loanAmount;
    this.calcData.loanTenure = this.loanTenure;
    this.calcData.ForeignBuyer = this.foreignbuyer;
    this.calcData.optmortgage = this.optmortgage;
    this.calcData.mortgageType = this.mortgageType;
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem('calcData', JSON.stringify(this.calcData));
    this.router.navigate(['/cashflow/step2']);
  }
}
