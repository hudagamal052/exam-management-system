import { Component, OnInit } from '@angular/core';
import { GradeCircleComponent } from '../../../components/grade-circle/grade-circle.component';
import { AverageResultsComponent } from '../../../components/average-results/average-results.component';
import { ExamTakenGraphComponent } from '../../../components/exam-taken-graph/exam-taken-graph.component';
import { TestResultsTableComponent } from '../../../components/test-results-table/test-results-table.component';
import { ExamService } from '../../../services/exam.service';
import { Exam, ExamStatus } from '../../../models/exam';

import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexResponsive,
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
};
@Component({
  selector: 'app-dashboard',
  imports: [
    NgApexchartsModule,
    GradeCircleComponent,
    ExamTakenGraphComponent,
    AverageResultsComponent,
    TestResultsTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public chartOptions: ChartOptions;

  constructor(private examService: ExamService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'donut',
        width: 300,
        height: 300,
      },
      labels: [ExamStatus.Active, ExamStatus.Scheduled, ExamStatus.Completed],
      legend: {
        position: 'left',
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        labels: {
          colors: '#374151', // Gray-700 for legend text
        },
      },
      colors: ['#00C4B4', '#3B82F6', '#EF4444'], // Teal, Blue, Red
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  ngOnInit() {
    this.updateChartData();
  }

  updateChartData() {
    const exams: Exam[] = this.examService.getExams();
    const statusCounts = {
      Active: 0,
      Scheduled: 0,
      Completed: 0,
    };

    exams.forEach((exam) => {
      if (exam.status in statusCounts) {
        statusCounts[exam.status]++;
      }
    });

    this.chartOptions.series = [
      statusCounts.Active,
      statusCounts.Scheduled,
      statusCounts.Completed,
    ];
  }
}
