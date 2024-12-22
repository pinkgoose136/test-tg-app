import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot, faQuestionCircle, faSliders } from '@fortawesome/free-solid-svg-icons';

const TestListPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testData, setTestData] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await fetch(`https://legend-powerful-office.glitch.me/api/all_tests`);
                if (!response.ok) {
                    throw new Error('Failed to fetch test data');
                }
                const data = await response.json();
                setTestData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {Object.values(testData).map((test) => (
                <div className='testItemList' key={test.id}>
                    <a href={`./test/${test.id}`} className='testItemLink'>
                        <h2>{test.title}</h2>

                        <div className='infTest'>
                        <div>{test.question_count} <FontAwesomeIcon icon={faQuestionCircle} /></div>

                        <div>
                            {test.type === 'simple' ? (
                            <FontAwesomeIcon icon={faCheckToSlot} />
                            ) : test.type === 'multiscale' ? (
                            <FontAwesomeIcon icon={faSliders} />
                            ) : null}
                        </div>
                        </div>

                        <p>{test.description}</p>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default TestListPage;
