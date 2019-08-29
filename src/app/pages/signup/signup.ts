import { Component } from '@angular/core';
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
  signup: Cliente = {
    codCli: 0,
    usuario: '',
    senha: '',
    nomeSilo: '',
    endSilo: '',
    tipoGrao: ''
  };
  submitted = false;
  cliente: Cliente = {
    codCli: 0,
    usuario: '',
    senha: '',
    nomeSilo: '',
    tipoGrao: '',
    endSilo: ''
  };

  constructor(
    public router: Router,
    public userData: UserData
  ) { }

  onSignup(form: NgForm) {
    this.submitted = true;
    this.cliente = {
      codCli: 0,
      usuario: this.signup.usuario,
      senha: this.signup.senha,
      nomeSilo: this.signup.nomeSilo,
      endSilo: 'http://' + this.signup.endSilo + ':3000/api/ambiente/',
      tipoGrao: this.signup.tipoGrao
    }
    if (form.valid) {
      this.userData.signup(this.cliente);
      // Aqui a definição dos parámetros
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }
}
