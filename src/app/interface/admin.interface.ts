import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { LicenseStatus } from '../model/admin.model';

export interface ValidationServiceInterface {
  getDocument(document_id: number): Observable<any>;
  sendValidationStatus(
    status: LicenseStatus,
    document_id: number,
  ): Observable<any>;
  getListDocumentToValidate(page: number): Observable<any>;
}

export const VALIDATION_SERVICE_TOKEN =
  new InjectionToken<ValidationServiceInterface>('ValidationServiceInterface');
