import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ResultsPage = () => {
    const { testId } = useParams(); // Получаем ID теста из URL
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://legend-powerful-office.glitch.me/api/tests/${testId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch test data');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [testId]);

    if (!data) {
        return <p>Loading...</p>; // Пока данные не загрузились
    }

    return (
        <div>
            <h1>Test Details</h1>
            <div>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <h3>Type: {data.type}</h3>
                <h3>Questions:</h3>
                {data.questions.map((question) => (
                    <div key={question.id}>
                        <h4>{question.id}. {question.questionText}</h4>
                        <p>Type: {question.useRadio ? "Radio" : "Select"}</p>
                        <ul>
                            {question.answers.map((answer) => (
                                <li key={answer.id}>
                                    {answer.text} - Scale ID: {answer.scaleId || 'N/A'}, 
                                    Value: {answer.scaleValue}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <h3>Scales:</h3>
                <ul>
                    {data.scales.map((scale) => (
                        <li key={scale.id}>
                            {scale.name} - Color: <span style={{ color: scale.color }}>{scale.color}</span>
                        </li>
                    ))}
                </ul>
                <h3>Results:</h3>
                <ul>
                    {data.results.map((result, index) => (
                        <li key={index}>
                            Position {result.position}: {result.result} 
                            {result.scaleId ? ` (Scale ID: ${result.scaleId})` : ''}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ResultsPage;
