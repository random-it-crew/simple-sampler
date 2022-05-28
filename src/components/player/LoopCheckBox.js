import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
	padding: 1vh;
	color: white;
`

const Input = styled.input`
	padding: 1vh;
	margin: 1vh;
`

export const LoopCheckBox = ({ onChange }) => {
	const [value, setValue] = useState(false)

	useEffect(() => {
		onChange(value)
	}, [value])

	return (
		<Container>
			loop
			<Input type={ 'checkbox' } onChange={ () => setValue(!value) }/>
		</Container>
	)
}