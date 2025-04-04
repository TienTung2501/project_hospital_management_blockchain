"use client";

import React from "react";
import { Modal } from "@mui/material";
import Image from "next/image";
import cardano from "~/assets/images/icon/cardano2.png";

interface LoadingProps {
  title?: string;
  isOpen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ title = "Loading...", isOpen = true }) => {
  return (
    <Modal
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
    >
      <div className="overflow-hidden outline-none rounded-full p-4 px-10" id="loadingContent">
        <div className="animate-spin h-36 w-36">
          <Image src={cardano} alt="Loading icon" width={144} height={144} className="object-contain" />
        </div>
        <div className="text-center text-white font-bold text-2xl mt-5 animate-pulse">{title}</div>
      </div>
    </Modal>
  );
};

export default Loading;
