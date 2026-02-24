import React, { useState } from 'react';

const DropZone = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  };

  return (
    <div 
      className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-400 bg-[#1a1a1a]"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        id="file-upload"
        accept="image/*"
        onChange={handleChange} 
      />
      <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
        <span className="text-gray-300 font-mono text-sm">
          {dragActive ? "[ DROP FILE HERE ]" : ">> INITIATE UPLOAD <<"}
        </span>
        <span className="text-gray-600 text-xs mt-2">Supports JPG, PNG</span>
      </label>
    </div>
  );
};

export default DropZone;