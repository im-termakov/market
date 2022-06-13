import Header from '../../components/Header'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImage'
import GeneralDetails from '../../components/nft/GeneralDetails'
import ItemActivity from '../../components/nft/ItemActivity'
import Purchase from '../../components/nft/Purchase';
import { MARKET_PLACE_ID_ETH } from '../../constants/common';
import { client } from '../../lib/sanityClient'
import { useMarketplace, useNFTCollection } from '@thirdweb-dev/react';

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}

const Nft = () => {
  const { query } = useRouter();

  const nftCollection = useNFTCollection(query.collectionId);
  const marketplace = useMarketplace(
    MARKET_PLACE_ID_ETH
  );

  const [selectedNft, setSelectedNft] = useState()
  const [listings, setListings] = useState([])
  const [collectionData, setCollectionData] = useState({})

  // get all NFTs in the collection
  useEffect(() => {
    if (!nftCollection) {
      return;
    }
    
    (async () => {
      const nfts = await nftCollection.getAll()

      const selectedNftItem = nfts.find(({ metadata }) => metadata.key == query.nftId)

      setSelectedNft(selectedNftItem)
    })()
  }, [nftCollection])

  useEffect(() => {
    if (!marketplace) {
      return;
    }
    
    (async () => {
      const listings = await marketplace.getAllListings();

      setListings(listings)
    })()
  }, [marketplace])

  useEffect(() => {
    const fetchCollectionData = async () => {
      const dataQuery = `*[_type == "collections" && contractAddress == "${query.collectionId}" ] {
        image,
        createdBy,
        contractAddress,
        createdBy,
        title,
      }`
  
      const collectionData = await client.fetch(dataQuery)
  
      setCollectionData(collectionData[0])
    }

    fetchCollectionData()
  }, [query.collectionId])

  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails collectionData={collectionData} selectedNft={selectedNft} />
              <Purchase
                collectionId={query.collectionId}
                isListed={query.isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketplace}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  )
}

export default Nft
