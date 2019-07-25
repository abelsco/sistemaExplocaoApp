import { Cliente, Silo } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  SILO_IN = 'siloCorrente';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  url:string = 'http://192.168.0.9:5000'
  clientes: Cliente[] = [];
  cliente: Cliente;
  silos: Silo[] = [];
  silo: Silo;
  
  constructor(
    public events: Events,
    private storage: Storage,
    public http: HttpClient
  ){ 

    this.getClientes()
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

  login(username, senha): Promise<any> {
    if (this.clientes.length >= 1) {
      this.cliente = this.clientes.filter(x => x.usuario == username && x.senha == senha)[0];
      return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
        this.setLogin(this.cliente);
        return this.events.publish('user:login');
      });
    }
  }

  signup(cliente: Cliente): Promise<any> {
    cliente.codCli = this.clientes.length+1;
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setClientes(cliente);
      this.setLogin(cliente);
      this.setBancoCliente(cliente);
      return this.events.publish('user:signup');
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('cliente');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setLogin(cliente: Cliente): Promise<any> {
    return this.storage.set('cliente', cliente);
  }

  setClientes(cliente: Cliente): Promise<any> {
    this.clientes.push(cliente);
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.storage.set('clientes', this.clientes);
    });
  }

  setSilo(silo: Silo): Promise<any> {
    this.silos.push(silo);
    return this.storage.set(this.SILO_IN, true).then(() => {
      this.storage.set('silo', silo);
      this.storage.set('silos', this.silos);
    });
  }

  setBancoCliente(cliente: Cliente): Observable<any>{
    return this.http.post(this.url+ '/cliente?', cliente).pipe(

    )
  }

  getCliente(): Promise<Cliente> {
    return this.storage.get('cliente').then((value) => {
      return value;
    });
  }

  getSilo(): Promise<Silo> {
    return this.storage.get('silo').then((value) => {
      return value;
    });
  }

  private saveCli(response){
    for (const key in response) {
      if (response.hasOwnProperty(key)) {
        this.clientes.push(response[key]);
      }
    } 
  }

  getClientes(){
    this.http.get(this.url + '/cliente').subscribe(result =>{      
      const response = (result as Cliente);
      this.saveCli(response);      
      return this.storage.set('clientes', this.clientes);
    })    
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
