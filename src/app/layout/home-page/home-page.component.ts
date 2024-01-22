import { Component } from '@angular/core';
import { Search } from 'src/app/model/carpooling.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  searchParams!: Search;
  resultDisplayed = false;

  handleSearchEvent(searchParams: Search) {
    this.searchParams = searchParams;
    this.resultDisplayed = true;
  }
}
