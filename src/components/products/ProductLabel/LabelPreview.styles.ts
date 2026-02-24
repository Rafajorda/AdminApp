import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  label: {
    width: 500,
    height: 250,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  qrSection: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 11,
    color: '#444',
    lineHeight: 16,
    marginBottom: 8,
  },
  productDetails: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
  },
  colorsSection: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  colorsLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 8,
  },
  colorCircles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  colorCircleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 4,
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 4,
  },
  colorCircleSelected: {
    backgroundColor: '#333',
  },
  colorName: {
    fontSize: 11,
    color: '#333',
  },
});
