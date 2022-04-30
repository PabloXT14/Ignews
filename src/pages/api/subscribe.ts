import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { fauna } from '../../services/fauna';
import { query } from 'faunadb';
import { stripe } from '../../services/stripe';


type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Verificando se requisição é do tipo POST
    if (req.method === 'POST') {
        // Pegando dados do usuário logado através do cookie do browser
        const session = await getSession({ req });


        // Buscando dados do usuário logado no fauna
        const user = await fauna.query<User>(
            query.Get(
                query.Match(// buscando email do usuário caso tenha no banco
                    query.Index('user_by_email'),
                    query.Casefold(session.user.email)
                )
            )
        )

        // Checando se usuário já tem id de cadastro no Stripe
        let customerId = user.data.stripe_customer_id;

        // Caso não tenha
        if (!customerId) {
            //Cadastrando/Criando usuário como customer no stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
            })

            //Salvando Id do usuário do stripe no Fauna
            await fauna.query(
                query.Update(
                    query.Ref(query.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            // Reatribuindo id de cadastro no stripe
            customerId = stripeCustomer.id
        }



        // Criando sessão de checkout do stripe
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            // quem está comprando nosso produto
            customer: customerId,// id do usuário cadastrado no stripe
            payment_method_types: ['card'],// métodos de pagamento
            billing_address_collection: 'required',//obrigar ou não cliente a colocar seu endereço
            line_items: [
                { price: 'price_1KkZpmIyxqvrQyPPQX37CFhm', quantity: 1 }// id do preço do produto e quantidade
            ],
            mode: 'subscription',//modo de pagamento(subscription: desconta todo mes do cartão do cliente)
            allow_promotion_codes: true,//permitir cupom de desconto (config um código no stripe)
            success_url: process.env.STRIPE_SUCCESS_URL,// page de redirecionamento em caso de sucesso
            cancel_url: process.env.STRIPE_CANCEL_URL// pagina de redirecionamento em caso de cancelamento
        });

        // Retorno em caso de sucesso da compra
        return res.status(200).json({ sessionId: stripeCheckoutSession.id })// retornando id da sessão

    } else {// informando que método de requisição é inválido
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
}