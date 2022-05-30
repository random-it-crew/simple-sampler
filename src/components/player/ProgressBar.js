import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Sound } from '../../utils/Sound'


const Container = styled.div`
    height: 20px;
    width: 85%;
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

export const ProgressBar = ({ sample, onProgressBarClick, setMouseDown, onMouseMove }) => {
	const [progress, setProgress] = useState(0)
	const [elapsed, setElapsed] = useState(0)

	useEffect(() => {
		if (!sample)
			return

		let frameID

		const updateProgress = () => {
			frameID = requestAnimationFrame(updateProgress)

			const prog = (sample.getElapsedTime() / sample.getDuration()) * 100

			setElapsed(sample.getElapsedTime())
			setProgress(prog > 100 ? 100 : prog)
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
			<HorizontalContainer onMouseLeave={ () => setMouseDown(false) }>
				<Container
					id={ 'container' }
					onMouseDown={ () => setMouseDown(true) }
					onMouseUp={ () => setMouseDown(false) }
					onMouseMove={ (event) => {
						const rect = event.currentTarget.getBoundingClientRect()
						const x = event.clientX - rect.left

						onMouseMove(x / (rect.right - rect.left))
					} }
					onClick={ (event) => {
						const rect = event.currentTarget.getBoundingClientRect()
						const x = event.clientX - rect.left

						onProgressBarClick(x / (rect.right - rect.left))
					} }>
					<Filler progress={ progress } id={ 'filler' }>
						<Dot/>
					</Filler>
				</Container>
				<Label>
					{ elapsed.toFixed(2) }/{ sample.getDuration().toFixed(2) }s
				</Label>
			</HorizontalContainer>

		</div>
	)
}

ProgressBar.propTypes = {
	sample: Sound,
	onProgressBarClick: PropTypes.func,
	setMouseDown: PropTypes.func,
	onMouseMove: PropTypes.func,
}