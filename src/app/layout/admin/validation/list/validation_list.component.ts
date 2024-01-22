import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import {
  DocumentMetaDatas,
  VALIDATION_SERVICE_TOKEN,
  ValidationServiceInterface,
} from '../../../../interface/admin';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from '../../../../interface/other';

@Component({
  selector: 'app-validation-list',
  templateUrl: './validation_list.component.html',
  styleUrls: ['./validation_list.component.scss'],
})
export class ValidationComponent {
  protected readonly faAnglesLeft = faAnglesLeft;
  protected readonly faAnglesRight = faAnglesRight;
  public user_list: DocumentMetaDatas[] = [];
  protected page = 1;
  private nb_page = 0;
  pageButtons: { value: number; isCurrent: boolean }[] = [];

  constructor(
    private router: Router,
    @Inject(VALIDATION_SERVICE_TOKEN)
    protected validListService: ValidationServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  ngOnInit() {
    this.loadPaginationData();
    this.showNumberPage(this.page);
  }

  private generatePageButtons(
    page: number,
  ): { value: number; isCurrent: boolean }[] {
    const buttons: { value: number; isCurrent: boolean }[] = [];
    if (page <= 2 || this.nb_page < 5) {
      for (let i = 1; i <= this.nb_page; i++) {
        buttons.push({ value: i, isCurrent: i === page });
      }
    } else if (page > this.nb_page - 2) {
      for (let i = this.nb_page - 4; i <= this.nb_page; i++) {
        buttons.push({ value: i, isCurrent: i === page });
      }
    } else {
      for (let i = page; i < page + 5; i++) {
        buttons.push({ value: i - 2, isCurrent: i - 2 === page });
      }
    }
    return buttons;
  }

  private showNumberPage(page: number) {
    this.pageButtons = this.generatePageButtons(page);
  }

  public changePage(page: number) {
    this.page = page;
    this.loadPaginationData();
    this.pageButtons = this.generatePageButtons(this.page);
  }

  public showDocument(document_id: number) {
    this.router.navigate(['/admin/license'], {
      queryParams: { document: document_id.toString() },
    });
  }

  public nextPage() {
    if (this.page < this.nb_page) {
      this.page += 1;
      this.loadPaginationData();
      this.pageButtons = this.generatePageButtons(this.page);
    }
  }

  public previousPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.loadPaginationData();
      this.pageButtons = this.generatePageButtons(this.page);
    }
  }

  private loadPaginationData() {
    this.validListService.getListDocumentToValidate(this.page).subscribe({
      next: (data) => {
        this.user_list = data['items'];
        if (data['nb_documents'] % 10 != 0) {
          this.nb_page = Math.floor(data['nb_documents'] / 10) + 1;
        } else {
          this.nb_page = Math.floor(data['nb_documents'] / 10);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("Vous n'êtes pas connecté");
          this.router.navigateByUrl(`/login`);
        } else if (error.status === 403) {
          this.notifier.error("Vous n'êtes pas administrateur.");
          this.router.navigateByUrl(`/`);
        } else if (error.status == 404) {
          this.notifier.error('Ressource non trouvé.');
        } else if (error.status === 415) {
          this.notifier.error('Le type de contenu de la requête est invalide.');
        } else if (error.status === 500) {
          this.notifier.error('Erreur Interne.');
        } else if (error.status === 503) {
          this.notifier.error('Service momentanément indisponible.');
        }
      },
    });
    const encodedPage = encodeURIComponent(String(this.page));
    this.router.navigateByUrl(`/admin/license/to-validate?page=${encodedPage}`);
  }
}
