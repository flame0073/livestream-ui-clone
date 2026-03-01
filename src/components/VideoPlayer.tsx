import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "shaka-player/dist/controls.css";

interface VideoPlayerProps {
  channel: any;
}

const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (channel.type !== "m3u8" && channel.type !== "mpd") return;

    const initPlayer = async () => {
      if (!videoRef.current || !videoContainerRef.current) return;

      const player = new shaka.Player(videoRef.current);
      const ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);
      
      const config = {
         controlPanelElements: ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu']
      };
      ui.configure(config);

      if (channel.drm) {
        player.configure({
          drm: {
            clearKeys: {
              [channel.drm.keyId]: channel.drm.key,
            },
          },
        });
      }

      try {
        await player.load(channel.url);
      } catch (e: any) {
        console.error("Error loading video", e);
        setError("Failed to load stream. It might be offline.");
      }
    };

    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      initPlayer();
    } else {
      setError("Browser not supported for this video.");
    }

    return () => {
      // Cleanup
    };
  }, [channel]);

  if (channel.type === "youtube") {
    return (
      <div className="relative w-full aspect-video bg-black overflow-hidden sm:rounded-xl">
        <ReactPlayer
          src={channel.url}
          playing
          controls
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    );
  }

  return (
    <div ref={videoContainerRef} className="relative w-full aspect-video bg-black overflow-hidden sm:rounded-xl m-0 p-0">
      {error ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>{error}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
