// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the target screen
    document.getElementById(screenId).classList.add('active');
    
    // Update recent reviews if going to home screen
    if (screenId === 'home-screen') {
        updateRecentReviews();
    }
}

// File handling
let uploadedFiles = {
    submittal: null,
    spec: null
};

// Initialize drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    initializeFileInputs();
});

function initializeDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('drop', handleDrop);
        area.addEventListener('dragenter', handleDragEnter);
        area.addEventListener('dragleave', handleDragLeave);
    });
}

function initializeFileInputs() {
    const submittalInput = document.getElementById('submittal-file');
    const specInput = document.getElementById('spec-file');
    
    submittalInput.addEventListener('change', (e) => handleFileSelect(e, 'submittal'));
    specInput.addEventListener('change', (e) => handleFileSelect(e, 'spec'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const area = e.currentTarget;
    area.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const fileType = area.id === 'submittal-upload' ? 'submittal' : 'spec';
        processFile(file, fileType);
    }
}

function handleFileSelect(e, fileType) {
    const file = e.target.files[0];
    if (file) {
        processFile(file, fileType);
    }
}

function processFile(file, fileType) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        return;
    }
    
    // Validate file size (200MB limit)
    const maxSize = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 200MB.');
        return;
    }
    
    // Store file
    uploadedFiles[fileType] = file;
    
    // Update UI
    displayFileInfo(file, fileType);
    
    // Update button state
    updateGetReportButton();
}

function displayFileInfo(file, fileType) {
    const fileInfo = document.getElementById(`${fileType}-file-info`);
    const filename = fileInfo.querySelector('.filename');
    
    filename.textContent = file.name;
    fileInfo.style.display = 'flex';
}

function removeFile(fileType) {
    uploadedFiles[fileType] = null;
    
    const fileInfo = document.getElementById(`${fileType}-file-info`);
    fileInfo.style.display = 'none';
    
    // Clear file input
    const fileInput = document.getElementById(`${fileType}-file`);
    fileInput.value = '';
    
    // Update button state
    updateGetReportButton();
}

function updateGetReportButton() {
    const button = document.querySelector('.get-report-button');
    const hasBothFiles = uploadedFiles.submittal && uploadedFiles.spec;
    
    button.disabled = !hasBothFiles;
}

function generateReport() {
    if (!uploadedFiles.submittal || !uploadedFiles.spec) {
        alert('Please upload both a submittal and a spec file.');
        return;
    }
    
    // Simulate report generation
    const loadingText = 'Generating Report...';
    const button = document.querySelector('.get-report-button');
    const originalText = button.innerHTML;
    
    button.innerHTML = loadingText;
    button.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        // Save to recent reviews
        saveToRecentReviews();
        
        // Show success message
        alert('Report generated successfully! This is a demo - no actual AI processing occurred.');
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Go back to home screen
        showScreen('home-screen');
        
        // Clear files
        uploadedFiles = { submittal: null, spec: null };
        document.querySelectorAll('.file-info').forEach(info => {
            info.style.display = 'none';
        });
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.value = '';
        });
        updateGetReportButton();
        
    }, 2000);
}

// Recent reviews management
function saveToRecentReviews() {
    const reviews = JSON.parse(sessionStorage.getItem('recentReviews') || '[]');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newReview = {
        name: `Review ${reviews.length + 1}`,
        timestamp: timestamp,
        date: new Date().toISOString()
    };
    
    // Add to beginning of array
    reviews.unshift(newReview);
    
    // Keep only last 10 reviews
    if (reviews.length > 10) {
        reviews.pop();
    }
    
    sessionStorage.setItem('recentReviews', JSON.stringify(reviews));
}

function updateRecentReviews() {
    const reviews = JSON.parse(sessionStorage.getItem('recentReviews') || '[]');
    const reviewItems = document.querySelector('.review-items');
    
    if (reviews.length === 0) {
        reviewItems.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No reviews yet</p>';
        return;
    }
    
    reviewItems.innerHTML = reviews.map(review => 
        `<button class="review-item">${review.name} ${review.timestamp}</button>`
    ).join('');
}

// Add click handlers for recent review items
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('review-item')) {
        // For demo purposes, just show an alert
        alert('This would open the review details. In a real app, this would load the saved review data.');
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Start with intro screen
    showScreen('intro-screen');
    
    // Load any existing recent reviews
    updateRecentReviews();
});
