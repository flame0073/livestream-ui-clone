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

  // Gagamitin natin ang useRef para i-store ang player at hindi na kailangang i-recreate palagi
  const playerRef = useRef<any>(null);
  const uiRef = useRef<any>(null);

  // Clean up player kapag nag-switch sa YouTube (kasi mawawala ang <video> DOM)
  useEffect(() => {
    if (channel.type === "youtube") {
      if (uiRef.current) {
        uiRef.current.destroy();
        uiRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }
  }, [channel.type]);

  // Main logic para i-load o i-update ang Shaka Player
  useEffect(() => {
    if (channel.type !== "hls" && channel.type !== "mpd") return;
    setError(null);

    const loadStream = async () => {
      if (!videoRef.current || !videoContainerRef.current) return;

      // Kung walang existing player (first load o galing sa YouTube), gagawa tayo ng bago
      if (!playerRef.current) {
        shaka.polyfill.installAll();
        if (!shaka.Player.isBrowserSupported()) {
          setError("Browser not supported for this video.");
          return;
        }
        playerRef.current = new shaka.Player(videoRef.current);
        uiRef.current = new shaka.ui.Overlay(playerRef.current, videoContainerRef.current, videoRef.current);
        uiRef.current.configure({
          controlPanelElements: ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu']
        });
      }

      // Dahil napanigurado nating may player instance na, i-load na natin yung mismong URL at DRM
      try {
        if (channel.clearKey) {
          playerRef.current.configure({
            drm: { clearKeys: channel.clearKey },
          });
        } else {
          playerRef.current.configure({
            drm: { clearKeys: {} }, // I-reset ang DRM configuration kung walang clearKey
          });
        }
        await playerRef.current.load(channel.url);
      } catch (e: any) {
        // Safe itong balewalain dahil ibig sabihin lang nito ay mabilis naglipat ng channel ang user
        if (e.code !== shaka.util.Error.Code.LOAD_INTERRUPTED) {
          console.error("Error loading video", e);
          setError("Failed to load stream. It might be offline.");
        }
      }
    };

    loadStream();
    
    // Wala nang player.destroy() dito para hindi masira ang player paglipat ng channel!
  }, [channel]);

  // Ito ang totoong cleanup: tatakbo lang kapag isinara mo na ang buong Watch page
  useEffect(() => {
    return () => {
      if (uiRef.current) uiRef.current.destroy();
      if (playerRef.current) playerRef.current.destroy();
    };
  }, []);

  if (channel.type === "youtube") {
    return (
      <div className="relative w-full aspect-video bg-black overflow-hidden sm:rounded-xl">
        <iframe
          src={`${channel.url}${channel.url.includes('?') ? '&' : '?'}autoplay=1&mute=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    );
  }

  return (
    <div ref={videoContainerRef} className="relative w-full aspect-video bg-black overflow-hidden sm:rounded-xl m-0 p-0">
      {error && (
        <div className="absolute inset-0 z-10 flex h-full items-center justify-center text-muted-foreground text-sm p-4 text-center bg-black">
          <p>{error}</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default VideoPlayer;
