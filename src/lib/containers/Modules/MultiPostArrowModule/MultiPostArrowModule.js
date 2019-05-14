import React from 'react'
import PropTypes from 'prop-types'
import PostGettingModule from '../PostGettingModule'
import SimpleSlider from '../../SimpleSlider/SimpleSlider'
import BCorpBackground from '../../../components/BCorpBackground/BCorpBackground'
import PostColumn from './PostColumn/PostColumn'
import style from './MultiPostArrowModule.scss'

/**
 * Handles the presentational logic for the Multi Post Arrow Module
 * Post data is handled by the PostGettingModule class that we extend
 *
 * @extends PostGettingModule
 */
class MultiPostArrowModule extends PostGettingModule {
  constructor (props) {
    super(props, style, 'multiPostArrowModule', 100)

    this.state = {
      ...this.state,
      contentVariableHeight: 0
    }
  }

  renderTitle () {
    if (!this.props.title) {
      return
    }

    return (
      <h3 className={`${style.title} ${this.accentColorClass} module-accent-color-change-text ${this.skinClass}`} >
        {this.props.title}
      </h3>
    )
  }

  renderPosts () {
    const arrow = (this.size === 'tablet' || this.size === 'desktop')
    var height = this.state.contentVariableHeight

    return this.state.posts.map((post, index) => {
      return (
        <PostColumn
          key={index}
          post={post}
          containerNode={this.state.node}
          skin={this.props.skin}
          accentColor={this.props.accentColor}
          skinClass={this.skinClass}
          height={this.state.contentVariableHeight}
          getHeight={container => {
            if (height < container.current.clientHeight) {
              height = container.current.clientHeight
            }

            if (index === this.state.posts.length - 1 && this.state.posts.length > 1) {
              this.setState({ contentVariableHeight: height + 15 })
            }
          }}
          arrow={arrow} />
      )
    })
  }

  /**
   * containerNode prop makes sure slider layout responds to whole module size,
   * not just the inner module
   */
  renderSlider () {
    return (
      <SimpleSlider
        numberMobile={2}
        numberTablet={3}
        numberDesktop={4}
        numberOfPosts={this.state.posts.length}
        wrapperClassName={style.slider}
        desktopWrapperClassName={style.slider}
        containerNode={this.state.node}
        respondToContainer
        nextPrevButtonsForMobile
        alwaysUpdate >
        {this.renderPosts()}
      </SimpleSlider>
    )
  }

  renderModule () {
    return (
      <div className={`row ${this.containerClassName} ${this.skinClass}`} >

        <BCorpBackground
          imageSrc={this.props.background}
          overlay={this.props.backgroundOverlay}
          skin={this.props.skin} />

        {this.renderTitle()}

        {this.renderSlider()}

      </div>
    )
  }

  render () {
    return super.render()
  }

  passesValidation () {
    if (!this.state.posts || this.state.posts.length < 1 || this.state.posts.length > this.maxPosts) {
      return false
    }

    return true
  }
}

MultiPostArrowModule.propTypes = {

  ...PostGettingModule.propTypes,

  /*
   * Title to display above the posts
   */
  title: PropTypes.string,
  /**
   * The image src as a sting
   */
  background: PropTypes.string,
  backgroundOverlay: PropTypes.string
}

export default MultiPostArrowModule
