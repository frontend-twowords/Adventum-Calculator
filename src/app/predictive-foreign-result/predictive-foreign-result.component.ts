import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { Router } from '@angular/router';
declare var $: any;
import * as Chart from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-predictive-foreign-result',
  templateUrl: './predictive-foreign-result.component.html',
  styleUrls: ['./predictive-foreign-result.component.css']
})
export class PredictiveForeignResultComponent implements OnInit, AfterViewInit {
  Email: any;
  calcData: any;
  loadingPrintbtn = false;
  loadingDownloadbtn = false;
  loadingSharebtn = false;

  // Computed outputs
  initialValueHome = 0;
  exitValueHome = 0;
  exitRate = 0;
  fxOnlyGrowthPct = 0;
  yearlyRows: { year: number; rate: number; value: number; growthPct: number }[] = [];

  private chartValues: number[] = [];
  private chartLabels: string[] = [];

  private readonly SYMBOLS: Record<string, string> = {
    INR: '₹', GBP: '£', USD: '$', AED: 'AED ', SGD: 'S$',
    HKD: 'HK$', EUR: '€', NGN: '₦', BDT: '৳', PKR: '₨'
  };

  get currencySymbol(): string {
    return this.SYMBOLS[this.calcData?.homecurrencyText] || this.calcData?.homecurrencyText || '';
  }

  constructor(
    public validation: ValidationService,
    private dataService: DataService,
    private router: Router
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    this.computeFX();
  }

  ngAfterViewInit(): void {
    if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.reportSaveToServer();
    }
    setTimeout(() => this.renderChart(), 80);
  }

  private computeFX(): void {
    const gbp = parseFloat(this.calcData.InvestmentGBP) || 0;
    const rate = parseFloat(this.calcData.homecurrency) || 0;
    const aproc = parseFloat(this.calcData.fxgrowth) || 0;
    const years = parseInt(this.calcData.investedTenure, 10) || 10;

    this.initialValueHome = gbp * rate;
    this.yearlyRows = [];
    this.chartLabels = [];
    this.chartValues = [];

    for (let i = 1; i <= years; i++) {
      const rateAtYear = rate * Math.pow(1 + aproc / 100, i);
      const valueAtYear = gbp * rateAtYear;
      const growthPct = (Math.pow(1 + aproc / 100, i) - 1) * 100;
      this.yearlyRows.push({ year: i, rate: rateAtYear, value: valueAtYear, growthPct });
      this.chartLabels.push('Yr ' + i);
      this.chartValues.push(valueAtYear);
    }

    const last = this.yearlyRows[this.yearlyRows.length - 1];
    this.exitRate = last ? last.rate : rate;
    this.exitValueHome = last ? last.value : this.initialValueHome;
    this.fxOnlyGrowthPct = rate > 0 ? (Math.pow(1 + aproc / 100, years) - 1) * 100 : 0;
  }

  private renderChart(): void {
    const canvas = document.getElementById('pfxCanvas') as HTMLCanvasElement;
    if (!canvas) { return; }
    const ctx = canvas.getContext('2d');
    const sym = this.currencySymbol;
    const code = this.calcData?.homecurrencyText || '';

    const fmtY = (v: number) => {
      if (code === 'INR') {
        if (v >= 1e7) { return sym + (v / 1e7).toFixed(1) + ' Cr'; }
        if (v >= 1e5) { return sym + (v / 1e5).toFixed(0) + ' L'; }
      }
      return sym + Math.round(v / 1000) + 'k';
    };

    new (Chart as any)(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: code + ' Value',
          data: this.chartValues,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.04)',
          pointBackgroundColor: '#22c55e',
          pointRadius: 4,
          borderWidth: 2.5,
          borderCapStyle: 'round',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: {
          backgroundColor: 'rgba(26,45,79,0.95)',
          cornerRadius: 8,
          callbacks: { label: (item: any) => fmtY(item.yLabel) }
        },
        scales: {
          xAxes: [{
            gridLines: { color: 'rgba(255,255,255,0.05)' },
            ticks: { fontColor: 'rgba(255,255,255,0.4)', fontSize: 11 }
          }],
          yAxes: [{
            gridLines: { color: 'rgba(255,255,255,0.06)' },
            ticks: { fontColor: 'rgba(255,255,255,0.4)', fontSize: 11, callback: (v: number) => fmtY(v) }
          }]
        }
      }
    });
  }

  formatHomeCurrency(val: number): string {
    if (!val && val !== 0) { return '0'; }
    const code = this.calcData?.homecurrencyText || '';
    const sym = this.SYMBOLS[code] || code + ' ';
    if (code === 'INR') {
      if (val >= 1e7) { return sym + (val / 1e7).toFixed(2) + ' Cr'; }
      if (val >= 1e5) { return sym + (val / 1e5).toFixed(2) + ' L'; }
    }
    return sym + val.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  }

  startagain(): void {
    localStorage.removeItem('calcData');
    this.router.navigate(['/']);
  }

  printScreen(): void {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingPrintbtn = true;
      window.print();
      this.loadingPrintbtn = false;
    } else {
      this.router.navigateByUrl('/login?ref=/predictive-foreign-calculator/result');
    }
  }

  convetToPDF(): void {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingDownloadbtn = true;
      $('.noprint').addClass('displaynone');
      const data = document.getElementById('contentToConvert');
      html2canvas(data, { scrollY: -window.scrollY, logging: true, useCORS: true, allowTaint: true }).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 20, 5, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 20);
        pdf.save('fx-result.pdf');
        this.loadingDownloadbtn = false;
      });
      $('.noprint').removeClass('displaynone');
    } else {
      this.router.navigateByUrl('/login?ref=/predictive-foreign-calculator/result');
    }
  }

  emailpopup(): void { $('#myModal').modal('show'); }

  shareReport(): void {
    if (this.dataService.EmptyNullOrUndefined(this.Email)) {
      alert('Email is mandatory to share Predictive Foreign Result');
      return;
    }
    const multipleUser = this.Email.split(',');
    if (multipleUser.length > 5) { alert('You cannot share report to more than 5 recipients at a time.'); return; }
    const obj: any = {};
    let errorresult = '';
    for (let i = 0; i < multipleUser.length; i++) {
      if (obj[multipleUser[i]] === undefined) { obj[multipleUser[i]] = 1; }
      else { errorresult += multipleUser[i]; if (i < multipleUser.length - 1) { errorresult += ','; } }
    }
    if (errorresult !== '') { alert(errorresult + ' is repeated'); return; }
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingSharebtn = true;
      $('#cancelbtn').attr('disabled', 'true');
      $('.noprint').addClass('displaynone');
      const data = document.getElementById('contentToConvert');
      html2canvas(data, { scrollY: -window.scrollY, logging: true, useCORS: true, allowTaint: true }).then(canvas => {
        let contentDataURL = canvas.toDataURL('image/png');
        contentDataURL = contentDataURL.replace('data:image/png;base64,', '');
        const Data = { UserId: sessionStorage.getItem('UserId'), EmailId: this.Email, ResultImageBase64String: contentDataURL, CalculatorId: localStorage.getItem('CalculatorText') };
        this.dataService.PostAdventumRequest('v1/sendresultonmail', Data).subscribe((response) => {
          if (response.n === 1) { alert(response.Msg); this.Email = ''; $('#myModal').modal('hide'); }
          else if (response.n === 0) { alert(response.Msg); }
          else { alert('Something went wrong please try again later'); }
          this.loadingSharebtn = false;
          $('#cancelbtn').removeAttr('disabled');
        });
      });
      $('.noprint').removeClass('displaynone');
    } else {
      $('#myModal').modal('hide');
      this.router.navigateByUrl('/login?ref=/predictive-foreign-calculator/result');
    }
  }

  cancel(): void { $('#myModal').modal('hide'); this.Email = ''; }

  reportSaveToServer(): void {
    setTimeout(() => {
      if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
        $('.noprint').addClass('displaynone');
        const data = document.getElementById('contentToConvert');
        html2canvas(data, { scrollY: -window.scrollY, logging: true, useCORS: true, allowTaint: true }).then(canvas => {
          let contentDataURL = canvas.toDataURL('image/png');
          contentDataURL = contentDataURL.replace('data:image/png;base64,', '');
          const Data = { UserId: sessionStorage.getItem('UserId'), CalculatorId: localStorage.getItem('CalculatorType').toString(), ResultImageBase64String: contentDataURL };
          this.dataService.PostAdventumRequest('v1/saveuserresult', Data).subscribe(() => {
            this.calcData.reportSavedOnServer = true;
            localStorage.setItem('calcData', JSON.stringify(this.calcData));
          });
        });
        $('.noprint').removeClass('displaynone');
      }
    }, 5000);
  }
}
