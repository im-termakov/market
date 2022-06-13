import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { client } from '../lib/sanityClient'
import Link from 'next/link'

const style = {
 collectionsList: 'w-full h-full px-20 py-10',
 collectionItem: 'flex items-center cursor-pointer bg-zinc-700 rounded-lg py-4 mb-10',
 collectionImage: 'w-20 h-20 mx-10',
 collectionTitle: 'text-white text-2xl',
}

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollectionsData = async () => {
      const query = `*[_type == "collections" ] {
        image,
        createdBy,
        contractAddress,
        title,
      }`
  
      const collectionData = await client.fetch(query)
      
      setCollections(collectionData)
    }

    fetchCollectionsData()
  }, [])

  return (
    <div  className="overflow-hidden">
      <Header />
      <ul className={style.collectionsList}>
        {collections.map(({ contractAddress, image, title }) => (
          <Link key={contractAddress} href={`/collection/${contractAddress}`}>
            <li className={style.collectionItem}>
              <img className={style.collectionImage} alt="" src={image} />
              <p className={style.collectionTitle}>{title}</p>
            </li>
         </Link>
        ))}
      </ul>
    </div>
  )
}

export default Collections
