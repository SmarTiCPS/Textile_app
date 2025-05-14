import { Component, AfterViewInit, OnInit  } from '@angular/core';
import {  ElementRef, ViewChild } from '@angular/core';


@Component({
    selector: 'app-plan',
    styleUrl:'./plan.component.css',
    templateUrl: './plan.component.html'
  })
export class AppPlanComponent implements OnInit {
    @ViewChild('imageCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('floorPlanCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('floorCanvas', { static: true }) floorCanvas!: ElementRef;

  private ctx1!: CanvasRenderingContext2D;
  private context!: CanvasRenderingContext2D;

  private sensors: { x: number, y: number, id: string }[] = [
    { x: 100, y: 100, id: 'sensor1' },
    { x: 300, y: 200, id: 'sensor2' },
    { x: 500, y: 400, id: 'sensor3' }
  ];

  private sensorStates: { [key: string]: boolean } = {
    sensor1: false,
    sensor2: false,
    sensor3: false
  };

  constructor() {
    // Do not access `canvasRef.nativeElement` here. It will be undefined.
  }

  ngOnInit(): void {
    this.context = (this.floorCanvas.nativeElement as HTMLCanvasElement).getContext('2d')!;
    this.drawFloorPlan2();
  }

  drawFloorPlan2(): void {
    // Clear the canvas
    this.context.clearRect(0, 0, this.floorCanvas.nativeElement.width, this.floorCanvas.nativeElement.height);
  
    // Example: Drawing the outer walls (adjust coordinates as needed)
    this.context.beginPath();
    this.context.moveTo(50, 50);
    this.context.lineTo(250, 50);
    this.context.lineTo(250, 150);
    this.context.lineTo(750, 150);
    this.context.lineTo(750, 850);
    this.context.lineTo(850, 850);
    this.context.lineTo(850, 1050);
    this.context.lineTo(750, 1050);
    this.context.lineTo(750, 850);
    this.context.lineTo(550, 850);
    this.context.lineTo(550, 1050);
    this.context.lineTo(750, 1050);
    this.context.lineTo(750, 850);
    this.context.lineTo(50, 850);
    this.context.lineTo(50, 150);
    this.context.lineTo(250, 150);
    this.context.lineTo(50, 150);
    this.context.closePath();
    this.context.stroke();
  
    // Add more drawing code for the inner walls, doors, arrows, numbers, etc.
    this.floorCanvas.nativeElement.addEventListener('click', (event:any) => {
      const x = event.offsetX;
      const y = event.offsetY;
      // Check if the click is within a specific area and perform an action
    })
  
  }


  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx1 = canvas.getContext('2d')!;
    this.drawFloorPlan();
    this.drawFloorPlan1();
    this.drawSensors();
    this.animateSensors();

    // Add event listener after the canvas is initialized
    canvas.addEventListener('click', (event) => this.handleClick(event));
  }

  handleClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.sensors.forEach(sensor => {
      const distance = Math.sqrt((x - sensor.x) ** 2 + (y - sensor.y) ** 2);
      if (distance <= 10) {
        alert(`Clicked on ${sensor.id}`);
      }
    });
  }

  animateSensors(): void {
    const animate = () => {
      // Clear the canvas and redraw the floor plan and sensors
      this.ctx1.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      this.drawFloorPlan();
      this.drawFloorPlan1();
      this.drawSensors();

      // Update sensor states (e.g., simulate events)
      this.sensors.forEach(sensor => {
        if (this.sensorStates[sensor.id]) {
          this.ctx1.fillStyle = 'red'; // Active state
        } else {
          this.ctx1.fillStyle = 'blue'; // Inactive state
        }
        this.ctx1.beginPath();
        this.ctx1.arc(sensor.x, sensor.y, 10, 0, 2 * Math.PI);
        this.ctx1.fill();
      });

      // Simulate sensor events (toggle states)
      setTimeout(() => {
        this.sensorStates['sensor1'] = !this.sensorStates['sensor1'];
        this.sensorStates['sensor2'] = !this.sensorStates['sensor2'];
        this.sensorStates['sensor3'] = !this.sensorStates['sensor3'];
      }, 1000);

      requestAnimationFrame(animate);
    };

    animate();
  }

  drawSensors(): void {
    this.sensors.forEach(sensor => {
      this.ctx1.fillStyle = 'blue';
      this.ctx1.beginPath();
      this.ctx1.arc(sensor.x, sensor.y, 10, 0, 2 * Math.PI); // Draw a circle for the sensor
      this.ctx1.fill();
    });
  }

  drawFloorPlan(): void {
    // Draw the floor plan (e.g., walls, rooms)
    this.ctx1.strokeStyle = '#000';
    this.ctx1.lineWidth = 2;

    // Example: Draw a rectangle for a room
    this.ctx1.strokeRect(50, 50, 700, 500);
  } 
  
  drawFloorPlan1() {
    if (!this.ctx1) return;
    const ctx1 = this.ctx1;

    // Set canvas size
    ctx1.canvas.width = 800;
    ctx1.canvas.height = 900;

    // Clear canvas
    ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);

    // **Draw Walls (Black Lines)**
    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 4;

    // Outer boundary
    ctx1.strokeRect(50, 50, 700, 600);

    // Internal partitions (example)
    ctx1.lineWidth = 3;
    ctx1.strokeRect(50, 50, 200, 150); // Room 01
    ctx1.strokeRect(250, 50, 200, 150); // Room 02
    ctx1.strokeRect(450, 50, 300, 150); // Room 03
    ctx1.strokeRect(50, 200, 700, 300); // Large Hall (03)
    ctx1.strokeRect(50, 500, 300, 150); // Room 04
    ctx1.strokeRect(350, 500, 400, 150); // Stairs (06, 07)

    // **Mark Room Numbers**
    ctx1.font = "20px Arial";
    ctx1.fillStyle = "red";
    ctx1.fillText("01", 130, 130);
    ctx1.fillText("02", 330, 130);
    ctx1.fillText("03", 600, 130);
    ctx1.fillText("03", 400, 350);
    ctx1.fillText("04", 180, 550);
    ctx1.fillText("06", 500, 550);
    ctx1.fillText("07", 700, 550);

    // **Draw Green Arrows (Airflow Directions)**
    ctx1.fillStyle = "green";
    this.drawArrow(ctx1, 300, 250, 350, 250);
    this.drawArrow(ctx1, 350, 250, 400, 250);
    this.drawArrow(ctx1, 400, 250, 450, 250);
    this.drawArrow(ctx1, 200, 400, 250, 400);
    this.drawArrow(ctx1, 250, 400, 300, 400);
    this.drawArrow(ctx1, 300, 400, 350, 400);

    // **Draw Emergency Signs (Red Triangles)**
    ctx1.fillStyle = "red";
    this.drawTriangle(ctx1, 100, 100);
    this.drawTriangle(ctx1, 500, 300);
    this.drawTriangle(ctx1, 700, 600);
  }

  drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrowhead
    const headSize = 8;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headSize * Math.cos(angle - Math.PI / 6), y2 - headSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headSize * Math.cos(angle + Math.PI / 6), y2 - headSize * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10, y + 20);
    ctx.lineTo(x + 10, y + 20);
    ctx.closePath();
    ctx.fill();
  }


    ////////////////////////////////////////
    private ctx: CanvasRenderingContext2D | null = null;
    private image: HTMLImageElement | null = null;
    private zones: { x: number, y: number, width: number, height: number }[] = [];
    private isDrawing = false;
    private startX: number = 0;
    private startY: number = 0;
  
    onImageUpload(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      const file = inputElement.files?.[0]; // Use optional chaining to safely access files[0]
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.image = new Image();
            this.image.src = e.target.result as string;
            this.image.onload = () => {
              this.drawImageOnCanvas();
            };
          }
        };
        reader.readAsDataURL(file);
      }
    }
  
    drawImageOnCanvas(): void {
      if (!this.image || !this.canvas) return; // Ensure image and canvas are defined
  
      const canvas = this.canvas.nativeElement;
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      this.ctx = canvas.getContext('2d');
      if (this.ctx) {
        this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
      }
    }
  
    onMouseDown(event: MouseEvent): void {
      this.isDrawing = true;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
    }
  
    onMouseUp(event: MouseEvent): void {
      if (!this.isDrawing || !this.ctx) return; // Ensure drawing is active and ctx is defined
  
      this.isDrawing = false;
      const endX = event.offsetX;
      const endY = event.offsetY;
      const width = endX - this.startX;
      const height = endY - this.startY;
  
      this.zones.push({ x: this.startX, y: this.startY, width, height });
      this.drawZone(this.startX, this.startY, width, height);
    }
  
    drawZone(x: number, y: number, width: number, height: number): void {
      if (!this.ctx) return; // Ensure ctx is defined
  
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, width, height);
    }
  
    getZoneCoordinates(): void {
      console.log(this.zones);
    }

     // Define rooms with their positions and dimensions
  rooms = [
    { id: '01', name: 'Administration', x: 100, y: 150, width: 200, height: 100 },
    { id: '02', name: 'Datante', x: 400, y: 300, width: 150, height: 150 },
    // Add more rooms as needed
  ];

  // Define safety equipment with their positions and dimensions
  safetyEquipment = [
    { id: 'A', name: 'Extincteur Stg CO₂', x: 50, y: 50, width: 30, height: 30 },
    { id: 'B', name: 'Extincteur Stg ABC', x: 500, y: 100, width: 30, height: 30 },
    // Add more equipment as needed
  ];

  // Handle room clicks
  onRoomClick(room: any) {
    alert(`You clicked ${room.name} (${room.id})`);
  }

  // Handle safety equipment clicks
  onEquipmentClick(equipment: any) {
    alert(`You clicked ${equipment.name} (${equipment.id})`);
  }

  }