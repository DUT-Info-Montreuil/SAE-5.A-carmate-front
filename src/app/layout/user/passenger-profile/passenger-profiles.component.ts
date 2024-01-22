import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from 'src/app/interface/notifier.interface';
import {
  PROFILE_SERVICE_TOKEN,
  ProfilesServiceInterface,
} from 'src/app/interface/profiles.interface';
import {
  USER_SERVICE_TOKEN,
  UserServiceInterface,
} from 'src/app/interface/user.interface';
import { PassengerProfile } from 'src/app/model/profile.model';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-passenger-profiles',
  templateUrl: './passenger-profiles.component.html',
  styleUrls: ['./passenger-profiles.component.scss'],
})
export class PassengerProfilesComponent {
  // From User
  protected firstName: string | undefined;
  protected lastName: string | undefined;
  protected emailAddress: string | undefined;
  protected profilePictureBase64: string | null = null;
  // From PassengerProfiles
  protected description = ' ';
  protected createdAt: string | undefined;

  constructor(
    private router: Router,
    @Inject(PROFILE_SERVICE_TOKEN)
    private passengerProfilesService: ProfilesServiceInterface,
    @Inject(USER_SERVICE_TOKEN) private userService: UserServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (user: User) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.emailAddress = user.emailAddress;
        this.profilePictureBase64 = user.profilePicture;

        this.passengerProfilesService
          .getPassengerProfile(localStorage.getItem('auth_token') ?? '')
          .subscribe({
            next: (passenger_profile: PassengerProfile) => {
              this.description = passenger_profile.description;
              this.createdAt = passenger_profile.createdAt;
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 401) {
                this.notifier.error("Vous n'etes pas connecté");
                this.router.navigate(['/login']);
              } else if (error.status === 403) {
                this.notifier.error('Ce compte est banni.');
                this.router.navigate(['/']);
              } else if (error.status === 404) {
                this.notifier.error("Ce compte n'est pas trouvé.");
                this.router.navigate(['/login']);
              } else {
                this.notifier.error('Erreur interne.');
              }
            },
          });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("Vous n'etes pas connecté");
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.notifier.error('Ce compte est banni.');
          this.router.navigate(['/']);
        } else if (error.status === 404) {
          this.notifier.error("Ce compte n'est pas trouvé.");
          this.router.navigate(['/login']);
        } else {
          this.notifier.error('Erreur interne.');
        }
      },
    });
  }
}
