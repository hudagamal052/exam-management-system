import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Define routes in a separate file

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ],
}).catch(err => console.error(err));
