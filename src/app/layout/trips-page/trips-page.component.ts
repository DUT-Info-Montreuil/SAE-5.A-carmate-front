import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  CARPOOLING_SERVICE_TOKEN,
  CarpoolingServiceInterface,
} from 'src/app/interface/carpooling.interface';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  AuthenticationServiceInterface,
} from 'src/app/interface/user.interface';
import {
  PublishedSubscription,
  publishedCarpooling,
  Carpooling,
  Subscription,
} from 'src/app/model/carpooling.model';

@Component({
  selector: 'app-trips-page',
  templateUrl: './trips-page.component.html',
  styleUrls: ['./trips-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TripsPageComponent {
  subscriptions: Subscription[] = [];
  publishedSubscriptions: PublishedSubscription[] = [];
  publishedCarpoolings: publishedCarpooling[] = [];
  carpoolings: Carpooling[] = [];

  constructor(
    @Inject(CARPOOLING_SERVICE_TOKEN)
    private carpoolingService: CarpoolingServiceInterface,
    @Inject(AUTHENTICATION_SERVICE_TOKEN)
    public authService: AuthenticationServiceInterface,
  ) {}

  ngOnInit() {
    this.carpoolingService
      .getSubscriptions()
      .subscribe((subscriptions: Subscription[]) => {
        this.subscriptions = subscriptions;
      });

    this.carpoolingService
      .getPublishedSubscriptions()
      .subscribe((publishedSubscriptions: PublishedSubscription[]) => {
        this.publishedSubscriptions = publishedSubscriptions;
      });

    this.carpoolingService
      .getPublishedCarpoolings()
      .subscribe((bookedCarpoolings: publishedCarpooling[]) => {
        this.publishedCarpoolings = bookedCarpoolings;
      });

    this.carpoolingService
      .getCarpoolings()
      .subscribe((carpoolings: Carpooling[]) => {
        this.carpoolings = carpoolings;
      });
  }

  IsDriver() {
    return this.authService.isDriver();
  }
}
