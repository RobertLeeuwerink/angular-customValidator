import { Injectable } from "@angular/core";
import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";
import { BehaviorSubject, Observable, map, catchError, of } from "rxjs";

export interface Validations {
  [id: string]: any
}

@Injectable({ providedIn: 'root' })
export class ApiMsgValidator implements AsyncValidator {
  private validationsAsync = new BehaviorSubject<Validations>({});

  constructor() {}

  addApiMsg(id: string, message: string) {
    const validations = { ...this.validationsAsync.getValue() };
    validations[id] = { id, message };
    this.validationsAsync.next(validations);
  }

  removeApiMsg(id: string) {
    let validations = { ...this.validationsAsync.getValue() };
    delete validations[id];
    if (!validations || validations == undefined) {
      validations = {};
    }
    this.validationsAsync.next(validations);
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validationsAsync.pipe(
      map((validations: Validations) => {
        console.log(validations);
        console.log(control.errors);
        if (control.errors?.['backend'] && validations) {
          return validations[control.errors?.['backend']]
            ? {
                invalid: true,
                backend: control.errors?.['backend'],
                message: control.errors?.['message'],
                msg_id: control.errors?.['msg_id'],
                async: true
              } :
             null;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}
