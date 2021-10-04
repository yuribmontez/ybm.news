import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'fake-post-slug',
  title: 'Fake Post',
  content: '<p>Fake post content</p>',
  updatedAt: '04-01/2021'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionsMocked = mocked(useSession)

    useSessionsMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('Fake Post')).toBeInTheDocument()
    expect(screen.getByText('Fake post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionsMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionsMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/fake-post-slug')
  })

  // getStaticProps

  it('loads initial data', async () => {
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

    const response = await getStaticProps({ params: { slug: 'fake-post-slug' } })

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
