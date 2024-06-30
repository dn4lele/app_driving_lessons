import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import {
  collection,
  query,
  getDocs,
  where,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../Context/UserContext";
import Stars from "react-native-stars";
import Modal from "react-native-modal";

const Historylesson = ({ navigation }) => {
  const [userLessons, setUserLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [password, setpassword] = useState("");
  const [AdminEdit, setAdminEdit] = useState(true);

  const user = useUser();

  const fetchLessons = async () => {
    setLoading(true);
    //get today date and time
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const todaydate = dd + "-" + mm + "-" + yyyy;
    today = new Date(yyyy, mm, dd);

    const todaytime = today.getHours() + ":" + today.getMinutes();

    // Get all user lessons that are after today
    const lessonsCollection = collection(FIREBASE_DB, "lessons");
    const q = query(lessonsCollection, where("studentEmail", "==", user.email));
    const querySnapshot = await getDocs(q);

    let lessons = [];
    querySnapshot.forEach((doc) => {
      let day = doc.data().date.split("-")[0];
      let month = doc.data().date.split("-")[1];
      let year = doc.data().date.split("-")[2];
      let lessondate = new Date(year, month, day);

      if (lessondate == today && doc.data().hour >= todaytime) return;
      if (lessondate > today) return;

      lessons.push(doc.data());
    });

    // Sort the lessons by date
    lessons.sort((a, b) => {
      let dateA = a.date.split("-");
      let dateB = b.date.split("-");
      let date1 = new Date(dateA[2], dateA[1], dateA[0]);
      let date2 = new Date(dateB[2], dateB[1], dateB[0]);
      return date1 - date2;
    });

    // Between 2 different dates add item that { newdate: date }
    let newLessons = [];
    let lastDate = "";
    lessons.forEach((lesson) => {
      if (lesson.date !== lastDate) {
        lastDate = lesson.date;
        newLessons.push({ newdate: lesson.date });
      }
      if (lesson.Stars === undefined) newLessons.push({ ...lesson, Stars: 0 });
      else newLessons.push(lesson);
    });

    setUserLessons(newLessons);
    setLoading(false);
  };

  function calctotalTime() {
    //every lesson is 30 min
    let total = 0;
    userLessons.forEach((lesson) => {
      if (lesson.newdate) return;
      else total += 30;
    });
    return total;
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchLessons();
    }, [])
  );
  function calclessons() {
    let total = 0;
    userLessons.forEach((lesson) => {
      if (lesson.newdate) return;
      else total += 1;
    });
    return total;
  }

  function changestarts(numofstars, date, hour) {
    let newlessons = userLessons.map((lesson) => {
      if (lesson.date === date && lesson.hour === hour) {
        return { ...lesson, Stars: numofstars };
      }
      return lesson;
    });
    setUserLessons(newlessons);
  }

  function countstars() {
    let total = 0;
    userLessons.forEach((lesson) => {
      if (lesson.Stars) total += lesson.Stars;
    });
    return total;
  }

  function savethestars() {
    //save the stars
    const lessonsCollection = collection(FIREBASE_DB, "lessons");
    userLessons.forEach(async (lesson) => {
      if (lesson.newdate) return;
      const q = query(
        lessonsCollection,
        where("studentEmail", "==", user.email),
        where("date", "==", lesson.date),
        where("hour", "==", lesson.hour)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        await setDoc(doc.ref, {
          ...lesson,
          Stars: lesson.Stars,
        });
      });
    });
    setAdminEdit(true);
    alert("Stars saved");
  }

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {loading && <ActivityIndicator size="large" color="black" />}
      {!loading && (
        <>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            History Classes
          </Text>
          {userLessons.length === 0 && <Text>No History classes</Text>}
          <View>
            {userLessons.length > 0 && (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 18 }}>
                  Total time you did: {calctotalTime()} minutes |{" "}
                  {calclessons()} lessons
                </Text>
                <Text style={{ fontSize: 17 }}>
                  number of stars:{countstars()}
                </Text>
              </View>
            )}
          </View>
          <FlatList
            data={userLessons}
            renderItem={({ item }) => (
              <>
                {item.newdate && (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {item.newdate}
                    </Text>
                    <View
                      style={{
                        borderBottomColor: "black",
                        borderBottomWidth: 1,
                        padding: 4,
                        width: "80%",
                      }}
                    ></View>
                  </View>
                )}
                {!item.newdate && (
                  <View
                    style={{
                      backgroundColor: "lightgray",
                      borderRadius: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      margin: 5,
                      gap: 40,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {item.date}
                    </Text>
                    <Text style={{ fontSize: 20 }}>{item.hour}</Text>
                    <Stars
                      default={item.Stars}
                      count={4}
                      half={true}
                      update={(numofstars) =>
                        changestarts(numofstars, item.date, item.hour)
                      }
                      disabled={AdminEdit}
                    />
                  </View>
                )}
              </>
            )}
          />
        </>
      )}

      {AdminEdit && (
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 20,
          }}
          onPress={() => {
            setShowmodal(true);
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>
            Admin Star Change
          </Text>
        </TouchableOpacity>
      )}
      {!AdminEdit && (
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 20,
          }}
          onPress={() => {
            savethestars();
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>save </Text>
        </TouchableOpacity>
      )}

      {/*admin modal */}
      <Modal
        isVisible={showmodal}
        onBackdropPress={() => setShowmodal(false)}
        style={styles.modal}
        propagateSwipe={true}
      >
        <View style={styles.modalContainer}>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text>admin password</Text>
            <TextInput
              style={{
                borderWidth: 1,
                width: 200,
                padding: 10,
                borderRadius: 20,
                margin: 10,
              }}
              autoCapitalize="none"
              placeholder="password"
              onChangeText={(text) => setpassword(text)}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              padding: 10,
              borderRadius: 20,
              alignItems: "center",
            }}
            onPress={() => {
              if (password === "admin") {
                setAdminEdit(false);
                setShowmodal(false);
              } else {
                Alert.alert("Wrong password");
              }
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Historylesson;

const styles = StyleSheet.create({
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
});
