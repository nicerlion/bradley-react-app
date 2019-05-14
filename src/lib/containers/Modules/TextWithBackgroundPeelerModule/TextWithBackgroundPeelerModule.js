import React from 'react'
import PropTypes from 'prop-types'
import BCorpModule from '../../Modules/BCorpModule'
import BCorpBackground from '../../../components/BCorpBackground/BCorpBackground'
import ContentTransformer from '../../../components/ContentTransformer/ContentTransformer'
import style from './TextWithBackgroundPeelerModule.scss'

class TextWithBackgroundPeelerModule extends BCorpModule {
  constructor (props) {
    super(props, style, 'textWithBackgroundPeelerModule')
  }

  renderTitle () {
    const { title } = this.props

    if (!title) {
      return
    }

    return <h4 className={`${style.title} ${this.skinClass || ''}`}>{title}</h4>
  }

  renderText () {
    const { text } = this.props

    if (!text) {
      return
    }

    return (
      <div className={`${style.text} ${this.skinClass || ''}`}>
        <ContentTransformer content={text} />
        {this.props.boldText && (
          <p className={style.boldText}>
            <strong>{this.props.boldText}</strong>
          </p>
        )}
      </div>
    )
  }

  renderTexture () {
    if (!this.props.backgroundPeeler) {
      return
    }

    const image = `url(${this.props.backgroundPeeler})`
    const hasCustomBackground = this.props.background
      ? style.hasCustomBackground
      : undefined

    return (
      <div
        style={{
          backgroundImage: image
        }}
        className={`${style.texture} ${hasCustomBackground}`}
      />
    )
  }

  renderModule () {
    return (
      <div className={`${this.containerClassName} ${this.skinClass || ''}`}>
        <BCorpBackground
          overlay={this.props.backgroundColor}
          skin={this.props.skin}
        />

        {this.renderTitle()}

        {this.renderText()}

        {this.renderTexture()}
      </div>
    )
  }

  render () {
    return super.render()
  }

  passesValidation () {
    const { title, text, background, backgroundPeeler } = this.props

    if (!title && !text && !background && !backgroundPeeler) {
      return false
    }

    return true
  }
}

TextWithBackgroundPeelerModule.propTypes = {
  ...BCorpModule.propTypes,

  title: PropTypes.string,
  text: PropTypes.string,
  boldText: PropTypes.string,
  backgroundColor: PropTypes.string,
  backgroundPeeler: PropTypes.string
}

export default TextWithBackgroundPeelerModule
