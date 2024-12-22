import React, { useState, useRef, useEffect  } from 'react';
import { CgCalendar, CgCap } from 'react-icons/cg';
import { FaChevronRight, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { SiClarivate } from 'react-icons/si';

const QuestionBlock = ({ question, questions, setQuestions, index, scales, type }) => {
    const [collapsed, setCollapsed] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight-22}px`;
        }
      }, [question.questionText]); // Пересчитываем каждый раз, когда изменяется текст


    const handleDeleteQuestion = () => {
        if (questions.length > 1) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        }
    };

    const handleQuestionChange = (e) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = e.target.value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (answerIndex, e, type) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answers[answerIndex].text = e.target.value;

        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight-22}px`;

        if(type == 'simple' && updatedQuestions[index].useRadio == false){
            const ee = e.target.parentElement.querySelector('select');
            ee.style.height = `${e.target.scrollHeight}px`;
        }

        setQuestions(updatedQuestions);
    };


    const handleScaleValueChange = (answerIndex, cc, e) => {
        const updatedQuestions = [...questions];
        const idi = question.answers[answerIndex].id
        if (updatedQuestions[index].useRadio && type == 'simple') {
            updatedQuestions[index].answers.forEach((answer) => {
                if(answer.id == idi){
                    answer.changes.change_1.scaleValue = 1    
                }
                else{
                    answer.changes.change_1.scaleValue = 0
                }
            })
        }
        else {
            updatedQuestions[index].answers[answerIndex]['changes'][cc].scaleValue = e.target.value;
        }

        setQuestions(updatedQuestions);
    };

    const handleScaleSelect = (answerIndex, cc, changeIndex, event) => {
        const { value } = event.target;

        const updatedQuestions = [...questions];
        const answer = updatedQuestions[index].answers[answerIndex];
        answer.changes[cc].scaleId = Number(value);

        const selectedScales = Object.values(answer.changes).map(change => change.scaleId);
        Object.values(answer.changes).forEach((change, idx) => {
            if (idx !== changeIndex && selectedScales.includes(change.scaleId)) {
                const availableScales = scales.filter(scale => !selectedScales.includes(scale.id) || scale.id === change.scaleId);
                
                if (availableScales.length) {
                    selectedScales.push(change.scaleId);
                }
            }
        });
            
        setQuestions(updatedQuestions)
    };

// handleAddScaleChange - исправлено для предотвращения двойного создания изменений
    const handleAddScaleChange = (answerIndex) => {
        const updatedQuestions = [...questions];
        const answer = updatedQuestions[index].answers[answerIndex];

        // Получаем список доступных шкал, не включая уже выбранные
        const selectedScales = Object.values(answer.changes).map(change => change.scaleId);
        const availableScales = scales.filter(scale => !selectedScales.includes(scale.id));

        // Добавляем новое изменение, если доступные шкалы есть и лимит не превышен
        const newSc = Object.keys(answer.changes).length - 1;
        const newScaleId = Number(Object.keys(answer.changes)[newSc].split('_')[1]) + 1 

        if (availableScales.length && Object.keys(answer.changes).length < scales.length ) {
            answer.changes['change_'+newScaleId] = {scaleId: availableScales[0].id, scaleValue: 1}
        }
        setQuestions(updatedQuestions)
    };

    const handleAddAnswer = () => {
        const updatedQuestions = [...questions];
        
        const newSc = Object.keys(updatedQuestions[index].answers).length - 1;
        const newAnswerId = Number(updatedQuestions[index].answers[newSc].id.split('.')[1]) + 1 
        
        updatedQuestions[index].answers.push({
            id: `ans:${question.id}.${newAnswerId}`,
            text: '',
            changes: {'change_1': {scaleId: 0, scaleValue: type === 'simple' ? 0 : 1}}
        });
        setQuestions(updatedQuestions);
    };
    
    
    const handleDeleteAnswer = (answerIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[index].answers.length > 2) {
            updatedQuestions[index].answers = updatedQuestions[index].answers.filter((_, i) => i !== answerIndex);
            setQuestions(updatedQuestions);
        }
    };
    
    const handleDeleteScaleChange = (answerIndex, changeIndex) => {
        console.log(answerIndex, changeIndex)
        const updatedQuestions = [...questions];
        console.log(updatedQuestions[index].answers[answerIndex].changes)
        delete updatedQuestions[index].answers[answerIndex].changes[changeIndex];
        setQuestions(updatedQuestions);
    };


    const getAvailableScales = (answer, scaleId) => {
        const selectedScales = Object.values(answer.changes).map(change => change.scaleId);
        let scls = scales.filter(scale => !selectedScales.includes(scale.id) || scale.id == scaleId)
        if(scales.filter(scale => scale.id == scaleId).length == 0){
            scls.unshift({id: 0, name: "Select a scale", color: "#000000"})
        }
        return scls;
    };

    const toggleScaleType = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].useRadio = !updatedQuestions[index].useRadio;
        setQuestions(updatedQuestions);
    };

    return (
        <div className="question-block">
            <div
                className="collapsed-question-title"
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <FaChevronRight
                    className={`arrow-icon ${collapsed ? 'right' : ''}`}
                    onClick={(e) => setCollapsed(!collapsed)}
                />

                {collapsed && (
                <span onClick={() => setCollapsed(false)}>
                    {question.questionText || 'Click to edit question'}
                </span>
                )}

                <textarea
                    ref={textareaRef}
                    className="inp"
                    value={question.questionText}
                    onChange={handleQuestionChange}
                    placeholder="Enter your question"
                    maxLength="256"
                    style={{
                    display: collapsed ? 'none' : 'block',
                    opacity: collapsed ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    height: 'auto',
                    }}
                    rows={1}
                />
            </div>
        
                <>
                    <div 
                        className="ans-blk"
                        style={{
                            display: !collapsed ? 'block' : 'none' 
                        }}
                    >
                        {question.answers.map((answer, answerIndex) => {
                            if (!answer.changes) {
                                answer.changes = [];
                            }
                            return (
                                <div key={answer.id} className="answer-container">
                                    <div className="answer-block">
                                        {type === 'simple' && (
                                            <>  
                                                {question.useRadio ? (
                                                    <input
                                                        type="radio"
                                                        name={`radio-${index}`}
                                                        className='radioAns'
                                                        checked={answer.changes.change_1.scaleValue === 1}
                                                        value={answer.id}
                                                        onChange={(e) => handleScaleValueChange(answerIndex, 'change_1', e)}
                                                    />
                                                ) : (
                                                    <select
                                                    className="scale-select sclSel1"
                                                    value={answer.changes.change_1.scaleValue}
                                                    onChange={(e) => handleScaleValueChange(answerIndex, 'change_1', e)}
                                                    >
                                                    {[...Array(5)].map((_, i) => (
                                                        <option value={i - 2} key={i}>
                                                        {i - 2}
                                                        </option>
                                                    ))}
                                                    </select>
                                                )}
                                            </>
                                        )}
                                        <>
                                            <textarea
                                                className={type === 'simple' ? 'inp1' : 'inp2'}
                                                style={{
                                                    borderRadius: question.useRadio ? "4px" : "0 4px 4px 0"
                                                }}

                                                type="text"
                                                value={answer.text}
                                                onChange={(e) => handleAnswerChange(answerIndex, e, type)}
                                                placeholder="Enter an answer"
                                                maxLength="256"
                                                rows={1}
                                            />
                                            <FaTrashAlt
                                                className="trash-icon"
                                                onClick={() => handleDeleteAnswer(answerIndex)}
                                            />
                                        </>
                                    </div>
    
                                    {type === 'multiscale' && (
                                        <div className="scale-changes-container">
                                            {Object.keys(answer.changes).map((cc) => {
                                                const c = answer.changes[cc]
                                                const change = c.scaleValue;
                                                const scaleId = c.scaleId;

                                                return (
                                                    <div key={`$${cc}`} className="scale-change">
                                                        <select
                                                            className="scale-select sclSel1"
                                                            value={change}
                                                         onChange={(e) => handleScaleValueChange(answerIndex, cc, e)}
                                                        >
                                                            {[...Array(5)].map((_, i) => (
                                                                <option value={i - 2} key={i}>{i - 2}</option>
                                                            ))}
                                                        </select>

                                                        <select
                                                            className="scale-select sclSel2"
                                                            value={scaleId || ''}
                                                          onChange={(e) => handleScaleSelect(answerIndex, cc, scaleId, e)}
                                                        >
                                                            <option value="" hidden disabled>
                                                                Select a scale
                                                            </option>

                                                            {getAvailableScales(answer, scaleId).map((scale) => (
                                                                <option 
                                                                    value={scale.id} 
                                                                    key={scale.id}
                                                                    hidden={scale.id === 0}
                                                                >
                                                                    {scale.name}
                                                                </option>
                                                            ))}
                                                        </select>
        
                                                        {Object.keys(answer.changes).length > 1 && (
                                                            <FaTrashAlt
                                                                className="trash-icon"
                                                              onClick={() => handleDeleteScaleChange(answerIndex, cc)}
                                                            />
                                                        )}
                                                    </div>
                                                )
                                            })}
    
                                            {Object.keys(answer.changes).length < scales.length && (
                                                <button onClick={() => handleAddScaleChange(answerIndex)} className="add-scale-change-btn">
                                                    <FaPlus />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
    
                    <div
                        style={{
                            display: !collapsed ? 'block' : 'none' 
                        }}
                    >
                        <button className="add-answer-btn" onClick={handleAddAnswer}>
                            Add Answer
                        </button>
                        <button className="delete-question-btn" onClick={handleDeleteQuestion}>
                            Delete Question
                        </button>
                        {type === 'simple' && (
                            <button className="toggle-scale-btn" onClick={toggleScaleType}>
                                {question.useRadio ? "Switch to Select" : "Switch to Radio"}
                            </button>
                        )}

                    </div>
                </>
        </div>
    );
};

export default QuestionBlock;