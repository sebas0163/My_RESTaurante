import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuRecommendationComponent } from './components/menu-recommendation/menu-recommendation.component';
import { TimeRecommendationComponent } from './components/time-recommendation/time-recommendation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { path: 'menu-recommendation-component', component: MenuRecommendationComponent },
  { path: 'time-recommendation-component', component: TimeRecommendationComponent },
  { path: 'feedback-component', component: FeedbackComponent },
  { path: 'menu-component', component: MenuComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
