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
    situaSilo: 0
  };

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public toastCtrl: ToastController,
    private user: UserData,
    private db: DbDataService
  ) { }

  ngOnInit() {
    this.user.getCliente().then(atual => {
      this.loop = setInterval(() => {
        this.updateAmb(atual);
      }, 2500);
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
    this.db.getAmbi(atual).then((data) => {
      this.atualSilo = data;
    });
  }
}
