import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { Cliente } from '../../interfaces/user-options';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: Cliente = { usuario: '', senha: '', nomeSilo: '', endSilo: '', tipoGrao: '' };
  submitted = false;
  cliente: Cliente;

  constructor(
    public router: Router,
    public userData: UserData
  ) {}

  onSignup(form: NgForm) {
    this.submitted = true;
    this.cliente = {
      usuario: this.signup.usuario, 
      senha: this.signup.senha,
      nomeSilo: this.signup.nomeSilo,
      endSilo: this.signup.endSilo,
      tipoGrao: this.signup.tipoGrao
    }
    if (form.valid) {
      this.userData.signup(this.cliente);
      // Aqui a definição dos parámetros
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }
}
