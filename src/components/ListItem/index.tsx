import { Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';

interface DebugItem {
  key: string;
  label: string;
  value?: string;
  onPress?: () => void;
}

interface DebugListItemProps {
  item: DebugItem;
  showSeparator: boolean;
  onPress?: (item: DebugItem) => void;
}

const ListItem: React.FC<DebugListItemProps> = ({ item, showSeparator, onPress }) => {
  return (
    <Pressable
      style={styles.row}
      onPress={() => {
        if (item.onPress) {
          item.onPress();
        }
        onPress?.(item);
      }}
    >
      <Text style={styles.label}>{item.label}</Text>
      <View style={styles.right}>
        {!!item.value && (
          <Text numberOfLines={1} style={styles.value}>
            {item.value}
          </Text>
        )}
        <Text style={styles.arrow}>›</Text>
      </View>
      {showSeparator && <View style={styles.separator} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  label: {
    color: colors.textMain,
    fontSize: 16,
    lineHeight: 22,
    paddingRight: 110,
  },
  right: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '64%',
  },
  value: {
    color: colors.textSecondary,
    fontSize: 14,
    marginRight: 8,
  },
  arrow: {
    color: colors.textSecondary,
    fontSize: 20,
    lineHeight: 22,
    marginTop: -2,
  },
  separator: {
    position: 'absolute',
    left: 16,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderDefault,
  },
});

export default ListItem;
