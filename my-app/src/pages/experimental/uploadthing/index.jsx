import { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadFiles } from "@/utils/uploadthing";

const ImageUploading = () => {
  const [files, setFiles] = useState([]);

  const uploadImages = async () => {
    try {
      if (files.length > 0) {
        const fileRes = await uploadFiles({
          files,
          endpoint: "imageUploader",
        });

        // console.log("fileRes", fileRes);
        // for (let uploadedFile of fileRes) {
        //   const res = await fetch("/api/mongo/images/upload-image", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       url: uploadedFile.url,
        //     }),
        //   });
        // }
      }
    } catch (error) {
      console.error("ERR:", error);
    }
  };

  return (
    <div className="p-5">
      <Dropzone
        onDrop={(acceptedFiles) => {
          console.log(acceptedFiles);
          setFiles(acceptedFiles);
        }}
        accept={{ "image/*": [".png", ".jpg"] }}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="flex justify-center">
            <div
              {...getRootProps()}
              className="h-32 w-full flex justify-center items-center border-dashed border-accent-content border-2 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p>Drag &rsquo;n&rsquo; drop or click to upload image</p>
            </div>
          </section>
        )}
      </Dropzone>
      {files.map((file, index) => (
        <img key={index} src={URL.createObjectURL(file)} alt="uploaded" />
      ))}
      <button onClick={uploadImages} className="btn btn-primary">Upload Images</button>
    </div>
  );
};

export default ImageUploading;
