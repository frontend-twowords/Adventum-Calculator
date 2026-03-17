import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import{Router} from '@angular/router';
import { trigger,state,style,animate,transition } from '@angular/animations';
import { ValidationService } from '../validation.service';
@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css'],
  animations: [
    trigger('affirst',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('1.5s ease-out')])
    ]),
    trigger('asfirst',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('2s ease-out')])
    ]),
    trigger('atfirst',[
      state(
        'visible',
        style({
          opacity:'1'
         })
        ),state(
          'hide',
          style({
            opacity:'0',
            height:'0px'
           })
          ),
        transition('* => visible', [animate('2.5s ease-out')])
    ])
  ]
})
export class Step5Component implements OnInit {
  calcData:any;
  letteingManagFee:string="";
  groundRent:string="";
  serviceCharges:string="";
  miscelleneousExpense:string="";
  MapLoad=true;
  lat :number=0;
  long :number=0;

  constructor(private router:Router,
    private dataService: DataService,
    public validation:ValidationService) { 
      this.calcData=JSON.parse(localStorage.getItem("calcData"));
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.letteingManagFee)){
        this.letteingManagFee=this.calcData.letteingManagFee;
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.groundRent)){
        this.groundRent=this.calcData.groundRent;
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.serviceCharges)){
        this.serviceCharges=this.calcData.serviceCharges;
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.miscelleneousExpense)){
        this.miscelleneousExpense=this.calcData.miscelleneousExpense;
      }
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.lat)){
        this.lat=this.calcData.lat; 
      } 
      if(!this.dataService.EmptyNullOrUndefined(this.calcData.long)){
        this.long=this.calcData.long; 
      } 
    }
  ngOnInit(): void {
  }
  next(){
    let flag=true;
    if(!this.dataService.EmptyNullOrUndefined(this.letteingManagFee)){
      this.calcData.letteingManagFee=this.letteingManagFee;
    }else{
      let element=document.getElementById("letteingManagFee");
      element.classList.add("error-input");
      flag=false;
    }
    if(!this.dataService.EmptyNullOrUndefined(this.groundRent)){
      this.calcData.groundRent=this.groundRent;
    }
    
    if(!this.dataService.EmptyNullOrUndefined(this.serviceCharges)){
      this.calcData.serviceCharges=this.serviceCharges;
    }
   
    if(!this.dataService.EmptyNullOrUndefined(this.miscelleneousExpense)){
      this.calcData.miscelleneousExpense=this.miscelleneousExpense;
    }
    
    if(flag)
    {
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem("calcData",JSON.stringify(this.calcData));
      this.router.navigate(['/calculated-irr'])
    }
  }
}
