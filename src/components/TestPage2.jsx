import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TestPage = () => {
    const { id } = useParams(); // Получаем ID из URL
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/test/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch test data');
                }
                const data = await response.json();
                setTestData(data);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div id='main'>
            <h1>{testData.title}</h1>
            <p>{testData.description}</p>
            <h3>Type: {testData.type}</h3>
            
            <h3>Questions:</h3>
            {testData.questions.map((question) => (
                <div key={question.id}>
                    <h4>{question.id}. {question.question_text}</h4>
                    <p>Type: {question.use_radio ? 'Radio' : 'Select'}</p>
                    <ul>
                        {question.answers.map((answer) => (
                            <li key={answer.id}>
                                {answer.text} - Changes:
                                <ul>
                                    {answer.changes.map((change, index) => (
                                        <li key={index}>
                                            Scale ID: {change.scale_id}, Value: {change.scale_value}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <h3>Scales:</h3>
            <ul>
                {testData.scales.map((scale) => (
                    <li key={scale.id}>
                        {scale.name} - Color: <span style={{ color: scale.color }}>{scale.color}</span>
                    </li>
                ))}
            </ul>

            <h3>Results:</h3>
            <ul>
                {testData.results.map((result, index) => (
                    <li key={index}>
                        Position: {result.position}, Result: {result.result}
                        {testData.type === 'multiscale' && ` (Scale ID: ${result.scale_id})`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestPage;
