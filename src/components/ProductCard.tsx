import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Images } from '../constants/images';

export const ProductCard: React.FC = () => {
  return (
    <View style={styles.productCard}>
      <Image 
        source={Images.img1} 
        style={styles.productImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    height: 180,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
});
