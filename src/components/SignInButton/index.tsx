import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

// signIn: função do Next para realizar autenticação de login
// signOut: função do Next para realizar log out

import styles from './styles.module.scss';

export function SignInButton() {
    // useSession é um hook do Next Auth que irá retornar dados do usuário caso ele esteja logado
    const { data: session } = useSession();

    return session ? (
        <button
            type="button"
            className={styles.signInButton}
            onClick={() => signOut()}
        >
            <FaGithub color="#04D361" />
            {session.user.name}
            <FiX color="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <button
            type="button"
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color="var(--yellow-500)" />
            Sign in with Github
        </button>
    )

}