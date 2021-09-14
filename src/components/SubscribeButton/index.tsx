import { signIn, useSession } from 'next-auth/client'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession()

  async function handleSubscribe() {
    // if not logged -> logar com github
    if (!session) {
      signIn('github')
      return
    }

    // post na rota subscribe (api/subscribe)
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data // checkout session id

      const stripe = await getStripeJs() //uso do stripe-js -> carrega a public key do stripe

      await stripe.redirectToCheckout({ sessionId }) // redirect para checkout
    } catch (error) {
      alert(error.message)
    }

  }

  return (
    <button type='button' className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}
