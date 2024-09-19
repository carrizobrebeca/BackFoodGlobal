const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentIntent = async (req, res) => {
  const { amount } = req.body;

  // Convertir el monto de dólares a centavos
  const amountInCents = Math.round(amount * 100);

  try {
    if (amountInCents < 50) {
      return res.status(400).send({ error: 'El monto debe ser al menos $0.50 USD.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // El monto en centavos
      currency: 'usd',
      payment_method_types: ['card'], // Especifica el método de pago
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error); // Para registrar el error en la consola
    res.status(500).send({ error: error.message });
  }
};

module.exports = paymentIntent;
