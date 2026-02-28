import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player";
import ReactPlayer from "react-player";

interface Channel {
  name: string;
  logo: string;
  category: string;
  type: string;
  url: string;
  subscribers: string;
  views: string;
  clearKey?: { [key: string]: string };
}

interface VideoPlayerProps {
  channel: Channel;
}

const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shakaPlayerRef = useRef<shaka.Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (channel.type === "youtube") return;

    let player: shaka.Player | null = null;

    const initShaka = async () => {
      try {
        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
          setError("Browser not supported for this stream.");
          return;
        }

        if (videoRef.current) {
          player = new shaka.Player(videoRef.current);
          shakaPlayerRef.current = player;

          player.addEventListener("error", (event: any) => {
            console.error("Shaka error:", event.detail);
            setError("Playback error. Try another channel.");
          });

          // Configure DRM clearKeys if present
          if (channel.clearKey && channel.type === "mpd") {
            player.configure({
              drm: {
                clearKeys: channel.clearKey,
              },
            });
          }

          await player.load(channel.url);
        }
      } catch (err) {
        console.error("Failed to load stream:", err);
        setError("Failed to load stream.");
      }
    };

    initShaka();

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [channel]);

  if (channel.type === "youtube") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <ReactPlayer
          src={`https://www.youtube.com/watch?v=${channel.url}`}
          playing
          controls
          width="100%"
          height="100%"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      {error ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>{error}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          controls
          className="h-full w-full"
          style={{ backgroundColor: "black" }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
