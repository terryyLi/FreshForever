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
const WholeFoodListCard = (props: Props) => {
	const { foodData } = props;
	const [checkedState, setCheckedState] = useState<any[]>([]);
	useEffect(() => {
		if (checkedState.length === 0) {
			setCheckedState(new Array(foodData.length).fill(false));
		}
	}, [checkedState, foodData]);
	const danger_food = foodData.filter((food) => food.freshness === 'spoiled');
	const warn_food = foodData.filter((food) => food.freshness === 'danger');
	const normal_food = foodData.filter((food) => food.freshness === 'normal');

	const handleMark = (food: FoodInterface, i: number, tag: string) => {
		const fetchData = async () => {
			await fetch(`${FOOD_URL}/${food.user}/${food._id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		};
		fetchData();
		if (tag === 'warning') {
			i = danger_food.length + i;
		} else if (tag === 'normal') {
			i = danger_food.length + warn_food.length + i;
		}
		const updatedCheckedState = checkedState.map((item, index) =>
			index === i ? !item : item
		);

		setCheckedState(updatedCheckedState);
	};

	const checkboxConfirm = (food: FoodInterface, i: number, tag: string) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className="custom-ui">
						<h1>Are you sure?</h1>
						<p>Have you finished eating the food?</p>
						<button onClick={onClose}>No</button>
						<button
							onClick={() => {
								handleMark(food, i, tag);
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
			{danger_food.map((food: FoodInterface, i) => (
				<div
					className="food_item mt-4"
					id={`food_${i}`}
				>
					<input
						style={{ width: '25px' }}
						type="checkbox"
						onChange={() => {
							checkboxConfirm(food, i, 'danger');
						}}
						disabled={checkedState[i]}
						checked={checkedState[i]}
					/>
                    <div className = "food_list_content">
                            <span  className="warning_word"
                                style={{
                                    textDecoration: checkedState[i] ? 'line-through' : undefined,
                                }}
                            >
                                {food.foodname}{' '}
                            </span>
                            <span  className="warning_word"
                                style={{
                                    textDecoration: checkedState[i] ? 'line-through' : undefined,
                                }}
                            >
                                {food.days_to_expire} Day(s)
                            </span>
                            <img
                                className="warning_icon"
                                src={require('../assets/Warning.svg').default}
                                alt={'warning'}
                            />
                    </div>
				</div>
			))}
			{warn_food.map((food: FoodInterface, i) => (
				<div
					className="food_item mt-4"
					id={`food_${i}`}

				>
					<input
						style={{ width: '25px' }}
						type="checkbox"
						onChange={() => {
							checkboxConfirm(food, i, 'warning');
						}}
						disabled={checkedState[i + danger_food.length]}
						checked={checkedState[i + danger_food.length]}
					/>
                    <div className = "food_list_content">
                        <span
                            className="normal_word"
                            style={{
                                textDecoration: checkedState[i + danger_food.length]
                                    ? 'line-through'
                                    : undefined,
                            }}
                        >
                            {food.foodname}{' '}
                        </span>
                        <span
                            className="normal_word"
                            style={{
                                textDecoration: checkedState[i + danger_food.length]
                                    ? 'line-through'
                                    : undefined,
                            }}
                        >
                            {food.days_to_expire} Day(s)
                        </span>
                        <img
                            src={require('../assets/SmallWarning.svg').default}
                            alt={'small warning'}
                            className="warning_icon"
                        />
                    </div>
				</div>
			))}

			{normal_food.map((food: FoodInterface, i) => (
				<div
					className="food_item mt-4"
					id={`food_${i}`}

				>
					<input
						style={{ width: '25px' }}
						type="checkbox"
						onChange={() => {
							checkboxConfirm(food, i, 'normal');
						}}
						disabled={checkedState[danger_food.length + warn_food.length + i]}
						checked={checkedState[danger_food.length + warn_food.length + i]}
					/>
                    <div className = "food_list_content">
                        <span
                            className="normal_word"
                            style={{
                                textDecoration: checkedState[
                                    danger_food.length + warn_food.length + i
                                ]
                                    ? 'line-through'
                                    : undefined,
                            }}
                        >
                            {food.foodname}{' '}
                        </span>
                        <span
                            className="normal_word"
                            style={{
                                textDecoration: checkedState[
                                    danger_food.length + warn_food.length + i
                                ]
                                    ? 'line-through'
                                    : undefined,
                            }}
                        >
                            {food.days_to_expire} Day(s)
                        </span>
                        <img
                            src={require('../assets/Ok.svg').default}
                            alt={'ok'}
                            className="warning_icon"
                        />
                    </div>
				</div>
			))}
		</ul>
	);
};

export { WholeFoodListCard };