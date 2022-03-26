import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, Heading } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(45deg,
  rgba(255, 0, 0, 1) 0%,
  rgba(255, 154, 0, 1) 10%,
  rgba(208, 222, 33, 1) 20%,
  rgba(79, 220, 74, 1) 30%,
  rgba(63, 218, 216, 1) 40%,
  rgba(47, 201, 226, 1) 50%,
  rgba(28, 127, 238, 1) 60%,
  rgba(95, 21, 242, 1) 70%,
  rgba(186, 12, 248, 1) 80%,
  rgba(251, 7, 217, 1) 90%,
  rgba(255, 0, 0, 1) 100%);
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`
const FlexWrapper = styled(Flex)`
  margin-left: 40px;
`
const FCard = styled.div`
  align-self: baseline;
  background-color: rgba(52, 60, 76, 0.4);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 24px;
  position: relative;
  text-align: center;
  border: 1px solid #98bec3;
  margin-bottom: 12px;
  height: 100%;
`
const Wrapper = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 2fr 2.5fr 1fr ;
  
  ${({ theme }) => theme.mediaQueries.xs} {
    & #include {
      grid-column:  span 3;
      margin-left: 0px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & #include {
      grid-column:  span 3;
      margin-left: 0px;
    }
  }


  ${({ theme }) => theme.mediaQueries.lg} {
    & #include {
      grid-column: span 1;
    }
  }
`
const InnerWrapper = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  width: 100%;
`
const ExpandableWrapper = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
`



const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`
const AlignRight = styled.div`
  align-items: center;
  width: 100%;
  vertical-align: middle;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  overflow: auto;
  display: grid;
  grid-template-columns: 1.45fr 3.5fr;

  ${({ theme }) => theme.mediaQueries.xs} {
    & #include2 {
      grid-column:  span 2;

    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & #include2 {
      grid-column:  span 2;
    }
  }


  ${({ theme }) => theme.mediaQueries.lg} {
    & #include2 {
      grid-column: span 1;
    }
  }
`
const ExpandingWrapper2 = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const NewText = styled(Text)`
  color: #FFFFFF;
  font-size: 0.75rem;
  align-items: center;
`
const NewHeading = styled(Heading)`
  text-align: center;
  color: #98bec3;
  font-size: 1rem;
  margin-bottom: 4px;
`
interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.WFTM) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = 'COAL'
  const farmAPY = farm.apy && farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm

  return (
    <FCard>
      <Wrapper>
        <div  id="include">
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        risk={risk}
        depositFee={farm.depositFeeBP}
        farmImage={farmImage}
        tokenSymbol={farm.tokenSymbol}
      />
      </div>

      <FlexWrapper id="include">
      <InnerWrapper>
      <Flex flexDirection="column">
      <NewText  color="#FFFFFF"> {TranslateString(352, 'APR')}:</NewText>
          <NewHeading  color="#98bec3" style={{ alignItems: 'center', marginTop: "-5px"}}>
            {farm.apy ? (
              <>
                <ApyButton
                  lpLabel={lpLabel}
                  quoteTokenAdresses={quoteTokenAdresses}
                  quoteTokenSymbol={quoteTokenSymbol}
                  tokenAddresses={tokenAddresses}
                  cakePrice={cakePrice}
                  apy={farm.apy}
                />
                {farmAPY}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </NewHeading>
      </Flex>

      <Flex flexDirection="column" >
      <NewText>Fees:</NewText>
      <NewHeading  mb="4px" color="#98bec3">{(farm.depositFeeBP / 100)}%</NewHeading>
      </Flex>
      
      <Flex flexDirection="column" >
      <NewText>TVL:</NewText>
      <NewHeading  mb="4px" color="#98bec3">{totalValueFormated}</NewHeading>
      </Flex>
      </InnerWrapper>
      </FlexWrapper>
      <AlignRight id="include">
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      </AlignRight>
      </Wrapper>
      
      <ExpandingWrapper expanded={showExpandableSection}>
        <div id="include2">
        <DetailsSection
          removed={removed}
          isTokenOnly={farm.isTokenOnly}
          bscScanAddress={
            farm.isTokenOnly ?
              `https://ftmscan.com/address/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              :
              `https://ftmscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
          }
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          quoteTokenAdresses={quoteTokenAdresses}
          quoteTokenSymbol={quoteTokenSymbol}
          tokenAddresses={tokenAddresses}
        />
        </div>
        <div id="include2">
        <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
        </div>
      </ExpandingWrapper>
    </FCard>
  )
}

export default FarmCard
