// @flow
import React, { Component } from 'react'
import ArrowButton from '../../../../lib/components/ArrowButton/ArrowButton'
import BCorpWidget from '../BCorpWidget'
import ContentTransformer from '../../../components/ContentTransformer/ContentTransformer'
import style from './CTAWidget.scss'

type Props = {
  title: string,
  text?: string,
  link?: string,
  linkText?: string,
  mediaSrc?: string,
  twoColsOnTablet?: boolean
}

/**
 * The CTA Widget
 */
class CTAWidget extends Component<Props> {
  renderMedia () {
    const { mediaSrc } = this.props

    if (!mediaSrc) {
      return
    }

    return (
      <div className={style.mediaWrapper}>
        <img src={mediaSrc} className={style.theMedia} />
      </div>
    )
  }

  renderText () {
    const { text } = this.props

    if (!text) {
      return
    }

    return (
      <div className={style.text}>
        <ContentTransformer content={text} />
      </div>
    )
  }

  renderButton () {
    const { link, linkText } = this.props

    if (!link) {
      return
    }

    return (
      <div className={style.button}>
        <ArrowButton text={linkText || ''} link={link} />
      </div>
    )
  }

  render () {
    return (
      <BCorpWidget
        title={this.props.title}
        twoColsOnTablet={this.props.twoColsOnTablet}>
        {this.renderMedia()}
        {this.renderText()}
        {this.renderButton()}
      </BCorpWidget>
    )
  }
}

export default CTAWidget
