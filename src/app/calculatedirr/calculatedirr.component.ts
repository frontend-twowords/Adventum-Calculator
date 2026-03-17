import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Finance } from 'financejs';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service'
import * as Chart from 'chart.js';
const finance = new Finance();
declare var $: any;
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-calculatedirr',
  templateUrl: './calculatedirr.component.html',
  styleUrls: ['./calculatedirr.component.css']
})
export class CalculatedirrComponent implements OnInit, AfterViewInit {
  @ViewChild('contentToConvert') content: ElementRef;
  Email:any;
  calcData: any;
  investedTenure: number;
  TenureWisePropertyData: any = [];
  allCahsflow: any = [];
  allCashFlowInHomeCurrency: any = [];
  IrrInGBP: number;
  IrrInHomeCurrency: number;
  homecurrency: number;
  Initialhomecurrency: number;
  yearlabel: any = [];
  yearlyGBPIRR: any = [];
  yearlyHomeCurrencyIRR: any = [];
  yearlyGBPInHomeCurrency: any = [];
  yearlyPropertyValueInGBP: any = [];
  yearlyPropertyValueInHomeCurrency: any = [];
  MapLoad = true;
  lat: number = 0;
  long: number = 0;
  RentalIncome = 0;
  TotalReturnOfInvestment = 0;
  EquityCapital = 0;
  wealthMultiple = 0;
  returnOnEquity = 0;
  benchMax = 20;
  capitalAppreciation = 0;
  graphInitialInvestmentInHomeCurrency = 0;
  homecurrencyText: string;
  loadingPrintbtn = false;
  loadingDownloadbtn = false;
  loadingSharebtn = false;
  selectedCountry: string = '';
  countryList: string[] = ['India', 'USA', 'Hong Kong', 'UAE', 'Europe', 'Nigeria', 'Bangladesh', 'Pakistan'];
  irrChart: any = null;

  // Comprehensive currency symbol map
  currencySymbolMap: any = {
    'AFN': '؋', 'ALL': 'L', 'AMD': '֏', 'ANG': 'ƒ', 'AOA': 'Kz', 'ARS': '$',
    'AUD': 'A$', 'AWG': 'ƒ', 'AZN': '₼', 'BAM': 'KM', 'BBD': 'Bds$', 'BDT': '৳',
    'BGN': 'лв', 'BHD': 'BD', 'BIF': 'Fr', 'BMD': '$', 'BND': '$', 'BOB': 'Bs.',
    'BRL': 'R$', 'BSD': '$', 'BTN': 'Nu', 'BWP': 'P', 'BYN': 'Br', 'BZD': 'BZ$',
    'CAD': 'C$', 'CHF': 'CHF', 'CLP': '$', 'CNY': '¥', 'COP': '$', 'CZK': 'Kč',
    'DKK': 'kr', 'DOP': 'RD$', 'DZD': 'دج', 'EGP': '£', 'EUR': '€', 'GBP': '£',
    'GHS': 'GH₵', 'HKD': 'HK$', 'HUF': 'Ft', 'IDR': 'Rp', 'ILS': '₪', 'INR': '₹',
    'IQD': 'ع.د', 'JPY': '¥', 'KES': 'KSh', 'KRW': '₩', 'KWD': 'KD', 'KZT': '₸',
    'LKR': 'Rs', 'MAD': 'MAD', 'MXN': '$', 'MYR': 'RM', 'NGN': '₦', 'NOK': 'kr',
    'NPR': 'Rs', 'NZD': 'NZ$', 'OMR': 'ر.ع.', 'PHP': '₱', 'PKR': '₨', 'PLN': 'zł',
    'QAR': 'ر.ق', 'RON': 'lei', 'RUB': '₽', 'SAR': '﷼', 'SEK': 'kr', 'SGD': 'S$',
    'THB': '฿', 'TRY': '₺', 'TWD': 'NT$', 'UAH': '₴', 'USD': '$', 'UZS': 'сўм',
    'VND': '₫', 'XAF': 'FCFA', 'ZAR': 'R', 'ZMW': 'ZK',
    'AED': 'AED'
  };

  getCurrencySymbol(code: string): string {
    if (!code) return '';
    return this.currencySymbolMap[code.toUpperCase()] || code;
  }

  formatCurrency(value: number, currencyCode: string): string {
    if (value === null || value === undefined || isNaN(value)) return '0';
    const sym = this.getCurrencySymbol(currencyCode);
    const abs = Math.abs(value);
    let formatted: string;
    if (currencyCode === 'INR') {
      if (abs >= 1e7) {
        formatted = (abs / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
      } else if (abs >= 1e5) {
        formatted = (abs / 1e5).toFixed(2).replace(/\.?0+$/, '') + ' L';
      } else {
        formatted = Math.round(abs).toLocaleString('en-IN');
      }
    } else if (abs >= 1e9) {
      formatted = (abs / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
    } else if (abs >= 1e6) {
      formatted = (abs / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    } else {
      formatted = Math.round(abs).toLocaleString('en-US');
    }
    return (value < 0 ? '-' : '') + sym + formatted;
  }

  // Approximate GBP → currency rates and typical annual FX growth vs GBP
  countryFxMap: any = {
    'India':      { rate: 107,  fxGrowth: 2.5,  currency: 'INR' },
    'USA':        { rate: 1.27, fxGrowth: 0.5,  currency: 'USD' },
    'Hong Kong':  { rate: 9.88, fxGrowth: 0.3,  currency: 'HKD' },
    'UAE':        { rate: 4.67, fxGrowth: 0.4,  currency: 'AED' },
    'Europe':     { rate: 1.17, fxGrowth: 0.8,  currency: 'EUR' },
    'Nigeria':    { rate: 2100, fxGrowth: 8.0,  currency: 'NGN' },
    'Bangladesh': { rate: 140,  fxGrowth: 3.5,  currency: 'BDT' },
    'Pakistan':   { rate: 355,  fxGrowth: 7.0,  currency: 'PKR' }
  };
  //lineChartData: ChartDataSets[];
  constructor(private router: Router, private dataService: DataService, public validation: ValidationService) {
    this.calcData = JSON.parse(localStorage.getItem("calcData"));
    if (!this.calcData.reportSavedOnServer)
      this.calcData.reportSavedOnServer = false;
    localStorage.setItem("calcData", JSON.stringify(this.calcData));
    this.calcData.loanOriginationFee = this.dataService.EmptyNullOrUndefined(this.calcData.loanOriginationFee) ? 0 : this.calcData.loanOriginationFee;
    this.investedTenure = parseInt(this.calcData.investedTenure);
    this.homecurrency = parseFloat(parseFloat(this.calcData.homecurrency).toFixed(4));
    this.Initialhomecurrency = parseFloat(parseFloat(this.calcData.homecurrency).toFixed(4));
    // localStorage.clear();
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)) {
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)) {
      this.long = this.calcData.long;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.homecurrencyText)) {
      this.homecurrencyText = this.calcData.homecurrencyText;
    }
  }
  ngAfterViewInit(): void {
    const ctx = $('#canvas')[0].getContext('2d');
    const isMobile = $(window).width() <= 960;
    this.irrChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.yearlabel,
        datasets: [{
          label: 'GBP IRR',
          borderColor: '#6b9fd4',
          pointBorderColor: '#6b9fd4',
          pointBackgroundColor: '#6b9fd4',
          pointHoverBackgroundColor: '#6b9fd4',
          pointHoverBorderColor: '#6b9fd4',
          pointRadius: 3,
          fill: false,
          borderWidth: isMobile ? 2 : 3,
          borderCapStyle: 'round',
          data: this.yearlyGBPIRR
        }, {
          label: this.homecurrencyText + ' IRR',
          borderColor: '#22c55e',
          pointBorderColor: '#22c55e',
          pointBackgroundColor: '#22c55e',
          pointHoverBackgroundColor: '#22c55e',
          pointHoverBorderColor: '#22c55e',
          pointRadius: 3,
          fill: false,
          borderWidth: isMobile ? 2 : 3,
          borderCapStyle: 'round',
          data: this.yearlyHomeCurrencyIRR
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        title: { display: false },
        scales: {
          xAxes: [{
            display: true,
            gridLines: { color: 'rgba(255,255,255,0.06)', zeroLineColor: 'rgba(255,255,255,0.1)' },
            scaleLabel: { display: true, labelString: 'Year', fontColor: 'rgba(255,255,255,0.4)', fontSize: 10 },
            ticks: { fontColor: 'rgba(255,255,255,0.4)', fontSize: isMobile ? 8 : 11 }
          }],
          yAxes: [{
            display: true,
            gridLines: { color: 'rgba(255,255,255,0.06)', zeroLineColor: 'rgba(255,255,255,0.1)' },
            scaleLabel: { display: true, labelString: 'IRR %', fontColor: 'rgba(255,255,255,0.4)', fontSize: 10 },
            ticks: { fontColor: 'rgba(255,255,255,0.4)', fontSize: isMobile ? 8 : 11, callback: (v) => v + '%' }
          }]
        },
        tooltips: {
          backgroundColor: '#132147',
          titleFontColor: '#fff',
          bodyFontColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: { label: (item) => ' ' + item.yLabel + '%' }
        }
      }
    });






    //second dummy graph

    // const ctx2 = $('#canvas2')[0].getContext('2d');
    // const gradientStroke2 = ctx2.createLinearGradient(500, 0, 100, 0);
    // gradientStroke2.addColorStop(0, '#1d1751');
    // gradientStroke2.addColorStop(1, '#f7f7f7');
    // const gradientStroke3 = ctx2.createLinearGradient(500, 0, 100, 0);
    // gradientStroke3.addColorStop(0, '#1aaf4b');
    // gradientStroke3.addColorStop(1, '#f7f7f7');
    // var myChart = new Chart(ctx2, {
    //   type: 'line',
    //   data: {
    //     labels: this.yearlabel,
    //     datasets: [{
    //       label: 'GBP',
    //       borderColor: gradientStroke,
    //       pointBorderColor: gradientStroke,
    //       pointBackgroundColor: gradientStroke,
    //       pointHoverBackgroundColor: gradientStroke,
    //       pointHoverBorderColor: gradientStroke,
    //       pointRadius: 0,
    //       fill: false,
    //       borderWidth: 9,
    //       borderCapStyle: 'round',
    //       data: this.yearlyPropertyValueInGBP,
    //     }, {
    //       label: this.homecurrencyText,
    //       borderColor: gradientStroke1,
    //       pointBorderColor: gradientStroke1,
    //       pointBackgroundColor: gradientStroke1,
    //       pointHoverBackgroundColor: gradientStroke1,
    //       pointHoverBorderColor: gradientStroke1,
    //       pointRadius: 0,
    //       fill: false,
    //       borderWidth: 9,
    //       borderCapStyle: 'round',
    //       data: this.yearlyPropertyValueInHomeCurrency,
    //     }]
    //   },
    //   options: {
    //     legend: {
    //       display: true
    //     },
    //     responsive: true,
    //     title: {
    //       display: false,
    //       text: 'Yearly IRR (Internal Rate of Return)'
    //     },
    //     scales: {
    //       xAxes: [{
    //         display: true,
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Year'
    //         },
    //       }],
    //       yAxes: [{
    //         display: true,
    //         scaleLabel: {
    //         display: true,
    //         labelString: 'Percentage'
    //       }
    //       }]
    //     }
    //   }
    // });


    const ctxpie = $('#can')[0].getContext('2d');
    const fxGrowth = this.TotalReturnOfInvestment - this.RentalIncome - this.capitalAppreciation;
    // FX Appreciation gradient: 315deg rgba(45,97,237,0.60) → rgba(16,24,43,0.60) with rgba(255,255,255,0.30) overlay
    const fxGrad = ctxpie.createLinearGradient(270, 0, 0, 270);
    fxGrad.addColorStop(0, 'rgba(45,97,237,0.80)');
    fxGrad.addColorStop(1, 'rgba(16,24,43,0.90)');
    var myPieChart = new Chart(ctxpie, {
      type: 'doughnut',
      data: {
        labels: ['Net Rental Income', 'FX Appreciation', 'Capital Growth'],
        datasets: [{
          backgroundColor: ['rgba(255,255,255,0.15)', fxGrad, '#506E9C'],
          borderColor: 'transparent',
          borderWidth: 0,
          data: [
            Math.max(this.RentalIncome, 0),
            Math.max(fxGrowth, 0),
            Math.max(this.capitalAppreciation, 0)
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutoutPercentage: 65,
        legend: { display: false },
        tooltips: {
          backgroundColor: '#132147',
          titleFontColor: '#fff',
          bodyFontColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }
      }
    });

    // Set default active country tab based on user's currency or fallback to India
    const userCurrency = (this.homecurrencyText || '').toUpperCase();
    const matched = this.countryList.find(c => this.countryFxMap[c]?.currency === userCurrency);
    setTimeout(() => this.selectCountry(matched || 'India'), 0);

    if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.reportSaveToServer();
    }
  }

  ngOnInit(): void {
    // Ensure all numeric fields are parsed as numbers
    this.calcData.PropertyValue = parseFloat(this.calcData.PropertyValue) || 0;
    this.calcData.capitalgrowth = parseFloat(this.calcData.capitalgrowth) || 0;
    this.calcData.fxgrowth = parseFloat(this.calcData.fxgrowth) || 0;
    this.calcData.rentalYeild = parseFloat(this.calcData.rentalYeild) || 0;
    this.calcData.rentalGrowthEscalation = parseFloat(this.calcData.rentalGrowthEscalation) || 0;
    this.calcData.letteingManagFee = parseFloat(this.calcData.letteingManagFee) || 0;
    this.calcData.stampDutyLandTax = parseFloat((this.calcData.stampDutyLandTax + '').replace(/,/g,'')) || 0;
    this.calcData.loanAmount = parseFloat(this.calcData.loanAmount) || 0;
    this.calcData.mortgageInterestRate = parseFloat(this.calcData.mortgageInterestRate) || 0;
    this.calcData.loanOriginationFee = parseFloat(this.calcData.loanOriginationFee) || 0;
    this.calcData.legalFees = parseFloat((this.calcData.legalFees + '').replace(/,/g,'')) || 0;
    this.calcData.groundRent = parseFloat((this.calcData.groundRent + '').replace(/,/g,'')) || 0;
    this.calcData.serviceCharges = parseFloat((this.calcData.serviceCharges + '').replace(/,/g,'')) || 0;
    this.calcData.miscelleneousExpense = parseFloat((this.calcData.miscelleneousExpense + '').replace(/,/g,'')) || 0;
    this.calcData.mortgageTenure = parseFloat(this.calcData.mortgageTenure) || this.investedTenure;
    this.calcData.homecurrency = parseFloat(this.calcData.homecurrency) || 1;
    this.homecurrency = this.calcData.homecurrency;
    this.Initialhomecurrency = this.calcData.homecurrency;

    for (let i = 0; i < this.investedTenure; i++) {
      this.homecurrency = parseFloat((this.homecurrency + (this.homecurrency * (this.calcData.fxgrowth / 100))).toFixed(4));
      const data = { "PropertyValue": 0, "PropertyValueInHomeCurrency": 0, "GrossRent": 0, "LettingFee": 0, "CashFlow": 0, "CashFlowInHomeCurrency": 0, "GroundRent": 0, "ServiceCharges": 0, "MiscelleneousExpense": 0, "Interest": 0, "loanOutstanding": 0, "EMI": 0, "PrincipleRepayment": 0, "loanOutstandingInHomeCurrency": 0 };
      let PropertyValue: number;
      if (i == 0)
        PropertyValue = parseFloat(this.calcData.PropertyValue);
      else
        PropertyValue = this.TenureWisePropertyData[i - 1].PropertyValue;

      data.PropertyValue = parseFloat((PropertyValue + (PropertyValue * (this.calcData.capitalgrowth / 100))).toFixed(4));

      data.PropertyValueInHomeCurrency = parseFloat((data.PropertyValue * this.homecurrency).toFixed(4));
      if (i == 0)
        data.GrossRent = parseFloat((this.calcData.PropertyValue * (this.calcData.rentalYeild / 100)).toFixed(4));
      else
        data.GrossRent = parseFloat((this.TenureWisePropertyData[i - 1].GrossRent + (this.TenureWisePropertyData[i - 1].GrossRent * (this.calcData.rentalGrowthEscalation / 100))).toFixed(4));

      data.LettingFee = parseFloat((data.GrossRent * (this.calcData.letteingManagFee / 100)).toFixed(4));
      if (this.calcData.optmortgage == "1") {
        if (this.calcData.mortgageType == "1") {
          data.Interest = (this.calcData.PropertyValue * (this.calcData.loanAmount / 100)) * (this.calcData.mortgageInterestRate / 100);
          data.loanOutstanding = (this.calcData.PropertyValue * (this.calcData.loanAmount / 100));
          data.loanOutstandingInHomeCurrency = parseFloat((data.loanOutstanding * this.calcData.homecurrency).toFixed(4));
        } else {
          const P = this.calcData.PropertyValue * (this.calcData.loanAmount / 100);
          const R = ((this.calcData.mortgageInterestRate / 100) / 12);
          const N = this.calcData.mortgageTenure * 12;
          data.EMI = parseFloat(((P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1)) * 12).toFixed(4));
          if (i == 0) {
            data.Interest = (this.calcData.PropertyValue * (this.calcData.loanAmount / 100)) * (this.calcData.mortgageInterestRate / 100);
            data.PrincipleRepayment = data.EMI - data.Interest;
            data.loanOutstanding = P - data.PrincipleRepayment;
            data.loanOutstandingInHomeCurrency = parseFloat((data.loanOutstanding * this.calcData.homecurrency).toFixed(4));
          } else {
            data.Interest = this.TenureWisePropertyData[i - 1].loanOutstanding * (this.calcData.mortgageInterestRate / 100);
            data.PrincipleRepayment = data.EMI - data.Interest;
            data.loanOutstanding = this.TenureWisePropertyData[i - 1].loanOutstanding - data.PrincipleRepayment;
            data.loanOutstandingInHomeCurrency = parseFloat((data.loanOutstanding * this.calcData.homecurrency).toFixed(4));
          }
        }
      }
      data.GroundRent = this.calcData.groundRent || 0;
      data.ServiceCharges = this.calcData.serviceCharges || 0;
      data.MiscelleneousExpense = this.calcData.miscelleneousExpense || 0;

      // if(this.calcData.optmortgage == "1"){
      //   data.CashFlow = parseInt((data.GrossRent - data.LettingFee).toFixed()) - data.GroundRent - data.ServiceCharges - data.MiscelleneousExpense - data.Interest - data.PrincipleRepayment;
      // }else{
      //   data.CashFlow = parseInt((data.GrossRent+ data.EMI- data.LettingFee).toFixed()) - data.GroundRent - data.ServiceCharges - data.MiscelleneousExpense - data.Interest - data.PrincipleRepayment;
      // }
      data.CashFlow = data.GrossRent - data.LettingFee - data.GroundRent - data.ServiceCharges - data.MiscelleneousExpense - data.Interest - data.PrincipleRepayment;
      this.RentalIncome = this.RentalIncome + (data.GrossRent - data.GroundRent - data.LettingFee - data.ServiceCharges - data.MiscelleneousExpense - data.Interest - data.PrincipleRepayment);
      data.CashFlowInHomeCurrency = parseFloat((data.CashFlow * this.homecurrency).toFixed(4));
      this.yearlyPropertyValueInGBP.push(((data.PropertyValue - this.calcData.PropertyValue) / this.calcData.PropertyValue) * 100);
      this.yearlyPropertyValueInHomeCurrency.push(((data.PropertyValueInHomeCurrency - (this.calcData.PropertyValue * this.calcData.homecurrency)) / (this.calcData.PropertyValue * this.calcData.homecurrency)) * 100);
      this.TenureWisePropertyData.push(data);
      if (i == this.investedTenure - 1) {
        this.EquityCapital = parseFloat(((data.PropertyValue - data.loanOutstanding)).toFixed(4));
        this.allCahsflow.push(parseFloat((data.CashFlow + data.PropertyValue - data.loanOutstanding).toFixed(4)));
        this.allCashFlowInHomeCurrency.push(parseFloat((data.CashFlowInHomeCurrency + (data.PropertyValue * this.homecurrency) - (data.loanOutstanding * this.homecurrency)).toFixed(4)));
      } else {
        this.allCahsflow.push(data.CashFlow);
        this.allCashFlowInHomeCurrency.push(data.CashFlowInHomeCurrency);
      }
    }
    this.RentalIncome = parseInt((this.RentalIncome * this.Initialhomecurrency).toFixed(4));
    
    let InitialInvesment = 0;
    if (this.calcData.optmortgage == "0") {
      InitialInvesment = 0 - parseFloat((parseFloat(this.calcData.PropertyValue) + parseFloat(this.calcData.stampDutyLandTax)).toFixed(4));
    } else {
      InitialInvesment = 0 - parseFloat(((this.calcData.PropertyValue * ((100 - this.calcData.loanAmount) / 100)) + parseFloat(this.calcData.stampDutyLandTax) + (this.calcData.PropertyValue * ((this.calcData.loanAmount) / 100)) * (this.calcData.loanOriginationFee / 100)).toFixed(4));
    }
    this.allCahsflow.splice(0, 0, InitialInvesment);
    try { this.IrrInGBP = finance.IRR.apply(this, this.allCahsflow); } catch (e) { this.IrrInGBP = 0; }
    let InitialInvesmentInHomeCurrency = parseFloat((InitialInvesment * this.calcData.homecurrency).toFixed(4));
    this.allCashFlowInHomeCurrency.splice(0, 0, InitialInvesmentInHomeCurrency);
    try { this.IrrInHomeCurrency = finance.IRR.apply(this, this.allCashFlowInHomeCurrency); } catch (e) { this.IrrInHomeCurrency = 0; }
    this.capitalAppreciation = parseFloat(((this.EquityCapital+ InitialInvesment)*this.calcData.homecurrency).toFixed(4));
    this.graphInitialInvestmentInHomeCurrency = InitialInvesmentInHomeCurrency;
    //console.log(this.allCashFlowInHomeCurrency);
    this.TotalReturnOfInvestment = parseFloat((this.allCashFlowInHomeCurrency.reduce((a, b) => a + b, 0)).toFixed(4));// Math.abs(parseFloat((this.allCashFlowInHomeCurrency.reduce((a, b) => a + b, 0)).toFixed(4)));
   // console.log(this.TotalReturnOfInvestment);
    const absInitialHC = Math.abs(InitialInvesmentInHomeCurrency);
    this.wealthMultiple = absInitialHC > 0 ? parseFloat(((absInitialHC + this.TotalReturnOfInvestment) / absInitialHC).toFixed(2)) : 0;
    this.returnOnEquity = absInitialHC > 0 ? parseFloat((this.TotalReturnOfInvestment / absInitialHC * 100).toFixed(2)) : 0;
    this.benchMax = Math.max(this.IrrInHomeCurrency || 0, this.IrrInGBP || 0, 20);
   for (let k = 0; k < this.TenureWisePropertyData.length; k++) {
      this.yearlabel.push('Yr ' + (k + 1));
      let TempyearlyGBPIRR = 0;
      let TempyearlyHomeCurrencyIRR = 0;
      if (k >= 1) {
        try {
          TempyearlyGBPIRR = parseFloat(this.ReturnIRR(InitialInvesment, k).toFixed(2));
          TempyearlyHomeCurrencyIRR = parseFloat(this.ReturnIRRInHomeCurrency(InitialInvesmentInHomeCurrency, k).toFixed(2));
        } catch (error) {
          TempyearlyGBPIRR = 0;
          TempyearlyHomeCurrencyIRR = 0;
        }
      }
      this.yearlyGBPIRR.push(isFinite(TempyearlyGBPIRR) ? TempyearlyGBPIRR : 0);
      this.yearlyHomeCurrencyIRR.push(isFinite(TempyearlyHomeCurrencyIRR) ? TempyearlyHomeCurrencyIRR : 0);
    }
    // Replace final year with the actual overall IRR
    if (this.yearlabel.length > 0) {
      this.yearlyGBPIRR[this.yearlyGBPIRR.length - 1] = parseFloat((this.IrrInGBP || 0).toFixed(2));
      this.yearlyHomeCurrencyIRR[this.yearlyHomeCurrencyIRR.length - 1] = parseFloat((this.IrrInHomeCurrency || 0).toFixed(2));
    }
  }
  

  makePositive(value){
    return Math.abs(value);
  }
  ReturnIRR(InitialInvestMent: number, index: number): number {
    let cashFlow = [];
    for (let i = 0; i <= index; i++) {
      if (i == index) {
        cashFlow.push(parseFloat((this.TenureWisePropertyData[i].PropertyValue - this.TenureWisePropertyData[i].loanOutstanding + this.TenureWisePropertyData[i].CashFlow).toFixed(4)))
      } else {
        cashFlow.push(this.TenureWisePropertyData[i].CashFlow)
      }
    }
    cashFlow.splice(0, 0, InitialInvestMent);
    try { return finance.IRR.apply(this, cashFlow); } catch (e) { return 0; }
  }
  ReturnIRRInHomeCurrency(InitialInvestMent: number, index: number): number {
    let cashFlow = [];
    let HomeCurrency = parseFloat(parseFloat(this.calcData.homecurrency).toFixed(4));
    for (let i = 0; i <= index; i++) {
      HomeCurrency = HomeCurrency + (HomeCurrency * (this.calcData.fxgrowth / 100));
      if (i == index) {
        let LastCashFlowGbp = parseFloat((this.TenureWisePropertyData[i].PropertyValue - this.TenureWisePropertyData[i].loanOutstanding + this.TenureWisePropertyData[i].CashFlow).toFixed(4));
        cashFlow.push(parseFloat((LastCashFlowGbp * HomeCurrency).toFixed(4)));
      } else {
        cashFlow.push(this.TenureWisePropertyData[i].CashFlowInHomeCurrency)
      }
    }
    cashFlow.splice(0, 0, InitialInvestMent);
    try { return finance.IRR.apply(this, cashFlow); } catch (e) { return 0; }
  }
  selectCountry(country: string): void {
    this.selectedCountry = country;
    const fx = this.countryFxMap[country];
    if (!fx || !this.irrChart) return;

    const fxRate = fx.rate;
    const fxGrowth = fx.fxGrowth;
    const tenure = this.investedTenure;

    // Recompute InitialInvestment in this country's currency
    let InitialInvesment = 0;
    if (this.calcData.optmortgage == "0") {
      InitialInvesment = 0 - (parseFloat(this.calcData.PropertyValue) + parseFloat(this.calcData.stampDutyLandTax));
    } else {
      InitialInvesment = 0 - ((this.calcData.PropertyValue * ((100 - this.calcData.loanAmount) / 100))
        + parseFloat(this.calcData.stampDutyLandTax)
        + (this.calcData.PropertyValue * (this.calcData.loanAmount / 100)) * (this.calcData.loanOriginationFee / 100));
    }
    const InitialInHC = InitialInvesment * fxRate;

    // Recompute yearly HC IRR using this country's FX rate + growth
    const newYearlyHCIRR: number[] = [];
    let currentFx = fxRate;
    for (let k = 0; k < tenure; k++) {
      currentFx = currentFx + (currentFx * (fxGrowth / 100));
      if (k === 0) {
        newYearlyHCIRR.push(0);
        continue;
      }
      try {
        let cf: number[] = [InitialInHC];
        let fx2 = fxRate;
        for (let i = 0; i <= k; i++) {
          fx2 = fx2 + (fx2 * (fxGrowth / 100));
          if (i === k) {
            const lastGbp = this.TenureWisePropertyData[i].PropertyValue
              - this.TenureWisePropertyData[i].loanOutstanding
              + this.TenureWisePropertyData[i].CashFlow;
            cf.push(parseFloat((lastGbp * fx2).toFixed(4)));
          } else {
            cf.push(parseFloat((this.TenureWisePropertyData[i].CashFlow * fx2).toFixed(4)));
          }
        }
        const irr = parseFloat(finance.IRR.apply(this, cf).toFixed(2));
        newYearlyHCIRR.push(isFinite(irr) ? irr : 0);
      } catch {
        newYearlyHCIRR.push(0);
      }
    }

    // Update chart dataset 1 (home currency IRR line)
    this.irrChart.data.datasets[1].data = newYearlyHCIRR;
    this.irrChart.data.datasets[1].label = fx.currency + ' IRR';
    this.irrChart.update();
  }

  startagain(): void {
    localStorage.removeItem('calcData');
    this.router.navigate(['/']);
  }

  printScreen() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingPrintbtn = true;
      window.print();
      this.loadingPrintbtn = false;
    }
    else {
      this.router.navigateByUrl('/login?ref=/calculated-irr');
    }
  }

  convetToPDF() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingDownloadbtn = true;
      $(".noprint").addClass("displaynone");
      const data = document.getElementById('contentToConvert');
      html2canvas(data,
        {
          scrollY: -window.scrollY,
          logging: true,
          useCORS: true,
          allowTaint: true
        }).then(canvas => {
          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 20, 5, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 20)
          pdf.save('new-file.pdf'); // Generated PDF
          this.loadingDownloadbtn = false;
        });
      $(".noprint").removeClass("displaynone");

    }
    else {
      this.router.navigateByUrl('/login?ref=/calculated-irr');
    }
  }

  emailpopup(){
    $("#myModal").modal("show");
  }
  shareReport() {
    if (this.dataService.EmptyNullOrUndefined(this.Email)){
          alert('Email is mandatory to share IRR Result');
      }
    else{
      var multipleUser = this.Email.split(',');
      if(multipleUser.length > 5){
          alert('You cannot share report to more than 5 recipients at a time.')
        }
      else{
          var obj = {};
          var errorresult = "";
          for(var i = 0; i<multipleUser.length;i++){
            if(obj[multipleUser[i]] === undefined ){
               obj[multipleUser[i]] = 1;
            }
            else{
                  errorresult+=multipleUser[i];
                  if(i<multipleUser.length-1)
                  errorresult+=",";
            }
          }
          if(errorresult!==""){
          alert(errorresult + " is repeated");
          }
          else{
      if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
        this.loadingSharebtn = true;
        $("#cancelbtn").attr("disabled","true");
        $("#secondMain").addClass("noprint");
        $(".noprint").addClass("displaynone");
         const data = document.getElementById('contentToConvert');
        html2canvas(data,
          {
            scrollY: -window.scrollY,
            logging: true,
            useCORS: true,
            allowTaint: true
          }).then(canvas => {
            let contentDataURL = canvas.toDataURL('image/png');
            contentDataURL = contentDataURL.replace("data:image/png;base64,", "");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": this.Email, "ResultImageBase64String": contentDataURL,"CalculatorId" :localStorage.getItem('CalculatorText') };
            const Response = this.dataService.PostAdventumRequest('v1/sendresultonmail', Data).subscribe((response) => {
              if (response.n === 1) {
                alert(response.Msg);
                this.Email = "";
                $("#myModal").modal("hide");
              } else if (response.n === 0) {
                alert(response.Msg);
              } else {
                alert('Something went wrong please try agian later');
              }
              this.loadingSharebtn = false;
              $("#cancelbtn").removeAttr("disabled");
              $("#secondMain").removeClass("noprint");
            });
          });
           $(".noprint").removeClass("displaynone");
     
       
      }
      else {
        $("#myModal").modal("hide");
        this.router.navigateByUrl('/login?ref=/calculated-irr');
      }
    }
      }
  
    }
 
   
  }
  cancel(){
    $("#myModal").modal("hide");
    this.Email = "";
  }
  reportSaveToServer() {
    setTimeout(() => {
      if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
        $(".noprint").addClass("displaynone");
        const data = document.getElementById('contentToConvert');
        html2canvas(data,
          {
            scrollY: -window.scrollY,
            logging: true,
            useCORS: true,
            allowTaint: true
          }).then(canvas => {
            let contentDataURL = canvas.toDataURL('image/png');
            contentDataURL = contentDataURL.replace("data:image/png;base64,", "");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "CalculatorId": localStorage.getItem('CalculatorType').toString(), "ResultImageBase64String": contentDataURL };
            const Response = this.dataService.PostAdventumRequest('v1/saveuserresult', Data).subscribe((response) => {
              this.calcData.reportSavedOnServer = true;
              localStorage.setItem("calcData", JSON.stringify(this.calcData));
            });
          });
        $(".noprint").removeClass("displaynone");
      }
    }, 5000);

  }
}
