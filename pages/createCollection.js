import React, { useState } from 'react';
import Header from '../components/Header';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { client } from '../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'
import { useAddress, useSDK } from '@thirdweb-dev/react';

const style = {
  wrapper: `flex pt-24 h-full flex-col items-center container-lg`,
  label: 'my-2.5 text-[#e5e8eb]',
  input: 'px-1.5',
  button: `mt-8 flex items-center py-2 px-6 rounded-lg cursor-pointer bg-[#2081e2] hover:bg-[#42a0ff]`,
  buttonText: `text-lg font-semibold`,
  items: `mt-12`,
  item: `mt-6`,
  itemLabel: 'mx-2.5 text-[#e5e8eb]'
}

const CreateCollection = () => {
  const address = useAddress();
  const sdk = useSDK();

  const [collectionData, setCollectionData] = useState({});
  const [items, setItems] = useState([]);

  const onChange = (e) => {
    setCollectionData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  };

  const onAddItem = () => {
    setItems(prevState => [...prevState, {
      key: prevState.length,
    }]);
  };

  const onItemChange = (e) => {
    const id = e.target.dataset.testid;

    setItems(prevState => {
      const updatedItems = [...prevState];
      updatedItems[id][e.target.name] = e.target.value;

      return updatedItems;
    })
  };

  const showToast = () => {
    toast.success(
      `Collection created!`,
      {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      }
    )
  }

  const onCreateCollection = async () => {
    if (!sdk) {
      return;
    }

    const contractAddress = await sdk.deployer.deployNFTCollection({
      name: collectionData.collectionName,
      primary_sale_recipient: address,
      image: collectionData.collectionImage
    });

    const contract = sdk.getNFTCollection(contractAddress);

    await contract.mintBatchTo(address, items);

    const data = {
      _type: 'collections',
      _id: contractAddress,
      title: collectionData.collectionName,
      contractAddress,
      createdBy: address,
      image: collectionData.collectionImage
    };

    await client.createIfNotExists(data);

    showToast();
  };

  return (
    <div  className="overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <div className={style.wrapper}>
        <label className={style.label}>Collection Name</label>
        <input onChange={onChange} className={style.input} name="collectionName" />
        <label className={style.label} className={style.label}>Collection Image</label>
        <input onChange={onChange}  className={style.input} name="collectionImage" />
        <div>
          <ul className={style.items}>
            {items.map(({ key }) => 
                <li className={style.item} key={key}>
                  <label className={style.itemLabel}>Item Name</label>
                  <input data-testid={key} onChange={onItemChange} className={style.input} name="name" />
                  <label className={style.label} className={style.itemLabel}>Item Image</label>
                  <input data-testid={key} onChange={onItemChange}  className={style.input} name="image" />
                </li>
              )
            }
          </ul>
          <div
            onClick={onAddItem}
            className={`${style.button} w-44 mx-auto`}
          >
            <p className={`${style.buttonText} text-center w-full`}>Add item</p>
          </div>
      </div>
        <div
          onClick={onCreateCollection}
          className={style.button}
        >
            <div className={style.buttonText}>Create collection</div>
          </div>
      </div>
    </div>
  )
}

export default CreateCollection
