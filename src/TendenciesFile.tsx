import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface TendenciesFileProps {
  pdfUrl: string;
}

const TendenciesFile: React.FC<TendenciesFileProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handlePrint = () => {
    window.open(pdfUrl, '_blank')?.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = '../files/Al-Wajeez-istibian.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages));
  };

  const changeScale = (newScale: number) => {
    setScale(Math.min(Math.max(0.5, newScale), 2.0));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Controls Bar */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changeScale(scale - 0.1)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Zoom out"
            >
              -
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => changeScale(scale + 0.1)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Print document"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Download document"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 overflow-auto">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          }
          error={
            <div className="flex justify-center items-center h-96 text-red-500">
              Failed to load PDF file. Please try again later.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="mx-auto"
          />
        </Document>
      </div>
    </div>
  );
};

export default TendenciesFile;
