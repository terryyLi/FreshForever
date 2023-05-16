import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

function SignInFormCard() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await axios.post(
				'https://ffproto1.fly.dev/api/user/login',
				{
					username,
					password,
				}
			);
			console.log(response.data);
			localStorage.setItem('user', JSON.stringify(response.data));
			console.log(JSON.parse(localStorage.getItem('user') || '{}'));
			alert('Success!');
			navigate('/home');
		} catch (error: any) {
			if (error.response && error.response.status === 404) {
				alert('User is not found. Please enter valid username');
			} else if (error.response && error.response.status === 403) {
				alert('Username exists but the password is incorrect');
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
					<Form.Group controlId="formBasicPassword">
						<Form.Label></Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Button
						type="submit"
						className="sign-in-btn rounded-1 border-0 w-100 mt-4 py-2"
					>
						Continue
					</Button>
				</Form>
				<div className="mt-4">
					<p>Don't have an account?</p>
				</div>
				<div>
					<p className="text-decoration-underline">
						<Link to="/signup" className="text-dark">
							Sign Up
						</Link>
					</p>
				</div>
			</Card.Body>
		</Card>
	);
}

export default SignInFormCard;
