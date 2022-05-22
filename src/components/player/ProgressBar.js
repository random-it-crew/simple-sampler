import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

const Container = styled.div`
    height: 20px;
    width: 90%;
    background-color: #e0e0de;
    border-radius: 50px;
    margin: 10px;
`

const Filler = styled.div.attrs(props => ({ style: { width: props.progress + '%' } }))`
    height: 100%;
    background-color: darkGreen;
    border-radius: inherit;
    text-align: right;
`

const Label = styled.span`
    color: white;
    font-weight: bold;
    font-size: calc(5px + 1vmin);
    vertical-align: top;
	border-radius: 50px;
    margin: 10px;
    height: 20px;
`

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;
  
  
  @media screen and (min-width: 415px){
    max-height: calc(45px + 2vmin);
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-flex: 1 1 0;
    -ms-flex: 1 1 0;
    flex: 1 1 0;
  }
`

const Dot = styled.span`
  height: 20px;
  width: 20px;
  background-color: gray;
  border-radius: 50%;
  display: inline-block;
`

export const ProgressBar = ({ sample, onProgressBarClick }) => {
	const [progress, setProgress] = useState(0)
	const [elapsed, setElapsed] = useState(0)

	useEffect(() => {
		if (!sample)
			return

		let frameID

		const updateProgress = () => {
			frameID = requestAnimationFrame(updateProgress)

			const progress = (sample.getElapsedTime() / sample.getDuration()) * 100

			setElapsed(sample.getElapsedTime())
			setProgress(progress > 100 ? 100 : progress)
		}

		updateProgress()

		return () => {
			cancelAnimationFrame(frameID)
		}
	}, [sample])

	if (!sample)
		return <div/>

	return (
		<div>
			<HorizontalContainer>
				<Container onClick={ (event) => {
					const rect = event.currentTarget.getBoundingClientRect()
					const x = event.clientX - rect.left

					onProgressBarClick(x / (rect.right - rect.left))
				} } id={ 'container' }>
					<Filler progress={ progress } id={ 'filler' }>
						<Dot/>
					</Filler>
				</Container>
				<Label>
					{ elapsed.toFixed(1) }/{ sample.getDuration().toFixed(1) }s
				</Label>
			</HorizontalContainer>

		</div>
	)
}