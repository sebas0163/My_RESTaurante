import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuRecommendationComponent } from './components/menu-recommendation/menu-recommendation.component';
import { MenuComponent } from './components/menu/menu.component';
import { TimeRecommendationComponent } from './components/time-recommendation/time-recommendation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuRecommendationComponent,
    MenuComponent,
    TimeRecommendationComponent,
    FeedbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
  
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
