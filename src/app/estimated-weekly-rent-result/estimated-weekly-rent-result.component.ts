import { AfterViewInit, Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
declare var $: any;
import * as Chart from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-estimated-weekly-rent-result',
  templateUrl: './estimated-weekly-rent-result.component.html',
  styleUrls: ['./estimated-weekly-rent-result.component.css']
})
export class EstimatedWeeklyRentResultComponent implements OnInit,AfterViewInit {
  Email : any;
  calculatedWeeklyRent: number;
  MapLoad = true;
  lat :number=0;
  long :number=0;
  calcData: any;
  GBPValue='';

  // Computed display values
  get weeklyGBP(): number { return this.calculatedWeeklyRent || 0; }
  get monthlyGBP(): number { return parseFloat((this.weeklyGBP * 52 / 12).toFixed(0)); }
  get annualGBP(): number { return parseFloat((this.weeklyGBP * 52).toFixed(0)); }
  get grossYield(): number {
    const pv = parseFloat(this.calcData?.PropertyValue);
    if (!pv || !this.annualGBP) return 0;
    return parseFloat(((this.annualGBP / pv) * 100).toFixed(2));
  }
  get homeCurrencyCode(): string { return this.calcData?.homecurrencyText || ''; }
  get fxRate(): number { return parseFloat(this.calcData?.homecurrency) || 0; }
  get weeklyHome(): number { return Math.round(this.weeklyGBP * this.fxRate); }
  get monthlyHome(): number { return Math.round(this.monthlyGBP * this.fxRate); }
  get annualHome(): number { return Math.round(this.annualGBP * this.fxRate); }
  private fmtINR(v: number): string {
    if (v >= 10000000) return (v / 10000000).toFixed(2) + ' Cr';
    if (v >= 100000)   return (v / 100000).toFixed(2) + ' L';
    return this.validation.amountWithLakhComma(v.toString());
  }
  get weeklyHomeFmt(): string { return this.fmtINR(this.weeklyHome); }
  get monthlyHomeFmt(): string { return this.fmtINR(this.monthlyHome); }
  get annualHomeFmt(): string { return this.fmtINR(this.annualHome); }
  HomeCurrency:number=0;
  RentalYieldValue='';
  loadingPrintbtn=false;
  loadingDownloadbtn=false;
  loadingSharebtn=false;
  constructor(private router: Router,
              private dataService: DataService,
              public validation: ValidationService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    this.GBPValue=this.calcData.PropertyValue;
    this.RentalYieldValue=this.calcData.rentalYeild;
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long = this.calcData.long;
    }
    // tslint:disable-next-line: radix
    this.calculatedWeeklyRent = (parseInt(this.calcData.PropertyValue) / 52) * (parseInt(this.calcData.rentalYeild) / 100);
    this.HomeCurrency= Math.round(this.calculatedWeeklyRent*this.calcData.homecurrency);


    // const ctx = $('#canvas')[0].getContext('2d');
    //   const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
		//   gradientStroke.addColorStop(0, '#1d1751');
		//   gradientStroke.addColorStop(1, '#f7f7f7');
		//   const gradientStroke1 = ctx.createLinearGradient(500, 0, 100, 0);
		//   gradientStroke1.addColorStop(0, '#1aaf4b');
    //   gradientStroke1.addColorStop(1, '#f7f7f7');
    //   var myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //       labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    //       datasets: [{
    //         label: 'GBP',
    //         borderColor: gradientStroke,
    //         pointBorderColor: gradientStroke,
    //         pointBackgroundColor: gradientStroke,
    //         pointHoverBackgroundColor: gradientStroke,
    //         pointHoverBorderColor: gradientStroke,
    //         pointRadius: 0,
    //         fill: false,
    //         borderWidth: 9,
    //         borderCapStyle: 'round',
    //         data: [9000,
		// 	9000,
		// 	11000,
		// 	13000,
		// 	13000,
		// 	13000,
		// 	12000,
		// 	12000,
		// 	12000,
		// 	13000],
    //       }, {
    //         label: 'INR ($)',
    //         borderColor: gradientStroke1,
    //         pointBorderColor: gradientStroke1,
    //         pointBackgroundColor: gradientStroke1,
    //         pointHoverBackgroundColor: gradientStroke1,
    //         pointHoverBorderColor: gradientStroke1,
    //         pointRadius: 0,
    //         fill: false,
    //         borderWidth: 9,
    //         borderCapStyle: 'round',
    //         data: [
		// 		3000,
		// 		3000,
		// 		5000,
		// 		5000,
		// 		5000,
		// 		6000,
		// 		6000,
		// 		8000,
		// 		8000,
		// 		8000


		// 		],
    //       }]
    //     },
    //     options: {
    //       legend: {
    //         display: true
    //       },
    //       responsive: true,
    //       title: {
    //         display: false,
    //         text: 'Yearly IRR (Internal Rate of Return)'
    //       },
    //       scales: {
    //         xAxes: [{
    //           display: true,
    //           scaleLabel: {
    //             display: true,
    //             labelString: 'Year'
    //           },
    //         }],
    //         yAxes: [{
    //           display: true,
    //           scaleLabel: {
    //           display: true,
    //           labelString: 'Percentage'
    //         }
    //         }]
    //       }
    //     }
    //   });
    


	  // const ctx2 = $('#canvas2')[0].getContext('2d');
    //   const gradientStroke2 = ctx2.createLinearGradient(500, 0, 100, 0);
		//   gradientStroke2.addColorStop(0, '#1d1751');
		//   gradientStroke2.addColorStop(1, '#f7f7f7');
		//   const gradientStroke3 = ctx2.createLinearGradient(500, 0, 100, 0);
		//   gradientStroke3.addColorStop(0, '#1aaf4b');
    //   gradientStroke3.addColorStop(1, '#f7f7f7');
    //   var myChart = new Chart(ctx2, {
    //     type: 'line',
    //     data: {
    //       labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    //       datasets: [{
    //         label: 'GBP',
    //         borderColor: gradientStroke,
    //         pointBorderColor: gradientStroke,
    //         pointBackgroundColor: gradientStroke,
    //         pointHoverBackgroundColor: gradientStroke,
    //         pointHoverBorderColor: gradientStroke,
    //         pointRadius: 0,
    //         fill: false,
    //         borderWidth: 9,
    //         borderCapStyle: 'round',
    //         data: [
		// 		9,
		// 		9,
		// 		11,
		// 		13,
		// 		13,
		// 		13,
		// 		12,
		// 		12,
		// 		12,
		// 		13

		//    /*randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor(),
		//    randomScalingFactor()*/
		//    ],
    //       }, {
    //         label: 'INR ($)',
    //         borderColor: gradientStroke1,
    //         pointBorderColor: gradientStroke1,
    //         pointBackgroundColor: gradientStroke1,
    //         pointHoverBackgroundColor: gradientStroke1,
    //         pointHoverBorderColor: gradientStroke1,
    //         pointRadius: 0,
    //         fill: false,
    //         borderWidth: 9,
    //         borderCapStyle: 'round',
    //         data: [
		// 		3,
		// 		3,
		// 		5,
		// 		5,
		// 		5,
		// 		6,
		// 		6,
		// 		8,
		// 		8,
		// 		8


		// 		],

    //       }]
    //     },
    //     options: {
    //       legend: {
    //         display: true
    //       },
    //       responsive: true,
    //       title: {
    //         display: false,
    //         text: 'Yearly IRR (Internal Rate of Return)'
    //       },
    //       scales: {
    //         xAxes: [{
    //           display: true,
    //           scaleLabel: {
    //             display: true,
    //             labelString: 'Year'
    //           },
    //         }],
    //         yAxes: [{
    //           display: true,
    //           scaleLabel: {
    //           display: true,
    //           labelString: 'Percentage'
    //         }
    //         }]
    //       }
    //     }
    //   });
  }
  ngAfterViewInit(): void {
    if(!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))){
      this.reportSaveToServer();
    }
  }
  startagain(): void {
    localStorage.removeItem('calcData');
    this.router.navigate(['/']);
  }

   
  printScreen() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingPrintbtn=true;
      window.print();
      this.loadingPrintbtn=false;
    }
    else {
      this.router.navigateByUrl('/login?ref=/estimated-weekly-rent-calculator/result');
    }
  }

  convetToPDF() {
    if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
      this.loadingDownloadbtn=true;
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
          this.loadingDownloadbtn=false;
        });
      $(".noprint").removeClass("displaynone");
      
    }
    else {
      this.router.navigateByUrl('/login?ref=/estimated-weekly-rent-calculator/result');
    }
  }

   emailpopup(){
          $("#myModal").modal("show");
        }

  shareReport() {
    if (this.dataService.EmptyNullOrUndefined(this.Email)){
          alert('Email is mandatory to share Estimated Weekly Rent Result');
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
            const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": this.Email, "ResultImageBase64String": contentDataURL,"CalculatorId" : localStorage.getItem('CalculatorText') };
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
        this.router.navigateByUrl('/login?ref=/estimated-weekly-rent-calculator/result');
      }
    }
      }
  
    }
 
   
  }
  reportSaveToServer(){
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
            contentDataURL=contentDataURL.replace("data:image/png;base64,","");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "CalculatorId": localStorage.getItem('CalculatorType').toString(), "ResultImageBase64String": contentDataURL };
            const Response = this.dataService.PostAdventumRequest('v1/saveuserresult', Data).subscribe((response) => {
              this.calcData.reportSavedOnServer=true;
              localStorage.setItem("calcData",JSON.stringify(this.calcData));
            });
          });
          $(".noprint").removeClass("displaynone");
      }
    }, 5000);
    
  }

   cancel(){
      $("#myModal").modal("hide");
      this.Email = "";
    }
}
