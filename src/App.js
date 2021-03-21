import logo from './logo.svg';
import React, { useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import './App.css';

firebase.initializeApp({
 
    apiKey: "AIzaSyA4RH2KX2sX5elFEaxpmBq_7iZ5o5VnDJQ",
    authDomain: "superchat-69302.firebaseapp.com",
    projectId: "superchat-69302",
    storageBucket: "superchat-69302.appspot.com",
    messagingSenderId: "1037025320807",
    appId: "1:1037025320807:web:d375c1c2b3907cbf5659c2",
    measurementId: "G-GTWKBYYVCY"
 
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}



function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.SignOut()}>Sign Out</button>
  )

}
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField:'id'});

  const [formValue, setFormValue] = useState('');

const sendMessage = async(e) => {
  e.preventDefault();

  const {uid,photoURL} = auth.currentUser;

  await messagesRef.add({
    text:formValue,
    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  });
  setFormValue('');
  dummy.current.scrollIntoView({behavior:'smooth'});
}

  return(
    <>
    <div>
    {messages && messages.map(msg=> <ChatMessage key ={msg.id} message={msg}/>)}
    <div ref={dummy}>

    </div>
    </div>

    <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
    <button type="submit">🦩</button>

    </form>

    </>
  )
}

function ChatMessage(props) {
 const {text,uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
   <div className={`message ${messageClass}`}>
     <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
    <p>{text}</p>

    </div>

  )
}
export default App;
