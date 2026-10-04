"use client";

import { useCallback, useEffect, useState } from "react";
import Preloader from "@/components/layout/Preloader";
import Hero from "./Hero";

const SESSION_KEY = "sb-intro-seen";

type Phase = "poster" | "live" | "done";

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Owns the one-time entrance.
 *
 * The sheet is server-rendered in its pre-animation state, so the first frame
 * is already correct — no flash of unstyled hero, no late paint. On mount the
 * session is checked: returning visitors go straight in, everyone else sees
 * the full sequence once.
 */
export default function HomeIntro() {
  const [phase, setPhase] = useState<Phase>("poster");

  useEffect(() => {
    setPhase(alreadySeen() ? "done" : "live");
  }, []);

  const onComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable — the sequence simply repeats next load */
    }
    setPhase("done");
  }, []);

  return (
    <>
      {phase !== "done" && <Preloader mode={phase === "live" ? "live" : "poster"} onComplete={onComplete} />}
      <Hero ready={phase === "done"} />
    </>
  );
}