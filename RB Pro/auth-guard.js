// Authentication Guard System for RECOOK BOOK
// This script protects pages from unauthorized access

class AuthGuard {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.currentPage = this.getCurrentPageName();
        this.publicPages = ['login.html', 'signup.html', 'splash.html'];
        this.init();
    }

    init() {
        // Clear any old localStorage authentication data for security
        this.clearOldAuthData();

        // Check authentication immediately
        this.checkAuthentication();

        // Update navigation based on auth state
        this.updateNavigation();

        // Set up logout functionality
        this.setupLogout();
    }

    // Clear old localStorage authentication data for security
    clearOldAuthData() {
        // Remove any persistent login data from localStorage
        localStorage.removeItem('recookBookCurrentUser');
        console.log('🔒 Cleared persistent authentication data for security');
    }

    // Get current user from sessionStorage (session-based, not persistent)
    getCurrentUser() {
        // Use sessionStorage instead of localStorage for security
        // This means users are logged out when browser/tab is closed
        const stored = sessionStorage.getItem('recookBookCurrentUser');
        return stored ? JSON.parse(stored) : null;
    }

    // Get current page name
    getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    }

    // Check if current page is public (doesn't require authentication)
    isPublicPage() {
        return this.publicPages.includes(this.currentPage);
    }

    // Main authentication check
    checkAuthentication() {
        console.log('🔒 Auth Guard: Checking authentication...');
        console.log('Current page:', this.currentPage);
        console.log('Current user:', this.currentUser ? this.currentUser.email : 'None');

        // If user is not logged in and trying to access protected page
        if (!this.currentUser && !this.isPublicPage()) {
            console.log('🚫 Access denied: User not authenticated');
            this.redirectToLogin();
            return;
        }

        // If user is logged in and trying to access login/signup pages
        if (this.currentUser && (this.currentPage === 'login.html' || this.currentPage === 'signup.html')) {
            console.log('✅ User already authenticated, redirecting to home');
            this.redirectToHome();
            return;
        }

        console.log('✅ Auth Guard: Access granted');
    }

    // Redirect to login page
    redirectToLogin() {
        // Store the current page to redirect back after login
        sessionStorage.setItem('returnUrl', window.location.href);
        
        // Show loading message
        this.showRedirectMessage('Please login to access RECOOK BOOK', 'login.html');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    // Redirect to home page
    redirectToHome() {
        this.showRedirectMessage('Welcome back! Redirecting to home page...', 'index.html');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Show redirect message
    showRedirectMessage(message, destination) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2c5530, #4a7c59);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
        `;

        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            animation: fadeInUp 0.5s ease-out;
        `;

        messageContainer.innerHTML = `
            <div style="font-size: 3rem; color: #4a7c59; margin-bottom: 20px;">
                <i class="fas fa-utensils"></i>
            </div>
            <h2 style="color: #2c5530; margin-bottom: 15px; font-size: 1.5rem;">RECOOK BOOK</h2>
            <p style="color: #666; margin-bottom: 20px; font-size: 1.1rem;">${message}</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; color: #4a7c59;">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Redirecting...</span>
            </div>
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(messageContainer);
        document.body.appendChild(overlay);

        // Hide page content
        document.body.style.overflow = 'hidden';
    }

    // Update navigation based on authentication state
    updateNavigation() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        if (this.currentUser) {
            // User is logged in - show user info and logout
            authButtons.innerHTML = `
                <div class="user-info">
                    <span class="welcome-text">
                        <i class="fas fa-user-circle"></i>
                        Welcome, ${this.currentUser.firstName}!
                    </span>
                    <button class="auth-btn-nav logout-btn-nav" onclick="authGuard.logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
        } else {
            // User is not logged in - show login/signup buttons
            authButtons.innerHTML = `
                <a href="login.html" class="auth-btn-nav login-btn-nav">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="signup.html" class="auth-btn-nav signup-btn-nav">
                    <i class="fas fa-user-plus"></i> Sign Up
                </a>
            `;
        }
    }

    // Setup logout functionality
    setupLogout() {
        // Make logout function globally available
        window.logout = () => this.logout();
    }

    // Logout function
    logout() {
        console.log('🔓 Logging out user...');

        // Clear user data from session
        sessionStorage.removeItem('recookBookCurrentUser');

        // Show logout message
        this.showRedirectMessage('Logged out successfully. Redirecting to login...', 'login.html');

        // Redirect to login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    // Handle return URL after login
    static handleReturnUrl() {
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            window.location.href = returnUrl;
        } else {
            window.location.href = 'splash.html';
        }
    }
}

// Initialize auth guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authGuard = new AuthGuard();
});

// Add user info styles
const userInfoStyles = `
    .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-left: 30px;
    }
    
    .welcome-text {
        color: white;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .logout-btn-nav {
        padding: 8px 16px;
        border-radius: 20px;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        cursor: pointer;
    }
    
    .logout-btn-nav:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
        .user-info {
            flex-direction: column;
            gap: 8px;
            position: fixed;
            top: 15px;
            right: 60px;
        }
        
        .welcome-text {
            font-size: 0.8rem;
        }
        
        .logout-btn-nav {
            padding: 6px 12px;
            font-size: 0.8rem;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = userInfoStyles;
document.head.appendChild(styleSheet);
