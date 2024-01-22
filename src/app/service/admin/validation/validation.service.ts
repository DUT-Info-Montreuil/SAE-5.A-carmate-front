import { Injectable } from '@angular/core';
import { AbstractService } from '../../abstractService';
import {
  Document,
  LicenseStatus,
  NextDocument,
  PaginatedDocMetaDatas,
  ValidationServiceInterface,
} from 'src/app/interface/admin';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environement/environement';

@Injectable({
  providedIn: 'root',
})
export class ValidationService
  extends AbstractService
  implements ValidationServiceInterface
{
  constructor(http: HttpClient) {
    super(http);
  }

  getDocument(document_id: number): Observable<any> {
    const params = {
      document_id,
    };

    const headers = {
      Authorization: `bearer ${localStorage.getItem('auth_token')}`,
    };

    return this.http.get<Document>(`${environment.path}/admin/license`, {
      params,
      headers,
    });
  }

  sendValidationStatus(
    status: LicenseStatus,
    document_id: number,
  ): Observable<any> {
    const payload = {
      statut: status,
      license_id: document_id,
    };

    const headers = {
      Authorization: `bearer ${localStorage.getItem('auth_token')}`,
    };

    return this.http.post<NextDocument>(
      `${environment.path}/admin/license/validate`,
      payload,
      {
        headers: headers,
      },
    );
  }

  getListDocumentToValidate(page: number): Observable<PaginatedDocMetaDatas> {
    const params = {
      page,
    };

    const headers = {
      Authorization: `bearer ${localStorage.getItem('auth_token')}`,
    };

    return this.http.get<PaginatedDocMetaDatas>(
      `${environment.path}/admin/license/to-validate`,
      { params, headers },
    );
  }
}
