import * as Notifications from 'expo-notifications';

export default async function scheduleNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {},
        },
        trigger: { seconds: 2 },
    });
}