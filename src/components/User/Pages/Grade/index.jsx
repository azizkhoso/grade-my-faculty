/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import {
  Grid,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';

import { useHistory, Redirect } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { RATINGS } from '../../../../graphqlQueries';

import { addToast } from '../../../../redux/toastsActions';

import like from '../../../../assets/like.svg';
import unlike from '../../../../assets/unlike.svg';
import media2 from '../../../../assets/media2.png';

export default function Grade() {
  const history = useHistory();
  const { location } = history;
  if (!location.state || !location.state[0]) return <Redirect push to="/" />;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const faculty = location.state[location.state.length - 1];
  const [likes, setLikes] = React.useState(3);
  const [dislikes, setDisLikes] = React.useState(1);
  const { loading, data } = useQuery(
    RATINGS,
    { variables: { faculty: Number(faculty._id) }, fetchPolicy: 'network-only' },
  );
  function calculateLevelOfDifficulty() {
    const { ratings } = data;
    let total = 0;
    ratings.forEach((r) => { total += r.levelOfDifficulty; });
    if (total === 0) return 0;
    return Number(total / ratings.length).toFixed(1);
  }
  return (
    <Grid container className="flex-grow w-full">
      <Container maxWidth="xl" className="flex flex-col justify-between md:flex-row md:gap-9">
        <div className="flex flex-col w-full lg:w-9/12 py-14">
          <Typography variant="h3">{faculty.institute.name}</Typography>
          <Typography variant="body1" className="font-bold">Dhaka, Bangladesh</Typography>
          <Paper elevation={2} className="flex flex-col gap-2 p-4 mt-6 rounded-2xl lg:px-16 lg:pt-8 lg:pb-20 bg-gray-50">
            <Typography className="text-3xl font-bold text-primary">{faculty.firstName}</Typography>
            <Typography className="font-bold">{faculty.institute.name}</Typography>
            <Typography>
              {faculty.department}
              &nbsp;Department
            </Typography>
            <Typography>
              Courses:
              { faculty.courses.map(
                (course) => (
                  <span>
                    &nbsp;
                    {course}
                    ,
                  </span>
                ),
              )}
              &nbsp;
              and so on.
            </Typography>
            <div className="flex flex-col">
              <div className="flex items-end gap-3">
                <Typography className="w-3/12 text-4xl font-extrabold text-center">
                  {data && (() => {
                    let total = 0;
                    const { ratings } = data;
                    ratings.forEach((r) => {
                      if (r.wouldTakeAgain) total += 1;
                    });
                    if (total === 0) return 0;
                    return Number((total / ratings.length) * 100).toFixed(1);
                  })()}
                  %
                </Typography>
                <Typography className="w-3/12 text-4xl font-extrabold text-center">
                  {data && calculateLevelOfDifficulty()}
                </Typography>
                <Typography className="w-6/12 font-extrabold text-center text-7xl">
                  A
                </Typography>
              </div>
              <div className="flex gap-3">
                <Typography className="w-3/12 mt-2 text-xs text-center">Would take again</Typography>
                <Typography className="w-3/12 mt-2 text-xs text-center">Level of difficulty</Typography>
                <Typography className="w-6/12 mt-2 text-xs text-center">
                  Based on&nbsp;
                  {data && data.ratings.length}
                  &nbsp;students
                  <br />
                  evaluations
                </Typography>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <div className="w-1/2">
                <Typography className="mb-12 text-3xl font-semibold">Attributes</Typography>
                <div className="flex flex-wrap justify-between gap-3 w-72">
                  {
                    faculty.attributes.map((attr) => (
                      <Chip variant="filled" label={attr} sx={{ minWidth: '95px' }} />
                    ))
                  }
                  {
                    faculty.attributes.length === 0 && <Typography variant="h6" color="primary">No Attributes yet</Typography>
                  }
                </div>
              </div>
              <div className="flex justify-center w-1/2">
                <Button
                  variant="contained"
                  className="py-6 rounded-full h-9"
                  onClick={() => {
                    if (user) history.push('/grading', [faculty]);
                    else dispatch(addToast({ message: 'Please login first', severity: 'error' }));
                  }}
                >
                  Grade this faculty
                </Button>
              </div>
            </div>
          </Paper>
          <Paper elevation={2} className="flex flex-col gap-6 p-4 px-4 mt-24 rounded-2xl lg:px-16 lg:pt-8 lg:pb-5 bg-gray-50">
            <Typography className="py-2 text-4xl font-bold border-b-2 border-black">Evaluations</Typography>
            { loading && <CircularProgress /> }
            {
              !loading && data.ratings.map(
                (rate) => (
                  <Grid container>
                    <Grid item xs={12} sm={3} className="flex flex-row p-3 bg-primary md:flex-col">
                      <Typography className="self-center w-full text-3xl font-semibold text-center text-white">A</Typography>
                      <span className="flex-grow" />
                      <Typography className="self-center text-3xl font-semibold text-center text-white w-min">
                        { calculateLevelOfDifficulty() }
                      </Typography>
                      <Typography className="w-full text-center text-white md:text-xs">Level of Difficulty</Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="flex flex-col gap-4 px-2 pb-3 bg-white pt-9 md:px-9">
                      <div className="flex justify-between w-full gap-2 md:px-8">
                        <Typography className="font-medium text-gray-500">{ (new Date(rate.createdAt)).toLocaleDateString() }</Typography>
                        <Typography className="font-medium text-gray-500">{ rate.course }</Typography>
                      </div>
                      <Typography className="text-lg">
                        { rate.thoughts }
                      </Typography>
                      <div className="flex flex-wrap w-full gap-4 mt-12">
                        {
                          rate.tags.length > 0 && rate.tags.length >= 3
                            ? (
                              <>
                                <Chip variant="filled" label={rate.tags[0]} sx={{ minWidth: '9rem', fontSize: '11px', color: 'gray' }} />
                                <Chip variant="filled" label={rate.tags[1]} sx={{ minWidth: '9rem', fontSize: '11px', color: 'gray' }} />
                                <Chip variant="filled" label={rate.tags[2]} sx={{ minWidth: '9rem', fontSize: '11px', color: 'gray' }} />
                              </>
                            )
                            : (
                              rate.tags.map((tag) => (
                                <Chip variant="filled" label={tag} key={tag} sx={{ minWidth: '9rem', fontSize: '11px', color: 'gray' }} />
                              ))
                            )
                        }
                        {
                          rate.tags.length === 0 && <Typography variant="h6" color="primary">No Ratings yet</Typography>
                        }
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <img src={like} alt="like" className="w-4 transition duration-500 transform hover:scale-150" onClick={() => setLikes(likes + 1)} />
                        <span className="text-sm text-gray-500">{likes}</span>
                        <img src={unlike} alt="unlike" className="w-4 transition duration-500 transform hover:scale-150" onClick={() => setDisLikes(dislikes + 1)} />
                        <span className="text-sm text-gray-500">{dislikes}</span>
                        <span className="flex-grow" />
                        <Typography variant="caption" color="error">Report this Rating</Typography>
                      </div>
                    </Grid>
                  </Grid>
                ),
              )
            }
            {
              !loading && data.ratings.length < 0 && data.ratings.length > 3
                ? (
                  <div className="flex justify-end pt-6 mt-8 border-t-2 border-black">
                    <Button variant="contained" className="px-6 rounded-lg">Load More</Button>
                  </div>
                )
                : ''
            }
            {
              !loading && data.ratings.length === 0 && <Typography variant="h6" color="primary" align="center">No ratings yet</Typography>
            }
          </Paper>
        </div>
        <div className="flex flex-col h-auto gap-10 lg:w-3/12 py-14">
          <Typography variant="h4">Our Blog</Typography>
          {
            [1, 2, 3].map(
              () => (
                <Paper elevation={3} className="flex flex-col w-full gap-5 pb-3 my-6 lg:my-0">
                  <img src={media2} alt="blog" className="w-full" />
                  <div className="flex flex-col w-full gap-5 px-6">
                    <Typography className="text-sm text-gray-500 uppercase">20 July 2019</Typography>
                    <Typography variant="h4">Life tips from top ten adventure travelers</Typography>
                    <Typography className="font-semibold text-gray-500">Slate helps you see how many more days you....</Typography>
                    <Button variant="text" color="primary" className="self-start pl-0" onClick={() => history.push('/post')}>Read more</Button>
                  </div>
                </Paper>
              ),
            )
          }
        </div>
      </Container>
    </Grid>
  );
}
