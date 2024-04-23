import * as Notifications from 'expo-notifications';

export default async function scheduleNotification(title, body, data) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data
        },
        trigger: null,
    });
}