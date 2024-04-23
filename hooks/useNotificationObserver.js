import { useEffect } from 'react';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function useNotificationObserver() {
    useEffect(() => {
        let isMounted = true;

        function redirect(notification) {
            const url = notification.request.content.data?.url;
            if (url) {
                router.push(url);
            }
        }

        Notifications.getLastNotificationResponseAsync()
            .then(response => {
                if (!isMounted || !response?.notification) {
                    return;
                }
                redirect(response?.notification);
            });

        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            redirect(response.notification);
        });

        return () => {
            isMounted = false;
            subscription.remove();
        };
    }, []);
}