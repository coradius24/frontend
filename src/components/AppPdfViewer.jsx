'use client'
// import * as PDFJS from "pdfjs-dist"
// PDFJS.GlobalWorkerOptions.workerSrc =
//   "https://az-cdn.selise.biz/selisecdn/cdn/keeron/pdf.worker.min.js"

// import {PDFtoIMG} from 'react-pdf-to-image';

const AppPdfViewer = ({ pdfUrl }) => {
    return <>
    {/* <object id="fgh" data={pdfUrl}  width="400" height="400"></object> */}

    <embed src={pdfUrl} className="embedSet" type="application/pdf" width="100%" height="565px"/>

    </>

//   return (
//     <div>
//         <PDFtoIMG file={pdfUrl}>
//             {({pages}) => {
//                 if (!pages.length) return 'Loading...';
//                 return pages.map((page, index)=>
//                     <img key={index} src={page}/>
//                 );
//             }}
//         </PDFtoIMG>
//     </div>

//   );
};

export default AppPdfViewer;
