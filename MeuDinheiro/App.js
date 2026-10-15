import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';


const categorias = [
  { nome: 'Alimentação', icone: '🍔', cor: '#FFF0E5' },
  { nome: 'Transporte', icone: '🚌', cor: '#E8F0FF' },
  { nome: 'Lazer', icone: '🎮', cor: '#F1E8FF' },
  { nome: 'Outros', icone: '📦', cor: '#E5F5EA' },
];

export default function App() {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Alimentação');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [despesas, setDespesas] = useState([]);
  const [carregamentoConcluido, setCarregamentoConcluido] = useState(false);
  const [limiteMensal, setLimiteMensal] = useState('800');
  const [limiteCarregado, setLimiteCarregado] = useState(false);
  const [limiteInput, setLimiteInput] = useState('800');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');  
  
  useEffect(() => {
    async function carregarDespesas() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(
          '@meudinheiro:despesas'
        );

        if (dadosSalvos !== null) {
          setDespesas(JSON.parse(dadosSalvos));
        }
      } catch (erro) {
        console.error('Erro ao carregar despesas:', erro);
      } finally {
        setCarregamentoConcluido(true);
      }
    }

    carregarDespesas();
  }, []);

  useEffect(() => {
    async function carregarLimite() {
      try {
        const limiteSalvo = await AsyncStorage.getItem(
          '@meudinheiro:limiteMensal'
        );

      if (limiteSalvo !== null) {
        setLimiteMensal(limiteSalvo);
        setLimiteInput(limiteSalvo);
      }
      } catch (erro) {
        console.error('Erro ao carregar limite mensal:', erro);
      } finally {
        setLimiteCarregado(true);
      }
    }

    carregarLimite();
  }, []);
  
  useEffect(() => {
    if (!carregamentoConcluido) {
      return;
    }

    async function salvarDespesas() {
      try {
        await AsyncStorage.setItem(
          '@meudinheiro:despesas',
          JSON.stringify(despesas)
        );
      } catch (erro) {
        console.error('Erro ao salvar despesas:', erro);
      }
    }

    salvarDespesas();
  }, [despesas, carregamentoConcluido]);


  useEffect(() => {
    if (!limiteCarregado) {
      return;
    }

    async function salvarLimite() {
      try {
        await AsyncStorage.setItem(
          '@meudinheiro:limiteMensal',
          limiteMensal
        );
      } catch (erro) {
        console.error('Erro ao salvar limite mensal:', erro);
      }
    }

    salvarLimite();
  }, [limiteMensal, limiteCarregado]);


const totalGastos = despesas.reduce(
(total, despesa) => total + despesa.valor,
0
);


  const agora = new Date();

  const gastosMes = despesas
    .filter(despesa => {
      if (!despesa.data) {
        return false;
      }

      const dataDespesa = new Date(despesa.data);

      return (
        dataDespesa.getMonth() === agora.getMonth() &&
        dataDespesa.getFullYear() === agora.getFullYear()
      );
    })
    .reduce((total, despesa) => total + despesa.valor, 0);

  const limiteNumerico = Number(limiteMensal.replace(',', '.'));

  const percentualLimite =
    limiteNumerico > 0
      ? (gastosMes / limiteNumerico) * 100
      : 0;

  const limiteAtingido = gastosMes >= limiteNumerico;

  const saldoLimite = limiteNumerico - gastosMes;


  function formatarMoeda(numero) {
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function aplicarMascaraData(texto) {
    const numeros = texto.replace(/\D/g, '').slice(0, 8);

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    }

    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  }


  function converterDataBrasileira(texto) {
    if (!texto || texto.length !== 10) {
      return null;
    }

    const [dia, mes, ano] = texto.split('/').map(Number);

    const data = new Date(ano, mes - 1, dia);

    // Verifica se a data realmente existe
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


  function salvarNovoLimite() {
    const valorLimite = Number(limiteInput.replace(',', '.'));

    if (
      limiteInput.trim() === '' ||
      !Number.isFinite(valorLimite) ||
      valorLimite <= 0
    ) {
      Alert.alert(
        'Limite inválido',
        'Digite um limite mensal maior que zero.'
      );
      return;
    }

    setLimiteMensal(String(valorLimite));
    setLimiteInput(String(valorLimite));

    Alert.alert(
      'Limite atualizado!',
      'Seu limite mensal foi salvo com sucesso.'
    );
  }

  
  function adicionarDespesa() {
    const nomeFormatado = nome.trim();
    const valorNumerico = Number(valor.replace(',', '.'));

    if (nomeFormatado === '') {
      Alert.alert(
        'Nome obrigatório',
        'Digite o nome da despesa antes de continuar.'
      );
      return;
    }

    if (
      valor.trim() === '' ||
      !Number.isFinite(valorNumerico) ||
      valorNumerico <= 0
    ) {
      Alert.alert(
        'Valor inválido',
        'Digite um valor maior que zero. Exemplo: 25,90.'
      );
      return;
    }


    const novaDespesa = {
      id: `${Date.now()}-${Math.random()}`,
      nome: nomeFormatado,
      valor: valorNumerico,
      categoria: categoriaSelecionada,
      data: new Date().toISOString(),
    };


    setDespesas(lista => [...lista, novaDespesa]);
    setNome('');
    setValor('');

    Alert.alert(
      'Despesa adicionada!',
      'Sua despesa foi registrada com sucesso.'
    );
  }


  function excluirDespesa(id) {
    setDespesas(lista =>
      lista.filter(despesa => despesa.id !== id)
    );
  }

  function obterCategoria(nomeCategoria) {
    return categorias.find(
      categoria => categoria.nome === nomeCategoria
    ) || categorias[3];
  }

  
  const dataInicialConvertida = converterDataBrasileira(dataInicial);
  const dataFinalConvertida = converterDataBrasileira(dataFinal);

  const despesasFiltradas = despesas.filter(despesa => {
    const categoriaCorreta =
      filtroCategoria === 'Todas' ||
      despesa.categoria === filtroCategoria;

    // Mantém despesas antigas sem data somente
    // quando nenhum período foi informado
    if (!despesa.data) {
      return (
        categoriaCorreta &&
        !dataInicial &&
        !dataFinal
      );
    }

    const dataDespesa = new Date(despesa.data);
    dataDespesa.setHours(0, 0, 0, 0);

    // Não aplica datas incompletas ou inválidas
    if (
      (dataInicial && !dataInicialConvertida) ||
      (dataFinal && !dataFinalConvertida)
    ) {
      return false;
    }

    const dentroDaDataInicial =
      !dataInicialConvertida ||
      dataDespesa >= dataInicialConvertida;

    const dentroDaDataFinal =
      !dataFinalConvertida ||
      dataDespesa <= dataFinalConvertida;

    return (
      categoriaCorreta &&
      dentroDaDataInicial &&
      dentroDaDataFinal
    );
  });


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.cabecalho}>
          <View>
            <Text style={styles.saudacao}>SEU CONTROLE FINANCEIRO</Text>
            <Text style={styles.titulo}>MeuDinheiro</Text>
          </View>

          <View style={styles.iconeCarteira}>
            <Text style={styles.iconeCarteiraTexto}>💜</Text>
          </View>
        </View>

        <View style={styles.cartaoTotal}>
          <Text style={styles.rotuloTotal}>Total de gastos</Text>
          <Text style={styles.valorTotal}>
            {formatarMoeda(totalGastos)}
          </Text>

          <View style={styles.linhaCartao}>
            <View style={styles.pontoBranco} />
            <Text style={styles.textoCartao}>
              {despesas.length}{' '}
              {despesas.length === 1 ? 'despesa registrada' : 'despesas registradas'}
            </Text>
          </View>
        </View>

        <View style={styles.cartaoLimite}>
          <Text style={styles.tituloLimite}>Limite mensal</Text>

          <Text style={styles.valorLimite}>
            {formatarMoeda(gastosMes)} de {formatarMoeda(limiteNumerico)}
          </Text>

          <Text style={styles.textoSaldoLimite}>
            {saldoLimite >= 0
              ? `Restam ${formatarMoeda(saldoLimite)} do seu limite.`
              : `Você ultrapassou o limite em ${formatarMoeda(Math.abs(saldoLimite))}.`}
          </Text>

          <View style={styles.fundoBarraLimite}>
            <View
              style={[
                styles.progressoBarraLimite,
                {
                  width: `${Math.min(percentualLimite, 100)}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.textoLimite}>
            {limiteAtingido
              ? 'Você atingiu ou ultrapassou seu limite!'
              : `Você utilizou ${percentualLimite.toFixed(0)}% do seu limite.`}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Novo limite mensal (R$)"
            placeholderTextColor="#9A94A8"
            value={limiteInput}
            onChangeText={setLimiteInput}
            keyboardType="decimal-pad"
          />

          <Pressable
            style={styles.botaoAdicionar}
            onPress={salvarNovoLimite}
          >
            <Text style={styles.textoBotaoAdicionar}>
              Salvar limite mensal
            </Text>
          </Pressable>
        </View>

        <View style={styles.resumo}>
          <View style={styles.cartaoResumo}>
            <Text style={styles.iconeResumo}>🧾</Text>
            <Text style={styles.numeroResumo}>{despesas.length}</Text>
            <Text style={styles.rotuloResumo}>Despesas</Text>
          </View>

          <View style={styles.cartaoResumo}>
            <Text style={styles.iconeResumo}>🏷️</Text>
            <Text style={styles.numeroResumo}>
              {new Set(despesas.map(item => item.categoria)).size}
            </Text>
            <Text style={styles.rotuloResumo}>Categorias usadas</Text>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Nova despesa</Text>
        <Text style={styles.descricaoSecao}>
          Preencha os dados do seu gasto.
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.rotuloCampo}>Nome da despesa</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Almoço, Uber, cinema"
            placeholderTextColor="#9A94A8"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.rotuloCampo}>Valor da despesa (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 25,90"
            placeholderTextColor="#9A94A8"
            value={valor}
            onChangeText={setValor}
            keyboardType="decimal-pad"
          />

          <Text style={styles.rotuloCampo}>Categoria</Text>

          <View style={styles.gradeCategorias}>
            {categorias.map(categoria => {
              const selecionada =
                categoriaSelecionada === categoria.nome;

              return (
                <Pressable
                  key={categoria.nome}
                  onPress={() =>
                    setCategoriaSelecionada(categoria.nome)
                  }
                  style={[
                    styles.botaoCategoria,
                    selecionada && styles.categoriaSelecionada,
                  ]}
                >
                  <Text style={styles.iconeCategoria}>
                    {categoria.icone}
                  </Text>
                  <Text
                    style={[
                      styles.textoCategoria,
                      selecionada && styles.textoCategoriaSelecionada,
                    ]}
                  >
                    {categoria.nome}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.botaoAdicionar,
              pressed && styles.botaoPressionado,
            ]}
            onPress={adicionarDespesa}
          >
            <Text style={styles.textoBotaoAdicionar}>
              +  Adicionar despesa
            </Text>
          </Pressable>
        </View>

        <View style={styles.cabecalhoLista}>
          <View>
            <Text style={styles.tituloSecao}>Minhas despesas</Text>
            <Text style={styles.descricaoSecao}>
              Seus gastos registrados
            </Text>
          </View>
          <Text style={styles.contadorLista}>{despesas.length}</Text>
        </View>

        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtros}
          contentContainerStyle={styles.conteudoFiltros}
        >
          {['Todas', ...categorias.map(categoria => categoria.nome)].map(
            categoria => {
              const selecionada = filtroCategoria === categoria;

              return (
                <Pressable
                  key={categoria}
                  onPress={() => setFiltroCategoria(categoria)}
                  style={[
                    styles.botaoFiltro,
                    selecionada && styles.botaoFiltroSelecionado,
                  ]}
                >
                  <Text
                    style={[
                      styles.textoFiltro,
                      selecionada && styles.textoFiltroSelecionado,
                    ]}
                  >
                    {categoria}
                  </Text>
                </Pressable>
              );
            }
          )}
        </ScrollView>


        <View style={styles.filtroPeriodo}>
          <Text style={styles.tituloPeriodo}>
            Consultar por período
          </Text>

          <View style={styles.camposPeriodo}>
            <View style={styles.campoData}>
              <Text style={styles.rotuloData}>Data inicial</Text>
              <TextInput
                style={styles.inputData}
                placeholder="DD/MM/AAAA"
                value={dataInicial}
                onChangeText={texto => setDataInicial(aplicarMascaraData(texto))}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.campoData}>
              <Text style={styles.rotuloData}>Data final</Text>
              <TextInput
                style={styles.inputData}
                placeholder="DD/MM/AAAA"
                value={dataFinal}
                onChangeText={texto => setDataFinal(aplicarMascaraData(texto))}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          <Pressable
            style={styles.botaoLimparPeriodo}
            onPress={() => {
              setDataInicial('');
              setDataFinal('');
            }}
          >
            <Text style={styles.textoLimparPeriodo}>
              Limpar período
            </Text>
          </Pressable>
          
        </View>
    
        {despesasFiltradas.length === 0 ? (
          <View style={styles.estadoVazio}>
            <Text style={styles.iconeVazio}>📊</Text>
            <Text style={styles.tituloVazio}>
              Nenhuma despesa ainda
            </Text>
            <Text style={styles.textoVazio}>
              Adicione seu primeiro gasto para começar a acompanhar
              seu dinheiro.
            </Text>
          </View>
        ) : (
          despesasFiltradas.map(despesa => {
            const categoria = obterCategoria(despesa.categoria);

            return (
              <View key={despesa.id} style={styles.itemDespesa}>
                <View
                  style={[
                    styles.iconeDespesa,
                    { backgroundColor: categoria.cor },
                  ]}
                >
                  <Text style={styles.iconeDespesaTexto}>
                    {categoria.icone}
                  </Text>
                </View>

                <View style={styles.detalhesDespesa}>
                  <Text style={styles.nomeDespesa}>
                    {despesa.nome}
                  </Text>
                  <Text style={styles.categoriaDespesa}>
                    {despesa.categoria}
                  </Text>

                  <Text style={styles.dataDespesa}>
                    {despesa.data
                      ? new Date(despesa.data).toLocaleDateString('pt-BR')
                      : 'Data não registrada'}
                  </Text>                  
                </View>

                <View style={styles.colunaValor}>
                  <Text style={styles.valorDespesa}>
                    {formatarMoeda(despesa.valor)}
                  </Text>
                  <Pressable
                    onPress={() => excluirDespesa(despesa.id)}
                    hitSlop={8}
                  >
                    <Text style={styles.textoExcluir}>Excluir</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.rodape}>
          MeuDinheiro • Organize hoje, planeje o amanhã.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  textoExcluir: {
    color: '#B42318',
    fontSize: 12,
    fontWeight: '600',
  },
  rodape: {
    textAlign: 'center',
    color: '#9A94A8',
    fontSize: 11,
    marginTop: 28,
  },
  
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

  
});
