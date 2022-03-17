import React from 'react'
import { StyleSheet, Text, StatusBar, SafeAreaView } from 'react-native'
import { colors } from './src/constants'
import Game from './src/components/Game'

const App = () => {

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor={colors.black}/>

      <Text style={styles.title}>SUSUNKATLA</Text>

      <Game />

    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: colors.black,
    alignItems: 'center'
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7
  }
})