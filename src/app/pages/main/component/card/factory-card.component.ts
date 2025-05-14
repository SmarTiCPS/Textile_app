import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Factory } from '../../services/factory.module';

@Component({
  selector: 'app-factory-card',
  templateUrl: './factory-card.component.html',
})
export class FactoryCardComponent {
  @Input() factory!: Factory;
  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.factory.id);
  }
}