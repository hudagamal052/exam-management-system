import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam';
import { ExamStatus } from '../../models/exam';
import { CommonModule } from '@angular/common';

import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ApexPlotOptions,
  ApexStroke,
  ApexDataLabels,
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-grade-circle',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './grade-circle.component.html',
  styleUrl: './grade-circle.component.css',
})
export class GradeCircleComponent implements OnInit {
  public chartOptions: ChartOptions;
  public ExamStatus = ExamStatus;
  private statusCounts: { [key in ExamStatus]: number } = {
    [ExamStatus.Active]: 0,
    [ExamStatus.Scheduled]: 0,
    [ExamStatus.Completed]: 0,
  };

  constructor(private examService: ExamService) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'donut',
        height: 230,
        animations: {
          enabled: true,
          speed: 800,
          dynamicAnimation: {
            enabled: true,
            speed: 800,
          },
        },
      },
      labels: [ExamStatus.Active, ExamStatus.Scheduled, ExamStatus.Completed],
      legend: {
        position: 'left',
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        markers: {
          strokeWidth: 0,
          fillColors: ['teal', 'blue', 'red'],
          shape: 'circle',
          offsetX: 0,
          offsetY: 0,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 2,
        },
      },
      colors: ['teal', 'blue', 'red'], // Teal, Blue, Red
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial',
                fontWeight: 600,
                color: '#1f2937',
              },
              value: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial',
                fontWeight: 400,
                color: '#4b5563',
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial',
                fontWeight: 600,
                color: '#1f2937',
              },
            },
          },
        },
      },
      stroke: {
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
              fontSize: '12px',
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
    this.examService.getExams().subscribe({
      next: (exams: Exam[]) => {
    this.statusCounts = {
      [ExamStatus.Active]: 0,
      [ExamStatus.Scheduled]: 0,
      [ExamStatus.Completed]: 0,
    };

    exams.forEach((exam) => {
          if (exam.status && Object.values(ExamStatus).includes(exam.status)) {
        this.statusCounts[exam.status]++;
      }
    });

    this.chartOptions.series = [
      this.statusCounts[ExamStatus.Active],
      this.statusCounts[ExamStatus.Scheduled],
      this.statusCounts[ExamStatus.Completed],
    ];
      },
      error: (error) => {
        console.error('Error loading exams for chart:', error);
      }
    });
  }

  getStatusCount(status: ExamStatus): number {
    return this.statusCounts[status] || 0;
  }
}
