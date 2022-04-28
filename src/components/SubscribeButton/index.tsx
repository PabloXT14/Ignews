import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
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

            const { sessionId } = response.data;
        } catch (error) {
            console.log(error)
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