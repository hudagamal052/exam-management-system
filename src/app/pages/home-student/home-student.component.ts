import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
declare var ApexCharts: any;

@Component({
  selector: 'app-home-student',
  standalone: true,
  imports: [],
  templateUrl: './home-student.component.html',
  styleUrl: './home-student.component.css'
})
export class HomeStudentComponent implements OnInit, OnChanges {
  numberOfExams: number = 11;
  numberOfPassedExams: number = 5;
  numberOfFailedExams: number = 6;
  chartLoaded: boolean = false;
  private chart: any = null;

  @ViewChild('pieChart', { static: true }) pieChart!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => this.initChart(), 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['numberOfPassedExams'] || changes['numberOfFailedExams']) && this.chart) {
      try {
        this.chart.updateSeries([this.numberOfPassedExams, this.numberOfFailedExams]);
        this.chartLoaded = true;
        this.cdr.detectChanges();
        console.log('Chart updated with new series:', [this.numberOfPassedExams, this.numberOfFailedExams]);
      } catch (error) {
        console.error('Chart update error:', error);
      }
    }
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