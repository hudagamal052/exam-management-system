import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './pages/admin-dashboard/dashboard/dashboard.component';
import { ExamsComponent } from './pages/admin-dashboard/exams/exams.component';
import { QuestionsComponent } from './pages/admin-dashboard/questions/questions.component';
import { UsersComponent } from './pages/admin-dashboard/users/users.component';
import { AddUserComponent } from './pages/admin-dashboard/users/add-user/add-user.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'questions', component: QuestionsComponent },
      { path: "users", component: UsersComponent},
      { path: "users/add", component: AddUserComponent}
    ],
  },

  {
    path:"login",
    component: LoginComponent
  }
];
