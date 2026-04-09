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
  foreignbuyer: string = '0';
  homecurrencyText: string = '';
  homecurrency: string = '1';
  currencyDropdownOpen = false;
  currencySearch = '';
  calcData: any;

  currencyList = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'GBP', name: 'Great Britain Pound' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'QAR', name: 'Qatari Rial' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'UZS', name: 'Uzbekistani Som' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
  ];

  fallbackRates: any = {
    'INR': 107, 'AED': 4.67, 'USD': 1.27, 'EUR': 1.17, 'HKD': 9.88,
    'NGN': 2100, 'BDT': 140, 'PKR': 355, 'CAD': 1.72, 'AUD': 1.94,
    'SGD': 1.70, 'MYR': 5.94, 'JPY': 189, 'CNY': 9.18, 'SAR': 4.76,
    'QAR': 4.62, 'KWD': 0.39, 'ZAR': 23.5, 'KES': 164, 'GHS': 19.2,
    'EGP': 62, 'MAD': 12.7, 'TRY': 43, 'PLN': 5.08, 'DKK': 8.73,
    'SEK': 13.7, 'NOK': 13.5, 'CHF': 1.11, 'ILS': 4.66, 'BRL': 7.0,
    'MXN': 21.9, 'PHP': 72, 'IDR': 20200, 'THB': 44.6, 'VND': 31800,
    'KRW': 1690, 'TWD': 40.8, 'NZD': 2.10, 'LKR': 380, 'NPR': 170,
    'KZT': 570, 'UZS': 16200, 'ZMW': 34, 'GBP': 1
  };

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
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)) {
      this.homecurrencyText = this.calcData.homecurrencyText;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)) {
      this.homecurrency = this.calcData.homecurrency;
    }
    if (this.foreignbuyer !== '1') {
      this.homecurrencyText = 'GBP';
      this.homecurrency = '1';
    }
  }

  ngOnInit(): void {
    localStorage.setItem('CalculatorType', '6');
  }

  getCurrencyLabel(code: string): string {
    const found = this.currencyList.find(c => c.code === code);
    return found ? `${found.name} (${found.code})` : code;
  }

  getFilteredCurrencies() {
    const q = this.currencySearch.toLowerCase().trim();
    if (!q) return this.currencyList;
    return this.currencyList.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }

  async selectCurrency(code: string) {
    this.homecurrencyText = code;
    this.currencyDropdownOpen = false;
    this.currencySearch = '';
    this.calcData.homecurrencyText = code;
    const applyFallback = () => {
      const rate = this.fallbackRates[code.toUpperCase()];
      if (rate) { this.homecurrency = rate.toString(); this.calcData.homecurrency = this.homecurrency; }
    };
    await new Promise((res) => {
      this.dataService.GetRequest1('https://open.er-api.com/v6/latest/GBP').subscribe((data: any) => {
        try {
          if (data?.result === 'success') {
            const rate = data.rates[code.toUpperCase()];
            if (rate) { this.homecurrency = parseFloat(rate.toFixed(2)).toString(); this.calcData.homecurrency = this.homecurrency; }
            else { applyFallback(); }
          } else { applyFallback(); }
        } catch { applyFallback(); }
        res(null);
      }, () => { applyFallback(); res(null); });
    });
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
    if (this.foreignbuyer === '1' && !this.homecurrencyText) return;

    this.calcData.City = this.City;
    this.calcData.loanAmount = this.loanAmount;
    this.calcData.loanTenure = this.loanTenure;
    this.calcData.ForeignBuyer = this.foreignbuyer;
    this.calcData.optmortgage = this.optmortgage;
    this.calcData.mortgageType = this.mortgageType;
    if (this.foreignbuyer !== '1') {
      this.calcData.homecurrencyText = 'GBP';
      this.calcData.homecurrency = '1';
    } else {
      this.calcData.homecurrencyText = this.homecurrencyText;
      this.calcData.homecurrency = this.homecurrency;
    }
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem('calcData', JSON.stringify(this.calcData));
    this.router.navigate(['/cashflow/step2']);
  }
}
