import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { ValidationService } from '../validation.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-estimated-rent-que',
  templateUrl: './estimated-rent-que.component.html',
  styleUrls: ['./estimated-rent-que.component.css']
})
export class EstimatedRentQueComponent implements OnInit {
  PropertyValue = '';
  rentalYeild = '';
  weeklyRent = '';
  inputMode: 'yield' | 'weekly' = 'yield';
  calcData: any;
  homecurrency = '';
  homecurrencyText: string = '';
  currencyDropdownOpen = false;
  currencySearch = '';

  currencies = [
    {code:'INR',name:'Indian Rupee (INR)'},{code:'AED',name:'UAE Dirham (AED)'},
    {code:'USD',name:'US Dollar (USD)'},{code:'SGD',name:'Singapore Dollar (SGD)'},
    {code:'HKD',name:'Hong Kong Dollar (HKD)'},{code:'EUR',name:'Euro (EUR)'},
    {code:'NGN',name:'Nigerian Naira (NGN)'},{code:'BDT',name:'Bangladeshi Taka (BDT)'},
    {code:'PKR',name:'Pakistani Rupee (PKR)'},{code:'GBP',name:'British Pound (GBP)'},
    {code:'AFN',name:'Afghan Afghani (AFN)'},{code:'ALL',name:'Albanian Lek (ALL)'},
    {code:'AMD',name:'Armenian Dram (AMD)'},{code:'ANG',name:'Netherlands Antillean Guilder (ANG)'},
    {code:'AOA',name:'Angolan Kwanza (AOA)'},{code:'ARS',name:'Argentine Peso (ARS)'},
    {code:'AUD',name:'Australian Dollar (AUD)'},{code:'AWG',name:'Aruban Florin (AWG)'},
    {code:'AZN',name:'Azerbaijani Manat (AZN)'},{code:'BAM',name:'Bosnia-Herzegovina Convertible Mark (BAM)'},
    {code:'BBD',name:'Barbadian Dollar (BBD)'},{code:'BGN',name:'Bulgarian Lev (BGN)'},
    {code:'BHD',name:'Bahraini Dinar (BHD)'},{code:'BIF',name:'Burundian Franc (BIF)'},
    {code:'BMD',name:'Bermudian Dollar (BMD)'},{code:'BND',name:'Brunei Dollar (BND)'},
    {code:'BOB',name:'Bolivian Boliviano (BOB)'},{code:'BRL',name:'Brazilian Real (BRL)'},
    {code:'BSD',name:'Bahamian Dollar (BSD)'},{code:'BTN',name:'Bhutanese Ngultrum (BTN)'},
    {code:'BWP',name:'Botswanan Pula (BWP)'},{code:'BYN',name:'Belarusian Ruble (BYN)'},
    {code:'BZD',name:'Belize Dollar (BZD)'},{code:'CAD',name:'Canadian Dollar (CAD)'},
    {code:'CHF',name:'Swiss Franc (CHF)'},{code:'CLP',name:'Chilean Peso (CLP)'},
    {code:'CNY',name:'Chinese Yuan (CNY)'},{code:'COP',name:'Colombian Peso (COP)'},
    {code:'CZK',name:'Czech Koruna (CZK)'},{code:'DKK',name:'Danish Krone (DKK)'},
    {code:'DOP',name:'Dominican Peso (DOP)'},{code:'DZD',name:'Algerian Dinar (DZD)'},
    {code:'EGP',name:'Egyptian Pound (EGP)'},{code:'ETB',name:'Ethiopian Birr (ETB)'},
    {code:'FJD',name:'Fijian Dollar (FJD)'},{code:'GEL',name:'Georgian Lari (GEL)'},
    {code:'GHS',name:'Ghanaian Cedi (GHS)'},{code:'GTQ',name:'Guatemalan Quetzal (GTQ)'},
    {code:'HNL',name:'Honduran Lempira (HNL)'},{code:'HRK',name:'Croatian Kuna (HRK)'},
    {code:'HUF',name:'Hungarian Forint (HUF)'},{code:'IDR',name:'Indonesian Rupiah (IDR)'},
    {code:'ILS',name:'Israeli New Shekel (ILS)'},{code:'IQD',name:'Iraqi Dinar (IQD)'},
    {code:'ISK',name:'Icelandic Króna (ISK)'},{code:'JMD',name:'Jamaican Dollar (JMD)'},
    {code:'JOD',name:'Jordanian Dinar (JOD)'},{code:'JPY',name:'Japanese Yen (JPY)'},
    {code:'KES',name:'Kenyan Shilling (KES)'},{code:'KHR',name:'Cambodian Riel (KHR)'},
    {code:'KRW',name:'South Korean Won (KRW)'},{code:'KWD',name:'Kuwaiti Dinar (KWD)'},
    {code:'KZT',name:'Kazakhstani Tenge (KZT)'},{code:'LBP',name:'Lebanese Pound (LBP)'},
    {code:'LKR',name:'Sri Lankan Rupee (LKR)'},{code:'LYD',name:'Libyan Dinar (LYD)'},
    {code:'MAD',name:'Moroccan Dirham (MAD)'},{code:'MDL',name:'Moldovan Leu (MDL)'},
    {code:'MKD',name:'Macedonian Denar (MKD)'},{code:'MXN',name:'Mexican Peso (MXN)'},
    {code:'MYR',name:'Malaysian Ringgit (MYR)'},{code:'MZN',name:'Mozambican Metical (MZN)'},
    {code:'NAD',name:'Namibian Dollar (NAD)'},{code:'NIO',name:'Nicaraguan Córdoba (NIO)'},
    {code:'NOK',name:'Norwegian Krone (NOK)'},{code:'NPR',name:'Nepalese Rupee (NPR)'},
    {code:'NZD',name:'New Zealand Dollar (NZD)'},{code:'OMR',name:'Omani Rial (OMR)'},
    {code:'PEN',name:'Peruvian Sol (PEN)'},{code:'PHP',name:'Philippine Peso (PHP)'},
    {code:'PLN',name:'Polish Złoty (PLN)'},{code:'QAR',name:'Qatari Riyal (QAR)'},
    {code:'RON',name:'Romanian Leu (RON)'},{code:'RSD',name:'Serbian Dinar (RSD)'},
    {code:'RUB',name:'Russian Ruble (RUB)'},{code:'SAR',name:'Saudi Riyal (SAR)'},
    {code:'SEK',name:'Swedish Krona (SEK)'},{code:'THB',name:'Thai Baht (THB)'},
    {code:'TRY',name:'Turkish Lira (TRY)'},{code:'TWD',name:'New Taiwan Dollar (TWD)'},
    {code:'TZS',name:'Tanzanian Shilling (TZS)'},{code:'UAH',name:'Ukrainian Hryvnia (UAH)'},
    {code:'UGX',name:'Ugandan Shilling (UGX)'},{code:'UYU',name:'Uruguayan Peso (UYU)'},
    {code:'UZS',name:'Uzbekistani Som (UZS)'},{code:'VND',name:'Vietnamese Dong (VND)'},
    {code:'XAF',name:'Central African CFA Franc (XAF)'},{code:'XOF',name:'West African CFA Franc (XOF)'},
    {code:'YER',name:'Yemeni Rial (YER)'},{code:'ZAR',name:'South African Rand (ZAR)'},
    {code:'ZMW',name:'Zambian Kwacha (ZMW)'}
  ];

  get filteredCurrencies() {
    const q = this.currencySearch.toLowerCase();
    return q ? this.currencies.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) : this.currencies;
  }

  get selectedCurrencyName(): string {
    const found = this.currencies.find(c => c.code === this.homecurrencyText);
    if (!found) return 'Select currency';
    // Strip " (CODE)" suffix so trigger shows "Indian Rupee (INR)" not "Indian Rupee (INR) (INR)"
    return found.name.replace(/\s*\([^)]*\)\s*$/, '');
  }

  stripCode(name: string): string {
    return name.replace(/\s*\([^)]*\)\s*$/, '');
  }

  selectCurrency(code: string) {
    this.homecurrencyText = code;
    this.currencyDropdownOpen = false;
    this.currencySearch = '';
    this.homecurrencyChange();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.ewr-custom-select')) {
      this.currencyDropdownOpen = false;
    }
  }

  // Live calculation getters
  get liveWeekly(): number {
    const pv = parseFloat(this.PropertyValue.replace(/,/g, ''));
    if (this.inputMode === 'weekly') {
      const w = parseFloat(this.weeklyRent.replace(/,/g, ''));
      return isNaN(w) ? 0 : w;
    }
    const y = parseFloat(this.rentalYeild.replace('%', ''));
    if (isNaN(pv) || isNaN(y)) return 0;
    return parseFloat(((pv * y / 100) / 52).toFixed(2));
  }

  get liveMonthly(): number {
    return parseFloat((this.liveWeekly * 52 / 12).toFixed(2));
  }

  get liveAnnual(): number {
    return parseFloat((this.liveWeekly * 52).toFixed(2));
  }

  get liveGrossYield(): number {
    const pv = parseFloat(this.PropertyValue.replace(/,/g, ''));
    if (!pv) return 0;
    if (this.inputMode === 'yield') {
      return parseFloat(this.rentalYeild.replace('%', '')) || 0;
    }
    return parseFloat(((this.liveWeekly * 52 / pv) * 100).toFixed(2));
  }

  setMode(mode: 'yield' | 'weekly') {
    this.inputMode = mode;
    this.calcLive();
  }

  calcLive() {
    this.cdr.detectChanges();
  }

  constructor(public validation: ValidationService,
              private dataService: DataService,
              private router: Router,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)) {
      this.rentalYeild = this.calcData.rentalYeild + '%';
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.weeklyRent)) {
      this.weeklyRent = this.validation.amountWithComma(this.calcData.weeklyRent);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.inputMode)) {
      this.inputMode = this.calcData.inputMode;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)) {
      this.homecurrencyText = this.calcData.homecurrencyText;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)) {
      this.homecurrency = this.calcData.homecurrency;
    }
  }

  async homecurrencyChange() {
    if (!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)) {
      this.calcData.homecurrencyText = this.homecurrencyText.toUpperCase();
      var FinalRate = 0;
      let Currpromise = new Promise((res, rej) => {
        this.dataService.GetRequest1('https://data.fixer.io/api/latest?access_key=' + environment.CurrencyAPIKey + '&format=1').subscribe(data => {
          try {
            let res1 = data;
            if (res1.success == true) {
              var GBP_Rate = res1.rates['GBP'];
              var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()];
              if (!this.dataService.EmptyNullOrUndefined(HC_Rate)) {
                FinalRate = parseFloat((HC_Rate / GBP_Rate).toFixed(2));
                this.homecurrency = FinalRate.toString();
                this.calcData.homecurrency = this.homecurrency;
              }
            }
            res(res1);
          } catch (ex) {
            rej(false);
          }
        });
      });
      await Currpromise;
    }
  }

  async next() {
    let flag = true;

    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)) {
      this.calcData.PropertyValue = this.PropertyValue.replace(/,/g, '');
    } else {
      const element = document.getElementById('propertyValue');
      element.classList.add('error-input');
      flag = false;
    }

    this.calcData.inputMode = this.inputMode;

    if (this.inputMode === 'yield') {
      if (!this.dataService.EmptyNullOrUndefined(this.rentalYeild)) {
        this.calcData.rentalYeild = this.rentalYeild.replace('%', '');
      } else {
        const element = document.getElementById('rentalYeild');
        element.classList.add('error-input');
        flag = false;
      }
    } else {
      if (!this.dataService.EmptyNullOrUndefined(this.weeklyRent)) {
        this.calcData.weeklyRent = this.weeklyRent.replace(/,/g, '');
        // derive rentalYeild from weeklyRent for result page compatibility
        const pv = parseFloat(this.calcData.PropertyValue);
        const wr = parseFloat(this.calcData.weeklyRent);
        if (pv && wr) {
          this.calcData.rentalYeild = ((wr * 52 / pv) * 100).toFixed(4);
        }
      } else {
        const element = document.getElementById('weeklyRent');
        element.classList.add('error-input');
        flag = false;
      }
    }

    if (!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)) {
      this.calcData.homecurrencyText = this.homecurrencyText.toUpperCase();
    } else {
      alert('Please select a home currency.');
      flag = false;
    }

    if (!this.dataService.EmptyNullOrUndefined(this.homecurrency)) {
      this.calcData.homecurrency = this.homecurrency;
    } else {
      alert('Exchange rate could not be loaded. Please try selecting your currency again.');
      flag = false;
    }

    if (flag) {
      this.calcData.reportSavedOnServer = false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/estimated-weekly-rent-calculator/result']);
    }
  }
}
