import { Component, Inject, Input, SimpleChanges } from '@angular/core';
import {
  CARPOOLING_SERVICE_TOKEN,
  CarpoolingServiceInterface,
} from 'src/app/interface/carpooling.interface';
import { Carpooling, Search } from 'src/app/model/carpooling.model';

@Component({
  selector: 'app-result-carpool',
  templateUrl: './result-carpool.component.html',
  styleUrls: ['./result-carpool.component.scss'],
})
export class ResultCarpoolComponent {
  @Input() _carpoolings: Carpooling[] = [];
  @Input() _searchParams!: Search;
  starting_pointDriverToDisplay!: number[];
  starting_pointUserToDisplay!: number[];
  noResults!: boolean;

  constructor(
    @Inject(CARPOOLING_SERVICE_TOKEN)
    private carpoolingService: CarpoolingServiceInterface,
  ) {}

  ngOnInit() {
    this.carpoolingService.$carpoolings.subscribe((carpoolings) => {
      this._carpoolings = carpoolings;
      this.noResults = carpoolings.length === 0;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes['_searchParams'].previousValue ||
      changes['_searchParams'].currentValue.start_lat !==
        changes['_searchParams'].previousValue.start_lat ||
      changes['_searchParams'].currentValue.start_lon !==
        changes['_searchParams'].previousValue.start_lon
    ) {
      this.starting_pointUserToDisplay = [
        this._searchParams.start_lat,
        this._searchParams.start_lon,
      ];
    }
  }

  handleStartingPointDriverEmitter(starting_point: number[]) {
    this.starting_pointDriverToDisplay = starting_point;
  }
}
