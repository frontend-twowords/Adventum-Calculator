import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
declare var $: any;
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-stamp-duty-result',
  templateUrl: './stamp-duty-result.component.html',
  styleUrls: ['./stamp-duty-result.component.css']
})
export class StampDutyResultComponent implements OnInit, AfterViewInit {
  Email: any;
  MapLoad = true;
  lat: number = 0;
  long: number = 0;
  calcData: any;
  stampDutyLandTax = 0;
  effectiveRate = '0.00';
  loadingPrintbtn = false;
  loadingDownloadbtn = false;
  loadingSharebtn = false;

  bandBreakdown: { band: string; rate: number; taxable: number; due: number }[] = [];
  baseSdlt = 0;
  foreignSurcharge = 0;
  additionalSurcharge = 0;

  private purchaseTypeMap: Record<string, string> = {
    primary:    'Primary Residence',
    investment: 'Investment Property',
    first_time: 'First-Time Buyer',
    non_resi:   'Non-Residential',
  };

  get purchaseTypeLabel(): string {
    return this.purchaseTypeMap[this.calcData?.PurchaseType] || this.calcData?.PurchaseType || '—';
  }

  constructor(
    public validation: ValidationService,
    private dataService: DataService,
    private router: Router
  ) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)) { this.lat = this.calcData.lat; }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)) { this.long = this.calcData.long; }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    this.computeSdlt();
  }

  ngAfterViewInit(): void {
    if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.reportSaveToServer();
    }
  }

  // ── SDLT engine ──────────────────────────────────────────────
  private computeSdlt(): void {
    const price = parseFloat(this.calcData.PropertyValue) || 0;
    const type  = this.calcData.PurchaseType || 'primary';
    const foreign = this.calcData.ForeignBuyer === '1';
    this.additionalSurcharge = 0;

    if (type === 'non_resi') {
      const tiers = [
        { lower: 0,       upper: 150000,  rate: 0 },
        { lower: 150000,  upper: 250000,  rate: 2 },
        { lower: 250000,  upper: Infinity,rate: 5 },
      ];
      let tax = 0;
      this.bandBreakdown = [];
      for (const t of tiers) {
        const taxable = Math.max(0, Math.min(price, t.upper) - t.lower);
        const due = taxable * (t.rate / 100);
        if (taxable > 0) {
          this.bandBreakdown.push({
            band: `£${t.lower.toLocaleString()} – ${t.upper === Infinity ? 'above' : '£' + t.upper.toLocaleString()}`,
            rate: t.rate, taxable, due
          });
        }
        tax += due;
        if (price <= t.upper) break;
      }
      this.baseSdlt = Math.round(tax);
    } else if (type === 'first_time' && price <= 500000) {
      const tiers = [
        { lower: 0,      upper: 300000, rate: 0 },
        { lower: 300000, upper: 500000, rate: 5 },
      ];
      let tax = 0;
      this.bandBreakdown = [];
      for (const t of tiers) {
        const taxable = Math.max(0, Math.min(price, t.upper) - t.lower);
        const due = taxable * (t.rate / 100);
        if (taxable > 0) {
          this.bandBreakdown.push({
            band: `£${t.lower.toLocaleString()} – £${t.upper.toLocaleString()}`,
            rate: t.rate, taxable, due
          });
        }
        tax += due;
        if (price <= t.upper) break;
      }
      this.baseSdlt = Math.round(tax);
    } else {
      // Standard residential or first_time > £500k
      // For investment: show standard bands at base rates, then additionalSurcharge separately
      const tiers = [
        { lower: 0,       upper: 250000,   rate: 0  },
        { lower: 250000,  upper: 925000,   rate: 5  },
        { lower: 925000,  upper: 1500000,  rate: 10 },
        { lower: 1500000, upper: Infinity, rate: 12 },
      ];
      let tax = 0;
      this.bandBreakdown = [];
      for (const t of tiers) {
        const taxable = Math.max(0, Math.min(price, t.upper) - t.lower);
        const due = taxable * (t.rate / 100);
        if (taxable > 0) {
          this.bandBreakdown.push({
            band: `£${t.lower.toLocaleString()} – ${t.upper === Infinity ? 'above' : '£' + t.upper.toLocaleString()}`,
            rate: t.rate, taxable, due
          });
        }
        tax += due;
        if (price <= t.upper) break;
      }
      this.baseSdlt = Math.round(tax);
      this.additionalSurcharge = type === 'investment' ? Math.round(price * 0.05) : 0;
    }

    this.foreignSurcharge = foreign ? Math.round(price * 0.02) : 0;
    this.stampDutyLandTax = this.baseSdlt + this.additionalSurcharge + this.foreignSurcharge;
    this.effectiveRate = price > 0 ? ((this.stampDutyLandTax / price) * 100).toFixed(2) : '0.00';
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
      this.router.navigateByUrl('/login?ref=/stamp-duty-calculator/result');
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
        pdf.save('stamp-duty-result.pdf');
        this.loadingDownloadbtn = false;
      });
      $('.noprint').removeClass('displaynone');
    } else {
      this.router.navigateByUrl('/login?ref=/stamp-duty-calculator/result');
    }
  }

  emailpopup(): void { $('#myModal').modal('show'); }

  shareReport(): void {
    if (this.dataService.EmptyNullOrUndefined(this.Email)) {
      alert('Email is mandatory to share Stamp Duty Result');
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
      $('#secondMain').addClass('noprint');
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
          $('#secondMain').removeClass('noprint');
        });
      });
      $('.noprint').removeClass('displaynone');
    } else {
      $('#myModal').modal('hide');
      this.router.navigateByUrl('/login?ref=/stamp-duty-calculator/result');
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
