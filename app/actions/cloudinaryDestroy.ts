const cloudinary = require("cloudinary").v2;

export default function cloudinaryDestroy(publicIds: string[]) {
  publicIds.forEach((publicId) => {
    cloudinary.uploader.destroy(publicId, {});
  });
}
