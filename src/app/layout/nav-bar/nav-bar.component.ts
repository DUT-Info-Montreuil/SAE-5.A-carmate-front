import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { faUser as faUserSolid, faCog, faSignOut, faPlus, faPencil, faCar, faMessage, faScrewdriverWrench} from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import {AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface, Token} from "../../interface/user";
import {NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface} from "../../interface/other";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent {
  menuProfileVisibility = false;
  userConnected: boolean = false;
  isLogged: boolean = false;
  protected readonly faUserSolid = faUserSolid;
  protected readonly faCog = faCog;
  protected readonly faSignOut = faSignOut;
  protected readonly faPlus = faPlus;
  protected readonly faPencil = faPencil;
  protected readonly faUserRegular = faUserRegular;
  protected readonly faCar = faCar;
  protected readonly faMessage = faMessage;
  protected readonly faScrewdriverWrench = faScrewdriverWrench;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTHENTICATION_SERVICE_TOKEN) public authService: AuthenticationServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
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
    this.router.navigate(["/login"]);
  }

  get IsLogged(){
    return this.authService.isLogged();
  }

  get IsAdmin(){
    return this.authService.isAdmin();
  }

  get IsDriver(){
    return this.authService.isDriver();
  }
}
