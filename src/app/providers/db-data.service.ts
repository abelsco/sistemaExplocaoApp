import { Cliente, Silo, Leitura, construtorCliente, construtorSilo, construtorLeitura } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
// import { sha512_256 } from "js-sha512";

@Injectable({
  providedIn: 'root'
})
export class DbDataService {
  // private hostStorage: string = '192.168.16.254';
  private hostStorage: string = '192.168.16.4';
  // private hostStorage: string = '127.0.0.1';
  private url_storage: string = 'http://' + this.hostStorage + ':5001/api/';
  // url_ambi: string = 'http://' + this.hostAmbiente + ':5000/api/ambiente/'
  private cliente: Cliente;
  private silo: Silo;
  private leitura: Leitura;
  // private silo: Silo;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.cliente = construtorCliente();
    this.silo = construtorSilo();
    this.leitura = construtorLeitura();
  }

  // async postCliente(dados: any) {
  //   let data = {
  //     usuario: dados.usuario,
  //     senha: dados.senha,
  //     nomeSilo: dados.nomeSilo,
  //     codSerie: dados.codSerie,
  //     tipoGrao: dados.tipoGrao,
  //   }
  //   return this.httpClient.post(this.url_storage + 'cliente/', data)
  //     .subscribe((data: any) => {
  //       this.silo = {
  //         codSilo: data.codSilo,
  //         codCli: data.codCLi,
  //         codSerie: data.codSerie,
  //         nomeSilo: data.nomeSilo,
  //         tipoGrao: data.tipoGrao,
  //       };
  //       this.cliente = {
  //         codCli: data.codCli,
  //         usuario: data.usuario,
  //         senha: data.senha,
  //       };
  //       this.setStorage('silo', this.silo);
  //       this.setStorage('cliente', this.cliente);
  //     });
  // }

  postCliente(dados: any) {
    return this.httpClient.post<Silo>(this.url_storage + 'cliente/', dados);
  }
  
  getLogin(usuario: string, senha: string){
    return this.httpClient.get<Silo>(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha);    
  }

  getAmbi(atual: Silo) {
    // Lembrar de classificar melhor aqui
    return this.httpClient.get<Leitura>(this.url_storage + 'ambiente?codSilo=' + atual.codSilo);
  }
}
