
export interface Cliente {
  usuario: string;
  senha: string;
  nomeSilo: string;
  endSilo: string;
  tipoGrao: string;
}

export interface Silo {
  nomeSilo: string;
  dia: string;
  temperatura: number;
  umidade: number;
  pressao: number;
  concePo: number;
  conceOxi: number;
  fonteIg: number;
  situaSilo: string;
}

/* -Cliente-
codCli
usuario
nomeSilo
endSilo
tipoGrao
senha

1-1

-Silo-
codSilo
nomeSilo fore
dia
temperatura
umidade
pressao
concePo
fonteIg
conceOxi
situaSilo


select * from Cliente where usuario = user and senha = senha;
 */
/* signup(usuario, senha, nomeSilo, endSilo,  tipoGrao): Promise<any> {
  this.cliente(usuario, senha, nomeSilo, endSilo,tipoGrao)
  return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
    this.setcliente(this.cliente[
      usuario = usuario,
      senha = senha,
      nomeSilo = nomeSilo,
      endSilo = endSilo,
      tipoGrao = tipoGrao
    ]);
    this.setTipoGrao(tipoGrao);
    console.table(this.cliente);
    return this.events.publish('user:signup');
  });
} */
