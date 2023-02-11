import PushNotification from "react-native-push-notification";

class Notification {
    constructor() {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification);
            },
            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios'
        });
        PushNotification.createChannel({
            channelId: "reminders",
            channelName: "Lessons"
        },
            () => { }
        );
    }
    schoolSchedualNotification(title, message) {
        PushNotification.localNotification({
            channelId: "reminders",
            title,
            message
        })
    }
}

export default new Notification();