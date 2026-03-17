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
import * as XLSX from 'xlsx'; 
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-cashflowresult',
  templateUrl: './cashflowresult.component.html',
  styleUrls: ['./cashflowresult.component.css']
})
export class CashflowresultComponent implements OnInit, AfterViewInit {
  @ViewChild('contentToConvert') content: ElementRef;
  @ViewChild('cfBarChart') cfBarChartRef: ElementRef;
  Email:any;
  calcData: any;
  cashflowdata:any = [];
  investedTenure: number;
  TenureWisePropertyData: any = [];
  allCahsflow: any = [];
  netYield:any = [];
  avgnetYield:any;
  totalCashFlow:any;
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
  capitalAppreciation = 0;
  graphInitialInvestmentInHomeCurrency = 0;
  homecurrencyText: string;
  loadingPrintbtn = false;
  loadingDownloadbtn = false;
  loadingSharebtn = false;
  loanoriginationfee:any;
  initialOutlay: number = 0;
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
  // ngAfterViewInit(): void {
  //   const ctx = $('#canvas')[0].getContext('2d');
  //   const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  //   gradientStroke.addColorStop(0, '#1d1751');
  //   gradientStroke.addColorStop(1, '#f7f7f7');
  //   const gradientStroke1 = ctx.createLinearGradient(500, 0, 100, 0);
  //   gradientStroke1.addColorStop(0, '#1aaf4b');
  //   gradientStroke1.addColorStop(1, '#f7f7f7');
  //   if ($(window).width() > 960) {
  //     var myChart = new Chart(ctx, {
  //       type: 'line',
  //       data: {
  //         labels: this.yearlabel,
  //         datasets: [{
  //           label: 'GBP',
  //           borderColor: gradientStroke,
  //           pointBorderColor: gradientStroke,
  //           pointBackgroundColor: gradientStroke,
  //           pointHoverBackgroundColor: gradientStroke,
  //           pointHoverBorderColor: gradientStroke,
  //           pointRadius: 0,
  //           fill: false,
  //           borderWidth: 9,
  //           borderCapStyle: 'round',
  //           data: this.yearlyGBPIRR//this.yearlyPropertyValueInGBP,
  //         }, {
  //           label: this.homecurrencyText,
  //           borderColor: gradientStroke1,
  //           pointBorderColor: gradientStroke1,
  //           pointBackgroundColor: gradientStroke1,
  //           pointHoverBackgroundColor: gradientStroke1,
  //           pointHoverBorderColor: gradientStroke1,
  //           pointRadius: 0,
  //           fill: false,
  //           borderWidth: 9,
  //           borderCapStyle: 'round',
  //           data: this.yearlyHomeCurrencyIRR//this.yearlyPropertyValueInHomeCurrency,
  //         }]
  //       },
  //       options: {
  //         legend: {
  //           display: true
  //         },
  //         responsive: true,
  //         title: {
  //           display: false,
  //           text: 'Yearly IRR (Internal Rate of Return)'
  //         },
  //         scales: {
  //           xAxes: [{
  //             display: true,
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Year',
  //               fontSize: 9
  //             },
  //             ticks: {
  //               fontSize: 14,
  //             }
  //           }],
  //           yAxes: [{
  //             display: true,
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Percentage'
  //             },
  //             ticks: {
  //               fontSize: 9
  //             }
  //           }]
  //         }
  //       }
  //     });
  //   } else {
  //     var myChart = new Chart(ctx, {
  //       type: 'line',
  //       data: {
  //         labels: this.yearlabel,
  //         datasets: [{
  //           label: 'GBP',
  //           borderColor: gradientStroke,
  //           pointBorderColor: gradientStroke,
  //           pointBackgroundColor: gradientStroke,
  //           pointHoverBackgroundColor: gradientStroke,
  //           pointHoverBorderColor: gradientStroke,
  //           pointRadius: 0,
  //           fill: false,
  //           borderWidth: 3,
  //           borderCapStyle: 'round',
  //           data: this.yearlyGBPIRR//this.yearlyPropertyValueInGBP,
  //         }, {
  //           label: this.homecurrencyText,
  //           borderColor: gradientStroke1,
  //           pointBorderColor: gradientStroke1,
  //           pointBackgroundColor: gradientStroke1,
  //           pointHoverBackgroundColor: gradientStroke1,
  //           pointHoverBorderColor: gradientStroke1,
  //           pointRadius: 0,
  //           fill: false,
  //           borderWidth: 3,
  //           borderCapStyle: 'round',
  //           data: this.yearlyHomeCurrencyIRR//this.yearlyPropertyValueInHomeCurrency,
  //         }]
  //       },
  //       options: {
  //         legend: {
  //           display: true,
  //           labels:{
  //             fontSize: 8,
  //             boxWidth:20
  //           }
  //         },
  //         responsive: true,
  //         title: {
  //           display: false,
  //           text: 'Yearly IRR (Internal Rate of Return)'
  //         },
  //         scales: {
  //           xAxes: [{
  //             display: true,
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Year',
  //               fontSize: 9,
  //             },
  //             ticks: {
  //               fontSize: 7.5,
  //             }
  //           }],
  //           yAxes: [{
  //             display: true,
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Percentage',
  //               fontSize: 8,
  //             },
  //             ticks: {
  //               fontSize: 8,
  //             }
  //           }]
  //         }
  //       }
  //     });
  //   }






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


  //   const ctxpie = $('#can')[0].getContext('2d');
  //   var dataforpie = {
  //     labels: ["Net Rental Income", "FX Growth", "Capital Growth"],
  //     datasets: [{
  //       backgroundColor: ["#E0DCDC", "#D3D0D0", "#F0EFE8"],
  //       data: [this.RentalIncome, (this.TotalReturnOfInvestment - this.RentalIncome - this.capitalAppreciation), this.capitalAppreciation]
  //     }]

  //   }
  //   var optionsforpie = {
  //     legend: {
  //       display: false
  //     }
  //   };
  //   var myPieChart = new Chart(ctxpie, {
  //     type: 'pie',
  //     data: dataforpie,
  //     options: optionsforpie
  //   });
  //   if (!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
  //     this.reportSaveToServer();
  //   }
  // }

  ngOnInit(): void {
    const prevDF = 1;
    const prevhDF = 1;
    for (let i = 0; i < this.investedTenure; i++) {
      this.homecurrency = parseFloat((this.homecurrency + (this.homecurrency * (this.calcData.fxgrowth / 100))).toFixed(4));
      const data = { "PropertyValue": 0, "PropertyValueInHomeCurrency": 0, "GrossRent": 0, "LettingFee": 0, "CashFlow": 0, "CashFlowInHomeCurrency": 0, "GroundRent": 0, "ServiceCharges": 0, "MiscelleneousExpense": 0, "Interest": 0, "loanOutstanding": 0, "EMI": 0, "PrincipleRepayment": 0, "loanOutstandingInHomeCurrency": 0 };
      let PropertyValue: any;
      if (i == 0)
        PropertyValue = parseFloat(this.calcData.PropertyValue);
      else
        PropertyValue = this.TenureWisePropertyData[i - 1].PropertyValue;

      data.PropertyValue = (parseFloat((PropertyValue + (PropertyValue * (3 / 100))).toFixed(4)));
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
          const N = this.investedTenure * 12;
          data.EMI = parseFloat(((P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1)) * 12).toFixed(4));
          if (i == 0) {
            data.Interest = (this.calcData.PropertyValue * (this.calcData.loanAmount / 100)) * (this.calcData.mortgageInterestRate / 100);
            data.PrincipleRepayment = parseFloat((data.EMI - data.Interest).toFixed(4));
            data.loanOutstanding = P - data.PrincipleRepayment;
            data.loanOutstandingInHomeCurrency = parseFloat((data.loanOutstanding * this.calcData.homecurrency).toFixed(4));
          } else {
            data.Interest = parseFloat((this.TenureWisePropertyData[i - 1].loanOutstanding * (this.calcData.mortgageInterestRate / 100)).toFixed());
            data.PrincipleRepayment = parseFloat((data.EMI - data.Interest).toFixed(4));
            data.loanOutstanding = parseFloat((this.TenureWisePropertyData[i - 1].loanOutstanding - data.PrincipleRepayment).toFixed(4));
            data.loanOutstandingInHomeCurrency = parseFloat((data.loanOutstanding * this.calcData.homecurrency).toFixed(4));
          }
        }
      }
      data.GroundRent = this.dataService.EmptyNullOrUndefined(this.calcData.groundRent) ? 0 : this.calcData.groundRent;
      data.ServiceCharges = this.dataService.EmptyNullOrUndefined(this.calcData.serviceCharges) ? 0 : this.calcData.serviceCharges;
      data.MiscelleneousExpense = this.dataService.EmptyNullOrUndefined(this.calcData.miscelleneousExpense) ? 0 : this.calcData.miscelleneousExpense;

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
      // if (i == this.investedTenure) {
      //   this.EquityCapital = parseFloat(((data.PropertyValue - data.loanOutstanding)).toFixed(4));
      //   this.allCahsflow.push(parseFloat((data.CashFlow + data.PropertyValue - data.loanOutstanding).toFixed(4)));
      //   this.allCashFlowInHomeCurrency.push(parseFloat((data.CashFlowInHomeCurrency + (data.PropertyValue * this.homecurrency) - (data.loanOutstanding * this.homecurrency)).toFixed(4)));
      // } else {
      //   this.allCahsflow.push(data.CashFlow.toFixed(4));
      //   this.allCashFlowInHomeCurrency.push(data.CashFlowInHomeCurrency);
      // }
      this.allCahsflow.push(data.CashFlow.toFixed(4));
      //console.log(data);
      this.cashflowdata.push(data);
    }
    this.RentalIncome = parseInt((this.RentalIncome * this.Initialhomecurrency).toFixed(4));
    
    let InitialInvesment = 0;
    if (this.calcData.optmortgage == "0") {
      InitialInvesment = 0 - parseFloat((parseFloat(this.calcData.PropertyValue) + parseFloat(this.calcData.stampDutyLandTax)).toFixed(4));
    } else {
      InitialInvesment = 0 - parseFloat(((this.calcData.PropertyValue * ((100 - this.calcData.loanAmount) / 100)) + parseFloat(this.calcData.stampDutyLandTax) + (this.calcData.PropertyValue * ((this.calcData.loanAmount) / 100)) * (this.calcData.loanOriginationFee / 100)).toFixed(4));
    }
    this.allCahsflow.splice(0, 0, InitialInvesment);

    // this.IrrInGBP = finance.IRR.apply(this, this.allCahsflow);
    let InitialInvesmentInHomeCurrency = parseFloat((InitialInvesment * this.calcData.homecurrency).toFixed(4));
    this.allCashFlowInHomeCurrency.splice(0, 0, InitialInvesmentInHomeCurrency);
    //this.IrrInHomeCurrency = finance.IRR.apply(this, this.allCashFlowInHomeCurrency);
    this.capitalAppreciation = parseFloat(((this.EquityCapital+ InitialInvesment)*this.calcData.homecurrency).toFixed(4));
    this.graphInitialInvestmentInHomeCurrency = InitialInvesmentInHomeCurrency;
    //console.log(this.allCashFlowInHomeCurrency);
    this.TotalReturnOfInvestment = parseFloat((this.allCashFlowInHomeCurrency.reduce((a, b) => a + b, 0)).toFixed(4));// Math.abs(parseFloat((this.allCashFlowInHomeCurrency.reduce((a, b) => a + b, 0)).toFixed(4)));
   // console.log(this.TotalReturnOfInvestment);
   if(this.TenureWisePropertyData.length>2){
    for (let k = 0; k < this.TenureWisePropertyData.length; k++) {
      this.yearlabel.push((k + 1));
      let TempyearlyGBPIRR=0;
      let TempyearlyHomeCurrencyIRR=0;
      try {
        TempyearlyGBPIRR=this.ReturnIRR(InitialInvesment, k);
        TempyearlyHomeCurrencyIRR=this.ReturnIRRInHomeCurrency(InitialInvesmentInHomeCurrency, k);
      } catch (error) {
        TempyearlyGBPIRR=0;
        TempyearlyHomeCurrencyIRR=0;
      }
      this.yearlyGBPIRR.push(TempyearlyGBPIRR);
      this.yearlyHomeCurrencyIRR.push(TempyearlyHomeCurrencyIRR);
    }
   }
   
    this.yearlabel.push(this.yearlabel.length + 1);
    //console.log(this.yearlyGBPIRR);
   // console.log(this.yearlyHomeCurrencyIRR);
    //console.log(this.allCahsflow);
  //  this.cashflowdata.push(this.allCahsflow);
    //console.log(this.cashflowdata);
    if(this.calcData.loanOriginationFee == 0){
      this.loanoriginationfee = 0;
    }
    else{
    this.loanoriginationfee = (this.calcData.PropertyValue * (this.calcData.loanAmount / 100)) * ((this.calcData.loanOriginationFee / 100))
    }
    this.initialOutlay = (this.calcData.PropertyValue * ((100 - this.calcData.loanAmount) / 100))
      + (parseFloat(this.calcData.stampDutyLandTax) || 0)
      + this.loanoriginationfee;

    this.avgnetYield = 0;
    this.totalCashFlow = 0;
    for(var i = 0;i<=this.allCahsflow.length-1;i++){
      if(i != this.allCahsflow.length-1){
      var netyield = ((parseFloat(this.allCahsflow[i+1]) / -parseFloat(this.allCahsflow[0])) * 100).toFixed(2)
      this.netYield.push(netyield); 
      this.avgnetYield += parseFloat(netyield);
      } 
      this.totalCashFlow += parseFloat(this.allCahsflow[i]);
      // this.totalCashFlow = this.totalCashFlow - this.allCahsflow[0];
     
    }
   
    this.avgnetYield = (this.avgnetYield / this.netYield.length).toFixed(2);
    this.totalCashFlow = this.totalCashFlow - this.allCahsflow[0]; 
  }
  

  ngAfterViewInit(): void {
    if (!this.cfBarChartRef || !this.cashflowdata || this.cashflowdata.length === 0) {
      return;
    }
    const ctx = this.cfBarChartRef.nativeElement.getContext('2d');
    const labels = this.cashflowdata.map((_: any, i: number) => 'Year ' + (i + 1));
    const values = this.cashflowdata.map((row: any) => row.CashFlow);
    const backgroundColors = values.map((v: number) => v >= 0 ? 'rgba(34,197,94,0.85)' : 'rgba(248,113,113,0.85)');

    new (Chart as any)(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Net Cashflow (£)',
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            fontColor: 'rgba(255,255,255,0.5)',
            fontFamily: 'Inter',
            fontSize: 12,
            boxWidth: 14,
            generateLabels: () => [{
              text: 'Net Cashflow (£)',
              fillStyle: 'rgba(248,113,113,0.85)',
              strokeStyle: 'rgba(248,113,113,0.85)',
              lineWidth: 0,
              hidden: false,
              index: 0,
              datasetIndex: 0
            }]
          }
        },
        tooltips: {
          callbacks: {
            label: (item: any) => ' £' + Number(item.yLabel).toLocaleString()
          }
        },
        scales: {
          xAxes: [{
            gridLines: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              fontColor: 'rgba(255,255,255,0.45)',
              fontFamily: 'Inter',
              fontSize: 12
            }
          }],
          yAxes: [{
            gridLines: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              fontColor: 'rgba(255,255,255,0.45)',
              fontFamily: 'Inter',
              fontSize: 12,
              callback: (value: any) => '£' + Number(value).toLocaleString()
            }
          }]
        }
      }
    });
  }

  formatCurrency(value: number, currencyCode: string): string {
    if (value === null || value === undefined || isNaN(value)) return '0';
    const sym = currencyCode === 'INR' ? '₹' : (currencyCode || '');
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

  makePositive(value){
    return Math.abs(value);
  }

  getBarHeight(cashFlow: number): number {
    const maxCashFlow = Math.max(...this.cashflowdata.map((r: any) => Math.abs(r.CashFlow)));
    if (maxCashFlow === 0) return 4;
    return Math.max(4, Math.round((Math.abs(cashFlow) / maxCashFlow) * 186));
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
    return finance.IRR.apply(this, cashFlow);
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
    return finance.IRR.apply(this, cashFlow);
  }
  goBack(): void {
    this.router.navigate(['/cashflow/step4']);
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
      this.router.navigateByUrl('/login?ref=/cashflow/result');
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
      this.router.navigateByUrl('/login?ref=//cashflow/result');
    }
  }

  shareReport() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingSharebtn = true;
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
          const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": sessionStorage.getItem('UserEmail'), "ResultImageBase64String": contentDataURL };
          const Response = this.dataService.PostAdventumRequest('v1/sendresultonmail', Data).subscribe((response) => {
            if (response.n === 1) {
              alert(response.Msg);
            } else if (response.n === 0) {
              alert(response.Msg);
            } else {
              alert('Something went wrong please try agian later');
            }
            this.loadingSharebtn = false;
          });
        });
      $(".noprint").removeClass("displaynone");
    }
    else {
      this.router.navigateByUrl('/login?ref=//cashflow/result');
    }
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
	
    /*name of the excel-file which will be downloaded. */ 
    fileName= 'CashflowReport.xlsx';  
    cols:any = [{width:30}];
    exportexcel(): void 
        {
           /* table id is passed over here */   
           let element = document.getElementById('cashflowtable');
           console.log(element); 
           const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    
           /* generate workbook and add the worksheet */
           const wb: XLSX.WorkBook = XLSX.utils.book_new();
           XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
           
           for(var i=0;i<=this.calcData.investedTenure+1;i++){
            this.cols.push({width:15});
           }
           ws['!cols'] = this.cols;
          
           /* save to file */
           XLSX.writeFile(wb, this.fileName);
        }

        emailpopup(){
          $("#myModal").modal("show");
        }
      sendexcel(){
        if (this.dataService.EmptyNullOrUndefined(this.Email)){
          alert('Email is mandatory to share Cashflow Result');
        }
        else{
        var multipleUser = this.Email.split(',');
        if(multipleUser.length > 5){
          alert('You cannot share report to more than 5 recipients at a time.')
        }
        else {
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
                var table = document.getElementById("cashflowtable");
                var tablestring = table.outerHTML;
                const data ={
                  "UserId": sessionStorage.getItem('UserId'),
                   "EmailId": this.Email,
                   "table":tablestring,
                   "ResultImageBase64String":contentDataURL
                }
                this.dataService.PostAdventumRequest("v1/generateexcel", data).subscribe(response =>{
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
                });
              });
            $(".noprint").removeClass("displaynone");
        
        }
        else {
          $("#myModal").modal("hide");
          this.router.navigateByUrl('/login?ref=//cashflow/result');
        }
        }
        }
        }
       
      
       
    }
    cancel(){
      $("#myModal").modal("hide");
      this.Email = "";
    }

    // restrictSpecialChar(event){
    //     var regex = /^[A-Za-z0-9@.,]+$/
    //    var isValid = regex.test(this.Email);
    //     if (!isValid) {
    //         //alert("Contains Special Characters.");
    //         console.log(this.Email);
    //         // this.Email = this.Email.replace(this.Email,"");
    //     }
    // }

  }

  
  


