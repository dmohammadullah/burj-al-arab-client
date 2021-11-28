import React, { useContext } from 'react';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
initializeApp(firebaseConfig);

const Login = () => {

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const { displayName, email } = result.user;
                const signedInUser = {
                    name: displayName,
                    email
                }
                setLoggedInUser(signedInUser);
                storeAuthToken();
                history.replace(from);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });

    }

    const storeAuthToken = () => {
        getAuth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(function (idToken) {
            sessionStorage.setItem('token', idToken);
        }).catch(function (error) {
            // Handle error
        });
    }

    return (
        <div>
            <h1>This is Login</h1>
            <button onClick={handleGoogleSignIn}>Google Sign IN</button>
        </div>
    );
};

export default Login;