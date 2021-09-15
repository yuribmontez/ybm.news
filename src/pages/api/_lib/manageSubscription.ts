import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna'
import { stripe } from '../../../services/stripe'

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
  // Buscar usuario no banco do FaunaDB com o stripe-customer-id {customerId}
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user-by-stripe-customer-id'),
          customerId
        )
      )
    )
  )

  // Pegando dados da subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Dados que quero salvar
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  // Se estiver criando nova subscription
  // Salvar os dados da subscription no FaunaDB
  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  // Se não, atualizar dados da subscription
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('subscription-by-id'),
              subscriptionId,
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }

}
