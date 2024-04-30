import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { TimeRecommendationComponent } from './components/time-recommendation/time-recommendation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';

const routes: Routes = [
  { path: 'time-recommendation-component', component: TimeRecommendationComponent },
  { path: 'feedback-component', component: FeedbackComponent },
  { path: 'menu-component', component: MenuComponent },
  { path: 'user-login-component', component: UserLoginComponent },
  { path: 'user-registration-component', component: UserRegistrationComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router) {}
}
