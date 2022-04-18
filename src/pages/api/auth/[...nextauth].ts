import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { signIn } from 'next-auth/react';


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user'
                }
            }
        })
    ],
    callbacks: {
        // Rotarnar dados do usuários logado
        async signIn({ user, account, profile }) {
            console.log(user);
            return true
        }
    }
})