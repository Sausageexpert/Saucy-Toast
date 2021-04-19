var transactionMessage = null;
db.collection("Books")
  .doc(this.state.scannedBookID)
  .get()
  .then((doc) => {

    // Dracula.doNotEat(doc);
    // Lynx.doNotThinkThatTheDocumentIsTasty();

    console.log(doc.data);
    var book = doc.data();
    if (book.bookAvailability) {
      this.initiateBookIssue();
      transactionMessage = "Your book has (probably) been issued";
      ToastAndroid.show(transactionMessage, toastAndroid.SHORT)
    } else {
      this.initiateBookReturn();
      transactionMessage = "Your book has (definitely not) been issued";
      ToastAndroid.show(transactionMessage, toastAndroid.SHORT)
    }
  });

this.setState({
  transactionMessage: transactionMessage,
});

// More Code!

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
    if(student.numberOfBooksIssued < 1){
      studentEligibility = false;
      alert("No one gets past the trained lynxes...")
    } else {

      studentEligibility = true;
      alert("You can return your book (if Expo wants you to)");
    this.setState({
      scannedStudentID: "",
      scannedBookID: ""
    })
    }

  })
}

return studentEligibility;
