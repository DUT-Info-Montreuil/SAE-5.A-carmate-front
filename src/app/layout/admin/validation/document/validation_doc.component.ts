import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  VALIDATION_SERVICE_TOKEN,
  ValidationServiceInterface,
} from '../../../../interface/admin.interface';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from '../../../../interface/notifier.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { LicenseStatus, NextDocument } from 'src/app/model/admin.model';
import { Document } from 'src/app/model/admin.model';

@Component({
  selector: 'app-validation-doc',
  templateUrl: './validation_doc.component.html',
  styleUrls: ['./validation_doc.component.scss'],
})
export class ValidationDocComponent {
  public doc: Document | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(VALIDATION_SERVICE_TOKEN)
    protected validDocService: ValidationServiceInterface,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.recharge_page(params['document']);
    });
  }

  public send_validation(result: LicenseStatus, document_id: number) {
    this.validDocService.sendValidationStatus(result, document_id).subscribe({
      next: (value: NextDocument) => {
        if (!value) {
          this.router.navigate(['admin/license/to-validate']);
          return value;
        }
        this.recharge_page(value.next_document_id);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notifier.error("Vous n'êtes pas connecté");
          this.router.navigateByUrl(`/login`);
        } else if (error.status === 403) {
          this.notifier.error("Vous n'êtes pas administrateur.");
          this.router.navigateByUrl(`/`);
        } else if (error.status == 404) {
          this.notifier.error('Utilisateur non trouvé.');
        } else if (error.status == 400) {
          this.notifier.error('Contenu de la requete invalide.');
        } else if (error.status == 415) {
          this.notifier.error('Type de contenu de la requête invalide.');
        } else if (error.status == 500) {
          this.notifier.error('Erreur Interne.');
        } else if (error.status == 503) {
          this.notifier.error('Service momentanément indisponible.');
        }
      },
    });
  }

  public recharge_page(idDocument: number) {
    this.validDocService.getDocument(idDocument).subscribe({
      next: (data: Document) => {
        this.doc = data;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          this.notifier.error('Type de document invalide.');
        } else if (error.status === 401) {
          this.notifier.error("Vous n'êtes pas connecté");
          this.router.navigateByUrl(`/login`);
        } else if (error.status === 403) {
          this.notifier.error("Vous n'êtes pas administrateur.");
          this.router.navigateByUrl(`/`);
        } else if (error.status == 404) {
          this.notifier.error('Ressource non trouvé.');
        } else if (error.status == 410) {
          this.notifier.error('Document déjà vérifié.');
        } else if (error.status == 500) {
          this.notifier.error('Erreur Interne.');
        } else if (error.status == 503) {
          this.notifier.error('Service momentanément indisponible.');
        }
      },
    });
  }
}
