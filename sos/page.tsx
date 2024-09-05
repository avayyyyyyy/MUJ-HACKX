"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { saveSOS } from "../actions/saveSOS";

const PeerPage = () => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);

  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");
  const [idToCall, setIdToCall] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const generateRandomString = () => Math.random().toString(36).substring(2);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  async function saveSOSId() {
    const id = generateRandomString();
    setMyUniqueId(id);
    // Wait for location to be set before saving
    if (latitude !== null && longitude !== null) {
      await saveSOS({ id, latitude, longitude });
    }
  }

  const handleCall = () => {
    if (!idToCall || !peerInstance) return;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const call = peerInstance.call(idToCall, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      });
  };

  useEffect(() => {
    if (myUniqueId) {
      const peer = new Peer(myUniqueId, {
        host: "localhost",
        port: 9000,
        path: "/myapp",
      });

      setPeerInstance(peer);

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          peer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream;
              }
            });
          });
        });

      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [myUniqueId]);

  useEffect(() => {
    getLocation(); // Get user's location when component mounts
    saveSOSId(); // Call saveSOSId when location is set
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <p>Your ID: {myUniqueId}</p>
      <video className="w-72" playsInline ref={myVideoRef} autoPlay />
      <input
        className="text-black"
        placeholder="ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <button onClick={handleCall}>Call</button>
      <video className="w-72" playsInline ref={callingVideoRef} autoPlay />
    </div>
  );
};

export default PeerPage;
