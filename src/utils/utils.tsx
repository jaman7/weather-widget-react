export const sunsetSunrise = (utc: number): string => new Date(utc * 1000).toLocaleTimeString().slice(0, 5);
