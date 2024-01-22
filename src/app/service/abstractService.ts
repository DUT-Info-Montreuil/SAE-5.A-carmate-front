import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractService {
  protected constructor(protected http: HttpClient) {}

  protected passErrorToComponent(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
