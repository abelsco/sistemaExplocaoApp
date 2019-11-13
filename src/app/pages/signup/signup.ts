import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: any = {
    usuario: '',
    senha: '',
    nomeSilo: '',
    codSerie: '',
    tipoGrao: ''
  };
  submitted = false;

  constructor(
    public router: Router,
    public userData: UserData
  ) {  }

  onSignup(form: NgForm) {
    this.submitted = true;
    // console.log(sha512(this.signup.senha));

    if (form.valid) {
      this.userData.signup(this.signup);
      // this.router.navigateByUrl('/app/tabs/schedule');
    }
  }
}
