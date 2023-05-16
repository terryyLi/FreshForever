import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { shoppingFoodInterface } from '../util/interfaces';

//const SHOPPING_URL = 'https://ffproto1.fly.dev/api/shoppinglist';
const SHOPPING_URL = 'https://ffproto1.fly.dev/api/shoppinglist/';

type Props = {
	foodData: shoppingFoodInterface[];
};

/**
 * Component to render a store information on the home page
 * @param props
 * @returns
 */

const ShoppingList = (props: Props) => {
	const { foodData } = props;
	const [checkedState, setCheckedState] = useState<any[]>([]);
	useEffect(() => {
		if (checkedState.length === 0) {
			setCheckedState(new Array(foodData.length).fill(false));
		}
	}, [checkedState, foodData]);

	const handleMark = (food: shoppingFoodInterface, i: number) => {
		const fetchData = async () => {
			await fetch(`${SHOPPING_URL}/${food._id}`, {
				method: 'DELETE',
			});
		};
		fetchData();
		const updatedCheckedState = checkedState.map((item, index) =>
			index === i ? !item : item
		);

		setCheckedState(updatedCheckedState);
	};

	const checkboxConfirm = (food: shoppingFoodInterface, i: number) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className="custom-ui">
						<h1>Are you sure?</h1>
						<button onClick={onClose}>No</button>
						<button
							onClick={() => {
								handleMark(food, i);
								onClose();
							}}
						>
							Yes, I want to remove this!
						</button>
					</div>
				);
			},
		});
	};

	return (
		<>
			<ul className="list-group">
				{foodData.map((food: shoppingFoodInterface, i) => (
					<li key={`food_${i}`} className="list-group-item">
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								onChange={(e) => {
									//handleMark(food, i)
									checkboxConfirm(food, i);
								}}
								disabled={checkedState[i]}
								checked={checkedState[i]}
								aria-label="..."
							/>
							<span
								className="normal_word"
								style={{
									textDecoration: checkedState[i] ? 'line-through' : undefined,
									marginLeft: '10px',
								}}
							>
								{food.food}
							</span>
						</div>
					</li>
				))}
			</ul>
		</>
	);
};

export { ShoppingList };
