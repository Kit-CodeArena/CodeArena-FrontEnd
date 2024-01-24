import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function ProblemSolvingSection() {
    const [selectedLanguage, setSelectedLanguage] = useState('python');
    const [solutionCode, setSolutionCode] = useState('');

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleCodeChange = (event) => {
        setSolutionCode(event.target.value);
    };

    const handleSubmit = () => {
        // 제출 로직 구현
        console.log("Selected Language:", selectedLanguage);
        console.log("Code:", solutionCode);
    };

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="language-select-label">언어 선택</InputLabel>
                <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={selectedLanguage}
                    label="언어 선택"
                    onChange={handleLanguageChange}
                >
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="java">Java</MenuItem>
                    <MenuItem value="cpp">C++</MenuItem>
                </Select>
            </FormControl>

            <TextField
                id="code-editor"
                label="코드 작성"
                multiline
                rows={10}
                value={solutionCode}
                onChange={handleCodeChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}>
                제출
            </Button>
        </div>
    );
}