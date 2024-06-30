import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Color, FontSize } from "../../GlobalStyles";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import { useUser } from "../../Context/UserContext";
import { useFocusEffect } from "@react-navigation/native";

const Payments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [amount, setAmount] = useState("");
  const user = useUser();

  const fetchPaymentHistory = async () => {
    const db = FIREBASE_DB;
    const q = query(
      collection(db, "Payments"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const payments = [];
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });

    //sort the payments by date and time
    payments.sort((a, b) => {
      let dateA = a.lessonId.split("+")[0].split("-");
      let dateB = b.lessonId.split("+")[0].split("-");
      let date1 = new Date(dateA[2], dateA[1] - 1, dateA[0]);
      let date2 = new Date(dateB[2], dateB[1] - 1, dateB[0]);
      return date1 - date2;
    });

    setPaymentHistory(payments);
    setLoading(false);
  };

  const fetchLessons = async () => {
    setLoading(true);

    const lessonsCollection = collection(FIREBASE_DB, "lessons");
    const q = query(lessonsCollection, where("studentEmail", "==", user.email));
    const querySnapshot = await getDocs(q);

    let lessons = [];
    querySnapshot.forEach((doc) => {
      let lessonData = { id: doc.id, ...doc.data() };
      lessons.push(lessonData);
    });

    // Sort the lessons by date
    lessons.sort((a, b) => {
      let dateA = a.date.split("-");
      let dateB = b.date.split("-");
      let date1 = new Date(dateA[2], dateA[1] - 1, dateA[0]);
      let date2 = new Date(dateB[2], dateB[1] - 1, dateB[0]);
      return date1 - date2;
    });

    //remove lessons that have already been paid
    const paidLessons = paymentHistory.map((payment) => payment.lessonId);
    lessons = lessons.filter(
      (lesson) => !paidLessons.includes(lesson.date + "+" + lesson.hour)
    );

    setLessons(lessons);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPaymentHistory();
      fetchLessons();
    }, [])
  );

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text>Date: {item.lessonId.split("+")[0]}</Text>
      <Text>Time: {item.lessonId.split("+")[1]}</Text>
      <Text>Amount: {item.amount}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  const renderLessonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.lessonItem}
      onPress={() => setSelectedLesson(item)}
    >
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.hour}</Text>
    </TouchableOpacity>
  );

  const handleNewPayment = () => {
    fetchLessons();
    setModalVisible(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedLesson || !amount) {
      Alert.alert("Error", "Please select a lesson and enter an amount.");
      return;
    }

    const db = FIREBASE_DB;
    await addDoc(collection(db, "Payments"), {
      userId: user.uid,
      lessonId: selectedLesson.id,
      amount,
      status: "paid",
    });

    Alert.alert("Success", "Payment made successfully!");
    setModalVisible(false);
    setAmount("");
    setSelectedLesson(null);
    fetchPaymentHistory(); // Refresh payment history
    fetchLessons(); // Refresh lessons
  };

  function calcpaid() {
    let total = 0;
    paymentHistory.forEach((payment) => {
      if (payment.status === "unpaid") return;
      total += parseInt(payment.amount);
    });
    return total;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments</Text>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>total paid:{calcpaid()}</Text>
      </View>
      <FlatList
        data={paymentHistory}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <TouchableOpacity style={styles.button} onPress={handleNewPayment}>
        <Text style={styles.buttonText}>Make New Payment</Text>
      </TouchableOpacity>

      {/* my modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select a Lesson</Text>
          <FlatList
            data={lessons}
            renderItem={renderLessonItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
          {selectedLesson && (
            <View style={styles.paymentInput}>
              <Text
                style={{
                  fontSize: 20,
                  color: Color.primary,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Selected Lesson: {selectedLesson.date} {selectedLesson.time}
              </Text>
              <TextInput
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handlePaymentSubmit}
              >
                <Text style={styles.buttonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    marginBottom: 20,
    width: "100%",
  },
  paymentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  lessonItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
  },
  button: {
    backgroundColor: Color.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentInput: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});
