import React from "react";
import { Text, FlatList, SafeAreaView } from "react-native";
import schedualStyles from "../styles/schedualStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SchedualRendering({ weekDayName }) {
    const [weekDayArray, setWeekDayArray] = React.useState();
    const [geted, setGeted] = React.useState(false)

    React.useEffect(() => {
        async function getAsyncStorageData() {
            const schedualFromAsyncStorage = await AsyncStorage.getItem('Schedual');
            setWeekDayArray(JSON.parse(schedualFromAsyncStorage)[weekDayName]);
            setGeted(true)
        }
        if (geted === false) {
            getAsyncStorageData();
        }
    });

    return (
        <SafeAreaView>
            <Text style={schedualStyles.weekDayName}>{weekDayName}</Text>
            <FlatList data={weekDayArray} renderItem={({ item }) =>
                <Text> {item.lessonNumber} {item.lessonName} {item.lessonTime}</Text>
            }
            />
        </SafeAreaView>
    );
}
