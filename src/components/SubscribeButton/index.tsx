import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

/* ===== TIPAGENS ===== */
interface SubscribeButtonProps {
    priceId: string;
}


export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();

    async function handleSubscribe() {
        // Verificando se usuário esta logado
        if (!session) {
            signIn('github');// redirecionando para sessão de signIn com github
            return;
        }


        // Criação da checkout session
        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;// pegando id de sessão do usuário no stripe

            const stripe = await getStripeJs();// objeto de acesso a sessão de checkout

            await stripe.redirectToCheckout({ sessionId })// redirecionando para sessão de checkout
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}