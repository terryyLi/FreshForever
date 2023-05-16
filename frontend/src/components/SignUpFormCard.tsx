import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function SignUpFormCard() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const navigate = useNavigate();

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const passwordValue = event.target.value;
		setPassword(passwordValue);
		// perform password validation and set error message if invalid
		if (
			!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(
				passwordValue
			)
		) {
			setPasswordError(
				'Password must contain at least 8 characters including 1 uppercase letter, 1 lowercase letter, and 1 number'
			);
		} else {
			setPasswordError('');
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (passwordError !== '') {
			return;
		}
		try {
			const response = await axios.post(
				// 'https://ffproto1.fly.dev/api/user/register',
				'https://ffproto1.fly.dev/api/user/register',
				{
					username,
					email,
					password,
				}
			);
			console.log(response.data);
			localStorage.setItem('user', JSON.stringify(response.data));
			console.log(JSON.parse(localStorage.getItem('user') || '{}'));
			await axios.post('https://ffproto1.fly.dev/api/user/verify-email', {
				email,
			});
			alert('Success!');
			navigate('/verify-email');
		} catch (error: any) {
			if (error.response && error.response.status === 409) {
				alert('This username is already taken. Please choose a different one.');
			} else {
				alert('Oops! Something went wrong, please try again');
				console.error(error);
			}
		}
	};

	return (
		<Card className="my-card d-flex align-items-center justify-content-center shadow-sm">
			<div className="p-2 mt-4">
				<Card.Img
					src={require('../assets/logo.svg').default}
					alt="Fresh Forever logo"
					className="img-fluid"
				/>
			</div>
			<Card.Body className="d-flex flex-column align-items-center w-100 px-5">
				<Card.Title>
					<h2 className="font-weight-bold">Fresh Forever</h2>
				</Card.Title>
				<Card.Text>Keep You Food Fresh, Never Let Them Cry</Card.Text>
				<Form onSubmit={handleSubmit} className="w-100">
					<Form.Group controlId="formBasicUsername" className="w-100 mb-1">
						<Form.Label></Form.Label>
						<Form.Control
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="py-2"
						/>
					</Form.Group>
					<Form.Group controlId="formBasicEmail" className="w-100 mb-1">
						<Form.Label></Form.Label>
						<Form.Control
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="py-2"
						/>
					</Form.Group>
					<Form.Group controlId="formBasicPassword">
						<Form.Label></Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							value={password}
							onChange={handlePasswordChange}
						/>
						{passwordError && (
							<Form.Text className="text-danger">{passwordError}</Form.Text>
						)}
					</Form.Group>
					<Button
						type="submit"
						className="sign-in-btn rounded-1 border-0 w-100 mt-4 py-2"
					>
						Continue
					</Button>
				</Form>
				<div className="mt-4">
					<p>Already have an account?</p>
				</div>
				<div>
					<p className="text-decoration-underline">
						<Link to="/signin" className="text-dark">
							Sign In
						</Link>
					</p>
				</div>
			</Card.Body>
		</Card>
	);
}

export default SignUpFormCard;
