import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { id: 1, questionText: '', useRadio: true, answers: [] }
    ]);

    return (
        <DataContext.Provider value={{ title, setTitle, description, setDescription, questions, setQuestions }}>
            {children}
        </DataContext.Provider>
    );
};
