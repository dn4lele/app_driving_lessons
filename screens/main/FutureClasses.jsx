import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import {
  collection,
  query,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../Context/UserContext";

const FutureClasses = ({ navigation }) => {
  const [userLessons, setUserLessons] = useState([]);
  const [loading, setLoading] = useState(false);

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

      if (lessondate == today && doc.data().hour < todaytime) return;
      if (lessondate <= today) return;

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
      newLessons.push(lesson);
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

  function askDelete(date, hour) {
    // Are you sure you want to delete this lesson?
    Alert.alert("Are you sure you want to delete?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => deleteLesson(date, hour),
      },
    ]);
  }

  async function deleteLesson(date, time) {
    try {
      // Delete doc
      const lessonsCollection = collection(FIREBASE_DB, "lessons");
      const q = query(
        lessonsCollection,
        where("date", "==", date),
        where("hour", "==", time)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      Alert.alert("Lesson removed");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error deleting lesson: ", error);
    }
  }

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {loading && <ActivityIndicator size="large" color="black" />}
      {!loading && (
        <>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            Future Classes
          </Text>
          {userLessons.length === 0 && <Text>No future classes</Text>}
          {userLessons.length > 0 && (
            <Text style={{ fontSize: 20 }}>
              Total time: {calctotalTime()} minutes
            </Text>
          )}
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
                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        padding: 10,
                        borderRadius: 20,
                      }}
                      onPress={() => askDelete(item.date, item.hour)}
                    >
                      <Text style={{ color: "white", fontSize: 20 }}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          />
          <View style={{ margin: 50 }}></View>
        </>
      )}
    </View>
  );
};

export default FutureClasses;

const styles = StyleSheet.create({});
