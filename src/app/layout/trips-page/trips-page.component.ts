import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface, Subscription, publishedCarpooling } from 'src/app/interface/carpooling';

@Component({
  selector: 'app-trips-page',
  templateUrl: './trips-page.component.html',
  styleUrls: ['./trips-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TripsPageComponent {
  subscriptions: Subscription[] = [];
  publishedCarpoolings: publishedCarpooling[] = [];

  constructor(
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
  ) {}

  ngOnInit() {
    this.carpoolingService.getSubscriptions(localStorage.getItem('auth-token') ?? '').subscribe((subscriptions: Subscription[]) => {
      this.subscriptions = subscriptions;
    });

    this.carpoolingService.getPublishedCarpoolings(localStorage.getItem('auth-token') ?? '').subscribe((bookedCarpoolings: publishedCarpooling[]) => {
      this.publishedCarpoolings = bookedCarpoolings;
    });
  }
}