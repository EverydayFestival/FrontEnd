import React from 'react'
import styled
 from 'styled-components'
const Box = ({children}) => {
  return (
    <BoxWrapper>
        <Sidebox/>
        <Content>{children}</Content>
        <Sidebox/>
    </BoxWrapper>
  )
}

export default Box

const BoxWrapper = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    
`

const Sidebox = styled.div`
    width: 200px;
    background: #F4EDED;
    flex-shrink: 0;
`

const Content = styled.div`
    flex: 1;
    background: #fff;
    padding: 40px;
    box-sizing: border-box;
`