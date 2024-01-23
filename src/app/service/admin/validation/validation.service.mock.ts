import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MutualizedMockData } from './MutualizedMockData';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationServiceInterface } from 'src/app/interface/admin.interface';
import { LicenseStatus } from 'src/app/model/admin.model';

@Injectable({
  providedIn: 'root',
})
export class ValidationServiceMock implements ValidationServiceInterface {
  getDocument(document_id: number): Observable<any> {
    const foundData = MutualizedMockData.getAllOrCreate().find(
      (doc) => doc.document_id == document_id,
    );
    if (!foundData) {
      const httpErrorResponse = new HttpErrorResponse({
        error: 'User not found',
        status: 404,
      });
      return of(throwError(() => httpErrorResponse));
    }
    if (foundData.status !== 'Pending') {
      const httpErrorResponse = new HttpErrorResponse({
        error: 'Document already validated',
        status: 410,
      });
      return of(throwError(() => httpErrorResponse));
    }
    return of(foundData);
  }

  getListDocumentToValidate(page: number): Observable<any> {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;

    const recaps = MutualizedMockData.getRecapOrCreate();
    if (startIndex >= recaps.length) {
      const httpErrorResponse = new HttpErrorResponse({
        error: 'Page not found',
        status: 404,
      });
      return of(throwError(() => httpErrorResponse));
    }
    const paginatedRecaps = recaps.slice(startIndex, endIndex);
    return of({ items: paginatedRecaps, nb_documents: recaps.length });
  }

  sendValidationStatus(
    status: LicenseStatus,
    document_id: number,
  ): Observable<any> {
    const foundData = MutualizedMockData.getAllOrCreate().find(
      (doc) => doc.document_id === document_id,
    );
    if (!foundData) {
      const httpErrorResponse = new HttpErrorResponse({
        error: 'User not found',
        status: 404,
      });
      return of(throwError(() => httpErrorResponse));
    }
    foundData.status = status;

    const nextDocument = MutualizedMockData.getAllOrCreate().find(
      (doc) => doc.status === 'Pending',
    );
    if (nextDocument) {
      return of({
        next_document_id: nextDocument.document_id,
      });
    }
    return of(null);
  }
}
