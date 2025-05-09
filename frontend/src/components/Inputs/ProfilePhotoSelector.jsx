import React, { useRef, useEffect, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from "react-icons/lu"

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image instanceof File) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className='flex justify-center mb-6'>
      <input
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!previewUrl ? (
        <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative'>
          <LuUser className='text-4xl text-primary' />
          <button
            type='button'
            onClick={onChooseFile}
            className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={previewUrl}
            alt='profile'
            className='w-20 h-20 rounded-full object-cover border shadow'
          />
          <button
            type='button'
            onClick={onChooseFile}
            className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1'
          >
            <LuUpload />
          </button>
          <button
            type='button'
            onClick={handleRemoveImage}
            className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs'
            title="Remove image"
          >
            <LuTrash size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
