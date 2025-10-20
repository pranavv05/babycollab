import React from "react";
import Image from "next/image";
import CuteRobotIcon from "@/components/icons/cute-robot";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-4">
      <div className="w-1/4 aspect-square grayscale opacity-50">
        <Image
          src="/assets/bot_greenprint.gif"
          alt="Page Not Found"
          width={1000}
          height={1000}
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="size-full object-contain"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <CuteRobotIcon className="size-8" />
          <h1 className="text-2xl font-bold uppercase text-muted-foreground">
            Not Found
          </h1>
        </div>
        <p className="text-sm max-w-sm text-center text-muted-foreground text-balance">
          The page you're looking for doesn't exist or is under construction.
        </p>
      </div>
    </div>
  );
}