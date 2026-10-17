import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lê um valor salvo no armazenamento local do aplicativo.
 */
export async function lerDados(chave) {
  return AsyncStorage.getItem(chave);
}

/**
 * Salva um valor no armazenamento local do aplicativo.
 * O valor deve ser uma string.
 */
export async function salvarDados(chave, valor) {
  return AsyncStorage.setItem(chave, valor);
}
