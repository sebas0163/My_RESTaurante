import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { TimeRecommendationComponent } from './components/time-recommendation/time-recommendation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { AdminReservationsComponent } from './components/admin-reservations/admin-reservations.component';
import { UserReservationsComponent } from './components/user-reservations/user-reservations.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminsComponent } from './components/admins/admins.component';

const routes: Routes = [
  { path: 'time-recommendation-component', component: TimeRecommendationComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User] }   },
  { path: 'feedback-component', component: FeedbackComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User] }   },
  { path: 'menu-component', component: MenuComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User] }   },
  { path: 'user-login-component', component: UserLoginComponent },
  { path: 'user-registration-component', component: UserRegistrationComponent },
  { path: 'admin-reservations-component', component: AdminReservationsComponent, canActivate: [AuthGuard],
  data: { roles: [Role.Admin1, Role.Admin2, Role.Admin3] } },
  { path: 'user-reservations-component', component: UserReservationsComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User] }  },
  { path: 'reset-password-component', component: ResetPasswordComponent },
  { path: 'admins-component', component: AdminsComponent, canActivate: [AuthGuard],
    data: { roles: [Role.Admin1, Role.Admin2, Role.Admin3] } },
  // otherwise redirect to home
  { path: '**', redirectTo: 'user-login-component' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private router: Router) {}
}
