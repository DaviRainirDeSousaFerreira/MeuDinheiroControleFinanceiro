// Hooks ( UseState, UseEffect ) Funções especiais do React
import { useEffect, useState } from 'react';

// Componente que permite controlar a aparência da barra de status do celular
import { StatusBar } from 'expo-status-bar';

// Componentes React Native
import {
 Text,
 View,
 TextInput,
 Pressable,
 ScrollView,
 Alert, //Api usada para exibir alertas nativos
 Modal,
} from 'react-native';

// Importando recursos de arquivos
// Importando as categorias
import { categorias } from './src/constants/categorias'; 

// Importando funções de formatação
import {
 formatarMoeda,
 aplicarMascaraData,
 converterDataBrasileira,
} from './src/utils/formatacao';

// Importando funções de armazenamento
import { lerDados, salvarDados } from './src/storage/armazenamento';

// Importando os estilos
import { styles } from './src/styles/appStyles';

// Importando o componente do gráfico
import CartaoGrafico from './src/components/CartaoGrafico';

// Importando o modal de edição
import ModalEditarDespesa from './src/components/ModalEditarDespesa';


// Componente principal: coordena os dados, as regras e a tela do MeuDinheiro.
export default function App() {

  // Estados relacionados ao cadastro de despesas
  const [nome, setNome] = useState('');

  const [valor, setValor] = useState('');
  
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Alimentação'); 

  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  const [despesas, setDespesas] = useState([]);

  // Estados relacionados ao carregamento e ao limite mensal
  const [carregamentoConcluido, setCarregamentoConcluido] = useState(false);

  const [limiteMensal, setLimiteMensal] = useState('800');

  const [limiteCarregado, setLimiteCarregado] = useState(false);

  const [limiteInput, setLimiteInput] = useState('800');

  // Estados relacionados ao filtro por período e à edição
  const [dataInicial, setDataInicial] = useState('');

  const [dataFinal, setDataFinal] = useState('');

  const [despesaEditando, setDespesaEditando] = useState(null);

  const [dataDespesaInput, setDataDespesaInput] = useState('');

  const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState(false);
  
  useEffect(() => {
    // Cria uma função assíncrona chamada "carregarDespesas"
    // precisa ser assíncrona porque ela realiza uma operação que pode demorar para terminar 
    // Por exemplo: buscar as despesas salvas no armazenamento local do celular.
    async function carregarDespesas() {
      try {
        // Aqui, o aplicativo procura as despesas salvas usando a função "lerDados"
        // "lerDados" é a função que você importou do arquivo "armazenamento.js".
        const dadosSalvos = await lerDados( 
          // "await" espera a operação terminar antes de continuar.
          // chave usada para identificar onde as despesas estão salvas
          '@meudinheiro:despesas' 
        );
        
        // Verifica se foram encontrados dados salvos
        // Se "dadosSalvos" for diferente "null",
        // então existe algum valor salvo nessa chave.
        if (dadosSalvos !== null) {
          // transforma o texto JSON em uma lista JavaScript
          // e atualiza o estado "despesas" com essa lista.
          setDespesas(JSON.parse(dadosSalvos));
        }
      } catch (erro) {
        // se ocorrer um erro o console registra uma mensagem
        console.error('Erro ao carregar despesas:', erro);
      } finally {
        //O bloco "finally" é executado quando a operação termina
        //indica que a tentativa de carregamento inicial das despesas terminou
        setCarregamentoConcluido(true);
      }
    }
  
    // Essa linha chama a função que foi definida anteriormente
    // Apenas declarar uma função não faz com que ela seja executada
    // é necessário chamá-la para executar seu conteúdo.
    carregarDespesas();
  }, []);

  // O array vazio "[]" indica que o efeito é executado quando o componente é montado
  // ou seja quando o aplicativo abre essa tela pela primeira vez.

  useEffect(() => {
    // Você está declarando uma função assíncrona chamada "carregarLimite"
    async function carregarLimite() {

      try {
        // recupera do armazenamento local
        // o valor associado à chave do limite mensal "@meudinheiro:limiteMensal"
        const limiteSalvo = await lerDados(
          '@meudinheiro:limiteMensal'
        );
    
        // Verifica se encontrou algum valor salvo
        // se "limiteSalvo for diferente de null"
        // então existe um valor salvo, o código dentro do "if" será executado
        if (limiteSalvo !== null) {
          // Atualiza o estado "limiteMensal" com o valor recuperado
          // representa o limite utilizado nos cálculos para acompanhar os gastos
          setLimiteMensal(limiteSalvo);
          // Atualiza o estado "limiteInput" com o mesmo valor.
          // representa o valor da caixa de texto que o usuário pode ver e editar
          setLimiteInput(limiteSalvo);
        }

      } catch (erro) {
        // executa caso ocorra um erro durante a execução do "try"
	      // exibe uma mensagem de erro no console 
        console.error('Erro ao carregar limite mensal:', erro);
      } finally {
        // O finally é executado sempre, mesmo se ocorrer um erro.
	      // atualiza o estado "limiteCarregado" para "true"
	      // Indica que a tentativa de carregar o limite terminou.
        setLimiteCarregado(true); 
      }
    }
  
    // chama a função para executá-la
    // Sem essa chamada a função seria apenas declarada
    carregarLimite();
  }, []);
 
// O array vazio "[]" indica que o efeito é executado quando o componente é montado
// ou seja quando o aplicativo abre essa tela pela primeira vez.
  
  
  useEffect(() => {
	  // verifica se o carregamento inicial das despesas ainda não foi concluído.
    if (!carregamentoConcluido) {
      return;
    }
	
	  // cria um fnção assíncrona chamada "salvarDespesas()"
    async function salvarDespesas() {
      try {
        // função "salvarDados()" importada do arquivo "armazenamento.js"
        // recebe 2 argumentos
        // O "await" aguarda a operação assíncrona de salvamento terminar antes de continuar a execução dessa função.
        await salvarDados(
        // chave que identifica onde a lista de despesas será salva.
        '@meudinheiro:despesas',
        // Converte a lista de despesas, que é um valor JavaScript, em um texto no formato JSON
        JSON.stringify(despesas)
        );

      } catch (erro) { // executa caso ocorra um erro durante a execução do "try".
        // mostra uma mensagem de erro no console
        console.error('Erro ao salvar despesas:', erro);
      }
    }
    
    // chama a função que foi declarada
    salvarDespesas();
  }, [despesas, carregamentoConcluido]);
 
  //O array contém dois estados que fazem o efeito ser executado novamente quando seus valores mudam

  // Terceiro efeito
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

    
    if (!despesa.data) {
      return (
        categoriaCorreta &&
        !dataInicial &&
        !dataFinal
      );
    }

    const dataDespesa = new Date(despesa.data);
    dataDespesa.setHours(0, 0, 0, 0);

    
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
        {/* Cabeçalho com o nome do aplicativo e o ícone. */}
        <View style={styles.cabecalho}>
          <View>
            <Text style={styles.saudacao}>SEU CONTROLE FINANCEIRO</Text>
            <Text style={styles.titulo}>MeuDinheiro</Text>
          </View>

          <View style={styles.iconeCarteira}>
            <Text style={styles.iconeCarteiraTexto}>💜</Text>
          </View>
        </View>

        {/* Resumo geral: soma de todas as despesas cadastradas. */}
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

        {/* Cartão do limite mensal, com barra de progresso e campo para alterar o limite. */}
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

        {/* Componente separado que desenha o gráfico e sua legenda. */}
        <CartaoGrafico
          dadosGrafico={dadosGrafico}
          gastosPorCategoria={gastosPorCategoria}
          formatarMoeda={formatarMoeda}
        />

        {/* Pequenos cartões com quantidade de despesas e de categorias utilizadas. */}
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

        {/* Formulário usado para registrar uma despesa nova. */}
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

        {/* Cabeçalho e contador da seção que mostra as despesas registradas. */}
        <View style={styles.cabecalhoLista}>
          <View>
            <Text style={styles.tituloSecao}>Minhas despesas</Text>
            <Text style={styles.descricaoSecao}>
              Seus gastos registrados
            </Text>
          </View>
          <Text style={styles.contadorLista}>{despesas.length}</Text>
        </View>

        
        {/* Filtros rápidos: 'Todas' ou uma categoria específica. */}
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


        {/* Filtro por intervalo de datas; a máscara mantém o formato DD/MM/AAAA. */}
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
    
        {/* Se não houver resultados, mostra uma mensagem; caso contrário, renderiza cada despesa. */}
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

      {/* Modal separado. Recebe valores e funções do App por meio de props. */}
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
