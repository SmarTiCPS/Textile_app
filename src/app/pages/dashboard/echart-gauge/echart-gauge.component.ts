import { Component, Input, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { KafkaService } from '../sensor-data/websocket.service';

interface GaugeValues {
  temperature_celsius: number;
  humidity: number;
  air_quality: number;
  distance: number;
}

interface GaugeTopic {
  topic: string;
  unit: string;
  limit: number; // Changed to number for better type safety
}

@Component({
  selector: 'app-echart-gauge',
  templateUrl: './echart-gauge.component.html',
  styleUrls: ['./echart-gauge.component.scss']
})
export class EchartGaugeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string = 'Sensor Gauge';
  @Input() gaugeTopic: GaugeTopic = { 
    topic: "temperature_celsius", 
    unit: '°C', 
    limit: 60 
  };
  
  gaugeData: number = 0;
  chartOption: EChartsOption = {};
  private subscription!: Subscription;

  constructor(private kafkaService: KafkaService) {}

  ngOnInit(): void {
    this.initializeChart();
    this.subscribeToKafka();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gaugeTopic'] || changes['gaugeData']) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initializeChart(): void {
    this.updateChart();
  }

  private subscribeToKafka(): void {
    this.subscription = this.kafkaService.getMessages().subscribe({
      next: (message) => this.handleNewMessage(message),
      error: (err) => console.error('Kafka error:', err)
    });
  }

  private handleNewMessage(message: { topic: string; value: any }): void {
    if (this.gaugeTopic.topic === message.topic) {
      this.gaugeData = message.value.data;
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.chartOption = this.generateChartOption(this.gaugeData, this.gaugeTopic);
  }

  private generateChartOption(value: number, gaugeTopic: GaugeTopic): EChartsOption {
    return {
      title: {
        text: this.title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: gaugeTopic.limit,
          splitNumber: 10,
          itemStyle: {
            color: '#FFAB91'
          },
          progress: {
            show: true,
            width: 15
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 15
            }
          },
          axisTick: {
            distance: 0,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: 0,
            length: 14,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 20,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 30,
            fontWeight: 'bolder',
            formatter: `{value} ${gaugeTopic.unit}`,
            color: 'inherit'
          },
          data: [
            {
              value,
              name: gaugeTopic.topic
            }
          ]
        },
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: gaugeTopic.limit,
          itemStyle: {
            color: '#FD7347'
          },
          progress: {
            show: true,
            width: 8
          },
          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value,
              name: gaugeTopic.topic
            }
          ]
        }
      ]
    };
  }
}