import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1vh;
`

const Slider = styled.div`
  position: relative;
  width: 99%;
`

const SliderTrack = styled.div`
  border-radius: 3px;
  height: 5px;
  position: absolute;
  background-color: #424242;
  width: 99%;
  z-index: 1;
`

const SliderRange = styled.div`
  border-radius: 3px;
  height: 5px;
  position: absolute;
  background-color: gray;
  z-index: 2;
`

const Thumb = styled.input`
  pointer-events: none;
  position: absolute;
  width: 99%;
  height: 0;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px #ced4da;
    cursor: pointer;
    height: 18px;
    width: 18px;
    pointer-events: all;
    position: relative;  
  }
  
  &::-moz-range-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    
    background-color: #f1f5f7;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px #ced4da;
    cursor: pointer;
    height: 18px;
    width: 18px;
    pointer-events: all;
    position: relative;  
  }
`

const ThumbLeft = styled(Thumb)`
  z-index: 3;
`

const ThumbRight = styled(Thumb)`
  z-index: 4;
`


export const MultiRangeSlider = ({ onChange, min, max }) => {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const range = useRef(null)

  const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100),[min, max])

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal)
      const maxPercent = getPercent(+maxValRef.current.value)

      if (range.current) {
        range.current.style.left = `${minPercent}%`
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minVal, getPercent]);


  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value)
      const maxPercent = getPercent(maxVal)

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [maxVal, getPercent])

  useEffect(() => {
    onChange({ min: minVal, max: maxVal })
  }, [minVal, maxVal, onChange])

  return (
    <Container>
      <ThumbLeft
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1)
          setMinVal(value)
        }}
        style={{ zIndex: (minVal > max - 100) && "5" }}
      />
      <ThumbRight
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1)
          setMaxVal(value)
        }}
      />
      <Slider>
        <SliderTrack/>
        <SliderRange ref={range}/>
      </Slider>
    </Container>
  )
}
