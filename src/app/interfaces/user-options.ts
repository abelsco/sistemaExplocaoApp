export interface Cliente {
  codCli: number;
  usuario: string;
  senha: string;
}

export function construtorCliente() {
  let cliente = {
    codCli: 0,
    usuario: '',
    senha: '',
  };
  return cliente;
}

export interface Silo {
  codSilo: number;
  codCli: number;
  codSerie: string;
  nomeSilo: string;
  tipoGrao: string;
}

export function construtorSilo() {
  let silo: Silo = {
    codSilo: 0,
    codCli: 0,
    codSerie: '',
    nomeSilo: '',
    tipoGrao: '',
  };
  return silo;
}

export interface Leitura {
  codLeitura: number;
  codSilo: number;
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
export function construtorLeitura() {
  let silo: Leitura = {
    codLeitura: 0,
    codSilo: 0,
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
  return silo;
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
data
temperatura
umidade
pressao
concePo
fonteIg
conceOxi
situaSilo


select * from Cliente where usuario = user and senha = senha;
 */

