import { Cliente } from './../../interfaces/user-options';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { DbDataService } from '../../providers/db-data.service';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  cliente: Cliente = { 
    codCli: 0,
    usuario: '', 
    senha: '', 
    nomeSilo: '', 
    tipoGrao: '', 
    endSilo: ''
  };
  

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    private userData: UserData,
    private dbData: DbDataService
  ) { }

  ngAfterViewInit() {
    this.getCliente();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeEndSilo() {
    const alert = await this.alertCtrl.create({
      header: 'Mudar Endereço do Silo',
      buttons: [
        'Cancelar',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.cliente.endSilo = data.endSilo;
            this.dbData.postTipoGrao(this.cliente);               
            this.getCliente();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'endSilo',
          value: this.cliente.endSilo,
          placeholder: 'Endereço do Silo'
        }
      ]
    });
    await alert.present();
  }

  getCliente() {
    this.userData.getCliente().then((Cliente) => {
      this.cliente = Cliente;      
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/app/tabs/schedule');
  }

  support() {
    this.router.navigateByUrl('/support');
  }
}
