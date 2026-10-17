import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { categorias } from '../constants/categorias';
import { styles } from '../styles/appStyles';

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

            <Pressable
              style={styles.botaoAdicionar}
              onPress={onSalvar}
            >
              <Text style={styles.textoBotaoAdicionar}>
                Salvar alterações
              </Text>
            </Pressable>

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
