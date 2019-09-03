import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'webui-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private error: string;

  constructor(private auth: AuthService) {
  }

  login: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  onSubmit(event): void {
    event.preventDefault();

    const data: { username: string, password: string } = {
      password: this.login.get('password').value,
      username: this.login.get('username').value
    };

    if (this.login.valid) {
      this.auth.signIn(data);
    } else {
      this.error = 'Введіть логін та пароль';
    }
  }

  ngOnInit() {
  }
}
