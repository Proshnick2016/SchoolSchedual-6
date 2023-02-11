import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { postHttp, parseSchoolWeekPage, formLessonsInfo } from '../components/logInData';
import homePageStyles from "../styles/homePageStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage({ navigation }) {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const logInAndGetSchedual = async () => {
        const optionsToGetElement =
        {
            optionLessonNumber: '.dnevnik-lesson__number', // параметр для номера урока
            optionLessonName: '.js-rt_licey-dnevnik-subject', // параметр для названия урока
            optionLessonTime: '.dnevnik-lesson__time' // параметр для времени урока
        };

        // HTTP POST ЗАПРОС на сайт школы, для получения 'cookie'
        const cookieForLogIn = await postHttp('https://edu.gounn.ru/ajaxauthorize', {
            'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundaryWG83INxnwv2VLIZR',
            username: login,
            password: password
        });

        // HTTP GET ЗАПРОС для созадния массива из информации об уроках
        const processedPage = await parseSchoolWeekPage('https://edu.gounn.ru/journal-app/week.0', cookieForLogIn); // url для ЭТОЙ НЕДЕЛИ + полученные 'cookie'

        // получение школьного расписания
        const recievedSchoolSchedual = formLessonsInfo(processedPage, optionsToGetElement);
        try {
            // в локальную базу добавляем: логин, пароль, наше расписание
            await AsyncStorage.multiSet([['login', login], ['password', password], ['Schedual', JSON.stringify(recievedSchoolSchedual)]])

            navigation.navigate('Schedual')
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <View style={homePageStyles.container}>

            <View style={homePageStyles.inputView}>
                <TextInput
                    style={homePageStyles.TextInput}
                    placeholder="Логин "
                    placeholderTextColor="#003f5c"
                    onChangeText={(login) => setLogin(login)}
                />
            </View>

            <View style={homePageStyles.inputView}>
                <TextInput
                    style={homePageStyles.TextInput}
                    placeholder="Пароль"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity style={homePageStyles.loginBtn} onPress={logInAndGetSchedual}>
                <Text style={homePageStyles.loginText}>LOGIN</Text>
            </TouchableOpacity>

        </View>
    );
}
