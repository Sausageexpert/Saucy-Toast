
import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import db from '../config';
import * as firebase from 'firebase';

export default class AuthenticationScreen extends React.Component{
    constructor(){
        super();

        this.state = {
            emailID: '',
            password: ''
        };
    }

    login = async(email, password) => {
        if(email && password){
         try{
             const lameExcuse = await firebase.auth().signInWithEmailAndPassword(email, password);
             alert("We have succeeded in capturing your imaginary friend (kind of)");
             console.log('response ' + lameExcuse);

             if(lameExcuse){
              this.props.navigation.navigate('MainScreen');
             }
         }
         
         catch(error){
             console.log(error.code);
             switch(error.code){
                 case 'auth/user-not-found':
                alert("User doesn't exist (outside your head, we mean)");
                console.log("User doesn't exist");

                break;
                case 'auth/too-many-requests': 
                alert("We are currently facing technical issues. Please try again later (or you could check your password)");
                console.log("Just read the alert already");

                break; 
             }
         }
        } else { // Elsa
            alert("The snow glows white on the mountain tonight... (unless you've entered your sensitive information)");
        }
    };

    render(){
        return(
            <KeyboardAvoidingView style = {{flex: 1, alignItems: 'center', marginTop: 20, backgroundColor: 'pink'}}>
                <View>
              <Image source = {require('../TippityTopImportantFiles/Toast_Yum.jpg')} 
             style = {{width: 200, height: 200, borderRadius: 50}}/>

                <Text style = {{textAlign: 'center', fontSize: 30}}> Saucy Toast </Text>
                </View>

              <View>
              <TextInput
            style = {styles.input}
            placeholder = 'Enter Your Alias Here (The Police Are Onto You)'
            onChangeText = {text =>{
              this.setState({
                  emailID: text
              });
            }}/>

              <TextInput
            style = {styles.input}
            placeholder = 'Enter Your Other Alias Here (Soham is Onto You (Mwa Ha Ha!!!))'
            onChangeText = {text =>{
              this.setState({
                  password: text
              });
            }}/>

              </View>

<View>
    <TouchableOpacity style = {{height: 30, width: 90, borderWidth: 1, marginTop: 20, paddingTop: 5, borderRadius: 7, alignSelf: 'center'}}
    onPress = {() => {
        this.login(this.state.emailID, this.state.password);
        
    }}>
        <Text style = {{textAlign: 'center'}}> Register Your Alias Here (Or Try To)</Text>
    </TouchableOpacity>
</View>
           

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        border: 4,
        width: 500,
        height: 50,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 30,
        fontFamily: 'Calibri',
        paddingLeft: 10
    }
})