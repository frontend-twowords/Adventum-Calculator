import { Component, OnInit, HostListener } from '@angular/core';
import{Router} from '@angular/router';
import { DataService } from '../data.service';
import {ValidationService} from '../validation.service';
import { environment } from '../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {
  homecurrencyText:string="";
  homecurrency:string="";
  investedTenure:string="5";
  rentalYeild:string="";
  rentalGrowthEscalation:string="";
  capitalgrowth:string="";
  fxgrowth:string="";
  calcData:any;
  MapLoad=true;
  lat :number=0;
  long :number=0;
  foreignbuyer='';
  PropertyLondon:any;
  City: string = '';

  // Custom dropdown state
  currencyDropdownOpen = false;
  currencySearch = '';

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
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder' },
    { code: 'AOA', name: 'Angolan Kwanza' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'AWG', name: 'Aruban Florin' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark' },
    { code: 'BBD', name: 'Barbadian Dollar' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'BIF', name: 'Burundian Franc' },
    { code: 'BMD', name: 'Bermudan Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'BSD', name: 'Bahamian Dollar' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', name: 'Botswanan Pula' },
    { code: 'BYN', name: 'Belarusian Ruble' },
    { code: 'BZD', name: 'Belize Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'IQD', name: 'Iraqi Dinar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'QAR', name: 'Qatari Rial' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UZS', name: 'Uzbekistani Som' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'XAF', name: 'Central African CFA Franc' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
  ];

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

  selectCurrency(code: string) {
    this.homecurrencyText = code;
    this.currencyDropdownOpen = false;
    this.currencySearch = '';
    this.homecurrencyChange();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const wrap = document.getElementById('currencySelectWrap');
    if (wrap && !wrap.contains(event.target as Node)) {
      this.currencyDropdownOpen = false;
    }
  }
  constructor(
    
    private router:Router,
    private dataService: DataService,
    public validation:ValidationService)
  { 
    this.calcData=JSON.parse(localStorage.getItem("calcData") || '{}');
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.optmortgage)){
      if(this.calcData.optmortgage=="1"){
        if(!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
          this.investedTenure=this.calcData.mortgageTenure;
        }else{
          if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageTenure))
            this.investedTenure=this.calcData.mortgageTenure;
        }
      }else if(!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
        this.investedTenure=this.calcData.investedTenure;
      }
    }else if(!this.dataService.EmptyNullOrUndefined(this.calcData.investedTenure)){
      this.investedTenure=this.calcData.investedTenure;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
      this.homecurrency=this.calcData.homecurrency;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)){
      this.homecurrencyText=this.calcData.homecurrencyText;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.rentalYeild)){
      this.rentalYeild=this.calcData.rentalYeild+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.rentalGrowthEscalation)){
      this.rentalGrowthEscalation=this.calcData.rentalGrowthEscalation+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.capitalgrowth)){
      this.capitalgrowth=this.calcData.capitalgrowth+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.fxgrowth)){
      this.fxgrowth=this.calcData.fxgrowth+"%";
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat=this.calcData.lat; 
    } 
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long=this.calcData.long; 
    } 
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.ForeignBuyer)){
      this.foreignbuyer=this.calcData.ForeignBuyer; 
    }
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.City)){
      this.City=this.calcData.City; 
    }
    
  }

  ngOnInit(): void {

    this.PropertyLondon=localStorage.getItem("PropertyLondon");
    console.log(this.PropertyLondon);

    // $(document).ready(function(){
    //   $(".percent").on('input', function() {
    //     $(this).val(function(i, v) {
    //      return v.replace('%','') + '%';  });
    //   });
    // });
   }
   // Fallback exchange rates (GBP base) for when API is unavailable
   fallbackRates: any = {
    'INR': 107, 'AED': 4.67, 'USD': 1.27, 'EUR': 1.17, 'HKD': 9.88,
    'NGN': 2100, 'BDT': 140, 'PKR': 355, 'CAD': 1.72, 'AUD': 1.94,
    'SGD': 1.70, 'MYR': 5.94, 'JPY': 189, 'CNY': 9.18, 'SAR': 4.76,
    'QAR': 4.62, 'KWD': 0.39, 'BHD': 0.48, 'OMR': 0.49, 'ZAR': 23.5,
    'KES': 164, 'GHS': 19.2, 'EGP': 62, 'MAD': 12.7, 'DZD': 171,
    'TRY': 43, 'RUB': 116, 'UAH': 52, 'PLN': 5.08, 'CZK': 29.2,
    'HUF': 454, 'RON': 5.83, 'BGN': 2.29, 'DKK': 8.73, 'SEK': 13.7,
    'NOK': 13.5, 'CHF': 1.11, 'ILS': 4.66, 'BRL': 7.0, 'MXN': 21.9,
    'COP': 4950, 'CLP': 1160, 'ARS': 1240, 'PHP': 72, 'IDR': 20200,
    'THB': 44.6, 'VND': 31800, 'KRW': 1690, 'TWD': 40.8, 'NZD': 2.10,
    'LKR': 380, 'NPR': 170, 'KZT': 570, 'UZS': 16200, 'IQD': 1660,
    'BYN': 4.1, 'BWP': 17.1, 'ZMW': 34, 'XAF': 768, 'AOA': 1050,
    'BIF': 3580, 'BMD': 1.27, 'BSD': 1.27, 'BBD': 2.54, 'BND': 1.70,
    'BTN': 107, 'BOB': 8.75, 'BZD': 2.54, 'AWG': 2.28, 'ANG': 2.28,
    'BAM': 2.29, 'AFN': 89, 'ALL': 138, 'AMD': 494, 'AZN': 2.15,
    'DOP': 74, 'FJD': 2.87, 'GYD': 266, 'HTG': 166, 'JMD': 196,
    'KGS': 110, 'LAK': 27200, 'LRD': 236, 'MMK': 2660, 'MNT': 4340,
    'MOP': 10.2, 'MRO': 453, 'MUR': 57.4, 'MVR': 19.6, 'MWK': 2200,
    'MZN': 81, 'NAD': 23.5, 'PGK': 4.73, 'PYG': 9250, 'RWF': 1690,
    'SBD': 10.7, 'SCR': 17.6, 'SDG': 736, 'SLL': 25100, 'SOS': 726,
    'SRD': 46.6, 'STD': 28800, 'SVC': 11.1, 'SYP': 16500, 'SZL': 23.5,
    'TJS': 13.8, 'TMT': 4.44, 'TND': 3.97, 'TOP': 2.99, 'TTD': 8.64,
    'TZS': 3220, 'UGX': 4740, 'UYU': 50.8, 'VUV': 150,
    'WST': 3.46, 'XCD': 3.43, 'XOF': 768, 'XPF': 140, 'YER': 319,
    'GBP': 1
   };

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
              if(!this.dataService.EmptyNullOrUndefined(HC_Rate) && !this.dataService.EmptyNullOrUndefined(GBP_Rate) && GBP_Rate > 0){
                FinalRate= parseFloat((HC_Rate/GBP_Rate).toFixed(2));
                this.homecurrency=FinalRate.toString();
                this.calcData.homecurrency=this.homecurrency;
              } else {
                // Use fallback rate if API doesn't have this currency
                const fallback = this.fallbackRates[this.homecurrencyText.toUpperCase()];
                if(fallback){
                  this.homecurrency = fallback.toString();
                  this.calcData.homecurrency = this.homecurrency;
                }
              }
            } else {
              // API failed — use fallback rates
              const fallback = this.fallbackRates[this.homecurrencyText.toUpperCase()];
              if(fallback){
                this.homecurrency = fallback.toString();
                this.calcData.homecurrency = this.homecurrency;
              }
            }
            res(res1);
          }
          catch (ex) {
            // On exception, use fallback rates
            const fallback = this.fallbackRates[this.homecurrencyText.toUpperCase()];
            if(fallback){
              this.homecurrency = fallback.toString();
              this.calcData.homecurrency = this.homecurrency;
            }
            rej(false);
          }
        }, _err => {
          // HTTP error — use fallback rates
          const fallback = this.fallbackRates[this.homecurrencyText.toUpperCase()];
          if(fallback){
            this.homecurrency = fallback.toString();
            this.calcData.homecurrency = this.homecurrency;
          }
          res(null);
        })
      });
      await Currpromise;
    }
   }
 async next(){
    let flag=true;
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrencyText)){
      // this.calcData.homecurrencyText=this.homecurrencyText.toUpperCase();
      // var FinalRate=0;
      // let Currpromise = new Promise((res, rej) => {
      //   this.dataService.GetRequest1('https://data.fixer.io/api/latest?access_key='+environment.CurrencyAPIKey+'&format=1').subscribe(data => {
      //     try {
      //       let res1 = data;
      //       if(res1.success==true){
      //         var GBP_Rate = res1.rates['GBP']
      //         var HC_Rate = res1.rates[this.homecurrencyText.toUpperCase()]
      //         if(!this.dataService.EmptyNullOrUndefined(HC_Rate)){
      //           FinalRate= HC_Rate/GBP_Rate;
      //           this.homecurrency=FinalRate.toString(2);
      //           alert( this.homecurrency);
      //           this.calcData.homecurrency=FinalRate;
      //         }
      //       }
      //       res(res1);
      //     }
      //     catch (ex) {
      //       rej(false);
      //     }
      //   })
      // });
      // await Currpromise;
    }else{
      document.getElementById("homecurrencyText")?.classList.add("error-input");
      flag=false;
    }
    // if(this.dataService.EmptyNullOrUndefined(this.calcData.homecurrency)){
    //   document.getElementById("homecurrencyText")?.classList.add("error-input");
    //   flag=false;
    // }
    if(!this.dataService.EmptyNullOrUndefined(this.homecurrency)){
      this.calcData.homecurrency=this.homecurrency;
    }else{
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.investedTenure)){
      this.calcData.investedTenure=this.investedTenure;
    }else{
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.rentalYeild)){
      this.calcData.rentalYeild=this.rentalYeild.replace("%",'');
    }else{
      document.getElementById("rentalYeild")?.classList.add("error-input");
      flag=false;
    }
    // rentalGrowthEscalation defaults to capitalgrowth if not separately set
    if(!this.dataService.EmptyNullOrUndefined(this.capitalgrowth)){
      this.calcData.capitalgrowth=this.capitalgrowth.replace("%",'');
      // rentalGrowthEscalation is set independently in step4 — do not default it here
    }else{
      document.getElementById("capitalgrowth")?.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.fxgrowth)){
      this.calcData.fxgrowth=this.fxgrowth.replace("%",'');
    }else{
      document.getElementById("fxgrowth")?.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.foreignbuyer)){
      this.calcData.ForeignBuyer=this.foreignbuyer;
    }
    if(flag)
    {
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem("calcData",JSON.stringify(this.calcData));
      this.router.navigate(['/step4']);
    }
  }
}
