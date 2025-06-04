import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './pages/admin-dashboard/dashboard/dashboard.component';
import { ExamsComponent } from './pages/admin-dashboard/exams/exams.component';
import { QuestionsComponent } from './pages/admin-dashboard/questions/questions.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'questions', component: QuestionsComponent },
    ],
  },
];
