import { BehaviorSubject, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import {
  Carpooling,
  CreateCarpoolPayload,
  CreateSubscriptionPayload,
  PublishedSubscription,
  Search,
  publishedCarpooling,
  Subscription,
} from '../model/carpooling.model';

export interface CarpoolingServiceInterface {
  $carpoolings: BehaviorSubject<Carpooling[]>;
  publish: (carpool: CreateCarpoolPayload) => Observable<any>;
  search: (search: Search) => void;
  createSubscription: (
    subscription: CreateSubscriptionPayload,
  ) => Observable<any>;
  getSubscriptions: () => Observable<Subscription[]>;
  getCode: (carpooling_id: number) => Observable<number>;
  getPublishedSubscriptions: () => Observable<PublishedSubscription[]>;
  getPublishedCarpoolings: () => Observable<publishedCarpooling[]>;
  postCode: (passengerCode: number, carpoolingId: number) => Observable<any>;
  book: (id: number, is_scheduled?: boolean, date?: number) => Observable<any>;
  getCarpoolings: () => Observable<Carpooling[]>;
}

export const CARPOOLING_SERVICE_TOKEN =
  new InjectionToken<CarpoolingServiceInterface>('CarpoolingServiceInterface');
