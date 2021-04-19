import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ToastAndroid
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import firebase from "firebase";
import db from "../config";
import booklogo from "../assets/booklogo.jpg";

export default class TransactionScreen extends React.Component {
  // The mystery deepens. The criminal might be anywhere. No file is safe

  constructor() {
    super();
    this.state = {
      scannedData: "",
      scanned: false,
      scannedBookID: "",
      scannedStudentID: "",
      hasCameraPermission: null,
      buttonState: "normal",
      transactionMessage: "",
    };
  }

  getCameraPermission = async (ID) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted", // Only if the status is 'granted'
      buttonState: ID,
      scanned: false,
    });
  };

  handleBarcodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;
    if (buttonState === "bookID") {
      this.setState({
        scanned: true,
        scannedBookID: data,
        buttonState: "normal",
      });
    }

    if (buttonState === "studentID") {
      this.setState({
        scanned: true,
        scannedStudentID: data,
        buttonState: "normal",
      });
    }
  };

  checkBookEligibility = async() => {
    const bookRef = await db.collection("Books").where("bookID", "==", this.state.scannedBookID).get();
    var transactionType = "";
    if(bookRef.docs.length == 0){
     transactionType = false;
    }
    else{
      bookRef.docs.map(doc => { // docs is an array consisting of all the data, so you're mapping the array
        var book = doc.data(); // assigning the array to a variable to make it extractable
        if(book.bookAvailability){ // if bookAvailability is true, issue, else return
          transactionType = "issue";
        } else {
          transactionType = "return";
        }
      })
    }

    return transactionType;
  }

  checkIssuingEligibility = async() => {
    const studentRef = await db.collection("Students").where("studentID", "==", this.state.scannedStudentID).get();
    var studentEligibility = "";
    if(studentRef.docs.length == 0){
      this.setState({
        scannedStudentID: "",
        scannedBookID: ""
      })
      studentEligibility = false;
      alert("The student you are trying to search for is your imaginary friend (this is absolutely not the plot for a low-budget horror film)")
    } else {
      studentRef.docs.map(doc =>{
        var student = doc.data();
        if(student.numberOfBooksIssued <= 100){
          studentEligibility = true;
        } else {
          studentEligibility = false;
          alert("Don't be greedy, Mr. Stuff-Yourself-With-Books, unless you're Faylene ma'am or if you're reading Nancy Drew and Hardy Boys");
        this.setState({
          scannedStudentID: "",
          scannedBookID: ""
        })
        }

      })
    }

    return studentEligibility;
  }

  checkReturningEligibility = async() => {
   const transactionRef = await db.collection("Transactions").where("bookID", "==", "this.state.scannedBookID").limit(1).get();

   var isStudentEligible = "";
   transactionRef.docs.map(doc =>{
     var lastBookTransaction = doc.data();

     if(lastBookTransaction.studentID === this.state.scannedStudentID){
       isStudentEligible = true;
     } else {
       isStudentEligible = false;
       alert("Imaginary friends don't issue books... Not in our low-budget horror film, at least");
       this.setState({
         scannedBookID: "",
         scannedStudentID: ""
       })
     }
   })

   return isStudentEligible;
  }

  handleTransaction = async () => {
    var transactionType = await this.checkBookEligibility();

    if(!transactionType){
     alert("The book is a figment of your imagination (or it has been eaten by a lynx)");
     this.setState({
       scannedStudentID: "",
       scannedBookID: ""
     });
    } else if(transactionType === "issue"){
       var isStudentEligible = await this.checkIssuingEligibility();
       if(isStudentEligible){
        this.initiateBookIssue();
        alert("Your book may or may not have been issued (knowing Expo, it probably hasn't)");
       }
    } else {
      var isStudentEligible2 = await this.checkReturningEligibility();
      if(isStudentEligible2){
        this.initiateBookReturn();
        alert("Your book has probably been returned (it looked tasty to the lynxes)");
      }
    }
  };
  


  initiateBookIssue = async () => {
    db.collection("Transactions").add({
      'studentID': this.state.scannedStudentID,
      'bookId': this.state.scannedBookID,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Issue",
    });

    db.collection("Books").doc(this.state.scannedBookID).update({
      'bookAvailability': false,
    });

    db.collection("Students")
      .doc(this.state.scannedStudentID)
      .update({
        'numberOfBooksIssued': firebase.firestore.FieldValue.increment(1),
      });

    this.setState({
      scannedStudentID: "",
      scannedBookID: "",
    });
  };

  initiateBookReturn = async () => {
    db.collection("Transaction").add({
      'studentID': this.state.scannedStudentID,
      'bookId': this.state.scannedBookID,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Return",
    });

    db.collection("Books").doc(this.state.scannedBookID).update({
      'bookAvailability': true,
    });

    db.collection("Students")
      .doc(this.state.scannedStudentID)
      .update({
        'numberOfBooksIssued': firebase.firestore.FieldValue.increment(-1),
      });

    this.setState({
      scannedStudentID: "",
      scannedBookID: "",
    });
  };

  render() {
    const hasCameraPermission = this.state.hasCameraPermission;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== "normal" && hasCameraPermission) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarcodeScanned()}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === "normal") {
      
      return (
        <KeyboardAvoidingView style={styles.container} behavior = "padding" enabled>
          
            <Text style={styles.header}>
              Wily the Library
            </Text>
          

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Book ID"
              onChangeText = {text => this.setState({scannedBookID: text})}
              value={this.state.scannedBookID}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermission("bookID");
              }}
            >
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Student ID"
              onChangeText = {text => this.setState({scannedStudentID: text})}
              value={this.state.scannedStudentID}
              
            />

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermission("studentID");
              }}
            >
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.displayText}>
            {hasCameraPermission === true
              ? this.state.scannedData
              : "Objection Overruled!!!"}
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            //onPress={this.getCameraPermission}
            onPress = {async() =>{
              var transactionMessage = this.handleTransaction();
              this.setState({scannedBookID: '', scannedStudentID: ''})
              
              //lynx.Feed(toast);
            }}>
              
            <Text style={styles.buttonText}>
              This button may or may not be a submit button and is the private property of the lynxes and the elks
              (especially the cute lynx who's staring at me creepily from the
              Cute_Lynx.jpg file. He's not that creepy, since he has cute,
              pixelated eyes and if you zoom in 2000%, you can see a whole bunch
              of coloured pixels where his eyes are supposed to be. I think
              that's way too much text for one button, but that's probably fine,
              since my button is HUGE! If you click this button and you see some
              nonsense about a BarCode Scanner not being available, that's an
              evil scheme to control the world. Please ignore.
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  transactionButton: {
    flex: 1,
    width: 200,
    height: 50,
   // alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
        fontSize: 40,
        backgroundColor: 'lightgreen',
        fontWeight: 'bold',
        textAlign: 'center',
        width: 2000,
       // marginBottom: 200
  },

  displayText: {
    // fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: "underline",
   // marginBottom: 200
  },

  buttonText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },

  inputBox: {
  //  fontColor: 'white',
    borderWidth: 4,
    width: 900,
    height: 50,
 //   backgroundColor: 'black',
 textAlign: 'center',
 fontSize: 40,
    alignSelf: 'center',
   // marginTop: 40,
    fontFamily: 'Edwardian Script ITC',
   // outline: 'none',
    fontWeight: 'bold'
  },

  scanButton: {
    width: 300,
    height: 50,
    backgroundColor: "green",
  //  padding: 10,
   // margin: 10,
  },
});
