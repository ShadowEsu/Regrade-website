import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

const maxAutoLoops = 3;

type Props = {
  ready: boolean;
};

export function LaunchVideo({ ready }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopCountRef = useRef(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;

    loopCountRef.current = 0;
    setFinished(false);
    setPlaying(true);
    setMuted(true);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.currentTime = 0;

    const tryPlay = () => {
      video.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, [ready]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
      return;
    }
    if (finished) {
      loopCountRef.current = 0;
      video.currentTime = 0;
      setFinished(false);
    }
    video.play().then(() => setPlaying(true)).catch(() => {});
  }

  function handleEnded() {
    const video = videoRef.current;
    if (!video) return;
    loopCountRef.current += 1;
    if (loopCountRef.current < maxAutoLoops) {
      video.currentTime = 0;
      video.play().catch(() => {});
      return;
    }
    setPlaying(false);
    setFinished(true);
  }

  return (
    <section
      id="top"
      className="relative h-[100dvh] min-h-[520px] w-full overflow-hidden bg-[#0a0f2e]"
    >
      <video
        ref={videoRef}
        src="/regrade-logo-reveal.mp4"
        muted={muted}
        playsInline
        preload="auto"
        autoPlay
        onEnded={handleEnded}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Regrade launch animation with Mr Whale"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f2e]/75 via-transparent to-[#0a0f2e]/25"
        aria-hidden
      />
      <div className="absolute left-1/2 top-[calc(var(--site-header)+1.25rem)] -translate-x-1/2">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-blue px-4 py-2 font-ui text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Launching very soon
        </span>
      </div>
      <div className="absolute bottom-6 right-5 z-10 flex items-center gap-2.5 sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause video" : "Play video"}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue text-white transition-transform duration-300 hover:scale-110"
        >
          {playing ? (
            <Pause className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Play className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue text-white transition-transform duration-300 hover:scale-110"
        >
          {muted ? (
            <VolumeX className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Volume2 className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </div>
    </section>
  );
}
