import React, { useRef } from "react";

const ProfileImageUploadButton = ({
  setOnFileSelect,
  onFileSelect,
  uploadImage,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setOnFileSelect({
      ...onFileSelect,
      image: file,
    });

    uploadImage(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        s
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept="image/*"
      />
      <button
        onClick={handleClick}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "20px",
          border: "none",
          position: "absolute",
          left: "12.3%",
          top: "40%",
        }}
      >
        <i class="fa-solid fa-plus" />
      </button>
    </div>
  );
};

export default ProfileImageUploadButton;
