import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-stamp-duty-que',
  templateUrl: './stamp-duty-que.component.html',
  styleUrls: ['./stamp-duty-que.component.css']
})
export class StampDutyQueComponent implements OnInit {
  MapLoad = true;
  lat: number = 0;
  long: number = 0;
  PropertyValue = '';
  calcData: any;
  PurchaseType = '';
  foreignbuyer = '0';
  purchaseDropdownOpen = false;

  purchaseTypes = [
    { value: 'primary',    label: 'Primary Residence',   desc: 'Main home purchase — standard SDLT rates' },
    { value: 'investment', label: 'Investment Property',  desc: 'Buy-to-let or second home — +5% surcharge' },
    { value: 'first_time', label: 'First-Time Buyer',     desc: 'Relief on first £300k; 5% up to £500k' },
    { value: 'non_resi',   label: 'Non-Residential',      desc: 'Commercial or mixed-use property' },
  ];

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
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PurchaseType)) {
      this.PurchaseType = this.calcData.PurchaseType;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.ForeignBuyer)) {
      this.foreignbuyer = this.calcData.ForeignBuyer;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const t = e.target as HTMLElement;
    if (!t.closest('.sdlt-custom-select')) { this.purchaseDropdownOpen = false; }
  }

  get locationName(): string {
    return this.calcData?.City || 'United Kingdom';
  }

  get selectedPurchaseName(): string {
    const p = this.purchaseTypes.find(x => x.value === this.PurchaseType);
    return p ? p.label : 'Select purchase type';
  }

  selectPurchaseType(val: string): void {
    this.PurchaseType = val;
    this.purchaseDropdownOpen = false;
    this.calcLive();
  }

  // ── SDLT engine ──────────────────────────────────────────────
  private calcSdltEngine(price: number, type: string, foreign: boolean): number {
    if (!price || price <= 0) return 0;
    let tax = 0;

    if (type === 'non_resi') {
      const tiers = [
        { lower: 0,       upper: 150000,  rate: 0 },
        { lower: 150000,  upper: 250000,  rate: 2 },
        { lower: 250000,  upper: Infinity,rate: 5 },
      ];
      for (const t of tiers) {
        const taxable = Math.max(0, Math.min(price, t.upper) - t.lower);
        tax += taxable * (t.rate / 100);
        if (price <= t.upper) break;
      }
    } else if (type === 'first_time') {
      if (price <= 500000) {
        tax += Math.max(0, Math.min(price, 300000)) * 0;
        tax += Math.max(0, Math.min(price, 500000) - 300000) * 0.05;
      } else {
        return this.calcSdltEngine(price, 'primary', foreign);
      }
    } else {
      const additionalRate = type === 'investment' ? 5 : 0;
      const tiers = [
        { lower: 0,       upper: 250000,  rate: 0  + additionalRate },
        { lower: 250000,  upper: 925000,  rate: 5  + additionalRate },
        { lower: 925000,  upper: 1500000, rate: 10 + additionalRate },
        { lower: 1500000, upper: Infinity,rate: 12 + additionalRate },
      ];
      for (const t of tiers) {
        const taxable = Math.max(0, Math.min(price, t.upper) - t.lower);
        tax += taxable * (t.rate / 100);
        if (price <= t.upper) break;
      }
    }

    if (foreign) { tax += price * 0.02; }
    return tax;
  }

  get livePrice(): number {
    return parseFloat((this.PropertyValue || '').replace(/,/g, '')) || 0;
  }

  get liveSdlt(): number {
    return Math.round(this.calcSdltEngine(this.livePrice, this.PurchaseType, this.foreignbuyer === '1'));
  }

  get liveRate(): number {
    if (!this.livePrice) return 0;
    return parseFloat(((this.liveSdlt / this.livePrice) * 100).toFixed(2));
  }

  get liveForeignSurcharge(): number {
    if (this.foreignbuyer !== '1' || !this.livePrice) return 0;
    return Math.round(this.livePrice * 0.02);
  }

  calcLive(): void { /* getters update automatically */ }

  next(): void {
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)) {
      this.calcData.PropertyValue = this.PropertyValue.replace(/,/g, '');
    } else {
      const element = document.getElementById('PropertyValue');
      if (element) { element.classList.add('error-input'); }
      flag = false;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.PurchaseType)) {
      this.calcData.PurchaseType = this.PurchaseType;
    } else {
      flag = false;
    }
    this.calcData.ForeignBuyer = this.foreignbuyer;

    if (flag) {
      this.calcData.reportSavedOnServer = false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/stamp-duty-calculator/result']);
    }
  }
}
