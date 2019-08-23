import { Cliente, Silo } from './../interfaces/user-options';
// import { UserData } from './user-data';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET '
  })
};

@Injectable({
  providedIn: 'root'
})
export class DbDataService {
  // hostStorage: string = '192.168.16.254';
  hostStorage: string = '192.168.42.218';
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

  async postTipoGrao(cliente: Cliente) {
    return this.httpClient.post(this.url_storage + 'cliente/endsilo/', cliente).subscribe((response) => {
      console.log(response);
    });
  }

  async getAmbi(atual: Cliente): Promise<Silo> {
    this.storage.get('cliente').then(async (cliente: Cliente) => {
      // this.httpClient.post(this.url_ambi, cliente).subscribe(async () => {
      await this.httpClient.get(atual.endSilo).subscribe(result => {
        console.log(result);

        const response = (result as Silo)
        this.silo = response;
        this.storage.set('silo', this.silo);
      });
      // });
    });
    return this.storage.get('silo').then((value) => {
      return value;
    });
  }

}
