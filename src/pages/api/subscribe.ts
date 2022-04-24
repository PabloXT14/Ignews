import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../services/stripe';

export default async (request: NextApiRequest, response: NextApiResponse) => {
    // Verificando se requisição é do tipo POST
    if (request.method === 'POST') {
        // Criando sessão do stripe
        const checkoutSession = await stripe.checkout.sessions.create({
            // customer: {// quem está comprando nosso produto

            // },
            payment_method_types: ['card'],// métodos de pagamento
            billing_address_collection: 'required',//obrigar ou não cliente a colocar seu endereço
            line_items: [
                { price: 'price_1KkZpmIyxqvrQyPPQX37CFhm', quantity: 1 }// id do produto e quantidade
            ],
            mode: 'subscription',//modo de pagamento(subscription: desconta todo mes do cartão do cliente)
            allow_promotion_codes: true,//permitir cupom de desconto (config um código no stripe)
            success_url: process.env.STRIPE_SUCCESS_URL,// page de redirecionamento em caso de sucesso
            cancel_url: process.env.STRIPE_CANCEL_URL// pagina de redirecionamento em caso de cancelamento
        });

    } else {
        response.setHeader('Allow', 'POST');
        response.status(405).end('Method not allowed');
    }
}