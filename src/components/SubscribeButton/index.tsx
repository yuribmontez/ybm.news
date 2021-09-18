import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    // if not logged -> sing in with github
    if (!session) {
      signIn('github')
      return
    }

    // if already has activeSubscription -> route to posts
    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    // no activeSubscription -> POST to subscribe api
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data // checkout session id (stripe)

      const stripe = await getStripeJs() //stripejs -> get stripe public key

      await stripe.redirectToCheckout({ sessionId }) // redirect to checkout
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
