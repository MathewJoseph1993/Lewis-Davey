class PresentationController {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlideIndex = 0;
        this.totalSlides = this.slides.length;
        
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        
        this.init();
    }
    
    init() {
        // Set total slides count
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Initialize first slide
        this.updateSlideDisplay();
        
        // Prevent default browser shortcuts that might interfere
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
                e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        });
    }
    
    nextSlide() {
        if (this.currentSlideIndex < this.totalSlides - 1) {
            this.currentSlideIndex++;
            this.updateSlideDisplay();
        }
    }
    
    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.updateSlideDisplay();
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlideIndex = index;
            this.updateSlideDisplay();
        }
    }
    
    updateSlideDisplay() {
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Add active class to current slide
        this.slides[this.currentSlideIndex].classList.add('active');
        
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlideIndex + 1;
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Trigger any slide-specific animations or effects
        this.handleSlideTransition();
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.currentSlideIndex === 0) {
            this.prevBtn.disabled = true;
        } else {
            this.prevBtn.disabled = false;
        }
        
        // Update next button
        if (this.currentSlideIndex === this.totalSlides - 1) {
            this.nextBtn.disabled = true;
        } else {
            this.nextBtn.disabled = false;
        }
    }
    
    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
            case 'PageDown':
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                this.previousSlide();
                break;
            case 'Home':
                this.goToSlide(0);
                break;
            case 'End':
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'Escape':
                // Optional: Add fullscreen toggle or exit functionality
                break;
        }
    }
    
    handleSlideTransition() {
        const currentSlide = this.slides[this.currentSlideIndex];
        const slideType = currentSlide.dataset.type;
        
        // Add any slide-specific behavior here
        switch(slideType) {
            case 'stat':
                this.animateStatNumbers();
                break;
            case 'matrix':
                this.animateMatrixCells();
                break;
            case 'comparison':
                this.highlightComparisonRows();
                break;
            default:
                break;
        }
    }
    
    animateStatNumbers() {
        const currentSlide = this.slides[this.currentSlideIndex];
        const statNumber = currentSlide.querySelector('.stat-number');
        
        if (statNumber) {
            // Add a subtle animation class
            statNumber.style.transform = 'scale(0.8)';
            statNumber.style.opacity = '0';
            
            setTimeout(() => {
                statNumber.style.transition = 'all 0.5s ease';
                statNumber.style.transform = 'scale(1)';
                statNumber.style.opacity = '1';
            }, 100);
        }
    }
    
    animateMatrixCells() {
        const currentSlide = this.slides[this.currentSlideIndex];
        const matrixCells = currentSlide.querySelectorAll('.market-cell');
        
        matrixCells.forEach((cell, index) => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                cell.style.transition = 'all 0.3s ease';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, index * 50);
        });
    }
    
    highlightComparisonRows() {
        const currentSlide = this.slides[this.currentSlideIndex];
        const highlightRow = currentSlide.querySelector('tr.highlight');
        
        if (highlightRow) {
            highlightRow.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                highlightRow.style.transition = 'all 0.3s ease';
                highlightRow.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // Method to get current slide info (useful for external integration)
    getCurrentSlideInfo() {
        return {
            index: this.currentSlideIndex,
            total: this.totalSlides,
            type: this.slides[this.currentSlideIndex].dataset.type,
            element: this.slides[this.currentSlideIndex]
        };
    }
    
    // Method for programmatic navigation (useful for external controls)
    navigateTo(direction) {
        switch(direction.toLowerCase()) {
            case 'next':
                this.nextSlide();
                break;
            case 'previous':
            case 'prev':
                this.previousSlide();
                break;
            case 'first':
                this.goToSlide(0);
                break;
            case 'last':
                this.goToSlide(this.totalSlides - 1);
                break;
        }
    }
}

// Utility functions for enhanced functionality
class PresentationUtils {
    static addFullscreenSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                PresentationUtils.toggleFullscreen();
            }
        });
    }
    
    static toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported or denied');
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    static addProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--color-primary);
            transition: width 0.3s ease;
            z-index: 1000;
        `;
        progressBar.id = 'progress-bar';
        document.body.appendChild(progressBar);
        
        return progressBar;
    }
    
    static updateProgress(current, total) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const percentage = ((current + 1) / total) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    static addSwipeSupport(presentation) {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0) {
                        presentation.nextSlide();
                    } else {
                        presentation.previousSlide();
                    }
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
}

// Enhanced presentation controller that includes progress tracking
class EnhancedPresentationController extends PresentationController {
    constructor() {
        super();
        this.progressBar = PresentationUtils.addProgressIndicator();
        this.updateProgress();
        
        // Add swipe support for mobile
        PresentationUtils.addSwipeSupport(this);
        
        // Add fullscreen support
        PresentationUtils.addFullscreenSupport();
    }
    
    updateSlideDisplay() {
        super.updateSlideDisplay();
        this.updateProgress();
    }
    
    updateProgress() {
        PresentationUtils.updateProgress(this.currentSlideIndex, this.totalSlides);
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the enhanced presentation controller
    window.presentation = new EnhancedPresentationController();
    
    // Optional: Add a loading state
    document.body.classList.add('presentation-loaded');
    
    // Optional: Log initialization for debugging
    console.log('Presentation initialized with', window.presentation.totalSlides, 'slides');
    
    // Optional: Add click-to-advance functionality (excluding navigation buttons)
    document.addEventListener('click', (e) => {
        // Check if click is not on navigation buttons or other interactive elements
        if (!e.target.closest('.navigation') && 
            !e.target.closest('.slide-counter') &&
            !e.target.closest('a') &&
            !e.target.closest('button')) {
            
            // Determine which half of the screen was clicked
            const clickX = e.clientX;
            const screenWidth = window.innerWidth;
            
            if (clickX > screenWidth / 2) {
                window.presentation.nextSlide();
            } else {
                window.presentation.previousSlide();
            }
        }
    });
    
    // Prevent context menu on right click to avoid interrupting presentation
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Add window resize handler to ensure proper display
    window.addEventListener('resize', () => {
        // Force a redraw to ensure proper positioning
        const currentSlide = document.querySelector('.slide.active');
        if (currentSlide) {
            currentSlide.style.transform = 'translateX(0)';
        }
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PresentationController, PresentationUtils, EnhancedPresentationController };
}