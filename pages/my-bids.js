import Axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Bid from '../components/Bid'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import useStore from '../store'

const MyBids = () => {
	const store = useStore()
	const [page, setPage] = useState(0)
	const [bidsData, setBidsData] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (bidsData.length === 0 && hasMore && store.currentUser) {
			_fetchData()
		}
	}, [store.currentUser])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await Axios(
			`${process.env.API_URL}/bids?accountId=${store.currentUser}&__skip=${
				page * 10
			}&isReceived=true&__limit=10`
		)
		const newData = await res.data.data

		const newBidsData = [...bidsData, ...newData.results]
		setBidsData(newBidsData)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const updateBidData = (bidId) => {
		const updatedData = bidsData.filter((bid) => bid.id !== bidId)
		setBidsData(updatedData)
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>My Bids — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-4xl relative m-auto py-12 px-4 md:px-0">
				<div className="font-bold text-4xl text-gray-100 mb-4">My Bids</div>
				<InfiniteScroll
					dataLength={bidsData.length}
					next={_fetchData}
					hasMore={hasMore}
					loader={
						<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
							<p className="my-2 text-center">Loading...</p>
						</div>
					}
				>
					{bidsData.map((bid) => (
						<div key={bid._id}>
							<Bid
								tokenId={bid.tokenId}
								data={bid}
								updateBidData={updateBidData}
							/>
						</div>
					))}
					{bidsData.length === 0 && !isFetching && (
						<div className="border-2 border-dashed p-2 rounded-md text-center border-gray-800">
							<p className="my-4 text-center text-gray-200">
								You have no active bid
							</p>
						</div>
					)}
				</InfiniteScroll>
			</div>
			<Footer />
		</div>
	)
}

export default MyBids
