import { useEffect, useState } from 'react'
import { IoMdWallet } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import { ETHEREUM_CONTRACT_ADDRESS, MARKET_PLACE_ID_ETH } from '../../constants/common'
import { useMarketplace, useBuyNow } from '@thirdweb-dev/react';
import { ListingType } from '@thirdweb-dev/sdk';

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
  priceInput: 'ml-6 px-4 text-black'
}

const MakeOffer = ({ isListed, selectedNft, listings, collectionId }) => {
  const marketplace = useMarketplace(
    MARKET_PLACE_ID_ETH
  );
  const {
    mutate: buyNow,
  } = useBuyNow(marketplace);

  const [selectedMarketNft, setSelectedMarketNft] = useState()
  const [enableButton, setEnableButton] = useState(false)
  const [price, setPrice] = useState('')

  useEffect(() => {
    if (!listings || isListed === 'false') {
      return;
    }

    (async () => {
      const currentNft = listings.find(({ asset }) => asset?.key == selectedNft?.metadata.key);

      setSelectedMarketNft(currentNft);
    })()
  }, [selectedNft, listings, isListed])

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) {
      return;
    }

    setEnableButton(true)
  }, [selectedMarketNft, selectedNft])

  const showToast = (text, toastHandler = toast) =>
    toastHandler.success(text, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    })

  const onBuyItem = async () => {
    buyNow({ id: selectedMarketNft.id, type: ListingType.Direct, buyAmount: 1 })
  }

  const onListItem = async () => {
    const listing = {
      assetContractAddress: collectionId,
      tokenId: selectedNft.metadata.key,
      listingDurationInSeconds: 86400,
      quantity: 1,
      startTimestamp: new Date(),
      currencyContractAddress: ETHEREUM_CONTRACT_ADDRESS,
      buyoutPricePerToken: price,
    }
  
    const tx = marketplace.createListing(listing);
  }

  const onChangePrice = (e) => {
    setPrice(e.target.value)
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          <div
            onClick={enableButton ? onBuyItem : null}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <p>{selectedMarketNft?.buyoutCurrencyValuePerToken.displayValue}</p>
        </>
      ) : (
        <>
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div onClick={onListItem} className={style.buttonText}>List Item</div>
        </div>
        <input className={style.priceInput} value={price} onChange={onChangePrice} />
        </>
      )}
    </div>
  )
}

export default MakeOffer
