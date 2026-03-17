import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-predictive-foreign-que',
  templateUrl: './predictive-foreign-que.component.html',
  styleUrls: ['./predictive-foreign-que.component.css']
})
export class PredictiveForeignQueComponent implements OnInit {
  calcData: any;
  InvestmentGBP = '';
  FXGrowth: any = '';
  homecurrency: any = '';
  investedTenure = 10;
  selectedCurrencyCode = '';
  selectedCurrencyName = '';
  selectedCurrencySymbol = '';
  currencyDropdownOpen = false;
  currencySearch = '';

  periodOptions = [5, 10, 15, 20, 25];

  currencies = [
    { code: 'INR', name: 'Indian Rupee',           sym: '₹',    rate: 123.72 },
    { code: 'GBP', name: 'Great Britain Pound',    sym: '£',    rate: 1      },
    { code: 'AED', name: 'UAE Dirham',              sym: 'AED ', rate: 4.67   },
    { code: 'USD', name: 'US Dollar',               sym: '$',    rate: 1.27   },
    { code: 'SGD', name: 'Singapore Dollar',        sym: 'S$',   rate: 1.7    },
    { code: 'HKD', name: 'Hong Kong Dollar',        sym: 'HK$',  rate: 9.9    },
    { code: 'EUR', name: 'Euro',                    sym: '€',    rate: 1.17   },
    { code: 'NGN', name: 'Nigerian Naira',          sym: '₦',    rate: 1850   },
    { code: 'BDT', name: 'Bangladeshi Taka',        sym: '৳',    rate: 139    },
    { code: 'PKR', name: 'Pakistani Rupee',         sym: '₨',    rate: 353    },
  ];

  constructor(
    public validation: ValidationService,
    private dataService: DataService,
    private router: Router
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
  }

  ngOnInit(): void {
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.InvestmentGBP)) {
      this.InvestmentGBP = this.validation.amountWithComma(this.calcData.InvestmentGBP);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)) {
      this.selectedCurrencyCode = this.calcData.homecurrencyText;
      const found = this.currencies.find(c => c.code === this.selectedCurrencyCode);
      if (found) { this.selectedCurrencyName = found.name; this.selectedCurrencySymbol = found.sym; }
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)) {
      this.homecurrency = this.calcData.homecurrency;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)) {
      this.FXGrowth = this.calcData.fxgrowth;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)) {
      this.investedTenure = +this.calcData.investedTenure;
    }
  }

  get locationName(): string {
    return this.calcData?.City || 'United Kingdom';
  }

  get currencySymbol(): string {
    return this.selectedCurrencySymbol || '';
  }

  get livePrice(): number {
    return parseFloat((this.InvestmentGBP || '').replace(/,/g, '')) || 0;
  }

  get liveRate(): number {
    return parseFloat(this.homecurrency) || 0;
  }

  get liveAppreciation(): string {
    return (this.FXGrowth + '').replace('%', '') || '0';
  }

  get livePeriod(): number {
    return this.investedTenure || 10;
  }

  get liveExitRate(): number {
    const rate = this.liveRate;
    const aproc = parseFloat(this.liveAppreciation) || 0;
    const yrs = this.livePeriod;
    return rate * Math.pow(1 + aproc / 100, yrs);
  }

  get liveInitHome(): number {
    return this.livePrice * this.liveRate;
  }

  get liveExitHome(): number {
    return this.livePrice * this.liveExitRate;
  }

  get liveFxBoost(): number {
    return this.liveExitHome - this.liveInitHome;
  }

  get liveFxGrowthPct(): number {
    const rate = this.liveRate;
    if (rate === 0) { return 0; }
    return (this.liveExitRate / rate - 1) * 100;
  }

  formatHomeCurrency(val: number): string {
    if (!val) { return '0'; }
    const code = this.selectedCurrencyCode;
    const sym = this.selectedCurrencySymbol || '';
    if (code === 'INR') {
      if (val >= 1e7) { return sym + (val / 1e7).toFixed(2) + ' Cr'; }
      if (val >= 1e5) { return sym + (val / 1e5).toFixed(2) + ' L'; }
    }
    return sym + val.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  }

  getCurrencyLabel(code: string): string {
    const found = this.currencies.find(c => c.code === code);
    return found ? `${found.name} (${found.code})` : code;
  }

  getFilteredCurrencies() {
    const q = (this.currencySearch || '').toLowerCase();
    if (!q) { return this.currencies; }
    return this.currencies.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }

  onCurrencySelect2(code: string): void {
    const found = this.currencies.find(c => c.code === code);
    if (found) {
      this.selectedCurrencyCode = found.code;
      this.selectedCurrencyName = found.name;
      this.selectedCurrencySymbol = found.sym;
      this.homecurrency = found.rate;
      this.currencyDropdownOpen = false;
      this.currencySearch = '';
      this.fetchLiveRate(found.code);
      this.calcLive();
    }
  }

  onCurrencySelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.onCurrencySelect2(val);
  }

  private fetchLiveRate(code: string): void {
    this.dataService.GetRequest1(
      'https://data.fixer.io/api/latest?access_key=' + environment.CurrencyAPIKey + '&format=1'
    ).subscribe((data: any) => {
      try {
        if (data?.success && data.rates) {
          const gbpRate = data.rates['GBP'];
          const hcRate = data.rates[code];
          if (gbpRate && hcRate) {
            this.homecurrency = parseFloat((hcRate / gbpRate).toFixed(4));
            this.calcLive();
          }
        }
      } catch (e) {}
    });
  }

  calcLive(): void {
    // Triggers Angular change detection through getter re-evaluation
  }

  next(): void {
    let flag = true;

    if (!this.dataService.EmptyNullOrUndefined(this.InvestmentGBP)) {
      this.calcData.InvestmentGBP = (this.InvestmentGBP + '').replace(/,/g, '');
    } else {
      const el = document.getElementById('InvestmentGBP');
      if (el) { el.classList.add('error-input'); }
      flag = false;
    }

    if (this.selectedCurrencyCode) {
      this.calcData.homecurrencyText = this.selectedCurrencyCode;
    } else {
      flag = false;
    }

    if (!this.dataService.EmptyNullOrUndefined(this.homecurrency)) {
      this.calcData.homecurrency = this.homecurrency;
    } else {
      flag = false;
    }

    if (!this.dataService.EmptyNullOrUndefined(this.FXGrowth)) {
      this.calcData.fxgrowth = (this.FXGrowth + '').replace('%', '');
    } else {
      const el = document.getElementById('FXGrowth');
      if (el) { el.classList.add('error-input'); }
      flag = false;
    }

    this.calcData.investedTenure = this.investedTenure;

    if (flag) {
      this.calcData.reportSavedOnServer = false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/predictive-foreign-calculator/result']);
    }
  }
}
