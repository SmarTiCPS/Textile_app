import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Factory } from '../../services/factory.module';
import { FactoryService } from '../../services/factory.service';

@Component({
  selector: 'app-home',
  templateUrl: './factory.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  factories: Factory[] = [];
  isLoading = true;
  private factoriesSub!: Subscription;

  constructor(public factoryService: FactoryService) {}

  ngOnInit() {
    this.loadFactories();
    this.factoriesSub = this.factoryService.getFactoryUpdateListener()
      .subscribe({
        next: (factories) => {
          this.factories = factories;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error receiving factory updates:', err);
          this.isLoading = false;
        }
      });
  }

  loadFactories() {
    this.isLoading = true;
    this.factoryService.getFactories();
  }

  onDelete(factoryId: string) {
    if (confirm('Are you sure you want to delete this factory?')) {
      this.factoryService.deleteFactory(factoryId);
    }
  }

  ngOnDestroy() {
    this.factoriesSub.unsubscribe();
  }
}