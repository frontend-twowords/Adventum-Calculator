import { Component, OnInit, HostListener } from '@angular/core';
import{Router} from '@angular/router';
import { DataService } from '../data.service';
import { trigger,state,style,animate,transition } from '@angular/animations';
import {ValidationService} from '../validation.service';
import { environment } from '../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-capital-growth-que',
  templateUrl: './capital-growth-que.component.html',
  styleUrls: ['./capital-growth-que.component.css'],
  animations: [
    trigger('pv',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('cg',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('FXG',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('IT',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1500ms ease-out')])
    ]),
    ]
})
export class CapitalGrowthQueComponent implements OnInit {
  PropertyLondon:any;
  MapLoad = true;
  lat: number;
  long: number;
  PropertyValue = '';
  capitalgrowth = '';
  investedTenure = '';
  FXGrowthPA='';
  homecurrency='';
  calcData: any;
  homecurrencyText:string="";
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
    return found ? found.name : 'Select currency';
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
    if (!target.closest('.cg-custom-select')) {
      this.currencyDropdownOpen = false;
    }
  }

  get previewCurrentGBP(): number {
    const v = parseFloat(this.PropertyValue.replace(/,/g,''));
    return isNaN(v) ? 0 : v;
  }
  get previewCurrentHome(): number {
    const rate = parseFloat(this.homecurrency);
    return isNaN(rate) ? 0 : parseFloat((this.previewCurrentGBP * rate).toFixed(0));
  }
  get previewExitGBP(): number {
    const pv = this.previewCurrentGBP;
    const cg = parseFloat(this.capitalgrowth.replace('%',''));
    const yrs = parseInt(this.investedTenure);
    if (!pv || isNaN(cg) || isNaN(yrs)) return 0;
    let val = pv;
    for (let i = 0; i < yrs; i++) val += val * cg / 100;
    return parseFloat(val.toFixed(0));
  }
  get previewExitHome(): number {
    const pv = this.previewCurrentGBP;
    const cg = parseFloat(this.capitalgrowth.replace('%',''));
    const fx = parseFloat(this.FXGrowthPA.replace('%',''));
    const yrs = parseInt(this.investedTenure);
    const rate = parseFloat(this.homecurrency);
    if (!pv || isNaN(cg) || isNaN(fx) || isNaN(yrs) || isNaN(rate)) return 0;
    let val = pv; let fxRate = rate;
    for (let i = 0; i < yrs; i++) { val += val * cg / 100; fxRate += fxRate * fx / 100; }
    return parseFloat((val * fxRate).toFixed(0));
  }
  get previewTotalReturn(): number {
    const start = this.previewCurrentHome;
    const end = this.previewExitHome;
    if (!start || !end) return 0;
    return parseFloat((((end - start) / start) * 100).toFixed(1));
  }
  get previewCurrentHomeCr(): string {
    const v = this.previewCurrentHome;
    if (!v) return '—';
    if (this.homecurrencyText === 'INR') return '₹' + (v / 1e7).toFixed(2) + ' Cr';
    return v.toLocaleString();
  }
  get previewExitHomeCr(): string {
    const v = this.previewExitHome;
    if (!v) return '—';
    if (this.homecurrencyText === 'INR') return '₹' + (v / 1e7).toFixed(2) + ' Cr';
    return v.toLocaleString();
  } 
  constructor(public validation: ValidationService,
              private dataService: DataService,
              private router: Router) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
  }

  ngOnInit(): void {

    this.PropertyLondon=localStorage.getItem("PropertyLondon");
    console.log(this.PropertyLondon);
    
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long = this.calcData.long;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)){
      this.PropertyValue=this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.capitalgrowth)){
      this.capitalgrowth=this.calcData.capitalgrowth+"%";
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
       this.investedTenure =this.calcData.investedTenure;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)){
      this.FXGrowthPA=this.calcData.fxgrowth+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)){
      this.homecurrencyText=this.calcData.homecurrencyText;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
      this.homecurrency=this.calcData.homecurrency;
    }
//  $(document).ready(function(){
//   $(".percent").on('input', function() {
//       $(this).val(function(i, v) {
//         return v.replace('%','') + '%';  });
//         });
//     });
}
async homecurrencyChange(){
  if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
    this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
    var FinalRate=0;
    let Currpromise = new Promise((res, rej) => {
      this.dataService.GetRequest1('https://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
        try {
          let res1 = data;
          if(res1.success==true){
            var GBP_Rate = res1.rates['GBP']
            var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
            if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
              FinalRate= parseFloat((HC_Rate/GBP_Rate).toFixed(2));
              this.homecurrency=FinalRate.toString();
              this.calcData.homecurrency=this.homecurrency;
            }
          }
          res(res1);
        }
        catch (ex) {
          rej(false);
        }
      })
    });
    await Currpromise;
  }
 }
  async next(){
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)){
      this.calcData.PropertyValue = this.PropertyValue.replace(/,/g,'');
    }else{
      const element = document.getElementById('propertyValue');
      element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.capitalgrowth)){
      this.calcData.capitalgrowth = this.capitalgrowth.replace("%",'');
    }else{
      const element = document.getElementById('capitalgrowth');
      element.classList.add('error-input');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.investedTenure)){
      this.calcData.investedTenure = this.investedTenure;
    }else{
      alert('Please select an investment period.');
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.FXGrowthPA)){
      this.calcData.fxgrowth = this.FXGrowthPA.replace("%",'');
    }else{
      const element = document.getElementById('FXGrowthPA');
      element.classList.add('error-input');
      flag = false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
      this.calcData.homecurrencyText = this.homecurrencyText.toUpperCase();
    }else{
      alert('Please select a home currency.');
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrency)){
      this.calcData.homecurrency=this.homecurrency;
    }else{
      alert('Exchange rate could not be loaded. Please try selecting your currency again.');
      flag=false;
    }
    if (flag){
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/capital-growth-calculator/result']);
    }
  }
}
