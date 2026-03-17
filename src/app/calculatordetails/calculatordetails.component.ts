import { Component, OnInit, Input } from '@angular/core';
import {DataService} from './../data.service';
@Component({
  selector: 'app-calculatordetails',
  templateUrl: './calculatordetails.component.html',
  styleUrls: ['./calculatordetails.component.css']
})
export class CalculatordetailsComponent implements OnInit {
  @Input() coldesign: string;
  CalculationDetails: any;
  PropertyValue: boolean;
  PropertyValueText: boolean;
  capitalgrowth: boolean;
  fxgrowth: boolean;
  investedTenure: boolean;
  letteingManagFee: boolean;
  loanAmount: boolean;
  mortgageInterestRate: boolean;
  mortgageTenure: boolean;
  mortgageType: boolean;
  optmortgage: boolean;
  rentalGrowthEscalation: boolean;
  rentalYeild: boolean;
  stampDutyLandTax: boolean;
  loanOriginationFee: boolean;
  homecurrency: boolean;
  groundRent: boolean;
  serviceCharges: boolean;
  miscelleneousExpense: boolean;
  CalculatorType: string;
  InvestmentGBP:boolean;
  SelfInvestment:boolean;
  Nationality:boolean;
  PrimaryResidence:boolean;
  InvestmentProperty:boolean;
  FirstTimeBuyer:boolean;
  PurchaseType:boolean;
  ForeignBuyer:boolean;
  constructor(private dataservice: DataService) {
    this.CalculatorType = localStorage.getItem('CalculatorType');
    this.CalculationDetails = JSON.parse(localStorage.getItem('calcData'));
    this.CalculationDetails.homecurrency = parseFloat(this.CalculationDetails.homecurrency).toFixed(2);
    this.PropertyValue = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.PropertyValue) ? false : true;
    this.PropertyValueText = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.PropertyValueText) ? false : true;
    this.capitalgrowth = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.capitalgrowth) ? false : true;
    this.fxgrowth = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.fxgrowth) ? false : true;
    this.investedTenure = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.investedTenure) ? false : true;
    this.letteingManagFee = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.letteingManagFee) ? false : true;
    this.loanAmount = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.loanAmount) ? false : true;
    this.mortgageInterestRate = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.mortgageInterestRate) ? false : true;
    this.mortgageTenure = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.mortgageTenure) ? false : true;
    this.mortgageType = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.mortgageType) ? false : true;
    this.optmortgage = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.optmortgage) ? false : true;
    this.rentalGrowthEscalation = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.rentalGrowthEscalation) ? false : true;
    this.rentalYeild = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.rentalYeild) ? false : true;
    this.stampDutyLandTax = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.stampDutyLandTax) ? false : true;
    this.homecurrency = this.dataservice.isNotNo(this.CalculationDetails.homecurrency) ? false : true;
    this.loanOriginationFee = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.loanOriginationFee) ? false : true;
    this.groundRent = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.groundRent) ? false : true;
    this.serviceCharges = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.serviceCharges) ? false : true;
    this.miscelleneousExpense = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.miscelleneousExpense) ? false : true;
    this.InvestmentGBP = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.InvestmentGBP) ? false : true;
    this.SelfInvestment = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.SelfInvestment) ? false : true;
    this.Nationality = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.Nationality) ? false : true;
    this.InvestmentProperty = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.InvestmentProperty) ? false : true;
    this.PrimaryResidence = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.PrimaryResidence) ? false : true;
    this.FirstTimeBuyer = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.FirstTimeBuyer) ? false : true;
    this.PurchaseType = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.PurchaseType) ? false : true;
    this.ForeignBuyer = this.dataservice.EmptyNullOrUndefined(this.CalculationDetails.ForeignBuyer) ? false : true;
  }
  ngOnInit(): void {
  }
}
