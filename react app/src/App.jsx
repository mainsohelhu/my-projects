import React, { useState } from 'react';
import DropZone from './DropZone';
import WindowsFrame from './WindowsFrame';

function App() {
  const [image, setImage] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-10 font-sans">
      
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 tracking-tight">
        SHOWCASE<span className="text-blue-500">.DEV</span>
      </h1>
      
      {/* Upload Section */}
      <div className="w-full max-w-2xl mb-12">
        <DropZone onImageUpload={setImage} />
      </div>

      {/* Result Section */}
      {image && (
        <div className="w-full animate-fade-in-up">
           <WindowsFrame title="Preview_Final.png">
             <img src={image} alt="Preview" className="w-full h-auto object-cover block" />
           </WindowsFrame>
        </div>
      )}

    </div>
  );
}

export default App;