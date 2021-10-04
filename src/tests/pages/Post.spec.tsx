import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'fake-post-slug',
  title: 'Fake Post',
  content: '<p>Fake post content</p>',
  updatedAt: '04-01/2021'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('Fake Post')).toBeInTheDocument()
    expect(screen.getByText('Fake post content')).toBeInTheDocument()
  })

  // getServerSideProps

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: 'fake-post-slug' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)

    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'Fake Post' }
          ],
          content: [
            { type: 'paragraph', text: 'Fake post content' }
          ],
        },
        last_publication_date: '04-01/2021',
      })
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'fake-post-slug' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post-slug',
            title: 'Fake Post',
            content: '<p>Fake post content</p>',
            updatedAt: 'April 01, 2021'
          }
        }
      })
    )
  })
})
