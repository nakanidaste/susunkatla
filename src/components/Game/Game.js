import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, Alert, ActivityIndicator} from 'react-native'
import { colors, CLEAR, ENTER, colorsToEmoji } from '../../constants'
import Keyboard from '../Keyboard'
import Clipboard from '@react-native-community/clipboard'
import words from '../../words'
import styles from './Game.styles'
import { copyArray, getDayOfTheYear, getDayKey } from '../utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EndScreen from '../EndScreen'

const NUMBER_OF_TRIES = 6

const dayOfTheYear = getDayOfTheYear()
const dayKey = getDayKey()

const Game = () => {
  // AsyncStorage.removeItem("@game")
  const word = words[dayOfTheYear]
  const letters = word.split('') // ['h', 'e', 'l', 'l', 'o']

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill("")))
  const [curRow, setCurRow] = useState(0)
  const [curCol, setCurCol] = useState(0)
  const [gameState, setGameState] = useState('bermain')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (curRow > 0) {
      checkGameState()
    }
  }, [curRow])

  useEffect(() => {
    if (loaded) {
      persisState()
    }
  }, [rows, curRow, curCol, gameState])

  useEffect(() => {
    readState()
  }, [])

  const persisState = async () => {
      // write all the state variables in async storage
      const dataForToday = {
          rows,
          curCol,
          curRow,
          gameState,
      }

      try {
        const existingStateString = await AsyncStorage.getItem("@game")
        const existingState = existingStateString 
          ? JSON.parse(existingStateString) 
          : {}

        existingState[dayKey] = dataForToday

        const dataString = JSON.stringify(existingState)
        await AsyncStorage.setItem("@game", dataString)
      } catch(e) {
        console.log("Failed to write data to async storage", e)
      }
  }

  const readState = async () => {
      const dataString = await AsyncStorage.getItem("@game")
      try {
        const data = JSON.parse(dataString)
        const day = data[dayKey]
        setRows(day.rows)
        setCurCol(day.curCol)
        setCurRow(day.curRow)
        setGameState(day.gameState)
      } catch(e) {
          console.log("Couldn't parse the state")
      }

      setLoaded(true)
  }

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'menang') {
      Alert.alert(
      "Selamat",
      "Kamu menang",
      [
        {
          text: "Bagikan",
          onPress: () => shareScore(),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => null
        }
      ],
      { cancelable: true}
    );
      setGameState('menang')
    } else if (checkIfLost() && gameState !== 'kalah') {
      Alert.alert("Kamu kalah", "Coba lagi besok")
      setGameState('kalah')
    }
  }

  const shareScore = () => {
    const textMap = rows.map((row, i) =>
      row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
    ).filter((row) => row)
    .join("\n")
    
    const textToShare = `SusunKatla \n ${textMap}`
    Clipboard.setString(textToShare)
    Alert.alert("Copied successfully", "Share your score on your social media")
  }

  const checkIfWon = () => {
    const row = rows[curRow - 1]

    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length
  }

  const onKeyPressed = (key) => {
    if (gameState !== 'bermain') {
      return
    }

    const updatedRows = copyArray(rows)

    if (key === CLEAR) {
      const prevCol = curCol - 1
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = ""
        setRows(updatedRows)
        setCurCol(prevCol)
      }
      return 
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1)
        setCurCol(0)
      }
      return
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key
      setRows(updatedRows)
      setCurCol(curCol + 1)
    }
  }

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol
  }

  const getCellBGColor = (row , col) => {
    const letter = rows[row][col]

    if (row >= curRow) {
      return colors.black
    }
    if (letter === letters[col]) {
      return colors.primary
    }
    if (letters.includes(letter)) {
      return colors.secondary
    }
    return colors.darkgrey
  }

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    )
  }

  const greenCaps = getAllLettersWithColor(colors.primary)
  const yellowCaps = getAllLettersWithColor(colors.secondary)
  const greyCaps = getAllLettersWithColor(colors.darkgrey)

  if (!loaded) {
      return <ActivityIndicator />
  }

  if (gameState !== "bermain") {
    return (
      <EndScreen menang={ gameState === "menang" } />
    )
  }

  return (
    <>
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View 
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell, 
                  { 
                    borderColor: isCellActive(i, j) 
                      ? colors.lightgrey 
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j)
                  }
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>  
        ))}
      </ScrollView>

      <Keyboard 
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />

    </>            
  )
}

export default Game

