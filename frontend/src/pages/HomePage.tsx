import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { Button, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { SpoiledFoodListCard } from '../components/SpoiledFoodListCard';
import { DangerFoodListCard } from '../components/DangerFoodListCard';
import axios from 'axios';
import { FoodInterface } from '../util/interfaces';

import '../App.css';
import NavBar from '../components/NavBar';
import { User } from '../assets/Type';
import { LineGraph } from '../components/LineGraph';
import { DonutGraph } from '../components/DonutGraph';

const FOOD_URL = 'https://ffproto1.fly.dev/api/food';

const HomePage: React.FC = () => {
 // use line 15 to get user data in local storage
 const [user, setUser] = useState<User>(
  JSON.parse(localStorage.getItem('user') || '{}')
 );
 const userId = user ? user._id : null;
 console.log(user);
 console.log(user._id);
 const [doneRatio, setDoneRatio] = useState<number>(0.5);
 const [expiredNum, setExpiredNum] = useState<number>(0);

 const [lineGraphDataSets, setLineGraphDataSets] = useState<string[]>(["1", "2", "3"]);
 const [lineGraphGraphTopic, setLineGraphGraphTopic] = useState<string>("Hi");
 const [lineGraphDataVals, setLineGraphDataVals] = useState<number[]>([1, 2, 3]);

 const [donutGraphDataSets, setDonutGraphDataSets] = useState<string[]>(["1", "2", "3"]);
 const [donutGraphGraphTopic, setDonutGraphGraphTopic] = useState<string>("Hi");
 const [donutGraphDataVals, setDonutGraphDataVals] = useState<number[]>([1, 2, 3]);

 const navigate = useNavigate();

 const handlePageClick = () => {
  navigate('/detail');
 };

 const [foodItems, setFoodItems] = useState<FoodInterface[]>([]);

 useEffect(() => {
  async function fetchUser() {
   try {
    const response = await axios.get(
     `https://ffproto1.fly.dev/api/user/${userId}`
    );
    setUser(response.data);
    console.log('success');
    console.log(response.data);
   } catch (error) {
    console.error(error);
   }
  }
  if (userId) {
   fetchUser();
  }
 }, [userId]);

 useEffect(() => {
  //fetch(`${FOOD_URL}/${user._id}`, { mode: 'cors' }).then((res) => {
  fetch(`${FOOD_URL}/${userId}/undone`)
   .then((res) => {
    return res.json();
   })
   .then((data) => {
    setFoodItems([...data]);
   })
   .catch((err) => {
    console.log(err);
   });
 }, [userId]);

 useEffect(() => {
  fetch(`https://ffproto1.fly.dev/api/stat/${userId}/00`)
  .then((res) => {
   return res.json();
  })
  .then((data) => {
   console.log("data 00: ", data);
   setExpiredNum(data.expired);
   setDoneRatio(Math.floor(((data.total - data.undone) / data.total) * 100));
  })
  .catch((err) => {
   console.log(err);
  });

  fetch(`https://ffproto1.fly.dev/api/stat/${userId}/01`)
  .then((res) => {
   return res.json();
  })
  .then((data) => {
   console.log("data 01: ", data);
   const dates = [];
   const values = [];
   for(let i = 0; i < data.length; i++) {
    dates.push(data[i].expiration_date); 
    values.push(data[i].count); 
   }
   setLineGraphDataSets(dates);
   setLineGraphDataVals(values);
   setLineGraphGraphTopic("Food Number")
  })
  .catch((err) => {
   console.log(err);
  });

  fetch(`https://ffproto1.fly.dev/api/stat/${userId}/02`)
  .then((res) => {
   return res.json();
  })
  .then((data) => {
   console.log("data 02: ", data);
   const categories = [];
   const counts = [];
   for(let i = 0; i < data.length; i++) {
    categories.push(data[i].category); 
    counts.push(data[i].count); 
   }
   setDonutGraphDataSets(categories);
   setDonutGraphDataVals(counts);
   setDonutGraphGraphTopic("Food Count")
  })
  .catch((err) => {
   console.log(err);
  });
 }, [userId]);

 const spoiled_food = foodItems.filter((food) => food.freshness === 'spoiled');
 const danger_food = foodItems.filter((food) => food.freshness === 'danger');
 console.log(foodItems);

 return (
  <div>
   <NavBar />
   <Container className="pb-4">
    <Container className="row">
     <div className="col-7">
      <Container className="row mt-5">
       <Container className="p-2 mt-3">
        <div>
         <h2 className="text-left">Food In Danger</h2>
         <div className="d-flex align-items-center">
          <div className="green_line"></div>
          <div className="grey_line"></div>
         </div>
        </div>
       </Container>
      </Container>
      <Container className="p-2  mt-4">
       <div className="food_container">
        <DangerFoodListCard foodData={danger_food} />
       </div>
      </Container>
      <Container className="p-2 mt-3">
       <div>
        <h2 className="text-left">Spoiled Food</h2>
        <div className="d-flex align-items-center">
         <div className="green_line"></div>
         <div className="grey_line"></div>
        </div>
       </div>
      </Container>
      <Container className="p-2 mt-4">
       <div
        className="food_container"
        style={{ backgroundColor: '#ECFFEC' }}
       >
        <SpoiledFoodListCard foodData={spoiled_food} />
       </div>
      </Container>
      <Container className="p-2 mt-4">
       <Button
        className="page_change_button btn-lg"
        onClick={handlePageClick}
       >
        See the complete list -{'>'}
       </Button>
      </Container>
     </div>
     <div className="col-5 pt-4 mt-5 d-flex flex-column align-items-center align-self-end">
      <Container className="p-2 text-center pt-4 mt-5">
       {user.score >= 30 ? (
        <img
         className="img-fluid"
         src={require('../assets/trees/tree-large.svg').default}
         alt={`Tree for ${user.username}`}
        />
       ) : user.score >= 5 ? (
        <img
         className="img-fluid"
         src={require('../assets/trees/tree-medium.svg').default}
         alt={`Tree for ${user.username}`}
        />
       ) : (
        <img
         className="img-fluid"
         src={require('../assets/trees/tree-small.svg').default}
         alt={`Tree for ${user.username}`}
        />
       )}
      </Container>
      <Container className="p-2 pt-4">
       {user.score >= 30 ? (
        <div>
         <h3>Congratulations, {user.username}!  <br></br></h3>
         <h4>Your tree is flourishing and has grown into a magnificent specimen!</h4>
        </div>
       ) : user.score >= 5 ? (
        <div>
         <h3>{user.username},  <br></br></h3>
         <h4>Your tree is growing steadily. Keep up the good work to nurture it into a healthy tree.</h4> 
        </div>
       ) : (
        <div>
         <h3>{user.username}, <br></br></h3>
         <h4>Your tree is not thriving yet. Eat food to see it grow.</h4>
        </div>
       )}
      </Container>
     </div>
    </Container>
    <Container className="row p-4 mt-5 justify-content-center">
     <h2>Stats: </h2>
     <h4>You have {expiredNum} expired food</h4>
     <h4>You have eaten {doneRatio}% of your food</h4>
     <h4>Your total score is: {user.score}</h4>
     <Row className="justify-content-center mt-4">
      <Col md={7} className='bg-light rounded' style={{backgroundColor: "#c7ffd7"}}>
      <Container className="p-2">
       {/* <BarGraph dataSets={barGraphDataSets} graphTopic={barGraphGraphTopic} dataVals={barGraphDataVals} /> */}
       <LineGraph dataSets={lineGraphDataSets} graphTopic={lineGraphGraphTopic} dataVals={lineGraphDataVals}></LineGraph>
      </Container>
      </Col>
      <Col md={1}>
      </Col>
      <Col md={4} className='bg-light rounded'>
      <Container className="p-2 mx-auto">
       <DonutGraph dataSets={donutGraphDataSets} graphTopic={donutGraphGraphTopic} dataVals={donutGraphDataVals} />
      </Container>
      </Col>
     </Row>
    </Container>
   </Container>
  </div>
 );
};

export default HomePage;