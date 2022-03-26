import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: rgba(255,255,255,0.2);
  padding-left: 10px;
  padding-bottom: 10px;
  border-radius: 16px;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.xs} {
    & #include {
      grid-column:  span 2;
      margin-left: 0px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & #include {
      grid-column:  span 1;
      margin-left: 0px;
    }
  }


  ${({ theme }) => theme.mediaQueries.lg} {
    & #include {
      grid-column: span 1;
    }
  }
  
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}
const ExpandingWrapper2 = styled.div`
  margin-right: 20px;
`
interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => {
    if(isTokenOnly){
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  let newBalance
  if (pid === 11 || pid === 10) {
    newBalance = stakedBalance.times(10 ** 12)
  } else if (pid === 14) {
    newBalance = stakedBalance.times(10 ** 10)
  } else {
    newBalance = stakedBalance
  }

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction stakedBalance={newBalance} tokenBalance={tokenBalance} tokenName={lpName} pid={pid} depositFeeBP={depositFeeBP} />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <ExpandingWrapper2 id="include">
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          COAL
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(999, 'Earned')}
        </Text>
      </Flex>
      <HarvestAction  earnings={earnings} pid={pid} />
      </ExpandingWrapper2>
      <ExpandingWrapper2 id="include">
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {TranslateString(999, 'Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
      </ExpandingWrapper2>
    </Action>
  )
}

export default CardActions
