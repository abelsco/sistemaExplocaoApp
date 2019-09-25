import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, LoadingController, ModalController, ToastController, IonSlides } from '@ionic/angular';
import { UserData } from '../../providers/user-data';
import { Silo, Leitura, construtorLeitura } from './../../interfaces/user-options';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})

export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('slides') slider: IonSlides;
  color: (value: number) => string;

  segment = 0;
  private loop: NodeJS.Timeout;
  atualSilo: Silo;
  atualLeitura: Leitura;
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

        case 'situConceOxi':
          if (valor <= 19) {
            return 'Alerta: Nivel Oxigênio Baixo'
          } else if (valor > 23) {
            return 'Alerta: Nivel Oxigênio Alto'
          }
          else
            return 'Nivel Seguro'

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
  ) {
    this.atualLeitura = construtorLeitura();
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
    this.atualLeitura = construtorLeitura();
    this.user.getSilo().then(atual => {
      try {
        this.loop = setInterval(() => {
          this.updateAmb(atual);
        }, 2000);
      } catch (error) {
        console.log('Error ' + error);
      }
    });
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  ngOnDestroy() {
    clearInterval(this.loop);
  }

  async updateAmb(atual: Silo) {
    this.user.isLoggedIn().then(logado => {
      if (logado) {
        try {
          this.user.getAmbi(atual);
          this.user.getLeitura().then(data => {
            // Lembrar de classificar melhor Aqui            
            if (data.codLeitura) {
              this.atualLeitura = data;
              this.classificacao.situaSilo = this.classificacao.gera(this.atualLeitura.situaSilo, 'situaSilo');
              this.classificacao.situConceOxi = this.classificacao.gera(this.atualLeitura.conceOxi, 'situConceOxi');

            } else {
              this.atualLeitura = construtorLeitura();
              this.classificacao.situaSilo = this.classificacao.gera(this.atualLeitura.situaSilo, 'situaSilo');
              this.classificacao.situConceOxi = this.classificacao.gera(this.atualLeitura.conceOxi, 'situConceOxi');
            }
          });

        } catch (error) {
          console.log("updateAmb:" + error);
        }
      }
      else {
        this.user.zeraLeitura().then(data => {
          this.atualLeitura = data;
        });
      }
    });
  }
}
