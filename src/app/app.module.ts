import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { CalculatedirrComponent } from './calculatedirr/calculatedirr.component';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { GooglemapComponent } from './googlemap/googlemap.component';
import { CalculatordetailsComponent } from './calculatordetails/calculatordetails.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CapitalGrowthQueComponent } from './capital-growth-que/capital-growth-que.component';
import { EstimatedRentQueComponent } from './estimated-rent-que/estimated-rent-que.component';
import { CapitalGrowthResultComponent } from './capital-growth-result/capital-growth-result.component';
import { EstimatedWeeklyRentResultComponent } from './estimated-weekly-rent-result/estimated-weekly-rent-result.component';

import { PredictiveForeignQueComponent } from './predictive-foreign-que/predictive-foreign-que.component';
import { PredictiveForeignResultComponent } from './predictive-foreign-result/predictive-foreign-result.component';
import { StampDutyQueComponent } from './stamp-duty-que/stamp-duty-que.component';
import { StampDutyResultComponent } from './stamp-duty-result/stamp-duty-result.component';
import { AboutComponent } from './about/about.component';
import { Cashflowstep2Component } from './cashflowstep2/cashflowstep2.component';
import { Cashflowstep3Component } from './cashflowstep3/cashflowstep3.component';
import { Cashflowstep4Component } from './cashflowstep4/cashflowstep4.component';
import { CashflowresultComponent } from './cashflowresult/cashflowresult.component';
import { CashflowStep1Component } from './cashflowstep1/cashflowstep1.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { Atedstep2Component } from './atedstep2/atedstep2.component';
import { AtedresultComponent } from './atedresult/atedresult.component';
import { StartComponent } from './start/start.component';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';
import { CircleProgressComponent } from './shared/circle-progress/circle-progress.component';
import { CityFilterPipe } from './city-filter.pipe';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    FooterComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    CalculatedirrComponent,
    GooglemapComponent,
    CalculatordetailsComponent,
    LoginComponent,
    RegisterComponent,
    CapitalGrowthQueComponent,
    EstimatedRentQueComponent,
    CapitalGrowthResultComponent,
    EstimatedWeeklyRentResultComponent,
    
    PredictiveForeignQueComponent,
    PredictiveForeignResultComponent,
    StampDutyQueComponent,
    StampDutyResultComponent,
    AboutComponent,
    CashflowStep1Component,
    Cashflowstep2Component,
    Cashflowstep3Component,
    Cashflowstep4Component,
    CashflowresultComponent,
    ForgotpasswordComponent,
    Atedstep2Component,
    AtedresultComponent,
    StartComponent,
    ProgressBarComponent,
    CircleProgressComponent,
    CityFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyCzLa8uvrYvNVkr-CO3fT7pfcK_8zD7K08'// 'AIzaSyC2zWldQ_NGnWDRwCbd0X9UKXL1SbbZ45E'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
