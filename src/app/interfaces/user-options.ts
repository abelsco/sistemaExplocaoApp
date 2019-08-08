
export interface Cliente {
  codCli: number;
  usuario: string;
  senha: string;
  nomeSilo: string;
  endSilo: string;
  tipoGrao: string;

}

export interface Silo {
  codSilo: number;
  codCli: number;
  dia: string;
  temperatura: number;  
  situTemperatura: number;  
  umidade: number;
  situUmidade: number;
  pressao: number;
  situPressao: number;
  concePo: number;
  situConcePo: number;
  conceOxi: number;
  situConceOxi: number;
  fonteIg: number;
  situFonteIg: number;
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

