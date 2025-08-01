// Recipe Management System
class RecipeManager {
    constructor() {
        this.recipes = this.loadRecipes();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.displayRecipes();
        this.displayFeaturedRecipes();
    }

    // Load recipes from localStorage
    loadRecipes() {
        const stored = localStorage.getItem('yummyTummyRecipes');
        return stored ? JSON.parse(stored) : [];
    }

    // Save recipes to localStorage
    saveRecipes() {
        localStorage.setItem('yummyTummyRecipes', JSON.stringify(this.recipes));
    }

    // Load sample data if no recipes exist
    loadSampleData() {
        if (this.recipes.length === 0) {
            this.recipes = [
                {
                    id: 1,
                    title: "Leftover Rice Fried Rice",
                    category: "dinner",
                    prepTime: 15,
                    leftoverIngredients: "Cooked rice\nLeftover vegetables\nCooked chicken (optional)",
                    additionalIngredients: "2 eggs\n1 onion\nSoy sauce\nOil\nSalt and pepper",
                    instructions: "1. Heat oil in a large pan or wok\n2. Scramble eggs and set aside\n3. Sauté onion until soft\n4. Add leftover rice and vegetables\n5. Stir-fry for 5-7 minutes\n6. Add scrambled eggs back in\n7. Season with soy sauce, salt, and pepper\n8. Serve hot",
                    tips: "Use day-old rice for best texture. Add any leftover proteins you have!",
                    author: "Sarah Chen",
                    upvotes: 24,
                    dateAdded: new Date('2024-01-15').toISOString()
                },
                {
                    id: 2,
                    title: "Stale Bread French Toast",
                    category: "breakfast",
                    prepTime: 10,
                    leftoverIngredients: "Stale bread slices",
                    additionalIngredients: "2 eggs\n1/2 cup milk\n1 tsp vanilla\nButter\nMaple syrup",
                    instructions: "1. Whisk eggs, milk, and vanilla in a shallow dish\n2. Dip bread slices in mixture, coating both sides\n3. Heat butter in a pan over medium heat\n4. Cook bread slices 2-3 minutes per side until golden\n5. Serve with maple syrup",
                    tips: "Thicker, staler bread works better. Add cinnamon for extra flavor!",
                    author: "Mike Johnson",
                    upvotes: 18,
                    dateAdded: new Date('2024-01-20').toISOString()
                },
                {
                    id: 3,
                    title: "Vegetable Scrap Broth",
                    category: "lunch",
                    prepTime: 60,
                    leftoverIngredients: "Vegetable scraps (onion peels, carrot tops, celery leaves, herb stems)",
                    additionalIngredients: "Water\nSalt\nPepper\nBay leaves",
                    instructions: "1. Collect vegetable scraps in a large pot\n2. Cover with water (about 8 cups)\n3. Add bay leaves, salt, and pepper\n4. Bring to boil, then simmer for 45-60 minutes\n5. Strain out solids\n6. Use immediately or freeze for later",
                    tips: "Save scraps in the freezer until you have enough. Great base for soups!",
                    author: "Emma Rodriguez",
                    upvotes: 31,
                    dateAdded: new Date('2024-01-25').toISOString()
                },
                {
                    id: 4,
                    title: "Overripe Banana Smoothie",
                    category: "snack",
                    prepTime: 5,
                    leftoverIngredients: "Overripe bananas",
                    additionalIngredients: "1 cup milk or yogurt\n1 tbsp honey\nIce cubes\nPeanut butter (optional)",
                    instructions: "1. Peel and slice overripe bananas\n2. Add to blender with milk/yogurt\n3. Add honey and peanut butter if using\n4. Blend until smooth\n5. Add ice and blend again\n6. Serve immediately",
                    tips: "Freeze overripe bananas for an extra thick smoothie. Add spinach for nutrition!",
                    author: "David Park",
                    upvotes: 15,
                    dateAdded: new Date('2024-02-01').toISOString()
                },
                {
                    id: 5,
                    title: "Leftover Pasta Frittata",
                    category: "dinner",
                    prepTime: 20,
                    leftoverIngredients: "Cooked pasta\nLeftover vegetables",
                    additionalIngredients: "6 eggs\n1/2 cup cheese\nOlive oil\nSalt and pepper",
                    instructions: "1. Preheat oven to 375°F\n2. Beat eggs with salt and pepper\n3. Heat oil in oven-safe pan\n4. Add pasta and vegetables, heat through\n5. Pour eggs over pasta mixture\n6. Sprinkle with cheese\n7. Cook on stove 3-4 minutes\n8. Transfer to oven for 10-12 minutes until set",
                    tips: "Any pasta shape works! Great way to use up small amounts of different vegetables.",
                    author: "Lisa Thompson",
                    upvotes: 22,
                    dateAdded: new Date('2024-02-05').toISOString()
                }
            ];
            this.saveRecipes();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Recipe form submission
        const recipeForm = document.getElementById('recipe-form');
        if (recipeForm) {
            recipeForm.addEventListener('submit', (e) => this.handleRecipeSubmission(e));
        }

        // Search functionality
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterRecipes());
        }

        // Filter functionality
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterRecipes());
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.filterRecipes());
        }
    }

    // Handle recipe form submission
    handleRecipeSubmission(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const formData = new FormData(e.target);
            const recipe = {
                id: Date.now(),
                title: formData.get('title'),
                category: formData.get('category'),
                prepTime: parseInt(formData.get('prepTime')),
                leftoverIngredients: formData.get('leftoverIngredients'),
                additionalIngredients: formData.get('additionalIngredients') || '',
                instructions: formData.get('instructions'),
                tips: formData.get('tips') || '',
                author: formData.get('author'),
                upvotes: 0,
                dateAdded: new Date().toISOString()
            };

            this.recipes.unshift(recipe); // Add to beginning for newest first
            this.saveRecipes();
            this.showSuccessMessage();

            // Update recipe displays immediately
            this.displayRecipes();
            this.displayFeaturedRecipes();
        }
    }

    // Validate form inputs
    validateForm() {
        const requiredFields = [
            { id: 'recipe-title', name: 'Recipe title' },
            { id: 'recipe-category', name: 'Category' },
            { id: 'prep-time', name: 'Prep time' },
            { id: 'leftover-ingredients', name: 'Leftover ingredients' },
            { id: 'recipe-instructions', name: 'Instructions' },
            { id: 'author-name', name: 'Author name' }
        ];

        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(field.id.replace('-', '-') + '-error');
            
            if (!input.value.trim()) {
                if (errorElement) {
                    errorElement.textContent = `${field.name} is required`;
                    errorElement.style.display = 'block';
                }
                isValid = false;
            }
        });

        // Validate prep time
        const prepTime = document.getElementById('prep-time');
        if (prepTime.value && (prepTime.value < 1 || prepTime.value > 300)) {
            const errorElement = document.getElementById('prep-time-error');
            if (errorElement) {
                errorElement.textContent = 'Prep time must be between 1 and 300 minutes';
                errorElement.style.display = 'block';
            }
            isValid = false;
        }

        return isValid;
    }

    // Show success message after recipe submission
    showSuccessMessage() {
        const form = document.getElementById('recipe-form');
        const successMessage = document.getElementById('success-message');

        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Display recipes on recipes page
    displayRecipes() {
        const recipesContainer = document.getElementById('all-recipes');
        if (!recipesContainer) return;

        this.renderRecipes(this.recipes, recipesContainer);
        this.updateRecipeCount(this.recipes.length);
    }

    // Display featured recipes on home page
    displayFeaturedRecipes() {
        const featuredContainer = document.getElementById('featured-recipes');
        if (!featuredContainer) return;

        // Get top 3 most upvoted recipes
        const featured = [...this.recipes]
            .sort((a, b) => b.upvotes - a.upvotes)
            .slice(0, 3);

        this.renderRecipes(featured, featuredContainer);
    }

    // Render recipes to container
    renderRecipes(recipes, container) {
        if (recipes.length === 0) {
            const noRecipes = document.getElementById('no-recipes');
            if (noRecipes) {
                noRecipes.style.display = 'block';
            }
            container.innerHTML = '';
            return;
        }

        const noRecipes = document.getElementById('no-recipes');
        if (noRecipes) {
            noRecipes.style.display = 'none';
        }

        container.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');

        // Add upvote event listeners
        container.querySelectorAll('.upvote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipeId = parseInt(e.target.closest('.upvote-btn').dataset.recipeId);
                this.toggleUpvote(recipeId);
            });
        });

        // Add delete event listeners
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipeId = parseInt(e.target.closest('.delete-btn').dataset.recipeId);
                this.deleteRecipe(recipeId);
            });
        });

        // Add expand/collapse event listeners for recipe details
        container.querySelectorAll('.recipe-card').forEach(card => {
            const expandBtn = card.querySelector('.expand-btn');
            const recipeDetails = card.querySelector('.recipe-details');

            if (expandBtn && recipeDetails) {
                expandBtn.addEventListener('click', () => {
                    const isExpanded = recipeDetails.style.display === 'block';
                    recipeDetails.style.display = isExpanded ? 'none' : 'block';
                    expandBtn.innerHTML = isExpanded ?
                        '<i class="fas fa-chevron-down"></i> View Recipe' :
                        '<i class="fas fa-chevron-up"></i> Hide Recipe';
                });
            }
        });
    }

    // Create recipe card HTML
    createRecipeCard(recipe) {
        const isUpvoted = this.isRecipeUpvoted(recipe.id);
        const leftoverIngredients = recipe.leftoverIngredients.split('\n').slice(0, 2).join(', ');
        const additionalIngredients = recipe.additionalIngredients ?
            recipe.additionalIngredients.split('\n').slice(0, 3).join(', ') : 'None';
        const instructions = recipe.instructions.split('\n').slice(0, 3).join('\n');

        return `
            <div class="recipe-card">
                <div class="recipe-header">
                    <div class="recipe-title-section">
                        <h3 class="recipe-title">${recipe.title}</h3>
                        <button class="delete-btn" data-recipe-id="${recipe.id}" title="Delete Recipe">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.prepTime} min</span>
                        <span><i class="fas fa-tag"></i> ${recipe.category}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(recipe.dateAdded).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="recipe-content">
                    <div class="recipe-preview">
                        <div class="recipe-ingredients">
                            <h4><i class="fas fa-recycle"></i> Uses leftovers:</h4>
                            <p>${leftoverIngredients}${recipe.leftoverIngredients.split('\n').length > 2 ? '...' : ''}</p>
                        </div>
                    </div>
                    <div class="recipe-details" style="display: none;">
                        <div class="ingredients-section">
                            <h4><i class="fas fa-recycle"></i> Leftover Ingredients:</h4>
                            <ul class="ingredients-list">
                                ${recipe.leftoverIngredients.split('\n').map(ing => `<li>${ing.trim()}</li>`).join('')}
                            </ul>
                        </div>
                        ${recipe.additionalIngredients ? `
                        <div class="ingredients-section">
                            <h4><i class="fas fa-shopping-cart"></i> Additional Ingredients:</h4>
                            <ul class="ingredients-list">
                                ${recipe.additionalIngredients.split('\n').map(ing => `<li>${ing.trim()}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        <div class="instructions-section">
                            <h4><i class="fas fa-list-ol"></i> Instructions:</h4>
                            <ol class="instructions-list">
                                ${recipe.instructions.split('\n').map(step => `<li>${step.trim()}</li>`).join('')}
                            </ol>
                        </div>
                        ${recipe.tips ? `
                        <div class="tips-section">
                            <h4><i class="fas fa-lightbulb"></i> Tips:</h4>
                            <p class="recipe-tips">${recipe.tips}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="recipe-footer">
                    <div class="recipe-author">
                        <i class="fas fa-user"></i> by ${recipe.author}
                    </div>
                    <div class="recipe-actions">
                        <button class="expand-btn">
                            <i class="fas fa-chevron-down"></i> View Recipe
                        </button>
                        <button class="upvote-btn ${isUpvoted ? 'upvoted' : ''}" data-recipe-id="${recipe.id}">
                            <i class="fas fa-heart"></i> ${recipe.upvotes}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Filter recipes based on search and filters
    filterRecipes() {
        const searchTerm = document.getElementById('recipe-search')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('category-filter')?.value || '';
        const sortFilter = document.getElementById('sort-filter')?.value || 'newest';

        let filtered = this.recipes.filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) ||
                                recipe.leftoverIngredients.toLowerCase().includes(searchTerm) ||
                                recipe.additionalIngredients.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !categoryFilter || recipe.category === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });

        // Sort recipes
        switch (sortFilter) {
            case 'popular':
                filtered.sort((a, b) => b.upvotes - a.upvotes);
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
        }

        const recipesContainer = document.getElementById('all-recipes');
        if (recipesContainer) {
            this.renderRecipes(filtered, recipesContainer);
            this.updateRecipeCount(filtered.length);
        }
    }

    // Update recipe count display
    updateRecipeCount(count) {
        const countElement = document.getElementById('recipe-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    // Toggle upvote for a recipe
    toggleUpvote(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const upvotedRecipes = this.getUpvotedRecipes();
        const isUpvoted = upvotedRecipes.includes(recipeId);

        if (isUpvoted) {
            recipe.upvotes = Math.max(0, recipe.upvotes - 1);
            this.removeUpvote(recipeId);
        } else {
            recipe.upvotes += 1;
            this.addUpvote(recipeId);
        }

        this.saveRecipes();
        this.displayRecipes();
        this.displayFeaturedRecipes();
    }

    // Check if recipe is upvoted by user
    isRecipeUpvoted(recipeId) {
        const upvotedRecipes = this.getUpvotedRecipes();
        return upvotedRecipes.includes(recipeId);
    }

    // Get user's upvoted recipes
    getUpvotedRecipes() {
        const stored = localStorage.getItem('yummyTummyUpvotes');
        return stored ? JSON.parse(stored) : [];
    }

    // Add upvote
    addUpvote(recipeId) {
        const upvoted = this.getUpvotedRecipes();
        if (!upvoted.includes(recipeId)) {
            upvoted.push(recipeId);
            localStorage.setItem('yummyTummyUpvotes', JSON.stringify(upvoted));
        }
    }

    // Remove upvote
    removeUpvote(recipeId) {
        const upvoted = this.getUpvotedRecipes();
        const filtered = upvoted.filter(id => id !== recipeId);
        localStorage.setItem('yummyTummyUpvotes', JSON.stringify(filtered));
    }

    // Delete recipe
    deleteRecipe(recipeId) {
        if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
            // Remove recipe from array
            this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);

            // Remove from upvoted recipes if it was upvoted
            this.removeUpvote(recipeId);

            // Save changes
            this.saveRecipes();

            // Update displays
            this.displayRecipes();
            this.displayFeaturedRecipes();

            // Show success message
            this.showDeleteMessage();
        }
    }

    // Show delete success message
    showDeleteMessage() {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'delete-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Recipe deleted successfully!</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global functions for form actions
function resetForm() {
    const form = document.getElementById('recipe-form');
    if (form) {
        form.reset();
        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    }
}

function addAnotherRecipe() {
    const form = document.getElementById('recipe-form');
    const successMessage = document.getElementById('success-message');
    
    if (form && successMessage) {
        form.style.display = 'flex';
        successMessage.style.display = 'none';
        form.reset();
        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipeManager();
});
