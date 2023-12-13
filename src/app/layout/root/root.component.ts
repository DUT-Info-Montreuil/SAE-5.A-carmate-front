import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(["/home"]);
    } 
  }
}
