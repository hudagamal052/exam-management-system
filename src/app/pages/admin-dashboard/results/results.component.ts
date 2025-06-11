import { Component } from '@angular/core';
import { UserState } from '../../../models/user-state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  students: UserState[] = [
    {
      image:"",
      name:"moataz",
      email:"moataz.noaman12@gmail.com",
      phone:"01098518194",
      attendedExmas:15,
      activeExmas:3,
      totalScore:250,
      levelAndSemster:"2 2th"
    },
    {
      image:"",
      name:"moataz",
      email:"moataz.noaman12@gmail.com",
      phone:"01098518194",
      attendedExmas:15,
      activeExmas:3,
      totalScore:250,
      levelAndSemster:"2 2th"
    },

    {
      image:"",
      name:"moataz",
      email:"moataz.noaman12@gmail.com",
      phone:"01098518194",
      attendedExmas:15,
      activeExmas:3,
      totalScore:250,
      levelAndSemster:"2 2th"
    },
    {
      image:"",
      name:"moataz",
      email:"moataz.noaman12@gmail.com",
      phone:"01098518194",
      attendedExmas:15,
      activeExmas:3,
      totalScore:250,
      levelAndSemster:"2 2th"
    },
    {
      image:"",
      name:"moataz",
      email:"moataz.noaman12@gmail.com",
      phone:"01098518194",
      attendedExmas:15,
      activeExmas:3,
      totalScore:250,
      levelAndSemster:"2 2th"
    },
  ]
}
