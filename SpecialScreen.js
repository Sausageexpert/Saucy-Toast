
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class SpecialScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            text: ''
        }
    }

    render(){
        return(
     <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>This screen is for friends of the librarian only</Text>
        <Text>If you ARE a friend of the librarian, enter your name in the box, and our trained lynxes will verify your identity</Text>
        <Text>If you AREN'T a friend of the librarian, well, the lynxes are hungry. VERY hungry</Text>

        <TouchableOpacity
        style = {styles.button}>
         Press Here to Verify Your Identity
        </TouchableOpacity>
     </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        borderWidth: 4,
        height: 40,
        marginTop: 100,
        alignSelf: 'center',
        width: 200,
        textAlign: 'center',
        backgroundColor: 'blue'
    },

    button: {
        width: 20,
        height: 20,
        borderRadius: 2,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'green'
    }
})