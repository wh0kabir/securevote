// ===== VOTING FUNCTIONALITY ===== //



// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const candidateCards = document.querySelectorAll('.candidate-card');
const confirmationModal = document.getElementById('confirmation-modal');
const receiptModal = document.getElementById('receipt-modal');
const confirmVoteBtn = document.getElementById('confirm-vote');
const cancelVoteBtn = document.getElementById('cancel-vote');

// State
let selectedCandidate = null;

// Wallet Connection
connectWalletBtn.addEventListener('click', async () => {
    try {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Update button
            connectWalletBtn.innerHTML = `<i class="fas fa-check-circle"></i> Connected`;
            connectWalletBtn.title = `Connected to: ${accounts[0]}`;
            connectWalletBtn.classList.add('connected');
            connectWalletBtn.style.background = 'linear-gradient(135deg, var(--purple), var(--red))';
            connectWalletBtn.onclick = null;
            
            // Enable voting
            candidateCards.forEach(card => {
                card.style.pointerEvents = 'auto';
                card.style.opacity = '1';
            });
            
            showNotification('Wallet connected successfully!', 'success');
        } else {
            showNotification('Install MetaMask!', 'error');
        }
    } catch (error) {
        showNotification('Connection failed', 'error');
    }
});

// Candidate Selection
candidateCards.forEach(card => {
    const selectBtn = card.querySelector('.select-btn');
    
    // Handle card click
    card.addEventListener('click', function(e) {
        // Only trigger if not clicking directly on the select button
        if (e.target === selectBtn) return;
        selectCandidate(this);
    });
    
    // Handle button click
    selectBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        selectCandidate(card);
    });
});

function selectCandidate(card) {
    // Check wallet connection
    if (!connectWalletBtn.classList.contains('connected')) {
        showNotification('Please connect your wallet first', 'error');
        return;
    }

    // Deselect all candidates
    candidateCards.forEach(c => {
        c.classList.remove('selected');
        c.querySelector('.select-btn').textContent = 'Select';
    });
    
    // Select clicked candidate
    card.classList.add('selected');
    card.querySelector('.select-btn').textContent = 'Selected ✓';
    
    // Store selected candidate
    selectedCandidate = {
        id: card.dataset.candidateId,
        name: card.querySelector('h3').textContent,
        color: card.querySelector('.candidate-avatar').style.background
    };
    
    // Update confirmation modal
    document.getElementById('confirm-candidate-name').textContent = selectedCandidate.name;
    document.querySelector('.selected-candidate .avatar-sm').style.background = selectedCandidate.color;
    
    // Show modal
    confirmationModal.style.display = 'flex';
}

// Vote Confirmation
confirmVoteBtn.addEventListener('click', async () => {
  try {
      // Show loading state
      confirmVoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      confirmVoteBtn.disabled = true;
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Hide confirmation modal
      confirmationModal.style.display = 'none';
      
      // Update receipt with selected candidate
      document.getElementById('receipt-candidate-name').textContent = selectedCandidate.name;
      document.getElementById('vote-timestamp').textContent = new Date().toUTCString();
      
      // Show receipt and trigger confetti
      receiptModal.style.display = 'flex';
      
      if (window.confetti) {
          confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00f0ff', '#6e00ff', '#ffffff']
          });
      }
      
      showNotification('Vote submitted successfully!', 'success');
  } catch (error) {
      showNotification('Vote failed', 'error');
  } finally {
      confirmVoteBtn.innerHTML = '<i class="fas fa-lock"></i> Cast Encrypted Vote';
      confirmVoteBtn.disabled = false;
  }
});

// Add close receipt button handler
document.getElementById('close-receipt').addEventListener('click', () => {
  receiptModal.style.display = 'none';
});

// Modal Controls
cancelVoteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === confirmationModal) confirmationModal.style.display = 'none';
    if (e.target === receiptModal) receiptModal.style.display = 'none';
});

// ===== ALL YOUR EXISTING FUNCTIONS (UNCHANGED) ===== //

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '16px 24px';
  notification.style.borderRadius = '12px';
  notification.style.backdropFilter = 'blur(10px)';
  notification.style.zIndex = '1000';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '12px';
  notification.style.fontFamily = 'Space Grotesk, sans-serif';
  notification.style.fontWeight = '500';
  notification.style.animation = 'fadeIn 0.3s ease';
  
  if (type === 'success') {
      notification.style.background = 'rgba(0, 200, 83, 0.2)';
      notification.style.border = '1px solid rgba(0, 200, 83, 0.3)';
      notification.innerHTML = `<i class="fas fa-check-circle" style="color: #00c853;"></i> ${message}`;
  } else {
      notification.style.background = 'rgba(255, 77, 109, 0.2)';
      notification.style.border = '1px solid rgba(255, 77, 109, 0.3)';
      notification.innerHTML = `<i class="fas fa-exclamation-circle" style="color: var(--red);"></i> ${message}`;
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
      header.classList.add('scrolled');
  } else {
      header.classList.remove('scrolled');
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Set active nav link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= (sectionTop - 200)) {
          current = section.getAttribute('id');
      }
  });
  
  navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
      }
  });
});

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.metric-value');
    const speed = 200;
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / speed;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target;
      }
    });
  }
  
  // Trigger on scroll
  window.addEventListener('scroll', () => {
    if (isElementInViewport(document.querySelector('.metrics'))) {
      animateCounters();
    }
  });

  function toggleTechDetails(button) {
    const card = button.closest('.tech-card');
    card.classList.toggle('active');
    
    const btnText = button.querySelector('.btn-text');
    btnText.textContent = card.classList.contains('active') ? 'Hide Tech' : 'Show Tech';
    
    // Animate progress bars
    const progressBars = card.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
      if (card.classList.contains('active')) {
        bar.style.width = bar.parentElement.getAttribute('data-width') || '85%';
      } else {
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = bar.parentElement.getAttribute('data-width') || '85%';
        }, 300);
      }
    });
  }

  function animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const targetWidth = bar.getAttribute('data-value') + '%';
      bar.style.width = targetWidth;
      
      // Add ripple effect on first load
      if (!bar.classList.contains('animated')) {
        bar.classList.add('animated');
        const ripple = document.createElement('div');
        ripple.className = 'progress-ripple';
        bar.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
      }
    });
  }
  
  // Call this when cards become visible
  animateProgressBars();

  // Animate counters and gauges when section is visible
function animateMetrics() {
    // Counter animation
    const counters = document.querySelectorAll('.metric-value[data-target]');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const step = target / (duration / 16); // 60fps
      
      let current = 0;
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    });
  
    // Gauge animation
    const gauges = document.querySelectorAll('.gauge-fill');
    gauges.forEach(gauge => {
      const percent = gauge.getAttribute('data-percent');
      gauge.style.width = `${percent}%`;
    });
  
    // Node animation (staggered)
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, i) => {
      setTimeout(() => {
        if (node.classList.contains('active')) {
          node.style.transform = 'scale(1.3)';
          setTimeout(() => node.style.transform = '', 300);
        }
      }, i * 200);
    });
  }
  
  // Trigger on scroll
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  
  window.addEventListener('scroll', () => {
    if (isInViewport(document.querySelector('.metrics'))) {
      animateMetrics();
      window.removeEventListener('scroll', this); // Run once
    }
  }, { passive: true });

  // Simulate live data updates
function simulateLiveData() {
    setInterval(() => {
      // Random vote count increase
      const votesElement = document.querySelector('.metric-value[data-target]');
      const currentVotes = parseInt(votesElement.textContent);
      votesElement.textContent = currentVotes + Math.floor(Math.random() * 5);
      
      // Update percentage
      document.querySelector('.metric-subtext').textContent = 
        `+${Math.floor(Math.random() * 5)}% last minute`;
      
      // Random node activity
      document.querySelectorAll('.node').forEach(node => {
        if (Math.random() > 0.7) node.classList.toggle('active');
      });
    }, 5000); // Update every 5 seconds
  }
  
  // Call after initial animation
  setTimeout(simulateLiveData, 2500);

  // Make nodes interactive
document.querySelectorAll('.node-group').forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      // Highlight connected paths
      const connections = document.querySelectorAll(`.connection:nth-child(${index + 1})`);
      connections.forEach(conn => {
        conn.style.stroke = 'var(--white)';
        conn.style.strokeWidth = '3px';
      });
    });
    
    node.addEventListener('mouseleave', () => {
      // Reset connections
      const connections = document.querySelectorAll('.connection');
      connections.forEach(conn => {
        conn.style.stroke = 'var(--blue)';
        conn.style.strokeWidth = '2px';
      });
    });
  });

// Initialize confetti
document.addEventListener('DOMContentLoaded', () => {
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  document.head.appendChild(confettiScript);
  
  // Disable voting until wallet is connected
  if (candidateCards.length) {
    candidateCards.forEach(card => {
      card.style.pointerEvents = 'none';
      card.style.opacity = '0.7';
    });
  }
});

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Candidate Selection
candidateCards.forEach(card => {
  const selectBtn = card.querySelector('.select-btn');
  
  // Handle card click
  card.addEventListener('click', function(e) {
    // Only trigger if not clicking directly on the select button
    if (e.target === selectBtn) return;
    selectCandidate(this);
  });
  
  // Handle button click
  selectBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    selectCandidate(card);
  });
});

function selectCandidate(card) {
  // Check wallet connection
  if (!connectWalletBtn.classList.contains('connected')) {
    showNotification('Please connect your wallet first', 'error');
    return;
  }

  // Deselect all candidates
  candidateCards.forEach(c => {
    c.classList.remove('selected');
    c.querySelector('.select-btn').textContent = 'Select';
  });
  
  // Select clicked candidate
  card.classList.add('selected');
  card.querySelector('.select-btn').textContent = 'Selected ✓';
  
  // Store selected candidate
  selectedCandidate = {
    id: card.dataset.candidateId,
    name: card.querySelector('h3').textContent,
    color: card.querySelector('.candidate-avatar').style.background
  };
  
  // Update confirmation modal
  document.getElementById('confirm-candidate-name').textContent = selectedCandidate.name;
  document.querySelector('.selected-candidate .avatar-sm').style.background = selectedCandidate.color;
  
  // Show modal
  confirmationModal.style.display = 'flex';
}

// Countdown Timer Functionality
function initializeCountdown() {
  // Set election end date (48 hours from now for demo purposes)
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 48);
  
  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown').textContent = "Voting Ended";
      return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('countdown').textContent = formatted;
  }
  
  // Update immediately and then every second
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

// Live Vote Counter Functionality
function initializeVoteCounter() {
  let votes = 1429;
  let vpm = 42; // votes per minute
  
  function updateVoteCounter() {
    // Random fluctuation to make it look organic
    const randomChange = Math.floor(Math.random() * 5) - 2; // -2 to +2
    vpm = Math.max(10, Math.min(80, vpm + randomChange)); // Keep between 10-80
    
    // Calculate votes to add (portion of vpm based on interval)
    const votesToAdd = Math.floor(vpm / (60 / 5)); // For 5 second interval
    votes += votesToAdd;
    
    // Update DOM
    document.getElementById('votes-cast').textContent = votes.toLocaleString();
    document.getElementById('votes-per-minute').textContent = `~${vpm}`;
    
    // Update results visualization if it exists
    if (document.querySelector('.result-bar')) {
      updateLiveResults();
    }
  }
  
  // Update every 5 seconds
  setInterval(updateVoteCounter, 5000);
}

// Initialize both when page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeCountdown();
  initializeVoteCounter();
  
  // Also update the confetti script initialization if needed
  const confettiScript = document.createElement('script');
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
  document.head.appendChild(confettiScript);
});

// Simulate blockchain transaction delays
confirmVoteBtn.addEventListener('click', async () => {
  console.log("[DEMO] Submitting vote to Ethereum...");
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate mining delay
  console.log("[DEMO] Transaction mined: 0x7f3a...c4d2");
  
  // Show receipt with realistic fake data
  document.getElementById('tx-hash').textContent = "0x7f3a" + Math.random().toString(16).substr(2, 60);
  receiptModal.style.display = 'flex';
});