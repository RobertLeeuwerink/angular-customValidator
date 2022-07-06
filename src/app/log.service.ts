import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  errors = new BehaviorSubject<string[]>([]);
  constructor() {}

  newErrorId(code: string) {
    const timestamp = new Date().getUTCDate() + code;
    return timestamp;
  }

  findError(control: AbstractControl): Observable<boolean> {
    const value = '';
    return this.errors.pipe(
      map((errors) => {
        const index = errors.indexOf(value);
        if (index === -1) {
          return false;
        } else {
          return true;
        }
      })
    );
  }

  addError(id: string) {
    const errors = this.errors.getValue();
    errors.push(id);
    this.errors.next(errors);
  }

  removeError(id: string) {
    const errors = this.errors.getValue();
    this.errors.next(errors.filter((error) => error !== id));
  }
}
