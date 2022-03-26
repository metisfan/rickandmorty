import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, decimal: number) => void
  onDismiss?: () => void
  tokenName?: string
  depositFeeBP?: number
  decimal?: number
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '' , depositFeeBP = 0, decimal = 18}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()

  let maxHelper
  let decimalHelper
  let valHelper

  if (tokenName === 'USDT' || tokenName === 'USDC') {
    maxHelper = new BigNumber(max).div(10**6);
    decimalHelper = 6;
    valHelper = new BigNumber(val).times(10**(-12));
  } else if (tokenName === 'WBTC') {
    maxHelper = new BigNumber(max).div(10**8);
    decimalHelper = 8;
    valHelper = new BigNumber(val).times(10**(-10));
  } else {
    maxHelper = new BigNumber(max).times(10**(-18));
    decimalHelper = decimal;
    valHelper = new BigNumber(val);
  }

  const fullBalance = useMemo(() => {
    return  (maxHelper)
  }, [maxHelper])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

    const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={`${TranslateString(316, 'Deposit')} ${tokenName} Tokens`} onDismiss={onDismiss}>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        depositFeeBP={depositFeeBP}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(valHelper, decimalHelper)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
