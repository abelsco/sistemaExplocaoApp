
export interface UserOptions {
  username: string;
  password: string;
  endSilo: string;
  tipoGrao: string;
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


select * from Cliente where usuario = user and senha = password;
 */
