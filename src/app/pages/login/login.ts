import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { Cliente } from '../../interfaces/user-options';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: Cliente = { 
    codCli: 0,
    usuario: '', 
    senha: '', 
    nomeSilo: '', 
    tipoGrao: '', 
    endSilo: ''
  };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router
  ) { }

  async onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      await this.userData.login(this.login.usuario, this.login.senha);
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
