// O arquivo armazenamento.js cria as funções para salvar e recuperar os dados do aplicativo no armazenamento local do dispositivo

// permitindo que as despesas e outras informações continuem disponíveis mesmo depois de fechar o aplicativo

// AsyncStorage permite guardar pequenos dados no dispositivo entre aberturas do aplicativo.
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lê um valor salvo no armazenamento local do aplicativo.
 */
export async function lerDados(chave) {
  // getItem devolve a string salva ou null quando a chave ainda não existe.
  return AsyncStorage.getItem(chave);
}

/**
 * Salva um valor no armazenamento local do aplicativo.
 * O valor deve ser uma string.
 */
export async function salvarDados(chave, valor) {
  // setItem salva o valor associado à chave. Como a API é assíncrona, usamos await no local que a chama.
  return AsyncStorage.setItem(chave, valor);
}
