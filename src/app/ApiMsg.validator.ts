import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiMsgValidator implements AsyncValidator {
  private validationsAsync = new BehaviorSubject<any>({});

  constructor() {}

  addApiMsg(id, message) {
    const validations = { ...this.validationsAsync.getValue() };
    validations[id] = { id, message };
    this.validationsAsync.next(validations);
  }

  removeApiMsg(id) {
    let validations = { ...this.validationsAsync.getValue() };
    delete validations[id];
    if (!validations || validations == undefined) {
      validations = {};
    }
    this.validationsAsync.next(validations);
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validationsAsync.pipe(
      map((validations) => {
        if (control.errors?.backend?.id && validations) {
          return validations[control.errors?.backend?.id]
            ? {
                backend: control.errors?.backend?.id,
                message: control.errors?.backend?.message,
                async: true,
              }
            : null;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}
