import React, { useEffect, useState } from 'react';
import classes from './Results.module.css';
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
// import CustomChart from '../../components/Chart/CustomChart'

const Results = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  // For token
  const token = localStorage.getItem('token')
  // This is for creating the data for table
  const createData = (questionNo, startedAt, answeredAt, answer) => {
    return { questionNo, startedAt, answeredAt, answer };
  };
    // This is for getting the data of player
  useEffect(() => {
    if (id) {
      axios({
        method: 'get',
        url: `${serverUrl}/admin/session/${id}/results`,
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log('response', response);
          const playerData = response?.data?.results[0]?.answers?.map(
            (value, index) => {
              return createData(
                index + 1,
                new Date(value.questionStartedAt).toLocaleString(),
                new Date(value.answeredAt).toLocaleString(),
                value.correct
              );
            }
          );
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
  }, [id]);
  return (
    <div>
      <NavBar />
      <div className={classes.results}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.row}>
              <TableCell classeName={classes.col}>Qusetion Number</TableCell>
              <TableCell align='right' classeName={classes.col}>Started At</TableCell>
              <TableCell align='right' classeName={classes.col}>Answered At</TableCell>
              <TableCell align='right' classeName={classes.col}>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.questionNo}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                classeName={classes.row}
              >
                <TableCell component='th' scope='row' classeName={classes.col}>
                  {row.questionNo}
                </TableCell>
                <TableCell align='right' classeName={classes.col}>{row.startedAt}</TableCell>
                <TableCell align='right' classeName={classes.col}>{row.answeredAt}</TableCell>
                <TableCell align='right' classeName={classes.col}>
                  {row.answer ? 'Correct' : 'Wrong'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        {/* <h2>Chart</h2> */}
        {/* <CustomChart /> */}
      </div>
    </div>
  );
};

export default Results;
