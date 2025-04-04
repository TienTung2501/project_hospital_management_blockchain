// components/PDFViewer.tsx
import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

type Props = {
  fileUrl: string;
};

const PDFViewer = ({ fileUrl }: Props) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (viewerRef.current) {
        // Tải PDF từ URL
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;

        // Lấy thông tin về số lượng trang
        const numPages = pdf.numPages;

        // Hiển thị số lượng trang
        console.log(`Number of pages: ${numPages}`);
      }
    };

    loadPDF();
  }, [fileUrl]);

  return <div ref={viewerRef}></div>;
};

export default PDFViewer;
