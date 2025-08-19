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
    } else if (screenId === 'report-screen') {
        document.getElementById('report-content').textContent = reviewContent;
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
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
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

async function generateReport() {
    if (!uploadedFiles.submittal || !uploadedFiles.spec) {
        alert('Please upload both a submittal and a spec file.');
        return;
    }

    const button = document.querySelector('.get-report-button');
    const originalText = button.innerHTML;
    button.innerHTML = 'Generating Report...';
    button.disabled = true;

    try {
        const specText = await uploadedFiles.spec.text();
        const formData = new FormData();
        formData.append('spec_text', specText);
        formData.append('submittal', uploadedFiles.submittal);

        const response = await fetch('https://triplo-ebu1.onrender.com/generate_review', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to generate review');
        }

        const data = await response.json();
        saveToRecentReviews(data.review);
        showScreen('report-screen', data.review);
    } catch (error) {
        alert('Error generating report: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
        uploadedFiles = { submittal: null, spec: null };
        document.querySelectorAll('.file-info').forEach(info => info.style.display = 'none');
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
        updateGetReportButton();
    }
}

// Recent reviews management
function saveToRecentReviews(review) {
    const reviews = JSON.parse(sessionStorage.getItem('recentReviews') || '[]');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReview = {
        name: `Review ${reviews.length + 1}`,
        timestamp: timestamp,
        date: new Date().toISOString(),
        content: review
    };
    reviews.unshift(newReview);
    if (reviews.length > 10) reviews.pop();
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
        `<button class="review-item" data-review="${encodeURIComponent(review.content)}">${review.name} ${review.timestamp}</button>`
    ).join('');
}

// Add click handlers for recent review items
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('review-item')) {
        const reviewContent = decodeURIComponent(e.target.dataset.review);
        showScreen('report-screen', reviewContent);
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Start with intro screen
    showScreen('intro-screen');
    
    // Load any existing recent reviews
    updateRecentReviews();
});
