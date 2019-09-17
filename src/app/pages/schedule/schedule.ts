import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { DbDataService } from '../../providers/db-data.service';
import { Silo, Cliente } from './../../interfaces/user-options';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})

export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList') scheduleList: IonList;
  color: (value: number) => string;

  segment = 'monitoramento';
  situaSilo: string;
  loop: NodeJS.Timeout;
  atualSilo: Silo = {
    codSilo: 0,
    codCli: 0,
    dia: '',
    temperatura: 0,
    situTemperatura: 0,
    umidade: 0,
    situUmidade: 0,
    pressao: 0,
    situPressao: 0,
    concePo: 0,
    situConcePo: 0,
    conceOxi: 0,
    situConceOxi: 0,
    fonteIg: 0,
    situFonteIg: 0,
    situaSilo: 0,
  };
  gauge = {
    dialStartAngle: 180,
    dialEndAngle: 0,
    min: 0,
    max: 100,
    animationDuration: 1,
    animated: true,
  };
  classificacao = {
    situTemperatura: '',
    situUmidade: '',
    situPressao: '',
    situConcePo: '',
    situConceOxi: '',
    situFonteIg: '',
    situaSilo: '',
    gera: function (valor: number, tipo: string): string {
      switch (tipo) {
        case 'situaSilo':
          if (valor > 85) {
            return 'Crítica'
          } else if (valor <= 85 && valor > 60) {
            return 'Alerta'
          }
          else
            return 'Normal'

        default:
          break;
      }

    }
  };

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public toastCtrl: ToastController,
    private user: UserData,
    private db: DbDataService
  ) {
    this.color = function (value: number): string {
      if (value < 20) {
        return "#5ee432"; // green
      } else if (value < 40) {
        return "#fffa50"; // yellow
      } else if (value < 60) {
        return "#f7aa38"; // orange
      } else {
        return "#ef4655"; // red
      }
    }
  }

  ngOnInit() {
    this.user.getCliente().then(atual => {
      try {
        this.loop = setInterval(() => {
          this.updateAmb(atual);
        }, 2500);
      } catch (error) {
        console.log('Error ' + error);
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.loop);
  }

  // async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
  //   if (this.user.hasFavorite(sessionData.name)) {
  //     // woops, they already favorited it! What shall we do!?
  //     // prompt them to remove it
  //     this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
  //   } else {
  //     // remember this session as a user favorite
  //     this.user.addFavorite(sessionData.name);

  //     // create an alert instance
  //     const alert = await this.alertCtrl.create({
  //       header: 'Favorite Added',
  //       buttons: [{
  //         text: 'OK',
  //         handler: () => {
  //           // close the sliding item
  //           slidingItem.close();
  //         }
  //       }]
  //     });
  //     // now present the alert on top of all other content
  //     await alert.present();
  //   }

  // }

  // async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
  //   const alert = await this.alertCtrl.create({
  //     header: title,
  //     message: 'Would you like to remove this session from your favorites?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: () => {
  //           // they clicked the cancel button, do not remove the session
  //           // close the sliding item and hide the option buttons
  //           slidingItem.close();
  //         }
  //       },
  //       {
  //         text: 'Remove',
  //         handler: () => {
  //           // they want to remove this session from their favorites
  //           this.user.removeFavorite(sessionData.name);
  //           this.updateSchedule();

  //           // close the sliding item and hide the option buttons
  //           slidingItem.close();
  //         }
  //       }
  //     ]
  //   });
  //   // now present the alert on top of all other content
  //   await alert.present();
  // }

  // async openSocial(network: string, fab: HTMLIonFabElement) {
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Posting to ${network}',
  //     duration: (Math.random() * 1000) + 500
  //   });
  //   await loading.present();
  //   await loading.onWillDismiss();
  //   fab.close();
  // }

  async updateAmb(atual: Cliente) {
    this.user.isLoggedIn().then(logado => {
      if (logado) {
        try {
          this.db.getAmbi(atual).then((data) => {
            this.atualSilo = data;
            this.classificacao.situaSilo = this.classificacao.gera(this.atualSilo.situaSilo, 'situaSilo');
          });

        } catch (error) {
          console.log("updateAmb:" + error);
        }
      }
      else {
        this.user.zeraSilo().then(data => {
          this.atualSilo = data;
        });
      }
    });
  }
}
