import React from 'react'
import { youtubeParser } from '../../../../../../lib/bcorpUrl'
import { clean } from '../../../../../../lib/bcorpArray'
import LIGHTBOXSIZES from '../../../../../../lib/containers/Lightbox/lightboxVars'
import LightboxV2 from '../../../../../../lib/containers/Lightbox/LightboxV2/LightboxV2'
import BCorpVideo from '../../../../../../lib/components/BCorpVideo/BCorpVideo'
import FixedAspectRatioBox from '../../../../../../lib/components/FixedAspectRatioBox/FixedAspectRatioBox'
import tabStyle from './Tabs.scss'

export default function renderVideoThumbnail (videos) {
  const arrayOfSrcs = videos.map(video => {
    return video.meta['video_gallery_video']
  })

  const youtubeProps = {
    opts: {
      width: '100%' /* width and height 100% to fit aspect ratio wrapper */,
      height: '100%',
      playerVars: {
        showinfo: 0,
        modestbranding: 1,
        controls: 1
      }
    }
  }

  const vimeoProps = {
    playerOptions: {
      byline: false,
      loop: true,
      portrait: false,
      title: false
    }
  }

  const vimeoPropsLightbox = { ...vimeoProps }
  vimeoPropsLightbox.autoplay = true

  const playerForSingleVideo = url => {
    return (
      <LightboxV2
        renderChildren={openLightbox => {
          return (
            <BCorpVideo
              url={url}
              className={tabStyle.videoIframe}
              youtubeProps={youtubeProps}
              vimeoProps={vimeoProps}
              onPlay={event => {
                event.target.pauseVideo()
                openLightbox()
              }}
            />
          )
        }}
        renderLightboxContents={() => {
          return (
            <FixedAspectRatioBox
              maxHeight={LIGHTBOXSIZES.heightMinusCloseButton}>
              <BCorpVideo
                url={url}
                youtubeProps={youtubeProps}
                vimeoProps={vimeoPropsLightbox}
                autoplay
              />
            </FixedAspectRatioBox>
          )
        }}
      />
    )
  }

  if (arrayOfSrcs.length === 1) {
    // if we only have one video src, no need to make a playlist
    return playerForSingleVideo(arrayOfSrcs[0])
  }

  // if there are mutliple videos we need to pass them as a playlist
  //
  // currently only the youtube API supports playlists
  // so first we check all srcs to see if they are youtube
  //
  // once we've removed any vimeo or invalid srcs from the list
  // we will have an array of valid youtube IDs.
  //
  // If all the IDs were Vimeo, then this will be empty,
  // and we render a single Vimeo player using the first src in the array we had before processing
  //
  // If only one ID remains,
  // we can just render a single youtube player without the extra playlist options
  //
  // Otherwise we render a youtube playlist with the multiple IDs we have
  //
  let videoIds = arrayOfSrcs.map(src => {
    return youtubeParser(src)
  })
  videoIds = clean(videoIds, false)

  if (videoIds.length === 0) {
    return playerForSingleVideo(arrayOfSrcs[0])
  }

  if (videoIds.length === 1) {
    return playerForSingleVideo(videoIds[0])
  }

  const videoIdPlayFirst = videoIds.shift()
  const videoIdsPlayAfter = videoIds.join(',')

  youtubeProps.opts.playerVars.playlist = videoIdsPlayAfter
  youtubeProps.opts.playerVars.showinfo = 1
  youtubeProps.opts.playerVars.controls = 1

  return (
    <LightboxV2
      renderChildren={openLightbox => {
        return (
          <BCorpVideo
            url={videoIdPlayFirst}
            className={tabStyle.videoIframe}
            youtubeProps={youtubeProps}
            onPlay={event => {
              event.target.pauseVideo()
              openLightbox()
            }}
            noVimeo
          />
        )
      }}
      renderLightboxContents={() => {
        return (
          <FixedAspectRatioBox maxHeight={LIGHTBOXSIZES.heightMinusCloseButton}>
            <BCorpVideo
              url={videoIdPlayFirst}
              youtubeProps={youtubeProps}
              noVimeo
              autoplay
            />
          </FixedAspectRatioBox>
        )
      }}
    />
  )
}
