import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { TimeRecommendationComponent } from './components/time-recommendation/time-recommendation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { path: 'time-recommendation-component', component: TimeRecommendationComponent },
  { path: 'feedback-component', component: FeedbackComponent },
  { path: 'menu-component', component: MenuComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router) {}

  navigateToTarget() {
    const url = '/targetaaaaaa'; // URL of the target component
    this.router.navigate([url]);
  }
  
}
