import React from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.css';
import EmailCard from '../components/EmailCard';

const EmailPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Container className="p-5 text-center">
            <div className='d-flex justify-content-center'>
                <EmailCard />
            </div>
        </Container>
        </div>
    )
}

export default EmailPage;
