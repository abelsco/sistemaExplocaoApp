import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { DatabaseService, Cliente } from '../../providers/database.service';

import { UserOptions } from '../../interfaces/user-options';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { username: '', password: '', endSilo: '', tipoGrao: '' };
  submitted = false;
  public cliente: Cliente

  constructor(
    public router: Router,
    public userData: UserData,
    public dbs: DatabaseService,
  ) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      // this.userData.signup(this.signup.username, this.signup.tipoGrao);
      // Aqui a definição dos parámetros
      this.dbs.addCliente(this.signup.username, this.signup.password, this.signup.username, this.signup.endSilo, this.signup.tipoGrao);
      this.cliente = <Cliente><any>this.dbs.loginCliente(this.signup.username, this.signup.password);
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }
}
