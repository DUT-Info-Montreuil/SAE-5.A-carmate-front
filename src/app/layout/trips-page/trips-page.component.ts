import { Component, Inject } from '@angular/core';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, Subscription } from 'src/app/interface/carpooling';

@Component({
  selector: 'app-trips-page',
  templateUrl: './trips-page.component.html',
  styleUrls: ['./trips-page.component.scss']
})
export class TripsPageComponent {
  subscriptions: Subscription[] = [];

  constructor(
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
  ) {}

  ngOnInit() {
    this.carpoolingService.getSubscriptions(localStorage.getItem('auth-token') ?? '').subscribe((subscriptions: Subscription[]) => {
      this.subscriptions = subscriptions;
    });
  }
}
