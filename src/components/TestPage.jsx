import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TestPage = () => {
    const { id } = useParams(); // Получаем ID из URL
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState([]);
    const [scaleChanges, setScaleChanges] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testCompleted, setTestCompleted] = useState(false);
    const [finalResult, setFinalResult] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await fetch(`https://legend-powerful-office.glitch.me/api/test/${id}`);
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
    }, [id]);

    const handleAnswerSelect = (answer) => {
        setAnswers([...answers, answer]);
        answer.changes.forEach((change) => {
            setScaleChanges((prev) => ({
                ...prev,
                [change.scale_id]: (prev[change.scale_id] || 0) + change.scale_value,
            }));
        });

        if (currentQuestionIndex < testData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setTestCompleted(true);
        }
    };

    const handleStartTest = () => {
        setCurrentQuestionIndex(0);
    };

    // Функция для вычисления результата обычного теста
    const redistributePercentages = (results) => {
        const totalPercentage = 100;
        const numberOfResults = results.length;
        const step = totalPercentage / numberOfResults;
    
        return results.map((result, index) => ({
            ...result,
            percentageStart: parseFloat((index * step).toFixed(1)),
            percentageEnd: parseFloat(((index + 1) * step).toFixed(1)),
        }));
    };
    
    const calculateSimpleTestResult = () => {
        const resultsWithPercentages = redistributePercentages(testData.results);
    
        // Максимальный возможный результат
        const maxResult = testData.questions.reduce((acc, question) => {
            return acc + Math.max(...question.answers.map((answer) => 
                answer.changes.length > 0 
                    ? Math.max(...answer.changes.map((change) => change.scale_value))
                    : 0
            ));
        }, 0);
    
        // Результат пользователя
        const userResult = answers.reduce((acc, answer) => {
            const maxChange = Math.max(...answer.changes.map((change) => change.scale_value));
            return acc + maxChange;
        }, 0);
    
        // Процент результата
        const percentage = ((userResult / maxResult) * 100).toFixed(2);
    
        // Поиск подходящей категории
        const userCategory = resultsWithPercentages.find((result, index) => {
            const isLastCategory = index === resultsWithPercentages.length - 1;
            return isLastCategory
                ? percentage >= result.percentageStart && percentage <= result.percentageEnd // Последняя категория включает 100%
                : percentage >= result.percentageStart && percentage < result.percentageEnd;
        });
    
        // Возвращаем результат
        return {
            resultText: userCategory ? userCategory.result : 'Результат не определён',
            percentage,
        };
    };
    
    

    const calculateMultiscaleTestResult = () => {
        const scaleResults = {};

        testData.scales.forEach((scale) => {
            const scaleTotal = answers.reduce((acc, answer) => {
                const change = answer.changes.find(change => change.scale_id === scale.id);
                return acc + (change ? change.scale_value : 0);
            }, 0);

            scaleResults[scale.id] = {'result': scaleTotal, 'name': scale.name, 'res': testData.results[scale.id]};
        });

        const dominantScaleId = Object.keys(scaleResults).reduce((maxId, scaleId) =>
            scaleResults[scaleId] > scaleResults[maxId] ? scaleId : maxId
        );

        const dmS = scaleResults[dominantScaleId];
        delete scaleResults[dominantScaleId];
        return {
            scaleResults,
            dmS
        };
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!testData) return <p>No test data available.</p>;

    const currentQuestion = testData.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === testData.questions.length - 1;

    let resultData = null;
    if (testCompleted) {
        if(testData.type === 'simple'){
            resultData = calculateSimpleTestResult();
        }else if(testData.type == 'multiscale'){
            resultData = calculateMultiscaleTestResult();
        }
    }

    return (
        <div className='main testCont'>
            {currentQuestionIndex === -1 ? (
                    <div>
                        <h2>{testData.title}</h2>
                        <div>
                            <p>{testData.description}</p>
                            <p>Тип: {testData.type}</p>
                            <p>Количество вопросов: {testData.questions.length}</p>
                        </div>
                        <button onClick={handleStartTest}>Начать</button>
                    </div>
            ) : testCompleted ? (
                <div>
                    <h3>Тест завершён</h3>
                    {testData.type === 'simple' && resultData ? (
                        <div>
                            <p>{resultData.resultText}</p>
                            <p>Результат: {resultData.percentage}%</p>
                        </div>
                    ) : testData.type === 'multiscale' ? (
                        <div>
                            <p>{resultData.dmS.res}</p>
                            <p>Результат: {resultData.dmS.result}</p>
                            <div>
                                {Object.values(resultData.scaleResults).map((scale) => (
                                    <p>{scale.name}: {scale.result}</p>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className='ansBlk'>
                    <h3>Вопрос {currentQuestionIndex + 1}</h3>
                    <p>{currentQuestion.question_text}</p>
                    {currentQuestion.answers.map((answer) => (
                        <div className='ansBtn' key={answer.id} onClick={() => handleAnswerSelect(answer)}>
                            {answer.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestPage;
