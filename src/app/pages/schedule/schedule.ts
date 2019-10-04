import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController, IonSlides } from '@ionic/angular';
import { UserData } from '../../providers/user-data';
import { Silo, Leitura, construtorLeitura, construtorSilo } from './../../interfaces/user-options';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})

export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('slides', {static: true}) slider: IonSlides;
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
    situConceGas: '',
    situaSilo: '',
    gera: function (valor: number, tipo: string): string {
      switch (tipo) {
        case 'situaSilo':
          if (valor > 85) {
            return 'Crítica'
          } else if (valor <= 85 && valor > 40) {
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

        case 'situConceGas':
          if (valor >= 10 && valor < 25) {
            return 'Alerta: 10% do Limite Inferior de Inflamabilidade atingido'
          } else if (valor >= 25 && valor < 80) {
            return 'Alerta: 25% do Limite Inferior de Inflamabilidade atingido'
          } else if (valor >= 80) {
            return 'Crítico: Nivel de Gás muito próximo do limite'
          }
          else
            return 'Nivel Gás Seguro'

        case 'situConcePo':
          if (valor >= 10 && valor < 25) {
            return 'Alerta: 10% do Limite Inferior de Inflamabilidade atingido'
          } else if (valor >= 25 && valor < 80) {
            return 'Alerta: 25% do Limite Inferior de Inflamabilidade atingido'
          } else if (valor >= 80) {
            return 'Crítico: Nivel de Concentração de Poeira muito próximo do limite'
          }
          else
            return 'Nivel Concentração de Poeira Seguro'

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
    this.atualSilo = construtorSilo();
    this.color = function (value: number): string {
      if (value < 40) {
        return "#5ee432"; // green
      } else if (value < 40) {
        return "#fffa50"; // yellow
      } else if (value < 70) {
        return "#f7aa38"; // orange
      } else {
        return "#ef4655"; // red
      }
    }
  }

  ngOnInit() {
    this.atualLeitura = construtorLeitura();
    this.user.getSilo().then(atual => {
      if (atual != undefined) {
        this.atualSilo = atual;
      }
      else {
        this.atualSilo = construtorSilo();
      }
      try {
        this.loop = setInterval(() => {
          this.updateAmb();
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

  async updateAmb() {
    this.user.isLoggedIn().then(logado => {
      if (logado) {
        this.user.getSilo().then(atual => {
          this.atualSilo = atual;
          try {
            this.user.getAmbi(atual);
            this.user.getLeitura().then(data => {
              // Lembrar de classificar melhor Aqui            
              if (data.codLeitura) {
                this.atualLeitura = data;
                this.classificacao.situaSilo = this.classificacao.gera(this.atualLeitura.situaSilo, 'situaSilo');
                this.classificacao.situConceOxi = this.classificacao.gera(this.atualLeitura.conceOxi, 'situConceOxi');
                this.classificacao.situConceGas = this.classificacao.gera(this.atualLeitura.situConceGas, 'situConceGas');

              } else {
                this.atualLeitura = construtorLeitura();
                this.classificacao.situaSilo = this.classificacao.gera(this.atualLeitura.situaSilo, 'situaSilo');
                this.classificacao.situConceOxi = this.classificacao.gera(this.atualLeitura.conceOxi, 'situConceOxi');
                this.classificacao.situConceGas = this.classificacao.gera(this.atualLeitura.situConceGas, 'situConceGas');
              }
            });

          } catch (error) {
            console.log("updateAmb:" + error);
          }
        });
      }
      else {
        this.user.zeraLeitura().then(data => {
          this.atualSilo = construtorSilo();
          this.atualLeitura = data;
          this.classificacao.situaSilo = this.classificacao.gera(this.atualLeitura.situaSilo, 'situaSilo');
          this.classificacao.situConceOxi = this.classificacao.gera(this.atualLeitura.conceOxi, 'situaSilo');
          this.classificacao.situConceGas = this.classificacao.gera(this.atualLeitura.situConceGas, 'situConceGas');
        });
      }
    });
  }
}
