// Text e View são os componentes básicos usados para compor a interface.
import { Text, View } from 'react-native';
// PieChart é o componente da biblioteca que desenha o gráfico de rosca.
import { PieChart } from 'react-native-gifted-charts';
import { styles } from '../styles/appStyles';

// Este componente recebe os dados já calculados pelo App por meio de props.
// Assim, ele se preocupa em exibir o gráfico, e não em cadastrar ou filtrar despesas.
export default function CartaoGrafico({
  dadosGrafico,
  gastosPorCategoria,
  formatarMoeda,
}) {
  // Quando não existem gastos, mostra uma mensagem; caso contrário, desenha o gráfico e a legenda.
  return (
        <View style={styles.cartaoGrafico}>
          
          <View style={styles.cabecalhoGrafico}>
            <View style={styles.iconeTituloGrafico}>
              <Text style={styles.emojiTituloGrafico}>📊</Text>
            </View>

            <View style={styles.textosTituloGrafico}>
              <Text style={styles.tituloGrafico}>
                Gastos por categoria
              </Text>
              <Text style={styles.subtituloGrafico}>
                Veja para onde vai seu dinheiro
              </Text>
            </View>
          </View>


          {/* Evita mostrar um gráfico vazio quando nenhuma categoria tem valores. */}
          {dadosGrafico.length === 0 ? (
            <Text style={styles.textoSemGrafico}>
              Não há gastos para exibir neste período.
            </Text>
          ) : (
            <>
              {/* 'donut' transforma o gráfico de pizza em uma rosca; 'data' contém valores e cores. */}
              <PieChart
                data={dadosGrafico}
                donut
                radius={100}
                innerRadius={60}
                innerCircleColor="#FFFFFF"
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#8B8BA7' }}>
                      Total
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#302642' }}>
                      {formatarMoeda(
                        dadosGrafico.reduce((soma, item) => soma + item.value, 0)
                      )}
                    </Text>
                  </View>
                )}
              />

              {/* Legenda: uma linha para cada categoria com gastos, incluindo percentual e valor. */}
              {gastosPorCategoria
                .filter(item => item.total > 0)
                .map(item => {
                  const cores = {
                    Alimentação: '#8B5CF6',
                    Transporte: '#06B6D4',
                    Lazer: '#F59E0B',
                    Outros: '#EC4899',
                  };

                  return (
                    <View
                      key={item.categoria}
                      style={styles.cartaoLegenda}
                    >
                      <View
                        style={[
                          styles.iconeLegenda,
                          { backgroundColor: `${cores[item.categoria]}20` },
                        ]}
                      >
                        <View
                          style={[
                            styles.pontoLegendaGrafico,
                            { backgroundColor: cores[item.categoria] },
                          ]}
                        />
                      </View>

                      <View style={styles.detalhesLegenda}>
                        <Text style={styles.nomeLegendaGrafico}>
                          {item.categoria}
                        </Text>

                        <Text style={styles.percentualLegenda}>
                          {(
                            (item.total /
                              dadosGrafico.reduce(
                                (soma, dado) => soma + dado.value,
                                0
                              )) * 100
                          ).toFixed(1).replace('.', ',')}% dos gastos
                        </Text>
                      </View>

                      <Text style={styles.valorLegendaGrafico}>
                        {formatarMoeda(item.total)}
                      </Text>
                    </View>
                  );

                })}
            </>
          )}
        </View>
  );
}
