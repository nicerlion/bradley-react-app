// @flow
import * as React from 'react'
import type { Match } from 'react-router-dom'
import type { CPTName } from '../../../../types/cpt_types'
import type { BCorpPost } from '../../../../types/post_types'
import ContentTransformer from '../../../../components/ContentTransformer/ContentTransformer'
import CPTApiClient from '../../../../../api/cpt_client'
import Error404 from '../../../../components/Error/Error404/Error404'
import Loading from '../../../../components/Loading/Loading'
import DefaultTemplate from '../../../Templates/DefaultTemplate/DefaultTemplate'
import BCorpHead from '../../../../components/BCorpHead/BCorpHead'
import style from './DefaultCPTLandingPage.scss'

type Props = {
  match: Match,
  postType: CPTName,
  renderPostTypeSpecificContent?: (post: BCorpPost) => React.Node
}

type State = {
  loading: boolean,
  post?: BCorpPost
}

class DefaultCPTLandingPage extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = { loading: true }
  }

  componentDidMount () {
    const { match } = this.props
    if (match.params.slug) {
      this.getPost(this.props.postType, match.params.slug)
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    const { match } = this.props
    const nextMatch = nextProps.match
    if (
      nextMatch.params.slug &&
      match.params.slug &&
      (nextMatch.params.slug !== match.params.slug ||
        nextProps.postType !== this.props.postType)
    ) {
      this.getPost(nextProps.postType, nextMatch.params.slug)
    }
  }

  render () {
    if (this.state.loading) {
      console.log('loading')
      return <Loading pageSize />
    }

    if (!this.state.post) {
      console.log('here')
      return <Error404 />
    }

    const { post } = this.state

    // defaults to post title
    const pageTitle = post.post.post_title || ''
    const pageDescription = ''

    return (
      <div className={`Default-CPT-Landing-Page`}>
        <BCorpHead title={pageTitle} description={pageDescription} />

        <DefaultTemplate
          data={{
            page_title: post.post.post_title || ''
          }}
          renderModules={() => {
            return (
              <div className={`row ${style.content}`}>
                <div className={`col1`}>
                  <ContentTransformer content={post.post.post_content || ''} />
                  {this.props.renderPostTypeSpecificContent &&
                    this.props.renderPostTypeSpecificContent(post)}
                </div>
              </div>
            )
          }}
        />
      </div>
    )
  }

  async getPost (postType: CPTName, slug: string) {
    this.setState({ loading: true })
    try {
      const client = new CPTApiClient(postType)
      const response = await client.getBySlug(slug)
      const post: BCorpPost = response.data

      return this.setState({ post, loading: false })
    } catch (err) {
      console.log(err)
      return this.setState({ loading: false })
    }
  }
}

export default DefaultCPTLandingPage
