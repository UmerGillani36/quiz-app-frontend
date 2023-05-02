import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  TextField,
  FormLabel,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { toast } from 'react-toastify';
import { serverUrl } from '../../serverConfig';
import axios from 'axios';
import NavBar from '../../components/NavBar/NavBar';
import classes from './Play.module.css';
import { useNavigate } from 'react-router-dom';

// styles for Modal and paper
const styles = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    outline: 'none',
    borderRadius: 10,
  },
};

const Play = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const quizId = urlParams.get('session');
  const [open, setOpen] = useState(true);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [questionNo, setQuestionNo] = useState(0);
  const [playerId, setPlayerId] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [questionsData, setQuestionsData] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [fieldDisabled, setFieldDisabled] = useState(false);
  const [isDisplayAnswer, setIsDisplayAnswer] = useState(false);
  const [displayAnswer, setDisplayAnswer] = useState([]);
  // For token
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (id) {
      setSessionId(id);
    }
  }, [id]);

  // useEffect(() => {
  //   const getStatus = () => {
  //     axios({
  //       method: 'get',
  //       url: `${serverUrl}/admin/session/${id}/status`,
  //       headers: {
  //         Authorization:
  // `Bearer ${token}`,
  //       },
  //     })
  //       .then((response) => {
  //         console.log('session Status: ', response);
  //       })
  //       .catch((error) => {
  //         toast.error(`${error}`, {
  //           position: 'top-center',
  //           autoClose: 3000,
  //         });
  //       });
  //   };
  //   getStatus();
  // }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${serverUrl}/admin/quiz/${quizId}`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('Current Quiz: ', response);
        setTotalQuestion(response?.data?.questions.length);
      })
      .catch((error) => {
        toast.error(`${error}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      });
  }, []);

  // This function for closing the modal after joinning
  const handleClose = async () => {
    if (sessionId && userName) {
      const gameExists = await checkIfGameExists(sessionId, userName);
      if (gameExists) {
        setOpen(false);
      } else {
        alert('Game does not exist!');
      }
    }
  };
  // This function is for playing the game after advance
  const handlePlay = () => {
    setIsDisplayAnswer(false);
    setDisplayAnswer([]);
    if (playerId !== 0) {
      axios({
        method: 'get',
        url: `${serverUrl}/play/${playerId}/question`,
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      })
        .then((response) => {
          setIsPlay(true);
          console.log('response', response);
          const data = {
            ...response?.data?.question,
            options: response?.data?.question?.options?.map((val) => {
              return {
                ...val,
                answer: false,
              };
            }),
          };
          setQuestionsData(data);
          setQuestionNo(questionNo + 1);
          setCurrentQuestion(currentQuestion + 1);
          setRemainingTime(Number(data.time));
          setFieldDisabled(false);
        })
        .catch((err) => {
          console.log('Eror: ', err);
          toast.error('Please wait for the new question', {
            position: 'top-center',
            autoClose: 3000,
          });
        });
    }
  };
  // This function check if the game exists or not
  const checkIfGameExists = async (sessionId, userName) => {
    if (sessionId.trim().length > 0 && userName.trim().length > 0) {
      console.log('handle Save Called: ');
      return axios({
        method: 'post',
        url: `${serverUrl}/play/join/${sessionId}`,
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
        data: {
          name: userName,
        },
      })
        .then((response) => {
          console.log('response', response.data);
          setPlayerId(response?.data?.playerId);
          toast.success('Successfully Started', {
            position: 'top-center',
            autoClose: 3000,
          });
          return true;
        })
        .catch((error) => {
          console.warn(error);
          toast.error(`${error.response.data.error}`, {
            position: 'top-center',
            autoClose: 3000,
          });
          return false;
        });
    } else {
      toast.error('Please fill the fields first', 3000);
    }
  };

  const handleSessionIdChange = (event) => {
    setSessionId(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClose();
    }
  };
  // This function is for managing the correct answers
  const handleCorrectAnswers = (event, index) => {
    const answers = [];
    console.log('Event: ', event);
    if (questionsData?.singleSelection) {
      console.log('Single Selection: ', questionsData?.singleSelection);
      const optionsArray = questionsData.options.map((value, key) => {
        if (key === index) {
          if (event.target.checked) {
            answers.push(value.id);
          }
          return { ...value, answer: event.target.checked };
        } else {
          return { ...value, answer: false };
        }
      });
      setQuestionsData((prev) => ({ ...prev, options: optionsArray.slice() }));
    } else {
      const optionsArray = questionsData.options.map((value, key) => {
        if (key === index) {
          if (event.target.checked) {
            answers.push(value.id);
          }
          return { ...value, answer: event.target.checked };
        } else {
          if (value.answer) {
            answers.push(value.id);
          }
          return { ...value };
        }
      });
      setQuestionsData((prev) => ({ ...prev, options: optionsArray.slice() }));

      // setState({ ...state, [event.target.name]: event.target.checked });
    }
    // if (event.target.checked) {
    axios({
      method: 'PUT',
      url: `${serverUrl}/play/${playerId}/answer`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
      data: {
        answerIds: answers,
      },
    })
      .then((response) => {
        console.log('Answer API response', response);
      })
      .catch((error) => {
        console.log('Error: ', error);
        // toast.error(`${error.response.data.error}`, {
        //   position: 'top-center',
        //   autoClose: 3000,
        // });
      });
    // }
  };
  // This function excutes when the time finished for individual question
  const timeFinished = () => {
    setFieldDisabled(true);
    axios({
      method: 'get',
      url: `${serverUrl}/play/${playerId}/answer`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('response', response);
        const displayAnswers = [];
        const answers = response.data.answerIds;
        questionsData.options.forEach((value) => {
          if (answers.includes(value.id)) {
            displayAnswers.push(value.option);
          }
        });
        setIsDisplayAnswer(true);
        setDisplayAnswer(displayAnswers);
      })
      .catch((err) => {
        console.log('err: ', err);
        // toast.error(`Unable to get answer ${err}`, {
        //   position: 'top-center',
        //   autoClose: 3000,
        // });
      });
  };
  // This is for results
  const viewResult = () => {
    navigate(`/player/results/${playerId}`, { replace: true });
  };
  // This useEffect and the function for timer of a question
  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingTime !== null) {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            timeFinished();
            return 0;
          }
          return prevTime - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatTime = (timeInSeconds) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60);
    const seconds = Math.floor(timeInSeconds - hours * 3600 - minutes * 60);

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
      return `${pad(minutes)}:${pad(seconds)}`;
    }
  };

  // console.log(setQuestionNo);

  // console.log('Questions: ', questionsData);

  return (
    <div>
      <NavBar />
      {isPlay && (
        <div className={classes.playScreen}>
          <div className={classes.mainContainer}>
            <div className={classes.infoContainer}>
              <div className={classes.row}>
                <h4 className={classes.typeHeading}>
                  {/* Remaining time: {questionsData?.time?.replace(/^0+/, '')} */}
                  Remaining time: {formatTime(remainingTime)}
                </h4>
                {questionsData?.link && (
                  <div className={classes.linkContainer}>
                    <h4 className={classes.typeHeading}>Video Link:</h4>
                    <span
                      className={classes.link}
                      onClick={() => {
                        window.open(`https://${questionsData?.link}`, '_blank');
                      }}
                    >
                      {questionsData?.link}
                    </span>
                  </div>
                )}
              </div>
              <h4 className={classes.typeHeading}>
                Score: {questionsData?.score?.replace(/^0+/, '')}
              </h4>
            </div>
            <h3 className={classes.question}>
              {' '}
              Question {questionNo} : {questionsData?.question}
            </h3>
            <div className={classes.optionsRow}>
              <FormGroup column>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                  }}
                >
                  <FormLabel sx={{ marginRight: '10px' }}>
                    {/* {checked ? 'Correct Answer: ' : 'Correct Answers: '} */}
                    Options:
                  </FormLabel>
                  {questionsData?.options?.map((option, index) => {
                    console.log('--------', option);
                    return (
                      <FormControlLabel
                        key={option.option}
                        control={
                          <Checkbox
                            checked={option.answer}
                            onChange={(e) => {
                              handleCorrectAnswers(e, index);
                            }}
                            name={option.option}
                            disabled={fieldDisabled}
                          />
                        }
                        label={option.option}
                        labelPlacement='end'
                      />
                    );
                  })}
                </div>
              </FormGroup>
              {isDisplayAnswer && (
                <span>
                  Correct answer is :{' '}
                  {displayAnswer?.map((answer) => answer + ' , ')}
                </span>
              )}
              <div></div>
              <div className={classes.actionContainer}>
                <div></div>
                <Button
                  variant='contained'
                  onClick={() => {
                    totalQuestion === currentQuestion
                      ? viewResult()
                      : handlePlay();
                  }}
                  disabled={remainingTime !== 0}
                >
                  {totalQuestion === currentQuestion ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!open && !isPlay && (
        <div className={classes.playWrapper}>
          <h5 className={classes.heading}>
            Note: Please wait for admin to advance the session and then hit the
            play button
          </h5>
          <button className={classes.play} onClick={handlePlay}>
            Play
          </button>
        </div>
      )}
      <Modal
        open={open}
        onClose={() => {}}
        disableBackdropClick
        disableEscapeKeyDown
        sx={styles.modal}
        className={classes.modal}
      >
        <div style={styles.paper}>
          <h2 id='modal-title'>Enter Game Session Details</h2>
          <TextField
            id='session-id'
            label='Session ID'
            value={sessionId}
            onChange={handleSessionIdChange}
            onKeyPress={handleEnterKeyPress}
            fullWidth
            margin='normal'
          />
          <TextField
            id='user-name'
            label='User Name'
            value={userName}
            onChange={handleUserNameChange}
            onKeyPress={handleEnterKeyPress}
            fullWidth
            margin='normal'
          />
          <Button variant='contained' color='primary' onClick={handleClose}>
            Enter
          </Button>
        </div>
      </Modal>
      {/* Rest of your PlayScreen component */}
    </div>
  );
};

export default Play;
