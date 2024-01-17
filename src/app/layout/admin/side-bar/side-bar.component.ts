import { Component } from '@angular/core';
import {faIdCard} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})

export class SideBarComponent {
  protected readonly faIdCard = faIdCard;
}