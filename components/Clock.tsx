"use client";

import { useEffect, useState } from "react";

function getDundeeTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
    .format(new Date())
    .replace(" ", "")
    .toUpperCase();
}

export function Clock() {
  const [time, setTime] = useState(getDundeeTime);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getDundeeTime()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}
