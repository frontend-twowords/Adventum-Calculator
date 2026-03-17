import { Component, ViewChild, ElementRef,OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import * as Chart from 'chart.js';
import { environment } from '../../environments/environment';
declare var $: any;
declare global { interface Window { analytics: any; } }
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-atedresult',
  templateUrl: './atedresult.component.html',
  styleUrls: ['./atedresult.component.css']
})
export class AtedresultComponent implements OnInit {

  Email : any;
  MapLoad=true;
  lat :number=0;
  long :number=0;
  calcData: any;
  ctx:any;
  GBPValue:'';
  stampDutyLandTax:any;
  loadingPrintbtn=false;
  loadingDownloadbtn=false;
  loadingSharebtn=false;
  effectiveRate="";
  propertyvalueid:any;
  propertydropdown: any=[];
  atedchargevalue:any;
  constructor(public validation: ValidationService,
    private dataService: DataService,
    private router: Router) { 
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
      this.lat=this.calcData.lat; 
    } 
    if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
      this.long=this.calcData.long; 
    } 
  }
    ngAfterViewInit(): void {
      if(!this.calcData.reportSavedOnServer && !this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))){
        this.reportSaveToServer();
      }
    }
  
    ngOnInit(): void {
      this.calcData = JSON.parse(localStorage.getItem('calcData'));
      this.propertyvalueid=this.calcData.PropertyValue;
      this.atedchargevalue = this.calcData.ATEDCharge;
    }

  
    startagain(): void{
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem("calcData",JSON.stringify(this.calcData));
      // localStorage.clear();
      this.router.navigate(['/']);
    }
  
    
    printScreen() {
      if (!this.validation.isNullEmptyUndefined(sessionStorage.getItem('UserId'))) {
        this.loadingPrintbtn=true;
        window.print();
        this.loadingPrintbtn=false;
      }
      else {
        this.router.navigateByUrl('/login?ref=/ated/result');
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
        this.router.navigateByUrl('/login?ref=/ated/result');
      }
    }
    emailpopup(){
            $("#myModal").modal("show");
          }
     shareReport() {
      if (this.dataService.EmptyNullOrUndefined(this.Email)){
            alert('Email is mandatory to share Stamp Duty Result');
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
              const Data = { "UserId": sessionStorage.getItem('UserId'), "EmailId": this.Email, "ResultImageBase64String": contentDataURL, "CalculatorId" : localStorage.getItem('CalculatorText') };
              console.log(Data);
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
          this.router.navigateByUrl('/login?ref=/ated/result');
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
