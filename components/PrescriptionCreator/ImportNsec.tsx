import { useState } from "react";
import { Button, Modal, NativeSyntheticEvent, Text, TextInput, TextInputChangeEventData, View } from "react-native"

export const ImportNsec = ({ isVisible, onClose, onPress }: { isVisible: boolean, onClose: () => void, onPress: (nsec: `nsec1${string}`) => void }) => {

    const [nsec, setNsec] = useState("");

    const handleNsec = (value: string) => {
        setNsec(value)
    }
    return (
        <Modal 
            visible={isVisible}
            onRequestClose={() => { console.log("closing....") ; onClose(); return true }}
            onDismiss={() => {onClose()}}
            presentationStyle="pageSheet">
            <View style={{ backgroundColor: "#ffffff", height: 500, justifyContent: "center", display: "flex", margin: 30, borderColor: "red", alignItems: "center"}}>
                <View style={{margin: 5}}>
                    <Text style={{color: "#000000", margin: 5}}>
                        Import Your Nsec
                    </Text>
                    <TextInput style={{borderColor: "#000000", borderWidth: 1, borderRadius: 5, color: "#000000"}} onChangeText={handleNsec}/>
                </View>
                <View>
                    <Button title="Import" onPress={() => onPress(nsec)}></Button>
                </View>
            </View>
        </Modal>
    )
}