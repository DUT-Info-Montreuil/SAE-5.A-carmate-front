import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import {DriverProfile, PROFILE_SERVICE_TOKEN, ProfilesServiceInterface} from 'src/app/interface/profiles';
import {USER_SERVICE_TOKEN, User, UserServiceInterface} from 'src/app/interface/user';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss']
})
export class DriverProfileComponent {
  // From User
  protected firstName: string | undefined;
  protected lastName: string | undefined;
  protected emailAddress: string | undefined;
  protected profilePictureBase64: string | null = null;
  // From PassengerProfiles
  protected description: string = ' ';
  protected created_at: string | undefined;

  constructor(
    private router: Router,
    @Inject(PROFILE_SERVICE_TOKEN) private driverProfilesService: ProfilesServiceInterface,
    @Inject(USER_SERVICE_TOKEN) private userService: UserServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (user: User) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.emailAddress = user.emailAddress;
        this.profilePictureBase64 = user.profilePicture;

        this.driverProfilesService.getDriverProfile(localStorage.getItem('auth_token')?? '').subscribe({
          next: (driver_profile: DriverProfile) => {
            this.description = driver_profile.description;
            this.created_at = driver_profile.createdAt;
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.notifier.error("Vous n'etes pas connecté");
              this.router.navigate(['/login']);
            } else if (error.status === 403) {
              this.notifier.error("Ce compte est banni.");
              this.router.navigate(['/']);
            } else if (error.status === 404) {
              this.notifier.error("Ce compte n'est pas trouvé.");
              this.router.navigate(['/login']);
            } else {
              this.notifier.error("Erreur interne.");
            }
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("Vous n'etes pas connecté");
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.notifier.error("Ce compte est banni.");
          this.router.navigate(['/']);
        } else if (error.status === 404) {
          this.notifier.error("Ce compte n'est pas trouvé.");
          this.router.navigate(['/login']);
        } else {
          this.notifier.error("Erreur interne.");
        }
      }
    });
  }
}
