// ============================================
// DESTINIQUE.IO SERVER - server.js
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://api.stripe.com"]
    }
  }
}));

app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://destinique.io',
    'https://dev.destinique.io',
    'https://www.destinique.io'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// STATIC FILES
// ============================================
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true
}));

// ============================================
// DATABASE CONNECTION
// ============================================
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// STRIPE SETUP
// ============================================
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ============================================
// CALCULATION LIBRARIES
// ============================================
const VitalityEngine = require('./src/lib/vitalityEngine');
const CompatibilityCalculator = require('./src/lib/compatibilityCalculator');
const CelestialCalculator = require('./src/lib/celestialCalculator');

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// ============================================
// API ROUTES
// ============================================

// 1. AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    });
    
    if (error) throw error;
    
    // Create user profile
    await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name
      });
    
    res.json({ 
      success: true, 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. USER PROFILE ROUTES
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, user: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. VITALITY ASSESSMENT
app.post('/api/vitality/assess', authenticateToken, async (req, res) => {
  try {
    const answers = req.body.answers;
    
    // Calculate vitality score
    const vitalityResult = VitalityEngine.calculateScore(answers);
    
    // Save to database
    const { data, error } = await supabase
      .from('energy_profiles')
      .upsert({
        user_id: req.user.id,
        ...answers,
        vitality_score: vitalityResult.score,
        vitality_type: vitalityResult.type,
        calculated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update user's vitality type
    await supabase
      .from('users')
      .update({ vitality_type: vitalityResult.type })
      .eq('id', req.user.id);
    
    res.json({ 
      success: true, 
      result: vitalityResult,
      profile: data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. MATCHING ENGINE
app.get('/api/matches/daily', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's vitality profile
    const { data: userProfile, error: profileError } = await supabase
      .from('energy_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Find potential matches
    const { data: potentialMatches, error: matchesError } = await supabase
      .from('energy_profiles')
      .select(`
        *,
        user:users(*)
      `)
      .neq('user_id', userId)
      .limit(20);
    
    if (matchesError) throw matchesError;
    
    // Calculate compatibility for each
    const matches = await Promise.all(
      potentialMatches.map(async (match) => {
        const compatibility = CompatibilityCalculator.calculate(
          userProfile,
          match
        );
        
        // Calculate celestial compatibility
        const userBirth = await getUserBirthDate(userId);
        const matchBirth = await getUserBirthDate(match.user_id);
        
        const celestial = CelestialCalculator.compatibility(
          userBirth,
          matchBirth
        );
        
        const overallScore = Math.round(
          compatibility.score * 0.6 +
          celestial.score * 0.4
        );
        
        return {
          userId: match.user_id,
          name: match.user.full_name,
          vitalityType: match.vitality_type,
          scores: {
            vitality: compatibility.score,
            destiny: celestial.score,
            overall: overallScore
          },
          matchReasons: compatibility.reasons,
          zodiac: celestial.zodiacMatch,
          ...match.user
        };
      })
    );
    
    // Sort by overall score
    const sortedMatches = matches
      .filter(m => m.scores.overall > 60)
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, 10);
    
    res.json({ 
      success: true, 
      matches: sortedMatches 
    });
  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function
async function getUserBirthDate(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('birth_date, birth_time, birth_city')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

// 5. STRIPE CHECKOUT
app.post('/api/subscription/create-checkout', authenticateToken, async (req, res) => {
  try {
    const { priceId } = req.body;
    
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: req.user.email,
      metadata: { userId: req.user.id }
    });
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: req.user.id
      }
    });
    
    res.json({ 
      success: true, 
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. STRIPE WEBHOOK
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSubscriptionUpdate(session.customer, 'active');
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription.customer, subscription.status);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionUpdate(deletedSubscription.customer, 'canceled');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSubscriptionUpdate(stripeCustomerId, status) {
  try {
    // Get customer to find userId
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    const userId = customer.metadata.userId;
    
    if (!userId) return;
    
    let subscriptionEnds = null;
    if (status === 'active') {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1
      });
      
      if (subscriptions.data.length > 0) {
        subscriptionEnds = new Date(subscriptions.data[0].current_period_end * 1000);
      }
    }
    
    // Update subscription in database
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        status: status,
        current_period_end: subscriptionEnds
      });
    
    // Update user's subscription tier
    await supabase
      .from('users')
      .update({
        subscription_tier: status === 'active' ? 'premium' : 'free',
        subscription_ends_at: subscriptionEnds
      })
      .eq('id', userId);
    
  } catch (error) {
    console.error('Subscription update error:', error);
  }
}

// ============================================
// SERVE FRONTEND
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
  ============================================
   DESTINIQUE.IO SERVER
  ============================================
   Mode: ${process.env.NODE_ENV || 'development'}
   Port: ${PORT}
   URL: http://localhost:${PORT}
   Database: ${process.env.SUPABASE_URL ? 'Connected' : 'Disconnected'}
  ============================================
  `);
});
