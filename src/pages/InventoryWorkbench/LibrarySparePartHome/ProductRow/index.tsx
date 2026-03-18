import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';

import { COLORS } from '../constants';

import type { Product } from '../type';

const ProductRow: React.FC<{ item: Product }> = ({ item }) => (
  <View style={styles.productRow}>
    <Image source={{ uri: item.image }} style={styles.productImg} />
    <View style={styles.productInfo}>
      <Text numberOfLines={2} style={styles.productTitle}>
        {item.title}
      </Text>
      <View style={styles.productSubRow}>
        <Text style={styles.productSubText}>{item.sku}</Text>
        <Text style={styles.productSubText}>{item.price}</Text>
        {item.stock && <Text style={styles.stockText}>{item.stock}</Text>}
        <View style={styles.flex1} />
        <Text style={styles.qtyText}>
          x <Text style={styles.qtyNum}>{item.qty}</Text>
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  productRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImg: {
    width: 60,
    height: 60,
    backgroundColor: colors.surfacePlaceholder,
    borderRadius: 6,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
    lineHeight: 20,
  },
  productSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  productSubText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginRight: 12,
  },
  stockText: {
    fontSize: 12,
    color: COLORS.orange,
  },
  flex1: { flex: 1 },
  qtyText: {
    fontSize: 12,
    color: COLORS.textMain,
  },
  qtyNum: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductRow;
