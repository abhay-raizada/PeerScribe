import { Button, Modal, Text, TextInput, View } from "react-native"

export const SendPrescription = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    return (
        <Modal 
            visible={isVisible}
            onRequestClose={() => { console.log("closing....") ; onClose(); return true }}
            onDismiss={() => {onClose()}}
            presentationStyle="pageSheet">
            <View style={{ backgroundColor: "#ffffff", height: 500, justifyContent: "center", display: "flex", margin: 30, borderColor: "red", alignItems: "center"}}>
                <View style={{margin: 5}}>
                    <Text style={{color: "#000000", margin: 5}}>Search an npub to send prescription</Text>
                    <TextInput style={{borderColor: "#000000", borderWidth: 1, borderRadius: 5}}/>
                </View>
                <View>
                    <Button title="Send"></Button>
                </View>
            </View>
        </Modal>
    )
}