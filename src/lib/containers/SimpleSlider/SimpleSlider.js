import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withScreenSize } from '../../contexts/ScreenSizeContext'
import ContainerMediaQuery from '../ContainerMediaQuery/ContainerMediaQuery'
import ScrollableList from '../ScrollableList/ScrollableList'
import ButtonNext from './ButtonNext'
import ButtonPrev from './ButtonPrev'
import ButtonLeft from './ButtonLeft'
import ButtonRight from './ButtonRight'
import style from './SimpleSlider.scss'

/**
 * Wraps the ScrollableList component with media queries and default button elements
 */
class SimpleSlider extends Component {
  renderTitle () {
    if (this.props.title !== undefined && this.props.title !== '') {
      const titleClass = this.props.respondToContainer
        ? style.respondToContainerTitle
        : style.title

      return (
        <h4 className={`simple-slider-title ${titleClass} ${style.buttonUp}`}>
          {this.props.title}
        </h4>
      )
    }
  }

  renderButtonUpMobile () {
    return this.props.nextPrevButtonsForMobile ? <ButtonPrev /> : <ButtonLeft />
  }

  renderButtonDownMobile () {
    return this.props.nextPrevButtonsForMobile ? (
      <ButtonNext />
    ) : (
      <ButtonRight />
    )
  }

  renderSliderMobile () {
    return (
      <ScrollableList
        numberToDisplay={this.props.numberMobile}
        numberOfPosts={this.props.numberOfPosts}
        touchMoveSensitivity={1.5}
        buttonUp={this.renderButtonUpMobile()}
        buttonDown={this.renderButtonDownMobile()}
        positionButtonsBelow={this.props.nextPrevButtonsForMobile}
        reverseScroll={this.props.reverseScroll}
        wrapperClassName={`${style.sliderWrapper} ${
          this.props.wrapperClassName
        }`}
        alwaysUpdate={this.props.alwaysUpdate}>
        {this.props.children}
      </ScrollableList>
    )
  }

  renderSliderTablet () {
    return (
      <ScrollableList
        numberToDisplay={this.props.numberTablet}
        numberOfPosts={this.props.numberOfPosts}
        touchMoveSensitivity={2}
        buttonUp={<ButtonLeft />}
        buttonDown={<ButtonRight />}
        reverseScroll={this.props.reverseScroll}
        wrapperClassName={`${style.sliderTabletDesktop} ${
          this.props.desktopWrapperClassName
        }`}
        alwaysUpdate={this.props.alwaysUpdate}>
        {this.props.children}
      </ScrollableList>
    )
  }

  renderSliderDesktop () {
    return (
      <ScrollableList
        numberToDisplay={this.props.numberDesktop}
        numberOfPosts={this.props.numberOfPosts}
        touchMoveSensitivity={2.5}
        buttonUp={<ButtonLeft />}
        buttonDown={<ButtonRight />}
        reverseScroll={this.props.reverseScroll}
        wrapperClassName={`${style.sliderTabletDesktop} ${
          this.props.desktopWrapperClassName
        }`}
        alwaysUpdate={this.props.alwaysUpdate}>
        {this.props.children}
      </ScrollableList>
    )
  }

  render () {
    if (!this.props.respondToContainer) {
      /**
       * Slider with media query based on screen size
       */
      return (
        <React.Fragment>
          {this.renderTitle()}

          {this.props.screenSize === 'mobile'
            ? this.renderSliderMobile()
            : this.props.screenSize === 'tablet'
              ? this.renderSliderTablet()
              : this.renderSliderDesktop()}
        </React.Fragment>
      )
    } else {
      /**
       * Slider with media query based on container size
       *
       * respond with priority to a node passed as props rather than itself
       */
      return (
        <div
          ref={node => {
            if (!this.props.containerNode && !this.node) {
              this.node = node
            }
          }}
          className={style.respondToContainerContainer}>
          <ContainerMediaQuery node={this.props.containerNode || this.node}>
            {(containerClassName, size) => {
              let slider = null

              if (size === 'mobile') {
                slider = this.renderSliderMobile()
              } else if (size === 'tablet') {
                slider = this.renderSliderTablet()
              } else if (size === 'desktop') {
                slider = this.renderSliderDesktop()
              }

              return (
                <div className={containerClassName}>
                  {this.renderTitle()}

                  {slider}
                </div>
              )
            }}
          </ContainerMediaQuery>
        </div>
      )
    }
  }
}

SimpleSlider.propTypes = {
  /**
   * Array of JSX elements for the scroller
   */
  children: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired
  ]),
  /**
   * Optional title to be displayed above the scroller
   */
  title: PropTypes.string,
  /**
   * Number of elements to display in the scroller on mobile sized devices
   */
  numberMobile: PropTypes.number,
  /**
   * Number of elements to display in the scroller on tablet sized devices
   */
  numberTablet: PropTypes.number,
  /**
   * Number of elements to display in the scroller on desktop sized devices
   */
  numberDesktop: PropTypes.number,

  numberOfPosts: PropTypes.number,
  /**
   * Display <Prev / Next> buttons underneath the slider on mobile
   * rather than buttons at the side
   */
  nextPrevButtonsForMobile: PropTypes.bool,
  /**
   * Reverse the direction of scroll on clicking the buttons
   */
  reverseScroll: PropTypes.bool,
  /**
   * Media query is on container size rather than window
   */
  respondToContainer: PropTypes.bool,
  /*
    Update the children whenever the component receives new props, regardless of if they changed
   */
  alwaysUpdate: PropTypes.bool,
  /**
   * We can give the slider another DOM a different node to respond to if respondToContainer is true
   * eg we might pick a higher level parent that still isnt the whole window
   *
   * If left empty the slider will respond to the size of its' container
   */
  containerNode: PropTypes.object,
  /**
   * Custom class name for the scroller's wrapper node on mobile
   */
  wrapperClassName: PropTypes.string,
  /**
   * Custom class name for the scroller's wrapper node on tablet and desktop
   */
  desktopWrapperClassName: PropTypes.string,
  screenSize: PropTypes.string
}

SimpleSlider.defaultProps = {
  numberMobile: 2,
  numberTablet: 3,
  numberDesktop: 5
}

export default withScreenSize(SimpleSlider)
