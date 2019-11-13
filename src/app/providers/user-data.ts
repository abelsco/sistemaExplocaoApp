import { Cliente, Silo, Leitura, construtorCliente, construtorSilo, construtorLeitura } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DbDataService } from './db-data.service';
import { sha512_256 } from 'js-sha512';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  private cliente: Cliente;
  private silo: Silo;
  private leitura: Leitura;
  Minute: number = Date.now();
  constructor(
    public events: Events,
    private storage: Storage,
    private dbData: DbDataService,
  ) {
    this.cliente = construtorCliente();
    this.silo = construtorSilo();
    this.leitura = construtorLeitura();
  }

  async zeraLeitura(): Promise<Leitura> {
    let atual: Leitura = construtorLeitura();
    await this.storage.set('leitura', atual);
    const value = await this.getLeitura();
    return value;
  }

  suporte(dados: any, opcao: string) {
    switch (opcao) {
      case 'tipoGrao':
        return this.dbData.postTipoGrao(dados).subscribe((resposta) => {
          if (resposta.status == 'sucesso') {
            this.getSilo().then(atual => {
              atual.tipoGrao = dados.tipoGrao;
              this.setSilo(atual);
              this.events.publish('user:update');

            });
          } else {
            this.events.publish('user:update-falha');
          }
        });
      case 'nomeSilo':
        return this.dbData.postNomeSilo(dados).subscribe((resposta) => {
          if (resposta.status == 'sucesso') {
            this.events.publish('user:update');
          } else {
            this.events.publish('user:update-falha');
          }
        });
      case 'senha':
        if (dados.senhaNova == dados.confirma) {
          dados.senha = sha512_256(dados.senha);
          dados.senhaNova = sha512_256(dados.senhaNova);
          return this.dbData.postSenhaCliente(dados).subscribe((resposta) => {
            if (resposta.status == 'sucesso') {
              this.events.publish('user:update');
            } else {
              this.events.publish('user:update-falha');
            }
          });

        } else { return this.events.publish('user:senha-falha'); }

      case 'deletar':
        dados.senha = sha512_256(dados.senha);
        return this.dbData.postDeletaCliente(dados).subscribe((resposta) => {
          // console.log(resposta);

          if (resposta.status == 'sucesso') {
            this.events.publish('user:del');
            return this.logout();
          }
          else {
            this.events.publish('user:del-falha');
          }
        });

      default:
        break;
    }
  }

  login(usuario: string, senha: string) {
    senha = sha512_256(senha);
    return this.dbData.getLogin(usuario, senha).subscribe((data) => {
      if (data.codCli) {
        // console.log(data);
        this.silo = data;
        this.cliente = {
          codCli: data.codCli,
          usuario: usuario,
          senha: senha
        };
        this.setCliente(this.cliente);
        this.setSilo(this.silo);
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.events.publish('user:login');
      }
      else
        this.events.publish('user:login-falha');
    });
  }

  signup(dados: any) {
    let senha = dados.senha;
    let codSerie = dados.codSerie;
    dados.senha = sha512_256(senha);
    dados.codSerie = sha512_256(codSerie);
    return this.dbData.postCliente(dados).subscribe(resposta => {    

      if (resposta.falha == 'usuario') {
        dados.senha = senha;
        dados.usuario = '';
        dados.codSerie = codSerie;
        return this.events.publish('user:falha-usuario');
      } else if (resposta.falha == 'silo') {
        dados.senha = senha;
        dados.codSerie = '';
        return this.events.publish('user:falha-silo');
      } else {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.silo = {
          codSilo: resposta.codSilo,
          codCli: resposta.codCli,
          codSerie: resposta.codSerie,
          nomeSilo: resposta.nomeSilo,
          tipoGrao: resposta.tipoGrao,
        };
        this.cliente = {
          codCli: resposta.codCli,
          usuario: dados.usuario,
          senha: dados.senha,
        };
        this.setSilo(this.silo);
        this.setCliente(this.cliente);
        return this.events.publish('user:signup');
      }
    });
  }

  async logout(): Promise<any> {
    await this.storage.remove(this.HAS_LOGGED_IN);
    // Deslogar no banco 
    await this.storage.remove('cliente');
    await this.storage.remove('silo');
    await this.storage.remove('data');
    await this.storage.remove('chart');
    return this.events.publish('user:logout');
  }

  async setCliente(cliente: Cliente): Promise<any> {
    await this.storage.set('cliente', cliente);
  }

  async setSilo(silo: Silo): Promise<any> {
    await this.storage.set('silo', silo);
  }

  async setLeitura(leitura: Leitura): Promise<any> {
    await this.storage.set('leitura', leitura);
  }

  async setTimer(data: Date): Promise<any> {
    await this.storage.set('data', data);
  }

  async setChart(chart: any): Promise<any> {
    await this.storage.set('chart', chart);
  }

  async getCliente(): Promise<Cliente> {
    const value = await this.storage.get('cliente');
    return value;
  }

  async getSilo(): Promise<Silo> {
    const value = await this.storage.get('silo');
    return value;
  }

  async getLeitura(): Promise<Leitura> {
    const value = await this.storage.get('leitura');
    return value;
  }

  private async getTimer(): Promise<Date> {
    const value = await this.storage.get('data');
    return value;
  }

  async getChart(): Promise<any> {
    const value = await this.storage.get('chart');
    return value;
  }

  async isLoggedIn(): Promise<boolean> {
    const value = await this.storage.get(this.HAS_LOGGED_IN);
    return value === true;
  }

  async checkHasSeenTutorial(): Promise<string> {
    const value = await this.storage.get(this.HAS_SEEN_TUTORIAL);
    return value;
  }

  getAmbi(atual: Silo) {
    return this.dbData.getAmbi(atual).subscribe(data => {
      if (data.codLeitura) {
        atual.tipoGrao = data.tipoGrao;
        this.setSilo(atual);
        this.setSituacao(atual, data);
      }
    });
  }

  getRelatorio(codSilo: number, opcao: string) {
    return this.dbData.getRelatorio(codSilo, opcao).subscribe(data => {
      this.setChart(data);
    })
  }

  private setSituacao(atual: Silo, resposta: any) {
    switch (atual.tipoGrao) {
      case "Açúcar em pó":
        this.leitura.pressao = 7.7;
        this.leitura.temperatura = 370;
        this.leitura.conceOxi = 21;
        // this.leitura.fonteIg = 0.03;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;

      case "Alho desidratado":
        this.leitura.pressao = 4;
        this.leitura.temperatura = 360;
        this.leitura.conceOxi = 21;
        // this.leitura.fonteIg = 0.24;
        this.leitura.umidade = 100;
        this.leitura.concePo = 10;
        break;

      case "Arroz":
        this.leitura.pressao = 3.3;
        this.leitura.temperatura = 510;
        this.leitura.conceOxi = 21;
        // this.leitura.fonteIg = 0.1;
        this.leitura.umidade = 100;
        this.leitura.concePo = 85;
        break;

      case "Semente de arroz(casca)":
        this.leitura.pressao = 4.3;
        this.leitura.temperatura = 490;
        this.leitura.conceOxi = 12;
        // this.leitura.fonteIg = 0.08;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;

      case "Casca de arroz":
        this.leitura.pressao = 7.7;
        this.leitura.temperatura = 450;
        this.leitura.conceOxi = 17;
        // this.leitura.fonteIg = 0.05;
        this.leitura.umidade = 100;
        this.leitura.concePo = 55;
        break;

      case "Proteína de soja":
        this.leitura.pressao = 6.9;
        this.leitura.temperatura = 540;
        this.leitura.conceOxi = 12;
        // this.leitura.fonteIg = 0.06;
        this.leitura.umidade = 100;
        this.leitura.concePo = 40;
        break;

      case "Farinha de soja":
        this.leitura.pressao = 6.6;
        this.leitura.temperatura = 550;
        this.leitura.conceOxi = 15;
        // this.leitura.fonteIg = 0.1;
        this.leitura.umidade = 100;
        this.leitura.concePo = 60;
        break;

      case "Trigo bruto":
        this.leitura.pressao = 5;
        this.leitura.temperatura = 500;
        this.leitura.conceOxi = 12;
        // this.leitura.fonteIg = 0.06;
        this.leitura.umidade = 100;
        this.leitura.concePo = 0.5;
        break;

      case "Farinha de trigo":
        this.leitura.pressao = 7;
        this.leitura.temperatura = 440;
        this.leitura.conceOxi = 15;
        // this.leitura.fonteIg = 0.06;
        this.leitura.umidade = 100;
        this.leitura.concePo = 50;
        break;

      case "Trigo Cereal":
        this.leitura.pressao = 9.2;
        this.leitura.temperatura = 430;
        this.leitura.conceOxi = 13;
        // this.leitura.fonteIg = 0.035;
        this.leitura.umidade = 100;
        this.leitura.concePo = 35;
        break;

      case "Palha de trigo":
        this.leitura.pressao = 8.2;
        this.leitura.temperatura = 470;
        this.leitura.conceOxi = 13;
        // this.leitura.fonteIg = 0.035;
        this.leitura.umidade = 100;
        this.leitura.concePo = 75;
        break;

      case "Polvilho de trigo":
        this.leitura.pressao = 7;
        this.leitura.temperatura = 430;
        this.leitura.conceOxi = 12;
        // this.leitura.fonteIg = 0.025;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;

      case "Milho":
        this.leitura.pressao = 8;
        this.leitura.temperatura = 400;
        this.leitura.conceOxi = 13;
        // this.leitura.fonteIg = 0.04;
        this.leitura.umidade = 100;
        this.leitura.concePo = 55;
        break;

      case "Casca de milho cru":
        this.leitura.pressao = 8.7;
        this.leitura.temperatura = 410;
        this.leitura.conceOxi = 17;
        // this.leitura.fonteIg = 0.04;
        this.leitura.umidade = 100;
        this.leitura.concePo = 40;
        break;

      case "Polvilho de milho":
        this.leitura.pressao = 10.2;
        this.leitura.temperatura = 390;
        this.leitura.conceOxi = 11;
        // this.leitura.fonteIg = 0.03;
        this.leitura.umidade = 100;
        this.leitura.concePo = 40;
        break;

      case "Semente de milho":
        this.leitura.pressao = 8.9;
        this.leitura.temperatura = 450;
        this.leitura.conceOxi = 12;
        // this.leitura.fonteIg = 0.045;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;
    }
    // console.log(this.leitura);

    this.leitura.situTemperatura = (resposta.temperatura / this.leitura.temperatura) * 100;
    this.leitura.situConceOxi = (resposta.conceOxi / this.leitura.conceOxi) * 100;
    this.leitura.situPressao = (resposta.pressao / this.leitura.pressao) * 100;
    // this.leitura.situFonte Ig = (resposta.fonteIg / this.leitura.fonteIg) * 100;
    this.leitura.situConceGas = (resposta.conceGas / 4.3) * 100;
    this.leitura.situUmidade = (resposta.umidade / this.leitura.umidade) * 100;
    this.leitura.situConcePo = (resposta.concePo / this.leitura.concePo) * 100;

    if (this.leitura.situTemperatura > 100)
      this.leitura.situTemperatura = 100;

    if (this.leitura.situConceOxi > 100)
      this.leitura.situConceOxi = 100;

    if (this.leitura.situPressao > 100)
      this.leitura.situPressao = 100;

    if (this.leitura.situConceGas > 100)
      this.leitura.situConceGas = 100;

    if (this.leitura.situUmidade > 100)
      this.leitura.situUmidade = 100;

    if (this.leitura.situConcePo > 100)
      this.leitura.situConcePo = 100;

    // this.leitura.situaSilo = (this.leitura.situConceOxi + this.leitura.situConcePo + this.leitura.situFonteIg + this.leitura.situPressao + this.leitura.situTemperatura + this.leitura.situUmidade) / 6;
    // this.leitura.situaSilo = (this.leitura.situConceOxi + this.leitura.situConcePo + this.leitura.situConceGas + this.leitura.situPressao + this.leitura.situTemperatura + this.leitura.situUmidade) / 6;
    this.leitura.situaSilo = (this.leitura.situConceOxi + this.leitura.situConcePo + this.leitura.situConceGas + this.leitura.situPressao + this.leitura.situUmidade) / 5;

    this.leitura.codSilo = atual.codSilo;
    this.leitura.codLeitura = resposta.codLeitura;
    this.leitura.temperatura = resposta.temperatura;
    this.leitura.pressao = resposta.pressao;
    this.leitura.umidade = resposta.umidade;
    this.leitura.concePo = resposta.concePo;
    // this.leitura.fonteIg = resposta.fonteIg;
    this.leitura.conceGas = resposta.conceGas;
    this.leitura.conceOxi = resposta.conceOxi;
    if (this.leitura.situaSilo >= 80) {
      this.getTimer().then((timer) => {
        if (timer != undefined) {
          if ((new Date(resposta.dataLeitura).getMinutes() - 1) >= (new Date(timer).getMinutes())) {
            this.leitura.dataLeitura = resposta.dataLeitura;
            this.setTimer(resposta.dataLeitura);
            this.events.publish('alerta:leitura-critica');
          }
        } else {
          this.leitura.dataLeitura = resposta.dataLeitura;
          this.setTimer(resposta.dataLeitura);
          this.events.publish('alerta:leitura-critica');
        }
      });
    }
    this.setLeitura(this.leitura);


    // let segundos = Math.floor((+new Date() - +new Date(this.Minute)) / 1000);
    // console.log(Math.floor((+new Date() - +new Date(this.Minute)) / 1000));
    // if (segundos % 60 == 0)
  }


}
