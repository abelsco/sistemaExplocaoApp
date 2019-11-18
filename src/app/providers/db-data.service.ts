import { Cliente, Silo, Leitura } from './../interfaces/user-options';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class DbDataService {
  // private hostStorage: string = '10.92.3.245';
  private hostStorage: string = '192.168.16.4';
  // private hostStorage: string = '127.0.0.1';
  private url_storage: string = 'http://' + this.hostStorage + ':5001/api/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  postCliente(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'cliente/', dados).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  postSenhaCliente(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'cliente/senha/', dados).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  postNomeSilo(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'silo/nomesilo/', dados).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  postTipoGrao(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'silo/tipograo/', dados).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  postDeletaCliente(dados: any) {
    return this.httpClient.post<any>(this.url_storage + 'cliente/deleta/', dados).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getLogin(usuario: string, senha: string) {
    return this.httpClient.get<Silo>(this.url_storage + 'login?usuario=' + usuario + '&senha=' + senha).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAmbi(atual: Silo) {
    return this.httpClient.get<any>(this.url_storage + 'ambiente?codSilo=' + atual.codSilo).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getRelatorio(codSilo: number, opcao: string) {
    return this.httpClient.get<any>(this.url_storage + 'relatorio?codSilo=' + codSilo + '&opcao=' + opcao).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
