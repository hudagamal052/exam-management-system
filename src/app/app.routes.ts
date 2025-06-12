import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './pages/admin-dashboard/dashboard/dashboard.component';
import { ExamsComponent } from './pages/admin-dashboard/exams/exams.component';
import { QuestionsComponent } from './pages/admin-dashboard/questions/questions.component';
import { UsersComponent } from './pages/admin-dashboard/users/users.component';
import { AddUserComponent } from './pages/admin-dashboard/users/add-user/add-user.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HomeLayoutComponent } from './pages/home-layout/home-layout.component';
import { HomeStudentComponent } from './pages/home-student/home-student.component';
import { ExamsStudentComponent } from './pages/exams-student/exams-student.component';
import { ResultsStudentComponent } from './pages/results-student/results-student.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ExamQuestionsComponent } from './pages/exam-questions/exam-questions.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { authGuard } from './auth.guard';
import { ResultsComponent } from './pages/admin-dashboard/results/results.component';
import { DetailedResultsComponent } from './pages/admin-dashboard/results/detailed-results/detailed-results.component';
import { ProfileComponent } from './pages/admin-dashboard/profile/profile.component';
import { EditProfileComponent } from './pages/admin-dashbaord/edit-profile/edit-profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'questions', component: QuestionsComponent },
      { path: "users", component: UsersComponent },
      { path: "results", component: ResultsComponent },
      { 
        path: "profile",
        component: ProfileComponent,
      },
      
      { path: "profile/edit", component: EditProfileComponent },
      { path: "users/add", component: AddUserComponent },
      {path: "user/:email" , component: DetailedResultsComponent}
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    title: 'Reset Password',
  },
  {
    path: 'homeStudent',
    component: HomeLayoutComponent,
    //canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
      {
        path: 'main',
        component: HomeStudentComponent,
        title: 'Home',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'Notifications',
      },
      {
        path: 'exams',
        component: ExamsStudentComponent,
        title: 'Exams',
      },
      {
        path: 'results',
        component: ResultsStudentComponent,
        title: 'Results',
      },
      {
        path: 'exam-questions/:id',
        component: ExamQuestionsComponent,
        title: 'Exam Questions',
      },
    ],
  },

  {
    path: "**",
    component: NotFoundComponent,
    title: 'Not Found Page',
  }
];
