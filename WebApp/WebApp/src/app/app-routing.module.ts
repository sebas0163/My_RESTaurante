import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { TimeRecommendationComponent } from './components/time-recommendation/time-recommendation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { AdminReservationsComponent } from './components/admin-reservations/admin-reservations.component';
import { UserReservationsComponent } from './components/user-reservations/user-reservations.component';

const routes: Routes = [
  { path: 'time-recommendation-component', component: TimeRecommendationComponent },
  { path: 'feedback-component', component: FeedbackComponent },
  { path: 'menu-component', component: MenuComponent },
  { path: 'user-login-component', component: UserLoginComponent },
  { path: 'user-registration-component', component: UserRegistrationComponent },
  { path: 'admin-reservations-component', component: AdminReservationsComponent },
  { path: 'user-reservations-component', component: UserReservationsComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router) {}
}
