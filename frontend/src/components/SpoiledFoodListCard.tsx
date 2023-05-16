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
const SpoiledFoodListCard = (props: Props) => {
	const { foodData } = props;
	const [checkedStateSpoiled, setCheckedStateSpoiled] = useState<any[]>([]);
	useEffect(() => {
		if (checkedStateSpoiled.length === 0) {
			setCheckedStateSpoiled(new Array(foodData.length).fill(false));
		}
	}, [checkedStateSpoiled, foodData]);
	console.log(checkedStateSpoiled);
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
		const updatedCheckedState = checkedStateSpoiled.map((item, index) =>
			index === i ? !item : item
		);
		setCheckedStateSpoiled(updatedCheckedState);
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
		<ul>
			{foodData.map((food: FoodInterface, i) => (
				<li key={`food_${i}`}>
					<input
						type="checkbox"
						onChange={(e) => {
							//handleMark(food, i)
							checkboxConfirm(food, i);
						}}
						disabled={checkedStateSpoiled[i]}
						checked={checkedStateSpoiled[i]}
					/>
					<label
						className="warning_word"
						style={{
							textDecoration: checkedStateSpoiled[i]
								? 'line-through'
								: undefined,
						}}
					>
						{food.foodname}{' '}
					</label>
				</li>
			))}
		</ul>
	);
};

export { SpoiledFoodListCard };
