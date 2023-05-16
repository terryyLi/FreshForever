import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import '../App.css';
import { User } from '../assets/Type';
import { ShoppingListItemInterface } from '../util/interfaces';

export interface ShoppingListPopupProps {
	shoppinglistPopup: boolean;
	setshoppinglistPopup: (open: boolean) => void;
}

//const SHOPPING_URL = 'https://ffproto1.fly.dev/api/shoppinglist';
const SHOPPING_URL = 'https://ffproto1.fly.dev/api/shoppinglist/';

export const ShoppingListPopup = (props: ShoppingListPopupProps) => {
	const [selectFoodList, setSelectFoodList] = useState<
		ShoppingListItemInterface[]
	>([]);
	const [selectFood, setSelectFood] = useState<ShoppingListItemInterface>();
	const [user] = useState<User>(
		JSON.parse(localStorage.getItem('user') || '{}')
	);
	const userId = user ? user._id : undefined;

	const handleFoodName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		if (inputValue) {
			const foodName = inputValue;
			const updatedFood = { ...selectFood, food: foodName };
			setSelectFood(updatedFood);
		}
	};

	const handleAddFood = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(selectFood);
		if (selectFood) {
			setSelectFoodList((prevList) => [...prevList, selectFood]);
		}
	};

	const handleDelete = (rowIndex: number) => {
		setSelectFoodList((prevFoodList) =>
			prevFoodList.filter((_, index) => index !== rowIndex)
		);
	};

	const handleClickSubmit = () => {
		const postData: ShoppingListItemInterface[] = selectFoodList.map(
			(food) => ({
				user: userId,
				food: food.food,
			})
		);
		const fetchData = async () => {
			await fetch(`${SHOPPING_URL}`, {
				method: 'POST',
				body: JSON.stringify(postData),
				headers: {
					'Content-Type': 'application/json',
				},
				keepalive: true
			});
		};
		fetchData();
		window.close();
		window.location.href = '/detail';
		window.location.reload();
	};

	return (
		<Modal id="popupWindow" show={props.shoppinglistPopup} centered size="xl">
			<Modal.Header>
				<button
					type="button"
					className="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
					onClick={() => props.setshoppinglistPopup(false)}
				></button>
			</Modal.Header>

			<Modal.Body>
				<div id="modal-body">
					<h2 id="checklist">Shopping List</h2>
					<div id="checklist-container">
						<div id="left-side">
							<div id="left-side-table">
								<table id="checklist-table">
									<thead id="checklist-table-head">
										<tr>
											<th scope="col" style={{ width: '50%' }}>
												Index
											</th>
											<th scope="col" style={{ width: '50%' }}>
												Items
											</th>
										</tr>
									</thead>
									<tbody>
										{selectFoodList.length > 0 ? (
											selectFoodList.map((rowData, index) => (
												<tr key={index}>
													<td>{index + 1}</td>
													<td>{rowData.food}</td>
													<td style={{ paddingRight: '15px' }}>
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

						<div className="form-group">
							<label id="expiration-Date-label" htmlFor="category-detail-list">
								Type in the Food you want to buy!
							</label>
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									id="expiration-date-input"
									onChange={handleFoodName}
								/>
							</div>
						</div>

						<form onSubmit={handleAddFood}>
							<div id="add-button-wrap" className="form-group mt-3">
								<button type="submit" className="add-button">
									Add
								</button>
							</div>
						</form>
					</div>
				</div>

				<div id="submit-button-wrap">
					<button id="submit-button" onClick={handleClickSubmit}>
						<img
							src={require('../assets/avocado.png')}
							alt="avocado"
							id="avocado"
						></img>
						Submit Shopping List
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
};
