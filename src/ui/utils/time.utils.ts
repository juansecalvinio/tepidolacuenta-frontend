export class TimeUtils {
  static formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static getTimeAgo(dateString: string): string {
    const now = new Date();
    const then = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / 60000);

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes === 1) return "Hace 1 minuto";
    return `Hace ${diffInMinutes} minutos`;
  }
}
