import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service'
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
  animations: [
    trigger('shownextbtn', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0'
        })
      ),
      transition('* => visible', [animate('3s ease-out')])
    ])]
})
export class Step1Component implements OnInit {
  PropertyValue: string = "";
  Pincode: string = "";
  City: string = "";
  calcData: any;
  MapLoad: boolean = true;
  lat: number = 51.6112486;
  long: number = -0.2806403;
  i: number = 0;
  userName = 'User';
  CalculatorText = '';
  HeaderText = '';
  HeaderContent = '';
  logo = '';
  todayDate: Date = new Date();
  skipbtnvisibility=true;
  foreignbuyer: string = '0';

  cityData: any = {
    'London':     { desc: 'Capital city, strong long-term appreciation',   yield: '3.8%', growth: '+22%', price: '£580k' },
    'Liverpool':  { desc: 'Highest rental yields in the UK',                yield: '7.2%', growth: '+18%', price: '£185k' },
    'Manchester': { desc: 'Prime investment zone with highest rental demand', yield: '6.8%', growth: '+28%', price: '£425k' },
    'Birmingham': { desc: 'UK\'s second city with strong regeneration',      yield: '5.8%', growth: '+20%', price: '£250k' },
    'Others':     { desc: 'Explore other UK investment opportunities',        yield: '5.5%', growth: '+15%', price: '£300k' },
  };

  selectCity(city: string, pincode: string, latVal: number, longVal: number) {
    this.City = city;
    this.Pincode = pincode;
    this.lat = latVal;
    this.long = longVal;
    this.calcData = this.calcData || {};
    this.calcData.Pincode = pincode;
    this.calcData.City = city;
    this.calcData.lat = latVal;
    this.calcData.long = longVal;
    this.calcData.Country = city === 'London' ? 'england' : city.toLowerCase();
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem('calcData', JSON.stringify(this.calcData));
    if (city === 'London') {
      localStorage.setItem('PropertyLondon', '1');
    } else {
      localStorage.setItem('PropertyLondon', '0');
    }
  }

  getCityDesc(): string {
    return this.cityData[this.City]?.desc || '';
  }

  getCityStat(type: string): string {
    return this.cityData[this.City]?.[type] || '';
  }

  constructor(
    public router: Router,
    private dataService: DataService,
    public validation: ValidationService) {
    this.calcData = JSON.parse(localStorage.getItem("calcData"));
    this.CalculatorText = localStorage.getItem("CalculatorText");
    if (!this.dataService.EmptyNullOrUndefined(this.calcData)) {
      if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue))
        this.PropertyValue = this.calcData.PropertyValue;
    }
    const currenturl = this.router.url;
    switch (currenturl) {
      case '/step1':
        localStorage.setItem('CalculatorType', '1');
        break;
      case '/capital-growth-calculator/step1':
        localStorage.setItem('CalculatorType', '2');
        break;
      case '/estimated-weekly-rent-calculator/step1':
        localStorage.setItem('CalculatorType', '3');
        break;
      case '/predictive-foreign-exchange/step1':
        localStorage.setItem('CalculatorType', '4');
        break;
      case '/stamp-duty-calculator/step1':
        localStorage.setItem('CalculatorType', '5');
        break;
      case '/cashflow/step1':
        localStorage.setItem('CalculatorType', '6');
        break;
        case '/ated/step1':
          localStorage.setItem('CalculatorType', '7');
          break;
    }
  }
  ngOnInit(): void {

    this.lat = 51.6112486;
    this.long = -0.2806403;
    const TempUserName = sessionStorage.getItem('UserName');
    if (!this.dataService.EmptyNullOrUndefined(TempUserName)) {
      this.userName = TempUserName;
    }

    // if (localStorage.getItem("CalculatorText") != "1") {
    //   this.skipbtnvisibility=true;
    // }

    const CalculatorText = this.CalculatorText;
    switch (CalculatorText) {

      case '1':
        this.logo = "assets/breadcrumb.svg";
        this.HeaderText = "Investment Property Calculator";
        this.HeaderContent = "As a foreign investor, calculate 3-dimensional returns in tandem from rent, foreign exchange gains and capital growth on your property in UK. Play with your assumptions and optimise investment strategies.";
        break;
      case '2':
        this.logo = "assets/capital-breadcrumb.svg";
        this.HeaderText = "Capital Growth Calculator";
        this.HeaderContent = "A simple Capital Growth Calculator to see the future value of your property. Play with your growth assumptions and optimise strategies on your properties in the UK.";
        break;
      case '3':
        this.logo = "assets/estimated-breadcrumb.svg";
        this.HeaderText = "Estimated Weekly Rent Calculator";
        this.HeaderContent = "Use this calculator to quickly check and compare rents in UK by the week in a 52 week year. Play with your assumptions to optimise and achieve rental yield that is in line with the market.";
        break;
      case '4':
        this.logo = "assets/exchange-breadcrumb.svg";
        this.HeaderText = "Predictive Foreign Exchange Value";
        this.HeaderContent = "Play with your assumptions on the Foreign Exchange impact on your overseas investment. Calculations are supported with real-time data to support your assumptions from XE.";
        break;
      case '5':
        this.logo = "assets/stamp-breadcrumb.svg";
        this.HeaderText = "Stamp Duty Calculator";
        this.HeaderContent = "Calculate the exact cost of stamp duty on your property purchase as it varies in the UK with the price of the property and the kind of the buyer: First-time, Investor, Corporate, Foreign and more.";
        break;
        case '6':
          this.logo = "assets/cashflow-breadcrumb.svg";
          this.HeaderText = "Cashflow Calculator";
          this.HeaderContent = "Calculate the profits and losses gained by doing investment.";
          break;
        case '7':
          this.logo = "assets/annual-breadcrumb.svg";
          this.HeaderText = "ATED (Annual Tax on Enveloped Dwellings) Calculator";
          this.HeaderContent = "ATED is an annual tax payable if you own a UK residential property valued at more than £500,00. Find out the amount you'll need to pay which is worked out using a banding system based on the value of your property.";
          break;
    }

  }
  // PincodeChange():void{
  //   if(!this.dataService.EmptyNullOrUndefined(this.Pincode)){
  //     if(this.Pincode.length>1){
  //       this.MapLoad=this.Pincode;
  //     }
  //   }

  // }
  next(type) {
    let flag = true;
    if (type === "skip") {
          this.calcData = {};
          this.calcData.Pincode = "HA87DB";
          this.calcData.City = this.City || 'United Kingdom';
          this.calcData.lat = this.lat;
          this.calcData.long = this.long;
          this.calcData.Country="england";
          this.calcData.reportSavedOnServer = false;
          localStorage.setItem("calcData", JSON.stringify(this.calcData));
          flag=true;
    } else {
      // if(!this.dataService.EmptyNullOrUndefined(this.PropertyValue)){
      //   if(this.dataService.EmptyNullOrUndefined(this.calcData))
      //      this.calcData={};
      //   this.calcData.PropertyValue=this.PropertyValue;
      //   localStorage.setItem("calcData",JSON.stringify(this.calcData));
      // }else{
      //   let element=document.getElementById("propertyValue");
      //   element.classList.add("error-input");
      //   flag=false;
      // }
      if (!this.dataService.EmptyNullOrUndefined(this.Pincode)) {
        if (this.calcData) {
          this.calcData.ForeignBuyer = this.foreignbuyer;
          localStorage.setItem('calcData', JSON.stringify(this.calcData));
        }
      } else {
        let element = document.getElementById("pincode");
        element.classList.add("error-input");
        flag = false;
      }
    }

    if (flag) {
      const nextStep = localStorage.getItem('CalculatorType');
      switch (nextStep) {
        case '1':
          this.router.navigate(['/step2']);
          break;
        case '2':
          this.router.navigate(['/capital-growth-calculator/question']);
          break;
        case '3':
          this.router.navigate(['/estimated-weekly-rent-calculator/question']);
          break;
        case '4':
          this.router.navigate(['/Predictive-Foreign-calculator/question']);
          break;
        case '5':
          this.router.navigate(['/stamp-duty-calculator/question']);
          break;
        case '6':
          this.router.navigate(['/cashflow/step2']);
          break;
          case '7':
            this.router.navigate(['/ated/step2']);
            break;
      }
    }
  }

  geoLocation() {

    if (this.Pincode.length >= 3) {
      var geocoder = new google.maps.Geocoder();
      var address = this.Pincode;
      geocoder.geocode({ 'address': 'zipcode ' + address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {

          var length = results[0].address_components.length;

          this.lat = results[0].geometry.location.lat();
          this.long = results[0].geometry.location.lng();

          this.calcData = {};
          this.calcData.Pincode = this.Pincode;
          this.calcData.lat = this.lat;
          this.calcData.long = this.long;

          if (length > 0) {
            for (let i = length - 1; i > 0; i--) {
              const types = results[0].address_components[i].types;
              if (types.indexOf('postal_town') !== -1 || types.indexOf('locality') !== -1) {
                this.City = results[0].address_components[i].long_name;
                this.calcData.City = this.City;
              }
              if (types[0] == 'administrative_area_level_1') {
                this.calcData.Country = results[0].address_components[i].long_name.toLowerCase();
              }
            }
          }
          if (!this.calcData.City) {
            this.calcData.City = this.Pincode;
            this.City = this.Pincode;
          }
          this.calcData.reportSavedOnServer = false;
          localStorage.setItem("calcData", JSON.stringify(this.calcData));
        } else {
          // alert("Invalid Pincode.")
        }
      });
    }
  }

}
