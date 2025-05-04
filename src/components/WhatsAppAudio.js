

// src/components/WhatsAppAudio.js
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause } from "react-icons/fa";
import "./WhatsAppAudio.css";

const WhatsAppAudio = ({ src }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#075e54",
      cursorWidth: 0,
      height: 40,
      barWidth: 2,
      barRadius: 3,
      responsive: true,
    });

    wavesurfer.current.load(src);

    wavesurfer.current.on("finish", () => {
      setPlaying(false);
    });
    return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
      
  }, [src]);

  const togglePlay = () => {
    if (!wavesurfer.current) return;
    wavesurfer.current.playPause();
    setPlaying(!playing);
  };

  return (
    <div className="whatsapp-audio">
      <button className="play-btn" onClick={togglePlay}>
        {playing ? <FaPause /> : <FaPlay />}
      </button>
      <div ref={waveformRef} className="waveform" />
    </div>
  );
};

export default WhatsAppAudio;
