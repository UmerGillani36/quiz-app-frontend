import React, { useEffect, useState } from 'react';
import classes from './PlayerResult.module.css';
import NavBar from '../../components/NavBar/NavBar';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../../serverConfig';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const PlayerResult = () => {
  const { playerId } = useParams();
  const [data, setData] = useState([]);
  // This is for creating the data for table
  const createData = (questionNo, startedAt, answeredAt, answer) => {
    return { questionNo, startedAt, answeredAt, answer };
  };
  // For token
  const token = localStorage.getItem('token')
  // This is for getting the data of player
  useEffect(() => {
    if (playerId) {
      axios({
        method: 'get',
        url: `${serverUrl}/play/${playerId}/results`,
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log('response', response);
          const playerData = response.data.map((value, index) => {
            return createData(
              index + 1,
              new Date(value.questionStartedAt).toLocaleString(),
              new Date(value.answeredAt).toLocaleString(),
              value.correct
            );
          });
          setData(playerData);
        })
        .catch((error) => {
          console.log('error', error);
          toast.error('Something went wrong!!', {
            position: 'top-center',
            autoClose: 3000,
          });
        });
    }
  }, [playerId]);
  return (
    <div>
      <NavBar />
      <div className={classes.results}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell className={classes.col}>Qusetion Number</TableCell>
              <TableCell align='right' className={classes.col}>Started At</TableCell>
              <TableCell align='right' className={classes.col}>Answered At</TableCell>
              <TableCell align='right' className={classes.col}>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.questionNo}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className={classes.row}
              >
                <TableCell component='th' scope='row' className={classes.col}>
                  {row.questionNo}
                </TableCell>
                <TableCell align='right' className={classes.col}>{row.startedAt}</TableCell>
                <TableCell align='right' className={classes.col}>{row.answeredAt}</TableCell>
                <TableCell align='right' className={classes.col}>
                  {row.answer ? 'Correct' : 'Wrong'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerResult;
