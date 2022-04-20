import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { fauna } from '../../../services/fauna';
import { query } from 'faunadb';

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
            const { email } = user;

            // Testando para ver se conexão com o banco deu certo
            try {// Caso sim
                // chamando api de conexão com banco no fauna
                await fauna.query(
                    query.Create(// criar dado no banco
                        query.Collection('users'),// Collection de inserção
                        { data: { email } }// valor a ser inserido
                    )
                )

                return true
            } catch {// Caso não
                return false
            }
        },
    }
})