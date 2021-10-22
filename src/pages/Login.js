import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link
} from '@material-ui/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { auth } from '../firebase-config';

const Login = () => {
  const navigate = useNavigate();

  const login = (email, password) => {
    try {
      const user = signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then(console.log(auth.currentUser)).catch((error) => { console.log('Here is an error', error); return navigate('/login', { replace: true }); });
      console.log('Current user is ', user);
    } catch (error) {
      console.log('Current error is here');
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>HRMS | Login</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={() => {
              console.log(auth.currentUser == null);
              console.log('Entering this loop');
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h2"
                  >
                    Welcome to CustomHRMS
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Enter manager email and password
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={() => { login(values.email, values.password); }}
                  >
                    Sign in
                  </Button>
                  <Typography
                    color="textSecondary"
                  >
                    If you do not have an account,
                    {' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="h6"
                      underline="hover"
                    >
                      Register
                    </Link>
                    {' '}
                    here
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
