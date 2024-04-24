import * as Notifications from 'expo-notifications';

export default async function scheduleNotification(title, body, data) {
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data
        },
        trigger: null,
    });
    if (identifier) {
        return identifier
    }
    return;
}