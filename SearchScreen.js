
import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import db from '../config';

export default class SearchScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            allTransactions: [],
            lastVisibleTransaction: null,
            search: ''
        }
    }

    componentDidMount = async() =>{
     const query = await db.collection("Transactions").limit(10).get();
     query.docs.map((doc) =>{
     this.setState({
       allTransactions: [],
       lastVisibleTransaction: doc
     })
     })
    }

    searchTransactions = async(text) =>{
      //A.K.A. amen before the sayAmen();

      console.log("Learning to Say Amen");

      var enterText = text.split("");

      if(enterText[0].toUpperCase() === 'B'){

        alert("Your book has (surprisingly) not been eaten by lynxes or stolen by... Bob")
        const transaction = await db.collection("Transactions").where('bookID', '==', text).limit(10).get();
        transaction.docs.map((doc) => {
            this.setState({
              allTransactions: [...this.state.allTransactions, doc.data()], // ... is to append data so you can attach arrays to arrays
              lastVisibleTransaction: doc

            })
        })
      } else if(enterText[0].toUpperCase() === 'S'){

        alert("Your student has (surprisingly) not been eaten by lynxes or stolen by... Bob")
        const transaction = await db.collection("Transactions").where('studentID', '==', text).limit(10).get();
        transaction.docs.map((doc) => {
            this.setState({
              allTransactions: [...this.state.allTransactions, doc.data()], // ... is to append data so you can attach arrays to arrays
              lastVisibleTransaction: doc

            })
        })
      } 
    }

    sayAmen = async(text) => {

var text = this.state.search.toUpperCase();

        var enterText = text.split("");

        if(enterText[0].toUpperCase() === 'B'){

            alert("Your book has (surprisingly) not been eaten by lynxes or stolen by... Bob")
            const transaction = await db.collection("Transactions").where('bookID', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            transaction.docs.map((doc) => {
                this.setState({
                  allTransactions: [...this.state.allTransactions, doc.data()], // ... is to append data so you can attach arrays to arrays
                  lastVisibleTransaction: doc
    
                })
            })
          } else if(enterText[0].toUpperCase() === 'S'){
    
            alert("Your student has (surprisingly) not been eaten by lynxes or stolen by... Bob")
            const transaction = await db.collection("Transactions").where('studentID', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
            transaction.docs.map((doc) => {
                this.setState({
                  allTransactions: [...this.state.allTransactions, doc.data()], // ... is to append data so you can attach arrays to arrays
                  lastVisibleTransaction: doc
    
                })
            })
          } 
    }

    
render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
      <TextInput 
        style ={styles.bar}
        placeholder = "Search for Imaginary or Non-Imaginary Books"
        onChangeText={(text)=>{this.setState({search:text})}}/>
        <TouchableOpacity
          style = {styles.searchButton}
          onPress={()=>{this.searchTransactions(this.state.search)}}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        </View>
      <FlatList
        data={this.state.allTransactions}
        renderItem={({item})=>(
          <View style={{borderBottomWidth: 2}}>
            <Text>{"Book ID: " + item.bookId}</Text>
            <Text>{"Student ID: " + item.studentId}</Text>
            <Text>{"Transaction Type: " + item.transactionType}</Text>
            <Text>{"Date: " + item.date.toDate()}</Text>
          </View>
        )}
        keyExtractor= {(item, index)=> index.toString()}
        onEndReached ={this.sayAmen}
        onEndReachedThreshold={0.7}
      /> 
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  searchBar:{
    flexDirection:'row',
    height:40,
    width:'auto',
    borderWidth:0.5,
    alignItems:'center',
    backgroundColor:'grey',

  },
  bar:{
    borderWidth:2,
    height:30,
    width:300,
    paddingLeft:10,
  },
  searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green'
  }
})