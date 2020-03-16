import React, { useState, useEffect } from "react"
import styled from "styled-components/macro"
import { useEventListener } from "../utils/customHooks"
import { useSwipeable } from "react-swipeable"
import { navigate } from "gatsby"
import Markdown from "markdown-to-jsx"

const SlideStyles = styled.div`
  height: 100vh;
  width: 100vw;
  background: hsla(0, 0%, 10%, 1);
  color: white;
  display: grid;
  place-items: center;
  font-size: 3em;
  font-family: "Sen", sans-serif;
  user-select: none;
`

export default function Deck({ deckData, location }) {
  const deckDataFromLocation = location && location.search.slice(1)
  const deckDataDecoded = deckData || decodeURI(deckDataFromLocation)

  const separators = ["---", "\\*\\*\\*"]
  const slides = deckDataDecoded.split(new RegExp(separators.join("|"), "g"))

  const indexFromHash = location.hash && location.hash.slice(1)
  const [slideIndex, setSlideIndex] = useState(Number(indexFromHash) || 0)

  const stepBack = () => setSlideIndex(Math.max(0, slideIndex - 1))
  const stepForward = () =>
    setSlideIndex(Math.min(slides.length - 1, slideIndex + 1))

  // sync the hash with the slide index
  useEffect(() => {
    const { pathname } = location
    navigate(`${pathname}#${slideIndex}`, { replace: true })
  }, [slideIndex])

  const handleKeyDown = event => {
    if (event.key === "ArrowRight") {
      stepForward()
    }
    if (event.key === "ArrowLeft") {
      stepBack()
    }
  }

  useEventListener("keydown", handleKeyDown)

  const swipeConfig = {
    trackMouse: true, // track mouse input
    preventDefaultTouchmoveEvent: true,
  }
  const swipeHandlers = useSwipeable({
    onSwipedLeft: stepForward,
    onSwipedRight: stepBack,
    ...swipeConfig,
  })

  return (
    <div {...swipeHandlers}>
      <SlideStyles>
        <Markdown>{slides[slideIndex]}</Markdown>
      </SlideStyles>
    </div>
  )
}
