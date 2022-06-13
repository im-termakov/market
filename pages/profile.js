import { useAddress } from '@thirdweb-dev/react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import { client } from '../lib/sanityClient';

const style = {
	profileWrapper: 'flex w-3/5 mx-auto pt-16',
	profileImage: 'w-80 h-80 mb-8',
	profileImageInput: 'w-80 px-4 py-2',
	profileInfo: 'flex flex-col pl-10',
	profileLabel: 'text-white pt-6 pb-4 text-xl',
	profileInput: 'px-4 py-2',
	walletAddress: 'text-xl text-[#42a0ff]',
	saveButton: `mt-8 mx-auto flex items-center py-2 px-6 rounded-lg cursor-pointer bg-[#2081e2] hover:bg-[#42a0ff]`
}

const Profile = () => {
	const address = useAddress();

	const [data, setData] = useState({});
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const query = `*[_type == "users" && walletAddress == "${address}" ] {
        profileImage,
        userName,
        email,
        walletAddress,
      }`
  
      const collectionData = await client.fetch(query);

			if(!collectionData?.length) {
				return;
			}

			setImageUrl(collectionData[0].profileImage);
      setData(collectionData[0])
		}

		fetchData();
	}, [address])

	const onChange = (e) => {
		setData(prevState => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSave = async () => {
		const userDoc = {
			_type: 'users',
			_id: address,
			...data
		}

		const result = await client.createOrReplace(userDoc);

		setImageUrl(data.profileImage)
	}

  return (
		<div  className="overflow-hidden">
			<Toaster position="top-center" reverseOrder={false} />
			<Header />
			<div className={style.profileWrapper}>
				<div>
					<img className={style.profileImage} alt="" src={imageUrl} />
					<input className={style.profileImageInput} onChange={onChange} value={data.profileImage || ''} name="profileImage" />
				</div>
				<div className={style.profileInfo}>
					<label className={style.profileLabel}>Username</label>
					<input className={style.profileInput} onChange={onChange} value={data.userName} name="userName" />
					<label className={style.profileLabel}>Email</label>
					<input className={style.profileInput} onChange={onChange} value={data.email || ''} name="email" />
					<label className={style.profileLabel}>Wallet Address</label>
					<p className={style.walletAddress}>{data.walletAddress}</p>
				</div>
			</div>
			<button className={style.saveButton} onClick={onSave}>Save</button>
		</div>
  )
}

export default Profile;
