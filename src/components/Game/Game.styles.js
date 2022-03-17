import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

export default StyleSheet.create({
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
    height: 100
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: "row",
    justifyContent: 'center'
  },
  cell: {
    flex: 1,
    borderWidth: 3,
    borderColor: colors.grey,
    aspectRatio: 1,
    margin : 3,
    maxWidth: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 30
  }
})