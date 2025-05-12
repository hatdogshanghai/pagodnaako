import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { database, storage } from '../services/firebase';

import '../styles/pages/ProfileNew.css';

const Profile = () => {
  const { currentUser, userDetails, refreshUserDetails } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });


  useEffect(() => {
   
    document.body.classList.add('new-profile-page');

    if (currentUser && userDetails) {
      setUsername(userDetails.username || currentUser.displayName || '');
      setProfileImage(userDetails.profileImage || null);

    
      const fetchOrders = async () => {
        try {
          const ordersRef = ref(database, `users/${currentUser.uid}/orders`);
          const snapshot = await get(ordersRef);

          if (snapshot.exists()) {
            const ordersData = snapshot.val();
            const ordersArray = Object.keys(ordersData).map(key => ({
              id: key,
              ...ordersData[key]
            }));

       
            ordersArray.sort((a, b) => new Date(b.date) - new Date(a.date));

            setOrders(ordersArray);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }


    return () => {
      document.body.classList.remove('new-profile-page');
    };
  }, [currentUser, userDetails]);


  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setMessage({ text: 'Updating profile...', type: 'info' });

  
      await update(ref(database, `users/${currentUser.uid}`), {
        username: username
      });

   
   if (profileImage && profileImage instanceof File) {
        const imageRef = storageRef(storage, `profile-images/${currentUser.uid}`);
        await uploadBytes(imageRef, profileImage);
        const imageUrl = await getDownloadURL(imageRef);

   
        await update(ref(database, `users/${currentUser.uid}`), {
          profileImage: imageUrl
        });
      }

      await refreshUserDetails();

      setMessage({ text: 'Profile updated successfully!', type: 'success' });

      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
    }
  };

  const handleRemoveImage = async () => {
    try {
      setMessage({ text: 'Removing image...', type: 'info' });

      if (userDetails?.profileImage) {
        const imageRef = storageRef(storage, `profile-images/${currentUser.uid}`);
        await deleteObject(imageRef);
      }

      await update(ref(database, `users/${currentUser.uid}`), {
        profileImage: null
      });

      setImagePreview('');
      setProfileImage(null);

      await refreshUserDetails();

      setMessage({ text: 'Profile image removed successfully!', type: 'success' });

      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error removing profile image:', error);
      setMessage({ text: 'Error removing profile image. Please try again.', type: 'error' });
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);

  const [addresses] = useState([
    {
      id: 1,
      street: '1234 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'USA'
    },
    {
      id: 2,
      street: '279 Maple Avenue',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'USA'
    }
  ]);


  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  return (
    <>
      <Header />

      <main className="profile-new">
        <div className="profile-layout">
          {}
          <div className="profile-sidebar" id="profile-sidebar-new">
            <div className="profile-image-container">
              {userDetails?.profileImage ? (
                <img
                  src={userDetails.profileImage + '?t=' + new Date().getTime()}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <i className='bx bx-user'></i>
                </div>
              )}
            </div>
            <h2 className="profile-name">{userDetails?.username || currentUser.displayName || 'User'}</h2>
            <p className="profile-email">{currentUser?.email}</p>
            <button className="edit-profile-btn" onClick={toggleEditModal}>Edit Profile</button>
          </div>

          {}
          <div className="profile-main">
            {}
            {message.text && (
              <div className={`message ${message.type}`} style={{marginBottom: '20px'}}>
                {message.type === 'success' && <i className='bx bx-check-circle'></i>}
                {message.type === 'error' && <i className='bx bx-error-circle'></i>}
                {message.type === 'info' && <i className='bx bx-info-circle'></i>}
                <span>{message.text}</span>
              </div>
            )}

            {}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Recent Orders</h3>
              </div>

              {loading ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <i className='bx bx-package'></i>
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.slice(0, 3).map((order) => (
                    <div className="order-card" key={order.id}>
                      <div className="order-number">Order #{order.id}</div>
                      <div className="order-date">
                        Placed: {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="order-amount">₱{order.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Shipping Addresses</h3>
              </div>

              <div className="addresses-grid">
                {addresses.map(address => (
                  <div className="address-card" key={address.id}>
                    <div className="address-text">
                      {address.street}<br />
                      {address.city}, {address.state} {address.zip}<br />
                      {address.country}
                    </div>
                    <div className="address-actions">
                      <button className="address-btn edit-btn">Edit</button>
                      <button className="address-btn delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-address-btn">
                <i className='bx bx-plus'></i> Add New Address
              </button>
            </div>

            {}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Account Security</h3>
              </div>

              <button className="change-password-btn">Change Password</button>
            </div>
          </div>
        </div>

        {}
        {showEditModal && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{margin: 0}}>Edit Profile</h2>
                <button onClick={toggleEditModal} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}>×</button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate(e);
                toggleEditModal();
              }}>
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>

                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Email</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ced4da',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                  <small style={{color: '#6c757d'}}>Email cannot be changed</small>
                </div>

                <div style={{marginBottom: '30px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Profile Image</label>
                  <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                    <button
                      type="button"
                      onClick={() => document.getElementById('profile-image-modal').click()}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#e9ecef',
                        border: '1px solid #ced4da',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Choose Image
                    </button>
                    {(userDetails?.profileImage || imagePreview) && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#f8d7da',
                          border: '1px solid #f5c2c7',
                          borderRadius: '5px',
                          color: '#721c24',
                          cursor: 'pointer'
                        }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profile-image-modal"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{display: 'none'}}
                  />
                  {(userDetails?.profileImage || imagePreview) && (
                    <div style={{textAlign: 'center'}}>
                      <img
                        src={imagePreview || userDetails?.profileImage}
                        alt="Profile Preview"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                  <button
                    type="button"
                    onClick={toggleEditModal}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#e9ecef',
                      border: '1px solid #ced4da',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4263eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Profile;
