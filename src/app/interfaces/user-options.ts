
export interface Cliente {
  codCli: number;
  usuario: string;
  senha: string;
  nomeSilo: string;
  endSilo: string;
  tipoGrao: string;

}

export interface Silo {
  // codSilo: number;
  nomeSilo: string;
  dia: string;
  temperatura: number;
  umidade: number;
  pressao: number;
  concePo: number;
  conceOxi: number;
  fonteIg: number;
  situaSilo: number;
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

