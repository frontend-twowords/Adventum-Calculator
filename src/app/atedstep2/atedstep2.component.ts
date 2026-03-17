import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-atedstep2',
  templateUrl: './atedstep2.component.html',
  styleUrls: ['./atedstep2.component.css'],
  animations: [
    trigger('pv', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('fb', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('SI', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
    trigger('N', [
      state(
        'visible',
        style({
          opacity: '1'
        })
      ), state(
        'hide',
        style({
          opacity: '0',
          height: '0px'
        })
      ),
      transition('* => visible', [animate('1500ms ease-out')])
    ]),
  ]
})
export class Atedstep2Component implements OnInit {
  MapLoad = true;
  lat: number = 0;
  long: number = 0;
  PropertyValue = '';
  calcData: any;
  PurchaseType = '';
  InvestmentProperty = '';
  PrimaryResidence = '';
  FirstTimeBuyer = '';
  foreignbuyer='';
  propertydropdown=[];
  constructor(public validation: ValidationService,
    private dataService: DataService,
    private router: Router) {
    this.calcData = JSON.parse(localStorage.getItem('calcData'));
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.lat)) {
      this.lat = this.calcData.lat;
    }
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.long)) {
      this.long = this.calcData.long;
    }
  
    
  }
  ngOnInit(): void {
    this.propertydropdown = this.dataService.dropdownArray;
    if (!this.dataService.EmptyNullOrUndefined(this.calcData.PropertyValue)) {
      this.PropertyValue = this.calcData.PropertyValue;
    }
  
   
  }
  next(): void {
    let flag = true;
    if (!this.dataService.EmptyNullOrUndefined(this.PropertyValue)) {
      this.calcData.PropertyValue = this.PropertyValue;     
      for(let i = 0;i<this.propertydropdown.length;i++){
        if(this.propertydropdown[i].Id == this.PropertyValue){
          this.calcData.PropertyValueText=this.propertydropdown[i].Value;
          this.calcData.ATEDCharge = this.propertydropdown[i].Result;
        }
      }
    } else {
      const element = document.getElementById('PropertyValue');
      element.classList.add('error-input');
      flag = false;
    }

  
    if (flag) {
      this.calcData.reportSavedOnServer=false;
      localStorage.setItem('calcData', JSON.stringify(this.calcData));
      this.router.navigate(['/ated/result']);
    }
  }

  

}
