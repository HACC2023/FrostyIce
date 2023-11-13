import { createUploadthing } from "uploadthing/next-legacy";

const f = createUploadthing();

const auth = (req, res) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
};
