import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ClaimDocumentPagePopup } from '../components/ClaimDocumentPagePopup';
import { FoodInterface } from '../util/interfaces';
import { WholeFoodListCard } from '../components/WholeFoodCard';
import { User } from '../assets/Type';
import { ShoppingListPopup } from '../components/ShoppingListPopup';
import { ShoppingList } from '../components/ShoppingList';
import { shoppingFoodInterface } from '../util/interfaces';

import '../App.css';
import NavBar from '../components/NavBar';

const FOOD_URL = 'https://ffproto1.fly.dev/api/food';
//const SHOPPING_URL = 'https://ffproto1.fly.dev/api/shoppinglist/';
const SHOPPING_URL = 'https://ffproto1.fly.dev/api/shoppinglist/';

const DetailPage: React.FC = () => {
	const navigate = useNavigate();

	const handlePageClick = () => {
		navigate('/home');
	};

	//popup window
	const [claimDocumentPageOpen, setClaimDocumentPageOpen] =
		useState<boolean>(false);

	const onDocumentPagePopup = () => {
		setClaimDocumentPageOpen(true);
		//setClaim(claim)

		// claim.type.toLowerCase() !== 'parking' && getDocumentHandeler('fuel', claim.uuid)
		// claim.type.toLowerCase() === 'parking' && getDocumentHandeler('parking', claim.uuid)
	};

	const [user] = useState<User>(
		JSON.parse(localStorage.getItem('user') || '{}')
	);
	const userId = user ? user._id : null;
	const [foodItems, setFoodItems] = useState<FoodInterface[]>([]);
	useEffect(() => {
		//fetch(`${FOOD_URL}/${user._id}`, { mode: 'cors' }).then((res) => {
		fetch(`${FOOD_URL}/${userId}/undone`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				setFoodItems([...data]);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [userId]);

	//popup window
	const [shoppinglistPopup, setshoppinglistPopup] = useState<boolean>(false);

	const shoppingPopup = () => {
		setshoppinglistPopup(true);
	};

	const [shoppingItems, setShoppingItems] = useState<shoppingFoodInterface[]>(
		[]
	);
	useEffect(() => {
		//fetch(`${FOOD_URL}/${user._id}`, { mode: 'cors' }).then((res) => {
		fetch(`${SHOPPING_URL}/${userId}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				setShoppingItems([...data]);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [userId]);

	return (
		<div>
			<NavBar />
			<Container className="pb-4">
				<Container className="row">
					<div className="col-7">
						<Container className="row mt-5">
							<Container className="p-2 mt-3">
								<div>
									<h2 className="text-left">Food List</h2>
									<div className="d-flex align-items-center">
										<div className="green_line"></div>
										<div className="grey_line"></div>
									</div>
								</div>
							</Container>
						</Container>
						<Container className="p-2  mt-4">
							<div
								className="food_container mt-4"
								style={{ backgroundColor: 'white', height: '50vh' }}
							>
								<WholeFoodListCard foodData={foodItems} />
							</div>
						</Container>
						<Container className="p-2 mt-4">
							<Button
								style={{
									top: '350px',
									borderColor: 'transparent',
									borderRadius: '5px',
									fontWeight: '600',
									fontSize: '20px',
								}}
								className="page_change_button btn-lg mt-4"
								onClick={handlePageClick}
							>
								{'<'}- Go back to Home Page
							</Button>
						</Container>
					</div>
					<div className="col-5 mt-5 pt-5">
						<Container className="p-2 text-center pt-5 mt-5">
							<Button
								style={{
									borderColor: 'transparent',
									borderRadius: '5px',
									fontWeight: '600',
									fontSize: '20px',
								}}
								className="operate_button btn-lg"
								onClick={() => {
									onDocumentPagePopup();
								}}
							>
								Add food -{'>'}
							</Button>

							<ClaimDocumentPagePopup
								claimDocumentPageOpen={claimDocumentPageOpen}
								setClaimDocumentPageOpen={setClaimDocumentPageOpen}
							/>
						</Container>
						<Container className="p-2 text-center pt-4">
							<Button
								className="operate_button btn-lg"
								style={{
									top: '350px',
									borderColor: 'transparent',
									borderRadius: '5px',
									fontWeight: '600',
									fontSize: '20px',
								}}
								onClick={() => {
									shoppingPopup();
								}}
							>
								Add shopping list -{'>'}
							</Button>
							<ShoppingListPopup
								shoppinglistPopup={shoppinglistPopup}
								setshoppinglistPopup={setshoppinglistPopup}
							/>
						</Container>
						<Container className="p-2  mt-4">
							<h3 className="text-left">Shopping List</h3>
							<div
								className="food_container mt-4"
								style={{
									backgroundColor: 'white',
									height: '30vh',
									width: '30vh',
								}}
							>
								<ShoppingList foodData={shoppingItems} />
							</div>
						</Container>
					</div>
				</Container>
				<Container>
					<div className="vegetable_deco">
						<img
							src={require('../assets/vgbg.svg').default}
							alt={'vegetable background'}
						/>
					</div>
				</Container>
			</Container>
		</div>
	);
};

export default DetailPage;
