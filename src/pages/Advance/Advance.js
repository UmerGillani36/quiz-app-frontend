import React, { useEffect, useState } from 'react';
import classes from './Advance.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../serverConfig';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar/NavBar';

const Advance = () => {
  const { id } = useParams();
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [stage, setStage] = useState(null);
  // For token
  const token = localStorage.getItem('token')
  // This function is for advance
  const handleAdvance = () => {
    if (id) {
      axios({
        method: 'post',
        url: `${serverUrl}/admin/quiz/${id}/advance`,
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log('response advance', response);
          setStage(response?.data?.stage);
          setCurrentQuestion(currentQuestion + 1);
          toast.success('Session started', {
            position: 'top-center',
            autoClose: 3000,
          });
        })
        .catch((err) => {
          console.log('err', err);
          toast.error('Session not started, Please try again', {
            position: 'top-center',
            autoClose: 3000,
          });
        });
    }
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: `${serverUrl}/admin/quiz/${id}`,
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

  const goToDashboard = () => {
    navigate(-1);
  };

  return (
    <div>
      <NavBar />
      <div className={classes.advancePage}>
        <div className={classes.advanceContainer}>
          <h2 className={classes.heading}>Advance the session</h2>
          <h2 className={classes.stage}>Stage : {stage}</h2>
          <button
            className={classes.advance}
            onClick={() => {
              currentQuestion === totalQuestion
                ? goToDashboard()
                : handleAdvance();
            }}
          >
            {currentQuestion === totalQuestion
              ? 'All Question Played Go To Dashboard'
              : 'Advance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advance;
