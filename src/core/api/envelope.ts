/**
 * El backend responde la mayoría de los endpoints envueltos en
 * `{ success, message, data }`, pero algunos (p. ej. /public/plans) devuelven
 * el payload directo. Estos helpers centralizan ese manejo para que los repos
 * no lo resuelvan ad-hoc.
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// Para respuestas siempre envueltas.
export const unwrap = <T>(response: ApiEnvelope<T>): T => response.data;

// Para respuestas que pueden venir envueltas o directas.
export const unwrapMaybe = <T>(response: T | ApiEnvelope<T>): T =>
  response && typeof response === "object" && "data" in response
    ? (response as ApiEnvelope<T>).data
    : (response as T);
