import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Finance } from 'financejs';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service'
import * as Chart from 'chart.js';
const finance = new Finance();
declare var $: any;
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CityAnnexureData, CityAnnexureDataMap } from './annexure-market-data';
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
  RentalIncomeGBP = 0;
  capitalAppreciationGBP = 0;
  TotalReturnInGBP = 0;
  homecurrencyText: string;
  loadingPrintbtn = false;
  loadingDownloadbtn = false;
  loadingSharebtn = false;
  selectedCountry: string = '';
  countryList: string[] = ['India', 'USA', 'Hong Kong', 'UAE', 'Europe', 'Nigeria', 'Bangladesh', 'Pakistan'];
  irrChart: any = null;
  annexureData: CityAnnexureData = this.getDefaultAnnexureData();

  private resolveAnnexureCityKey(rawCity: string): string {
    const city = (rawCity || '').trim().toLowerCase();
    if (city.includes('manchester')) return 'Manchester';
    if (city.includes('liverpool')) return 'Liverpool';
    if (city.includes('birmingham')) return 'Birmingham';
    if (city.includes('london')) return 'London';
    return 'Manchester';
  }

  isComparableSelected(cityLabel: string): boolean {
    const selected = (this.calcData?.City || '').trim().toLowerCase();
    const rowCity = (cityLabel || '').split('(')[0].trim().toLowerCase();
    return !!selected && rowCity.includes(selected);
  }

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

  formatCurrencyFull(value: number, currencyCode: string): string {
    if (value === null || value === undefined || isNaN(value)) return '0';
    const sym = this.getCurrencySymbol(currencyCode);
    const abs = Math.abs(value);
    const formatted =
      currencyCode === 'INR'
        ? Math.round(abs).toLocaleString('en-IN')
        : Math.round(abs).toLocaleString('en-US');
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
  constructor(private router: Router, private dataService: DataService, public validation: ValidationService, private http: HttpClient) {
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


    // Plugin: center text + outer callout lines with percentages
    const doughnutPlugin = {
      afterDraw: function(chart: any) {
        if (chart.config.type !== 'doughnut') return;
        const ctx2 = chart.ctx;
        const opts = chart.config.options;
        const cx = (chart.chartArea.left + chart.chartArea.right) / 2;
        const cy = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        // Scale fonts proportionally with chart area (baseline: 240px chart area)
        const chartW = chart.chartArea.right - chart.chartArea.left;
        const scale = Math.max(chartW / 240, 1);
        const labelSize = Math.round(12 * scale);
        const valueSize = Math.round(24 * scale);
        const gap = Math.round(20 * scale);
        ctx2.save();
        ctx2.textAlign = 'center';
        ctx2.textBaseline = 'middle';
        // "Total Profit" label
        ctx2.font = `400 ${labelSize}px Inter, sans-serif`;
        ctx2.fillStyle = 'rgba(255,255,255,0.55)';
        ctx2.fillText(opts.centerLabel || 'Total Profit', cx, cy - gap);
        // Value
        ctx2.font = `bold ${valueSize}px Inter, sans-serif`;
        ctx2.fillStyle = '#ffffff';
        ctx2.fillText(opts.centerValue || '', cx, cy + Math.round(gap * 0.2));
        // Currency
        ctx2.font = `400 ${labelSize}px Inter, sans-serif`;
        ctx2.fillStyle = 'rgba(255,255,255,0.55)';
        ctx2.fillText(opts.centerCurrency || '', cx, cy + Math.round(gap * 1.3));
        ctx2.restore();
      },
      afterDatasetsDraw: function(chart: any) {
        if (chart.config.type !== 'doughnut') return;
        const ctx2 = chart.ctx;
        const chartW = chart.chartArea.right - chart.chartArea.left;
        const scale = Math.max(chartW / 240, 1);
        const pctSize = Math.round(12 * scale);
        chart.data.datasets.forEach(function(dataset: any, i: number) {
          const meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;
          const total = dataset.data.reduce((a: number, v: number) => a + v, 0);
          meta.data.forEach(function(arc: any, index: number) {
            const val = dataset.data[index];
            if (!val || total === 0 || (val / total) < 0.04) return;
            const pct = ((val / total) * 100).toFixed(1) + '%';
            const model = arc._model || arc;
            const midAngle = model.startAngle + (model.endAngle - model.startAngle) / 2;
            const outerR = model.outerRadius;
            const cosA = Math.cos(midAngle);
            const sinA = Math.sin(midAngle);
            const x1 = model.x + cosA * outerR;
            const y1 = model.y + sinA * outerR;
            const x2 = model.x + cosA * (outerR + 12);
            const y2 = model.y + sinA * (outerR + 12);
            const tickLen = 10;
            let x3 = x2 + (cosA >= 0 ? tickLen : -tickLen);
            const y3 = y2;
            // Measure text and clamp x3 so label stays fully within canvas
            ctx2.font = `600 ${pctSize}px Inter, sans-serif`;
            const textW = ctx2.measureText(pct).width;
            const margin = 6;
            const logicalW = chart.width;
            if (cosA < 0) {
              // left side: right-aligned, left edge = x3 - 5 - textW
              const minX3 = margin + textW + 5;
              if (x3 < minX3) x3 = minX3;
            } else {
              // right side: left-aligned, right edge = x3 + 5 + textW
              const maxX3 = logicalW - margin - textW - 5;
              if (x3 > maxX3) x3 = maxX3;
            }
            const yTextOffset = sinA > 0 ? pctSize * 0.9 : -pctSize * 0.9;
            const textY = y3 + yTextOffset;
            ctx2.save();
            ctx2.strokeStyle = 'rgba(255,255,255,0.35)';
            ctx2.lineWidth = 1;
            ctx2.beginPath();
            ctx2.moveTo(x1, y1);
            ctx2.lineTo(x2, y2);
            ctx2.lineTo(x3, textY);
            ctx2.stroke();
            ctx2.fillStyle = '#ffffff';
            ctx2.textAlign = cosA >= 0 ? 'left' : 'right';
            ctx2.textBaseline = 'middle';
            ctx2.fillText(pct, x3 + (cosA >= 0 ? 5 : -5), textY);
            ctx2.restore();
          });
        });
      }
    };

    const ctxpie = $('#can')[0].getContext('2d');
    const fxGrowth = this.TotalReturnOfInvestment - this.RentalIncome - this.capitalAppreciation;
    const isSmallScreen = window.innerWidth <= 810;
    const chartPadding = isSmallScreen
      ? { top: 40, right: 40, bottom: 40, left: 40 }
      : { top: 60, right: 60, bottom: 60, left: 60 };
    var myPieChart = new Chart(ctxpie, {
      type: 'doughnut',
      data: {
        labels: ['Net Rental Income', 'FX Appreciation', 'Capital Growth'],
        datasets: [{
          backgroundColor: ['#445F8B', '#2B4069', '#132147'],
          borderColor: 'transparent',
          borderWidth: 0,
          data: [
            Math.max(this.RentalIncome, 0),
            Math.max(fxGrowth, 0),
            Math.max(this.capitalAppreciation, 0)
          ]
        }]
      },
      plugins: [doughnutPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutoutPercentage: 65,
        centerLabel: 'Total Profit',
        centerValue: this.formatCurrency(this.TotalReturnOfInvestment, this.homecurrencyText),
        centerCurrency: this.homecurrencyText,
        layout: { padding: chartPadding },
        legend: { display: false },
        tooltips: {
          backgroundColor: '#132147',
          titleFontColor: '#fff',
          bodyFontColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(tooltipItem: any, data: any) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
              const current = dataset.data[tooltipItem.index];
              const pct = total > 0 ? ((current / total) * 100).toFixed(1) : '0.0';
              return ' ' + data.labels[tooltipItem.index] + ': ' + pct + '%';
            }
          }
        }
      }
    } as any);

    // GBP donut chart
    const ctxpieGBP = $('#can-gbp')[0] ? $('#can-gbp')[0].getContext('2d') : null;
    if (ctxpieGBP) {
      new Chart(ctxpieGBP, {
        type: 'doughnut',
        data: {
          labels: ['Net Rental Income', 'Capital Growth'],
          datasets: [{
            backgroundColor: ['#445F8B', '#132147'],
            borderColor: 'transparent',
            borderWidth: 0,
            data: [
              Math.max(this.RentalIncomeGBP, 0),
              Math.max(this.capitalAppreciationGBP, 0)
            ]
          }]
        },
        plugins: [doughnutPlugin],
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutoutPercentage: 65,
          centerLabel: 'Total Profit',
          centerValue: this.formatCurrency(this.TotalReturnInGBP, 'GBP'),
          centerCurrency: 'GBP',
          layout: { padding: chartPadding },
          legend: { display: false },
          tooltips: {
            backgroundColor: '#132147',
            titleFontColor: '#fff',
            bodyFontColor: 'rgba(255,255,255,0.7)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: function(tooltipItem: any, data: any) {
                const dataset = data.datasets[tooltipItem.datasetIndex];
                const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                const current = dataset.data[tooltipItem.index];
                const pct = total > 0 ? ((current / total) * 100).toFixed(1) : '0.0';
                return ' ' + data.labels[tooltipItem.index] + ': ' + pct + '%';
              }
            }
          }
        }
      } as any);
    }


    // Investment Journey chart (kept for backward compatibility if canvas exists)
    const journeyCanvas = $('#journeyBar')[0] as HTMLCanvasElement;
    const ctxJourney = journeyCanvas ? journeyCanvas.getContext('2d') : null;
    const fxVal = Math.max(this.TotalReturnOfInvestment - this.capitalAppreciation - this.RentalIncome, 0);
    const self = this;
    if (ctxJourney) {
      new Chart(ctxJourney, {
      type: 'bar',
      data: {
        labels: ['Your Returns'],
        datasets: [
          {
            label: 'Initial Investment',
            data: [Math.max(-this.graphInitialInvestmentInHomeCurrency, 0)],
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderWidth: 0
          },
          {
            label: 'Capital Growth',
            data: [Math.max(this.capitalAppreciation, 0)],
            backgroundColor: '#506E9C',
            borderWidth: 0
          },
          {
            label: 'FX Appreciation',
            data: [Math.max(fxVal, 0)],
            backgroundColor: 'rgba(45,97,237,0.80)',
            borderWidth: 0
          },
          {
            label: 'Net Rental Income',
            data: [Math.max(this.RentalIncome, 0)],
            backgroundColor: 'rgba(255,255,255,0.20)',
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{ stacked: true, gridLines: { display: false }, ticks: { fontColor: 'rgba(255,255,255,0.5)', fontSize: 13 } }],
          yAxes: [{ stacked: true, gridLines: { color: 'rgba(255,255,255,0.08)', zeroLineColor: 'rgba(255,255,255,0.15)' }, ticks: { fontColor: 'rgba(255,255,255,0.5)', fontSize: 11, callback: function(val: number) { return self.formatCurrency(val, self.homecurrencyText); } } }]
        },
        tooltips: {
          backgroundColor: '#132147',
          titleFontColor: '#fff',
          bodyFontColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(item: any, data: any) {
              return ' ' + data.datasets[item.datasetIndex].label + ': ' + self.formatCurrency(item.yLabel, self.homecurrencyText);
            }
          }
        }
      }
    } as any);
    }

    if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.reportSaveToServer();
    }
  }

  ngOnInit(): void {
    this.loadAnnexureData();

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
    this.TotalReturnOfInvestment = parseFloat((this.allCashFlowInHomeCurrency.reduce((a, b) => a + b, 0)).toFixed(4));
    // GBP equivalents (no FX component in GBP)
    this.RentalIncomeGBP = parseFloat((this.RentalIncome / this.Initialhomecurrency).toFixed(4));
    this.capitalAppreciationGBP = parseFloat((this.EquityCapital + InitialInvesment).toFixed(4));
    this.TotalReturnInGBP = parseFloat((this.RentalIncomeGBP + this.capitalAppreciationGBP).toFixed(4));// Math.abs(parseFloat((this.allCashFlowInHomeCurrency.reduce((a, b) => a + b, 0)).toFixed(4)));
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

  private loadAnnexureData(): void {
    const cityKey = this.resolveAnnexureCityKey(this.calcData?.City);
    this.http.get<CityAnnexureDataMap>('assets/annexure-market-data.json').subscribe(
      (data) => {
        this.annexureData = data?.[cityKey] || data?.Manchester || this.getDefaultAnnexureData();
      },
      () => {
        this.annexureData = this.getDefaultAnnexureData();
      }
    );
  }

  private getDefaultAnnexureData(): CityAnnexureData {
    return {
      executiveStats: [],
      executiveParagraphs: [],
      boeRows: [],
      boeNote: '',
      mortgageRows: [],
      mortgageNote: '',
      outlookTitle: '',
      outlookSub: '',
      outlookCards: [],
      financialNewsSub: '',
      financialNewsLeft: [],
      financialNewsRight: [],
      comparablesSub: '',
      comparables: []
    };
  }
  

  makePositive(value){
    return Math.abs(value);
  }

  getJourneyInitialInvestment(): number {
    return Math.abs(this.graphInitialInvestmentInHomeCurrency || 0);
  }

  getJourneyNetRental(): number {
    return Math.max(this.RentalIncome || 0, 0);
  }

  getJourneyCapitalGrowth(): number {
    return Math.max(this.capitalAppreciation || 0, 0);
  }

  getJourneyFxAppreciation(): number {
    return Math.max((this.TotalReturnOfInvestment || 0) - (this.capitalAppreciation || 0) - (this.RentalIncome || 0), 0);
  }

  getJourneyTotalProfit(): number {
    return Math.max(this.TotalReturnOfInvestment || 0, 0);
  }

  getJourneyValueAtExit(): number {
    return Math.max((this.TotalReturnOfInvestment || 0) - (this.graphInitialInvestmentInHomeCurrency || 0), 0);
  }

  getJourneyMax(): number {
    return Math.max(
      this.getJourneyInitialInvestment(),
      this.getJourneyNetRental(),
      this.getJourneyCapitalGrowth(),
      this.getJourneyFxAppreciation(),
      this.getJourneyTotalProfit(),
      this.getJourneyValueAtExit(),
      1
    );
  }

  getJourneyFlex(value: number): string {
    const max = this.getJourneyMax();
    const normalized = Math.max(value / max, 0.06);
    return normalized.toFixed(3);
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
