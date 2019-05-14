import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { validChain } from '../../../../../../../lib/bcorpObject'
import { clean, cleanWithRegex } from '../../../../../../../lib/bcorpArray'
import VerticalAlignHelper from '../../../../../../../lib/components/VerticalAlignHelper/VerticalAlignHelper'
import VerticalListItem from './VerticalListItem/VerticalListItem'
import ScrollableList from '../../../../../../../lib/containers/ScrollableList/ScrollableList'
import LightboxV2 from '../../../../../../../lib/containers/Lightbox/LightboxV2/LightboxV2'
import ButtonDown from './ButtonDown'
import ButtonUp from './ButtonUp'
import SelectedImageLightboxContent from './SelectedImageLightboxContent/SelectedImageLightboxContent'
import ListItemLightbox from './SelectedImageLightboxContent/ListItemLightbox/ListItemLightbox'
import style from './ProductContentImagesDesktop.scss'

class ProductContentImagesDesktop extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedImageSrc: ''
    }
  }

  componentDidMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (
      nextProps.images !== this.props.images ||
      nextProps.featuredImageSrc !== this.props.featuredImageSrc
    ) {
      this.init(nextProps)
    }
  }

  init (props) {
    let videosSrcList =
      props.videos && props.videos.length ? props.videos.split(',') : []
    let imageSrcs =
      props.images && props.images.length ? props.images.split(',') : []

    videosSrcList = clean(videosSrcList, '')
    videosSrcList = clean(videosSrcList, undefined)
    videosSrcList = cleanWithRegex(videosSrcList, '/[ ]*/')
    this.videosSrcList = videosSrcList

    imageSrcs = clean(imageSrcs, '')
    imageSrcs = clean(imageSrcs, undefined)

    if (props.featuredImageSrc) {
      this.imagesSrcList = this.withFeaturedImage(props, imageSrcs)
      return this.setState({ selectedImageSrc: props.featuredImageSrc })
    } else {
      this.imagesSrcList = imageSrcs
      return imageSrcs.length !== 0
        ? this.setState({ selectedImageSrc: imageSrcs[0] })
        : null
    }
  }

  updateSelectedImage (src) {
    return this.setState({ selectedImageSrc: src })
  }

  handleImageListItemClick (e, src) {
    if (e) {
      e.preventDefault()
    }

    return this.updateSelectedImage(src)
  }

  handleSelectedImageScrollerPositionChange (children, index) {
    if (!validChain(children[index], 'props', 'src')) {
      return
    }

    const displayedChildSrc = children[index].props.src

    if (this.imagesSrcList.includes(displayedChildSrc)) {
      return this.updateSelectedImage(displayedChildSrc)
    }
  }

  renderVerticalList () {
    if (!this.imagesSrcList || !this.videosSrcList) {
      return []
    }

    const imgs = this.imagesSrcList.map((imageSrc, index) => {
      return (
        <VerticalListItem
          key={index}
          onClick={this.handleImageListItemClick.bind(this)}
          src={imageSrc}
        />
      )
    })
    const videos = this.videosSrcList.map((videoSrc, index) => {
      return <VerticalListItem key={`video_${index}`} src={videoSrc} video />
    })

    return [...imgs, ...videos]
  }

  renderImagesListLightbox () {
    if (!this.imagesSrcList || !this.videosSrcList) {
      return []
    }

    const orderedSrcs = [...this.imagesSrcList, ...this.videosSrcList]

    return orderedSrcs.map((src, index) => {
      if (this.imagesSrcList.indexOf(src) !== -1) {
        return <ListItemLightbox key={index} src={src} />
      }
      if (this.videosSrcList.indexOf(src) !== -1) {
        return <ListItemLightbox key={index} src={src} video />
      }
    })
  }

  renderSelectedImage () {
    const items = this.renderImagesListLightbox()

    return (
      <LightboxV2
        renderChildren={openLightbox => {
          return (
            <div
              onClick={openLightbox}
              style={{
                backgroundImage: `url(${this.state.selectedImageSrc})`
              }}
              className={style.selectedImageDesktopImage}
            />
          )
        }}
        renderLightboxContents={() => {
          return (
            <SelectedImageLightboxContent
              onPositionChange={this.handleSelectedImageScrollerPositionChange.bind(
                this
              )}
              items={items}
              firstItemSrc={this.state.selectedImageSrc}
            />
          )
        }}
      />
    )
  }

  render () {
    return (
      <React.Fragment>
        <VerticalAlignHelper />

        <div className={style.selectedImageDesktop}>
          {this.renderSelectedImage()}
        </div>

        <ScrollableList
          numberToDisplay={3}
          touchMoveSensitivity={0.3}
          wrapperClassName={style.imagesListWrapperDesktop}
          buttonDown={<ButtonDown />}
          buttonUp={<ButtonUp />}
          reverseSwipeScroll
          vertical>
          {this.renderVerticalList()}
        </ScrollableList>
      </React.Fragment>
    )
  }

  withFeaturedImage (props, imgSrcs) {
    const ix = imgSrcs.indexOf(props.featuredImageSrc)
    if (ix > -1) {
      imgSrcs.splice(ix, 1)
    }
    return [props.featuredImageSrc, ...imgSrcs]
  }
}

ProductContentImagesDesktop.propTypes = {
  featuredImageSrc: PropTypes.string,
  images: PropTypes.string.isRequired,
  videos: PropTypes.string
}

export default ProductContentImagesDesktop
