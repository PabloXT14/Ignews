import { useState } from 'react';
import styles from './styles.module.scss';


export function Header() {
    const [active, setActive] = useState('Home');

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <a href="#"
                        onClick={() => setActive('Home')}
                        className={active == 'Home' ? styles.active : ''}
                    >
                        Home
                    </a>
                    <a href="#"
                        onClick={() => setActive('Posts')}
                        className={active == 'Posts' ? styles.active : ''}
                    >
                        Posts
                    </a>
                </nav>
            </div>
        </header>
    );
}