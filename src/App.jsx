import React, { useState } from 'react';
import TestSetup from './components/TestSetup';
import TestCreationForm from './components/TestCreationForm';
import TestResults from './components/TestResults';
import './styles/styles1.css';
import ResultPage from './components/ResultPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './components/TestPage';
import TestListPage from './components/TestListPage';

const Home = () => {
    const getRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        return randomColor;
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [testData, setTestData] = useState({
        title: '',
        description: '',
        type: 'simple',
        questions: [
            {
                id: 1,
                questionText: '',
                useRadio: true,
                answers: [
                    { id: 'ans:1.1', text: '', changes: { change_1: { scaleId: 0, scaleValue: 1 } } },
                    { id: 'ans:1.2', text: '', changes: { change_1: { scaleId: 0, scaleValue: 0 } } }
                ]
            }
        ],
        scales: [{ id: 1, name: 'Scale #1', color: getRandomColor() }],
        results: 'none'
    });

    const sendDataFunc = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData),
            });
    
            if (response.ok) {
                const result = await response.json();
                window.location.href = result.url; // Перенаправляем на страницу теста
            } else {
                console.error('Error saving data');
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    };
    
    

    return (
        <div className="app-container">
            {currentStep === 1 && (
                <TestSetup
                    testData={testData}
                    setTestData={setTestData}
                    goToNextStep={() => setCurrentStep(2)}
                />
            )}
            {currentStep === 2 && (
                <TestCreationForm
                    testData={testData}
                    setTestData={setTestData}
                    goToPreviousStep={() => setCurrentStep(1)}
                    goToNextStep={() => setCurrentStep(3)}
                />
            )}
            
            {currentStep === 3 && (
                <TestResults
                    testData={testData}
                    setTestData={setTestData}
                    goToPreviousStep={() => setCurrentStep(2)}
                    sendData={sendDataFunc}
                />
            )}

        </div>
    );
};

const Res = () => {
    return (
        <ResultPage/>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/res" element={<Res/>} />
                <Route path="/test/:id" element={<TestPage/>}/>
                <Route path="/test_list" element={<TestListPage/>} />
            </Routes>
        </Router>
    );
};

export default App;
