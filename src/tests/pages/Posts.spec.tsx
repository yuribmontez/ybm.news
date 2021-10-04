import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'fake-post-slug',
    title: 'Fake Post',
    excerpt: 'Fake post excerpt',
    updatedAt: 'Fake date'
  }
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('Fake Post')).toBeInTheDocument()
  })

  // getStaticProps
  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-fake-post',
            data: {
              title: [
                { type: 'heading', text: 'My fake post' }
              ],
              content: [
                { type: 'paragraph', text: 'Fake post excerpt' }
              ],
            },
            last_publication_date: '04-01/2021',
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-fake-post',
            title: 'My fake post',
            excerpt: 'Fake post excerpt',
            updatedAt: 'April 01, 2021'
          }]
        }
      })
    )
  })
})
