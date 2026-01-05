export function getMockDelay(): number {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_MOCK_DELAY) {
    const delay = Number(import.meta.env.VITE_MOCK_DELAY);

    if (!isNaN(delay)) {
      return delay;
    }
  }

  return 500;
}

export function mockDelay(customDelay?: number): Promise<void> {
  const delay = customDelay ?? getMockDelay();
  return new Promise((resolve) => setTimeout(resolve, delay));
}
