import React, { useState, useEffect } from 'react';
import { ref, get, update, remove, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage, auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PurchaseHistory from '../components/profile/PurchaseHistory';
import '../styles/pages/ProfileNew.css';

const ProfileNew = () => {
  const { currentUser, userDetails, refreshUserDetails } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  // Password change state
  const [otpSent, setOtpSent] = useState(false);
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Address form state
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });

  // Addresses state - will be loaded from database
  const [addresses, setAddresses] = useState([]);

  // Load user details, orders, and addresses
  useEffect(() => {
    // Add a class to the body to help with CSS specificity
    document.body.classList.add('new-profile-page');

    if (currentUser && userDetails) {
      setUsername(userDetails.username || currentUser.displayName || '');
      setProfileImage(userDetails.profileImage || null);

      // Fetch user orders
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

            // Sort orders by date (newest first)
            ordersArray.sort((a, b) => new Date(b.date) - new Date(a.date));

            setOrders(ordersArray);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      // Fetch user addresses
      const fetchAddresses = async () => {
        try {
          const addressesRef = ref(database, `users/${currentUser.uid}/addresses`);
          const snapshot = await get(addressesRef);

          if (snapshot.exists()) {
            const addressesData = snapshot.val();
            const addressesArray = Object.keys(addressesData).map(key => ({
              id: key,
              ...addressesData[key]
            }));
            setAddresses(addressesArray);
          } else {
            // If no addresses exist yet, initialize with sample addresses
            setAddresses([
              {
                id: 'sample1',
                street: '1234 Market Street',
                city: 'San Francisco',
                state: 'CA',
                zip: '94103',
                country: 'USA'
              },
              {
                id: 'sample2',
                street: '279 Maple Avenue',
                city: 'Brooklyn',
                state: 'NY',
                zip: '11201',
                country: 'USA'
              }
            ]);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      };

      fetchOrders();
      fetchAddresses();
    }

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('new-profile-page');
    };
  }, [currentUser, userDetails]);

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setMessage({ text: 'Updating profile...', type: 'info' });

      // Update user details in database
      const userRef = ref(database, `users/${currentUser.uid}`);

      // If there's a new profile image, upload it
      let profileImageUrl = userDetails.profileImage || null;

      if (profileImage && profileImage !== userDetails.profileImage) {
        // If it's a File object, upload it
        if (profileImage instanceof File) {
          const imageRef = storageRef(storage, `profile-images/${currentUser.uid}`);
          await uploadBytes(imageRef, profileImage);
          profileImageUrl = await getDownloadURL(imageRef);
        }
      }

      // Update user details
      await update(userRef, {
        username: username,
        profileImage: profileImageUrl
      });

      // Refresh user details to update the UI
      await refreshUserDetails();

      setMessage({ text: 'Profile updated successfully!', type: 'success' });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
    }
  };

  // Handle remove profile image
  const handleRemoveImage = async () => {
    try {
      setMessage({ text: 'Removing profile image...', type: 'info' });

      // Remove image from storage if it exists
      if (userDetails.profileImage) {
        try {
          const imageRef = storageRef(storage, `profile-images/${currentUser.uid}`);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting image from storage:', error);
        }
      }

      // Update user details in database
      const userRef = ref(database, `users/${currentUser.uid}`);
      await update(userRef, {
        profileImage: null
      });

      // Clear image preview and state
      setImagePreview('');
      setProfileImage(null);

      // Refresh user details to update the UI
      await refreshUserDetails();

      setMessage({ text: 'Profile image removed successfully!', type: 'success' });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error removing profile image:', error);
      setMessage({ text: 'Error removing profile image. Please try again.', type: 'error' });
    }
  };

  // Toggle edit profile modal
  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  // Toggle address modal
  const toggleAddressModal = () => {
    // Reset form when opening/closing
    setAddressForm({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA'
    });
    setEditingAddress(null);
    setShowAddressModal(!showAddressModal);
  };

  // Toggle password modal
  const togglePasswordModal = () => {
    // Reset form when opening/closing
    setOtpSent(false);
    setUserEnteredOtp('');
    setOtpVerified(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setShowPasswordModal(!showPasswordModal);
  };

  // Toggle order details modal
  const toggleOrderModal = () => {
    setShowOrderModal(!showOrderModal);
    if (showOrderModal) {
      setSelectedOrder(null);
    }
  };

  // Handle view order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Handle edit address
  const handleEditAddress = (address) => {
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || 'USA'
    });
    setEditingAddress(address.id);
    setShowAddressModal(true);
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      setMessage({ text: 'Deleting address...', type: 'info' });

      // Delete address from database
      const addressRef = ref(database, `users/${currentUser.uid}/addresses/${addressId}`);
      await remove(addressRef);

      // Update addresses state
      setAddresses(addresses.filter(address => address.id !== addressId));

      setMessage({ text: 'Address deleted successfully!', type: 'success' });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting address:', error);
      setMessage({ text: 'Error deleting address. Please try again.', type: 'error' });
    }
  };

  // Handle address form input change
  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address form submit
  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage({ text: editingAddress ? 'Updating address...' : 'Adding address...', type: 'info' });

      // Validate form
      if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zip) {
        setMessage({ text: 'Please fill in all required fields.', type: 'error' });
        return;
      }

      if (editingAddress) {
        // Update existing address
        const addressRef = ref(database, `users/${currentUser.uid}/addresses/${editingAddress}`);
        await update(addressRef, addressForm);

        // Update addresses state
        setAddresses(addresses.map(address =>
          address.id === editingAddress ? { ...address, ...addressForm, id: editingAddress } : address
        ));
      } else {
        // Add new address
        const addressesRef = ref(database, `users/${currentUser.uid}/addresses`);
        const newAddressRef = push(addressesRef);
        await update(newAddressRef, addressForm);

        // Update addresses state with the new address
        const newAddress = {
          id: newAddressRef.key,
          ...addressForm
        };
        setAddresses([...addresses, newAddress]);
      }

      setMessage({
        text: editingAddress ? 'Address updated successfully!' : 'Address added successfully!',
        type: 'success'
      });

      // Close modal and reset form
      toggleAddressModal();

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving address:', error);
      setMessage({
        text: editingAddress ? 'Error updating address. Please try again.' : 'Error adding address. Please try again.',
        type: 'error'
      });
    }
  };

  // Generate a random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP to user's email
  const sendOTPEmail = async (email, otpCode) => {
    try {
      // Store the OTP in the database for verification
      const otpRef = ref(database, `users/${currentUser.uid}/passwordReset`);
      await update(otpRef, {
        otp: otpCode,
        createdAt: new Date().toISOString(),
        used: false
      });

      try {
        // Call the Firebase Cloud Function to send the email
        const functions = getFunctions();
        const sendOTPEmailFunction = httpsCallable(functions, 'sendOTPEmail');

        await sendOTPEmailFunction({
          email: email,
          otpCode: otpCode
        });

        // Show a success message without revealing the OTP
        setMessage({
          text: `Verification code sent to ${email}. Please check your email.`,
          type: 'success'
        });

        return true;
      } catch (emailError) {
        console.error('Error calling email function:', emailError);

        // If the Cloud Function fails, we'll fall back to just storing the OTP
        // and showing a message for development purposes
        console.log(`OTP for ${email}: ${otpCode}`);

        // Show a message indicating there was an issue with email sending
        setMessage({
          text: `Verification code generated but email service is not configured. For development: ${otpCode}`,
          type: 'warning'
        });

        // Still return true so the flow can continue for development
        return true;
      }
    } catch (error) {
      console.error('Error in OTP process:', error);
      setMessage({ text: 'Error sending verification code. Please try again.', type: 'error' });
      return false;
    }
  };

  // Verify OTP
  const verifyOTP = async (enteredOTP) => {
    try {
      // Get the stored OTP from the database
      const otpRef = ref(database, `users/${currentUser.uid}/passwordReset`);
      const snapshot = await get(otpRef);

      if (snapshot.exists()) {
        const otpData = snapshot.val();

        // Check if OTP is valid and not used
        if (otpData.otp === enteredOTP && !otpData.used) {
          // Check if OTP is not expired (valid for 10 minutes)
          const createdAt = new Date(otpData.createdAt);
          const now = new Date();
          const diffInMinutes = (now - createdAt) / (1000 * 60);

          if (diffInMinutes <= 10) {
            // Mark OTP as used
            await update(otpRef, { used: true });
            return true;
          } else {
            setMessage({ text: 'OTP has expired. Please request a new one.', type: 'error' });
            return false;
          }
        } else {
          setMessage({ text: 'Invalid OTP. Please try again.', type: 'error' });
          return false;
        }
      } else {
        setMessage({ text: 'No OTP found. Please request a new one.', type: 'error' });
        return false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage({ text: 'Error verifying OTP. Please try again.', type: 'error' });
      return false;
    }
  };

  // Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      setMessage({ text: 'Sending verification code...', type: 'info' });

      // Generate a new OTP
      const newOTP = generateOTP();

      // Call our email sending function which will use Firebase Cloud Functions
      const sent = await sendOTPEmail(currentUser.email, newOTP);

      if (sent) {
        setOtpSent(true);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setMessage({
        text: 'Error sending verification code. Please try again.',
        type: 'error'
      });
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      setMessage({ text: 'Verifying OTP...', type: 'info' });

      // Verify the entered OTP
      const verified = await verifyOTP(userEnteredOtp);

      if (verified) {
        setOtpVerified(true);
        setMessage({ text: 'OTP verified successfully! You can now change your password.', type: 'success' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage({ text: 'Error verifying OTP. Please try again.', type: 'error' });
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      // If OTP is not sent yet, send OTP first
      if (!otpSent) {
        await handleSendOTP(e);
        return;
      }

      // If OTP is sent but not verified, verify OTP
      if (otpSent && !otpVerified) {
        await handleVerifyOTP(e);
        return;
      }

      // If OTP is verified, proceed with password change
      if (otpVerified) {
        // Validate passwords
        if (newPassword !== confirmNewPassword) {
          setMessage({ text: 'New passwords do not match.', type: 'error' });
          return;
        }

        if (newPassword.length < 6) {
          setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
          return;
        }

        setMessage({ text: 'Sending password reset email...', type: 'info' });

        // For security reasons, we'll use Firebase's password reset functionality
        // rather than trying to update the password directly
        await sendPasswordResetEmail(auth, currentUser.email);

        setMessage({
          text: 'Password reset email sent! Please check your email to complete the process.',
          type: 'success'
        });

        // Close modal
        togglePasswordModal();

        // Clear message after 5 seconds (longer for this important message)
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ text: 'Error in password change process. Please try again.', type: 'error' });
    }
  };

  return (
    <>
      <Header />

      <main className="profile-new">
        <div className="profile-layout">
          {/* Left sidebar with user info */}
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
            <h2 className="profile-name">{userDetails?.username || currentUser?.displayName || 'User'}</h2>
            <p className="profile-email">{currentUser?.email}</p>
            <button className="edit-profile-btn" onClick={toggleEditModal}>Edit Profile</button>
          </div>

          {/* Main content area */}
          <div className="profile-main">
            {/* Message display */}
            {message.text && (
              <div className={`message ${message.type}`} style={{marginBottom: '20px'}}>
                {message.type === 'success' && <i className='bx bx-check-circle'></i>}
                {message.type === 'error' && <i className='bx bx-error-circle'></i>}
                {message.type === 'info' && <i className='bx bx-info-circle'></i>}
                <span>{message.text}</span>
              </div>
            )}

            {/* Purchase History Options */}
            <div className="profile-section">
              <PurchaseHistory />
            </div>

            {/* Recent Orders Section */}
            <div className="profile-section" id="recent-orders-section">
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
                      <div className="order-header">
                        <div className="order-number">Order #{order.id}</div>
                        <div className={`order-status ${order.status?.toLowerCase()}`}>
                          {order.status || "Pending"}
                        </div>
                      </div>

                      <div className="order-content">
                        {order.items && order.items.length > 0 && (
                          <div className="order-image">
                            {order.items[0].image ? (
                              <img
                                src={order.items[0].image.includes('/') ? order.items[0].image : `/images/${order.items[0].image}`}
                                alt={order.items[0].name}
                              />
                            ) : (
                              <div className="image-placeholder">
                                <i className='bx bx-package'></i>
                              </div>
                            )}
                            {order.items.length > 1 && (
                              <div className="item-count">+{order.items.length - 1}</div>
                            )}
                          </div>
                        )}

                        <div className="order-details">
                          <div className="order-date">
                            <i className='bx bx-calendar'></i> {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="order-items">
                            <span>Items: </span>
                            {order.items && order.items.map((item, index) => (
                              <span key={index}>
                                {item.name}{index < order.items.length - 1 ? ', ' : ''}
                              </span>
                            )).slice(0, 2)}
                            {order.items && order.items.length > 2 && <span> and {order.items.length - 2} more</span>}
                          </div>
                          <div className="order-amount">₱{order.total.toFixed(2)}</div>
                          <button
                            className="view-order-btn"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Addresses Section */}
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
                      <button
                        className="address-btn edit-btn"
                        onClick={() => handleEditAddress(address)}
                      >
                        Edit
                      </button>
                      <button
                        className="address-btn delete-btn"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-address-btn" onClick={toggleAddressModal}>
                <i className='bx bx-plus'></i> Add New Address
              </button>
            </div>

            {/* Account Security Section */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Account Security</h3>
              </div>

              <button className="change-password-btn" onClick={togglePasswordModal}>
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
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

        {/* Address Modal */}
        {showAddressModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{margin: 0}}>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                <button onClick={toggleAddressModal} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}>×</button>
              </div>

              <form onSubmit={handleAddressFormSubmit}>
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Street Address*</label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressFormChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ced4da'
                    }}
                    required
                  />
                </div>

                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>City*</label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ced4da'
                    }}
                    required
                  />
                </div>

                <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>State/Province*</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ced4da'
                      }}
                      required
                    />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>ZIP/Postal Code*</label>
                    <input
                      type="text"
                      name="zip"
                      value={addressForm.zip}
                      onChange={handleAddressFormChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ced4da'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Country*</label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressFormChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ced4da'
                    }}
                    required
                  />
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                  <button
                    type="button"
                    onClick={toggleAddressModal}
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
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content order-details-modal">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  color: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className='bx bx-receipt' style={{color: '#4263eb'}}></i>
                  Order Details
                </h2>
                <button onClick={toggleOrderModal} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >×</button>
              </div>
              <div className="modal-body">
                <div className="order-info">
                  <div className="order-info-header">
                    <div>
                      <h3 style={{margin: '0 0 8px 0', fontSize: '1.1rem', color: '#333'}}>Order #{selectedOrder.id}</h3>
                      <p className="order-date" style={{margin: 0, fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <i className='bx bx-calendar'></i> {new Date(selectedOrder.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`order-status-large ${selectedOrder.status?.toLowerCase()}`}>
                      {selectedOrder.status || "Pending"}
                    </div>
                  </div>

                  <div className="order-items-list">
                    <h4><i className='bx bx-food-menu'></i> Items</h4>
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <div className="order-item" key={index}>
                        <div className="order-item-image">
                          {item.image ? (
                            <img
                              src={item.image.includes('/') ? item.image : `/images/${item.image}`}
                              alt={item.name}
                            />
                          ) : (
                            <div className="image-placeholder">
                              <i className='bx bx-package'></i>
                            </div>
                          )}
                        </div>
                        <div className="order-item-details">
                          <h5>{item.name}</h5>
                          <div className="item-meta">
                            <span className="item-quantity">
                              <i className='bx bx-package'></i> Qty: {item.quantity}
                            </span>
                            <span className="item-price">₱{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₱{selectedOrder.subtotal?.toFixed(2) || selectedOrder.total.toFixed(2)}</span>
                    </div>
                    {selectedOrder.shipping && (
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>₱{selectedOrder.shipping.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>₱{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="shipping-info">
                    <h4><i className='bx bx-map'></i> Shipping Address</h4>
                    {selectedOrder.shippingAddress ? (
                      <div className="address-card">
                        <div className="address-line name">John Doe</div>
                        <div className="address-line"><i className='bx bx-home'></i>{selectedOrder.shippingAddress.street}</div>
                        <div className="address-line"><i className='bx bx-buildings'></i>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</div>
                        <div className="address-line"><i className='bx bx-globe'></i>{selectedOrder.shippingAddress.country}</div>
                        <div className="address-line"><i className='bx bx-phone'></i>+63 945 123 4567</div>
                      </div>
                    ) : (
                      <div className="address-card">
                        <div className="address-line name">John Doe</div>
                        <div className="address-line"><i className='bx bx-home'></i>123 Tastemaker Street</div>
                        <div className="address-line"><i className='bx bx-buildings'></i>Makati City, Metro Manila 1200</div>
                        <div className="address-line"><i className='bx bx-globe'></i>Philippines</div>
                        <div className="address-line"><i className='bx bx-phone'></i>+63 945 123 4567</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2 style={{margin: 0}}>Change Password</h2>
                <button onClick={togglePasswordModal} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}>×</button>
              </div>

              <form onSubmit={handlePasswordChange}>
                {/* Step 1: Send OTP */}
                {!otpSent && (
                  <div style={{marginBottom: '20px'}}>
                    <div style={{
                      backgroundColor: '#f0f8ff',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      border: '1px solid #cce5ff'
                    }}>
                      <p style={{margin: '0 0 10px 0', fontWeight: '600', color: '#004085'}}>
                        <i className='bx bx-info-circle' style={{marginRight: '8px'}}></i>
                        Email Verification Required
                      </p>
                      <p style={{margin: '0', lineHeight: '1.5', color: '#004085'}}>
                        To change your password, we'll send a verification code to your email address.
                        This helps ensure that only you can change your password.
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '20px'
                    }}>
                      <i className='bx bx-envelope' style={{fontSize: '20px', marginRight: '10px', color: '#495057'}}></i>
                      <div>
                        <p style={{margin: '0', fontWeight: '500'}}>Verification code will be sent to:</p>
                        <p style={{margin: '5px 0 0 0', fontWeight: '600', color: '#0056b3'}}>{currentUser?.email}</p>
                      </div>
                    </div>

                    <p style={{fontSize: '0.9rem', color: '#6c757d', fontStyle: 'italic'}}>
                      Please make sure you have access to this email account. Check your spam folder if you don't see the email.
                    </p>
                  </div>
                )}

                {/* Step 2: Verify OTP */}
                {otpSent && !otpVerified && (
                  <div style={{marginBottom: '20px'}}>
                    <div style={{
                      backgroundColor: '#e8f4fd',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      border: '1px solid #b8daff'
                    }}>
                      <p style={{margin: '0 0 10px 0', fontWeight: '500', color: '#004085'}}>
                        <i className='bx bx-envelope' style={{marginRight: '8px'}}></i>
                        Verification Code Sent
                      </p>
                      <p style={{margin: '0', lineHeight: '1.5', color: '#004085'}}>
                        We've sent a verification code to <strong>{currentUser?.email}</strong>.
                        Please check your inbox (and spam folder) and enter the 6-digit code below.
                      </p>
                    </div>

                    <div style={{marginBottom: '15px'}}>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Verification Code</label>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '15px'
                      }}>
                        <input
                          type="text"
                          value={userEnteredOtp}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setUserEnteredOtp(value);
                          }}
                          placeholder="Enter 6-digit code"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '5px',
                            border: '1px solid #ced4da',
                            fontSize: '18px',
                            letterSpacing: '8px',
                            textAlign: 'center',
                            fontWeight: '600'
                          }}
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '20px'
                    }}>
                      <p style={{fontSize: '0.9rem', color: '#6c757d', margin: '0'}}>
                        Code expires in 10 minutes
                      </p>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4263eb',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className='bx bx-refresh' style={{marginRight: '5px'}}></i>
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Change Password */}
                {otpVerified && (
                  <div style={{marginBottom: '20px'}}>
                    <p style={{marginBottom: '15px', lineHeight: '1.5'}}>
                      Your identity has been verified. Please enter your new password below.
                    </p>

                    <div style={{marginBottom: '15px'}}>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '5px',
                          border: '1px solid #ced4da'
                        }}
                        minLength={6}
                        required
                      />
                    </div>

                    <div style={{marginBottom: '15px'}}>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '5px',
                          border: '1px solid #ced4da'
                        }}
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                )}

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                  <button
                    type="button"
                    onClick={togglePasswordModal}
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
                      backgroundColor: '#f06595',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {!otpSent ? 'Send OTP' :
                     !otpVerified ? 'Verify OTP' :
                     'Change Password'}
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

export default ProfileNew;
