import Head from 'next/head'
import styles from  './styles.module.scss'

export default function Post() {
  return (
    <>
      <Head>
        <title>Posts | ybm.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time>March 12 2021</time>
            <strong>Creating a Monorepo with Learna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Provident beatae repellendus earum repellat cupiditate at minus ut eaque quisquam?
              Veniam quae officiis amet voluptatum tenetur ea, soluta at porro. Eius.
            </p>
          </a>
          <a>
            <time>March 12 2021</time>
            <strong>Creating a Monorepo with Learna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Provident beatae repellendus earum repellat cupiditate at minus ut eaque quisquam?
              Veniam quae officiis amet voluptatum tenetur ea, soluta at porro. Eius.
            </p>
          </a>
          <a>
            <time>March 12 2021</time>
            <strong>Creating a Monorepo with Learna & Yarn Workspaces</strong>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Provident beatae repellendus earum repellat cupiditate at minus ut eaque quisquam?
              Veniam quae officiis amet voluptatum tenetur ea, soluta at porro. Eius.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
