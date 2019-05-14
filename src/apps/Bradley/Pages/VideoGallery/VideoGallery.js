// @flow
import * as React from 'react'
import type { BCorpTermsResponse } from '../../../../lib/types/term_types'
import CPTApiClient from '../../../../api/cpt_client'
import DefaultTemplate from '../../../../lib/containers/Templates/DefaultTemplate/DefaultTemplate'
import Videos from './Videos/Videos'
import Filters from './Filters/Filters'
import BCorpHead from '../../../../lib/components/BCorpHead/BCorpHead'
import style from './VideoGallery.scss'

type FiltersType = {
  video_gallery_type_cat: string,
  video_gallery_product_tag: string,
  video_gallery_cat: string,
  search?: string
}

type FilterOptions = {
  [string | number]: ?string
}

type FilterOptionsState = {
  [string]: FilterOptions
}

type Props = {}

type State = {
  filters: FiltersType,
  filterOptions: FilterOptionsState
}

const pageTitle = 'Video Gallery'
const pageDescription = ''

const filterDefault: 'all' = 'all'
const filterDefaultName: 'All' = 'All'
const filterOptionDefault: FilterOptions = {}
filterOptionDefault[filterDefault] = filterDefaultName

class VideoGallery extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      filters: {
        video_gallery_type_cat: filterDefault,
        video_gallery_product_tag: filterDefault,
        video_gallery_cat: filterDefault,
        search: ''
      },
      filterOptions: {
        video_gallery_type_cat: filterOptionDefault,
        video_gallery_product_tag: filterOptionDefault
      }
    }
  }

  componentDidMount () {
    this.getTerms()
  }

  updateFilters (filters: FiltersType) {
    this.setState({ ...this.state, filters })
  }

  render () {
    return (
      <React.Fragment>
        <BCorpHead title={pageTitle} description={pageDescription} />

        <DefaultTemplate
          data={{ page_title: pageTitle }}
          renderModules={() => {
            return (
              <div className={style.VideoGallery}>
                <Filters
                  filters={this.state.filters}
                  filterOptions={this.state.filterOptions}
                  updateFilters={this.updateFilters.bind(this)}
                />
                <Videos filters={this.state.filters} />
              </div>
            )
          }}
        />
      </React.Fragment>
    )
  }

  async getTerms () {
    try {
      const client = new CPTApiClient('video-gallery')
      const response = await client.getTerms()

      const termsResponse: BCorpTermsResponse = response.data
      const filterOptions = this.processTermsForState(termsResponse)

      return this.setState({ ...this.state, filterOptions })
    } catch (err) {
      console.log(err)
    }
  }

  processTermsForState (termsResponse: BCorpTermsResponse): FilterOptionsState {
    const filterOptions = {}

    termsResponse.tax_names.forEach(taxName => {
      filterOptions[taxName] = {}

      termsResponse[taxName].forEach(term => {
        const { slug, name } = term
        filterOptions[taxName][slug] = name
      })
    })

    return filterOptions
  }
}

export default VideoGallery

export { filterDefault, filterDefaultName, filterOptionDefault }
export type { FiltersType, FilterOptionsState }
