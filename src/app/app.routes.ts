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
        path: '**',
        component: NotFoundComponent,
        title: 'Not Found Page',
    },
];
