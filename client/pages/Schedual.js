import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import SchedualRendering from "../components/SchedualRendering";
import schedualStyles from "../styles/schedualStyles";
import Notification from "../components/Notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Schedual() {
    const [countLoops, setInfiniteLoop] = useState(0);

    const [countLessons, setCountLessons] = useState(0); // номер урока
    const [nextLessonHours, setNextLessonHours] = useState(8); //8
    const [nextLessonMinutes, setNextLessonMinutes] = useState(0); // 0

    async function setNewDataAboutLesson(lessonNumber) {
        let schedual = await AsyncStorage.getItem('Schedual');

        let date = new Date();
        let weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        let day = 1;
        if (date.getDay() === 0) {
            day = 6;
        } else {
            day = date.getDay();
        }

        if (JSON.parse(schedual)[weekDays[day]].length - 1 > lessonNumber) {
            let nextLesson = JSON.parse(schedual)[weekDays[day]][lessonNumber]['lessonName'];
            Notification.schoolSchedualNotification("Следующий урок", nextLesson)

            let lessonHours = JSON.parse(schedual)[weekDays[day]][lessonNumber + 1]['lessonTime'];
            let nextLessonHours = parseInt(lessonHours[lessonHours.length - 5]) * 10 + parseInt(lessonHours[lessonHours.length - 4]);
            setNextLessonHours(nextLessonHours);

            let lessonMinutes = JSON.parse(schedual)[weekDays[day]][lessonNumber + 1]['lessonTime'];
            let nextLessonMinutes = parseInt(lessonMinutes[lessonMinutes.length - 2]) * 10 + parseInt(lessonMinutes[lessonMinutes.length - 1]);
            setNextLessonMinutes(nextLessonMinutes);

            setCountLessons(countLessons + 1);
        } else {
            setNextLessonHours(8);
            setNextLessonMinutes(0);
        }
    }

    React.useEffect(() => {
        setTimeout(() => {

            let todayTime = new Date(); // время в данный момент
            let hours = todayTime.getHours(); // часы
            let minutes = todayTime.getMinutes(); // минуты
            // может надо будет ввести ещё и дату дня

            if ((hours + 3) % 24 === 7 && (minutes === 50 || minutes > 50)) {
                setCountLessons(0);
                setNewDataAboutLesson(countLessons);
            } else if ((hours + 3) % 24 === nextLessonHours && (minutes === nextLessonMinutes || minutes - 1 === nextLessonMinutes)) {
                setNewDataAboutLesson(countLessons);// присваивание переменным nextLesson, nextLessonHours и nextLessonMinutes новый значений из локального хранилища
            } else {
                setInfiniteLoop(countLoops + 1);
            }
        }, 5000); // 120000
    });

    return (
        <View>
            <ScrollView>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Понедельник'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Вторник'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Среда'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Четверг'} />
                </View>
                <View style={schedualStyles.item}>
                    <SchedualRendering weekDayName={'Пятница'} />
                </View>
            </ScrollView>
        </View>
    );
}