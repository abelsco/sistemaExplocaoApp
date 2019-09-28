import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { Cliente, construtorCliente } from '../../interfaces/user-options';



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
  };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router
  ) {
    this.login = construtorCliente();
  }

  ngOnInit() {
    // this.login = construtorCliente();
  }

  ionViewDidLeave() {    
    this.login = construtorCliente();
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.userData.login(this.login.usuario, this.login.senha);
    }
  }
  
  onSignup() {
    this.router.navigateByUrl('/signup');
  }

  ngOnDestroy() {
    // this.login = construtorCliente();
  }
}
