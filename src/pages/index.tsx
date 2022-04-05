import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

/* ===== TIPAGENS ===== */
interface HomeProps {
  product: {
    priceId: string;
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Início | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} mouth</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girld coding" />
      </main>
    </>
  )
}

// Função para realizar SSG no lado do servidor
export const getStaticProps: GetStaticProps = async () => {

  // fazendo requisição de único preço do produto
  const price = await stripe.prices.retrieve('price_1KkZpmIyxqvrQyPPQX37CFhm', {
    expand: ['product']// enviar todas as informações do produto
  });

  //salvando dados do produto
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)//preço vem em centavos 
  }

  return {
    props: {// tudo dentro deste <props> é enviada para o <props> da página
      product
    }
  }
}