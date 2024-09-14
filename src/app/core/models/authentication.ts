import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class hasUserController {

}

export class LoginControllers {
    authenticationForm: FormGroup;

    constructor(formBuilder: FormBuilder) {
        this.authenticationForm = formBuilder.group({
            username: [''],
            password: ['', [Validators.required, Validators.min(6), Validators.maxLength(6)]]
        })
    }
}

export interface Login {
    username: number;
    password: string;
}