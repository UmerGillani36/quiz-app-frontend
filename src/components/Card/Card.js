import React, { useState } from 'react';
import classes from './Card.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../../serverConfig';
import { getImage } from '../../helperFunctions/imageSelection';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Modal, TextField } from '@mui/material';
const Card = ({
  key,
  quiz,
  handleDelete,
  getGames,
  clipBoard,
  setClipBoard,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // For token
  const token = localStorage.getItem('token')
  console.log('token23', token)
  // This function is for substring
  const excerpt = (str) => {
    const stringLength = str?.length;
    if (stringLength > 20) {
      str = str.substring(0, 15) + ' ... ';
    }
    return str;
  };
  // This function will start the game
  const handleStart = () => {
    axios({
      method: 'post',
      url: `${serverUrl}/admin/quiz/${quiz.id}/start`,
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('response created', response);
        getGames().then((res) => {
          console.log('Response of Get Games: ', res);
          res.data.quizzes.forEach((val) => {
            if (val.id === quiz.id) {
              setClipBoard(val.active);
            }
          });
          setOpen(true);
        });
        toast.success('Successfully', {
          position: 'top-center',
          autoClose: 3000,
        });
      })
      .catch((err) => {
        toast.error(`Error: ${err}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      });
  };
  // This function will stop the game
  const handleStop = () => {
    axios({
      method: 'post',
      url: `${serverUrl}/admin/quiz/${quiz.id}/end`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        const quizActiveId = quiz?.active;
        console.log('response Stopped', response);
        getGames().then((res) => {
          console.log('Response of Get Games: ', res);
          let text;
          if (confirm('Would you like to view the results?!') === true) {
            navigate(`/results/${quizActiveId}`);
            setClipBoard('');
          } else {
            text = 'You canceled!';
            console.log('Canceled Press: ', text);
          }
        });
        toast.success('Successfully Ended', {
          position: 'top-center',
          autoClose: 3000,
        });
      })
      .catch((err) => {
        toast.error(`Error: ${err}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      });
  };
  // This function is for coping the url to clipBoard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(
        `http://localhost:3000/play?id=${clipBoard}&session=${quiz.id}`
      )
      .then((res) => {
        setOpen(false);
        toast.success('Link Copied Successfully', {
          position: 'top-center',
          autoClose: 3000,
        });
        navigate(`/advance/${quiz.id}`);
      })
      .catch((err) => {
        console.log('Error Clipboard: ', err);
      });
  };

  // styles for Modal
  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: 'none',
    outline: 'none',
    borderRadius: '4px',
    p: 4,
  };

  return (
    <>
      <div className={classes.card} key={key}>
        <div className={classes.imageContainer}>
          <img
            src={getImage(quiz?.name)}
            className={classes.image}
            data-testid='image'
          />
        </div>
        <h3 className={classes.quizName}>{excerpt(quiz?.name)}</h3>
        <div className={classes.actionContainer}>
          <span
            className={classes.edit}
            onClick={() => navigate(`/details/${quiz.id}`)}
          >
            <EditIcon />
          </span>
          <span
            className={classes.start}
            onClick={() => {
              if (quiz.active) {
                handleStop();
              } else {
                handleStart();
              }
            }}
            data-testid='StartButton'
          >
            {quiz.active ? 'End' : 'Start'}
          </span>
          <span
            className={classes.delete}
            onClick={() => handleDelete(quiz.id)}
          >
            <DeleteIcon />
          </span>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <TextField
            id='outlined-basic'
            fullWidth
            value={`http://localhost:3000/play?id=${clipBoard}&session=${quiz.id}`}
            disabled
            variant='outlined'
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Button
              variant='outlined'
              onClick={() => setOpen(false)}
              sx={{ width: '50%', marginTop: '20px', marginRight: '20px' }}
            >
              Close
            </Button>
            <Button
              variant='contained'
              onClick={handleCopy}
              sx={{ width: '50%', marginTop: '20px' }}
            >
              Copy Link
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Card;
