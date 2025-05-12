import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminSession, setIsAdminSession] = useState(false);


  async function register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);


      await updateProfile(userCredential.user, {
        displayName: username
      });

    
      await set(ref(database, 'users/' + userCredential.user.uid), {
        email: email,
        username: username,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }


  async function login(email, password) {
    try {
 
      if (email.endsWith('@yogee.com')) {
        await signOut(auth);
        throw new Error('This appears to be an admin account. Please use the admin login page.');
      }

      const result = await signInWithEmailAndPassword(auth, email, password);


      await result.user.getIdToken(true);

      const idTokenResult = await result.user.getIdTokenResult();


      if (idTokenResult.claims.admin === true) {
        await signOut(auth);
        throw new Error('This is an admin account. Please use the admin login page.');
      }

 
      const userRef = ref(database, 'users/' + result.user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (userData.role === 'admin') {
        
          await signOut(auth);
          throw new Error('This is an admin account. Please use the admin login page.');
        }


        await set(ref(database, 'users/' + result.user.uid + '/lastLogin'), new Date().toISOString());
        setIsAdminSession(false);
      } else {
  
        await set(ref(database, 'users/' + result.user.uid), {
          email: result.user.email,
          username: result.user.displayName || 'User',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

 
  async function adminLogin(email, password) {
    try {

      await signOut(auth);


      if (!email.endsWith('@yogee.com')) {
        throw new Error('Admin accounts must use @yogee.com email addresses.');
      }

      const result = await signInWithEmailAndPassword(auth, email, password);

      await result.user.getIdToken(true);


      const idTokenResult = await result.user.getIdTokenResult();

      if (idTokenResult.claims.admin === true) {
        console.log('Admin login successful - user has admin claim');
      
        await set(ref(database, 'users/' + result.user.uid + '/lastLogin'), new Date().toISOString());
        setIsAdminSession(true);

      
        const userRef = ref(database, 'users/' + result.user.uid);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {

          await set(userRef, {
            email: result.user.email,
            username: result.user.displayName || 'Admin User',
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        } else if (snapshot.val().role !== 'admin') {
     
          await set(ref(database, 'users/' + result.user.uid + '/role'), 'admin');
          await set(ref(database, 'users/' + result.user.uid + '/lastUpdated'), new Date().toISOString());
        }

        return result;
      }


      const userRef = ref(database, 'users/' + result.user.uid);
      const snapshot = await get(userRef);


      const adminRef = ref(database, 'adminUsers/' + result.user.uid);
      const adminSnapshot = await get(adminRef);

      if ((snapshot.exists() && snapshot.val().role === 'admin') || adminSnapshot.exists()) {
        console.log('Admin login successful - user has admin role in database');
  
        await set(ref(database, 'users/' + result.user.uid + '/lastLogin'), new Date().toISOString());
        setIsAdminSession(true);

        try {
         
        
          console.log('Note: Custom claims can only be set by Firebase Admin SDK in the backend');
        } catch (error) {
          console.error('Error setting custom claim:', error);
        }

        return result;
      }

     
      console.log('Admin login failed - user does not have admin privileges');
      await signOut(auth);
      throw new Error('You do not have admin privileges.');
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }


  async function loginWithGoogle() {
    try {

      if (auth.currentUser) {
        await signOut(auth);
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);


      if (result.user.email.endsWith('@yogee.com')) {
        console.log('Google login detected admin email domain');
        await signOut(auth);
        throw new Error('This appears to be an admin account. Please use the admin login page.');
      }

      
      await result.user.getIdToken(true);

      const idTokenResult = await result.user.getIdTokenResult();


      if (idTokenResult.claims.admin === true) {
        console.log('Google login detected admin account');
        await signOut(auth);
        throw new Error('This is an admin account. Please use the admin login page.');
      }


      const userRef = ref(database, 'users/' + result.user.uid);
      const snapshot = await get(userRef);

    
      const adminRef = ref(database, 'adminUsers/' + result.user.uid);
      const adminSnapshot = await get(adminRef);

      if (adminSnapshot.exists()) {
        await signOut(auth);
        throw new Error('This is an admin account. Please use the admin login page.');
      }

      if (!snapshot.exists()) {
      
        await set(userRef, {
          email: result.user.email,
          username: result.user.displayName || 'User',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } else {
        const userData = snapshot.val();

        if (userData.role === 'admin') {
   
          await signOut(auth);
          throw new Error('This is an admin account. Please use the admin login page.');
        }

           await set(ref(database, 'users/' + result.user.uid + '/lastLogin'), new Date().toISOString());
      }

      console.log('Google login successful for regular user');
      setIsAdminSession(false);
      return result;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }


  async function logout() {
    try {
      await signOut(auth);
      setIsAdminSession(false);
      return true;
    } catch (error) {
      throw error;
    }
  }

  
  async function isAdmin(uid) {
    try {
      
      if (!currentUser) {
        return false;
      }

    
      if (currentUser.email.endsWith('@yogee.com')) {
        return true;
      }

     
      const idTokenResult = await currentUser.getIdTokenResult();
      if (idTokenResult.claims.admin === true) {
        return true;
      }

    
      const userRef = ref(database, 'users/' + uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.role === 'admin';
      }


      const adminRef = ref(database, 'adminUsers/' + uid);
      const adminSnapshot = await get(adminRef);
      if (adminSnapshot.exists()) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }


  async function getUserDetails(uid) {
    try {
      const userRef = ref(database, 'users/' + uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return snapshot.val();
      }

      return null;
    } catch (error) {
      console.error('Error getting user details:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        console.log('User is signed in:', user.email);

        const isAdminEmail = user.email.endsWith('@yogee.com');
        console.log('Is admin email domain:', isAdminEmail);

       
        const details = await getUserDetails(user.uid);
        setUserDetails(details);

        try {
       
          const idTokenResult = await user.getIdTokenResult(true);
          const claims = idTokenResult.claims;

     
          const isAdminEmail = user.email.endsWith('@yogee.com');

          if (claims.admin === true || isAdminEmail) {
            console.log('This user is an administrator!');

  
            const isAdminPath = window.location.pathname.includes('admin');
            console.log('Is admin path:', isAdminPath);

            if (isAdminPath) {
              setIsAdminSession(true);

       
              if (!details || details.role !== 'admin') {
                await set(ref(database, 'users/' + user.uid), {
                  ...(details || {}),
                  email: user.email,
                  username: user.displayName || 'Admin User',
                  role: 'admin',
                  lastUpdated: new Date().toISOString()
                });

              
                const updatedDetails = await getUserDetails(user.uid);
                setUserDetails(updatedDetails);
              }
            } else {
          
              setIsAdminSession(false);
              console.log('Admin user on regular page, not setting admin session');
            }
          } else {
            console.log('This user is a regular user.');

           
            const isAdminPath = window.location.pathname.includes('admin');

            if (isAdminPath) {
             
              console.log('Regular user on admin page, not setting admin session');
              setIsAdminSession(false);
            } else {
  
              setIsAdminSession(false);
            }
          }
        } catch (error) {
          console.error('Error getting ID token or claims:', error);

      
          const isAdminEmail = user.email.endsWith('@yogee.com');
          const isAdminInDatabase = details && details.role === 'admin';
          const isAdminPath = window.location.pathname.includes('admin');

          if ((isAdminEmail || isAdminInDatabase) && isAdminPath) {
            console.log('Fallback: Setting admin session based on email domain or database role');
            setIsAdminSession(true);
          } else {
            setIsAdminSession(false);
          }
        }
      } else {
    
        console.log('No user is signed in.');
        setUserDetails(null);
        setIsAdminSession(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);


  async function refreshUserDetails() {
    if (currentUser) {
      const details = await getUserDetails(currentUser.uid);
      setUserDetails(details);
      return details;
    }
    return null;
  }

  const value = {
    currentUser,
    userDetails,
    register,
    login,
    adminLogin,
    loginWithGoogle,
    logout,
    isAdmin,
    getUserDetails,
    refreshUserDetails,
    isAdminSession
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
