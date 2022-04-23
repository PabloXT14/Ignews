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


            try {
                // Chamando api de conexão com banco no fauna, e testando para ver se usuário já existe no banco
                await fauna.query(
                    query.If(// Se usuário não existir no banco 
                        query.Not(
                            query.Exists(
                                query.Match(
                                    query.Index('user_by_email'),// 
                                    query.Casefold(user.email)
                                )
                            )
                        ),// Crie um novo usuário no banco
                        query.Create(
                            query.Collection('users'),
                            { data: { email } }
                        ),// Se não apenas busque os dados do usuário existente
                        query.Get(
                            query.Match(
                                query.Index('user_by_email'),
                                query.Casefold(user.email)
                            )
                        )
                    )
                )

                return true
            } catch {// Caso não
                return false
            }
        },
    }
})