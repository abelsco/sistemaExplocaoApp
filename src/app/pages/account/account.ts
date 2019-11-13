import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  cliente: any = {
    codCli: 0,
    codSilo: 0,
    usuario: '',
    senha: '',
    tipoGrao: '',
    nomeSilo: '',
  };


  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    private userData: UserData,
  ) { }

  ngAfterViewInit() {
    this.getCliente();
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancelar will close the alert and do nothing
  async changeNomeSilo() {
    const alert = await this.alertCtrl.create({
      header: 'Nome do Silo',
      buttons: [
        'Cancelar',
        {
          text: 'Confirmar',
          handler: (data: any) => {
            // console.log(data);

            this.getCliente();
            this.cliente.nomeSilo = data.nomeSilo;
            this.userData.suporte(this.cliente, 'nomeSilo');
            // console.log(this.cliente);

          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'nomeSilo',
          placeholder: 'Nome'
        }
      ]
    });
    await alert.present();
  }

  async changeSenha() {
    const alert = await this.alertCtrl.create({
      header: 'Mudar a senha',
      buttons: [
        'Cancelar',
        {
          text: 'Confirmar',
          handler: (data: any) => {
            // console.log(data);
            
            let dados: any = {
              codCli: this.cliente.codCli,
              usuario: this.cliente.usuario,
              senha: data.senhaAntiga,
              senhaNova: data.senhaNova,
              confirma: data.confirma,              
            }
            this.userData.suporte(dados, 'senha');
            // console.log(this.cliente);


          }
        }
      ],
      inputs: [
        {
          type: 'password',
          name: 'senhaAntiga',
          placeholder: 'Senha antiga'
        },
        {
          type: 'password',
          name: 'senhaNova',
          placeholder: 'Nova senha'
        },
        {
          type: 'password',
          name: 'confirma',
          placeholder: 'Repita a nova senha'
        },
      ]
    });
    await alert.present();
  }

  async changeTipoGrao() {
    const alert = await this.alertCtrl.create({
      header: 'Tipo de Grão',
      inputs: [
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Açúcar em pó',
          value: 'Açúcar em pó',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Alho desidratado',
          value: 'Alho desidratado',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Arroz',
          value: 'Arroz',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Semente de arroz(casca)',
          value: 'Semente de arroz(casca)',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Casca de arroz',
          value: 'Casca de arroz',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Proteína de soja',
          value: 'Proteína de soja',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Farinha de soja',
          value: 'Farinha de soja',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Trigo bruto',
          value: 'Trigo bruto',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Farinha de trigo',
          value: 'Farinha de trigo',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Trigo Cereal',
          value: 'Trigo Cereal',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Palha de trigo',
          value: 'Palha de trigo',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Polvilho de trigo',
          value: 'Polvilho de trigo',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Milho',
          value: 'Milho',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Casca de milho cru',
          value: 'Casca de milho cru',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Polvilho de milho',
          value: 'Polvilho de milho',
        },
        {
          name: 'tipoGrao',
          type: 'radio',
          label: 'Semente de milho',
          value: 'Semente de milho',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancelar');
          }
        }, {
          text: 'Confirmar',
          handler: (data: any) => {
            // console.log(data);

            // this.getCliente();
            this.cliente.tipoGrao = data;
            this.userData.suporte(this.cliente, 'tipoGrao');
            // console.log(this.cliente);
          }
        }
      ]
    });
    await alert.present();
  }

  async getCliente() {
    await this.userData.getCliente().then(async (atualCliente) => {
      this.cliente.codCli = atualCliente.codCli;
      this.cliente.usuario = atualCliente.usuario;
      this.cliente.senha = atualCliente.senha;
      await this.userData.getSilo().then((atualSilo) => {
        this.cliente.tipoGrao = atualSilo.tipoGrao;
        this.cliente.codSilo = atualSilo.codSilo;
      });
    });
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/app/tabs/schedule');
  }

  delete() {
    this.deletarConta();
  }

  async deletarConta() {
    const alert = await this.alertCtrl.create({
      header: 'Deletar conta',
      message: 'Para confirmar digite sua senha<br />Todos os seus dados serão <strong>perdidos</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancelar: blah');
          }
        }, {
          text: 'Sim',
          handler: (dado: any) => {
            // console.log(dado);

            this.cliente.senha = dado.senha;
            this.userData.suporte(this.cliente, 'deletar');
          }
        }
      ],
      inputs: [
        {
          type: 'password',
          name: 'senha',
          placeholder: 'Confirme sua senha'
        }
      ]
    });
    await alert.present();
  }
}
