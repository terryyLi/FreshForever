import { FoodInterface } from '../util/interfaces';
import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const FOOD_URL = 'https://ffproto1.fly.dev/api/food';
type Props = {
	foodData: FoodInterface[];
};

/**
 * Component to render a store information on the home page
 * @param props
 * @returns
 */
const DangerFoodListCard = (props: Props) => {
	const { foodData } = props;
	const [checkedState, setCheckedState] = useState<any[]>([]);
	useEffect(() => {
		if (checkedState.length === 0) {
			setCheckedState(new Array(foodData.length).fill(false));
		}
	}, [checkedState, foodData]);

	const handleMark = (food: FoodInterface, i: number) => {
		const fetchData = async () => {
			await fetch(`${FOOD_URL}/${food.user}/${food._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		};
		fetchData();
		const updatedCheckedState = checkedState.map((item, index) =>
			index === i ? !item : item
		);

		setCheckedState(updatedCheckedState);
	};

	const checkboxConfirm = (food: FoodInterface, i: number) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className="custom-ui">
						<h1>Are you sure?</h1>
						<p>Have you finished eating the food?</p>
						<button onClick={onClose}>No</button>
						<button
							onClick={() => {
								handleMark(food, i);
								onClose();
							}}
						>
							Yes, I have eaten it!
						</button>
					</div>
				);
			},
		});
	};

	return (
		<>
			<ul>
				{foodData.map((food: FoodInterface, i) => (
					<li key={`food_${i}`}>
						<input
							type="checkbox"
							onChange={(e) => {
								//handleMark(food, i)
								checkboxConfirm(food, i);
							}}
							disabled={checkedState[i]}
							checked={checkedState[i]}
						/>
						<label
							className="normal_word"
							style={{
								textDecoration: checkedState[i] ? 'line-through' : undefined,
							}}
						>
							{food.foodname}{' '}
						</label>

						<span
							className="warning_word"
							style={{
								textDecoration: checkedState[i] ? 'line-through' : undefined,
							}}
						>
							{food.days_to_expire} day(s)
						</span>
					</li>
				))}
			</ul>
		</>
	);
};

export { DangerFoodListCard };
