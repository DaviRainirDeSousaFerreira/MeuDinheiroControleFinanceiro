// Recebe um número e o transforma em texto no formato monetário brasileiro, por exemplo R$ 25,90.
export function formatarMoeda(numero) {
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Formata a digitação da data enquanto a pessoa escreve: 17102026 vira 17/10/2026.
export function aplicarMascaraData(texto) {
  // Remove tudo que não for dígito e limita a entrada a oito números (DDMMAAAA).
  const numeros = texto.replace(/\D/g, '').slice(0, 8);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  }

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

// Converte DD/MM/AAAA em um objeto Date. Retorna null se a data estiver incompleta ou não existir.
export function converterDataBrasileira(texto) {
  if (!texto || texto.length !== 10) {
    return null;
  }

  const [dia, mes, ano] = texto.split('/').map(Number);
  const data = new Date(ano, mes - 1, dia);

  // Confere se a data existe no calendário.
  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return null;
  }

  data.setHours(0, 0, 0, 0);
  return data;
}
