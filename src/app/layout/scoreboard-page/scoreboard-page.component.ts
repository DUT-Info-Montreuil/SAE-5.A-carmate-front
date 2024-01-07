import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { DriverProfile, PROFILE_SERVICE_TOKEN, PassengerProfile, ProfilesServiceInterface } from 'src/app/interface/profiles';
import { SCORE_SERVICE_TOKEN, ScoreUserData, ScoreServiceInterface } from 'src/app/interface/score';
import { AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface, User } from 'src/app/interface/user';

@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrls: ['./scoreboard-page.component.scss']
})

export class ScoreboardPageComponent {
  displayedColumns: string[] = ['ranking', 'name', 'global_rating', 'nb_review', 'economic_driving_rating', 'safe_driving_rating', 'sociability_rating'];
  dataSource!: MatTableDataSource<ScoreUserData & {
    average_rating: number;
    ranking: number;
  }>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isDriver!: boolean
  selfDriverScore: ScoreUserData | null = null;
  selfDriverProfile: DriverProfile | null = null;
  selfPassengerProfile: PassengerProfile | null = null;

  constructor(
    @Inject(SCORE_SERVICE_TOKEN) private scoreboardService: ScoreServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
    @Inject(AUTHENTICATION_SERVICE_TOKEN) private authenticationService: AuthenticationServiceInterface,
    @Inject(PROFILE_SERVICE_TOKEN) private profileService: ProfilesServiceInterface
  ) {}

  ngOnInit() {
    const token: string = localStorage.getItem('auth-token') ?? '';
    this.isDriver = this.authenticationService.isDriver();

    if(this.isDriver) {
      this.scoreboardService.getScoreUserData(token).subscribe({
        next: (driver_score) => {
          this.selfDriverScore = driver_score as ScoreUserData;
        },
        error: (error: HttpErrorResponse) => {
          this.notifyHandledError(error);
        }
      });
      this.profileService.getDriverProfile(token).subscribe({
        next: (driver_profile) => {
          this.selfDriverProfile = driver_profile;
        },
        error: (error: HttpErrorResponse) => {
          this.notifyHandledError(error);
        }
      });
    } else {
      this.profileService.getPassengerProfile(token).subscribe({
        next: (passenger_profile: PassengerProfile) => {
          this.selfPassengerProfile = passenger_profile;
        },
        error: (error: HttpErrorResponse) => {
          this.notifyHandledError(error);
        }
      });
    }
    this.scoreboardService.getScoreUserData().subscribe({
      next: (scoreUserDataList) => {        
        console.log(scoreUserDataList);
        
        const userDataListWithAverage = (scoreUserDataList as ScoreUserData[]).map(user => ({
          ...user,
          average_rating: Number(((user.economic_driving_rating! + user.safe_driving_rating! + user.sociability_rating!) / 3).toFixed(2))
        }));

        const sortedUserDataList = userDataListWithAverage.sort((a, b) => b.average_rating - a.average_rating);
        
        const finalUserDataList = sortedUserDataList.map((user, index) => ({
          ...user,
          ranking: index + 1
        }));

        this.dataSource = new MatTableDataSource(finalUserDataList);
      },
      error: (error: HttpErrorResponse) => {
        this.notifyHandledError(error);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  private notifyHandledError(error: HttpErrorResponse) {
    switch (error.status) {
      case 500:
        this.notifier.error("Erreur interne.");
        break;
      case 503:
        this.notifier.error("Service momentanément indisponible.");
        break;
      default:
        this.notifier.error("Erreur inconnue.");
        break;
    }
  }
}