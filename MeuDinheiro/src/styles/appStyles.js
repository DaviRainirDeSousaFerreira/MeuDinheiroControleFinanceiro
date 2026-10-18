// StyleSheet organiza os estilos usados pelos componentes React Native.
// Os nomes abaixo são referenciados no JSX, por exemplo style={styles.container}.
// Dicas: flex: 1 ocupa o espaço disponível; padding cria espaço interno; margin cria espaço externo;
// backgroundColor define a cor de fundo; flexDirection organiza os elementos em linha ou coluna.
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- Modal de edição: fundo escurecido, caixa branca e título. ---
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(20, 10, 35, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  conteudoModal: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  tituloModal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#302642',
    marginBottom: 18,
  },
  // --- Estrutura geral da tela e cabeçalho do aplicativo. ---
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
  },
  conteudo: {
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 35,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  saudacao: {
    color: '#81798F',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#29213A',
  },
  iconeCarteira: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EDE5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeCarteiraTexto: {
    fontSize: 23,
  },
  // --- Cartão principal com a soma de todos os gastos. ---
  cartaoTotal: {
    backgroundColor: '#6C3FC5',
    padding: 23,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#6C3FC5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  rotuloTotal: {
    color: '#E5D9FF',
    fontSize: 14,
  },
  valorTotal: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  linhaCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  pontoBranco: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B9F4D0',
    marginRight: 8,
  },
  textoCartao: {
    color: '#F0E9FF',
    fontSize: 12,
  },
  // --- Cartões pequenos com quantidades e informações resumidas. ---
  resumo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  cartaoResumo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EDF5',
  },
  iconeResumo: {
    fontSize: 20,
    marginBottom: 12,
  },
  numeroResumo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#302642',
  },
  rotuloResumo: {
    fontSize: 12,
    color: '#81798F',
    marginTop: 5,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#29213A',
  },
  descricaoSecao: {
    fontSize: 13,
    color: '#81798F',
    marginTop: 5,
    marginBottom: 14,
  },
  // --- Formulário, campos de texto, categorias e botão principal. ---
  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F0EDF5',
  },
  rotuloCampo: {
    color: '#403750',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: '#E9E4F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#29213A',
    marginBottom: 15,
  },
  gradeCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  botaoCategoria: {
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: '#E9E4F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  categoriaSelecionada: {
    borderColor: '#6C3FC5',
    backgroundColor: '#F1EBFF',
  },
  iconeCategoria: {
    fontSize: 17,
  },
  textoCategoria: {
    color: '#625A70',
    fontSize: 12,
    fontWeight: '500',
  },
  textoCategoriaSelecionada: {
    color: '#6C3FC5',
    fontWeight: 'bold',
  },
  botaoAdicionar: {
    backgroundColor: '#6C3FC5',
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
  },
  botaoPressionado: {
    opacity: 0.8,
  },
  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // --- Lista de despesas, estado vazio e detalhes de cada item. ---
  cabecalhoLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 14,
  },
  contadorLista: {
    color: '#6C3FC5',
    fontWeight: 'bold',
    backgroundColor: '#EDE5FF',
    overflow: 'hidden',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  estadoVazio: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EDF5',
  },
  iconeVazio: {
    fontSize: 32,
    marginBottom: 12,
  },
  tituloVazio: {
    color: '#403750',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textoVazio: {
    color: '#81798F',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  itemDespesa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0EDF5',
  },
  iconeDespesa: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconeDespesaTexto: {
    fontSize: 20,
  },
  detalhesDespesa: {
    flex: 1,
  },
  nomeDespesa: {
    color: '#302642',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriaDespesa: {
    color: '#81798F',
    fontSize: 12,
    marginTop: 5,
  },
  dataDespesa: {
    fontSize: 12,
    color: '#8B8BA7',
    marginTop: 4,
  },
  colunaValor: {
    alignItems: 'flex-end',
    gap: 7,
  },
  valorDespesa: {
    color: '#302642',
    fontSize: 13,
    fontWeight: 'bold',
  },
  textoEditar: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  // --- Ações secundárias, filtros e consulta por período. ---
  botaoCancelarEdicao: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },

  textoCancelarEdicao: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  textoExcluir: {
    color: '#B42318',
    fontSize: 12,
    fontWeight: '600',
  },
  // --- Rodapé exibido ao final da tela. ---
  rodape: {
    textAlign: 'center',
    color: '#9A94A8',
    fontSize: 11,
    marginTop: 28,
  },
  
  // --- Botões de filtro e campos de data. ---
  // Estilos da faixa horizontal de filtros por categoria.
  filtros: {
    marginBottom: 14,
    flexGrow: 0,
  },
  conteudoFiltros: {
    gap: 8,
    paddingRight: 4,
  },
  botaoFiltro: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E4F0',
  },
  botaoFiltroSelecionado: {
    backgroundColor: '#6C3FC5',
    borderColor: '#6C3FC5',
  },
  textoFiltro: {
    color: '#625A70',
    fontSize: 12,
    fontWeight: '600',
  },
  textoFiltroSelecionado: {
    color: '#FFFFFF',
  },

  // --- Limite mensal, barra de progresso e campos relacionados. ---
  // Estilos do cartão de limite mensal e de sua barra de progresso.
  cartaoLimite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E9E2F5',
  },

  tituloLimite: {
    fontSize: 18,
    fontWeight: '700',
    color: '#302344',
    marginBottom: 12,
  },

  valorLimite: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7545B5',
    marginBottom: 16,
  },

  fundoBarraLimite: {
    height: 10,
    backgroundColor: '#EEE8F7',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressoBarraLimite: {
    height: '100%',
    backgroundColor: '#8957D5',
    borderRadius: 10,
  },

  textoLimite: {
    fontSize: 13,
    color: '#746B80',
    marginBottom: 16,
  },
  textoSaldoLimite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7545B5',
    marginBottom: 12,
  },

  // Estilos dos campos para filtrar despesas por data inicial e final.
  filtroPeriodo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9E4F0',
  },
  tituloPeriodo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#302642',
    marginBottom: 14,
  },
  camposPeriodo: {
    flexDirection: 'row',
    gap: 12,
  },
  campoData: {
    flex: 1,
  },
  rotuloData: {
    fontSize: 12,
    color: '#625A70',
    marginBottom: 7,
  },
  inputData: {
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: '#E9E4F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 11,
    fontSize: 12,
    color: '#29213A',
  },
  botaoLimparPeriodo: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F1EBFF',
  },
  textoLimparPeriodo: {
    color: '#6C3FC5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Estilos das linhas da legenda que acompanham o gráfico.
  cartaoLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FC',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F0ECF5',
  },
  iconeLegenda: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detalhesLegenda: {
    flex: 1,
    gap: 3,
  },
  percentualLegenda: {
    fontSize: 11,
    color: '#8B8BA7',
  },
  // Estilos do cabeçalho e dos textos do cartão do gráfico.
  cabecalhoGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 18,
  },
  iconeTituloGrafico: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiTituloGrafico: {
    fontSize: 21,
  },
  textosTituloGrafico: {
    flex: 1,
    gap: 4,
  },
  tituloGrafico: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#302642',
  },
  subtituloGrafico: {
    fontSize: 12,
    color: '#8B8BA7',
  },


});
