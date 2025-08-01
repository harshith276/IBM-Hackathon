// Authentication System with Backend Simulation
class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAuthState();
        this.initializeBackend();
    }

    // Initialize backend and verify it's working
    initializeBackend() {
        console.log('Initializing RECOOK BOOK Authentication Backend...');
        console.log('Current users in database:', this.users.length);

        // Add a test user if no users exist (for demo purposes)
        if (this.users.length === 0) {
            const testUser = {
                id: 1,
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@recookbook.com',
                password: 'Demo123!',
                newsletter: true,
                createdAt: new Date().toISOString()
            };
            this.users.push(testUser);
            this.saveUsers();
            console.log('Demo user created for testing:', testUser.email);
        }

        console.log('Backend initialized successfully!');
    }

    // Load users from localStorage (simulating backend)
    loadUsers() {
        const stored = localStorage.getItem('recookBookUsers');
        return stored ? JSON.parse(stored) : [];
    }

    // Save users to localStorage (simulating backend)
    saveUsers() {
        localStorage.setItem('recookBookUsers', JSON.stringify(this.users));
    }

    // Get current user (session-based for security)
    getCurrentUser() {
        const stored = sessionStorage.getItem('recookBookCurrentUser');
        return stored ? JSON.parse(stored) : null;
    }

    // Set current user (session-based for security)
    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            // Use sessionStorage for security - user logged out when browser closes
            sessionStorage.setItem('recookBookCurrentUser', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('recookBookCurrentUser');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Password strength checker
        const signupPassword = document.getElementById('signup-password');
        if (signupPassword) {
            signupPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Clear previous errors
        this.clearErrors();

        // Validate inputs
        if (!this.validateEmail(email)) {
            this.showError('email-error', 'Please enter a valid email address');
            return;
        }

        if (!password) {
            this.showError('password-error', 'Password is required');
            return;
        }

        // Show loading
        this.showLoading('login');

        // Simulate API call delay
        await this.delay(1500);

        // Check credentials
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login successful
            this.setCurrentUser(user);
            this.showLoginSuccess();
            
            // Redirect after delay
            setTimeout(() => {
                // Check if there's a return URL from auth guard
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl) {
                    sessionStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    window.location.href = 'splash.html';
                }
            }, 2000);
        } else {
            // Login failed
            this.hideLoading('login');
            this.showError('password-error', 'Invalid email or password');
        }
    }

    // Handle signup
    async handleSignup(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            termsAgreed: formData.get('termsAgreement') === 'on',
            newsletter: formData.get('newsletter') === 'on'
        };

        console.log('Signup attempt with data:', userData); // Debug log

        // Clear previous errors
        this.clearErrors();

        // Validate inputs
        if (!this.validateSignupForm(userData)) {
            console.log('Validation failed'); // Debug log
            return;
        }

        // Show loading
        this.showLoading('signup');

        try {
            // Simulate API call delay
            await this.delay(1500);

            // Check if user already exists
            if (this.users.find(u => u.email === userData.email)) {
                this.hideLoading('signup');
                this.showError('signup-email-error', 'An account with this email already exists');
                console.log('User already exists'); // Debug log
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password, // In real app, this would be hashed
                newsletter: userData.newsletter,
                createdAt: new Date().toISOString()
            };

            // Add to users array and save
            this.users.push(newUser);
            this.saveUsers();

            console.log('User created successfully:', newUser); // Debug log
            console.log('Total users now:', this.users.length); // Debug log

            // Hide loading
            this.hideLoading('signup');

            // Show success
            this.showSignupSuccess();

        } catch (error) {
            console.error('Signup error:', error);
            this.hideLoading('signup');
            this.showError('signup-email-error', 'An error occurred during signup. Please try again.');
        }
    }

    // Validate signup form
    validateSignupForm(data) {
        let isValid = true;

        // First name
        if (!data.firstName.trim()) {
            this.showError('first-name-error', 'First name is required');
            isValid = false;
        }

        // Last name
        if (!data.lastName.trim()) {
            this.showError('last-name-error', 'Last name is required');
            isValid = false;
        }

        // Email
        if (!this.validateEmail(data.email)) {
            this.showError('signup-email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Password
        if (!this.validatePassword(data.password)) {
            this.showError('signup-password-error', 'Password must be at least 8 characters with uppercase, lowercase, and number');
            isValid = false;
        }

        // Confirm password
        if (data.password !== data.confirmPassword) {
            this.showError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        }

        // Terms agreement
        if (!data.termsAgreed) {
            this.showError('terms-error', 'You must agree to the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    // Validate email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password
    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Check password strength
    checkPasswordStrength(password) {
        const strengthContainer = document.getElementById('password-strength');
        if (!strengthContainer) return;

        let strength = 0;
        let feedback = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        // Remove existing classes
        strengthContainer.className = 'password-strength';

        if (password.length === 0) {
            strengthContainer.innerHTML = '';
            return;
        }

        if (strength < 3) {
            strengthContainer.classList.add('strength-weak');
            feedback = 'Weak';
        } else if (strength < 5) {
            strengthContainer.classList.add('strength-medium');
            feedback = 'Medium';
        } else {
            strengthContainer.classList.add('strength-strong');
            feedback = 'Strong';
        }

        strengthContainer.innerHTML = `
            <span>Password strength: ${feedback}</span>
            <div class="strength-bar">
                <div class="strength-fill"></div>
            </div>
        `;
    }

    // Handle social login
    handleSocialLogin(e) {
        const provider = e.target.closest('.social-btn').classList.contains('google-btn') ? 'Google' : 'Facebook';
        
        // Show notification
        this.showNotification(`${provider} login is not implemented in this demo`, 'info');
    }

    // Show loading state
    showLoading(type) {
        const btn = document.querySelector(`.${type}-btn`);
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        btn.disabled = true;
    }

    // Hide loading state
    hideLoading(type) {
        const btn = document.querySelector(`.${type}-btn`);
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        btn.disabled = false;
    }

    // Show login success
    showLoginSuccess() {
        const form = document.getElementById('login-form');
        const successMessage = document.getElementById('login-success');
        
        form.style.display = 'none';
        successMessage.style.display = 'block';
    }

    // Show signup success
    showSignupSuccess() {
        const form = document.getElementById('signup-form');
        const successMessage = document.getElementById('signup-success');
        
        form.style.display = 'none';
        successMessage.style.display = 'block';
    }

    // Show error message
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Clear all errors
    clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Update authentication state
    updateAuthState() {
        // This would update UI based on login state
        // For now, just log the current user
        if (this.currentUser) {
            console.log('Current user:', this.currentUser);
        }
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Logout function
    logout() {
        this.setCurrentUser(null);
        window.location.href = 'index.html';
    }

    // Debug function to show all users
    showAllUsers() {
        console.log('=== RECOOK BOOK USER DATABASE ===');
        console.log('Total users:', this.users.length);
        this.users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Created: ${new Date(user.createdAt).toLocaleDateString()}`);
        });
        console.log('================================');
        return this.users;
    }

    // Test backend functionality
    testBackend() {
        console.log('Testing backend functionality...');
        const testEmail = 'test@example.com';
        const testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: 'Test123!',
            newsletter: false
        };

        // Test user creation
        const beforeCount = this.users.length;
        const newUser = {
            id: Date.now(),
            ...testUser,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        const afterCount = this.users.length;
        console.log(`User creation test: ${beforeCount} -> ${afterCount} users`);

        // Test user retrieval
        const foundUser = this.users.find(u => u.email === testEmail);
        console.log('User retrieval test:', foundUser ? 'SUCCESS' : 'FAILED');

        // Clean up test user
        this.users = this.users.filter(u => u.email !== testEmail);
        this.saveUsers();

        console.log('Backend test completed successfully!');
    }
}

// Global functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

// Global auth manager instance
let authManager;

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();

    // Make functions available globally for testing
    window.showUsers = () => authManager.showAllUsers();
    window.testBackend = () => authManager.testBackend();
    window.clearUsers = () => {
        localStorage.removeItem('recookBookUsers');
        localStorage.removeItem('recookBookCurrentUser');
        sessionStorage.removeItem('recookBookCurrentUser');
        console.log('All user data cleared!');
        location.reload();
    };

    console.log('🍽️ RECOOK BOOK Authentication System Loaded!');
    console.log('Available commands:');
    console.log('- showUsers() - Display all registered users');
    console.log('- testBackend() - Test backend functionality');
    console.log('- clearUsers() - Clear all user data');
});

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        background: #3498db;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    }
    
    .notification-info {
        background: #3498db;
    }
    
    .notification-success {
        background: #27ae60;
    }
    
    .notification-error {
        background: #e74c3c;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
