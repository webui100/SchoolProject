import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ValidationService {
  constructor() {}

  private ukrNameReg = /^[А-ЯІҐЄЇ-]{1}[а-яіїєґ-]*$/;
  private emailReg = /^[a-z0-9\.-]{2,16}@[a-z]{2,10}\.[a-z]{2,4}$/i; // with new RegExp doesnt work this pattern
  private phoneReg = /^[+0-9]{10,13}$/;
  private loginReg = /^[a-zA-Z0-9]{5,16}$/i;
  private passwordReg = /^[a-zA-Z0-9]{5,16}$/;
  private marknameReg = /^[А-ЯІҐЄЇ -]{1}[а-яіїєґ -]*$/;

  get ukrNameRegExp(): RegExp {
    return this.ukrNameReg;
  }

  get emailRegExp(): RegExp {
    return this.emailReg;
  }

  get phoneRegExp(): RegExp {
    return this.phoneReg;
  }

  get loginRegExp(): RegExp {
    return this.loginReg;
  }

  get passwordRegExp(): RegExp {
    return this.passwordReg;
  }
  get markNameRegExp(): RegExp {
    return this.marknameReg;
  }
}
