import { Component, OnInit } from '@angular/core';
import { StudentDetails } from '../../../../models/student-details';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../../../services/admin/result.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detailed-results',
  imports: [CommonModule],
  templateUrl: './detailed-results.component.html',
  styleUrl: './detailed-results.component.css'
})
export class DetailedResultsComponent implements OnInit{
  student!: StudentDetails;
  isLoading: boolean = true;
  constructor(private resultService: ResultService, private router:ActivatedRoute){}

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.getUserDetailsResults(decodeURIComponent(<string>params.get('email')));
    });
  }
  getUserDetailsResults(email:string){
    this.resultService.getResultDetails(email)
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe((value)=>{
      this.student = value;
      console.log(`value: ${JSON.stringify(value)}`);
      
    });
  }

}
