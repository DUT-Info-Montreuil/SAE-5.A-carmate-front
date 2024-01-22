import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export type LicenceType = 'Basic' | 'Driver';
export type AccountType = 'Student' | 'Teacher';
export type LicenseStatus = 'Pending' | 'Approved' | 'Rejected';
export interface DocumentMetaDatas {
  first_name: string;
  last_name: string;
  account_type: AccountType;
  published_at: Date;
  license_type: LicenceType;
  document_id: number;
}

export interface PaginatedDocMetaDatas {
  items: DocumentMetaDatas[];
  nb_documents: number;
}

export interface Document {
  first_name: string;
  last_name: string;
  account_type: AccountType;
  license_type: LicenceType;
  document: string;
  document_id: number;
}

export interface NextDocument {
  next_document_id: number;
}

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
