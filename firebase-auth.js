// Firebase configuration
// NOTE: In a production environment, you should not expose your Firebase config in client-side code.
// Consider using environment variables and a build process.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Log Firebase SDK version
console.log('Firebase SDK Version: 11.4.0');

const firebaseConfig = {
    apiKey: "AIzaSyA9z9IAMMJr4Z-s79F4nW5s1gijjlGktus",
    authDomain: "lestudy.firebaseapp.com",
    projectId: "lestudy",
    storageBucket: "lestudy.firebasestorage.app",
    messagingSenderId: "99761625251",
    appId: "1:99761625251:web:ab66eb243bb3f913a11f4e",
    measurementId: "G-P8WG5KRV88"
};

// Initialize Firebase
console.log('Initializing Firebase with config:', { ...firebaseConfig, apiKey: '***' });
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log('Firebase Auth initialized:', auth ? 'success' : 'failed');

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase Auth: DOM fully loaded');
    
    // DOM Elements
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const closeLoginBtn = document.getElementById('close-login');
    const closeSignupBtn = document.getElementById('close-signup');
    const cancelLoginBtn = document.getElementById('cancel-login');
    const cancelSignupBtn = document.getElementById('cancel-signup');
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');
    const userDisplayElement = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');

    // Log elements to check if they're found
    console.log('Firebase Auth: Elements found:', {
        loginBtn,
        signupBtn,
        loginModal,
        signupModal,
        loginForm,
        signupForm
    });

    // Auth state observer
    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email, 'Display Name:', user.displayName);
            updateUIForAuthenticatedUser(user);
        } else {
            // User is signed out
            console.log('User is signed out');
            updateUIForUnauthenticatedUser();
        }
    });

    // Update UI for authenticated user
    function updateUIForAuthenticatedUser(user) {
        // Hide login/signup buttons
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        
        // Show user info and logout button
        if (userDisplayElement) {
            userDisplayElement.textContent = user.displayName || user.email;
            userDisplayElement.parentElement.style.display = 'flex';
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
        
        // Close any open modals
        loginModal.classList.remove('show');
        signupModal.classList.remove('show');
    }

    // Update UI for unauthenticated user
    function updateUIForUnauthenticatedUser() {
        // Show login/signup buttons
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        
        // Hide user info and logout button
        if (userDisplayElement) {
            userDisplayElement.parentElement.style.display = 'none';
        }
        
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    }

    // Open login modal
    loginBtn.addEventListener('click', () => {
        console.log('Firebase Auth: Login button clicked');
        loginModal.classList.add('show');
        loginMessage.textContent = '';
        loginForm.reset();
    });

    // Open signup modal
    signupBtn.addEventListener('click', () => {
        console.log('Firebase Auth: Signup button clicked');
        signupModal.classList.add('show');
        signupMessage.textContent = '';
        signupForm.reset();
    });

    // Close login modal
    function closeLoginModal() {
        loginModal.classList.remove('show');
    }

    // Close signup modal
    function closeSignupModal() {
        signupModal.classList.remove('show');
    }

    // Close button events
    closeLoginBtn.addEventListener('click', closeLoginModal);
    closeSignupBtn.addEventListener('click', closeSignupModal);
    cancelLoginBtn.addEventListener('click', closeLoginModal);
    cancelSignupBtn.addEventListener('click', closeSignupModal);

    // Switch between modals
    switchToSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeLoginModal();
        signupModal.classList.add('show');
    });

    switchToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSignupModal();
        loginModal.classList.add('show');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeLoginModal();
        }
        if (e.target === signupModal) {
            closeSignupModal();
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Show loading state
        loginMessage.textContent = 'Logging in...';
        loginMessage.style.color = '#FDB927'; // Lakers gold
        
        console.log('Attempting to sign in with email:', email);
        
        // Sign in with Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                console.log('Login successful for user:', userCredential.user.email);
                loginMessage.textContent = 'Login successful!';
                loginMessage.style.color = 'green';
                
                // Close modal after a short delay
                setTimeout(() => {
                    closeLoginModal();
                }, 1000);
            })
            .catch((error) => {
                // Handle errors
                console.error('Login error:', error.code, error.message);
                loginMessage.textContent = getAuthErrorMessage(error);
                loginMessage.style.color = 'red';
            });
    });

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Firebase Auth: Signup form submitted');
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        console.log('Firebase Auth: Form values:', { 
            name, 
            email, 
            passwordLength: password ? password.length : 0,
            confirmPasswordLength: confirmPassword ? confirmPassword.length : 0
        });
        
        // Validate passwords match
        if (password !== confirmPassword) {
            signupMessage.textContent = 'Passwords do not match';
            signupMessage.style.color = 'red';
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            signupMessage.textContent = 'Password must be at least 6 characters';
            signupMessage.style.color = 'red';
            return;
        }
        
        // Show loading state
        signupMessage.textContent = 'Creating account...';
        signupMessage.style.color = '#FDB927'; // Lakers gold
        
        console.log('Attempting to create user with email:', email);
        
        // Create user with Firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Firebase Auth: User created successfully');
                const user = userCredential.user;
                
                // Update profile with name
                return updateProfile(user, {
                    displayName: name
                }).then(() => {
                    // Account created successfully
                    console.log('Profile updated with name:', name);
                    signupMessage.textContent = 'Account created successfully!';
                    signupMessage.style.color = 'green';
                    
                    // Close modal after a short delay
                    setTimeout(() => {
                        closeSignupModal();
                    }, 1000);
                });
            })
            .catch((error) => {
                // Handle errors
                console.error('Signup error:', error.code, error.message);
                signupMessage.textContent = getAuthErrorMessage(error);
                signupMessage.style.color = 'red';
            });
    });

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful
                console.log('User signed out');
            }).catch((error) => {
                // An error happened
                console.error('Logout error:', error);
            });
        });
    }
});

// Helper function to get user-friendly error messages
function getAuthErrorMessage(error) {
    console.log('Auth error code:', error.code);
    
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password';
        case 'auth/email-already-in-use':
            return 'Email is already in use';
        case 'auth/weak-password':
            return 'Password is too weak (minimum 6 characters)';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return `Error: ${error.message}`;
    }
} 