import { AfterViewInit, Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DataService } from '../data.service';
import {ValidationService} from '../validation.service';
declare var $: any;
import * as Chart from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-capital-growth-result',
  templateUrl: './capital-growth-result.component.html',
  styleUrls: ['./capital-growth-result.component.css']
})
export class CapitalGrowthResultComponent implements OnInit,AfterViewInit {
  Email:any;
  calculatedCapitalGrowth: number;
  calculatedCapitalGrowtharray:any=[];
  MapLoad = true;
  lat :number=0;
  long :number=0;
  calcData: any;
  GBPValue:number=0;
  investedTenure='';
  CaptitalGrowthinHomeCurrency:number=0;
  CaptitalGrowthinHomeCurrencyArray:any=[];
  homeCurrencyFXGrowth=0;
  propertyValue=0;
  propertyValueHomeCurrency=0;
  yearArray=[];
  gbpValuesArray: number[] = [];
  homeCurrencyValuesArray: number[] = [];
  loadingPrintbtn=false;
  loadingDownloadbtn=false;
  loadingSharebtn=false;
  constructor(private router: Router,
              private dataService: DataService,public validation: ValidationService) { }

  ngOnInit(): void {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
	this.GBPValue=this.calcData.PropertyValue;
  this.propertyValue=this.calcData.PropertyValue;
	this.homeCurrencyFXGrowth=parseFloat(parseFloat(this.calcData.homecurrency).toFixed(4));
  this.propertyValueHomeCurrency=this.propertyValue*this.homeCurrencyFXGrowth;
	this.investedTenure=this.calcData.investedTenure;
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long = this.calcData.long;
    }
    this.calculatedCapitalGrowth = parseInt(this.calcData.PropertyValue);
    for (let i = 0; i < parseInt(this.calcData.investedTenure); i++){
      this.calculatedCapitalGrowth += parseFloat((this.calculatedCapitalGrowth * parseInt(this.calcData.capitalgrowth) / 100).toFixed(4));
      this.calculatedCapitalGrowtharray.push(parseFloat((((this.calculatedCapitalGrowth-this.propertyValue)/this.propertyValue)*100).toFixed(4)));
      this.gbpValuesArray.push(parseFloat(this.calculatedCapitalGrowth.toFixed(2)));
      this.homeCurrencyFXGrowth=parseFloat((this.homeCurrencyFXGrowth+(this.homeCurrencyFXGrowth*parseFloat(this.calcData.fxgrowth)/100)).toFixed(4));
      this.CaptitalGrowthinHomeCurrencyArray.push(parseFloat(((((this.calculatedCapitalGrowth*this.homeCurrencyFXGrowth)-this.propertyValueHomeCurrency)/this.propertyValueHomeCurrency)*100).toFixed(4)));
      this.CaptitalGrowthinHomeCurrency=parseFloat((this.calculatedCapitalGrowth*this.homeCurrencyFXGrowth).toFixed(4));
      this.homeCurrencyValuesArray.push(this.CaptitalGrowthinHomeCurrency);
      this.yearArray.push(i+1);
    }
    this.yearArray.push(this.yearArray.length+1);
  }
  ngAfterViewInit(): void {
    const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
      const labels = this.yearArray.slice(0, this.calculatedCapitalGrowtharray.length).map((y: any) => 'Yr ' + y);
      new (Chart as any)(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'GBP Growth',
            borderColor: 'rgba(229,231,235,0.7)',
            backgroundColor: 'transparent',
            pointBackgroundColor: 'rgba(229,231,235,0.7)',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: false,
            data: this.calculatedCapitalGrowtharray,
          }, {
            label: (this.calcData?.homecurrencyText || 'FX') + ' Growth',
            borderColor: '#22c55e',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#22c55e',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: false,
            data: this.CaptitalGrowthinHomeCurrencyArray,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          tooltips: {
            backgroundColor: 'rgba(26,45,79,0.95)',
            cornerRadius: 8,
            callbacks: {
              label: (item: any, data: any) => data.datasets[item.datasetIndex].label + ': ' + item.yLabel.toFixed(1) + '%'
            }
          },
          scales: {
            xAxes: [{
              gridLines: { color: 'rgba(255,255,255,0.05)' },
              ticks: { fontColor: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: 11 }
            }],
            yAxes: [{
              gridLines: { color: 'rgba(255,255,255,0.06)' },
              ticks: {
                fontColor: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: 11,
                callback: (value: any) => value + '%'
              }
            }]
          }
        }
      });


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
      this.router.navigateByUrl('/login?ref=/capital-growth-calculator/result');
    }
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
      this.router.navigateByUrl('/login?ref=/capital-growth-calculator/result');
    }
  }

  emailpopup(){
    $("#myModal").modal("show");
  }

  shareReport() {
    if (this.dataService.EmptyNullOrUndefined(this.Email)){
          alert('Email is mandatory to share Capital Growth Result');
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
        this.loadingSharebtn=true;
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
            contentDataURL=contentDataURL.replace("data:image/png;base64,","");
            const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": this.Email, "ResultImageBase64String": contentDataURL,"CalculatorId" : localStorage.getItem('CalculatorText') };
            const Response = this.dataService.PostAdventumRequest('v1/sendresultonmail', Data).subscribe((response) => {
              if (response.n === 1){
                alert(response.Msg);
                this.Email = "";
                $("#myModal").modal("hide");
              }else if (response.n === 0){
                alert(response.Msg);
              }else{
                alert('Something went wrong please try agian later');
              }
              this.loadingSharebtn=false;
              $("#cancelbtn").removeAttr("disabled");
              $("#secondMain").removeClass("noprint");
            });
          });
          $(".noprint").removeClass("displaynone");
      }
      else {
        $("#myModal").modal("hide");
        this.router.navigateByUrl('/login?ref=/capital-growth-calculator/result');
    
      }
    }
     }
 
    }
 
    
  }
  cancel(){
    $("#myModal").modal("hide");
    this.Email = "";
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
}
