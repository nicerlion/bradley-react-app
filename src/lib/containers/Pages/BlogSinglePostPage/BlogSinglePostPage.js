// @flow
import React, { Component } from 'react'
import type { Match } from 'react-router-dom'
import type { BCorpPost } from '../../../types/post_types'
import CPTApiClient from '../../../../api/cpt_client'
import Error404 from '../../../components/Error/Error404/Error404'
import Loading from '../../../components/Loading/Loading'
import BlogPageTemplate from '../../Templates/DerivedTemplates/BlogPageTemplate/BlogPageTemplate'
import Divider from '../../../components/Divider/Divider'
import PostComments from '../../PostComments/PostComments'
import Post from './Post/Post'
import BCorpHead from '../../../components/BCorpHead/BCorpHead'
import style from './BlogSinglePostPage.scss'

/**
 * Component for fetching data for and displaying a single blog post page.
 */

type Props = {
  match: Match
}

type State = {
  loading: boolean,
  post?: BCorpPost
}

class BlogSinglePostPage extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = { loading: true }
  }

  componentDidMount () {
    if (this.props.match.params.slug) {
      this.getPost(this.props.match.params.slug)
    }
  }

  /**
   * If we go between urls that both render a blog post, we need to make sure we're making a new network request
   *
   * @param  {[object]} nextProps
   * @return {[void]}
   */
  componentWillReceiveProps (nextProps: Props) {
    if (!this.props.match.params.slug || !nextProps.match.params.slug) {
      return
    }

    if (nextProps.match.params.slug !== this.props.match.params.slug) {
      this.getPost(nextProps.match.params.slug)
    }
  }

  render () {
    if (this.state.loading) {
      return <Loading pageSize />
    }

    if (!this.state.post) {
      return <Error404 />
    }

    // defaults to post title
    const pageTitle =
      (this.state.post &&
        (this.state.post.post.meta_title || this.state.post.post.post_title)) ||
      ''
    const pageDescription =
      (this.state.post && this.state.post.post.meta_description) || ''

    return (
      <div className={`Blog-Landing-Page`}>
        <BCorpHead title={pageTitle} description={pageDescription} />

        <BlogPageTemplate
          renderContent={() => {
            if (!this.state.post) {
              return null
            }

            return (
              <div className={'row'}>
                <Post post={this.state.post} />
                <Divider className={style.divider} fullWidth />
                <PostComments
                  post={this.state.post.post}
                  postSlug={this.props.match.params.slug || ''}
                />
              </div>
            )
          }}
        />
      </div>
    )
  }

  async getPost (slug: string) {
    this.setState({ loading: true })
    try {
      const client = new CPTApiClient('post')
      const response = await client.getBySlug(slug)
      const post: BCorpPost = response.data

      return this.setState({ post, loading: false })
    } catch (err) {
      console.log(err)
      this.setState({ loading: false })
    }
  }
}

export default BlogSinglePostPage
