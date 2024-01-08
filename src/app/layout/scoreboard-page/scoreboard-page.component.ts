import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { SCOREBOARD_SERVICE_TOKEN, ScoreUserData, ScoreboardServiceInterface } from 'src/app/interface/scoreboard';

@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrls: ['./scoreboard-page.component.scss']
})

export class ScoreboardPageComponent {
  displayedColumns: string[] = ['name', 'nmbr_of_rates', 'economic_driving_rating', 'safe_driving_rating', 'sociability_rating'];
  dataSource!: MatTableDataSource<ScoreUserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(SCOREBOARD_SERVICE_TOKEN) private scoreboardService: ScoreboardServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  ngOnInit() {
    this.scoreboardService.getScoreUserData().subscribe({
      next: (scoreUserDataList) => {
        this.dataSource = new MatTableDataSource(scoreUserDataList);
      },
      error: (error: HttpErrorResponse) => {
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
}