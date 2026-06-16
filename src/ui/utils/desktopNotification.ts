const ICON_URL = "/favicon-32.png";

export const isDesktopNotificationSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

export const getNotificationPermission = (): NotificationPermission =>
  isDesktopNotificationSupported() ? Notification.permission : "denied";

export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!isDesktopNotificationSupported()) return "denied";
    try {
      return await Notification.requestPermission();
    } catch {
      return "denied";
    }
  };

/**
 * Muestra una notificación del sistema operativo. Sirve para avisar al usuario
 * cuando la pestaña del dashboard no está enfocada (caso que el `<audio>`
 * in-app no puede cubrir por la política del navegador).
 */
export const showDesktopNotification = (
  title: string,
  body: string,
  tag?: string,
) => {
  if (
    !isDesktopNotificationSupported() ||
    Notification.permission !== "granted"
  ) {
    return;
  }
  try {
    const notification = new Notification(title, {
      body,
      icon: ICON_URL,
      // Tag único por pedido para que pedidos simultáneos de distintas mesas
      // no se reemplacen entre sí en el centro de notificaciones del SO.
      tag,
      // El sonido lo maneja el audio in-app (única fuente); evitamos el doble
      // sonido cuando el SO también reproduce el suyo.
      silent: true,
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error("Error showing desktop notification:", error);
  }
};
