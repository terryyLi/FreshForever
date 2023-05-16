import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import '../App.css';
import { User } from '../assets/Type';

export interface ClaimDocumentPagePopupProps {
	claimDocumentPageOpen: boolean;
	setClaimDocumentPageOpen: (open: boolean) => void;
}

interface Food {
	_id: string;
	foodname: string;
	rottentime: number | undefined;
	category: string;
}

interface FoodWithDaysToExpiration {
	user: string | null;
	food: string;
	days_to_expiration: number;
}

export const ClaimDocumentPagePopup = (props: ClaimDocumentPagePopupProps) => {
	const [foodList, setFoodList] = useState<Food[]>([]);
	const [selectCategory, setSelectCategory] =
		useState<string>('Select a category');
	const [selectedCategoryList, setselectedCategoryList] = useState<Food[]>([]);
	const [selectFoodName, setSelectFoodName] = useState<string>('Select a food');
	const [selectFood, setSelectFood] = useState<Food>();
	const [selectFoodList, setSelectFoodList] = useState<Food[]>([]);
	const [rottentime, setRottentime] = useState<Number | undefined>();
	const [user] = useState<User>(
		JSON.parse(localStorage.getItem('user') || '{}')
	);
	const userId = user ? user._id : null;

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch('https://ffproto1.fly.dev/api/foodcatalog/');
			const data = await response.json();
			setFoodList(data);
		};
		fetchData();
	}, []);

	const handleClickSubmit = () => {
		const postData: FoodWithDaysToExpiration[] = selectFoodList.map((food) => ({
			user: userId,
			food: food._id,
			days_to_expiration: food.rottentime ?? 0,
		}));

		axios
			.post('https://ffproto1.fly.dev/api/food/', postData)
			.then((response) => {
				console.log(response.data);
				window.close();
				window.location.href = '/detail';
				window.location.reload();
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleSelectCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const category = event.target.value;
		if (category === 'Select a category') {
			setSelectCategory('Select a category');
			setSelectFoodName('Select a food');
			setselectedCategoryList([]);
			setSelectFood(undefined);
			setRottentime(undefined);
		} else {
			const filteredFoodList = foodList.filter(
				(food) => food.category === category
			);
			setselectedCategoryList(filteredFoodList);
			setSelectCategory(category);
			const selectedFood = filteredFoodList[0];
			if (selectedFood) {
				setSelectFoodName(selectedFood.foodname);
				setSelectFood(selectedFood);
				setRottentime(selectedFood.rottentime || 0);
			}
		}
	};

	const handleSelectFoodChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const food = event.target.value;
		const selectedFood = selectedCategoryList.find(
			(item) => item.foodname === food
		);
		if (selectedFood) {
			setSelectFoodName(selectedFood.foodname);
			setSelectFood(selectedFood);
			setRottentime(selectedFood.rottentime);
		}
	};

	const handleChangeRottenTime = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const inputValue = event.target.value;
		if (!isNaN(inputValue as any)) {
			const newRottenTime = inputValue ? Number(inputValue) : undefined;
			if (selectFood && newRottenTime !== selectFood.rottentime) {
				const updatedFood = { ...selectFood, rottentime: newRottenTime };
				setSelectFood(updatedFood);
			}
			setRottentime(newRottenTime);
		}
	};

	const handleAddFood = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (selectFood) {
			setSelectFoodList((prevList) => [...prevList, selectFood]);
		}
	};

	const handleDelete = (rowIndex: number) => {
		setSelectFoodList((prevFoodList) =>
			prevFoodList.filter((_, index) => index !== rowIndex)
		);
	};

	return (
		<Modal
			id="popupWindow"
			show={props.claimDocumentPageOpen}
			centered
			size="xl"
		>
			<Modal.Header>
				<button
					type="button"
					className="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
					onClick={() => props.setClaimDocumentPageOpen(false)}
				></button>
			</Modal.Header>

			<Modal.Body>
				<div id="modal-body">
					<h2 id="checklist">Checklist</h2>
					<div id="checklist-container">
						<div id="left-side">
							<div id="left-side-table">
								<table id="checklist-table">
									<thead id="checklist-table-head">
										<tr>
											<th scope="col" style={{ width: '5%' }}>
												Index
											</th>
											<th scope="col" style={{ width: '35%' }}>
												Items
											</th>
											<th scope="col" style={{ width: '20%' }}>
												Categories
											</th>
											<th scope="col" style={{ width: '20%' }}>
												Expiration
											</th>
											<th
												scope="col"
												style={{ width: '10%', paddingRight: '15px' }}
											></th>
										</tr>
									</thead>
									<tbody>
										{selectFoodList.length > 0 ? (
											selectFoodList.map((rowData, index) => (
												<tr key={index}>
													<td style={{ width: '5%' }}>{index + 1}</td>
													<td style={{ width: '35%' }}>{rowData.foodname}</td>
													<td style={{ width: '20%' }}>{rowData.category}</td>
													<td style={{ width: '20%' }}>
														{(rowData?.rottentime ?? 0).toString()} days
													</td>
													<td style={{ width: '10%', paddingRight: '15px' }}>
														<img
															src={require('../assets/x-circle.svg').default}
															alt="File Minus Icon"
															onClick={() => handleDelete(index)}
														/>
													</td>
												</tr>
											))
										) : (
											<tr style={{ height: '50%' }}>
												<td
													colSpan={5}
													style={{
														textAlign: 'center',
														verticalAlign: 'middle',
													}}
												>
													<div
														style={{
															display: 'inline-block',
															marginTop: '10%',
														}}
													>
														No items in the list
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>

						<div id="right-side">
							<div id="select-card">
								<div id="category-list-form">
									<div className="form-group">
										<label id="category-list-label" htmlFor="category-list">
											Select a category
										</label>
										<select
											className="form-select"
											id="category-list"
											value={selectCategory}
											onChange={handleSelectCategoryChange}
										>
											<option value="Select a category">
												Select a category
											</option>
											{Array.from(
												new Set(foodList.map((food) => food.category))
											).map((category) => (
												<option key={category} value={category}>
													{category}
												</option>
											))}
										</select>
									</div>
								</div>

								<div id="category-detail-list-form">
									<div className="form-group">
										<label
											id="category-detail-list-label"
											htmlFor="category-detail-list"
										>
											Select a item
										</label>
										<select
											className="form-select"
											id="category-detail-list"
											value={selectFoodName}
											onChange={handleSelectFoodChange}
										>
											<option value="Select a food">Select a food</option>
											{Array.from(
												new Set(
													selectedCategoryList.map((food) => food.foodname)
												)
											).map((foodname) => (
												<option key={foodname} value={foodname}>
													{foodname}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="form-group">
									<label
										id="expiration-Date-label"
										htmlFor="category-detail-list"
									>
										Expiration Date
									</label>
									<div className="input-group">
										<input
											type="text"
											className="form-control"
											id="expiration-date-input"
											value={
												rottentime === undefined ? '' : rottentime.toString()
											}
											onChange={handleChangeRottenTime}
										/>
									</div>
								</div>

								<form onSubmit={handleAddFood}>
									<div id="add-button-wrap" className="form-group">
										<button type="submit" className="add-button">
											Add
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>

					<div id="submit-button-wrap">
						<button id="submit-button" onClick={handleClickSubmit}>
							<img
								src={require('../assets/avocado.png')}
								alt="avocado"
								id="avocado"
							></img>
							Submit Checklist
						</button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};
