import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class ApiMsgValidator implements AsyncValidator {
  constructor(private logService: LogService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.logService.findError(control).pipe(
      map((isTaken) => (isTaken ? { uniqueAlterEgo: true } : null)),
      catchError(() => of(null))
    );
  }
}
