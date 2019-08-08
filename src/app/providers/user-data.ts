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
  SILO_IN = 'siloCorrente';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
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
  parametro: Silo;

  constructor(
    public events: Events,
    private storage: Storage,
    private dbData: DbDataService,
    private os: Platform
  ) { }

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

  login(usuario: string, senha: string): Promise<any> {
    this.dbData.getLogin(usuario, senha);
    return this.storage.get('cliente').then(async value => {
      console.log(value);
      const cliente = (value as Cliente);
      
      if (cliente.codCli != 0) {
        await this.storage.set(this.HAS_LOGGED_IN, true);
        this.setLogin(cliente);
        return this.events.publish('user:login');        
      }
    });
  }

  async signup(cliente: Cliente): Promise<any> {
    await this.storage.set(this.HAS_LOGGED_IN, true);
    this.dbData.postCliente(cliente);
    this.setLogin(cliente);
    return this.events.publish('user:signup');
  }

  async logout(): Promise<any> {
    await this.storage.remove(this.HAS_LOGGED_IN);
    await this.storage.remove('cliente');
    this.events.publish('user:logout');
  }

  private setLogin(cliente: Cliente): Promise<any> {
    return this.storage.set('cliente', cliente);
  }

  private async setSilo(silo: Silo): Promise<any> {
    this.silos.push(silo);
    await this.storage.set(this.SILO_IN, true);
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
