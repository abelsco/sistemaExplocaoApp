import { Cliente, Silo } from './../interfaces/user-options';
// import { UserData } from './user-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DbDataService {
  host: string = '192.168.42.201';
  url_storage: string = 'http://' + this.host + ':5001/api/'
  url_ambi: string = 'http://' + this.host + ':5000/api/ambiente/'
  cliente: Cliente = {
    codCli: 0,
    usuario: '',
    senha: '',
    nomeSilo: '',
    tipoGrao: '',
    endSilo: ''
  };
  silos: Silo[] = [];
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
    this.httpClient.get<Array<Cliente>>(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha).subscribe(result => {
      this.cliente = {
        codCli: 0,
        usuario: '',
        senha: '',
        nomeSilo: '',
        tipoGrao: '',
        endSilo: ''
      };
      if (result.length == 1)
        this.cliente = result.pop();
      return this.storage.set('cliente', this.cliente);
    });
  }

  async postTipoGrao(cliente: Cliente) {
    return this.httpClient.post(this.url_storage + 'cliente/endsilo/', cliente).subscribe((response) => {
      console.log(response);
    });
  }

  async getAmbi(): Promise<Silo> {
    this.httpClient.head(this.url_ambi).subscribe(ok => {
      this.storage.get('cliente').then((cliente: Cliente) => {
        this.httpClient.post(this.url_ambi, cliente).subscribe(() => {
          this.httpClient.get(this.url_ambi).subscribe(result => {
            const response = (result as Silo)
            this.silo = response;
            this.storage.set('silo', this.silo);
          });
        });
      });
    });
    return this.storage.get('silo').then((value) => {
      return value;
    });
  }

  setHost(atual: string) {
    this.url_storage = atual;
    console.log(this.url_storage);

  }

}
