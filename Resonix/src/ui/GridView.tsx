import { View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface Props<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  col?: number;
}

const GridView = <T extends any>({ data, renderItem, col = 2 }: Props<T>) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View
            key={index.toString()}
            style={{
              flexBasis: `${100 / col}%`,
              maxWidth: `${100 / col}%`,
            }}
          >
            <View style={{ padding: 5 }}>{renderItem(item)}</View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
});

export default GridView;
