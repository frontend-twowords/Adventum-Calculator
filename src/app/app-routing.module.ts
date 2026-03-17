import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import {Step4Component} from './step4/step4.component';
import {Step5Component} from './step5/step5.component';
import {CalculatedirrComponent} from './calculatedirr/calculatedirr.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {CapitalGrowthQueComponent} from './capital-growth-que/capital-growth-que.component';
import {EstimatedRentQueComponent} from './estimated-rent-que/estimated-rent-que.component';
import {CapitalGrowthResultComponent} from './capital-growth-result/capital-growth-result.component';
import {EstimatedWeeklyRentResultComponent} from './estimated-weekly-rent-result/estimated-weekly-rent-result.component';
import { StampDutyQueComponent } from './stamp-duty-que/stamp-duty-que.component';
import { StampDutyResultComponent } from './stamp-duty-result/stamp-duty-result.component';
import { PredictiveForeignQueComponent } from './predictive-foreign-que/predictive-foreign-que.component';
import { PredictiveForeignResultComponent } from './predictive-foreign-result/predictive-foreign-result.component';
 import { AboutComponent } from './about/about.component';
import { from } from 'rxjs';
import { Cashflowstep2Component } from './cashflowstep2/cashflowstep2.component';
import { Cashflowstep3Component } from './cashflowstep3/cashflowstep3.component';
import { Cashflowstep4Component } from './cashflowstep4/cashflowstep4.component';
import { CashflowresultComponent } from './cashflowresult/cashflowresult.component';
import { CashflowStep1Component } from './cashflowstep1/cashflowstep1.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { Atedstep2Component } from './atedstep2/atedstep2.component';
import { AtedresultComponent } from './atedresult/atedresult.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'step1', component: Step1Component},
  {path: 'capital-growth-calculator/step1', component: Step1Component},
  {path: 'estimated-weekly-rent-calculator/step1', component: Step1Component},
  {path: 'predictive-foreign-exchange/step1', component: Step1Component},
  {path: 'stamp-duty-calculator/step1', component: Step1Component},
  {path: 'step2', component: Step2Component},
  {path: 'step3', component: Step3Component},
  {path: 'step4', component: Step4Component},
  {path: 'step5', component: Step5Component},
  {path: 'cashflow/step1', component: CashflowStep1Component},
  {path: 'cashflow/step2', component: Cashflowstep2Component},
  {path: 'cashflow/step3', component: Cashflowstep3Component},
  {path: 'cashflow/step4', component: Cashflowstep4Component},
  {path: 'cashflow/result', component: CashflowresultComponent},
  {path: 'calculated-irr', component: CalculatedirrComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'capital-growth-calculator/question', component: CapitalGrowthQueComponent},
  {path: 'estimated-weekly-rent-calculator/question', component: EstimatedRentQueComponent},
  {path: 'capital-growth-calculator/result', component: CapitalGrowthResultComponent},
  {path: 'estimated-weekly-rent-calculator/result', component: EstimatedWeeklyRentResultComponent},
  {path: 'Predictive-Foreign-calculator/question', component: PredictiveForeignQueComponent},
  {path: 'predictive-foreign-calculator/question', component: PredictiveForeignQueComponent},
  {path: 'predictive-foreign-calculator/result', component: PredictiveForeignResultComponent},
  {path: 'stamp-duty-calculator/question', component: StampDutyQueComponent},
  {path: 'stamp-duty-calculator/result', component: StampDutyResultComponent},
   {path: 'about', component: AboutComponent},
   {path: 'forgotpassword', component:ForgotpasswordComponent},
   {path: 'ated/step1', component: Step1Component},
   {path: 'ated/step2', component: Atedstep2Component},
   {path: 'ated/result', component: AtedresultComponent},
   {path: 'start', component: StartComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'}),
    BrowserAnimationsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
