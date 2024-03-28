import { create } from "@/app/action";
import authService from "@/services/authService";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secureCookie: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password, isAdministrativeRole } = credentials;
        try {
          const response = await authService.login(
            email,
            password,
            isAdministrativeRole
          );

          if (!response.user) {
            throw new Error(response.message);
          }
          const user = {
            email: response.user.email,
            name: `${response.user.fullName}`,
            image: response.user.profile?.photo?.url,
            ...response.user,
            id: response.user.id,
            ...response,
          };
          await create(response.access_token);
          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          ...token,
        },
      };
    },
    jwt: async ({ token, user, account, trigger, session }) => {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      try {
        if (user) {
          if (account.provider === "google") {
            const res = await authService.oAuthLogin({
              provider: "google",
              token: account.id_token,
            });
            await create(res.access_token);
          }
          return {
            ...token,
            id: user.id,
            ...user,
          };
        }
        return token;
      } catch (error) {
        return null;
      }
    },
    // async signIn(user, account) {
    //   if (user) {
    //     if (account.provider === "google") {
    //       const res = await authService.oAuthLogin({
    //         provider: "google",
    //         token: account.id_token,
    //       });
    //       await create(res.access_token);
    //     }
    //   }
    //   return true;
    // },
  },
  secret: process.env.NEXTAUTH_URL,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
