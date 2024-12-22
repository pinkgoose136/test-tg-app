import React, { useState, useEffect } from 'react';
import '../styles/styles1.css';

const TestResults = ({ goToPreviousStep, testData, setTestData, sendData }) => {
    const { title, description, type, questions, scales, results } = testData;

    // Функция для подсчета максимального балла (используется только для simple)
    const calculateMaxScore = () => {
        return questions.reduce((maxScore, question) => {
            const maxAnswer = question.answers.reduce((maxValue, answer) => {
                return Math.max(maxValue, answer.changes.change_1.scaleValue);
            }, 0);
            return maxScore + maxAnswer;
        }, 0);
    };

    const maxScore = type === 'simple' ? calculateMaxScore() : null;

    const setResults = (newResults) => {
        setTestData({ ...testData, results: newResults })
    }

    if(results == 'none'){
        if(type == 'simple'){
            const nresults =
            [
                { percentageStart: 0, percentageEnd: 20, result: '' },
                { percentageStart: 20, percentageEnd: 40, result: '' },
                { percentageStart: 40, percentageEnd: 60, result: '' },
                { percentageStart: 60, percentageEnd: 80, result: '' },
                { percentageStart: 80, percentageEnd: 100, result: '' }
            ]
            setResults(nresults)
        }else{
            const nresults = scales.map((scale) => ({
                scaleId: scale.id,
                scaleName: scale.name,
                result: ''
            }))
            setResults(nresults)
        }
    }


    // Функция для перераспределения диапазонов
    const redistributePercentages = (updatedResults) => {
        const totalPercentage = 100;
        const numberOfResults = updatedResults.length;
        const step = totalPercentage / numberOfResults;

        return updatedResults.map((result, index) => ({
            ...result,
            percentageStart: parseFloat((index * step).toFixed(1)),
            percentageEnd: parseFloat(((index + 1) * step).toFixed(1))
        }));
    };

    // Добавление нового блока результата для simple
    const addResult = () => {
        if (results.length < 10) {
            const newResults = [...results, { percentageStart: 0, percentageEnd: 0, result: '' }];
            setResults(redistributePercentages(newResults));
        }
    };

    // Удаление блока результата для simple
    const removeResult = () => {
        if (results.length > 2) {
            const newResults = results.slice(0, results.length - 1);
            setResults(redistributePercentages(newResults));
        }
    };

    const handleResultChange = (e, type, aa) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight-22}px`;

        if(type == 'simple'){
            const newResults = [...results];
            newResults[aa].result = e.target.value;
            setResults(newResults);
        }else if(type == 'multiscale'){
            const updatedResults = results.map((sr) =>
                sr.scaleId === aa
                    ? { ...sr, result: e.target.value }
                    : sr
            );
            setResults(updatedResults);
        }
    };

    if (results === 'none') return null;
    return (
        <div className="test-form">
            <h2>{title}</h2>
            <p>{description}</p>
            {type === 'simple' && (
                <>
                    <h3>Maximum possible score: {maxScore}</h3>
                    <div className="results-container">
                        {results.map((result, index) => (
                            <div key={index} className="result-block">
                                <div className="result-percent">
                                    {result.percentageStart}% - {result.percentageEnd}%:
                                </div>
                                <textarea
                                    type="text"
                                    className="inp1 inn2"
                                    placeholder="Enter a result"
                                    value={result.result}
                                    onChange={(e) => handleResultChange(e, type, index)}
                                    maxLength="512"
                                />
                            </div>
                        ))}
                        
                    </div>
                    <div className="result-buttons">
                        <button onClick={addResult}>Add Result</button>
                        <button onClick={removeResult}>Remove Result</button>
                        <button onClick={goToPreviousStep}>Back</button>
                        <button onClick={sendData}>Finish</button>
                    </div>
                </>
            )}

            {type === 'multiscale' && (
                <>
                    <h3>Results by Scales</h3>
                    <div className="results-container">
                        {results.map((scaleResult) => (
                            <div key={scaleResult.scaleId} className="result-block">
                                <div className="result-scale">
                                    {scaleResult.scaleName}:
                                </div>
                                <textarea
                                    onChange={(e) => handleResultChange(e, type, scaleResult.scaleId)}
                                    maxLength="512"
                                    className="inp1 inn2"
                                    placeholder="Enter a result"
                                    type="text"
                                    value={scaleResult.result}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={goToPreviousStep}>Back</button>
                    <button onClick={sendData}>Finish</button>
                </>
            )}
        
        </div>
    );
};

export default TestResults;
