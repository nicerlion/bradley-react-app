// @flow
import * as React from 'react'
import type {
  LiteraturePost,
  ChipSamplePost
} from '../../../../lib/types/cpt_types'
import type { MaterialTypes } from '../../../../api/litAndChipSamplePage_client'
import type { ScreenSize } from '../../../../lib/contexts/ScreenSizeContext'
import type { CheckboxObject } from '../../../../lib/components/BCorpFilterField/BCorpCheckboxField'
import LiteratureAndChipSamplePageClient from '../../../../api/litAndChipSamplePage_client'
import { withScreenSize } from '../../../../lib/contexts/ScreenSizeContext'
import CPTApiClient from '../../../../api/cpt_client'
import RightSidebarTemplate from '../../../../lib/containers/Templates/RightSidebarTemplate/RightSidebarTemplate'
import PostTypeSelector from './PostTypeSelector/PostTypeSelector'
import MobileShowCurrentRequestButton from './MobileShowCurrentRequestButton/MobileShowCurrentRequestButton'
import Shipment from './CurrentRequest/Shipment/Shipment'
import Downloads from './CurrentRequest/Downloads/Downloads'
import Options from './Options/Options'
import Filters from './Filters/Filters'
import BCorpHead from '../../../../lib/components/BCorpHead/BCorpHead'
// import style from './LiteratureAndChipSamples.scss'

type PostTypeOptions = 'literature' | 'chip'

/* Filter Types */

type LiteratureFilters = {
  productLine: string,
  language: string,
  search?: string
}

type ChipSampleFilters = {
  materialType: number
}

type FiltersTypes = {
  literature: LiteratureFilters,
  chipSamples: ChipSampleFilters
}

/* Option Types */

type OptionsTypes = {
  literature?: Array<LiteraturePost>,
  chipSamples?: Array<ChipSamplePost>
}

/* Shipment Types */

type ShipmentLiteratureObject = {
  num: number,
  postID: number,
  post: LiteraturePost
}

type ShipmentChipSampleObject = {
  num: number,
  postID: number,
  post: ChipSamplePost
}

type ShipmentTypes = {
  literature?: Array<ShipmentLiteratureObject>,
  chip?: Array<ShipmentChipSampleObject>
}

/* Download Types */

type DownloadTypes = Array<LiteraturePost>

/* Shipping Info */

type ShippingInfoField =
  | 'full_name'
  | 'title'
  | 'company_name'
  | 'mailing_address'
  | 'city'
  | 'state_province'
  | 'post_code'
  | 'country'
  | 'email'
  | 'phone'
  | 'user_area'

type ShippingInfoUserAreaField =
  | 'normally_purchase_from'
  | 'overnight'
  | 'carrier'
  | 'account'
  | 'rep'
  | 'request_email'
  | 'notes'

type ShippingInfoUserAreaType = {
  [ShippingInfoUserAreaField]: ?string,
  normally_purchase_from?: CheckboxObject,
  overnight?: CheckboxObject
}

type ShippingInfoType = {
  [ShippingInfoField]: ?string,
  userArea: ShippingInfoUserAreaType
}

type Props = {
  // from withScreenSize HOC
  screenSize: ScreenSize
}

type State = {
  options: OptionsTypes,
  filters: FiltersTypes,
  shipment?: ShipmentTypes,
  downloads?: DownloadTypes,
  shippingInfo: ShippingInfoType,
  selected: PostTypeOptions,
  materialTypes: MaterialTypes,
  showCurrentRequestMobile: boolean,
  loading: boolean
}

const pageTitle = 'Literature & Chip Samples'
const pageDescription = ''

const productLineFilterDefault: string = 'product-line'
const languageFilterDefault: string = 'language'
const materialTypeFilterDefault: number = 0
const shippingInfoDefault: ShippingInfoType = { userArea: {} }

class LiteratureAndChipSamples extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)

    this.state = {
      options: {},
      filters: {
        literature: {
          productLine: productLineFilterDefault,
          language: languageFilterDefault,
          search: ''
        },
        chipSamples: {
          materialType: materialTypeFilterDefault
        }
      },
      shippingInfo: shippingInfoDefault,
      selected: 'literature',
      materialTypes: {},
      showCurrentRequestMobile: false,
      loading: true
    }
  }

  componentDidMount () {
    this.getLiterature()
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    console.log(prevState, this.state)
    if (
      prevState.filters.literature.search !==
      this.state.filters.literature.search
    ) {
      this.getLiterature()
    }
  }

  updateShippingInfo (newShippingInfo: ShippingInfoType): void {
    this.setState({ ...this.state, shippingInfo: newShippingInfo })
  }

  updateShipment (newShipment: ShipmentTypes): void {
    this.setState({ ...this.state, shipment: newShipment })
  }

  addToShipment (postToAdd: LiteraturePost | ChipSamplePost): void {
    const postType = postToAdd.post.post_type

    // shipment hasnt yet been initialised
    if (!this.state.shipment) {
      this.createNewShipmentWithPost(postToAdd)
    }

    // shipment initialised but not for this post type
    if (this.state.shipment && !this.state.shipment[postType]) {
      this.createNewPostTypeInShipmentWithPost(postToAdd)
    }

    // shipment and post type in shipment already initialised
    if (this.state.shipment && this.state.shipment[postType]) {
      this.addPostToExistingShipment(postToAdd)
    }
  }

  incrementPostInShipment (
    idToIncrement: number,
    newNumber: number,
    postType: PostTypeOptions
  ): void {
    const shipment = this.state.shipment || {}
    const shipmentPostType = shipment[postType] || []

    if (!this.state.shipment || !this.state.shipment[postType]) {
      return
    }

    const indexToIncrement = this.state.shipment[postType].findIndex(
      shipment => {
        return shipment.postID === idToIncrement
      }
    )

    if (indexToIncrement === -1) {
      console.warn(
        `Couldnt find post with id ${idToIncrement} in shipment state`
      )
    } else {
      shipmentPostType[indexToIncrement].num = newNumber
      shipment[postType] = shipmentPostType

      this.updateShipment(shipment)
    }
  }

  removeFromShipment (postToRemove: LiteraturePost | ChipSamplePost): void {
    const postID = postToRemove.post.ID
    const postType = postToRemove.post.post_type
    const shipment = this.state.shipment || {}
    const shipmentPostType = shipment[postType] || []

    if (!this.state.shipment || !this.state.shipment[postType]) {
      return
    }

    const indexToRemove = this.state.shipment[postType].findIndex(shipment => {
      return shipment.postID === postID
    })

    if (indexToRemove === -1) {
      console.warn(`Couldnt find post with id ${postID} in shipment state`)
    } else {
      shipmentPostType.splice(indexToRemove, 1)
      shipment[postType] = shipmentPostType

      this.updateShipment(shipment)
    }
  }

  updateDownloads (newDownloads: DownloadTypes): void {
    this.setState({ ...this.state, downloads: newDownloads })
  }

  addToDownloads (postToAdd: LiteraturePost): void {
    const newDownloads = this.state.downloads
      ? [...this.state.downloads, postToAdd]
      : [postToAdd]
    this.updateDownloads(newDownloads)
  }

  removeFromDownloads (idToRemove: number): void {
    if (this.state.downloads) {
      const indexToRemove = this.state.downloads.findIndex(download => {
        return download.post.ID === idToRemove
      })
      const newDownloads = this.state.downloads || []

      if (indexToRemove === -1) {
        console.warn(
          `Couldnt find post with id ${idToRemove} in download state`
        )
      } else {
        newDownloads.splice(indexToRemove, 1)

        this.updateDownloads(newDownloads)
      }
    }
  }

  updateFilters (newFilters: FiltersTypes): void {
    this.setState({ ...this.state, filters: newFilters })
  }

  updateShowCurrentRequestMobile (value: boolean): void {
    this.setState({ showCurrentRequestMobile: value })
  }

  updateSelected (newSelected: PostTypeOptions): void {
    if (newSelected !== this.state.selected) {
      this.onUpdateSelected(newSelected)
      return this.setState({ selected: newSelected })
    }
  }

  onUpdateSelected (newSelected: PostTypeOptions) {
    if (
      newSelected === 'chip' &&
      (!this.state.options.chipSamples ||
        !this.state.options.chipSamples.length)
    ) {
      this.getChipSamplesPage()
    }
  }

  renderOptions (isMobile: boolean) {
    return (
      <React.Fragment>
        <PostTypeSelector
          selected={this.state.selected}
          updateSelected={this.updateSelected.bind(this)}
        />
        <Filters
          options={this.state.options}
          materialTypes={this.state.materialTypes}
          filters={this.state.filters}
          selected={this.state.selected}
          updateFilters={this.updateFilters.bind(this)}
        />
        {isMobile ? (
          <MobileShowCurrentRequestButton
            mobileShowCurrentRequest={this.state.showCurrentRequestMobile}
            updateMobileShowCurrentRequest={this.updateShowCurrentRequestMobile.bind(
              this
            )}
          />
        ) : null}
        <Options
          filters={this.state.filters}
          options={this.state.options}
          selected={this.state.selected}
          addToShipment={this.addToShipment.bind(this)}
          addToDownloads={this.addToDownloads.bind(this)}
          isMobile={isMobile}
          isLoading={this.state.loading}
        />
      </React.Fragment>
    )
  }

  renderCurrentRequest (isMobile: boolean) {
    return (
      <React.Fragment>
        {isMobile ? (
          <MobileShowCurrentRequestButton
            mobileShowCurrentRequest={this.state.showCurrentRequestMobile}
            updateMobileShowCurrentRequest={this.updateShowCurrentRequestMobile.bind(
              this
            )}
          />
        ) : null}
        <Shipment
          shipment={this.state.shipment}
          shippingInfo={this.state.shippingInfo}
          updateShippingInfo={this.updateShippingInfo.bind(this)}
          removeFromShipment={this.removeFromShipment.bind(this)}
          incrementPostInShipment={this.incrementPostInShipment.bind(this)}
          isMobile={isMobile}
        />
        <Downloads
          downloads={this.state.downloads}
          removeFromDownloads={this.removeFromDownloads.bind(this)}
        />
      </React.Fragment>
    )
  }

  renderContent () {
    if (this.props.screenSize === 'mobile') {
      return this.state.showCurrentRequestMobile
        ? this.renderCurrentRequest(true)
        : this.renderOptions(true)
    } else {
      return this.renderOptions(false)
    }
  }

  renderRightSidebarWidgets () {
    return this.props.screenSize === 'mobile'
      ? null
      : this.renderCurrentRequest(false)
  }

  render () {
    return (
      <React.Fragment>
        <BCorpHead title={pageTitle} description={pageDescription} />

        <RightSidebarTemplate
          data={{ page_title: pageTitle }}
          renderModules={() => this.renderContent()}
          renderRightSidebarWidgets={() => this.renderRightSidebarWidgets()}
          widgetsMoveWithScroll
        />
      </React.Fragment>
    )
  }

  async getLiterature () {
    this.setState({ loading: true })
    try {
      const client = new CPTApiClient('literature')
      const response = await client.getLatest(
        -1,
        0,
        0,
        null,
        this.state.filters.literature.search
      )

      const optionsData: Array<LiteraturePost> = response.data

      const options = { ...this.state.options, literature: optionsData }
      return this.setState({ options, loading: false })
    } catch (err) {
      console.log(err)
      const options = { ...this.state.options, literature: [] }
      return this.setState({ options, loading: false })
    }
  }

  async getChipSamplesPage () {
    this.setState({ loading: true })
    try {
      const client = new LiteratureAndChipSamplePageClient()
      const response = await client.getChipSamplePage()

      const options = {
        ...this.state.options,
        chipSamples: response.data.chip_samples
      }

      return this.setState({
        materialTypes: response.data.material_types,
        options,
        loading: false
      })
    } catch (err) {
      console.log(err)
      const options = { ...this.state.options, chipSamples: [] }
      return this.setState({ materialTypes: {}, options, loading: false })
    }
  }

  createNewShipmentWithPost (post: LiteraturePost | ChipSamplePost): void {
    const postID = post.post.ID
    const postType = post.post.post_type
    const shipment = {}

    shipment[postType] = [
      {
        num: 1,
        postID,
        post
      }
    ]
    this.setState({ shipment })
  }

  createNewPostTypeInShipmentWithPost (
    post: LiteraturePost | ChipSamplePost
  ): void {
    const postID = post.post.ID
    const postType = post.post.post_type

    const shipment = { ...this.state.shipment }
    shipment[postType] = [
      {
        num: 1,
        postID,
        post
      }
    ]
    this.setState({ shipment })
  }

  addPostToExistingShipment (postToAdd: LiteraturePost | ChipSamplePost): void {
    const postID = postToAdd.post.ID
    const postType = postToAdd.post.post_type
    const shipment = this.state.shipment || {}
    let shipmentPostType = shipment[postType] || []

    const indexToUpdate = shipment[postType].findIndex(shipment => {
      return shipment.postID === postID
    })

    // post hasnt already been added
    if (indexToUpdate === -1) {
      shipmentPostType = [
        ...shipmentPostType,
        {
          num: 1,
          postID,
          post: postToAdd
        }
      ]
      shipment[postType] = shipmentPostType
      return this.setState({ shipment })
    } else {
      // post already exists in shipment
      shipmentPostType[indexToUpdate].num += 1
      shipment[postType] = shipmentPostType

      return this.setState({ shipment })
    }
  }
}

function download (literature: LiteraturePost) {
  if (!literature.meta.literature_pdf.includes('/view/')) {
    console.log(
      `couldnt download file with url ${literature.meta.literature_pdf}`
    )
    return
  }

  const downloadLink = literature.meta.literature_pdf.replace(
    '/view/',
    '/download/'
  )

  window.open(downloadLink)
}

export default withScreenSize(LiteratureAndChipSamples)
export {
  productLineFilterDefault,
  languageFilterDefault,
  materialTypeFilterDefault,
  shippingInfoDefault,
  download
}
export type {
  PostTypeOptions,
  OptionsTypes,
  FiltersTypes,
  ShipmentTypes,
  ShippingInfoType,
  ShippingInfoField,
  ShippingInfoUserAreaField,
  ShippingInfoUserAreaType,
  DownloadTypes,
  ShipmentChipSampleObject,
  ShipmentLiteratureObject,
  MaterialTypes
}
