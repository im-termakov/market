import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { client } from '../../lib/sanityClient'
import Header from '../../components/Header'
import NFTCard from '../../components/NFTCard'
import { MARKET_PLACE_ID_ETH } from '../../constants/common';
import { useMarketplace, useNFTCollection, useNFTs, useListings } from '@thirdweb-dev/react';

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collection = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  const nftCollection = useNFTCollection(collectionId);
  const { data: nfts } = useNFTs(nftCollection);
  const marketplace = useMarketplace(MARKET_PLACE_ID_ETH);
  const { data: listings } =  useListings(marketplace);

  const [collection, setCollection] = useState({});

  useEffect(() => {
    const fetchCollectionData = async () => {
      const query = `*[_type == "collections" && contractAddress == "${collectionId}" ] {
        image,
        createdBy,
        contractAddress,
        createdBy,
        title,
      }`
  
      const collectionData = await client.fetch(query)
  
      setCollection(collectionData[0])
    }

    fetchCollectionData()
  }, [collectionId])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://via.placeholder.com/200'
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.image
                ? collection.image
                : 'https://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by
            <span className="text-[#2081e2] ml-2">{collection?.createdBy}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts?.length}</div>
              <div className={style.statName}>items</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap ">
        {nfts?.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collection?.title}
            listings={listings}
            collectionId={collectionId}
          />
        ))}
      </div>
    </div>
  )
}

export default Collection
