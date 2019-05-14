import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentTransformer from '../../../../../../../lib/components/ContentTransformer/ContentTransformer'
import tabStyle from '../Tabs.scss'
import style from './TabWarranty.scss'

class TabWarranty extends Component {
  renderWarranty () {
    return this.props.warranty.map((warranty, index) => {
      return (
        <div key={index} className={style.warranty}>
          <div className={`small-body`}>
            <ContentTransformer content={warranty.post['post_content']} />
          </div>
        </div>
      )
    })
  }

  render () {
    return (
      <div
        className={`${style.tabWarranty} ${tabStyle.fullWidthColDesktopTab}`}>
        <h5 className={`${tabStyle.tabColTitle} ${style.title}`}>
          {'Warranty'}
        </h5>
        {this.renderWarranty()}
      </div>
    )
  }
}

TabWarranty.propTypes = {
  warranty: PropTypes.array.isRequired
}

export default TabWarranty
