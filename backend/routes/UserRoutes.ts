import { Router } from 'express';
import { User } from '../models/UserModel';
import { sendEmail, verifyEmail, isEmailVerified } from '../utils/Email';

interface RegisterParams {
	username: string;
	password: string;
	email: string;
}

interface LoginParams {
	username: string;
	password: string;
}

const router = Router();

router.post<{ Body: RegisterParams }>('/register', async (req, res) => {
	try {
		const newUsername = req.body.username;
		const users = await User.find({});
		const exists = users.find((user) => user.username === newUsername);
		if (exists) {
			res.sendStatus(409);
		} else {
			try {
				const newUser = new User(req.body);
				await newUser.save();
				const sentUser = await User.findOne({ username: newUsername });
				res.status(201).send(sentUser);
			} catch (error) {
				res.sendStatus(400);
			}
		}
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

router.post<{ Body: LoginParams }>('/login', async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		const user = await User.findOne({ username: username });
		if (user) {
			if (user.password === password) {
				res.status(201).send(user);
			} else {
				res.sendStatus(403);
			}
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		res.sendStatus(500);
	}
});

// get user info
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			res.status(200).send(user);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		res.sendStatus(500);
	}
});

router.post('/verify-email', async (req, res) => {
	const email = req.body.email;
  
	try {
	  await verifyEmail(email);
	  res.sendStatus(200);
	} catch (error) {
	  console.error(`Failed to verify email for ${email}.`, error);
	  res.sendStatus(500);
	}
  });

router.post('/check-email-verification', async (req, res) => {
	const email = req.body.email;

	try {
		const isVerified = await isEmailVerified(email);
		res.status(200).send({ isVerified });
	} catch (error) {
		console.error(`Failed to check email verification status for ${email}.`, error);
		res.sendStatus(500);
	}
});

router.post('/send-email', async (req, res) => {
	const to = req.body.email;
	const subject = req.body.subject;
	const body = req.body.body;
	try {
	  await sendEmail(to, subject, body);
	  res.sendStatus(200);
	} catch (error) {
	  console.error(`Failed to send email for ${to}.`, error);
	  res.sendStatus(500);
	}
  });
  

export const UserRoutes = router;
