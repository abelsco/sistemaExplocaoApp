import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Events, MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification/ngx';


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
    private localNotifications: LocalNotifications,
    private webNotifications: PhonegapLocalNotification,
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
      if (this.platform.is('hybrid')) {
        // this.statusBar.styleBlackTranslucent();
        // this.statusBar.overlaysWebView(true);
        this.statusBar.backgroundColorByHexString("#1a3225");
        this.localNotifications.requestPermission().then(() => {
          this.localNotifications.setDefaults({
            led: { color: '#FF00FF', on: 500, off: 500 },
            vibrate: true,
            icon: 'icon',
            foreground: true,
            wakeup: true,
            // trigger: {at: new Date(new Date().getTime() + 1000*60)},
          });

        });

        this.splashScreen.hide();
      }
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
      return this.router.navigateByUrl('/app/tabs/schedule');
    });

    this.events.subscribe('user:logout', () => {
      this.updateLoggedInStatus(false);
      return this.router.navigateByUrl('/app/tabs/schedule');
    });

    this.events.subscribe('user:login-falha', () => {
      this.presentToast('user:login-falha');
    });

    this.events.subscribe('user:del', () => {
      this.presentToast('user:del');
    });

    this.events.subscribe('user:del-falha', () => {
      this.presentToast('user:del-falha');
    });

    this.events.subscribe('user:update', () => {
      this.presentToast('user:update');
    });

    this.events.subscribe('user:update-falha', () => {
      this.presentToast('user:update-falha');
    });

    this.events.subscribe('user:senha-falha', () => {
      this.presentToast('user:senha-falha');
    });

    this.events.subscribe('alerta:leitura-critica', () => {
      this.presentToast('alerta:leitura-critica');
    });

    this.events.subscribe('user:falha-usuario', () => {
      this.presentToast('user:falha-usuario');
    });

    this.events.subscribe('user:falha-silo', () => {
      this.presentToast('user:falha-silo');
    });
  }

  async presentToast(opcao: string) {
    switch (opcao) {
      case 'user:login-falha':
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
      case 'user:del-falha':
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
      case 'user:update-falha':
        this.toast = await this.toastController.create({
          message: 'Falhou tente novamente.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:senha-falha':
        this.toast = await this.toastController.create({
          message: 'Senhas diferentes.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:falha-usuario':
        this.toast = await this.toastController.create({
          message: 'Usuário existente.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'user:falha-silo':
        this.toast = await this.toastController.create({
          message: 'CodSerie existente.',
          duration: 2000
        });
        this.toast.present();
        break;
      case 'alerta:leitura-critica':
        if (this.platform.is('hybrid')) {
          if (this.localNotifications.hasPermission()) {
            this.localNotifications.schedule({
              id: 0,
              title: 'Cuidado',
              text: 'O silo pode estar em perigo',
            });
          }
        } else {
          this.webNotifications.requestPermission().then(
            (permission) => {
              if (permission === 'granted') {

                // Create the notification
                this.webNotifications.create('Cuidado', {
                  // tag: 'message1',
                  body: 'O silo pode estar em perigo',
                  icon: 'icon'
                });

              }
            }
          );

        }
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
