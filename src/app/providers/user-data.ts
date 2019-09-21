import { Cliente, Silo, Leitura, construtorCliente, construtorSilo, construtorLeitura } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { Events, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DbDataService } from './db-data.service';
import { sha512_256 } from 'js-sha512';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  private cliente: Cliente;
  private silo: Silo;
  private leitura: Leitura;
  constructor(
    public events: Events,
    private storage: Storage,
    private dbData: DbDataService,
    private os: Platform
  ) {
    this.cliente = construtorCliente();
    this.silo = construtorSilo();
    this.leitura = construtorLeitura();
  }

  async zeraLeitura(): Promise<Leitura> {
    let atual:Leitura = construtorLeitura();
    await this.storage.set('leitura', atual);
    const value = await this.getLeitura();
    return value;
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  async login(usuario: string, senha: string): Promise<any> {
    await this.dbData.getLogin(usuario, sha512_256(senha)).finally(() => {
      this.getCliente().then(value => {
        this.cliente = (value as Cliente);
        if (this.cliente.codCli != 0) {
          this.storage.set(this.HAS_LOGGED_IN, true);
          return this.events.publish('user:login');
        }
      });
    });
  }

  async signup(dados: any): Promise<any> {
    await this.storage.set(this.HAS_LOGGED_IN, true);
    dados.senha = sha512_256(dados.senha);
    this.dbData.postCliente(dados);
    // this.cliente  = {
    //   codCli: dados.codCli,
    //   usuario: dados.usuario,
    //   senha: dados.senha,
    // }
    // this.setCliente(this.cliente);
    return this.events.publish('user:signup');
  }

  async logout(): Promise<any> {
    await this.storage.remove(this.HAS_LOGGED_IN);
    // Deslogar no banco 
    await this.storage.remove('cliente');
    await this.storage.remove('silo');
    this.events.publish('user:logout');
  }

  async setCliente(cliente: Cliente): Promise<any> {
    await this.storage.set('cliente', cliente);
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

  async isLoggedIn(): Promise<boolean> {
    const value = await this.storage.get(this.HAS_LOGGED_IN);
    return value === true;
  }

  async checkHasSeenTutorial(): Promise<string> {
    const value = await this.storage.get(this.HAS_SEEN_TUTORIAL);
    return value;
  }
}
