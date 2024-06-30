import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { useUser } from "../../Context/UserContext";

const Newlesson = ({ navigation }) => {
  //get all the date in this week

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [WeekDates, setWeekDates] = useState({});
  const [DayHours, setDayHours] = useState({});

  const [loading, setLoading] = useState(false);

  const user = useUser();

  const FIREBASE_DB = getFirestore();

  async function getTodayDate() {
    setLoading(true);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let weekDates = {};
    // Reference to the lessons collection
    const lessonsCollection = collection(FIREBASE_DB, "lessons");

    for (let i = 0; i < 7; i++) {
      let date = new Date(tomorrow);
      date.setDate(tomorrow.getDate() + i);
      let day = date.getDate().toString().padStart(2, "0");
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let year = date.getFullYear();
      let fullDate = `${day}-${month}-${year}`;

      // Create a query to find documents with the current date
      const q = query(lessonsCollection, where("date", "==", fullDate));

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size >= 8) {
        weekDates[fullDate] = true;
      } else {
        weekDates[fullDate] = false;
      }
    }

    setWeekDates(weekDates);
    setModalVisible1(true);
    setLoading(false);
  }

  async function getTodayHours(selectedDate) {
    //get all the docs that date: selectedDate
    setLoading(true);
    const LockHours = [];

    const lessonsCollection = collection(FIREBASE_DB, "lessons");
    const q = query(lessonsCollection, where("date", "==", selectedDate));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((Mydocument) => {
      LockHours.push(Mydocument.data().hour);
    });

    //its start the for with the time 10 but if its past 10 it will start from the current time
    const nowtoday = new Date();
    const currentTime = new Date().getHours();
    let i = 10;
    let day = nowtoday.getDate().toString().padStart(2, "0");
    let month = (nowtoday.getMonth() + 1).toString().padStart(2, "0");
    let year = nowtoday.getFullYear();
    let fullDate = `${day}-${month}-${year}`;

    if (currentTime > i && selectedDate == fullDate) {
      i = currentTime;
    }
    let hours = {};
    for (i; i < 14; i++) {
      let hour = `${i}:00`;
      let halfHour = `${i}:30`;

      if (LockHours.includes(hour)) {
        hours[hour] = true;
      }
      if (LockHours.includes(halfHour)) {
        hours[halfHour] = true;
      }
      if (!LockHours.includes(hour)) {
        hours[hour] = false;
      }
      if (!LockHours.includes(halfHour)) {
        hours[halfHour] = false;
      }
    }

    setDayHours(hours);
    setSelectedDay(selectedDate);
    setModalVisible1(false);
    setModalVisible2(true);
    setLoading(false);
  }

  async function savethelesson() {
    setLoading(true);
    const db = FIREBASE_DB;
    const payload = {
      date: selectedDay,
      hour: selectedHour,
      studentEmail: user.email,
    };

    const lessonsCollection = collection(db, "lessons");

    await setDoc(
      doc(lessonsCollection, selectedDay + "+" + selectedHour),
      payload
    );

    setLoading(false);
    setSelectedDay(null);
    setSelectedHour(null);
    setWeekDates({});
    setDayHours({});

    alert("Lesson Saved");
    navigation.navigate("Home");
  }

  return (
    <View>
      {loading && <ActivityIndicator size="large" color="red" />}
      {!loading && (
        <>
          <View style={{ margin: 20 }}></View>
          <View
            style={{
              justifyContent: "space-evenly",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.SelectedDayStyle}>{selectedDay}</Text>
            <TouchableOpacity
              style={styles.openWeekbtn}
              onPress={() => {
                getTodayDate();
              }}
            >
              <Text style={styles.openWeekTxt}>Select date</Text>
            </TouchableOpacity>
          </View>

          {selectedDay && (
            <View
              style={{
                marginVertical: 30,
                justifyContent: "space-evenly",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.SelectedDayStyle}>{selectedHour}</Text>
              <TouchableOpacity
                style={styles.openWeekbtn}
                onPress={() => {
                  getTodayHours(selectedDay);
                }}
              >
                <Text style={styles.openWeekTxt}>Select Hour</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* modal1 */}
          <Modal
            isVisible={modalVisible1}
            onBackdropPress={() => setModalVisible1(false)}
            style={styles.modal}
            propagateSwipe={true}
          >
            <View style={styles.modalContainer}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ paddingBottom: 20 }}>Select a Day</Text>

                {Object.entries(WeekDates).map(
                  ([date, fully_occupied], index) => (
                    <>
                      {fully_occupied && (
                        <View
                          key={index}
                          style={{
                            borderColor: "red",
                            borderWidth: 2,
                            borderRadius: 100,
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                            marginVertical: 5,
                          }}
                        >
                          <Text style={{ color: "red", fontSize: 15 }}>
                            {date}
                          </Text>
                        </View>
                      )}
                      {!fully_occupied && (
                        <TouchableOpacity
                          key={index}
                          style={styles.selectDayBTNS}
                          onPress={() => {
                            getTodayHours(date);
                          }}
                        >
                          <Text style={styles.selectDayTxts}>{date}</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )
                )}
                <Text style={{ marginTop: 20 }}>
                  *ימים ללא תורים פנויים מסומנים באדום
                </Text>
              </View>
            </View>
          </Modal>

          {/* modal2 */}
          <Modal
            isVisible={modalVisible2}
            onBackdropPress={() => setModalVisible2(false)}
            style={styles.modal}
            propagateSwipe={true}
          >
            <View style={styles.modalContainer}>
              <View style={{ alignItems: "center" }}>
                <Text>Select a Hour</Text>
                <ScrollView style={styles.scrollView}>
                  {Object.entries(DayHours).map(
                    ([hours, fully_occupied], index) => (
                      <>
                        {!fully_occupied && (
                          <TouchableOpacity
                            key={index}
                            style={styles.selectDayBTNS}
                            onPress={() => {
                              setSelectedHour(hours);
                              setModalVisible2(false);
                            }}
                          >
                            <Text style={styles.selectDayTxts}>{hours}</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
          {selectedHour && (
            <>
              <TouchableOpacity
                style={styles.sumbit}
                onPress={() => {
                  savethelesson();
                }}
              >
                <Text style={styles.savetxt}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Newlesson;

const styles = StyleSheet.create({
  openWeekbtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
  openWeekTxt: {
    color: "white",
    fontSize: 20,
  },
  SelectedDayStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 40,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  selectDayBTNS: {
    borderBlockColor: "black",
    borderWidth: 2,
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 5,
  },
  selectDayTxts: {
    color: "black",
    fontSize: 15,
  },
  sumbit: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
  savetxt: {
    color: "white",
    fontSize: 20,
  },
});
