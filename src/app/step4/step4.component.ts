import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service'
import{Router} from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {
  stampDutyLandTax: string = "";
  loanOriginationFee: string = "";
  calcData: any;
  lat: number = 0;
  long: number = 0;
  country: string = "";
  PropertyValue: string = "";
  letteingManagFee: string = "";
  groundRent: string = "";
  serviceCharges: string = "";
  miscelleneousExpense: string = "";
  legalFees: string = "";
  rentalGrowthEscalation: string = "";
  PropertyLondon: any;
  City: string = '';

  // Computed display values for left panel
  processingFeeAmount: string = "";
  acquisitionTotal: string = "";
  runningCostTotal: string = "";
  year1Total: string = "";

  constructor(
    private router: Router,
    private dataService: DataService,
    public validation: ValidationService
  ) {
    this.calcData = JSON.parse(localStorage.getItem("calcData") || '{}');

    if (!this.dataService.EmptyNullOrUndefined(this.calcData.stampDutyLandTax)) {
      this.stampDutyLandTax = this.validation.amountWithComma(this.calcData.stampDutyLandTax);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.loanOriginationFee)) {
      this.loanOriginationFee = this.calcData.loanOriginationFee;
    }
    if (this.calcData.optmortgage === "0") {
      this.loanOriginationFee = "0";
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)) {
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)) {
      this.long = this.calcData.long;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.Country)) {
      this.country = this.calcData.Country;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.calcData.PropertyValue;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.City)) {
      this.City = this.calcData.City;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.letteingManagFee)) {
      this.letteingManagFee = this.calcData.letteingManagFee;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.groundRent)) {
      this.groundRent = this.validation.amountWithComma(this.calcData.groundRent);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.serviceCharges)) {
      this.serviceCharges = this.validation.amountWithComma(this.calcData.serviceCharges);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.miscelleneousExpense)) {
      this.miscelleneousExpense = this.validation.amountWithComma(this.calcData.miscelleneousExpense);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.legalFees)) {
      this.legalFees = this.validation.amountWithComma(this.calcData.legalFees);
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.rentalGrowthEscalation)) {
      this.rentalGrowthEscalation = this.calcData.rentalGrowthEscalation;
    }
  }

  // Map any city/region name to valid propertydata.co.uk country param
  resolveApiCountry(raw: string): string {
    if (!raw) return 'england';
    const r = raw.toLowerCase().trim();
    if (r === 'scotland') return 'scotland';
    if (r === 'wales') return 'wales';
    if (r === 'northern-ireland' || r === 'northern ireland') return 'northern-ireland';
    // All UK cities (Manchester, Birmingham, Liverpool, etc.) are in England
    return 'england';
  }

  // Built-in UK SDLT calculator (investment/additional property rates as of 2024)
  // Additional property surcharge: 3% on top of standard rates (raised to 5% Oct 2024)
  calculateSdltFallback(value: number, isForeignBuyer: boolean): number {
    const surcharge = 0.05; // 5% additional dwelling surcharge (from Oct 2024)
    const foreignSurcharge = isForeignBuyer ? 0.02 : 0;
    let sdlt = 0;

    // Standard residential SDLT bands
    if (value <= 125000) {
      sdlt = 0;
    } else if (value <= 250000) {
      sdlt = (value - 125000) * 0.02;
    } else if (value <= 925000) {
      sdlt = (250000 - 125000) * 0.02 + (value - 250000) * 0.05;
    } else if (value <= 1500000) {
      sdlt = (250000 - 125000) * 0.02 + (925000 - 250000) * 0.05 + (value - 925000) * 0.10;
    } else {
      sdlt = (250000 - 125000) * 0.02 + (925000 - 250000) * 0.05 + (1500000 - 925000) * 0.10 + (value - 1500000) * 0.12;
    }

    // Add additional dwelling surcharge (5% on full value)
    sdlt += value * surcharge;
    // Add foreign buyer surcharge if applicable (2% on full value)
    sdlt += value * foreignSurcharge;

    return Math.round(sdlt);
  }

  ngOnInit(): void {
    this.PropertyLondon = localStorage.getItem("PropertyLondon");

    const apiCountry = this.resolveApiCountry(this.country);

    this.dataService.GetRequest(
      'https://api.propertydata.co.uk/stamp-duty-calculator?key=' + environment.PropertyDataKey +
      '&value=' + this.PropertyValue + '&country=' + apiCountry + '&mode=investment'
    ).subscribe((res: Response) => {
      var obj = JSON.parse(JSON.stringify(res));
      if (obj.status === "success") {
        let sdlt = parseFloat(obj.transaction_tax_payable);
        if (this.calcData.ForeignBuyer === "1") {
          sdlt += parseFloat(this.calcData.PropertyValue) * 0.02;
        }
        this.stampDutyLandTax = this.validation.amountWithComma(Math.round(sdlt).toString());
        this.calcTotals();
      } else {
        // API failed — use built-in calculator
        const propVal = parseFloat(this.PropertyValue) || 0;
        const sdlt = this.calculateSdltFallback(propVal, this.calcData.ForeignBuyer === "1");
        this.stampDutyLandTax = this.validation.amountWithComma(sdlt.toString());
        this.calcTotals();
      }
    }, () => {
      // HTTP error — use built-in calculator
      const propVal = parseFloat(this.PropertyValue) || 0;
      const sdlt = this.calculateSdltFallback(propVal, this.calcData.ForeignBuyer === "1");
      this.stampDutyLandTax = this.validation.amountWithComma(sdlt.toString());
      this.calcTotals();
    });
  }

  onFeeChange() {
    this.calcTotals();
  }

  calcTotals() {
    const sdlt = parseFloat((this.stampDutyLandTax || '0').replace(/,/g, '')) || 0;
    const propVal = parseFloat((this.PropertyValue || '0').replace(/,/g, '')) || 0;
    const feeRate = parseFloat(this.loanOriginationFee || '0') || 0;
    const loanAmt = propVal * (parseFloat(this.calcData.loanAmount || '0') / 100);
    const procFee = loanAmt * (feeRate / 100);
    this.processingFeeAmount = procFee > 0 ? this.validation.amountWithComma(Math.round(procFee).toString()) : '0';

    const acqTotal = sdlt + procFee;
    this.acquisitionTotal = acqTotal > 0 ? this.validation.amountWithComma(Math.round(acqTotal).toString()) : '';

    const ground = parseFloat((this.groundRent || '0').replace(/,/g, '')) || 0;
    const svcCharges = parseFloat((this.serviceCharges || '0').replace(/,/g, '')) || 0;
    const misc = parseFloat((this.miscelleneousExpense || '0').replace(/,/g, '')) || 0;
    const annualTotal = ground + svcCharges + misc;
    this.runningCostTotal = annualTotal > 0 ? this.validation.amountWithComma(Math.round(annualTotal).toString()) : '';

    const yr1 = acqTotal + annualTotal;
    this.year1Total = yr1 > 0 ? this.validation.amountWithComma(Math.round(yr1).toString()) : '';
  }

  next() {
    this.calcData.stampDutyLandTax = this.stampDutyLandTax ? this.stampDutyLandTax.replace(/,/g, '') : '0';
    this.calcData.loanOriginationFee = this.loanOriginationFee || '0';
    this.calcData.letteingManagFee = this.letteingManagFee || '0';
    this.calcData.groundRent = this.groundRent ? this.groundRent.replace(/,/g, '') : '0';
    this.calcData.serviceCharges = this.serviceCharges ? this.serviceCharges.replace(/,/g, '') : '0';
    this.calcData.miscelleneousExpense = this.miscelleneousExpense ? this.miscelleneousExpense.replace(/,/g, '') : '0';
    this.calcData.legalFees = '0';
    this.calcData.rentalGrowthEscalation = (this.rentalGrowthEscalation || '0').replace('%', '');
    this.calcData.reportSavedOnServer = false;
    localStorage.setItem("calcData", JSON.stringify(this.calcData));
    this.router.navigate(['/calculated-irr']);
  }
}
