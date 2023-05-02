import React, { useEffect, useLayoutEffect, useState } from 'react';
import classes from './Details.module.css';
import NavBar from '../../components/NavBar/NavBar';
import { serverUrl } from '../../serverConfig';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Button,
  TextField,
} from '@mui/material';
const Details = () => {
  const [question, setQuestion] = useState('');
  const [firstOption, setFirstOption] = useState('');
  const [secondOption, setSecondOption] = useState('');
  const [thirdOption, setThirdOption] = useState('');
  const [fourthOption, setFourthOption] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [link, setLink] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const options = [
    { label: 'A', name: 'isOptionOne' },
    { label: 'B', name: 'isOptionTwo' },
    { label: 'C', name: 'isOptionThree' },
    { label: 'D', name: 'isOptionFour' },
  ];
  const [state, setState] = useState({
    isOptionOne: false,
    isOptionTwo: false,
    isOptionThree: false,
    isOptionFour: false,
  });
  // For token
  const token = localStorage.getItem('token')
  // This is for checkboxes of correct Answers handling the state
  const handleCorrectAnswers = (event) => {
    if (checked) {
      const dummyState = {
        isOptionOne: false,
        isOptionTwo: false,
        isOptionThree: false,
        isOptionFour: false,
      };
      setState({ ...dummyState, [event.target.name]: event.target.checked });
    } else {
      setState({ ...state, [event.target.name]: event.target.checked });
    }
  };
  const handleChange = (event) => {
    setState({
      isOptionOne: false,
      isOptionTwo: false,
      isOptionThree: false,
      isOptionFour: false,
    });
    setChecked(event.target.checked);
  };
  // This function save the questions and all options of a game after creating or editing
  const handleSave = () => {
    let dummyData = [];
    if (
      question.trim().length > 0 &&
      firstOption.trim().length > 0 &&
      secondOption.trim().length > 0 &&
      time > 0
    ) {
      const temp = questions.slice();
      const options = [
        { option: firstOption, isCorrect: state.isOptionOne, id: 1 },
        { option: secondOption, isCorrect: state.isOptionTwo, id: 2 },
        { option: thirdOption, isCorrect: state.isOptionThree, id: 3 },
        { option: fourthOption, isCorrect: state.isOptionFour, id: 4 },
      ];
      const correctAnswers = [0];
      const dummy = {
        question,
        options,
        time,
        singleSelection: checked,
        correctAnswers,
        score,
        link,
      };
      dummyData = [...temp, dummy];
      console.log('handle Save Called: ');
      axios({
        method: 'put',
        url: `${serverUrl}/admin/quiz/${id}`,
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
        data: {
          questions: dummyData,
          name: currentQuiz?.name,
          thumbnail: currentQuiz.thumbnail,
        },
      })
        .then((response) => {
          console.log('response', response.data);
          toast.success('Successfully saved', {
            position: 'top-center',
            autoClose: 3000,
          });
          navigate('/dashboard');
        })
        .catch((error) => {
          toast.error(`${error}`, {
            position: 'top-center',
            autoClose: 3000,
          });
        });
    } else {
      toast.error('Please fill the fields first', 3000);
    }
  };
  // This function calculates the total time of questions
  const totalTime = (old) => {
    let totalTime = 0;
    if (old) {
      if (currentQuiz?.questions?.length > 0) {
        currentQuiz?.questions?.forEach((ques, index) => {
          totalTime += ques.time / 60;
        });
      }
    } else {
      if (questions.length > 0) {
        questions.forEach((ques) => {
          totalTime += ques.time / 60;
        });
      }
    }
    return Math.round(totalTime);
  };
  // This is for the substring
  const excerpt = (str) => {
    const stringLength = str?.length;
    if (stringLength > 40) {
      str = str.substring(0, 40) + ' ... ';
    }
    return str;
  };
  useLayoutEffect(() => {
    axios({
      method: 'get',
      url: `${serverUrl}/admin/quiz/${id}`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        setCurrentQuiz(response?.data);
      })
      .catch((error) => {
        toast.error(`${error}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      });
  }, []);
  // This is for handling the states for first time when the user want to edit
  useEffect(() => {
    if (currentQuiz?.questions?.length > 0) {
      setQuestion(currentQuiz?.questions[0]?.question);
      setFirstOption(currentQuiz?.questions[0]?.options[0].option);
      setSecondOption(currentQuiz?.questions[0]?.options[1].option);
      setThirdOption(currentQuiz?.questions[0]?.options[2].option);
      setFourthOption(currentQuiz?.questions[0]?.options[3].option);
      setChecked(currentQuiz?.questions[0]?.singleSelection);
      setTime(currentQuiz?.questions[0]?.time);
      setState({
        isOptionOne: currentQuiz?.questions[0]?.options[0].isCorrect,
        isOptionTwo: currentQuiz?.questions[0]?.options[1].isCorrect,
        isOptionThree: currentQuiz?.questions[0]?.options[2].isCorrect,
        isOptionFour: currentQuiz?.questions[0]?.options[3].isCorrect,
      });
      setScore(currentQuiz?.questions[0]?.score);
      setLink(currentQuiz?.questions[0]?.link);
    }
  }, [currentQuiz]);

  useEffect(() => {
    totalTime(true);
  }, [question]);
  // This function is for clearing the state
  const clearState = () => {
    setQuestion('');
    setFirstOption('');
    setSecondOption('');
    setThirdOption('');
    setFourthOption('');
    setTime(0);
    setState({
      isOptionOne: false,
      isOptionTwo: false,
      isOptionThree: false,
      isOptionFour: false,
    });
    setScore(0);
    setLink('');
  };
  // This function is for the next question you want to edit or create
  const handleNext = () => {
    if (
      currentQuiz?.questions?.length > 0 &&
      currentIndex < currentQuiz?.questions?.length
    ) {
      const tempIndex = currentIndex;
      setCurrentIndex(tempIndex + 1);
      setQuestion(currentQuiz.questions[tempIndex]?.question);
      setFirstOption(currentQuiz.questions[tempIndex]?.options[0]?.option);
      setSecondOption(currentQuiz.questions[tempIndex]?.options[1]?.option);
      setThirdOption(currentQuiz.questions[tempIndex]?.options[2]?.option);
      setFourthOption(currentQuiz.questions[tempIndex]?.options[3]?.option);
      setChecked(currentQuiz.questions[tempIndex]?.singleSelection);
      setTime(currentQuiz.questions[tempIndex]?.time);
      setState({
        isOptionOne: currentQuiz?.questions[tempIndex]?.options[0]?.isCorrect,
        isOptionTwo: currentQuiz?.questions[tempIndex]?.options[1]?.isCorrect,
        isOptionThree: currentQuiz?.questions[tempIndex]?.options[2]?.isCorrect,
        isOptionFour: currentQuiz?.questions[tempIndex]?.options[3]?.isCorrect,
      });
      setScore(currentQuiz?.questions[0]?.score);
      setLink(currentQuiz?.questions[0]?.link);
      if (
        question.trim().length > 0 &&
        firstOption.trim().length > 0 &&
        secondOption.trim().length > 0 &&
        time > 0
      ) {
        // clearState();
        const temp = questions.slice();
        const options = [
          { option: firstOption, isCorrect: state.isOptionOne, id: 1 },
          { option: secondOption, isCorrect: state.isOptionTwo, id: 2 },
          { option: thirdOption, isCorrect: state.isOptionThree, id: 3 },
          { option: fourthOption, isCorrect: state.isOptionFour, id: 4 },
        ];
        const correctAnswers = [0];
        const dummy = {
          question,
          options,
          time,
          singleSelection: checked,
          correctAnswers,
          score,
          link,
        };
        setQuestions([...temp, dummy]);
      } else {
        toast.error('Please fill the fields first', 3000);
      }
    } else {
      if (
        question.trim().length > 0 &&
        firstOption.trim().length > 0 &&
        secondOption.trim().length > 0 &&
        time > 0
      ) {
        clearState();
        const temp = questions.slice();
        const options = [
          { option: firstOption, isCorrect: state.isOptionOne, id: 1 },
          { option: secondOption, isCorrect: state.isOptionTwo, id: 2 },
          { option: thirdOption, isCorrect: state.isOptionThree, id: 3 },
          { option: fourthOption, isCorrect: state.isOptionFour, id: 4 },
        ];
        const correctAnswers = [0];
        const dummy = {
          question,
          options,
          time,
          singleSelection: checked,
          correctAnswers,
          score,
          link,
        };
        setQuestions([...temp, dummy]);
      } else {
        toast.error('Please fill the fields first', 3000);
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div className={classes.details}>
        <div className={classes.mainContainer}>
          <h3 className={classes.title}>
            Title:{' '}
            <span className={classes.data}>
              {currentQuiz && excerpt(currentQuiz?.name)}
            </span>
          </h3>
          <h4 className={classes.title}>
            Questions:{' '}
            <span className={classes.data}>
              {currentQuiz?.questions?.length}
            </span>
          </h4>
          <h4 className={classes.title}>
            Old Total Time:{' '}
            <span className={classes.data}>{totalTime(true)} min</span>
          </h4>
          <h4 className={classes.title}>
            New Total Time:{' '}
            <span className={classes.data}>{totalTime(false)} min</span>
          </h4>
          <h4 className={classes.question}>Question {questions.length + 1}</h4>
          <TextField
            id='outlined-basic'
            fullWidth
            value={question}
            className={classes.field}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Enter the question'
            variant='outlined'
          />
          <FormGroup row>
            <div className={classes.correctWrapper}>
              <FormLabel sx={{ marginRight: '10px' }}>
                {checked ? 'Correct Answer: ' : 'Correct Answers: '}
              </FormLabel>
              {options.map((option) => (
                <FormControlLabel
                  key={option.name}
                  control={
                    <Checkbox
                      checked={state[option.name]}
                      onChange={handleCorrectAnswers}
                      name={option.name}
                    />
                  }
                  label={option.label}
                  labelPlacement='start'
                />
              ))}
            </div>
          </FormGroup>
          <h4 className={classes.option}>Options</h4>
          <TextField
            id='outlined-basic'
            fullWidth
            className={classes.field}
            value={firstOption}
            onChange={(e) => setFirstOption(e.target.value)}
            placeholder='Enter the first option'
            variant='outlined'
          />
          <TextField
            id='outlined-basic'
            fullWidth
            className={classes.field}
            value={secondOption}
            onChange={(e) => setSecondOption(e.target.value)}
            placeholder='Enter the second option'
            variant='outlined'
          />
          <TextField
            id='outlined-basic'
            fullWidth
            className={classes.field}
            value={thirdOption}
            onChange={(e) => setThirdOption(e.target.value)}
            placeholder='Enter the third option'
            variant='outlined'
          />
          <TextField
            id='outlined-basic'
            fullWidth
            className={classes.field}
            value={fourthOption}
            onChange={(e) => setFourthOption(e.target.value)}
            placeholder='Enter the fourth option'
            variant='outlined'
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label='Single Selection'
            />
          </FormGroup>
          <h4>Time {'(in sec)'}</h4>
          <TextField
            sx={{ width: '50%' }}
            type='number'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder='Duration in seconds'
            variant='outlined'
          />
          <h4>Score</h4>
          <TextField
            sx={{ width: '50%' }}
            type='number'
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder='Enter the score'
            variant='outlined'
          />
          <h4>Video link </h4>
          <TextField
            sx={{ width: '50%' }}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder='Enter the link'
            variant='outlined'
          />
          <div className={classes.actionContainer}>
            <Button
              variant='contained'
              onClick={handleSave}
              disabled={currentIndex < currentQuiz?.questions?.length}
            >
              Save
            </Button>
            <Button variant='contained' onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
