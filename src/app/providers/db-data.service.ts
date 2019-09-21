import { Cliente, Silo, Leitura, construtorCliente, construtorSilo, construtorLeitura } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
// import { sha512_256 } from "js-sha512";

@Injectable({
  providedIn: 'root'
})
export class DbDataService {
  // private hostStorage: string = '192.168.16.254';
  private hostStorage: string = '192.168.16.4';
  // private hostStorage: string = '192.168.42.201';
  private url_storage: string = 'http://' + this.hostStorage + ':5001/api/';
  // url_ambi: string = 'http://' + this.hostAmbiente + ':5000/api/ambiente/'
  private cliente: Cliente;
  private silo: Silo;
  private leitura: Leitura;
  // private silo: Silo;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage
  ) {
    this.cliente = construtorCliente();
    this.silo = construtorSilo();
    this.leitura = construtorLeitura();
  }

  async postCliente(dados: any) {
    let data = {
      usuario: dados.usuario,
      senha: dados.senha,
      nomeSilo: dados.nomeSilo,
      codSerie: dados.codSerie,
      tipoGrao: dados.tipoGrao,
    }
    return this.httpClient.post(this.url_storage + 'cliente/', data)
      .subscribe((data: any) => {
        this.silo = {
          codSilo: data.codSilo,
          codCli: data.codCLi,
          codSerie: data.codSerie,
          nomeSilo: data.nomeSilo,
          tipoGrao: data.tipoGrao,
        };
        this.cliente = {
          codCli: data.codCli,
          usuario: data.usuario,
          senha: data.senha,
        };
        this.setStorage('silo', this.silo);
        this.setStorage('cliente', this.cliente);
      });
  }

  // private zeraCliente() {
  //   this.cliente = {
  //     codCli: 0,
  //     usuario: '',
  //     senha: ''
  //   }
  // }

  // private zeraSilo() {
  //   this.silo = {
  //     codSilo: 0,
  //     codCli: 0,
  //     temperatura: 0,
  //     situTemperatura: 0,
  //     umidade: 0,
  //     situUmidade: 0,
  //     pressao: 0,
  //     situPressao: 0,
  //     concePo: 0,
  //     situConcePo: 0,
  //     conceOxi: 0,
  //     situConceOxi: 0,
  //     fonteIg: 0,
  //     situFonteIg: 0,
  //     situaSilo: 0,
  //   };
  //   this.setStorage('silo', this.silo);
  // }

  private async setStorage(parametro: string, valor: any, ) {

    await this.storage.set(parametro, valor);
  }

  private async getStorage(parametro: string) {
    const valor = await this.storage.get(parametro);
    return valor;
  }

  async getLogin(usuario: string, senha: string): Promise<any> {
    this.httpClient.get(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha).subscribe(result => {
      // this.httpClient.get(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha).subscribe(result => {

      if (result != null) {
        let data = <Silo>result;
        this.silo = data;
        this.cliente = {
          codCli: data.codCli,
          usuario: usuario,
          senha: senha
        };
      }
    });
    return  await this.setStorage('silo', this.silo).finally(async() => {
      return await this.setStorage('cliente', this.cliente).finally(() => {

      });
    });
  }

  // async postEndSilo(cliente: Cliente) {
  //   return this.httpClient.post(this.url_storage + 'cliente/endsilo/', cliente).subscribe((response) => {
  //     console.log(response);
  //   });
  // }

  private async setSituacao(atual: Silo, resposta: Leitura) {
    switch (atual.tipoGrao) {
      case "Açúcar em pó":
        this.leitura.pressao = 7.7;
        this.leitura.temperatura = 370;
        this.leitura.conceOxi = 21;
        this.leitura.fonteIg = 0.03;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;

      case "Alho desidratado":
        this.leitura.pressao = 4;
        this.leitura.temperatura = 360;
        this.leitura.conceOxi = 21;
        this.leitura.fonteIg = 0.24;
        this.leitura.umidade = 100;
        this.leitura.concePo = 10;
        break;

      case "Arroz":
        this.leitura.pressao = 3.3;
        this.leitura.temperatura = 510;
        this.leitura.conceOxi = 21;
        this.leitura.fonteIg = 0.1;
        this.leitura.umidade = 100;
        this.leitura.concePo = 85;
        break;

      case "Semente de arroz(casca)":
        this.leitura.pressao = 4.3;
        this.leitura.temperatura = 490;
        this.leitura.conceOxi = 12;
        this.leitura.fonteIg = 0.08;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;

      case "Casca de arroz":
        this.leitura.pressao = 7.7;
        this.leitura.temperatura = 450;
        this.leitura.conceOxi = 17;
        this.leitura.fonteIg = 0.05;
        this.leitura.umidade = 100;
        this.leitura.concePo = 55;
        break;

      case "Proteína de soja":
        this.leitura.pressao = 6.9;
        this.leitura.temperatura = 540;
        this.leitura.conceOxi = 12;
        this.leitura.fonteIg = 0.06;
        this.leitura.umidade = 100;
        this.leitura.concePo = 40;
        break;

      case "Farinha de soja":
        this.leitura.pressao = 6.6;
        this.leitura.temperatura = 550;
        this.leitura.conceOxi = 15;
        this.leitura.fonteIg = 0.1;
        this.leitura.umidade = 100;
        this.leitura.concePo = 60;
        break;

      case "Trigo bruto":
        this.leitura.pressao = 5;
        this.leitura.temperatura = 500;
        this.leitura.conceOxi = 12;
        this.leitura.fonteIg = 0.06;
        this.leitura.umidade = 100;
        this.leitura.concePo = 0.5;
        break;

      case "Farinha de trigo":
        this.leitura.pressao = 7;
        this.leitura.temperatura = 440;
        this.leitura.conceOxi = 15;
        this.leitura.fonteIg = 0.06;
        this.leitura.umidade = 100;
        this.leitura.concePo = 50;
        break;

      case "Trigo Cereal":
        this.leitura.pressao = 9.2;
        this.leitura.temperatura = 430;
        this.leitura.conceOxi = 13;
        this.leitura.fonteIg = 0.035;
        this.leitura.umidade = 100;
        this.leitura.concePo = 35;
        break;

      case "Palha de trigo":
        this.leitura.pressao = 8.2;
        this.leitura.temperatura = 470;
        this.leitura.conceOxi = 13;
        this.leitura.fonteIg = 0.035;
        this.leitura.umidade = 100;
        this.leitura.concePo = 75;
        break;

      case "Polvilho de trigo":
        this.leitura.pressao = 7;
        this.leitura.temperatura = 430;
        this.leitura.conceOxi = 12;
        this.leitura.fonteIg = 0.025;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;

      case "Milho":
        this.leitura.pressao = 8;
        this.leitura.temperatura = 400;
        this.leitura.conceOxi = 13;
        this.leitura.fonteIg = 0.04;
        this.leitura.umidade = 100;
        this.leitura.concePo = 55;
        break;

      case "Casca de milho cru":
        this.leitura.pressao = 8.7;
        this.leitura.temperatura = 410;
        this.leitura.conceOxi = 17;
        this.leitura.fonteIg = 0.04;
        this.leitura.umidade = 100;
        this.leitura.concePo = 40;
        break;

      case "Polvilho de milho":
        this.leitura.pressao = 10.2;
        this.leitura.temperatura = 390;
        this.leitura.conceOxi = 11;
        this.leitura.fonteIg = 0.03;
        this.leitura.umidade = 100;
        this.leitura.concePo = 40;
        break;

      case "Semente de milho":
        this.leitura.pressao = 8.9;
        this.leitura.temperatura = 450;
        this.leitura.conceOxi = 12;
        this.leitura.fonteIg = 0.045;
        this.leitura.umidade = 100;
        this.leitura.concePo = 45;
        break;
    }
    // console.log(qthis.leitura);

    this.leitura.situTemperatura = (resposta.temperatura / this.leitura.temperatura) * 100;
    this.leitura.situConceOxi = (resposta.conceOxi / this.leitura.conceOxi) * 100;
    this.leitura.situPressao = (resposta.pressao / this.leitura.pressao) * 100;
    this.leitura.situFonteIg = (resposta.fonteIg / this.leitura.fonteIg) * 100;
    this.leitura.situUmidade = (resposta.umidade / this.leitura.umidade) * 100;
    this.leitura.situConcePo = (resposta.concePo / this.leitura.concePo) * 100;
    this.leitura.situaSilo = (this.leitura.situConceOxi + this.leitura.situConcePo + this.leitura.situFonteIg + this.leitura.situPressao + this.leitura.situTemperatura + this.leitura.situUmidade) / 6;

    this.leitura.codSilo = atual.codSilo;
    this.leitura.temperatura = resposta.temperatura;
    this.leitura.pressao = resposta.pressao;
    this.leitura.umidade = resposta.umidade;
    this.leitura.concePo = resposta.concePo;
    this.leitura.fonteIg = resposta.fonteIg;
    this.leitura.conceOxi = resposta.conceOxi;

    // this.dateNow = new Date();
    // this.leitura.data = this.dateNow.toLocaleString();

    // console.log('toLocaleDateString '+this.dateNow.toLocaleDateString());
    // console.log('toLocaleString '+this.dateNow.toLocaleString());
    // console.log('toLocaleTimeString '+this.dateNow.toLocaleTimeString());

    // this.leitura.data = Date.now();
    // this.silo = this.leitura;
    // console.log(this.leitura);
    this.setStorage('leitura', this.leitura);
    // if (this.silo.situaSilo >= 65) {
    // this.postSilo(this.silo);
    // }
  }

  // async postSilo(atual: Silo) {
  //   const header = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'my-auth-token',
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': '*'
  //     })
  //   };
  //   this.httpClient.post(this.url_storage + 'silo', atual, header).subscribe(result => {
  //     console.log(result);
  //   });
  // }

  async getAmbi(atual: Silo): Promise<Leitura> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      })
    };
    this.httpClient.get(this.url_storage + 'ambiente?codSilo=' + atual.codSilo, header).subscribe(async (result) => {
      const resposta = (result as any);
      await this.setSituacao(atual, resposta);
    });
    return this.getStorage('leitura').then((value) => {
      return value;
    });
  }
}
