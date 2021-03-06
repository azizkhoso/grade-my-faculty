/* eslint-disable no-confusing-arrow */
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
  IconButton,
} from '@mui/material';

import { BookmarkOutlined } from '@mui/icons-material';

import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';

import { useHistory, Redirect } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/client';
import {
  RATINGS,
  BLOGS,
  ADD_LIKE,
  ADD_DISLIKE,
  SAVE_FACULTY,
} from '../../../../graphqlQueries';

import { addToast } from '../../../../redux/toastsActions';
import { setUser } from '../../../../redux/accountActions';

import { calculateAverageOverAllRating, mapAverageOverAllRating } from '../../../../utils/calculateAverageOverAllRating';

import like from '../../../../assets/like.svg';
import liked from '../../../../assets/liked.svg';
import unlike from '../../../../assets/unlike.svg';
import unliked from '../../../../assets/unliked.svg';
import media from '../../../../assets/media.svg';
import ReportDialog from './ReportDialog';

export default function Grade() {
  const history = useHistory();
  const { location } = history;
  const user = useSelector((state) => state.account.user);
  if (!location.state || !location.state[0]) return <Redirect push to="/" />;
  const dispatch = useDispatch();
  const [loadMore, setLoadMore] = React.useState(false);
  const [reportId, setReportId] = React.useState(0);
  const faculty = location.state[location.state.length - 1];
  const { loading, data } = useQuery(
    RATINGS,
    { variables: { faculty: Number(faculty._id), limit: loadMore ? undefined : 3 }, fetchPolicy: 'cache-and-network' },
  );
  const blogsQuery = useQuery(
    BLOGS,
    { fetchPolicy: 'cache-and-network' },
  );
  const [addLike] = useMutation(ADD_LIKE, { refetchQueries: [{ query: RATINGS }] });
  const [addDisLike] = useMutation(ADD_DISLIKE, { refetchQueries: [{ query: RATINGS }] });
  const [saveFaculty] = useMutation(SAVE_FACULTY);
  function onLike(rating) {
    if (!user) dispatch(addToast({ message: 'Please login first', severity: 'error' }));
    else {
      addLike({ variables: { rating: Number(rating) } })
        .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
    }
  }
  function onDisLike(rating) {
    if (!user) dispatch(addToast({ message: 'Please login first', severity: 'error' }));
    else {
      addDisLike({ variables: { rating: Number(rating) } })
        .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
    }
  }
  function handleSave(fac) {
    if (!user) return dispatch(addToast({ message: 'Please login first', severity: 'error' }));
    return saveFaculty({ variables: { faculty: Number(fac) } })
      .then((r) => dispatch(setUser({ ...user, savedFaculties: r.data.saveFaculty })))
      .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
  }
  function calculateLevelOfDifficulty(ratings) {
    if (!ratings) return -1;
    let total = 0;
    ratings.forEach((r) => { total += r.levelOfDifficulty; });
    if (total === 0) return 0;
    return Number(total / ratings.length).toFixed(1);
  }
  function getImgSrc(content) {
    const src = (/<img src="([^"]*([^"]*(?:[^\\"]|\\\\|\\")*)+)"/g).exec(content);
    return src ? src[0].slice(10, -1) : media;
  }
  function getFirstPara(content) {
    const para = String(content);
    return para.replaceAll('<img', '<imx');
  }
  return (
    <Grid container className="flex-grow w-full">
      <Container maxWidth="xl" className="flex flex-col justify-between md:flex-row md:gap-9">
        <div className="flex flex-col w-full lg:w-9/12 py-14">
          <Typography variant="h3">{faculty.institute.name}</Typography>
          <Paper elevation={2} className="flex flex-col gap-2 p-4 mt-6 rounded-2xl lg:px-16 lg:pt-8 lg:pb-6 bg-gray-50">
            <div className="flex justify-between w-full gap-2">
              <Typography className="text-3xl font-bold text-primary">{faculty.firstName}</Typography>
              <IconButton onClick={() => handleSave(faculty._id)}>
                <BookmarkOutlined color={`${user?.savedFaculties?.includes(Number(faculty._id)) && 'primary'}`} />
              </IconButton>
            </div>
            <Typography className="font-bold">{faculty.institute.name}</Typography>
            <Typography>
              {faculty.department}
              &nbsp;Department
            </Typography>
            <Typography>
              Courses:
              { faculty.courses.slice(0, 3).map(
                (course, idx) => (
                  <>
                    {` ${course}${(idx === (faculty.courses.length - 1)) || (idx === 2) ? '' : ','}`}
                  </>
                ),
              )}
              {
                faculty.courses.length > 3 && (
                  <>
                    &nbsp;
                    and so on.
                  </>
                )
              }
            </Typography>
            <div className="flex-col hidden md:flex">
              <div className="flex items-end gap-3">
                <Typography className="w-3/12 text-4xl font-extrabold text-center">
                  {data && (() => {
                    let total = 0;
                    const { ratings } = data;
                    ratings.forEach((r) => {
                      if (r.wouldTakeAgain) total += 1;
                    });
                    if (total === 0) return 0;
                    return Number((total / ratings.length) * 100).toFixed(0);
                  })()}
                  %
                </Typography>
                <Typography className="w-3/12 text-4xl font-extrabold text-center">
                  {data && calculateLevelOfDifficulty(data?.ratings)}
                  /5.0
                </Typography>
                <Typography className="w-6/12 font-extrabold text-center text-7xl">
                  { mapAverageOverAllRating(calculateAverageOverAllRating(data?.ratings)) }
                </Typography>
              </div>
              <div className="flex gap-3">
                <Typography className="w-3/12 mt-2 text-xs text-center">Would take again</Typography>
                <Typography className="w-3/12 mt-2 text-xs text-center">Level of difficulty</Typography>
                <Typography className="w-6/12 mt-2 text-xs text-center">
                  Based on&nbsp;
                  {data && data?.ratings.length}
                  &nbsp;students
                  <br />
                  evaluations rated from A to F
                </Typography>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:hidden">
              <div className="flex flex-col items-center">
                <Typography className="text-4xl font-extrabold text-center">
                  {data && (() => {
                    let total = 0;
                    const { ratings } = data;
                    ratings.forEach((r) => {
                      if (r.wouldTakeAgain) total += 1;
                    });
                    if (total === 0) return 0;
                    return Number((total / ratings.length) * 100).toFixed(0);
                  })()}
                  %
                </Typography>
                <Typography className="mt-2 text-xs text-center">Would take again</Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography className="w-full text-4xl font-extrabold text-center">
                  {data && calculateLevelOfDifficulty(data?.ratings)}
                  /5.0
                </Typography>
                <Typography className="w-full mt-2 text-xs text-center">Level of difficulty</Typography>
              </div>
              <div className="flex flex-col items-center">
                <Typography className="font-extrabold text-center text-7xl">
                  { mapAverageOverAllRating(calculateAverageOverAllRating(data?.ratings)) }
                </Typography>
                <Typography className="mt-2 text-xs text-center">
                  Based on&nbsp;
                  {data && data?.ratings.length}
                  &nbsp;students
                  <br />
                  evaluations rated from A to F
                </Typography>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6 md:flex-row">
              <div className="order-2 w-full md:w-1/2 md:order-1">
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
              <div className="flex justify-center order-1 w-full md:w-1/2 md:order-2">
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
            { loading && <div className="flex justify-center w-full"><CircularProgress /></div> }
            {
              !loading && data?.ratings.map(
                (rate) => (
                  <Grid container key={rate._id}>
                    <Grid item xs={12} sm={3} className="flex flex-row p-3 bg-primary md:flex-col">
                      <Typography className="self-center w-1/2 text-3xl font-semibold text-center text-white">
                        {
                          mapAverageOverAllRating(
                            calculateAverageOverAllRating([{ overAllRating: rate.overAllRating }]),
                          )
                        }
                      </Typography>
                      <Typography className="w-full text-center text-white md:text-xs">Faculty Rating</Typography>
                      <span className="flex-grow" />
                      <Typography className="self-center text-3xl font-semibold text-center text-white w-min">
                        { Number(rate.levelOfDifficulty).toFixed(1) }
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
                          rate.tags.length === 0 && <Typography variant="h6" color="primary">No Attributes yet</Typography>
                        }
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <img src={rate.likes.find((l) => l?._id === Number(user?._id)) ? liked : like} alt="like" className="w-4 transition duration-500 transform hover:scale-150" onClick={() => onLike(rate._id)} />
                        <span className="text-sm text-gray-500">{rate.likes.length || 0}</span>
                        <img src={rate.disLikes.find((d) => d?._id === Number(user?._id)) ? unliked : unlike} alt="unlike" className="w-4 transition duration-500 transform hover:scale-150" onClick={() => onDisLike(rate._id)} />
                        <span className="text-sm text-gray-500">{rate.disLikes.length || 0}</span>
                        <span className="flex-grow" />
                        <Button
                          variant="text"
                          color="error"
                          className="text-xs"
                          onClick={() => {
                            if (!user) dispatch(addToast({ message: 'Please login first', severity: 'error' }));
                            else setReportId(rate._id);
                          }}
                        >
                          <span className="normal-case">Report this rating</span>
                        </Button>
                        {
                          Boolean(reportId) && ( // 0 value returns false
                            <ReportDialog
                              open
                              ratingId={reportId}
                              handleClose={() => setReportId(0)}
                            />
                          )
                        }
                      </div>
                    </Grid>
                  </Grid>
                ),
              )
            }
            {
              !loadMore && !loading && (data?.ratings.length === 3)
                ? (
                  <div className="flex justify-end pt-6 mt-8 border-t-2 border-black">
                    <Button variant="contained" className="px-6 rounded-lg" onClick={() => setLoadMore(true)}>Load More</Button>
                  </div>
                )
                : ''
            }
            {
              !loading && data?.ratings.length === 0 && <Typography variant="h6" color="primary" align="center">No ratings yet</Typography>
            }
          </Paper>
        </div>
        <div className="flex flex-col h-auto gap-10 lg:w-3/12 py-14">
          <Typography variant="h4">Our Blog</Typography>
          {
            !blogsQuery.loading
            && blogsQuery.data.blogs.slice().sort(
              () => (Math.random() - 0.5), // Radomizing array elements
            ).map((blg, idx, arr) => (
              <Paper elevation={3} key={blg._id} onClick={() => history.push(`/post/${blg._id}`, [blg, arr])} className="flex flex-col w-full gap-5 pb-3 my-6 transform lg:my-0">
                <img src={getImgSrc(blg.content)} alt="blog" className="w-full" style={{ maxHeight: '200px' }} />
                <div className="flex flex-col w-full gap-5 px-6">
                  <Typography className="text-sm text-gray-500 uppercase">{ moment(blg.createdAt).format('DD MMMM YYYY') }</Typography>
                  <Typography variant="h4">{blg.title}</Typography>
                  <Typography className="overflow-hidden font-semibold text-gray-500 max-h-20">
                    <span
                      dangerouslySetInnerHTML={{ __html: getFirstPara(blg.content) }}
                    />
                  </Typography>
                  <Button variant="text" color="primary" className="self-start pl-0" onClick={() => history.push(`/post/${blg._id}`, [blg, arr])}>Read more</Button>
                </div>
              </Paper>
            ))
          }
        </div>
      </Container>
    </Grid>
  );
}
