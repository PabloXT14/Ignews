import { version } from '../../package.json';
import Stripe from 'stripe';

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY,// chave de acesso
    {
        apiVersion: '2020-08-27',// versão da API
        appInfo: {// informações para metadados
            name: 'Ignews',// nome da nossa aplicação
            version// versão da nossa aplicação
        }
    }
)