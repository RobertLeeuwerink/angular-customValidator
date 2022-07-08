import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  errors = new BehaviorSubject<{[id: string]: string}>({});
  constructor() {
    this.errors.subscribe((errors) => console.log(errors));
  }

  newErrorId(code: string) {
    const timestamp = new Date().getUTCDate() + code;
    return timestamp;
  }

  findError$(id: string): Observable<boolean> {
    return this.errors.pipe(
      map((errors) => errors?.[id] ? true : false));
  }
  findError(id: string): boolean {
    return !!this.errors.getValue()[id];
  }

  addError(id: string, message: string) {
    const errors = {...this.errors.getValue(), [id]: message};
    this.errors.next(errors);
  }

  removeError(id: string) {
    const errors = this.errors.getValue();
    delete errors[id];
    this.errors.next(errors);
  }
}
