import { useCallback, useState } from "react";
import {
  getNotificationPermission,
  isDesktopNotificationSupported,
  requestNotificationPermission,
} from "../utils/desktopNotification";

export const useNotificationPermission = () => {
  const supported = isDesktopNotificationSupported();
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    getNotificationPermission(),
  );

  const request = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  return { supported, permission, request };
};
