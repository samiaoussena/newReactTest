import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyCrM5qG6NZyRGQFap25OgyePrigtj3UvmU',
    authDomain: 'test888-1b6c2.firebaseapp.com'
};

try {
    firebase.initializeApp(config);
} catch (e) {
    console.error('Error initializing firebase — check your source code');
    console.error(e);
}

export { firebase };