import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import classes from './Dashboard.module.css';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import { serverUrl } from '../../serverConfig';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '../../components/Card/Card';
import { getImage } from '../../helperFunctions/imageSelection';

const Dashboard = () => {
  const [newGame, setNewGame] = useState('');
  const [open, setOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [clipBoard, setClipBoard] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // For token
  const token = localStorage.getItem('token')
  // This function will get all games
  const getGames = async () => {
    return axios({
      method: 'get',
      url: `${serverUrl}/admin/quiz`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('response', response.data.quizzes);
        setQuizzes(response?.data?.quizzes);
        return response;
      })
      .catch((error) => {
        toast.error(`${error}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      });
  };

  useEffect(() => {
    getGames();
  }, [isCreate, isDeleted]);
  // This function  is for creating the new game
  const handleCreate = () => {
    axios({
      method: 'post',
      url: `${serverUrl}/admin/quiz/new`,
      data: {
        name: newGame,
      },
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('response created', response);
        clearState();
        getImage(newGame);
        setIsCreate(!isCreate);
        toast.success('Successfully created.', {
          position: 'top-center',
          autoClose: 3000,
        });
      })
      .catch(() => {
        clearState();
        toast.error('Game not created, Please try again', {
          position: 'top-center',
          autoClose: 3000,
        });
      });
    setOpen(false);
  };
  // This is for clearing the state
  const clearState = () => {
    setNewGame('');
  };
  // This is for deleting the game
  const handleDelete = (id) => {
    axios({
      method: 'delete',
      url: `${serverUrl}/admin/quiz/${id}`,
      headers: {
        Authorization:
        `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('response deleted', response);
        setIsDeleted(!isDeleted);
        toast.success('Successfully deleted.', {
          position: 'top-center',
          autoClose: 3000,
        });
      })
      .catch(() => {
        clearState();
        toast.error('Game not deleted, Please try again', {
          position: 'top-center',
          autoClose: 3000,
        });
      });
  };
  // Styles for Modal
  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: 'none',
    outline: 'none',
    borderRadius: '4px',
    p: 4,
  };
  return (
    <div>
      <NavBar />
      <div className={classes.mainContainer}>
        <div className={classes.gamesContainer}>
          <div className={classes.createCard} onClick={handleOpen}>
            <AddIcon className={classes.addIcon} />
            <span className={classes.createGameTitle}> Create new game</span>
          </div>
          {quizzes?.map((quiz) => {
            return (
              <Card
                key={quiz.id}
                quiz={quiz}
                handleDelete={handleDelete}
                getGames={getGames}
                setClipBoard={setClipBoard}
                clipBoard={clipBoard}
              />
            );
          })}
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <TextField
              id='outlined-basic'
              fullWidth
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              placeholder='Enter the name of the game'
              variant='outlined'
            />
            <Button
              variant='contained'
              onClick={handleCreate}
              sx={{ width: '50%', marginTop: '20px' }}
            >
              Create
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
