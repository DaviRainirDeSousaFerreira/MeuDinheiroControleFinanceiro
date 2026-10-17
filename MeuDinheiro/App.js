import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';


import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { categorias } from './src/constants/categorias';
import {
  formatarMoeda,
  aplicarMascaraData,
  converterDataBrasileira,
} from './src/utils/formatacao';
import { lerDados, salvarDados } from './src/storage/armazenamento';
import { styles } from './src/styles/appStyles';
import CartaoGrafico from './src/components/CartaoGrafico';
import ModalEditarDespesa from './src/components/ModalEditarDespesa';




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
  const [despesaEditando, setDespesaEditando] = useState(null);
  const [dataDespesaInput, setDataDespesaInput] = useState('');
  const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState(false);
  
  useEffect(() => {
    async function carregarDespesas() {
      try {
        const dadosSalvos = await lerDados(
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
        const limiteSalvo = await lerDados(
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
        await salvarDados(
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
        await salvarDados(
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

  function editarDespesa(despesa) {
    setDespesaEditando(despesa);
    setModalEdicaoVisivel(true);
    setNome(despesa.nome);
    setValor(String(despesa.valor).replace('.', ','));
    setCategoriaSelecionada(despesa.categoria);

    if (despesa.data) {
      const data = new Date(despesa.data);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();

      setDataDespesaInput(`${dia}/${mes}/${ano}`);
    } else {
      setDataDespesaInput('');
    }
  }
  
  function cancelarEdicao() {
    setModalEdicaoVisivel(false);
    setDespesaEditando(null);
    setNome('');
    setValor('');
    setCategoriaSelecionada('Alimentação');
    setDataDespesaInput('');
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

    // Se houver uma despesa selecionada, atualiza ela.
    if (despesaEditando) {
      const despesasAtualizadas = despesas.map(item =>
        item.id === despesaEditando.id
          ? {
              ...item,
              nome: nomeFormatado,
              valor: valorNumerico,
              categoria: categoriaSelecionada,
            }
          : item
      );

      setDespesas(despesasAtualizadas);
      setModalEdicaoVisivel(false);
      setDespesaEditando(null);
      setNome('');
      setValor('');

      Alert.alert(
        'Despesa atualizada!',
        'Suas alterações foram salvas com sucesso.'
      );

      return;
    }

    // Caso contrário, registra uma nova despesa.
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

  const gastosPorCategoria = [
    'Alimentação',
    'Transporte',
    'Lazer',
    'Outros',
  ].map(categoria => {
    const total = despesasFiltradas
      .filter(despesa => despesa.categoria === categoria)
      .reduce((soma, despesa) => soma + despesa.valor, 0);

    return {
      categoria,
      total,
    };
  });

  const dadosGrafico = gastosPorCategoria
    .filter(item => item.total > 0)
    .map(item => {
      const cores = {
        Alimentação: '#8B5CF6',
        Transporte: '#06B6D4',
        Lazer: '#F59E0B',
        Outros: '#EC4899',
      };

      return {
        value: item.total,
        color: cores[item.categoria],
        text: item.categoria,
      };
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

        <CartaoGrafico
          dadosGrafico={dadosGrafico}
          gastosPorCategoria={gastosPorCategoria}
          formatarMoeda={formatarMoeda}
        />

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
              + Adicionar despesa
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
                    onPress={() => editarDespesa(despesa)}
                    hitSlop={8}
                  >
                    <Text style={styles.textoEditar}>Editar</Text>
                  </Pressable>

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

      <ModalEditarDespesa
        visivel={modalEdicaoVisivel}
        nome={nome}
        setNome={setNome}
        valor={valor}
        setValor={setValor}
        categoriaSelecionada={categoriaSelecionada}
        setCategoriaSelecionada={setCategoriaSelecionada}
        onSalvar={adicionarDespesa}
        onCancelar={cancelarEdicao}
        onRequestClose={cancelarEdicao}
      />

    </View>
  );
}

