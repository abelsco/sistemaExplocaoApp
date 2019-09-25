import { Cliente, Silo, Leitura } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbDataService {
  // private hostStorage: string = '192.168.16.254';
  private hostStorage: string = '192.168.16.4';
  // private hostStorage: string = '127.0.0.1';
  private url_storage: string = 'http://' + this.hostStorage + ':5001/api/';

  constructor(
    private httpClient: HttpClient,
  ) {  }

  postCliente(dados: any) {
    return this.httpClient.post<Silo>(this.url_storage + 'cliente/', dados);
  }

  postNomeSilo(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'cliente/nomesilo/', dados);
  }

  postTipoGrao(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'cliente/tipograo/', dados);
  }

  postDeletaCliente(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'cliente/deleta/', dados);
  }
  
  getLogin(usuario: string, senha: string){
    return this.httpClient.get<Silo>(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha);    
  }

  getAmbi(atual: Silo) {
    return this.httpClient.get<Leitura>(this.url_storage + 'ambiente?codSilo=' + atual.codSilo);
  }
}
