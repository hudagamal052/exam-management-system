import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserExamsService } from '../../services/user-exams.service';
import { ExamStatistics } from '../../models/exam-statistics';
declare var ApexCharts: any;

@Component({
  selector: 'app-home-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-student.component.html',
  styleUrl: './home-student.component.css'
})
export class HomeStudentComponent implements OnInit {
  numberOfExams: number = 0;
  numberOfPassedExams: number = 0;
  numberOfFailedExams: number = 0;
  chartLoaded: boolean = false;
  private chart: any = null;

  @ViewChild('pieChart', { static: true }) pieChart!: ElementRef;

  constructor(
    private userExamsService: UserExamsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadExamStatistics();
  }

  private loadExamStatistics(): void {
    this.userExamsService.getExamStatistics().subscribe({
      next: (stats: ExamStatistics) => {
        this.numberOfExams = stats.totalExams;
        this.numberOfPassedExams = stats.passedExams;
        this.numberOfFailedExams = stats.failedExams;
        setTimeout(() => this.initChart(), 500);
      },
      error: (error) => {
        console.error('Error loading exam statistics:', error);
      }
    });
  }

  private initChart(retryCount: number = 5, retryDelay: number = 200): void {
    const element = this.pieChart.nativeElement;
    if (!element || typeof ApexCharts === 'undefined') {
      if (retryCount > 0) {
        console.warn(`Chart element or ApexCharts not ready, retrying (${retryCount} attempts left)...`);
        setTimeout(() => this.initChart(retryCount - 1, retryDelay), retryDelay);
      } else {
        console.error('Failed to initialize chart: ApexCharts or #pie-chart element unavailable.');
      }
      return;
    }

    const options = {
      series: [this.numberOfPassedExams, this.numberOfFailedExams],
      colors: ['#38B2AC', '#EF4444'],
      chart: {
        height: '100%',
        width: '100%',
        type: 'pie'
      },
      stroke: { colors: ['white'] },
      plotOptions: {
        pie: {
          dataLabels: { offset: -25 }
        }
      },
      labels: ['Passed', 'Failed'],
      dataLabels: {
        enabled: true,
        style: { fontFamily: 'Inter, sans-serif' }
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif'
      },
      responsive: [{
        breakpoint: 640,
        options: {
          chart: {
            height: '300px'
          },
          legend: {
            fontSize: '12px'
          }
        }
      }]
    };

    try {
      this.chart = new ApexCharts(element, options);
      this.chart.render();
      this.chartLoaded = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Chart rendering error:', error);
    }
  }
}