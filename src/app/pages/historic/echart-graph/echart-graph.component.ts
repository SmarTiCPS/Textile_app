import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { KafkaService } from '../../dashboard/sensor-data/websocket.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HistaoricDataService } from '../service/histaoric-data.service';
import { Attribute } from '../../devices/service/device.module';

interface GraphValues {
  name: string;
  value: [string, number];
}

@Component({
  selector: 'app-echart-graph',
  templateUrl: './echart-graph.component.html',
  styleUrls: ['./echart-graph.component.scss'],
})
export class EchartGraphComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Sensor Data';
  @Input() graphTopic: Attribute = {
    id: 'defaultId',
    attribute: 'defaultAttribute',
    unit: 'defaultUnit',
  };

  chartOption: EChartsOption;
  graphData: GraphValues[] = [];
  isRealTimeMode: boolean = true;
  maxDataPoints: number = 200;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  rangeForm = new FormGroup({
    range: this.range,
    startTime: new FormControl<string>('00:00', { nonNullable: true }),
    endTime: new FormControl<string>('23:59', { nonNullable: true }),
  });

  private subscription!: Subscription;
  private sensorSub!: Subscription;

  constructor(
    private kafkaService: KafkaService,
    public historicSensorService: HistaoricDataService
  ) {
    this.chartOption = this.generateChartOption([], this.graphTopic.attribute);
  }

  ngOnInit(): void {
    this.initializeChart();
    this.subscribeToRealTimeData();
    this.setupFormListeners();
  }

  private initializeChart(): void {
    this.chartOption = this.generateChartOption([], this.graphTopic.attribute);
  }

  private subscribeToRealTimeData(): void {
    this.subscription = this.kafkaService.getMessages().subscribe({
      next: (message) => this.handleNewMessage(message),
      error: (err) => {
        console.error('Kafka error:', err);
        this.errorMessage = 'Real-time data connection failed';
      },
    });
  }

  private setupFormListeners(): void {
    this.rangeForm.valueChanges.subscribe(() => {
      this.onSearch();
    });
  }

  onSearch(): void {
    const startDate = this.rangeForm.value.range?.start;
    const endDate = this.rangeForm.value.range?.end;

    if (startDate && endDate) {
      this.fetchHistoricalData(startDate, endDate);
    } else if (startDate) {
      this.fetchHistoricalData(startDate, new Date());
    } else {
      this.switchToRealTimeMode();
    }
  }

  private switchToRealTimeMode(): void {
    this.isRealTimeMode = true;
    this.graphData = [];
    this.errorMessage = null;
    this.updateChart();
  }

  fetchHistoricalData(startDate: Date, endDate: Date): void {
    this.isLoading = true;
    this.isRealTimeMode = false;
    this.errorMessage = null;

    try {
      const startTimestamp = this.combineDateAndTime(
        startDate,
        this.rangeForm.value.startTime || '00:00'
      );
      const endTimestamp = this.combineDateAndTime(
        endDate,
        this.rangeForm.value.endTime || '23:59'
      );

      this.sensorSub = this.historicSensorService
        .getData(startTimestamp, endTimestamp, this.graphTopic.id)
        .subscribe({
          next: (data: any[]) => {
            this.graphData = data
              .map((item) => this.createGraphValue(item.timestamp, item.data))
              .filter(Boolean) as GraphValues[];
            this.updateChart();
          },
          error: (error) => {
            console.error('Error fetching historical data:', error);
            this.errorMessage = 'Failed to load historical data';
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } catch (error) {
      console.error('Error processing date range:', error);
      this.errorMessage = 'Invalid date range';
      this.isLoading = false;
    }
  }

  private createGraphValue(timestamp: any, value: any): GraphValues | null {
    try {
      // Ensure value is a number
      const numericValue = typeof value === 'number' ? value : Number(value);
      if (isNaN(numericValue)) {
        return null;
      }

      const formattedTimestamp = this.formatTimestamp(timestamp);
      if (!formattedTimestamp) {
        return null;
      }

      return {
        name: formattedTimestamp,
        value: [formattedTimestamp, numericValue],
      };
    } catch (error) {
      console.warn('Invalid data point:', { timestamp, value });
      return null;
    }
  }

  handleNewMessage(message: any): void {
    if (!this.isRealTimeMode || !message?.value) return;

    try {
      if (this.graphTopic.id === message.value.idattribute) {
        const graphValue = this.createGraphValue(
          message.timestamp || Date.now(),
          message.value.data
        );
        
        if (graphValue) {
          this.graphData = [
            ...this.graphData.slice(-this.maxDataPoints + 1),
            graphValue
          ];
          this.updateChart();
        }
      }
    } catch (error) {
      console.error('Error processing new message:', error);
    }
  }

  private updateChart(): void {
    this.chartOption = this.generateChartOption(
      this.graphData,
      this.graphTopic.attribute
    );
  }

  private combineDateAndTime(date: Date, time: string): Date {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      return newDate;
    } catch (error) {
      console.error('Error combining date and time:', error);
      return new Date();
    }
  }

  private formatTimestamp(timestamp: any): string {
    try {
      // Handle numeric timestamps (milliseconds or seconds)
      if (typeof timestamp === 'number') {
        // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
        const digitCount = timestamp.toString().length;
        if (digitCount <= 10) {
          timestamp *= 1000; // Convert seconds to milliseconds
        }
        return this.formatDate(new Date(timestamp));
      }

      // Handle string timestamps
      if (typeof timestamp === 'string') {
        // Try parsing as ISO string first
        const isoDate = new Date(timestamp);
        if (!isNaN(isoDate.getTime())) {
          return this.formatDate(isoDate);
        }

        // Try parsing as Unix timestamp string
        if (/^\d+$/.test(timestamp)) {
          const numTimestamp = Number(timestamp);
          return this.formatTimestamp(numTimestamp);
        }
      }

      // Handle Date objects
      if (timestamp instanceof Date) {
        return this.formatDate(timestamp);
      }

      throw new Error('Unsupported timestamp format');
    } catch (error) {
      console.warn('Error formatting timestamp:', timestamp, error);
      // Return current time as fallback
      return this.formatDate(new Date());
    }
  }

  private formatDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  generateChartOption(values: GraphValues[], name: string): EChartsOption {
    // Filter out any invalid values
    const validValues = values.filter(v => 
      v.value && 
      v.value[0] && 
      typeof v.value[1] === 'number' && 
      !isNaN(v.value[1])
    );

    return {
      title: {
        text: `${this.title} (${this.graphTopic.unit})`,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const value = params[0].value;
          try {
            const date = new Date(value[0]);
            const numericValue = Number(value[1]);
            return `
              <strong>${this.graphTopic.attribute}</strong><br/>
              ${date.toLocaleString()}<br/>
              Value: <b>${numericValue.toFixed(2)} ${this.graphTopic.unit}</b>
            `;
          } catch {
            return `Value: <b>${value[1]} ${this.graphTopic.unit}</b>`;
          }
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          formatter: (value: string) => {
            try {
              return new Date(value).toLocaleTimeString();
            } catch {
              return value;
            }
          }
        }
      },
      yAxis: {
        type: 'value',
        name: this.graphTopic.unit,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: `{value} ${this.graphTopic.unit}`
        }
      },
      series: [
        {
          name: this.graphTopic.attribute,
          type: 'line',
          showSymbol: false,
          data: validValues.map(v => v.value),
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.1
          },
          smooth: true
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: true
        },
        {
          start: 0,
          end: 100
        }
      ],
      animation: false
    };
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.sensorSub?.unsubscribe();
  }
}