import { Component } from "@angular/core";
import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { ApiMsgValidator } from "./ApiMsg.validator";


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

  validations: {[id: string]: ValidatorFn} = {};

  get userName() {
    return this.form.get('userName');
  }

  constructor(private apiMsgValidator: ApiMsgValidator) {
    this.form.valueChanges.subscribe(() => console.log(this.form));
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
      [id]: apiMsgValidator(message, id),
    };
    this.form.controls['userName'].setErrors({ 
      invalid: true,
      backend: true,
      msg_id: id,
      message
    });
    this.form.controls['userName'].markAsUntouched();
    this.form.controls['userName'].addValidators(this.validations[id]);
    this.form.updateValueAndValidity();
  }

  addAsyncError() {
    const id = '17';
    const message = 'Luke I am your father, come join me on the backend team';
    this.apiMsgValidator.addApiMsg(id, message);
    this.form.controls['userName'].setErrors({ 
      invalid: true,
      backend: true,
      msg_id: id,
      message,
      async: true 
    });
    this.form.controls['userName'].addAsyncValidators(this.apiMsgValidator.validate);
    this.form.updateValueAndValidity();
  }

  toggleEditor() {
    this.editMode.next(!this.editMode.getValue());
    console.log(this.form);
  }

  removeValidator(id: string) {
    this.form.controls['userName'].removeValidators(this.validations[id]);
    this.form.controls['userName'].setErrors({ 
      invalid: null,
      backend: null  });
    this.form.updateValueAndValidity();
  }
  removeAsyncValidator(id: string) {
    this.apiMsgValidator.removeApiMsg(id);
  }
}

export function apiMsgValidator(message: string, id: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const bakendMsg = true;
    console.log(control)
    return !control.touched ? { 
      invalid: true,
      backend: true,
      msg_id: id,
      message
     } : { 
      invalid: false,
      backend: false,
      msg_id: id,
      message
     };
  };
}