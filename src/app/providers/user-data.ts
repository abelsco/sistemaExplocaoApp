import { Cliente, Silo } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { Events, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DbDataService } from './db-data.service';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  private cliente: Cliente = {
    codCli: 0,
    usuario: '',
    senha: '',
    nomeSilo: '',
    tipoGrao: '',
    endSilo: ''
  };
  private silos: Silo[] = [];
  private silo: Silo;
  private parametro: Silo;

  constructor(
    public events: Events,
    private storage: Storage,
    private dbData: DbDataService,
    private os: Platform
  ) { }

  zeraCliente() {
    this.cliente = {
      codCli: 0,
      usuario: '',
      senha: '',
      nomeSilo: '',
      tipoGrao: '',
      endSilo: ''
    }
  }

  async zeraSilo(): Promise<Silo> {
    let atual: Silo = {
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
      situaSilo: 0,
    };
    await this.storage.set('silo', atual);
    const value = await this.getSilo();
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
    await this.dbData.getLogin(usuario, senha).finally(() => {
      this.getCliente().then(value => {
        this.cliente = (value as Cliente);
        if (this.cliente.codCli != 0) {
          this.storage.set(this.HAS_LOGGED_IN, true);
          return this.events.publish('user:login');
        }
      });
    });
  }

  async signup(cliente: Cliente): Promise<any> {
    await this.storage.set(this.HAS_LOGGED_IN, true);
    this.dbData.postCliente(cliente);
    this.setCliente(cliente);
    return this.events.publish('user:signup');
  }

  async logout(): Promise<any> {
    await this.storage.remove(this.HAS_LOGGED_IN);
    await this.storage.remove('cliente');
    this.events.publish('user:logout');
  }

  async setCliente(cliente: Cliente): Promise<any> {
    await this.storage.set('cliente', cliente);
  }

  private async setSilo(silo: Silo): Promise<any> {
    this.silos.push(silo);
    this.storage.set('silo', silo);
    this.storage.set('silos', this.silos);
  }

  async getCliente(): Promise<Cliente> {
    const value = await this.storage.get('cliente');
    return value;
  }

  async getSilo(): Promise<Silo> {
    const value = await this.storage.get('silo');
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
