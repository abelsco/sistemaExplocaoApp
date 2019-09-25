import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Events, MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Monitoramento',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    /* {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'contacts'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    }, */
    {
      title: 'Sobre',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  private toast: HTMLIonToastElement;

  constructor(
    private events: Events,
    private backgroundMode: BackgroundMode,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private toastController: ToastController,
    private userData: UserData,
  ) {
    this.initializeApp();
    this.backgroundMode.enable();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleBlackTranslucent();
      // this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString("#1a3225");
      this.splashScreen.hide();
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.updateLoggedInStatus(true);
      return this.router.navigateByUrl('/app/tabs/schedule');
    });

    this.events.subscribe('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe('user:logout', () => {
      this.updateLoggedInStatus(false);
      return this.router.navigateByUrl('/app/tabs/schedule');
    });

    this.events.subscribe('user:login-faill', () => {
      this.presentToast('user:login-faill');
    });

    this.events.subscribe('user:del', () => {
      this.presentToast('user:del');
    });

    this.events.subscribe('user:del-faill', () => {
      this.presentToast('user:del-faill');
    });

    this.events.subscribe('user:update', () => {
      this.presentToast('user:update');
    });

    this.events.subscribe('user:update-faill', () => {
      this.presentToast('user:update-faill');
    });
  }

  async presentToast(opcao: string) {
    switch (opcao) {
      case 'user:login-faill':
        this.toast = await this.toastController.create({
          message: 'Usuário e/ou senha invalidos.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:del':
        this.toast = await this.toastController.create({
          message: 'Cliente excluído.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:del-faill':
        this.toast = await this.toastController.create({
          message: 'Senha incorreta.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:update':
        this.toast = await this.toastController.create({
          message: 'Sucesso.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:update-faill':
        this.toast = await this.toastController.create({
          message: 'Falhou tente novamente.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:delete':
        this.toast = await this.toastController.create({
          header: 'Toast header',
          message: 'Click to Close',
          position: 'bottom',
          color: 'tertiary',
          buttons: [
            {
              side: 'start',
              text: 'Favorite',
              handler: () => {
                console.log('Favorite clicked');
              }
            }, {
              text: 'Done',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        this.toast.present();
        break;

      default:
        break;
    }
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
