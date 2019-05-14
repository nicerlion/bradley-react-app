import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentTransformer from '../../../../../../lib/components/ContentTransformer/ContentTransformer'
import AutoGrowShrinkAnimation from '../../../../../../lib/containers/AutoGrowShrinkAnimation/AutoGrowShrinkAnimation'
import style from './ProductContentText.scss'

class ProductContentText extends Component {
  renderText (isOpen) {
    if (!this.props.content) {
      return
    }
    return isOpen
      ? this.props.content
      : `${this.props.content.substring(0, 401)}...`
  }

  renderMoreDetailsButtonText (isOpen) {
    return isOpen ? '- Less Detail' : '+ More Detail'
  }

  render () {
    const _text =
      this.props.content.length > 400 ? (
        <AutoGrowShrinkAnimation
          speed={600}
          easing={'cubic-bezier(0.86, 0, 0.07, 1)'}>
          {(isOpen, updateNode, openClose) => {
            return (
              <div>
                <div ref={node => updateNode(node)} className={style.content}>
                  <ContentTransformer content={this.renderText(isOpen)} />
                </div>

                <div className={`small-body ${style.moreDetail}`}>
                  <div onClick={() => openClose()}>
                    {this.renderMoreDetailsButtonText(isOpen)}
                  </div>
                </div>
              </div>
            )
          }}
        </AutoGrowShrinkAnimation>
      ) : (
        <div className={style.content}>
          <ContentTransformer content={this.props.content} />
        </div>
      )
    return _text
  }
}

ProductContentText.propTypes = {
  content: PropTypes.string
}

export default ProductContentText
