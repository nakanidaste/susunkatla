import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../constants'

const Number = ({ number, label }) => (
    <View style={{ alignItems: "center", margin: 10}}>
        <Text style={{color: colors.lightgrey, fontSize: 30, fontWeight: "bold"}}>{number}</Text>
        <Text style={{color: colors.lightgrey, fontSize: 16 }}>{label}</Text>
    </View>
)

const GuessDistributionLine = ({ position, amount }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%"}}>
            <Text style={{color: colors.lightgrey}}>{position}</Text>
            <View 
                style={{
                    alignSelf: "stretch",
                    backgroundColor: colors.grey, 
                    margin: 5, 
                    padding: 5
                }}
            >
                <Text style={{color: colors.lightgrey}}>{amount}</Text>
            </View>
        </View>
    )
}

const EndScreen = ({ menang = false }) => {
  return (
    <View>
      <Text style={styles.title}>
          {menang ? "Selamat kamu menang" : "Kamu kalah, coba lagi besok"}
      </Text>
      <Text style={styles.subtitle}>STATISTICS</Text>
      <View style={{flexDirection: "row", marginBottom: 20}}>
        <Number number={2} label={"Played"}/>
        <Number number={2} label={"Win %"}/>
        <Number number={2} label={"Cur streak"}/>
        <Number number={2} label={"Max streak"}/>
      </View>
    <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
    <View>
        <GuessDistributionLine position={0} amount={2} />
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