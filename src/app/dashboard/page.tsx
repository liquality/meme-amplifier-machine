"use client";

import ApiService from "@/utils/api-service";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    ApiService.fetchFramesByCurrentUser().then((data: any[]) => {
      if (data.length > 0) {
        setFrames(data);
        setLoading(false);
      } else {
        router.push("/create-frame");
      }
    });
  }, []);
  return (
    <div className="flex flex-col w-full md:w-4/5">
      {loading ? (
        <div className="flex text-center justify-center text-lg">
          Loading your Memes ...
        </div>
      ) : (
        <div className="flex flex-col mt-8 p-8 bg-white bg-opacity-70 rounded-[10px] text-black">
          <div
            className="flex p-4 text-black"
          >
            <div className="flex mt-12 mb-12">
            {frames.map((frame) => (
              <div
                onClick={() => router.push(`/share/${frame.id}`)}
                className=""
                key={frame.id}
              >
                frame name: {frame.name} ID: {frame.id}
              </div>
            ))}
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <a
              href="/create-frame"
              className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
            >
              Create another Meme NFT
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
