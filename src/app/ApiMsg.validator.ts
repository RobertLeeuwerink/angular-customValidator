import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiMsgValidator implements AsyncValidator {
  private validations = new BehaviorSubject<any>({});

  constructor() {}

  addApiMsg(id, message) {
    const validations = this.validations.getValue();
    validations[id] = { id, message };
    this.validations.next(validations);
  }

  removeApiMsg(id) {
    const validations = this.validations.getValue();
    delete validations[id];
    this.validations.next(validations);
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validations.pipe(
      map((validations) => {
        if (control.errors?.backend?.id) {
          return validations[control.errors?.backend?.id]
            ? {
                backend: control.errors?.backend?.id,
                message: control.errors?.backend?.message,
                async: true
              }
            : null;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}
