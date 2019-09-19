import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
import { RequestPasswordService } from 'src/app/services/request-password.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'webui-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./../authorization.scss']
})
export class RequestPasswordComponent implements OnInit {

  responseMessage;

  constructor(private _requestPass: RequestPasswordService) { }

  request = new FormGroup({
    userInput: new FormControl('', [ Validators.required, Validators.minLength(3)])});

  ngOnInit() {
  }

  onSubmit(): void {
    const data: string = this.request.value.userInput;
    this._requestPass.requestPassword(data)
      .subscribe(resp => {
        // @ts-ignore
        this._requestPass.notifyUser(resp.body.data);
      });
  }
}
