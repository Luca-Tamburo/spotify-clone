// Imports

import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "@/lib/spotify";

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        // console.log("REFRESHED TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET,
    theme: {
        colorScheme: "auto", // "auto" | "dark" | "light"
    },
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        async jwt({ token, account, user }) {

            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                }
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                // console.log("EXISTING ACCESS TOKEN IS VALID");
                return token;
            }

            // Access token has expired, so we need to refresh it...
            // console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;
        }
    },
}

export default NextAuth(authOptions)