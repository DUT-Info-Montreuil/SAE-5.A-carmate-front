import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CARPOOLING_SERVICE_TOKEN, Carpooling, CarpoolingServiceInterface, Subscription, publishedCarpooling } from 'src/app/interface/carpooling';

@Component({
  selector: 'app-trips-page',
  templateUrl: './trips-page.component.html',
  styleUrls: ['./trips-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TripsPageComponent {
  subscriptions: Subscription[] = [];
  publishedCarpoolings: publishedCarpooling[] = [];
  carpoolings: Carpooling[] = [];

  constructor(
    @Inject(CARPOOLING_SERVICE_TOKEN) private carpoolingService: CarpoolingServiceInterface,
  ) {}

  ngOnInit() {
    this.carpoolingService.getSubscriptions(localStorage.getItem('auth_token') ?? '').subscribe((subscriptions: Subscription[]) => {
      this.subscriptions = subscriptions;
    });

    this.carpoolingService.getPublishedCarpoolings(localStorage.getItem('auth_token') ?? '').subscribe((bookedCarpoolings: publishedCarpooling[]) => {
      this.publishedCarpoolings = bookedCarpoolings;
    });

    this.carpoolingService.getCarpoolings().subscribe((carpoolings: Carpooling[]) => {
      this.carpoolings = carpoolings;
    });
  }
}
