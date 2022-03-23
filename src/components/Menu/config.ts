import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://spookyswap.finance/',
      },
      {
        label: 'Liquidity',
        href: 'https://spookyswap.finance/',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/nests',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
 // {
 //   label: 'Play 2 Earn & AirDrop',
 //   icon: 'InfoIcon',
  //  items: [
  //    {
  //      label: 'PreSale',
  //      href: '',
  //    },
  //    {
  //      label: 'Play 2 Earn coming soon',
  //      href: '#',
  //    },
   //   {
  //      label: 'AirDrop',
   //     href: '#',
  //    },
 //   ],
 // },
  {
    label: 'Presale, Charts and Docs',
    icon: 'MoreIcon',
    items: [
      {
        label: 'DexScreener',
        href: '#',
      },
      {
        label: 'Docs',
        href: '#',
      },
      {
        label: 'Presale',
        href: '#',
      },
    ],
  },
]

export default config
