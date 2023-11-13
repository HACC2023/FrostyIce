import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import Organization from "@/models/organization";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "enter email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "enter password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectDB();
          const user = await User.findOne({ email: email });
          const userOrganization = await Organization.findById(user.orgId);
          const authorizedUser = { ...user._doc, orgName: userOrganization.name };

          if (!user || !userOrganization) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return authorizedUser;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
        token.role = user.role;
        token.orgId = user.orgId;
        token.orgName = user.orgName;
      }
      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) {
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.orgId = token.orgId;
        session.user.orgName = token.orgName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/credentials-signin",
    error: "/auth/signin",
    // error: "/auth/error",
    // Error code passed in query string as ?error=
  },
};
