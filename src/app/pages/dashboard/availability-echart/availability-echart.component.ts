import { Component, Input, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
export interface trafficChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
  fill: ApexFill;
}
@Component({
  selector: 'app-availability-echart',
  templateUrl: './availability-echart.component.html',
  styleUrl: './availability-echart.component.scss'
})
export class AvailabilityEchartComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @Input() subject !:string;
  public trafficChart!: Partial<trafficChart> | any;
  constructor(){
      // yearly breakup chart
      this.trafficChart = {
        series: [ 3500, 506],
        labels: [ 'Refferal Traffic', 'Oragnic Traffic'],
        chart: {
          type: 'donut',
          fontFamily: "'Plus Jakarta Sans', sans-serif;",
          foreColor: '#adb0bb',
          toolbar: {
            show: false,
          },
          height: 160,
        },
        fill: {
          type: "gradient"
        },
        colors: [  'rgb(75, 208, 139)','#fb977d'],
        
        plotOptions: {
          pie: {
            donut: {
              size: '80%',
              background: 'none',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '12px',
                  
                  offsetY: 5,
                },
                value: {
                  show: true,
                },
              },
            },
          },
        },
        stroke: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
            },
          },
        ],
        tooltip: {
          enabled: true,
        },
      };
  }
}