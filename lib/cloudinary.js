export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");
  formData.append("folder", "sanity-images");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};

export const getCloudinaryUrl = (publicId, transformations = {}) => {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = transformations;

  let transform = `q_${quality},f_${format}`;
  if (width) transform += `,w_${width}`;
  if (height) transform += `,h_${height}`;
  if (crop) transform += `,c_${crop}`;

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${publicId}`;
};
