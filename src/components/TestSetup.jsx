import React, { useRef } from 'react';
import '../styles/styles1.css';

const TestSetup = ({ testData, setTestData, goToNextStep }) => {
    const textareaRef = useRef(null);

    const handleChange = (e) => {
        setTestData({
            ...testData,
            [e.target.name]: e.target.value
        });
    };

    const handleTextareaInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Сбрасываем высоту перед расчетом
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем новую высоту
        }
    };

    return (
        <div className="test-form">
            <h2>Test Setup</h2>
            <div className="input-block">
                <label>Title</label>
                <input
                    className='inp'
                    type="text"
                    name="title"
                    value={testData.title}
                    onChange={handleChange}
                    maxLength="64"
                />
            </div>
            <div className="input-block">
                <label>Description</label>
                <textarea
                    name="description"
                    value={testData.description}
                    onChange={handleChange}
                    onInput={handleTextareaInput} // Вызов обработчика на ввод текста
                    ref={textareaRef}
                    maxLength="512"
                />
            </div>

            <div className="type-switch">
                <button
                    className={testData.type === 'simple' ? 'active' : ''}
                    onClick={() => {
                        setTestData({ ...testData, type: 'simple', useRadio: true });
                    }}
                >
                    Simple
                </button>
                <button
                    className={testData.type === 'multiscale' ? 'active' : ''}
                    onClick={() => {
                        setTestData({ ...testData, type: 'multiscale', useRadio: false });
                    }}
                >
                    Multi-scale
                </button>
            </div>

            {testData.type === 'simple' ? (
                <p>Simple: One scale, answers are correct/incorrect.</p>
            ) : (
                <p>Multi-scale: Create multiple scales, assign them to answers.</p>
            )}

            <button onClick={goToNextStep}>Next</button>
        </div>
    );
};

export default TestSetup;
