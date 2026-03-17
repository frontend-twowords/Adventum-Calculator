import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})

export class Step2Component implements OnInit {
  percentInput: ElementRef | undefined;
  PropertyValue:string="";
  optmortgage:string="1";
  loanvalue:any="";
  mortgageType:string="1";
  loanAmount:string="75";
  mortgageInterestRate:string="";
  mortgageTenure:string="10";
  calcData:any;
  MapLoad=true;
  
  lat :number | undefined;
  long :number | undefined;
  City: string = '';

  constructor(
    private router:Router,
    private dataService: DataService,
    public validation:ValidationService) {
    const calcDataString = localStorage.getItem("calcData");
    this.calcData = calcDataString ? JSON.parse(calcDataString) : {};
   
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)){
      this.PropertyValue=this.validation.amountWithComma(this.calcData.PropertyValue);
    }
    // if(!this.dataService.EmptyNullOrUndefined(this.calcData.loanvalue)){
    //   this.loanvalue=this.validation.amountWithComma(this.calcData.loanvalue);
    // }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.optmortgage)){
    this.optmortgage=this.calcData.optmortgage;
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageType)){
    this.mortgageType=this.calcData.mortgageType; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.loanAmount)){
    this.loanAmount=this.calcData.loanAmount; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageInterestRate)){
    this.mortgageInterestRate=this.calcData.mortgageInterestRate+"%"; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.mortgageTenure)){
    this.mortgageTenure=this.calcData.mortgageTenure; 
  } 
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
    this.lat=this.calcData.lat; 
  } 
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
    this.long=this.calcData.long; 
  }
  if(!this.dataService.EmptyNullOrUndefined(this.calcData.City)){
    this.City=this.calcData.City; 
  }
 
}
  private get priceNum(): number {
    return parseInt((this.PropertyValue || '0').replace(/,/g, ''), 10) || 0;
  }

  get depositDisplay(): string {
    const price = this.priceNum;
    if (!price) return '—';
    const ltv = parseInt(this.loanAmount, 10) || 75;
    const deposit = Math.round(price * (1 - ltv / 100));
    return '£' + deposit.toLocaleString('en-GB');
  }

  get depositNote(): string {
    if (!this.priceNum) return '';
    const ltv = parseInt(this.loanAmount, 10) || 75;
    return (100 - ltv) + '% equity';
  }

  get loanAmountDisplay(): string {
    const price = this.priceNum;
    if (!price) return '—';
    const ltv = parseInt(this.loanAmount, 10) || 75;
    const loan = Math.round(price * ltv / 100);
    return '£' + loan.toLocaleString('en-GB');
  }

  get stampDutyDisplay(): string {
    const price = this.priceNum;
    if (!price) return '—';
    let sdlt = 0;
    if (price > 1500000) sdlt += (price - 1500000) * 0.12;
    if (price > 925000)  sdlt += (Math.min(price, 1500000) - 925000) * 0.10;
    if (price > 250000)  sdlt += (Math.min(price, 925000) - 250000) * 0.05;
    sdlt = Math.round(sdlt);
    return '£' + sdlt.toLocaleString('en-GB');
  }

  get stampDutyNote(): string {
    return this.priceNum ? 'incl. 2% surcharge' : '';
  }

  ngOnInit(): void {
  // $(document).ready(function(){
  //   $(".percent").on('input', function() {
  //     $(this).val(function(i, v) {
  //      return v.replace('%','') + '%';  });
  //   });
  // });
  }

  next(){
    let flag=true;
    if(!this.dataService.EmptyNullOrUndefined(this.optmortgage)){
        this.calcData.optmortgage=this.optmortgage;
        if(!this.dataService.EmptyNullOrUndefined(this.PropertyValue)){
          this.calcData.PropertyValue=this.PropertyValue.replace(/,/g,'');
        }else{
          let element=document.getElementById("propertyValue");
          element.classList.add("error-input");
          flag=false;
        }

        // if(!this.dataService.EmptyNullOrUndefined(this.loanvalue)){
        //   this.calcData.loanvalue=this.loanvalue.replace(/,/g,'');
        // }else{
        //   let element=document.getElementById("loanvalue");
        //   element.classList.add("error-input");
        //   flag=false;
        // }




        if(this.optmortgage=="1"){
          if(!this.dataService.EmptyNullOrUndefined(this.mortgageType)){
            this.calcData.mortgageType=this.mortgageType;
          }else{
            flag=false;
          }
          if(!this.dataService.EmptyNullOrUndefined(this.loanAmount)){
            this.calcData.loanAmount=this.loanAmount.replace("%",'');
          }else{
            flag=false;
          }
          if(!this.dataService.EmptyNullOrUndefined(this.mortgageInterestRate)){
            this.calcData.mortgageInterestRate=this.mortgageInterestRate.replace("%",'');
          }else{
            let element=document.getElementById("mortgageInterestRate");
            element.classList.add("error-input");
            flag=false;
          }
          if(!this.dataService.EmptyNullOrUndefined(this.mortgageTenure)){
            this.calcData.mortgageTenure=this.mortgageTenure;
          }else{
            flag=false;
          }
        }
      }else{
        flag=false;
      }
    
   if(flag){
    this.calcData.reportSavedOnServer=false;
    localStorage.setItem("calcData",JSON.stringify(this.calcData));
    this.router.navigate(['/step3']);
   }
  }

}
