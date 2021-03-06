/* eslint-disable no-underscore-dangle */
import React from 'react';

import {
  Grid,
  Container,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
} from '@mui/material';

import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';

import { useMutation, useQuery } from '@apollo/client';

import { useHistory, Redirect, useLocation } from 'react-router-dom';

import { addToast } from '../../../../redux/toastsActions';

import media from '../../../../assets/media.svg';
import CustomCheckBox from '../../../CustomCheckBox';

import {
  UPDATE_RATING,
  RATINGS,
  BLOGS_AND_ADMINS_AND_ADS,
  FACULTIES_BY_INSTITUTE,
} from '../../../../graphqlQueries';

function RadioCheckedIcon() {
  return (
    <span style={{ borderWidth: '6px' }} className="w-6 h-6 rounded-full border-primary" />
  );
}

function RadioIcon() {
  return (
    <span style={{ borderWidth: '3px' }} className="w-6 h-6 border-gray-400 rounded-full" />
  );
}

function CustomRadio(props) {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<RadioCheckedIcon />}
      icon={<RadioIcon />}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

export default function EditRating() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const rating = location.state[0];
  if (!location.state || !location.state[0] || !user) return <Redirect push to="/profile" />;
  const { faculty } = rating;
  const [updateRating, { loading }] = useMutation(
    UPDATE_RATING,
    {
      refetchQueries: [
        { query: RATINGS },
        { query: FACULTIES_BY_INSTITUTE, variables: { id: Number(faculty.institute) } },
      ],
    },
  );
  const [randomizedBlogs, setRandomizedBlogs] = React.useState([]);
  const [form, setForm] = React.useState(rating);
  function handleTagToggle(tag) {
    if (form.tags.find((t) => t === tag)) {
      setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
    } else {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
  }
  function findTag(tag) {
    return form.tags.find((t) => t === tag) === tag;
  }
  function handleSubmit() {
    updateRating({ variables: { ...form, id: Number(rating._id) } })
      .then(() => {
        dispatch(addToast({ message: 'Rated successfully', severity: 'success' }));
        history.goBack();
      })
      .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
  }
  if (!user) {
    dispatch(addToast({ message: 'Please login first', severity: 'error' }));
    return <Redirect push to="/profile" />;
  }
  const blogsQuery = useQuery(
    BLOGS_AND_ADMINS_AND_ADS,
    { fetchPolicy: 'cache-and-network' },
  );
  function getImgSrc(content) {
    const src = (/<img src="([^"]*([^"]*(?:[^\\"]|\\\\|\\")*)+)"/g).exec(content);
    return src ? src[0].slice(10, -1) : media;
  }
  function getFirstPara(content) {
    const para = String(content);
    return para.replaceAll('<img', '<imx');
  }
  React.useEffect(() => {
    if (!blogsQuery.loading) {
      const blgs = blogsQuery.data.blogs.slice().sort(
        () => (Math.random() - 0.5), // Randomizing array elements
      );
      setRandomizedBlogs(blgs);
    }
  }, [blogsQuery.data?.blogs]);
  return (
    <Grid container className="flex-grow">
      <Container maxWidth="xl" className="flex flex-col justify-between md:flex-row md:gap-9">
        <div className="flex flex-col w-full lg:w-9/12 py-14">
          <Typography variant="h3">Your turn to grade</Typography>
          <Paper elevation={5} className="flex flex-col gap-2 p-4 mt-9 rounded-2xl lg:px-16 lg:py-8 bg-gray-50">
            <Typography className="text-3xl font-bold text-primary">{faculty.firstName}</Typography>
            <Typography className="my-1 text-sm text-gray-600">{faculty.institute.name}</Typography>
            <Typography>
              {faculty.department}
              &nbsp;Department
            </Typography>
            <Typography>
              Courses:
              { faculty.courses.map(
                (course, idx) => (
                  <span>
                    &nbsp;
                    {`${course}${(idx === (faculty.courses.length - 1)) || (idx === 2) ? '' : ','}`}
                  </span>
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
          </Paper>
          <Paper elevation={5} className="flex flex-col gap-2 p-4 mt-9 rounded-2xl lg:px-16 lg:py-8 bg-gray-50">
            <Typography variant="h4" className="pb-3 border-b-2 border-black">Couple of Things to Remember</Typography>
            <Grid container className="mt-5" columnSpacing={3}>
              <Grid item xs={12} md={6} className="pr-9">
                <Typography variant="h5">Do&apos;s</Typography>
                <br />
                <ul className="ml-4 list-disc">
                  <li><Typography>Be Honest</Typography></li>
                  <li><Typography>Check course code</Typography></li>
                  <li>
                    <Typography>
                      Discuss the faculty&apos;s
                      teaching style and abilities
                    </Typography>
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} md={6} className="pr-9">
                <Typography variant="h5">Don&apos;t&apos;s</Typography>
                <br />
                <ul className="ml-4 list-disc">
                  <li><Typography>No profanity</Typography></li>
                  <li><Typography>No name calling</Typography></li>
                  <li>
                    <Typography>
                      Don&apos;t share personal information
                      of you and others
                    </Typography>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={5} className="flex flex-col gap-6 p-4 mt-9 rounded-2xl lg:px-16 lg:py-8 bg-gray-50">
            <div className="flex flex-col gap-6 mx-2">
              <Typography variant="h4" className="pb-3 -mx-2 border-b-2 border-black">Let&apos;s start with basic questions</Typography>
              <Typography className="text-xl">1. What class did you take with this faculty member?</Typography>
              <Select variant="outlined" className="rounded-none w-60" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                {
                  faculty.courses.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)
                }
              </Select>
              <Typography className="text-xl">2. When did you take this class?</Typography>
              <TextField
                variant="outlined"
                className="w-60"
                placeholder="Spring 2023"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              />
              <Typography variant="h4" className="pb-3 -mx-2 border-b-2 border-black">Time to actually grade and evaluate your faculty</Typography>
              <Typography className="text-xl">3. Overall Rating?</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="radio-buttons-group"
                  className="flex flex-row gap-3 -mt-2"
                  value={form.overAllRating}
                  onChange={(e) => setForm({ ...form, overAllRating: Number(e.target.value) })}
                >
                  <FormControlLabel value={12} control={<CustomRadio />} label="A+" />
                  <FormControlLabel value={11} control={<CustomRadio />} label="A" />
                  <FormControlLabel value={10} control={<CustomRadio />} label="A-" />
                  <FormControlLabel value={9} control={<CustomRadio />} label="B+" />
                  <FormControlLabel value={8} control={<CustomRadio />} label="B" />
                  <FormControlLabel value={7} control={<CustomRadio />} label="B-" />
                  <FormControlLabel value={6} control={<CustomRadio />} label="C+" />
                  <FormControlLabel value={5} control={<CustomRadio />} label="C" />
                  <FormControlLabel value={4} control={<CustomRadio />} label="C-" />
                  <FormControlLabel value={3} control={<CustomRadio />} label="D" />
                  <FormControlLabel value={2} control={<CustomRadio />} label="E" />
                  <FormControlLabel value={1} control={<CustomRadio />} label="F" />
                </RadioGroup>
              </FormControl>
              <Typography className="text-xl">4. Difficulty Level?</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="radio-buttons-group"
                  className="flex flex-row gap-3 -mt-2"
                  value={form.levelOfDifficulty}
                  onChange={(e) => setForm({ ...form, levelOfDifficulty: Number(e.target.value) })}
                >
                  <FormControlLabel value={1} control={<CustomRadio />} label="1" />
                  <FormControlLabel value={2} control={<CustomRadio />} label="2" />
                  <FormControlLabel value={3} control={<CustomRadio />} label="3" />
                  <FormControlLabel value={4} control={<CustomRadio />} label="4" />
                  <FormControlLabel value={5} control={<CustomRadio />} label="5" />
                </RadioGroup>
              </FormControl>
              <Typography className="text-xl">5. Select the tags that describe the faculty</Typography>
              <div className="flex flex-col gap-5 md:gap-0 md:flex-row">
                <div className="flex flex-col w-full gap-2 md:w-1/3">
                  <Typography className="font-bold">Workload</Typography>
                  <CustomCheckBox label="Lots of Homework" labelClassName="font-semibold text-gray-500" checked={findTag('Lots of Homework')} onClick={() => handleTagToggle('Lots of Homework')} />
                  <CustomCheckBox label="Moderate exams" labelClassName="font-semibold text-gray-500" checked={findTag('Moderate Exams')} onClick={() => handleTagToggle('Moderate Exams')} />
                  <CustomCheckBox label="Hard grading" labelClassName="font-semibold text-gray-500" checked={findTag('Hard grading')} onClick={() => handleTagToggle('Hard grading')} />
                </div>
                <div className="flex flex-col w-full gap-2 md:w-1/3">
                  <Typography className="font-bold">Personality</Typography>
                  <CustomCheckBox label="Passionate" labelClassName="font-semibold text-gray-500" checked={findTag('Passionate')} onClick={() => handleTagToggle('Passionate')} />
                  <CustomCheckBox label="Motivational" labelClassName="font-semibold text-gray-500" checked={findTag('Motivational')} onClick={() => handleTagToggle('Motivational')} />
                  <CustomCheckBox label="Dedicated" labelClassName="font-semibold text-gray-500" checked={findTag('Dedicated')} onClick={() => handleTagToggle('Dedicated')} />
                </div>
                <div className="flex flex-col w-full gap-2 md:w-1/3">
                  <Typography className="font-bold">Extra</Typography>
                  <CustomCheckBox label="Caring" labelClassName="font-semibold text-gray-500" checked={findTag('Caring')} onClick={() => handleTagToggle('Caring')} />
                  <CustomCheckBox label="Long classes" labelClassName="font-semibold text-gray-500" checked={findTag('Long classes')} onClick={() => handleTagToggle('Long classes')} />
                  <CustomCheckBox label="Respected" labelClassName="font-semibold text-gray-500" checked={findTag('Respected')} onClick={() => handleTagToggle('Respected')} />
                </div>
              </div>
              <Typography className="text-xl">6. Would you take a class with this faculty again?</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="radio-buttons-group"
                  className="flex flex-row gap-3 -mt-2"
                  value={form.wouldTakeAgain ? 'Yes' : 'No'}
                  onChange={(e) => setForm({ ...form, wouldTakeAgain: e.target.value === 'Yes' })}
                >
                  <FormControlLabel value="Yes" control={<CustomRadio />} label="Yes" />
                  <FormControlLabel value="No" control={<CustomRadio />} label="No" />
                </RadioGroup>
              </FormControl>
              <Typography className="text-xl">7. Is attendance manadatory?</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="radio-buttons-group"
                  className="flex flex-row gap-3 -mt-2"
                  value={form.isAttendanceMandatory ? 'Yes' : 'No'}
                  onChange={(e) => setForm({ ...form, isAttendanceMandatory: e.target.value === 'Yes' })}
                >
                  <FormControlLabel value="Yes" control={<CustomRadio />} label="Yes" />
                  <FormControlLabel value="No" control={<CustomRadio />} label="No" />
                </RadioGroup>
              </FormControl>
              <Typography className="text-xl">Now, share your thoughts.</Typography>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                className="w-full md:w-4/6"
                value={form.thoughts}
                onChange={(e) => setForm({ ...form, thoughts: e.target.value })}
              />
              <Button variant="contained" disabled={loading} className="self-center px-16 py-3 rounded-full" onClick={() => handleSubmit()}>
                {
                  loading
                    ? <CircularProgress />
                    : 'Submit'
                }
              </Button>
            </div>
          </Paper>
        </div>
        <div className="flex-col h-auto gap-10 lg:flex lg:w-3/12 py-14">
          <Typography variant="h4">Our Blog</Typography>
          {
            randomizedBlogs.map((blg, idx, arr) => (
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
