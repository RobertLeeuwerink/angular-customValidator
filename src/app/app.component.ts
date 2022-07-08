import { Component } from "@angular/core";
import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { BehaviorSubject, map, Observable, of, takeWhile } from "rxjs";
import { LogService } from "./log.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})export class AppComponent {
  form = new FormGroup({
    userName: new FormControl(''),
    userLastName: new FormControl(''),
  });
  editMode = new BehaviorSubject<boolean>(true);

  validations: {[id: string]: ValidatorFn | AsyncValidatorFn} = {};

  get userName() {
    return this.form.get('userName');
  }

  constructor(private logService: LogService) {
    // this.form.valueChanges.subscribe(() => console.log(this.form));
  }

  updateUser() {
    this.addError(); // this is to simulate a scenario where the back tells something is wrong we want to add that message to the form and keep it there until the conditions are corrected. currently gets cleared when toggling editing mode or when you touch a control field of the forms
  }

  updateUserAsync() {
    this.addAsyncError();
  }

  reset() {
    this.form.reset();
  }

  addError() {
    const id = '17';
    const message = 'Luke I am your father, come join me on the backend team';
    this.validations = {
      ...this.validations,
      [id]: apiMsgValidatorWithService(message, id, this.logService),
    };
    this.form.controls['userName'].setErrors({ 
      validatorFnId: id,
      message
    });
    this.logService.addError(id, message);
    this.form.controls['userName'].markAsUntouched();
    this.form.controls['userName'].addValidators(this.validations[id]);
    this.form.updateValueAndValidity();
  }

  addAsyncError() {
    const id = '17';
    const message = 'Luke I am your father, come join me on the backend team';
    this.validations = {
      ...this.validations,
      [id]: apiMsgValidatorAsyncFn(message, id, this.logService),
    };
    this.logService.addError(id, message);
    this.form.controls['userName'].setErrors({ 
      validatorFnId: id,
      message,
      async: true
    });
    this.form.get('userName')?.addAsyncValidators(this.validations[id] as AsyncValidatorFn);
    this.form.updateValueAndValidity();
  }

  toggleEditor() {
    this.editMode.next(!this.editMode.getValue());
    console.log(this.form);
  }

  removeValidator(id: string) {
    this.form.get('userName')?.removeValidators(this.validations[id]);
    this.form.get('userName')?.setErrors(null);
    this.logService.removeError(id);
    this.form.updateValueAndValidity();
  }

  removeValidatorAsync(id: string) {
    this.form.get('userName')?.removeAsyncValidators(this.validations[id] as AsyncValidatorFn);
    this.form.get('userName')?.setErrors(null);
    this.logService.removeError(id);
    this.form.updateValueAndValidity();
  }
}

export function apiMsgValidatorDif(message: string, validatorFnId: string, original_value: string): ValidatorFn {
  // this keeps the error around but will be marked valid aslong as the value is different from the one at the point this validator is created. so if someone removes the changes they made the error returns
  return (control: AbstractControl): ValidationErrors | null => {
    return original_value !== control.getRawValue() ? { 
      message,
      validatorFnId
     } : null;
  };
}

export function apiMsgValidatorOnControlTouched(message: string, validatorFnId: string): ValidatorFn {
  // requires the control to be set to untouched so it doesn't need to get removed but if marked as untouched again the error will return
  return (control: AbstractControl): ValidationErrors | null => {
    return control.untouched ? { 
      message,
      validatorFnId
     } : null;
  };
}

export function apiMsgValidatorDeleteValidator(message: string, validatorFnId: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // control.removeValidators( instance of ValidatorFn ) you have to remove error from the control to make the form valid. So you bubble back to originating ts file where you should have the ValidatorFn instance
    return { 
      message,
      validatorFnId
     };
  };
}


export function apiMsgValidatorWithService(message: string, validatorFnId: string, logService: LogService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => { 
    return logService.findError(validatorFnId) ? 
      { 
        message,
        validatorFnId
       } :  null; 
  }
}

export function apiMsgValidatorAsyncFn(message: string, validatorFnId: string, logService: LogService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => 
    // logService.findError(validatorFnId) ? of({ message, validatorFnId, async: true }) : of(null);
    new Promise((resolve, reject) => resolve(logService.findError(validatorFnId) ? { message, validatorFnId, async: true } : null));  
}