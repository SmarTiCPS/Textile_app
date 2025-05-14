import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

interface graphValues {
  data: string;
  date: string; // Assuming date is a string in ISO format
  typeevent: string;
}

@Component({
  selector: 'app-historic-chart',
  templateUrl: './historic-chart.component.html',
  styleUrls: ['./historic-chart.component.scss']
})
export class HistoricChartComponent implements OnChanges {
  @Input() echartTopic!:  {idtypeevent:string , typeevent:string}; // Input for the chart topic
  @Input() echartData!: graphValues[]; // Input for the chart data
  
  chartOption: EChartsOption; // ECharts configuration
  gaugeName: string = 'Temperature Rating'; // Default gauge name

  constructor() {
    this.chartOption = this.generateChartOption([], this.gaugeName); // Initialize chart
  }

  // React to changes in input properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['echartData'] && this.echartData && this.echartTopic) {
      this.handleNewMessage(this.echartData, this.echartTopic.typeevent);
    }
  }

  // Handle new data from the parent component
  private handleNewMessage(message: graphValues[], topic: string): void {
    this.updateGaugeData(topic, this.transformData(message));
  }

  // Transform raw data into the format expected by ECharts
  private transformData(data: graphValues[]): [string, number][] {
    return data.map(item => [item.date, parseFloat(item.data)]);
  }

  // Update the gauge chart with new data
  updateGaugeData(newName: string, newValues: [string, number][]): void {
    this.gaugeName = newName;
    this.chartOption = this.generateChartOption(newValues, newName);
  }

  // Generate ECharts configuration
  private generateChartOption(values: [string, number][], name: string): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const date = new Date(params[0].value[0]);
          return `${date.toLocaleString()} : ${params[0].value[1]}`;
        }
      },
      xAxis: { type: 'time' },
      yAxis: { type: 'value' },
      series: [{
        name: 'Sensor Data',
        type: 'line',
        showSymbol: false,
        data: values
      }]
    };
  }
}