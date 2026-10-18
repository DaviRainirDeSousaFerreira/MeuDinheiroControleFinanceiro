// O arquivo ModalEditarDespesa.js cria a janela de edição de despesas

// permitindo alterar o nome, o valor e a categoria de uma despesa, além de salvar as alterações ou cancelar a edição

// Componentes React Native usados para criar a janela de edição e seus campos.
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
// Reutiliza a mesma lista de categorias usada no formulário principal.
import { categorias } from '../constants/categorias';
import { styles } from '../styles/appStyles';

// Modal de edição reutilizável. Os valores e funções são recebidos do componente App.
// Esse padrão de comunicação entre componentes é chamado de props.
export default function ModalEditarDespesa({
  visivel,
  nome,
  setNome,
  valor,
  setValor,
  categoriaSelecionada,
  setCategoriaSelecionada,
  onSalvar,
  onCancelar,
  onRequestClose,
}) {
  // visible controla se a janela está aberta; os callbacks informam ao App o que o usuário fez.
  return (
      <Modal
        visible={visivel}
        transparent
        animationType="fade"
        onRequestClose={onRequestClose}
      >
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            <Text style={styles.tituloModal}>
              Editar despesa
            </Text>

            {/* Campo controlado: value mostra o estado atual e onChangeText atualiza esse estado. */}
            <Text style={styles.rotuloCampo}>Nome da despesa</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da despesa"
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

            {/* Cada botão representa uma categoria e destaca a categoria selecionada. */}
            <Text style={styles.rotuloCampo}>Categoria</Text>
            <View style={styles.gradeCategorias}>
              {categorias.map(categoria => {
                const selecionada =
                  categoriaSelecionada === categoria.nome;

                return (
                  <Pressable
                    key={categoria.nome}
                    onPress={() => setCategoriaSelecionada(categoria.nome)}
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

            {/* Solicita ao App que valide e salve as alterações. */}
            <Pressable
              style={styles.botaoAdicionar}
              onPress={onSalvar}
            >
              <Text style={styles.textoBotaoAdicionar}>
                Salvar alterações
              </Text>
            </Pressable>

            {/* Fecha a edição sem salvar as mudanças feitas no formulário. */}
            <Pressable
              onPress={onCancelar}
              style={styles.botaoCancelarEdicao}
            >
              <Text style={styles.textoCancelarEdicao}>
                Cancelar
              </Text>
            </Pressable>

          </View>
        </View>

      </Modal>
  );
}
