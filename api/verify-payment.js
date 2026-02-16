/**
 * WOMATE Payment Verification - Vercel Serverless Function
 * 
 * FILE LOCATION: /api/verify-payment.js
 * 
 * VERCEL SETUP:
 * 1. This file goes in: /api/verify-payment.js
 * 2. Add environment variable in Vercel dashboard:
 *    PAYSTACK_SECRET_KEY = sk_live_your_secret_key
 * 3. Deploy via GitHub
 * 4. Endpoint: https://womate.org/api/verify-payment
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change to your domain in production
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            verified: false,
            error: 'Method not allowed' 
        });
    }

    try {
        const { reference, expected_amount, email, session_id } = req.body;

        // Validate input
        if (!reference || !expected_amount) {
            return res.status(400).json({
                verified: false,
                error: 'Missing required fields: reference and expected_amount'
            });
        }

        // Get Paystack secret key from environment variable
        const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

        if (!PAYSTACK_SECRET_KEY) {
            console.error('❌ PAYSTACK_SECRET_KEY not configured');
            return res.status(500).json({
                verified: false,
                error: 'Server configuration error - Please contact support'
            });
        }

        console.log(`🔍 Verifying payment: ${reference} for ${email}`);

        // Call Paystack API to verify transaction
        const paystackResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const paystackData = await paystackResponse.json();

        // Check if Paystack API call was successful
        if (!paystackResponse.ok || !paystackData.status) {
            console.error(`❌ Paystack verification failed: ${paystackData.message}`);
            return res.status(400).json({
                verified: false,
                error: 'Invalid payment reference',
                message: paystackData.message || 'Transaction not found'
            });
        }

        // Extract transaction data
        const transaction = paystackData.data;
        const paidAmount = transaction.amount; // In kobo/pesewas
        const status = transaction.status;
        const paidEmail = transaction.customer.email;
        const channel = transaction.channel;
        const paidAt = transaction.paid_at;
        const currency = transaction.currency;

        // Verification checks
        let isVerified = true;
        const verificationErrors = [];

        // 1. Check payment status
        if (status !== 'success') {
            isVerified = false;
            verificationErrors.push(`Payment status is '${status}', not 'success'`);
        }

        // 2. Check amount matches exactly
        if (paidAmount !== parseInt(expected_amount)) {
            isVerified = false;
            verificationErrors.push(
                `Amount mismatch: Expected GHS ${expected_amount/100}, got GHS ${paidAmount/100}`
            );
        }

        // 3. Check email (if provided)
        if (email && paidEmail.toLowerCase() !== email.toLowerCase()) {
            isVerified = false;
            verificationErrors.push('Email mismatch');
        }

        // 4. Check payment is recent (within 24 hours)
        const paymentTime = new Date(paidAt).getTime();
        const currentTime = Date.now();
        const hoursSincePayment = (currentTime - paymentTime) / (1000 * 60 * 60);

        if (hoursSincePayment > 24) {
            isVerified = false;
            verificationErrors.push('Payment is too old (more than 24 hours)');
        }

        // 5. Check currency is GHS
        if (currency !== 'GHS') {
            isVerified = false;
            verificationErrors.push(`Invalid currency: ${currency} (expected GHS)`);
        }

        // Log verification result
        if (isVerified) {
            console.log(`✅ Verification SUCCESS: ${reference} - ${paidEmail} - GHS ${paidAmount/100}`);
        } else {
            console.log(`❌ Verification FAILED: ${reference}`);
            console.log(`   Errors: ${verificationErrors.join(', ')}`);
        }

        // Prepare response
        const responseData = {
            verified: isVerified,
            amount: paidAmount,
            amount_ghc: paidAmount / 100,
            status: status,
            email: paidEmail,
            reference: reference,
            channel: channel,
            paid_at: paidAt,
            currency: currency,
            timestamp: new Date().toISOString()
        };

        if (!isVerified) {
            responseData.errors = verificationErrors;
        }

        // Return response with appropriate status code
        return res.status(isVerified ? 200 : 400).json(responseData);

    } catch (error) {
        console.error('❌ Verification error:', error.message);
        
        return res.status(500).json({
            verified: false,
            error: 'Payment verification failed',
            message: 'An unexpected error occurred. Please try again or contact support.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}