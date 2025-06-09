import { Component } from '@angular/core';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  items= Array.from({ length: 10 }, (_, i) => i + 1);
}
