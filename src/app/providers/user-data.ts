import { Cliente, Silo } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  clientes: Cliente[] = [];

  constructor(
    public events: Events,
    public storage: Storage
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

  login(username: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return this.events.publish('user:login');
    });
  }

  signup(cliente: Cliente): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(cliente.usuario);
      this.setTipoGrao(cliente.tipoGrao);
      this.setCliente(cliente);
      return this.events.publish('user:signup');
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  logoutCliente(usuario, senha): Promise<any> {
    let aux = {
      usuario: usuario, 
      senha: senha,
      nomeSilo: '',
      endSilo: '',
      tipoGrao: ''
    }
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  setCliente(cliente: Cliente): Promise<any> {
    this.clientes.push(cliente);
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.storage.set('clientes',this.clientes);
      console.table(this.clientes);
      console.table(this.storage.keys());            
    });
  }

  setUser(username: string, password: string, endSilo: string, tipoGrao: string): Promise<any> {
    let user = {
      username: username,
      password: password,
      endSilo: endSilo,
      tipoGrao: tipoGrao
    };
    return this.storage.set('user', user);
  }

  setTipoGrao(tipoGrao: string): Promise<any> {
    return this.storage.set('tipoGrao', tipoGrao);
  }

  setEndSilo(tipoGrao: string): Promise<any> {
    return this.storage.set('endSilo', tipoGrao);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  getTipoGrao(): Promise<string> {
    return this.storage.get('tipoGrao').then((value) => {
      return value;
    });
  }

  getEndSilo(): Promise<string> {
    return this.storage.get('endSilo').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
