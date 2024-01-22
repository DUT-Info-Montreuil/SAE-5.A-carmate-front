import { Component, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faCar,
  faCog,
  faMessage,
  faPencil,
  faPlus,
  faScrewdriverWrench,
  faSignOut,
  faUser as faUserSolid,
  faCaretRight,
  faRepeat,
  faRankingStar,
} from '@fortawesome/free-solid-svg-icons';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  AuthenticationServiceInterface,
} from '../../interface/user.interface';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  menuProfileVisibility = false;
  userConnected = false;
  isLogged = false;
  protected readonly faUserSolid = faUserSolid;
  protected readonly faCog = faCog;
  protected readonly faSignOut = faSignOut;
  protected readonly faPlus = faPlus;
  protected readonly faPencil = faPencil;
  protected readonly faUserRegular = faUserRegular;
  protected readonly faCar = faCar;
  protected readonly faMessage = faMessage;
  protected readonly faScrewdriverWrench = faScrewdriverWrench;
  protected readonly faCaretRight = faCaretRight;
  protected readonly faRankingStar = faRankingStar;
  protected readonly faRepeat = faRepeat;

  constructor(
    private router: Router,
    @Inject(AUTHENTICATION_SERVICE_TOKEN)
    public authService: AuthenticationServiceInterface,
  ) {}

  menuProfileSwitchVisibility(): void {
    this.menuProfileVisibility = !this.menuProfileVisibility;
  }

  @HostListener('document:click', ['$event'])
  menuProfileCloseListener(event: Event): void {
    const elementClicked = event.target as HTMLElement;
    const buttonProfileElement = document.getElementById('buttonProfile')!;
    const menuProfileElement = document.getElementById('menuProfile')!;

    if (
      this.menuProfileVisibility &&
      !buttonProfileElement.contains(elementClicked) &&
      !menuProfileElement.contains(elementClicked)
    ) {
      this.menuProfileSwitchVisibility();
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/home']);
  }

  IsLogged() {
    return this.authService.isLogged();
  }

  IsAdmin() {
    return this.authService.isAdmin();
  }

  IsDriver() {
    return this.authService.isDriver();
  }
}
