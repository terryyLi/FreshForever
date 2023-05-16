import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../assets/Type';
import '../index.css';

function EmailCard() {
	const [user] = useState<User>(
		JSON.parse(localStorage.getItem('user') || '{}')
	);
	const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
	const email = user ? user.email : null;
	console.log('userEmail: ' + email);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('here');
		try {
			const response = await axios.post(
				'https://ffproto1.fly.dev/api/user/check-email-verification',
				{ email }
			);
			setIsEmailVerified(response.data.isVerified);
			console.log('isVerified is: ' + response.data.isVerified);
			if (isEmailVerified) {
				alert('You are verified!');
				console.log('verified');
				const subject = 'Welcome!';
				const body = `${user.username}`;
				await axios.post('https://ffproto1.fly.dev/api/user/send-email', {
					email,
					subject,
					body,
				});
				console.log('email sent');
				navigate('/detail');
			} else {
				alert(
					'Please click the link we sent you to verify your email and try again.'
				);
				console.log('not');
			}
		} catch (error) {
			console.error(error);
			setIsEmailVerified(false);
			alert('Please verify your email');
		}
	};

	return (
		<Card className="d-flex align-items-center justify-content-center shadow-sm">
			<div className="p-2 mt-4">
				<Card.Img
					src={require('../assets/logo.svg').default}
					alt="Fresh Forever logo"
					className="img-fluid"
				/>
			</div>
			<Card.Body className="d-flex flex-column align-items-center w-100 px-5">
				<Card.Title>
					<h3 className="font-weight-bold">Please Verify Your Email</h3>
				</Card.Title>
				<Form onSubmit={handleSubmit} className="w-100">
					<Button
						type="submit"
						className="sign-in-btn rounded-1 border-0 w-100 mt-4 py-2"
					>
						I've Verified
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default EmailCard;
