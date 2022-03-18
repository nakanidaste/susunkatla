import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors, colorsToEmoji } from '../../constants'
import Clipboard from '@react-native-community/clipboard'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Number = ({ number, label }) => (
    <View style={{ alignItems: "center", margin: 10}}>
        <Text style={{color: colors.lightgrey, fontSize: 30, fontWeight: "bold"}}>{number}</Text>
        <Text style={{color: colors.lightgrey, fontSize: 16 }}>{label}</Text>
    </View>
)

const GuessDistributionLine = ({ position, amount, percentage }) => {
    return (
        <View 
            style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                width: "100%"
            }}
        >
            <Text style={{color: colors.lightgrey}}>{position}</Text>
            <View 
                style={{
                    alignSelf: "stretch",
                    backgroundColor: colors.grey, 
                    margin: 5, 
                    padding: 5,
                    width: `${percentage}%`
                }}
            >
                <Text style={{color: colors.lightgrey}}>{amount}</Text>
            </View>
        </View>
    )
}

const GuessDistribution = () => {
    return (
        <>
            <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
            <View style={{ width: "100%", padding: 20, }}>
                <GuessDistributionLine position={0} amount={2} percentage={50}/>
            </View>
        </>
    )
}

const EndScreen = ({ menang = false, rows, getCellBGColor }) => {
    const [second, setSecond] = useState(0)
    const [played, setPlayed] = useState(0)
    const [winRate, setWinRate] = useState(0)
    const [curStreak, setCurStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)

    useEffect(() => {
        readState()
    }, [])

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const tomorrow = new Date(
                now.getFullYear(), 
                now.getMonth(), 
                now.getDate() + 1
            )
        
            setSecond((tomorrow - now) / 1000)
        }

        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    const readState = async () => {
        const dataString = await AsyncStorage.getItem("@game")
        let data
        try {
            data = JSON.parse(dataString)
            console.log(data)
        } catch(e) {
            console.log("Couldn't parse the state")
        }

        const keys = Object.keys(data)
        const values = Object.values(data)

        setPlayed(Object.keys(data).length)

        const numberOfWin = values.filter(
            game => game.gameState === "menang"
        ).length
        setWinRate(Math.floor((100 * numberOfWin) / keys.length))
        
        let _curStreak = 0
        let maxStreak = 0
        let prevDay = 0
        keys.forEach((key) => {
            const day = parseInt(key.split("-")[1])
            if (data[key].gameState === "menang" && _curStreak === 0) {
                _curStreak += 1
            } else if (data[key].gameState === "menang" && prevDay + 1 === day) {
                _curStreak += 1
            } else {
                if (_curStreak > maxStreak) {
                    maxStreak = _curStreak
                }
                _curStreak = data[key].gameState === "menang" ? 1 : 0
            }
            prevDay = day
        }) 
        setCurStreak(_curStreak)  
        setMaxStreak(_curStreak)         
    }

    const share = () => {
        const textMap = rows.map((row, i) =>
            row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
            ).filter((row) => row)
            .join("\n")
        
        const textToShare = `SusunKatla \n ${textMap}`
        Clipboard.setString(textToShare)
        Alert.alert("Copied successfully", "Share your score on your social media")
    }

    const formatSeconds = () => {
        const hours = Math.floor(second / (60 * 60))
        const minute = Math.floor((second % (60 * 60)) / 60)
        const seconds = Math.floor(second % 60)

        return `${hours}:${minute}:${seconds}`
    }

    return (
        <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.title}>
            {menang ? "Selamat kamu menang" : "Kamu kalah, coba lagi besok"}
        </Text>

        <Text style={styles.subtitle}>STATISTICS</Text>
        <View style={{flexDirection: "row", marginBottom: 20}}>
            <Number number={played} label={"Played"}/>
            <Number number={winRate} label={"Win %"}/>
            <Number number={curStreak} label={"Cur streak"}/>
            <Number number={maxStreak} label={"Max streak"}/>
        </View>

        <GuessDistribution />

        <View style={{ flexDirection: "row", padding: 10}}>
            <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: colors.lightgrey }}>Next Katla</Text>
                <Text style={{ color: colors.lightgrey, fontSize: 24, fontWeight: "bold" }}>{formatSeconds()}</Text>
            </View>

            <Pressable 
                onPress={share} 
                style={{ 
                    flex: 1, 
                    backgroundColor: colors.primary, 
                    borderRadius: 25, 
                    alignItems: "center", 
                    justifyContent: "center" 
                }}
            >
                <Text style={{ color: colors.lightgrey, fontWeight: "bold"}}>Share</Text>
            </Pressable>
        </View>
        </View>
    )
}

export default EndScreen

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        textAlign: 'center',
        marginVertical: 20
    },
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: 'center',
        marginVertical: 15,
        fontWeight: "bold"
    }
})