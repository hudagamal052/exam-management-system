import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HomeLayoutComponent } from './pages/home-layout/home-layout.component';
import { HomeStudentComponent } from './pages/home-student/home-student.component';
import { ExamsStudentComponent } from './pages/exams-student/exams-student.component';
import { ResultsStudentComponent } from './pages/results-student/results-student.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { ExamQuestionsComponent } from './pages/exam-questions/exam-questions.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'resetPassword',
        component: ResetPasswordComponent,
    },
    {
        path: 'homeStudent',
        component: HomeLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full',
            },
            {
                path: 'main',
                component: HomeStudentComponent,
            },
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'notifications',
                component: NotificationsComponent,
            },
            {
                path: 'exams',
                component: ExamsStudentComponent,
            },
            {
                path: 'results',
                component: ResultsStudentComponent,
            },
            {
                path: 'exam-questions/:id',
                component: ExamQuestionsComponent,
            },
        ],
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
