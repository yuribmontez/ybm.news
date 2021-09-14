/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'
import { fauna } from '../../services/fauna'
import { stripe } from '../../services/stripe'

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}



export default async (req: NextApiRequest, res: NextApiResponse) => {
  // verificação se é metodo POST (essa rota só ira aceitar post)
  if (req.method === 'POST') {
    const session = await getSession({ req }) // pegando informações do user pelo backend

    const user = await fauna.query<User>(     // pegando o mesmo usuario pelo fauna
      q.Get(
        q.Match(
          q.Index('user-by-email'),
          q.Casefold(session.user.email) // match dos emails
        )
      )
    )

    let customerId = user.data.stripe_customer_id  // id do costumer do stripe

    // caso seja a primeira compra do costumer ou seja, não tem costumer id no stripe
    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({ // criação do costumer no stripe
        email: session.user.email,
        // metadata
      })

      await fauna.query(  // atualizando dados do user no fauna com seu novo costumerId(stripe)
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      customerId = stripeCustomer.id // setando valor de costumerId
    }


    // confirgurando checkout do stripe
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1JYyZkJcyVxjQKQZfYMs4Yzu', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id }) // retorna o id da checkout session
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
