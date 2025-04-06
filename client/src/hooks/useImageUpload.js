import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../utils/firebase";

const useImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageEdited, setImageEdited] = useState(false);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    try {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(2));
        },
        (error) => {
          console.error("Error uploading image:", error.message);
          message.error("Could not upload image (File must be less than 2MB)");
          setUploadProgress(0);
          setImageFile(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setUploadProgress(100);
          setImageFile(null);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error.message);
      message.error(error.message);
      setUploadProgress(0);
      setImageFile(null);
    }
  };

  return {
    imageFile,
    setImageFile,
    uploadProgress,
    setUploadProgress,
    imageFileUrl,
    imageEdited,
    setImageEdited,
    uploadImage,
  };
};

export default useImageUpload;
