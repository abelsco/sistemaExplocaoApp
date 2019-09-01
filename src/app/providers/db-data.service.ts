import { Cliente, Silo } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class DbDataService {
  hostStorage: string = '192.168.16.254';
  // hostStorage: string = '192.168.16.4';
  // hostStorage: string = '192.168.42.253';
  url_storage: string = 'http://' + this.hostStorage + ':5001/api/';
  // url_ambi: string = 'http://' + this.hostAmbiente + ':5000/api/ambiente/'
  cliente: Cliente = {
    codCli: 0,
    usuario: '',
    senha: '',
    nomeSilo: '',
    tipoGrao: '',
    endSilo: ''
  };
  dateNow: Date;
  parametro: Silo = {
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
  silo: Silo;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage
  ) { }

  async postCliente(cliente: Cliente) {
    let data = {
      usuario: cliente.usuario,
      senha: cliente.senha,
      nomeSilo: cliente.nomeSilo,
      endSilo: cliente.endSilo,
      tipoGrao: cliente.tipoGrao,
    }
    return this.httpClient.post(this.url_storage + 'cliente/', cliente)
      .subscribe(() => { });
  }

  async getLogin(usuario: string, senha: string): Promise<any> {
    await this.httpClient.get<Array<Cliente>>(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha).subscribe(result => {
      this.cliente = {
        codCli: 0,
        usuario: '',
        senha: '',
        nomeSilo: '',
        tipoGrao: '',
        endSilo: ''
      };
      if (result.length == 1)
        this.cliente = <Cliente>result.pop();
      return this.storage.set('cliente', this.cliente).finally();
    });
  }

  async postEndSilo(cliente: Cliente) {
    return this.httpClient.post(this.url_storage + 'cliente/endsilo/', cliente).subscribe((response) => {
      console.log(response);
    });
  }

  private async setSituacao(atual: Cliente, resposta: Silo) {
    switch (atual.tipoGrao) {
      case "Açúcar em pó":
        this.parametro.pressao = 7.7;
        this.parametro.temperatura = 370;
        this.parametro.conceOxi = 21;
        this.parametro.fonteIg = 0.03;
        this.parametro.umidade = 100;
        this.parametro.concePo = 45;
        break;

      case "Alho desidratado":
        this.parametro.pressao = 4;
        this.parametro.temperatura = 360;
        this.parametro.conceOxi = 21;
        this.parametro.fonteIg = 0.24;
        this.parametro.umidade = 100;
        this.parametro.concePo = 10;
        break;

      case "Arroz":
        this.parametro.pressao = 3.3;
        this.parametro.temperatura = 510;
        this.parametro.conceOxi = 21;
        this.parametro.fonteIg = 0.1;
        this.parametro.umidade = 100;
        this.parametro.concePo = 85;
        break;

      case "Semente de arroz(casca)":
        this.parametro.pressao = 4.3;
        this.parametro.temperatura = 490;
        this.parametro.conceOxi = 12;
        this.parametro.fonteIg = 0.08;
        this.parametro.umidade = 100;
        this.parametro.concePo = 45;
        break;

      case "Casca de arroz":
        this.parametro.pressao = 7.7;
        this.parametro.temperatura = 450;
        this.parametro.conceOxi = 17;
        this.parametro.fonteIg = 0.05;
        this.parametro.umidade = 100;
        this.parametro.concePo = 55;
        break;

      case "Proteína de soja":
        this.parametro.pressao = 6.9;
        this.parametro.temperatura = 540;
        this.parametro.conceOxi = 12;
        this.parametro.fonteIg = 0.06;
        this.parametro.umidade = 100;
        this.parametro.concePo = 40;
        break;

      case "Farinha de soja":
        this.parametro.pressao = 6.6;
        this.parametro.temperatura = 550;
        this.parametro.conceOxi = 15;
        this.parametro.fonteIg = 0.1;
        this.parametro.umidade = 100;
        this.parametro.concePo = 60;
        break;

      case "Trigo bruto":
        this.parametro.pressao = 5;
        this.parametro.temperatura = 500;
        this.parametro.conceOxi = 12;
        this.parametro.fonteIg = 0.06;
        this.parametro.umidade = 100;
        this.parametro.concePo = 0.5;
        break;

      case "Farinha de trigo":
        this.parametro.pressao = 7;
        this.parametro.temperatura = 440;
        this.parametro.conceOxi = 15;
        this.parametro.fonteIg = 0.06;
        this.parametro.umidade = 100;
        this.parametro.concePo = 50;
        break;

      case "Trigo Cereal":
        this.parametro.pressao = 9.2;
        this.parametro.temperatura = 430;
        this.parametro.conceOxi = 13;
        this.parametro.fonteIg = 0.035;
        this.parametro.umidade = 100;
        this.parametro.concePo = 35;
        break;

      case "Palha de trigo":
        this.parametro.pressao = 8.2;
        this.parametro.temperatura = 470;
        this.parametro.conceOxi = 13;
        this.parametro.fonteIg = 0.035;
        this.parametro.umidade = 100;
        this.parametro.concePo = 75;
        break;

      case "Polvilho de trigo":
        this.parametro.pressao = 7;
        this.parametro.temperatura = 430;
        this.parametro.conceOxi = 12;
        this.parametro.fonteIg = 0.025;
        this.parametro.umidade = 100;
        this.parametro.concePo = 45;
        break;

      case "Milho":
        this.parametro.pressao = 8;
        this.parametro.temperatura = 400;
        this.parametro.conceOxi = 13;
        this.parametro.fonteIg = 0.04;
        this.parametro.umidade = 100;
        this.parametro.concePo = 55;
        break;

      case "Casca de milho cru":
        this.parametro.pressao = 8.7;
        this.parametro.temperatura = 410;
        this.parametro.conceOxi = 17;
        this.parametro.fonteIg = 0.04;
        this.parametro.umidade = 100;
        this.parametro.concePo = 40;
        break;

      case "Polvilho de milho":
        this.parametro.pressao = 10.2;
        this.parametro.temperatura = 390;
        this.parametro.conceOxi = 11;
        this.parametro.fonteIg = 0.03;
        this.parametro.umidade = 100;
        this.parametro.concePo = 40;
        break;

      case "Semente de milho":
        this.parametro.pressao = 8.9;
        this.parametro.temperatura = 450;
        this.parametro.conceOxi = 12;
        this.parametro.fonteIg = 0.045;
        this.parametro.umidade = 100;
        this.parametro.concePo = 45;
        break;
    }
    // console.log(qthis.parametro);
    
    this.parametro.situTemperatura = (resposta.temperatura / this.parametro.temperatura) * 100;
    this.parametro.situConceOxi = (resposta.conceOxi / this.parametro.conceOxi) * 100;
    this.parametro.situPressao = (resposta.pressao / this.parametro.pressao) * 100;
    this.parametro.situFonteIg = (resposta.fonteIg / this.parametro.fonteIg) * 100;
    this.parametro.situUmidade = (resposta.umidade / this.parametro.umidade) * 100;
    this.parametro.situConcePo = (resposta.concePo / this.parametro.concePo) * 100;
    this.parametro.situaSilo = (this.parametro.situConceOxi + this.parametro.situConcePo + this.parametro.situFonteIg + this.parametro.situPressao + this.parametro.situTemperatura + this.parametro.situUmidade) / 6;


    this.parametro.codCli = atual.codCli;
    this.parametro.temperatura = resposta.temperatura;
    this.parametro.pressao = resposta.pressao;
    this.parametro.umidade = resposta.umidade;
    this.parametro.concePo = resposta.concePo;
    this.parametro.fonteIg = resposta.fonteIg;
    this.parametro.conceOxi = resposta.conceOxi;
    
    this.dateNow = new Date();
    this.parametro.dia = this.dateNow.toLocaleString();
     
    // console.log('toLocaleDateString '+this.dateNow.toLocaleDateString());
    // console.log('toLocaleString '+this.dateNow.toLocaleString());
    // console.log('toLocaleTimeString '+this.dateNow.toLocaleTimeString());
    
    // this.parametro.dia = Date.now();
    this.silo = this.parametro;
    // console.log(this.parametro);
    this.storage.set('silo', this.silo);
  }

  async getAmbi(atual: Cliente): Promise<Silo> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      })
    };
    await this.httpClient.get(this.url_storage + 'ambiente?endSilo=' + atual.endSilo,httpOptions).subscribe(async result => {
      const resposta = (result as Silo);
      await this.setSituacao(atual, resposta);
    });
    // });
    return this.storage.get('silo').then((value) => {
      return value;
    });
  }

}
